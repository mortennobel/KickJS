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
        mat4 = math.mat4,
        getXMLElementById = function(doc, id){
            return doc.querySelector("[id=" + id + "]");
        };

     /**
     * Imports a Collada meshes into a scene
     * @class ColladaImporter
     * @namespace KICK.importer
     */
    importer.ColladaImporter = {};

    /**
     * @method import
     * @param {XMLDom_or_String} colladaDOM
     * @param {KICK.core.Engine} engine
     * @param {KICK.scene.Scene} scene Optional. If not specified the active scene (from the engine) is used
     * @param {boolean} rotate90x rotate -90 degrees around x axis
     * @return {Object} returns container object with the properties(mesh:[], gameObjects:[], materials:[])
     * @static
     */
    importer.ColladaImporter.import = function (colladaDOM, engine, scene, rotate90x){
        if (typeof colladaDOM === 'string'){
            var parser=new DOMParser();
            colladaDOM = parser.parseFromString(colladaDOM,"text/xml");
        }
        var dataCache = {},
            allMeshes = [],
            allMaterials = [],
            constants = KICK.core.Constants,
            /**
             * Converts a string to an array
             * @method stringToArray
             * @param {String} numberString
             * @param {Object} type Optional - valid types are Array (default), and typed arrays classes
             * @private
             */
            stringToArray = function(numberString,type){
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
            /**
             * Get data element by id<br>
             * Note that the array is cached by id - this is done
             * to speed up performance in case of interleaved data
             * @method getArrayElementById
             * @param {String} id
             * @return {Array_Number} data
             * @private
             */
            getArrayElementById = function(id){
                if (id.charAt(0) === '#'){
                    id = id.substring(1);
                }
                if (dataCache[id]){
                    return dataCache[id];
                }
                var arrayElement = getXMLElementById(colladaDOM,id);
                var type;
                if (arrayElement.tagName === "float_array"){
                    type = Float32Array;
                } else {
                    type = Int32Array;
                }
                var res = stringToArray(arrayElement.textContent,type);
                dataCache[id] = res;
                return res;
            },
            /**
             * Create accessor object for data
             * @method buildDataAccessor
             * @param {XML} elementChild
             * @return function of type function(index,paramOffset)
             * @private
             */
            buildDataAccessor = function(elementChild){
                var semantic = elementChild.getAttribute('semantic');
                var source = getXMLElementById(colladaDOM,elementChild.getAttribute("source").substring(1));
                if (source.tagName === "vertices"){
                    source = source.getElementsByTagName("input")[0];
                    source = getXMLElementById(colladaDOM,source.getAttribute("source").substring(1));
                }
                var technique_common = source.getElementsByTagName("technique_common")[0];
                var accessor = technique_common.getElementsByTagName("accessor")[0];
                var count = Number(accessor.getAttribute("count"));
                var stride = Number(accessor.getAttribute("stride"));
                var offset = Number(accessor.getAttribute("offset"));
                if (!offset){
                    offset = 0;
                }
                var arraySource = accessor.getAttribute("source");
                var rawData = getArrayElementById(arraySource);

                /**
                 * @param {Number} index (vertex index)
                 * @param {Number} paramOffset (0 means x, 1 means y, etc)
                 * @return {Number}
                 */
                return function(index,paramOffset){
                    var arrayIndex = offset+stride*index+paramOffset;
                    return rawData[arrayIndex];
                };
            },
            /**
             * @method buildFromPolyList
             * @private
             * @param {XMLDomElement} polylist
             * @param {KICK.mesh.MeshData} destMeshData
             */
            buildFromPolyList = function(polylist, destMeshData, vertexAttributeCache){
                var polylistChild = polylist.firstChild,
                    tagName,
                    i,j,
                    vertexCount = function(){return 3;},
                    count = Number(polylist.getAttribute("count")),
                    dataAccessor = {names:[],offset:{},accessors:{},length:{}},
                    offsetSet = [],
                    contains = KICK.core.Util.contains;

                var numberOfVertices = vertexAttributeCache.numberOfVertices || 0;

                while (polylistChild !== null){
                    tagName = polylistChild.tagName;
                    if (tagName === "input"){
                        var semantic = polylistChild.getAttribute('semantic');
                        var offset = Number(polylistChild.getAttribute('offset'));
                        dataAccessor.accessors[semantic] = new buildDataAccessor(polylistChild);
                        dataAccessor.names.push(semantic);
                        dataAccessor.offset[semantic] = offset;
                        dataAccessor.length[semantic] = semantic === "TEXCOORD"?2:3;
                        if (!contains(offsetSet,offset)){
                            offsetSet.push(offset);
                        }
                    } else if (tagName === "vcount"){
                        var vCount = stringToArray(polylistChild.textContent,Int32Array);
                        vertexCount = function(i){ return vCount[i];}
                    } else if (tagName === "p"){
                        var offsetCount = offsetSet.length;

                        var vertexIndices = stringToArray(polylistChild.textContent,Int32Array);

                        // initialize data container
                        var outVertexAttributes = {};
                        for (i=0;i<dataAccessor.names.length;i++){
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
                        var addVertexAttributes = function(index,outVertexAttributes,outTriangleIndices){
                            var cacheKey = "",
                                offset,
                                vertexIndex,
                                name,
                                i,j,
                                indexInVertexIndices = index * offsetCount;
                            for (i=0;i<dataAccessor.names.length;i++){
                                name = dataAccessor.names[i];
                                offset = dataAccessor.offset[name];
                                vertexIndex = vertexIndices[offset+indexInVertexIndices];
                                cacheKey += index+"#"+vertexIndex+"#";
                            }
                            var cacheLookupRes = vertexAttributeCache[cacheKey];
                            var foundInCache = typeof cacheLookupRes === 'number';
                            if (foundInCache){
                                triangleIndices.push(cacheLookupRes);
                            } else {
                                for (i=0;i<dataAccessor.names.length;i++){
                                    name = dataAccessor.names[i];
                                    var accessor = dataAccessor.accessors[name];
                                    var length = dataAccessor.length[name];
                                    offset = dataAccessor.offset[name];
                                    vertexIndex = vertexIndices[offset+indexInVertexIndices];
                                    for (j=0;j<length;j++){
                                        var value = accessor(vertexIndex,j);
                                        outVertexAttributes[name].push(value);
                                    }
                                }
                                var idx = numberOfVertices;
                                numberOfVertices += 1;
                                outTriangleIndices.push(idx);
                                vertexAttributeCache[cacheKey] =idx;
                            }
                        };

                        // triangulate data
                        var index = 0;
                        var triangleIndices = [];
                        for (i=0;i<count;i++){
                            var vertexCountI = vertexCount(i);
                            for (j=0;j<3;j++){
                                addVertexAttributes(index+j,outVertexAttributes,triangleIndices);
                            }
                            for (j=3;j<vertexCountI;j++){
                                addVertexAttributes(index+0,outVertexAttributes,triangleIndices);
                                addVertexAttributes(index+j-1,outVertexAttributes,triangleIndices);
                                addVertexAttributes(index+j,outVertexAttributes,triangleIndices);
                            }
                            index += vertexCountI;
                        }

                        for (i=0;i<dataAccessor.names.length;i++){
                            var name = dataAccessor.names[i];
                            var nameMeshData = name.toLowerCase();
                            if (nameMeshData === "texcoord"){
                                nameMeshData = "uv1";
                            }
                            if (destMeshData[nameMeshData] && destMeshData[nameMeshData].length){
                                // array already exist - append data
                                var toArray = KICK.core.Util.typedArrayToArray;
                                var source = toArray(destMeshData[nameMeshData]);
                                var append = toArray(outVertexAttributes[name]);
                                source.push.apply(source,append); // short way to append one array to another
                                destMeshData[nameMeshData] = source;
                            } else {
                                destMeshData[nameMeshData] = outVertexAttributes[name];
                            }
                        }
                        destMeshData.meshType = constants.GL_TRIANGLES;
                        var subMeshes = destMeshData.subMeshes;
                        subMeshes.push(triangleIndices);
                        destMeshData.subMeshes = subMeshes;
                        console.log("pushing new sub mesh with "+triangleIndices.length+" as # "+destMeshData.subMeshes.length);
                    }
                    polylistChild = polylistChild .nextSibling;
                }

                vertexAttributeCache.numberOfVertices = numberOfVertices ;
            },
            /**
             * Builds meshdata component (based on a &lt;mesh&gt; node)
             * @method buildMeshData
             */
            buildMeshData = function (colladaDOM, engine, geometry){
                var tagName,
                    meshChild,
                    name = geometry.getAttribute('name') || "MeshData",
                    destMeshData,
                    mesh = geometry.getElementsByTagName("mesh");
                if (mesh.length==0){
                    return null;
                }
                var vertexAttributeCache = {};
                mesh = mesh[0];
                meshChild = mesh.firstChild;
                while (meshChild !== null){
                    tagName = meshChild.tagName;
                    if (tagName === "lines"){
                        console.log("lines - unsupported");
                    } else if (tagName === "linestrips - unsupported"){
                        console.log("linestrips");
                    } else if (tagName === "polygons"){
                        console.log("polygons  - unsupported");
                    } else if (tagName === "polylist" || tagName === "triangles"){
                        if (!destMeshData){
                            destMeshData = new KICK.mesh.MeshData({name:name});
                        }
                        buildFromPolyList(meshChild,destMeshData,vertexAttributeCache);
                    } else if (tagName === "trifans"){
                        console.log("trifans unsupported");
                    } else if (tagName === "tristrips"){
                        console.log("tristrips - unsupported");
                    }
                    meshChild = meshChild.nextSibling;
                }
                return destMeshData;
            },
            getMeshesById = function(engine, meshid){
                var meshArray = [],
                    k,
                    geometry;
                if (meshCache[meshid]){
                    return meshCache[meshid];
                }
                if (meshid && meshid.charAt(0)==="#"){
                    meshid = meshid.substring(1);
                }
                for (k=0;k<geometries.length;k++){
                    geometry = geometries[k];
                    if (geometry.getAttribute("id") === meshid){
                        var meshData = buildMeshData(colladaDOM, engine, geometry);
                        if (meshData){
                            var newMesh = new KICK.mesh.Mesh(engine, {meshData:meshData,name:meshData.name+" mesh"});
                            allMeshes.push(newMesh);
                            meshArray.push(newMesh);
                        }
                        break;
                    }
                }
                meshCache[meshid] = meshArray;
                return meshArray;
            },
            updateTransform = function(transform, node){
                var tagName = node.tagName,
                    sid = node.getAttribute('sid');
                if (tagName === "translate"){
                    transform.localPosition = stringToArray(node.textContent);
                } else if (tagName === "rotate"){
                    var angleAxis = stringToArray(node.textContent);
                    var angle = angleAxis[3];
                    if (angle){
                        var rotationQuat = quat4.angleAxis(angle,angleAxis);
                        var currentQuat = transform.localRotation;
                        transform.localRotation = quat4.multiply(currentQuat,rotationQuat,rotationQuat);
                    }
                } else if (tagName === "scale"){
                    transform.localScale = stringToArray(node.textContent);
                } else if (tagName === "matrix"){
                    var matrix = stringToArray(node.textContent);
                    var decomposedMatrix = mat4.decompose(matrix);
                    transform.localPosition = decomposedMatrix[0];
                    transform.localRotation = decomposedMatrix[1];
                    transform.localScale = decomposedMatrix[2];
                }
            },
            createMeshRenderer = function(gameObject, node){
                var url = node.getAttribute("url"),
                    meshRenderer;
                if (url){
                    url = url.substring(1);
                }

                var meshes = getMeshesById(engine,url);
                for (var i=0;i<meshes.length;i++){
                    meshRenderer = new KICK.scene.MeshRenderer();
                    meshRenderer.mesh = meshes[i];
                    var newMaterial = new KICK.material.Material(engine,{
                        name:"Some material",
                        shader:engine.project.load(engine.project.ENGINE_SHADER_DEFAULT)
                    });
                    meshRenderer.material = newMaterial;
                    allMaterials.push(newMaterial);

                    gameObject.addComponent(meshRenderer);
                }
            },
            addNode = function(node, parent){
                var gameObject = scene.createGameObject();
                var transform = gameObject.transform;
                if (parent){
                    transform.parent = parent;
                }
                gameObject.name = node.getAttribute("id");
                allGameObjects.push(gameObject);
                var childNode = node.firstElementChild;
                while (childNode){
                    var tagName = childNode.tagName;
                    if (tagName === "translate" ||
                        tagName === "rotate" ||
                        tagName === "scale" ||
                        tagName === "matrix"){
                        updateTransform(transform, childNode);
                        // todo handle situation where a number of transformation is done
                        // such as
                        //
//                        <node id="BarrelChild2" type="NODE">
//                                    <matrix sid="parentinverse">-1.239744 0.2559972 -2.716832 10.05096 -2.541176 -1.195862 1.046907 -3.691495 -0.1949036 0.5362619 0.1394684 -0.6007659 0 0 0 1</matrix>
//                                    <translate sid="location">0.02037613 0.3007245 4.455008</translate>
//                                    <rotate sid="rotationZ">0 0 1 303.8883</rotate>
//                                    <rotate sid="rotationY">0 1 0 32.78434</rotate>
//                                    <rotate sid="rotationX">1 0 0 120.9668</rotate>
//                                    <scale sid="scale">0.333636 0.333636 1.702475</scale>
//                                    <instance_geometry url="#Torus_002-mesh">
//                                      <bind_material>
//                                        <technique_common>
//                                          <instance_material symbol="Blue_material1" target="#Blue_material-material"/>
//                                        </technique_common>
//                                      </bind_material>
//                                    </instance_geometry>
//                                  </node>
                    }
                    else if (tagName === "instance_geometry"){
                        createMeshRenderer(gameObject, childNode);
                        /*if (rotate90x){
                        var currentRotation = transform.localRotation;
                        var rotationAroundX = quat4.angleAxis(-90,[1,0,0]);
                        transform.localRotation = quat4.multiply(rotationAroundX,currentRotation);
                    }*/
                    } else if (tagName === "node"){
                        addNode(childNode,transform);
                    } else {
                        console.log("Unknown tagName '"+tagName+"'");
                    }
                    childNode = childNode.nextElementSibling;
                }
            };

        var libraryGeometries = colladaDOM.firstChild.getElementsByTagName("library_geometries"),
            visualScenes = colladaDOM.firstChild.getElementsByTagName("visual_scene"),
            geometries,
            i;

        if (!scene){
            scene = engine.activeScene;
        }
        if (libraryGeometries.length==0){
            // no geometries found
        }

        libraryGeometries = libraryGeometries[0];
        geometries = libraryGeometries.getElementsByTagName("geometry");
        var allGameObjects = [];
        var meshCache = {};

        for (i=0;i<visualScenes.length;i++){
            var visualScene = visualScenes[i];
            var node = visualScene.firstElementChild;
            while (node){
                addNode(node, null);
                node = node.nextElementSibling;
            }
        }
        if (rotate90x){
            // ideally it would be better to transform the geometry
            // instead of introducing a new parent
            var parent = scene.createGameObject({name:"Collada Parent"});
            var parentTransform = parent.transform;
            parentTransform.localRotationEuler = [-90,0,0];
            for (i=0;i<allGameObjects.length;i++){
                var goTransform = allGameObjects[i].transform;
                if (!goTransform.parent){
                    goTransform.parent = parentTransform;
                }
            }
            allGameObjects.push(parent);
        }
        return {mesh:allMeshes, gameObjects:allGameObjects, materials:allMaterials};
    };
})();