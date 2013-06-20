define(["kick/core/Util", "kick/core/Constants", "kick/core/Observable", "kick/core/EngineSingleton"],
    function (Util, Constants, Observable, EngineSingleton) {
        "use strict";

        var ASSERT = Constants._ASSERT;

        /**
         *
         * @class AnimationComponent
         * @namespace kick.animation
         * @constructor
         * @param {Config} config defines one or more properties
         */
        return function (config) {
            var thisObj = this,
                animations = [],
                runningAnimations = [],
                time = EngineSingleton.engine.time,
                animationStarted = function(animation){
                    runningAnimations.push(animation);
                },
                animationStopped = function(animation){
                    Util.removeElementFromArray(runningAnimations, animation);
                },
                animationUpdateRequested = function(animation){
                    animation._update(0, thisObj.gameObject);
                };

            /**
             * @method addAnimation
             * @param {kick.animation.Animation} animation
             */
            this.addAnimation = function(animation){
                animations.push(animation);
                animation.addEventListener("started", animationStarted);
                animation.addEventListener("stopped", animationStopped);
                animation.addEventListener("updateRequested", animationUpdateRequested);
            };

            /**
             * @method removeAnimation
             * @param {kick.animation.Animation} animation
             */
            this.removeAnimation = function(animation){
                var i;
                for (i = animations.length - 1; i >= 0; i--) {
                    if (animations[i] === animation){
                        animations.splice(i, 1);
                        animation.addEventListener("started", animationStarted);
                        animation.addEventListener("stopped", animationStopped);
                        animation.addEventListener("updateRequested", animationUpdateRequested);
                    }
                }
            };

            /**
             * @method getAnimation
             * @param {Number} index
             * @return {kick.animation.Animation}
             */
            this.getAnimation = function(index){
                if (ASSERT){
                    if (animations.length <= index){
                        Util.warn("AnimationComponent.getAnimation index out of bounds");
                        return null;
                    }
                }
                return animations[index];
            };

            Object.defineProperties(this, {
                /**
                 * @property count
                 * @type Number
                 */
                count: {
                    get:function(){
                        return animations.length;
                    }
                }
            });

            this.update = function(){
                var i,
                    gameObject = thisObj.gameObject,
                    tSeconds = time.deltaTime / 1000;
                for (i = 0; i < runningAnimations.length; i++){
                    runningAnimations[i]._update(tSeconds, gameObject);
                }
            };

            /**
             * Set the scriptPriority to 1 (invoked before other scripts)
             * @property scriptPriority
             * @type {number}
             * @default 1
             */
            this.scriptPriority = 1;

            /**
             * @method toJSON
             * @return {Object} data object
             */
            this.toJSON = function () {
                return {};
            };

            Util.applyConfig(this, config);
        };
    }
);