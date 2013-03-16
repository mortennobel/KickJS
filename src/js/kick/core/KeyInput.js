define(["./Util"], function (Util) {
    "use strict";

    /**
     * Key Input manager.<br>
     * This class encapsulates keyboard input and makes it easy to
     * test for key input.<br>
     *
     * Example code:
     * @example
     *     function KeyTestComponent(){
     *         var keyInput, thisObj = this;
     *         // registers listener (invoked when component is registered)
     *         this.activated = function (){
     *             var engine = kick.core.Engine.instance;
     *             keyInput = engine.keyInput;
     *         };
     *         this.update = function(){
     *             var keyCodeForA = "A".charCodeAt(0);
     *             if (keyInput.isKeyDown(keyCodeForA)){
     *                 console.log("A key is down");
     *             }
     *             if (keyInput.isKey(keyCodeForA)){
     *                 console.log("A key is being held down");
     *             }
     *             if (keyInput.isKeyUp(keyCodeForA)){
     *                 console.log("A key is up");
     *             }
     *         };
     *     }
     *
     * Pressing the 'a' key should result in one frame with 'A key is down',
     * multiple frames with 'A key is being held down' and finally one frame
     * with 'A key is up'
     * @class KeyInput
     * @constructor
     * @namespace kick.core
     */
    return function () {
        var keyDown = [],
            keyUp = [],
            key = [],
            removeElementFromArray = Util.removeElementFromArray,
            contains = Util.contains,
            keyDownHandler = function (e) {
                var keyCode = e.keyCode;
                if (!contains(key, keyCode)) {
                    keyDown.push(keyCode);
                    key.push(keyCode);
                }
            },
            keyUpHandler = function (e) {
                var keyCode = e.keyCode;
                keyUp.push(keyCode);
                removeElementFromArray(key, keyCode);
            };

        /**
         * @method isKeyDown
         * @param {Number} keyCode
         * @return {boolean} true if key is pressed down in this frame
         */
        this.isKeyDown = function (keyCode) {
            return contains(keyDown, keyCode);
        };

        /**
         * @method isKeyUp
         * @param {Number} keyCode
         * @return {boolean} true if key is release in this frame
         */
        this.isKeyUp = function (keyCode) {
            return contains(keyUp, keyCode);
        };

        /**
         *
         * @method isKey
         * @param {Number} keyCode
         * @return {boolean} true if key is down
         */
        this.isKey = function (keyCode) {
            return contains(key, keyCode);
        };

        /**
         * @method isAnyKeyDown
         * @return {boolean} true if any key is pressed down in this frame
         */
        this.isAnyKeyDown = function () {
            return keyDown.length > 0;
        };

        /**
         * @method isAnyKeyUp
         * @return {boolean} true if any key is release in this frame
         */
        this.isAnyKeyUp = function () {
            return keyUp.length > 0;
        };

        /**
         *
         * @method isAnyKey
         * @return {boolean} true if any key is down
         */
        this.isAnyKey = function () {
            return key.length > 0;
        };


        /**
         * This method clears key up and key downs each frame (leaving key unmodified)
         * @method update
         * @private
         */
        this.frameUpdated = function () {
            keyDown.length = 0;
            keyUp.length = 0;
        };

        (function init() {
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
        }());
    };

});