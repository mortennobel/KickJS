window.shaderEditor = new (function(){
    "use strict";

    var _engine,
        _meshRenderer,
        previousShaderError = false,
        _light,
        _ambientLight,
        _lightTransform,
        thisObj = this;

    this.vs = "";
    this.fs = "";
    this.textures = [];
    this.isRotating = true;

    Object.defineProperties(this,
        {
            engine:{
                value:_engine
            },
            meshRenderer: {
                get:function(){
                    return _meshRenderer;
                }
            },
            lightTransform:{
                get:function(){
                    return _lightTransform;
                }
            },
            light:{
                get:function(){
                    return _light;
                }
            },
            ambientLight:{
                get:function(){
                    return _ambientLight;
                }
            }
        }
    );

    var logFn = function(output) {
        if (window.log){
            window.log.log(output);
        } else {
            console.log(output);
        }
    };

    this.setMesh = function (meshFactoryFunc,subdivisions){
        _meshRenderer.mesh = meshFactoryFunc(_engine,subdivisions);
    };

    var setMaterial = function (){
        thisObj.vs = document.getElementById('vertexShader').value;
        thisObj.fs = document.getElementById('fragmentShader').value;
        var shader = new KICK.material.Shader(_engine);
        var res = shader.updateShader(thisObj.vs,thisObj.fs);

        var missingAttributes = _meshRenderer.mesh.verify(shader);
        if (missingAttributes){
            logFn("Missing attributes in mesh "+JSON.stringify(missingAttributes))
            return;
        }

        _meshRenderer.material = new KICK.material.Material({
            name:"Some material",
            shader:shader
        });
    }

    var addRotatorComponent = function (gameObject){
        var time = _engine.time,
                transform = gameObject.transform,
                rotationSpeed = 0.05,
                rotation = transform.localRotationEuler;
        gameObject.addComponent({
            update: function(){
                if (thisObj.isRotating){
                    rotation[1] += time.deltaTime*rotationSpeed;
                    transform.localRotationEuler = rotation;
                } else {
                    transform.localRotationEuler = [0,0,0];
                }
            }
        });
    };

    this.initKick = function() {
        try{
            _engine = new KICK.core.Engine('canvas',{
                enableDebugContext: true
            });
            var cameraObject = _engine.activeScene.createGameObject();
            var camera = new KICK.scene.Camera({
                clearColor: [0,0,0,1],
                cameraTypePerspective: false,
                near:-1,
                far:1
            });
            cameraObject.addComponent(camera);

            var gameObject = _engine.activeScene.createGameObject();
            _meshRenderer = new KICK.scene.MeshRenderer();
            thisObj.setMesh(KICK.scene.MeshFactory.createIcosphere, 2);
            setMaterial();
            gameObject.addComponent(_meshRenderer);
            addRotatorComponent(gameObject);

            var ambientlightGameObject = _engine.activeScene.createGameObject();
            _ambientLight = new KICK.scene.Light({type :KICK.core.Constants._LIGHT_TYPE_AMBIENT});
            _ambientLight.color = [0.1,0.1,0.1,1];
            ambientlightGameObject.addComponent(_ambientLight);

            var lightGameObject = _engine.activeScene.createGameObject();
            _light = new KICK.scene.Light({type:KICK.core.Constants._LIGHT_TYPE_DIRECTIONAL});
            lightGameObject.addComponent(_light);
            _lightTransform = lightGameObject.transform;

        }catch (e){
             alert("Error init Kickstart Engine"+e);
        }
    };


    this.updateShader = function(){
        var shader = new KICK.material.Shader(_engine);
        var res = shader.updateShader(thisObj.vs,thisObj.fs);
        function onError(){
            previousShaderError = true;
            console.log(KICK.material.Shader.getPrecompiledSource(thisObj.vs));
            console.log(KICK.material.Shader.getPrecompiledSource(thisObj.fs));
            document.body.style.backgroundColor = 'pink';
        }
        if (!res){
            onError();
            return;
        }
        var missingAttributes = _meshRenderer.mesh.verify(shader);
        if (missingAttributes){
            window.log.log("Missing attributes in mesh "+JSON.stringify(missingAttributes));
            onError();
            return;
        }
        if (previousShaderError){
            window.log.log("Shader compiled ok");
            document.body.style.backgroundColor = 'white';
            previousShaderError = false;
        }
        var currentMaterialConfig = _meshRenderer.material.toJSON();
        currentMaterialConfig.shader = shader;
        _meshRenderer.material = new KICK.material.Material(currentMaterialConfig);
    }
})();