requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        kick: '../../../../src/js/kick'
    }
});

requirejs(['kick/all'],
    function (KICK) {
        "use strict";
        var engine;
        var meshRenderer;
        var materials = [];
        var materialIndex = 0;

        var log = function (output) {
            var element = document.getElementById("output");
            element.innerHTML = element.innerHTML+output+"<br>";
        };

        var clearLog = function(){
            var element = document.getElementById("output");
            element.innerHTML = "";
        };

        function createMaterial(color){
            return new KICK.material.Material(engine,{
                name:"Some material",
                shader:engine.project.load(engine.project.ENGINE_SHADER_DIFFUSE),
                uniformData:{
                    mainColor: color
                }
            });
        }

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

        function updateMaterial (){
            meshRenderer.material = materials[materialIndex];
            materialIndex = (materialIndex+1)%2;
        }

        window.updateMaterial = updateMaterial;

        function initKick() {
            engine = new KICK.core.Engine('canvas',{
                enableDebugContext: true
            });
            var cameraObject = engine.activeScene.createGameObject();
            var camera = new KICK.scene.Camera({
                clearColor: [0,0,0,1],
                perspective: false,
                near:-1,
                far:1
            });
            cameraObject.addComponent(camera);

            var gameObject = engine.activeScene.createGameObject();
            meshRenderer = new KICK.scene.MeshRenderer();

            meshRenderer.mesh = new KICK.mesh.Mesh(engine,{dataURI: "kickjs://mesh/cube/?length=0.5"});
            materials[0] = createMaterial([0,1,0,1]);
            materials[1] = createMaterial([1,0,0,1]);
            updateMaterial();
            gameObject.addComponent(meshRenderer);
            addRotatorComponent(gameObject);

            var gameObject2 = engine.activeScene.createGameObject();
            var meshRenderer2 = new KICK.scene.MeshRenderer();
            meshRenderer2.mesh = new KICK.mesh.Mesh(engine,{dataURI: "kickjs://mesh/cube/?length=0.5"});
            meshRenderer2.material = materials[0];
            gameObject2.transform.localPosition = [0,0,-1];
            gameObject2.transform.localScale = [1,2,1];
            gameObject2.addComponent(meshRenderer2);

            var gameObject3 = engine.activeScene.createGameObject();
            var meshRenderer3 = new KICK.scene.MeshRenderer();
            meshRenderer3.mesh = new KICK.mesh.Mesh(engine,{dataURI: "kickjs://mesh/cube/?length=0.5"});
            meshRenderer3.material = materials[0];
            gameObject3.transform.localPosition = [0,0,-1];
            gameObject3.transform.localScale = [1.5,1.5,1];
            gameObject3.addComponent(meshRenderer3);

            var lightComponent = new KICK.scene.Light({
                type:KICK.scene.Light.TYPE_AMBIENT,
                color: [0.5,0.5,0.5]
            });

            gameObject2.addComponent(lightComponent);
        }


        initKick();
    });