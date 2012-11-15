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

        var log = function (output) {
            var element = document.getElementById("output");
            element.innerHTML = element.innerHTML+output+"<br>";
        };

        var clearLog = function(){
            var element = document.getElementById("output");
            element.innerHTML = "";
        };

        function setMaterial(vertexShaderId, fragmentShaderId, meshRenderer){
            clearLog();
            var vs = document.getElementById(vertexShaderId).value;
            var fs = document.getElementById(fragmentShaderId).value;
            var shader = new KICK.material.Shader(engine);
            shader.vertexShaderSrc = vs;
            shader.fragmentShaderSrc = fs;
            shader.errorLog = log;
            shader.apply();
            var missingAttributes = meshRenderer.mesh.verify(shader);
            if (missingAttributes){
                log("Missing attributes in mesh "+JSON.stringify(missingAttributes));
                return;
            }

            meshRenderer.material = new KICK.material.Material(engine,{
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
                rotationSpeed = 0.001,
                translation = transform.localPosition,
                rotVec = transform.localRotationEuler,
                radius = 5,
                radianToDegree = KICK.core.Constants._RADIAN_TO_DEGREE,
                res = document.getElementById("res");
            gameObject.addComponent({
                update: function(){
                    var timeTotal = time.time,
                        rot = timeTotal*rotationSpeed;
                    translation[0] = Math.sin(rot)*radius;
                    translation[1] = Math.sin(rot*3);
                    translation[2] = Math.cos(rot)*radius;
                    rotVec[1] = rot*radianToDegree;
                    transform.localPosition = translation;

                    //new Date().getMilliseconds();
                    transform.localRotationEuler = rotVec;
                    res.innerHTML = KICK.math.Mat4.strPretty(transform.getGlobalMatrix())+"\nRotation euler:"+KICK.math.Vec3.str(rotVec);
                }
            });
        }

        function UVSphere(){
            // setMesh(KICK.mesh.MeshFactory.createUVSphere, 2);
            meshRenderer.mesh = new KICK.mesh.Mesh(engine,{dataURI: "kickjs://mesh/uvsphere/"});
        }

        engine = new KICK.core.Engine('canvas',{
            enableDebugContext: true
        });
        var cameraObject = engine.activeScene.createGameObject();
        var camera = new KICK.scene.Camera({
            clearColor: [0,0,0,1],
            fieldOfView:60,
            normalizedViewportRect:[0.5,0.5,0.5,0.5]
        });
        cameraObject.addComponent(camera);

        var cameraObject2 = engine.activeScene.createGameObject();
        var camera2 = new KICK.scene.Camera({
            clearColor: [1,1,0,1],
            fieldOfView:60,
            cameraIndex:2,
            normalizedViewportRect:[0.0,0.5,0.5,0.5]
        });
        cameraObject2.addComponent(camera2);
        cameraObject2.transform.position = [0,0,3];
        var cameraObject3 = engine.activeScene.createGameObject();
        var camera3 = new KICK.scene.Camera({
            clearColor: [.1,.3,.6,1],
            fieldOfView:60,
            cameraIndex:2,
            layerMask: 2,
            normalizedViewportRect:[0.0,0.0,1.0,0.5]
        });
        cameraObject3.addComponent(camera3);
        cameraObject3.transform.position = [0,0,3];


        var gameObject = engine.activeScene.createGameObject();
        meshRenderer = new KICK.scene.MeshRenderer();
        meshRenderer.mesh = new KICK.mesh.Mesh(engine,{dataURI: "kickjs://mesh/cube/?length=0.5"});
        setMaterial('vertexShaderColor','fragmentShader',meshRenderer);
        gameObject.addComponent(meshRenderer);

        var gameObject2 = engine.activeScene.createGameObject();
        gameObject2.layer = 2;
        var meshRenderer2 = new KICK.scene.MeshRenderer();
        meshRenderer2.mesh = new KICK.mesh.Mesh(engine,{dataURI: "kickjs://mesh/uvsphere/?radius=0.6"});
        setMaterial('vertexShaderColor','fragmentShader',meshRenderer2);
        gameObject2.addComponent(meshRenderer2);

        addRotatorComponent(cameraObject);

    }
);
