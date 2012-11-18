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
    return function () {
        var thisObj = this;
        /**
         * The current clear color
         * @property currentClearColor
         * @type kick.math.vec4
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
         * @type kick.math.vec2
         */
        this.viewportSize = null;

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

        if (ASSERT) {
            Object.preventExtensions(this);
        }
    };
});
