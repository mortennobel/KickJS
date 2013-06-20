define(["./animation/ControlPoint", "./animation/Curve", "./animation/AnimationComponent", "./animation/Animation"],
    function (ControlPoint, Curve, AnimationComponent, Animation) {

        "use strict";

        return {
            AnimationComponent: AnimationComponent,
            Animation: Animation,
            ControlPoint: ControlPoint,
            Curve: Curve
        };
    });
