define(["kick/math/Vec2", "./Util"], function (Vec2, Util) {
    "use strict";

    /**
     * Provides an easy-to-use mouse input interface.
     * Example:<br>
     * @example
     *     function SimpleMouseComponent(){
     *         var mouseInput,
     *         thisObj = this;
     *         this.activated = function(){
     *             mouseInput = kick.core.EngineSingleton.engine.mouseInput;
     *         };
     *         this.update = function(){
     *             if (mouseInput.isButtonDown(0)){
     *                 var str = "Left mouse down at position "+mouseInput.mousePosition[0]+","+mouseInput.mousePosition[1];
     *                 console.log(str);
     *             }
     *         }
     *     }
     * @constructor
     * @class MouseInput
     * @namespace kick.core
     */
    return function (engine) {
        var vec2 = Vec2,
            mouse = [],
            mouseUp = [],
            mouseDown = [],
            mousePosition = vec2.create(),
            lastMousePosition = vec2.create(),
            deltaMovement = null,
            objectPosition = vec2.create(),
            mouseWheelDelta = vec2.create(),
            mouseWheelPreventDefaultAction = false,
            canvas = engine.canvas,
            devicePixelRatio = engine.config.highDPISupport ? (window.devicePixelRatio || 1) : 1,
            removeElementFromArray = Util.removeElementFromArray,
            contains = Util.contains,
            mouseMovementListening = true,
            releaseMouseButtonOnMouseOut = true,
            body = document.body,
            isFirefox = navigator.userAgent.indexOf("Firefox") !== -1,
            isChrome = navigator.userAgent.indexOf("Chrome") !== -1,
            mouseContextMenuHandler = function (e) {
                e.preventDefault();
                return false;
            },
            mouseMovementHandler = function (e) {
                mousePosition[0] = (e.clientX - objectPosition[0] + body.scrollLeft) * devicePixelRatio;
                mousePosition[1] = (e.clientY - objectPosition[1] + body.scrollTop) * devicePixelRatio;
                if (deltaMovement) {
                    vec2.subtract(deltaMovement, mousePosition, lastMousePosition);
                } else {
                    deltaMovement = vec2.create();
                }
                vec2.copy(lastMousePosition, mousePosition);
            },
            mouseWheelHandler = function (e) {
                if (isChrome) {
                    mouseWheelDelta[0] += e.wheelDeltaX;
                    mouseWheelDelta[1] += e.wheelDeltaY;
                } else {
                    if (e.axis === 1) { // horizontal
                        mouseWheelDelta[0] -= e.detail;
                    } else {
                        mouseWheelDelta[1] -= e.detail;
                    }
                }
                if (mouseWheelPreventDefaultAction) {
                    e.preventDefault();
                    return false;
                }
            },
            mouseDownHandler = function (e) {
                var mouseButton = e.button;
                if (!contains(mouse, mouseButton)) {
                    mouseDown.push(mouseButton);
                    mouse.push(mouseButton);
                }
                if (!mouseMovementListening) {  // also update mouse position if not listening for mouse movement
                    mouseMovementHandler();
                }
            },
            mouseUpHandler = function (e) {
                var mouseButton = e.button;
                mouseUp.push(mouseButton);
                removeElementFromArray(mouse, mouseButton);
                if (!mouseMovementListening) { // also update mouse position if not listening for mouse movement
                    mouseMovementHandler();
                }
            },
            mouseOutHandler = function () {
                var i;
                if (releaseMouseButtonOnMouseOut) {
                    // simulate mouse up events
                    for (i = mouse.length - 1; i >= 0; i--) {
                        mouseUpHandler({button: mouse[i]});
                    }
                }
            },
            /**
             * Calculates an object with the x and y coordinates of the given object.
             * Updates the objectPosition variable
             * @method updateCanvasElementPositionPrivate
             * @private
             */
            updateCanvasElementPositionPrivate = function () {
                var object = canvas,
                    left = 0,
                    top = 0;

                while (object.offsetParent) {
                    left += object.offsetLeft;
                    top += object.offsetTop;
                    object = object.offsetParent;
                }

                left += object.offsetLeft;
                top += object.offsetTop;

                objectPosition[0] = left;
                objectPosition[1] = top;
            };
        Object.defineProperties(this, {
            /**
             * Returns the mouse position of the canvas element, where 0,0 is in the upper left corner.
             * @property mousePosition
             * @type kick.math.Vec2
             */
            mousePosition: {
                get: function () {
                    return mousePosition;
                }
            },
            /**
             * Returns the delta movement (relative mouse movement since last frame)
             * @property deltaMovement
             * @type kick.math.Vec2
             */
            deltaMovement: {
                get: function () {
                    return deltaMovement || vec2.create();
                }
            },
            /**
             * Mouse scroll wheel input in two dimensions (horizontal and vertical)
             * @property deltaWheel
             * @type kick.math.Vec2
             */
            deltaWheel: {
                get: function () {
                    return mouseWheelDelta;
                }
            },
            /**
             * If set to true, the engine will prevent screen from scrolling when mouse wheel is used when mouse pointer
             * is over the canvas.<br>
             * Default value is false
             * @property mouseWheelPreventDefaultAction
             * @type Boolean
             */
            mouseWheelPreventDefaultAction: {
                get: function () {
                    return mouseWheelPreventDefaultAction;
                },
                set: function (newValue) {
                    mouseWheelPreventDefaultAction = newValue;
                }
            },
            /**
             * When true mouse buttons are auto released when mouse moves outside the canvas.
             * If this is not true, then mouse up events may not be detected. This is important
             * when listening for mouse drag events.
             * Default true
             * @property releaseMouseButtonOnMouseOut
             * @type Boolean
             */
            releaseMouseButtonOnMouseOut: {
                get: function () {
                    return releaseMouseButtonOnMouseOut;
                },
                set: function (newValue) {
                    if (newValue !== releaseMouseButtonOnMouseOut) {
                        releaseMouseButtonOnMouseOut = newValue;
                        if (releaseMouseButtonOnMouseOut) {
                            canvas.addEventListener("mouseout", mouseOutHandler, false);
                        } else {
                            canvas.removeEventListener("mouseout", mouseOutHandler, false);
                        }
                    }
                }
            },
            /**
             * Default value is true
             * @property mouseMovementEventsEnabled
             * @type Boolean
             */
            mouseMovementEventsEnabled: {
                get: function () { return mouseMovementListening; },
                set: function (value) {
                    if (mouseMovementListening !== value) {
                        mouseMovementListening = value;
                        if (mouseMovementListening) {
                            canvas.addEventListener("mousemove", mouseMovementHandler, false);
                        } else {
                            canvas.removeEventListener("mousemove", mouseMovementHandler, false);
                            deltaMovement = null;
                        }
                    }
                }
            }
        });

        /**
         * @method isButtonDown
         * @param {Number} mouseButton
         * @return {boolean} true if mouse button is pressed down in this frame
         */
        this.isButtonDown = function (mouseButton) {
            return contains(mouseDown, mouseButton);
        };

        /**
         * @method isButtonUp
         * @param {Number} mouseButton
         * @return {boolean} true if mouseButton is released in this frame
         */
        this.isButtonUp = function (mouseButton) {
            return contains(mouseUp, mouseButton);
        };

        /**
         * @method isButton
         * @param {Number} mouseButton
         * @return {boolean} true if mouseButton is down
         */
        this.isButton = function (mouseButton) {
            return contains(mouse, mouseButton);
        };

        /**
         * Resets the mouse position each frame (mouse buttons down and delta values)
         * @method frameUpdated
         * @private
         */
        this.frameUpdated = function () {
            mouseDown.length = 0;
            mouseUp.length = 0;
            mouseWheelDelta[0] = 0;
            mouseWheelDelta[1] = 0;
            if (deltaMovement) {
                deltaMovement[0] = 0;
                deltaMovement[1] = 0;
            }
        };

        /**
         * Update the mouseInput with the relative position of the canvas element.
         * This method should be called whenever the canvas element is moved in the document. <br>
         * This method is automatically called when Engine.canvasResized() is invoked.
         *
         * @method updateCanvasElementPosition
         */
        this.updateCanvasElementPosition = updateCanvasElementPositionPrivate;

        (function init() {
            updateCanvasElementPositionPrivate();
            var canvas = engine.canvas;
            canvas.addEventListener("mousedown", mouseDownHandler, true);
            canvas.addEventListener("mouseup", mouseUpHandler, true);
            canvas.addEventListener("mousemove", mouseMovementHandler, true);
            canvas.addEventListener("mouseout", mouseOutHandler, true);
            canvas.addEventListener("contextmenu", mouseContextMenuHandler, true);
            if (isFirefox) {
                canvas.addEventListener('MozMousePixelScroll', mouseWheelHandler, true); // Firefox
            } else if (isChrome) {
                canvas.addEventListener('mousewheel', mouseWheelHandler, true); // Chrome
            } else {
                canvas.addEventListener('DOMMouseScroll', mouseWheelHandler, true); // Firefox
            }
        }());
    };

});