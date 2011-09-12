/**
 * description _
 * @module KICK
 */
var KICK = KICK || {};

KICK.namespace = KICK.namespace || function (ns_string) {
    var parts = ns_string.split("."),
        parent = KICK,
        i;
    // strip redundant leading global
    if (parts[0] === "KICK") {
        parts = parts.slice(1);
    }

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

    var core = KICK.namespace("KICK.core"),
        scene = KICK.namespace("KICK.scene"),
        renderer = KICK.namespace("KICK.renderer");

    /**
     * description The kickstart game engine
     * @class Engine
     * @namespace KICK.core
     * @constructor
     * @param {String} id elementid of canvas tag
     * @param {KICK.core.Config} config Optional, configuration object
     */
    core.Engine = function (id, config) {
        var gl = null,
            canvas = document.getElementById(id),
            webGlContextNames = ["experimental-webgl","webgl"],
            thisObj = this,
            activeRenderer;
        /**
         * @property running
         * @type Boolean
         */
        this.running = true;
        /**
         * The WebGL context (readonly)
         * @property gl
         * @type WebGLContext
         */
        Object.defineProperty(this, "gl", {
            get: function () {return gl;}
        });
        /**
         * The canvas element (readonly)
         * @property canvas
         * @type HTML-Element
         */
        Object.defineProperty(this, "canvas", {
            value: canvas
        });
        /**
         * @property activeScene
         * @type KICK.scene.Scene
         */
        this.activeScene = new scene.Scene(this);
        /**
         * The renderer
         * @property renderer
         * @type KICK.renderer.Renderer
         */
        Object.defineProperty(this, "renderer", {
            get: function () {
                return activeRenderer;
            },
            set: function (val) {
                if (scene.ComponentChangedListener.isComponentListener(activeRenderer)) {
                    this.activeScene.removeComponentListener(activeRenderer);
                }
                activeRenderer = val;
                if (scene.ComponentChangedListener.isComponentListener(activeRenderer)) {
                    this.activeScene.addComponentListener(activeRenderer);
                }
                activeRenderer.init(gl);
            }
        });

        /**
         * Time object of the engine. Is updated every frame
         * @property time
         * @type KICK.core.Time
         */
        Object.defineProperty(this, "time", {
            value: new core.Time()
        });

        /**
         * Configuration of the engine
         * @property config
         * @type KICK.core.Config
         */
        Object.defineProperty(this, "config", {
            value: new core.Config(config || {})
        });

        /**
         * @method gameLoop
         * @param time
         */
        this.gameLoop = function (time) {
            this.time.deltaTime = time-this.time.time;
            this.time.time = time;
            this.time.frameCount += 1;
            this.activeScene.update();
            this.renderer.render();

            if (this.running) {
                var wrapperFunctionToMethodOnObject = function (time_) {
                    thisObj.gameLoop(time_);
                };
                requestAnimationFrame(wrapperFunctionToMethodOnObject,this.canvas);
            }
        };

        /**
         * @method init
         * @private
         */
        (function init() {
            for (var i = webGlContextNames.length-1; i >= 0; i--) {
                try {
                    gl = canvas.getContext(webGlContextNames[i]);
                    if (gl) {
                        break;
                    }
                } catch (e) {
                    // ignore
                    alert(e);
                }
            }

            if (!gl) {
                throw {
                    name: "Error",
                    message: "Cannot create gl-context"
                };
            }
            core.Constants = gl;
            thisObj.renderer = new renderer.ForwardRenderer();

            canvas.addEventListener("resize",
                function () {
                    gl.viewportWidth = canvas.width;
                    gl.viewportHeight = canvas.height;
                },
                false);

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            thisObj.gameLoop(thisObj.startTime);
        }());
    };

    /**
     * _
     * @class Config
     * @namespace KICK.core
     * @constructor
     * @param {Config} config defines one or more properties
     */
    core.Config = function(config){
        /**
         * Number of bytes the vertex data should be aligned with. Default value is 4.
         * @property alignedVertexDataByte
         * @type {Date}
         */
        this.alignedVertexDataByte = config.alignedVertexDataByte || 4;
    };

    /**
     * _
     * @class Time
     * @namespace KICK.core
     * @constructor
     */
    core.Time = function(){
        return {
            /**
             * @property startTime
             * @type {Date}
             */
            startTime: Date.now(),
            /**
             * Current time
             * @property time
             * @type {Date}
             */
            time: this.startTime,
            /**
             * Millis between this frame and last frame
             * @property deltaTime
             * @type {Number}
             */
            deltaTime: 0,
            /**
             * Number of frames since start
             * @property frameCount
             * @type {Number}
             */
            frameCount: 0,
            /**
             * @method getTimeSinceStart
             * @return {Number} time since start
             */

            getTimeSinceStart: function () {
                return this.time-this.startTime;
            },
            /**
             * @method getAvarageFramesPerSecond
             * @return fps since start
             */
            getAvarageFramesPerSecond: function () {
                return this.frameCount/(this.getTimeSinceStart()*0.001);
            }
        };
    };

    /**
     * Utility class for miscellaneous functions. The class is static
     * @class Util
     * @namespace KICK.core
     */
    core.Util = {
        /**
         * Remove one element from an array - either the first instance or all instances
         * @method removeElementFromArray
         * @static
         * @param array {Array}
         * @param removeValue {Object} value to be deleted
         * @param deleteAll {boolean} deletaAll objects (or exit function after first deletion)
         */
        removeElementFromArray: function (array, removeValue, deleteAll) {
            for(var i=array.length-1; i>=0; i--) {
                if(array[i] === removeValue) {
                    array.splice(i, 1);
                    if (!deleteAll) {
                        break;
                    }
                }
            }
        },

        /**
         * Removes all values from one array in another array
         * @method removeElementsFromArray
         * @static
         * @param array {Array}
         * @param removeValues {Object} value to be deleted
         */
        removeElementsFromArray: function (array, removeValues) {
            var i,j;
            for(i=array.length-1; i>=0; i--) {
                for (j=removeValues.length-1;j>=0;j--) {
                    if(array[i] === removeValues[j]) {
                        array.splice(i, 1);
                    }
                }
            }
        },
        /**
         * Insert the element into a sorted array
         * @method insertSorted
         * @param {Object} element
         * @param {Array} sortedArray
         * @param {Function} sortFunc has the signature foo(obj1,obj2) returns Number. Optional (uses numberSort as default)
         */
        insertSorted : function (element,sortedArray,sortFunc) {
            var i;
            if (!sortFunc) {
                sortFunc = this.numberSortFunction;
            }
            // assuming that the array is relative small, todo: add support for larger array using binary search
            for (i = sortedArray.length-1; i >= 0; i--) {
                if (sortFunc(sortedArray[i],element) < 0) {
                    sortedArray.splice(i+1,0,element);
                    return;
                }
            }
            sortedArray.unshift( element );
        },
        /**
         * Returns a-b
         * @method numberSortFunction
         * @param a
         * @param b
         */
        numberSortFunction : function (a,b) {
            return a-b;
        }
    };


    Object.freeze(core.Util);


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// Usage
// window.requestAnimationFrame(function (/* time */ time) {
// time ~= +new Date // the unix time
// }, /* optional bounding elem */ elem);
//
// shim layer with setTimeout fallback
    if (typeof window.requestAnimationFrame === "undefined") {
        window.requestAnimationFrame = (function () {
            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function (/* function */ callback, /* DOMElement */ element) {
                    var fps60 = 16.7;
                    window.setTimeout(callback, fps60);
                };
        })();
    }


// workaround for undefined consoles
    if (typeof window.console === "undefined") {
        window.console = {};
    }
    if (typeof window.console.log === "undefined") {
        window.console.log = function (v) {
            alert (v);
        }
    }
})();