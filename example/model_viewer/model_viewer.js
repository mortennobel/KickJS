var vec3 = KICK.math.vec3,
    quat4 = KICK.math.quat4;

if (location.href.indexOf('file')===0){
    alert("Model viewer example must be run from a web-server due to security constrains");
}

function destroyAllMeshRenderersInScene(){
    var scene = engine.activeScene;
    for (var i=scene.getNumberOfGameObjects()-1;i>=0;i--){
        var gameObject = scene.getGameObject(i);
        if (gameObject.getComponentOfType(KICK.scene.MeshRenderer)){
            gameObject.destroy();
        }
    }
}

function loadKickJSModel(fileContent){
    destroyAllMeshRenderersInScene();
    var meshData = new KICK.mesh.MeshData();
    meshData.deserialize(fileContent);
    var gameObject = engine.activeScene.createGameObject({name:meshData.name});
    var mesh = new KICK.mesh.Mesh(engine,{
        meshData: meshData
    });
    var materials = [];
    for (var j = meshData.subMeshes.length-1;j>=0;j--){
        materials[j] = material;
    }

    var meshRenderer = new KICK.scene.MeshRenderer({
        mesh: mesh,
        materials: materials
    });
    gameObject.addComponent(meshRenderer);
}

function load(content,url,func){
    destroyAllMeshRenderersInScene();

    var createdObject = func(content,engine,engine.activeScene,true);
    var gameObjectsCreated = createdObject.gameObjects;

    for (var i=0;i<gameObjectsCreated.length;i++){
        var gameObject = gameObjectsCreated[i];
        var isDuck = url==="duck.dae" || url==="duck_triangulate.dae";
        if (isDuck){
            gameObject.transform.localScale = [0.01,0.01,0.01];
        }
        var meshRendererNew = gameObject.getComponentOfType(KICK.scene.MeshRenderer);
        if (meshRendererNew){
            var materials = [];
            for (var j = meshRendererNew.mesh.meshData.subMeshes.length-1;j>=0;j--){
                materials[j] = material;
            }
            meshRendererNew.materials = materials;
            meshRenderer = meshRendererNew;
            recalculateNormals();
//            console.log(KICK.core.Util.typedArrayToArray(meshRendererNew.mesh.aabb));
        }
    }
}

function loadObj(url){
    var oReq = new XMLHttpRequest();
    function handler()
    {
        if (oReq.readyState == 4 /* complete */) {
            if (oReq.status == 200) {
                var txt = oReq.responseText;
                load(txt,url,KICK.importer.ObjImporter.import);
            }
        }
    }
    oReq.open("GET", url, true);
    oReq.onreadystatechange = handler;
    oReq.send();
}

function loadCollada(url){
    var oReq = new XMLHttpRequest();
    function handler()
    {
        if (oReq.readyState == 4 /* complete */) {
            if (oReq.status == 200) {
                var xmlDom = oReq.responseXML;
                load(xmlDom,url,KICK.importer.ColladaImporter.import);
            }
        }
    }
    oReq.open("GET", url, true);
    oReq.onreadystatechange = handler;
    oReq.send();
}

function loadKickJSModelFromURL(url){
    var oReq = new XMLHttpRequest();
    function handler()
    {
        if (oReq.readyState == 4 /* complete */) {
            if (oReq.status == 200) {
                var content = oReq.response;
                loadKickJSModel(content);
            }
        }
    }
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    oReq.onreadystatechange = handler;
    oReq.send();
}


var material;

function duckClicked(){
    loadCollada("duck.dae");
}

function cubeClicked(){
    loadCollada("cube.dae");
}

function teapotClicked(){
    loadKickJSModelFromURL("teapot.kickjs");
}

function loadModelFile(file){
    var reader = new FileReader(),
        fileName = file.fileName,
        fileNameLowercase = fileName.toLowerCase();
    var endsWith = function(str,search) {
        return (str.match(search+"$")==search)
    };

    reader.onload = function(event) {
        var fileContent = event.target.result;

        if (endsWith(fileNameLowercase,".obj")){
            load(fileContent,fileName,KICK.importer.ObjImporter.import);
        } else if (endsWith(fileNameLowercase,".dae")){
            var parser=new DOMParser();
            load(parser.parseFromString(fileContent,"text/xml"),fileName,KICK.importer.ColladaImporter.import);
        } else if (endsWith(fileNameLowercase, ".kickjs")){
            loadKickJSModel(fileContent);
        } else {
            alert("Unsupported file type. ");
        }
    };

    reader.onerror = function() {
      alert("Error reading file");
    };
    if (endsWith(fileNameLowercase,".kickjs")){
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsText(file);
    }
}

