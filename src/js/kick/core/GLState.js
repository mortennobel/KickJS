define(["kick/core/Constants", "kick/core/Util"], function (constants, Util) {
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
            drawBuffersExt = null,
            elementIndexUIntExt = null,
            colorBufferFloatExt = null,
            colorBufferHalfFloatExt = null,
            reloadExtensions = function(){
                vertexArrayObjectExt = engine.getGLExtension("OES_vertex_array_object");
                standardDerivativesExt = engine.getGLExtension("OES_standard_derivatives");
                textureFloatExt = engine.getGLExtension("OES_texture_float");
                textureFloatHalfExt = engine.getGLExtension("OES_texture_half_float");
                depthTextureExt = engine.getGLExtension("WEBGL_depth_texture");
                textureFilterAnisotropicExt = engine.getGLExtension("EXT_texture_filter_anisotropic") || engine.getGLExtension("WEBGL_texture_filter_anisotropic");
                drawBuffersExt = engine.getGLExtension("EXT_draw_buffers") || engine.getGLExtension("WEBGL_draw_buffers");
                elementIndexUIntExt = engine.getGLExtension("OES_element_index_uint");
                colorBufferFloatExt = engine.getGLExtension("WEBGL_color_buffer_float") || engine.getGLExtension("EXT_color_buffer_float");
                colorBufferHalfFloatExt = engine.getGLExtension("EXT_color_buffer_half_float");
            },
            clearExtensions = function(){
                vertexArrayObjectExt = null;
                standardDerivativesExt = null;
                textureFloatExt = null;
                textureFloatHalfExt = null;
                depthTextureExt = null;
                textureFilterAnisotropicExt = null;
                drawBuffersExt = null;
                elementIndexUIntExt = null;
                colorBufferFloatExt = null;
                colorBufferHalfFloatExt = null;
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
         * @deprecated
         */
        this.renderTarget = null;
        Object.defineProperties(this, {
            renderTarget:{
                get:function(){
                    if (ASSERT){
                        Util.warn("GLState.renderTarget Deprecated");
                    }
                },
                set:function(){
                    if (ASSERT){
                        Util.warn("GLState.renderTarget Deprecated");
                    }
                }

            }
        });
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
         * Represent the state of CULL\_FACE (enabled / disabled) and cullFace (). Values must be one of:
         * GL\_FRONT, GL\_FRONT\_AND\_BACK, GL\_BACK or GL\_NONE. (If none CULL\_FACE is disabled otherwise enabled)
         * @property faceCulling
         * @type Number
         */
        this.faceCulling = null;

        /**
         * Represents the current depthFunc used. Must be one of the following values:
         * GL\_NEVER, GL\_LESS, GL\_EQUAL, GL\_LEQUAL, GL\_GREATER, GL\_NOTEQUAL, GL\_GEQUAL or GL\_ALWAYS.
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
        this.viewportSize = new Float32Array(2);

        Object.defineProperties(this, {
            /**
             * The OES\_vertex\_array\_object extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/OES\_vertex\_array\_object/
             * @property vertexArrayObjectExtension
             * @type Object
             * @final
             */
            vertexArrayObjectExtension:{
                get: function(){
                    return vertexArrayObjectExt;
                },
                enumerable:true
            },
            /**
             * The OES\_standard\_derivatives extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/OES\_standard\_derivatives/
             * @property standardDerivativesExtension
             * @type Object
             * @final
             */
            standardDerivativesExtension:{
                get: function(){
                    return standardDerivativesExt;
                },
                enumerable:true
            },
            /**
             * The OES\_texture\_float extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/OES\_texture\_float/
             * @property textureFloatExtension
             * @type Object
             * @final
             */
            textureFloatExtension:{
                get: function(){
                    return textureFloatExt;
                },
                enumerable:true
            },
            /**
             * The OES\_texture\_half\_float extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/OES\_texture\_half\_float/
             * @property textureFloatHalfExtension
             * @type Object
             * @final
             */
            textureFloatHalfExtension:{
                get: function(){
                    return textureFloatHalfExt;
                },
                enumerable:true
            },
            /**
             * The WEBGL\_depth\_texture extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/WEBGL\_depth\_texture/
             * @property depthTextureExtension
             * @type Object
             * @final
             */
            depthTextureExtension:{
                get: function(){
                    return depthTextureExt;
                },
                enumerable:true
            },
            /**
             * The EXT\_texture\_filter\_anisotropic extension (if available)
             * See http://www.khronos.org/registry/webgl/extensions/EXT\_texture\_filter\_anisotropic/
             * @property textureFilterAnisotropicExtension
             * @type Object
             * @final
             */
            textureFilterAnisotropicExtension:{
                get: function(){
                    return textureFilterAnisotropicExt;
                },
                enumerable:true
            },
            /**
             * The EXT\_draw\_buffers / WEBGL\_draw\_buffers extension (if available). Also known as multiple render targets.
             * See http://www.khronos.org/registry/webgl/extensions/WEBGL_draw_buffers/
             * @property textureFilterAnisotropicExtension
             * @type Object
             * @final
             */
            drawBuffersExtension:{
                get: function(){
                    return drawBuffersExt;
                },
                enumerable:true
            },
            /**
             * WebGL 1.0 supports drawElements with <type> value of
             * UNSIGNED_BYTE and UNSIGNED_SHORT.  This extension adds
             * support for UNSIGNED_INT <type> values.
             * See http://www.khronos.org/registry/webgl/extensions/OES_element_index_uint/
             * @property elementIndexUIntExtension
             * @type Object
             * @final
             */
            elementIndexUIntExtension:{
                get: function(){
                    return elementIndexUIntExt;
                },
                enumerable:true
            },
            /**
             * Adds support for rendering to 32-bit floating-point color buffers.
             * See http://www.khronos.org/registry/webgl/extensions/WEBGL_color_buffer_float/
             * @property colorBufferFloatExtension
             * @type Object
             * @final
             */
            colorBufferFloatExtension:{
                get: function(){
                    return colorBufferFloatExt;
                },
                enumerable:true
            },
            /**
             * This extension exposes the EXT_color_buffer_half_float functionality to WebGL.
             * See http://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_half_float/
             * @property colorBufferHalfFloatExtension
             * @type Object
             * @final
             */
            colorBufferHalfFloatExtension:{
                get: function(){
                    return colorBufferHalfFloatExt;
                },
                enumerable:true
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

        engine.addEventListener('contextLost', clearExtensions);
        engine.addEventListener('contextRestored', reloadExtensions);
        engine.addEventListener('canvasResized', function(canvasSize){
            thisObj.viewportSize[0] = canvasSize[0];
            thisObj.viewportSize[1] = canvasSize[1];
        });

        reloadExtensions();
        if (ASSERT) {
            Object.preventExtensions(this);
        }
    };
});
