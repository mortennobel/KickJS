define(["./Util", "./Constants"], function (Util, Constants) {
    "use strict";


    /**
     * The global configuration of the engine. Cannot be changed during runtime.
     * @example
     *      <canvas id="3dCanvas" width="50" height="50"></canvas>
     *      <script src="require.js"></script>
     *      <script type="text/javascript">
     *          var req = require.config({
     *                  paths: {
     *                      kick: 'kick-debug' // loads kick-debug.js (must be in same path)
     *                  }
     *              });
     *          req(['kick'],
     *                  function (kick) {
     *                      var config = {
                                enableDebugContext: true,
                                shadows: true
                            };
     *                      var engine = new kick.core.Engine('3dCanvas', config);
     *                      // [...]
     *                  }
     *          );
     *      </script>
     * @class Config
     * @namespace kick.core
     * @constructor
     * @param {Config} config defines one or more properties
     */
    return function (config) {
        /**
         * Adds support for highDPI (such as MacBook Pro retina)
         * Enabling this will create the canvas in high resolution - and wraps the mouse input as well.
         * @property highDPISupport
         * @type {Boolean}
         * @default true
         */
        this.highDPISupport = config.highDPISupport || true;
        /**
         * Use shadow maps to generate realtime shadows.<br>
         * Default value is false.
         * @property shadows
         * @type Boolean
         * @default false
         */
        this.shadows = config.shadows || false;
        /**
         * The maximum distance shadows are displayed from camera (the smaller the better quality of shadow map).
         * Default value is 20
         * @property shadowDistance
         * @type Number
         * @default 20
         */
        this.shadowDistance = config.shadowDistance || 20;
        /**
         * A multiplier that moves the near plane of the shadow map. Default is 2.0
         * @property shadowNearMultiplier
         * @type Number
         * @default 2.0
         */
        this.shadowNearMultiplier = config.shadowNearMultiplier || 2.0;
        /**
         * Shadow map resolution (relative to max texture size). Default is 1.0.
         * Allowed values are 1/2, 1/4, 1/8, etc.
         * @property shadowMapQuality
         * @type Number
         * @default 1.0
         */
        this.shadowMapQuality = config.shadowMapQuality || 1.0;

         /**
         * Maximum number of lights in scene. Default value is 1
         * @property maxNumerOfLights
         * @type Number
         * @default 1
         */
        this.maxNumerOfLights = typeof (config.maxNumerOfLights) === 'number' ? config.maxNumerOfLights : 1;

        /**
         * Checks for WebGL errors after each webgl function is called.
         * Should only be used for debugging.
         * Default value is false.
         * @property enableDebugContext
         * @type Boolean
         * @default false
         */
        this.enableDebugContext = typeof (config.enableDebugContext) === 'boolean' ? config.enableDebugContext  : false;

        /**
         * Allows grabbing the content of the canvas using canvasObj.toDataURL(...).<br>
         * Note that this has a performance penalty when enabled.<br>
         * Default value is false<br>
         * WebGL spec:  If false, once the drawing buffer is presented as described in theDrawing Buffer section,
         * the contents of the drawing buffer are cleared to their default values.
         * All elements of the drawing buffer (color, depth and stencil) are cleared.
         * If the value is true the buffers will not be cleared and will preserve their
         * values until cleared or overwritten by the author.
         * @property preserveDrawingBuffer
         * @type Boolean
         * @default false
         */
        this.preserveDrawingBuffer = config.preserveDrawingBuffer || false;

        /**
         * WebGL spec:  If the value is true, the drawing buffer has an alpha channel for the purposes
         * of performing OpenGL destination alpha operations and compositing with the page. If the value is false, no
         * alpha buffer is available.
         * @property alpha
         * @type Boolean
         * @default true
         */
        this.alpha = typeof (config.alpha) === 'boolean' ? config.alpha : true;

        /**
         * WebGL spec: If the value is true, the drawing buffer has a depth buffer of at least 16 bits.
         * If the value is false, no depth buffer is available.
         * @property alpha
         * @type Boolean
         * @default true
         */
        this.depth = typeof (config.depth) === 'boolean' ? config.depth : true;

        /**
         * WebGL spec: If the value is true, the drawing buffer has a stencil buffer of at least 8 bits.
         * If the value is false, no stencil buffer is available.
         * @property stencil
         * @type Boolean
         * @default false
         */
        this.stencil = typeof (config.stencil) === 'boolean' ? config.stencil : false;

        /**
         * WebGL spec: Default: true. If the value is true and the implementation supports antialiasing the drawing
         * buffer will perform antialiasing using its choice of technique (multisample/supersample) and quality.
         * If the value is false or the implementation does not support antialiasing, no antialiasing is performed.
         * @property antialias
         * @type Boolean
         * @default true
         */
        this.antialias = typeof (config.antialias) === 'boolean' ? config.antialias : true;

        /**
         * WebGL spec: Default: true. If the value is true the page compositor will assume the drawing buffer contains
         * colors with premultiplied alpha. If the value is false the page compositor will assume that colors in the
         * drawing buffer are not premultiplied. This flag is ignored if the alpha flag is false.
         * See Premultiplied Alpha for more information on the effects of the premultipliedAlpha flag.
         * @property premultipliedAlpha
         * @type Boolean
         * @default true
         */
        this.premultipliedAlpha = typeof (config.premultipliedAlpha) === 'boolean' ? config.premultipliedAlpha : true;

        /**
         * Polling of canvas resize. Default is 0 (meaning not polling)
         * @property checkCanvasResizeInterval
         * @type Number
         * @default 0
         */
        this.checkCanvasResizeInterval = config.checkCanvasResizeInterval || 0;

        /**
         * function (or function name) with the signature function(domElement) called when WebGL cannot be initialized.
         * Default function replaces the canvas element with an error description with a link to
         * http://get.webgl.org/troubleshooting/
         * @property webglNotFoundFn
         * @type Function | String
         */
        this.webglNotFoundFn = (function () {
            if (config.webglNotFoundFn) {
                if (typeof (config.webglNotFoundFn) === "string") {
                    return Util.namespace(config.webglNotFoundFn);
                } else {
                    return config.webglNotFoundFn;
                }
            }
            return function (domElement) {
                var errorMessage;
                domElement.innerHTML = "";
                errorMessage = document.createElement("div");
                errorMessage.style.cssText = domElement.style.cssText + ";width:" + domElement.width + "px;height:" + domElement.height +
                    "px;display: table-cell;vertical-align: middle;background:#ffeeee;";
                errorMessage.innerHTML = "<div style='padding:12px;text-align: center;'>It doesn't appear your computer can support WebGL.<br><br><a href=\"http://get.webgl.org/troubleshooting/\">Click here for more information.</a></div>";
                domElement.parentNode.replaceChild(errorMessage, domElement);
            };
        }());

        if (Constants._DEBUG) {
            (function (t) {
                var name,
                    supportedProperties,
                    n2;
                for (name in config) {
                    if (config.hasOwnProperty(name) && !t.hasOwnProperty(name)) {
                        supportedProperties = "Supported properties for kick.core.Config are: ";
                        for (n2 in t){
                            if (t.hasOwnProperty(n2) && typeof t[n2] !== "function") {
                                supportedProperties += "\n - "+n2;
                            }
                        }
                        Util.warn("kick.core.Config does not have any property "+name+"\n"+supportedProperties);
                    }
                }
            }(this));
        }
    };

});