function loadClicked(files){
    var URL = window.webkitURL || window.URL;
    var isPNG = function(arrayBuffer){
        var uInt8 = new Uint8Array(arrayBuffer);
        return uInt8.length>10 &&
            uInt8[0] === 137 &&
            uInt8[1] === 80 &&
            uInt8[2] === 78 &&
            uInt8[3] === 71 &&
            uInt8[4] === 13 &&
            uInt8[5] === 10 &&
            uInt8[6] === 26 &&
            uInt8[7] === 10;
    };

    var endsWith = function(str,search) {
        return (str.match(search+"$")==search)
    };
    for (var i=0;i<files.length;i++){
        var file = files[i];
        var fileLowerCase = file.fileName.toLowerCase();
        if (endsWith(fileLowerCase,".dae") ||
            endsWith(fileLowerCase,".obj") ||
            endsWith(fileLowerCase,".kickjs")){
            loadModelFile(file);
        } else if (endsWith(fileLowerCase,".jpg") ||
            endsWith(fileLowerCase,".jpeg") ||
            endsWith(fileLowerCase,".png")){

            var img = document.createElement("img");
            img.onload = function(e) {
                texture.setImage(img, "");
                URL.revokeObjectURL(this.src);
            };
            img.src = URL.createObjectURL(file);
        }
    }
}

var engine;
var camera;
var meshRenderer;
var texture;

function createMaterial(){
    var shader = engine.project.load(engine.project.ENGINE_SHADER_SPECULAR);
    var missingAttributes = meshRenderer.mesh.verify(shader);
    if (missingAttributes){
        console.log("Missing attributes in mesh "+JSON.stringify(missingAttributes));
        return null;
    }
    return new KICK.material.Material(engine, {
        name:"Some material",
        shader:shader
    });
}

function recalculateNormals(){
    var mesh = meshRenderer.mesh;
    var meshData = mesh.meshData;
    if (!meshData.interleavedArrayFormat["normal"]){
        meshData.recalculateNormals();
        mesh.meshData = meshData;
    }
}

function RotatorComponent(){
    var thisObj = this,
        time,
        transform,
        rotationSpeed = 0.001,
        upDownSpeed = 0.0001,
        wheelSpeed = 0.0001,
        mouseRotationSpeed = 0.01,
        mouseInput,
        sphericalCoordinates = vec3.create([10,0,0]); // radius, polar, elevation
        cartesianCoordinates = vec3.create();

    this.activated = function(){
        var gameObject = thisObj.gameObject,
            engine = gameObject.engine;
        transform = gameObject.transform;
        time = engine.time;
        mouseInput = engine.mouseInput;
        mouseInput.mouseWheelPreventDefaultAction = true;
    };

    this.update = function(){
        if (mouseInput.isButton(0)){
            var mouseDelta = mouseInput.deltaMovement;
            sphericalCoordinates[1] -= mouseDelta[0]*mouseRotationSpeed;
            sphericalCoordinates[2] += mouseDelta[1]*mouseRotationSpeed;
            sphericalCoordinates[2] = Math.max(-Math.PI*0.499,sphericalCoordinates[2]);
            sphericalCoordinates[2] = Math.min(Math.PI*0.499,sphericalCoordinates[2]);
        } else {
            sphericalCoordinates[1] += time.deltaTime*rotationSpeed;
            sphericalCoordinates[2] = Math.sin(time.time*upDownSpeed)*Math.PI*0.25;
        }
        var wheelY = mouseInput.deltaWheel[1];
        if (wheelY){
            var delta = wheelY*wheelSpeed;
            sphericalCoordinates[0] *= 1+delta;
        }
        vec3.sphericalToCarterian(sphericalCoordinates,cartesianCoordinates);
        transform.position = cartesianCoordinates;
        transform.localRotation = quat4.lookAt(cartesianCoordinates,[0,0,0],[0,1,0]);
    };
}

function initDuckTexture(){
    texture = new KICK.texture.Texture(engine);
    texture.setTemporaryTexture();
    texture.dataURI = "duckCM.jpg";
    material.uniforms.mainTexture = {
        value:texture,
        type: KICK.core.Constants.GL_SAMPLER_2D
    };
}

