define(["./Constants", "./ResourceDescriptor", "kick/material/Shader", "./Util", "kick/texture/Texture", "kick/mesh/Mesh", "kick/material/Material"],
    function (constants, ResourceDescriptor, Shader, Util, Texture, Mesh, Material) {
        "use strict";

        var ASSERT = constants._ASSERT,
            DEBUG = constants._DEBUG,
            /**
             * A project is a container of all resources and assets used in a game.
             *
             * When a project is loaded then all it's assets are initialized (except for built-in assets with uid less
             * than 0, which are lazy-loaded).
             *
             * All assets initialized should be registered in the project. This is done by calling Project.registerObject()
             * (Note for built-in kickjs assets, this happens automatically when the objects are constructed).
             * @class Project
             * @namespace kick.core
             * @constructor
             * @param {kick.core.Engine} engine
             */
            Project = function (engine) {
                var resourceDescriptorsByUID = {},
                    resourceCache = {},
                    thisObj = this,
                    _maxUID = 0,
                    verifyMaxUID = function(){
                        var uid;
                        for (uid in resourceDescriptorsByUID){
                            if (_maxUID < uid){
                                Util.fail("MaxUID invalid");
                            }
                        }
                    },
                    refreshResourceDescriptor = function (uid, filter) {
                        if (resourceDescriptorsByUID[uid] instanceof ResourceDescriptor) {
                            var liveObject = resourceCache[uid];
                            if (liveObject) {
                                resourceDescriptorsByUID[uid].updateConfig(liveObject, filter);
                            }
                        }
                    },
                    getUrlAsResourceName = function (url) {
                        var name = url.split('/');
                        if (name.length > 2) {
                            name = name[name.length - 2];
                            name = name.substring(0, 1).toUpperCase() + name.substring(1);
                        } else {
                            name = url;
                        }
                        return name;
                    },
                    loadEngineAsset = function (uid) {
                        var res,
                            url,
                            isCubemap,
                            canvas,
                            shader,
                            ctx;
                        if (uid <= Project.ENGINE_SHADER_DEFAULT && uid >= Project.ENGINE_SHADER___PICK_NORMAL) {
                            switch (uid) {
                            case Project.ENGINE_SHADER_DEFAULT:
                                url = "kickjs://shader/default/";
                                break;
                            case Project.ENGINE_SHADER_SPECULAR:
                                url = "kickjs://shader/specular/";
                                break;
                            case Project.ENGINE_SHADER_DIFFUSE:
                                url = "kickjs://shader/diffuse/";
                                break;
                            case Project.ENGINE_SHADER_UNLIT:
                                url = "kickjs://shader/unlit/";
                                break;
                            case Project.ENGINE_SHADER_UNLIT_VERTEX_COLOR:
                                url = "kickjs://shader/unlit_vertex_color/";
                                break;
                            case Project.ENGINE_SHADER_TRANSPARENT_SPECULAR:
                                url = "kickjs://shader/transparent_specular/";
                                break;
                            case Project.ENGINE_SHADER_TRANSPARENT_DIFFUSE:
                                url = "kickjs://shader/transparent_diffuse/";
                                break;
                            case Project.ENGINE_SHADER_TRANSPARENT_UNLIT:
                                url = "kickjs://shader/transparent_unlit/";
                                break;
                            case Project.ENGINE_SHADER___SHADOWMAP:
                                url = "kickjs://shader/__shadowmap/";
                                break;
                            case Project.ENGINE_SHADER___PICK_UV:
                                url = "kickjs://shader/__pick_uv/";
                                break;
                            case Project.ENGINE_SHADER___PICK_NORMAL:
                                url = "kickjs://shader/__pick_normal/";
                                break;
                            case Project.ENGINE_SHADER___PICK:
                                url = "kickjs://shader/__pick/";
                                break;
                            case Project.ENGINE_SHADER___ERROR:
                                url = "kickjs://shader/__error/";
                                break;
                            default:
                                if (ASSERT) {
                                    Util.fail("uid not mapped " + uid);
                                }
                                return null;
                            }
                            res = new Shader({
                                dataURI: url,
                                name: getUrlAsResourceName(url),
                                uid: uid
                            });
                        } else if (uid <= Project.ENGINE_TEXTURE_BLACK && uid >= Project.ENGINE_TEXTURE_DEFAULT_NORMAL) {
                            isCubemap = uid === Project.ENGINE_TEXTURE_CUBEMAP_WHITE;
                            switch (uid) {
                            case Project.ENGINE_TEXTURE_BLACK:
                                url = "kickjs://texture/black/";
                                break;
                            case Project.ENGINE_TEXTURE_WHITE:
                                url = "kickjs://texture/white/";
                                break;
                            case Project.ENGINE_TEXTURE_GRAY:
                                url = "kickjs://texture/gray/";
                                break;
                            case Project.ENGINE_TEXTURE_LOGO:
                                url = "kickjs://texture/logo/";
                                break;
                            case Project.ENGINE_TEXTURE_CUBEMAP_WHITE:
                                // do nothing
                                break;
                            case Project.ENGINE_TEXTURE_DEFAULT_NORMAL:
                                url = "kickjs://texture/default_normal/";
                                break;
                            default:
                                if (ASSERT) {
                                    Util.fail("uid not mapped " + uid);
                                }
                                return null;
                            }
                            if (isCubemap) {
                                res = new Texture(
                                    {
                                        name: "cubemap_white",
                                        minFilter: constants.GL_NEAREST,
                                        magFilter: constants.GL_NEAREST,
                                        generateMipmaps: false,
                                        uid: uid,
                                        textureType: constants.GL_TEXTURE_CUBE_MAP
                                    });

                                // create white image
                                canvas = document.createElement("canvas");
                                canvas.width = 12;
                                canvas.height = 2;
                                ctx = canvas.getContext("2d");

                                ctx.fillStyle = "rgb(255,255,255)";
                                ctx.fillRect(0, 0, 12, 2);
                                res.setImage(canvas, "memory://cubemap_white/");

                            } else {
                                res = new Texture(
                                    {
                                        name: getUrlAsResourceName(url),
                                        minFilter: constants.GL_NEAREST,
                                        magFilter: constants.GL_NEAREST,
                                        generateMipmaps: false,
                                        uid: uid,
                                        textureType: constants.GL_TEXTURE_2D,
                                        dataURI: url
                                    });
                            }

                        } else if (uid <= Project.ENGINE_MESH_TRIANGLE && uid >= Project.ENGINE_MESH_POINT) {
                            switch (uid) {
                            case Project.ENGINE_MESH_TRIANGLE:
                                url = "kickjs://mesh/triangle/";
                                break;
                            case Project.ENGINE_MESH_PLANE:
                                url = "kickjs://mesh/plane/";
                                break;
                            case Project.ENGINE_MESH_UVSPHERE:
                                url = "kickjs://mesh/uvsphere/";
                                break;
                            case Project.ENGINE_MESH_CUBE:
                                url = "kickjs://mesh/cube/";
                                break;
                            case Project.ENGINE_MESH_POINT:
                                url = "kickjs://mesh/point/";
                                break;
                            default:
                                if (ASSERT) {
                                    Util.fail("uid not mapped " + uid);
                                }
                                return null;
                            }
                            res = new Mesh(
                                {
                                    dataURI: url,
                                    name: getUrlAsResourceName(url),
                                    uid: uid
                                });
                        } else if (uid <= Project.ENGINE_MATERIAL_DEFAULT) {
                            shader = loadEngineAsset(Project.ENGINE_SHADER_UNLIT);
                            res = new Material({
                                shader: shader,
                                name: "Default material"
                            });
                        }

                        resourceCache[uid] = res;
                        return res;
                    };

                Util.copyStaticPropertiesToObject(thisObj, Project);


                Object.defineProperties(this, {
                    /**
                     * The maximum UID used in the project
                     * @property maxUID
                     * @type Number
                     */
                    maxUID: {
                        get: function () {
                            return _maxUID;
                        },
                        set: function (newValue) {
                            _maxUID = newValue;
                            if (ASSERT){
                                verifyMaxUID();
                            }
                        }
                    },
                    /**
                     * List the asset uids of project
                     * @property resourceDescriptorUIDs
                     * @type Array_Number
                     */
                    resourceDescriptorUIDs: {
                        get: function () {
                            var uids = [],
                                uid;
                            for (uid in resourceDescriptorsByUID) {
                                if (resourceDescriptorsByUID.hasOwnProperty(uid)) {
                                    uids.push(uid);
                                }
                            }
                            return uids;
                        }
                    }
                });

                /**
                 * Creates a new empty project.
                 * @method newProject
                 */
                this.newProject = function () {
                    thisObj.loadProject({maxUID: 0, resourceDescriptors: []});
                };

                /**
                 * Loads a project by URL. This call is asynchronous, and onSuccess or onFail will be called when the loading is
                 * complete.
                 * @method loadProjectByURL
                 * @param {String} url
                 * @param {Function} onSuccess
                 * @param {Function} onFail
                 */
                this.loadProjectByURL = function (url, onSuccess, onError) {
                    var voidFunction = function () {
                            if (DEBUG) {
                                console.log(arguments);
                            }
                        },
                        oXHR;
                    onSuccess = onSuccess || voidFunction;
                    onError = onError || voidFunction;

                    oXHR = new XMLHttpRequest();
                    oXHR.open("GET", url, true);
                    oXHR.onreadystatechange = function (oEvent) {
                        if (oXHR.readyState === 4) {
                            if (oXHR.status === 200) {
                                var value = JSON.parse(oXHR.responseText);
                                try {
                                    thisObj.loadProject(value, onSuccess, onError);
                                } catch (e) {
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
                 * Load a project of the form {maxUID:number,resourceDescriptors:[kick.core.ResourceDescriptor],activeScene:number}
                 * @method loadProject
                 * @param {object} config
                 * @param {Function} onSuccess
                 * @param {Function} [onFail=null]
                 */
                this.loadProject = function (config, onSuccess, onError) {
                    if (_maxUID > 0) {
                        thisObj.closeProject();
                    }
                    if (typeof onSuccess !== "function" && ASSERT){
                        Util.fail("Project.loadProject - onSuccess parameter not a function");
                    }
                    config = config || {};
                    var resourceDescriptors = config.resourceDescriptors || [],
                        i,
                        uid,
                        createConfigInitialized = function (config) {
                            var res = {},
                                name,
                                value,
                                reftype,
                                ref;
                            for (name in config) {
                                if (Util.hasProperty(config, name)) {
                                    value = config[name];
                                    reftype = value ? value.reftype : null;
                                    ref = value ? value.ref : null;
                                    if (value && ref && reftype) {
                                        if (reftype === "resource") {
                                            value = engine.resourceLoader[value.refMethod](ref);
                                        } else if (reftype === "project") {
                                            value = engine.project.load(ref);
                                        }
                                    }
                                    res[name] = value;
                                }
                            }
                            return res;
                        },
                        onComplete = function () {
                            var initCount = 1,
                                decrementInitCount = function (url) {
                                    initCount--;
                                    if (initCount === 0) {
                                        _maxUID = config.maxUID || 0; // reset maxUID
                                        if (config.activeScene) {
                                            engine.activeScene = thisObj.load(config.activeScene);
                                        } else {
                                            engine.activeScene = null;
                                        }
                                        if (onSuccess) {
                                            onSuccess(thisObj);
                                        }
                                    }
                                },
                                resourceTracker = {
                                    resourceLoadingStarted: function () {
                                        initCount++;
                                    },
                                    resourceLoadingFinished: decrementInitCount,
                                    resourceLoadingFailed: onError
                                };
                            // instantiate config
                            for (uid in resourceDescriptorsByUID) {
                                if (resourceDescriptorsByUID.hasOwnProperty(uid)) {
                                    resourceCache[uid].init(createConfigInitialized(resourceDescriptorsByUID[uid].config), resourceTracker);
                                }
                            }
                            decrementInitCount();

                        },
                        resourceCount = resourceDescriptors.length,
                        instantiateCount = 0,
                        instantiateSuccess = function (object) {
                            if (resourceCache[object.uid] !== object) {
                                onError("Did not restore uid correct for " + object.uid + ".");
                                return;
                            }

                            instantiateCount++;
                            if (instantiateCount === resourceCount){
                                onComplete();
                            }
                        };
                    _maxUID = config.maxUID || 0;
                    for (i = 0; i < resourceCount; i++) {
                        thisObj.addResourceDescriptor(resourceDescriptors[i]);
                    }

                    // preload all resources

                    for (uid in resourceDescriptorsByUID) {
                        if (resourceDescriptorsByUID.hasOwnProperty(uid)) {
                            resourceDescriptorsByUID[uid].instantiate(instantiateSuccess, onError);
                        }
                    }
                };

                /**
                 * Close all resources in the project and remove all resource descriptors
                 * @method closeProject
                 */
                this.closeProject = function () {
                    var uid;
                    for (uid in resourceDescriptorsByUID) {
                        if (resourceDescriptorsByUID.hasOwnProperty(uid)) {
                            thisObj.removeResourceDescriptor(uid);
                        }
                    }
                    resourceDescriptorsByUID = {};
                    resourceCache = {};
                };

                /**
                 * Load a resource from the project.
                 * @method load
                 * @param {String} uid
                 */
                this.load = function (uid, callback, onError) {
                    var resourceObject = resourceCache[uid];
                    if (resourceObject) {
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
                this.removeCacheReference = function (uid) {
                    if (resourceCache[uid]) {
                        delete resourceCache[uid];
                    }
                };

                /**
                 * Load a resource from the configuration (or cache).
                 * Also increases the resource reference counter.
                 * If more objects exist with the same name, the first object is returned
                 * @method loadByName
                 * @param {String} name
                 * @param {String} type=null limit the search to a specific type
                 * @return {kick.core.ProjectAsset} resource or null if resource is not found
                 */
                this.loadByName = function (name, type) {
                    var uid,
                        resource;
                    for (uid in resourceDescriptorsByUID) {
                        if (resourceDescriptorsByUID.hasOwnProperty(uid)) {
                            resource = resourceDescriptorsByUID[uid];
                            if (resource.name === name) {
                                if (!type || resource.type === type) {
                                    return thisObj.load(resource.uid);
                                }
                            }
                        }
                    }
                    if (ASSERT){
                        verifyMaxUID();
                    }
                    return null;
                };

                /**
                 * Registers an asset in a Project.
                 * @method registerObject
                 * @param {Object} object
                 * @param {String} type
                 */
                this.registerObject = function (object, type) {
                    var uid = engine.getUID(object);
                    if (resourceCache[uid]) {
                        if (constants._ASSERT) {
                            Util.warn("Object already registered ", uid, object);
                        }
                        return;
                    }
                    resourceCache[uid] = object;
                    if (!resourceDescriptorsByUID[uid]) { // only update if new object
                        resourceDescriptorsByUID[uid] = new ResourceDescriptor({
                            uid: uid,
                            type: type,
                            config: {name: object.name} // will be generated on serialization
                        });
                    }
                    if (ASSERT){
                        verifyMaxUID();
                    }
                };

                /**
                 * Updates the resourceDescriptors with data from the initialized objects
                 * @method refreshResourceDescriptors
                 * @param {Function} filter=null Filter with function(object): return boolean, where true means include in export.
                 */
                this.refreshResourceDescriptors = function (filter) {
                    var uid;
                    filter = filter || function () { return true; };
                    for (uid in resourceDescriptorsByUID) {
                        if (resourceDescriptorsByUID.hasOwnProperty(uid)) {
                            refreshResourceDescriptor(uid, filter);
                        }
                    }
                    if (ASSERT){
                        verifyMaxUID();
                    }
                };

                /**
                 * Returns the buildin engine resources
                 * @method getEngineResourceDescriptorsByType
                 * @param {String} type
                 * @return {Array_kick.core.ResourceDescriptor}
                 */
                this.getEngineResourceDescriptorsByType = function (type) {
                    var res = [],
                        searchFor,
                        name,
                        uid;
                    if (type === "kick.mesh.Mesh") {
                        searchFor = "ENGINE_MESH_";
                    } else if (type === "kick.material.Shader") {
                        searchFor = "ENGINE_SHADER_";
                    } else if (type === "kick.texture.Texture") {
                        searchFor = "ENGINE_TEXTURE_";
                    }
                    if (searchFor) {
                        for (name in Project) {
                            if (typeof Project[name] === "number" && Project.hasOwnProperty(name) && name.indexOf(searchFor) === 0) {
                                uid = Project[name];
                                name = Util.toCamelCase(name.substr(searchFor.length), " ");
                                res.push(new ResourceDescriptor({
                                    type: type,
                                    config: {
                                        name: name,
                                        uid: uid
                                    }
                                }));
                            }
                        }
                    }
                    return res;
                };

                /**
                 * @method getResourceDescriptorsByType
                 * @param {String} type
                 * @return {Array_kick.core.ResourceDescriptor}
                 */
                this.getResourceDescriptorsByType = function (type) {
                    var res = [],
                        uid;
                    for (uid in resourceDescriptorsByUID) {
                        if (resourceDescriptorsByUID.hasOwnProperty(uid) && resourceDescriptorsByUID[uid].type === type) {
                            res.push(resourceDescriptorsByUID[uid]);
                        }
                    }
                    return res;
                };

                /**
                 * @method getResourceDescriptorsByName
                 * @param {String} type
                 * @return {Array_kick.core.ResourceDescriptor}
                 */
                this.getResourceDescriptorsByName = function (name) {
                    var res = [],
                        uid;
                    for (uid in resourceDescriptorsByUID) {
                        if (resourceDescriptorsByUID.hasOwnProperty(uid) && resourceDescriptorsByUID[uid].name === name) {
                            res.push(resourceDescriptorsByUID[uid]);
                        }
                    }
                    return res;
                };



                /**
                 * @method getResourceDescriptor
                 * @param {Number} uid
                 * @return {kick.core.ResourceDescriptor} resource descriptor (or null if not found)
                 */
                this.getResourceDescriptor = function (uid) {
                    refreshResourceDescriptor(uid);
                    return resourceDescriptorsByUID[uid];
                };

                /**
                 * @method addResourceDescriptor
                 * @param {kick.core.ResourceDescriptor|Object} resourceDescriptor
                 * @return {kick.core.ResourceDescriptor}
                 */
                this.addResourceDescriptor = function (resourceDescriptor) {
                    if (!(resourceDescriptor instanceof ResourceDescriptor)) {
                        resourceDescriptor = new ResourceDescriptor(resourceDescriptor);
                    }

                    resourceDescriptorsByUID[resourceDescriptor.uid] = resourceDescriptor;
                    return resourceDescriptor;
                };

                /**
                 * Remove resource descriptor and destroy the resource if already allocated.
                 * @method removeResourceDescriptor
                 * @param {Number} uid
                 */
                this.removeResourceDescriptor = function (uid) {
                    // destroy the resource
                    var resource = resourceCache[uid];
                    if (resource) {
                        // remove references
                        delete resourceCache[uid];
                        // call destroy if exist
                        if (resource.destroy) {
                            resource.destroy();
                        }
                    }
                    // remove description
                    delete resourceDescriptorsByUID[uid];
                };

                /**
                 * @method toJSON
                 * @param {Function} filter=null Filter with function(object): return boolean, where true means include in export.
                 * @return Object
                 */
                this.toJSON = function (filter) {
                    var res = [],
                        uid,
                        resourceDescriptor;
                    filter = filter || function () { return true; };
                    thisObj.refreshResourceDescriptors(filter);
                    for (uid in resourceDescriptorsByUID) {
                        if (resourceDescriptorsByUID.hasOwnProperty(uid) && uid >= 0) { // don't serialize engine assets (since they are static)
                            resourceDescriptor = resourceDescriptorsByUID[uid];
                            if (resourceDescriptor instanceof ResourceDescriptor && filter(resourceDescriptor)) {
                                res.push(resourceDescriptor.toJSON(filter));
                            }
                        }
                    }
                    return {
                        engineVersion: engine.version,
                        maxUID: _maxUID,
                        activeScene: engine.activeScene ? engine.activeScene.uid : 0,
                        resourceDescriptors: res
                    };
                };
            };

        /**
         * @property ENGINE_SHADER_DEFAULT
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER_DEFAULT = -100;
        /**
         * @property ENGINE_SHADER_SPECULAR
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER_SPECULAR = -101;
        /**
         * @property ENGINE_SHADER_UNLIT
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER_UNLIT = -102;
        /**
         * @property ENGINE_SHADER_TRANSPARENT_SPECULAR
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER_TRANSPARENT_SPECULAR = -103;
        /**
         * @property ENGINE_SHADER_TRANSPARENT_UNLIT
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER_TRANSPARENT_UNLIT = -104;
        /**
         * @property ENGINE_SHADER___SHADOWMAP
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER___SHADOWMAP = -105;
        /**
         * @property ENGINE_SHADER___PICK
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER___PICK = -106;
        /**
         * @property ENGINE_SHADER___ERROR
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER___ERROR = -107;
        /**
         * @property ENGINE_SHADER_DIFFUSE
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER_DIFFUSE = -108;
        /**
         * @property ENGINE_SHADER_TRANSPARENT_DIFFUSE
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER_TRANSPARENT_DIFFUSE = -109;
        /**
         * @property ENGINE_SHADER_UNLIT_VERTEX_COLOR
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER_UNLIT_VERTEX_COLOR = -110;
        /**
         * @property ENGINE_SHADER___PICK_UV
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER___PICK_UV = -111;
        /**
         * @property ENGINE_SHADER___PICK_NORMAL
         * @type Number
         * @static
         */
        Project.ENGINE_SHADER___PICK_NORMAL = -112;
        /**
         * @property ENGINE_TEXTURE_BLACK
         * @type Number
         * @static
         */
        Project.ENGINE_TEXTURE_BLACK = -200;
        /**
         * @property ENGINE_TEXTURE_WHITE
         * @type Number
         * @static
         */
        Project.ENGINE_TEXTURE_WHITE = -201;
        /**
         * @property ENGINE_TEXTURE_GRAY
         * @type Number
         * @static
         */
        Project.ENGINE_TEXTURE_GRAY = -202;

        /**
         * @property ENGINE_TEXTURE_LOGO
         * @type Number
         * @static
         */
        Project.ENGINE_TEXTURE_LOGO = -203;

        /**
         * @property ENGINE_TEXTURE_CUBEMAP_WHITE
         * @type Number
         * @static
         */
        Project.ENGINE_TEXTURE_CUBEMAP_WHITE = -204;

        /**
         * @property ENGINE_TEXTURE_DEFAULT_NORMAL
         * @type Number
         * @static
         */
        Project.ENGINE_TEXTURE_DEFAULT_NORMAL = -205;

        /**
         * @property ENGINE_MESH_TRIANGLE
         * @type Number
         * @static
         */
        Project.ENGINE_MESH_TRIANGLE = -300;

        /**
         * @property ENGINE_MESH_PLANE
         * @type Number
         * @static
         */
        Project.ENGINE_MESH_PLANE = -301;

        /**
         * @property ENGINE_MESH_UVSPHERE
         * @type Number
         * @static
         */
        Project.ENGINE_MESH_UVSPHERE = -302;

        /**
         * @property ENGINE_MESH_CUBE
         * @type Number
         * @static
         */
        Project.ENGINE_MESH_CUBE = -303;

        /**
         * @property ENGINE_MESH_CUBE
         * @type Number
         * @static
         */
        Project.ENGINE_MESH_POINT = -304;

        /**
         * Default material is using ENGINE_SHADER_UNLIT and is white
         * @property ENGINE_MATERIAL_DEFAULT
         * @type {Number}
         * @static
         */
        Project.ENGINE_MATERIAL_DEFAULT = -400;


        return Project;
    });