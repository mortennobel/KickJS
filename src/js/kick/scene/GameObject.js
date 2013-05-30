define(["./Transform", "kick/core/Util", "kick/core/Constants", "kick/core/Observable"], function (Transform, Util, Constants, Observable) {
    "use strict";

    var ASSERT = Constants._ASSERT;

    /**
     * Game objects. (Always attached to a given scene).
     * This constructor should not be called directly - Scene.createGameObject() should be used instead.
     * @class GameObject
     * @namespace kick.scene
     * @constructor
     * @param {kick.scene.Scene} scene
     * @param {Object} config configuration for gameObject (components will not be initialized)
     */
    return function (scene, config) {
        var _components = [],
            _layer = 1,
            _name,
            _uid = scene.engine.createUID(),
            thisObj = this;
        Object.defineProperties(this,
            {
                /**
                 * Reference to the containing scene
                 * @property scene
                 * @type kick.scene.Scene
                 */
                scene: {
                    value: scene
                },
                /**
                 * Reference to the engine
                 * @property engine
                 * @type kick.core.Engine
                 * @deprecated
                 */
                engine: {
                    get: function () {
                        if (ASSERT) {
                            Util.fail("GameObject.engine is deprecated. Use EngineSingleton.engine instead.");
                        }
                        return scene.engine;
                    }
                },
                /**
                 * Reference to the transform
                 * @property transform
                 * @type kick.scene.Transform
                 */
                // automatically bound
                /**
                 * Layer bit flag. The default value is 1.
                 * The layer should have a value of 2^n
                 * @property layer
                 * @type Number
                 */
                layer: {
                    get: function () {
                        return _layer;
                    },
                    set: function (newValue) {
                        if (typeof newValue !== 'number') {
                            Util.fail("GameObject.layer must be a Number");
                        }
                        _layer = newValue;
                    }
                },
                /**
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
                },
                /**
                 * Unique id - identifies a game object (within a scene).
                 * @property uid
                 * @type Number
                 */
                uid: {
                    get: function () {
                        return _uid;
                    },
                    set: function (newValue) {
                        _uid = newValue;
                    }
                },
                /**
                 * Number of components
                 * @property numberOfComponents
                 * @type Number
                 */
                numberOfComponents: {
                    get: function () {
                        return _components.length;
                    }
                },
                /**
                 * @property destroyed
                 * @type Boolean
                 */
                destroyed: {
                    get: function () {
                        return _components.length === 0;
                    }
                }
            });

        Observable.call(this, [
        /**
         * Fired when a new component is added to gameObject
         * @event componentAdded
         * @param {kick.scene.Component} component
         */
            "componentAdded",
        /**
         * Fired when a new component is removed from gameObject
         * @event componentRemoved
         * @param {kick.scene.Component} component
         */
            "componentRemoved"
        ]
        );

        /**
         * Get component by index.
         * @method getComponent
         * @param {Number} index
         * @return {kick.scene.Component}
         */
        this.getComponent = function (index) {
            return _components[index];
        };

        /**
         * Add the component to a gameObject and set the gameObject field on the component
         * @method addComponent
         * @param {kick.scene.Component} component
         */
        this.addComponent = function (component) {
            if (component.gameObject) {
                throw {
                    name: "Error",
                    message: "Component " + component + " already added to gameObject " + component.gameObject
                };
            }
            if (!component.scriptPriority) {
                component.scriptPriority = 0;
            }
            if (typeof component.componentType === "string" && thisObj[component.componentType] === undefined){
                thisObj[component.componentType] = component;
            }
            component.gameObject = this;
            _components.push(component);
            thisObj.fireEvent("componentAdded", component);
        };

        /**
         * Remove the component from a gameObject and clear the gameObject field on the component
         * @method removeComponent
         * @param {kick.scene.Component} component
         */
        this.removeComponent =  function (component) {
            try {
                delete component.gameObject;
            } catch (e) {
                // ignore if gameObject cannot be deleted
            }
            // delete component reference
            if (typeof component.componentType === "string" && thisObj[component.componentType] === component){
                delete thisObj[component.componentType];
            }
            if (Util.removeElementFromArray(_components, component)){
                thisObj.fireEvent("componentRemoved", component);
            }
        };

        /**
         * Invoked when component updated (such as material change).
         * @method notifyComponentUpdated
         * @param {kick.scene.Component} component
         * @deprecated
         */
        this.notifyComponentUpdated = function (component) {
            Util.fail("Use component.fireEvent('componentUpdated', component) instead");
            if (component.hasOwnProperty("componentUpdated")){
                component.fireEvent("componentUpdated", component);
            }
        };

        /**
         * Destroys game object after next frame.
         * Removes all components instantly.
         * This method will call destroyGameObject on the associated scene.
         * @method destroy
         */
        this.destroy = function () {
            var i;
            for (i = _components.length - 1; i >= 0; i--) {
                thisObj.removeComponent(_components[i]);
            }
            scene.destroyGameObject(thisObj);
        };
        /**
         * Get the first component of a specified type. Internally uses instanceof.<br>
         * Example usage:<br>
         * @example
         *     var meshRenderer = someGameObject.getComponentOfType(kick.scene.MeshRenderer);
         *     var material = meshRenderer.material;
         * @method getComponentOfType
         * @param {Object} type the constructor of the wanted component
         * @return {Object} component of specified type or null
         */
        this.getComponentOfType = function (type) {
            var component,
                i;
            for (i = _components.length - 1; i >= 0; i--) {
                component = _components[i];
                if (component instanceof type) {
                    return component;
                }
            }
            return null;
        };

        /**
         * Get all component of a specified type. Internally uses instanceof.<br>
         * Example usage:<br>
         * @example
         *     var meshRenderer = someGameObject.getComponentsOfType(kick.scene.MeshRenderer);
         *     if (meshRenderer.length > 0){
         *         material = meshRenderer[0].material;
         *     }
         * @method getComponentsOfType
         * @param {Object} type the constructor of the wanted component
         * @return {Array} arrays of components of specified type
         */
        this.getComponentsOfType = function (type) {
            var component,
                i,
                res = [];
            for (i = _components.length - 1; i >= 0; i--) {
                component = _components[i];
                if (component instanceof type) {
                    res.push(component);
                }
            }
            return res;
        };

        /**
         * Get the first component with a specific method.<br>
         * Example usage:<br>
         * @example
         *     var renderer = someGameObject.getComponentsWithMethod("render");
         * @method getComponentsWithMethod
         * @param {String} methodName of the method
         * @return {Object|null} component of with a method with a specific method name
         */
        this.getComponentsWithMethod = function (methodName) {
            var component,
                i;
            for (i = _components.length - 1; i >= 0; i--) {
                component = _components[i];
                if (typeof (component[methodName]) === "function") {
                    return component;
                }
            }
            return null;
        };

        /**
         * Get all components with a specific method. <br>
         * Example usage:<br>
         * @example
         *     var renderers = someGameObject.getComponentsWithMethod("render");
         *     for (var i = 0; i < renderers.length; i++){
         *         renderers[i].render(obj);
         *     }
         * @method getComponentsWithMethod
         * @param {Object} methodName the constructor of the wanted component
         * @return {Array} arrays of components of specified type
         */
        this.getComponentsWithMethod = function (methodName) {
            var component,
                i,
                res = [];
            for (i = _components.length - 1; i >= 0; i--) {
                component = _components[i];
                if (typeof (component[methodName]) === "function") {
                    res.push(component);
                }
            }
            return res;
        };

        /**
         * @method toJSON
         * @return JSON object
         */
        this.toJSON = function () {
            var componentsJSON = [],
                component,
                i,
                componentJSON;
            for (i = 0; i < _components.length; i++) {
                component = _components[i];
                if (!component.toJSON) {
                    componentsJSON.push(Util.componentToJSON(component));
                } else {
                    componentJSON = component.toJSON();
                    if (componentJSON) {
                        componentsJSON.push(componentJSON);
                    }
                }
            }
            return {
                name: _name,
                layer: _layer,
                uid: _uid,
                components: componentsJSON
            };
        };

        (function init() {
            thisObj.addComponent(new Transform(thisObj));
            Util.applyConfig(thisObj, config, ["uid"]);
        }());
    };
});