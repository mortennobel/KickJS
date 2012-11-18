define(["./GLState", "./Project", "./Constants", "./ResourceLoader", "./MouseInput", "./KeyInput", "./Config", "./Util", "./EventQueue", "kick/scene/Scene", "kick/math", "./Time", "./WebGLDebugUtils", "./Shim"],
    function (GLState, Project, Constants, ResourceLoader, MouseInput, KeyInput, Config, Util, EventQueue, Scene, math, Time, WebGLDebugUtils) {
        "use strict";

        var ASSERT = Constants._ASSERT;

        /**
         * @module kick.core
         */

        /**
         * Game engine object
         * @class Engine
         * @namespace kick.core
         * @constructor
         * @param {String|canvas} idOrElement elementid of canvas tag or the canvas element
         * @param {kick.core.Config} config Optional, configuration object
         */
        return function (idOrElement, config) {
            var glState = new GLState(),
                gl = null,
                canvas = typeof idOrElement === 'string' ? document.getElementById(idOrElement) : idOrElement,
                webGlContextNames = ["experimental-webgl", "webgl"],
                thisObj = this,
                lastTime = new Date().getTime() - 16, // ensures valid delta time in next frame
                deltaTime = 0,
                timeObj = new Time(),
                timeSinceStart = 0,
                frame = 0,
                timeScale = 1,
                contextListeners = [],
                frameListeners = [],
                eventQueue,
                project = new Project(this),
                mouseInput = null,
                keyInput = null,
                activeScene,
                activeSceneNull = {updateAndRender: function () {}},
                animationFrameObj = {},
                wrapperFunctionToMethodOnObject = function (time_) {
                    thisObj._gameLoop(time_);
                },
                vec2 = math.Vec2;

            Object.defineProperties(this, {
                /**
                 * The current version of KickJS
                 * @property version
                 * @type String
                 */
                version: {
                    value: Constants._VERSION
                },
                /**
                 * Resource manager of the engine. Loads and cache resources.
                 * @property resourceLoader
                 * @type kick.core.ResourceLoader
                 */
                resourceLoader: {
                    value: new ResourceLoader(this)
                },
                /**
                 * Project describes the resources available for a given projects (such as Scenes, Materials, Shader and Meshes)
                 * @property project
                 * @type kick.core.Project
                 */
                project: {
                    value: project
                },
                /**
                 * The WebGL state(readonly). (Only used to keep track on webgl state across different objects)
                 * @property glState
                 * @type kick.core.GLState
                 * @protected
                 */
                glState: {
                    get: function () { return glState; }
                },
                /**
                 * The WebGL context (readonly)
                 * @property gl
                 * @type WebGLContext
                 */
                gl: {
                    get: function () { return gl; }
                },
                /**
                 * The canvas element (readonly)
                 * @property canvas
                 * @type HTML-Element
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
                            this.addFrameListener(mouseInput);
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
                            this.addFrameListener(keyInput);
                        }
                        return keyInput;
                    }
                },
                /**
                 * @property eventQueue
                 * @type kick.core.EventQueue
                 */
                eventQueue: {
                    get: function () {
                        return eventQueue;
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
                                cancelRequestAnimFrame(animationFrameObj);
                                animationFrameObj = null;
                            } else {
                                lastTime = new Date().getTime() - 16; // ensures valid delta time in next frame
                                animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject, thisObj.canvas);
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
                for (i = frameListeners.length - 1; i >= 0; i--) {
                    frameListeners[i].frameUpdated();
                }

                if (animationFrameObj !== null) {
                    animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject, thisObj.canvas);
                }
            };

            /**
             * Add a framelistener. Frame listeners are invoked last thing in update loop.<br>
             * Frame listener object must define the method frameUpdated()
             * @method addFrameListener
             * @param {Object} frameListener
             */
            this.addFrameListener = function (frameListener) {
                if (ASSERT) {
                    if (typeof frameListener.frameUpdated !== "function") {
                        Util.fail("frameListener must define the method frameUpdated");
                    }
                }
                frameListeners.push(frameListener);
            };

            /**
             * @method removeFrameListener
             * @param {Object} frameListener
             * @return {boolean} element removed
             */
            this.removeFrameListener = function (frameListener) {
                return Util.removeElementFromArray(frameListeners, frameListener);
            };

            /**
             * @method addContextListener
             * @param {Object} contextLostListener implements contextLost() and contextRestored(gl)
             */
            this.addContextListener = function (contextLostListener) {
                if (ASSERT) {
                    if ((typeof contextLostListener.contextLost !== "function") || (typeof contextLostListener.contextRestored !== "function")) {
                        Util.fail("contextLostListener must define the functions contextLost() and contextRestored(gl)");
                    }
                }
                contextListeners.push(contextLostListener);
            };

            /**
             * @method removeContextListener
             * @param contextLostListener
             */
            this.removeContextListener = function (contextLostListener) {
                return Util.removeElementFromArray(contextListeners, contextLostListener);
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
                glState.viewportSize = math.Vec2.create([canvas.width, canvas.height]);
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
                        Object.freeze(gl);
                        gl.enable(c.GL_DEPTH_TEST);
                        gl.enable(c.GL_SCISSOR_TEST);
                        return true;
                    };
                success = initGL();
                if (!success) {
                    thisObj.config.webglNotFoundFn(canvas);
                    return;
                }

                canvas.addEventListener("webglcontextlost", function (event) {
                    wasPaused = thisObj.paused;
                    thisObj.paused = true;
                    for (i = 0; i < contextListeners.length; i++) {
                        contextListeners[i].contextLost();
                    }
                    event.preventDefault();
                    gl = null;
                }, false);
                canvas.addEventListener("webglcontextrestored", function (event) {
                    glState.clear();
                    thisObj.canvasResized(); // reset viewportSize
                    initGL();
                    for (i = 0; i < contextListeners.length; i++) {
                        contextListeners[i].contextRestored(gl);
                    }
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

                activeScene = new Scene(thisObj);
                eventQueue = new EventQueue(thisObj);

                timeSinceStart = 0;
                frame = 0;

                thisObj._gameLoop(lastTime);
            }());
        };

    }
    );