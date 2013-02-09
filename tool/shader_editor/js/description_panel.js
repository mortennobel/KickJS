define([],
    function () {
        "use strict";
        return function(Y){
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
        };
    }
);