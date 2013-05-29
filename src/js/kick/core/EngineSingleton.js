define(["./Constants"], function (Constants) {
    "use strict";
    /* //////// no documentation to hide class /////////
     * Singleton - used to get a reference to the current engine.
     * The static engine property is set when an engine-instance is created.
     * The singleton object is needed to avoid cyclic-dependencies.
     * When used outside the engine, you can use the kick.core.Engine.instance instead.
     * @class EngineSingleton
     * @namespace kick.core
     * @private
     */
    var EngineSingleton = {},
        currentEngine = null;
    /* //////// no documentation to hide class /////////
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
                if (currentEngine === null && Constants._DEBUG){
                    console.log("Engine is not initialized yet.");
                }
                return currentEngine;
            }

        });
    Object.freeze(EngineSingleton);

    return EngineSingleton;
});
