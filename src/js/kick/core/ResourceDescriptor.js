define(["./Util"], function (Util) {
    "use strict";

    /**
     * A project is a container of all resources and assets used in a game.<br>
     * Example usage:
     * <pre class="brush: js">
     * var materialConfig = {
     *          name:"Some material",
     *          shader:"Undefined",
     *          uniforms: {
     *              value:42,
     *              type: kick.core.Constants.GL_FLOAT
     *          }
     *      };
     *      var resourceDescriptorConfig = {
     *          type: "kick.material.Material",
     *          config: materialConfig,
     *          uid: 132
     *      };
     *      var materialDescriptor = new ResourceDescriptor(resourceDescriptorConfig);
     * </pre>
     * @class ResourceDescriptor
     * @namespace kick.core
     * @constructor
     * @param {Object} config an object which attributes matches the properties of ResourceDescriptor
     */
    return function (config) {
        var _config = config || {},
            type = _config.type,
            uid = _config.uid,
            resourceConfig = _config.config,
            hasProperty = Util.hasProperty,
            createConfigInitialized = function (engine, config) {
                var res = {},
                    name,
                    value,
                    reftype,
                    ref;
                for (name in config) {
                    if (hasProperty(config, name)) {
                        value = config[name];
                        reftype = value ? value.reftype : null;
                        ref = value ? value.ref : null;
                        if (value && ref && reftype) {
                            if (reftype === "resource") {
                                value = engine.resourceLoader[value.refMethod](ref);
                            } else if (reftype === "project") {
                                value = engine.project.load(ref);
                            }
                        }
                        res[name] = value;
                    }
                }
                res.uid = uid;
                return res;
            };
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
         * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
         */
        this.updateConfig = function (object, filter) {
            resourceConfig = object.toJSON ? object.toJSON(filter) : object;
        };

        /**
         * Create a instance of the resource by calling the constructor function with
         * (engine,config) parameters.<br>
         * If the resource object has a init function, this is also invoked.
         * @method instantiate
         * @param {kick.core.Engine} engine
         * @return {Object} instance of the resource
         */
        this.instantiate = function (engine) {
            var ResourceClass = Util.namespace(type),
                resource = new ResourceClass(engine, createConfigInitialized(engine, resourceConfig));
            if (typeof resource.init === 'function') {
                resource.init();
            }
            return resource;
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