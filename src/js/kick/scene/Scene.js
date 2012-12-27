define(["require", "kick/core/ProjectAsset", "./SceneLights", "kick/core/Constants", "kick/core/Util", "./Camera", "./Light", "./GameObject", "./ComponentChangedListener", "kick/core/EngineSingleton"],
    function (require, ProjectAsset, SceneLights, Constants, Util, Camera, Light, GameObject, ComponentChangedListener, EngineSingleton) {
        "use strict";

        var DEBUG = Constants._DEBUG,
            ASSERT = Constants._ASSERT,
            Scene;

        /**
         * A scene objects contains a list of GameObjects
         * @class Scene
         * @namespace kick.scene
         * @constructor
         * @param {Object} config
         * @extends kick.core.ProjectAsset
         */
        Scene = function (config) {
            // extend ProjectAsset
            ProjectAsset(this, config, "kick.scene.Scene");
            if (ASSERT){
                if (config === EngineSingleton.engine){
                    Util.fail("Scene constructor changed - engine parameter is removed");
                }
            }
            var engine = EngineSingleton.engine,
                objectsById = {},
                gameObjects = [],
                activeGameObjects = [],
                gameObjectsNew = [],
                gameObjectsDelete = [],
                updateableComponents = [],
                componentsNew = [],
                componentsDelete = [],
                componentListenes = [],
                componentsAll = [],
                cameras = [],
                renderableComponents = [],
                sceneLightObj = new SceneLights(engine.config.maxNumerOfLights),
                _name = "Scene",
                gl,
                i,
                thisObj = this,
                addLight = function (light) {
                    if (light.type === Constants._LIGHT_TYPE_AMBIENT) {
                        sceneLightObj.ambientLight = light;
                    } else if (light.type === Constants._LIGHT_TYPE_DIRECTIONAL) {
                        sceneLightObj.directionalLight = light;
                    } else {
                        sceneLightObj.addPointLight(light);
                    }
                },
                removeLight = function (light) {
                    if (light.type === Constants._LIGHT_TYPE_AMBIENT) {
                        sceneLightObj.ambientLight = null;
                    } else if (light.type === Constants._LIGHT_TYPE_DIRECTIONAL) {
                        sceneLightObj.directionalLight = null;
                    } else {
                        sceneLightObj.removePointLight(light);
                    }
                },
                /**
                 * Compares two objects based on scriptPriority
                 * @method sortByScriptPriority
                 * @param {kick.scene.Component} a
                 * @param {kick.scene.Component} b
                 * @return {Number} order of a,b
                 * @private
                 */
                sortByScriptPriority = function (a, b) {
                    return a.scriptPriority - b.scriptPriority;
                },
                /**
                 * Compares two camera objects by their cameraIndex attribute
                 * @method cameraSortFunc
                 * @param {kick.scene.Camera} a
                 * @param {kick.scene.Camera} b
                 * @param {Number} difference
                 * @private
                 */
                cameraSortFunc = function (a, b) {
                    return b.cameraIndex - a.cameraIndex;
                },
                /**
                 * Handle insertions of new gameobjects and components. This is done in a separate step to avoid problems
                 * with missed updates (or multiple updates) due to modifying the array while iterating it.
                 * @method addNewGameObjects
                 * @private
                 */
                addNewGameObjects = function () {
                    var i,
                        component,
                        componentsNewCopy;
                    if (gameObjectsNew.length > 0) {
                        activeGameObjects = activeGameObjects.concat(gameObjectsNew);
                        gameObjectsNew.length = 0;
                    }
                    if (componentsNew.length > 0) {
                        componentsNewCopy = componentsNew;
                        componentsNew = [];
                        for (i = componentsNewCopy.length - 1; i >= 0; i--) {
                            component = componentsNewCopy[i];
                            componentsAll.push(component);
                            if (typeof (component.activated) === "function") {
                                component.activated();
                            }
                            if (typeof (component.update) === "function") {
                                Util.insertSorted(component, updateableComponents, sortByScriptPriority);
                            }
                            if (typeof (component.render) === "function") {
                                renderableComponents.push(component);
                            }
                            if (typeof (component.render) === "function") {
                                Util.removeElementFromArray(renderableComponents, component);
                            }
                            if (component instanceof Camera) {
                                Util.insertSorted(component, cameras, cameraSortFunc);
                            } else if (component instanceof Light) {
                                addLight(component);
                            }
                        }
                        for (i = componentListenes.length - 1; i >= 0; i--) {
                            componentListenes[i].componentsAdded(componentsNewCopy);
                        }
                    }
                },/**
                 * Handle deletion of new gameobjects and components. This is done in a separate step to avoid problems
                 * with missed updates (or multiple updates) due to modifying the array while iterating it.
                 * @method cleanupGameObjects
                 * @private
                 */
                cleanupGameObjects = function () {
                    var i,
                        component,
                        componentsDeleteCopy;
                    if (gameObjectsDelete.length > 0) {
                        Util.removeElementsFromArray(activeGameObjects, gameObjectsDelete);
                        Util.removeElementsFromArray(gameObjects, gameObjectsDelete);
                        gameObjectsDelete.length = 0;
                    }
                    if (componentsDelete.length > 0) {
                        componentsDeleteCopy = componentsDelete;
                        componentsDelete = [];
                        for (i = componentsDeleteCopy.length - 1; i >= 0; i--) {
                            component = componentsDeleteCopy[i];
                            Util.removeElementFromArray(componentsAll, component);
                            if (typeof (component.deactivated) === "function") {
                                component.deactivated();
                            }
                            if (typeof (component.update) === "function") {
                                Util.removeElementFromArray(updateableComponents, component);
                            }
                            if (component instanceof Camera) {
                                Util.removeElementFromArray(cameras, component);
                            } else if (component instanceof Light) {
                                removeLight(component);
                            }
                        }
                        for (i = componentListenes.length - 1; i >= 0; i--) {
                            componentListenes[i].componentsRemoved(componentsDeleteCopy);
                        }
                    }
                },
                updateComponents = function () {
                    cleanupGameObjects();
                    addNewGameObjects();
                    var i;
                    for (i = updateableComponents.length - 1; i >= 0; i--) {
                        updateableComponents[i].update();
                    }
                },
                renderComponents = function () {
                    var i;
                    for (i = cameras.length - 1; i >= 0; i--) {
                        cameras[i].renderScene(sceneLightObj);
                    }
                    engine.gl.flush();
                },
                createGameObjectPrivate = function (config) {
                    var gameObject = new GameObject(thisObj, config);
                    gameObjectsNew.push(gameObject);
                    gameObjects.push(gameObject);
                    objectsById[gameObject.uid] = gameObject;
                    return gameObject;
                };

            /**
             * @method notifyComponentUpdated
             * @param component {kick.scene.Component}
             */
            this.notifyComponentUpdated = function (component) {
                for (i = componentListenes.length - 1; i >= 0; i--) {
                    componentListenes[i].componentUpdated(component);
                }
            };

            /**
             * @method destroy
             */
            this.destroy = function () {
                engine.project.removeResourceDescriptor(thisObj.uid);
                if (thisObj === engine.activeScene) {
                    engine.activeScene = null;
                }
            };

            /**
             * Add a component listener to the scene. A component listener should contain two functions:
             * {componentsAdded(components) and componentsRemoved(components)}.
             * Throws an exception if the two required functions does not exist.
             * @method addComponentListener
             * @param {kick.scene.ComponentChangedListener} componentListener
             */
            this.addComponentListener = function (componentListener) {
                if (!ComponentChangedListener.isComponentListener(componentListener)) {
                    Util.fail("Component listener does not have the correct interface. " +
                        "It should contain the two functions: " +
                        "componentsAdded(components) and componentsRemoved(components)");
                }
                if (!componentListener.componentUpdated) {
                    componentListener.componentUpdated = function () {};
                    if (DEBUG) {
                        Util.warn("componentListener has no componentUpdated method");
                    }
                }
                componentListenes.push(componentListener);
                // add current components to component listener
                componentListener.componentsAdded(componentsAll);
            };

            /**
             * Search the scene for components of the specified type in the scene. Note that this
             * method is slow - do not run in the the update function.
             * @method findComponentsOfType
             * @param {Function} componentType
             * @return {Array_kick.scene.Component} components
             */
            this.findComponentsOfType = function (componentType) {
                if (ASSERT) {
                    if (typeof componentType !== 'function') {
                        Util.fail("Scene.findComponentsOfType expects a function");
                    }
                }
                var res = [],
                    i,
                    j,
                    component;
                for (i = gameObjects.length - 1; i >= 0; i--) {
                    component = gameObjects[i].getComponentsOfType(componentType);
                    for (j = 0; j < component.length; j++) {
                        res.push(component[j]);
                    }
                }
                return res;
            };

            /**
             * Removes a component change listener from the scene
             * @method removeComponentListener
             * @param {kick.scene.ComponentChangedListener} componentListener
             */
            this.removeComponentListener = function (componentListener) {
                Util.removeElementFromArray(componentListenes, componentListener);
            };

            /**
             * Should only be called by GameObject when a component is added. If the component is updateable (implements
             * update method) the components is added to the current list of updateable components after the update loop
             * (so it will not recieve any update invocations in the current frame).
             * If the component is renderable (implements), is it added to the renderer's components
             * @method addComponent
             * @param {kick.scene.Component} component
             * @protected
             */
            this.addComponent = function (component) {
                Util.insertSorted(component, componentsNew, sortByScriptPriority);
                var uid = engine.getUID(component);
                if (ASSERT) {
                    if (objectsById[uid]) {
                        Util.fail("Component with uid " + uid + " already exist");
                    }
                }
                objectsById[uid] = component;
            };

            /**
             * @method getObjectByUID
             * @param {Number} uid
             * @return {Object} GameObject or component
             */
            this.getObjectByUID = function (uid) {
                return objectsById[uid];
            };

            /**
             * Returns a gameobject identified by name
             * @method getGameObjectByName
             * @param {String} name
             * @return {kick.scene.GameObject} GameObject or undefined if not found
             */
            this.getGameObjectByName = function (name) {
                var i,
                    gameObject;
                for (i = gameObjects.length - 1; i >= 0; i--) {
                    gameObject = gameObjects[i];
                    if (gameObject.name === name) {
                        return gameObject;
                    }
                }
            };


            /**
             * @method removeComponent
             * @param {kick.scene} component
             */
            this.removeComponent = function (component) {
                Util.removeElementFromArray(componentsNew, component);
                componentsDelete.push(component);
                delete objectsById[component.uid];
            };

            Object.defineProperties(this, {
                /**
                 * Reference to the engine
                 * @property engine
                 * @type kick.core.Engine
                 */
                engine: {
                    value: engine
                },
                /**
                 * Name of the scene
                 * @property name
                 * @type String
                 */
                name: {
                    get: function () {
                        return _name;
                    },
                    set: function (newValue) {
                        _name = newValue;
                    }

                }
            });

            /**
             * @method createGameObject
             * @param {Object} config Optionally configuration passed to the game objects
             * @return {kick.scene.GameObject}
             */
            this.createGameObject = function (config) {
                var gameObject = createGameObjectPrivate(config),
                    transform = gameObject.transform;
                objectsById[engine.getUID(transform)] = transform;
                return gameObject;
            };

            /**
             * Destroys the game object and delete it from the scene.
             * This call will call destroy on the gameObject
             * @method destroyObject
             * @param {kick.scene.GameObject} gameObject
             */
            this.destroyObject = function (gameObject) {
                var isMarkedForDeletion = Util.contains(gameObjectsDelete, gameObject);
                if (!isMarkedForDeletion) {
                    gameObjectsDelete.push(gameObject);
                    delete objectsById[gameObject.uid];
                }
                if (!gameObject.destroyed) {
                    gameObject.destroy();
                }
            };

            /**
             * @method getNumberOfGameObjects
             * @return {Number} number of gameobjects
             */
            this.getNumberOfGameObjects = function () {
                return gameObjects.length;
            };

            /**
             * @method getGameObject
             * @param {Number} index
             * @return {kick.scene.GameObject}
             */
            this.getGameObject = function (index) {
                return gameObjects[index];
            };

            /**
             * Called by engine every frame. Updates and render scene
             * @method updateAndRender
             */
            this.updateAndRender = function () {
                updateComponents();
                renderComponents();
            };

            /**
             * @method toJSON
             * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
             * @return {Object}
             */
            this.toJSON = function (filterFn) {
                var gameObjectsCopy = [],
                    i,
                    gameObject;
                filterFn = filterFn || function () { return true; };
                for (i = 0; i < gameObjects.length; i++) {
                    gameObject = gameObjects[i];
                    if (filterFn(gameObject)) {
                        gameObjectsCopy.push(gameObject.toJSON());
                    }
                }
                return {
                    uid: thisObj.uid,
                    gameObjects: gameObjectsCopy,
                    name: _name
                };
            };

            /**
             * Configures the object using the configuration data.
             * @method init
             * @param config {Object} configuration data in JSON format
             */
            this.init = function(config){
                var gameObject,
                    hasProperty = Util.hasProperty,
                    applyConfig = Util.applyConfig,
                    i,
                    createConfigWithReferences = function (config) {
                        var configCopy = {},
                            name,
                            value;
                        for (name in config) {
                            if (config.hasOwnProperty(name) && hasProperty(config, name)) {
                                value = config[name];
                                value = Util.deserializeConfig(value, engine, thisObj);
                                configCopy[name] = value;
                            }
                        }
                        return configCopy;
                    };
                if (config) {
                    _name = config.name || "Scene";
                    var gameObjects = config.gameObjects || [],
                        mappingUidToObject = {},
                        newGameObjects = [],
                        configs = {};
                    // create game objects
                    (function createGameObjects() {
                        for (i = 0; i < gameObjects.length; i++) {
                            gameObject = config.gameObjects[i];
                            newGameObjects[i] = createGameObjectPrivate(gameObject);
                            mappingUidToObject[gameObject.uid] = newGameObjects[i];
                        }
                    }());

                    (function createComponents() {
                        var component,
                            componentObj,
                            Type,
                            gameObjectConfig,
                            gameObjects = config.gameObjects || [],
                            j,
                            i,
                            uid,
                            originalConf,
                            conf,
                            obj;

                        for (j = 0; j < gameObjects.length; j++) {
                            gameObjectConfig = config.gameObjects[j];
                            gameObject = newGameObjects[j];
                            // build components
                            for (i = 0; gameObjectConfig.components && i < gameObjectConfig.components.length; i++) {
                                component = gameObjectConfig.components[i];
                                if (component.type === "kick.scene.Transform") {
                                    componentObj = gameObject.transform;
                                    componentObj.uid = component.uid;
                                    // register transform object to objectsById
                                    objectsById[componentObj.uid] = componentObj;
                                } else {
                                    Type = require(component.type.replace(/\./g,"/"));
                                    if (typeof Type === 'function') {
                                        componentObj = new Type({uid: component.uid});
                                        componentObj.uid = component.uid;
                                        gameObject.addComponent(componentObj);
                                    } else {
                                        Util.warn("Cannot find Class " + component.type);
                                        continue;
                                    }
                                }
                                mappingUidToObject[component.uid] = componentObj;
                                configs[component.uid] = component.config;
                            }
                        }

                        // apply config
                        for (uid in mappingUidToObject) {
                            if (mappingUidToObject.hasOwnProperty(uid) && hasProperty(mappingUidToObject, uid)) {
                                originalConf = configs[uid];
                                if (originalConf) {
                                    conf = createConfigWithReferences(originalConf);
                                    obj = mappingUidToObject[uid];
                                    applyConfig(obj, conf);
                                }
                            }
                        }
                    }());
                }
            };
            this.init(config);
        };

        /**
         * Create empty scene with camera
         * @method createDefault
         * @param {kick.core.Engine} engine
         * @static
         * @return {kick.scene.Scene}
         */
        Scene.createDefault = function (engine) {
            var newScene = new Scene(engine),
                gameObject = newScene.createGameObject();
            gameObject.addComponent(new Camera());
            return newScene;
        };

        return Scene;
    });