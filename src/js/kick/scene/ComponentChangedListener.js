define([], function () {
    "use strict";

    /**
     * Specifies the interface for a component listener.<br>
     * Note that object only need to implement the methods componentsAdded and componentsRemoved.<br>
     * However the class does exist and has the static method isComponentListener
     * @class ComponentChangedListener
     * @namespace KICK.scene
     */
    return {
        /**
         * @method componentsAdded
         * @param {Array_KICK.scene.Components} components
         */
        /**
         * @method componentsRemoved
         * @param {Array_KICK.scene.Components} components
         */
        /**
         * @method isComponentListener
         * @param {Object} obj
         * @static
         */
        isComponentListener: function (obj) {
            return obj &&
                typeof (obj.componentsAdded) === "function" &&
                typeof (obj.componentsRemoved) === "function";
        }
    };

});