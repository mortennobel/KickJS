function destroyAllMeshRenderersInScene(){
    var scene = engine.activeScene;
    for (var i=scene.getNumberOfGameObjects()-1;i>=0;i--){
        var gameObject = scene.getGameObject(i);
        if (gameObject.getComponentOfType(KICK.scene.MeshRenderer)){
            gameObject.destroy();
        }
    }
}

function load(xmlDom,url){
    destroyAllMeshRenderersInScene();

    var gameObjectsCreated = KICK.importer.ColladaImporter.loadCollada(xmlDom,engine,null,true);
    for (var i=0;i<gameObjectsCreated.length;i++){
        var gameObject = gameObjectsCreated[i];
        var isDuck = url==="duck.dae" || url==="duck_triangulate.dae";
        if (isDuck){
            gameObject.transform.localScale = [0.01,0.01,0.01];

        }
        var meshRendererNew = gameObject.getComponentOfType(KICK.scene.MeshRenderer);
        if (meshRendererNew){
            meshRendererNew.material = duckMaterial;
            meshRenderer = meshRendererNew;
            recalculateNormals();
        }
    }
}

function loadCollada(url){
    var oReq = new XMLHttpRequest();
    function handler()
    {
        if (oReq.readyState == 4 /* complete */) {
            if (oReq.status == 200) {
                var xmlDom = oReq.responseXML;
                load(xmlDom,url);
            }
        }
    }
    oReq.open("GET", url, true);
    oReq.onreadystatechange = handler;
    oReq.send();
}

var material;
var duckMaterial;
var radius = 5;

function duckClicked(){
    loadCollada("duck.dae");
}

function cubeClicked(){
    loadCollada("cube.dae");
}

function loadColladaFile(file){
    var reader = new FileReader();

    reader.onload = function(event) {
        var txt = event.target.result;
        var parser=new DOMParser();

        load(parser.parseFromString(txt,"text/xml"),file.fileName);
    };

    reader.onerror = function() {
      alert("Error reading file");
    };

    reader.readAsText(file);
}

function loadClicked(files){
    for (var i=0;i<files.length;i++){
        var file = files[i];
        var fileLowerCase = file.fileName.toLowerCase();
        if (fileLowerCase.indexOf(".dae") !== -1){
            loadColladaFile(file);
        } else if (fileLowerCase.indexOf(".jpg") > 0 || fileLowerCase.indexOf(".jpeg") > 0 || fileLowerCase.indexOf(".png") > 0){
            var reader = new FileReader();
            reader.onload = function(e) {
                loadTexture(e.target.result);
            };
            reader.readAsDataURL(file);

        }
    }
}

var engine;
var meshRenderer;
var texture;

function createMaterial(vertexShaderId, fragmentShaderId){
    var vs = document.getElementById(vertexShaderId).value;
    var fs = document.getElementById(fragmentShaderId).value;
    var shader = new KICK.material.Shader(engine);
    shader.vertexShaderSrc = vs;
    shader.fragmentShaderSrc = fs;
    shader.errorLog = console.log;
    shader.updateShader();
    var missingAttributes = meshRenderer.mesh.verify(shader);
    if (missingAttributes){
        console.log("Missing attributes in mesh "+JSON.stringify(missingAttributes));
        return;
    }

    var material = new KICK.material.Material(engine,{
        name:"Some material",
        shader:shader
    });
    return material;
}

function recalculateNormals(){
    var mesh = meshRenderer.mesh;
    var meshData = mesh.meshData;
    if (!meshData.interleavedArrayFormat["normal"]){
        meshData.recalculateNormals();
        mesh.meshData = meshData;
    }
}

function addRotatorComponent(gameObject){
    var time = engine.time,
        transform = gameObject.transform,
        rotationSpeed = 0.001,
        translation = transform.localPosition,
        rotVec = transform.localRotationEuler,
        radianToDegree = KICK.core.Constants._RADIAN_TO_DEGREE,
        res = document.getElementById("res");
    gameObject.addComponent({
        update: function(){
            var timeTotal = time.time,
                rot = timeTotal*rotationSpeed;
            if (window.rot){ // todo remove - let you easily control rotation from console
                rot = window.rot*KICK.core.Constants._RADIAN_TO_DEGREE;
                transform.localRotationEuler = window.rot;
                transform.localPosition = window.pos;
            } else {
                translation[0] = Math.sin(rot)*radius;
                translation[1] = Math.sin(rot*3);
                translation[2] = Math.cos(rot)*radius;
                rotVec[1] = rot*radianToDegree;
                transform.localRotationEuler = rotVec;
                transform.localPosition = translation;
            }
        }
    });
}

function loadTexture(url){
    var image = new Image();
    image.onload = function() {
        texture.setImage(image, url);
    };
    image.src = url;
}

function initDuckTexture(){
    texture = new KICK.texture.Texture(engine);
    texture.setTemporaryTexture();
    duckMaterial.uniforms.tex = {
        value:texture,
        type: KICK.core.Constants.GL_SAMPLER_2D
    };
    loadTexture("duckCM.jpg");
}

function initLights(){
    var ambientlightGameObject = engine.activeScene.createGameObject();
    ambientlightGameObject.name = "ambient light";
    var ambientLight = new KICK.scene.Light({type :KICK.core.Constants._LIGHT_TYPE_AMBIENT});
    ambientLight.color = [0.1,0.1,0.1,1];
    ambientlightGameObject.addComponent(ambientLight);


    var lightGameObject = engine.activeScene.createGameObject();
    lightGameObject.name = "directional light";
    var light = new KICK.scene.Light(
        {
            type:KICK.core.Constants._LIGHT_TYPE_DIRECTIONAL,
            color:[1,1,1,1],
            intensity:1
        }
    );
    lightGameObject.transform.position = [1,1,1];
    lightGameObject.addComponent(light);
}

function initKick() {
    engine = new KICK.core.Engine('canvas',{
        enableDebugContext: true
    });
    var cameraObject = engine.activeScene.createGameObject();
    cameraObject.name = "Camera";
    var camera = new KICK.scene.Camera({
        clearColor: [0,0,0,1],
        fieldOfView:60
    });
    cameraObject.addComponent(camera);

    addRotatorComponent(cameraObject);

    var gameObject = engine.activeScene.createGameObject();
    gameObject.name = "Mesh";
    meshRenderer = new KICK.scene.MeshRenderer();
    meshRenderer.mesh = engine.resourceManager.getMesh("kickjs://mesh/uvsphere/?radius=0.5");
    material = createMaterial('vertexShaderColor','fragmentShader');

    duckMaterial = createMaterial('vertexShaderColorImg','fragmentShaderImg');
    meshRenderer.material = duckMaterial;
    initDuckTexture();
    initLights();

    gameObject.addComponent(meshRenderer);
}

function pauseResume(){
    engine.paused = !engine.paused;
    this.innerHTML = engine.paused? "Play":"Pause";
}

function updateCameraRadius(){
    radius = Number(document.getElementById("radius").value);
}

window.addEventListener("load",function(){
    initKick();
    document.getElementById("duckButton").addEventListener("click", duckClicked,false);
    document.getElementById("cubeButton").addEventListener("click", cubeClicked,false);
    document.getElementById("pauseButton").addEventListener("click", pauseResume,false);
    document.getElementById("radius").addEventListener("change", updateCameraRadius,false);
    document.getElementById("file").onchange = function() {
          loadClicked(this.files);
        };

},false);
