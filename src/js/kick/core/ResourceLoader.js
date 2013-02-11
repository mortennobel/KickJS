define(["./URLResourceProvider", "./BuiltInResourceProvider"], function (URLResourceProvider, BuiltInResourceProvider) {
    "use strict";

    /**
     * Responsible for loading of resources. Use the Engine object to obtain a reference to this object.
     * @class ResourceLoader
     * @namespace kick.core
     * @constructor
     */
    return function (engine) {
        var resourceProviders =
                [
                    new URLResourceProvider(engine),
                    new BuiltInResourceProvider(engine)
                ],
            /**
             * Create a callback function
             * @method buildCallbackFunc
             * @private
             */
            buildCallbackFunc = function (methodName) {
                return function (url, destination, resourceTracker) {
                    var i,
                        resourceProvider,
                        protocol;
                    for (i = resourceProviders.length - 1; i >= 0; i--) {
                        resourceProvider = resourceProviders[i];
                        protocol = resourceProvider.protocol;
                        if (url.indexOf(protocol) === 0) {
                            resourceProvider[methodName](url, destination, resourceTracker);
                            return;
                        }
                    }
                };
            };
        /**
         * @method getMeshData
         * @param {String} uri
         * @param {kick.mesh.Mesh} meshDestination
         * @param {ResourceTracker} [resourceTracker]
         */
        this.getMeshData = buildCallbackFunc("getMeshData");
        /**
         * @method getImageData
         * @param {String} uri
         * @param {kick.texture.Texture} textureDestination
         */
        this.getImageData = buildCallbackFunc("getImageData");

        /**
         * @method getShaderData
         * @param {String} uri
         * @param {kick.material.Shader} shaderDestination
         */
        this.getShaderData = buildCallbackFunc("getShaderData");

        /**
         * @method addResourceProvider
         * @param {kick.resource.ResourceProvider} resourceProvider
         */
        this.addResourceProvider = function (resourceProvider) {
            resourceProviders.push(resourceProvider);
        };

        /**
         * @method removeResourceProvider
         * @param {kick.resource.ResourceProvider} resourceProvider
         */
        this.removeResourceProvider = function (resourceProvider) {
            var i;
            for (i = resourceProvider.length - 1; i >= 0; i--) {
                if (resourceProviders[i] === resourceProvider) {
                    resourceProviders.splice(i, 1);
                }
            }
        };
    };

});