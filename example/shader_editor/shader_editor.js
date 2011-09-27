var engine,
    meshRenderer,
    vs,
    fs,
    previousShaderError = false,
    isRotating = true,
    light,
    ambientLight,
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
    if (!res){
        previousShaderError = true;
        console.log(KICK.material.Shader.getPrecompiledSource(vs));
        console.log(KICK.material.Shader.getPrecompiledSource(fs));
        document.body.style.backgroundColor = 'pink';
        return;
    }
    var missingAttributes = meshRenderer.mesh.verify(shader);
    if (missingAttributes){
        window.log.log("Missing attributes in mesh "+JSON.stringify(missingAttributes));
        console.log(KICK.material.Shader.getPrecompiledSource(vs));
        console.log(KICK.material.Shader.getPrecompiledSource(fs));
        previousShaderError = true;
        document.body.style.backgroundColor = 'pink';
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

function doShaderChangeListener(){
    if (window.vertexShaderSession && window.fragmentShaderSession){
        var vsNew = window.vertexShaderSession.getValue();
        var fsNew = window.fragmentShaderSession.getValue();
        if (vsNew !== vs || fsNew !== fs){
            vs = vsNew;
            fs = fsNew;
            updateShader();
            trySave();
        }
    }
}

function shaderChangeListener(){
    doShaderChangeListener();
    setTimeout(shaderChangeListener,2000);
}

function tryLoadFromLocalStorage(){
    // take backup of vertexShader and fragmentShader
    document.getElementById("vertexShader").backup = document.getElementById("vertexShader").value;
    document.getElementById("fragmentShader").backup = document.getElementById("fragmentShader").value;
    var shader = localStorage.getItem("shader");
    if (shader){
        shader = JSON.parse(shader);
        document.getElementById("vertexShader").value = shader.vertexShader;
        document.getElementById("fragmentShader").value = shader.fragmentShader;
    }
}

function resetShader(){
    if (confirm("Reset shader code to default?")){
        window.vertexShaderSession.setValue(document.getElementById("vertexShader").backup);
        window.fragmentShaderSession.setValue(document.getElementById("fragmentShader").backup);
        doShaderChangeListener();
    }
}

function trySave(){
    var obj = {
        vertexShader: vs,
        fragmentShader:fs
    };
    localStorage.setItem("shader",JSON.stringify(obj));
}

YUI().use('tabview','console', function(Y) {
    var tabview = new Y.TabView({
        srcNode: '#editorSection'
    });

    tabview.render();
    window.tabview = tabview;

    //create the console
    var r = new Y.Console({
        newestOnTop : false,
        //style: 'block',
        width: 600,
        height: 200,
        consoleLimit:10
    });

    r.render('#logger');
    window.log = r;
    tryLoadFromLocalStorage();
    initKick();

    var initEditor = function(id){
        var editor = ace.edit(id);
        editor.setTheme("ace/theme/twilight");
        var GLSL_ES_Mode = require("ace/mode/glsl_es").Mode;
        var EditSession = require('ace/edit_session').EditSession;
        window.vertexShaderSession = new EditSession( document.getElementById("vertexShader").value );
        window.vertexShaderSession.setMode(new GLSL_ES_Mode());
        editor.setSession(window.vertexShaderSession);
        window.fragmentShaderSession = new EditSession( document.getElementById("fragmentShader").value );
        window.fragmentShaderSession.setMode(new GLSL_ES_Mode());
        return editor;
    };
    window.aceeditor = initEditor('glslEditor');

    tabview.on("selectionChange", function(e){
        switch (e.newVal.get('index')){
            case 0:
                document.getElementById('glslEditorPanel').style.display = "block";
                window.aceeditor.setSession(window.vertexShaderSession);
                    // clear undo manager
                var UndoManager = require("ace/undomanager").UndoManager;
                window.aceeditor.getSession().setUndoManager(new UndoManager());
            break;
            case 1:
                document.getElementById('glslEditorPanel').style.display = "block";
                window.aceeditor.setSession(window.fragmentShaderSession);
                    // clear undo manager
                var UndoManager = require("ace/undomanager").UndoManager;
                window.aceeditor.getSession().setUndoManager(new UndoManager());
            break;
            case 2:
                document.getElementById('glslEditorPanel').style.display = "none";
            break;
        }
    });

    (function setupSettings(){
        function changeMeshfunction(e){
            var meshFactoryFunc;
            var size = 0.5;
            switch(this.meshid){
                case 0:
                    meshFactoryFunc = KICK.scene.MeshFactory.createCube;
                break;
                case 1:
                    meshFactoryFunc = KICK.scene.MeshFactory.createIcosphere;
                    size = 2; // subdivisions
                break;
                default:
                    meshFactoryFunc = KICK.scene.MeshFactory.createPlane;
                break;
            }
            setMesh(meshFactoryFunc,size);
        }
        var meshsetting = document.getElementById('meshsetting');
        for (var i=0;i<meshsetting.children.length;i++){
            meshsetting.children[i].meshid = i;
            meshsetting.children[i].addEventListener('click',changeMeshfunction,false);
        }

        function onRotateMesh(e){
            isRotating = this.isOn;
        }

        var rotatemesh = document.getElementById('rotatemesh');
        for (var i=0;i<rotatemesh.children.length;i++){
            rotatemesh.children[i].isOn = i;
            rotatemesh.children[i].addEventListener('click',onRotateMesh,false);
        }

        var resetShaderBut = document.getElementById('resetShader');
        resetShaderBut.addEventListener('click',resetShader,false);

        (function addLightListeners(){
            function updateLightPosition(e){
                var position = lightTransform.position;
                position[this.position] = this.value;
                lightTransform.position = position;
            }

            var lightpos = document.getElementById('lightpos');
            for (var i=0;lightpos  && i<lightpos.children.length;i++){
                lightpos.children[i].position = i;
                lightpos.children[i].addEventListener('change',updateLightPosition,false);
                lightpos.children[i].addEventListener('click',updateLightPosition,false);
            }

            function updateLightRotation(e){
                var x = document.getElementById('light_rot_x').value;
                var y = document.getElementById('light_rot_y').value;
                var z = document.getElementById('light_rot_z').value;
                lightTransform.rotationEuler = [x,y,z];
                console.log("Light rotation: "+KICK.math.vec3.str(lightTransform.rotationEuler));

            }
            var lightrot = document.getElementById('lightrot');
            for (var i=0;i<lightrot.children.length;i++){
                lightrot.children[i].position = i;
                lightrot.children[i].addEventListener('change',updateLightRotation,false);
                lightrot.children[i].addEventListener('click',updateLightRotation,false);
            }

            function updateLightColor(e){
                var lightColor = light.color;
                lightColor[this.position] = this.value;
                light.color= lightColor;
                console.log("Light color : "+KICK.math.vec3.str(light.color));
                console.log("Light colorIntensity : "+KICK.math.vec3.str(light.colorIntensity));
            }
            var lightcolor = document.getElementById('lightcolor');
            for (var i=0;i<lightcolor.children.length;i++){
                lightcolor.children[i].position = i;
                lightcolor.children[i].addEventListener('change',updateLightColor,false);
                lightcolor.children[i].addEventListener('click',updateLightColor,false);
            }

            function updateColorIntensity(e){
                light.intensity = this.value;
            }
            var lightintensity = document.getElementById('lightintensity');
            lightintensity.addEventListener('change',updateColorIntensity,false);
            lightintensity.addEventListener('click',updateColorIntensity,false);
        })();


        (function addAmbientListener(){
            function updateAmbient(e){
                var color = ambientLight.color;
                color[this.position] = this.value;
                ambientLight.color = color;
                console.log(KICK.math.vec3.str(color));
            }

            var am = document.getElementById('ambientLight');
            for (var i = 0;i < am.children.length;i++){
                am.children[i].position = i;
                am.children[i].addEventListener('change',updateAmbient,false);
                am.children[i].addEventListener('click',updateAmbient,false);
            }
        })();
    })();
});