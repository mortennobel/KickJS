define(["kick/core/Constants", "./Util", "./EngineSingleton"], function (Constants, Util, EngineSingleton) {
    "use strict";

    var ASSERT = Constants._ASSERT;

    /**
     * A project asset is an object that can be serialized into a project and restored at a later state.<br>
     * The class is used to describe the behavior any project asset must implement, but instanceof operator does not work.<br>
     * The constructor must take the following two parameters: kick.core.Engine engine, {Object} config<br>
     * The config parameter is used to initialize the object and the content should match the output of the
     * toJSON method<br>
     * A toJSON method should exist on the object. This method should as a minimum write out the object's uid property.<br>
     * ProjectAsset objects may reference other ProjectAsset objects, however cyclic references are not allowed.
     * @class ProjectAsset
     * @namespace kick.core
     */
    return function (object, config, name) {
        var uid = (config && config.uid)?config.uid:0;

        /**
         * @property uid
         * @type Number
         */
        Object.defineProperty(object, "uid", {
            get: function () {
                return uid;
            },
            set: function (newValue) {
                if (ASSERT) {
                    if (typeof newValue !== "number") {
                        Util.fail("uid must be number");
                    }
                    if (uid !== 0 && newValue !== uid) {
                        Util.fail("uid cannot be reassigned");
                    }
                }
                uid = newValue;
            }
        });

        /**
         * Configures the object using the configuration data.
         * @method init
         * @param config {Object} configuration data in JSON format
         * @param resourceTracker {ResourceTracker} Optional
         */
        object.init = function(config, resourceTracker){
            Util.applyConfig(this, config, ["uid"]);
        };

        /**
         * @method toJSON
         * @return {Object} configuration in JSON
         * @abstract
         */
        object.toJSON = function(){
            Util.fail("toJSON does not exist for the Asset");
        };

        (function init(){
            EngineSingleton.engine.project.registerObject(object, name);
        }());
    };

});