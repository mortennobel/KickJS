define(["kick/core/Constants", "kick/texture/RenderTexture", "kick/texture/Texture", "kick/core/Graphics", "kick/core/EngineSingleton"],
    function (Constants, RenderTexture, Texture, Graphics, EngineSingleton) {
        "use strict";

        /**
         * @class PostProcessingEffect
         * @namespace kick.postfx
         * @extends kick.scene.Component
         * @constructor
         * @param {Config}
         */
        return function PostProcessingEffect(){
            var engine,
                texture = new Texture(),
                material,
                renderTexture,
                width,
                height;

            this.scale = 1.0;

            this.activated = function(){
                engine = EngineSingleton.engine;
                texture.generateMipmaps = false;
                texture.minFilter = Constants.GL_NEAREST;
                texture.magFilter = Constants.GL_NEAREST;
                texture.wrapS = Constants.GL_CLAMP_TO_EDGE;
                texture.wrapT = Constants.GL_CLAMP_TO_EDGE;
                width = engine.canvasDimension[0];
                height = engine.canvasDimension[1];
                texture.setImageData(width, height, 0, Constants.GL_FLOAT, null, "");
                renderTexture = new RenderTexture({colorTexture: texture});
            };

            this.deactivated = function(){
                renderTexture.destroy();
                texture.destroy();
            };

            Object.defineProperties(this, {
                texture: {
                    get:function(){
                        return texture;
                    }
                },
                material:{
                    get:function(){
                        return material;
                    },
                    set:function(newMaterial){
                        material = newMaterial;
                    }
                }
            });

            this.renderPostEffect = function(){
                if (material){
                    if (width !== engine.canvasDimension[0]*this.scale || height !== engine.canvasDimension[1]*this.scale){
                        width = engine.canvasDimension[0]*this.scale;
                        height = engine.canvasDimension[1]*this.scale;
                        console.log("Resize to "+width+","+height);
                        texture.setImageData(width, height, 0, Constants.GL_FLOAT, null, "");
                        renderTexture.colorTexture = texture;
                    }


                    Graphics.renderToTexture(renderTexture, material);
                }
                return texture;
            };
        };
    });
