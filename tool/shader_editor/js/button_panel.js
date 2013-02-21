define(["shader_editor_default"],
    function (defaultMaterial) {
        "use strict";
        return function(Y, shaderEditor, glslEditorController, editorUI){
            var onFullscreenButton = function () {
                    if (shaderEditor.engine.isFullScreenSupported()) {
                        shaderEditor.engine.setFullscreen(true);
                    } else {
                        alert("Fullscreen is not supported in this browser");
                    }
                },
                onLogoutButton = function () {
                    document.location = editorUI.logoutURL;
                },
                onLoginButton = function () {
                    document.location = editorUI.loginURL;
                },
                onLoadButton = function () {
                    var thisObj = this,
                        oReq = new XMLHttpRequest();
                    if (!editorUI.username) {
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

                    oReq.open("GET", "/tool/shader_editor/GetShader?ts=" + new Date().getTime(), true);
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
                                    glslEditorController.shaderid = obj.id;
                                    glslEditorController.shortUrl = obj.shortUrl;
                                    console.log(obj.message);
                                    saveButton.innerHTML = obj.message;
                                } else {
                                    saveButton.innerHTML = "Save error";
                                }
                                setTimeout(resetSave, 3000);
                            }
                        };
                    if (!editorUI.username) {
                        window.YUIMessage("Login needed", "To save a shader you need to login first.");
                        return;
                    }
                    name = document.getElementById("shadername").value;
                    if (name.trim().length === 0) {
                        window.YUIMessage("Shader name not valid", "Change name in the 'about'-tab");
                        return;
                    }

                    saveButton = document.getElementById('SaveButton');
                    saveButton.innerHTML = "Saving ...";

                    about = document.getElementById("shaderAbout").value;
                    jsonData = controller.getData();

                    obj = {
                        id: glslEditorController.shaderid,
                        name: name,
                        about: about,
                        owner: editorUI.username,
                        data: JSON.stringify(jsonData)
                    };
                    objStr = JSON.stringify(obj);
                    oReq = new XMLHttpRequest();

                    oReq.open("POST", "/tool/shader_editor/UpdateShader", true);
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
                    if (!editorUI.username) {
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

                    window.YUIMessage("This shader can be accessed by anyone at:", div);
                    input.focus();
                    input.select();
                },
                onExampleButton = function () {
                    window.YUILoadExample();
                },
                onNewButton = function () {
                    window.YUIConfirm("New shader", "Create a new shader?", null, function () {
                        controller.setShader(defaultMaterial);
                        glslEditorController.shaderid = "";
                        glslEditorController.shortUrl = "";
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
        };
    }
);