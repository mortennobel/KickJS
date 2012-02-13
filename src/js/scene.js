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

    var scene = KICK.namespace("KICK.scene"),
        core = KICK.namespace("KICK.core"),
        math = KICK.namespace("KICK.math"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat4 = KICK.namespace("KICK.math.mat4"),
        constants = KICK.core.Constants,
        DEBUG = constants._DEBUG,
        ASSERT = constants._ASSERT,
        fail = KICK.core.Util.fail,
        applyConfig = KICK.core.Util.applyConfig,
        insertSorted = KICK.core.Util.insertSorted,
        vec4uint8ToUint32 = KICK.core.Util.vec4uint8ToUint32;

    /**
     * Game objects. (Always attached to a given scene).
     * This constructor should not be called directly - Scene.createGameObject() should be used instead.
     * @class GameObject
     * @namespace KICK.scene
     * @constructor
     * @param {KICK.scene.Scene} scene
     * @param {Object} config configuration for gameObject (components will not be initialized)
     */
    scene.GameObject = function (scene, config) {
        var _transform = new KICK.scene.Transform(this),
            _components = [_transform],
            _layer = 1,
            _name,
            _uid = scene.engine.createUID(),
            thisObj = this;
        Object.defineProperties(this,
            {
                /**
                 * Reference to the containing scene
                 * @property scene
                 * @type KICK.scene.Scene
                 */
                scene:{
                    value:scene
                },
                /**
                 * Reference to the engine
                 * @property engine
                 * @type KICK.core.Engine
                 */
                engine:{
                    value:scene.engine
                },
                /**
                 * Reference to the transform
                 * @property transform
                 * @type KICK.scene.Transform
                 */
                transform:{
                    value:_transform
                },
                /**
                 * Layer bit flag. The default value is 1.
                 * The layer should have a value of 2^n
                 * @property layer
                 * @type Number
                 */
                layer:{
                    get:function(){
                        return _layer;
                    },
                    set:function(newValue){
                        if (typeof newValue !== 'number'){
                            KICK.core.Util.fail("GameObject.layer must be a Number")
                        }
                        _layer = newValue;
                    }
                },
                /**
                 * @property name
                 * @type String
                 */
                name:{
                    get:function(){
                        return _name;
                    },
                    set:function(newValue){
                        _name = newValue;
                    }
                },
                /**
                 * Unique id - identifies a game object (within a scene).
                 * @property uid
                 * @type Number
                 */
                uid:{
                    get:function(){
                        return _uid;
                    },
                    set:function(newValue){
                        _uid = newValue;
                    }
                },
                /**
                 * Number of components
                 * @property numberOfComponents
                 * @type Number
                 */
                numberOfComponents:{
                    get:function(){
                        return _components.length;
                    }
                },
                /**
                 * @property destroyed
                 * @type Boolean
                 */
                destroyed:{
                    get:function(){
                        return _components.length==0;
                    }
                }
            }
        );

        /**
         * Get component by index.
         * @method getComponent
         * @param {Number} index
         * @return {KICK.scene.Component}
         */
        this.getComponent = function(index){
            return _components[index];
        };

        /**
         * Add the component to a gameObject and set the gameObject field on the component
         * @method addComponent
         * @param {KICK.scene.Component} component
         */
        this.addComponent = function (component) {
            if (component instanceof KICK.scene.Transform){
                if (ASSERT){
                    KICK.core.Util.fail("Cannot add another Transform to a GameObject");
                }
                return;
            }
            if (component.gameObject) {
                throw {
                    name: "Error",
                    message: "Component "+component+" already added to gameObject "+component.gameObject
                };
            }
            if (!component.scriptPriority) {
                component.scriptPriority = 0;
            }
            component.gameObject = this;
            _components.push(component);
            this.scene.addComponent(component);
        };

        /**
         * Remove the component from a gameObject and clear the gameObject field on the component
         * @method removeComponent
         * @param {KICK.scene.Component} component
         */
        this.removeComponent =  function (component) {
            try {
                delete component.gameObject;
            } catch (e){
                // ignore if gameObject cannot be deleted
            }
            core.Util.removeElementFromArray(_components,component);
            this.scene.removeComponent(component);
        };

        /**
         * Destroys game object after next frame.
         * Removes all components instantly.
         * This method will call destroyObject on the associated scene.
         * @method destroy
         */
        this.destroy = function () {
            var i;
            for (i = _components.length-1; i >= 0 ; i--) {
                this.removeComponent(_components[i]);
            }
            this.scene.destroyObject(thisObj);
        };
        /**
         * Get the first component of a specified type. Internally uses instanceof.<br>
         * Example usage:<br>
         * <pre class="brush: js">
         * var meshRenderer = someGameObject.getComponentOfType(KICK.scene.MeshRenderer);
         * var material = meshRenderer.material;
         * </pre>
         * @method getComponentOfType
         * @param {Object} type the constructor of the wanted component
         * @return {Object} component of specified type or null
         */
        this.getComponentOfType = function (type) {
            var component,
                i;
            for (i=_components.length-1;i>=0;i--){
                component = _components[i];
                if (component instanceof type){
                    return component;
                }
            }
            return null;
        };

        /**
         * Get all component of a specified type. Internally uses instanceof.<br>
         * Example usage:<br>
         * <pre class="brush: js">
         * var meshRenderer = someGameObject.getComponentsOfType(KICK.scene.MeshRenderer);
         * if (meshRenderer.length > 0){
         * material = meshRenderer[0].material;
         * }
         * </pre>
         * @method getComponentsOfType
         * @param {Object} type the constructor of the wanted component
         * @return {Array[Object]} arrays of components of specified type
         */
        this.getComponentsOfType = function (type) {
            var component,
                i,
                res = [];
            for (i=_components.length-1;i>=0;i--){
                component = _components[i];
                if (component instanceof type){
                    res.push(component);
                }
            }
            return res;
        };

        /**
         * @method toJSON
         * @return JSON object
         */
        this.toJSON = function(){
            var componentsJSON = [],
                component;
            for (var i=0;i<_components.length;i++){
                component = _components[i];
                if (!component.toJSON){
                    componentsJSON.push(KICK.core.Util.componentToJSON(scene.engine,component));
                } else {
                    var componentJSON = component.toJSON();
                    if (componentJSON){
                        componentsJSON.push(componentJSON);
                    }
                }

            }
            return {
                name: _name,
                layer: _layer,
                uid:_uid,
                components:componentsJSON
            };
        };

        (function init(){
            applyConfig(thisObj,config,["uid"]);
        })();
    };

    /**
     * This class only specifies the interface of a component.
     * @namespace KICK.scene
     * @class Component
     */

    /**
     * The gameObject owning the component. Initially undefined. The value is set when the Component object is added
     * to a GameObject
     * @property gameObject
     * @type KICK.scene.GameObject
     */

    /**
     * Abstract method called when a component is added to scene. May be undefined. <br>
     * This method method works in many cases like a constructor function, where references to other game objects can
     * be looked up (this cannot be done when the actual constructor function is called, since the scene may not be
     * loaded completely).
     * @method activated
     */

    /**
     * Abstract method called when a component is removed from scene. May be undefined.
     * @method deactivated
     */


    /**
     * Abstract method called every at every rendering of the object. May be undefined.
     * @method render
     * @param (KICK.math.mat4) projectionMatrix
     * @param {KICK.math.mat4} modelViewMatrix
     * @param {KICK.math.mat4} modelViewProjectionMatrix modelviewMatrix multiplied with projectionMatrix
     */

    /**
     * Components with largest priority are invoked first. (optional - default 0). Cannot be modified after creation.
     * @property scriptPriority
     * @type Number
     */

    /**
     * Default value is 1000<br>
     * &lt; 2000 default geometry<br>
     * 2000 - 2999 transparent geometry (sorted back-to-front when rendered)<br>
     * &gt; 3000 overlay geometry rendered on top
     * @property renderOrder
     * @type Number
     */

    /**
     * Abstract method called every update. May be undefined.
     * @method update
     */

    /**
     * Creates a JSON version of the configuration of the class. May be undefined, if so the
     * KICK.core.Util.componentToJSON() are used for serializaing of the component.<br>
     * Note that references to assets, gameObjects or other components should be wrapped by the KICK.core.Util.getJSONReference() method
     * @method toJSON
     * @return {Object}
     */


    /**
     * Position, rotation and scale of a game object. This component should not be created manually.
     * It is created when a GameObject is created.
     * @namespace KICK.scene
     * @class Transform
     * @extends KICK.scene.Component
     */
    scene.Transform = function (gameObject) {
        var localMatrix = mat4.identity(mat4.create()),
            globalMatrix = mat4.identity(mat4.create()),
            localMatrixInverse = mat4.identity(mat4.create()),
            globalMatrixInverse = mat4.identity(mat4.create()),
            globalPosition = vec3.create([0,0,0]),
            localPosition = vec3.create([0,0,0]),
            globalRotationQuat = quat4.create([0,0,0,1]),
            localRotationQuat = quat4.create([0,0,0,1]),
            localScale = vec3.create([1,1,1]),
            // the dirty parameter let the
            LOCAL = 0,
            LOCAL_INV = 1,
            GLOBAL = 2,
            GLOBAL_INV = 3,
            GLOBAL_POSITION = 4,
            GLOBAL_ROTATION = 5,
            dirty = new Int8Array(6), // local,localInverse,global,globalInverse
            children = [],
            parentTransform = null,
            thisObj = this,
            markGlobalDirty = function () {
                var i;
                dirty[GLOBAL] = 1;
                dirty[GLOBAL_INV] = 1;
                dirty[GLOBAL_POSITION] = 1;
                dirty[GLOBAL_ROTATION] = 1;
                for (i=children.length-1;i>=0;i--) {
                    children[i]._markGlobalDirty();
                }
            },
            markLocalDirty = function(){
                dirty[LOCAL] = 1;
                dirty[LOCAL_INV] = 1;
                markGlobalDirty();
            };

        Object.defineProperties(this,{
            // inherit description from GameObject
            gameObject:{
                value: gameObject
            },
            /**
             * Global position.
             * @property position
             * @type KICK.math.vec3
             */
            position:{
                get: function(){
                    // if no parent - use local position
                    if (parentTransform==null){
                        return vec3.create(localPosition);
                    }
                    if (dirty[GLOBAL_POSITION]){
                        mat4.multiplyVec3(this.getGlobalMatrix(),[0,0,0],globalPosition);
                        dirty[GLOBAL_POSITION] = 0;
                    }
                    return vec3.create(globalPosition);
                },
                set:function(newValue){
                    var currentPosition;
                    if (parentTransform==null){
                        this.localPosition = newValue;
                        return;
                    }
                    currentPosition = this.position;
                    vec3.set(newValue,localPosition);
                    this.localPosition = [
                        localPosition[0]+currentPosition[0]-newValue[0],
                        localPosition[1]+currentPosition[1]-newValue[1],
                        localPosition[2]+currentPosition[2]-newValue[2]
                    ];
                }
            },
            /**
             * Local position.
             * @property localPosition
             * @type KICK.math.vec3
             */
            localPosition:{
                get: function(){
                    return vec3.create(localPosition);
                },
                set: function(newValue){
                    vec3.set(newValue,localPosition);
                    markLocalDirty();
                }
            },
            /**
             * Local rotation in euler angles.
             * @property localRotationEuler
             * @type KICK.math.vec3
             */
            localRotationEuler: {
                get: function(){
                    var vec = vec3.create();
                    quat4.toEuler(localRotationQuat,vec);
                    return vec;
                },
                set: function(newValue){
                    quat4.setEuler(newValue,localRotationQuat);
                    markLocalDirty();
                }
            },
            /**
             * Global rotation in euler angles.
             * @property rotationEuler
             * @type KICK.math.vec3
             */
            rotationEuler: {
                get: function(){
                    var vec = vec3.create();
                    quat4.toEuler(this.rotation,vec);
                    return vec;
                },
                set: function(newValue){
                    var tmp = quat4.create();
                    quat4.setEuler(newValue,tmp);
                    this.rotation = tmp;
                }
            },

            /**
             * Global rotation in quaternion.
             * @property rotation
             * @type KICK.math.quat4
             */
            rotation:{
                get: function(){
                    var parentIterator = null;
                    if (parentTransform==null){
                        return quat4.create(localRotationQuat);
                    }
                    if (dirty[GLOBAL_ROTATION]){
                        quat4.set(localRotationQuat,globalRotationQuat);
                        parentIterator = this.parent;
                        while (parentIterator != null){
                            quat4.multiply(parentIterator.localRotation,globalRotationQuat,globalRotationQuat);
                            parentIterator = parentIterator.parent;
                        }
                        dirty[GLOBAL_ROTATION] = false;
                    }
                    return globalRotationQuat;
                },
                set: function(newValue){
                    if (parentTransform==null){
                        this.localRotation = newValue;
                        return;
                    }
                    var rotationDifference = quat4.create();
                    quat4.difference(newValue,this.rotation,rotationDifference);
                    this.localRotation = quat4.multiply(localRotationQuat,rotationDifference);
                }
            },
            /**
             * Local rotation in quaternion.
             * @property localRotation
             * @type KICK.math.quat4
             */
            localRotation: {
                get: function(){
                    return localRotationQuat;
                },
                set: function(newValue){
                    quat4.set(newValue,localRotationQuat);
                    markLocalDirty();
                }
            },
            /**
             * Local scale.
             * Any zero value will be replaced with an epsilon value.
             * @property localScale
             * @type KICK.math.vec3
             */
            localScale: {
                get: function(){
                    return vec3.create(localScale);
                },
                set: function(newValue){
                    vec3.set(newValue,localScale);
                    // replace 0 value with epsilon to prevent a singular matrix
                    for (var i=0;i<localScale.length;i++){
                        if (localScale[i] === 0){
                            localScale[i] = KICK.core.Constants._EPSILON;
                        }
                    }
                    markLocalDirty();
                }
            },
            /**
             * Array of children. The children should not be modified directly. Instead use the parent property
             * @property children
             * @type Array[KICK.scene.Transform]
             */
            children:{
                value: children
            },
            /**
             * Parent transform. Initial null.
             * @property parent
             * @type KICK.scene.Transform
             */
            parent:{
                get: function(){
                    return parentTransform;
                },
                set: function(newParent){
                    if (newParent === this) {
                        KICK.core.Util.fail('Cannot assign parent to self');
                    }
                    if (newParent !== parentTransform){
                        if (newParent === null){
                            parentTransform = null;
                            core.Util.removeElementFromArray(newParent.children,this);
                        } else {
                            parentTransform = newParent;
                            newParent.children.push(this);
                        }
                        markGlobalDirty();
                    }
                }
            }
        });

        /**
         * Return the local transformation matrix
         * @method getLocalMatrix
         * @return {KICK.math.mat4} local transformation
         */
        this.getLocalMatrix = function () {
            if (dirty[LOCAL]) {
                mat4.setTRS(localPosition,localRotationQuat,localScale,localMatrix);
                dirty[LOCAL] = 0;
            }
            return localMatrix;
        };

        /**
         * Return the local inverse of translate rotate scale
         * @method getLocalTRSInverse
         * @return {KICK.math.mat4} inverse of local transformation
         */
        this.getLocalTRSInverse = function () {
            if (dirty[LOCAL_INV]) {
                mat4.setTRSInverse(localPosition,localRotationQuat,localScale,localMatrixInverse);
                dirty[LOCAL_INV] = 0;
            }
            return localMatrixInverse;
        };

        /**
         * @method getGlobalMatrix
         * @return {KICK.math.mat4} global transform
         */
        this.getGlobalMatrix = function () {
            if (dirty[GLOBAL]) {
                mat4.set(thisObj.getLocalMatrix(), globalMatrix);

                var transformIterator = thisObj.parent;
                while (transformIterator !== null) {
                    mat4.multiply(transformIterator.getLocalMatrix(),globalMatrix,globalMatrix);
                    transformIterator  = transformIterator.parent;
                }
                dirty[GLOBAL] = 0;
            }
            return globalMatrix;
        };

        /**
         * Return the inverse of global rotate translate transform
         * @method getGlobalTRSInverse
         * @return {KICK.math.mat4} inverse global transform
         */
        this.getGlobalTRSInverse = function () {
            if (dirty[GLOBAL_INV]) {
                mat4.set(thisObj.getLocalTRSInverse(), globalMatrixInverse);
                var transformIterator = thisObj.parent;
                while (transformIterator !== null) {
                    mat4.multiply(globalMatrixInverse,transformIterator.getLocalTRSInverse(),globalMatrixInverse);
                    transformIterator  = transformIterator.parent;
                }
                dirty[GLOBAL_INV] = 0;
            }
            return globalMatrixInverse;
        };

        /**
         * Mark the global transform updated.
         * This will mark the transform updated (meaning the global transform must be recomputed based on
         * translation, rotation, scale)
         * @method markGlobalDirty
         * @private
         */
        this._markGlobalDirty = markGlobalDirty;

        /**
         * @method toJSON
         * @return {Object} JSON formatted object
         */
        this.toJSON = function(){
            var typedArrayToArray = KICK.core.Util.typedArrayToArray;
            return {
                type:"KICK.scene.Transform",
                uid: gameObject.engine.getUID(thisObj),
                config:{
                    localPosition: typedArrayToArray(localPosition),
                    localRotation: typedArrayToArray(localRotationQuat),
                    localScale: typedArrayToArray(localScale),
                    parent: parentTransform ? KICK.core.Util.getJSONReference(parentTransform): null // todo
                }
            };
        };

        /**
         * @method
         */
        this.str = function(){
            return JSON.stringify(thisObj.toJSON());
        };
    };

    /**
     * A scene objects contains a list of GameObjects
     * @class Scene
     * @namespace KICK.scene
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @extends KICK.core.ProjectAsset
     */
    scene.Scene = function (engine, config) {
        var objectsById = {},
            gameObjects = [],
            activeGameObjects = [],
            gameObjectsNew = [],
            gameObjectsDelete = [],
            updateableComponents= [],
            componentsNew = [],
            componentsDelete = [],
            componentListenes = [],
            componentsAll = [],
            cameras = [],
            renderableComponents = [],
            sceneLightObj = new KICK.scene.SceneLights(engine.config.maxNumerOfLights),
            _name = "Scene",
            _uid = 0,
            gl,
            i,
            thisObj = this,
            addLight = function(light){
                if (light.type == core.Constants._LIGHT_TYPE_AMBIENT){
                    sceneLightObj.ambientLight = light;
                } else if (light.type === core.Constants._LIGHT_TYPE_DIRECTIONAL){
                    sceneLightObj.directionalLight = light;
                } else {
                    sceneLightObj.addPointLight(light);
                }
            },
            removeLight = function(light){
                if (light.type == core.Constants._LIGHT_TYPE_AMBIENT){
                    sceneLightObj.ambientLight = null;
                } else if (light.type === core.Constants._LIGHT_TYPE_DIRECTIONAL){
                    sceneLightObj.directionalLight = null;
                } else {
                    sceneLightObj.removePointLight(light);
                }
            },
            /**
             * Compares two objects based on scriptPriority
             * @method sortByScriptPriority
             * @param {KICK.scene.Component} a
             * @param {KICK.scene.Component} b
             * @return {Number} order of a,b
             * @private
             */
            sortByScriptPriority = function (a,b) {
                return a.scriptPriority-b.scriptPriority;
            },
            /**
             * Compares two camera objects by their cameraIndex attribute
             * @method cameraSortFunc
             * @param {KICK.scene.Camera} a
             * @param {KICK.scene.Camera} b
             * @param {Number} difference
             * @private
             */
            cameraSortFunc = function(a,b){
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
                    component;
                if (gameObjectsNew.length > 0) {
                    activeGameObjects = activeGameObjects.concat(gameObjectsNew);
                    gameObjectsNew.length = 0;
                }
                if (componentsNew.length > 0) {
                    var componentsNewCopy = componentsNew;
                    componentsNew = [];
                    for (i = componentsNewCopy.length-1; i >= 0; i--) {
                        component = componentsNewCopy[i];
                        componentsAll.push(component);
                        if (typeof(component.activated) === "function") {
                            component.activated();
                        }
                        if (typeof(component.update) === "function") {
                            core.Util.insertSorted(component,updateableComponents,sortByScriptPriority);
                        }
                        if (typeof(component.render) === "function") {
                            renderableComponents.push(component);
                        }
                        if (typeof(component.render) === "function") {
                            core.Util.removeElementFromArray(renderableComponents,component);
                        }
                        if (component instanceof scene.Camera){
                            KICK.core.Util.insertSorted(component,cameras,cameraSortFunc);
                        } else if (component instanceof scene.Light){
                            addLight(component);
                        }
                    }
                    for (i=componentListenes.length-1; i >= 0; i--) {
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
                    component;
                if (gameObjectsDelete.length > 0) {
                    core.Util.removeElementsFromArray(activeGameObjects,gameObjectsDelete);
                    core.Util.removeElementsFromArray(gameObjects,gameObjectsDelete);
                    gameObjectsDelete.length = 0;
                }
                if (componentsDelete.length > 0) {
                    var componentsDeleteCopy = componentsDelete;
                    componentsDelete = [];
                    for (i = componentsDeleteCopy.length-1; i >= 0; i--) {
                        component = componentsDeleteCopy[i];
                        core.Util.removeElementFromArray(componentsAll,component);
                        if (typeof(component.deactivated) === "function") {
                            component.deactivated();
                        }
                        if (typeof(component.update) === "function") {
                            core.Util.removeElementFromArray(updateableComponents,component);
                        }
                        if (component instanceof scene.Camera){
                            core.Util.removeElementFromArray(cameras,component);
                        } else if (component instanceof scene.Light){
                            removeLight(component);
                        }
                    }
                    for (i=componentListenes.length-1; i >= 0; i--) {
                        componentListenes[i].componentsRemoved(componentsDeleteCopy);
                    }
                }
            },
            updateComponents = function(){
                cleanupGameObjects();
                addNewGameObjects();
                var i;
                for (i=updateableComponents.length-1; i >= 0; i--) {
                    updateableComponents[i].update();
                }
            },
            renderComponents = function(){
                var i;
                for (i=cameras.length-1; i >= 0; i--) {
                    cameras[i].renderScene(sceneLightObj);
                }
                engine.gl.flush();
            },
            createGameObjectPrivate = function(config){
                var gameObject = new scene.GameObject(thisObj,config);
                gameObjectsNew.push(gameObject);
                gameObjects.push(gameObject);
                objectsById[gameObject.uid] = gameObject;
                return gameObject;
            };

        /**
         * @method destroy
         */
        this.destroy = function(){
            engine.project.removeResourceDescriptor(thisObj.uid);
            if (thisObj === engine.activeScene){
                engine.activeScene = null;
            }
        };

        /**
         * Add a component listener to the scene. A component listener should contain two functions:
         * {componentsAdded(components) and componentsRemoved(components)}.
         * Throws an exception if the two required functions does not exist.
         * @method addComponentListener
         * @param {KICK.scene.ComponentChangedListener} componentListener
         */
        this.addComponentListener = function (componentListener) {
            if (!scene.ComponentChangedListener.isComponentListener(componentListener) ) {
                KICK.core.Util.fail("Component listener does not have the correct interface. " +
                        "It should contain the two functions: " +
                        "componentsAdded(components) and componentsRemoved(components)");
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
         * @return {Array[KICK.scene.Component]} components
         */
        this.findComponentsOfType = function(componentType){
            if (ASSERT){
                if (typeof componentType !== 'function'){
                    KICK.core.Util.fail("Scene.findComponentsOfType expects a function");
                }
            }
            var res = [];
            for (var i=gameObjects.length-1;i>=0;i--){
                var component = gameObjects[i].getComponentsOfType(componentType);
                for (var j=0;j<component.length;j++){
                    res.push(component[j]);
                }
            }
            return res;
        };

        /**
         * Removes a component change listener from the scene
         * @method removeComponentListener
         * @param {KICK.scene.ComponentChangedListener} componentListener
         */
        this.removeComponentListener = function (componentListener) {
            core.Util.removeElementFromArray(componentListenes,componentListener);
        };

        /**
         * Should only be called by GameObject when a component is added. If the component is updateable (implements
         * update method) the components is added to the current list of updateable components after the update loop
         * (so it will not recieve any update invocations in the current frame).
         * If the component is renderable (implements), is it added to the renderer's components
         * @method addComponent
         * @param {KICK.scene.Component} component
         * @protected
         */
        this.addComponent = function (component) {
            core.Util.insertSorted(component,componentsNew,sortByScriptPriority);
            var uid = engine.getUID(component);
            if (ASSERT){
                if (objectsById[uid]){
                    core.Util.fail("Component with uid "+uid+" already exist");
                }
            }
            objectsById[uid] = component;
        };

        /**
         * @method getObjectByUID
         * @param {Number} uid
         * @return {Object} GameObject or component
         */
        this.getObjectByUID = function(uid){
            return objectsById[uid];
        };

        /**
         * Returns a gameobject identified by name
         * @method getGameObjectByName
         * @param {String} name
         * @return {KICK.scene.GameObject} GameObject or undefined if not found
         */
        this.getGameObjectByName = function(name){
            for (var i=gameObjects.length-1;i>=0;i--){
                var gameObject = gameObjects[i];
                if (gameObject.name === name){
                    return gameObject;
                }
            }
        };


        /**
         * @method removeComponent
         * @param {KICK.scene} component
         */
        this.removeComponent = function (component) {
            core.Util.removeElementFromArray(componentsNew,component);
            componentsDelete.push(component);
            delete objectsById[component.uid];
        };

        Object.defineProperties(this,{
            /**
             * Reference to the engine
             * @property engine
             * @type KICK.core.Engine
             */
            engine:{
                value:engine
            },
            /**
             * Name of the scene
             * @property name
             * @type String
             */
            name:{
                get:function(){
                    return _name;
                },
                set:function(newValue){
                    _name = newValue;
                }

            },
            /**
             * @property uid
             * @type Number
             */
            uid:{
                get:function(){
                    return _uid;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (_uid){
                            fail("Reassigning uid")
                        }
                    }
                    _uid = newValue;
                }
            }
        });

        /**
         * @method createGameObject
         * @param {Object} config Optionally configuration passed to the game objects
         * @return {KICK.scene.GameObject}
         */
        this.createGameObject = function (config) {
            var gameObject = createGameObjectPrivate(config),
                transform = gameObject.transform;
            objectsById[transform.uid] = transform;
            return gameObject;
        };

        /**
         * Destroys the game object and delete it from the scene.
         * This call will call destroy on the gameObject
         * @method destroyObject
         * @param {KICK.scene.GameObject} gameObject
         */
        this.destroyObject = function (gameObject) {
            var isMarkedForDeletion = core.Util.contains(gameObjectsDelete, gameObject);
            if (!isMarkedForDeletion){
                gameObjectsDelete.push(gameObject);
                delete objectsById[gameObject.uid];
            }
            if (!gameObject.destroyed){
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
         * @return {KICK.scene.GameObject}
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
        this.toJSON = function (filterFn){
            var gameObjectsCopy = [];
            filterFn = filterFn || function(){return true;}
            for (var i=0;i<gameObjects.length;i++){
                var gameObject = gameObjects[i];
                if (filterFn(gameObject)){
                    gameObjectsCopy.push(gameObject.toJSON());
                }
            }
            return {
                uid: thisObj.uid,
                gameObjects: gameObjectsCopy,
                name: _name
            };
        };

        (function init(){

            var gameObject,
                hasProperty = KICK.core.Util.hasProperty,
                applyConfig = KICK.core.Util.applyConfig;
            if (config){
                _uid = config.uid;
                _name = config.name || "Scene";
                var gameObjects = config.gameObjects;
                var mappingUidToObject = {};
                var configs = {};
                // create game objects
                (function createGameObjects(){
                    for (var i=0;i<gameObjects.length;i++){
                        gameObject = config.gameObjects[i];
                        gameObject.newObject = createGameObjectPrivate(gameObject);
                        mappingUidToObject[gameObject.uid] = gameObject.newObject;
                    }
                })();

                var createConfigWithReferences = function (config){
                    // deserialize an object (recursively if the object is an array
                    var deserialize = function(value){
                        if (typeof value === 'number'){
                            return value;
                        }
                        if (Array.isArray(value)){
                            for (var i=0;i<value.length;i++){
                                value[i] = deserialize(value[i]);
                            }
                        } else if (value){
                            if (value && value.ref && value.reftype){
                                if (value.reftype === "project"){
                                    value = engine.project.load(value.ref);
                                } else if (value.reftype === "gameobject" || value.reftype === "component"){
                                    value = thisObj.getObjectByUID(value.ref);
                                }
                            }
                        }
                        return value;
                    };

                    var configCopy = {};
                    for (var name in config){
                        if (hasProperty(config,name)){
                            var value = config[name];
                            value = deserialize(value);
                            configCopy[name] = value;
                        }
                    }
                    return configCopy;
                };

                (function createComponents(){
                    var component,
                        componentObj,
                        type,
                        gameObjectConfig;
                    var gameObjects = config.gameObjects;

                    for (var j=0;j<gameObjects.length;j++){
                        gameObjectConfig = config.gameObjects[j];
                        gameObject = gameObjectConfig.newObject;
                        // build components
                        for (var i=0;gameObjectConfig.components && i<gameObjectConfig.components.length;i++){
                            component = gameObjectConfig.components[i];
                            if (component.type === "KICK.scene.Transform"){
                                componentObj = gameObject.transform;
                                componentObj.uid = component.uid;
                                // register transform object to objectsById
                                objectsById[componentObj.uid] = componentObj;
                            } else {
                                type = KICK.namespace(component.type);
                                if (typeof type === 'function'){
                                    componentObj = new type({uid:component.uid});
                                    componentObj.uid = component.uid;
                                    gameObject.addComponent(componentObj);
                                } else {
                                    KICK.core.Util.warn("Cannot find Class "+component.type);
                                    continue;
                                }
                            }
                            mappingUidToObject[component.uid] = componentObj;
                            configs[component.uid] = component.config;
                        }
                    }

                    // apply config
                    for (var uid in mappingUidToObject){
                        if (hasProperty(mappingUidToObject,uid)){
                            var originalConf = configs[uid];
                            if (originalConf){
                                var conf = createConfigWithReferences(originalConf);
                                var obj = mappingUidToObject[uid];
                                applyConfig(obj,conf);
                            }
                        }
                    }
                })();
            }
            engine.project.registerObject(thisObj, "KICK.scene.Scene");
        })();
    };

    /**
     * Create empty scene with camera
     * @method createDefault
     * @param {KICK.core.Engine} engine
     * @static
     */
    scene.Scene.createDefault = function(engine){
        var newScene = new scene.Scene(engine);
        var gameObject = newScene.createGameObject();
        gameObject.addComponent(new scene.Camera());
        return newScene;
    };

    /**
     * Creates a game camera
     * @class Camera
     * @namespace KICK.scene
     * @extends KICK.scene.Component
     * @constructor
     * @param {Config} configuration with same properties as the Camera
     */
    scene.Camera = function (config) {
        var gl,
            thisObj = this,
            transform,
            engine,
            _enabled = true,
            c = KICK.core.Constants,
            _renderShadow = false,
            _renderTarget = null,
            _fieldOfView = 60,
            _near = 0.1,
            _far = 1000,
            _left = -1,
            _right = 1,
            _bottom = -1,
            _top = 1,
            _clearColor = [0,0,0,1],
            _perspective = true,
            _clearFlagColor = true,
            _clearFlagDepth = true,
            _currentClearFlags,
            _cameraIndex = 1,
            _layerMask = 0xffffffff,
            _renderer = new KICK.renderer.ForwardRenderer(),
            _shadowmapShader,
            _scene,
            pickingQueue = null,
            pickingShader = null,
            pickingRenderTarget = null,
            pickingClearColor = vec4.create(),
            projectionMatrix = mat4.create(),
            viewMatrix = mat4.create(),
            viewProjectionMatrix = mat4.create(),
            lightViewProjectionMatrix = mat4.create(),
            engineUniforms = {
                    viewMatrix: viewMatrix,
                    projectionMatrix: projectionMatrix,
                    viewProjectionMatrix:viewProjectionMatrix,
                    lightViewProjectionMatrix:lightViewProjectionMatrix
                },
            renderableComponentsBackGroundAndGeometry = [],
            renderableComponentsTransparent = [],
            renderableComponentsOverlay = [],
            renderableComponentsArray = [renderableComponentsBackGroundAndGeometry,renderableComponentsTransparent,renderableComponentsOverlay],
            _normalizedViewportRect = vec4.create([0,0,1,1]),
            isNumber = function (o) {
                return typeof (o) === "number";
            },
            isBoolean = function(o){
                return typeof (o) === "boolean";
            },
            computeClearFlag = function(){
                _currentClearFlags = (_clearFlagColor ? c.GL_COLOR_BUFFER_BIT : 0) | (_clearFlagDepth ? c.GL_DEPTH_BUFFER_BIT : 0);
            },
            setupClearColor = function (color) {
                if (gl.currentClearColor !== color) {
                    gl.currentClearColor = color;
                    gl.clearColor(color[0], color[1], color[2], color[3]);
                }
            },
            assertNumber = function(newValue,name){
                if (!isNumber(newValue)){
                    KICK.core.Util.fail("Camera."+name+" must be number");
                }
            },
            setupViewport = function(offsetX,offsetY,width,height){
                gl.viewport(offsetX,offsetY,width,height);
                gl.scissor(offsetX,offsetY,width,height);
            },
            /**
             * Clear the screen and set the projectionMatrix and modelViewMatrix on the gl object
             * @method setupCamera
             * @private
             */
            setupCamera = function () {
                var viewportDimension = _renderTarget?_renderTarget.dimension:gl.viewportSize,
                    viewPortWidth = viewportDimension[0],
                    viewPortHeight = viewportDimension[1],
                    offsetX = viewPortWidth*_normalizedViewportRect[0],
                    offsetY = viewPortWidth*_normalizedViewportRect[1],
                    width = viewPortWidth*_normalizedViewportRect[2],
                    height = viewPortHeight*_normalizedViewportRect[3];
                setupViewport(offsetX,offsetY,width,height);
                
                // setup render target
                if (gl.renderTarget !== _renderTarget){
                    if (_renderTarget){
                        _renderTarget.bind();
                    } else {
                        gl.bindFramebuffer(constants.GL_FRAMEBUFFER, null);
                    }
                    gl.renderTarget = _renderTarget;
                }

                setupClearColor(_clearColor);
                gl.clear(_currentClearFlags);

                if (_perspective) {
                    mat4.perspective(_fieldOfView, gl.viewportSize[0] / gl.viewportSize[1],
                        _near, _far, projectionMatrix);
                } else {
                    mat4.ortho(_left, _right, _bottom, _top,
                        _near, _far, projectionMatrix);
                }

                var globalMatrixInv = transform.getGlobalTRSInverse();
                mat4.set(globalMatrixInv, viewMatrix);

                mat4.multiply(projectionMatrix,viewMatrix,viewProjectionMatrix);
            },
            /**
             * Compare two objects based on renderOrder value and then material.shader.uid (if exist)
             * @method compareRenderOrder
             * @param {Component}
             * @param {Component}
             * @return Number
             * @private
             */
            compareRenderOrder = function(a,b){
                var aRenderOrder = a.renderOrder || 1000,
                    bRenderOrder = b.renderOrder || 1000;
                var getMeshShaderUid = function(o, defaultValue){
                    var names = ["material","shader","uid"];
                    for (var i=0;i<names.length;i++){
                        o = o[names[i]];
                        if (!o){
                            return defaultValue;
                        }
                    }
                    return o;
                }
                if (aRenderOrder == bRenderOrder && a.material && b.material){
                    aRenderOrder = getMeshShaderUid(a,aRenderOrder);
                    bRenderOrder = getMeshShaderUid(a,aRenderOrder);
                }
                return aRenderOrder-bRenderOrder;
            },
            sortTransparentBackToFront = function(){
                // calculate distances
                var temp = vec3.create();
                var cameraPosition = transform.position;
                for (var i=renderableComponentsTransparent.length-1;i>=0;i--){
                    var object = renderableComponentsTransparent[i];
                    var objectPosition = object.gameObject.transform.position;
                    object.distanceToCamera = vec3.lengthSqr(vec3.subtract(objectPosition, cameraPosition, temp));
                }
                function compareDistanceToCamera(a,b){
                    return b.distanceToCamera-a.distanceToCamera;
                }
                renderableComponentsTransparent.sort(compareDistanceToCamera);
            },
            /**
             * @method renderSceneObjects
             * @param sceneLightObj
             * @param shader
             * @private
             */
            renderSceneObjects = function(sceneLightObj,shader){
                engineUniforms.sceneLights=sceneLightObj;
                _renderer.render(renderableComponentsBackGroundAndGeometry,engineUniforms,shader);
                _renderer.render(renderableComponentsTransparent,engineUniforms,shader);
                _renderer.render(renderableComponentsOverlay,engineUniforms,shader);
            },
            renderShadowMap = function(sceneLightObj){
                var directionalLight = sceneLightObj.directionalLight,
                    directionalLightTransform = directionalLight.gameObject.transform,
                    shadowRenderTexture = directionalLight.shadowRenderTexture,
                    renderTextureDimension = shadowRenderTexture.dimension,
                    renderTextureWidth = renderTextureDimension[0],
                    renderTextureHeight = renderTextureDimension[1];
                setupViewport(0,0,renderTextureWidth,renderTextureHeight);

                shadowRenderTexture.bind();
                setupClearColor([0,0,0,0]);
                gl.clear(c.GL_COLOR_BUFFER_BIT | c.GL_DEPTH_BUFFER_BIT);

                mat4.ortho(-5, 5, -5, 5, // todo replace with fitting
                    -10, 10, projectionMatrix);

                var globalMatrixInv = directionalLightTransform.getGlobalTRSInverse(); // // todo replace with fitting
                mat4.set(globalMatrixInv, viewMatrix);

                mat4.multiply(projectionMatrix,viewMatrix,viewProjectionMatrix);
                renderSceneObjects(sceneLightObj,_shadowmapShader);

                mat4.set(viewProjectionMatrix,lightViewProjectionMatrix);

                // debug
                directionalLight.shadowRenderTextureDebug.bind();
                gl.clear(c.GL_COLOR_BUFFER_BIT | c.GL_DEPTH_BUFFER_BIT);
                renderSceneObjects(sceneLightObj);
            };

        /**
         * Schedules a camera picking session. During next repaint a picking session is done. If the pick hits some
         * game objects, then a callback is added to the event queue (and will run in next frame).
         * @method pick
         * @param {function} gameObjectPickedFn callback function with the signature function(gameObject, hitCount)
         * @param {Number} x coordinate in screen coordinates (between 0 and canvas width - 1)
         * @param {Number} y coordinate in screen coordinates (between 0 and canvas height - 1)
         * @param {Number} width Optional (default 1)
         * @param {Number} height Optional (default 1)
         */
        this.pick = function(gameObjectPickedFn,x,y,width,height){
            width = width || 1;
            height = height || 1;
            if (!pickingQueue){
                pickingQueue = [];
                pickingShader = engine.project.load(engine.project.ENGINE_SHADER___PICK);
                pickingRenderTarget = new KICK.texture.RenderTexture(engine,{
                    dimension: gl.viewportSize
                });
                pickingRenderTarget.name = "__pickRenderTexture";
            }
            pickingQueue.push({
                gameObjectPickedFn:gameObjectPickedFn,
                x:x,
                y:gl.viewportSize[1]-y,
                width:width,
                height:height
            });
        };

        /**
         * Handles the camera setup (get fast reference to transform and glcontext).
         * Also register component listener on scene
         * @method activated
         */
        this.activated = function(){
            var gameObject = this.gameObject;
            engine = gameObject.engine;
            transform = gameObject.transform;
            gl = engine.gl;
            _scene = gameObject.scene;
            _scene.addComponentListener(thisObj);

            if (engine.config.shadows){
                _shadowmapShader = engine.project.load(engine.project.ENGINE_SHADER___SHADOWMAP);
            } else if (_renderShadow){
                _renderShadow = false; // disable render shadow
                if (ASSERT){
                    fail("engine.config.shadows must be enabled for shadows");
                }
            }

        };

        /**
         * Deregister component listener on scene
         * @method deactivated
         */
        this.deactivated = function(){
            _scene.removeComponentListener(thisObj);
        };

        /**
         * Add components that implements the render function and match the camera layerMask to cameras renderable components
         * @method componentsAdded
         * @param {Array[KICK.scene.Component]} components
         */
        this.componentsAdded = function( components ){
            for (var i=components.length-1; i>=0; i--) {
                var component = components[i];
                if (typeof(component.render) === "function" && (component.gameObject.layer & _layerMask)) {
                    var renderOrder = component.renderOrder || 1000;
                    var array;
                    if (renderOrder < 2000){
                        array = renderableComponentsBackGroundAndGeometry;
                    } else if (renderOrder >= 3000){
                        array = renderableComponentsOverlay;
                    } else {
                        array = renderableComponentsTransparent;
                    }
                    if (!KICK.core.Util.contains(array,component)){
                        insertSorted(component,array,compareRenderOrder);
                    }
                }
            }
        };

        /**
         * @method componentsRemoved
         * @param {Array[KICK.scene.Component]} components
         */
        this.componentsRemoved = function ( components ){
            for (var i=components.length-1; i>=0; i--) {
                var component = components[i];
                if (typeof(component.render) === "function") {
                    for (var j=renderableComponentsArray.length-1;j>=0;j--){
                        core.Util.removeElementFromArray(renderableComponentsArray[j],component);
                    }
                }
            }
        };

        /**
         * @method renderScene
         * @param {KICK.scene.SceneLights} sceneLightObj
         */
        this.renderScene = function(sceneLightObj){
            if (!_enabled){
                return;
            }
            if (_renderShadow && sceneLightObj.directionalLight && sceneLightObj.directionalLight.shadow){
                renderShadowMap(sceneLightObj);
            }
            setupCamera();

            sceneLightObj.recomputeLight(viewMatrix);
            if (renderableComponentsTransparent.length>0){
                sortTransparentBackToFront();
            }
            renderSceneObjects(sceneLightObj);

            if (_renderTarget && _renderTarget.colorTexture && _renderTarget.colorTexture.generateMipmaps ){
                var textureId = _renderTarget.colorTexture.textureId;
                gl.bindTexture(gl.TEXTURE_2D, textureId);
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            if (pickingQueue && pickingQueue.length>0){
                pickingRenderTarget.bind();
                setupClearColor(pickingClearColor);
                gl.clear(constants.GL_COLOR_BUFFER_BIT | constants.GL_DEPTH_BUFFER_BIT);
                renderSceneObjects(sceneLightObj,pickingShader);
                for (var i=pickingQueue.length-1;i>=0;i--){
                    // create clojure
                    (function(){
                        var pick = pickingQueue[i],
                            pickArrayLength = pick.width*pick.width*4,
                            array = new Uint8Array(pickArrayLength);
                        gl.readPixels( pick.x, pick.y, pick.width,pick.height, constants.GL_RGBA, constants.GL_UNSIGNED_BYTE,array);
                        var objects = [];
                        var objectCount = {};
                        for (var j = 0;j<pickArrayLength;j+=4){
                            var subArray = array.subarray(j,j+4),
                                uid = vec4uint8ToUint32(subArray);
                            if (uid>0){
                                if (objectCount[uid]){
                                    objectCount[uid]++;
                                } else {
                                    var foundObj = _scene.getObjectByUID(uid);
                                    if (foundObj){
                                        objects.push(foundObj);
                                        objectCount[uid] = 1;
                                    }
                                }
                            }
                        }
                        if (objects.length){
                            engine.eventQueue.add(function(){
                                for (var i=0;i<objects.length;i++){
                                    var obj = objects[i];
                                    pick.gameObjectPickedFn(obj, objectCount[obj.uid]);
                                }
                            },0);
                        }
                    })();
                }
                pickingQueue.length = 0;
            }
        };

        Object.defineProperties(this,{
            /**
             * Default is true
             * @property enabled
             * @type Boolean
             */
            enabled:{
                get:function(){ return _enabled;},
                set:function(newValue){ _enabled = newValue;}
            },
            /**
             * Default false
             * @property renderShadow
             * @type Boolean
             */
            renderShadow:{
                get:function(){return _renderShadow;},
                set:function(newValue){
                    if (engine){ // if object is initialized
                        if (engine.config.shadows){
                            _renderShadow = newValue;
                        } else if (newValue) {
                            if (ASSERT){
                                fail("engine.config.shadows must be enabled for shadows");
                            }
                        }
                    } else {
                        _renderShadow = newValue;
                    }
                }
            },
            /**
             * @property renderer
             * @type KICK.renderer.Renderer
             */
            renderer:{
                get:function(){ return _renderer;},
                set:function(newValue){
                    if (typeof newValue === "string"){
                        var constructor = KICK.namespace(newValue);
                        newValue = new constructor();
                    }
                    if (newValue && typeof newValue.render === "function"){
                        _renderer = newValue;
                    } else if (c._ASSERT){
                        KICK.core.Util.fail("Camera.renderer should be a KICK.renderer.Renderer (must implement render function)");
                    }
                }
            },
            /**
             * Camera renders only objects where the components layer exist in the layer mask. <br>
             * @property layerMask
             * @type Number
             */
            layerMask:{
                get:function(){ return _layerMask;},
                set:function(newValue){
                    if (c._ASSERT){
                        if (!isNumber(newValue)){
                            KICK.core.Util.fail("Camera.layerMask should be a number");
                        }
                    }
                    _layerMask = newValue;
                }
            },
            /**
             * Set the render target of the camera. Null means screen framebuffer.<br>
             * @property renderTarget
             * @type KICK.texture.RenderTexture
             */
            renderTarget:{
                get:function(){ return _renderTarget;},
                set:function(newValue){
                    if (c._ASSERT){
                        if (newValue != null && !(newValue instanceof KICK.texture.RenderTexture)){
                            KICK.core.Util.fail("Camera.renderTarget should be null or a KICK.texture.RenderTexture");
                        }
                    }
                    _renderTarget = newValue;
                }
            },
            /**
             * Set the field of view Y in degrees<br>
             * Only used when perspective camera type. Default 60.0.
             * Must be between 1 and 179
             * @property fieldOfView
             * @type Number
             */
            fieldOfView:{
                get:function(){ return _fieldOfView;},
                set:function(newValue){
                    if (c._ASSERT){
                        assertNumber(newValue,"fieldOfView");
                    }
                    _fieldOfView = Math.min(179,Math.max(newValue,1));
                }
            },
            /**
             * Set the near clipping plane of the view volume<br>
             * Used in both perspective and orthogonale camera.<br>
             * Default 0.1
             * @property near
             * @type Number
             */
            near:{
                get:function(){
                    return _near;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        assertNumber(newValue,"near");
                    }
                    _near = newValue;
                }
            },
            /**
             * Set the far clipping plane of the view volume<br>
             * Used in both perspective and orthogonale camera.<br>
             * Default 1000.0
             * @property far
             * @type Number
             */
            far:{
                get:function(){
                    return _far;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        assertNumber(newValue,"far");
                    }
                    _far = newValue;
                }
            },
            /**
             * True means camera is perspective projection, false means orthogonale projection<br>
             * Default true
             * @property perspective
             * @type Boolean
             */
            perspective:{
                get:function(){
                    return _perspective;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        if (!isBoolean(newValue)){
                            KICK.core.Util.fail("Camera.perspective must be a boolean");
                        }
                    }
                    _perspective = newValue;
                }
            },
            /**
             * Only used for orthogonal camera type (!cameraTypePerspective). Default -1
             * @property left
             * @type Number
             */
            left:{
                get:function(){
                    return _left;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        assertNumber(newValue,"left");
                    }
                    _left = newValue;
                }
            },
            /**
             * Only used for orthogonal camera type (!cameraTypePerspective). Default 1
             * @property left
             * @type Number
             */
            right:{
                get:function(){
                    return _right;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        assertNumber(newValue,"right");
                    }
                    _right= newValue;
                }
            },
            /**
             * Only used when orthogonal camera type (!cameraTypePerspective). Default -1
             * @property bottom
             * @type Number
             */
            bottom:{
                get:function(){
                    return _bottom;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        assertNumber(newValue,"bottom");
                    }
                    _bottom = newValue;
                }
            },
            /**
             * Only used when orthogonal camera type (!cameraTypePerspective). Default 1
             * @property top
             * @type Number
             */
            top:{
                get:function(){
                    return _top;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        assertNumber(newValue,"top");
                    }
                    _top = newValue;
                }
            },
            /**
             * The sorting order when multiple cameras exists in the scene.<br>
             * Cameras with lowest number is rendered first.
             * @property cameraIndex
             * @type Number
             */
            cameraIndex:{
                get:function(){
                    return _cameraIndex;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        assertNumber(newValue,"cameraIndex");
                    }
                    _cameraIndex = newValue;
                }
            },
            /**
             * Only used when orthogonal camera type (!cameraTypePerspective). Default [0,0,0,1]
             * @property clearColor
             * @type KICK.math.vec4
             */
            clearColor:{
                get:function(){
                    return vec4.create(_clearColor);
                },
                set:function(newValue){
                    _clearColor = vec4.create(newValue);
                }
            },
            /**
             * Indicates if the camera should clear color buffer.<br>
             * Default value is true
             * @property clearFlagColor
             * @type Boolean
             */
            clearFlagColor:{
                get:function(){
                    return _clearFlagColor;
                },
                set:function(newValue){
                    computeClearFlag();
                    _clearFlagColor = newValue;
                }
            },
            /**
             * Indicates if the camera should clear the depth buffer.<br>
             * Default is true.
             * @property clearFlagDepth
             * @type Boolean
             */
            clearFlagDepth:{
                get:function(){
                    return _clearFlagDepth;
                },
                set:function(newValue){
                    computeClearFlag();
                    _clearFlagDepth = newValue;
                }
            },
            /**
             * Normalized viewport rect [xOffset,yOffset,xWidth,yHeight]<br>
             * Default is [0,0,1,1]
             * @property normalizedViewportRect
             * @type Array[Number]
             */
            normalizedViewportRect:{
                get:function(){
                    return _normalizedViewportRect;
                },
                set:function(newValue){
                    if (c._ASSERT){
                        if (newValue.length !== 4){
                            KICK.core.Util.fail("Camera.normalizedViewportRect must be Float32Array of length 4");
                        }
                    }
                    vec4.set(newValue,_normalizedViewportRect);
                }
            }
        });

        this.toJSON = function(){
            return {
                type:"KICK.scene.Camera",
                uid: thisObj.uid || (engine?engine.getUID(thisObj):0),
                config:{
                    enabled: _enabled,
                    renderShadow: _renderShadow,
                    renderer:_renderer.name,
                    layerMask:_layerMask,
                    renderTarget:_renderTarget, // todo add reference
                    fieldOfView:_fieldOfView,
                    near:_near,
                    far:_far,
                    perspective:_perspective,
                    left:_left,
                    right:_right,
                    bottom:_bottom,
                    top:_top,
                    cameraIndex:_cameraIndex,
                    clearColor:_clearColor,
                    clearFlagColor:_clearFlagColor,
                    clearFlagDepth:_clearFlagDepth,
                    normalizedViewportRect:KICK.core.Util.typedArrayToArray(_normalizedViewportRect)
                }
            };
        };

        applyConfig(this,config);
        computeClearFlag();
    };

    /**
     * Reset the camera clear flags
     * @method setupClearFlags
     * @param {Boolean} clearColor
     * @param {Boolean} clearDepth
     */
    scene.Camera.prototype.setupClearFlags = function (clearColor,clearDepth) {
        this.clearColor = clearColor;
        this.clearDepth = clearDepth;
        delete this._currentClearFlags;
    };

    /**
     * Specifies the interface for a component listener.<br>
     * Note that object only need to implement the methods componentsAdded and componentsRemoved.<br>
     * However the class does exist and has the static method isComponentListener
     * @class ComponentChangedListener
     * @namespace KICK.scene
     */
    scene.ComponentChangedListener = {
        /**
         * @method componentsAdded
         * @param {Array[KICK.scene.Components]} components
         */
        /**
         * @method componentsRemoved
         * @param {Array[KICK.scene.Components]} components
         */
        /**
         * @method isComponentListener
         * @param {Object} obj
         * @static
         */
        isComponentListener: function (obj) {
            return obj &&
                typeof(obj.componentsAdded) === "function" &&
                typeof(obj.componentsRemoved) === "function";
        }
    };

    /**
     * Renders a Mesh.
     * To create custom renderable objects you should not inherit from this class, but simple create a component with a
     * render() method.
     * @class MeshRenderer
     * @constructor
     * @namespace KICK.scene
     * @extends KICK.scene.Component
     * @final
     * @param {Object} config configuration
     */
    scene.MeshRenderer = function (config) {
        var transform,
            _materials = [],
            _mesh,
            _renderOrder,
            gl,
            thisObj = this;

        /**
         * @method activated
         */
        this.activated = function(){
            transform = this.gameObject.transform;
            gl = this.gameObject.engine.gl
        };

        Object.defineProperties(this,{
            // inherit documentation from component
            renderOrder:{
                get:function(){
                    return _renderOrder;
                }
            },
            /**
             * Shortcut for materials[0]
             * @property material
             * @type KICK.material.Material
             */
            material:{
                get:function(){
                    if (_materials.length === 0){
                        return null;
                    }
                    return _materials[0];
                },
                set:function(newValue){
                    if (ASSERT){
                        if (!(newValue instanceof KICK.material.Material)){
                            KICK.core.Util.fail("MeshRenderer.material must be a KICK.material.Material");
                        }
                    }
                    _materials[0] = newValue;
                    _renderOrder = _materials[0].renderOrder;
                }
            },
            /**
             *
             * @property materias
             * @type Array[KICK.material.Material]
             */
            materials:{
                get:function(){
                    return _materials;
                },
                set:function(newValue){
                    _materials = [];
                    for (var i=0;i<newValue.length;i++){
                        if (ASSERT){
                            if (!(newValue[i] instanceof KICK.material.Material)){
                                KICK.core.Util.fail("MeshRenderer.material must be a KICK.material.Material");
                            }
                        }
                        _materials[i] = newValue[i];
                        _renderOrder = _materials[i].renderOrder;
                    }
                },
                enumerable: true
            },
            /**
             * @property mesh
             * @type KICK.mesh.Mesh
             */
            mesh:{
                get:function(){
                    return _mesh;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (!(newValue instanceof KICK.mesh.Mesh)){
                            KICK.core.Util.fail("MeshRenderer.mesh must be a KICK.mesh.Mesh");
                        }
                    }
                    _mesh = newValue;
                },
                enumerable: true
            }
        });

        /**
         * This method may not be called (the renderer could make the same calls)
         * @method render
         * @param engineUniforms
         * @param {KICK.material.Shader} overwriteShader Optional
         */
        this.render = function (engineUniforms,overwriteShader) {
            var length = _materials.length;
            for (var i=0;i<length;i++){
                var shader = overwriteShader || _materials[i].shader;
                _mesh.bind(shader);
                shader.bindUniform(_materials[i],engineUniforms,transform);
                _mesh.render(i);
            }
        };

        /**
         * @method toJSON
         * @return {JSON}
         */
        this.toJSON = function(){
            if (thisObj.gameObject){
                return null; // component is destroyed
            } else {
                return KICK.core.Util.componentToJSON(thisObj.gameObject.engine, this, "KICK.scene.MeshRenderer");
            }
        };

        applyConfig(this,config);
    };

    /**
     * A light object.<br>
     * Note that each scene can only have one ambient light and one directional light.
     * @class Light
     * @namespace KICK.scene
     * @extends KICK.scene.Component
     * @constructor
     * @param {Object} config
     * @final
     */
    scene.Light = function (config) {
        var thisObj = this,
            color = vec3.create([1.0,1.0,1.0]),
            engine,
            type = core.Constants._LIGHT_TYPE_POINT,
            _shadow = false,
            _shadowStrength = 1.0,
            _shadowBias = 0.05,
            _shadowTexture = null,
            _shadowRenderTexture = null,
            _shadowTextureDebug = null,
            _shadowRenderTextureDebug = null,
            attenuation = vec3.create([1,0,0]),
            intensity = 1,
            colorIntensity = vec3.create([1.0,1.0,1.0]),
            updateIntensity = function(){
                vec3.set([color[0]*intensity,color[1]*intensity,color[2]*intensity],colorIntensity);
            },
            gameObject,
            scriptPriority,
            updateShadowTexture = function(){
                if (_shadow){
                    _shadowTexture = new KICK.texture.Texture(engine,{
                        minFilter:KICK.core.Constants.GL_NEAREST,
                        magFilter:KICK.core.Constants.GL_NEAREST,
                        wrapS:KICK.core.Constants.GL_CLAMP_TO_EDGE,
                        wrapT:KICK.core.Constants.GL_CLAMP_TO_EDGE,
                        flipY: false,
                        generateMipmaps:false
                    });
                    _shadowTexture.setImageData(512,512,0,KICK.core.Constants.GL_UNSIGNED_BYTE,null,"");
                    _shadowRenderTexture = new KICK.texture.RenderTexture (engine,{
                        colorTexture:_shadowTexture
                    });

                    // debug info
                    _shadowTextureDebug = new KICK.texture.Texture(engine,{
                        minFilter:KICK.core.Constants.GL_NEAREST,
                        magFilter:KICK.core.Constants.GL_NEAREST,
                        wrapS:KICK.core.Constants.GL_CLAMP_TO_EDGE,
                        wrapT:KICK.core.Constants.GL_CLAMP_TO_EDGE,
                        flipY: false,
                        generateMipmaps:false
                    });
                    _shadowTextureDebug.setImageData(512,512,0,KICK.core.Constants.GL_UNSIGNED_BYTE,null,"");
                    _shadowRenderTextureDebug = new KICK.texture.RenderTexture (engine,{
                        colorTexture:_shadowTextureDebug
                    });

                } else if (_shadowRenderTexture){
                    _shadowRenderTexture.destroy();
                    _shadowTexture.destroy();
                }
            };
        Object.defineProperties(this,{
            shadowRenderTextureDebug:{
                get:function(){
                    return _shadowRenderTextureDebug;
                }
            },
            shadowTextureDebug:{
                get:function(){
                    return _shadowTextureDebug;
                }
            },
            /**
             * @property shadowRenderTexture
             * @type KICK.texture.RenderTexture
             */
            shadowRenderTexture:{
                get:function(){
                    return _shadowRenderTexture;
                }
            },
            /**
             * @property shadowTexture
             * @type KICK.texture.Texture
             */
            shadowTexture:{
                get:function(){
                    return _shadowTexture;
                }
            },
            /**
             * Default value is false.
             * Only directional light supports shadows.
             * @property shadow
             * @type boolean
             */
            shadow: {
                get: function(){
                    return _shadow;
                },
                set: function(value){
                    if (value !== _shadow){
                        _shadow = value;
                        if (engine){
                            updateShadowTexture();
                        }
                    }
                },
                enumerable: true
            },
            /**
             * Shadow strength (between 0.0 and 1.0). Default value is 1.0
             * @property shadowStrength
             * @type Number
             */
            shadowStrength:{
                get: function(){
                    return _shadowStrength;
                },
                set: function(value){
                    _shadowStrength = value;
                },
                enumerable: true
            },
            /**
             * Shadow bias. Default value is 0.05
             * @property shadowBias
             * @type Number
             */
            shadowBias:{
                get:function(){
                    return _shadowBias;
                },
                set:function(value){
                    _shadowBias = value;
                },
                enumerable: true
            },
            /**
             * Color intensity of the light (RGB). Default [1,1,1]
             * @property color
             * @type KICK.math.vec3
             */
            color: {
                get: function(){
                    return vec3.create(color);
                },
                set: function(value){
                    if (ASSERT){
                        if (value.length !== 3){
                            KICK.core.Util.fail("Light color must be vec3");
                        }
                    }
                    vec3.set(value,color);
                    updateIntensity();
                },
                enumerable: true
            },
            /**
             * Color type. Must be either:<br>
             * Light.TYPE_AMBIENT,
             * Light.TYPE_DIRECTIONAL,
             * Light.TYPE_POINT <br>
             * Note that this value is readonly after initialization. To change it create a new Light component and replace the current light
             * component of its gameObject.
             * Default type is TYPE_POINT
             * @property type
             * @type Enum
             * @final
             */
            type: {
                get: function(){
                    return type;
                },
                set: function(newValue){
                    if (!engine){
                        type = newValue;
                    } else {
                        if (ASSERT){
                            KICK.core.Util.fail("Light type cannot be changed after initialization");
                        }
                    }
                },
                enumerable: true
            },
            /**
             * Light intensity (a multiplier to color)
             * @property intensity
             * @type Number
             */
            intensity: {
                get: function(){
                    return intensity;
                },
                set: function(value){
                    intensity = value;
                    updateIntensity();
                },
                enumerable: true
            },
            /**
             * Specifies the light falloff.<br>
             * attenuation[0] is constant attenuation,<br>
             * attenuation[1] is linear attenuation,<br>
             * attenuation[2] is quadratic attenuation.<br>
             * Default value is (1,0,0)
             * @property attenuation
             * @type KICK.math.vec3
             */
            attenuation:{
                get:function(){
                    return attenuation;
                },
                set:function(newValue){
                    vec3.set(newValue,attenuation)
                }
            },
            /**
             * color RGB multiplied with intensity (plus color A).<br>
             * This property exposes a internal value. This value should not be modified.
             * Instead use the intensity and color property.
             * @property colorIntensity
             * @type KICK.math.vec3
             * @final
             */
            colorIntensity: {
                get: function(){
                    return colorIntensity;
                },
                set:function(newValue){
                    colorIntensity = newValue;
                },
                enumerable: true
            },
            // inherited interface from component
            gameObject:{
                get:function(){
                    return gameObject;
                },
                set:function(value){
                    gameObject = value;
                }
            },
            // inherited interface from component
            scriptPriority:{
                get:function(){
                    return scriptPriority;
                },
                set:function(value){
                    scriptPriority = value;
                },
                enumerable: true
            }
        });

        this.activated = function(){
            engine = thisObj.gameObject.engine;
            updateShadowTexture();
        };

        /**
         * @method toJSON
         * @return {JSON}
         */
        this.toJSON = function(){
            return KICK.core.Util.componentToJSON(thisObj.gameObject.engine, this, "KICK.scene.Light");
        };

        applyConfig(this,config);
        KICK.core.Util.copyStaticPropertiesToObject(this,scene.Light);
    };

    /**
     * @property TYPE_AMBIENT
     * @type Number
     * @static
     */
    scene.Light.TYPE_AMBIENT = KICK.core.Constants._LIGHT_TYPE_AMBIENT;
    /**
     * @property TYPE_DIRECTIONAL
     * @type Number
     * @static
     */
    scene.Light.TYPE_DIRECTIONAL = KICK.core.Constants._LIGHT_TYPE_DIRECTIONAL;
    /**
     * @property TYPE_POINT
     * @type Number
     * @static
     */
    scene.Light.TYPE_POINT = KICK.core.Constants._LIGHT_TYPE_POINT;

    Object.freeze(scene.Light);

    /**
     * Datastructure used pass light information
     * @class SceneLights
     * @namespace KICK.scene
     * @constructor
     * @param {Number} maxNumerOfLights (value from config)
     */
    scene.SceneLights = function(maxNumerOfLights){
        var ambientLight = null,
            directionalLight = null,
            directionalLightData = KICK.math.mat3.create(), // column matrix with the columns lightDirection,colorIntensity,halfVector
            directionalLightDirection = directionalLightData.subarray(0,3),
            directionalLightColorIntensity = directionalLightData.subarray(3,6),
            directionalHalfVector = directionalLightData.subarray(6,9),
            directionalLightTransform = null,
            pointLightData = new Float32Array(9*maxNumerOfLights), // mat3*maxNumerOfLights
            pointLightDataVec3 = vec3.wrapArray(pointLightData),
            pointLights = [],
            pointLightTransforms = [],
            lightDirection = [0,0,1],
            /**
             * Set the point light to have not contribution this means setting the position 1,1,1, the color to 0,0,0
             * and attenuation to 1,0,0.<br>
             * This is needed since the ecLight position would otherwise be in 0,0,0 which is invalid
             * @method resetPointLight
             * @param {Number} index of point light
             * @private
             */
            resetPointLight = function(index){
                for (var i=0;i<3;i++){
                    vec3.set([0,0,0],pointLightDataVec3[index*3+i]);
                }
            };
        Object.defineProperties(this,{
            /**
             * The ambient light in the scene.
             * @property ambientLight
             * @type KICK.scene.Light
             */
            ambientLight: {
                get:function (){
                    return ambientLight;
                },
                set:function(value){
                    if (ASSERT){
                        if (value && ambientLight){
                            throw Error("Cannot have multiple ambient lights in the scene");
                        }
                    }
                    ambientLight = value;
                }
            },
            /**
             * The directional light in the scene.
             * @property directionalLight
             * @type KICK.scene.Light
             */
            directionalLight:{
                get: function(){
                    return directionalLight;
                },
                set: function(value){
                    if (ASSERT){
                        if (value && directionalLight){
                            throw Error("Cannot have multiple directional lights in the scene");
                        }
                    }
                    directionalLight = value;
                    if (value !== null){
                        directionalLightTransform = directionalLight.gameObject.transform;
                    } else {
                        directionalLightTransform = null;
                        KICK.math.mat3.set([0,0,0,0,0,0,0,0,0],directionalLightData);
                    }
                }
            },
            /**
             * Matrix of directional light data. Column 1 contains the light-direction in eye space,
             * column 2 color intensity and column 3 half vector
             * @property directionalLightData
             * @type KICK.math.mat3
             */
            directionalLightData:{
                get:function(){
                    return directionalLightData;
                }
            },
            /**
             * Matrices of point light data. Each matrix (mat3) contains:<br>
             * Column 1 vector: point light position in eye coordinates<br>
             * Column 2 vector: color intensity<br>
             * Column 3 vector: attenuation vector
             */
            pointLightData:{
                get: function(){
                    return pointLightData;
                }
            }
        });

        /**
         * @method addPointLight
         * @param {KICK.scene.Light} pointLight
         */
        this.addPointLight = function(pointLight){
            if (!KICK.core.Util.contains(pointLights,pointLight)){
                if (pointLights.length==maxNumerOfLights){
                    if (ASSERT){
                        fail("Only "+maxNumerOfLights+" point lights allowed in scene");
                    }
                } else {
                    pointLights.push(pointLight);
                    pointLightTransforms.push(pointLight.gameObject.transform);
                }
            }
        };

        /**
         * @method removePointLight
         * @param {KICK.scene.Light} pointLight
         */
        this.removePointLight = function(pointLight){
            var index = pointLights.indexOf(pointLight);
            if (index >=0){
                // remove element at position index
                pointLights.splice(index, 1);
                pointLightTransforms.splice(index, 1);
            } else {
                if (ASSERT){
                    fail("Error removing point light");
                }
            }
            resetPointLight(pointLights.length);
        };

        /**
         * Recompute the light based on the view-matrix. This method is called from the camera when the scene is
         * rendered, to transform the light into eye coordinates and compute the half vector for directional light
         * @method recomputeLight
         * @param {KICK.math.mat4} viewMatrix
         */
        this.recomputeLight = function(viewMatrix){
            if (directionalLight !== null){
                // compute light direction
                quat4.multiplyVec3(directionalLightTransform.rotation,lightDirection,directionalLightDirection);

                // transform to eye space
                mat4.multiplyVec3Vector(viewMatrix,directionalLightDirection);
                vec3.normalize(directionalLightDirection);

                // compute half vector
                vec3.add(lightDirection, directionalLightDirection, directionalHalfVector);
                vec3.normalize(directionalHalfVector);

                vec3.set(directionalLight.colorIntensity,directionalLightColorIntensity);
            }
            if (maxNumerOfLights){ // only run if max number of lights are 1 or above (otherwise JIT compiler will skip it)
                var index = 0;
                for (var i=pointLights.length-1;i>=0;i--){
                    var pointLight = pointLights[i];
                    var pointLightPosition = pointLightTransforms[i].position;

                    mat4.multiplyVec3Vector(viewMatrix, pointLightPosition,pointLightDataVec3[index]);
                    vec3.set(pointLight.colorIntensity, pointLightDataVec3[index+1]);
                    vec3.set(pointLight.attenuation, pointLightDataVec3[index+2]);
                    index += 3;
                }
            }
        };

        (function init(){
            for (var i=0;i<maxNumerOfLights;i++){
                resetPointLight(i);
            }
        })();
    };
 })();
