define(["kick/math", "kick/mesh/MeshData", "kick/mesh/Mesh", "kick/scene/MeshRenderer", "kick/material/Material", "kick/core/Constants", "kick/core/EngineSingleton"],
    function (math, MeshData, Mesh, MeshRenderer, Material, Constants, EngineSingleton) {
        "use strict";

        var ASSERT = Constants._ASSERT,
            quat = math.Quat,
            mat4 = math.Mat4,
            /**
             * Imports a Wavefront .obj mesh into a scene. The importer loading both normals and texture coordinates from the
             * model if available. Note that each import can contains multiple models and each model may have multiple
             * sub-meshes.
             * @class ObjImporter
             * @namespace kick.importer
             */
                ObjImporter = {};

        /**
         * @method import
         * @param {String} objFileContent
         * @param {kick.scene.Scene} scene=engine.activeScene Optional. If not specified the active scene (from the engine) is used
         * @param {boolean} rotate90x rotate -90 degrees around x axis
         * @return {Object} returns container object with the properties (mesh:[], gameObjects:[], materials:[])
         * @static
         */
        ObjImporter.import = function (objFileContent, scene, rotate90x) {
            if (ASSERT){
                if (scene === EngineSingleton.engine){
                    Util.fail("ObjImporter function changed - engine parameter is removed");
                }
            }
            var engine = EngineSingleton.engine,
                lines = objFileContent.split("\n"),
                linesLength = lines.length,
                vertices = [],
                normals = [],
                textureCoordinates = [],
                triangles = [],
                materialNames = [],
                submeshes = [triangles],
                allGameObjects = [],
                allMaterials = [],
                allMeshes = [],
                objectName = "MeshObject",
                i,
                j,
                trim = function (str) { return str.replace(/^\s+|\s+$/g, ""); },
                strAsArray = function (numberString, type) {
                    if (!type) {
                        type = Array;
                    }
                    numberString = numberString.replace(/^\s+|\s+$/g, ""); // trim
                    numberString = numberString.replace(/\s{2,}/g, ' '); // remove double white spaces
                    var numberArray = numberString.split(" ").map(Number);
                    if (!type || type === Array) {
                        return numberArray;
                    } else {
                        // typed array
                        return new type(numberArray);
                    }
                },
                getIndices = function (strArray) {
                    var array = [],
                        i,
                        str,
                        splittedStr,
                        vertexIndex;
                    for (i = 0; i < strArray.length; i++) {
                        str = strArray[i];
                        splittedStr = str.split("/");
                        vertexIndex = parseInt(splittedStr[0], 10);
                        array.push([vertexIndex,
                            splittedStr.length >= 2 ? parseInt(splittedStr[1], 10) : vertexIndex,
                            splittedStr.length >= 3 ? parseInt(splittedStr[2], 10) : vertexIndex]);
                    }

                    return array;
                },
                addObject = function () {
                    var pushVertexData = function (source, index, dest) {
                        var sourceElement = source[index - 1], // note: obj is 1 indexed - therefor -1
                            i;
                        for (i = 0; i < sourceElement.length; i++) {
                            dest.push(sourceElement[i]);
                        }
                    };
                    if (vertices.length === 0) {
                        return;
                    }
                    var gameObject = scene.createGameObject(),
                        meshData = new MeshData(),
                        mesh = new Mesh(),
                        meshDataVertices = [],
                        meshDataNormals = [],
                        meshDataTextureCoordinates = [],
                        meshDataIndices,
                        meshDataSubmeshes = [],
                        cache = {},
                        count = 0,
                        vertexUvsNormalStrArray,
                        idx,
                        vertexUvsNormalStr,
                        k,
                        i,
                        j;
                    allMeshes.push(mesh);
                    for (k = 0; k < submeshes.length; k++) {
                        triangles = submeshes[k];
                        meshDataIndices = [];
                        meshDataSubmeshes.push(meshDataIndices);
                        for (i = 0; i < triangles.length; i++) {
                            vertexUvsNormalStrArray = triangles[i]; // has the value such as ["1//1", "2//2", "3//3"]
                            idx = getIndices(vertexUvsNormalStrArray);
                            for (j = 0; j < 3; j++) {
                                vertexUvsNormalStr = vertexUvsNormalStrArray[j]; // has the value such as "1//1"
                                if (typeof cache[vertexUvsNormalStr] === 'number') { // if index is in the cache, reuse index
                                    meshDataIndices.push(cache[vertexUvsNormalStr]);
                                } else {
                                    pushVertexData(vertices, idx[j][0], meshDataVertices);
                                    if (textureCoordinates.length) {
                                        pushVertexData(textureCoordinates, idx[j][1], meshDataTextureCoordinates);
                                    }
                                    if (normals.length) {
                                        pushVertexData(normals, idx[j][2], meshDataNormals);
                                    }
                                    meshDataIndices.push(count);
                                    cache[vertexUvsNormalStr] = count;
                                    count++;
                                }
                            }
                        }
                    }

                    meshData.vertex = meshDataVertices;
                    if (meshDataNormals.length) {
                        meshData.normal = meshDataNormals;
                    }
                    if (meshDataTextureCoordinates.length) {
                        meshData.uv1 = meshDataTextureCoordinates;
                    }
                    meshData.subMeshes = meshDataSubmeshes;
                    mesh.meshData = meshData;
                    mesh.name = objectName + " mesh";
                    var meshRenderer = new MeshRenderer();
                    meshRenderer.mesh = mesh;

                    var materials = [];

                    var addDefaultMaterial = function (name) {
                        var newMaterial = new Material({
                            name: name,
                            shader: engine.project.load(engine.project.ENGINE_SHADER_DEFAULT)
                        });
                        materials.push(newMaterial);
                        allMaterials.push(newMaterial);
                    };

                    for (i = 0; i < meshDataSubmeshes.length; i++) {
                        if (i < materialNames.length) {
                            var materialName = materialNames[i];
                            var projectMaterial = engine.project.loadByName(materialName, "kick.material.Material");
                            if (projectMaterial) {
                                materials.push(projectMaterial);
                            } else {
                                addDefaultMaterial(materialName);
                            }
                        } else {
                            addDefaultMaterial("material");
                        }
                    }

                    meshRenderer.materials = materials;
                    gameObject.name = objectName;
                    gameObject.addComponent(meshRenderer);
                    allGameObjects.push(gameObject);
                    triangles = [];
                };

            var transformMatrix = mat4.identity(mat4.create());
            if (rotate90x) {
                mat4.rotateX(transformMatrix, -90 * Constants._DEGREE_TO_RADIAN);
            }

            for (i = 0;i < linesLength; i++) {
                var line = trim(lines[i]);
                var tokenIndex = line.indexOf(' ');
                if (tokenIndex < 0) {
                    continue;
                }
                var token = line.substring(0, tokenIndex);
                var value = line.substring(tokenIndex + 1);
                if (token === "o") {
                    addObject();
                    objectName = value;
                    materialNames.length = 0;
                } else if (token === "usemtl") {
                    materialNames.push(value);
                    // create material with name value is not exist
                    if (triangles.length > 0) {
                        triangles = [];
                        submeshes[submeshes.length] = triangles;
                    }
                } else if (token === "v") {
                    var vertex = strAsArray(value);
                    mat4.multiplyVec3(vertex, transformMatrix, vertex);
                    vertices.push(vertex);
                } else if (token === "vn") {
                    var normal = strAsArray(value);
                    mat4.multiplyVec3(normal, transformMatrix, normal);
                    normals.push(normal);
                } else if (token === "vt") {
                    textureCoordinates.push(strAsArray(value));
                } else if (token === "f") {
                    var polygon = value.split(" ");
                    triangles.push(polygon.slice(0, 3));
                    for (j = 3; j < polygon.length; j++) {
                        triangles.push([polygon[j - 1], polygon[j], polygon[0]]);
                    }
                }
            }
            addObject();

            return {mesh: allMeshes, gameObjects: allGameObjects, materials: allMaterials};
        };
        return ObjImporter;
    });