/*!
 * New BSD License
 *
 * Copyright (c) 2011, Morten Nobel-Joergensen, Kickstart Games ( http://www.kickstartgames.com/ )
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var KICK = KICK || {};

KICK.namespace = KICK.namespace || function (ns_string) {
    var parts = ns_string.split("."),
        parent = KICK,
        i;
    // strip redundant leading global
    if (parts[0] === "KICK") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        // create property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

(function () {
    "use strict"; // force strict ECMAScript 5

    var renderer = KICK.namespace("KICK.renderer"),
        core = KICK.namespace("KICK.core"),
        scene = KICK.namespace("KICK.scene"),
        math = KICK.namespace("KICK.math");

    /**
     * Defines interface for render classes.
     * @class Renderer
     * @namespace KICK.renderer
     * @constructor
     */
    /**
     * Called each frame to render the components
     * @method render
     * @param {KICK.scene.Component} renderableComponents
     */

    /**
     * Does not render any components
     * @class NullRenderer
     * @namespace KICK.renderer
     * @constructor
     * @extends KICK.renderer.Renderer
     */
    renderer.NullRenderer = function () {};

    renderer.NullRenderer.prototype.render = function (renderableComponents,projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,sceneLightObj) {};
    
    /**
     * Forward renderer
     * @class ForwardRenderer
     * @namespace KICK.renderer
     * @constructor
     * @extends KICK.renderer.Renderer
     */
    renderer.ForwardRenderer = function () {
        this.render = function (renderableComponents,projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,sceneLightObj) {
            var length = renderableComponents.length;
            for (var j=0;j<length;j++){
                renderableComponents[j].render(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,sceneLightObj);
            }
        };
    };
}());
