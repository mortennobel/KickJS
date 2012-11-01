window.onload = function () {
    "use strict";

    var engine,
        camera,
        cameraObject,
        rotationEuler = [0, 0, 0];

    function MouseRotationComponent() {
        var thisObj = this,
            transform,
            rotationSensitivity = 1,
            rotationEuler,
            mouseInput,
            objectPicked = function (pickObject) {
                console.log("Object picked");
            };
        this.activated = function () {
            var gameObject = thisObj.gameObject,
                engine = gameObject.engine;
            transform = gameObject.transform;
            rotationEuler = transform.localRotationEuler;
            mouseInput = engine.mouseInput;
        };

        this.update = function () {
            var cameraPosition,
                mouseDelta;
            transform.localRotationEuler = rotationEuler;
            if (mouseInput.isButton(2)) {
                mouseDelta = mouseInput.deltaMovement;
                rotationEuler[1] += mouseDelta[0] * rotationSensitivity;
                rotationEuler[0] += mouseDelta[1] * rotationSensitivity;
                rotationEuler[0] = Math.min(89, rotationEuler[0]);
                rotationEuler[0] = Math.max(-89, rotationEuler[0]);
                transform.localRotationEuler = rotationEuler;
            }
            if (mouseInput.isButtonUp(0)) {
                camera.pickPoint(objectPicked, mouseInput.mousePosition[0], mouseInput.mousePosition[1]);
            }
            if (mouseInput.deltaWheel[1]) {
                cameraPosition = cameraObject.transform.localPosition;
                cameraPosition[2] = Math.max(0.1, cameraPosition[2] + mouseInput.deltaWheel[1] * 0.001);
                cameraObject.transform.localPosition = cameraPosition;
            }
        };
    }

    function createMaterial() {
        var shader = engine.project.load(engine.project.ENGINE_SHADER_UNLIT),
            material = new KICK.material.Material(engine, {
                name: "Some material",
                shader: shader
            }),
            texture = new KICK.texture.Texture(engine);
        texture.setTemporaryTexture();
        texture.dataURI = "lambertian.jpg";
        material.setUniform("mainTexture", texture);
        return material;
    }

    function insertModelToScene(content){
        var activeScene = engine.activeScene,
            gameObject = activeScene.createGameObject(),
            meshRenderer,
            meshData = new KICK.mesh.MeshData(),
            mesh;
        meshData.deserialize(content);
        mesh = new KICK.mesh.Mesh(engine, {
            meshData: meshData
        });
        meshRenderer = new KICK.scene.MeshRenderer({
            mesh: mesh,
            materials: [createMaterial()]
        });
        gameObject.addComponent(meshRenderer);
        gameObject.addComponent(new MouseRotationComponent());
    }

    function loadKickJSModelFromURL(url) {
        var oReq = new XMLHttpRequest();
        function handler()
        {
            if (oReq.readyState === 4 /* complete */) {
                if (oReq.status === 200) {
                    var content = oReq.response;
                    insertModelToScene(content);
                }
            }
        }
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";
        oReq.onreadystatechange = handler;
        oReq.send();
    }

    function initKick() {
        engine = new KICK.core.Engine('canvas', {
            enableDebugContext: true
        });
        var activeScene = engine.activeScene;
        cameraObject = activeScene.createGameObject();

        camera = new KICK.scene.Camera({
            clearColor: [124/255,163/255,137/255,1]
        });
        cameraObject.addComponent(camera);
        cameraObject.transform.position = [0,0,0.5];

        loadKickJSModelFromURL("head-model.kickjs");
    }

    function documentResized () {
        var canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        if (engine) {
            engine.canvasResized();
        }
    }
    initKick();
    documentResized();
    window.onresize = documentResized;
};
