define(["require","./Util", "./Constants", "./EngineSingleton"], function (require, Util, constants, EngineSingleton) {
    "use strict";

    var ASSERT = constants._ASSERT;

    /**
     * A project is a container of all resources and assets used in a game.<br>
     *
     * @example
     *     var materialConfig = {
     *         name:"Some material",
     *         shader:"Undefined",
     *         uniforms: {
     *             value:42,
     *             type: kick.core.Constants.GL_FLOAT
     *         }
     *     };
     *     var resourceDescriptorConfig = {
     *         type: "kick/material/Material",
     *         config: materialConfig,
     *         uid: 132
     *     };
     *     var materialDescriptor = new ResourceDescriptor(resourceDescriptorConfig);
     *
     * @class ResourceDescriptor
     * @namespace kick.core
     * @constructor
     * @param {Object} config an object which attributes matches the properties of ResourceDescriptor
     */
    return function (config) {
        var engine = EngineSingleton.engine,
            _config = config || {},
            type = _config.type,
            uid = _config.uid,
            resourceConfig = _config.config;
        Object.defineProperties(this, {
            /**
             * The name may contain '/' as folder separator. The name property is a shorthand for config.name
             * @property name
             * @type String
             */
            name: {
                get: function () {
                    return resourceConfig.name;
                },
                set: function (newValue) {
                    resourceConfig.name = newValue;
                }
            },
            /**
             * class name of the resource (such as 'kick.material.Material')
             * @property type
             * @type String
             */
            type: {
                value: type
            },
            /**
             * Configuration of the resource.
             * Optional
             * @property config
             * @type Object
             */
            config: {
                get: function () { return resourceConfig; }
            },
            /**
             * @property uid
             * @type Number
             */
            uid: {
                value: uid
            }
        });

        /**
         * Updates the configuration with the one from object. The method will use object.toJSON(filter)
         * (if toJSON method exist - otherwise the object are used directly)
         * @method updateConfig
         * @param {Object} object
         * @param {Function} filter=null Filter with function(object): return boolean, where true means include in export.
         */
        this.updateConfig = function (object, filter) {
            resourceConfig = object.toJSON ? object.toJSON(filter) : object;
        };

        /**
         * Create a instance of the resource by calling the constructor function with
         * uid (but otherwise uninitialized).<br>
         * This method is used during project load.
         * @method instantiate
         * @param {function} onSuccess callback function that returns the resource
         * @param {function} onError=null callback function when error occurs
         */
        this.instantiate = function (onSuccess, onError) {
            if (ASSERT) {
                if (typeof onSuccess !== "function"){
                    console.log("ResourceDescriptor.onSuccess is not a function");
                }
                if (engine === onSuccess){
                    console.log("ResourceDescriptor.onSuccess is not ");
                }
            }
            var typePath = type.replace(/\./g,"/");
            require([typePath], function(ResourceClass) {
                var resource = new ResourceClass({uid: uid});
                onSuccess(resource);
            }, onError);
        };

        /**
         * @method toJSON
         * @return {Object} A json data object
         */
        this.toJSON = function () {
            return {
                type: type,
                uid: uid,
                config: resourceConfig
            };
        };
    };

});