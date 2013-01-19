define(["./Constants"], function (Constants) {
    "use strict";
    /**
     * Singleton - used to get a reference to the current engine.
     * The static engine property is set when an engine-instance is created.
     * The singleton object is needed to avoid cyclic-dependencies.
     * @class EngineSingleton
     * @namespace kick.core
     */
    var EngineSingleton = {},
        currentEngine = null;
    /**
     * Returns
     * @property engine
     * @type {kick.core.Engine}
     * @default null
     * @static
     */
    Object.defineProperty(EngineSingleton, "engine",
        {
            set: function (newEngine) {
                if (currentEngine !== null && Constants._DEBUG) {
                    console.log("Engine is created twice in same context.");
                }
                currentEngine = newEngine;
            },
            get: function(){
                if (currentEngine==null && Constants._DEBUG){
                    console.log("Engine is not initialized yet.");
                }
                return currentEngine;
            }

        });
    Object.freeze(EngineSingleton);

    return EngineSingleton;
});