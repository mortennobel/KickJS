define([], function () {
    "use strict";

    /**
     * Responsible for creating or loading a resource using a given url.
     * Abstract class (only defines the interface - inheritance not supported)
     * @class ResourceProvider
     * @namespace kick.core
     * @constructor
     * @param {String} protocol
     */
    /**
     * Protocol of the resource, such as http://, kickjs://<br>
     * The protocol must uniquely identify a resource provider
     * @property protocol
     * @type String
     */

    /**
     * @method getMeshData
     * @param {String} uri
     * @param {kick.mesh.Mesh} meshDestination
     */
    /**
     * @method getImageData
     * @param {String} uri
     * @param {kick.texture.Texture} textureDestination
     */
    /**
     * @method getShaderData
     * @param {String} uri
     * @param {kick.material.Shader} shaderDestination
     */
    return {};
});