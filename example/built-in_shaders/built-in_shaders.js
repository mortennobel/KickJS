requirejs.config({
    baseUrl: '.',
    paths: {
        kick: location.search === "?debug" ? '../../src/js/kick': '../../build/kick',
        shaders: 'js',
        text: '../../dependencies/text'
    }
});

requirejs(['kick', 'shaders/Scene', 'shaders/GUI'],
    function (kick,Scene, GUI) {
        "use strict";
        var engine = new kick.core.Engine('canvas', {
            shadows: true,
            enableDebugContext: location.search === "?debug" // debug enabled if query == debug
        });
        var scene = new Scene(engine);
        new GUI(scene);
    }
);