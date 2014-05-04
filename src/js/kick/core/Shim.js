define([], function () {
    "use strict";

    /* ////// Removed from documentation /////
     * Adds requestAnimationFrame as window.requestAnimationFrame
     * @class Shim
     * @namespace kick.core
     */
    if (typeof window.requestAnimationFrame === "undefined") {
        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame   ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function (/* function */ callback, /* DOMElement */ element) {
                    var fps60 = 16.7;
                    return window.setTimeout(callback, fps60, Date.now());
                };
        })();
    }
    if (typeof window.cancelAnimationFrame === "undefined") {
        window.cancelAnimationFrame = (function () {
            return window.cancelAnimationFrame          ||
                window.cancelRequestAnimFrame               ||
                window.webkitCancelRequestAnimationFrame    ||
                window.mozCancelRequestAnimationFrame       ||
                window.oCancelRequestAnimationFrame     ||
                window.msCancelRequestAnimationFrame        ||
                clearTimeout;
        } )();
    }

    // workaround for undefined consoles
    if (typeof window.console === "undefined") {
        window.console = {};
    }
    if (typeof window.console.log === "undefined") {
        window.console.log = function (v) {
        };
    }
});

