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
    "use strict"; // force strict ECMAScript 5
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
    var material = KICK.namespace("KICK.material"),
        math = KICK.namespace("KICK.math"),
        mat3 = math.mat3,
        mat4 = math.mat4,
        vec4 = math.vec4,
        core = KICK.namespace("KICK.core"),
        applyConfig = core.Util.applyConfig,
        c = KICK.core.Constants,
        ASSERT = c._ASSERT,
        DEBUG = c._DEBUG,
        fail = core.Util.fail,
        warn = core.Util.warn,
        uint32ToVec4 = KICK.core.Util.uint32ToVec4,
        tempMat4 = mat4.create(),
        tempMat3 = mat3.create(),
        tmpVec4 = vec4.create(),
        vec3Zero = math.vec3.create(),
        isMaterialUniformName = function (name) {return name.charAt(0) !== "_"; },
        shaderUniqueNameCounter = 0,
        shaderUniqueVertionCounter = 0,
        /*
         * If the uniform value is not in a valid format, the
         * @param {Number} type
         * @param {Object} uniformValue
         * @param {KICK.core.Engine} engine
         */
        convertUniformValue = function (type, uniformValue, engine) {
            if (type === c.GL_SAMPLER_2D || type === c.GL_SAMPLER_CUBE) {
                if (uniformValue && typeof uniformValue.ref === 'number') {
                    return engine.project.load(uniformValue.ref);
                }
            }
            if (Array.isArray(uniformValue) || typeof uniformValue === 'number') {
                var array = uniformValue;
                if (typeof array === 'number') {
                    array = [array];
                }
                if (type === c.GL_INT || type === c.GL_INT_VEC2 || type === c.GL_INT_VEC3 || type === c.GL_INT_VEC4) {
                    return new Int32Array(array);
                } else {
                    return new Float32Array(array);
                }
            }
            return uniformValue;
        };

    /**
     * @class UniformDescriptor
     * @namespace KICK.material
     * @constructor
     * @param {String} name
     * @param {Number} type the WebGL Uniform type
     * @param {Number} size
     * @param {WebGLUniformLocation} location
     */
    material.UniformDescriptor = function (name, type, size, location) {
        /**
         * @property name
         * @type String
         */
        this.name = name;
        /**
         * the WebGL Uniform type
         * @property type
         * @type Number
         */
        this.type = type;
        /**
         * @property size
         * @type Number
         */
        this.size = size;
        /**
         * @property location
         * @type WebGLUniformLocation
         */
        this.location = location;
        Object.freeze(this);
    };

    /**
     * GLSL Shader object<br>
     * The shader basically encapsulates a GLSL shader programs, but makes sure that the correct
     * WebGL settings are set when the shader is bound (such as if blending is enabled or not).<br>
     * The Shader extend the default WebGL GLSL in the following way:
     * <ul>
     *     <li>
     *         <code>#pragma include &lt;filename&gt;</code> includes of the following KickJS file as a string:
     *         <ul>
     *             <li>light.glsl</li>
     *             <li>shadowmap.glsl</li>
     *         </ul>
     *     </li>
     *     <li>Auto binds the following uniform variables:
     *      <ul>
     *          <li><code>_mvProj</code> (mat4) Model view projection matrix</li>
     *          <li><code>_m</code> (mat4) Model matrix</li>
     *          <li><code>_mv</code> (mat4) Model view matrix</li>
     *          <li><code>_worldCamPos</code> (vec4) Camera position in world coordinate</li>
     *          <li><code>_world2object</code> (mat4) World to Object coordinate transformation</li>
     *          <li><code>_norm</code> (mat3) Normal matrix (the inverse transpose of the upper 3x3 model view matrix - needed when scaling is scaling is non-uniform)</li>
     *          <li><code>_time</code> (float) Run time of engine</li>
     *          <li><code>_ambient</code> (vec3) Ambient light</li>
     *          <li><code>_dLight</code> (mat3) Directional light matrix. </li>
     *          <li><code>_dLight[0]</code> (vec3) Directional light direction in eye coordinates.</li>
     *          <li><code>_dLight[1]</code> (vec3) Directional light color intensity</li>
     *          <li><code>_dLight[2]</code> (vec3) Directional light half vector</li>
     *          <li><code>_dLightWorldDir</code> (vec3) Directional light world direction</li>
     *          <li><code>_pLights[n]</code> (mat3) Point light matrix</li>
     *          <li><code>_pLights[n][0]</code> (mat3) Point light id n position</li>
     *          <li><code>_pLights[n][1]</code> (mat3) Point light id n color intensity</li>
     *          <li><code>_pLights[n][2]</code> (mat3) Point light id n attenuation vector [const, linear, quadratic]</li>
     *
     *      </ul>
     *     </li>
     *     <li>Defines <code>SHADOW</code> (Boolean) and <code>LIGHTS</code> (Integer) based on the current configuration of the engine (cannot be modified runtime). </li>
     * </ul>
     * @class Shader
     * @namespace KICK.material
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @extends KICK.core.ProjectAsset
     */
    material.Shader = function (engine, config) {
        // extend ProjectAsset
        KICK.core.ProjectAsset(this);
        var gl = engine.gl,
            glState = engine.glState,
            thisObj = this,
            listeners = [],
            _shaderProgramId = -1,
            _depthMask = true,
            _faceCulling = core.Constants.GL_BACK,
            _zTest = core.Constants.GL_LESS,
            _blend = false,
            _blendSFactor = core.Constants.GL_SRC_ALPHA,
            _blendDFactor = core.Constants.GL_ONE_MINUS_SRC_ALPHA,
            _polygonOffsetEnabled = false,
            _polygonOffsetFactor = 2.5,
            _polygonOffsetUnits = 10.0,
            _renderOrder = 1000,
            _dataURI =  "memory://void",
            _name = "",
            blendKey,
            _activeUniforms = [],
            _engineUniforms = [],
            _materialUniforms = [],
            _lookupUniform = {},
            glslConstants = material.GLSLConstants,
            _vertexShaderSrc = glslConstants["__error_vs.glsl"],
            _fragmentShaderSrc = glslConstants["__error_fs.glsl"],
            _defaultUniforms,
            _errorLog = KICK.core.Util.fail,
            uniqueVersionCounter = -1,
            /**
             * Updates the blend key that identifies blend+blendSFactor+blendDFactor<br>
             * The key is used to fast determine if the blend settings needs to be updated
             * @method updateBlendKey
             * @private
             */
            updateBlendKey = function () {
                blendKey = (_blendSFactor + _blendDFactor * 10000) * (_blend ? -1 : 1);
            },
            /**
             * Calls the listeners registered for this shader
             * @method notifyListeners
             * @private
             */
            notifyListeners = function () {
                var i;
                for (i = 0; i < listeners.length; i++) {
                    listeners[i]();
                }
            },
            /**
             * Invoke shader compilation
             * @method compileShader
             * @param {String} str
             * @param {Boolean} isFragmentShader
             * @private
             */
            compileShader = function (str, isFragmentShader) {
                var shader,
                    infoLog,
                    c = KICK.core.Constants;
                str = material.Shader.getPrecompiledSource(engine, str);
                if (isFragmentShader) {
                    shader = gl.createShader(c.GL_FRAGMENT_SHADER);
                } else {
                    shader = gl.createShader(c.GL_VERTEX_SHADER);
                }

                gl.shaderSource(shader, str);
                gl.compileShader(shader);

                if (!gl.getShaderParameter(shader, c.GL_COMPILE_STATUS)) {
                    infoLog = gl.getShaderInfoLog(shader);
                    if (typeof _errorLog === "function") {
                        _errorLog(infoLog);
                    }
                    return null;
                }

                return shader;
            },
            updateCullFace = function () {
                var currentFaceCulling = glState.faceCulling;
                if (currentFaceCulling !== _faceCulling) {
                    if (_faceCulling === core.Constants.GL_NONE) {
                        gl.disable(c.GL_CULL_FACE);
                    } else {
                        if (!currentFaceCulling || currentFaceCulling === core.Constants.GL_NONE) {
                            gl.enable(c.GL_CULL_FACE);
                        }
                        gl.cullFace(_faceCulling);
                    }
                    glState.faceCulling = _faceCulling;
                }
            },
            updateDepthProperties = function () {
                if (glState.zTest !== _zTest) {
                    gl.depthFunc(_zTest);
                    glState.zTest = _zTest;
                }
                if (glState.depthMaskCache !== _depthMask) {
                    gl.depthMask(_depthMask);
                    glState.depthMaskCache = _depthMask;
                }
            },
            updateBlending = function () {
                if (glState.blendKey !== blendKey) {
                    glState.blendKey = blendKey;
                    if (_blend) {
                        gl.enable(KICK.core.Constants.GL_BLEND);
                    } else {
                        gl.disable(KICK.core.Constants.GL_BLEND);
                    }
                    gl.blendFunc(_blendSFactor, _blendDFactor);
                }
            },
            updatePolygonOffset = function () {
                if (glState.polygonOffsetEnabled !== _polygonOffsetEnabled) {
                    glState.polygonOffsetEnabled = _polygonOffsetEnabled;
                    if (_polygonOffsetEnabled) {
                        gl.enable(KICK.core.Constants.GL_POLYGON_OFFSET_FILL);
                    } else {
                        gl.disable(KICK.core.Constants.GL_POLYGON_OFFSET_FILL);
                    }
                }
                if (_polygonOffsetEnabled) {
                    gl.polygonOffset(_polygonOffsetFactor, _polygonOffsetUnits);
                }
            },
            getDefaultUniform = function (type, size) {
                switch (type) {
                case c.GL_FLOAT:
                    return new Float32Array(size);
                case c.GL_FLOAT_MAT2:
                    return new Float32Array(4 * size);
                case c.GL_FLOAT_MAT3:
                    return new Float32Array(9 * size);
                case c.GL_FLOAT_MAT4:
                    return new Float32Array(16 * size);
                case c.GL_FLOAT_VEC2:
                    return new Float32Array(2 * size);
                case c.GL_FLOAT_VEC3:
                    return new Float32Array(3 * size);
                case c.GL_FLOAT_VEC4:
                    return new Float32Array(4 * size);
                case c.GL_INT:
                    return new Int32Array(size);
                case c.GL_INT_VEC2:
                    return new Int32Array(2 * size);
                case c.GL_INT_VEC3:
                    return new Int32Array(3 * size);
                case c.GL_INT_VEC4:
                    return new Int32Array(4 * size);
                case c.GL_SAMPLER_CUBE:
                    if (size !== 1) {
                        fail("Texture arrays not currently supported");
                    }
                    return engine.project.load(engine.project.ENGINE_TEXTURE_CUBEMAP_WHITE);
                case c.GL_SAMPLER_2D:
                    if (size !== 1) {
                        fail("Texture arrays not currently supported");
                    }
                    return engine.project.load(engine.project.ENGINE_TEXTURE_WHITE);
                default:
                    fail("Unknown type");
                }
            },
            updateActiveUniforms = function (numberOfActiveUniforms) {
                var uniform,
                    uniformDescriptor,
                    uniformLocation,
                    oldDefaultUniforms = _defaultUniforms,
                    i,
                    defaultValue;
                _activeUniforms = [];
                _lookupUniform = {};
                _defaultUniforms = {};

                _materialUniforms.length = 0;
                _engineUniforms.length = 0;

                for (i = 0; i < numberOfActiveUniforms; i++) {
                    uniform = gl.getActiveUniform(_shaderProgramId, i);
                    uniformLocation = gl.getUniformLocation(_shaderProgramId, uniform.name);
                    if (DEBUG) {
                        uniformLocation.shader = thisObj;
                        uniformLocation.shaderVersion = uniqueVersionCounter;
                    }
                    uniformDescriptor = new material.UniformDescriptor(uniform.name, uniform.type, uniform.size, uniformLocation);
                    Object.freeze(uniformDescriptor);
                    _activeUniforms[i] = uniformDescriptor;
                    _lookupUniform[uniform.name] = uniformDescriptor;
                    if (isMaterialUniformName(uniform.name)) {
                        defaultValue = getDefaultUniform(uniform.type, uniform.size);
                        _defaultUniforms[uniform.name] = defaultValue;
                        _materialUniforms.push(uniformDescriptor);
                    } else {
                        _engineUniforms.push(uniformDescriptor);
                    }
                }
                // restore the old default uniforms (if any)
                if (oldDefaultUniforms) {
                    thisObj.defaultUniforms = oldDefaultUniforms;
                }
            };

        /**
         * Registers a listener to the shader.
         * @method addListener
         * @param {Function} listenerFn a function called when shader is updated
         */
        this.addListener = function (listenerFn) {
            if (ASSERT) {
                if (typeof listenerFn !== "function") {
                    warn("Shader.addListener: listenerFn not function");
                }
            }
            listeners.push(listenerFn);
        };

        /**
         * Removes a listener to the shader.
         * @method removeListener
         * @param {Function} listenerFn a function called when shader is updated
         */
        this.removeListener = function (listenerFn) {
            if (ASSERT) {
                if (typeof listenerFn !== "function") {
                    warn("Shader.removeListener: listenerFn not function");
                }
            }
            KICK.core.Util.removeElementFromArray(listeners, listenerFn, true);
        };

        /**
         * @method contextLost
         * @protected
         */
        this.contextLost = function () {
            gl = null;
            _shaderProgramId = -1;
            _activeUniforms.length = 0;
            _engineUniforms.length = 0;
            _materialUniforms.length = 0;
        };

        /**
         * This method is public and may be called multiple times (both from materials using the shader and from the engine)
         * @method contextRestored
         * @protected
         */
        this.contextRestored = function (newGL) {
            if (!gl) {
                gl = newGL;
                thisObj.apply();
            }
        };

        engine.addContextListener(this);

        Object.defineProperties(this, {
            /**
             * Lookup of uniform based on name.
             * for each name a KICK.material.UniformDescriptor object exist
             * @property lookupUniform
             * @type Object
             */
            lookupUniform: {
                get: function () { return _lookupUniform; }
            },
            /**
             * Array of Object with size,type, name and index properties
             * @property activeUniforms
             * @type Array_KICK.material.UniformDescriptor
             */
            activeUniforms: {
                get: function () { return _activeUniforms; }
            },
            /**
             * Array of Object with size,type, name and index properties
             * @property engineUniforms
             * @type Array Array_KICK.material.UniformDescriptor
             */
            engineUniforms: {
                get: function () { return _engineUniforms; }
            },
            /**
             * Array of Object with size,type, name and index properties
             * @property materialUniforms
             * @type Array Array_KICK.material.UniformDescriptor
             */
            materialUniforms: {
                get: function () { return _materialUniforms; }
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
             * When dataURI is specified the shader is expected to have its content from the dataURI.
             * This means when serializing the object only dataURI and name will be saved
             * @property dataURI
             * @type String
             */
            dataURI: {
                get: function () { return _dataURI; },
                set: function (newValue) {
                    if (_dataURI !== newValue) {
                        _dataURI = newValue;
                        if (_dataURI) { // load resource if not null
                            engine.resourceLoader.getShaderData(_dataURI, thisObj);
                        }
                    }
                }
            },
            /**
             * Get the gl context of the shader
             * @property gl
             * @type Object
             */
            gl: {
                value: gl
            },
            /**
             * Get the gl state
             * @property glState
             * @type Object
             */
            glState: {
                value: glState
            },
            /**
             * Get default configuration of shader uniforms
             * @property defaultUniforms
             * @type Object
             */
            defaultUniforms: {
                get: function () { return _defaultUniforms; },
                set: function (value) {
                    var name, type;
                    for (name in _defaultUniforms ) {
                        if (_defaultUniforms.hasOwnProperty(name) && value.hasOwnProperty(name)) {
                            type = _lookupUniform[name].type;
                            _defaultUniforms[name] = convertUniformValue(type, value[name], engine);
                        }
                    }
                }
            },
            /**
             * @property vertexShaderSrc
             * @type string
             */
            vertexShaderSrc: {
                get: function () { return _vertexShaderSrc; },
                set: function (value) {
                    if (typeof value !== "string") {
                        KICK.core.Util.fail("Shader.vertexShaderSrc must be a string");
                    }
                    _vertexShaderSrc = value;
                }
            },
            /**
             * @property fragmentShaderSrc
             * @type string
             */
            fragmentShaderSrc: {
                get: function () { return _fragmentShaderSrc; },
                set: function (value) {
                    if (typeof value !== "string") {
                        KICK.core.Util.fail("Shader.fragmentShaderSrc must be a string");
                    }
                    _fragmentShaderSrc = value;
                }
            },
            /**
             * Render order. Default value 1000. The following ranges are predefined:<br>
             * 0-999: Background. Mainly for skyboxes etc<br>
             * 1000-1999 Opaque geometry  (default)<br>
             * 2000-2999 Transparent. This queue is sorted in a back to front order before rendering.<br>
             * 3000-3999 Overlay
             * @property renderOrder
             * @type Number
             */
            renderOrder: {
                get: function () { return _renderOrder; },
                set: function (value) {
                    if (typeof value !== "number") {
                        KICK.core.Util.fail("Shader.renderOrder must be a number");
                    }
                    _renderOrder = value;
                }
            },
            /**
             * Function that will be invoked in case of error
             * @property errorLog
             * @type Function
             */
            errorLog: {
                get: function () {
                    return _errorLog;
                },
                set: function (value) {
                    if (ASSERT) {
                        if (value && typeof value !== 'function') {
                            KICK.core.Util.fail("Shader.errorLog should be a function (or null)");
                        }
                    }
                    _errorLog = value;
                }
            },
            /**
             * A reference to the engine object
             * @property engine
             * @type KICK.core.Engine
             */
            engine: {
                value: engine
            },
            /**
             * @property shaderProgramId
             * @type ShaderProgram
             */
            shaderProgramId: {
                get: function () { return _shaderProgramId; }
            },
            /**
             * (From http://www.opengl.org/)<br>
             * When GL_POLYGON_OFFSET_FILL, GL_POLYGON_OFFSET_LINE, or GL_POLYGON_OFFSET_POINT is enabled, each
             * fragment's depth value will be offset after it is interpolated from the depth values of the appropriate
             * vertices. The value of the offset is factor × DZ + r × units , where DZ is a measurement of the change
             * in depth relative to the screen area of the polygon, and r is the smallest value that is guaranteed to
             * produce a resolvable offset for a given implementation. The offset is added before the depth test is
             * performed and before the value is written into the depth buffer.<br><br>
             *
             * glPolygonOffset is useful for rendering hidden-line images, for applying decals to surfaces, and for
             * rendering solids with highlighted edges.<br><br>
             * Possible values:<br>
             * true or false<br>
             * Default false
             * @property polygonOffsetEnabled
             * @type boolean
             */
            polygonOffsetEnabled: {
                get: function () {
                    return _polygonOffsetEnabled;
                },
                set: function (value) {
                    _polygonOffsetEnabled = value;
                }
            },
            /**
             * Default 2.5
             * @property polygonOffsetFactor
             * @type Number
             */
            polygonOffsetFactor: {
                get: function () {
                    return _polygonOffsetFactor;
                },
                set: function (value) {
                    _polygonOffsetFactor = value;
                }
            },
            /**
             * Default 10.0
             * @property polygonOffsetUnits
             * @type Number
             */
            polygonOffsetUnits: {
                get: function () {
                    return _polygonOffsetUnits;
                },
                set: function (value) {
                    _polygonOffsetUnits = value;
                }
            },
            /**
             * Must be set to KICK.core.Constants.GL_FRONT, KICK.core.Constants.GL_BACK (default),
             * KICK.core.Constants.GL_FRONT_AND_BACK, KICK.core.Constants.NONE<br>
             * Note that in faceCulling = GL_FRONT, GL_BACK or GL_FRONT_AND_BACK with face culling enabled<br>
             * faceCulling = GL_NONE means face culling disabled
             * @property faceCulling
             * @type Object
             */
            faceCulling: {
                get: function () { return _faceCulling; },
                set: function (newValue) {
                    if (ASSERT) {
                        if (newValue !== core.Constants.GL_FRONT &&
                            newValue !== core.Constants.GL_FRONT_AND_BACK &&
                            newValue !== core.Constants.GL_BACK &&
                            newValue !== core.Constants.GL_NONE) {
                            KICK.core.Util.fail("Shader.faceCulling must be KICK.material.Shader.FRONT, " +
                                "KICK.material.Shader.BACK (default), KICK.material.Shader.NONE");
                        }
                    }
                    _faceCulling = newValue;
                }
            },
            /**
             * Enable or disable writing into the depth buffer
             * @property depthMask
             * @type Boolean
             */
            depthMask: {
                get: function () { return _depthMask; },
                set: function (newValue) {
                    if (ASSERT) {
                        if (typeof newValue !== 'boolean') {
                            KICK.core.Util.fail("Shader.depthMask must be a boolean. Was " + (typeof newValue));
                        }
                    }
                    _depthMask = newValue;
                }
            },
            /**
             * The depth test function. Must be one of
             * KICK.core.Constants.GL_NEVER,
             * KICK.core.Constants.GL_LESS,
             * KICK.core.Constants.GL_EQUAL,
             * KICK.core.Constants.GL_LEQUAL,
             * KICK.core.Constants.GL_GREATER,
             * KICK.core.Constants.GL_NOTEQUAL,
             * KICK.core.Constants.GL_GEQUAL,
             * KICK.core.Constants.GL_ALWAYS
             * @property zTest
             * @type Object
             */
            zTest: {
                get: function () { return _zTest; },
                set: function (newValue) {
                    if (ASSERT) {
                        if (newValue !== core.Constants.GL_NEVER &&
                            newValue !== core.Constants.GL_LESS &&
                            newValue !== core.Constants.GL_EQUAL &&
                            newValue !== core.Constants.GL_LEQUAL &&
                            newValue !== core.Constants.GL_GREATER &&
                            newValue !== core.Constants.GL_NOTEQUAL &&
                            newValue !== core.Constants.GL_GEQUAL &&
                            newValue !== core.Constants.GL_ALWAYS) {
                            KICK.core.Util.fail("Shader.zTest must be KICK.core.Constants.GL_NEVER, " +
                                "KICK.core.Constants.GL_LESS,KICK.core.Constants.GL_EQUAL,KICK.core.Constants.GL_LEQUAL," +
                                "KICK.core.Constants.GL_GREATER,KICK.core.Constants.GL_NOTEQUAL,KICK.core.Constants.GL_GEQUAL, " +
                                "or KICK.core.Constants.GL_ALWAYS");
                        }
                    }
                    _zTest = newValue;
                }
            },
            /**
             * Enables/disables blending (default is false).<br>
             * "In RGBA mode, pixels can be drawn using a function that blends the incoming (source) RGBA values with the
             * RGBA values that are already in the frame buffer (the destination values)"
             * (From <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">www.Opengl.org</a>)
             * @property blend
             * @type Boolean
             */
            blend: {
                get: function () { return _blend; },
                set: function (value) {
                    if (ASSERT) {
                        if (typeof value !== 'boolean') {
                            KICK.core.Util.fail("Shader.blend must be a boolean");
                        }
                    }
                    _blend = value;
                    updateBlendKey();
                }
            },
            /**
             * Specifies the blend s-factor<br>
             * Initial value GL_SRC_ALPHA
             * Must be set to one of: GL_ZERO, GL_ONE, GL_SRC_COLOR, GL_ONE_MINUS_SRC_COLOR, GL_DST_COLOR,
             * GL_ONE_MINUS_DST_COLOR, GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA, GL_DST_ALPHA, GL_ONE_MINUS_DST_ALPHA,
             * GL_CONSTANT_COLOR, GL_ONE_MINUS_CONSTANT_COLOR, GL_CONSTANT_ALPHA, GL_ONE_MINUS_CONSTANT_ALPHA, and
             * GL_SRC_ALPHA_SATURATE.<br>
             * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
             * @property blendSFactor
             * @type Number
             */
            blendSFactor: {
                get: function () { return _blendSFactor; },
                set: function (value) {
                    if (ASSERT) {
                        var c = KICK.core.Constants;
                        if (value !== c.GL_ZERO &&
                            value !== c.GL_ONE &&
                            value !== c.GL_SRC_COLOR &&
                            value !== c.GL_ONE_MINUS_SRC_COLOR &&
                            value !== c.GL_DST_COLOR &&
                            value !== c.GL_ONE_MINUS_DST_COLOR &&
                            value !== c.GL_SRC_ALPHA &&
                            value !== c.GL_ONE_MINUS_SRC_ALPHA &&
                            value !== c.GL_DST_ALPHA &&
                            value !== c.GL_ONE_MINUS_DST_ALPHA &&
                            value !== c.GL_CONSTANT_COLOR &&
                            value !== c.GL_ONE_MINUS_CONSTANT_COLOR &&
                            value !== c.GL_CONSTANT_ALPHA &&
                            value !== c.GL_ONE_MINUS_CONSTANT_ALPHA &&
                            value !== c.GL_SRC_ALPHA_SATURATE) {
                            KICK.core.Util.fail("Shader.blendSFactor must be a one of GL_ZERO, GL_ONE, GL_SRC_COLOR, " +
                                "GL_ONE_MINUS_SRC_COLOR, GL_DST_COLOR, GL_ONE_MINUS_DST_COLOR, GL_SRC_ALPHA, " +
                                "GL_ONE_MINUS_SRC_ALPHA, GL_DST_ALPHA, GL_ONE_MINUS_DST_ALPHA, GL_CONSTANT_COLOR, " +
                                "GL_ONE_MINUS_CONSTANT_COLOR, GL_CONSTANT_ALPHA, GL_ONE_MINUS_CONSTANT_ALPHA, and " +
                                "GL_SRC_ALPHA_SATURATE.");
                        }
                    }
                    _blendSFactor = value;
                    updateBlendKey();
                }
            },
            /**
             * Specifies the blend d-factor<br>
             * Initial value GL_SRC_ALPHA
             * Must be set to one of: GL_ZERO, GL_ONE, GL_SRC_COLOR, GL_ONE_MINUS_SRC_COLOR, GL_DST_COLOR,
             * GL_ONE_MINUS_DST_COLOR, GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA, GL_DST_ALPHA, GL_ONE_MINUS_DST_ALPHA,
             * GL_CONSTANT_COLOR, GL_ONE_MINUS_CONSTANT_COLOR, GL_CONSTANT_ALPHA, GL_ONE_MINUS_CONSTANT_ALPHA, and
             * GL_ONE_MINUS_SRC_ALPHA.<br>
             * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
             * @property blendDFactor
             * @type Number
             */
            blendDFactor: {
                get: function () { return _blendDFactor; },
                set: function (value) {
                    if (ASSERT) {
                        var c = KICK.core.Constants;
                        if (value !== c.GL_ZERO &&
                            value !== c.GL_ONE &&
                            value !== c.GL_SRC_COLOR &&
                            value !== c.GL_ONE_MINUS_SRC_COLOR &&
                            value !== c.GL_DST_COLOR &&
                            value !== c.GL_ONE_MINUS_DST_COLOR &&
                            value !== c.GL_SRC_ALPHA &&
                            value !== c.GL_ONE_MINUS_SRC_ALPHA &&
                            value !== c.GL_DST_ALPHA &&
                            value !== c.GL_ONE_MINUS_DST_ALPHA &&
                            value !== c.GL_CONSTANT_COLOR &&
                            value !== c.GL_ONE_MINUS_CONSTANT_COLOR &&
                            value !== c.GL_CONSTANT_ALPHA &&
                            value !== c.GL_ONE_MINUS_CONSTANT_ALPHA) {
                            KICK.core.Util.fail("Shader.blendSFactor must be a one of GL_ZERO, GL_ONE, GL_SRC_COLOR, " +
                                "GL_ONE_MINUS_SRC_COLOR, GL_DST_COLOR, GL_ONE_MINUS_DST_COLOR, GL_SRC_ALPHA, " +
                                "GL_ONE_MINUS_SRC_ALPHA, GL_DST_ALPHA, GL_ONE_MINUS_DST_ALPHA, GL_CONSTANT_COLOR, " +
                                "GL_ONE_MINUS_CONSTANT_COLOR, GL_CONSTANT_ALPHA, and GL_ONE_MINUS_CONSTANT_ALPHA.");
                        }
                    }
                    _blendDFactor = value;
                    updateBlendKey();
                }
            },
            /**
             * Unique shader version (this number will change whenever apply is invoked). The value may be different after serialization.
             * @property shaderVersion
             * @type Number
             */
            shaderVersion : {
                get: function () {
                    return uniqueVersionCounter;
                }
            }
        });

        /**
         * Flush the current shader bound - this force the shader to be reloaded (and its uniforms and vertex attributes
         * are reassigned)
         * @method markUniformUpdated
         */
        this.markUniformUpdated = function () {
            glState.boundShader = -1;
            glState.meshShader = -1;
        };

        /**
         * Updates the shader (must be called after any shader state is changed to apply changes)
         * @method apply
         * @return {Boolean} shader created successfully
         */
        this.apply = function () {
            var errorLog = _errorLog || console.log,
                vertexShader = compileShader(_vertexShaderSrc, false, errorLog),
                fragmentShader = compileShader(_fragmentShaderSrc, true, errorLog),
                compileError = fragmentShader === null || vertexShader === null,
                i,
                c = KICK.core.Constants,
                numberOfActiveUniforms,
                activeAttributes,
                attribute;
            if (compileError) {
                vertexShader = compileShader(glslConstants["__error_vs.glsl"], false, errorLog);
                fragmentShader = compileShader(glslConstants["__error_fs.glsl"], true, errorLog);
            }

            _shaderProgramId = gl.createProgram();

            gl.attachShader(_shaderProgramId, vertexShader);
            gl.attachShader(_shaderProgramId, fragmentShader);
            gl.linkProgram(_shaderProgramId);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);

            if (!gl.getProgramParameter(_shaderProgramId, c.GL_LINK_STATUS)) {
                errorLog("Could not initialise shaders");
                return false;
            }

            uniqueVersionCounter = (shaderUniqueVertionCounter++);

            gl.useProgram(_shaderProgramId);
            glState.boundShader = _shaderProgramId;
            numberOfActiveUniforms = gl.getProgramParameter(_shaderProgramId, c.GL_ACTIVE_UNIFORMS);
            updateActiveUniforms(numberOfActiveUniforms);

            activeAttributes = gl.getProgramParameter(_shaderProgramId, c.GL_ACTIVE_ATTRIBUTES);
            /**
             * Array of JSON data with size,type and name
             * @property activeAttributes
             * @type Array_Object
             */
            thisObj.activeAttributes = [];
            /**
             * Lookup of attribute location based on name.
             * @property lookupAttribute
             * @type Object
             */
            thisObj.lookupAttribute = {};
            for (i = 0; i < activeAttributes; i++) {
                attribute = gl.getActiveAttrib(_shaderProgramId, i);
                thisObj.activeAttributes[i] = {
                    size: attribute.size,
                    type: attribute.type,
                    name: attribute.name
                };
                thisObj.lookupAttribute[attribute.name] = i;
            }

            thisObj.markUniformUpdated();

            notifyListeners();

            return !compileError;
        };

        /**
         * Deletes the shader program from memory.
         * A destroyed shader can be used again if update shader is called
         * @method destroy
         */
        this.destroy = function () {
            if (_shaderProgramId !== -1) {
                engine.removeContextListener(thisObj);
                gl.deleteProgram(_shaderProgramId);
                _shaderProgramId = -1;
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * Return true if the shader compiled successfully and is not destroyed
         * @method isValid
         * @return {Boolean} is shader valid
         */
        this.isValid = function () {
            return _shaderProgramId !== -1;
        };

        /**
         * @method bind
         */
        this.bind = function () {
            if (ASSERT) {
                if (!(thisObj.isValid)) {
                    KICK.core.Util.fail("Cannot bind a shader that is not valid");
                }
            }
            if (glState.boundShader !== _shaderProgramId) {
                glState.boundShader = _shaderProgramId;
                gl.useProgram(_shaderProgramId);
                updateCullFace();
                updateDepthProperties();
                updateBlending();
                updatePolygonOffset();
            }
        };

        /**
         * Serializes the data into a JSON object (that can be used as a config parameter in the constructor)<br>
         * Note errorLog are not serialized
         * @method toJSON
         * @return {Object} config element
         */
        this.toJSON = function () {
            if (_dataURI) {
                return {
                    uid: thisObj.uid,
                    name: _name,
                    dataURI: _dataURI
                };
            }
            return {
                uid: thisObj.uid,
                name: _name,
                blend: _blend,
                blendSFactor: _blendSFactor,
                blendDFactor: _blendDFactor,
                dataURI: _dataURI,
                depthMask: _depthMask,
                faceCulling: _faceCulling,
                fragmentShaderSrc: _fragmentShaderSrc,
                vertexShaderSrc: _vertexShaderSrc,
                polygonOffsetEnabled: _polygonOffsetEnabled,
                polygonOffsetFactor: _polygonOffsetFactor,
                polygonOffsetUnits: _polygonOffsetUnits,
                renderOrder: _renderOrder,
                zTest: _zTest,
                defaultUniforms: _defaultUniforms
            };
        };

        (function init() {
            applyConfig(thisObj, config);
            engine.project.registerObject(thisObj, "KICK.material.Shader");
            if (_dataURI && _dataURI.indexOf("memory://") !== 0) {
                engine.resourceLoader.getShaderData(_dataURI, thisObj);
            } else {
                updateBlendKey();
                thisObj.apply();
            }
            if (_name === "") {
                _name = "Shader_" + shaderUniqueNameCounter;
                shaderUniqueNameCounter++;
            }
        }());
    };


    /**
     * @method getPrecompiledSource
     * @param {KICK.core.Engine} engine
     * @param {String} sourcecode
     * @return {String} sourcecode after precompiler
     * @static
     */
    material.Shader.getPrecompiledSource = function (engine, sourcecode) {
        var name,
            source,
            version = "#version 100",
            lineOffset = 1,
            indexOfNewline;
        if (c._DEBUG) {
            (function () {
                // insert #line nn after each #pragma include to give meaning full lines in error console
                var linebreakPosition = [],
                    position = sourcecode.indexOf('\n'),
                    i,
                    nextPosition;
                while (position !== -1) {
                    position++;
                    linebreakPosition.push(position);
                    position = sourcecode.indexOf('\n', position);
                }
                for (i = linebreakPosition.length - 2; i >= 0; i--) {
                    position = linebreakPosition[i];
                    nextPosition = linebreakPosition[i + 1];
                    if (sourcecode.substring(position).indexOf("#pragma include") === 0) {
                        sourcecode = sourcecode.substring(0, nextPosition) + ("#line  " + (i + 2) + "\n") + sourcecode.substring(nextPosition);
                    }
                }
            }());
        }
        for (name in material.GLSLConstants) {
            if (material.GLSLConstants.hasOwnProperty(name)) {
                if (typeof (name) === "string") {
                    source = material.GLSLConstants[name];
                    sourcecode = sourcecode.replace("#pragma include \"" + name + "\"", source);
                    sourcecode = sourcecode.replace("#pragma include \'" + name + "\'", source);
                }
            }
        }
        // if shader already contain version tag, then reuse this version information
        if (sourcecode.indexOf("#version ") === 0) {
            indexOfNewline = sourcecode.indexOf('\n');
            version = sourcecode.substring(0, indexOfNewline); // save version info
            sourcecode = sourcecode.substring(indexOfNewline + 1); // strip version info
            lineOffset = 2;
        }
        sourcecode =
            version + "\n" +
                "#define SHADOWS " + (engine.config.shadows === true) + "\n" +
                "#define LIGHTS " + (engine.config.maxNumerOfLights) + "\n" +
                "#line " + lineOffset + "\n" +
                sourcecode;
        return sourcecode;
    };

    /**
     * Update the material uniform
     * @method bindMaterialUniform
     * @param material
     * @param engineUniforms
     */
    material.Shader.prototype.bindMaterialUniform = function (material, engineUniforms) {
        // lookup uniforms
        var gl = this.gl,
            glState = this.glState,
            timeObj,
            sceneLights = engineUniforms.sceneLights,
            ambientLight,
            lookupUniforms = this.lookupUniform,
            proj = lookupUniforms._proj,
            directionalLightUniform = lookupUniforms._dLight,
            directionalLightWorldUniform = lookupUniforms._dLightWorldDir,
            pointLightUniform = lookupUniforms["_pLights[0]"],
            time = lookupUniforms._time,
            viewport = lookupUniforms._viewport,
            lightUniformAmbient =  lookupUniforms._ambient,
            currentTexture = 0,
            ambientLlightValue;

        currentTexture = material.bind(currentTexture);

        if (proj) {
            gl.uniformMatrix4fv(proj.location, false, engineUniforms.projectionMatrix);
        }
        if (lightUniformAmbient) {
            ambientLight = sceneLights.ambientLight;
            ambientLlightValue = ambientLight !== null ? ambientLight.colorIntensity : vec3Zero;
            gl.uniform3fv(lightUniformAmbient.location, ambientLlightValue);
        }

        if (directionalLightUniform) {
            gl.uniformMatrix3fv(directionalLightUniform.location, false, sceneLights.directionalLightData);
        }
        if (directionalLightWorldUniform) {
            gl.uniform3fv(directionalLightWorldUniform.location, sceneLights.directionalLightWorld);
        }

        if (pointLightUniform) {
            gl.uniformMatrix3fv(pointLightUniform.location, false, sceneLights.pointLightData);
        }
        if (time) {
            timeObj = this.engine.time;
            gl.uniform1f(time.location, timeObj.time);
        }
        if (viewport) {
            gl.uniform2fv(viewport.location, glState.viewportSize);
        }
        return currentTexture;
    };

    /**
     * Binds the uniforms to the current shader.
     * The uniforms is expected to be in a valid format.
     * The method will call Shader.bindMaterialUniform if material uniforms needs to be changed.
     * @method bindUniform
     * @param {KICK.material.Material} material
     * @param {Object} engineUniforms
     * @param {KICK.scene.Transform) transform
        */
    material.Shader.prototype.bindUniform = function (material, engineUniforms, transform) {
        var lookupUniform = this.lookupUniform,
            gl = this.gl,
            glState = this.glState,
            modelMatrix = lookupUniform._m,
            mv = lookupUniform._mv,
            worldCamPos = lookupUniform._worldCamPos,
            world2object = lookupUniform._world2object,
            mvProj = lookupUniform._mvProj,
            norm = lookupUniform._norm,
            gameObjectUID = lookupUniform._gameObjectUID,
            shadowMapTexture = lookupUniform._shadowMapTexture,
            _lightMat = lookupUniform._lightMat,
            sceneLights = engineUniforms.sceneLights,
            directionalLight = sceneLights.directionalLight,
            globalTransform,
            i,
            uidAsVec4,
            modelView,
            normalMatrix,
            currentTexture = 0;
        if (glState.currentMaterial !== material) {
            glState.currentMaterial = material;
            currentTexture = this.bindMaterialUniform(material, engineUniforms);
        }

        // mesh instance uniforms
        if (modelMatrix || mv || norm) {
            globalTransform = transform.getGlobalMatrix();
            if (modelMatrix) {
                gl.uniformMatrix4fv(modelMatrix.location, false, globalTransform);
            }
            modelView = mat4.multiply(engineUniforms.viewMatrix, globalTransform, tempMat4);
            if (mv) {
                gl.uniformMatrix4fv(mv.location, false, modelView);
            }
            if (norm) {
                // note this can be simplified to
                // var normalMatrix = math.mat4.toMat3(finalModelView);
                // if the modelViewMatrix is orthogonal (non-uniform scale is not applied)
                //var normalMatrix = mat3.transpose(mat4.toInverseMat3(finalModelView));
                normalMatrix = mat4.toNormalMat3(modelView, tempMat3);
                if (ASSERT) {
                    if (!normalMatrix) {
                        KICK.core.Util.fail("Singular matrix");
                    }
                }
                gl.uniformMatrix3fv(norm.location, false, normalMatrix);
            }
        }
        if (worldCamPos) {
            gl.uniform3fv(worldCamPos.location, engineUniforms.currentCameraTransform.position);
        }
        if (world2object) {
            gl.uniformMatrix4fv(world2object.location, false, transform.getGlobalTRSInverse());
        }
        if (mvProj) {
            globalTransform = globalTransform || transform.getGlobalMatrix();
            gl.uniformMatrix4fv(mvProj.location, false, mat4.multiply(engineUniforms.viewProjectionMatrix, globalTransform, tempMat4));
        }
        if (gameObjectUID) {
            uidAsVec4 = uint32ToVec4(transform.gameObject.uid, tmpVec4);
            if (this.engine.time.frame < 3) {
                console.log("transform.gameObject.uid " + transform.gameObject.uid);
            }
            gl.uniform4fv(gameObjectUID.location, uidAsVec4);
        }
        if (shadowMapTexture && directionalLight && directionalLight.shadowTexture) {
            directionalLight.shadowTexture.bind(currentTexture);
            gl.uniform1i(shadowMapTexture.location, currentTexture);
            currentTexture++;
        }
        if (_lightMat) {
            globalTransform = transform.getGlobalMatrix();
            gl.uniformMatrix4fv(_lightMat.location, false, mat4.multiply(engineUniforms.lightMatrix, globalTransform, tempMat4));
        }
    };

    Object.freeze(material.Shader);

    /**
     * Material configuration
     * @class Material
     * @namespace KICK.material
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @extends KICK.core.ProjectAsset
     */
    material.Material = function (engine, config) {
        // extend ProjectAsset
        KICK.core.ProjectAsset(this);
        var _name = "Material",
            _shader = null,
            _uniforms = [],
            thisObj = this,
            gl = engine.gl,
            _renderOrder = 0,
            contextListener = {
                contextLost: function () {
                },
                contextRestored: function (newGL) {
                    gl = newGL;
                    // force shader update (will re-initialize uniforms)
                    if (_shader) {
                        _shader.contextRestored(newGL);
                        var s = _shader;
                        _shader = null;
                        thisObj.shader = s;
                    }
                }
            },
            /**
             * Called when a shader is set or changed.
             * Add location and type information to each uniform.
             * Besides it checks that the uniforms exists in the shader
             * (if not the default uniforms are added).
             * @method
             * @private
             */
            decorateUniforms = function () {
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
             * @type KICK.core.Engine
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
             * @type KICK.material.Shader
             */
            shader: {
                get: function () {
                    return _shader;
                },
                set: function (newValue) {
                    if (!newValue instanceof KICK.material.Shader) {
                        fail("KICK.material.Shader expected");
                    }
                    if (_shader !== newValue) {
                        if (_shader) {
                            _shader.removeListener(decorateUniforms);
                        }
                        _shader = newValue;
                        if (_shader) {
                            _renderOrder = _shader.renderOrder;
                            decorateUniforms();
                            _shader.addListener(decorateUniforms);
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
                case c.GL_FLOAT:
                    gl.uniform1fv(location, value);
                    break;
                case c.GL_FLOAT_MAT2:
                    gl.uniformMatrix2fv(location, false, value);
                    break;
                case c.GL_FLOAT_MAT3:
                    gl.uniformMatrix3fv(location, false, value);
                    break;
                case c.GL_FLOAT_MAT4:
                    gl.uniformMatrix4fv(location, false, value);
                    break;
                case c.GL_FLOAT_VEC2:
                    gl.uniform2fv(location, value);
                    break;
                case c.GL_FLOAT_VEC3:
                    gl.uniform3fv(location, value);
                    break;
                case c.GL_FLOAT_VEC4:
                    gl.uniform4fv(location, value);
                    break;
                case c.GL_INT:
                    gl.uniform1iv(location, value);
                    break;
                case c.GL_INT_VEC2:
                    gl.uniform2iv(location, value);
                    break;
                case c.GL_INT_VEC3:
                    gl.uniform3iv(location, value);
                    break;
                case c.GL_INT_VEC4:
                    gl.uniform4iv(location, value);
                    break;
                case c.GL_SAMPLER_CUBE:
                case c.GL_SAMPLER_2D:
                    value.bind(currentTexture);
                    gl.uniform1i(location, currentTexture);
                    currentTexture++;
                    break;
                }
            }
            return currentTexture;
        };

        /**
         * Bind material uniforms
         * @method setUniform
         * @param {String} name
         * @param {Float32Array|Int32Array|KICK.texture.Texture}
         * @return {KICK.material.MaterialUniform}
         */
        this.setUniform = function (name, value) {
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
                foundElement = new material.MaterialUniform({
                    name: name,
                    value: value
                });
                _uniforms.push(foundElement);
            }
            if (ASSERT) {
                if (_shader) {
                    if (typeof (value) === "undefined") {
                        fail("Type of value is undefined");
                    }
                }
            }
            return foundElement;
        };

        /**
         * @method getUniform
         * @param name
         * @return {Float32Array|Int32Array|KICK.texture.Texture}
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
            engine.removeContextListener(contextListener);
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
                shader: KICK.core.Util.getJSONReference(engine, _shader),
                uniformData: serializedUniforms // uniformData only used during serialization
            };
        };

        (function init() {
            var uniformData = config.uniformData,
                name,
                value,
                configCopy = {
                    uid: config.uid || 0,
                    name: config.name,
                    shader: config.shader
                };
            engine.addContextListener(contextListener);
            if (config.uniforms) {
                warn("Warn - Material.uniforms is deprecated"); // Todo delete in 0.5.x
            }
            applyConfig(thisObj, configCopy);
            if (!_shader || !_shader.isValid()) {
                if (config.shader) {
                    warn("Problem using shader in material. ", config.shader);
                }
                thisObj._shader = engine.project.load(engine.project.ENGINE_SHADER___ERROR);
            }
            if (uniformData) {
                for (name in uniformData) {
                    if (uniformData.hasOwnProperty(name)) {
                        if (_shader.lookupUniform[name]) { // if found in shader
                            value = uniformData[name];
                            value = convertUniformValue(_shader.lookupUniform[name].type, value, engine);
                            thisObj.setUniform(name, value);
                        } else {
                            warn("Cannot find uniform " + name + " in shader. ");
                        }
                    }
                }
            }
            decorateUniforms();
            engine.project.registerObject(thisObj, "KICK.material.Material");
        }());
    };

    /**
     * Material material uniform object
     * @class MaterialUniform
     * @namespace KICK.material
     * @constructor
     * @param {Object} configuration
     * @protected
     */
    material.MaterialUniform = function (configuration) {
        var value,
            thisObj = this;
        configuration = configuration || {};
        value = configuration.value;

        /**
         * WebGL Uniform location
         * @property location
         * @type WebGLUniformLocation
         */
        this.location = null;

        /**
         * WebGL type
         * @property type
         * @type Number
         */
        this.type = null;
        /**
         * Name of the Uniform
         * @property name
         * @type String
         */
        this.name = configuration.name;

        Object.defineProperties(this,
            {
                /**
                 * @property value
                 * @type Float32Array|Int32Array|KICK.texture.Texture
                 */
                value: {
                    get: function () {
                        return value;
                    },
                    set: function (newValue) {
                        value = newValue;
                    }
                }
            });


        /**
         * Returns a JSON representation of the material<br>
         * @method toJSON
         * @return {string}
         */
        this.toJSON = function () {
            var value = thisObj.value;
            if (value instanceof Float32Array || value instanceof Int32Array) {
                value = core.Util.typedArrayToArray(value);
            } else {
                if (ASSERT) {
                    if (!value instanceof KICK.texture.Texture) {
                        KICK.core.Util.fail("Unknown uniform value type. Expected Texture");
                    }
                }
                value = KICK.core.Util.getJSONReference(value.engine, value);
            }
            return {
                name: thisObj.name,
                value: value
            };
        };
    };
}());
