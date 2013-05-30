define(["kick/math/Mat4", "kick/math/Vec3", "kick/math/Quat", "kick/core/Constants", "kick/core/Util", "kick/core/EngineSingleton"], function (Mat4, Vec3, Quat, Constants, Util, EngineSingleton) {
    "use strict";

    var ASSERT = Constants._ASSERT,
        Transform;

    /**
     * Position, rotation and scale of a game object. This component should not be created manually.
     * It is created when a GameObject is created.
     *
     * KickJS uses a right handed coordinate system.
     * @namespace kick.scene
     * @class Transform
     * @extends kick.scene.Component
     */
    Transform = function () {
        var localMatrix = Mat4.create(),
            globalMatrix = Mat4.create(),
            localMatrixInverse = Mat4.create(),
            globalMatrixInverse = Mat4.create(),
            globalPosition = Vec3.create(),
            localPosition = Vec3.create(),
            globalRotationQuat = Quat.create(),
            localRotationQuat = Quat.create(),
            localScale = Vec3.clone([1, 1, 1]),
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
                for (i = children.length - 1; i >= 0; i--) {
                    children[i]._markGlobalDirty();
                }
            },
            markLocalDirty = function () {
                dirty[LOCAL] = 1;
                dirty[LOCAL_INV] = 1;
                markGlobalDirty();
            };

        Object.defineProperties(this, {
            /**
             * Global position.
             * @property position
             * @type kick.math.Vec3
             */
            position: {
                get: function () {
                    // if no parent - use local position
                    if (parentTransform === null) {
                        return Vec3.clone(localPosition);
                    }
                    if (dirty[GLOBAL_POSITION]) {
                        Mat4.multiplyVec3(globalPosition, thisObj.getGlobalMatrix(), [0, 0, 0]);
                        dirty[GLOBAL_POSITION] = 0;
                    }
                    return Vec3.clone(globalPosition);
                },
                set: function (newValue) {
                    var currentPosition;
                    if (parentTransform === null) {
                        thisObj.localPosition = newValue;
                        return;
                    }
                    currentPosition = thisObj.position;
                    Vec3.copy(localPosition, newValue);
                    thisObj.localPosition = [
                        localPosition[0] + currentPosition[0] - newValue[0],
                        localPosition[1] + currentPosition[1] - newValue[1],
                        localPosition[2] + currentPosition[2] - newValue[2]
                    ];
                    markLocalDirty();
                }
            },
            /**
             * Local position.
             * @property localPosition
             * @type kick.math.Vec3
             */
            localPosition: {
                get: function () {
                    return Vec3.clone(localPosition);
                },
                set: function (newValue) {
                    Vec3.copy(localPosition, newValue);
                    markLocalDirty();
                }
            },
            /**
             * Local rotation in euler angles.
             * @property localRotationEuler
             * @type kick.math.Vec3
             */
            localRotationEuler: {
                get: function () {
                    var vec = Vec3.create();
                    Quat.toEuler(vec, localRotationQuat);
                    return vec;
                },
                set: function (newValue) {
                    Quat.setEuler(localRotationQuat, newValue);
                    markLocalDirty();
                }
            },
            /**
             * Global rotation in euler angles.
             * @property rotationEuler
             * @type kick.math.Vec3
             */
            rotationEuler: {
                get: function () {
                    var vec = Vec3.create();
                    Quat.toEuler(vec, thisObj.rotation);
                    return vec;
                },
                set: function (newValue) {
                    var tmp = Quat.create();
                    Quat.setEuler(tmp, newValue);
                    this.rotation = tmp;
                }
            },

            /**
             * Global rotation in quaternion.
             * @property rotation
             * @type kick.math.Quat
             */
            rotation: {
                get: function () {
                    var parentIterator = null;
                    if (parentTransform === null) {
                        return Quat.clone(localRotationQuat);
                    }
                    if (dirty[GLOBAL_ROTATION]) {
                        Quat.copy(globalRotationQuat, localRotationQuat);
                        parentIterator = thisObj.parent;
                        while (parentIterator !== null) {
                            Quat.multiply(globalRotationQuat, parentIterator.localRotation, globalRotationQuat);
                            parentIterator = parentIterator.parent;
                        }
                        dirty[GLOBAL_ROTATION] = false;
                    }
                    return globalRotationQuat;
                },
                set: function (newValue) {
                    if (parentTransform === null) {
                        this.localRotation = newValue;
                        return;
                    }
                    var rotationDifference = Quat.create();
                    Quat.difference(rotationDifference, newValue, thisObj.rotation);
                    this.localRotation = Quat.multiply(localRotationQuat, localRotationQuat, rotationDifference);
                }
            },
            /**
             * Local rotation in quaternion.
             * @property localRotation
             * @type kick.math.Quat
             */
            localRotation: {
                get: function () {
                    return localRotationQuat;
                },
                set: function (newValue) {
                    Quat.copy(localRotationQuat, newValue);
                    markLocalDirty();
                }
            },
            /**
             * Local scale.
             * Any zero value will be replaced with an epsilon value.
             * @property localScale
             * @type kick.math.Vec3
             */
            localScale: {
                get: function () {
                    return Vec3.clone(localScale);
                },
                set: function (newValue) {
                    var i;
                    Vec3.copy(localScale, newValue);
                    // replace 0 value with epsilon to prevent a singular matrix
                    for (i = 0; i < localScale.length; i++) {
                        if (localScale[i] === 0) {
                            localScale[i] = Constants._EPSILON;
                        }
                    }
                    markLocalDirty();
                }
            },
            /**
             * Array of children. The children should not be modified directly. Instead use the parent property
             * @property children
             * @type Array_kick.scene.Transform
             */
            children: {
                value: children
            },
            /**
             * Parent transform. Initial null.
             * @property parent
             * @type kick.scene.Transform
             */
            parent: {
                get: function () {
                    return parentTransform;
                },
                set: function (newParent) {
                    if (newParent === this) {
                        Util.fail('Cannot assign parent to self');
                    }
                    if (ASSERT) {
                        if (newParent === undefined) {
                            Util.fail("Cannot set newParent to undefined - should be null");
                        }
                    }
                    if (newParent !== parentTransform) {
                        if (newParent === null) {
                            parentTransform = null;
                            Util.removeElementFromArray(newParent.children, this);
                        } else {
                            parentTransform = newParent;
                            newParent.children.push(this);
                        }
                        markGlobalDirty();
                    }
                }
            },
            /**
             * Name of the component type = "transform".
             * @example
             *      var transform = gameObject.transform;
             * @property componentType
             * @type String
             * @final
             */
            componentType: {value:"transform"}
        });

        /**
         * Changes the rotation of the object to look at input (Transform) object.
         * @method lookAt
         * @param {kick.scene.Transform} transform target object to look at
         * @param {kick.math.Vec3} up the up-vector used in the lookAt
         */
        this.lookAt = function (transform, up) {
            if (ASSERT) {
                if (!(transform instanceof Transform)) {
                    Util.fail("transform must be a kick.scene.Transform");
                }
            }
            Quat.lookAt(localRotationQuat, thisObj.position, transform.position, up);
            markLocalDirty();
        };

        /**
         * Return the local transformation matrix
         * @method getLocalMatrix
         * @return {kick.math.Mat4} local transformation
         */
        this.getLocalMatrix = function () {
            if (dirty[LOCAL]) {
                Mat4.setTRS(localMatrix, localPosition, localRotationQuat, localScale);
                dirty[LOCAL] = 0;
            }
            return localMatrix;
        };

        /**
         * Return the local inverse of translate rotate scale
         * @method getLocalTRSInverse
         * @return {kick.math.Mat4} inverse of local transformation
         */
        this.getLocalTRSInverse = function () {
            if (dirty[LOCAL_INV]) {
                Mat4.setTRSInverse(localMatrixInverse, localPosition, localRotationQuat, localScale);
                dirty[LOCAL_INV] = 0;
            }
            return localMatrixInverse;
        };

        /**
         * @method getGlobalMatrix
         * @return {kick.math.Mat4} global transform
         */
        this.getGlobalMatrix = function () {
            if (dirty[GLOBAL]) {
                Mat4.copy(globalMatrix, thisObj.getLocalMatrix());

                var transformIterator = thisObj.parent;
                while (transformIterator !== null) {
                    Mat4.multiply(globalMatrix, transformIterator.getLocalMatrix(), globalMatrix);
                    transformIterator  = transformIterator.parent;
                }
                dirty[GLOBAL] = 0;
            }
            return globalMatrix;
        };

        /**
         * Return the inverse of global rotate translate transform
         * @method getGlobalTRSInverse
         * @return {kick.math.Mat4} inverse global transform
         */
        this.getGlobalTRSInverse = function () {
            if (dirty[GLOBAL_INV]) {
                Mat4.copy(globalMatrixInverse, thisObj.getLocalTRSInverse());
                var transformIterator = thisObj.parent;
                while (transformIterator !== null) {
                    Mat4.multiply(globalMatrixInverse, globalMatrixInverse, transformIterator.getLocalTRSInverse());
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
        this.toJSON = function () {
            var typedArrayToArray = Util.typedArrayToArray;
            if (ASSERT) {
                if (!thisObj.gameObject) {
                    Util.fail("Cannot serialize a Transform object that has no reference to gameObject");
                }
            }
            return {
                type: "kick.scene.Transform",
                uid: EngineSingleton.engine.getUID(thisObj),
                config: {
                    localPosition: typedArrayToArray(localPosition),
                    localRotation: typedArrayToArray(localRotationQuat),
                    localScale: typedArrayToArray(localScale),
                    parent: parentTransform ? Util.getJSONReference(parentTransform) : null
                }
            };
        };



        /**
         * @method str
         * @return {String} stringify JSON
         */
        this.str = function () {
            return JSON.stringify(thisObj.toJSON());
        };
    };

    return Transform;
});