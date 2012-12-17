define(["kick/math", "kick/core/Constants", "kick/core/Util", "kick/mesh/MeshData", "kick/mesh/Mesh", "kick/scene/MeshRenderer", "kick/material/Material"],
    function (math, Constants, Util, MeshData, Mesh, MeshRenderer, Material) {
        "use strict";

        /**
         * @module kick.importer
         */

        var quat4 = math.Quat4,
            mat4 = math.Mat4,
            getXMLElementById = function (doc, id) {
                return doc.querySelector("[id=" + id + "]");
            },

            /**
             * Imports a Collada meshes into a scene
             * @class ColladaImporter
             * @namespace kick.importer
             */
                ColladaImporter = {};

        /**
         * @method import
         * @param {XMLDom|String} colladaDOM
         * @param {kick.core.Engine} engine
         * @param {kick.scene.Scene} scene Optional. If not specified the active scene (from the engine) is used
         * @param {boolean} rotate90x rotate -90 degrees around x axis
         * @return {Object} returns container object with the properties(mesh:[], gameObjects:[], materials:[])
         * @static
         */
        ColladaImporter.import = function (colladaDOM, engine, scene, rotate90x) {

            if (typeof colladaDOM === 'string') {
                var parser = new window.DOMParser();
                colladaDOM = parser.parseFromString(colladaDOM, "text/xml");
            }
            var dataCache = {},
                allMeshes = [],
                allMaterials = [],
                constants = Constants,
                /**
                 * Converts a string to an array
                 * @method stringToArray
                 * @param {String} numberString
                 * @param {Object} type Optional - valid types are Array (default), and typed arrays classes
                 * @private
                 */
                    stringToArray = function (numberString, type) {
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
                /**
                 * Get data element by id<br>
                 * Note that the array is cached by id - this is done
                 * to speed up performance in case of interleaved data
                 * @method getArrayElementById
                 * @param {String} id
                 * @return {Array_Number} data
                 * @private
                 */
                    getArrayElementById = function (id) {
                    if (id.charAt(0) === '#') {
                        id = id.substring(1);
                    }
                    if (dataCache[id]) {
                        return dataCache[id];
                    }
                    var arrayElement = getXMLElementById(colladaDOM, id),
                        type,
                        res;
                    if (arrayElement.tagName === "float_array") {
                        type = Float32Array;
                    } else {
                        type = Int32Array;
                    }
                    res = stringToArray(arrayElement.textContent, type);
                    dataCache[id] = res;
                    return res;
                },
                /**
                 * Create accessor object for data
                 * @method BuildDataAccessor
                 * @param {XML} elementChild
                 * @return function of type function(index,paramOffset)
                 * @private
                 */
                    BuildDataAccessor = function (elementChild) {
                    var semantic = elementChild.getAttribute('semantic'),
                        source = getXMLElementById(colladaDOM, elementChild.getAttribute("source").substring(1)),
                        technique_common,
                        accessor,
                        count,
                        stride,
                        offset,
                        arraySource,
                        rawData;
                    if (source.tagName === "vertices") {
                        source = source.getElementsByTagName("input")[0];
                        source = getXMLElementById(colladaDOM, source.getAttribute("source").substring(1));
                    }
                    technique_common = source.getElementsByTagName("technique_common")[0];
                    accessor = technique_common.getElementsByTagName("accessor")[0];
                    count = Number(accessor.getAttribute("count"));
                    stride = Number(accessor.getAttribute("stride"));
                    offset = Number(accessor.getAttribute("offset"));
                    if (!offset) {
                        offset = 0;
                    }
                    arraySource = accessor.getAttribute("source");
                    rawData = getArrayElementById(arraySource);

                    //
                    // param {Number} index (vertex index)
                    // param {Number} paramOffset (0 means x, 1 means y, etc)
                    // return {Number}
                    return function (index, paramOffset) {
                        var arrayIndex = offset + stride * index + paramOffset;
                        return rawData[arrayIndex];
                    };
                },
                /**
                 * @method buildFromPolyList
                 * @private
                 * @param {XMLDomElement} polylist
                 * @param {kick.mesh.MeshData} destMeshData
                 */
                    buildFromPolyList = function (polylist, destMeshData, vertexAttributeCache) {
                    var polylistChild = polylist.firstChild,
                        tagName,
                        i,
                        j,
                        vertexCount = function () { return 3; },
                        count = Number(polylist.getAttribute("count")),
                        dataAccessor = {names: [], offset: {}, accessors: {}, length: {}},
                        offsetSet = [],
                        contains = Util.contains,
                        numberOfVertices = vertexAttributeCache.numberOfVertices || 0,
                        semantic,
                        offset,
                        vCount,
                        offsetCount,
                        vertexIndices,
                        outVertexAttributes,
                        addVertexAttributes;

                    while (polylistChild !== null) {
                        tagName = polylistChild.tagName;
                        if (tagName === "input") {
                            semantic = polylistChild.getAttribute('semantic');
                            offset = Number(polylistChild.getAttribute('offset'));
                            dataAccessor.accessors[semantic] = new BuildDataAccessor(polylistChild);
                            dataAccessor.names.push(semantic);
                            dataAccessor.offset[semantic] = offset;
                            dataAccessor.length[semantic] = semantic === "TEXCOORD" ? 2 : 3;
                            if (!contains(offsetSet, offset)) {
                                offsetSet.push(offset);
                            }
                        } else if (tagName === "vcount") {
                            vCount = stringToArray(polylistChild.textContent, Int32Array);
                            vertexCount = function (i) {
                                return vCount[i];
                            };
                        } else if (tagName === "p") {
                            offsetCount = offsetSet.length;

                            vertexIndices = stringToArray(polylistChild.textContent, Int32Array);

                            // initialize data container
                            outVertexAttributes = {};
                            for (i = 0; i < dataAccessor.names.length; i++) {
                                outVertexAttributes[dataAccessor.names[i]] = [];
                            }

                            /**
                             * This method adds vertex attributes to the result index and
                             * @method addVertexAttributes
                             * @param {Number} index Source index in vertex array (the p element)
                             * @param {Object} outVertexAttributes Destination vertex index array
                             * @param {Array_Number} outTriangleIndices Destination vertex index array
                             * @private
                             */
                            addVertexAttributes = function (index, outVertexAttributes, outTriangleIndices) {
                                var cacheKey = "",
                                    offset,
                                    vertexIndex,
                                    name,
                                    i,
                                    j,
                                    indexInVertexIndices = index * offsetCount,
                                    cacheLookupRes,
                                    foundInCache,
                                    accessor,
                                    length,
                                    value,
                                    idx;
                                for (i = 0; i < dataAccessor.names.length; i++) {
                                    name = dataAccessor.names[i];
                                    offset = dataAccessor.offset[name];
                                    vertexIndex = vertexIndices[offset + indexInVertexIndices];
                                    cacheKey += index + "#" + vertexIndex + "#";
                                }
                                cacheLookupRes = vertexAttributeCache[cacheKey];
                                foundInCache = typeof cacheLookupRes === 'number';
                                if (foundInCache) {
                                    outTriangleIndices.push(cacheLookupRes);
                                } else {
                                    for (i = 0; i < dataAccessor.names.length; i++) {
                                        name = dataAccessor.names[i];
                                        accessor = dataAccessor.accessors[name];
                                        length = dataAccessor.length[name];
                                        offset = dataAccessor.offset[name];
                                        vertexIndex = vertexIndices[offset + indexInVertexIndices];
                                        for (j = 0; j < length; j++) {
                                            value = accessor(vertexIndex, j);
                                            outVertexAttributes[name].push(value);
                                        }
                                    }
                                    idx = numberOfVertices;
                                    numberOfVertices += 1;
                                    outTriangleIndices.push(idx);
                                    vertexAttributeCache[cacheKey] = idx;
                                }
                            };

                            // triangulate data
                            var index = 0,
                                triangleIndices = [];
                            for (i = 0; i < count; i++) {
                                var vertexCountI = vertexCount(i);
                                for (j = 0; j < 3; j++) {
                                    addVertexAttributes(index + j, outVertexAttributes, triangleIndices);
                                }
                                for (j = 3; j < vertexCountI; j++) {
                                    addVertexAttributes(index, outVertexAttributes, triangleIndices);
                                    addVertexAttributes(index + j - 1, outVertexAttributes, triangleIndices);
                                    addVertexAttributes(index + j, outVertexAttributes, triangleIndices);
                                }
                                index += vertexCountI;
                            }

                            for (i = 0; i < dataAccessor.names.length; i++) {
                                var name = dataAccessor.names[i],
                                    nameMeshData = name.toLowerCase();
                                if (nameMeshData === "texcoord") {
                                    nameMeshData = "uv1";
                                }
                                if (destMeshData[nameMeshData] && destMeshData[nameMeshData].length) {
                                    // array already exist - append data
                                    var toArray = Util.typedArrayToArray,
                                        source = toArray(destMeshData[nameMeshData]),
                                        append = toArray(outVertexAttributes[name]);
                                    source.push.apply(source, append); // short way to append one array to another
                                    destMeshData[nameMeshData] = source;
                                } else {
                                    destMeshData[nameMeshData] = outVertexAttributes[name];
                                }
                            }
                            destMeshData.meshType = constants.GL_TRIANGLES;
                            var subMeshes = destMeshData.subMeshes;
                            subMeshes.push(triangleIndices);
                            destMeshData.subMeshes = subMeshes;
                        }
                        polylistChild = polylistChild.nextSibling;
                    }

                    vertexAttributeCache.numberOfVertices = numberOfVertices;
                },
                /**
                 * Builds meshdata component (based on a &lt;mesh&gt; node)
                 * @method buildMeshData
                 */
                    buildMeshData = function (colladaDOM, engine, geometry) {
                    var tagName,
                        meshChild,
                        name = geometry.getAttribute('name') || "MeshData",
                        destMeshData,
                        mesh = geometry.getElementsByTagName("mesh");
                    if (mesh.length === 0) {
                        return null;
                    }
                    var vertexAttributeCache = {};
                    mesh = mesh[0];
                    meshChild = mesh.firstChild;
                    while (meshChild !== null) {
                        tagName = meshChild.tagName;
                        if (tagName === "lines") {
                            console.log("lines - unsupported");
                        } else if (tagName === "linestrips - unsupported") {
                            console.log("linestrips");
                        } else if (tagName === "polygons") {
                            console.log("polygons  - unsupported");
                        } else if (tagName === "polylist" || tagName === "triangles") {
                            if (!destMeshData) {
                                destMeshData = new MeshData({name: name});
                            }
                            buildFromPolyList(meshChild, destMeshData, vertexAttributeCache);
                        } else if (tagName === "trifans") {
                            console.log("trifans unsupported");
                        } else if (tagName === "tristrips") {
                            console.log("tristrips - unsupported");
                        }
                        meshChild = meshChild.nextSibling;
                    }
                    return destMeshData;
                },
                getMeshesById = function (engine, meshid) {
                    var meshArray = [],
                        k,
                        geometry;
                    if (meshCache[meshid]) {
                        return meshCache[meshid];
                    }
                    if (meshid && meshid.charAt(0) === "#") {
                        meshid = meshid.substring(1);
                    }
                    for (k = 0; k < geometries.length; k++) {
                        geometry = geometries[k];
                        if (geometry.getAttribute("id") === meshid) {
                            var meshData = buildMeshData(colladaDOM, engine, geometry);
                            if (meshData) {
                                var newMesh = new Mesh(engine, {meshData: meshData, name: meshData.name + " mesh"});
                                allMeshes.push(newMesh);
                                meshArray.push(newMesh);
                            }
                            break;
                        }
                    }
                    meshCache[meshid] = meshArray;
                    return meshArray;
                },
                updateTransform = function (transform, node) {
                    var tagName = node.tagName,
                        sid = node.getAttribute('sid'),
                        angleAxis,
                        angle,
                        rotationQuat,
                        matrix,
                        decomposedMatrix,
                        localMatrix = transform.getLocalMatrix(),
                        newMatrix = mat4.identity(mat4.create());
                    if (tagName === "translate") {
                        mat4.translate(newMatrix, stringToArray(node.textContent), newMatrix);
                    } else if (tagName === "rotate") {
                        angleAxis = stringToArray(node.textContent);
                        angle = angleAxis[3];
                        if (angle) {
                            rotationQuat = quat4.angleAxis(angle, angleAxis);
                            quat4.toMat4(rotationQuat, newMatrix);
                        } else {
                            return;
                        }
                    } else if (tagName === "scale") {
                        mat4.scale(newMatrix, stringToArray(node.textContent), newMatrix);
                    } else if (tagName === "matrix") {
                        mat4.transpose(stringToArray(node.textContent), newMatrix);
                    } else {
                        console.log(tagName + " - unsupported");
                        return;
                    }
                    mat4.multiply(localMatrix, newMatrix, newMatrix);
                    decomposedMatrix = mat4.decompose(newMatrix);
                    transform.localPosition = decomposedMatrix[0];
                    transform.localRotation = decomposedMatrix[1];
                    transform.localScale = decomposedMatrix[2];
                },
                createMeshRenderer = function (gameObject, node) {
                    var url = node.getAttribute("url"),
                        meshRenderer,
                        meshes,
                        i,
                        newMaterial;
                    if (url) {
                        url = url.substring(1);
                    }

                    meshes = getMeshesById(engine, url);
                    for (i = 0; i < meshes.length; i++) {
                        meshRenderer = new MeshRenderer();
                        meshRenderer.mesh = meshes[i];
                        newMaterial = new Material(engine, {
                            name: "Some material",
                            shader: engine.project.load(engine.project.ENGINE_SHADER_DEFAULT)
                        });
                        meshRenderer.material = newMaterial;
                        allMaterials.push(newMaterial);

                        gameObject.addComponent(meshRenderer);
                    }
                },
                addNode = function (node, parent) {
                    var gameObject = scene.createGameObject(),
                        transform = gameObject.transform,
                        childNode,
                        tagName;
                    if (parent) {
                        transform.parent = parent;
                    }
                    gameObject.name = node.getAttribute("id");
                    allGameObjects.push(gameObject);
                    childNode = node.firstElementChild;
                    while (childNode) {
                        tagName = childNode.tagName;
                        if (tagName === "translate" || tagName === "rotate" || tagName === "scale" || tagName === "matrix") {
                            updateTransform(transform, childNode);
                        } else if (tagName === "instance_geometry") {
                            createMeshRenderer(gameObject, childNode);
                            /*if (rotate90x){
                             var currentRotation = transform.localRotation;
                             var rotationAroundX = quat4.angleAxis(-90,[1,0,0]);
                             transform.localRotation = quat4.multiply(rotationAroundX,currentRotation);
                             }*/
                        } else if (tagName === "node") {
                            addNode(childNode, transform);
                        } else {
                            console.log("ignore collada tagName '" + tagName + "'");
                        }
                        childNode = childNode.nextElementSibling;
                    }
                };

            var libraryGeometries = colladaDOM.firstChild.getElementsByTagName("library_geometries"),
                visualScenes = colladaDOM.firstChild.getElementsByTagName("visual_scene"),
                geometries,
                i;

            if (!scene) {
                scene = engine.activeScene;
            }
            if (libraryGeometries.length === 0) {
                // no geometries found
            }

            libraryGeometries = libraryGeometries[0];
            geometries = libraryGeometries.getElementsByTagName("geometry");
            var allGameObjects = [],
                meshCache = {};

            for (i = 0; i < visualScenes.length; i++) {
                var visualScene = visualScenes[i],
                    node = visualScene.firstElementChild;
                while (node) {
                    addNode(node, null);
                    node = node.nextElementSibling;
                }
            }
            if (rotate90x) {
                // ideally it would be better to transform the geometry
                // instead of introducing a new parent
                var parent = scene.createGameObject({name: "Collada Parent"}),
                    parentTransform = parent.transform;
                parentTransform.localRotationEuler = [-90, 0, 0];
                for (i = 0; i < allGameObjects.length; i++) {
                    var goTransform = allGameObjects[i].transform;
                    if (!goTransform.parent) {
                        goTransform.parent = parentTransform;
                    }
                }
                allGameObjects.push(parent);
            }
            return {mesh: allMeshes, gameObjects: allGameObjects, materials: allMaterials};
        };

        return ColladaImporter;
    });