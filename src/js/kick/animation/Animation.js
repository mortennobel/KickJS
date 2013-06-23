define(["kick/core/Util", "kick/core/Constants", "kick/core/Observable"],
    function (Util, Constants, Observable) {
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
            var thisObj = this,
                playing = false,
                localTime = 0,
                componentNames = [],
                propertyNames = [],
                curves = [],
                wrapMode = Animation.LOOP,
                direction = 1,
                speed = 1;

            /**
             * Fired when a animation is started
             * @event started
             * @param {kick.animation.Animation} animation
             */
            /**
             * Fired when a animation is stopped
             * @event stopped
             * @param {kick.animation.Animation} animation
             */
            /**
             * Fired when
             * @event updateRequested
             * @param {kick.animation.Animation} animation
             */
            /**
             * Fired when animation is looped or changed direction (in ping pong)
             * @event animationLoop
             * @param {kick.animation.Animation} animation
             */
            Observable.call(this,["started", "stopped","updateRequested", "animationLoop"]);


            Object.defineProperties(this, {
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
                        thisObj.fireEvent(playing?"started":"stopped", thisObj);
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
                },
                /**
                 * Animation speed
                 * @property speed
                 * @type Number
                 * @default 1
                 */
                speed: {
                    set: function(newValue){
                        speed = newValue;
                    },
                    get: function(){
                        return speed;
                    }
                },
                /**
                 * Animation time
                 * @property time
                 * @type Number
                 * @readonly
                 */
                time:{
                    get: function(){
                        return localTime;
                    }
                }
            });

            /**
             * Set animationTime
             * @method setTime
             * @param {Number} newTime
             * @param {Boolean} forceUpdate will instantly update animation
             */
            this.setTime = function(newTime, forceUpdate){
                localTime = newTime;
                if (forceUpdate){
                    thisObj.fireEvent("updateRequested", thisObj);
                }
            };

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
             * @method _update
             * @param {Number} timeSeconds
             * @param {kick.scene.GameObject} gameObject
             */
            this._update = function(timeSeconds, gameObject){
                var i,
                    maxTime = 0;

                for (i = 0; i < componentNames.length; i++) {
                    maxTime = Math.max(maxTime, curves[i].endTime);
                }
                localTime += timeSeconds*speed*direction;
                if (wrapMode === Animation.PINGPONG){
                    if (localTime < 0){
                        localTime *= -1;
                        direction = 1;
                        thisObj.fireEvent("animationLoop", thisObj);
                    } else if (localTime > maxTime){
                        localTime = maxTime - (localTime % maxTime);
                        direction = -1;
                        thisObj.fireEvent("animationRestart", thisObj);
                    }
                }
                if (wrapMode === Animation.LOOP){
                    if (localTime > maxTime){
                        localTime = localTime % maxTime;
                        thisObj.fireEvent("animationLoop", thisObj);
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