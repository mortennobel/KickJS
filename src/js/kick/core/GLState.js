define(["kick/core/Constants"], function (constants) {
    "use strict";
    var ASSERT = constants._ASSERT;
    /**
     * This object should only be used by advanced users.
     * <br>
     * The GLState object contains properties representing the current WebGL states. This object is useful
     * when creating component with custom render methods. It is important that any state modified by such
     * method needs to be reset (set to null).
     * @class GLState
     * @constructor
     * @namespace kick.core
     * @param {kick.core.Engine} engine
     */
    return function (engine) {
        var thisObj = this,
            vertexArrayObjectExt = null,
            standardDerivativesExt = null,
            textureFloatExt = null,
            textureFloatHalfExt = null,
            depthTextureExt = null,
            textureFilterAnisotropicExt = null,
            reloadExtensions = function(){
                vertexArrayObjectExt = engine.getGLExtension("OES_vertex_array_object");
                standardDerivativesExt = engine.getGLExtension("OES_standard_derivatives");
                textureFloatExt = engine.getGLExtension("OES_texture_float");
                textureFloatHalfExt = engine.getGLExtension("OES_texture_half_float");
                depthTextureExt = engine.getGLExtension("WEBGL_depth_texture");
                textureFilterAnisotropicExt = engine.getGLExtension("EXT_texture_filter_anisotropic");
            },
            clearExtensions = function(){
                vertexArrayObjectExt = null;
                standardDerivativesExt = null;
                textureFloatExt = null;
                textureFloatHalfExt = null;
                depthTextureExt = null;
                textureFilterAnisotropicExt = null;
            };
        /**
         * The current clear color
         * @property currentClearColor
         * @type kick.math.Vec4
         */
        this.currentClearColor = null;
        /**
         * Current bound mesh buffer
         * @property meshBuffer
         * @type WebGLBuffer
         */
        this.meshBuffer = null;
        /**
         * The shader bound by the current mesh
         * @property meshShader
         * @type kick.material.Shader
         */
        this.meshShader = null;
        /**
         * Represents the current rendertarget state
         * @property renderTarget
         * @type kick.texture.RenderTexture
         */
        this.renderTarget = null;
        /**
         * Represents the current shader bound
         * @property boundShader
         * @type kick.material.Shader
         */
        this.boundShader = null;
        /**
         * Represent the material used
         * @property currentMaterial
         * @type kick.material.Material
         */
        this.currentMaterial = null;

        /**
         * Represent the state of CULL_FACE (enabled / disabled) and cullFace (). Values must be one of:
         * GL_FRONT, GL_FRONT_AND_BACK, GL_BACK or GL_NONE. (If none CULL_FACE is disabled otherwise enabled)
         * @property faceCulling
         * @type Number
         */
        this.faceCulling = null;

        /**
         * Represents the current depthFunc used. Must be one of the following values:
         * GL_NEVER, GL_LESS, GL_EQUAL, GL_LEQUAL, GL_GREATER, GL_NOTEQUAL, GL_GEQUAL or GL_ALWAYS.
         * @property zTest
         * @type Number
         */
        this.zTest = null;

        /**
         * Represents the current depthMask state.
         * @property depthMaskCache
         * @type Boolean
         */
        this.depthMaskCache = null;

        /**
         * Represents if blend is enabled and the current s-factor and d-factor
         * @property blendKey
         * @type Object
         */
        this.blendKey = null;

        /**
         * Represents state of polygon offset fill
         * @property polygonOffsetEnabled
         * @type Boolean
         */
        this.polygonOffsetEnabled = null;

        /**
         * The size of the current viewport
         * @property viewportSize
         * @type kick.math.Vec2
         */
        this.viewportSize = null;

        Object.defineProperties(this, {
            /**
             * The OES_vertex_array_object extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/OES_vertex_array_object/
             * @property vertexArrayObjectExtension
             * @type Object
             * @final
             */
            vertexArrayObjectExtension:{
                get: function(){
                    return vertexArrayObjectExt;
                }
            },
            /**
             * The OES_standard_derivatives extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/OES_standard_derivatives/
             * @property standardDerivativesExtension
             * @type Object
             * @final
             */
            standardDerivativesExtension:{
                get: function(){
                    return standardDerivativesExt;
                }
            },
            /**
             * The OES_texture_float extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/OES_texture_float/
             * @property textureFloatExtension
             * @type Object
             * @final
             */
            textureFloatExtension:{
                get: function(){
                    return textureFloatExt;
                }
            },
            /**
             * The OES_texture_half_float extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/OES_texture_half_float/
             * @property textureFloatHalfExtension
             * @type Object
             * @final
             */
            textureFloatHalfExtension:{
                get: function(){
                    return textureFloatHalfExt;
                }
            },
            /**
             * The WEBGL_depth_texture extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/
             * @property depthTextureExtension
             * @type Object
             * @final
             */
            depthTextureExtension:{
                get: function(){
                    return depthTextureExt;
                }
            },
            /**
             * The EXT_texture_filter_anisotropic extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/EXT_texture_filter_anisotropic/
             * @property textureFilterAnisotropicExtension
             * @type Object
             * @final
             */
            textureFilterAnisotropicExtension:{
                get: function(){
                    return textureFilterAnisotropicExt;
                }
            }
        });

        /**
         * Sets all properties to null
         * @method clear
         */
        this.clear = function () {
            var name;
            for (name in thisObj) {
                if (thisObj.hasOwnProperty(name) && name !== "clear") {
                    thisObj[name] = null;
                }
            }
        };

        engine.addContextListener({
            contextLost: clearExtensions,
            contextRestored: reloadExtensions
        });
        reloadExtensions();
        if (ASSERT) {
            Object.preventExtensions(this);
        }
    };
});
