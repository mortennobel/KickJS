requirejs.config({
    baseUrl: '.',
    paths: {
        kick: '../js/kick-debug'
    }
});

requirejs(['kick'],
    function (kick) {
        "use strict";


        var vec3 = kick.math.Vec3,
            quat = kick.math.Quat,
            aabb = kick.math.Aabb,
            objectCenter = vec3.create(),
            sphericalCoordinates = vec3.clone([10, 0, 0]), // radius, polar, elevation
            material,
            engine,
            camera,
            meshRenderer,
            texture,
            endsWith = function (str, search) {
                var res = str.match(search + "$");
                if (Array.isArray(res)){
                    res = res[0];
                }
                return (res === search);
            };

        if (location.href.indexOf('file') === 0) {
            alert("Model viewer example must be run from a web-server due to security constrains");
        }

        function destroyAllMeshRenderersInScene() {
            var scene = engine.activeScene,
                i,
                gameObject;
            for (i = scene.getNumberOfGameObjects() - 1; i >= 0; i--) {
                gameObject = scene.getGameObject(i);
                if (gameObject.getComponentOfType(kick.scene.MeshRenderer)) {
                    gameObject.destroy();
                }
            }
        }

        function loadKickJSModel(fileContent) {
            destroyAllMeshRenderersInScene();
            var meshData = new kick.mesh.MeshData(),
                gameObject,
                mesh,
                materials,
                j,
                meshRenderer,
                boundingBox,
                length,
                lengthPlusOffset;
            meshData.deserialize(fileContent);
            gameObject = engine.activeScene.createGameObject({name: meshData.name});
            mesh = new kick.mesh.Mesh({
                meshData: meshData
            });
            materials = [];
            for (j = meshData.subMeshes.length - 1; j >= 0; j--) {
                materials[j] = material;
            }

            meshRenderer = new kick.scene.MeshRenderer({
                mesh: mesh,
                materials: materials
            });
            gameObject.addComponent(meshRenderer);
            boundingBox = mesh.aabb;
            aabb.center(objectCenter, boundingBox);
            length = vec3.length(aabb.diagonal(vec3.create(), boundingBox)) * 0.5;
            lengthPlusOffset = length * 2.5;

            sphericalCoordinates[0] = lengthPlusOffset;
        }

        function load(content, url, func, rotateAroundX) {
            destroyAllMeshRenderersInScene();

            var createdObject = func(content, engine.activeScene, rotateAroundX),
                gameObjectsCreated = createdObject.gameObjects,
                boundingBox = aabb.create(),
                i,
                gameObject,
                meshRendererNew,
                meshAabb,
                aabbTransformed,
                materials,
                j,
                length,
                lengthPlusOffset;
            for (i = 0; i < gameObjectsCreated.length; i++) {
                gameObject = gameObjectsCreated[i];
                meshRendererNew = gameObject.getComponentOfType(kick.scene.MeshRenderer);
                if (meshRendererNew) {
                    meshAabb = meshRendererNew.mesh.aabb;
                    aabbTransformed = aabb.transform(meshAabb, meshAabb, gameObject.transform.getGlobalMatrix());
                    aabb.merge(boundingBox, boundingBox, aabbTransformed);
                    materials = [];
                    for (j = meshRendererNew.mesh.meshData.subMeshes.length - 1; j >= 0; j--) {
                        materials[j] = material;
                    }
                    meshRendererNew.materials = materials;
                    meshRenderer = meshRendererNew;
                    recalculateNormals();
                    createDummyUVsIfNotExist();
                }
            }
            aabb.center(boundingBox, objectCenter);
            length = vec3.length(aabb.diagonal(vec3.create(), boundingBox)) * 0.5;
            lengthPlusOffset = length * 2.5;

            sphericalCoordinates[0] = lengthPlusOffset;
        }

        function loadObj(url) {
            var oReq = new XMLHttpRequest();
            function handler() {
                if (oReq.readyState === 4) { //  complete
                    if (oReq.status === 200) {
                        var txt = oReq.responseText;
                        load(txt, url, kick.importer.ObjImporter.import);
                    }
                }
            }
            oReq.open("GET", url, true);
            oReq.onreadystatechange = handler;
            oReq.send();
        }

        function loadCollada(url) {
            var oReq = new XMLHttpRequest();
            function handler() {
                if (oReq.readyState === 4) { // complete
                    if (oReq.status === 200) {
                        var xmlDom = oReq.responseXML;
                        load(xmlDom, url, kick.importer.ColladaImporter.import);
                    }
                }
            }
            oReq.open("GET", url, true);
            oReq.onreadystatechange = handler;
            oReq.send();
        }

        function loadKickJSModelFromURL(url) {
            var oReq = new XMLHttpRequest();
            function handler() {
                if (oReq.readyState === 4) { // complete
                    if (oReq.status === 200) {
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


        function duckClicked() {
            loadCollada("duck.dae");
        }

        function cubeClicked() {
            loadCollada("cube.dae");
        }

        function teapotClicked() {
            loadKickJSModelFromURL("teapot.kickjs");
        }

        function loadModelFile(file, rotateAroundX) {
            var reader = new FileReader(),
                fileName = file.fileName || file.name,
                fileNameLowercase = fileName.toLowerCase(),
                parser;

            reader.onload = function (event) {
                var fileContent = event.target.result;

                if (endsWith(fileNameLowercase, ".obj")) {
                    load(fileContent, fileName, kick.importer.ObjImporter.import,rotateAroundX);
                } else if (endsWith(fileNameLowercase, ".dae")) {
                    parser = new DOMParser();
                    load(parser.parseFromString(fileContent, "text/xml"), fileName, kick.importer.ColladaImporter.import,rotateAroundX);
                } else if (endsWith(fileNameLowercase, ".kickjs")) {
                    loadKickJSModel(fileContent);
                }
            };

            reader.onerror = function () {
                alert("Error reading file");
            };
            if (endsWith(fileNameLowercase, ".kickjs")) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        }

        function loadClicked(files, rotateAroundX, model) {
            var URL = window.webkitURL || window.URL,
                isPNG = function (arrayBuffer) {
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
                },
                i,
                file,
                filename,
                fileLowerCase,
                img;
            for (i = 0; i < files.length; i++) {
                file = files[i];
                filename = file.fileName || file.name;
                fileLowerCase = filename.toLowerCase();
                if (model && (endsWith(fileLowerCase, ".dae") ||
                    endsWith(fileLowerCase, ".obj") ||
                    endsWith(fileLowerCase, ".kickjs"))) {
                    loadModelFile(file, rotateAroundX);
                } else if (!model && (endsWith(fileLowerCase, ".jpg") ||
                    endsWith(fileLowerCase, ".jpeg") ||
                    endsWith(fileLowerCase, ".png"))) {

                    img = document.createElement("img");
                    img.onload = function (e) {
                        texture.setImage(img, "");
                        URL.revokeObjectURL(this.src);
                    };
                    img.src = URL.createObjectURL(file);
                } else {
                    alert("Unsupported file type. ");
                }
            }
        }

        function createMaterial() {
            var shader = engine.project.load(engine.project.ENGINE_SHADER_SPECULAR),
                missingAttributes = meshRenderer.mesh.verify(shader);
            if (missingAttributes) {
                console.log("Missing attributes in mesh " + JSON.stringify(missingAttributes));
                return null;
            }
            return new kick.material.Material({
                name: "Some material",
                shader: shader
            });
        }

        function recalculateNormals() {
            var mesh = meshRenderer.mesh,
                meshData = mesh.meshData;
            if (!meshData.interleavedArrayFormat.normal){
                console.log("Recalculate normals");
                meshData.recalculateNormals();
                mesh.meshData = meshData;
            }
        }

        function createDummyUVsIfNotExist() {
            var mesh = meshRenderer.mesh,
                meshData = mesh.meshData;
            meshData.createUv1();
            mesh.meshData = meshData;
            meshRenderer.mesh = mesh;
        }

        function LightRotatorComponent() {
            var thisObj = this,
                transform,
                rotationSensitivity = 1,
                rotationEuler,
                mouseInput;
            this.activated = function () {
                var gameObject = thisObj.gameObject,
                    engine = kick.core.EngineSingleton.engine;
                transform = gameObject.transform;
                rotationEuler = transform.localRotationEuler;
                mouseInput = engine.mouseInput;
            };

            this.update = function () {
                transform.localRotationEuler = rotationEuler;
                if (mouseInput.isButton(2)) {
                    var mouseDelta = mouseInput.deltaMovement;
                    rotationEuler[1] += mouseDelta[0] * rotationSensitivity;
                    rotationEuler[0] += mouseDelta[1] * rotationSensitivity;
                    transform.localRotationEuler = rotationEuler;
                }
            };
        }

        function RotatorComponent () {
            var thisObj = this,
                time,
                transform,
                rotationSpeed = 0.0004,
                upDownSpeed = 0.0001,
                wheelSpeed = 0.0001,
                mouseRotationSpeed = 0.01,
                mouseInput,
                cartesianCoordinates = vec3.create();

            this.activated = function () {
                var gameObject = thisObj.gameObject,
                    engine = kick.core.EngineSingleton.engine;
                transform = gameObject.transform;
                time = engine.time;
                mouseInput = engine.mouseInput;
                mouseInput.mouseWheelPreventDefaultAction = true;
            };

            this.update = function () {
                var mouseDelta,
                    wheelY,
                    delta;
                if (mouseInput.isButton(0)) {
                    mouseDelta = mouseInput.deltaMovement;
                    sphericalCoordinates[1] -= mouseDelta[0] * mouseRotationSpeed;
                    sphericalCoordinates[2] += mouseDelta[1] * mouseRotationSpeed;
                    sphericalCoordinates[2] = Math.max(-Math.PI * 0.499, sphericalCoordinates[2]);
                    sphericalCoordinates[2] = Math.min(Math.PI * 0.499, sphericalCoordinates[2]);
                } else {
                    sphericalCoordinates[1] += time.deltaTime * rotationSpeed;
                    sphericalCoordinates[2] = Math.sin(time.time * upDownSpeed) * Math.PI * 0.25;
                }
                wheelY = mouseInput.deltaWheel[1];
                if (wheelY) {
                    delta = wheelY * wheelSpeed;
                    sphericalCoordinates[0] *= 1 + delta;
                }
                vec3.sphericalToCarterian(cartesianCoordinates, sphericalCoordinates);
                cartesianCoordinates = vec3.add(cartesianCoordinates, objectCenter, cartesianCoordinates);
                transform.position = cartesianCoordinates;
                transform.localRotation = quat.lookAt(quat.create(), cartesianCoordinates, objectCenter, [0, 1, 0]);
            };
        }

        function initDuckTexture() {
            texture = new kick.texture.Texture();
            texture.setTemporaryTexture();
            texture.dataURI = "duckCM.jpg";
            material.setUniform("mainTexture", texture);
        }

        function initLights() {
            var ambientlightGameObject = engine.activeScene.createGameObject();
            ambientlightGameObject.name = "ambient light";
            var ambientLight = new kick.scene.Light({type: kick.scene.Light.TYPE_AMBIENT});
            ambientLight.color = [0.1, 0.1, 0.1];
            ambientlightGameObject.addComponent(ambientLight);

            var lightGameObject = engine.activeScene.createGameObject();
            lightGameObject.name = "directional light";
            var light = new kick.scene.Light(
                {
                    type: kick.scene.Light.TYPE_DIRECTIONAL,
                    color:[1,1,1],
                    intensity:1
                }
            );
            lightGameObject.transform.position = [1,1,1];
            lightGameObject.addComponent(light);
            lightGameObject.addComponent(new LightRotatorComponent());
        }

        function initKick() {
            engine = new kick.core.Engine('canvas',{
                enableDebugContext: false
            });
            var cameraObject = engine.activeScene.createGameObject();
            cameraObject.name = "Camera";
            camera = new kick.scene.Camera({
                clearColor: [0,0,0,1],
                fieldOfView:60,
                far:100000
            });
            cameraObject.addComponent(camera);

            cameraObject.addComponent(new RotatorComponent());

            var gameObject = engine.activeScene.createGameObject();
            gameObject.name = "InitialMesh";
            meshRenderer = new kick.scene.MeshRenderer();
            meshRenderer.mesh = new kick.mesh.Mesh(
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
            var typedArrayToArray = kick.core.Util.typedArrayToArray;
            var scene = engine.activeScene;
            for (var i=scene.getNumberOfGameObjects()-1;i>=0;i--){
                var gameObject = scene.getGameObject(i);
                var meshRenderer = gameObject.getComponentOfType(kick.scene.MeshRenderer);
                if (meshRenderer){
                    var meshData = meshRenderer.mesh.meshData;
                    var obj = {
                        vertex: typedArrayToArray(meshData.vertex),
                        name: meshRenderer.mesh.name || ""
                    };
                    for (var i = 0;i<meshData.subMeshes.length;i++){
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
            var typedArrayToArray = kick.core.Util.typedArrayToArray;
            var scene = engine.activeScene;
            for (var i=scene.getNumberOfGameObjects()-1;i>=0;i--){
                var gameObject = scene.getGameObject(i);
                var meshRenderer = gameObject.getComponentOfType(kick.scene.MeshRenderer);
                if (meshRenderer){
                    var meshData = new kick.mesh.MeshData(meshRenderer.mesh.meshData);
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
                swf: '/example/model_viewer/downloadtify/downloadify.swf',
                downloadImage: 'KickJS.png',
                width: 68,
                height: 26,
                transparent: true,
                append: false,
                dataType: 'base64'
            });
        }

        function loaded(){
            initKick();
            document.getElementById("duckButton").addEventListener("click", duckClicked,false);
            document.getElementById("cubeButton").addEventListener("click", cubeClicked,false);
            document.getElementById("teapotButton").addEventListener("click", teapotClicked,false);
            document.getElementById("pauseButton").addEventListener("click", pauseResume,false);
            document.getElementById("backgroundButton").addEventListener("click", toogleBackground,false);
            document.getElementById("loadModelButton").addEventListener("click", function(){
                window.openFileDialog(true);
            },false);
            document.getElementById("loadTextureButton").addEventListener("click", function(){
                window.openFileDialog(false);
            },false);
            document.getElementById("exportButton").addEventListener("click", window.exportDialog,false);
        }
        loaded();

        YUI().use("panel", function (Y) {
            window.openFileDialog = function(model){
                var description = model?
                    "Open a local model. <br>Collada (.dae) files and Wavefront (.obj) or KickJS (.kickjs) are supported.":
                    "Open a local texture. <br>JPEG and PNG are supported.";
                if (model){
                    description += "<br><input type=\"checkbox\" id=\"RotateAroundX\">&nbsp;<label for=\"RotateAroundX\">Rotate model 90 degress around x-axis</label>";
                }
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
                    var element = Y.one("#RotateAroundX");
                    var rotateAroundX = element && element.get("checked");
                    nestedPanel.hide();
                    loadClicked(this.files,rotateAroundX,model);
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
    });