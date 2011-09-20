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

    var scene = KICK.namespace("KICK.scene"),
        core = KICK.namespace("KICK.core"),
        math = KICK.namespace("KICK.math"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat4 = KICK.namespace("KICK.math.mat4");
    
    /**
     * Live objects in the scene
     * @class GameObject
     * @namespace KICK.scene
     * @constructor
     * @param scene {KICK.scene.Scene}
     */
    scene.GameObject = function (scene) {
        /**
         * Reference to the containing scene
         * @property scene
         * @type KICK.scene.Scene
         */
        Object.defineProperty(this, "scene", {
            value:scene
        });

        /**
         * Reference to the engine
         * @property engine
         * @type KICK.core.Engine
         */
        Object.defineProperty(this, "engine", {
            value:scene.engine
        });

        /**
         * Reference to the transform
         * @property transform
         * @type KICK.scene.Transform
         */
        this.transform = new KICK.scene.Transform(this);
        this._components = [];
    };

    /**
     * Add the component to a gameObject and set the gameObject field on the component
     * @method addComponent
     * @param {KICK.scene.Component} component
     */
    scene.GameObject.prototype.addComponent = function (component) {
        if (component.gameObject) {
            throw {
                name: "Error",
                message: "Component "+component+" already added to gameObject "+component.gameObject
            };
        }
        if (!component.scriptPriority) {
            component.scriptPriority = 0;
        }
        if (component instanceof scene.Camera) {
            this.scene._addCamera(component);
        }
        component.gameObject = this;
        this._components.push(component);
        this.scene.addComponent(component);
    };

    /**
     * Remove the component from a gameObject and clear the gameObject field on the component
     * @method removeComponent
     * @param {KICK.scene.Component} component
     */
    scene.GameObject.prototype.removeComponent = function (component) {
        delete component.gameObject;
        core.Util.removeElementFromArray(this._components,component);
        this.scene.removeComponent(component);
    };

    /**
     * Destroys game object after next frame.
     * Removes all components instantly.
     * @method destroy
     */
    scene.GameObject.prototype.destroy = function () {
        var components = this._components,
            i;
        for (i=0; i < components.length; i++) {
            this.removeComponent(components[i]);
        }
        this.scene.destroyObject(this);
    };

    /**
     * This class only specifies the interface of a component.
     * @namespace KICK.scene
     * @class Component
     */
//scene.Component = function () {
    /**
     * The gameObject owning the component. Initially undefined. The value is set when the Component object is added
     * to a GameObject
     * @property gameObject
     * @type KICK.scene.GameObject
     */

    /**
     * Abstract method called when a component is added to scene. May be undefined.
     * @method activated
     */

    /**
     * Abstract method called when a component is removed from scene. May be undefined.
     * @method deactivated
     */


    /**
     * Abstract method called every rendering. May be undefined.
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
     * Abstract method called every update. May be undefined.
     * @method update
     */

    /**
     * Abstract method called every update as the last thing. Useful for camera scripts. May be undefined.
     * @method lateUpdate
     */
//};

    /**
     * Position, rotation and scale of a game object. This component should not be created manually.
     * It is created when a GameObject is created.
     * @namespace KICK.scene
     * @class Transform
     * @extends KICK.scene.Component
     * @constructor
     * @param {KICK.scene.GameObject} gameObject
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
                        return vec3.create(localRotationQuat);
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
             * Local scale
             * @property localScale
             * @type KICK.math.vec3
             */
            localScale: {
                get: function(){
                    return vec3.create(localScale);
                },
                set: function(newValue){
                    vec3.set(newValue,localScale);
                    markLocalDirty();
                }
            },
            /**
             * Array of children. The children should not be modified directly. Instead use the parent property
             * @property children
             * @type Array
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
                        throw new Error('Cannot assign parent to self');
                    }
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
                    mat4.multiply(globalMatrix, transformIterator.getLocalMatrix(),globalMatrix);
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
    };

    /**
     * A scene objects contains a list of GameObjects
     * @class Scene
     * @namespace KICK.scene
     * @constructor
     * @param engine {KICK.core.Engine}
     */
    scene.Scene = function (engine) {
        var gameObjects = [],
            gameObjectsNew = [],
            gameObjectsDelete = [],
            cameras = [],
            updateableComponents= [],
            lateUpdateableComponents = [],
            componentsNew = [],
            componentsDelete = [],
            componentListenes = [],
            lights = [],
            i,
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
             * Handle insertions and removal of gameobjects and components. This is done in a separate step to avoid problems
             * with missed updates (or multiple updates) due to modifying the array while iterating it.
             * @method cleanupGameObjects
             * @private
             */
            cleanupGameObjects = function () {
                var i,
                    component;
                if (gameObjectsNew.length > 0) {
                    gameObjects = gameObjects.concat(gameObjectsNew);
                    gameObjectsNew.length = 0;
                }
                if (gameObjectsDelete.length > 0) {
                    core.Util.removeElementsFromArray(gameObjects,gameObjectsDelete);
                    gameObjectsDelete.length = 0;
                }
                if (componentsNew.length > 0) {
                    for (i = componentsNew.length-1; i >= 0; i--) {
                        component = componentsNew[i];
                        if (typeof(component.activated) === "function") {
                            component.activated();
                        }
                        if (typeof(component.update) === "function") {
                            core.Util.insertSorted(component,updateableComponents,sortByScriptPriority);
                        }
                        if (typeof(component.lateUpdate) === "function") {
                            core.Util.insertSorted(component,lateUpdateableComponents,sortByScriptPriority);
                        }
                    }
                    for (i=componentListenes.length-1; i >= 0; i--) {
                        componentListenes[i].componentsAdded(componentsNew);
                    }
                    componentsNew.length = 0;
                }
                if (componentsDelete.length > 0) {
                    for (i = componentsDelete.length-1; i >= 0; i--) {
                        component = componentsDelete[i];
                        if (typeof(component.deactivated) === "function") {
                            component.deactivated();
                        }
                        if (typeof(component.update) === "function") {
                            core.Util.removeElementFromArray(updateableComponents,component);
                        }
                        if (typeof(component.lateUpdate) === "function") {
                            core.Util.removeElementFromArray(lateUpdateableComponents,component);
                        }
                    }
                    for (i=componentListenes.length-1; i >= 0; i--) {
                        componentListenes[i].componentsRemoved(componentsDelete);
                    }
                    componentsDelete.length = 0;
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
                throw {
                    name: "Error",
                    message:"Component listener does not have the correct interface. " +
                        "It should contain the two functions: " +
                        "componentsAdded(components) and componentsRemoved(components)"
                };
            }
            componentListenes.push(componentListener);
        }

        /**
         * Removes a component change listener from the scene
         * @method removeComponentListener
         * @param {KICK.scene.ComponentChangedListener} componentListener
         */
        this.removeComponentListener = function (componentListener) {
            core.Util.removeElementFromArray(componentListenes,componentListener);
        }

        /**
         * Should only be called by GameObject when a component is added. If the component is updateable (implements
         * update or lateUpdate) the components is added to the current list of updateable components after the update loop
         * (so it will not recieve any update invocations in the current frame).
         * If the component is renderable (implements), is it added to the renderer's components
         * @method addComponent
         * @param {KICK.scene.Component} component
         * @protected
         */
        this.addComponent = function (component) {
            core.Util.insertSorted(component,componentsNew,sortByScriptPriority);
        };

        /**
         * @method removeComponent
         * @param {KICK.scene} component
         */
        this.removeComponent = function (component) {
            componentsDelete.push(component);
        }

        /**
         * Reference to the engine
         * @property engine
         * @type KICK.core.Engine
         */
        Object.defineProperty(this,"engine",{
            value:engine
        });

        /**
         * @method loadScene
         * @param {String} jsonStr
         */
        this.loadScene = function (jsonStr) {
            throw Error("Not implemented");
        };

        /**
         * @method saveScene
         * @return {String} in jsonFormat
         */
        this.saveScene = function () {
            throw Error("Not implemented");
        };

        /**
         * @method createGameObject
         * @return {KICK.scene.GameObject}
         */
        this.createGameObject = function () {
            var gameObject = new scene.GameObject(this);
            gameObjectsNew.push(gameObject);
            return gameObject;
        };

        /**
         * @method destroyObject
         * @param {KICK.scene.GameObject} gameObject
         */
        this.destroyObject = function (gameObject) {
            gameObjectsDelete.push(gameObject);
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
         * @method update
         */
        this.update = function () {
            var i;
            for (i=updateableComponents.length-1; i >= 0; i--) {
                updateableComponents[i].update();
            }
            for (i=lateUpdateableComponents.length-1; i >= 0; i--) {
                lateUpdateableComponents[i].lateUpdate();
            }
            cleanupGameObjects();
        };

        /**
         * @method _addCamera
         * @param camera
         * @private
         */
        this._addCamera = function (camera) {
            cameras.push(camera);
        }

        /**
         * @method debug
         */
        this.debug = function () {
            console.log("gameObjects "+gameObjects.length,gameObjects,
                "gameObjectsNew "+gameObjectsNew.length,gameObjectsNew,
                "gameObjectsDelete "+gameObjectsDelete.length,gameObjectsDelete,
                "cameras "+cameras.length,cameras
            );
        };
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
            isNumber = function (o) {
                return typeof (o) === "number";
            },
            isBoolean = function(o){
                return typeof (o) === "boolean";
            },
            setupViewport = function () {
                gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            },
            setupClear = function () {
                if (!thisObj._currentClearFlags) {
                    // I use '+' instead of '|' since it tends to perform better in JS
                    // and it should give the same result when the bit-fields are different (power of two)
                    thisObj._currentClearFlags = (thisObj.clearFlagColor ? gl.COLOR_BUFFER_BIT : 0) + (thisObj.clearFlagDepth ? gl.DEPTH_BUFFER_BIT : 0);
                }
                gl.clear(thisObj._currentClearFlags);
            },
            setupClearColor = function () {
                if (gl.currentClearColor !== thisObj.clearColor) {
                    gl.currentClearColor = thisObj.clearColor;
                    var color = thisObj.clearColor;
                    gl.clearColor(color[0], color[1], color[2], color[3]);
                }
            };

        /**
         * Handles the camera setup (get fast reference to transform and glcontext)
         * @method activated
         */
        this.activated = function(){
            var gameObject = this.gameObject;
            transform = gameObject.transform;
            gl = gameObject.engine.gl;
        };

        /**
         * Clear the screen and set the projectionMatrix and modelViewMatrix on the gl object
         * @method setupCamera
         * @param {KICK.math.mat4} projectionMatrix Projection of the camera
         * @param {KICK.math.mat4} modelViewMatrix Modelview of the camera (the inverse global transform matrix of the camera)
         * @param {KICK.math.mat4} modelViewProjectionMatrix modelview multiplied with projection
         */
        this.setupCamera = function (projectionMatrix,modelViewMatrix,modelViewProjectionMatrix) {
            setupViewport();
            setupClearColor();
            setupClear();

            if (this.cameraTypePerspective) {
                mat4.perspective(this.fieldOfView, gl.viewportWidth / gl.viewportHeight,
                    this.near, this.far, projectionMatrix);
            } else {
                mat4.ortho(this.left, this.right, this.bottom, this.top,
                    this.near, this.far, projectionMatrix);
            }

            // todo - this allocates a new mat4 - remove this
            var globalMatrixInv = transform.getGlobalTRSInverse();
            mat4.set(globalMatrixInv, modelViewMatrix);

            mat4.multiply(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix);
        };

        /**
         * Only used when perspective camera type. Default 60.0
         * @property fieldOfView
         * @type Number
         */
        this.fieldOfView = isNumber(config.fieldOfView) ? config.fieldOfView : 60;
        /**
         * Default 0.1
         * @property near
         * @type Number
         */
        this.near = isNumber(config.near) ? config.near : 0.1;
        /**
         * Default 1000.0
         * @property far
         * @type Number
         */
        this.far = isNumber(config.far) ? config.far : 1000;
        /**
         * Default true
         * @property cameraTypePerspective
         * @type Boolean
         */
        this.cameraTypePerspective = isBoolean(config.cameraTypePerspective) ? config.cameraType : true;
        /**
         * Only used when orthogonal camera type (!cameraTypePerspective)
         * @property left
         * @type Number
         */
        this.left = isNumber(config.left) ? config.left : -1;
        /**
         * Only used when orthogonal camera type (!cameraTypePerspective). Default 1
         * @property right
         * @type Number
         */
        this.right = isNumber(config.right) ? config.right : 1;
        /**
         * Only used when orthogonal camera type (!cameraTypePerspective). Default 1
         * @property bottom
         * @type Number
         */
        this.bottom = isNumber(config.bottom) ? config.bottom : -1;
        /**
         * Only used when orthogonal camera type (!cameraTypePerspective). Default 1
         * @property top
         * @type Number
         */
        this.top = isNumber(config.top) ? config.top : 1;
        /**
         * Only used when orthogonal camera type (!cameraTypePerspective). Default [1,1,1,1]
         * @property clearColor
         * @type Array
         */
        this.clearColor = config.clearColor ? config.clearColor : [1,1,1,1];
        /**
         * @property clearFlagColor
         * @type Boolean
         */
        this.clearFlagColor = config.clearFlagColor ? config.clearFlagColor:true;
        /**
         * @property clearFlagDepth
         * @type Boolean
         */
        this.clearFlagDepth = config.clearFlagDepth ? config.clearFlagDepth:true;

        this.setupClearFlags(config.clearColor,config.clearDepth);
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
     * Specifies the interface for a component listener.
     * Note that object only need to implement the methods componentsAdded and componentsRemoved.
     * However the class does exist and has the static method isComponentListener
     * @class ComponentChangedListener
     * @namespace KICK.scene
     */
    scene.ComponentChangedListener = {
        /**
         * @method componentsAdded
         * @param {Array ofKICK.scene.Components} components
         */
        /**
         * @method componentsRemoved
         * @param {Array ofKICK.scene.Components} components
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
     * @namespace KICK.scene
     * @extends KICK.scene.Component
     * @final
     */
    scene.MeshRenderer = function () {
        var transform;

        /**
         * @method activated
         */
        this.activated = function(){
            transform = this.gameObject.transform;
        };
        
        /**
         * @property shader
         * @type KICK.material.Material
         */
        this.material = undefined;

        /**
         * This method may not be called (the renderer could make the same calls)
         * @method render
         * @param (KICK.math.mat4) projectionMatrix
         * @param {KICK.math.mat4} modelViewMatrix
         * @param {KICK.math.mat4} modelViewProjectionMatrix modelviewMatrix multiplied with projectionMatrix
         */
        this.render = function (projectionMatrix,modelViewMatrix,modelViewProjectionMatrix) {
            var mesh = this.mesh,
                material = this.material,
                shader = material.shader;
            mesh.bind(shader);
            shader.bindUniform(material.uniforms);
            shader.bindMatrices(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,transform);
            mesh.render();
        };

        /**
         * @property mesh
         * @type KICK.scene.Mesh
         */
        this.mesh = undefined;
    };

    /**
     * Mesh data
     * @class Mesh
     * @namespace KICK.scene
     */
    scene.Mesh = function (engine,config) {
        var gl = engine.gl,
            meshVertexAttBuffer,
            meshVertexAttBufferDescription,
            meshVertexIndexBuffer,
            vertexAttributeNames = [],
            buffers = [],
            description,
            vertexAttrLength,
            matrixTemp = mat4.create();
        if (!config) {
            config = {
                name:"Mesh"
            };
        }
        /**
         * @property name
         * @type String
         */
        this.name = config.name?config.name:"Mesh";
        /**
         * @property vertex
         * @type Float32Array
         */
        this.vertex = config.vertex?new Float32Array(config.vertex):null;
        /**
         * @property normal
         * @type Float32Array
         */
        this.normal = config.normal?new Float32Array(config.normal):null;
        /**
         * @property uv1
         * @type Float32Array
         */
        this.uv1 = config.uv1?new Float32Array(config.uv1):null;
        /**
         * @property uv2
         * @type Float32Array
         */
        this.uv2 = config.uv2?new Float32Array(config.uv2):null;
        /**
         * A tangent is represented as vec4
         * @property tangent
         * @type Float32Array
         */
        this.tangent = config.tangent?new Float32Array(config.tangent):null;
        /**
         * @property color (RGBA)
         * @type Float32Array
         */
        this.color = config.color?new Float32Array(config.color):null;
        /**
         * @property indices
         * @type Uint16Array
         */
        this.indices = config.indices?new Uint16Array(config.indices):null;

        /**
         * @method createInterleavedData
         * @private
         */
        this.createInterleavedData = function () {
            var lengthOfVertexAttributes = [],
                names = [],
                length = 0,
                data,
                i,
                thisObj = this,
                vertexLen = this.vertex.length,
                index = 0,
                description = {},
                addAttributes = function (name,size){
                    if (thisObj[name]){
                        lengthOfVertexAttributes.push(size);
                        names.push(name);
                        description[name] = {
                            pointer: length*4,
                            size: size,
                            normalized: false,
                            type: gl.FLOAT
                        };
                        length += size;
                    }
                };

            addAttributes("vertex",3);
            addAttributes("normal",3);
            addAttributes("uv1",2);
            addAttributes("uv2",2);
            addAttributes("tangent",4);
            addAttributes("color",4);

            data = new Float32Array(length*vertexLen);
            for (i=0;i<vertexLen;i++){
                for (var j=0;j<names.length;j++){
                    var dataSrc = this[names[j]];
                    var dataSrcLen = lengthOfVertexAttributes[j];
                    for (var k=0;k<dataSrcLen;k++){
                        data[index++] = dataSrc[i*dataSrcLen+k];
                    }
                }
            }

            return {
                vertexAttrLength:length*4,
                description:description,
                data:data
            };
        };

        /**
         * This function verifies that the mesh has the vertex attributes (normals, uvs, tangents) that the shader uses.
         * @method verify
         * @param {KICK.material.Shader} shader
         * @return {Array} list of missing vertex attributes in mesh or null if no missing attributes
         */
        this.verify = function (shader){
            var missingVertexAttributes = [],
                found;
            for (var att in shader.lookupAttribute){
                if (typeof (att) === "string"){
                    found = false;
                    for (var i=0;i<vertexAttributeNames.length;i++){
                        if (vertexAttributeNames[i] === att){
                            found = true;
                            break;
                        }
                    }
                    if (!found){
                        missingVertexAttributes.push(att);
                    }
                }
            }
            if (missingVertexAttributes.length===0){
                return null;
            }
            return missingVertexAttributes;
        };

        /**
         * Bind the vertex attributes of the mesh to the shader
         * @method bind
         * @param {KICK.material.Shader} shader
         */
        this.bind = function (shader) {
            shader.bind();
            
            gl.bindBuffer(gl.ARRAY_BUFFER, meshVertexAttBuffer);

            for (var descName in meshVertexAttBufferDescription) {
                if (shader.lookupAttribute[descName] !== undefined) {
                    var desc = meshVertexAttBufferDescription[descName];
                    var attributeIndex = shader.lookupAttribute[descName];
                    gl.enableVertexAttribArray(attributeIndex);
                    gl.vertexAttribPointer(attributeIndex, desc.size,
                       desc.type, false, vertexAttrLength, desc.pointer);
                }
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshVertexIndexBuffer);
        };

        /**
         * Renders the current mesh
         * @method render
         */
        this.render = function () {
            gl.drawElements(gl.TRIANGLES, meshVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        /**
         * Copy data to the vertex buffer object (VBO)
         * @method updateData
         */
        this.updateData = function () {
            var names = ["vertex", "normal", "tangent","uv1","uv2","color"],
                dataLengths = [3,3,3,2,2,4],
                i, buffer, dataLength,
                interleavedData = this.createInterleavedData();
            meshVertexAttBufferDescription = interleavedData.description;
            vertexAttrLength = interleavedData.vertexAttrLength;
            // delete current buffers
            for (i=buffers.length-1; i >= 0; i--) {
                gl.deleteBuffer(buffers[i]);
            }
            if (typeof meshVertexIndexBuffer === "number"){
                gl.deleteBuffer(meshVertexIndexBuffer);
            }
            if (typeof meshVertexAttBuffer === "number"){
                gl.deleteBuffer(meshVertexAttBuffer);
            }

            vertexAttributeNames = [];
            buffers = [];

            for (i=names.length-1; i >= 0; i--) {
                var name = names[i],
                    data = this[name];
                if (data) {
                    buffer = gl.createBuffer();
                    dataLength = dataLengths[i];
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
                    buffer.itemSize = dataLength;
                    buffer.numItems = data.length / dataLength;
                    buffers.push(buffer);
                    vertexAttributeNames.push(name);
                }
            }

            meshVertexAttBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, meshVertexAttBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, interleavedData.data, gl.STATIC_DRAW);

            meshVertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshVertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
            meshVertexIndexBuffer.itemSize = 1;
            meshVertexIndexBuffer.numItems = this.indices.length;
        };

        this.updateData(); // always update data on load
    };

    /**
     * Recalculate the vertex normals based on the triangle normals
     * @method recalculateNormals
     */
    scene.Mesh.prototype.recalculateNormals = function(){
        var vertexCount = this.vertex.length/3,
            triangleCount = this.indices.length/3,
            triangles = this.indices,
            vertex = vec3.wrapArray(this.vertex),
            a,
            normalArrayRef = {},
            normalArray = vec3.array(vertexCount,normalArrayRef),
            v1v2 = vec3.create(),
            v1v3 = vec3.create(),
            normal = vec3.create();

        for (a=0;a<triangleCount;a++){
            var i1 = triangles[a*3+0],
                i2 = triangles[a*3+1],
                i3 = triangles[a*3+2],

                v1 = vertex[i1],
                v2 = vertex[i2],
                v3 = vertex[i3];
            vec3.subtract(v2,v1,v1v2);
            vec3.subtract(v3,v1,v1v3);
            vec3.cross(v1v2,v1v3,normal);
            vec3.normalize(normal);
            vec3.add(normalArray[i1],normal);
            vec3.add(normalArray[i2],normal);
            vec3.add(normalArray[i3],normal);
        }
        for (a=0;a<vertexCount;a++){
            vec3.normalize(normalArray[a]);
        }
        this.normal =  normalArrayRef.mem;
    };

    /**
     * Recalculates the tangents.
     * Algorithm is based on
     *   Lengyel, Eric. “Computing Tangent Space Basis Vectors for an Arbitrary Mesh”.
     *   Terathon Software 3D Graphics Library, 2001.
     *   http://www.terathon.com/code/tangent.html
     * @method recalculateTangents
     */
    scene.Mesh.prototype.recalculateTangents = function(){
        var vertex = vec3.wrapArray(this.vertex),
            vertexCount = vertex.length,
            normal = vec3.wrapArray(this.normal),
            texcoord = this.uv1,
            triangle = this.indices,
            triangleCount = triangle.length/3,
            tangent = this.tangent,
            tan1 = vec3.array(vertexCount),
            tan2 = vec3.array(vertexCount),
            a;

        for (a = 0; a < triangleCount; a++)
        {
            var i1 = triangle[a*3+0],
                i2 = triangle[a*3+1],
                i3 = triangle[a*3+2],

                v1 = vertex[i1],
                v2 = vertex[i2],
                v3 = vertex[i3],

                w1 = texcoord[i1],
                w2 = texcoord[i2],
                w3 = texcoord[i3],

                x1 = v2[0] - v1[0],
                x2 = v3[0] - v1[0],
                y1 = v2[1] - v1[1],
                y2 = v3[1] - v1[1],
                z1 = v2[2] - v1[2],
                z2 = v3[2] - v1[2],

                s1 = w2[0] - w1[0],
                s2 = w3[0] - w1[0],
                t1 = w2[1] - w1[1],
                t2 = w3[1] - w1[1],

                r = 1.0 / (s1 * t2 - s2 * t1),
                sdir = vec3.create([(t2 * x1 - t1 * x2) * r,
                    (t2 * y1 - t1 * y2) * r,
                    (t2 * z1 - t1 * z2) * r]),
                tdir = vec3.create([(s1 * x2 - s2 * x1) * r,
                    (s1 * y2 - s2 * y1) * r,
                    (s1 * z2 - s2 * z1) * r]);

            vec3.add(tan1[i1], sdir);
            vec3.add(tan1[i2], sdir);
            vec3.add(tan1[i3], sdir);

            vec3.add(tan2[i1], tdir);
            vec3.add(tan2[i2], tdir);
            vec3.add(tan2[i3], tdir);
        }
        if (!tangent){
            tangent = new Float32Array(vertexCount*4);
            this.tangent = tangent;
        }
        tangent = vec4.wrapArray(tangent);

        for (a = 0; a < vertexCount; a++)
        {
            var n = normal[a];
            var t = tan1[a];

            // Gram-Schmidt orthogonalize
            // tangent[a] = (t - n * Dot(n, t)).Normalize();
            var tmn = vec3.subtract(t,n,vec3.create());
            var d = vec3.dot(n,t,vec3.create());
            vec3.set(vec3.normalize(vec3.multiply(tmn,d)),tangent[a]);

            // Calculate handedness
            // tangent[a].w = (Dot(Cross(n, t), tan2[a]) < 0.0F) ? -1.0F : 1.0F;
            tangent[a][3] = (vec3.dot(vec3.cross(n, t,vec3.create()), tan2[a]) < 0.0) ? -1.0 : 1.0;
        }
    };

    /**
     * A light object.<br>
     * Note that each scene can only have one ambient light and one directional light.
     * @class Light
     * @namespace KICK.scene
     * @extends KICK.scene.Component
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @final
     */
    scene.Light = function (engine,config) {
        var color = vec4.create([1.0,1.0,1.0,1.0]),
            type,
            intensity,
            colorIntensity = vec4.create(),
            updateIntensity = function(){
                vec3.set([color[0]*intensity,color[1]*intensity,color[2]*intensity],colorIntensity);
                colorIntensity[3] = color[3];
            },
            gameObject,
            scriptPriority;
        config = config || {};
        if (config.color){
            vec4.set(config.color,color);
        }
        intensity = config.intensity || 1;
        updateIntensity();
        type = config.type || scene.Light.TYPE_DIRECTIONAL;
        Object.defineProperties(this,{
            /**
             * Color intensity of the light (RGBA)
             * @property color
             * @type KICK.math.vec4
             */
            color: {
                get: function(){
                    return vec4.create(color);
                },
                set: function(value){
                    vec4.set(value,color);
                    updateIntensity();
                }
            },
            /**
             * Color type. Must be either:<br>
             * KICK.scene.Light.TYPE_AMBIENT,
             * KICK.scene.Light.TYPE_DIRECTIONAL,
             * KICK.scene.Light.TYPE_DIRECTIONAL <br>
             * Note that this value is readonly. To change it create a new Light component and replace the current light
             * component of its gameObject
             * @property type
             * @type Enum
             * @final
             */
            type: {
                get: function(){
                    return type;
                }
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
                }
            },
            /**
             * color RGB multiplied with intensity (plus color A).<br>
             * This property exposes a internal value. This value should not be modified.
             * Instead use the intensity and color property.
             * @property colorIntensity
             * @type KICK.math.vec4
             * @final
             */
            colorIntensity: {
                value:colorIntensity
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
                }
            }
        });
    };
    /**
     * Used to define ambient color in the scene (indirect lightening)
     * @property TYPE_AMBIENT
     * @type Number
     * @final
     */
    scene.Light.TYPE_AMBIENT = 0;
    /**
     * Used to define directional light in the scene (such as sunlight)
     * @property TYPE_DIRECTIONAL
     * @type Number
     * @final
     */
    scene.Light.TYPE_DIRECTIONAL = 1;
    /**
     * Used to define point light in the scene
     * @property TYPE_POINT
     * @type Number
     * @final
     */
    scene.Light.TYPE_POINT = 2;

    Object.freeze(scene.Light);

 })();