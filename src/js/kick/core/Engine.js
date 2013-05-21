define(["require", "./GLState", "./Project", "./Constants", "./ResourceLoader", "./MouseInput", "./KeyInput", "./Config", "./Util", "./EventQueue", "kick/scene/Scene", "kick/math", "./Time", "./WebGLDebugUtils", "./EngineSingleton", "./Observable", "./Shim"],
    function (require, GLState, Project, Constants, ResourceLoader, MouseInput, KeyInput, Config, Util, EventQueue, Scene, math, Time, WebGLDebugUtils, EngineSingleton, Observable, Shim_NotUsed) {
        "use strict";

        var ASSERT = Constants._ASSERT,
            engineInstance = null;

        /**
         * @module kick.core
         */

        /**
         * Game engine object
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
         *                      // init engine (create 3d context)
         *                      var engine = new kick.core.Engine('3dCanvas');
         *                  }
         *          );
         *      </script>
         * @class Engine
         * @namespace kick.core
         * @constructor
         * @param {String|canvas} idOrElement elementid of canvas tag or the canvas element
         * @param {kick.core.Config} config={} Configuration object
         */
        var engine = function (idOrElement, config) {
            var glState,
                gl = null,
                canvas = typeof idOrElement === 'string' ? document.getElementById(idOrElement) : idOrElement,
                webGlContextNames = ["experimental-webgl", "webgl"],
                thisObj = this,
                lastTime = Date.now() - 16, // ensures valid delta time in next frame
                deltaTime = 0,
                timeObj = new Time(),
                timeSinceStart = 0,
                frame = 0,
                timeScale = 1,
                eventQueue,
                project = new Project(this),
                mouseInput = null,
                keyInput = null,
                activeScene,
                activeSceneNull = {updateAndRender: function () {}},
                animationFrameObj = {},
                wrapperFunctionToMethodOnObject = function (time_) {
                    if (time_ < 1e12) { // if highres timer. see http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
                        time_ = Date.now();
                    }
                    thisObj._gameLoop(time_);
                };

            Observable.call(this, [
                /**
                 * Fired when gl-context is lost
                 * @event contextLost
                 */
                "contextLost",
                /**
                 * Fired when gl-context is restored (after context has been lost).
                 * @event contextRestored
                 * @param {WebGLRenderingContext} glContext
                 */
                "contextRestored",
                /**
                 * Fired before script updates methods has been run invoked
                 * @event preUpdateListener
                 */
                "preUpdateListener",
                /**
                 * Fired after script updates methods has been run invoked
                 * @event postUpdateListener
                 */
                "postUpdateListener"
                ]
            );

            Object.defineProperties(this, {
                /**
                 * The current version of KickJS
                 * @property version
                 * @type String
                 * @final
                 */
                version: {
                    value: Constants._VERSION
                },
                /**
                 * Resource manager of the engine. Loads and cache resources.
                 * @property resourceLoader
                 * @type kick.core.ResourceLoader
                 * @final
                 */
                resourceLoader: {
                    value: new ResourceLoader(thisObj)
                },
                /**
                 * Project describes the resources available for a given projects (such as Scenes, Materials, Shader and Meshes)
                 * @property project
                 * @type kick.core.Project
                 * @final
                 */
                project: {
                    value: project
                },
                /**
                 * The WebGL state(readonly). (Only used to keep track on webgl state across different objects)
                 * @property glState
                 * @type kick.core.GLState
                 * @protected
                 * @final
                 */
                glState: {
                    get: function () { return glState; }
                },
                /**
                 * The WebGL context (readonly)
                 * @property gl
                 * @type WebGLRenderingContext
                 * @final
                 */
                gl: {
                    get: function () { return gl; }
                },
                /**
                 * The canvas element (readonly)
                 * @property canvas
                 * @type HTML-Element
                 * @final
                 */
                canvas: {
                    value: canvas
                },
                /**
                 * If null then nothing is rendered
                 * @property activeScene
                 * @type kick.scene.Scene
                 */
                activeScene: {
                    get: function () {
                        if (activeScene === activeSceneNull) {
                            return null;
                        }
                        return activeScene;
                    },
                    set: function (value) {
                        if (value === null || typeof value === "undefined") {
                            activeScene = activeSceneNull;
                        } else {
                            activeScene = value;
                        }
                    }
                },
                /**
                 * Returns a mouseInput object. This object is used to detect mouse input.
                 * @property mouseInput
                 * @type kick.core.MouseInput
                 */
                mouseInput: {
                    get: function () {
                        if (!mouseInput) {
                            mouseInput = new MouseInput(thisObj);
                            thisObj.addEventListener('postUpdateListener', mouseInput.frameUpdated);
                        }
                        return mouseInput;
                    }
                },
                /**
                 * Returns a keyInput object. This object is used to detect key input.
                 * @property keyInput
                 * @type kick.core.KeyInput
                 */
                keyInput: {
                    get: function () {
                        if (!keyInput) {
                            keyInput = new KeyInput();
                            thisObj.addEventListener('postUpdateListener', keyInput.frameUpdated);
                        }
                        return keyInput;
                    }
                },
                /**
                 * @property eventQueue
                 * @type kick.core.EventQueue
                 * @final
                 */
                eventQueue: {
                    get: function () {
                        return eventQueue;
                    }
                },
                /**
                 * The width and height of the canvas
                 * @property canvasDimension
                 * @type kick.math.Vec2
                 */
                canvasDimension: {
                    get: function () {
                        return new Float32Array([canvas.width, canvas.height]);
                    }
                },
                /**
                 * Time object of the engine. Is updated every frame
                 * @property time
                 * @type kick.core.Time
                 */
                time: {
                    value: timeObj
                },
                /**
                 * Configuration of the engine
                 * @property config
                 * @type kick.core.Config
                 */
                config: {
                    value: new Config(config || {})
                },
                /**
                 * Controls is the gameloop is running
                 * @property paused
                 * @type boolean
                 */
                paused: {
                    get: function () {
                        return animationFrameObj === null;
                    },
                    set: function (pause) {
                        var currentValue = thisObj.paused;
                        if (pause !== currentValue) {
                            if (pause) {
                                window.cancelAnimationFrame(animationFrameObj);
                                animationFrameObj = null;
                            } else {
                                lastTime = Date.now() - 16; // ensures valid delta time in next frame
                                animationFrameObj = window.requestAnimationFrame(wrapperFunctionToMethodOnObject, thisObj.canvas);
                            }
                        }
                    }
                }
            });

            /**
             * @method isFullScreenSupported
             * @return Boolean
             */
            this.isFullScreenSupported = function () {
                return canvas.requestFullscreen || canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen;
            };

            /**
             * Query WebGL for a specific extension. If found, the extension object is returned.
             * "WEBKIT\_", "MOZ\_" vendor prefixes are used.
             * @method getGLExtension
             * @param {String} extensionName
             * @return Object|null
             */
            this.getGLExtension = function (extensionName) {
                var vendorPrefixes = ["", "WEBKIT_", "MOZ_"],
                    i,
                    ext;
                for(i = 0;i < vendorPrefixes.length; i++) {
                    ext = gl.getExtension(vendorPrefixes[i] + extensionName);
                    if (ext) {
                        return ext;
                    }
                }
                return null;
            };

            /**
             * Note that fullscreen needs to be invoked directly from a keyboard event or a mouse event from outside the
             * gameLoop. This means it is currently not possible to set fullscreen from a Component's update method.
             * @method setFullscreen
             * @param {Boolean} fullscreen
             */
            this.setFullscreen = function (fullscreen) {
                if (thisObj.isFullScreenSupported()) {
                    if (fullscreen) {
                        if (canvas.requestFullscreen) {
                            canvas.requestFullscreen();
                        } else if (canvas.webkitRequestFullScreen) {
                            canvas.onwebkitfullscreenchange = function () {
                                if (document.webkitIsFullScreen) {
                                    canvas.originalWidth = canvas.width;
                                    canvas.originalHeight = canvas.height;
                                    canvas.width = screen.width;
                                    canvas.height = screen.height;
                                } else {
                                    canvas.width = canvas.originalWidth;
                                    canvas.height = canvas.originalHeight;
                                }
                                thisObj.canvasResized();
                            };
                            canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                        } else if (canvas.mozRequestFullScreen) {
                            canvas.mozRequestFullScreen();
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        } else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        }
                    }
                }
            };

            /**
             * @method _gameLoop
             * @param {Number} time current time in milliseconds
             * @private
             */
            this._gameLoop = function (time) {
                var i;
                deltaTime = time - lastTime;
                lastTime = time;
                deltaTime *= timeScale;
                timeSinceStart += deltaTime;
                frame += 1;
                eventQueue.run();

                activeScene.updateAndRender();
                thisObj.fireEvent("postUpdateListener");

                if (animationFrameObj !== null) {
                    animationFrameObj = window.requestAnimationFrame(wrapperFunctionToMethodOnObject, thisObj.canvas);
                }
            };

            /**
             * Add a framelistener. Frame listeners are invoked last thing in update loop.<br>
             * Frame listener object must define the method frameUpdated()
             * @method addFrameListener
             * @param {Object} frameListener
             * @deprecated Use addEventListener("postUpdateListener", frameListener) instead
             */
            this.addFrameListener = function (frameListener) {
                Util.fail("Use addEventListener('postUpdateListener', frameListener) instead");
                thisObj.addEventListener("postUpdateListener", frameListener);
            };

            /**
             * @method removeFrameListener
             * @param {Object} frameListener
             * @return {boolean} element removed
             * @deprecated
             */
            this.removeFrameListener = function (frameListener) {
                Util.fail("Use removeEventListener('postUpdateListener', frameListener) instead");
                thisObj.removeEventListener("postUpdateListener", frameListener);
            };

            /**
             * @method addContextListener
             * @param {Object} contextLostListener implements contextLost() and contextRestored(gl)
             * @deprecated
             */
            this.addContextListener = function (contextLostListener) {
                Util.fail("Use addEventListener('contextLost', fn) / addEventListener('contextRestored', fn)  instead");
                thisObj.addEventListener("contextLost", contextLostListener.contextLost);
                thisObj.addEventListener("contextRestored", contextLostListener.contextRestored);
            };

            /**
             * @method removeContextListener
             * @param contextLostListener
             * @deprecated
             */
            this.removeContextListener = function (contextLostListener) {
                Util.fail("Use removeEventListener('contextLost', fn) / removeEventListener('contextRestored', fn)  instead");
                thisObj.removeEventListener("contextLost", contextLostListener.contextLost);
                thisObj.removeEventListener("contextRestored", contextLostListener.contextRestored);
            };


            /**
             * Creates a uniq id
             * @method createUID
             * @return {Number} uniq id
             */
            this.createUID = function () {
                return ++project.maxUID;
            };

            /**
             * Get the uid of a component (or creates the uid if not defined)
             * @method getUID
             * @param {Object} object
             * @return {String}
             */
            this.getUID = function (object) {
                if (!object.uid) {
                    object.uid = thisObj.createUID();
                }
                return object.uid;
            };

            /**
             * This method should be invoked when the canvas is resized.<br>
             * This will change the viewport size of the WebGL state.<br>
             * Instead of calling this method explicit, the configuration parameter
             * checkCanvasResizeInterval can also be set to support automatically checks
             * @method canvasResized
             */
            this.canvasResized = function () {
                glState.viewportSize = thisObj.canvasDimension;
                if (mouseInput) {
                    mouseInput.updateCanvasElementPosition();
                }
            };

            /**
             * @method init
             * @private
             */
            (function init() {
                var c = Constants,
                    i,
                    success,
                    wasPaused,
                    initGL = function () {
                        if (thisObj.config.highDPISupport) {
                            var devicePixelRatio = window.devicePixelRatio || 1;

                            // set the size of the drawingBuffer based on the size it's displayed.
                            canvas.width = canvas.clientWidth * devicePixelRatio;
                            canvas.height = canvas.clientHeight * devicePixelRatio;
                        }
                        for (i = webGlContextNames.length - 1; i >= 0; i--) {
                            try {
                                gl = canvas.getContext(webGlContextNames[i], thisObj.config);
                                if (gl) {
                                    break;
                                }
                            } catch (e) {
                                // ignore
                                alert(e);
                            }
                        }
                        if (!gl) {
                            return false;
                        }
                        if (thisObj.config.enableDebugContext) {
                            if (WebGLDebugUtils && Constants._DEBUG) {
                                // Checking that none of the WebGL arguments are undefined
                                // http://www.khronos.org/webgl/wiki/Debugging#Checking_that_none_of_your_arguments_are_undefined
                                var validateNoneOfTheArgsAreUndefined = function (functionName, args) {
                                    var ii;
                                    for (ii = 0; ii < args.length; ++ii) {
                                        if (args[ii] === undefined) {
                                            console.error("undefined passed to gl." + functionName + "(" +
                                                WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
                                        }
                                    }
                                };
                                gl = WebGLDebugUtils.makeDebugContext(gl, undefined, validateNoneOfTheArgsAreUndefined);
                            } else {
                                console.log("webgl-debug.js not included - cannot find WebGLDebugUtils");
                            }
                        }
                        glState = new GLState(thisObj);
                        Object.freeze(gl);
                        gl.enable(c.GL_DEPTH_TEST);
                        gl.enable(c.GL_SCISSOR_TEST);
                        return true;
                    };
                EngineSingleton.engine = thisObj;
                engineInstance = thisObj;

                success = initGL();
                if (!success) {
                    thisObj.config.webglNotFoundFn(canvas);
                    return;
                }
                console.log("KickJS "+thisObj.version);
                canvas.addEventListener("webglcontextlost", function (event) {
                    wasPaused = thisObj.paused;
                    thisObj.paused = true;
                    thisObj.fireEvent("contextLost");
                    event.preventDefault();
                    gl = null;
                }, false);
                canvas.addEventListener("webglcontextrestored", function (event) {
                    glState.clear();
                    thisObj.canvasResized(); // reset viewportSize
                    initGL();
                    thisObj.fireEvent("contextRestored", gl);
                    // restart rendering loop
                    if (!wasPaused) {
                        thisObj.paused = false;
                    }
                    event.preventDefault();
                }, false);

                thisObj.canvasResized();
                if (thisObj.config.checkCanvasResizeInterval) {
                    setInterval(function () {
                        if (canvas.height !== glState.viewportSize[0] || canvas.width !== glState.viewportSize[1]) {
                            thisObj.canvasResized();
                        }
                    }, thisObj.config.checkCanvasResizeInterval);
                }

                // API documentation of Time is found in kick.core.Time
                Object.defineProperties(timeObj, {
                    time: {
                        get: function () { return timeSinceStart; }
                    },
                    deltaTime: {
                        get: function () { return deltaTime; }
                    },
                    frame: {
                        get: function () { return frame; }
                    },
                    scale: {
                        get: function () {
                            return timeScale;
                        },
                        set: function (newValue) {
                            timeScale = newValue;
                        }
                    }
                });
                Object.freeze(timeObj);

                activeScene = new Scene();
                eventQueue = new EventQueue(thisObj);

                timeSinceStart = 0;
                frame = 0;

                thisObj._gameLoop(lastTime);
            }());
        };
        Object.defineProperties(engine, {
            /**
             * Returns the singleton engine object
             * @property instance
             * @type kick.core.Engine
             * @static
             */
            instance: {
                get: function () {
                    return engineInstance;
                }
            }
        });
        return engine;
    }
    );