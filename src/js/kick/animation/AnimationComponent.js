define(["kick/core/Util", "kick/core/Constants", "kick/core/Observable"],
    function (Util, Constants, Observable) {
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
                gameObject;

            /**
             * @method addAnimation
             * @param {kick.animation.Animation} animation
             */
            this.addAnimation = function(animation){
                animation.gameObject = this.gameObject;
                animations.push(animation);
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
                },
                gameObject:{
                    get:function(){
                        return gameObject;
                    },
                    set:function(newValue){
                        var i;
                        gameObject = newValue;
                        for (i = 0; i < animations.length; i++) {
                            animations[i].gameObject = gameObject;
                        }
                    }
                }
            });

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