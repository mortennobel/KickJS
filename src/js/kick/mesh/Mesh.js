define(["kick/core/ProjectAsset", "kick/core/Constants", "kick/core/Util", "./MeshData", "kick/core/EngineSingleton"], function (ProjectAsset, Constants, Util, MeshData, EngineSingleton) {
    "use strict";


    /**
     * @module kick.mesh
     */
    var ASSERT = Constants._ASSERT;

    /**
     * A Mesh object allows you to bind and render a MeshData object
     * @class Mesh
     * @namespace kick.mesh
     * @constructor
     * @param {Object} config
     * @extends kick.core.ProjectAsset
     */
    return function (config) {
        // extend ProjectAsset
        ProjectAsset(this, config, "kick.mesh.Mesh");
        if (ASSERT){
            if (config === EngineSingleton.engine){
                Util.fail("Mesh constructor changed - engine parameter is removed");
            }
        }
        var engine = EngineSingleton.engine,
            gl = engine.gl,
            glState = engine.glState,
            vertexArrayObjectExtension = glState.vertexArrayObjectExtension,
            vertexArrayObject = {},
            meshVertexAttBuffer,
            interleavedArrayFormat,
            interleavedArrayFormatArray = [],
            meshVertexIndexBuffer = 0,
            meshVertexBufferOffsetBytes = [],
            _name,
            _meshData,
            _dataURI = "memory://void",
            _aabb = null,
            thisObj = this,
            c = Constants,
            vertexAttrLength = 0,
            meshType,
            meshElements = [],
            deleteBuffersAndVertexArrayObjects = function () {
                if (meshVertexIndexBuffer){
                    gl.deleteBuffer(meshVertexIndexBuffer);
                    meshVertexIndexBuffer = 0;
                }
                meshVertexBufferOffsetBytes.length = 0;
                if (typeof meshVertexAttBuffer === "number") {
                    gl.deleteBuffer(meshVertexAttBuffer);
                    meshVertexAttBuffer = null;
                }
                meshElements.length = 0;
                for (var name in vertexArrayObject){
                    vertexArrayObjectExtension.deleteVertexArrayOES(vertexArrayObject[name]);
                }
                vertexArrayObject = {};
            },
            createInterleavedArrayFormatArray = function () {
                var obj,
                    descName;
                interleavedArrayFormatArray.length = 0;
                for (descName in interleavedArrayFormat) {
                    if (interleavedArrayFormat.hasOwnProperty(descName)) {
                        obj = interleavedArrayFormat[descName];
                        if (!obj.name) {
                            obj.name = descName;
                        }
                        interleavedArrayFormatArray.push(obj);
                    }
                }
            },
            /**
             * Copy data to the vertex buffer object (VBO)
             * @method updateData
             * @private
             */
            updateData = function () {
                var subMeshes = _meshData.subMeshes,
                    i,
                    indexLen,
                    indicesSize = 0,
                    meshVertexIndexBufferConcat;
                // delete current buffers and VAOs
                deleteBuffersAndVertexArrayObjects();

                interleavedArrayFormat = _meshData.interleavedArrayFormat;
                createInterleavedArrayFormatArray();
                vertexAttrLength = _meshData.vertexAttrLength;
                meshType = _meshData.meshType;

                meshVertexAttBuffer = gl.createBuffer();
                gl.bindBuffer(c.GL_ARRAY_BUFFER, meshVertexAttBuffer);
                gl.bufferData(c.GL_ARRAY_BUFFER, _meshData.interleavedArray, c.GL_STATIC_DRAW);

                for (i = 0; i < subMeshes.length; i++) {
                    meshVertexBufferOffsetBytes.push(indicesSize * 2);
                    indexLen = subMeshes[i].length;
                    meshElements[i] = indexLen;
                    indicesSize += indexLen
                }
                meshVertexIndexBufferConcat = new Uint16Array(indicesSize);
                for (i = 0; i < subMeshes.length; i++) {
                    meshVertexIndexBufferConcat.set(subMeshes[i], meshVertexBufferOffsetBytes[i] / 2);
                }
                meshVertexIndexBuffer = gl.createBuffer();
                gl.bindBuffer(c.GL_ELEMENT_ARRAY_BUFFER, meshVertexIndexBuffer);
                gl.bufferData(c.GL_ELEMENT_ARRAY_BUFFER, meshVertexIndexBufferConcat, c.GL_STATIC_DRAW);
            },
            contextListener = {
                contextLost: function () {
                    meshVertexIndexBuffer = 0;
                    meshVertexAttBuffer = null;
                    gl = null;
                },
                contextRestored: function (newGl) {
                    gl = newGl;
                    vertexArrayObject = {};
                    vertexArrayObjectExtension = glState.vertexArrayObjectExtension,
                    updateData();
                }
            },
            bindBuffers = function(shader){
                var i,
                    interleavedDataDescriptor,
                    name,
                    shaderAttribute,
                    activeAttribute,
                    attributeIndex;
                gl.bindBuffer(Constants.GL_ARRAY_BUFFER, meshVertexAttBuffer);
                for (i = 0; i < interleavedArrayFormatArray.length; i++) {
                    interleavedDataDescriptor = interleavedArrayFormatArray[i];
                    name = interleavedDataDescriptor.name;
                    shaderAttribute = shader.lookupAttribute[name];
                    if (typeof (shaderAttribute) !== 'undefined') {
                        gl.enableVertexAttribArray(shaderAttribute);
                        gl.vertexAttribPointer(shaderAttribute, interleavedDataDescriptor.size,
                            interleavedDataDescriptor.type, false, vertexAttrLength, interleavedDataDescriptor.pointer);
                    }
                }
                gl.bindBuffer(Constants.GL_ELEMENT_ARRAY_BUFFER, meshVertexIndexBuffer);
                if (ASSERT) {
                    for (i = shader.activeAttributes.length - 1; i >= 0; i--) {
                        activeAttribute = shader.activeAttributes[i];
                        if (interleavedArrayFormat && !(interleavedArrayFormat[activeAttribute.name])) {
                            Util.fail("Shader wants " + activeAttribute.name + " but mesh does not have it.");
                            attributeIndex = shader.lookupAttribute[activeAttribute.name];
                            gl.disableVertexAttribArray(attributeIndex);
                            switch (activeAttribute.type) {
                            case c.GL_FLOAT:
                                gl.vertexAttrib1f(attributeIndex, 0.0);
                                break;
                            case c.GL_FLOAT_VEC2:
                                gl.vertexAttrib2f(attributeIndex, 0.0, 0.0);
                                break;
                            case c.GL_FLOAT_VEC3:
                                gl.vertexAttrib3f(attributeIndex, 0.0, 0.0, 0.0);
                                break;
                            case c.GL_FLOAT_VEC4:
                                gl.vertexAttrib4f(attributeIndex, 0.0, 0.0, 0.0, 0.0);
                                break;
                            default:
                                Util.fail("Shader wants " + activeAttribute.name + " no default value for type.");
                                break;
                            }
                        }
                    }
                }
            };

        engine.addContextListener(contextListener);

        Object.defineProperties(this, {
            /**
             * Axis aligned bounding box.
             * Readonly.
             * @property aabb
             * @type kick.math.Aabb
             */
            aabb: {
                get: function () {
                    if (!_aabb && _meshData) {
                        _aabb = _meshData.aabb;
                    }
                    return _aabb;
                }
            },
            /**
             * @property name
             * @type String
             */
            name: {
                get: function () {
                    return _name;
                },
                set: function (newValue) {
                    _name = newValue || "Mesh";
                }
            },
            /**
             * Setting this property to something will update the data in WebGL. Note that
             * changing a MeshData object will not itself update anything.
             * @property meshData
             * @type kick.mesh.MeshData
             */
            meshData: {
                get: function () {
                    return _meshData;
                },
                set: function (newValue) {
                    if (ASSERT) {
                        if (newValue && !(newValue instanceof MeshData)) {
                            Util.fail("Mesh.meshData must be instanceof kick.mesh.MeshData");
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
            dataURI: {
                get: function () {
                    return _dataURI;
                },
                set: function (newValue) {
                    thisObj.setDataURI(newValue, true);
                }
            }
        });

        /**
         * @method setDataURI
         * @param {String} newValue
         * @param {Boolean} automaticGetMeshData optional. if true the mesh data is attempted to be loaded by resourceLoader.getMeshData
         * @param resourceTracker {ResourceTracker} Optional
         */
        this.setDataURI = function (newValue, automaticGetMeshData, resourceTracker) {
            if (newValue !== _dataURI) {
                _dataURI = newValue;
                if (automaticGetMeshData) {
                    engine.resourceLoader.getMeshData(newValue, thisObj, resourceTracker);
                }
            }
        };

        Util.applyConfig(this, config, ["uid"]);


        /**
         * This function verifies that the mesh has the vertex attributes (normals, uvs, tangents) that the shader uses.
         * @method verify
         * @param {kick.material.Shader} shader
         * @return {Array_String} list of missing vertex attributes in mesh or null if no missing attributes
         */
        this.verify = function (shader) {
            var missingVertexAttributes = [],
                found,
                attName;
            for (attName in shader.lookupAttribute) {
                if (typeof (attName) === "string") {
                    found = interleavedArrayFormat[attName];
                    if (!found) {
                        missingVertexAttributes.push(attName);
                    }
                }
            }
            if (missingVertexAttributes.length === 0) {
                return null;
            }
            return null;
        };

        /**
         * Bind the vertex attributes of the mesh to the shader
         * @method bind
         * @param {kick.material.Shader} shader
         */
        this.bind = vertexArrayObjectExtension ?
            function bindUsingVAO(shader) {
                shader.bind();

                if (glState.meshBuffer !== meshVertexAttBuffer || glState.meshShader !== shader) {
                    glState.meshBuffer = meshVertexAttBuffer;
                    glState.meshShader = shader;
                    var vao = vertexArrayObject[shader.uid];
                    if (!vao){
                        vao = vertexArrayObjectExtension.createVertexArrayOES();
                        vertexArrayObjectExtension.bindVertexArrayOES(vao);
                        vertexArrayObject[shader.uid] = vao;
                        bindBuffers(shader);
                    } else {
                        vertexArrayObjectExtension.bindVertexArrayOES(vao);
                    }
                }
            }:
            function bindDefault(shader) {
                shader.bind();

                if (glState.meshBuffer !== meshVertexAttBuffer || glState.meshShader !== shader) {
                    glState.meshBuffer = meshVertexAttBuffer;
                    glState.meshShader = shader;
                    bindBuffers(shader);
                }
            };

        /**
         * Renders the current mesh.
         * Assumes that the Mesh.bind(shader) has been called prior to this, to setup the mesh with the shader.
         * @method render
         * @param {Number} submeshIndex
         */
        this.render = function (submeshIndex) {
            gl.drawElements(meshType, meshElements[submeshIndex], c.GL_UNSIGNED_SHORT, meshVertexBufferOffsetBytes[submeshIndex]);
        };

        /**
         * Destroys the mesh data and deletes the associated resources
         * After this the mesh cannot be bound
         * @method destroy
         */
        this.destroy = function () {
            if (meshVertexAttBuffer !== null) {
                deleteBuffersAndVertexArrayObjects();
                engine.removeContextListener(contextListener);
                engine.project.removeResourceDescriptor(thisObj.uid);
            }

        };

        /**
         * @method toJSON
         * @return {Object} data object
         */
        this.toJSON = function () {
            if (ASSERT) {
                if (!_dataURI) {
                    Util.fail("_dataURI not defined");
                }
            }
            return {
                uid: thisObj.uid,
                name: _name,
                dataURI: _dataURI
            };
        };

        this.init = function(config, resourceTracker){
            Util.applyConfig(this, config, ["uid", "dataURI"]);
            if (config.dataURI){
                thisObj.setDataURI(config.dataURI, true, resourceTracker);
            }
        };
    };
});