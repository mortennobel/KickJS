requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        kick: '../../../../src/js/kick'
    }
});

requirejs(['kick'],
    function (KICK) {
        "use strict";

        var engine;
        var meshRenderer;
        var materials = [];

        var log = function (output) {
            var element = document.getElementById("output");
            element.innerHTML = element.innerHTML+output+"<br>";
        };

        var clearLog = function(){
            var element = document.getElementById("output");
            element.innerHTML = "";
        };

        var createMaterials = function(){
            var vs = document.getElementById("vertexShaderColor").value;
            var fs = document.getElementById("fragmentShader").value;
            var shader = new KICK.material.Shader();
            shader.vertexShaderSrc = vs;
            shader.fragmentShaderSrc = fs;
            shader.errorLog = log;
            shader.apply();

            materials[0] = new KICK.material.Material({
                name:"Material.002",
                shader:shader,
                uniformData:{
                    color:  [1,0,0]
                }
            });
            materials[1] = new KICK.material.Material({
                name:"Material.003",
                shader:shader,
                uniformData:{
                    color:  [0,1,0]
                }
            });
        };

        function recalculateNormals(){
            clearLog();
            var mesh = meshRenderer.mesh;
            mesh.recalculateNormals();
            mesh.updateData();
        }

        function recalculateTangents(){
            clearLog();
            var mesh = meshRenderer.mesh;
            mesh.recalculateTangents();
            mesh.updateData();
        }

        function addRotatorComponent(gameObject){
            var time = engine.time,
                transform = gameObject.transform,
                rotationSpeed = 0.05,
                rotation = transform.localRotationEuler;
            gameObject.addComponent({
                update: function(){
                    rotation[1] += time.deltaTime*rotationSpeed;
                    transform.localRotationEuler = rotation;
                }
            });
        }

        function debugMesh(meshData){

        }

        function initKick() {
            engine = new KICK.core.Engine('canvas',{
                enableDebugContext: true
            });
            var cameraObject = engine.activeScene.createGameObject();
            var camera = new KICK.scene.Camera({
                clearColor: [0,0,0,1],
                perspective: false,
                near:-2,
                far:2,
                left:-2,
                right:2,
                top:2,
                bottom:-2
            });
            cameraObject.addComponent(camera);
            cameraObject.addComponent(new KICK.scene.Light({type:KICK.scene.Light.TYPE_DIRECTIONAL}));

            createMaterials();

            var res = KICK.importer.ColladaImporter.import( document.getElementById("colladaFileContent").value, engine.activeScene);
            var gameObjects = res.gameObjects;
            console.log("Imported "+gameObjects.length+"gameObjectss");
            for (var i=0;i<gameObjects.length;i++){
                var gameObject = gameObjects[i];
                var meshRenderers = gameObject.getComponentsOfType(KICK.scene.MeshRenderer);
                console.log("Number of mesh renderers "+meshRenderers.length);
                for (var j=0;j<meshRenderers.length;j++){
                    meshRenderer = meshRenderers[j];
                    meshRenderer.materials = materials;
                    var meshData = meshRenderer.mesh.meshData;
                    meshData.recalculateNormals();
                    console.log("Is valid: "+meshData.isValid());
                    console.log(KICK.math.Vec3.wrapArray( meshData.vertex));
                    meshRenderer.mesh.meshData = meshData;
                    debugMesh(meshData);
                    console.log("Number of subMeshes"+meshData.subMeshes.length);

                }
                addRotatorComponent(gameObject);
            }
        }
        initKick();
    });