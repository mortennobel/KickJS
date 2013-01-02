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

        this.getMeshData = function (url, meshDestination, resourceTracker) {
            var oReq = new XMLHttpRequest();
            if (resourceTracker && resourceTracker.resourceLoadingStarted){
                resourceTracker.resourceLoadingStarted(url, meshDestination);
            }
            function handler() {
                if (oReq.readyState === 4) { // oReq.readyState  === complete
                    if (oReq.status === 200) { // oReq.status === ok
                        var arrayBuffer = oReq.response,
                            meshData = new MeshData();
                        if (meshData.deserialize(arrayBuffer)) {
                            meshDestination.meshData = meshData;
                            if (resourceTracker && resourceTracker.resourceLoadingStarted){
                                resourceTracker.resourceLoadingFinished(url, meshDestination);
                            }
                        } else {
                            Util.fail("Cannot deserialize meshdata " + url);
                            if (resourceTracker && resourceTracker.resourceLoadingFailed){
                                resourceTracker.resourceLoadingFailed(url, meshDestination);
                            }
                        }
                    } else {
                        Util.fail("Cannot load meshdata " + url + ". Server responded " + oReq.status);
                        if (resourceTracker && resourceTracker.resourceLoadingFailed){
                            resourceTracker.resourceLoadingFailed(url, meshDestination);
                        }
                    }
                }
            }

            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";
            oReq.onreadystatechange = handler;
            oReq.send();
        };

        this.getImageData = function (uri, textureDestination, resourceTracker) {
            var img = new Image();
            if (resourceTracker && resourceTracker.resourceLoadingStarted){
                resourceTracker.resourceLoadingStarted(url, textureDestination);
            }
            img.onload = function () {
                try {
                    textureDestination.setImage(img, uri);
                    if (resourceTracker && resourceTracker.resourceLoadingStarted){
                        resourceTracker.resourceLoadingFinished(url, textureDestination);
                    }
                } catch (e) {
                    Util.fail("Exception when loading image " + uri);
                    if (resourceTracker && resourceTracker.resourceLoadingFailed){
                        resourceTracker.resourceLoadingFailed(url, textureDestination);
                    }
                }
            };
            img.onerror = function (e) {
                Util.fail(e);
                Util.fail("Exception when loading image " + uri);
                if (resourceTracker && resourceTracker.resourceLoadingFailed){
                    resourceTracker.resourceLoadingFailed(url, textureDestination);
                }
            };
            if (uri.indexOf('data:') !== 0) {
                img.crossOrigin = "anonymous"; // Ask for a CORS image except when using data
            }
            img.src = uri;
        };
    };

});