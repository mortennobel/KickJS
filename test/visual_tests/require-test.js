requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "kick",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        kick: '../../../../src/js/kick'
    }
});

// Start the main app logic.
requirejs(['kick/core/Engine', 'kick/scene/Camera', 'kick/material/Material', 'kick/scene/MeshRenderer'],
    function (Engine, Camera, Material, MeshRenderer) {
        var engine = new Engine('canvas');
        var cameraObject = engine.activeScene.createGameObject();
        cameraObject.transform.position = [0, 0, 5];
        // create a orthographic camera
        var camera = new Camera({
            perspective: false,
            left:-5,
            right:5,
            top:5,
            bottom:-5
        });
        cameraObject.addComponent(camera);
        // create material
        var shader = engine.project.load(engine.project.ENGINE_SHADER_UNLIT);
        var material = new Material({
            shader: shader,
            uniformData: {
                mainColor: [1, 1, 1, 1]
            }
        });
        // create meshes
        var meshes = [engine.project.ENGINE_MESH_TRIANGLE, engine.project.ENGINE_MESH_CUBE];
        for (var i=0;i<meshes.length;i++){
            var gameObject = engine.activeScene.createGameObject();
            gameObject.transform.position = [-2.0+4*i,0,0];
            var meshRenderer = new MeshRenderer();
            meshRenderer.mesh = engine.project.load(meshes[i]);
            meshRenderer.material = material;
            gameObject.addComponent(meshRenderer);
        }
    }
);