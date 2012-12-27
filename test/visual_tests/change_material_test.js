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
        var materialIndex = 0;

        var log = function (output) {
            var element = document.getElementById("output");
            element.innerHTML = element.innerHTML+output+"<br>";
        };

        var clearLog = function(){
            var element = document.getElementById("output");
            element.innerHTML = "";
        };

        function setMaterial(vertexShaderId, fragmentShaderId){
            clearLog();
            var vs = document.getElementById(vertexShaderId).value;
            var fs = document.getElementById(fragmentShaderId).value;
            var shader = new KICK.material.Shader();
            shader.vertexShaderSrc = vs;
            shader.fragmentShaderSrc = fs;
            shader.errorLog = log;
            shader.apply();
            var missingAttributes = meshRenderer.mesh.verify(shader);
            if (missingAttributes){
                log("Missing attributes in mesh "+JSON.stringify(missingAttributes));
                return;
            }

            return new KICK.material.Material({
                name:"Some material",
                shader:shader
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

            meshRenderer.mesh = new KICK.mesh.Mesh({dataURI: "kickjs://mesh/cube/?length=0.5"});
            materials[0] = setMaterial('vertexShaderColor','fragmentShader');
            materials[1] = new KICK.material.Material({
                    shader:engine.project.load(engine.project.ENGINE_SHADER_TRANSPARENT_UNLIT),
                    uniformData:{
                        mainTexture:engine.project.load(engine.project.ENGINE_TEXTURE_WHITE),
                        mainColor:[1,1,1,0.5]
                    }
                }
            );
            updateMaterial();
            gameObject.addComponent(meshRenderer);
            addRotatorComponent(gameObject);

            var gameObject2 = engine.activeScene.createGameObject();
            var meshRenderer2 = new KICK.scene.MeshRenderer();
            meshRenderer2.mesh = new KICK.mesh.Mesh({dataURI: "kickjs://mesh/cube/?length=0.5"});
            meshRenderer2.material = materials[0];
            gameObject2.transform.localPosition = [0,0,-1];
            gameObject2.transform.localScale = [1,2,1];
            gameObject2.addComponent(meshRenderer2);
        }

        window.updateMaterial = function (){
            meshRenderer.material = materials[materialIndex];
            materialIndex = (materialIndex+1)%2;
        }

        window.fullscreen = function(){
            if (engine.isFullScreenSupported()){
                engine.setFullscreen(true);
            } else {
                alert('Fullscreen not supported');
            }
            return true;
        }
        initKick();
    }
);