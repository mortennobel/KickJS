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
        DEBUG = constants._DEBUG,
        packIntToFloatArrayBuffer = new ArrayBuffer(4),
        packIntToFloatInt32Buffer = new Uint32Array(packIntToFloatArrayBuffer),
        packIntToFloatUint8Buffer = new Uint8Array(packIntToFloatArrayBuffer);

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
            frame = 0,
            timeScale = 1,
            contextListeners = [],
            frameListeners = [],
            eventQueue,
            project = new core.Project(this),
            mouseInput = null,
            keyInput = null,
            activeScene,
            activeSceneNull = {updateAndRender:function(){}},
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
             * @property resourceManager
             * @deprecated
             * @type KICK.core.ResourceManager
             */
            resourceManager:{
                get: function(){
                    KICK.core.Util.warn("Engine.resourceManager is deprecated"); // todo remove
                    return thisObj.resourceLoader;
                }
            },
            /**
             * Resource manager of the engine. Loads and cache resources.
             * @property resourceManager
             * @type KICK.core.ResourceManager
             */
            resourceLoader:{
                value: new core.ResourceLoader(this)
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
             * If null then nothing is rendered
             * @property activeScene
             * @type KICK.scene.Scene
             */
            activeScene:{
                get: function(){
                    if (activeScene === activeSceneNull){
                        return null;
                    }
                    return activeScene;
                },
                set: function(value){
                    if (value === null || typeof value === "undefined"){
                        activeScene = activeSceneNull;
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
             * @property eventQueue
             * @type KICK.core.EventQueue
             */
            eventQueue:{
                get:function(){
                    return eventQueue;
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
                            lastTime = new Date().getTime()-16; // ensures valid delta time in next frame
                            animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject,thisObj.canvas);
                        }
                    }
                }
            }
        });

        /**
         * @method isFullScreenSupported
         * @return Boolean
         */
        this.isFullScreenSupported = function(){
            return canvas.requestFullscreen || canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen;
        };

        /**
         * Note that fullscreen needs to be invoked directly from a keyboard event or a mouse event from outside the
         * gameLoop. This means it is currently not possible to set fullscreen from a Component's update method.
         * @method setFullscreen
         * @param {Boolean} fullscreen
         */
        this.setFullscreen = function(fullscreen){
            if (thisObj.isFullScreenSupported()){
                if (fullscreen){
                    if (canvas.requestFullscreen){
                        canvas.requestFullscreen();
                    } else if (canvas.webkitRequestFullScreen){
                        canvas.onwebkitfullscreenchange = function() {
                            if(document.webkitIsFullScreen) {
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
                    } else if (canvas.mozRequestFullScreen){
                        canvas.mozRequestFullScreen();
                    }
                } else {
                    if (document.exitFullscreen){
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen){
                        document.webkitCancelFullScreen();
                    } else if (document.webkitCancelFullScreen){
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
            deltaTime = time-lastTime;
            lastTime = time;
            deltaTime *= timeScale;
            timeSinceStart += deltaTime;
            frame += 1;
            
            eventQueue.run();

            activeScene.updateAndRender();
            for (var i=frameListeners.length-1;i>=0;i--){
                frameListeners[i].frameUpdated();
            }

            if (animationFrameObj !== null){
                animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject,thisObj.canvas);
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

        /**
         * @method removeContextListener
         * @param contextLostListener
         */
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
                        return false;
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
                    return true;
                };
            var success = initGL();
            if (!success){
                thisObj.config.webglNotFoundFn(canvas);
                return;
            }

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
                frame:{
                    get: function(){return frame;}
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
            eventQueue = new core.EventQueue(thisObj);

            timeSinceStart = 0;
            frame = 0;

            thisObj._gameLoop(lastTime);
        }());
    };

    /**
     * Event queue let you schedule future events in the game engine. Events are invoked just before the
     * Component.update() methods.<br>
     * An event can run for either a single frame or for multiple frames.
     * @class EventQueue
     * @namespace KICK.core
     * @param {KICK.core.Engine} engine
     */
    core.EventQueue = function(engine){
        var queue = [],
            queueSortFn = function(a,b){
                return a.timeStart - b.timeStart;
            },
            time = engine.time;

        /**
         * Add a event to the event queue. Using timeStart = 0 will make the event run in the next frame.
         * @mehtod add
         * @param {function} task
         * @param {Number} timeStart Number of milliseconds from current time
         * @param {Number} timeEnd Optional (defaults to timeStart). Number of milliseconds from current time
         * @return {Object} event object (used for 'cancel' event)
         */
        this.add = function(task, timeStart, timeEnd){
            var currentTime = time.time+1, // schedule for one millisecond in the future - this makes it legal for event call backs to schedule new events
                queueElement = {
                task:task,
                timeStart: timeStart+currentTime,
                timeEnd: (timeEnd || timeStart)+currentTime
            };
            core.Util.insertSorted(queueElement,queue,queueSortFn);
            return queueElement;
        };

        /**
         * Removes an event object from the queue.
         * @method cancel
         * @param {Object} eventObject (should be the object returned from the EventQueue.add method
         */
        this.cancel = function(eventObject){
            core.Util.removeElementFromArray(queue,eventObject);
        };

        /**
         * Run the event queue. This method is invoked by the Engine object just before the components are updated.
         * @protected
         * @method run
         */
        this.run = function(){
            var i=0,
                currentTime = time.time,
                queueLength = queue.length,
                queueElement;
            for (;i<queueLength && (queueElement = queue[i]).timeStart<currentTime;i++){
                queueElement.task();
                if (queueElement.timeEnd<currentTime){
                    queue.splice(i,1);
                    queueLength--;
                }
            }
        };

        /**
         * Clears the queue
         * @method clear
         */
        this.clear = function(){
            queue = [];
        };
    };

    /**
     * A project asset is an object that can be serialized into a project and restored at a later state.<br>
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
            thisObj = this,
            _maxUID = 0,
            refreshResourceDescriptor = function(uid,filter){
                if (resourceDescriptorsByUID[uid] instanceof core.ResourceDescriptor){
                    var liveObject = resourceCache[uid];
                    if (liveObject){
                        resourceDescriptorsByUID[uid].updateConfig(liveObject,filter);
                    }
                }
            },
            getUrlAsResourceName = function(url){
                var name = url.split('/');
                if (name.length>2){
                    name = name[name.length-2];
                    name = name.substring(0,1).toUpperCase()+name.substring(1);
                } else {
                    name = url;
                }
                return name;
            },
            loadEngineAsset = function(uid){
                var p = core.Project,
                    res,
                    url;
                if (uid <= p.ENGINE_SHADER_DEFAULT && uid >= p.ENGINE_SHADER_UNLIT_VERTEX_COLOR){
                    switch (uid){
                        case p.ENGINE_SHADER_DEFAULT:
                            url = "kickjs://shader/default/";
                            break;
                        case p.ENGINE_SHADER_SPECULAR:
                            url = "kickjs://shader/specular/";
                            break;
                        case p.ENGINE_SHADER_DIFFUSE:
                            url = "kickjs://shader/diffuse/";
                            break;
                        case p.ENGINE_SHADER_UNLIT:
                            url = "kickjs://shader/unlit/";
                            break;
                        case p.ENGINE_SHADER_UNLIT_VERTEX_COLOR:
                            url = "kickjs://shader/unlit_vertex_color/";
                            break;
                        case p.ENGINE_SHADER_TRANSPARENT_SPECULAR:
                            url = "kickjs://shader/transparent_specular/";
                            break;
                        case p.ENGINE_SHADER_TRANSPARENT_DIFFUSE:
                            url = "kickjs://shader/transparent_diffuse/";
                            break;
                        case p.ENGINE_SHADER_TRANSPARENT_UNLIT:
                            url = "kickjs://shader/transparent_unlit/";
                            break;
                        case p.ENGINE_SHADER___SHADOWMAP:
                            url = "kickjs://shader/__shadowmap/";
                            break;
                        case p.ENGINE_SHADER___PICK:
                            url = "kickjs://shader/__pick/";
                            break;
                        case p.ENGINE_SHADER___ERROR :
                            url = "kickjs://shader/__error/";
                            break;
                        default:
                            if (ASSERT){
                                core.Util.fail("uid not mapped "+uid);
                            }
                            return null;
                    }
                    res = new KICK.material.Shader(engine,{
                        dataURI:url,
                        name:getUrlAsResourceName(url),
                        uid:uid
                    })
                } else if (uid <= p.ENGINE_TEXTURE_BLACK && uid >= p.ENGINE_TEXTURE_LOGO){
                    switch (uid){
                        case p.ENGINE_TEXTURE_BLACK:
                            url = "kickjs://texture/black/";
                            break;
                        case p.ENGINE_TEXTURE_WHITE:
                            url = "kickjs://texture/white/";
                            break;
                        case p.ENGINE_TEXTURE_GRAY:
                            url = "kickjs://texture/gray/";
                            break;
                        case p.ENGINE_TEXTURE_LOGO:
                            url = "kickjs://texture/logo/";
                            break;
                        default:
                            if (ASSERT){
                                core.Util.fail("uid not mapped "+uid);
                            }
                            return null;
                    }
                    res = new KICK.texture.Texture(engine,
                        {
                            dataURI:url,
                            name:getUrlAsResourceName(url),
                            minFilter: constants.GL_NEAREST,
                            magFilter: constants.GL_NEAREST,
                            generateMipmaps: false,
                            uid:uid
                        });
                } else if (uid <= p.ENGINE_MESH_TRIANGLE && uid >= p.ENGINE_MESH_CUBE){
                    switch (uid){
                        case p.ENGINE_MESH_TRIANGLE:
                            url = "kickjs://mesh/triangle/";
                            break;
                        case p.ENGINE_MESH_PLANE:
                            url = "kickjs://mesh/plane/";
                            break;
                        case p.ENGINE_MESH_UVSPHERE:
                            url = "kickjs://mesh/uvsphere/";
                            break;
                        case p.ENGINE_MESH_CUBE:
                            url = "kickjs://mesh/cube/";
                            break;
                        default:
                            if (ASSERT){
                                core.Util.fail("uid not mapped "+uid);
                            }
                            return null;
                    }
                    res = new KICK.mesh.Mesh(engine,
                        {
                            dataURI:url,
                            name:getUrlAsResourceName(url),
                            uid:uid
                        });
                }

                resourceCache[uid] = res;
                return res;
            };

        core.Util.copyStaticPropertiesToObject(thisObj,core.Project);


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
            },
            /**
             * List the asset uids of project
             * @property resourceDescriptorUIDs
             * @type Array[Number]
             */
            resourceDescriptorUIDs:{
                get:function(){
                    var uids = [],
                        uid;
                    for (uid in resourceDescriptorsByUID){
                        uids.push(uid);
                    }
                    return uids;
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
         * Loads a project by URL. This call is asynchronous, and onSuccess or onFail will be called when the loading is
         * complete.
         * @method loadProjectByURL
         * @param {String} url
         * @param {Function} onSuccess
         * @param {Function} onFail
         */
        this.loadProjectByURL = function(url, onSuccess, onError){
            var voidFunction = function(){
                if (DEBUG){
                    console.log(arguments);
                }
            }
                ;
            onSuccess = onSuccess || voidFunction ;
            onError = onError || voidFunction ;

            var oXHR = new XMLHttpRequest();
            oXHR.open("GET", url, true);
            oXHR.onreadystatechange = function (oEvent) {
                if (oXHR.readyState === 4) {
                    if (oXHR.status === 200) {
                        var value = JSON.parse(oXHR.responseText);
                        try{
                            thisObj.loadProject(value);
                            onSuccess();
                        } catch(e) {
                            debugger;
                            onError(e);
                        }
                    } else {
                        onError();
                    }
                }
            };
            oXHR.send(null);
        };

        /**
         * Load a project of the form {maxUID:number,resourceDescriptors:[KICK.core.ResourceDescriptor],activeScene:number}
         * @method loadProject
         * @param {object} config
         */
        this.loadProject = function(config){
            if (_maxUID>0){
                thisObj.closeProject();
            }
            config = config || {};
            var resourceDescriptors = config.resourceDescriptors || [];
            _maxUID = config.maxUID || 0;
            for (var i=0;i<resourceDescriptors.length;i++){
                thisObj.addResourceDescriptor(resourceDescriptors[i]);
            }

            // preload all resources
            var onComplete = function(){
                _maxUID = config.maxUID || 0; // reset maxUID
                if (config.activeScene){
                    engine.activeScene = thisObj.load(config.activeScene);
                } else {
                    engine.activeScene = null;
                }
            };
            onComplete();
        };

        /**
         * Close all resources in the project and remove all resource descriptors
         * @method closeProject
         */
        this.closeProject = function(){
            for (var uid in resourceDescriptorsByUID){
                thisObj.removeResourceDescriptor(uid);
            }
            resourceDescriptorsByUID = {};
            resourceCache = {};
        };

        /**
         * Load a resource from the configuration (or cache).
         * Also increases the resource reference counter.
         * @method load
         * @param {String} uid
         * @return {KICK.core.ProjectAsset} resource or null if resource is not found
         */
        this.load = function(uid){
            var resourceObject = resourceCache[uid];
            if (resourceObject){
                return resourceObject;
            }
            var resourceConfig = resourceDescriptorsByUID[uid];
            if (resourceConfig){
                resourceObject = resourceConfig.instantiate(engine);
                resourceCache[uid] = resourceObject;
                return resourceObject;
            }

            return loadEngineAsset(uid);
        };

        /**
         * Remove cache references to an object. Next time load(uid) is called a new object is
         * initialized from the resource config
         * @method removeCacheReference
         * @param {Number} uid
         */
        this.removeCacheReference = function(uid){
            if (resourceCache[uid]){
                delete resourceCache[uid];
            }
        };

        /**
         * Load a resource from the configuration (or cache).
         * Also increases the resource reference counter.
         * If more objects exist with the same name, the first object is returned
         * @method loadByName
         * @param {String} name
         * @param {String} type Optional: limit the search to a specific type
         * @return {KICK.core.ProjectAsset} resource or null if resource is not found
         */
        this.loadByName = function(name,type){
            for (var uid in resourceDescriptorsByUID){
                var resource = resourceDescriptorsByUID[uid];
                if (resource.name === name){
                    if (!type || resource.type === type){
                        return thisObj.load(resource.uid);
                    }
                }
            }
            return null;
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
         * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
         */
        this.refreshResourceDescriptors = function(filter){
            filter = filter || function(){return true;};
            for (var uid in resourceDescriptorsByUID){
                refreshResourceDescriptor(uid,filter);
            }
        };

        /**
         * Returns the buildin engine resources
         * @method getEngineResourceDescriptorsByType
         * @param {String} type
         * @return {Array[KICK.core.ResourceDescriptor]}
         */
        this.getEngineResourceDescriptorsByType = function(type){
            var res = [];
            var searchFor;
            if (type === "KICK.mesh.Mesh"){
                searchFor = "ENGINE_MESH_";
            } else if (type === "KICK.material.Shader"){
                searchFor = "ENGINE_SHADER_";
            } else if (type === "KICK.texture.Texture"){
                searchFor = "ENGINE_TEXTURE_";
            }
            if (searchFor){
                for (var name in core.Project){
                    if (typeof core.Project[name] === "number" && core.Project.hasOwnProperty(name) && name.indexOf(searchFor) === 0){
                        var uid = core.Project[name];
                        var name = core.Util.toCamelCase(name.substr(searchFor.length)," ");
                        res.push(new core.ResourceDescriptor({
                            type: type,
                            config:{
                                name: name,
                                uid: uid
                            }}));
                    }
                }
            }
            return res;
        };

        /**
         * @method getResourceDescriptorsByType
         * @param {String} type
         * @return {Array[KICK.core.ResourceDescriptor]}
         */
        this.getResourceDescriptorsByType = function(type){
            var res = [];
            for (var uid in resourceDescriptorsByUID){
                if (resourceDescriptorsByUID[uid].type === type){
                    res.push(resourceDescriptorsByUID[uid]);
                }
            }
            return res;
        };

        /**
         * @method getResourceDescriptorsByName
         * @param {String} type
         * @return {Array[KICK.core.ResourceDescriptor]}
         */
        this.getResourceDescriptorsByName = function(name){
            var res = [];
            for (var uid in resourceDescriptorsByUID){
                if (resourceDescriptorsByUID[uid].name === name){
                    res.push(resourceDescriptorsByUID[uid]);
                }
            }
            return res;
        };



        /**
         * @method getResourceDescriptor
         * @param {Number} uid
         * @return {KICK.core.ResourceDescriptor} resource descriptor (or null if not found)
         */
        this.getResourceDescriptor = function(uid){
            refreshResourceDescriptor(uid);
            return resourceDescriptorsByUID[uid];
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
         * @param {Number} uid
         */
        this.removeResourceDescriptor = function(uid){
            // destroy the resource
            var resource = resourceCache[uid];
            if (resource){
                // remove references
                delete resourceCache[uid];
                // call destroy if exist
                if (resource.destroy){
                    resource.destroy();
                }
            }
            // remove description
            delete resourceDescriptorsByUID[uid];
        };

        /**
         * @method toJSON
         * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
         * @return Object
         */
        this.toJSON = function(filter){
            var res = [];
            filter = filter || function(){return true;};
            thisObj.refreshResourceDescriptors(filter);
            for (var uid in resourceDescriptorsByUID){
                if (uid>=0){ // don't serialize engine assets (since they are static)
                    var rd = resourceDescriptorsByUID[uid];
                    if (rd instanceof core.ResourceDescriptor && filter(rd)){
                        res.push(rd.toJSON(filter));
                    }
                }
            }
            return {
                engineVersion:engine.version,
                maxUID:_maxUID,
                activeScene: engine.activeScene ? engine.activeScene.uid : 0,
                resourceDescriptors:res
            };
        };
    };

    /**
     * @property ENGINE_SHADER_DEFAULT
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_DEFAULT = -100;
    /**
     * @property ENGINE_SHADER_SPECULAR
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_SPECULAR = -101;
    /**
     * @property ENGINE_SHADER_UNLIT
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_UNLIT = -102;
    /**
     * @property ENGINE_SHADER_TRANSPARENT_SPECULAR
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_TRANSPARENT_SPECULAR = -103;
    /**
     * @property ENGINE_SHADER_TRANSPARENT_UNLIT
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_TRANSPARENT_UNLIT = -104;
    /**
     * @property ENGINE_SHADER___SHADOWMAP
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER___SHADOWMAP = -105;
    /**
     * @property ENGINE_SHADER___PICK
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER___PICK = -106;
    /**
     * @property ENGINE_SHADER___ERROR
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER___ERROR = -107;
    /**
     * @property ENGINE_SHADER_DIFFUSE
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_DIFFUSE = -108;
    /**
     * @property ENGINE_SHADER_TRANSPARENT_DIFFUSE
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_TRANSPARENT_DIFFUSE = -109;
    /**
     * @property ENGINE_SHADER_UNLIT_VERTEX_COLOR
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_UNLIT_VERTEX_COLOR = -110;

    /**
     * @property ENGINE_TEXTURE_BLACK
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_BLACK = -200;
    /**
     * @property ENGINE_TEXTURE_WHITE
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_WHITE = -201;
    /**
     * @property ENGINE_TEXTURE_GRAY
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_GRAY = -202;

    /**
     * @property ENGINE_TEXTURE_LOGO
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_LOGO = -203;

    /**
     * @property ENGINE_MESH_TRIANGLE
     * @type Number
     * @static
     */
    core.Project.ENGINE_MESH_TRIANGLE = -300;

    /**
     * @property ENGINE_MESH_PLANE
     * @type Number
     * @static
     */
    core.Project.ENGINE_MESH_PLANE = -301;

    /**
     * @property ENGINE_MESH_UVSPHERE
     * @type Number
     * @static
     */
    core.Project.ENGINE_MESH_UVSPHERE = -302;

    /**
     * @property ENGINE_MESH_CUBE
     * @type Number
     * @static
     */
    core.Project.ENGINE_MESH_CUBE = -303;

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
                        var reftype = value?value.reftype:null;
                        var ref = value?value.ref:null;
                        if (value && ref && reftype){
                            if (reftype === "resource"){
                                value = engine.resourceLoader[value.refMethod](ref);
                            } else if (reftype === "project"){
                                value = engine.project.load(ref);
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
         * Updates the configuration with the one from object. The method will use object.toJSON(filter)
         * (if toJSON method exist - otherwise the object are used directly)
         * @method updateConfig
         * @param {Object} object
         * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
         */
        this.updateConfig = function(object,filter){
            resourceConfig = object.toJSON ? object.toJSON(filter) : object;
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
         * Use shadow maps to generate realtime shadows.<br>
         * Default value is false.
         * @property shadows
         * @type Boolean
         */
        this.shadows = config.shadows || false;
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

        /**
         * function (or function name) with the signature function(domElement) called when WebGL cannot be initialized.
         * Default function replaces the canvas element with an error description with a link to
         * http://get.webgl.org/troubleshooting/
         * @property webglNotFoundFn
         * @type Function_or_String
         */
        this.webglNotFoundFn = config.webglNotFoundFn ?
            (typeof (config.webglNotFoundFn) === "string"?
                KICK.namespace(config.webglNotFoundFn):
                config.webglNotFoundFn) :
            function(domElement){
                domElement.innerHTML = "";
                var errorMessage = document.createElement("div");
                errorMessage.style.cssText = domElement.style.cssText+";width:"+domElement.width+"px;height:"+domElement.height+"px;display: table-cell;vertical-align: middle;background:#ffeeee;";
                errorMessage.innerHTML = "<div style='padding:12px;text-align: center;'><img src='http://www.khronos.org/assets/images/api_logos/webgl.png' style='width:74px;35px;margin-bottom: 10px;margin-left: auto;'><br clear='all'>It doesn't appear your computer can support WebGL.<br><br><a href=\"http://get.webgl.org/troubleshooting/\">Click here for more information.</a></div>";
                domElement.parentNode.replaceChild(errorMessage, domElement);
            };

        if (core.Constants._DEBUG){
            for (var name in config){
                if (! this.hasOwnProperty(name)){
                    var supportedProperties = "Supported properties for KICK.core.Config are: ";
                    for (var n2 in this){
                        if (this.hasOwnProperty(n2) && typeof this[n2] !== "function"){
                            supportedProperties += "\n - "+n2;
                        }
                    }
                    core.Util.warn("KICK.core.Config does not have any property "+name+"\n"+supportedProperties);

                }
            }
        }
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
         * @property frame
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
            releaseMouseButtonOnMouseOut = true,
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
            mouseOutHandler = function(e){
                if (releaseMouseButtonOnMouseOut){
                    // simulate mouse up events
                    for (var i=mouse.length-1;i>=0;i--){
                        mouseUpHandler({button:mouse[i]});
                    }
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
             * When true mouse buttons are auto released when mouse moves outside the canvas.
             * If this is not true, then mouse up events may not be detected. This is important
             * when listening for mouse drag events.
             * Default true
             * @property releaseMouseButtonOnMouseOut
             * @type Boolean
             */
            releaseMouseButtonOnMouseOut:{
                get:function(){
                    return releaseMouseButtonOnMouseOut;
                },
                set:function(newValue){
                    if (newValue !== releaseMouseButtonOnMouseOut){
                        releaseMouseButtonOnMouseOut = newValue;
                        if (releaseMouseButtonOnMouseOut){
                            canvas.addEventListener( "mouseout", mouseOutHandler, false);
                        } else {
                            canvas.removeEventListener( "mouseout", mouseOutHandler, false);
                        }
                    }
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
            canvas.addEventListener( "mouseout", mouseOutHandler, true);
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
     * This class encapsulates keyboard input and makes it easy to
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
         * Used for deserializing a configuration (replaces reference objects with actual references)
         * @method deserializeConfig
         * @param {Object} config
         * @param {KICK.engine.Engine} engine usef for looking up references to project assets
         * @param {KICK.scene.Scene} scene used for looking up references to gameObjects and components
         */
        deserializeConfig: function(config, engine, scene){
            if (typeof config === 'number'){
                return config;
            }
            if (Array.isArray(config)){
                var destArray = new Array(config.length);
                for (var i=0;i<config.length;i++){
                    destArray [i] = core.Util.deserializeConfig(config[i], engine, scene);
                }
                config = destArray;
            } else if (config){
                if (config && config.ref && config.reftype){
                    if (config.reftype === "project"){
                        config = engine.project.load(config.ref);
                    } else if (config.reftype === "gameobject" || config.reftype === "component"){
                        config = scene.getObjectByUID(config.ref);
                    }
                }
            }
            return config;
        },
        /**
         * @method deepCopy 
         * @param {Object} src
         * @param {Array[Classes]} passthroughClasses Optional. Don't attempt to clone object of these classes (uses instanceof operator)
         * @return Object
         */
        deepCopy : function(object, passthroughClasses){
            var res,
                isPassthrough = false,
                i;
            passthroughClasses = passthroughClasses || [];

            for (i=0;i<passthroughClasses.length;i++){
                if (object instanceof passthroughClasses[i]){
                    isPassthrough = true;
                    break;
                }
            }

            var typeOfValue = typeof object;
            if (isPassthrough){
                res = object;
            } else if (object === null || typeof(object)==="undefined"){
                res = null;
            } else if (Array.isArray(object)
                || object.buffer instanceof ArrayBuffer){ // treat typed arrays as normal arrays
                res = [];
                for (i=0;i<object.length;i++){
                    res[i] = core.Util.deepCopy(object[i],passthroughClasses);
                }
            } else if (typeOfValue === "object"){
                res = {};
                for (var name in object){
                    if (object.hasOwnProperty(name)){
                        res[name] = core.Util.deepCopy(object[name],passthroughClasses);
                    }
                }
            } else {
                res = object;
            }

            return res;
        },
        /**
         * @method copyStaticPropertiesToObject
         * @param {Object} object
         * @param {Function} type constructor function
         * @static
         */
        copyStaticPropertiesToObject : function(object, type){
            for (var name in type){
                if (type.hasOwnProperty(name)){
                    Object.defineProperty(object,name,{
                        value:type[name]
                    });
                }
            }
        },
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
         *
         * @method toCamelCase
         * @param {String} str
         * @param {String} wordSeparator Optional - default value is empty string
         */
        toCamelCase:function(str, wordSeparator){
            if (!wordSeparator){
                wordSeparator = "";
            }
            // skip initial underscore
            var i,
                wasLastCharSpace = true,
                char,
                resStr = "";
            for (i=0;i<str.length;i++){
                char = str.charAt(i);
                if (char !== "_"){
                    break;
                }
                resStr += char;
            }

            for (;i<str.length;i++){
                var char = str.charAt(i);
                var isSpace = char === '_';
                if (isSpace){
                    char = wordSeparator;
                }
                resStr += wasLastCharSpace ? char.toUpperCase() : char.toLowerCase();
                wasLastCharSpace = isSpace;
            }
            return resStr;
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
                functionReturnType = {},
                res = {
                    type: componentType || component.constructor.name,
                    uid: engine.getUID(component),
                    config:config
                };
            if (res.type === ""){
                core.Util.fail("Cannot serialize object type. Either provide toJSON function or use explicit function name 'function SomeObject(){}' ");
            }
            var serializeObject = function(o){
                if (Array.isArray(o)){
                    var result = [];
                    for (var i=0;i<o.length;i++){
                        var r = serializeObject(o[i]);
                        result.push(r);
                    }
                    return result;
                }
                var typeofO = typeof o;
                if (typeofO !== 'function'){
                    if (o && o.buffer instanceof ArrayBuffer){
                        // is typed array
                        return core.Util.typedArrayToArray(o);
                    } else if (typeofO === 'object'){
                        return core.Util.getJSONReference(engine,o);
                    } else {
                        return o;
                    }
                }
                return functionReturnType;
            };
            // init config object
            for (name in component){
                if (core.Util.hasProperty(component,name) && name !== "gameObject"){
                    var o = component[name];
                    var serializedObject = serializeObject(o);
                    if (serializedObject !== functionReturnType){
                        config[name] = serializedObject;
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
         * @static
         * @method insertSorted
         * @param {Object} element
         * @param {Array} sortedArray
         * @param {Function} sortFunc has the signature foo(obj1,obj2) returns Number. Optional (uses numberSort as default)
         */
        insertSorted : function (element,sortedArray,sortFunc) {
            var i;
            if (!sortFunc) {
                sortFunc = core.Util.numberSortFunction;
            }
            // assuming that the array is relative small
            for (i = sortedArray.length-1; i >= 0; i--) {
                if (sortFunc(sortedArray[i],element) <= 0) {
                    sortedArray.splice(i+1,0,element);
                    return;
                }
            }
            sortedArray.unshift( element );
        },
        /**
         * Returns a-b
         * @static
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
         * @static
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
        },
        /**
         * Packs a Uint32 into a KICK.math.vec4
         * @static
         * @method uint32ToVec4
         * @param {Number} uint32
         * @param {KICK.math.vec4} dest
         * @return {KICK.math.vec4}
         */
        uint32ToVec4 : function(uint32, dest){
            if (!dest){
                dest = new Float32Array(4);
            }
            packIntToFloatInt32Buffer[0] = uint32;
            for (var i=0;i<4;i++){
                dest[i] = packIntToFloatUint8Buffer[i]/255;
            }
            return dest;
        },
        /**
         * Unpacks a KICK.math.vec4 into a Uint32
         * @static
         * @method vec4ToUint32
         * @param {KICK.math.vec4} vec4
         */
        vec4ToUint32 : function(vec4){
            for (var i=0;i<4;i++){
                packIntToFloatUint8Buffer[i] = vec4[i]*255;
            }
            return packIntToFloatInt32Buffer[0];
        },
        /**
         * Unpacks an array of uint8 into a Uint32
         * @static
         * @method vec4uint8ToUint32
         * @param {Array[Number]}
         */
        vec4uint8ToUint32 : function(vec4uint8){
            for (var i=0;i<4;i++){
                packIntToFloatUint8Buffer[i] = vec4uint8[i];
            }
            return packIntToFloatInt32Buffer[0];
        },
        /**
         * Supports up to 3 byte UTF-8 encoding (including Basic Multilingual Plane)
         * @method utf8Encode
         * @param {String} str
         * @return Uint8Array
         */
        utf8Encode:function(str){
            var res = [];
            for (var i=0;i<str.length;i++){
                var charCode = str.charCodeAt(i);
                if (charCode < 0x007F){
                    res.push(charCode);
                } else if (charCode <= 0x07FF){
                    res.push(0xC0 + (charCode >> 6));
                    res.push(0x80 + (charCode & 0x3F));
                } else if (charCode <= 0xFFFF){
                    res.push(0xE0 + (charCode >> 12));
                    res.push(0x80 + ((charCode>>6) & 0x3F));
                    res.push(0x80 + (charCode & 0x3F));
                } else {
                    if (ASSERT){
                        core.Util.fail("Unsupported character. Charcode "+charCode);
                    }
                }
            }
            return new Uint8Array(res);
        },
        /**
         * Supports up to 3 byte UTF-8 encoding (including Basic Multilingual Plane)
         * @method utf8Decode
         * @param {Uint8Array} bytes
         * @return String
         */
        utf8Decode:function(bytes){
            var str = "";
            for (var i=0;i<bytes.length;i++){
                var byte = bytes[i];
                if ((byte & 0x80) === 0){ // Bytes 0xxxxxxx
                    str += String.fromCharCode(byte);
                } else if ((byte & 0xE0) === 0xC0){ // Bytes 110xxxxx
                    i++;
                    var byte2 = bytes[i];
                    byte = (byte & 0x1F) << 6;
                    byte2 = byte2 & 0x3F;
                    var char = byte + byte2;
                    str += String.fromCharCode(char);
                } else if ((byte & 0xF0) === 0xE0){ // Bytes 1110xxxx
                    i++;
                    var byte2 = bytes[i];
                    i++;
                    var byte3 = bytes[i];
                    byte = (byte & 0x1F) << 12;
                    byte2 = (byte2 & 0x3F) << 6;
                    byte3 = byte3 & 0x3F;
                    var char = byte + byte2 + byte3;
                    str += String.fromCharCode(char);
                } else {
                    if (ASSERT){
                        core.Util.fail("Unsupported encoding");
                    }
                }
            }
            return str;
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
