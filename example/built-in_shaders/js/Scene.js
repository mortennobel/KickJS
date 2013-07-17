define(["kick"],
    function (kick) {
        "use strict";
        return function(engine){
            var scene = engine.activeScene,
                thisObj = this;

            var cameraGameObject = scene.createGameObject();
            cameraGameObject.addComponent(new kick.components.FullWindow());
            cameraGameObject.addComponent(new kick.components.FPSWalker());
            cameraGameObject.transform.position = [0,0,10];
            var camera = new kick.scene.Camera({
                renderShadow: true
            });
            this.camera = camera;
            camera.clearColor = [0,1,0,1];
            cameraGameObject.addComponent(camera);

            function addGeometry(name, currentMesh){
                thisObj[name] = {};
                var objectGO = scene.createGameObject();
                thisObj[name].transform = objectGO.transform;
                var meshRenderer = new kick.scene.MeshRenderer();
                meshRenderer.mesh = engine.project.load(currentMesh);
                var currentShader = engine.project.ENGINE_SHADER_SPECULAR;
                var shaderUniformData = {
                    specularColor: [1,1,1,1],
                    specularExponent: 12
                };
                meshRenderer.material = new kick.material.Material({
                    shader: engine.project.load(currentShader),
                    uniformData: shaderUniformData
                });

                objectGO.addComponent(meshRenderer);
                Object.defineProperties(thisObj[name], {
                    objectMesh:{
                        get:function(){
                            return currentMesh;
                        },
                        set:function(newValue){

                            currentMesh = parseInt(newValue);
                            meshRenderer.mesh = engine.project.load(currentMesh);
                        }
                    },
                    shader:{
                        get:function(){
                            return currentShader;
                        },
                        set:function(newValue){
                            currentShader = parseInt(newValue);
                            meshRenderer.material.shader = engine.project.load(currentShader);
                        }
                    },
                    mainColor:{
                        get:function(){
                            return meshRenderer.material.getUniform ( "mainColor" );
                        },
                        set:function(newValue){
                            meshRenderer.material.setUniform ( "mainColor",  newValue);
                        }
                    },
                    specularColor:{
                        get:function(){
                            var value = meshRenderer.material.getUniform ( "specularColor" );
                            if (!value){
                                value = [0,0,0,1];
                            }
                            return value;
                        },
                        set:function(newValue){
                            meshRenderer.material.setUniform ( "specularColor",  newValue);
                        }
                    },
                    specularExponent:{
                        get:function(){
                            var val = meshRenderer.material.getUniform ( "specularExponent" )[0];
                            if (!val){
                                val = 50;
                            }
                            return val;
                        },
                        set:function(newValue){
                            meshRenderer.material.setUniform ( "specularExponent",  new Float32Array([newValue]));
                        }
                    }
                });
            }

            var shadow = true;
            Object.defineProperties(this, {
                shadow:{
                    get:function(){
                        return shadow;
                    },
                    set:function(newValue){
                        shadow = newValue;
                        camera.renderShadow = shadow;
                        lightComponent.shadow = shadow;
                    }
                }
            })
            camera.renderShadow = shadow;

            addGeometry("object", engine.project.ENGINE_MESH_UVSPHERE);
            addGeometry("floor", engine.project.ENGINE_MESH_PLANE);

            this.floor.transform.localRotationEuler = [-90,0,0];
            this.floor.transform.localPosition = [0,-2,0];
            this.floor.transform.localScale = [100,100,100];

            var directionalLightGO = scene.createGameObject();
            directionalLightGO.transform.localRotationEuler = [-80,0,0];
            var lightComponent = new kick.scene.Light({type:kick.scene.Light.TYPE_DIRECTIONAL});
            lightComponent.shadow = shadow;
            directionalLightGO.addComponent(lightComponent);
            this.directionalLight = lightComponent;
            this.directionalLightTransform = directionalLightGO.transform;

            var ambLightComponent = new kick.scene.Light({
                type:kick.scene.Light.TYPE_AMBIENT,
                color:[0.1,0.1,0.1]
            });
            directionalLightGO.addComponent(ambLightComponent);
            this.ambientLight = ambLightComponent;
        };
    }
);