define(["kick"], function (KICK) {
    "use strict";
    var vec3 = KICK.math.Vec3,
        quat = KICK.math.Quat;

    return function(){
        var thisObj = this,
                time,
                transform,
                mouseRotationSpeed = 0.01,
                mouseInput,
                cartesianCoordinates = vec3.create(),
                sphericalCoordinates = vec3.clone([14,1.5707963267949,1]);

        this.activated = function(){
            var gameObject = thisObj.gameObject,
                engine = gameObject.engine;
            transform = gameObject.transform;
            time = engine.time;
            mouseInput = engine.mouseInput;
            mouseInput.mouseWheelPreventDefaultAction = true;
        };

        this.update = function(){
            if (mouseInput.isButton(2)){
                var mouseDelta = mouseInput.deltaMovement;
                sphericalCoordinates[1] -= mouseDelta[0]*mouseRotationSpeed;
                sphericalCoordinates[2] += mouseDelta[1]*mouseRotationSpeed;
                sphericalCoordinates[2] = Math.max(0,sphericalCoordinates[2]);
                sphericalCoordinates[2] = Math.min(Math.PI*0.499,sphericalCoordinates[2]);
            }
            vec3.sphericalToCarterian(sphericalCoordinates,cartesianCoordinates);
            transform.position = cartesianCoordinates;
            transform.localRotation = quat.lookAt(cartesianCoordinates,[0,0,0],[0,1,0]);
        };
    };
});