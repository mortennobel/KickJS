define(["kick", "shader_editor_default", "settings_panel", "button_panel", "glsl_editor_panel", "texture_panel", "uniforms_panel", "description_panel"],
    function (KICK, defaultMaterial, SettingsPanel, ButtonPanel, GLSLEditorPanel, TexturePanel, UniformsPanel, DescriptionPanel) {
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
        return function (shaderEditor) {
            "use strict";
            var shaderEditorUI = this,
                shader,
                username,
                logoutURL,
                loginURL,
                controller,
                GLSLEditorController = function (glslEditorPanel, texturePanel, uniformPanel, settingsPanel, descriptionPanel, tabview) {
                    var thisObj = this,
                        shaderid = "",
                        shortUrl = "";
                    Object.defineProperties(this, {
                        shaderid: {
                            get: function () {
                                return shaderid;
                            },
                            set: function(value){
                                shaderid = value;
                            }
                        },
                        shortUrl: {
                            get: function () {
                                return shortUrl;
                            },
                            set: function(value){
                                shortUrl = value;
                            }
                        }
                    });
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

                        oReq.open("GET", "/tool/shader_editor/GetShader?id=" + id + "&ts=" + new Date().getTime(), true);
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
                        shaderEditor.material.shader.dataURI = null; // force shader to be serialized
                        return {
                            shader: shaderEditor.material.shader.toJSON(),
                            material: shaderEditor.material.toJSON(),
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
                        return defaultMaterial;
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
                                controller.shaderid = id;
                                controller.shortUrl = result.shortUrl;
                            } else {
                                console.log("loadShaderFromServer status " + oReq.status);
                            }
                        }
                    }

                    oReq.open("GET", "/tool/shader_editor/GetShader?id=" + id + "&ts=" + new Date().getTime(), false);
                    oReq.onreadystatechange = handler;
                    oReq.send();
                    return result;
                };

            Object.defineProperties(this, {
                logoutURL:{
                    get: function () {
                        return logoutURL;
                    },
                    set: function(value){
                        logoutURL = value;
                    }
                },
                loginURL:{
                    get:function () {
                        return loginURL;
                    },
                    set:function(value){
                        loginURL = value;
                    }
                },
                username:{
                    get:function(){
                        return username;
                    },
                    set:function(value){
                        username = value;
                    }
                }
            });

            window.YUI().use('tabview', 'console', "panel", "datatable-base", "dd-plugin",'button-group', function (Y) {
                var c = KICK.core.Constants,
                    tabview = new Y.TabView({
                        srcNode: '#editorSection'
                    }),
                    r,
                    topButtonPanel,
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

                texturePanel = new TexturePanel(Y, shaderEditor, KICK);
                uniformPanel = new UniformsPanel(Y, shaderEditor, KICK);
                settingsPanel = new SettingsPanel(Y, shaderEditor);
                descriptionPanel = new DescriptionPanel(Y);
                shaderEditor.initKick(function () {
                    var glslEditor = new GLSLEditorPanel(Y, 'glslEditor', shaderEditor),
                        idParameter,
                        shader,
                        result,
                        strBrowser;
                    shaderEditor.addEventListener("shaderLogClear", function(){
                        glslEditor.clearAnnotations();
                        r.clearConsole();
                    });
                    shaderEditor.addEventListener("shaderError", function(array){
                        var annotations = [[],[]],
                            j,
                            i,
                            match,
                            fileno,
                            lineno,
                            message,
                            lines;
                        for (j=0;j<2;j++){
                            if (array[j]){
                                lines = array[j].split('\n');
                                for(i=0; i<lines.length; i++){
                                    match = lines[i].match(/ERROR: (\d+):(\d+): (.*)/);
                                    if(match){
                                        fileno = parseInt(match[1], 10)-1;
                                        lineno = parseInt(match[2], 10)-1;
                                        message = match[3];
                                        annotations[j].push({row: lineno, column: 1,text: message, type: "error"});
                                    }
                                }
                            }
                        }
                        glslEditor.addAnnotations(annotations[0],annotations[1]);
                    });

                    controller = new GLSLEditorController(glslEditor, texturePanel, uniformPanel, settingsPanel, descriptionPanel, tabview);
                    topButtonPanel = new ButtonPanel(Y, shaderEditor, controller, shaderEditorUI);
                    window.controller = controller; // debug - expose controller
                    idParameter = document.location.hash.length > 1;
                    shader = null;
                    if (idParameter) {
                        idParameter = document.location.hash.substring(1);
                        strBrowser = navigator.userAgent.toLowerCase();
                        if (strBrowser.indexOf('chrome') > 0 || strBrowser.indexOf('safari') > 0) {
                            if(history.pushState) {
                                window.history.replaceState(null, window.document.title, '#');
                            }
                        } else {
                            document.location.hash = "";
                        }

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
                                id: "http://goo.gl/CkGZY",
                                name: "Head (unlit)"
                            },
                            {
                                id: "http://goo.gl/pbZIf",
                                name: "Head (lit)"
                            },
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
                                id: "http://goo.gl/viDKB",
                                name: "Normal shader"
                            },
                            {
                                id: "http://goo.gl/HApQB",
                                name: "Screen space normals"
                            },
                            {
                                id: "http://goo.gl/RxarW",
                                name: "Particles"
                            },
                            {
                                id: "http://goo.gl/grglc",
                                name: "Bump map"
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
        };
    }
);