
(function(){
    "use strict";
    var shaderEditor = window.shaderEditor;
    var username,logoutURL,loginURL;
    var shaderid = "";
    var shortUrl = "";

    function shaderChangeListener(force){
        if (window.vertexShaderSession && window.fragmentShaderSession){
            var meshRenderer = shaderEditor.meshRenderer;
            if (meshRenderer){
                var shader = meshRenderer.material.shader;
                var vsNew = window.vertexShaderSession.getValue();
                var fsNew = window.fragmentShaderSession.getValue();
                if (vsNew !== shader.vertexShaderSrc || fsNew !== shader.fragmentShaderSrc || force){
                    shaderEditor.updateShader(vsNew,fsNew);
                    saveLocally();
                }
            }
        }
    }

    function setShader(shader){
        window.shader = shader;
        var currentTextures = document.getElementById('currentTextures');
        while (currentTextures.options.length>0){
            currentTextures.remove(0);
        }
        document.getElementById('textureDetails').style.display = 'none';
        document.getElementById('texturePreview').style.display = 'none';
        window.vertexShaderSession.setValue(shader.shader.vertexShaderSrc);
        window.fragmentShaderSession.setValue(shader.shader.fragmentShaderSrc);
        shaderEditor.loadMaterial(shader);
        setSettingsData(shader.settingsData);
        updateSettings();
        document.getElementById('shadername').value = shader.name || "Unnamed shader";
        document.getElementById('shaderAbout').value = shader.about;
        updateShaderName();
        shaderChangeListener(true);
    }

    function resetShader(){
        if (window.YUIConfirm("New shader","Create a new shader?",null,function(){
            var shader = JSON.parse(window.defaultMaterial);
            setShader(shader);
            shaderid = "";
            shortUrl = "";
        }));
    }

    function getChildrenValueVector(elementName){
        var elem = document.getElementById(elementName),
            array = [],
            i,
            count = 0;
        for (i=0;i<elem.children.length;i++){
            if (elem.children[i].nodeName === 'INPUT'){
                array[count++] = Number(elem.children[i].value);
            }
        }
        return array;
    }

    function setChildrenValueVector(elementName,vector){
        var elem = document.getElementById(elementName),
            i,
            count = 0,
            childElem;
        for (i=0;i<elem.children.length;i++){
            childElem =elem.children[i];
            if (childElem.nodeName === 'INPUT'){
                childElem.value = vector[count++];
            }
        }
    }

    function getRadioValue(elementName){
        var elem = document.getElementById(elementName),
            i,
            childElem;
        for (i=0;i<elem.children.length;i++){
            childElem =elem.children[i];
            if (childElem.nodeName === 'INPUT'){
                if (childElem.checked){
                    return childElem.value;
                }
            }
        }
    }

    function setRadioValue(elementName,value){
        var  elem = document.getElementById(elementName),
            checked = null,
            isElementChecked,
            firstInputElement = null;
        for (i=0;i<elem.children.length;i++){
            var childElem =elem.children[i];
            if (childElem.nodeName === 'INPUT'){
                isElementChecked = childElem.value === value;
                childElem.checked = isElementChecked;
                if (isElementChecked){
                    checked = childElem;
                }
                if (firstInputElement === null){
                    firstInputElement = childElem;
                }
            }
        }
        if (checked === null){ // if no element found - check the first element
            firstInputElement.checked = true;
        }
    }

    function getTextureData(){
        return shaderEditor.textures;
    }

    function refreshTextures(){
        var currentTextures = document.getElementById('currentTextures'),
            textures = window.shaderEditor.textures;
        // remove all elements from texture list
        while (currentTextures.options.length>0){
            currentTextures.remove(0);
        }
        for (var i=0;i<textures.length;i++){
            var imageSrc = textures[i].dataURI,
                newOption = document.createElement('option');
            newOption.text = (!imageSrc)?"":
                (imageSrc.length<40?imageSrc:imageSrc.substr(0,40)+'...');
            newOption.value = currentTextures.options.length;
            currentTextures.add(newOption,null);
        }
    }

    function getSettingsData(){
        return {
            meshsetting: getRadioValue('meshsetting'),
            projection: getRadioValue('projection'),
            rotatemesh: getRadioValue('rotatemesh'),
            lightpos: getChildrenValueVector('lightpos'),
            lightrot: getChildrenValueVector('lightrot'),
            lightcolor: getChildrenValueVector('lightcolor'),
            lightAmbient: getChildrenValueVector('ambientLight'),
            lightintensity: Number(document.getElementById('lightintensity').value)
        };
    }

    function setSettingsData(settingsData){
        setRadioValue('meshsetting',settingsData.meshsetting);
        setRadioValue('projection',settingsData.projection);
        setRadioValue('rotatemesh',settingsData.rotatemesh);
        var lightintensity = document.getElementById('lightintensity');
        setChildrenValueVector('lightpos',settingsData.lightpos);
        setChildrenValueVector('lightrot',settingsData.lightrot);
        setChildrenValueVector('lightcolor',settingsData.lightcolor);
        lightintensity.value = settingsData.lightintensity;
    }

    function getData(){
        return {
            shader: shaderEditor.meshRenderer.material.shader.toJSON(),
            material: shaderEditor.meshRenderer.material.toJSON(),
            textureData: getTextureData(),
            settingsData: getSettingsData(),
            name: document.getElementById('shadername').value,
            about: document.getElementById('shaderAbout').value
        };
    }

    function addTexture(){
        var t = new KICK.texture.Texture(shaderEditor.engine),
            currentTextures = document.getElementById('currentTextures'),
            newOption = document.createElement('option');
        newOption.text = "New texture #"+currentTextures.options.length;
        newOption.value = currentTextures.options.length;
        currentTextures.add(newOption,null);
        currentTextures.selectedIndex = currentTextures.options.length-1;
        shaderEditor.textures.push(t);
        textureSelected();
    }

    function removeTexture(){
        var currentTextures = document.getElementById('currentTextures'),
            selectedIndex = currentTextures.selectedIndex;
        if (selectedIndex === -1){
            return;
        }
        currentTextures.remove(selectedIndex);
        shaderEditor.textures.splice(selectedIndex,1);
    }

    function textureSelected(){
        var currentTextures = document.getElementById('currentTextures'),
            selectedIndex = currentTextures.selectedIndex,
            c = KICK.core.Constants;
        if (selectedIndex<0){
            console.log("No texture selected");
            return;
        }
        var texture = shaderEditor.textures[selectedIndex];
        document.getElementById('textureSrc').value = texture.dataURI;
        document.getElementById('texturePreviewImg').src = shaderEditor.getWrappedImageSource(texture.dataURI);

        setSelectedGLConstant('textureFormat',texture.internalFormat);
        document.getElementById('mipMapping').checked = texture.generateMipmaps;
        setSelectedGLConstant('textureMode',texture.wrapS);
        document.getElementById('flipY').checked = texture.flipY;
        setSelectedGLConstant('minFilter',texture.minFilter);
        setSelectedGLConstant('magFilter',texture.magFilter);
        setSelectedGLConstant('textureType',texture.textureType);

        document.getElementById('textureDetails').style.display = 'block';
        document.getElementById('texturePreview').style.display = 'block';
    }

    function textureUpdate(){
        var currentTextures = document.getElementById('currentTextures'),
            selectedIndex = currentTextures.selectedIndex,
            imgSrc = document.getElementById('textureSrc').value,
            preview = document.getElementById('texturePreviewImg'),
            updatePreview = function(url){
                preview.src = url;
            };
        if (selectedIndex<0){
            return;
        }
        var texture = shaderEditor.textures[selectedIndex];
        var textureConf = {
            internalFormat: getSelectedGLConstant('textureFormat'),
            generateMipmaps: document.getElementById('mipMapping').checked,
            wrapS: getSelectedGLConstant('textureMode'),
            wrapT: getSelectedGLConstant('textureMode'),
            flipY: document.getElementById('flipY').checked,
            minFilter: getSelectedGLConstant('minFilter'),
            magFilter: getSelectedGLConstant('magFilter'),
            textureType: getSelectedGLConstant('textureType'),
            dataURI:imgSrc
        };
        shaderEditor.updateTexture(texture,textureConf,updatePreview);
    }

    function saveLocally(){
        var jsonData = getData();
        localStorage.setItem("shader",JSON.stringify(jsonData));
    }

    /**
     * Loads a shader (if not found - use the default material).
     * This will replace the global window.shader - but not change UI or update shader
     */
    function loadLocally(){
        try{
            var shaderData = JSON.parse(window.defaultMaterial);
            window.shader = shaderData;

            var shaderStr = localStorage.getItem("shader");
            if (shaderStr){
                var shaderDataTmp = JSON.parse(shaderStr);
                if (shaderDataTmp){
                    window.shader = shaderData;
                    shaderData = shaderDataTmp;
                }
            }
        } catch (e){
            console.log(e);
            window.shader = JSON.parse(window.defaultMaterial);
        }
        return window.shader;
    }

    /**
     * Add gl attribute to option elements of a select
     * @param elementId select element to be modified
     * @param constants array of GL constants
     */
    function addGLConstantToSelect(elementId, constants){
        var elem = document.getElementById(elementId),
            options = elem.options;

        if (options.length !== constants.length){
            throw new Error("options.length !== constants.length");
        }
        for (var i=0;i<options.length;i++){
            options[i].gl = constants[i];
        }
    }

    function getSelectedGLConstant(elementId){
        var elem = document.getElementById(elementId),
            options = elem.options,
            selectedIndex = elem.selectedIndex;
        if (selectedIndex===-1){
            return null;
        }
        return options[elem.selectedIndex].gl;
    }

    function setSelectedGLConstant(elementId, glConst){
        var elem = document.getElementById(elementId),
                options = elem.options;
        for (var i=0;i<options.length;i++){
            if (options[i].gl === glConst){
                elem.selectedIndex = i;
                return true;
            }
        }
        return false;
    }

    function getUniformType(uniform){
        var type = "Unknown "+uniform.type,
            c = KICK.core.Constants,
            uniformGroup = "number",
            isMatrix = false,
            isInteger = false,
            length;


        switch (uniform.type){
            case c.GL_FLOAT:
                type = "float";
                length = 1;
            break;
            case c.GL_FLOAT_MAT2:
                type = "float_mat2";
                length = 4;
                isMatrix = true;
            break;
            case c.GL_FLOAT_MAT3:
                type = "float_mat3";
                length = 9;
                isMatrix = true;
            break;
            case c.GL_FLOAT_MAT4:
                type = "float_mat4";
                length = 16;
                isMatrix = true;
            break;
            case c.GL_FLOAT_VEC2:
                type = "float_vec2";
                length = 2;
            break;
            case c.GL_FLOAT_VEC3:
                type = "float_vec3";
                length = 3;
            break;
            case c.GL_FLOAT_VEC4:
                type = "float_vec4";
                length = 4;
            break;
            case c.GL_INT:
                type = "int";
                length = 1;
                isInteger = true;
            break;
            case c.GL_INT_VEC2:
                type = "int_vec2";
                length = 2;
                isInteger = true;
            break;
            case c.GL_INT_VEC3:
                type = "int_vec3";
                length = 3;
                isInteger = true;
            break;
            case c.GL_INT_VEC4:
                type = "int_vec4";
                length = 4;
                isInteger = true;
            break;
            case c.GL_SAMPLER_2D:
                type = "Sampler 2D";
                uniformGroup = "sampler";
                length = 1;
            break;
            case c.GL_SAMPLER_CUBE:
                type = "Sampler cube";
                uniformGroup = "sampler";
                length = 1;
            break;
        }

        if (uniform.name.indexOf("_")==0){
            uniformGroup = "autobound";
        }

        return {
            type:type,
            group:uniformGroup,
            length:length,
            isMatrix: isMatrix,
            isInteger: isInteger
        };
    }

    function uniformSelected(){
        var material = shaderEditor.meshRenderer.material,
            activeUniforms = material.shader.activeUniforms,
            uniformDetail = document.getElementById('uniformDetail'),
            currentUniforms = document.getElementById('currentUniforms'),
            selectedIndex = currentUniforms.selectedIndex,
            uniform = activeUniforms[selectedIndex],
            uniformTypeObj = getUniformType(uniform),
            uniformType = uniformTypeObj.type,
            uniformGroup = uniformTypeObj.group,
            uniformLength = uniformTypeObj.length,
            materialUniform;

        uniformDetail.style.display = 'block';
        if (selectedIndex === -1){
            return;
        }

        document.getElementById('uniformName').value = uniform.name;
        document.getElementById('uniformType').value = uniformType;
        document.getElementById('uniformSize').value = uniform.size;

        document.getElementById('uniform_group_autobound').style.display = uniformGroup==="autobound"?"block":"none";
        document.getElementById('uniform_group_number').style.display = uniformGroup==="number"?"block":"none";
        document.getElementById('uniform_group_sampler').style.display = uniformGroup==="sampler"?"block":"none";
        if (uniformGroup==="autobound"){
            return;
        }
        materialUniform = material.uniforms[uniform.name] || {};
        if (uniformGroup==="number"){
            setUniformNumberValue(uniform,materialUniform.value);
        } else if (uniformGroup==="sampler"){
            var uniform_sampler = document.getElementById('uniform_sampler');
            // remove all textures
            while (uniform_sampler.options.length>0){
                uniform_sampler.remove(0);
            }

            for (var i=0;i<shaderEditor.textures.length;i++){
                var texture = shaderEditor.textures[i],
                    imageSrc = texture.dataURI,
                    newOption = document.createElement('option');
                newOption.text = imageSrc.length<40?imageSrc:imageSrc.substr(0,40)+'...';
                uniform_sampler.add(newOption);
                if (texture === materialUniform.value){
                    uniform_sampler.selectedIndex = i;
                }
            }
        }
    }

    function getUniformNumberElement(index){
        return document.getElementById("uniform_"+index);
    }

    function setUniformNumberValue(uniform,value){
        var uniformTypeObj = getUniformType(uniform),
            uniformLength = uniformTypeObj.length,
            isMatrix = uniformTypeObj.isMatrix,
            elem,
            i;
        if (isMatrix){
            var matrixWidth = 4;
            switch (uniformLength){
                case 4:
                matrixWidth = 2;
                break;
                case 9:
                matrixWidth = 3;
                break;
            }

            for (var x=0;x<4;x++){
                for (var y=0;y<4;y++){
                    i = x*4+y;
                    var arrayIndex = x*matrixWidth+y;
                    elem = getUniformNumberElement(i);
                    if (Math.max(x,y)<matrixWidth){
                        elem.style.display = 'inline';
                        elem.value = value?value[arrayIndex]:0;
                    } else {
                        elem.style.display = 'none';
                    }
                }
            }
        } else {
            for (i=0;i<16;i++){
                elem = getUniformNumberElement(i);
                if (i<uniformLength){
                    elem.style.display = 'inline';
                    elem.value = value?value[i]:0;
                } else {
                    elem.style.display = 'none';
                }
            }
        }
    }

    function getUniformNumberValue(uniform){
        var uniformTypeObj = getUniformType(uniform),
            uniformLength = uniformTypeObj.length,
            isMatrix = uniformTypeObj.isMatrix,
            isInteger = uniformTypeObj.isInteger,
            array = isInteger?new Int32Array(uniformLength): new Float32Array(uniformLength),
            i,
            elem;
        if (isMatrix){
            var matrixWidth = 4;
            switch (uniformLength){
                case 4:
                matrixWidth = 2;
                break;
                case 9:
                matrixWidth = 3;
                break;
            }

            for (var x=0;x<4;x++){
                for (var y=0;y<4;y++){
                    i = x*4+y;
                    var arrayIndex = x*matrixWidth+y;
                    elem = getUniformNumberElement(i);
                    if (Math.max(x,y)<matrixWidth){
                        array[arrayIndex] = Number(elem.value);
                    }
                }
            }
        } else {
            for (i=0;i<16;i++){
                elem = getUniformNumberElement(i);
                if (i<uniformLength){
                    array[i] = Number(elem.value);
                }
            }

        }
        return array;
    }

    function updateUniformSampler(){
        var uniform_sampler = document.getElementById('uniform_sampler'),
            selectedSampler = uniform_sampler.selectedIndex,
            material = shaderEditor.meshRenderer.material,
            activeUniforms = material.shader.activeUniforms,
            uniformDetail = document.getElementById('uniformDetail'),
            currentUniforms = document.getElementById('currentUniforms'),
            selectedIndex = currentUniforms.selectedIndex,
            uniform = activeUniforms[selectedIndex],
            c = KICK.core.Constants,
            selectedTexture = shaderEditor.textures[selectedSampler];
        material.uniforms[uniform.name] = {
            value: selectedTexture,
            type: selectedTexture.textureType === c.GL_TEXTURE_2D ? c.GL_SAMPLER_2D : c.GL_SAMPLER_CUBE
        };
    }

    function updateUniformNumber(){
        var uniform_sampler = document.getElementById('uniform_sampler'),
            selectedSampler = uniform_sampler.selectedIndex,
            material = shaderEditor.meshRenderer.material,
            activeUniforms = material.shader.activeUniforms,
            uniformDetail = document.getElementById('uniformDetail'),
            currentUniforms = document.getElementById('currentUniforms'),
            selectedIndex = currentUniforms.selectedIndex,
            uniform = activeUniforms[selectedIndex],
            c = KICK.core.Constants;
        material.uniforms[uniform.name] = {
            value: getUniformNumberValue(uniform),
            type: uniform.type
        };
    }


    function refreshUniforms(){
        var activeUniforms = shaderEditor.meshRenderer.material.shader.activeUniforms,
            i,
            currentUniforms = document.getElementById('currentUniforms'),
            uniformDetail = document.getElementById('uniformDetail');

        // hide uniform details
        uniformDetail.style.display = 'none';

        // remove all elements from uniform list
        while (currentUniforms.options.length>0){
            currentUniforms.remove(0);
        }

        // insert all uniforms
        for (i=0;i<activeUniforms.length;i++){
            var activeUniform = activeUniforms[i];
            var newOption = document.createElement('option');
            var type =  getUniformType(activeUniform).type;
            newOption.text = activeUniform.name+" ("+type+")";
            currentUniforms.add(newOption,null);
        }
    }

    function toogleFullscreen(){
        var i, child;
        var menuAndContent = document.getElementById("menuAndContent");
        if (window.isHidden){
            document.getElementById("ahead").style.display = "block";
            for (i=menuAndContent.childElementCount-1;i>=0;i--){
                child = menuAndContent.children[i];
                if (child.nodeName !== "CANVAS"){
                    child.style.display = child.style.initialDisplay;
                } else {
                    child.width = 300;
                    child.height = 300;
                }
            }
            document.getElementById("mainEditor").style.display = "block";
            document.getElementById("alogger").style.display = "block";
            document.body.style.overflow = '';
        } else {
            for (i=menuAndContent.childElementCount-1;i>=0;i--){
                child = menuAndContent.children[i];
                if (child.nodeName !== "CANVAS"){
                    child.style.initialDisplay = child.style.display;
                    child.style.display = "none";
                } else {
                    child.width = window.innerWidth;
                    child.height = window.innerHeight;
                }
            }
            document.getElementById("ahead").style.display = "none";
            document.getElementById("mainEditor").style.display = "none";
            document.getElementById("alogger").style.display = "none";
            document.body.style.overflow = 'hidden';
        }
        window.isHidden = !window.isHidden;
        shaderEditor.canvasResized();
    }

    function onLogoutButton(){
        document.location = logoutURL;
    }

    function onLoginButton(){
        saveLocally();
        document.location = loginURL;
    }

    function loadShaderFromServer(id){
        var oReq = new XMLHttpRequest();
        function handler()
        {
            if (oReq.readyState == 4 /* complete */) {
                if (oReq.status == 200) {
                    var obj = JSON.parse(oReq.responseText);
                    shaderid = id;
                    shortUrl = obj.shortUrl;
                    setShader(JSON.parse(obj.data));
                } else {
                    console.log("loadShaderFromServer status "+oReq.status);
                }
            }
        }

        oReq.open("GET", "/example/shader_editor/GetShader?id="+id+"&ts="+new Date().getTime(), true);
        oReq.onreadystatechange = handler;
        oReq.send();
    }

    function loadShaderSync(id){
        var oReq = new XMLHttpRequest();
        var result = null;
        function handler()
        {
            if (oReq.readyState == 4 /* complete */) {
                if (oReq.status == 200) {
                    result = JSON.parse(oReq.responseText);
                    shaderid = id;
                    shortUrl = result.shortUrl;
                } else {
                    console.log("loadShaderFromServer status "+oReq.status);
                }
            }
        }

        oReq.open("GET", "/example/shader_editor/GetShader?id="+id+"&ts="+new Date().getTime(), false);
        oReq.onreadystatechange = handler;
        oReq.send();
        return result;
    }

    function onLoadButton(){
        if (!username){
            window.YUIMessage("Login needed", "To load a shader you need to login first.");
            return;
        }
        if (this.isLoading){
            return;
        }
        this.isLoading = true;
        var thisObj = this;
        var oReq = new XMLHttpRequest();
        function handler()
        {
            if (oReq.readyState == 4 /* complete */) {
                delete thisObj.isLoading;
                if (oReq.status == 200) {
                    var obj = JSON.parse(oReq.responseText);
                    var shaderList = obj.shaderList;
                    if (shaderList && shaderList.length){
                        window.YUILoad(shaderList);
                    } else {
                        window.YUIMessage("Load", "Nothing to load.");
                    }

                } else {
                    console.log("Request returned "+oReq.status);
                }
            }
        }

        oReq.open("GET", "/example/shader_editor/GetShader?ts="+new Date().getTime(), true);
        oReq.onreadystatechange = handler;
        oReq.send();
    }

    function onSaveButton(){
        if (!username){
            window.YUIMessage("Login needed", "To save a shader you need to login first.");
            return;
        }

        var name = document.getElementById("shadername").value;
        if (name.trim().length == 0){
            YUIMessage("Shader name not valid", "Change name in the 'about'-tab");
            return;
        }
        
        var saveButton = document.getElementById('SaveButton');
        saveButton.innerHTML = "Saving ...";
        function resetSave(){
            saveButton.innerHTML = "Save";
        }

        var about = document.getElementById("shaderAbout").value;
        var jsonData = getData();
        
        var obj = {
            id:shaderid,
            name:name,
            about:about,
            owner:username,
            data:JSON.stringify(jsonData)
        };
        var objStr = JSON.stringify(obj);
        var oReq = new XMLHttpRequest();

        function handler()
        {
            if (oReq.readyState == 4 /* complete */) {
                if (oReq.status == 200) {
                    var obj = JSON.parse(oReq.responseText);
                    shaderid = obj.id;
                    shortUrl = obj.shortUrl;
                    console.log(obj.message);
                    saveButton.innerHTML = obj.message;
                } else {
                    saveButton.innerHTML = "Save error";
                }
                setTimeout(resetSave,3000);
            }
        }
        oReq.open("POST", "/example/shader_editor/UpdateShader", true);
        oReq.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        oReq.onreadystatechange = handler;
        oReq.send(objStr);
    }

    function onShareButton(){
        if (!username){
            window.YUIMessage("Login needed", "To share a shader you need to login and save the shader.");
            return;
        }
        if (shortUrl ==null || shortUrl.length==0){
            window.YUIMessage("Error", "Shader needs to be saved first");
            return;
        }
        var div = document.createElement("div");
        var input = document.createElement("input");
        input.style.width="205px";
        input.style.font = "120% arial,helvetica,clean";
        input.type="text";
        input.value = shortUrl;
        div.appendChild(document.createTextNode("Short url:"));
        div.appendChild(document.createElement("br"));
        div.appendChild(input);
        div.appendChild(document.createElement("br"));
        var bottomText = document.createElement("a");
        bottomText.href = shortUrl+".info";
        bottomText.target = "_new";

        var statsText = document.createTextNode("See stats");
        bottomText.appendChild(statsText);
        div.appendChild(bottomText);
        div.appendChild(document.createElement("br"));
        var tweet = document.createTextNode("For tweeting use #KickJS");
        div.appendChild(tweet);


        YUIMessage("This shader can be accessed by anyone at:",div);
        input.focus();
        input.select();
    }

    function updateSettings(){
        var data = getSettingsData();
        window.shaderEditor.updateSettings(data);
    }

    function updateShaderName(){
        var val = document.getElementById('shadername').value;
        var title = "Kick.js | Shader editor | "+val;
        document.getElementById('header').innerHTML = title.escapeHTML();
        document.title = title;
    }

    window.YUI().use('tabview','console', "panel", "datatable-base", "dd-plugin",function(Y) {
        var c = KICK.core.Constants;
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
        var idParameter = document.location.hash.length>1;
        var shader = null;
        if (idParameter){
            idParameter = document.location.hash.substring(1);
            document.location.hash = "";
            var result = loadShaderSync(idParameter);
            shader = JSON.parse(result.data);
        }
        if (shader==null){
            shader = loadLocally();
        }

        shaderEditor.initKick();

        var initEditor = function(id){
            var editor = window.ace.edit(id);
            editor.setTheme("ace/theme/twilight");
            var GLSL_ES_Mode = window.require("ace/mode/glsl_es").Mode;
            var EditSession = window.require('ace/edit_session').EditSession;
            window.vertexShaderSession = new EditSession( shader.shader.vertexShaderSrc );
            window.vertexShaderSession.setMode(new GLSL_ES_Mode());
            editor.setSession(window.vertexShaderSession);
            window.fragmentShaderSession = new EditSession( shader.shader.fragmentShaderSrc);
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
                    var UndoManager = window.require("ace/undomanager").UndoManager;
                    window.aceeditor.getSession().setUndoManager(new UndoManager());
                break;
                case 1:
                    document.getElementById('glslEditorPanel').style.display = "block";
                    window.aceeditor.setSession(window.fragmentShaderSession);
                        // clear undo manager
                    var UndoManager = window.require("ace/undomanager").UndoManager;
                    window.aceeditor.getSession().setUndoManager(new UndoManager());
                break;
                case 2:
                    refreshTextures();
                    document.getElementById('glslEditorPanel').style.display = "none";
                break;
                case 3:
                    refreshUniforms();
                    document.getElementById('glslEditorPanel').style.display = "none";
                break;
                default:
                    document.getElementById('glslEditorPanel').style.display = "none";
                break;
            }
        });

        window.YUIMessage = function (headerTxt,bodyTxt){
            var nestedPanel = new Y.Panel({
                headerContent: headerTxt,
                bodyContent:bodyTxt,
                zIndex: 5, //We set a z-index higher than the parent's z-index
                centered:true,
                width:250,
                modal:true,

                buttons: [
                    {
                        value: "Close",
                        action  : function(e) {
                            e.preventDefault();
                            nestedPanel.hide();
                        },
                        section: Y.WidgetStdMod.FOOTER
                    }
                ]
            });

            nestedPanel.render('#nestedPanel');
        };

        window.YUILoad = function(elements){
            var bodyContent = document.createElement("select");
            bodyContent.style.width = "225px";
            bodyContent.style.height = "200px";
            bodyContent.style.font = "120% arial,helvetica,clean";
            bodyContent.multiple = true;
            for (var i=0;i<elements.length;i++){
                var elem = elements[i];
                var option = document.createElement("option");
                option.value = elem.id;
                option.innerHTML = elem.name;
                bodyContent.appendChild(option);
            }
            var panel = new Y.Panel({
                srcNode: "#panelContent",
                width: 250,
                centered: true,
                visible: true,
                modal:true,
                zIndex:5,
                headerContent: "Load shader",
                bodyContent: bodyContent,
                buttons:[
                    {
                        value: "Cancel",
                        action: function(e) {
                            e.preventDefault();
                            panel.hide();
                            panel.destroy();
                        },
                        section: Y.WidgetStdMod.FOOTER
                    },
                    {
                        value: "Load",
                        action: function(e) {
                            e.preventDefault();
                            panel.hide();
                            var selectedIndex = bodyContent.selectedIndex;
                            if (selectedIndex >-1){
                                var id = bodyContent.options[selectedIndex].value;
                                loadShaderFromServer(id);
                            }
                            panel.destroy();
                        },
                        section: Y.WidgetStdMod.FOOTER
                    }
                ]
            });

            panel.render();
            window.tabview.selectChild(0);
        };

        window.YUIConfirm = function (headerTxt,bodyTxt,onCancel,onOK){
            var nestedPanel = new Y.Panel({
                headerContent: headerTxt,
                bodyContent:bodyTxt,
                zIndex: 5, //We set a z-index higher than the parent's z-index
                centered:true,
                width:250,
                modal:true,

                buttons: [
                    {
                        value: "Cancel",
                        action  : function(e) {
                            e.preventDefault();
                            nestedPanel.hide();
                            if (onCancel){
                                onCancel();
                            }
                        },
                        section: Y.WidgetStdMod.FOOTER
                    },
                    {
                        value: "OK",
                        action  : function(e) {
                            e.preventDefault();
                            nestedPanel.hide();
                            if (onOK){
                                onOK();
                            }
                        },
                        section: Y.WidgetStdMod.FOOTER
                    }

                ]
            });

            nestedPanel.render('#nestedPanel');
        };

        (function setupSettings(){
            var meshsetting = document.getElementById('meshsetting'),
                projection = document.getElementById('projection'),
                rotatemesh = document.getElementById('rotatemesh'),
                resetShaderBut = document.getElementById('resetShader'),
                addChildListeners = function (component, listener, listenerNames,tag){
                    var i;
                    for (i=0;i<component.children.length;i++){
                        if (Array.isArray(listenerNames)){
                            for (var j=0;j<listenerNames.length;j++){
                                component.children[i].addEventListener(listenerNames[j],listener,false);
                            }
                        } else {
                            component.children[i].addEventListener(listenerNames,listener,false);
                        }
                        if (tag){
                            component.children[i][tag] = i;
                        }
                    }
                };

            addChildListeners(meshsetting,updateSettings,'click',"meshid");
            addChildListeners(projection,updateSettings,'click',"projection");
            addChildListeners(rotatemesh,updateSettings,'click',"isOn");
            resetShaderBut.addEventListener('click',resetShader,false);

            (function addLightListeners(){
                var lightpos = document.getElementById('lightpos'),
                    lightrot = document.getElementById('lightrot'),
                    lightcolor = document.getElementById('lightcolor'),
                    lightintensity = document.getElementById('lightintensity');

                addChildListeners(lightpos,updateSettings,['click','change'],"position");
                addChildListeners(lightrot,updateSettings,['click','change'],"position");
                addChildListeners(lightcolor,updateSettings,['click','change'],"position");

                lightintensity.addEventListener('change',updateSettings,false);
                lightintensity.addEventListener('click',updateSettings,false);
            })();


            (function addAmbientListener(){
                var am = document.getElementById('ambientLight');
                addChildListeners(am,updateSettings,['click','change'],"position");
            })();

            addGLConstantToSelect('textureFormat',[c.GL_ALPHA,c.GL_RGB,c.GL_RGBA,c.GL_LUMINANCE,c.GL_LUMINANCE_ALPHA]);
            addGLConstantToSelect('textureMode',[c.GL_REPEAT,c.GL_CLAMP_TO_EDGE]);
            addGLConstantToSelect('minFilter',[c.GL_NEAREST,c.GL_LINEAR,c.GL_NEAREST_MIPMAP_NEAREST,c.GL_LINEAR_MIPMAP_NEAREST,c.GL_NEAREST_MIPMAP_LINEAR,c.GL_LINEAR_MIPMAP_LINEAR]);
            addGLConstantToSelect('magFilter',[c.GL_NEAREST,c.GL_LINEAR]);
            addGLConstantToSelect('textureType',[c.GL_TEXTURE_2D,c.GL_TEXTURE_CUBE_MAP]);

            document.getElementById('textureTypeInfo').addEventListener('click', function(){
                window.YUIMessage("Texture type", "Cube maps must be arranged in one row with the order [Right, Left, Top, Bottom, Front, Back] (also used in <a href='http://www.cgtextures.com/content.php?action=tutorial&name=cubemaps'>NVidia DDS Exporter</a>)<br>");
            }, false);


            document.getElementById('fullscreen').addEventListener('click', toogleFullscreen,false);
            document.getElementById('LogoutButton').addEventListener('click', onLogoutButton,false);
            document.getElementById('LoginButton').addEventListener('click', onLoginButton,false);
            document.getElementById('LoadButton').addEventListener('click', onLoadButton,false);
            document.getElementById('SaveButton').addEventListener('click', onSaveButton,false);

            document.getElementById('ShareButton').addEventListener('click', onShareButton,false);


            document.getElementById('canvas').addEventListener('click', toogleFullscreen,false);
            document.getElementById('addTextureButton').addEventListener('click', addTexture, false);
            document.getElementById('removeTextureButton').addEventListener('click', removeTexture, false);
            document.getElementById('currentTextures').addEventListener('click', textureSelected, false);

            document.getElementById('updateTexture').addEventListener('click', textureUpdate, false);
            document.getElementById('currentUniforms').addEventListener('click', uniformSelected, false);
            document.getElementById('uniform_sampler_update').addEventListener('click', updateUniformSampler, false);
            document.getElementById('uniform_number_update').addEventListener('click', updateUniformNumber, false);
            document.getElementById('shadername').addEventListener('change', updateShaderName, false);

            // start shader listener
            setInterval(shaderChangeListener,2000);
        })();

        function loginInfo(){
            var oReq = new XMLHttpRequest();

            function handler()
            {
                if (oReq.readyState == 4 /* complete */) {
                    if (oReq.status == 200) {
                        var obj = JSON.parse(oReq.responseText);
                        if (obj.logoutURL){
                            logoutURL = obj.logoutURL;
                            username = obj.username;
                            document.getElementById('LogoutButton').style.display = "inline";
                            document.getElementById('username').style.display = "block";
                            document.getElementById('username').innerHTML = "Logged in as "+username;
                            document.getElementById('LoginButton').style.display = "none";
                        } else {
                            loginURL = obj.loginURL;
                            document.getElementById('LogoutButton').style.display = "none";
                            document.getElementById('username').style.display = "none";
                            document.getElementById('username').innerHTML = "";
                            document.getElementById('LoginButton').style.display = "inline";
                        }
                    }
                }
            }
            oReq.open("GET", "/LoginInfo?ts="+new Date().getTime()+"&url="+document.location.href, true);
            oReq.onreadystatechange = handler;
            oReq.send();
        }
        setShader( shader );
        loginInfo();
        setInterval(loginInfo,1000*60*30); // check for logout every 30 min
    });
})();

// add trim function to string
String.prototype.trim=function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};

String.prototype.escapeHTML = function () {
        return(
            this.replace(/&/g,'&amp;').
                replace(/>/g,'&gt;').
                replace(/</g,'&lt;').
                replace(/"/g,'&quot;')
        );
    };