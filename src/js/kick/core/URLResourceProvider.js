define(["kick/mesh/MeshData", "./Util"], function (MeshData, Util) {
    "use strict";

    /**
     * Fall back handler of resources
     * @class URLResourceProvider
     * @namespace kick.core
     * @constructor
     * @extends kick.core.ResourceProvider
     * @param {kick.core.Engine} engine
     * @private
     */
    return function (engine) {
        var gl = engine.gl,
            thisObj = this;
        Object.defineProperties(this, {
            /**
             * Returns empty string (match all)
             * @property protocol
             * @type String
             */
            protocol: {
                value: ""
            }
        });

        this.getMeshData = function (url, meshDestination) {
            var oReq = new XMLHttpRequest();
            function handler() {
                if (oReq.readyState === 4) { // oReq.readyState  === complete
                    if (oReq.status === 200) { // oReq.status === ok
                        var arrayBuffer = oReq.response,
                            meshData = new MeshData();
                        if (meshData.deserialize(arrayBuffer)) {
                            meshDestination.meshData = meshData;
                        } else {
                            Util.fail("Cannot deserialize meshdata " + url);
                        }
                    } else {
                        Util.fail("Cannot load meshdata " + url + ". Server responded " + oReq.status);
                    }
                }
            }

            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";
            oReq.onreadystatechange = handler;
            oReq.send();
        };

        this.getImageData = function (uri, textureDestination) {
            var img = new Image();
            img.onload = function () {
                try {
                    textureDestination.setImage(img, uri);
                } catch (e) {
                    Util.fail("Exception when loading image " + uri);
                }
            };
            img.onerror = function (e) {
                Util.fail(e);
                Util.fail("Exception when loading image " + uri);
            };
            if (uri.indexOf('data:') !== 0) {
                img.crossOrigin = "anonymous"; // Ask for a CORS image except when using data
            }
            img.src = uri;
        };
    };

});