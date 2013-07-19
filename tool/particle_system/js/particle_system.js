requirejs.config({
    baseUrl: '.',
    paths: {
//        kick: location.search === "?debug" ? '../../build/kick-debug': '../../build/kick'
        kick: '../../src/js/kick'
    }
});

requirejs(['kick', 'js/DataContainer', 'js/GUI'],
    function (kick, DataContainer, GUI) {
        "use strict";

        var engine = new kick.core.Engine('canvas',{
            enableDebugContext: location.search === "?debug" // debug enabled if query == debug
        });
        var cameraObject = engine.activeScene.createGameObject();
        cameraObject.name = "Camera";
        var camera = new kick.scene.Camera({
            clearColor: [0,0,0,1],
            fieldOfView:40,
            far:100
        });
        cameraObject.transform.localPosition = [0,0,10];
        cameraObject.addComponent(camera);
        cameraObject.addComponent(new kick.components.FullWindow());

        var particleSystemGameObject = engine.activeScene.createGameObject();
        var particleSystem = new kick.particlesystem.ParticleSystem();
        particleSystemGameObject.addComponent(particleSystem);

        var obj = new DataContainer(particleSystem);
        new GUI(obj);


    }
);
