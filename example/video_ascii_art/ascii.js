window.onload = function(){
    "use strict";

    function setMaterial(vertexShaderId, fragmentShaderId, meshRenderer, materialUniforms){
            var vs = document.getElementById(vertexShaderId).value;
            var fs = document.getElementById(fragmentShaderId).value;
            var shader = new KICK.material.Shader(engine);
            shader.vertexShaderSrc = vs;
            shader.fragmentShaderSrc = fs;
            shader.errorLog = console.log;
            shader.updateShader();
            var missingAttributes = meshRenderer.mesh.verify(shader);
            if (missingAttributes){
                log("Missing attributes in mesh "+JSON.stringify(missingAttributes));
                return;
            }

            meshRenderer.material = new KICK.material.Material({
                name:"Some material",
                shader:shader,
                uniforms: materialUniforms
            });
        }

    var UpdateTextureComponent = function(texture, videoElement){
        var gl = engine.gl,
            keyInput = engine.keyInput;
        this.update = function(){
            if (!videoElement.isPaused){
                gl.bindTexture(gl.TEXTURE_2D, texture.textureId);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, videoElement);
            }
            if (keyInput.isKeyDown(65)){
                if (videoElement.isPaused){
                    videoElement.isPaused = false;
                    videoElement.play();
                } else {
                    videoElement.pause();
                    videoElement.isPaused = true;
                }
            }
        }
    };

    var engine;
    var camera;
    function initKick(videoElement) {
        engine = new KICK.core.Engine('canvas',{
            enableDebugContext: true
        });
        var activeScene = engine.activeScene;
        var cameraObject = activeScene.createGameObject();
        camera = new KICK.scene.Camera({
            clearColor: [124/255,163/255,137/255,1],
            cameraTypePerspective: false,
            near: -1,
            far:1
        });
        cameraObject.addComponent(camera);

        var gameObject = activeScene.createGameObject();
        var meshRenderer = new KICK.scene.MeshRenderer();

        var texture = new KICK.texture.Texture(engine,{
            generateMipmaps: false,
            magFilter: KICK.core.Constants.GL_NEAREST,
            minFilter:  KICK.core.Constants.GL_NEAREST,
            wrapS: KICK.core.Constants.GL_CLAMP_TO_EDGE,
            wrapT: KICK.core.Constants.GL_CLAMP_TO_EDGE
        });
        var asciiTexture = new KICK.texture.Texture(engine,{
            generateMipmaps: false,
            magFilter: KICK.core.Constants.GL_NEAREST,
            minFilter:  KICK.core.Constants.GL_NEAREST,
            wrapS: KICK.core.Constants.GL_CLAMP_TO_EDGE,
            wrapT: KICK.core.Constants.GL_CLAMP_TO_EDGE
        });
        var image = new Image();
        image.onload = function() {
            asciiTexture.setImage(image, "ascii_art");
        };
        // base 64 encoded of custom made 8x16 ascii font (mixing both normal and inverted). Contains 256 chars.
        // Created using this tool:
        // https://gist.github.com/1343465
        image.src = "data:image/gif;base64,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";

        texture.setTemporaryTexture();
        meshRenderer.mesh = engine.resourceManager.getMesh("kickjs://mesh/plane/");
        setMaterial('vertexShaderTex','fragmentShaderAscii',meshRenderer, {
                    tex: {
                        value: texture,
                        type: KICK.core.Constants.GL_SAMPLER_2D
                    },
                    ascii: {
                        value: asciiTexture,
                        type: KICK.core.Constants.GL_SAMPLER_2D
                    }
                });
        gameObject.addComponent(meshRenderer);
        gameObject.addComponent(new UpdateTextureComponent(texture,videoElement));

        gameObject = activeScene.createGameObject();
        meshRenderer = new KICK.scene.MeshRenderer();
        gameObject.addComponent(meshRenderer);
        meshRenderer.mesh = engine.resourceManager.getMesh("kickjs://mesh/plane/");
        setMaterial('vertexShaderTex','fragmentShaderTex',meshRenderer, {
                    tex: {
                        value: texture,
                        type: KICK.core.Constants.GL_SAMPLER_2D
                    }
                });
        gameObject.transform.position = [.9,.9,0.1];
        gameObject.transform.localScale = [0.1,0.1,0.1];
    }


    // initKick();
    window.YUI().use("panel",function(Y) {
        var YUIConfirm = function (headerTxt,bodyTxt, buttons){
            var nestedPanel = new Y.Panel({
                headerContent: headerTxt,
                bodyContent:bodyTxt,
                zIndex: 5, //We set a z-index higher than the parent's z-index
                centered:true,
                width:300,
                modal:true,
                buttons: buttons
            });

            nestedPanel.render('#nestedPanel');
            return nestedPanel;
        };

        var onEnd = function(){
            YUIConfirm("End of video", "Reload page to see another video",[]);
        };

        var buildLoadVideoDialog = function(){
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("Video ascii art is a real time post processing effect that will transform any video into ASCII art. The effect is created in a shader and uses the KickJS engine."));
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createTextNode("To see the ASCII shader in action you need to load a local video (in a format that your browser can play)"));
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createTextNode("Known issue: Problems with large video files and the effect currently only works in Chrome."));
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createElement("br"));

            var file = document.createElement("input");
            file.type = "file";
            file.onchange = function() {
                if (this.files.length==0){
                    return;
                }
                window.currentDialog.hide();
                var reader = new window.FileReader();
                reader.onload = function(e){
                    var video = document.createElement("video");
                    video.autoplay = true;
                    video.addEventListener('ended', onEnd, false);
                    video.src = e.target.result;
                    initKick(video);
                };
                reader.readAsDataURL(this.files[0]);
            };
            div.appendChild(file);
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createTextNode("Or see a sample of Big Buck Bunny (Blender Foundation | www.blender.org)"));
            div.appendChild(document.createElement("br"));
            var button = document.createElement("button");
            button.appendChild(document.createTextNode("Big Buck Bunny sample"));
            div.appendChild(button);
            button.onclick = function(){
                window.currentDialog.hide();
                var video = document.createElement("video");
                video.autoplay = true;
                video.addEventListener('ended', onEnd, false);
                video.src = "BigBuckBunny.m4v";
                video.play();
                initKick(video);
            };
            window.currentDialog = YUIConfirm("Load video", div,[]);
        };
        buildLoadVideoDialog();
    });

    function documentResized(){
        var canvas = document.getElementById('canvas');
        canvas.width = document.width;
        canvas.height = document.height-canvas.offsetTop;
        if (engine){
            engine.canvasResized();
        }
    }
    documentResized();

    window.onresize = documentResized;
};