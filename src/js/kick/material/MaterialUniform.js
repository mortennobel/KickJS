define(["kick/core/Util", "kick/core/Constants", "kick/texture/Texture"], function (Util, Constants, Texture) {
    "use strict";

    var ASSERT = Constants._ASSERT;

    /**
     * Material material uniform object
     * @class MaterialUniform
     * @namespace kick.material
     * @constructor
     * @param {Object} configuration
     * @protected
     */
    return function (configuration) {
        var value,
            thisObj = this;
        configuration = configuration || {};
        value = configuration.value;

        /**
         * WebGL Uniform location
         * @property location
         * @type WebGLUniformLocation
         */
        this.location = null;

        /**
         * WebGL type
         * @property type
         * @type Number
         */
        this.type = null;
        /**
         * Name of the Uniform
         * @property name
         * @type String
         */
        this.name = configuration.name;

        Object.defineProperties(this,
            {
                /**
                 * @property value
                 * @type Float32Array|Int32Array|kick.texture.Texture
                 */
                value: {
                    get: function () {
                        return value;
                    },
                    set: function (newValue) {
                        value = newValue;
                    }
                }
            });


        /**
         * Returns a JSON representation of the material<br>
         * @method toJSON
         * @return {string}
         */
        this.toJSON = function () {
            var value = thisObj.value;
            if (value instanceof Float32Array || value instanceof Int32Array) {
                value = Util.typedArrayToArray(value);
            } else {
                if (ASSERT) {
                    if (!value instanceof Texture) {
                        Util.fail("Unknown uniform value type. Expected Texture");
                    }
                }
                value = Util.getJSONReference(value.engine, value);
            }
            return {
                name: thisObj.name,
                value: value
            };
        };
    };
});