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
requirejs(['kick/core/Engine'],
    function (Engine) {
        var engine = new Engine('canvas');
    }
);
/*
    // init engine (create 3d context)
    var engine = new KICK.core.Engine('canvas');
    // create a game object in [0,0,0] facing down the -z axis
    var cameraObject = engine.activeScene.createGameObject();
    cameraObject.transform.position = [0,0,5];
    // create a orthographic camera
    var camera = new KICK.scene.Camera({
        perspective: false,
        left:-5,
        right:5,
        top:5,
        bottom:-5
    });
    cameraObject.addComponent(camera);
    // create material
    var shader = engine.project.load(engine.project.ENGINE_SHADER_UNLIT);
    var material = new KICK.material.Material(engine,{
        shader: shader,
        uniformData:{
            mainColor: [1,1,1,1]
        }
    });
    // create meshes
    var meshes = [engine.project.ENGINE_MESH_TRIANGLE, engine.project.ENGINE_MESH_CUBE];
    for (var i=0;i<meshes.length;i++){
        var gameObject = engine.activeScene.createGameObject();
        gameObject.transform.position = [-2.0+4*i,0,0];
        var meshRenderer = new KICK.scene.MeshRenderer();
        meshRenderer.mesh = engine.project.load(meshes[i]);
        meshRenderer.material = material;
        gameObject.addComponent(meshRenderer);
    }

});
*/