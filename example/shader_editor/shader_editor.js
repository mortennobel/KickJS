window.shaderEditor = new (function(){
    "use strict";

    var _engine,
        _meshRenderer,
        previousShaderError = false,
        _light,
        _ambientLight,
        _lightTransform,
        shader = null,
        thisObj = this,
        isRotating = true,
        meshsetting,
        setMesh = function (meshFactoryFunc,size){
            _meshRenderer.mesh = meshFactoryFunc(_engine,size);
        };

    this.textures = [];


    Object.defineProperties(this,
        {
            engine:{
                get:function(){ return _engine; }
            },
            meshRenderer: {
                get:function(){
                    return _meshRenderer;
                }
            }
        }
    );

    this.updateSettings = function(settings){
        _ambientLight.color = settings.lightAmbient;
        _light.intensity = settings.lightintensity;
        _light.color = settings.lightcolor;
        _lightTransform.rotationEuler = settings.lightrot;
        _lightTransform.position = settings.lightpos;
        isRotating = settings.rotatemesh==="on";
        if (meshsetting !== settings.meshsetting){
            meshsetting = settings.meshsetting;
            switch (meshsetting){
                case "cube":
                    setMesh(KICK.scene.MeshFactory.createCube,0.5);
                break;
                case "sphere":
                    setMesh(KICK.scene.MeshFactory.createUVSphere);
                break;
                default:
                    setMesh(KICK.scene.MeshFactory.createPlane);
                break;
            }
        }
    };

    var logFn = function(output,clear) {
        if (window.log){
            if (clear){
                window.log.clearConsole();
            }
            window.log.log(output);
        } else {
            console.log(output);
        }
    };

    var loadMaterial = function (shaderData){
        var textures = shaderData.textureData,
            materialUniforms = shaderData.material.uniforms;
        shader = new KICK.material.Shader(_engine,shaderData.shader);
        var missingAttributes = _meshRenderer.mesh.verify(shader);
        if (missingAttributes){
            logFn("Missing mesh vertex attributes.");
            return;
        }
        var textureMapping = {};
        for (var i=0;i<textures.length;i++){
            (function newScope(){
                var textureConf = textures[i],
                    t = new KICK.texture.Texture(_engine,textureConf);
                textureMapping[textureConf.uid] = t;
                var img = new Image();
                img.onload = function(){
                    t.setImage(img,textureConf.dataURI);
                };
                img.onerror = function(){
                    logFn("Error loading texture "+textureConf.dataURI.substring(0,100));
                };
                img.src = textureConf.dataURI;
                thisObj.textures.push(t);
            })();
        }

        for (var name in materialUniforms){
            var uniform = materialUniforms[name],
                type = uniform.type;
            if (type === KICK.core.Constants.GL_SAMPLER_2D || type === KICK.core.Constants.GL_SAMPLER_CUBE){
                uniform.value = textureMapping[uniform.value];
            }
        }

        shaderData.material.shader = shader;
        _meshRenderer.material = new KICK.material.Material(shaderData.material);
    };



    var addRotatorComponent = function (gameObject){
        var time = _engine.time,
                transform = gameObject.transform,
                rotationSpeed = 0.05,
                rotation = transform.localRotationEuler;
        gameObject.addComponent({
            update: function(){
                if (isRotating){
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
                enableDebugContext: true,
                preserveDrawingBuffer:true,
                checkCanvasResizeInterval:0
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
            setMesh(KICK.scene.MeshFactory.createPlane);
            if (window.shader){
                // load saved content
                loadMaterial(window.shader);
            }

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

            this.updateSettings(window.shader.settingsData);
        } catch (e) {
            debugger;
            logFn(e);
        }
    };


    this.updateShader = function(vs,fs){
        shader.vertexShaderSrc = vs;
        shader.fragmentShaderSrc = fs;
        shader.errorLog = logFn;
        var res = shader.updateShader();
        function onError(){
            previousShaderError = true;
            console.log(KICK.material.Shader.getPrecompiledSource(vs));
            console.log(KICK.material.Shader.getPrecompiledSource(fs));
            document.body.style.backgroundColor = 'pink';
        }
        if (!res){
            onError();
            return;
        }
        var missingAttributes = _meshRenderer.mesh.verify(shader);
        if (missingAttributes){
            logFn("Missing attributes in mesh "+JSON.stringify(missingAttributes));
            onError();
            return;
        }
        if (previousShaderError){
            logFn("Shader compiled ok",true);
            document.body.style.backgroundColor = 'white';
            previousShaderError = false;
        }
    }
})();