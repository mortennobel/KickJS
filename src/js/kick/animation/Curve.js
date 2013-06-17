define(["kick/core/Util", "kick/core/Constants"],
    function (Util, Constants) {
        "use strict";

        var Curve,
            ASSERT = Constants._ASSERT;

        /**
         *
         * @class Curve
         * @namespace kick.animation
         * @constructor
         * @param {Config} config defines one or more properties
         */
        Curve = function (config) {
            var controlPoints = [],
                curveType = Curve.NUMBER,
                resArray,
                evaluateTangent = [
                    // number
                    function(value, slope, weight){
                        return value + slope * weight;
                    },
                    // vec2
                    function(value, slope, weight){
                        return [
                            value[0] + slope[0] * weight,
                            value[1] + slope[1] * weight
                        ];
                    },
                    // vec3
                    function(value, slope, weight){
                        return [
                            value[0] + slope[0] * weight,
                            value[1] + slope[1] * weight,
                            value[2] + slope[2] * weight
                        ];
                    },
                    // vec4
                    function(value, slope, weight){
                        return [
                            value[0] + slope[0] * weight,
                            value[1] + slope[1] * weight,
                            value[2] + slope[2] * weight,
                            value[3] + slope[3] * weight
                        ];
                    },
                    // quat
                    function(value, slope, weight){
                        resArray[0] = w1 * p1[0] + w2 * p2[0] + w3 * p3[0] + w4 * p4[0];
                        resArray[1] = w1 * p1[1] + w2 * p2[1] + w3 * p3[1] + w4 * p4[1];
                        resArray[2] = w1 * p1[2] + w2 * p2[2] + w3 * p3[2] + w4 * p4[2];
                        resArray[3] = w1 * p1[3] + w2 * p2[3] + w3 * p3[3] + w4 * p4[3];
                        return resArray;
                    }
                ],
                evaluateCurves = [
                    // number
                    function(w1,w2,w3,w4,p1,p2,p3,p4){
                        return w1 * p1 + w2 * p2 + w3 * p3 + w4 * p4;
                    },
                    // vec2
                    function(w1,w2,w3,w4,p1,p2,p3,p4){
                        resArray[0] = w1 * p1[0] + w2 * p2[0] + w3 * p3[0] + w4 * p4[0];
                        resArray[1] = w1 * p1[1] + w2 * p2[1] + w3 * p3[1] + w4 * p4[1];
                        return resArray;
                    },
                    // vec3
                    function(w1,w2,w3,w4,p1,p2,p3,p4){
                        resArray[0] = w1 * p1[0] + w2 * p2[0] + w3 * p3[0] + w4 * p4[0];
                        resArray[1] = w1 * p1[1] + w2 * p2[1] + w3 * p3[1] + w4 * p4[1];
                        resArray[2] = w1 * p1[2] + w2 * p2[2] + w3 * p3[2] + w4 * p4[2];
                        return resArray;
                    },
                    // vec4
                    function(w1,w2,w3,w4,p1,p2,p3,p4){
                        resArray[0] = w1 * p1[0] + w2 * p2[0] + w3 * p3[0] + w4 * p4[0];
                        resArray[1] = w1 * p1[1] + w2 * p2[1] + w3 * p3[1] + w4 * p4[1];
                        resArray[2] = w1 * p1[2] + w2 * p2[2] + w3 * p3[2] + w4 * p4[2];
                        resArray[3] = w1 * p1[3] + w2 * p2[3] + w3 * p3[3] + w4 * p4[3];
                        return resArray;
                    },
                    // quat
                    function(w1,w2,w3,w4,p1,p2,p3,p4){
                        resArray[0] = w1 * p1[0] + w2 * p2[0] + w3 * p3[0] + w4 * p4[0];
                        resArray[1] = w1 * p1[1] + w2 * p2[1] + w3 * p3[1] + w4 * p4[1];
                        resArray[2] = w1 * p1[2] + w2 * p2[2] + w3 * p3[2] + w4 * p4[2];
                        resArray[3] = w1 * p1[3] + w2 * p2[3] + w3 * p3[3] + w4 * p4[3];
                        return resArray;
                    }
                ],
                currentCurveEvaluation = evaluateCurves[curveType],
                currentEvaluateTangent = evaluateTangent[curveType];

            Object.defineProperties(this, {
                curveType: {
                    set: function(newValue){
                        if (curveType === newValue){
                            return;
                        }
                        curveType = newValue;
                        if (curveType === Curve.VEC2){
                            resArray = new Float32Array(2);
                        }
                        if (curveType === Curve.VEC3){
                            resArray = new Float32Array(3);
                        }
                        if (curveType === Curve.VEC4){
                            resArray = new Float32Array(4);
                        }
                        if (ASSERT){
                            if (controlPoints.length > 0){
                                Util.warn("Cannot change curvetype when curve is not empty");
                            }
                        }
                        currentCurveEvaluation = evaluateCurves[curveType];
                        currentEvaluateTangent = evaluateTangent[curveType];
                    },
                    get: function(){
                        return curveType;
                    }
                }
            });

            /**
             * Removes all control points within the curve
             * @method clear
             */
            this.clear = function(){
                controlPoints.length = 0;
            };

            /**
             * @method addControlPoint
             * @param {kick.animation.ControlPoint} controlPoint
             */
            this.addControlPoint = function(controlPoint){
                var i = 0;
                for (;i < controlPoints.length; i++) {
                    if (controlPoint.time < controlPoints[i]){
                        break;
                    }
                }
                controlPoints.splice(i, 0, controlPoint);
            };

            /**
             * @method evaluate
             * @param time
             * @returns {*}
             */
            this.evaluate = function(time){
                var i,
                    from,
                    to,
                    timeDelta,
                    u,
                    uMinusOne,
                    w1,
                    w2,
                    w3,
                    w4,
                    p0,
                    p1,
                    p2,
                    p3;
                if (time < controlPoints[0].time){
                    return controlPoints[0].time;
                }
                // find two end points
                for (i=1;controlPoints[i].time<time && i < controlPoints.length;i++){
                    // do nothing
                }
                if (i === controlPoints.length) {
                    return controlPoints[i-1].value;
                }
                from = controlPoints[i-1];
                to = controlPoints[i];
                timeDelta = to.time - from.time;
                u = (time - from.time) / timeDelta;
                uMinusOne = 1-u;
                p0 = from.value;
                p1 = currentEvaluateTangent(from.value,from.outSlope, 1/3);
                p2 = currentEvaluateTangent(to.value,to.inSlope, -1/3);
                p3 = to.value;
                w1 = uMinusOne * uMinusOne * uMinusOne;
                w2 = 3 * u * uMinusOne * uMinusOne;
                w3 = 3 * u * u * uMinusOne;
                w4 = u * u * u;

                return currentCurveEvaluation(w1, w2, w3, w4, p0, p1, p2, p3);
            };
        };

        Curve.NUMBER = 0;
        Curve.VEC2 = 1;
        Curve.VEC3 = 2;
        Curve.VEC4 = 3;
        Curve.QUAT = 4;

        return Curve;
    }
);