define([],
    function () {
        "use strict";
        return function(Y, id, shaderEditor){
            var editor,
                thisObj = this,
                EditSession,
                vertexShaderSession,
                fragmentShaderSession,
                vAnnotations = [],
                fAnnotations = [],
                currentShader = 0,
                reloadAnnotations = function(){
                    editor.getSession().clearAnnotations();
                    var annotations = [vAnnotations, fAnnotations];
                    if (annotations[currentShader].length>0){
                        editor.getSession().setAnnotations(annotations[currentShader]);
                    }
                };
            editor = ace.edit(id);

            editor.setTheme("ace/theme/twilight");
            //                    ace.config.setModuleUrl("ace/mode/glsl","./mode-glsl.js");
            EditSession = ace.require('ace/edit_session').EditSession;
            vertexShaderSession = new EditSession("");
            //                    vertexShaderSession.setMode("ace/mode/glsl_es");
            vertexShaderSession.setMode("ace/mode/glsl");
            editor.setSession(vertexShaderSession);
            fragmentShaderSession = new EditSession("");
            //                    fragmentShaderSession.setMode("ace/mode/glsl_es");
            fragmentShaderSession.setMode("ace/mode/glsl");

            this.shaderChangeListener = function (force) {
                var shader,
                    vsNew,
                    fsNew;
                if (vertexShaderSession && fragmentShaderSession) {
                    shader = shaderEditor.material.shader;
                    vsNew = vertexShaderSession.getValue();
                    fsNew = fragmentShaderSession.getValue();
                    if (vsNew !== shader.vertexShaderSrc || fsNew !== shader.fragmentShaderSrc || force) {
                        shaderEditor.apply(vsNew, fsNew);
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
                var UndoManager = ace.require("ace/undomanager").UndoManager;
                editor.getSession().setUndoManager(new UndoManager());
                editor.getSession().setUseSoftTabs(false);
                editor.resize();
                currentShader = 0;
                reloadAnnotations();
            };

            this.showFragmentShader = function () {
                document.getElementById('glslEditorPanel').style.display = "block";
                editor.setSession(fragmentShaderSession);
                // clear undo manager
                var UndoManager = ace.require("ace/undomanager").UndoManager;
                editor.getSession().setUndoManager(new UndoManager());
                editor.getSession().setUseSoftTabs(false);
                editor.resize();
                currentShader = 1;
                reloadAnnotations();
            };

            this.hideEditor = function () {
                document.getElementById('glslEditorPanel').style.display = "none";
            };

            this.addAnnotations = function(vertexShaderAnnotations, fragmentShaderAnnotations){
                var i;

                for (i=0;i<vertexShaderAnnotations.length;i++){
                    vAnnotations.push(vertexShaderAnnotations[i]);
                }
                for (i=0;i<fragmentShaderAnnotations.length;i++){
                    fAnnotations.push(fragmentShaderAnnotations[i]);
                }
                reloadAnnotations();
            };

            this.clearAnnotations = function(){
                vAnnotations.length = 0;
                fAnnotations.length = 0;
                reloadAnnotations();
            };
        };
    }
);