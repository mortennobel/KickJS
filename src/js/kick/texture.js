define(["./texture/MovieTexture", "./texture/RenderTexture", "./texture/Texture"],
    function (MovieTexture, RenderTexture, Texture) {
        "use strict";

        return {
            MovieTexture: MovieTexture,
            RenderTexture: RenderTexture,
            Texture: Texture
        };
    });