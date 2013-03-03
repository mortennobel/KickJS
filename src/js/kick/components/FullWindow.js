define(["kick/core"], function (core) {
    "use strict";

        /**
         * A simple class that adapts the size of the canvas to the containing window.
         * The canvas need not to be positioned at the top.
         * Note this works best if the body has a margin of 0
         * @class FullWindow
         * @extends kick.scene.Component
         * @constructor
         * @namespace kick.components
         */
        return function(){
            var engine = core.Engine.instance,
                canvas = engine.canvas;
            function documentResized () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                engine.canvasResized();
            }
            documentResized();

            /**
             * Registers the object on activation
             * @method activated
             */
            this.activated = function(){
                window.onresize = documentResized;
            };
        };
    }
);