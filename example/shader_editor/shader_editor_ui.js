
(function () {
    "use strict";
    var KICK = window.KICK,
        YUIMessage = window.YUIMessage,
        shader,
        shaderEditor = window.shaderEditor,
        username,
        logoutURL,
        loginURL,
        shaderid = "",
        shortUrl = "",
        controller,
        ButtonPanel = function (Y) {
            var onFullscreenButton = function () {
                    if (shaderEditor.engine.isFullScreenSupported()) {
                        shaderEditor.engine.setFullscreen(true);
                    } else {
                        alert("Fullscreen is not supported in this browser");
                    }
                },
                onLogoutButton = function () {
                    document.location = logoutURL;
                },
                onLoginButton = function () {
                    document.location = loginURL;
                },
                onLoadButton = function () {
                    var thisObj = this,
                        oReq = new XMLHttpRequest();
                    if (!username) {
                        window.YUIMessage("Login needed", "To load a shader you need to login first.");
                        return;
                    }
                    if (this.isLoading) {
                        return;
                    }
                    this.isLoading = true;
                    function handler() {
                        if (oReq.readyState === 4) { ///* complete */
                            delete thisObj.isLoading;
                            if (oReq.status === 200) {
                                var obj = JSON.parse(oReq.responseText),
                                    shaderList = obj.shaderList;
                                if (shaderList && shaderList.length) {
                                    window.YUILoad(shaderList);
                                } else {
                                    window.YUIMessage("Load", "Nothing to load.");
                                }
                            } else {
                                console.log("Request returned " + oReq.status);
                            }
                        }
                    }

                    oReq.open("GET", "/example/shader_editor/GetShader?ts=" + new Date().getTime(), true);
                    oReq.onreadystatechange = handler;
                    oReq.send();
                },
                onSaveButton = function () {
                    var name,
                        about,
                        jsonData,
                        obj,
                        objStr,
                        oReq,
                        saveButton,
                        resetSave = function () {
                            saveButton.innerHTML = "Save";
                        },
                        handler = function () {
                            if (oReq.readyState === 4) { // /* complete */
                                if (oReq.status === 200) {
                                    var obj = JSON.parse(oReq.responseText);
                                    shaderid = obj.id;
                                    shortUrl = obj.shortUrl;
                                    console.log(obj.message);
                                    saveButton.innerHTML = obj.message;
                                } else {
                                    saveButton.innerHTML = "Save error";
                                }
                                setTimeout(resetSave, 3000);
                            }
                        };
                    if (!username) {
                        window.YUIMessage("Login needed", "To save a shader you need to login first.");
                        return;
                    }
                    name = document.getElementById("shadername").value;
                    if (name.trim().length === 0) {
                        YUIMessage("Shader name not valid", "Change name in the 'about'-tab");
                        return;
                    }

                    saveButton = document.getElementById('SaveButton');
                    saveButton.innerHTML = "Saving ...";

                    about = document.getElementById("shaderAbout").value;
                    jsonData = controller.getData();

                    obj = {
                        id: shaderid,
                        name: name,
                        about: about,
                        owner: username,
                        data: JSON.stringify(jsonData)
                    };
                    objStr = JSON.stringify(obj);
                    oReq = new XMLHttpRequest();

                    oReq.open("POST", "/example/shader_editor/UpdateShader", true);
                    oReq.setRequestHeader("Content-type", "application/json; charset=UTF-8");
                    oReq.onreadystatechange = handler;
                    oReq.send(objStr);
                },
                onShareButton = function () {
                    var div,
                        input,
                        bottomText,
                        statsText,
                        tweet;
                    if (!username) {
                        window.YUIMessage("Login needed", "To share a shader you need to login and save the shader.");
                        return;
                    }
                    if (shortUrl === null || shortUrl.length === 0) {
                        window.YUIMessage("Error", "Shader needs to be saved first");
                        return;
                    }
                    div = document.createElement("div");
                    input = document.createElement("input");
                    input.style.width = "205px";
                    input.style.font = "120% arial,helvetica,clean";
                    input.type = "text";
                    input.value = shortUrl;
                    div.appendChild(document.createTextNode("Short url:"));
                    div.appendChild(document.createElement("br"));
                    div.appendChild(input);
                    div.appendChild(document.createElement("br"));
                    bottomText = document.createElement("a");
                    bottomText.href = shortUrl + ".info";
                    bottomText.target = "_new";

                    statsText = document.createTextNode("See stats");
                    bottomText.appendChild(statsText);
                    div.appendChild(bottomText);
                    div.appendChild(document.createElement("br"));
                    tweet = document.createTextNode("For tweeting use #KickJS");
                    div.appendChild(tweet);

                    YUIMessage("This shader can be accessed by anyone at:",div);
                    input.focus();
                    input.select();
                },
                onExampleButton = function () {
                    window.YUILoadExample();
                },
                onNewButton = function () {
                    window.YUIConfirm("New shader", "Create a new shader?", null, function () {
                        var shader = JSON.parse(window.defaultMaterial);
                        controller.setShader(shader);
                        shaderid = "";
                        shortUrl = "";
                    });
                };
            Y.one("#resetShader").on("click", onNewButton);
            Y.one("#fullscreen").on("click", onFullscreenButton);
            Y.one("#LogoutButton").on("click", onLogoutButton);
            Y.one("#LoginButton").on("click", onLoginButton);
            Y.one("#LoadButton").on("click", onLoadButton);
            Y.one("#SaveButton").on("click", onSaveButton);
            Y.one("#ShareButton").on("click", onShareButton);
            Y.one("#ExampleButton").on("click", onExampleButton);
        },
        GLSLEditorPanel = function (Y, id) {
            var editor,
                GLSL_ES_Mode,
                EditSession,
                vertexShaderSession,
                fragmentShaderSession;
            editor = window.ace.edit(id);
            editor.setTheme("ace/theme/twilight");
            GLSL_ES_Mode = window.require("ace/mode/glsl_es").Mode;
            EditSession = window.require('ace/edit_session').EditSession;
            vertexShaderSession = new EditSession("");
            vertexShaderSession.setMode(new GLSL_ES_Mode());
            editor.setSession(vertexShaderSession);
            fragmentShaderSession = new EditSession("");
            fragmentShaderSession.setMode(new GLSL_ES_Mode());

            this.shaderChangeListener = function (force) {
                var meshRenderer,
                    shader,
                    vsNew,
                    fsNew;
                if (vertexShaderSession && fragmentShaderSession) {
                    meshRenderer = shaderEditor.meshRenderer;
                    if (meshRenderer) {
                        shader = meshRenderer.material.shader;
                        vsNew = vertexShaderSession.getValue();
                        fsNew = fragmentShaderSession.getValue();
                        if (vsNew !== shader.vertexShaderSrc || fsNew !== shader.fragmentShaderSrc || force) {
                            shaderEditor.apply(vsNew, fsNew);
                        }
                    }
                }
            };

            this.setShaderSource = function (vertexShaderSrc, fragmentShaderSrc) {
                vertexShaderSession.setValue(vertexShaderSrc);
                fragmentShaderSession.setValue(fragmentShaderSrc);
            };

            this.showVertexShader = function () {
                document.getElementById('glslEditorPanel').style.display = "block";
                editor.setSession(vertexShaderSession);
                // clear undo manager
                var UndoManager = window.require("ace/undomanager").UndoManager;
                editor.getSession().setUndoManager(new UndoManager());
            };

            this.showFragmentShader = function () {
                document.getElementById('glslEditorPanel').style.display = "block";
                editor.setSession(fragmentShaderSession);
                // clear undo manager
                var UndoManager = window.require("ace/undomanager").UndoManager;
                editor.getSession().setUndoManager(new UndoManager());
            };

            this.hideEditor = function () {
                document.getElementById('glslEditorPanel').style.display = "none";
            };
        },
        TexturePanel = function (Y) {
            var c = KICK.core.Constants,
                currentTextures = document.getElementById('currentTextures'),
                getSelectedGLConstant = function (elementId) {
                    var elem = document.getElementById(elementId),
                        options = elem.options,
                        selectedIndex = elem.selectedIndex;
                    if (selectedIndex === -1) {
                        return null;
                    }
                    return options[elem.selectedIndex].gl;
                },
                setSelectedGLConstant = function (elementId, glConst) {
                    var elem = document.getElementById(elementId),
                        options = elem.options,
                        i;
                    for (i = 0; i < options.length; i++) {
                        if (options[i].gl === glConst) {
                            elem.selectedIndex = i;
                            return true;
                        }
                    }
                    return false;
                },
                /**
                 * Add gl attribute to option elements of a select
                 * @param elementId select element to be modified
                 * @param constants array of GL constants
                 */
                addGLConstantToSelect = function (elementId, constants) {
                    var elem = document.getElementById(elementId),
                        options = elem.options,
                        i;

                    if (options.length !== constants.length) {
                        throw new Error("options.length !== constants.length");
                    }
                    for (i = 0; i < options.length; i++) {
                        options[i].gl = constants[i];
                    }
                },
                removeTexture = function () {
                    var currentTextures = document.getElementById('currentTextures'),
                        selectedIndex = currentTextures.selectedIndex;
                    if (selectedIndex === -1) {
                        return;
                    }
                    currentTextures.remove(selectedIndex);
                    shaderEditor.textures.splice(selectedIndex, 1);
                },
                textureSelected = function () {
                    var currentTextures = document.getElementById('currentTextures'),
                        selectedIndex = currentTextures.selectedIndex,
                        c = KICK.core.Constants,
                        texture;
                    if (selectedIndex < 0) {
                        console.log("No texture selected");
                        return;
                    }
                    texture = shaderEditor.textures[selectedIndex];
                    document.getElementById('textureSrc').value = texture.dataURI;
                    document.getElementById('texturePreviewImg').src = shaderEditor.getWrappedImageSource(texture.dataURI);

                    setSelectedGLConstant('textureFormat', texture.internalFormat);
                    document.getElementById('mipMapping').checked = texture.generateMipmaps;
                    setSelectedGLConstant('textureMode', texture.wrapS);
                    document.getElementById('flipY').checked = texture.flipY;
                    setSelectedGLConstant('minFilter', texture.minFilter);
                    setSelectedGLConstant('magFilter', texture.magFilter);
                    setSelectedGLConstant('textureType', texture.textureType);

                    document.getElementById('textureDetails').style.display = 'block';
                    document.getElementById('texturePreview').style.display = 'block';
                },
                addTexture = function () {
                    var t = new KICK.texture.Texture(shaderEditor.engine),
                        currentTextures = document.getElementById('currentTextures'),
                        newOption = document.createElement('option');
                    newOption.value = currentTextures.options.length;
                    currentTextures.add(newOption, null);
                    currentTextures.selectedIndex = currentTextures.options.length - 1;
                    shaderEditor.textures.push(t);
                    textureSelected();
                },
                textureUpdate = function () {
                    var currentTextures = document.getElementById('currentTextures'),
                        selectedIndex = currentTextures.selectedIndex,
                        imgSrc = document.getElementById('textureSrc').value,
                        preview = document.getElementById('texturePreviewImg'),
                        texture,
                        textureConf,
                        updatePreview = function (url) {
                            preview.src = url;
                        };
                    if (selectedIndex < 0) {
                        return;
                    }
                    currentTextures.options[selectedIndex].text = (imgSrc.length < 40) ? imgSrc : imgSrc.substr(0, 40) + '...';
                    texture = shaderEditor.textures[selectedIndex];
                    textureConf = {
                        internalFormat: getSelectedGLConstant('textureFormat'),
                        generateMipmaps: document.getElementById('mipMapping').checked,
                        wrapS: getSelectedGLConstant('textureMode'),
                        wrapT: getSelectedGLConstant('textureMode'),
                        flipY: document.getElementById('flipY').checked,
                        minFilter: getSelectedGLConstant('minFilter'),
                        magFilter: getSelectedGLConstant('magFilter'),
                        textureType: getSelectedGLConstant('textureType'),
                        dataURI: imgSrc
                    };
                    shaderEditor.updateTexture(texture, textureConf, updatePreview);
                };

            this.refreshTextures = function () {
                var textures = window.shaderEditor.textures,
                    i,
                    imageSrc,
                    newOption;
                // remove all elements from texture list
                while (currentTextures.options.length > 0) {
                    currentTextures.remove(0);
                }
                for (i = 0; i < textures.length; i++) {
                    imageSrc = textures[i].dataURI;
                    newOption = document.createElement('option');
                    newOption.text = (!imageSrc) ? "" : (imageSrc.length < 40 ? imageSrc : imageSrc.substr(0, 40) + '...');
                    newOption.value = currentTextures.options.length;
                    currentTextures.add(newOption, null);
                }
            };

            this.getTextureData = function () {
                return shaderEditor.textures;
            };

            Y.one("#addTextureButton").on('click', addTexture);
            Y.one("#removeTextureButton").on('click', removeTexture);
            Y.one("#currentTextures").on('click', textureSelected);
            Y.one('#updateTexture').on('click', textureUpdate);
            addGLConstantToSelect('textureFormat', [c.GL_ALPHA, c.GL_RGB, c.GL_RGBA, c.GL_LUMINANCE, c.GL_LUMINANCE_ALPHA]);
            addGLConstantToSelect('textureMode', [c.GL_REPEAT, c.GL_CLAMP_TO_EDGE]);
            addGLConstantToSelect('minFilter', [c.GL_NEAREST, c.GL_LINEAR, c.GL_NEAREST_MIPMAP_NEAREST, c.GL_LINEAR_MIPMAP_NEAREST, c.GL_NEAREST_MIPMAP_LINEAR, c.GL_LINEAR_MIPMAP_LINEAR]);
            addGLConstantToSelect('magFilter', [c.GL_NEAREST, c.GL_LINEAR]);
            addGLConstantToSelect('textureType', [c.GL_TEXTURE_2D, c.GL_TEXTURE_CUBE_MAP]);

            document.getElementById('textureTypeInfo').addEventListener('click', function () {
                window.YUIMessage("Texture type", "Cube maps must be arranged in one row with the order [Right, Left, Top, Bottom, Front, Back] (also used in <a href='http://www.cgtextures.com/content.php?action=tutorial&name=cubemaps'>NVidia DDS Exporter</a>)<br>");
            }, false);
        },
        UniformsPanel = function (Y) {
            var getUniformType = function (uniform) {
                    var type = "Unknown " + uniform.type,
                        c = KICK.core.Constants,
                        uniformGroup = "number",
                        isMatrix = false,
                        isInteger = false,
                        length;
                    switch (uniform.type) {
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

                    if (uniform.name.indexOf("_") === 0) {
                        uniformGroup = "autobound";
                    }

                    return {
                        type: type,
                        group: uniformGroup,
                        length: length,
                        isMatrix: isMatrix,
                        isInteger: isInteger
                    };
                },
                getUniformNumberElement = function (index) {
                    return document.getElementById("uniform_" + index);
                },
                setUniformNumberValue = function (uniform, value) {
                    var uniformTypeObj = getUniformType(uniform),
                        uniformLength = uniformTypeObj.length,
                        isMatrix = uniformTypeObj.isMatrix,
                        matrixWidth,
                        elem,
                        i,
                        x,
                        y,
                        arrayIndex;
                    if (isMatrix) {
                        matrixWidth = 4;
                        switch (uniformLength) {
                        case 4:
                            matrixWidth = 2;
                            break;
                        case 9:
                            matrixWidth = 3;
                            break;
                        }

                        for (x = 0; x < 4; x++) {
                            for (y = 0; y < 4; y++) {
                                i = x * 4 + y;
                                arrayIndex = x * matrixWidth + y;
                                elem = getUniformNumberElement(i);
                                if (Math.max(x, y) < matrixWidth) {
                                    elem.style.display = 'inline';
                                    elem.value = value ? value[arrayIndex] : 0;
                                } else {
                                    elem.style.display = 'none';
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < 16; i++) {
                            elem = getUniformNumberElement(i);
                            if (i < uniformLength) {
                                elem.style.display = 'inline';
                                elem.value = value ? value[i] : 0;
                            } else {
                                elem.style.display = 'none';
                            }
                        }
                    }
                },
                getUniformNumberValue = function (uniform) {
                    var uniformTypeObj = getUniformType(uniform),
                        uniformLength = uniformTypeObj.length,
                        isMatrix = uniformTypeObj.isMatrix,
                        matrixWidth,
                        isInteger = uniformTypeObj.isInteger,
                        array = isInteger ? new Int32Array(uniformLength) : new Float32Array(uniformLength),
                        i,
                        elem,
                        x,
                        y,
                        arrayIndex;
                    if (isMatrix) {
                        matrixWidth = 4;
                        switch (uniformLength) {
                        case 4:
                            matrixWidth = 2;
                            break;
                        case 9:
                            matrixWidth = 3;
                            break;
                        }

                        for (x = 0; x < 4; x++) {
                            for (y = 0; y < 4; y++) {
                                i = x * 4 + y;
                                arrayIndex = x * matrixWidth + y;
                                elem = getUniformNumberElement(i);
                                if (Math.max(x, y) < matrixWidth) {
                                    array[arrayIndex] = Number(elem.value);
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < 16; i++) {
                            elem = getUniformNumberElement(i);
                            if (i < uniformLength) {
                                array[i] = Number(elem.value);
                            }
                        }
                    }
                    return array;
                },
                updateUniformSampler = function () {
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
                    material.setUniform(uniform.name, selectedTexture);
                    material.shader.markUniformUpdated();
                },
                updateUniformNumber = function () {
                    var uniform_sampler = document.getElementById('uniform_sampler'),
                        material = shaderEditor.meshRenderer.material,
                        activeUniforms = material.shader.activeUniforms,
                        uniformDetail = document.getElementById('uniformDetail'),
                        currentUniforms = document.getElementById('currentUniforms'),
                        selectedIndex = currentUniforms.selectedIndex,
                        uniform = activeUniforms[selectedIndex],
                        c = KICK.core.Constants;
                    material.setUniform(uniform.name, getUniformNumberValue(uniform));
                    material.shader.markUniformUpdated();
                },
                uniformSelected = function () {
                    var material = shaderEditor.meshRenderer.material,
                        activeUniforms = material.shader.activeUniforms,
                        uniformDetail = document.getElementById('uniformDetail'),
                        currentUniforms = document.getElementById('currentUniforms'),
                        selectedIndex = currentUniforms.selectedIndex,
                        uniform = activeUniforms[selectedIndex],
                        uniformTypeObj = getUniformType(uniform),
                        uniformType = uniformTypeObj.type,
                        uniformGroup = uniformTypeObj.group,
                        materialUniform,
                        uniform_sampler,
                        i,
                        texture,
                        imageSrc,
                        newOption;

                    uniformDetail.style.display = 'block';
                    if (selectedIndex === -1) {
                        return;
                    }

                    Y.one("#uniformName").set("value", uniform.name);
                    Y.one("#uniformType").set("value", uniformType);
                    Y.one("#uniformSize").set("value", uniform.size);

                    document.getElementById('uniform_group_autobound').style.display = (uniformGroup === "autobound") ? "block" : "none";
                    document.getElementById('uniform_group_number').style.display = (uniformGroup === "number") ? "block" : "none";
                    document.getElementById('uniform_group_sampler').style.display = (uniformGroup === "sampler") ? "block" : "none";
                    if (uniformGroup === "autobound") {
                        return;
                    }
                    materialUniform = material.getUniform(uniform.name) || {};
                    if (uniformGroup === "number") {
                        setUniformNumberValue(uniform, materialUniform.value);
                    } else if (uniformGroup === "sampler") {
                        uniform_sampler = document.getElementById('uniform_sampler');
                        // remove all textures
                        while (uniform_sampler.options.length > 0) {
                            uniform_sampler.remove(0);
                        }

                        for (i = 0; i < shaderEditor.textures.length; i++) {
                            texture = shaderEditor.textures[i];
                            imageSrc = texture.dataURI;
                            newOption = document.createElement('option');
                            newOption.text = (imageSrc.length < 40) ? imageSrc : imageSrc.substr(0, 40) + '...';
                            uniform_sampler.add(newOption);
                            if (texture === materialUniform.value) {
                                uniform_sampler.selectedIndex = i;
                            }
                        }
                    }
                };

            this.refreshUniforms = function () {
                var activeUniforms = shaderEditor.meshRenderer.material.shader.activeUniforms,
                    i,
                    currentUniforms = document.getElementById('currentUniforms'),
                    uniformDetail = document.getElementById('uniformDetail'),
                    activeUniform,
                    newOption,
                    type;

                // hide uniform details
                uniformDetail.style.display = 'none';

                // remove all elements from uniform list
                while (currentUniforms.options.length > 0) {
                    currentUniforms.remove(0);
                }

                // insert all uniforms
                for (i = 0; i < activeUniforms.length; i++) {
                    activeUniform = activeUniforms[i];
                    newOption = document.createElement('option');
                    type =  getUniformType(activeUniform).type;
                    newOption.text = activeUniform.name + " (" + type + ")";
                    currentUniforms.add(newOption, null);
                }
            };

            Y.one('#currentUniforms').on('click', uniformSelected, false);
            Y.one('#uniform_sampler_update').on('click', updateUniformSampler, false);
            Y.one('#uniform_number_update').on('click', updateUniformNumber, false);
        },
        SettingsPanel = function (Y) {
            var meshsetting = document.getElementById('meshsetting'),
                projection = document.getElementById('projection'),
                rotatemesh = document.getElementById('rotatemesh'),
                thisObj = this,
                addChildListeners = function (component, listener, listenerNames, tag) {
                    var i, j;
                    for (i = 0; i < component.children.length; i++) {
                        if (Array.isArray(listenerNames)) {
                            for (j = 0; j < listenerNames.length; j++) {
                                component.children[i].addEventListener(listenerNames[j], listener, false);
                            }
                        } else {
                            component.children[i].addEventListener(listenerNames, listener, false);
                        }
                        if (tag) {
                            component.children[i][tag] = i;
                        }
                    }
                },
                getChildrenValueVector = function (elementName) {
                    var elem = document.getElementById(elementName),
                        array = [],
                        i,
                        count = 0;
                    for (i = 0; i < elem.children.length; i++) {
                        if (elem.children[i].nodeName === 'INPUT') {
                            array[count++] = Number(elem.children[i].value);
                        }
                    }
                    return array;
                },
                setChildrenValueVector = function (elementName, vector) {
                    var elem = document.getElementById(elementName),
                        i,
                        count = 0,
                        childElem;
                    for (i = 0; i < elem.children.length; i++) {
                        childElem = elem.children[i];
                        if (childElem.nodeName === 'INPUT') {
                            childElem.value = vector[count++];
                        }
                    }
                },
                getRadioValue = function (elementName) {
                    var elem = document.getElementById(elementName),
                        i,
                        childElem;
                    for (i = 0; i < elem.children.length; i++) {
                        childElem = elem.children[i];
                        if (childElem.nodeName === 'INPUT') {
                            if (childElem.checked) {
                                return childElem.value;
                            }
                        }
                    }
                    return null;
                },
                setRadioValue = function (elementName, value) {
                    var elem = document.getElementById(elementName),
                        checked = null,
                        isElementChecked,
                        firstInputElement = null,
                        i,
                        childElem;
                    for (i = 0; i < elem.children.length; i++) {
                        childElem = elem.children[i];
                        if (childElem.nodeName === 'INPUT') {
                            isElementChecked = childElem.value === value;
                            childElem.checked = isElementChecked;
                            if (isElementChecked) {
                                checked = childElem;
                            }
                            if (firstInputElement === null) {
                                firstInputElement = childElem;
                            }
                        }
                    }
                    if (checked === null) { // if no element found - check the first element
                        firstInputElement.checked = true;
                    }
                },
                updateSettings = function () {
                    var data = thisObj.getSettingsData();
                    window.shaderEditor.updateSettings(data);
                };

            this.getSettingsData = function () {
                return {
                    meshsetting: getRadioValue('meshsetting'),
                    projection: getRadioValue('projection'),
                    rotatemesh: getRadioValue('rotatemesh'),
                    lightrot: getChildrenValueVector('lightrot'),
                    lightcolor: getChildrenValueVector('lightcolor'),
                    lightAmbient: getChildrenValueVector('ambientLight'),
                    lightintensity: Number(document.getElementById('lightintensity').value)
                };
            };

            this.setSettingsData = function (settingsData) {
                setRadioValue('meshsetting', settingsData.meshsetting);
                setRadioValue('projection', settingsData.projection);
                setRadioValue('rotatemesh', settingsData.rotatemesh);
                var lightintensity = document.getElementById('lightintensity');
                setChildrenValueVector('lightrot', settingsData.lightrot);
                setChildrenValueVector('lightcolor', settingsData.lightcolor);
                lightintensity.value = settingsData.lightintensity;
                updateSettings();
            };


            addChildListeners(meshsetting, updateSettings, 'click', "meshid");
            addChildListeners(projection, updateSettings, 'click', "projection");
            addChildListeners(rotatemesh, updateSettings, 'click', "isOn");

            (function addLightListeners() {
                var lightpos = document.getElementById('lightpos'),
                    lightrot = document.getElementById('lightrot'),
                    lightcolor = document.getElementById('lightcolor'),
                    lightintensity = document.getElementById('lightintensity');

                addChildListeners(lightrot, updateSettings, ['click', 'change'], "position");
                addChildListeners(lightcolor, updateSettings, ['click', 'change'], "position");

                lightintensity.addEventListener('change', updateSettings, false);
                lightintensity.addEventListener('click', updateSettings, false);
            }());


            (function addAmbientListener() {
                var am = document.getElementById('ambientLight');
                addChildListeners(am, updateSettings, ['click', 'change'], "position");
            }());
        },
        DescriptionPanel = function (Y) {
            var shaderNameElement = Y.one("#shadername"),
                thisObj = this;
            shaderNameElement.on('change', function () {
                thisObj.updateShaderName();
            });

            this.updateShaderName = function () {
                var val = shaderNameElement.get("value"),
                    title = "Kick.js | Shader editor | " + val;
                document.getElementById('header').innerHTML = title.escapeHTML();
                document.title = title;
            };

            this.setShaderNameAndDescription = function (name, description) {
                shaderNameElement.set("value", name || "Unnamed shader");
                thisObj.updateShaderName();
                document.getElementById('shaderAbout').value = description || "";
            };
        },
        GLSLEditorController = function (glslEditorPanel, texturePanel, uniformPanel, settingsPanel, descriptionPanel, tabview) {
            var thisObj = this;

            this.loadShaderFromServer = function (id) {
                var oReq = new XMLHttpRequest();
                function handler() {
                    if (oReq.readyState === 4) { // /* complete */
                        if (oReq.status === 200) {
                            var obj = JSON.parse(oReq.responseText);
                            shaderid = id;
                            shortUrl = obj.shortUrl;
                            thisObj.setShader(JSON.parse(obj.data));
                        } else {
                            console.log("loadShaderFromServer status " + oReq.status);
                        }
                    }
                }

                oReq.open("GET", "/example/shader_editor/GetShader?id=" + id + "&ts=" + new Date().getTime(), true);
                oReq.onreadystatechange = handler;
                oReq.send();
            };

            this.setShader = function (shaderNew) {
                shader = shaderNew;
                var currentTextures = document.getElementById('currentTextures');
                while (currentTextures.options.length > 0) {
                    currentTextures.remove(0);
                }
                document.getElementById('textureDetails').style.display = 'none';
                document.getElementById('texturePreview').style.display = 'none';

                glslEditorPanel.setShaderSource(shaderNew.shader.vertexShaderSrc, shaderNew.shader.fragmentShaderSrc);
                shaderEditor.loadMaterial(shaderNew);
                settingsPanel.setSettingsData(shaderNew.settingsData);
                descriptionPanel.setShaderNameAndDescription(shaderNew.name, shaderNew.about);
                glslEditorPanel.shaderChangeListener(true);
            };

            this.getData = function () {
                shaderEditor.meshRenderer.material.shader.dataURI = null; // force shader to be serialized
                return {
                    shader: shaderEditor.meshRenderer.material.shader.toJSON(),
                    material: shaderEditor.meshRenderer.material.toJSON(),
                    textureData: texturePanel.getTextureData(),
                    settingsData: settingsPanel.getSettingsData(),
                    name: document.getElementById('shadername').value,
                    about: document.getElementById('shaderAbout').value
                };
            };

            /**
             * Loads default material.
             */
            this.loadDefault = function () {
                shader = JSON.parse(window.defaultMaterial);
                return shader;
            };

            tabview.on("selectionChange", function (e) {
                switch (e.newVal.get('index')) {
                case 0:
                    glslEditorPanel.showVertexShader();
                    break;
                case 1:
                    glslEditorPanel.showFragmentShader();
                    break;
                case 2:
                    texturePanel.refreshTextures();
                    glslEditorPanel.hideEditor();
                    break;
                case 3:
                    uniformPanel.refreshUniforms();
                    glslEditorPanel.hideEditor();
                    break;
                default:
                    glslEditorPanel.hideEditor();
                    break;
                }
            });
            // start shader listener
            setInterval(glslEditorPanel.shaderChangeListener, 2000);
        },
        loadShaderSync = function (id) {
            var oReq = new XMLHttpRequest(),
                result = null;
            function handler() {
                if (oReq.readyState === 4) { // /* complete */
                    if (oReq.status === 200) {
                        result = JSON.parse(oReq.responseText);
                        shaderid = id;
                        shortUrl = result.shortUrl;
                    } else {
                        console.log("loadShaderFromServer status " + oReq.status);
                    }
                }
            }

            oReq.open("GET", "/example/shader_editor/GetShader?id=" + id + "&ts=" + new Date().getTime(), false);
            oReq.onreadystatechange = handler;
            oReq.send();
            return result;
        };

    window.YUI().use('tabview', 'console', "panel", "datatable-base", "dd-plugin", function (Y) {
        var c = KICK.core.Constants,
            tabview = new Y.TabView({
                srcNode: '#editorSection'
            }),
            r,
            buttonPanel,
            texturePanel,
            uniformPanel,
            settingsPanel,
            descriptionPanel;

        tabview.render();
        window.tabview = tabview;

        //create the console
        r = new Y.Console({
            newestOnTop : false,
            width: 300,
            height: 300,
            consoleLimit: 10,
            style: "inline",
            strings: {
                title : "Shader error console",
                pause : "Pause",
                clear : "Clear",
                collapse : "Collapse",
                expand : "Expand"
            }
        });

        r.render('#logger');

        window.log = r;

        buttonPanel = new ButtonPanel(Y); // todo is used?

        texturePanel = new TexturePanel(Y);
        uniformPanel = new UniformsPanel(Y);
        settingsPanel = new SettingsPanel(Y);
        descriptionPanel = new DescriptionPanel(Y);
        shaderEditor.initKick(function () {
            var glslEditor = new GLSLEditorPanel(Y, 'glslEditor'),
                idParameter,
                shader,
                result;
            controller = new GLSLEditorController(glslEditor, texturePanel, uniformPanel, settingsPanel, descriptionPanel, tabview);
            window.controller = controller; // debug - expose controller
            idParameter = document.location.hash.length > 1;
            shader = null;
            if (idParameter) {
                idParameter = document.location.hash.substring(1);
                document.location.hash = "";
                result = loadShaderSync(idParameter);
                shader = JSON.parse(result.data);
            }

            if (shader === null) {
                shader = controller.loadDefault();
            }
            controller.setShader(shader);
        });

        window.YUIMessage = function (headerTxt, bodyTxt) {
            var nestedPanel = new Y.Panel({
                headerContent: headerTxt,
                bodyContent: bodyTxt,
                zIndex: 5, //We set a z-index higher than the parent's z-index
                centered: true,
                width: 250,
                modal: true,
                buttons: [
                    {
                        value: "Close",
                        action  : function (e) {
                            e.preventDefault();
                            nestedPanel.hide();
                        },
                        section: Y.WidgetStdMod.FOOTER
                    }
                ]
            });

            nestedPanel.render('#nestedPanel');
        };

        window.YUILoadExample = function () {
            var elements = [
                    {
                        id: "http://goo.gl/lLjyf",
                        name: "Phong ligthing"
                    },
                    {
                        id: "http://goo.gl/EoxBh",
                        name: "Mandelbrot shader"
                    },
                    {
                        id: "http://goo.gl/2JJe0",
                        name: "Brick shader"
                    },
                    {
                        id: "http://goo.gl/2SwX1",
                        name: "Sliced geometry"
                    },
                    {
                        id: "http://goo.gl/Jsne8",
                        name: "ASCII shader"
                    },
                    {
                        id: "http://goo.gl/viDKB",
                        name: "Normal shader"
                    }
                ],
                bodyContent = document.createElement("select"),
                i,
                elem,
                option,
                panel;
            bodyContent.style.width = "225px";
            bodyContent.style.height = "200px";
            bodyContent.style.font = "120% arial,helvetica,clean";
            bodyContent.multiple = true;
            for (i = 0; i < elements.length; i++) {
                elem = elements[i];
                option = document.createElement("option");
                option.value = elem.id;
                option.innerHTML = elem.name;
                bodyContent.appendChild(option);
            }
            panel = new Y.Panel({
                srcNode: "#panelContent",
                width: 250,
                centered: true,
                visible: true,
                modal: true,
                zIndex: 5,
                headerContent: "Load example shader",
                bodyContent: bodyContent,
                buttons: [
                    {
                        value: "Cancel",
                        action: function (e) {
                            e.preventDefault();
                            panel.hide();
                            panel.destroy();
                        },
                        section: Y.WidgetStdMod.FOOTER
                    },
                    {
                        value: "Load",
                        action: function (e) {
                            var selectedIndex,
                                url;
                            e.preventDefault();
                            panel.hide();
                            selectedIndex = bodyContent.selectedIndex;
                            if (selectedIndex > -1) {
                                url = bodyContent.options[selectedIndex].value;
                                document.location.href = url;
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

        window.YUILoad = function (elements) {
            var bodyContent = document.createElement("select"),
                i,
                elem,
                option,
                panel;
            bodyContent.style.width = "225px";
            bodyContent.style.height = "200px";
            bodyContent.style.font = "120% arial,helvetica,clean";
            bodyContent.multiple = true;
            for (i = 0; i < elements.length; i++) {
                elem = elements[i];
                option = document.createElement("option");
                option.value = elem.id;
                option.innerHTML = elem.name;
                bodyContent.appendChild(option);
            }
            panel = new Y.Panel({
                srcNode: "#panelContent",
                width: 250,
                centered: true,
                visible: true,
                modal: true,
                zIndex: 5,
                headerContent: "Load shader",
                bodyContent: bodyContent,
                buttons: [
                    {
                        value: "Cancel",
                        action: function (e) {
                            e.preventDefault();
                            panel.hide();
                            panel.destroy();
                        },
                        section: Y.WidgetStdMod.FOOTER
                    },
                    {
                        value: "Load",
                        action: function (e) {
                            var selectedIndex,
                                id;
                            e.preventDefault();
                            panel.hide();
                            selectedIndex = bodyContent.selectedIndex;
                            if (selectedIndex > -1) {
                                id = bodyContent.options[selectedIndex].value;
                                controller.loadShaderFromServer(id);
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

        window.YUIConfirm = function (headerTxt, bodyTxt, onCancel, onOK) {
            var nestedPanel = new Y.Panel({
                headerContent: headerTxt,
                bodyContent: bodyTxt,
                zIndex: 5, //We set a z-index higher than the parent's z-index
                centered: true,
                width: 250,
                modal: true,
                buttons: [
                    {
                        value: "Cancel",
                        action  : function (e) {
                            e.preventDefault();
                            nestedPanel.hide();
                            if (onCancel) {
                                onCancel();
                            }
                        },
                        section: Y.WidgetStdMod.FOOTER
                    },
                    {
                        value: "OK",
                        action  : function (e) {
                            e.preventDefault();
                            nestedPanel.hide();
                            if (onOK) {
                                onOK();
                            }
                        },
                        section: Y.WidgetStdMod.FOOTER
                    }

                ]
            });

            nestedPanel.render('#nestedPanel');
        };

        function loginInfo() {
            var oReq = new XMLHttpRequest();

            function handler() {
                if (oReq.readyState === 4) { // /* complete */
                    if (oReq.status === 200) {
                        var obj = JSON.parse(oReq.responseText);
                        if (obj.logoutURL) {
                            logoutURL = obj.logoutURL;
                            username = obj.username;
                            document.getElementById('LogoutButton').style.display = "inline";
                            document.getElementById('LogoutButton').title = "Currently logged in as " + username;
                            document.getElementById('LoginButton').style.display = "none";
                        } else {
                            loginURL = obj.loginURL;
                            document.getElementById('LogoutButton').style.display = "none";
                            document.getElementById('LoginButton').style.display = "inline";
                        }
                    }
                }
            }
            oReq.open("GET", "/LoginInfo?ts=" + new Date().getTime() + "&url=" + document.location.href, true);
            oReq.onreadystatechange = handler;
            oReq.send();
        }
        loginInfo();
        setInterval(loginInfo, 1000 * 60 * 30); // check for logout every 30 min
    });
}());

// add trim function to string
String.prototype.trim = function () {
    "use strict";
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

String.prototype.escapeHTML = function () {
    "use strict";
    return this.replace(/&/g, '&amp;').
            replace(/>/g, '&gt;').
            replace(/</g, '&lt;').
            replace(/"/g, '&quot;');
};
