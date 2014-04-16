define(["./postfx/CameraRenderToTexture", "./postfx/PostProcessingEffect" /*, "./postfx/BloomPostFX"*/],
    function (CameraRenderToTexture, PostProcessingEffect, BloomPostFX) {
    "use strict";

    return {
        CameraRenderToTexture: CameraRenderToTexture,
        PostProcessingEffect: PostProcessingEffect //,
        //BloomPostFX: BloomPostFX
    };
});