function initLights(){
    var ambientlightGameObject = engine.activeScene.createGameObject();
    ambientlightGameObject.name = "ambient light";
    var ambientLight = new KICK.scene.Light({type :KICK.core.Constants._LIGHT_TYPE_AMBIENT});
    ambientLight.color = [0.1,0.1,0.1];
    ambientlightGameObject.addComponent(ambientLight);

    var lightGameObject = engine.activeScene.createGameObject();
    lightGameObject.name = "directional light";
    var light = new KICK.scene.Light(
        {
            type:KICK.core.Constants._LIGHT_TYPE_DIRECTIONAL,
            color:[1,1,1],
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
    camera = new KICK.scene.Camera({
        clearColor: [0,0,0,1],
        fieldOfView:60,
        far:100000
    });
    cameraObject.addComponent(camera);

    cameraObject.addComponent(new RotatorComponent());

    var gameObject = engine.activeScene.createGameObject();
    gameObject.name = "InitialMesh";
    meshRenderer = new KICK.scene.MeshRenderer();
    meshRenderer.mesh = new KICK.mesh.Mesh(engine,
        {
            dataURI:"kickjs://mesh/uvsphere/?slices=48&stacks=24&radius=0.5",
            name:"Default object"
        });

    material = createMaterial();
    meshRenderer.material = material;
    gameObject.addComponent(meshRenderer);
    initDuckTexture();
    initLights();
}

function pauseResume(){
    engine.paused = !engine.paused;
    this.innerHTML = engine.paused? "Play":"Pause";
}

function toogleBackground(){
    var background = window.background || 0;
    background++;
    if (background===3){
        background = 0;
    }
    window.background = background;
    if (background===0){
        camera.clearColor = [0,0,0,1];
    } else if (background===1){
        camera.clearColor = [1,1,1,1];
    } else if (background===2){
        camera.clearColor = [0,0,0,0];
    } 
}

function getConfiguration(){
    var isChecked = function(id){
        return document.getElementById(id).checked;
    };
    return {
        normals:isChecked('normals'),
        uv1: isChecked('uv1'),
        color: isChecked('color'),
        tangents: isChecked('tangents'),
        compactJSON: isChecked('compactJSON')
    };
    
}

function getCurrentModelAsJSON(){
    var res = [];
    var conf = getConfiguration();
    var typedArrayToArray = KICK.core.Util.typedArrayToArray;
    var scene = engine.activeScene;
    for (var i=scene.getNumberOfGameObjects()-1;i>=0;i--){
        var gameObject = scene.getGameObject(i);
        var meshRenderer = gameObject.getComponentOfType(KICK.scene.MeshRenderer); 
        if (meshRenderer){
            var meshData = meshRenderer.mesh.meshData;
            var obj = {
                vertex: typedArrayToArray(meshData.vertex),
                name: meshRenderer.mesh.name || ""
            };
            for (var i=0;i<meshData.subMeshes.length;i++){
                obj["indices"+i] = typedArrayToArray(meshData.subMeshes[i]);
            }
            if (conf.normals){
                if (!meshData.normal){
                    meshData.recalculateNormals();
                }
                obj.normal = typedArrayToArray(meshData.normal);
            }
            if (conf.uv1){
                obj.uv1 = typedArrayToArray(meshData.uv1);
            }
            if (conf.color){
                obj.color = typedArrayToArray(meshData.color || new Float32Array(obj.vertex.length/3*4));
            }
            if (conf.tangents){
                if (!meshData.tangent){
                    meshData.recalculateTangents();
                }
                // tangent may not exist, then return (0, 0, 0)
                obj.tangent = typedArrayToArray(meshData.tangent || new Float32Array(obj.vertex.length/3*4));
            }
            res.push(obj);
        }
    }
    return JSON.stringify(res,null,conf.compactJSON?0:3);
}
// based on Base64 in JSZip. Changed to arrayBuffer
// <http://jszip.stuartk.co.uk>
var encodeBase64 = function() {
   // private property
   var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
   return function(arrayBuffer) {
         var input = new Uint8Array(arrayBuffer);
         var output = "";
         var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
         var i = 0;

         while (i < input.length) {

            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
               enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
               enc4 = 64;
            }

            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

         }

         return output;
   }
}();

function getCurrentModelAsKickJSBinary(){
    var res = new ArrayBuffer(0);
    var conf = getConfiguration();
    var typedArrayToArray = KICK.core.Util.typedArrayToArray;
    var scene = engine.activeScene;
    for (var i=scene.getNumberOfGameObjects()-1;i>=0;i--){
        var gameObject = scene.getGameObject(i);
        var meshRenderer = gameObject.getComponentOfType(KICK.scene.MeshRenderer);
        if (meshRenderer){
            var meshData = new KICK.mesh.MeshData(meshRenderer.mesh.meshData);
            if (conf.normals){
                if (!meshData.normal){
                    meshData.recalculateNormals();
                }
            } else {
                meshData.normal = null;
            }
            if (conf.uv1){
                if (!meshData.uv1){
                    meshData.uv1 = typedArrayToArray(meshData.uv1);
                }
            } else {
                meshData.uv1 = null;
            }
            if (conf.color){
                if (!meshData.color){
                    meshData.color = new Float32Array(meshData.vertex.length/3*4)
                }
            } else {
                meshData.color = null;
            }
            if (conf.tangents){
                if (!meshData.tangent){
                    var success = meshData.recalculateTangents();
                    if (!success){
                        meshData.tangent = new Float32Array(meshData.vertex.length/3*4);
                    }
                }
            }
            console.log("Found mesh "+meshData.name);
            res = meshData.serialize();
            console.log("Mesh size "+res.byteLength);
            break;
        }
    }
    var base64 = encodeBase64(res);
    console.log("base64 len "+base64.length);
    return base64;
}

function initDownloadify(){
    Downloadify.create('JSONExport',{
        filename: function(){
            return "model.json";
        },
        data: function(){
            return getCurrentModelAsJSON();
        },
        onComplete: function(){
            window.hideExportWindow();
            alert('Export completed');
        },
        onCancel: function(){
            alert('Export cancelled');
        },
        onError: function(){
            alert('You must put something in the File Contents or there will be nothing to save!');
        },
        transparent: false,
        swf: '/example/model_viewer/downloadtify/downloadify.swf',
        downloadImage: 'json.png',
        width: 61,
        height: 26,
        append: false
    });
    Downloadify.create('KickJSExport',{
        filename: function(){
            return "model.kickjs";
        },
        data: function(){
            return getCurrentModelAsKickJSBinary();
        },
        onComplete: window.hideExportWindow,
        onCancel: window.hideExportWindow,
        onError: function(){
            alert('You must put something in the File Contents or there will be nothing to save!');
        },
        transparent: false,
        swf: '/example/model_viewer/downloadtify/downloadify.swf',
        downloadImage: 'KickJS.png',
        width: 68,
        height: 26,
        transparent: true,
        append: false,
        dataType: 'base64'
    });
}

window.addEventListener("load",function(){
    initKick();
    document.getElementById("duckButton").addEventListener("click", duckClicked,false);
    document.getElementById("cubeButton").addEventListener("click", cubeClicked,false);
    document.getElementById("teapotButton").addEventListener("click", teapotClicked,false);
    document.getElementById("pauseButton").addEventListener("click", pauseResume,false);
    document.getElementById("backgroundButton").addEventListener("click", toogleBackground,false);
    document.getElementById("localFileButton").addEventListener("click", window.openFileDialog,false);
    document.getElementById("exportButton").addEventListener("click", window.exportDialog,false);

},false);

YUI().use("panel", function (Y) {
    window.openFileDialog = function(){
        var description = "Open a local file. <br>Collada (.dae) files and Wavefront (.obj) or KickJS (.kickjs) are supported for models. <br>JPEG and PNG are supported for textures.";
        var nestedPanel = new Y.Panel({
            headerContent: "Load local file",
            bodyContent: description+'<br><br><input type="file" id="file" multiple/>',
            width      : 400,
            zIndex     : 6,
            centered   : true,
            modal      : true,
            render     : true,
            buttons: [
                {
                    value  : 'Close',
                    section: Y.WidgetStdMod.FOOTER,
                    action : function (e) {
                        e.preventDefault();
                        nestedPanel.hide();
                    }
                }
            ]
        });
        document.getElementById("file").onchange = function() {
            nestedPanel.hide();
            loadClicked(this.files);
        };
    };

    var exportPanel = new Y.Panel({
        headerContent: "Export model",
        width      : 400,
        zIndex     : 6,
        centered   : true,
        modal      : true,
        srcNode    : '#exportContent',
        render     : true,
        visible: false,
        buttons: [
            {
                value  : 'Cancel',
                section: Y.WidgetStdMod.FOOTER,
                action : function (e) {
                    e.preventDefault();
                    window.hideExportWindow();
                }
            }
        ]
    });

    window.exportDialog = function(){
        initDownloadify();
        exportPanel.show();
    };
    window.hideExportWindow = function(){
        exportPanel.hide();
        Y.one("#JSONExport").set("innerHTML","");
        Y.one("#KickJSExport").set("innerHTML","");
    }
});
