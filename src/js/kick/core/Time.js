define([], function () {
    "use strict";

    /**
     * A global timer object
     * @class Time
     * @namespace KICK.core
     */
    return function () {
        /**
         * Time since start in milliseconds. Read only
         * @property time
         * @type Number
         */
        this.time = 0;
        /**
         * Millis between this frame and last frame. Read only
         * @property deltaTime
         * @type Number
         */
        this.deltaTime = 0;
        /**
         * Number of frames since start. Read only
         * @property frame
         * @type Number
         */
        this.frame = 0;
        /**
         * Default value is 1.0. Can be used for implementing pause or slow-motion sequences
         * @property scale
         * @type Number
         */
        this.scale = 0;
    };
});