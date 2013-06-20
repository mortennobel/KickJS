define(["kick/core/Util", "kick/core/Constants", "kick/core/Observable"],
    function (Util, Constants, Observable) {
        "use strict";

        /**
         *
         * @class ControlPoint
         * @namespace kick.animation
         * @constructor
         * @param {Config} config defines one or more properties
         */
        return function (config) {
            var time,
                value,
                inSlope,
                outSlope,
                thisObj = this;

            /**
             * Fired when a control point has been updated
             * @event changed
             * @param {kick.animation.ControlPoint} controlPoint
             */
            Observable.call(this,["changed"]);

            Object.defineProperties(this, {
                /**
                 * @property time
                 * @type Number
                 */
                time: {
                    get: function(){
                        return time;
                    },
                    set:function(newValue){
                        time = newValue;
                        thisObj.fireEvent("changed", thisObj);
                    },
                    enumerable: true
                },
                /**
                 * @property value
                 * @type Number|kick.math.Vec2|kick.math.Vec3|kick.math.Vec4
                 */
                value: {
                    get: function(){
                        return value;
                    },
                    set:function(newValue){
                        value = newValue;
                        thisObj.fireEvent("changed", thisObj);
                    },
                    enumerable: true
                },
                /**
                 * @property inSlope
                 * @type Number|kick.math.Vec2|kick.math.Vec3|kick.math.Vec4
                 */
                inSlope: {
                    get: function(){
                        return inSlope;
                    },
                    set:function(newValue){
                        inSlope = newValue;
                        thisObj.fireEvent("changed", thisObj);
                    },
                                        enumerable: true
                },
                /**
                 * @property outSlope
                 * @type Number|kick.math.Vec2|kick.math.Vec3|kick.math.Vec4
                 */
                outSlope: {
                    get: function(){
                        return outSlope;
                    },
                    set:function(newValue){
                        outSlope = newValue;
                        thisObj.fireEvent("changed", thisObj);
                    },
                                        enumerable: true
                }
            });

            /**
             * @method toJSON
             * @return {Object} data object
             */
            this.toJSON = function () {
                return {time:time,
                    value:value instanceof Float32Array ? Util.typedArrayToArray(value) : value ,
                    inSlope: inSlope instanceof Float32Array ? Util.typedArrayToArray(inSlope) : inSlope,
                    outSlope:outSlope instanceof Float32Array ? Util.typedArrayToArray(outSlope) : outSlope
                };
            };

            Util.applyConfig(this, config);
        };
    }
);