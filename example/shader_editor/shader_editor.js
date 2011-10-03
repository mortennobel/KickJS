var engine,
    meshRenderer,
    vs,
    fs,
    previousShaderError = false,
    isRotating = true,
    light,
    ambientLight,
    textures = [],
    lightTransform;

function logFn(output) {
    if (window.log){
        window.log.log(output);
    } else {
        console.log(output);
    }
}

function setMesh(meshFactoryFunc,subdivisions){
    meshRenderer.mesh = meshFactoryFunc(engine,subdivisions);
}

function setMaterial(){
    vs = document.getElementById('vertexShader').value;
    fs = document.getElementById('fragmentShader').value;
    var shader = new KICK.material.Shader(engine);
    var res = shader.initShader(vs,fs,logFn);
    var missingAttributes = meshRenderer.mesh.verify(shader);
    if (missingAttributes){
        logFn("Missing attributes in mesh "+JSON.stringify(missingAttributes))
        return;
    }

    meshRenderer.material = new KICK.material.Material({
        name:"Some material",
        shader:shader
    });
}

function addRotatorComponent(gameObject){
    var time = engine.time,
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
}

function initKick() {
    try{
        engine = new KICK.core.Engine('canvas',{
            enableDebugContext: true
        });
        var cameraObject = engine.activeScene.createGameObject();
        var camera = new KICK.scene.Camera({
            clearColor: [0,0,0,1],
            cameraTypePerspective: false,
            near:-1,
            far:1
        });
        cameraObject.addComponent(camera);

        var gameObject = engine.activeScene.createGameObject();
        meshRenderer = new KICK.scene.MeshRenderer();
        setMesh(KICK.scene.MeshFactory.createIcosphere, 2);
        setMaterial();
        gameObject.addComponent(meshRenderer);
        addRotatorComponent(gameObject);

        var ambientlightGameObject = engine.activeScene.createGameObject();
        ambientLight = new KICK.scene.Light({type :KICK.core.Constants._LIGHT_TYPE_AMBIENT});
        ambientLight.color = [0.1,0.1,0.1,1];
        ambientlightGameObject.addComponent(ambientLight);

        var lightGameObject = engine.activeScene.createGameObject();
        light = new KICK.scene.Light({type:KICK.core.Constants._LIGHT_TYPE_DIRECTIONAL});
        lightGameObject.addComponent(light);
        lightTransform = lightGameObject.transform;

    }catch (e){
         alert("Error init Kickstart Engine"+e);
    }
    setTimeout(shaderChangeListener,2000); 
}


function updateShader(){
    var shader = new KICK.material.Shader(engine);
    var res = shader.initShader(vs,fs,window.log.log);
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
    var missingAttributes = meshRenderer.mesh.verify(shader);
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
    meshRenderer.material = new KICK.material.Material({
        name:"Some material",
        shader:shader
    });
}
