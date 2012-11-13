define([], function () {
    "use strict";

    /**
     * @class UniformDescriptor
     * @namespace KICK.material
     * @constructor
     * @param {String} name
     * @param {Number} type the WebGL Uniform type
     * @param {Number} size
     * @param {WebGLUniformLocation} location
     */
    return function (name, type, size, location) {
        /**
         * @property name
         * @type String
         */
        this.name = name;
        /**
         * the WebGL Uniform type
         * @property type
         * @type Number
         */
        this.type = type;
        /**
         * @property size
         * @type Number
         */
        this.size = size;
        /**
         * @property location
         * @type WebGLUniformLocation
         */
        this.location = location;
        Object.freeze(this);
    };
});