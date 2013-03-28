define(["kick/core/ProjectAsset", "kick/core/Util", "kick/core/Constants", "./Shader", "./MaterialUniform", "kick/core/EngineSingleton"],
    function (ProjectAsset, Util, Constants, Shader, MaterialUniform, EngineSingleton) {
        "use strict";

        /**
         * @module kick.material
         */
        var ASSERT = Constants._ASSERT;

        /**
         * Material configuration. Stores a material configuration and a shader.
         * @example
         *      var material = new KICK.material.Material({
         *      shader: project.load(project.ENGINE_SHADER_DIFFUSE),
         *          uniformData:{
         *              mainColor:[1.0,0.0,0.9,0.5],
         *              mainTexture: project.load(project.ENGINE_TEXTURE_WHITE)
         *          }
         *      });
         * @class Material
         * @namespace kick.material
         * @constructor
         * @param {Object} config
         * @extends kick.core.ProjectAsset
         */
        return function (config) {
            // extend ProjectAsset
            ProjectAsset(this, config, "kick.material.Material");
            if (ASSERT){
                if (config === EngineSingleton.engine){
                    Util.fail("Material constructor changed - engine parameter is removed");
                }
            }
            var engine = EngineSingleton.engine,
                _name = "Material",
                _shader = null,
                _uniforms = [],
                shaderChangeListeners = [],
                thisObj = this,
                gl = engine.gl,
                _renderOrder = 0,
                contextRestored= function (newGL) {
                    gl = newGL;
                    // force shader update (will re-initialize uniforms)
                    if (_shader) {
                        _shader.contextRestored(newGL);
                        var s = _shader;
                        _shader = null;
                        thisObj.shader = s;
                    }
                },
                notifyShaderChange = function(){
                    var i;
                    for (i = 0; i < shaderChangeListeners.length; i++) {
                        shaderChangeListeners[i](thisObj);
                    }
                },
                /**
                 * Called when a shader is set or changed.
                 * Add location and type information to each uniform.
                 * Besides it checks that the uniforms exists in the shader
                 * (if not the default uniforms are added).
                 * @method decorateUniforms
                 * @private
                 */
                decorateUniforms = function () {
                    _renderOrder = _shader.renderOrder;
                    notifyShaderChange();
                    var i, uniform,
                        foundUniformNames = {},
                        name,
                        element;
                    for (i = _uniforms.length - 1; i >= 0; i--) {
                        uniform = _shader.lookupUniform[_uniforms[i].name];
                        if (uniform) {
                            _uniforms[i].type = uniform.type;
                            _uniforms[i].location = uniform.location;
                            foundUniformNames[_uniforms[i].name] = true;
                        } else {
                            _uniforms.splice(i, 1); // remove element from array
                        }
                    }
                    // add items not found
                    for (i = 0; i < _shader.materialUniforms.length; i++) {
                        uniform = _shader.materialUniforms[i];
                        name = uniform.name;
                        if (!foundUniformNames.hasOwnProperty(name)) {
                            // add default name
                            element = thisObj.setUniform(name, _shader.defaultUniforms[name]);
                            element.location = uniform.location;
                            element.type = uniform.type;
                        }
                    }
                };

            Object.defineProperties(this, {
                /**
                 * @property engine
                 * @type kick.core.Engine
                 */
                engine: {
                    value: engine
                },
                /**
                 * @property name
                 * @type String
                 */
                name: {
                    get: function () { return _name; },
                    set: function (newValue) { _name = newValue; }
                },
                /**
                 * @property shader
                 * @type kick.material.Shader
                 */
                shader: {
                    get: function () {
                        return _shader;
                    },
                    set: function (newValue) {
                        if (!newValue instanceof Shader) {
                            Util.fail("kick.material.Shader expected");
                        }
                        if (_shader !== newValue) {
                            if (_shader) {
                                _shader.removeEventListener("shaderUpdated", decorateUniforms);
                            }
                            _shader = newValue;
                            if (_shader) {
                                _renderOrder = _shader.renderOrder;
                                decorateUniforms();
                                _shader.addEventListener("shaderUpdated", decorateUniforms);
                            }
                        }
                    }
                },
                /**
                 * Instead call setUniform
                 * @deprecated
                 * @property uniforms
                 * @type Object
                 */
                uniforms: {
                    value: null
                },
                /**
                 * @property renderOrder
                 * @type Number
                 */
                renderOrder: {
                    get: function () {
                        return _renderOrder;
                    }
                }
            });

            /**
             * Listener is notified whenever shader is changed
             * @method addShaderChangeListeners
             * @param {Function} listenerFn
             */
            this.addShaderChangeListener = function (listenerFn) {
                if (ASSERT) {
                    if (typeof listenerFn !== "function") {
                        Util.warn("Material.addShaderChangeListener: listenerFn not function");
                    }
                }
                shaderChangeListeners.push(listenerFn);
            };

            /**
             * @method removeShaderChangeListener
             * @param {Function} listenerFn
             */
            this.removeShaderChangeListener = function (listenerFn) {
                if (ASSERT) {
                    if (typeof listenerFn !== "function") {
                        Util.warn("Material.removeShaderChangeListener: listenerFn not function");
                    }
                }
                Util.removeElementFromArray(shaderChangeListeners, listenerFn, true);
            };

            /**
             * Bind material uniforms
             * @method bind
             * @param {Number} currentTexture
             * @protected
             * @return {Number}
             */
            this.bind = function (currentTexture) {
                var i,
                    value,
                    location;
                for (i = 0; i < _uniforms.length; i++) {
                    value = _uniforms[i].value;
                    location = _uniforms[i].location;
                    switch (_uniforms[i].type) {
                    case Constants.GL_FLOAT:
                        gl.uniform1fv(location, value);
                        break;
                    case Constants.GL_FLOAT_MAT2:
                        gl.uniformMatrix2fv(location, false, value);
                        break;
                    case Constants.GL_FLOAT_MAT3:
                        gl.uniformMatrix3fv(location, false, value);
                        break;
                    case Constants.GL_FLOAT_MAT4:
                        gl.uniformMatrix4fv(location, false, value);
                        break;
                    case Constants.GL_FLOAT_VEC2:
                        gl.uniform2fv(location, value);
                        break;
                    case Constants.GL_FLOAT_VEC3:
                        gl.uniform3fv(location, value);
                        break;
                    case Constants.GL_FLOAT_VEC4:
                        gl.uniform4fv(location, value);
                        break;
                    case Constants.GL_INT:
                        gl.uniform1iv(location, value);
                        break;
                    case Constants.GL_INT_VEC2:
                        gl.uniform2iv(location, value);
                        break;
                    case Constants.GL_INT_VEC3:
                        gl.uniform3iv(location, value);
                        break;
                    case Constants.GL_INT_VEC4:
                        gl.uniform4iv(location, value);
                        break;
                    case Constants.GL_SAMPLER_CUBE:
                    case Constants.GL_SAMPLER_2D:
                        value.bind(currentTexture);
                        gl.uniform1i(location, currentTexture);
                        currentTexture++;
                        break;
                    }
                }
                return currentTexture;
            };

            /**
             * Bind material uniforms. Returns undefined or null if value is undefined or null (or uniform not found)
             * @method setUniform
             * @param {String} name
             * @param {Float32Array|Int32Array|kick.texture.Texture} value
             * @return {kick.material.MaterialUniform}
             */
            this.setUniform = function (name, value) {
                if (value === undefined || value === null) {
                    return null;
                }
                var foundElement,
                    i;
                for (i = 0; i < _uniforms.length && !foundElement; i++) {
                    if (_uniforms[i].name === name) {
                        foundElement = _uniforms[i];
                        foundElement.value = value;
                    }
                }

                if (foundElement && _shader) {
                    _shader.markUniformUpdated();
                } else if (!foundElement) {
                    foundElement = new MaterialUniform({
                        name: name,
                        value: value
                    });
                    _uniforms.push(foundElement);
                }
                if (ASSERT) {
                    if (_shader) {
                        if (typeof (value) === "undefined") {
                            Util.fail("Type of value is undefined");
                        }
                    }
                }
                return foundElement;
            };

            /**
             * @method getUniform
             * @param name
             * @return {Float32Array|Int32Array|kick.texture.Texture}
             */
            this.getUniform = function (name) {
                var i;
                for (i = 0; i < _uniforms.length; i++) {
                    if (_uniforms[i].name === name) {
                        return _uniforms[i].value;
                    }
                }
                return null;
            };

            /**
             * @method destroy
             */
            this.destroy = function () {
                thisObj.shader = null;
                engine.project.removeResourceDescriptor(thisObj.uid);
                engine.removeEventListener('contextRestored', contextRestored);
            };

            /**
             * Returns a JSON representation of the material<br>
             * @method toJSON
             * @return {string}
             */
            this.toJSON = function () {
                var i,
                    serializedUniforms = {};
                for (i = 0; i < _uniforms.length; i++) {
                    serializedUniforms[_uniforms[i].name] = _uniforms[i].toJSON().value;
                }
                return {
                    uid: thisObj.uid,
                    name: _name,
                    shader: Util.getJSONReference(_shader),
                    uniformData: serializedUniforms // uniformData only used during serialization
                };
            };

            this.init = function(config) {
                var conf = config || {},
                    uniformData = conf.uniformData,
                    name,
                    value,
                    configCopy = {
                        uid: conf .uid || 0,
                        name: conf.name,
                        shader: conf.shader
                    };
                engine.addEventListener('contextRestored', contextRestored);
                Util.applyConfig(thisObj, configCopy, ["uid"]);
                if (!_shader || !_shader.isValid()) {
                    if (conf.shader) {
                        Util.warn("Problem using shader in material. ", conf.shader);
                    }
                    thisObj.shader = engine.project.load(engine.project.ENGINE_SHADER___ERROR);
                }
                if (uniformData) {
                    for (name in uniformData) {
                        if (uniformData.hasOwnProperty(name)) {
                            if (_shader.lookupUniform[name]) { // if found in shader
                                value = uniformData[name];
                                value = Shader.convertUniformValue(_shader.lookupUniform[name].type, value, engine);
                                thisObj.setUniform(name, value);
                            } else {
                                Util.warn("Cannot find uniform " + name + " in shader. ");
                            }
                        }
                    }
                }
                decorateUniforms();
            };
            this.init(config);
        };

    });