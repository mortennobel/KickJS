requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        kick: '../../../../src/js/kick'
    }
});

requirejs(['kick/core/Engine', 'kick/scene/Camera', 'kick/material/Material', 'kick/material/Shader', 'kick/scene/MeshRenderer', 'kick/mesh/Mesh', "kick/core/Constants", "kick/texture/RenderTexture", "kick/texture/Texture", "kick/math"],
    function (Engine, Camera, Material, Shader, MeshRenderer, Mesh, Constants, RenderTexture, Texture, math) {
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

        function setMaterial(vertexShaderId, fragmentShaderId, meshRenderer, materialUniforms){
            clearLog();
            var vs = document.getElementById(vertexShaderId).value;
            var fs = document.getElementById(fragmentShaderId).value;
            var shader = new Shader();
            shader.vertexShaderSrc = vs;
            shader.fragmentShaderSrc = fs;
            shader.errorLog = log;
            shader.apply();
            var missingAttributes = meshRenderer.mesh.verify(shader);
            if (missingAttributes) {
                log("Missing attributes in mesh " + JSON.stringify(missingAttributes));
                return;
            }

            meshRenderer.material = new Material({
                name:"Some material",
                shader:shader,
                uniformData: materialUniforms
            });
        }

        function recalculateNormals(){
            clearLog();
            var mesh = meshRenderer.mesh;
            mesh.recalculateNormals();
            mesh.updateData();
        }

        function recalculateTangents() {
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
                    radianToDegree = Constants._RADIAN_TO_DEGREE,
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
                    res.innerHTML = math.Mat4.strPretty(transform.getGlobalMatrix())+"\nRotation euler:"+math.Vec3.str(rotVec);
                }
            });
        }

        function initKick() {
            engine = new Engine('canvas',{
                enableDebugContext: true
            });

            var cameraObject = engine.activeScene.createGameObject();

            var cameraObject2 = engine.activeScene.createGameObject();

            cameraObject2.transform.position = [0,0,3];

            var texture = new Texture();
            texture.setImageData(512,512,0,Constants.GL_UNSIGNED_BYTE,null,"");
            var renderTexture = new RenderTexture({colorTexture:texture});

            var camera = new Camera({
                clearColor: [0,0,0,1],
                fieldOfView:60,
                layerMask:1,
                renderTarget : renderTexture
            });
            cameraObject.addComponent(camera);
            var camera2 = new Camera({
                clearColor: [.1,.3,.6,1],
                fieldOfView:60,
                cameraIndex:2,
                layerMask: 2
            });
            cameraObject2.addComponent(camera2);
            var gameObject = engine.activeScene.createGameObject();
            meshRenderer = new MeshRenderer();
            meshRenderer.mesh = new Mesh({dataURI: "kickjs://mesh/cube/?length=0.5"});
            setMaterial('vertexShaderColor','fragmentShader',meshRenderer);
            gameObject.addComponent(meshRenderer);

            var gameObject2 = engine.activeScene.createGameObject();
            gameObject2.layer = 2;
            var meshRenderer2 = new MeshRenderer();
            meshRenderer2.mesh = new Mesh({dataURI: "kickjs://mesh/cube/?length=0.5"});
            setMaterial('vertexShaderTex','fragmentShaderTex',meshRenderer2, {
                    tex:  texture
                });
            gameObject2.addComponent(meshRenderer2);

            addRotatorComponent(cameraObject);
            addRotatorComponent(cameraObject2);
        }
        initKick();

        function UVSphere(){
            meshRenderer.mesh =  new Mesh({dataURI:"kickjs://mesh/uvsphere/"});
        }
    }
);