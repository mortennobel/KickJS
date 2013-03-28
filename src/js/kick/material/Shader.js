define(["kick/core/ProjectAsset", "kick/core/Constants", "./GLSLConstants", "kick/core/Util", "./UniformDescriptor", "kick/math/Vec3", "kick/math/Vec4", "kick/math/Mat4", "kick/math/Mat3", "kick/core/EngineSingleton"],
    function (ProjectAsset, Constants, GLSLConstants, Util, UniformDescriptor, Vec3, Vec4, Mat4, Mat3, EngineSingleton) {
        "use strict";

        var Shader,
            shaderUniqueVersionCounter = 0,
            shaderUniqueNameCounter = 0,
            vec3Zero = Vec3.create(),
            tmpVec4 = Vec4.create(),
            tempMat4 = Mat4.create(),
            tempMat3 = Mat3.create(),
            ASSERT = Constants._ASSERT,
            isMaterialUniformName = function (name) {return name.charAt(0) !== "_"; };

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
         * @example
         *      var diffuseShader = project.load(project.ENGINE_SHADER_DIFFUSE);
         * @example
         *      var vertexShaderStr = "attribute vec3 vertex;\n"+
         *          "uniform mat4 _mvProj;\n"+
         *          "void main(void) {\n"+
         *          "    gl_Position = _mvProj * vec4(vertex, 1.0);\n"+
         *          "}";
         *      var fragmentShaderStr = "uniform highp float _time;\n"+
         *          "void main(void) {\n"+
         *          "  highp float fraction = mod(_time/1000.0,1.0);\n"+
         *          "  gl_FragColor = vec4(fraction,fraction,fraction, 1.0);\n"+
         *          "}";
         *      var shader = new kick.material.Shader( {
         *              vertexShaderSrc: vertexShaderStr,
         *              fragmentShaderSrc: fragmentShaderStr
         *          });
         * @class Shader
         * @namespace kick.material
         * @constructor
         * @param {Object} config
         * @extends kick.core.ProjectAsset
         */
        Shader = function (config) {
            // extend ProjectAsset
            ProjectAsset(this, config, "kick.material.Shader");
            if (ASSERT){
                if (config === EngineSingleton.engine){
                    Util.fail("Shader constructor changed - engine parameter is removed");
                }
            }
            var engine = EngineSingleton.engine,
                gl = engine.gl,
                glState = engine.glState,
                thisObj = this,
                listeners = [],
                _shaderProgramId = -1,
                _depthMask = true,
                _faceCulling = Constants.GL_BACK,
                _zTest = Constants.GL_LESS,
                _blend = false,
                _blendSFactorRGB = Constants.GL_SRC_ALPHA,
                _blendDFactorRGB = Constants.GL_ONE_MINUS_SRC_ALPHA,
                _blendSFactorAlpha = Constants.GL_SRC_ALPHA,
                _blendDFactorAlpha = Constants.GL_ONE_MINUS_SRC_ALPHA,
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
                glslConstants = GLSLConstants,
                _vertexShaderSrc = glslConstants["__error_vs.glsl"],
                _fragmentShaderSrc = glslConstants["__error_fs.glsl"],
                _defaultUniforms,
                _errorLog = Util.fail,
                uniqueVersionCounter = -1,
                /**
                 * Updates the blend key that identifies blend+blendSFactor+blendDFactor<br>
                 * The key is used to fast determine if the blend settings needs to be updated
                 * @method updateBlendKey
                 * @private
                 */
                updateBlendKey = function () {
                    blendKey = (_blendSFactorRGB + (_blendDFactorRGB << 10) + (_blendSFactorAlpha << 20) + (_blendDFactorAlpha << 30)) * (_blend ? -1 : 1);
                },
                /**
                 * Calls the listeners registered for this shader
                 * @method notifyListeners
                 * @private
                 */
                notifyListeners = function () {
                    var i;
                    for (i = 0; i < listeners.length; i++) {
                        listeners[i](thisObj);
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
                        c = Constants;
                    str = Shader.getPrecompiledSource(str);
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
                        if (_faceCulling === Constants.GL_NONE) {
                            gl.disable(Constants.GL_CULL_FACE);
                        } else {
                            if (!currentFaceCulling || currentFaceCulling === Constants.GL_NONE) {
                                gl.enable(Constants.GL_CULL_FACE);
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
                            gl.enable(Constants.GL_BLEND);
                        } else {
                            gl.disable(Constants.GL_BLEND);
                        }
                        gl.blendFuncSeparate(_blendSFactorRGB, _blendDFactorRGB,_blendSFactorAlpha, _blendDFactorAlpha);
                    }
                },
                updatePolygonOffset = function () {
                    if (glState.polygonOffsetEnabled !== _polygonOffsetEnabled) {
                        glState.polygonOffsetEnabled = _polygonOffsetEnabled;
                        if (_polygonOffsetEnabled) {
                            gl.enable(Constants.GL_POLYGON_OFFSET_FILL);
                        } else {
                            gl.disable(Constants.GL_POLYGON_OFFSET_FILL);
                        }
                    }
                    if (_polygonOffsetEnabled) {
                        gl.polygonOffset(_polygonOffsetFactor, _polygonOffsetUnits);
                    }
                },
                getDefaultUniform = function (type, size) {
                    switch (type) {
                    case Constants.GL_FLOAT:
                        return new Float32Array(size);
                    case Constants.GL_FLOAT_MAT2:
                        return new Float32Array(4 * size);
                    case Constants.GL_FLOAT_MAT3:
                        return new Float32Array(9 * size);
                    case Constants.GL_FLOAT_MAT4:
                        return new Float32Array(16 * size);
                    case Constants.GL_FLOAT_VEC2:
                        return new Float32Array(2 * size);
                    case Constants.GL_FLOAT_VEC3:
                        return new Float32Array(3 * size);
                    case Constants.GL_FLOAT_VEC4:
                        return new Float32Array(4 * size);
                    case Constants.GL_INT:
                        return new Int32Array(size);
                    case Constants.GL_INT_VEC2:
                        return new Int32Array(2 * size);
                    case Constants.GL_INT_VEC3:
                        return new Int32Array(3 * size);
                    case Constants.GL_INT_VEC4:
                        return new Int32Array(4 * size);
                    case Constants.GL_SAMPLER_CUBE:
                        if (size !== 1) {
                            Util.fail("Texture arrays not currently supported");
                        }
                        return engine.project.load(engine.project.ENGINE_TEXTURE_CUBEMAP_WHITE);
                    case Constants.GL_SAMPLER_2D:
                        if (size !== 1) {
                            Util.fail("Texture arrays not currently supported");
                        }
                        return engine.project.load(engine.project.ENGINE_TEXTURE_WHITE);
                    default:
                        Util.fail("Unknown type");
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
                        if (Constants._DEBUG) {
                            uniformLocation.shader = thisObj;
                            uniformLocation.shaderVersion = uniqueVersionCounter;
                        }
                        uniformDescriptor = new UniformDescriptor(uniform.name, uniform.type, uniform.size, uniformLocation);
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
                        Util.warn("Shader.addListener: listenerFn not function");
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
                        Util.warn("Shader.removeListener: listenerFn not function");
                    }
                }
                Util.removeElementFromArray(listeners, listenerFn, true);
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

            engine.addEventListener('contextLost', this.contextLost);
            engine.addEventListener('contextRestored', this.contextRestored);

            Object.defineProperties(this, {
                /**
                 * Lookup of uniform based on name.
                 * for each name a kick.material.UniformDescriptor object exist
                 * @property lookupUniform
                 * @type Object
                 */
                lookupUniform: {
                    get: function () { return _lookupUniform; }
                },
                /**
                 * Array of Object with size,type, name and index properties
                 * @property activeUniforms
                 * @type Array_kick.material.UniformDescriptor
                 */
                activeUniforms: {
                    get: function () { return _activeUniforms; }
                },
                /**
                 * Array of Object with size,type, name and index properties
                 * @property engineUniforms
                 * @type Array Array_kick.material.UniformDescriptor
                 */
                engineUniforms: {
                    get: function () { return _engineUniforms; }
                },
                /**
                 * Array of Object with size,type, name and index properties
                 * @property materialUniforms
                 * @type Array Array_kick.material.UniformDescriptor
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
                                _defaultUniforms[name] = Shader.convertUniformValue(type, value[name], engine);
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
                            Util.fail("Shader.vertexShaderSrc must be a string");
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
                            Util.fail("Shader.fragmentShaderSrc must be a string");
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
                            Util.fail("Shader.renderOrder must be a number");
                        }
                        _renderOrder = value;
                        notifyListeners();
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
                                Util.fail("Shader.errorLog should be a function (or null)");
                            }
                        }
                        _errorLog = value;
                    }
                },
                /**
                 * A reference to the engine object
                 * @property engine
                 * @type kick.core.Engine
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
                 * When GL\_POLYGON\_OFFSET\_FILL, GL\_POLYGON\_OFFSET\_LINE, or GL\_POLYGON\_OFFSET\_POINT is enabled, each
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
                 * @default false
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
                 * @property polygonOffsetFactor
                 * @type Number
                 * @default 2.5
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
                 * @property polygonOffsetUnits
                 * @type Number
                 * @default 10.0
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
                 * Must be set to kick.core.Constants.GL\_FRONT, kick.core.Constants.GL\_BACK (default),
                 * kick.core.Constants.GL\_FRONT\_AND\_BACK, kick.core.Constants.NONE<br>
                 * Note that in faceCulling = GL\_FRONT, GL\_BACK or GL\_FRONT\_AND\_BACK with face culling enabled<br>
                 * faceCulling = GL\_NONE means face culling disabled
                 * @property faceCulling
                 * @type Object
                 * @default Constants.GL_BACK
                 */
                faceCulling: {
                    get: function () { return _faceCulling; },
                    set: function (newValue) {
                        if (ASSERT) {
                            if (newValue !== Constants.GL_FRONT &&
                                    newValue !== Constants.GL_FRONT_AND_BACK &&
                                    newValue !== Constants.GL_BACK &&
                                    newValue !== Constants.GL_NONE) {
                                Util.fail("Shader.faceCulling must be kick.material.Shader.FRONT, " +
                                    "kick.material.Shader.BACK (default), kick.material.Shader.NONE");
                            }
                        }
                        _faceCulling = newValue;
                    }
                },
                /**
                 * Enable or disable writing into the depth buffer
                 * @property depthMask
                 * @type Boolean
                 * @default true
                 */
                depthMask: {
                    get: function () { return _depthMask; },
                    set: function (newValue) {
                        if (ASSERT) {
                            if (typeof newValue !== 'boolean') {
                                Util.fail("Shader.depthMask must be a boolean. Was " + (typeof newValue));
                            }
                        }
                        _depthMask = newValue;
                    }
                },
                /**
                 * The depth test function. Must be one of
                 * kick.core.Constants.GL\_NEVER,
                 * kick.core.Constants.GL\_LESS,
                 * kick.core.Constants.GL\_EQUAL,
                 * kick.core.Constants.GL\_LEQUAL,
                 * kick.core.Constants.GL\_GREATER,
                 * kick.core.Constants.GL\_NOTEQUAL,
                 * kick.core.Constants.GL\_GEQUAL,
                 * kick.core.Constants.GL\_ALWAYS
                 * @property zTest
                 * @type Object
                 * @default Constants.GL_LESS
                 */
                zTest: {
                    get: function () { return _zTest; },
                    set: function (newValue) {
                        if (ASSERT) {
                            if (newValue !== Constants.GL_NEVER &&
                                    newValue !== Constants.GL_LESS &&
                                    newValue !== Constants.GL_EQUAL &&
                                    newValue !== Constants.GL_LEQUAL &&
                                    newValue !== Constants.GL_GREATER &&
                                    newValue !== Constants.GL_NOTEQUAL &&
                                    newValue !== Constants.GL_GEQUAL &&
                                    newValue !== Constants.GL_ALWAYS) {
                                Util.fail("Shader.zTest must be kick.core.Constants.GL_NEVER, " +
                                    "kick.core.Constants.GL_LESS,kick.core.Constants.GL_EQUAL,kick.core.Constants.GL_LEQUAL," +
                                    "kick.core.Constants.GL_GREATER,kick.core.Constants.GL_NOTEQUAL,kick.core.Constants.GL_GEQUAL, " +
                                    "or kick.core.Constants.GL_ALWAYS");
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
                                Util.fail("Shader.blend must be a boolean");
                            }
                        }
                        _blend = value;
                        updateBlendKey();
                    }
                },
                /**
                 * Specifies the blend source-factor for the RGB channel<br>
                 * Initial value GL\_SRC\_ALPHA
                 * Must be set to one of: GL\_ZERO, GL\_ONE, GL\_SRC\_COLOR, GL\_ONE\_MINUS\_SRC\_COLOR, GL\_DST\_COLOR,
                 * GL\_ONE\_MINUS\_DST\_COLOR, GL\_SRC\_ALPHA, GL\_ONE\_MINUS\_SRC\_ALPHA, GL\_DST\_ALPHA, GL\_ONE\_MINUS\_DST\_ALPHA,
                 * GL\_CONSTANT\_COLOR, GL\_ONE\_MINUS\_CONSTANT\_COLOR, GL\_CONSTANT\_ALPHA, GL\_ONE\_MINUS\_CONSTANT\_ALPHA, and
                 * GL\_SRC\_ALPHA\_SATURATE.<br>
                 * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
                 * @property blendSFactorRGB
                 * @type Number
                 * @default Constants.GL_SRC_ALPHA
                 */
                blendSFactorRGB:{
                    get: function(){
                        return _blendSFactorRGB;
                    },
                    set: function(value){
                        if (ASSERT) {
                            var c = Constants;
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
                                Util.fail("Shader.blendSFactor must be a one of GL_ZERO, GL_ONE, GL_SRC_COLOR, " +
                                    "GL_ONE_MINUS_SRC_COLOR, GL_DST_COLOR, GL_ONE_MINUS_DST_COLOR, GL_SRC_ALPHA, " +
                                    "GL_ONE_MINUS_SRC_ALPHA, GL_DST_ALPHA, GL_ONE_MINUS_DST_ALPHA, GL_CONSTANT_COLOR, " +
                                    "GL_ONE_MINUS_CONSTANT_COLOR, GL_CONSTANT_ALPHA, GL_ONE_MINUS_CONSTANT_ALPHA, and " +
                                    "GL_SRC_ALPHA_SATURATE.");
                            }
                        }
                        _blendSFactorRGB = value;
                        updateBlendKey();
                    }
                },
                /**
                 * Specifies the blend source-factor for the alpha channel<br>
                 * Initial value GL\_SRC\_ALPHA
                 * Must be set to one of: GL\_ZERO, GL\_ONE, GL\_SRC\_COLOR, GL\_ONE\_MINUS\_SRC\_COLOR, GL\_DST\_COLOR,
                 * GL\_ONE\_MINUS\_DST\_COLOR, GL\_SRC\_ALPHA, GL\_ONE\_MINUS\_SRC\_ALPHA, GL\_DST\_ALPHA, GL\_ONE\_MINUS\_DST\_ALPHA,
                 * GL\_CONSTANT\_COLOR, GL\_ONE\_MINUS\_CONSTANT\_COLOR, GL\_CONSTANT\_ALPHA, GL\_ONE\_MINUS\_CONSTANT\_ALPHA, and
                 * GL\_SRC\_ALPHA\_SATURATE.<br>
                 * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
                 * @property blendSFactorAlpha
                 * @type Number
                 * @default Constants.GL_SRC_ALPHA
                 */
                blendSFactorAlpha:{
                    get: function(){
                        return _blendSFactorAlpha;
                    },
                    set: function(value){
                        if (ASSERT) {
                            var c = Constants;
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
                                Util.fail("Shader.blendSFactorAlpha must be a one of GL_ZERO, GL_ONE, GL_SRC_COLOR, " +
                                    "GL_ONE_MINUS_SRC_COLOR, GL_DST_COLOR, GL_ONE_MINUS_DST_COLOR, GL_SRC_ALPHA, " +
                                    "GL_ONE_MINUS_SRC_ALPHA, GL_DST_ALPHA, GL_ONE_MINUS_DST_ALPHA, GL_CONSTANT_COLOR, " +
                                    "GL_ONE_MINUS_CONSTANT_COLOR, GL_CONSTANT_ALPHA, GL_ONE_MINUS_CONSTANT_ALPHA, and " +
                                    "GL_SRC_ALPHA_SATURATE.");
                            }
                        }
                        _blendSFactorAlpha = value;
                        updateBlendKey();
                    }
                },
                /**
                 * Short for blendSFactorAlpha and blendSFactorRGB
                 * Specifies the blend s-factor<br>
                 * Initial value GL\_SRC\_ALPHA
                 * Must be set to one of: GL\_ZERO, GL\_ONE, GL\_SRC\_COLOR, GL\_ONE\_MINUS\_SRC\_COLOR, GL\_DST\_COLOR,
                 * GL\_ONE\_MINUS\_DST\_COLOR, GL\_SRC\_ALPHA, GL\_ONE\_MINUS\_SRC\_ALPHA, GL\_DST\_ALPHA, GL\_ONE\_MINUS\_DST\_ALPHA,
                 * GL\_CONSTANT\_COLOR, GL\_ONE\_MINUS\_CONSTANT\_COLOR, GL\_CONSTANT\_ALPHA, GL\_ONE\_MINUS\_CONSTANT\_ALPHA, and
                 * GL\_SRC\_ALPHA\_SATURATE.<br>
                 * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
                 * @property blendSFactor
                 * @type Number
                 */
                blendSFactor: {
                    get: function () { return _blendSFactorRGB; },
                    set: function (value) {
                        thisObj.blendSFactorAlpha = value;
                        thisObj.blendSFactorRGB = value;
                    }
                },
                /**
                 * Specifies the blend d-factor for the RGB channel<br>
                 * Initial value GL\_SRC\_ALPHA
                 * Must be set to one of: GL\_ZERO, GL\_ONE, GL\_SRC\_COLOR, GL\_ONE\_MINUS\_SRC\_COLOR, GL\_DST\_COLOR,
                 * GL\_ONE\_MINUS\_DST\_COLOR, GL\_SRC\_ALPHA, GL\_ONE\_MINUS\_SRC\_ALPHA, GL\_DST\_ALPHA, GL\_ONE\_MINUS\_DST\_ALPHA,
                 * GL\_CONSTANT\_COLOR, GL\_ONE\_MINUS\_CONSTANT\_COLOR, GL\_CONSTANT\_ALPHA, GL\_ONE\_MINUS\_CONSTANT\_ALPHA, and
                 * GL\_ONE\_MINUS\_SRC\_ALPHA.<br>
                 * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
                 * @property blendDFactorRGB
                 * @type Number
                 * @default Constants.GL_ONE_MINUS_SRC_ALPHA
                 */
                blendDFactorRGB: {
                    get: function(){
                        return _blendDFactorRGB;
                    },
                    set: function(value){
                        if (ASSERT) {
                            var c = Constants;
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
                                Util.fail("Shader.blendDFactorRGB must be a one of GL_ZERO, GL_ONE, GL_SRC_COLOR, " +
                                    "GL_ONE_MINUS_SRC_COLOR, GL_DST_COLOR, GL_ONE_MINUS_DST_COLOR, GL_SRC_ALPHA, " +
                                    "GL_ONE_MINUS_SRC_ALPHA, GL_DST_ALPHA, GL_ONE_MINUS_DST_ALPHA, GL_CONSTANT_COLOR, " +
                                    "GL_ONE_MINUS_CONSTANT_COLOR, GL_CONSTANT_ALPHA, and GL_ONE_MINUS_CONSTANT_ALPHA.");
                            }
                        }
                        _blendDFactorRGB = value;
                        updateBlendKey();
                    }
                },
                /**
                 * Specifies the blend d-factor for the alpha channel<br>
                 * Initial value GL\_SRC\_ALPHA
                 * Must be set to one of: GL\_ZERO, GL\_ONE, GL\_SRC\_COLOR, GL\_ONE\_MINUS\_SRC\_COLOR, GL\_DST\_COLOR,
                 * GL\_ONE\_MINUS\_DST\_COLOR, GL\_SRC\_ALPHA, GL\_ONE\_MINUS\_SRC\_ALPHA, GL\_DST\_ALPHA, GL\_ONE\_MINUS\_DST\_ALPHA,
                 * GL\_CONSTANT\_COLOR, GL\_ONE\_MINUS\_CONSTANT\_COLOR, GL\_CONSTANT\_ALPHA, GL\_ONE\_MINUS\_CONSTANT\_ALPHA, and
                 * GL\_ONE\_MINUS\_SRC\_ALPHA.<br>
                 * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
                 * @property blendDFactorAlpha
                 * @type Number
                 * @default Constants.GL_ONE_MINUS_SRC_ALPHA
                 */
                blendDFactorAlpha: {
                    get: function(){
                        return _blendDFactorAlpha;
                    },
                    set: function(value){
                        if (ASSERT) {
                            var c = Constants;
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
                                Util.fail("Shader.blendDFactorAlpha must be a one of GL_ZERO, GL_ONE, GL_SRC_COLOR, " +
                                    "GL_ONE_MINUS_SRC_COLOR, GL_DST_COLOR, GL_ONE_MINUS_DST_COLOR, GL_SRC_ALPHA, " +
                                    "GL_ONE_MINUS_SRC_ALPHA, GL_DST_ALPHA, GL_ONE_MINUS_DST_ALPHA, GL_CONSTANT_COLOR, " +
                                    "GL_ONE_MINUS_CONSTANT_COLOR, GL_CONSTANT_ALPHA, and GL_ONE_MINUS_CONSTANT_ALPHA.");
                            }
                        }
                        _blendDFactorAlpha = value;
                        updateBlendKey();
                    }
                },
                /**
                 * Short for blendDFactorAlpha and blendDFactorRGB
                 * Initial value GL\_SRC\_ALPHA
                 * Must be set to one of: GL\_ZERO, GL\_ONE, GL\_SRC\_COLOR, GL\_ONE\_MINUS\_SRC\_COLOR, GL\_DST\_COLOR,
                 * GL\_ONE\_MINUS\_DST\_COLOR, GL\_SRC\_ALPHA, GL\_ONE\_MINUS\_SRC\_ALPHA, GL\_DST\_ALPHA, GL\_ONE\_MINUS\_DST\_ALPHA,
                 * GL\_CONSTANT\_COLOR, GL\_ONE\_MINUS\_CONSTANT\_COLOR, GL\_CONSTANT\_ALPHA, GL\_ONE\_MINUS\_CONSTANT\_ALPHA, and
                 * GL\_ONE\_MINUS\_SRC\_ALPHA.<br>
                 * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
                 * @property blendDFactor
                 * @type Number
                 */
                blendDFactor: {
                    get: function () { return _blendDFactorRGB; },
                    set: function (value) {
                        thisObj.blendDFactorAlpha = value;
                        thisObj.blendDFactorRGB = value;
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

                if (!gl.getProgramParameter(_shaderProgramId, Constants.GL_LINK_STATUS)) {
                    errorLog("Could not initialise shaders");
                    return false;
                }

                uniqueVersionCounter = (shaderUniqueVersionCounter++);

                gl.useProgram(_shaderProgramId);
                glState.boundShader = _shaderProgramId;
                numberOfActiveUniforms = gl.getProgramParameter(_shaderProgramId, Constants.GL_ACTIVE_UNIFORMS);
                updateActiveUniforms(numberOfActiveUniforms);

                activeAttributes = gl.getProgramParameter(_shaderProgramId, Constants.GL_ACTIVE_ATTRIBUTES);
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
                    engine.removeEventListener('contextLost', thisObj.contextLost);
                    engine.removeEventListener('contextRestored', thisObj.contextRestored);
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
                        Util.fail("Cannot bind a shader that is not valid");
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
                    blendSFactorRGB: _blendSFactorRGB,
                    blendDFactorRGB: _blendDFactorRGB,
                    blendSFactorAlpha: _blendSFactorAlpha,
                    blendDFactorAlpha: _blendDFactorAlpha,
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

            this.init = function(config){
                Util.applyConfig(thisObj, config, ["uid"]);
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
            };
            this.init(config);
        };


        /**
         * @method getPrecompiledSource
         * @param {String} sourcecode
         * @return {String} sourcecode after precompiler
         * @static
         */
        Shader.getPrecompiledSource = function (sourcecode) {
            var engine = EngineSingleton.engine,
                name,
                source,
                version = "#version 100",
                lineOffset = 1,
                indexOfNewline;
            if (Constants._DEBUG) {
                if (sourcecode === engine){
                    Util.fail("Shader.getPrecompiledSource() - engine parameter removed");
                    return null;
                }
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
            for (name in GLSLConstants) {
                if (GLSLConstants.hasOwnProperty(name)) {
                    if (typeof (name) === "string") {
                        source = GLSLConstants[name];
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
        Shader.prototype.bindMaterialUniform = function (material, engineUniforms) {
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
         * @param {kick.material.Material} material
         * @param {Object} engineUniforms
         * @param {kick.scene.Transform) transform
            */
        Shader.prototype.bindUniform = function (material, engineUniforms, transform) {
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
                modelView = Mat4.multiply(tempMat4, engineUniforms.viewMatrix, globalTransform);
                if (mv) {
                    gl.uniformMatrix4fv(mv.location, false, modelView);
                }
                if (norm) {
                    // note this can be simplified to
                    // var normalMatrix = math.Mat4.toMat3(math.Mat3.create(), finalModelView);
                    // if the modelViewMatrix is orthogonal (non-uniform scale is not applied)
                    //var normalMatrix = mat3.transpose(mat4.toInverseMat3(finalModelView));
                    normalMatrix = Mat4.toNormalMat3(tempMat3, modelView);
                    if (ASSERT) {
                        if (!normalMatrix) {
                            Util.fail("Singular matrix");
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
                gl.uniformMatrix4fv(mvProj.location, false, Mat4.multiply(tempMat4, engineUniforms.viewProjectionMatrix, globalTransform));
            }
            if (gameObjectUID) {
                uidAsVec4 = Util.uint32ToVec4(transform.gameObject.uid, tmpVec4);
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
                gl.uniformMatrix4fv(_lightMat.location, false, Mat4.multiply(tempMat4, engineUniforms.lightMatrix, globalTransform));
            }
        };

        /*
         * If the uniform value is not in a valid format, the uniformValue is converted
         * @method convertUniformValue
         * @param {Number} type
         * @param {Object} uniformValue
         * @param {kick.core.Engine} engine
         * @static
         */
        Shader.convertUniformValue = function (type, uniformValue, engine) {
            if (type === Constants.GL_SAMPLER_2D || type === Constants.GL_SAMPLER_CUBE) {
                if (uniformValue && typeof uniformValue.ref === 'number') {
                    return engine.project.load(uniformValue.ref);
                }
            }
            if (Array.isArray(uniformValue) || typeof uniformValue === 'number') {
                var array = uniformValue;
                if (typeof array === 'number') {
                    array = [array];
                }
                if (type === Constants.GL_INT || type === Constants.GL_INT_VEC2 || type === Constants.GL_INT_VEC3 || type === Constants.GL_INT_VEC4) {
                    return new Int32Array(array);
                } else {
                    return new Float32Array(array);
                }
            }
            return uniformValue;
        };

        Object.freeze(Shader);

        return Shader;
    });