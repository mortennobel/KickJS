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

    var mesh = KICK.namespace("KICK.mesh"),
        scene = KICK.namespace("KICK.scene"),
        core = KICK.namespace("KICK.core"),
        math = KICK.namespace("KICK.math"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat4 = KICK.namespace("KICK.math.mat4"),
        constants = KICK.core.Constants,
        DEBUG = constants._DEBUG,
        ASSERT = constants._ASSERT,
        fail = KICK.core.Util.fail;

    /**
     * Mesh data class.
     * Allows for modifying mesh object easily.
     * This is a pure data class with no WebGL dependency
     * @class MeshData
     * @namespace KICK.mesh
     * @param {Object} config
     * @constructor
     */
    mesh.MeshData = function(config){
        var data = {},
            thisObj = this,
            _indices = [],
            _interleavedArray,
            _interleavedArrayFormat,
            _vertexAttrLength,
            _meshType,
            _name,
            clearInterleavedData = function(){
                _interleavedArray = null;
                _interleavedArrayFormat = null;
                _vertexAttrLength = null;
            },
            isVertexDataInitialized = function(){
                return data.vertex;
            },
            isInterleavedDataInitialized = function(){
                return _interleavedArray;
            },
            createVertexDataFromInterleavedData = function(){
                var vertexLength = _interleavedArray.byteLength / (_vertexAttrLength),
                    i,j,
                    attributeName,
                    attributeConfig,
                    offset = 0,
                    floatView;
                data = {};
                for (i=0;i<vertexLength;i++){
                    for (attributeName in _interleavedArrayFormat){
                        attributeConfig = _interleavedArrayFormat[attributeName];
                        var arrayType = attributeConfig.type === constants.GL_FLOAT?Float32Array:Int32Array;
                        if (i===0){
                            data[attributeName] = new arrayType(vertexLength*attributeConfig.size);
                        }

                        floatView = new arrayType(_interleavedArray,offset+attributeConfig.pointer);
                        for (j=0;j<attributeConfig.size;j++){
                            data[attributeName][i*attributeConfig.size+j] = floatView[j];
                        }
                    }
                    offset += _vertexAttrLength;
                }
            },
            /**
             * @method createGetterSetter
             * @private
             * @param {Number} type GL_FLOAT or GL_INT
             * @param {string} name
             */
            createGetterSetter = function(type,name){
                if (type === constants.GL_FLOAT || type===constants.GL_INT){
                    var typedArrayType = (type === constants.GL_FLOAT)? Float32Array:Int32Array;
                    return {
                        get:function(){
                            if (!isVertexDataInitialized() && isInterleavedDataInitialized()){
                                createVertexDataFromInterleavedData();
                            }
                            return data[name];
                        },
                        set:function(newValue){
                            if (newValue){
                                if (data[name] && data[name].length == newValue.length){
                                    data[name].set(newValue);
                                } else {
                                    data[name] = new typedArrayType(newValue);
                                }
                            } else {
                                data[name] = null;
                            }
                            clearInterleavedData();
                        }
                    };
                } else if (ASSERT){
                    fail("Unexpected type");
                }
            },
            /**
             * @method createInterleavedData
             * @private
             */
             createInterleavedData = function () {
                 var lengthOfVertexAttributes = [],
                     names = [],
                     types = [],
                     length = 0,
                     vertexAttributes = [],
                     data,
                     i,
                     vertex = thisObj.vertex,
                     vertexLen = vertex ?  vertex.length/3 : 0,
                     description = {},
                     addAttributes = function (name,size,type){
                         var array = thisObj[name];

                         if (array){
                             lengthOfVertexAttributes.push(size);
                             names.push(name);
                             types.push(type);
                             vertexAttributes.push(array);
                             description[name] = {
                                 pointer: length*4,
                                 size: size,
                                 normalized: false,
                                 type: type
                             };
                             length += size;
                         }
                     };

                 addAttributes("vertex",3,constants.GL_FLOAT);
                 addAttributes("normal",3,constants.GL_FLOAT);
                 addAttributes("uv1",2,constants.GL_FLOAT);
                 addAttributes("uv2",2,constants.GL_FLOAT);
                 addAttributes("tangent",4,constants.GL_FLOAT);
                 addAttributes("color",4,constants.GL_FLOAT);
                 addAttributes("int1",1,constants.GL_INT);
                 addAttributes("int2",2,constants.GL_INT);
                 addAttributes("int3",3,constants.GL_INT);
                 addAttributes("int4",4,constants.GL_INT);

                 // copy data into array
                 var dataArrayBuffer = new ArrayBuffer(length*vertexLen*4);
                 for (i=0;i<vertexLen;i++){
                     var vertexOffset = i*length*4;
                     for (var j=0;j<names.length;j++){
                         if (types[j] === constants.GL_FLOAT){
                            data = new Float32Array(dataArrayBuffer,vertexOffset);
                         } else {
                             data = new Int32Array(dataArrayBuffer,vertexOffset);
                         }
                         var dataSrc = vertexAttributes[j];
                         var dataSrcLen = lengthOfVertexAttributes[j];
                         for (var k=0;k<dataSrcLen;k++){
                             data[k] = dataSrc[i*dataSrcLen+k];
                             vertexOffset += 4;
                         }
                     }
                 }
                 _interleavedArray = dataArrayBuffer;
                 _interleavedArrayFormat = description;
                 _vertexAttrLength = length*4;
            };

        /**
         * Saves the MeshData into binary form (ArrayBuffer)
         * @method serialize
         * @return ArrayBuffer
         */
        this.serialize = function(){
            var chunkData = new KICK.core.ChunkData();
            chunkData.setArrayBuffer(1,thisObj.interleavedArray);
            chunkData.setString(2,JSON.stringify(thisObj.interleavedArrayFormat));
            chunkData.setString(3,thisObj.name || "MeshData");
            var subMeshes = thisObj.subMeshes;
            var numberOfSubMeshes = subMeshes.length;
            chunkData.setNumber(4,numberOfSubMeshes);
            chunkData.setNumber(5,thisObj.vertexAttrLength);
            for (var i=0;i<numberOfSubMeshes;i++){
                chunkData.set(10+i,subMeshes[i]);
            }

            return chunkData.serialize();
        };

        /**
         * Restores the
         * @method deserialize
         * @param {ArrayBuffer} data
         * @return Boolean
         */
        this.deserialize = function(data){
            var chunkData = new KICK.core.ChunkData();
            if (chunkData.deserialize(data)){
                thisObj.interleavedArray = chunkData.getArrayBuffer(1);
                thisObj.interleavedArrayFormat = JSON.parse(chunkData.getString(2));
                thisObj.name = chunkData.getString(3);
                var numberOfSubMeshes = chunkData.getNumber(4);
                thisObj.vertexAttrLength = chunkData.getNumber(5);
                var submeshes = [];
                for (var i = 0;i< numberOfSubMeshes;i++){
                    submeshes[i] = chunkData.get(10+i);
                }
                thisObj.subMeshes = submeshes;
                return true;
            }
            return false;
        };


        Object.defineProperties(this,{
            /**
             * Note that this property is not cached. Use KICK.mesh.Mesh.aabb for a cached version.
             * Readonly
             * @property aabb
             * @type KICK.math.aabb
             */
            aabb:{
                get:function(){
                    var vertex = thisObj.vertex;
                    if (!vertex){
                        return null;
                    }
                    var vertexLength = vertex.length;
                    var aabb = KICK.math.aabb.create();
                    for (var i=0;i<vertexLength;i += 3){
                        var point = vertex.subarray(i,i+3);
                        KICK.math.aabb.addPoint(aabb,point);
                    }
                    return aabb;
                }
            },
            /**
             * @property name
             * @type string
             */
            name:{
                get:function(){
                    return _name;
                },
                set:function(newValue){
                    _name = newValue;
                }
            },
            /**
             * @property interleavedArray
             * @type Float32Array
             */
            interleavedArray:{
                get:function(){
                    if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()){
                        createInterleavedData();
                    }
                    return _interleavedArray;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (newValue && !(newValue instanceof ArrayBuffer)){
                            fail("MeshData.interleavedArray must be an ArrayBuffer");
                        }
                    }
                    if (!newValue){
                        clearInterleavedData();
                    } else {
                        _interleavedArray = newValue;
                    }
                }
            },
            /**
             * Describes the interleaved array format.<br>
             * The description is an object with a number of properties.<br>
             * Each property name corresponds to the name of the vertex attribute.<br>
             * Each property has the format <br>
             * <pre class="brush: js">
             * {
             * &nbsp;pointer: 0, // {Number}
             * &nbsp;size: 0, //{Number} number of elements
             * &nbsp;normalized: 0, // {Boolean} should be normalized or not
             * &nbsp;type: 0 // {GL_FLOAT or GL_INT}
             * }
             * </pre>
             * <br>
             * Example:<br>
             * <pre class="brush: js">
             * var vertexOffset = meshData.interleavedArrayFormat["vertex"].pointer;
             * </pre>
             * @property interleavedArrayFormat
             * @type Object
             */
            interleavedArrayFormat:{
                get:function(){
                    if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()){
                        createInterleavedData();
                    }
                    return _interleavedArrayFormat;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (newValue !== null){
                            for (var n in newValue){
                                var object = newValue[n];
                                if (typeof (object) === "object" ){
                                    if (typeof(object.pointer) !== "number" ||
                                        typeof(object.size) !== "number" ||
                                        typeof(object.normalized) !== "boolean" ||
                                        typeof(object.type) !== "number"){
                                        fail("Invalid object signature - expected {pointer:,size:,normalized:,type:}");
                                    }
                                }
                            }
                        }
                    }
                    if (!newValue){
                        clearInterleavedData();
                    } else {
                        _interleavedArrayFormat = newValue;
                    }
                }
            },
            /**
             * The length of vertexAttributes for one vertex in bytes
             * @property vertexAttrLength
             * @type Number
             */
            vertexAttrLength:{
                get:function(){
                    if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()){
                        createInterleavedData();
                    }
                    return _vertexAttrLength;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (typeof newValue !== "number" || newValue <0){
                            fail("Invalid MeshData.vertexAttrLength - expected a real number");
                        }
                    }
                    if (!newValue){
                        clearInterleavedData();
                    } else {
                        _vertexAttrLength = newValue;
                    }
                }
            },
            /**
             * Vertex attribute.
             * Vertex (vec3)
             * @property vertex
             * @type Array[Number]
             */
            vertex:createGetterSetter(constants.GL_FLOAT, "vertex"),
            /**
             * Vertex attribute.
             * Normal (vec3)
             * @property normal
             * @type Array[Number]
             */
            normal:createGetterSetter(constants.GL_FLOAT, "normal"),
            /**
             * Vertex attribute.
             * UV1 (vec2)
             * @property uv1
             * @type Array[Number]
             */
            uv1:createGetterSetter(constants.GL_FLOAT, "uv1"),
            /**
             * Vertex attribute.
             * UV2 (vec2)
             * @property uv2
             * @type Array[Number]
             */
            uv2:createGetterSetter(constants.GL_FLOAT, "uv2"),
            /**
             * Vertex attribute.
             * Tangent (vec4)
             * @property tangent
             * @type Array[Number]
             */
            tangent:createGetterSetter(constants.GL_FLOAT, "tangent"),
            /**
             * Vertex attribute.
             * Color (vec4)
             * @property color
             * @type Array[Number]
             */
            color:createGetterSetter(constants.GL_FLOAT, "color"),
            /**
             * Vertex attribute.
             * Integer attribute (onw Int32)
             * @property int1
             * @type Array[Number]
             */
            int1:createGetterSetter(constants.GL_INT, "int1"),
            /**
             * Vertex attribute.
             * Integer attribute (two Int32)
             * @property int2
             * @type Array[Number]
             */
            int2:createGetterSetter(constants.GL_INT, "int2"),
            /**
             * Vertex attribute.
             * Integer attribute (three Int32)
             * @property int3
             * @type Array[Number]
             */
            int3:createGetterSetter(constants.GL_INT, "int3"),
            /**
             * Vertex attribute.
             * Integer attribute (four Int32)
             * @property int4
             * @type Array[Number]
             */
            int4:createGetterSetter(constants.GL_INT, "int4"),
            /**
             * Vertex attribute.
             * indices (integer).
             * indices is shortcut for subMeshes[0]
             * @property indices
             * @type Array[Number]
             */
            indices:{
                get:function(){
                    if (_indices==0){
                        return null;
                    }
                    return _indices[0];
                },
                set:function(newValue){
                    if (newValue && !(newValue instanceof Uint16Array)){
                        newValue = new Uint16Array(newValue);
                    }
                    if (_indices[0] && isVertexDataInitialized()){
                        clearInterleavedData();
                    }
                    if (newValue){
                        _indices[0] = newValue;
                    }
                }
            },
            /**
             * indices (integer)
             * @property subMeshes
             * @type Array[Array[Number]]
             */
            subMeshes:{
                get:function(){
                    return _indices;
                },
                set:function(newValue){
                    for (var i=0;i<newValue.length;i++){
                        if (newValue[i] && !(newValue[i] instanceof Uint16Array)){
                            newValue[i] = new Uint16Array(newValue[i]);
                        }
                    }
                    _indices = newValue;
                }
            },
            /**
             * Must be GL_TRIANGLES,GL_TRIANGLE_FAN, GL_TRIANGLE_STRIP, or GL_LINES
             * @property meshType
             * @type Number
             */
            meshType:{
                get:function(){
                    return _meshType;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (
                            newValue != constants.GL_LINES &&
                            newValue != constants.GL_TRIANGLES &&
                            newValue != constants.GL_TRIANGLE_FAN &&
                            newValue != constants.GL_TRIANGLE_STRIP){
                            fail("MeshData.meshType must be GL_TRIANGLES, GL_TRIANGLE_FAN or GL_TRIANGLE_STRIP");
                        }
                    }
                    _meshType = newValue;
                }
            }
        });

        /**
         * @method isValid
         * @return {Boolean} if mesh is considered valid
         */
        this.isValid = function(){
            if (!isVertexDataInitialized() && isInterleavedDataInitialized()){
                createVertexDataFromInterleavedData();
            }
            var vertexCount = data.vertex.length/3;
            for (var j=0;j<_indices.length;j++){
                for (var i=_indices[j].length-1;i>=0;i--){
                    if (_indices[j][i] >= vertexCount){
                        debugger;
                        return false;
                    }
                }
            }
            return true;
        };

        /**
         * @method isVertexDataInitialized
         * @return {Boolean} return true if vertex data is initialized
         */
        this.isVertexDataInitialized = isVertexDataInitialized;

        /**
         * @method isInterleavedDataInitialized
         * @return {Boolean} return true if interleaved data is initialized
         */
        this.isInterleavedDataInitialized = isInterleavedDataInitialized;

        /**
         * Creates a copy of the mesh and transform the vertex positions of the MeshData with a mat4.
         * Note that normals are not modified - so they may need to renormalized.
         * @param {KICK.math.mat4} transformMatrix
         * @return {KICK.mesh.MeshData} transformed mesh
         */
        this.transform = function(transformMatrix){
            var copy = new mesh.MeshData(this);
            var wrappedVec3Array = vec3.wrapArray(copy.vertex);
            for (var j=wrappedVec3Array.length-1;j>=0;j--){
                mat4.multiplyVec3(transformMatrix,wrappedVec3Array[j]);
            }
            return copy;
        };
        /**
         * Combine two meshes and returns the combined mesh as a new Mesh object.<br>
         * The two meshes must have the same meshType. Only vertex attributes existing in
         * both mesh objects are transferred<br>
         * Triangle fans cannot be combined
         * @method combine
         * @param {KICK.mesh.MeshData} secondMesh
         * @param {KICK.math.mat4} transform Optional transformation matrix
         * @return {KICK.mesh.MeshData} mesh object or null if incompatible objects
         */
        this.combine = function(secondMesh, transform){
            if (thisObj.meshType !== secondMesh.meshType || thisObj.meshType == constants.GL_TRIANGLE_FAN){
                if (ASSERT){
                    if (thisObj.meshType !== secondMesh.meshType){
                        fail("Mesh.combine does not support different meshTypes");
                    } else {
                        fail("Mesh.combine does not support triangle fans");
                    }
                    return null;
                }
                return null;
            }
            var dataNames = ["vertex","normal","uv1","uv2","tangent","color","int1","int2","int3","int4","indices"];

            for (var i=dataNames.length-1;i>=0;i--){
                var name = dataNames[i];
                if (!thisObj[name] || !secondMesh[name]){
                    dataNames.splice(i,1); // remove dataName from array
                }
            }

            var appendObject = function(config, source, indexOffset){
                var i,j,name,data,len;
                for (i=dataNames.length-1;i>=0;i--){
                    name = dataNames[i];
                    if (!config[name]){ // if undefined
                        config[name] = KICK.core.Util.typedArrayToArray(source[name]);
                    } else {
                        data = source[name];
                        if (indexOffset && name === "indices"){
                            // take a copy
                            data = new Uint16Array(data);
                            // add offset to copy
                            len = data.length;
                            for (j=0;j<len;j++){
                                data[j] += indexOffset;
                            }
                        }
                        for (j=0;j<data.length;j++){
                            config[name].push(data[j]);
                        }
                    }
                }
            };

            var newConfig = {
                meshType:thisObj.meshType
            };

            if (transform){
                secondMesh = secondMesh.transform(transform);
            }

            appendObject(newConfig,thisObj,0);
            appendObject(newConfig,secondMesh,this.vertex.length/3);

            if (thisObj.meshType === constants.GL_TRIANGLE_STRIP){
                // create two degenerate triangles to connect the two triangle strips
                newConfig.indices.splice(thisObj.indices,0,newConfig.indices[thisObj.indices.length],newConfig.indices[thisObj.indices.length+1]);
            }

            return new mesh.MeshData(newConfig);
        };

        if (!config){
            config = {};
        }

        var copyVertexData = function(){
            thisObj.vertex = config.vertex ? new Float32Array(config.vertex):null;
            thisObj.normal = config.normal? new Float32Array(config.normal):null;
            thisObj.uv1 = config.uv1? new Float32Array(config.uv1):null;
            thisObj.uv2 = config.uv2? new Float32Array(config.uv2):null;
            thisObj.tangent = config.tangent? new Float32Array(config.tangent):null;
            thisObj.color = config.color? new Float32Array(config.color):null;
            thisObj.int1 = config.int1? new Int32Array(config.int1):null;
            thisObj.int2 = config.int2? new Int32Array(config.int2):null;
            thisObj.int3 = config.int3? new Int32Array(config.int3):null;
            thisObj.int4 = config.int4? new Int32Array(config.int4):null;
        };

        var copyInterleavedData = function(){
            thisObj.interleavedArray = config.interleavedArray;
            thisObj.interleavedArrayFormat = config.interleavedArrayFormat;
            thisObj.vertexAttrLength = config.vertexAttrLength;
        };

        if (config instanceof mesh.MeshData){
            if (config.isVertexDataInitialized()){
                copyVertexData();
            } else {
                if (ASSERT){
                    if (!config.isInterleavedDataInitialized()){
                        KICK.core.Util.fail("Either vertex or interleaved data should be initialized");
                    }
                }
                copyInterleavedData();
            }
        } else {
            if (config.vertex){
                copyVertexData();
            } else if (config.interleavedArray) {
                copyInterleavedData();
            }
        }
        thisObj.name = config.name;
        thisObj.indices = config.indices;
        thisObj.meshType = config.meshType || constants.GL_TRIANGLES;
    };

    /**
     * Recalculate the vertex normals based on the triangle normals
     * @method recalculateNormals
     */
    mesh.MeshData.prototype.recalculateNormals = function(){
        var vertexCount = this.vertex.length/3,
            triangleCount = this.indices.length/3,
            triangles = this.indices,
            vertex = vec3.wrapArray(this.vertex),
            a,
            normalArrayRef = {},
            normalArray = vec3.array(vertexCount,normalArrayRef),
            v1v2 = vec3.create(),
            v1v3 = vec3.create(),
            normal = vec3.create();

        for (a=0;a<triangleCount;a++){
            var i1 = triangles[a*3+0],
                i2 = triangles[a*3+1],
                i3 = triangles[a*3+2],

                v1 = vertex[i1],
                v2 = vertex[i2],
                v3 = vertex[i3];
            vec3.subtract(v2,v1,v1v2);
            vec3.subtract(v3,v1,v1v3);
            vec3.cross(v1v2,v1v3,normal);
            vec3.normalize(normal);
            vec3.add(normalArray[i1],normal);
            vec3.add(normalArray[i2],normal);
            vec3.add(normalArray[i3],normal);
        }
        for (a=0;a<vertexCount;a++){
            vec3.normalize(normalArray[a]);
        }
        this.normal =  normalArrayRef.mem;
    };

    /**
     * Recalculates the tangents on a triangle mesh.<br>
     * Algorithm is based on<br>
     *   Lengyel, Eric. “Computing Tangent Space Basis Vectors for an Arbitrary Mesh”.<br>
     *   Terathon Software 3D Graphics Library, 2001.<br>
     *   http://www.terathon.com/code/tangent.html
     * @method recalculateTangents
     * @return {Boolean} false if meshtype is not GL_TRIANGLES
     */
    mesh.MeshData.prototype.recalculateTangents = function(){
        if (this.meshType != constants.GL_TRIANGLES){
            return false;
        }
        var vertex = vec3.wrapArray(this.vertex),
            vertexCount = vertex.length,
            normal = vec3.wrapArray(this.normal),
            texcoord = this.uv1,
            triangle = this.indices,
            triangleCount = triangle.length/3,
            tangent = this.tangent,
            tan1 = vec3.array(vertexCount),
            tan2 = vec3.array(vertexCount),
            a,
            tmp = vec3.create(),
            tmp2 = vec3.create();

        for (a = 0; a < triangleCount; a++)
        {
            var i1 = triangle[a*3+0],
                i2 = triangle[a*3+1],
                i3 = triangle[a*3+2],

                v1 = vertex[i1],
                v2 = vertex[i2],
                v3 = vertex[i3],

                w1 = texcoord[i1],
                w2 = texcoord[i2],
                w3 = texcoord[i3],

                x1 = v2[0] - v1[0],
                x2 = v3[0] - v1[0],
                y1 = v2[1] - v1[1],
                y2 = v3[1] - v1[1],
                z1 = v2[2] - v1[2],
                z2 = v3[2] - v1[2],

                s1 = w2[0] - w1[0],
                s2 = w3[0] - w1[0],
                t1 = w2[1] - w1[1],
                t2 = w3[1] - w1[1],

                r = 1.0 / (s1 * t2 - s2 * t1),
                sdir = vec3.create([(t2 * x1 - t1 * x2) * r,
                    (t2 * y1 - t1 * y2) * r,
                    (t2 * z1 - t1 * z2) * r]),
                tdir = vec3.create([(s1 * x2 - s2 * x1) * r,
                    (s1 * y2 - s2 * y1) * r,
                    (s1 * z2 - s2 * z1) * r]);

            vec3.add(tan1[i1], sdir);
            vec3.add(tan1[i2], sdir);
            vec3.add(tan1[i3], sdir);

            vec3.add(tan2[i1], tdir);
            vec3.add(tan2[i2], tdir);
            vec3.add(tan2[i3], tdir);
        }
        if (!tangent){
            tangent = new Float32Array(vertexCount*4);
            this.tangent = tangent;
        }
        tangent = vec4.wrapArray(tangent);

        for (a = 0; a < vertexCount; a++)
        {
            var n = normal[a];
            var t = tan1[a];

            // Gram-Schmidt orthogonalize
            // tangent[a] = (t - n * Dot(n, t)).Normalize();
            vec3.subtract(t,n,tmp);
            vec3.dot(n,t,tmp2);
            vec3.set(vec3.normalize(vec3.multiply(tmp,tmp2)),tangent[a]);

            // Calculate handedness
            // tangent[a].w = (Dot(Cross(n, t), tan2[a]) < 0.0F) ? -1.0F : 1.0F;
            tangent[a][3] = (vec3.dot(vec3.cross(n, t,vec3.create()), tan2[a]) < 0.0) ? -1.0 : 1.0;
        }
        return true;
    };

    /**
     * A Mesh object allows you to bind and render a MeshData object
     * @class Mesh
     * @namespace KICK.mesh
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @extends KICK.core.ProjectAsset
     */
    mesh.Mesh = function (engine,config) {
        var gl = engine.gl,
            meshVertexAttBuffer,
            interleavedArrayFormat,
            meshVertexIndexBuffers = [],
            _name,
            _meshData,
            _dataURI = "memory://void",
            _aabb = null,
            thisObj = this,
            c = KICK.core.Constants,
            vertexAttrLength = 0,
            meshType,
            meshElements = [],
            contextListener = {
                contextLost: function(){},
                contextRestored: function(newGl){
                    meshVertexIndexBuffers = null;
                    meshVertexAttBuffer = null;
                    gl = newGl;
                    updateData();
                }
            },
            deleteBuffers = function(){
                for (var i=0;i<meshVertexIndexBuffers.length;i++){
                    gl.deleteBuffer(meshVertexIndexBuffers[i]);
                }
                if (typeof meshVertexAttBuffer === "number"){
                    gl.deleteBuffer(meshVertexAttBuffer);
                    meshVertexAttBuffer = null;
                }
                meshElements.length = 0;
                meshVertexIndexBuffers.length = 0;
            },
            /**
             * Copy data to the vertex buffer object (VBO)
             * @method updateData
             * @private
             */
            updateData = function () {
                var subMeshes = _meshData.subMeshes;
                // delete current buffers
                deleteBuffers();

                interleavedArrayFormat = _meshData.interleavedArrayFormat;
                vertexAttrLength = _meshData.vertexAttrLength;
                meshType = _meshData.meshType;

                meshVertexAttBuffer = gl.createBuffer();
                gl.bindBuffer(c.GL_ARRAY_BUFFER, meshVertexAttBuffer);
                gl.bufferData(c.GL_ARRAY_BUFFER, _meshData.interleavedArray, c.GL_STATIC_DRAW);

                for (var i=0;i<subMeshes.length;i++){
                    var indices = subMeshes[i];
                    var meshVertexIndexBuffer = gl.createBuffer();
                    meshElements[i] = indices.length;
                    meshVertexIndexBuffers.push(meshVertexIndexBuffer);
                    gl.bindBuffer(c.GL_ELEMENT_ARRAY_BUFFER, meshVertexIndexBuffer);
                    gl.bufferData(c.GL_ELEMENT_ARRAY_BUFFER, indices, c.GL_STATIC_DRAW);
                }
            };

        if (DEBUG){
            if (!(engine instanceof KICK.core.Engine)){
                fail("Engine param not valid");
            }
        }
        engine.addContextListener(contextListener);

        Object.defineProperties(this,{
            /**
             * Axis aligned bounding box.
             * Readonly.
             * @property aabb
             * @type KICK.math.aabb
             */
            aabb:{
                get:function(){
                    if (!_aabb && _meshData){
                        _aabb = _meshData.aabb;
                    }
                    return _aabb;
                }
            },
            /**
             * @property name
             * @type String
             */
            name:{
                get:function(){
                    return _name;
                },
                set:function(newValue){
                    _name = newValue || "Mesh";
                }
            },
            /**
             * Setting this property to something will update the data in WebGL. Note that
             * changing a MeshData object will not itself update anything.
             * @property meshData
             * @type KICK.mesh.MeshData
             */
            meshData:{
                get:function(){
                    return _meshData;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (newValue && !(newValue instanceof mesh.MeshData)){
                            KICK.core.Util.fail("Mesh.meshData must be instanceof KICK.mesh.MeshData");
                        }
                    }
                    _meshData = newValue;
                    _aabb = null;
                    updateData();
                }
            },
            /**
             * The resource url of the mesh. Setting this property will try to load the meshData.
             * @property dataURI
             * @type String
             */
            dataURI:{
                get:function(){
                    return _dataURI;
                },
                set:function(newValue){
                    thisObj.setDataURI(newValue,true);
                }
            }
        });

        /**
         * @method setDataURI
         * @param {String} newValue
         * @param {Boolean} automaticGetMeshData optional. if true the mesh data is attempted to be loaded by resourceManager.getMeshData
         */
        this.setDataURI = function(newValue, automaticGetMeshData){
            if (newValue !== _dataURI){
                _dataURI = newValue;
                if (automaticGetMeshData){
                    engine.resourceManager.getMeshData(newValue,thisObj);
                }
            }
        };

        KICK.core.Util.applyConfig(this,config);
        engine.project.registerObject(this, "KICK.mesh.Mesh");


        /**
         * This function verifies that the mesh has the vertex attributes (normals, uvs, tangents) that the shader uses.
         * @method verify
         * @param {KICK.material.Shader} shader
         * @return {Array[String]} list of missing vertex attributes in mesh or null if no missing attributes
         */
        this.verify = function (shader){
            var missingVertexAttributes = [],
                found;
            for (var attName in shader.lookupAttribute){
                if (typeof (attName) === "string"){
                    found = interleavedArrayFormat[attName];
                    if (!found){
                        missingVertexAttributes.push(attName);
                    }
                }
            }
            if (missingVertexAttributes.length === 0){
                return null;
            }
            return null;
        };

        /**
         * Bind the vertex attributes of the mesh to the shader
         * @method bind
         * @param {KICK.material.Shader} shader
         */
        this.bind = function (shader) {
            shader.bind();

            if (gl.meshBuffer !== meshVertexAttBuffer || gl.meshShader !== shader){
                gl.meshBuffer = meshVertexAttBuffer;
                gl.meshShader = shader;
                gl.bindBuffer(constants.GL_ARRAY_BUFFER, meshVertexAttBuffer);

                for (var descName in interleavedArrayFormat) {
                    if (typeof(shader.lookupAttribute[descName]) !== 'undefined') {
                        var desc = interleavedArrayFormat[descName];
                        var attributeIndex = shader.lookupAttribute[descName];
                        gl.enableVertexAttribArray(attributeIndex);
                        gl.vertexAttribPointer(attributeIndex, desc.size,
                           desc.type, false, vertexAttrLength, desc.pointer);
                    }
                }
                if (ASSERT){
                    for (var i = shader.activeAttributes.length-1;i>=0;i--){
                        var activeAttribute = shader.activeAttributes[i];
                        if (interleavedArrayFormat && !(interleavedArrayFormat[activeAttribute.name])){
                            KICK.core.Util.fail("Shader wants "+activeAttribute.name+" but mesh does not have it.");
                            attributeIndex = shader.lookupAttribute[activeAttribute.name];
                            gl.disableVertexAttribArray(attributeIndex);
                            switch(activeAttribute.type){
                                case c.GL_FLOAT:
                                    gl.vertexAttrib1f(attributeIndex,0.0);
                                break;
                                case c.GL_FLOAT_VEC2:
                                    gl.vertexAttrib2f(attributeIndex,0.0,0.0);
                                break;
                                case c.GL_FLOAT_VEC3:
                                    gl.vertexAttrib3f(attributeIndex,0.0,0.0,0.0);
                                break;
                                case c.GL_FLOAT_VEC4:
                                    gl.vertexAttrib4f(attributeIndex,0.0,0.0,0.0,0.0);
                                break;
                                default:
                                    KICK.core.Util.fail("Shader wants "+activeAttribute.name+" no default value for type.");
                                break;
                            }
                        }
                    }
                }

            }
        };

        /**
         * Renders the current mesh.
         * Assumes that the Mesh.bind(shader) has been called prior to this, to setup the mesh with the shader.
         * @method render
         * @param {Number} submeshIndex
         */
        this.render = function (submeshIndex) {
            gl.bindBuffer(constants.GL_ELEMENT_ARRAY_BUFFER, meshVertexIndexBuffers[submeshIndex]);
            gl.drawElements(meshType, meshElements[submeshIndex], c.GL_UNSIGNED_SHORT, 0);
        };

        /**
         * Destroys the mesh data and deletes the associated resources
         * After this the mesh cannot be bound
         * @method destroy
         */
        this.destroy = function(){
            if (meshVertexAttBuffer !== null){
                deleteBuffers();
                engine.removeContextListener(contextListener);
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * @method toJSON
         * @return {Object} data object
         */
        this.toJSON = function(){
            if (ASSERT){
                if (!_dataURI){
                    fail("_dataURI not defined");
                }
            }
            return {
                uid: thisObj.uid,
                name:_name,
                dataURI:_dataURI
            };
        };
    };
})();