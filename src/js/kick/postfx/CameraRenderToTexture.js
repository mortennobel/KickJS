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
                material,
                renderTexture,
                width,
                height,
                postProcessingEffects = [];

            this.scale = 1.0;

            Observable.call(this, [
            /**
             * @event screenSizeChanged
             * @param {kick.math.Vec2} size
             */
                "screenSizeChanged"
            ]
            );

            this.addEffect = function(effect){
                postProcessingEffects.push(effect);
            };

            this.activated = function(){
                var i;
                engine = thisObj.gameObject.scene.engine;
                texture.generateMipmaps = false;
                texture.minFilter = Constants.GL_NEAREST;
                texture.magFilter = Constants.GL_NEAREST;
                texture.wrapS = Constants.GL_CLAMP_TO_EDGE;
                texture.wrapT = Constants.GL_CLAMP_TO_EDGE;
                texture.float = Constants.GL_CLAMP_TO_EDGE;
                width = engine.canvasDimension[0];
                height = engine.canvasDimension[1];
                texture.setImageData(width, height, 0, Constants.GL_FLOAT, null, "");
                renderTexture = new RenderTexture({colorTexture: texture});
                camera = thisObj.gameObject.camera;
                camera.renderTarget = renderTexture;
                camera.addEventListener("postRender", function(){
                    var t = texture,
                        i;
                    for (i=0;i<postProcessingEffects.length;i++){
                        t = postProcessingEffects[i].renderPostEffect();
                    }
                    Graphics.drawTexture(t);
                });
                for (i=0;i<postProcessingEffects.length;i++){
                    postProcessingEffects[i].activated(engine);
                }
                thisObj.fireEvent("screenSizeChanged", [width, height]);
            };

            Object.defineProperties(this, {
                texture: {
                    get:function(){
                        return texture;
                    }
                }
            });

            this.update = function(){
                var i;
                if (width !== engine.canvasDimension[0]*this.scale || height !== engine.canvasDimension[1]*this.scale){
                    width = engine.canvasDimension[0]*this.scale;
                    height = engine.canvasDimension[1]*this.scale;
                    texture.setImageData(width, height, 0, Constants.GL_FLOAT, null, "");
                    renderTexture.colorTexture = texture;
                    for (i=0;i<postProcessingEffects.length;i++){
                        postProcessingEffects[i].update();
                    }
                    thisObj.fireEvent("screenSizeChanged", [width, height]);
                }
            };
        };
    });
