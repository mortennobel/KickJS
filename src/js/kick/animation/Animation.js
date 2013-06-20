define(["kick/core/Util", "kick/core/Constants", "kick/core/Observable", "kick/core/EngineSingleton"],
    function (Util, Constants, Observable, EngineSingleton) {
        "use strict";

        var ASSERT = Constants._ASSERT,
            Animation;

        /**
         *
         * @class Animation
         * @namespace kick.animation
         * @constructor
         * @param {Config} config defines one or more properties
         */
        Animation = function (config) {
            var engine = EngineSingleton.engine,
                time = engine.time,
                eventQueue = engine.eventQueue,
                playing = false,
                localTime = 0,
                gameObject,
                componentNames = [],
                propertyNames = [],
                curves = [],
                wrapMode = Animation.LOOP,
                direction = 1,
                update = function(){
                    var i,
                        maxTime = 0;

                    for (i = 0; i < componentNames.length; i++) {
                        maxTime = Math.max(maxTime, curves[i].endTime);
                    }
                    localTime += time.deltaTime/1000*direction;
                    if (wrapMode === Animation.PINGPONG){
                        if (localTime < 0){
                            localTime *= -1;
                            direction = 1;
                        } else if (localTime > maxTime){
                            localTime = maxTime - (localTime % maxTime);
                            direction = -1;
                        }
                    }
                    if (wrapMode === Animation.LOOP){
                        if (localTime > maxTime){
                            localTime = localTime % maxTime;
                        }
                    }
                    if (wrapMode === Animation.ONCE){
                        if (localTime > maxTime){
                            localTime = maxTime;
                            this.playing = false;
                        }
                    }
                    for (i = 0; i < componentNames.length; i++) {
                        gameObject[componentNames[i]][propertyNames[i]] = curves[i].evaluate(localTime);
                    }
                },
                eventObject;

            Object.defineProperties(this, {
                /**
                 * @property gameObject
                 * @type kick.scene.GameObject
                 */
                gameObject: {
                    set: function(newValue){
                        gameObject = newValue;
                    },
                    get: function(){
                        return gameObject;
                    }
                },
                /**
                 * Used for starting and pausing the animation
                 * @property playing
                 * @type Boolean
                 * @default false
                 */
                playing:{
                    get:function(){
                        return playing;
                    },
                    set:function(newValue){
                        if (playing === newValue){
                            return;
                        }
                        if (ASSERT){
                            if (typeof newValue !== "boolean"){
                                Util.warn("Animation.playing should be boolean");
                            }
                        }
                        playing = newValue;
                        if (playing){
                            eventObject = eventQueue.add(update, 0, 1e+100);
                        } else {
                            eventQueue.cancel(eventObject);
                        }
                    }
                },
                /**
                 * Must be Animation.LOOP, Animation.PINGPONG or Animation.ONCE
                 * @property wrapMode
                 * @type Number
                 * @default Animation.LOOP
                 */
                wrapMode: {
                    set: function(newValue){
                        if (ASSERT){
                            if (newValue !== Animation.LOOP && newValue !== Animation.PINGPONG && newValue !== Animation.ONCE){
                                Util.warn("Animation.wrapMode must be Animation.LOOP, Animation.PINGPONG or Animation.ONCE");
                            }
                        }
                        wrapMode = newValue;
                    },
                    get: function(){
                        return wrapMode;
                    }
                }
            });

            /**
             * @method addCurve
             * @param {kick.animation.Curve} curve
             * @param {String} target componentname.property
             */
            this.addCurve = function(curve, target){
                if (ASSERT){
                    if (target.indexOf('.') === -1){
                        Util.warn("Animation.addCurve target is invalid");
                    }
                }
                var dotIndex = target.indexOf('.'),
                    componentName = target.substring(0,dotIndex),
                    propertyName = target.substring(dotIndex+1);
                curves.push(curve);
                componentNames.push(componentName);
                propertyNames.push(propertyName);
            };

            /**
             * @method removeCurve
             * @param {kick.animation.Curve|string} object removes curve by Object or name
             * @return {Boolean}
             */
            this.removeCurve = function(object){
                var deleted = false,
                    i;
                for (i  = componentNames.length - 1; i >= 0; i--) {
                    if (curves[i] === object || (componentNames[i] + '.' + propertyNames[i]) === object){
                        // remove object
                        curves.splice(i, 1);
                        componentNames.splice(i, 1);
                        propertyNames.splice(i, 1);
                        deleted = true;
                    }
                }
                return deleted;
            };

            /**
             * @method toJSON
             * @return {Object} data object
             */
            this.toJSON = function () {
                return {};
            };

            Util.applyConfig(this, config);
            Util.copyStaticPropertiesToObject(this, Animation);
        };

        Animation.LOOP = 0;
        Animation.PINGPONG = 1;
        Animation.ONCE = 2;

        return Animation;
    }
);