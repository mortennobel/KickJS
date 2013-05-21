define(["kick/core"], function (core) {
    "use strict";

        var Util = core.Util;

        /**
         * A simple class that adapts the size of the canvas to the containing window.
         * The canvas need not to be positioned at the top.
         * Note this works best if the body has a margin of 0
         * @class FullWindow
         * @extends kick.scene.Component
         * @constructor
         * @namespace kick.components
         * @param {Object} config
         */
        return function () {
            var engine = core.Engine.instance,
                canvas = engine.canvas,
                resizeTimeout,
                documentResized = function () {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight - canvas.offsetTop;
                    engine.canvasResized();
                },
                // https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/resize
                resizeThrottler = function () {
                    // ignore resize events as long as an actualResizeHandler execution is in the queue
                    if ( !resizeTimeout ) {
                        resizeTimeout = setTimeout(function() {
                            resizeTimeout = null;
                            documentResized();

                            // The actualResizeHandler will execute at a rate of 15fps
                        }, 66);
                    }
                };
            documentResized();

            /**
             * Registers the object on activation
             * @method activated
             */
            this.activated = function(){
                window.addEventListener("resize", resizeThrottler);
            };

            /**
             * @method deactivated
             */
            this.deactivated = function(){
                window.removeEventListener("resize", resizeThrottler);
            };

            /**
             * @method toJSON
             * @return {JSON}
             */
            this.toJSON = function () {
                return Util.componentToJSON(this, "kick.components.FullWindow");
            };

        };
    }
);