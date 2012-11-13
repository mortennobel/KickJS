define(["./Util"], function (Util) {
    "use strict";

    /**
     * Key Input manager.<br>
     * This class encapsulates keyboard input and makes it easy to
     * test for key input.<br>
     * Example code:
     * <pre class="brush: js">
     * function KeyTestComponent(){
     * &nbsp;var keyInput, thisObj = this;
     * &nbsp;// registers listener (invoked when component is registered)
     * &nbsp;this.activated = function (){
     * &nbsp;&nbsp;var engine = thisObj.gameObject.engine;
     * &nbsp;&nbsp;keyInput = engine.keyInput;
     * &nbsp;};
     * &nbsp;this.update = function(){
     * &nbsp;&nbsp;var keyCodeForA = "A".charCodeAt(0);
     * &nbsp;&nbsp;if (keyInput.isKeyDown(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is down");
     * &nbsp;&nbsp;}
     * &nbsp;&nbsp;if (keyInput.isKey(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is being held down");
     * &nbsp;&nbsp;}
     * &nbsp;&nbsp;if (keyInput.isKeyUp(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is up");
     * &nbsp;&nbsp;}
     * &nbsp;};
     * }
     * </pre>
     * <br>
     * Pressing the 'a' key should result in one frame with 'A key is down',
     * multiple frames with 'A key is being held down' and finally one frame
     * with 'A key is up'
     * @class KeyInput
     * @namespace KICK.core
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