/*!
 * New BSD License
 *
 * Copyright (c) 2011, Morten Nobel-Joergensen, Kickstart Games ( http://www.kickstartgames.com/ )
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var KICK = KICK || {};
KICK.namespace = function (ns_string) {
    var parts = ns_string.split("."),
        parent = window,
        i;

    for (i = 0; i < parts.length; i += 1) {
        // create property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

(function () {
    "use strict"; // force strict ECMAScript 5

    var importer = KICK.namespace("KICK.importer"),
        math = KICK.namespace("KICK.math"),
        quat4 = math.quat4,
        mat4 = math.mat4;

     /**
     * Imports an obj mesh into a scene
     * @class ObjImporter
     * @namespace KICK.importer
     */
    importer.ObjImporter = {};

    /**
     * @method import
     * @param {String} objFileContent
     * @param {KICK.core.Engine} engine
     * @param {KICK.scene.Scene} scene Optional. If not specified the active scene (from the engine) is used
     * @param {boolean} rotate90x rotate -90 degrees around x axis
     * @return {Array[KICK.scene.GameObject]}
     * @static
     */
    importer.ObjImporter.import = function (objFileContent, engine, scene, rotate90x){
        var lines = objFileContent.split("\n"),
            linesLength = lines.length,
            vertices = [],
            normals = [],
            textureCoordinates = [],
            triangles = [],
            materialNames = [],
            submeshes = [triangles],
            objects = [],
            objectName = "MeshObject",
            trim = function (str){ return str.replace(/^\s+|\s+$/g, ""); },
            strAsArray = function(numberString, type){
                if (!type){
                    type = Array;
                }
                numberString = numberString.replace(/^\s+|\s+$/g,""); // trim
                numberString = numberString.replace(/\s{2,}/g, ' '); // remove double white spaces
                var numberArray = numberString.split(" ").map(Number);
                if (!type || type === Array){
                    return numberArray;
                } else {
                    // typed array
                    return new type(numberArray);
                }
            },
            getIndices = function(strArray){
                var array = [];
                for (var i=0;i<strArray.length;i++){
                    var str = strArray[i],
                        splittedStr = str.split("/"),
                        vertexIndex = parseInt(splittedStr[0]);
                    array.push([vertexIndex,
                        splittedStr.length>=2 ? parseInt(splittedStr[1]) : vertexIndex,
                        splittedStr.length>=3 ? parseInt(splittedStr[2]) : vertexIndex]);
                }

                return array;
            },
            addObject = function(){
                var pushVertexData = function(source, index, dest){
                    var sourceElement = source[index-1]; // note: obj is 1 indexed - therefor -1
                    for (var i=0;i<sourceElement.length;i++){
                        dest.push(sourceElement[i]);
                    }
                };
                if (vertices.length==0){
                    return;
                }
                var gameObject = scene.createGameObject(),
                    meshData = new KICK.mesh.MeshData(),
                    mesh = new KICK.mesh.Mesh(engine),
                    meshDataVertices = [],
                    meshDataNormals = [],
                    meshDataTextureCoordinates = [],
                    meshDataIndices,
                    meshDataSubmeshes = [],
                    cache = {},
                    count = 0;
                for (var k=0;k<submeshes.length;k++){
                    triangles = submeshes[k];
                    meshDataIndices = [];
                    meshDataSubmeshes.push(meshDataIndices);
                    for (var i=0;i<triangles.length;i++){
                        var vertexUvsNormalStrArray = triangles[i]; // has the value such as ["1//1", "2//2", "3//3"]
                        var idx = getIndices(vertexUvsNormalStrArray);
                        for (var j=0;j<3;j++){
                            var vertexUvsNormalStr = vertexUvsNormalStrArray[j]; // has the value such as "1//1"
                            if (typeof cache[vertexUvsNormalStr] === 'number'){ // if index is in the cache, reuse index
                                meshDataIndices.push(cache[vertexUvsNormalStr]);
                            } else {
                                pushVertexData(vertices,idx[j][0],meshDataVertices);
                                if (textureCoordinates.length){
                                    pushVertexData(textureCoordinates,idx[j][1],meshDataTextureCoordinates);
                                }
                                if (normals.length){
                                    pushVertexData(normals,idx[j][2],meshDataNormals);
                                }
                                meshDataIndices.push(count);
                                cache[vertexUvsNormalStr] = count;
                                count ++;
                            }
                        }
                    }
                }
                meshData.vertex = meshDataVertices;
                if (meshDataNormals.length){
                    meshData.normal = meshDataNormals;
                }
                if (meshDataTextureCoordinates.length){
                    meshData.uv1 = meshDataTextureCoordinates;
                }
                meshData.subMeshes = meshDataSubmeshes;
                mesh.meshData = meshData;
                mesh.name = objectName+" mesh";
                var meshRenderer = new KICK.scene.MeshRenderer();
                meshRenderer.mesh = mesh;

                var materials = [];

                var addDefaultMaterial = function(name){
                    materials.push(new KICK.material.Material(engine,{
                        name:name,
                        shader:engine.resourceManager.getShader("kickjs://shader/default/")
                    }));
                };

                for (var i=0;i < meshDataSubmeshes.length;i++){
                    if (i<materialNames.length){
                        var materialName = materialNames[i];
                        var projectMaterial = engine.project.loadByName(materialName,"KICK.material.Material");
                        if (projectMaterial){
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
                objects.push(gameObject);
                triangles = [];
            };
        for (var i=0;i<linesLength;i++){
            var line = trim(lines[i]);
            var tokenIndex = line.indexOf(' ');
            if (tokenIndex<0){
                continue;
            }
            var token = line.substring(0,tokenIndex);
            var value = line.substring(tokenIndex+1);
            if (token === "o"){
                addObject();
                objectName = value;
                materialNames.length = 0;
            } else if (token === "usemtl"){
                materialNames.push(value);
                // create material with name value is not exist
                if (triangles.length>0){
                    triangles = [];
                    submeshes[submeshes.length] = triangles;
                }
            } else if (token === "v"){
                vertices.push(strAsArray(value));
            } else if (token === "vn"){
                normals.push(strAsArray(value));
            } else if (token === "vt"){
                textureCoordinates.push(strAsArray(value));
            } else if (token === "f"){
                var polygon = value.split(" ");
                triangles.push(polygon.slice(0,3));
                for (var j=3;j<polygon.length;j++){
                    triangles.push([polygon[j-1],polygon[j],polygon[0]]);
                }
            }
        }
        addObject();
        return objects;
    };
})();