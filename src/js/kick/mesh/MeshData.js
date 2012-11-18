define(["kick/core/Constants", "kick/core/Util", "kick/core/ChunkData", "kick/math/Aabb", "kick/math/Vec3", "kick/math/Vec4", "kick/math/Mat4"],
    function (Constants, Util, ChunkData, Aabb, Vec3, Vec4, Mat4) {
        "use strict";

        var ASSERT = Constants._ASSERT,
            MeshData;

        /**
         * Mesh data class.
         * Allows for modifying mesh object easily.
         * This is a pure data class with no WebGL dependency
         * @class MeshData
         * @namespace kick.mesh
         * @param {Object} config
         * @constructor
         */
        MeshData = function (config) {
            var data = {},
                thisObj = this,
                _indices = [],
                _interleavedArray,
                _interleavedArrayFormat,
                _vertexAttrLength,
                _meshType,
                _name,
                clearInterleavedData = function () {
                    _interleavedArray = null;
                    _interleavedArrayFormat = null;
                    _vertexAttrLength = null;
                },
                isVertexDataInitialized = function () {
                    return data.vertex;
                },
                isInterleavedDataInitialized = function () {
                    return _interleavedArray;
                },
                createVertexDataFromInterleavedData = function () {
                    var vertexLength = _interleavedArray.byteLength / (_vertexAttrLength), i, j,
                        attributeName,
                        attributeConfig,
                        offset = 0,
                        ArrayType,
                        floatView;
                    data = {};
                    for (i = 0; i < vertexLength; i++) {
                        for (attributeName in _interleavedArrayFormat) {
                            if (_interleavedArrayFormat.hasOwnProperty(attributeName)) {
                                attributeConfig = _interleavedArrayFormat[attributeName];
                                ArrayType = attributeConfig.type === Constants.GL_FLOAT ? Float32Array : Int32Array;
                                if (i === 0) {
                                    data[attributeName] = new ArrayType(vertexLength * attributeConfig.size);
                                }

                                floatView = new ArrayType(_interleavedArray, offset + attributeConfig.pointer);
                                for (j = 0; j < attributeConfig.size; j++) {
                                    data[attributeName][i * attributeConfig.size + j] = floatView[j];
                                }
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
                createGetterSetter = function (type, name) {
                    if (type === Constants.GL_FLOAT || type === Constants.GL_INT) {
                        var TypedArrayType = (type === Constants.GL_FLOAT) ? Float32Array : Int32Array;
                        return {
                            get: function () {
                                if (!isVertexDataInitialized() && isInterleavedDataInitialized()) {
                                    createVertexDataFromInterleavedData();
                                }
                                return data[name];
                            },
                            set: function (newValue) {
                                if (newValue) {
                                    if (data[name] && data[name].length === newValue.length) {
                                        data[name].set(newValue);
                                    } else {
                                        data[name] = new TypedArrayType(newValue);
                                    }
                                } else {
                                    data[name] = null;
                                }
                                clearInterleavedData();
                            }
                        };
                    } else if (ASSERT) {
                        Util.fail("Unexpected type");
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
                        j,
                        k,
                        vertex = thisObj.vertex,
                        vertexLen = vertex ?  vertex.length / 3 : 0,
                        description = {},
                        dataArrayBuffer,
                        vertexOffset,
                        dataSrc,
                        dataSrcLen,
                        addAttributes = function (name, size, type) {
                            var array = thisObj[name];

                            if (array) {
                                lengthOfVertexAttributes.push(size);
                                names.push(name);
                                types.push(type);
                                vertexAttributes.push(array);
                                description[name] = {
                                    pointer: length * 4,
                                    size: size,
                                    normalized: false,
                                    type: type,
                                    name: name
                                };
                                length += size;
                            }
                        };

                    addAttributes("vertex", 3, Constants.GL_FLOAT);
                    addAttributes("normal", 3, Constants.GL_FLOAT);
                    addAttributes("uv1", 2, Constants.GL_FLOAT);
                    addAttributes("uv2", 2, Constants.GL_FLOAT);
                    addAttributes("tangent", 4, Constants.GL_FLOAT);
                    addAttributes("color", 4, Constants.GL_FLOAT);
                    addAttributes("int1", 1, Constants.GL_INT);
                    addAttributes("int2", 2, Constants.GL_INT);
                    addAttributes("int3", 3, Constants.GL_INT);
                    addAttributes("int4", 4, Constants.GL_INT);

                    // copy data into array
                    dataArrayBuffer = new ArrayBuffer(length * vertexLen * 4);
                    for (i = 0; i < vertexLen; i++) {
                        vertexOffset = i * length * 4;
                        for (j = 0; j < names.length; j++) {
                            if (types[j] === Constants.GL_FLOAT) {
                                data = new Float32Array(dataArrayBuffer, vertexOffset);
                            } else {
                                data = new Int32Array(dataArrayBuffer, vertexOffset);
                            }
                            dataSrc = vertexAttributes[j];
                            dataSrcLen = lengthOfVertexAttributes[j];
                            for (k = 0; k < dataSrcLen; k++) {
                                data[k] = dataSrc[i * dataSrcLen + k];
                                vertexOffset += 4;
                            }
                        }
                    }
                    _interleavedArray = dataArrayBuffer;
                    _interleavedArrayFormat = description;
                    _vertexAttrLength = length * 4;
                };

            /**
             * Saves the MeshData into binary form (ArrayBuffer)
             * @method serialize
             * @return ArrayBuffer
             */
            this.serialize = function () {
                var subMeshes,
                    numberOfSubMeshes,
                    i,
                    chunkData = new ChunkData();
                chunkData.setArrayBuffer(1, thisObj.interleavedArray);
                chunkData.setString(2, JSON.stringify(thisObj.interleavedArrayFormat));
                chunkData.setString(3, thisObj.name || "MeshData");
                subMeshes = thisObj.subMeshes;
                numberOfSubMeshes = subMeshes.length;
                chunkData.setNumber(4, numberOfSubMeshes);
                chunkData.setNumber(5, thisObj.vertexAttrLength);
                for (i = 0; i < numberOfSubMeshes; i++) {
                    chunkData.set(10 + i, subMeshes[i]);
                }

                return chunkData.serialize();
            };

            /**
             * Restores the
             * @method deserialize
             * @param {ArrayBuffer} data
             * @return Boolean
             */
            this.deserialize = function (data) {
                var chunkData = new ChunkData(),
                    numberOfSubMeshes,
                    submeshes,
                    i;
                if (chunkData.deserialize(data)) {
                    thisObj.interleavedArray = chunkData.getArrayBuffer(1);
                    thisObj.interleavedArrayFormat = JSON.parse(chunkData.getString(2));
                    thisObj.name = chunkData.getString(3);
                    numberOfSubMeshes = chunkData.getNumber(4);
                    thisObj.vertexAttrLength = chunkData.getNumber(5);
                    submeshes = [];
                    for (i = 0; i < numberOfSubMeshes; i++) {
                        submeshes[i] = chunkData.get(10 + i);
                    }
                    thisObj.subMeshes = submeshes;
                    return true;
                }
                return false;
            };


            Object.defineProperties(this, {
                /**
                 * Note that this property is not cached. Use kick.mesh.Mesh.aabb for a cached version.
                 * Readonly
                 * @property aabb
                 * @type kick.math.Aabb
                 */
                aabb: {
                    get: function () {
                        var vertexLength,
                            aabb,
                            i,
                            point,
                            vertex = thisObj.vertex;
                        if (!vertex) {
                            return null;
                        }
                        vertexLength = vertex.length;
                        aabb = Aabb.create();
                        for (i = 0; i < vertexLength; i += 3) {
                            point = vertex.subarray(i, i + 3);
                            Aabb.addPoint(aabb, point);
                        }
                        return aabb;
                    }
                },
                /**
                 * @property name
                 * @type string
                 */
                name: {
                    get: function () {
                        return _name;
                    },
                    set: function (newValue) {
                        _name = newValue;
                    }
                },
                /**
                 * @property interleavedArray
                 * @type Float32Array
                 */
                interleavedArray: {
                    get: function () {
                        if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()) {
                            createInterleavedData();
                        }
                        return _interleavedArray;
                    },
                    set: function (newValue) {
                        if (ASSERT) {
                            if (newValue && !(newValue instanceof ArrayBuffer)) {
                                Util.fail("MeshData.interleavedArray must be an ArrayBuffer");
                            }
                        }
                        if (!newValue) {
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
                 * @example
                 *     {
                 *         pointer: 0, // {Number}
                 *         size: 0, //{Number} number of elements
                 *         normalized: 0, // {Boolean} should be normalized or not
                 *         type: 0 // {GL_FLOAT or GL_INT}
                 *     }
                 * <br>
                 * Example:<br>
                 * @example
                 *     var vertexOffset = meshData.interleavedArrayFormat["vertex"].pointer;
                 *
                 * @property interleavedArrayFormat
                 * @type Object
                 */
                interleavedArrayFormat: {
                    get: function () {
                        if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()) {
                            createInterleavedData();
                        }
                        return _interleavedArrayFormat;
                    },
                    set: function (newValue) {
                        if (ASSERT) {
                            var n,
                                object;
                            if (newValue !== null) {
                                for (n in newValue) {
                                    object = newValue[n];
                                    if (typeof (object) === "object") {
                                        if (typeof (object.pointer) !== "number" ||
                                                typeof (object.size) !== "number" ||
                                                typeof (object.normalized) !== "boolean" ||
                                                typeof (object.type) !== "number") {
                                            Util.fail("Invalid object signature - expected {pointer:,size:,normalized:,type:}");
                                        }
                                    }
                                }
                            }
                        }
                        if (!newValue) {
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
                vertexAttrLength: {
                    get: function () {
                        if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()) {
                            createInterleavedData();
                        }
                        return _vertexAttrLength;
                    },
                    set: function (newValue) {
                        if (ASSERT) {
                            if (typeof newValue !== "number" || newValue < 0) {
                                Util.fail("Invalid MeshData.vertexAttrLength - expected a real number");
                            }
                        }
                        if (!newValue) {
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
                 * @type Array_Number
                 */
                vertex: createGetterSetter(Constants.GL_FLOAT, "vertex"),
                /**
                 * Vertex attribute.
                 * Normal (vec3)
                 * @property normal
                 * @type Array_Number
                 */
                normal: createGetterSetter(Constants.GL_FLOAT, "normal"),
                /**
                 * Vertex attribute.
                 * UV1 (vec2)
                 * @property uv1
                 * @type Array_Number
                 */
                uv1: createGetterSetter(Constants.GL_FLOAT, "uv1"),
                /**
                 * Vertex attribute.
                 * UV2 (vec2)
                 * @property uv2
                 * @type Array_Number
                 */
                uv2: createGetterSetter(Constants.GL_FLOAT, "uv2"),
                /**
                 * Vertex attribute.
                 * Tangent (vec4)
                 * @property tangent
                 * @type Array_Number
                 */
                tangent: createGetterSetter(Constants.GL_FLOAT, "tangent"),
                /**
                 * Vertex attribute.
                 * Color (vec4)
                 * @property color
                 * @type Array_Number
                 */
                color: createGetterSetter(Constants.GL_FLOAT, "color"),
                /**
                 * Vertex attribute.
                 * Integer attribute (onw Int32)
                 * @property int1
                 * @type Array_Number
                 */
                int1: createGetterSetter(Constants.GL_INT, "int1"),
                /**
                 * Vertex attribute.
                 * Integer attribute (two Int32)
                 * @property int2
                 * @type Array_Number
                 */
                int2: createGetterSetter(Constants.GL_INT, "int2"),
                /**
                 * Vertex attribute.
                 * Integer attribute (three Int32)
                 * @property int3
                 * @type Array_Number
                 */
                int3: createGetterSetter(Constants.GL_INT, "int3"),
                /**
                 * Vertex attribute.
                 * Integer attribute (four Int32)
                 * @property int4
                 * @type Array_Number
                 */
                int4: createGetterSetter(Constants.GL_INT, "int4"),
                /**
                 * Vertex attribute.
                 * indices (integer).
                 * indices is shortcut for subMeshes[0]
                 * @property indices
                 * @type Array_Number
                 */
                indices: {
                    get: function () {
                        if (_indices === 0) {
                            return null;
                        }
                        return _indices[0];
                    },
                    set: function (newValue) {
                        if (newValue && !(newValue instanceof Uint16Array)) {
                            newValue = new Uint16Array(newValue);
                        }
                        if (_indices[0] && isVertexDataInitialized()) {
                            clearInterleavedData();
                        }
                        if (newValue) {
                            _indices[0] = newValue;
                        }
                    }
                },
                /**
                 * indices (integer)
                 * @property subMeshes
                 * @type Array_Array_Number
                 */
                subMeshes: {
                    get: function () {
                        return _indices;
                    },
                    set: function (newValue) {
                        var i;
                        for (i = 0; i < newValue.length; i++) {
                            if (newValue[i] && !(newValue[i] instanceof Uint16Array)) {
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
                meshType: {
                    get: function () {
                        return _meshType;
                    },
                    set: function (newValue) {
                        if (ASSERT) {
                            if (newValue !== Constants.GL_LINES &&
                                    newValue !== Constants.GL_TRIANGLES &&
                                    newValue !== Constants.GL_TRIANGLE_FAN &&
                                    newValue !== Constants.GL_TRIANGLE_STRIP) {
                                Util.fail("MeshData.meshType must be GL_TRIANGLES, GL_TRIANGLE_FAN or GL_TRIANGLE_STRIP");
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
            this.isValid = function () {
                if (!isVertexDataInitialized() && isInterleavedDataInitialized()) {
                    createVertexDataFromInterleavedData();
                }
                var vertexCount = data.vertex.length / 3,
                    j,
                    i;
                for (j = 0; j < _indices.length; j++) {
                    for (i = _indices[j].length - 1; i >= 0; i--) {
                        if (_indices[j][i] >= vertexCount) {
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
             * @param {kick.math.Mat4} transformMatrix
             * @return {kick.mesh.MeshData} transformed mesh
             */
            this.transform = function (transformMatrix) {
                var copy = new MeshData(this),
                    wrappedVec3Array = Vec3.wrapArray(copy.vertex),
                    j;
                for (j = wrappedVec3Array.length - 1; j >= 0; j--) {
                    Mat4.multiplyVec3(transformMatrix, wrappedVec3Array[j]);
                }
                return copy;
            };
            /**
             * Combine two meshes and returns the combined mesh as a new Mesh object.<br>
             * The two meshes must have the same meshType. Only vertex attributes existing in
             * both mesh objects are transferred<br>
             * Triangle fans cannot be combined
             * @method combine
             * @param {kick.mesh.MeshData} secondMesh
             * @param {kick.math.Mat4} transform Optional transformation matrix
             * @return {kick.mesh.MeshData} mesh object or null if incompatible objects
             */
            this.combine = function (secondMesh, transform) {
                if (thisObj.meshType !== secondMesh.meshType || thisObj.meshType === Constants.GL_TRIANGLE_FAN) {
                    if (ASSERT) {
                        if (thisObj.meshType !== secondMesh.meshType) {
                            Util.fail("Mesh.combine does not support different meshTypes");
                        } else {
                            Util.fail("Mesh.combine does not support triangle fans");
                        }
                        return null;
                    }
                    return null;
                }
                var dataNames = ["vertex", "normal", "uv1", "uv2", "tangent", "color", "int1", "int2", "int3", "int4", "indices"],
                    i,
                    name,
                    appendObject,
                    newConfig;

                for (i = dataNames.length - 1; i >= 0; i--) {
                    name = dataNames[i];
                    if (!thisObj[name] || !secondMesh[name]) {
                        dataNames.splice(i, 1); // remove dataName from array
                    }
                }

                appendObject = function (config, source, indexOffset) {
                    var i, j, name, data, len;
                    for (i = dataNames.length - 1; i >= 0; i--) {
                        name = dataNames[i];
                        if (!config[name]) { // if undefined
                            config[name] = Util.typedArrayToArray(source[name]);
                        } else {
                            data = source[name];
                            if (indexOffset && name === "indices") {
                                // take a copy
                                data = new Uint16Array(data);
                                // add offset to copy
                                len = data.length;
                                for (j = 0; j < len; j++) {
                                    data[j] += indexOffset;
                                }
                            }
                            for (j = 0; j < data.length; j++) {
                                config[name].push(data[j]);
                            }
                        }
                    }
                };

                newConfig = {
                    meshType: thisObj.meshType
                };

                if (transform) {
                    secondMesh = secondMesh.transform(transform);
                }

                appendObject(newConfig, thisObj, 0);
                appendObject(newConfig, secondMesh, this.vertex.length / 3);

                if (thisObj.meshType === Constants.GL_TRIANGLE_STRIP) {
                    // create two degenerate triangles to connect the two triangle strips
                    newConfig.indices.splice(thisObj.indices, 0, newConfig.indices[thisObj.indices.length], newConfig.indices[thisObj.indices.length + 1]);
                }

                return new MeshData(newConfig);
            };

            (function init() {
                if (!config) {
                    config = {};
                }

                var copyVertexData = function () {
                        thisObj.vertex = config.vertex ? new Float32Array(config.vertex) : null;
                        thisObj.normal = config.normal ? new Float32Array(config.normal) : null;
                        thisObj.uv1 = config.uv1 ? new Float32Array(config.uv1) : null;
                        thisObj.uv2 = config.uv2 ? new Float32Array(config.uv2) : null;
                        thisObj.tangent = config.tangent ? new Float32Array(config.tangent) : null;
                        thisObj.color = config.color ? new Float32Array(config.color) : null;
                        thisObj.int1 = config.int1 ? new Int32Array(config.int1) : null;
                        thisObj.int2 = config.int2 ? new Int32Array(config.int2) : null;
                        thisObj.int3 = config.int3 ? new Int32Array(config.int3) : null;
                        thisObj.int4 = config.int4 ? new Int32Array(config.int4) : null;
                    },
                    copyInterleavedData = function () {
                        thisObj.interleavedArray = config.interleavedArray;
                        thisObj.interleavedArrayFormat = config.interleavedArrayFormat;
                        thisObj.vertexAttrLength = config.vertexAttrLength;
                    };

                if (config instanceof MeshData) {
                    if (config.isVertexDataInitialized()) {
                        copyVertexData();
                    } else {
                        if (ASSERT) {
                            if (!config.isInterleavedDataInitialized()) {
                                Util.fail("Either vertex or interleaved data should be initialized");
                            }
                        }
                        copyInterleavedData();
                    }
                } else {
                    if (config.vertex) {
                        copyVertexData();
                    } else if (config.interleavedArray) {
                        copyInterleavedData();
                    }
                }
                thisObj.name = config.name;
                thisObj.indices = config.indices;
                thisObj.meshType = config.meshType || Constants.GL_TRIANGLES;
            }());
        };

        /**
         * Recalculate the angle weighted vertex normals based on the triangle mesh
         * @method recalculateNormals
         */
        MeshData.prototype.recalculateNormals = function () {
            var vertexCount = this.vertex.length / 3,
                triangleCount = this.indices.length / 3,
                triangles = this.indices,
                vertex = Vec3.wrapArray(this.vertex),
                a,
                normalArrayRef = {},
                normalArray = Vec3.array(vertexCount, normalArrayRef),
                v1v2 = Vec3.create(),
                v1v3 = Vec3.create(),
                v2v3Alias = v1v3,
                temp = v1v2,
                weight1,
                weight2,
                normal = Vec3.create(),
                i1,
                i2,
                i3,
                v1,
                v2,
                v3;

            for (a = 0; a < triangleCount; a++) {
                i1 = triangles[a * 3];
                i2 = triangles[a * 3 + 1];
                i3 = triangles[a * 3 + 2];

                v1 = vertex[i1];
                v2 = vertex[i2];
                v3 = vertex[i3];

                Vec3.subtract(v2, v1, v1v2);
                Vec3.subtract(v3, v1, v1v3);
                Vec3.normalize(v1v2);
                Vec3.normalize(v1v3);
                Vec3.cross(v1v2, v1v3, normal);
                Vec3.normalize(normal);

                weight1 = Math.acos(Math.max(-1, Math.min(1, Vec3.dot(v1v2, v1v3))));
                Vec3.subtract(v3, v2, v2v3Alias);
                Vec3.normalize(v2v3Alias);
                weight2 = Math.PI - Math.max(-1, Math.min(1, Math.acos(Vec3.dot(v1v2, v2v3Alias))));
                Vec3.add(normalArray[i1], Vec3.scale(normal, weight1, temp));
                Vec3.add(normalArray[i2], Vec3.scale(normal, weight2, temp));
                Vec3.add(normalArray[i3], Vec3.scale(normal, Math.PI - weight1 - weight2, temp));
            }
            for (a = 0; a < vertexCount; a++) {
                Vec3.normalize(normalArray[a]);
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
        MeshData.prototype.recalculateTangents = function () {
            if (this.meshType !== Constants.GL_TRIANGLES) {
                return false;
            }
            var vertex = Vec3.wrapArray(this.vertex),
                vertexCount = vertex.length,
                normal = Vec3.wrapArray(this.normal),
                texcoord = this.uv1,
                triangle = this.indices,
                triangleCount = triangle.length / 3,
                tangent = this.tangent,
                tan1 = Vec3.array(vertexCount),
                tan2 = Vec3.array(vertexCount),
                a,
                tmp = Vec3.create(),
                tmp2 = Vec3.create(),
                i1,
                i2,
                i3,
                v1,
                v2,
                v3,
                w1,
                w2,
                w3,
                x1,
                x2,
                y1,
                y2,
                z1,
                z2,
                s1,
                s2,
                t1,
                t2,
                r,
                t,
                n,
                sdir,
                tdir;

            for (a = 0; a < triangleCount; a++) {
                i1 = triangle[a * 3];
                i2 = triangle[a * 3 + 1];
                i3 = triangle[a * 3 + 2];

                v1 = vertex[i1];
                v2 = vertex[i2];
                v3 = vertex[i3];

                w1 = texcoord[i1];
                w2 = texcoord[i2];
                w3 = texcoord[i3];

                x1 = v2[0] - v1[0];
                x2 = v3[0] - v1[0];
                y1 = v2[1] - v1[1];
                y2 = v3[1] - v1[1];
                z1 = v2[2] - v1[2];
                z2 = v3[2] - v1[2];

                s1 = w2[0] - w1[0];
                s2 = w3[0] - w1[0];
                t1 = w2[1] - w1[1];
                t2 = w3[1] - w1[1];

                r = 1.0 / (s1 * t2 - s2 * t1);
                sdir = Vec3.create([(t2 * x1 - t1 * x2) * r,
                    (t2 * y1 - t1 * y2) * r,
                    (t2 * z1 - t1 * z2) * r]);
                tdir = Vec3.create([(s1 * x2 - s2 * x1) * r,
                    (s1 * y2 - s2 * y1) * r,
                    (s1 * z2 - s2 * z1) * r]);

                Vec3.add(tan1[i1], sdir);
                Vec3.add(tan1[i2], sdir);
                Vec3.add(tan1[i3], sdir);

                Vec3.add(tan2[i1], tdir);
                Vec3.add(tan2[i2], tdir);
                Vec3.add(tan2[i3], tdir);
            }
            if (!tangent) {
                tangent = new Float32Array(vertexCount * 4);
                this.tangent = tangent;
            }
            tangent = Vec4.wrapArray(tangent);

            for (a = 0; a < vertexCount; a++) {
                n = normal[a];
                t = tan1[a];

                // Gram-Schmidt orthogonalize
                // tangent[a] = (t - n * Dot(n, t)).Normalize();
                Vec3.subtract(t, n, tmp);
                Vec3.dot(n, t, tmp2);
                Vec3.set(Vec3.normalize(Vec3.multiply(tmp, tmp2)), tangent[a]);

                // Calculate handedness
                // tangent[a].w = (Dot(Cross(n, t), tan2[a]) < 0.0F) ? -1.0F : 1.0F;
                tangent[a][3] = (Vec3.dot(Vec3.cross(n, t, Vec3.create()), tan2[a]) < 0.0) ? -1.0 : 1.0;
            }
            return true;
        };

        return MeshData;
    });