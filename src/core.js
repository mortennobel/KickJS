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
            activeRenderer,
            lastTime = new Date().getTime(),
            deltaTime = 0,
            timeObj = new core.Time(),
            timeSinceStart = 0,
            frameCount = 0,
            activeScene = new scene.Scene(this);
        /**
         * @property running
         * @type Boolean
         */
        this.running = true;

        Object.defineProperties(this,{
            /**
             * The WebGL context (readonly)
             * @property gl
             * @type WebGLContext
             */
            gl: {
                get: function () {return gl;}
            },
            /**
             * The canvas element (readonly)
             * @property canvas
             * @type HTML-Element
             */
            canvas:{
                value: canvas
            },
            /**
             * @property activeScene
             * @type KICK.scene.Scene
             */
            activeScene:{
                get: function(){ return activeScene},
                set: function(value){activeScene = value;}
            },
            /**
             * The renderer
             * @property renderer
             * @type KICK.renderer.Renderer
             */
            renderer:{
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
            },
            /**
             * Time object of the engine. Is updated every frame
             * @property time
             * @type KICK.core.Time
             */
            time:{
                value:timeObj
            },
            /**
             * Configuration of the engine
             * @property config
             * @type KICK.core.Config
             */
            config: {
                value: new core.Config(config || {})
            }
        });
        
        /**
         * @method _gameLoop
         * @param {Number} time current time in milliseconds
         * @private
         */
        this._gameLoop = function (time) {
            this.activeScene.update();
            this.renderer.render();
            deltaTime = time-lastTime;

            lastTime = time;

            timeSinceStart += deltaTime;

            frameCount += 1;

            if (this.running) {
                var wrapperFunctionToMethodOnObject = function (time_) {
                    thisObj._gameLoop(time_);
                };
                requestAnimationFrame(wrapperFunctionToMethodOnObject,this.canvas);
            }
        };

        /**
         * @method init
         * @private
         */
        (function init() {
            var c = KICK.core.Constants;
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
            thisObj.renderer = new renderer.ForwardRenderer();

            canvas.addEventListener("resize",
                function () {
                    gl.viewportWidth = canvas.width;
                    gl.viewportHeight = canvas.height;
                },
                false);

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(c.GL_DEPTH_TEST);
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            gl.clear(c.GL_COLOR_BUFFER_BIT | c.GL_DEPTH_BUFFER_BIT);

            Object.defineProperties(timeObj,{
                time:{
                    get: function(){return timeSinceStart;}
                },
                deltaTime:{
                    get: function(){return deltaTime;}
                },
                frameCount:{
                    get: function(){return frameCount;}
                },
                avarageFramesPerSecond:{
                    get: function(){
                        return frameCount/(timeSinceStart*0.001);
                    }
                }
            });
            Object.freeze(timeObj);

            timeSinceStart = 0;
            frameCount = 0;

            thisObj._gameLoop(lastTime);
        }());
    };

    /**
     * The global configuration of the engine. Cannot be changed during runtime.
     * @class Config
     * @namespace KICK.core
     * @constructor
     * @param {Config} config defines one or more properties
     */
    core.Config = function(config){
    };

    /**
     * A global timer object
     * @class Time
     * @namespace KICK.core
     */
    core.Time = function(){
        /**
         * Time since start in millis
         * @property time
         * @type Number
         */
        /**
         * Millis between this frame and last frame
         * @property deltaTime
         * @type Number
         */
        /**
         * Number of frames since start
         * @property frameCount
         * @type Number
         */
        /**
         * fps since start
         * @property avarageFramesPerSecond
         * @type Number
         */
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
         * @param {Number} a
         * @param {Number} b
         * @return {Number} a-b
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