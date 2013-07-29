define(["kick/core/Constants", "kick/core/Observable", "kick/texture/Texture", "kick/texture/RenderTexture", "kick/core/Graphics"],
    function (Constants, Observable, Texture, RenderTexture, Graphics) {
        "use strict";

        /**
         * @class CameraRenderToTexture
         * @namespace kick.postfx
         * @extends kick.scene.Component
         * @constructor
         * @param {Config}
         */
        return function CameraRenderToTexture(){
            var camera,
                engine,
                thisObj = this,
                texture = new Texture(),
                renderTexture,
                width,
                height,
                scale = 1.0,
                postProcessingEffects = [],
                postRender = function(){
                    var t = texture,
                        i;
                    for (i=0;i<postProcessingEffects.length;i++){
                        t = postProcessingEffects[i].renderPostEffect();
                    }
                    Graphics.drawTexture(t);
                };

            Object.defineProperties(this, {
                scale: {
                    get:function(){
                        return scale;
                    },
                    set:function(newValue){
                        scale = newValue;
                    }
                },
                texture: {
                    get:function(){
                        return texture;
                    }
                }
            });

            Observable.call(this, [
                /**
                 * @event screenSizeChanged
                 * @param {kick.math.Vec2} size
                 */
                "screenSizeChanged"
            ]
            );

            /**
             * @method addEffect
             * @param {kick.postfx.PostProcessingEffect} effect
             */
            this.addEffect = function(effect){
                postProcessingEffects.push(effect);
            };

            /**
             * Clear the effects queue
             * @method clearEffects
             */
            this.clearEffects = function(){
                postProcessingEffects.length = 0;
            };

            this.activated = function(){
                var i;
                engine = thisObj.gameObject.scene.engine;
                texture.generateMipmaps = false;
                texture.minFilter = Constants.GL_NEAREST;
                texture.magFilter = Constants.GL_NEAREST;
                texture.wrapS = Constants.GL_CLAMP_TO_EDGE;
                texture.wrapT = Constants.GL_CLAMP_TO_EDGE;
                width = engine.canvasDimension[0];
                height = engine.canvasDimension[1];
                texture.setImageData(width, height, 0, Constants.GL_FLOAT, null, "");
                renderTexture = new RenderTexture({colorTexture: texture});
                camera = thisObj.gameObject.camera;
                camera.renderTarget = renderTexture;
                camera.addEventListener("postRender", postRender);
                for (i=0;i<postProcessingEffects.length;i++){
                    postProcessingEffects[i].activated(engine);
                }
                thisObj.fireEvent("screenSizeChanged", [width, height]);
            };

            this.deactivated = function(){
                camera.removeEventListener("postRender", postRender);
            };

            this.update = function(){
                var i;
                if (width !== engine.canvasDimension[0]*scale || height !== engine.canvasDimension[1]*scale){
                    width = engine.canvasDimension[0]*scale;
                    height = engine.canvasDimension[1]*scale;
                    texture.setImageData(width, height, 0, Constants.GL_FLOAT, null, "");
                    renderTexture.colorTexture = texture;
                    for (i=0;i<postProcessingEffects.length;i++){
            //            postProcessingEffects[i].update();
                    }
                    thisObj.fireEvent("screenSizeChanged", [width, height]);
                }
            };
        };
    });
