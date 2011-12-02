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
KICK.namespace = function (ns_string) {
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

    var core = KICK.namespace("KICK.core"),
        constants = core.Constants,
        scene = KICK.namespace("KICK.scene"),
        ASSERT = constants._ASSERT,
        DEBUG = constants._DEBUG;

    /**
     * Game engine object
     * @class Engine
     * @namespace KICK.core
     * @constructor
     * @param {String} idOrElement elementid of canvas tag or the canvas element
     * @param {KICK.core.Config} config Optional, configuration object
     */
    core.Engine = function (idOrElement, config) {
        var gl = null,
            canvas = typeof idOrElement === 'string' ? document.getElementById(idOrElement) : idOrElement,
            webGlContextNames = ["experimental-webgl","webgl"],
            thisObj = this,
            lastTime = new Date().getTime()-16, // ensures valid delta time in next frame
            deltaTime = 0,
            timeObj = new core.Time(),
            timeSinceStart = 0,
            frameCount = 0,
            timeScale = 1,
            contextListeners = [],
            frameListeners = [],
            project = new core.Project(this),
            mouseInput = null,
            keyInput = null,
            activeScene,
            animationFrameObj = {},
            wrapperFunctionToMethodOnObject = function (time_) {
                thisObj._gameLoop(time_);
            },
            vec2 = KICK.math.vec2;

        Object.defineProperties(this,{
            /**
             * The current version of KickJS
             * @property version
             * @type String
             */
            version:{
                value:constants._VERSION
            },
            /**
             * Resource manager of the engine. Loads and cache resources.
             * @property resourceManager
             * @type KICK.core.ResourceManager
             */
            resourceManager:{
                value: new core.ResourceManager(this)
            },
            /**
             * Project describes the resources available for a given projects (such as Scenes, Materials, Shader and Meshes)
             * @property project
             * @type KICK.core.Project
             */
            project:{
                value: project
            },
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
                set: function(value){
                    if (value === null){
                        activeScene = new KICK.scene.Scene(engine);
                    } else {
                        activeScene = value;
                    }
                }
            },
            /**
             * Returns a mouseInput object. This object is used to detect mouse input.
             * @property mouseInput
             * @type KICK.core.MouseInput
             */
            mouseInput:{
                get:function(){
                    if (!mouseInput){
                        mouseInput = new core.MouseInput(thisObj);
                        this.addFrameListener(mouseInput);
                    }
                    return mouseInput;
                }
            },
            /**
             * Returns a keyInput object. This object is used to detect key input.
             * @property keyInput
             * @type KICK.core.KeyInput
             */
            keyInput:{
                get: function(){
                    if (!keyInput){
                        keyInput = new core.KeyInput();
                        this.addFrameListener(keyInput);
                    }
                    return keyInput;
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
            },
            /**
             * Controls is the gameloop is running
             * @property paused
             * @type boolean
             */
            paused:{
                get:function(){
                    return animationFrameObj === null;
                },
                set:function(pause){
                    var currentValue = thisObj.paused;
                    if (pause != currentValue){
                        if (pause){
                            cancelRequestAnimFrame(animationFrameObj);
                            animationFrameObj = null;
                        } else {
                            lastTime = new Date().getTime()-16, // ensures valid delta time in next frame
                            animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject,this.canvas);
                        }
                    }
                }
            }
        });

        /**
         * @method _gameLoop
         * @param {Number} time current time in milliseconds
         * @private
         */
        this._gameLoop = function (time) {
            this.activeScene.updateAndRender();
            for (var i=frameListeners.length-1;i>=0;i--){
                frameListeners[i].frameUpdated();
            }
            deltaTime = time-lastTime;
            lastTime = time;
            deltaTime *= timeScale;
            timeSinceStart += deltaTime;
            frameCount += 1;
            if (animationFrameObj !== null){
                animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject,this.canvas);
            }
        };

        /**
         * Add a framelistener. Frame listeners are invoked last thing in update loop.<br>
         * Frame listener object must define the method frameUpdated()
         * @method addFrameListener
         * @param {Object} frameListener
         */
        this.addFrameListener = function(frameListener){
            if (ASSERT){
                if (typeof frameListener.frameUpdated !== "function"){
                    KICK.core.Util.fail("frameListener must define the method frameUpdated");
                }
            }
            frameListeners.push(frameListener);
        };

        /**
         * @method removeFrameListener
         * @param {Object} frameListener
         * @return {boolean} element removed
         */
        this.removeFrameListener = function(frameListener){
            return core.Util.removeElementFromArray(frameListeners,frameListener);
        };

        /**
         * @method addContextListener
         * @param {Object} contextLostListener implements contextLost() and contextRestored(gl)
         */
        this.addContextListener = function(contextLostListener){
            if (ASSERT){
                if ((typeof contextLostListener.contextLost !== "function") ||
                    (typeof contextLostListener.contextRestored !== "function")){
                    KICK.core.Util.fail("contextLostListener must define the functions contextLost() and contextRestored(gl)");
                }
            }
            contextListeners.push(contextLostListener);
        };

        this.removeContextListener = function(contextLostListener){
            return core.Util.removeElementFromArray(contextListeners,contextLostListener);
        };


        /**
         * Creates a uniq id
         * @method createUID
         * @return {Number} uniq id
         */
        this.createUID = function(){
            return ++project.maxUID;
        };

        /**
         * Get the uid of a component (or creates the uid if not defined)
         * @method getUID
         * @param {Object} object
         * @return {String}
         */
        this.getUID = function(object){
            if (!object.uid){
                object.uid = thisObj.createUID();
            }
            return object.uid;
        };

        /**
         * This method should be invoked when the canvas is resized.<br>
         * This will change the viewport size of the WebGL context.<br>
         * Instead of calling this method explicit, the configuration parameter
         * checkCanvasResizeInterval can also be set to support automatically checks
         * @method canvasResized
         */
        this.canvasResized = function(){
            gl.viewportSize = vec2.create([canvas.width,canvas.height]);
            if (mouseInput){
                mouseInput.updateCanvasElementPosition();
            }
        };

        /**
         * @method init
         * @private
         */
        (function init() {
            var c = KICK.core.Constants,
                i,
                wasPaused,
                initGL = function(){
                    for (i = webGlContextNames.length-1; i >= 0; i--) {
                        try {
                            gl = canvas.getContext(webGlContextNames[i],thisObj.config);
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
                    if (thisObj.config.enableDebugContext){
                        if (window["WebGLDebugUtils"]){
                            gl = WebGLDebugUtils.makeDebugContext(gl);
                        } else {
                            console.log("webgl-debug.js not included - cannot find WebGLDebugUtils");
                        }
                    }
                    gl.enable(c.GL_DEPTH_TEST);
                    gl.enable(c.GL_SCISSOR_TEST);
                };
            initGL();

            canvas.addEventListener("webglcontextlost", function(event) {
                wasPaused = thisObj.paused;
                thisObj.pause();
                for (i=0;i<contextListeners.length;i++){
                    contextListeners[i].contextLost();
                }
                event.preventDefault();
            }, false);
            canvas.addEventListener("webglcontextrestored", function(event) {
                initGL();
                for (i=0;i<contextListeners.length;i++){
                    contextListeners[i].contextRestored(gl);
                }
                // restart rendering loop
                if (!wasPaused){
                    thisObj.resume();
                }
                event.preventDefault();
            }, false);
            
            thisObj.canvasResized();
            if (thisObj.config.checkCanvasResizeInterval){
                setInterval(function(){
                    if( canvas.height !== gl.viewportSize[0] || canvas.width !== gl.viewportSize[1] ){
                        thisObj.canvasResized();
                    }
                }, thisObj.config.checkCanvasResizeInterval);
            }

            // API documentation of Time is found in KICK.core.Time
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
                scale:{
                    get: function(){
                        return timeScale;
                    },
                    set:function(newValue){
                        timeScale = newValue;
                    }
                }
            });
            Object.freeze(timeObj);

            activeScene = new scene.Scene(thisObj);

            timeSinceStart = 0;
            frameCount = 0;

            thisObj._gameLoop(lastTime);
        }());
    };

    /**
     * A project asset is a object that can be serialized into a project and restored at a later state.<br>
     * The class only exist in documentation and is used to describe the behavior any project asset must implement.<br>
     * The constructor must take the following two parameters: KICK.core.Engine engine, {Object} config<br>
     * The config parameter is used to initialize the object and the content should match the output of the
     * toJSON method<br>
     * A toJSON method should exist on the object. This method should as a minimum write out the object's uid property.<br>
     * ProjectAsset objects may reference other ProjectAsset objects, however cyclic references are not allowed.
     * @class ProjectAsset
     * @namespace KICK.core
     */

    /**
     * A project is a container of all resources and assets used in a game.
     * @class Project
     * @namespace KICK.core
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {JSON} json project data
     */
    core.Project = function(engine){
        var resourceDescriptorsByUID = {},
            resourceCache = {},
            resourceReferenceCount = {},
            thisObj = this,
            _maxUID = 0;

        Object.defineProperties(this, {
            /**
             * The maximum UID used in the project
             * @property maxUID
             * @type Number
             */
            maxUID:{
                get:function(){
                    return _maxUID;
                },
                set:function(newValue){
                    _maxUID = newValue;
                }
            }
        });

        /**
         * Creates a new empty project.
         * @method newProject
         */
        this.newProject = function(){
            thisObj.loadProject({maxUID:0,resourceDescriptors:[]});
        };

        /**
         * Load a project of the form {maxUID:number,resourceDescriptors:[KICK.core.ResourceDescriptor]}
         * @method loadProject
         * @param {object} config
         */
        this.loadProject = function(config){
            config = config || {};
            var resourceDescriptors = config.resourceDescriptors || [];
            if (_maxUID>0){
                thisObj.closeProject();
            }
            _maxUID = config.maxUID || 0;
            for (var i=0;i<resourceDescriptors.length;i++){
                thisObj.addResourceDescriptor(resourceDescriptors[i]);
            }
        };

        /**
         * Close all resources in the project and remove all resource descriptors
         * @method closeProject
         */
        this.closeProject = function(){
            for (var uid in resourceDescriptorsByUID){
                thisObj.removeResourceDescriptor(uid);
            }
        };

        /**
         * Load a resource from the configuration (or cache).
         * Also increases the resource reference counter.
         * @method load
         * @param {String} uid
         * @return {KICK.core.ProjectAsset} resource or null if resource is not found
         */
        this.load = function(resourceUID){
            var resourceObject = resourceCache[resourceUID];
            if (resourceObject){
                resourceReferenceCount[resourceUID]++;
                return resourceObject;
            }
            var resourceConfig = resourceDescriptorsByUID[resourceUID];
            if (resourceConfig){
                resourceObject = resourceConfig.instantiate(engine);
                resourceCache[resourceUID] = resourceObject;
                resourceReferenceCount[resourceUID] = 1;
                return resourceObject;
            }
            if (DEBUG){
                core.Util.warn("Cannot find "+resourceUID);
                debugger;
            }
            return null;
        };

        /**
         * Load a resource from the configuration (or cache).
         * Also increases the resource reference counter.
         * If more objects exist with the same name, the first object is returned
         * @method loadByName
         * @param {String} name
         * @return {KICK.core.ProjectAsset} resource or null if resource is not found
         */
        this.loadByName = function(name){
            for (var uid in resourceDescriptorsByUID){
                var resource = resourceDescriptorsByUID[uid];
                if (resource.name === name){
                    return thisObj.load(resource.uid);
                }
            }
            if (DEBUG){
                core.Util.warn("Cannot find "+name);
                debugger;
            }
            return null;
        };

        /**
         * Decreases the resource reference counter. If resource is no longer
         * used it's destroy method will be invoked (if available).
         * @method release
         * @param resourceUID
         */
        this.release = function(resourceUID){
            var resourceObject = resourceCache[resourceUID];
            if (resourceObject){
                resourceReferenceCount[resourceUID]--;
                if (resourceReferenceCount[resourceUID] <= 0){
                    delete resourceCache[resourceUID];
                    delete resourceReferenceCount[resourceUID];
                    if (resourceObject.destroy){
                        resourceObject.destroy();
                    }
                }
            }
        };

        /**
         * Registers an asset in a Project.
         * @method registerObject
         * @param {Object} object
         * @param {String} type
         */
        this.registerObject = function(object, type){
            var uid = engine.getUID(object);
            if (resourceCache[uid]){
                return;
            }
            resourceCache[uid] = object;
            resourceReferenceCount[uid] = 1;
            if (!resourceDescriptorsByUID[uid]){ // only update if new object
                resourceDescriptorsByUID[uid] = new core.ResourceDescriptor({
                    uid:uid,
                    type:type,
                    config:{name:object.name} // will be generated on serialization
                });
            }
        };

        /**
         * Updates the resourceDescriptors with data from the initialized objects
         * @method refreshResourceDescriptors
         */
        this.refreshResourceDescriptors = function(){
            for (var uid in resourceDescriptorsByUID){
                if (resourceDescriptorsByUID[uid] instanceof core.ResourceDescriptor){
                    var liveObject = resourceCache[uid];
                    if (liveObject){
                        resourceDescriptorsByUID[uid].updateConfig(liveObject);
                    }
                }
            }
        };

        /**
         * @method getResourceDescriptorByType
         * @param {String} type
         * @return {Array[KICK.core.ResourceDescriptor]}
         */
        this.getResourceDescriptorByType = function(type){
            var res = [];
            for (var uid in resourceDescriptorsByUID){
                if (resourceDescriptorsByUID[uid].type === type){
                    res.push(resourceDescriptorsByUID[uid]);
                }
            }
            return res;
        };

        /**
         * @method addResourceDescriptor
         * @param {KICK.core.ResourceDescriptor_or_Object} resourceDescriptor
         * @return {KICK.core.ResourceDescriptor}
         */
        this.addResourceDescriptor = function(resourceDescriptor){
            if (!(resourceDescriptor instanceof core.ResourceDescriptor)){
                resourceDescriptor = new core.ResourceDescriptor(resourceDescriptor);
            }

            resourceDescriptorsByUID[resourceDescriptor.uid] = resourceDescriptor;
            return resourceDescriptor;
        };

        /**
         * Remove resource descriptor and destroy the resource if already allocated.
         * @method removeResourceDescriptor
         * @param {Number} resourceUID
         */
        this.removeResourceDescriptor = function(resourceUID){
            // destroy the resource
            var resource = resourceCache[resourceUID];
            if (resource && resource.detroy){
                resource.destroy();
            }
            // remove references
            delete resourceCache[resourceUID];
            delete resourceReferenceCount[resourceUID];
            delete resourceDescriptorsByUID[resourceUID];
        };

        /**
         * @method toJSON
         */
        this.toJSON = function(){
            var res = [];
            thisObj.refreshResourceDescriptors();
            for (var uid in resourceDescriptorsByUID){
                if (resourceDescriptorsByUID[uid] instanceof core.ResourceDescriptor){
                    res.push(resourceDescriptorsByUID[uid].toJSON());
                }
            }
            return {
                engineVersion:engine.version,
                maxUID:_maxUID,
                resourceDescriptors:res
            };
        };
    };

    /**
     * A project is a container of all resources and assets used in a game.<br>
     * Example usage:
     * <pre class="brush: js">
     * var materialConfig = {
     *          name:"Some material",
     *          shader:"Undefined",
     *          uniforms: {
     *              value:42,
     *              type: KICK.core.Constants.GL_FLOAT
     *          }
     *      };
     *      var resourceDescriptorConfig = {
     *          type: "KICK.material.Material",
     *          config: materialConfig,
     *          uid: 132
     *      };
     *      var materialDescriptor = new ResourceDescriptor(resourceDescriptorConfig);
     * </pre>
     * @class ResourceDescriptor
     * @namespace KICK.core
     * @constructor
     * @param {Object} config an object which attributes matches the properties of ResourceDescriptor
     */
    core.ResourceDescriptor = function(config){
        var _config = config || {},
            type = _config.type,
            uid = _config.uid,
            resourceConfig = _config.config,
            hasProperty = core.Util.hasProperty,
            createConfigInitialized = function(engine,config){
                var res = {};
                for (var name in config){
                    if (hasProperty(config,name)){
                        var value = config[name];
                        var reftype = value.reftype;
                        if (value && value.ref && reftype){
                            if (reftype === "resource"){
                                value = engine.resourceManager[value.refMethod](value.ref);
                            } else if (reftype === "project"){
                                value = engine.project.load(value.ref);
                            }
                        }
                        res[name] = value;
                    }
                }
                res.uid = uid;
                return res;
            };
        Object.defineProperties(this,{
            /**
             * The name may contain '/' as folder separator. The name property is a shorthand for config.name
             * @property name
             * @type String
             */
            name:{
                get: function(){
                    return resourceConfig.name;
                },
                set: function(newValue){
                    resourceConfig.name = newValue;
                }
            },
            /**
             * class name of the resource (such as 'KICK.material.Material')
             * @property type
             * @type String
             */
            type:{
                value: type
            },
            /**
             * Configuration of the resource.
             * Optional
             * @property config
             * @type Object
             */
            config:{
                get: function(){return resourceConfig;}
            },
            /**
             * @property uid
             * @type Number
             */
            uid:{
                value: uid
            }
        });

        /**
         * Updates the configuration with the one from object
         * @method updateConfig
         * @param {Object} object
         */
        this.updateConfig = function(object){
            resourceConfig = object.toJSON();
        };

        /**
         * Create a instance of the resource by calling the constructor function with
         * (engine,config) parameters.<br>
         * If the resource object has a init function, this is also invoked.
         * @method instantiate
         * @param {KICK.core.Engine} engine
         * @return {Object} instance of the resource
         */
        this.instantiate = function(engine){
            var resourceClass = KICK.namespace(type);
            var resource = new resourceClass(engine,createConfigInitialized(engine,resourceConfig));
            if (typeof resource.init === 'function'){
                resource.init();
            }
            return resource;
        };

        /**
         * @method toJSON
         * @return {Object} A json data object
         */
        this.toJSON = function(){
            return {
                type:type,
                uid:uid,
                config:resourceConfig
            };
        };
    };

    /**
     * The global configuration of the engine. Cannot be changed during runtime.
     * @class Config
     * @namespace KICK.core
     * @constructor
     * @param {Config} config defines one or more properties
     */
    core.Config = function(config){
         /**
         * Maximum number of lights in scene. Default value is 1
         * @property maxNumerOfLights
         * @type Number
         */
        this.maxNumerOfLights = config.maxNumerOfLights ? config.maxNumerOfLights : 1;

        /**
         * Checks for WebGL errors after each webgl function is called.
         * Should only be used for debugging.
         * Default value is false.
         * @property enableDebugContext
         * @type Boolean
         */
        this.enableDebugContext = typeof(config.enableDebugContext) === 'boolean' ? config.enableDebugContext  : false;

        /**
         * Allows grabbing the content of the canvas using canvasObj.toDataURL(...).<br>
         * Note that this has a performance penalty when enabled.<br>
         * Default value is false<br>
         * WebGL spec:  If false, once the drawing buffer is presented as described in theDrawing Buffer section,
         * the contents of the drawing buffer are cleared to their default values.
         * All elements of the drawing buffer (color, depth and stencil) are cleared.
         * If the value is true the buffers will not be cleared and will preserve their
         * values until cleared or overwritten by the author.
         * @property enableDebugContext
         * @type Boolean
         */
        this.preserveDrawingBuffer = config.preserveDrawingBuffer || false;

        /**
         * WebGL spec:  Default: true. If the value is true, the drawing buffer has an alpha channel for the purposes
         * of performing OpenGL destination alpha operations and compositing with the page. If the value is false, no
         * alpha buffer is available.
         * @property alpha
         * @type Boolean
         */
        this.alpha = typeof config.alpha === 'boolean' ? config.alpha : true;

        /**
         * WebGL spec: Default: true. If the value is true, the drawing buffer has a depth buffer of at least 16 bits.
         * If the value is false, no depth buffer is available.
         * @property alpha
         * @type Boolean
         */
        this.depth = typeof config.depth === 'boolean' ? config.depth : true;

        /**
         * WebGL spec: Default: false. If the value is true, the drawing buffer has a stencil buffer of at least 8 bits.
         * If the value is false, no stencil buffer is available.
         * @property stencil
         * @type Boolean
         */
        this.stencil = typeof config.stencil === 'boolean' ? config.stencil : false;

        /**
         * WebGL spec: Default: true. If the value is true and the implementation supports antialiasing the drawing
         * buffer will perform antialiasing using its choice of technique (multisample/supersample) and quality.
         * If the value is false or the implementation does not support antialiasing, no antialiasing is performed.
         * @property antialias
         * @type Boolean
         */
        this.antialias = typeof config.antialias === 'boolean' ? config.antialias : true;

        /**
         * WebGL spec: Default: true. If the value is true the page compositor will assume the drawing buffer contains
         * colors with premultiplied alpha. If the value is false the page compositor will assume that colors in the
         * drawing buffer are not premultiplied. This flag is ignored if the alpha flag is false.
         * See Premultiplied Alpha for more information on the effects of the premultipliedAlpha flag.
         * @property premultipliedAlpha
         * @type Boolean
         */
        this.premultipliedAlpha = typeof config.premultipliedAlpha === 'boolean' ? config.premultipliedAlpha : true;

        /**
         * Polling of canvas resize. Default is 0 (meaning not polling)
         * @property checkCanvasResizeInterval
         * @type Number
         */
        this.checkCanvasResizeInterval = config.checkCanvasResizeInterval || 0;
    };

    /**
     * A global timer object
     * @class Time
     * @namespace KICK.core
     */
    core.Time = function(){
        /**
         * Time since start in milliseconds. Read only
         * @property time
         * @type Number
         */
        /**
         * Millis between this frame and last frame. Read only
         * @property deltaTime
         * @type Number
         */
        /**
         * Number of frames since start. Read only
         * @property frameCount
         * @type Number
         */
        /**
         * Default value is 1.0. Can be used for implementing pause or slow-motion sequences
         * @property scale
         * @type Number
         */

    };

    /**
     * Provides an easy-to-use mouse input interface.
     * Example:<br>
     * <pre class="brush: js">
     * function SimpleMouseComponent(){
     * &nbsp;var mouseInput,
     * &nbsp;&nbsp;thisObj = this;
     * &nbsp;this.activated = function(){
     * &nbsp;&nbsp;mouseInput = thisObj.gameObject.engine.mouseInput;
     * &nbsp;};
     * &nbsp;this.update = function(){
     * &nbsp;&nbsp;if (mouseInput.isButtonDown(0)){
     * &nbsp;&nbsp;&nbsp;var str = "Left mouse down at position "+mouseInput.mousePosition[0]+","+mouseInput.mousePosition[1];
     * &nbsp;&nbsp;&nbsp;console.log(str);
     * &nbsp;&nbsp;}
     * &nbsp;}
     * }
     * </pre>
     * @class MouseInput
     * @namespace KICK.core
     */
    core.MouseInput = function(engine){
        var vec2 = KICK.math.vec2,
            mouse = [],
            mouseUp = [],
            mouseDown = [],
            mousePosition = vec2.create(),
            lastMousePosition = vec2.create(),
            deltaMovement = null,
            objectPosition = vec2.create(),
            mouseWheelDelta = vec2.create(),
            mouseWheelPreventDefaultAction = false,
            canvas = engine.canvas,
            removeElementFromArray = core.Util.removeElementFromArray,
            contains = core.Util.contains,
            mouseMovementListening = true,
            body = document.body,
            isFirefox = navigator.userAgent.indexOf("Firefox") !== -1,
            isChrome = navigator.userAgent.indexOf("Chrome") !== -1,
            mouseContextMenuHandler = function(e){
                e.preventDefault();
                return false;
            },
            mouseMovementHandler = function(e){
                mousePosition[0] = e.clientX - objectPosition[0] + body.scrollLeft;
                mousePosition[1] = e.clientY - objectPosition[1] + body.scrollTop;
                if (deltaMovement){
                    vec2.subtract(mousePosition,lastMousePosition,deltaMovement);
                } else {
                    deltaMovement = vec2.create();
                }
                vec2.set(mousePosition,lastMousePosition);
            },
            mouseWheelHandler = function(e){
                if (isChrome){
                    mouseWheelDelta[0] += e.wheelDeltaX;
                    mouseWheelDelta[1] += e.wheelDeltaY;
                } else {
                    if (e.axis===1){ // horizontal
                        mouseWheelDelta[0] -= e.detail;
                    } else {
                        mouseWheelDelta[1] -= e.detail;
                    }
                }
                if (mouseWheelPreventDefaultAction){
                    e.preventDefault();
                    return false;
                }
            },
            mouseDownHandler = function(e){
                var mouseButton = e.button;
                if (!contains(mouse,mouseButton)){
                    mouseDown.push(mouseButton);
                    mouse.push(mouseButton);
                }
                if (!mouseMovementListening){  // also update mouse position if not listening for mouse movement
                    mouseMovementHandler();
                }
            },
            mouseUpHandler = function(e){
                var mouseButton = e.button;
                mouseUp.push(mouseButton);
                removeElementFromArray(mouse,mouseButton);
                if (!mouseMovementListening){ // also update mouse position if not listening for mouse movement
                    mouseMovementHandler();
                }
            },
            /**
             * Calculates an object with the x and y coordinates of the given object.
             * Updates the objectPosition variable
             * @method updateCanvasElementPositionPrivate
             * @private
             */
            updateCanvasElementPositionPrivate = function () {
                var object = canvas,
                    left = 0,
                    top = 0;

                while (object.offsetParent) {

                    left += object.offsetLeft;
                    top += object.offsetTop;

                    object = object.offsetParent;
                }

                left += object.offsetLeft;
                top += object.offsetTop;

                objectPosition[0] = left;
                objectPosition[1] = top;
            };
        Object.defineProperties(this,{
            /**
             * Returns the mouse position of the canvas element, where 0,0 is in the upper left corner.
             * @property mousePosition
             * @type KICK.math.vec2
             */
            mousePosition:{
                get:function(){
                    return mousePosition;
                }
            },
            /**
             * Returns the delta movement (relative mouse movement since last frame)
             * @property deltaMovement
             * @type KICK.math.vec2
             */
            deltaMovement:{
                get:function(){
                    return deltaMovement || vec2.create();
                }
            },
            /**
             * Mouse scroll wheel input in two dimensions (horizontal and vertical)
             * @property deltaWheel
             * @type KICK.math.vec2
             */
            deltaWheel:{
                get:function(){
                    return mouseWheelDelta;
                }
            },
            /**
             * If set to true, the engine will prevent screen from scrolling when mouse wheel is used when mouse pointer
             * is over the canvas.<br>
             * Default value is false
             * @property mouseWheelPreventDefaultAction
             * @type Boolean
             */
            mouseWheelPreventDefaultAction:{
                get:function(){
                    return mouseWheelPreventDefaultAction;
                },
                set:function(newValue){
                    mouseWheelPreventDefaultAction = newValue;
                }
            },
            /**
             * Default value is true
             * @property mouseMovementEventsEnabled
             * @type Boolean
             */
            mouseMovementEventsEnabled:{
               get:function(){ return mouseMovementListening; },
               set:function(value){
                   if (mouseMovementListening !== value){
                       mouseMovementListening = value;
                       if (mouseMovementListening){
                           canvas.addEventListener( "mousemove", mouseMovementHandler, false);
                       } else {
                           canvas.removeEventListener( "mousemove", mouseMovementHandler, false);
                           deltaMovement = null;
                       }
                   }
               }
            }
        });

        /**
         *
         * @method isButtonDown
         * @param {Number} mouseButton
         * @return {boolean} true if mouse button is pressed down in this frame
         */
        this.isButtonDown = function(mouseButton){
            return contains(mouseDown,mouseButton);
        };

        /**
         * @method isButtonUp
         * @param {Number} mouseButton
         * @return {boolean} true if mouseButton is released in this frame
         */
        this.isButtonUp = function(mouseButton){
            return contains(mouseUp,mouseButton);
        };

        /**
         * @method isButton
         * @param {Number} mouseButton
         * @return {boolean} true if mouseButton is down
         */
        this.isButton = function(mouseButton){
            return contains(mouse,mouseButton);
        };

        /**
         * Resets the mouse position each frame (mouse buttons down and delta values)
         * @method frameUpdated
         * @private
         */
        this.frameUpdated = function(){
            mouseDown.length = 0;
            mouseUp.length = 0;
            mouseWheelDelta[0] = 0;
            mouseWheelDelta[1] = 0;
            if (deltaMovement){
                deltaMovement[0] = 0;
                deltaMovement[1] = 0;
            }
        };

        /**
         * Update the mouseInput with the relative position of the canvas element.
         * This method should be called whenever the canvas element is moved in the document. <br>
         * This method is automatically called when Engine.canvasResized() is invoked.
         * 
         * @method updateCanvasElementPosition
         */
        this.updateCanvasElementPosition = updateCanvasElementPositionPrivate;

        (function init(){
            updateCanvasElementPositionPrivate();
            var canvas = engine.canvas;
            canvas.addEventListener( "mousedown", mouseDownHandler, true);
            canvas.addEventListener( "mouseup", mouseUpHandler, true);
            canvas.addEventListener( "mousemove", mouseMovementHandler, true);
            canvas.addEventListener( "contextmenu", mouseContextMenuHandler, true);
            if (isFirefox){
                canvas.addEventListener( 'MozMousePixelScroll', mouseWheelHandler, true); // Firefox
            } else if (isChrome){
                canvas.addEventListener( 'mousewheel', mouseWheelHandler, true); // Chrome
            } else {
                canvas.addEventListener( 'DOMMouseScroll', mouseWheelHandler, true); // Firefox
            }
        })();
    };

    /**
     * Key Input manager.<br>
     * This class encapsulate keyboard input and makes it easy to
     * test for key input.<br>
     * Example code:
     * <pre class="brush: js">
     * function KeyTestComponent(){
     * &nbsp;var keyInput, thisObj = this;
     * &nbsp;// registers listener (invoked when component is registered)
     * &nbsp;this.activated = function (){
     * &nbsp;&nbsp;var engine = thisObj.gameObject.engine;
     * &nbsp;&nbsp;keyInput = engine.keyInput;
     * &nbsp;};
     * &nbsp;this.update = function(){
     * &nbsp;&nbsp;var keyCodeForA = 65;
     * &nbsp;&nbsp;if (keyInput.isKeyDown(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is down");
     * &nbsp;&nbsp;}
     * &nbsp;&nbsp;if (keyInput.isKey(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is being held down");
     * &nbsp;&nbsp;}
     * &nbsp;&nbsp;if (keyInput.isKeyUp(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is up");
     * &nbsp;&nbsp;}
     * &nbsp;};
     * }
     * </pre>
     * <br>
     * Pressing the 'a' key should result in one frame with 'A key is down',
     * multiple frames with 'A key is being held down' and finally one frame
     * with 'A key is up'
     * @class KeyInput
     * @namespace KICK.core
     */
    core.KeyInput = function(){
        var keyDown = [],
            keyUp = [],
            key = [],
            removeElementFromArray = core.Util.removeElementFromArray,
            contains = core.Util.contains,
            keyDownHandler = function(e){
                var keyCode = e.keyCode;
                if (!contains(key,keyCode)){
                    keyDown.push(keyCode);
                    key.push(keyCode);
                }
            },
            keyUpHandler = function(e){
                var keyCode = e.keyCode;
                keyUp.push(keyCode);
                removeElementFromArray(key,keyCode);
            };

        /**
         * @method isKeyDown
         * @param {Number} keyCode
         * @return {boolean} true if key is pressed down in this frame
         */
        this.isKeyDown = function(keyCode){
            return contains(keyDown,keyCode);
        };

        /**
         * @method isKeyUp
         * @param {Number} keyCode
         * @return {boolean} true if key is release in this frame
         */
        this.isKeyUp = function(keyCode){
            return contains(keyUp,keyCode);
        };

        /**
         *
         * @method isKey
         * @param {Number} keyCode
         * @return {boolean} true if key is down
         */
        this.isKey = function(keyCode){
            return contains(key,keyCode);
        };

        /**
         * This method clears key up and key downs each frame (leaving key unmodified)
         * @method update
         * @private
         */
        this.frameUpdated = function(){
            keyDown.length = 0;
            keyUp.length = 0;
        };

        (function init(){
            document.addEventListener( "keydown", keyDownHandler, false);
            document.addEventListener( "keyup", keyUpHandler, false);
        })();
    };

    /**
     * Utility class for miscellaneous functions. The class is static and is shared between multiple instances.
     * @class Util
     * @namespace KICK.core
     */
    core.Util = {
        /**
         * @method hasProperty
         * @param {Object} obj
         * @param {String} prop
         * @return {Boolean}
         * @static
         */
        hasProperty:function (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        },
        /**
         * @method getJSONReference
         * @param {KICK.core.Engine} engine
         * @param {Object} object
         * @return {JSON}
         */
        getJSONReference: function(engine,object){
            if (object == null){
                return null;
            }
            var isGameObject = object instanceof KICK.scene.GameObject;
            var isComponent = !isGameObject && object.gameObject instanceof KICK.scene.GameObject;
            if (isComponent || isGameObject){
                return {
                    ref: engine.getUID(object),
                    name: typeof object.name === 'string'? object.name : "",
                    reftype: isGameObject?"gameobject":"component"
                }

            } else {
                // project type
                return {
                    ref:object.uid,
                    name:object.name,
                    reftype:"project"
                };
            }
        },
        /**
         * @method componentToJSON
         * @param {KICK.core.Engine} engine
         * @param {KICK.scene.Component} component
         * @param {String} componentType Optional defaults to component.constructor.name
         * @return {JSON}
         */
        componentToJSON: function(engine, component,componentType){
            var name,
                config = {},
                res = {
                    type: componentType || component.constructor.name,
                    uid: engine.getUID(component),
                    config:config
                };
            if (res.type === ""){
                core.Util.fail("Cannot serialize object type. Either provide toJSON function or use explicit function name 'function SomeObject(){}' ");
            }
            // init config object
            for (name in component){
                if (core.Util.hasProperty(component,name) && name !== "gameObject"){
                    var o = component[name],
                        typeofO = typeof o;
                    if (typeofO !== 'function'){
                        if (o && o.buffer instanceof ArrayBuffer){
                            // is typed array
                            config[name] = core.Util.typedArrayToArray(o);
                        } else if (typeofO === 'object'){
                            config[name] = core.Util.getJSONReference(engine,o);
                        } else {
                            config[name] = o;
                        }
                    }
                }
            }
            return res;
        },
        /**
         * For each non function attribute in config, set the attribute on object
         * @method applyConfig
         * @param {Object} object
         * @param {Object} config
         * @param {Array[String]} excludeFilter
         * @static
         */
        applyConfig: function(object,config,excludeFilter){
            var contains = core.Util.contains,
                hasProperty = core.Util.hasProperty;
            config = config || {};
            excludeFilter = excludeFilter || [];
            for (var name in config){
                if (typeof config[name] !== 'function' && !contains(excludeFilter,name) && hasProperty(object,name)){
                    object[name] = config[name];
                }
            }
            // force setting uid
            if (config.uid && config.uid !== object.uid){
                object.uid = config.uid;
            }
        },
        /**
         * Reads a parameter from a url string.
         * @method getParameter
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameter: function(url, parameterName){
            var regexpStr = "[\\?&]"+parameterName+"=([^&#]*)",
                regexp = new RegExp( regexpStr ),
                res = regexp.exec( url );
            if( res == null )
                return null;
            else
                return res[1];
        },
        /**
         * Reads a int parameter from a url string.
         * @method getParameterInt
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameterInt: function(url, parameterName, notFoundValue){
            var res = core.Util.getParameter(url,parameterName);
            if( res === null )
                return notFoundValue;
            else
                return parseInt(res);
        },
        /**
         * Reads a float parameter from a url string.
         * @method getParameterInt
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameterFloat: function(url, parameterName, notFoundValue){
            var res = core.Util.getParameter(url,parameterName);
            if( res === null )
                return notFoundValue;
            else
                return parseFloat(res);
        },
        /**
         * Scales the image by drawing the image on a canvas object.
         * @method scaleImage
         * @param {Image} imageObj
         * @param {Number} newWidth
         * @param {Number} newHeight
         * @return {Canvas} return a Canvas object (acts as a image)
         * @static
         */
        scaleImage: function(imageObj, newWidth, newHeight){
            // from http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences
            var canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageObj,
                0, 0, imageObj.width, imageObj.height,
                0, 0, canvas.width, canvas.height);
            return canvas;
        },
        /**
         * Invokes debugger and logs a warning
         * @method warn
         * @static
         */
        warn:function(message){
            debugger;
            console.log(message);
        },
        /**
         * Invokes debugger and logs an error
         * @method fail
         * @static
         */
        fail:function(message){
            debugger;
            console.error(message);
        },
        /**
         * Converts a typed array to a number array
         * @method typedArrayToArray
         * @static
         * @param {TypedArray} typedArray
         * @return {Array[Number]}
         */
        typedArrayToArray: function(typedArray){
            var length = typedArray.length,
                res = new Array(length);
            for (var i=0;i<length;i++){
                res[i] = typedArray[i];
            }
            return res;
        },

        /**
         * Remove one element from an array - either the first instance or all instances
         * @method removeElementFromArray
         * @static
         * @param {Array} array
         * @param {Object} removeValue value to be deleted
         * @param {boolean} deleteAll  deletaAll objects (or exit function after first deletion)
         * @return {boolean} elementRemoved
         */
        removeElementFromArray: function (array, removeValue, deleteAll) {
            var elementRemoved = false;
            for(var i=array.length-1; i>=0; i--) {
                if(array[i] === removeValue) {
                    elementRemoved = true;
                    array.splice(i, 1);
                    if (!deleteAll) {
                        break;
                    }
                }
            }
            return elementRemoved;
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
        },
        /**
         * Loops through array and return true if any array element strict equals the element.
         * This uses the === to compare the two elements.
         * @param {Array} array
         * @param {Object} element
         * @return {boolean} array contains element
         */
        contains : function(array,element){
            for (var i=array.length-1;i>=0;i--){
                if (array[i]===element){
                    return true;
                }
            }
            return false;
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
                    return window.setTimeout(callback, fps60);
                };
        })();

        window.cancelRequestAnimFrame = ( function() {
            return window.cancelAnimationFrame          ||
                window.webkitCancelRequestAnimationFrame    ||
                window.mozCancelRequestAnimationFrame       ||
                window.oCancelRequestAnimationFrame     ||
                window.msCancelRequestAnimationFrame        ||
                clearTimeout
        } )();
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
