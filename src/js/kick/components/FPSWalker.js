define(["kick/core", "kick/math", "kick/scene"], function (core, math, scene) {
    "use strict";
        var DEGREE_TO_RADIAN = core.Constants._DEGREE_TO_RADIAN;
        /**
         * A simple walker class which can be added to a camera to navigate in a scene.
         * @class FPSWalker
         * @constructor
         * @extends kick.scene.Component
         * @namespace kick.components
         */
        return function(){
            var engine,
                transform,
                keyInput,
                mouseInput,
                rotateY = 0,
                rotateX = 0,
                time,
                position,
                rotationEuler = math.Vec3.create(),
                forward = "W".charCodeAt(0),
                backward = "S".charCodeAt(0),
                strideLeft = "A".charCodeAt(0),
                strideRight = "D".charCodeAt(0),
                thisObj = this,
                camera,
                updateCameraObject = function () {
                    camera = thisObj.gameObject.getComponentOfType(scene.Camera);
                };

            /**
             * Default behavior is to rotate view whenever mouse in being pressed. The rotation around X axis is clamped
             * to +/- 179 degrees.
             * @method rotateObject
             */
            this.rotateObject = function(){
                if (mouseInput.isButton(0)){
                    var deltaMovement = mouseInput.deltaMovement,
                        rotationSpeed = 1/ (camera.viewportRect[3])*camera.fieldOfView;
                    if (deltaMovement[0] !== 0 || deltaMovement[1] !== 0){
                        // note horizontal movement rotates around Y axis
                        rotateY += deltaMovement[0] * thisObj.rotateSpeedY * rotationSpeed;
                        rotateX += deltaMovement[1] * thisObj.rotateSpeedX * rotationSpeed;
                        rotateX = Math.max(-179, Math.min(179, rotateX));
                        rotationEuler[0] = rotateX;
                        rotationEuler[1] = rotateY;
                        transform.localRotationEuler = rotationEuler;
                    }
                }
            };

            /**
             * Move object based on movement keys (AWSD as default)
             * @method moveObject
             */
            this.moveObject = function(){
                var moveDistance = thisObj.movementSpeed * time.deltaTime,
                    deltaZ = 0,
                    deltaX = 0;
                if (keyInput.isKey(forward)){
                    deltaZ = -moveDistance;
                } else if (keyInput.isKey(backward)){
                    deltaZ = moveDistance;
                }

                if (keyInput.isKey(strideLeft)){
                    deltaX = -moveDistance;
                } else if (keyInput.isKey(strideRight)){
                    deltaX = moveDistance;
                }

                // move in XZ plane
                if (deltaX !== 0 || deltaZ !== 0){
                    var rotateYRadian = -rotateY*DEGREE_TO_RADIAN,
                        cosY = Math.cos(rotateYRadian),
                        sinY = Math.sin(rotateYRadian);
                    // rotate around y
                    position[0] += deltaX * cosY - deltaZ * sinY;
                    position[2] += deltaX * sinY + deltaZ * cosY;

                    // adjust height
                    position[1] = thisObj.getGroundHeight(position[0], position[2]);

                    // update position
                    transform.position = position;
                }
            };

            /**
             * @method setMovementKeys
             * @param {Number} forward_
             * @param {Number} backward_
             * @param {Number} strideLeft_
             * @param {Number} strideRight_
             */
            this.setMovementKeys = function(forward_, backward_, strideLeft_, strideRight_){
                forward = forward_;
                backward = backward_;
                strideLeft = strideLeft_;
                strideRight = strideRight_;
            };

            /**
             * @property movementSpeed
             * @type {number}
             * @default 0.1
             */
            this.movementSpeed = 0.10;
            /**
             * @property rotateSpeedX
             * @type {number}
             * @default 1.0
             */
            this.rotateSpeedX = 1.00;
            /**
             * @property rotateSpeedY
             * @type {number}
             * @default 1.0
             */
            this.rotateSpeedY = 1.00;

            /**
             * Registers the object on activation
             * @method activated
             */
            this.activated = function(){
                engine = core.Engine.instance;
                transform = thisObj.gameObject.transform;
                keyInput = engine.keyInput;
                mouseInput = engine.mouseInput;
                time = engine.time;
                position = transform.position;
                updateCameraObject();
                thisObj.gameObject.addEventListener("componentAdded", updateCameraObject);
                thisObj.gameObject.addEventListener("componentRemoved", updateCameraObject);
            };

            this.deactivated = function(){
                thisObj.gameObject.removeEventListener("componentAdded", updateCameraObject);
                thisObj.gameObject.removeEventListener("componentRemoved", updateCameraObject);
            };

            /**
             * @method update
             */
            this.update = function(){
                if (camera){
                    this.rotateObject();
                    this.moveObject();
                }
            };

            /**
             * Return the height of the ground at position x,z
             * @method getGroundHeight
             * @param {Number} x
             * @param {Number} z
             * @returns {number}
             */
            this.getGroundHeight = function(x,z){
                return 0;
            };
        };
    }
);