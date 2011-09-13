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
        scene = KICK.namespace("KICK.scene");

    /**
     * Defines interface for render classes.
     * @class Renderer
     * @namespace KICK.renderer
     * @constructor
     */
    /**
     * @method init
     * @param {WebGL-Context}gl
     */
    /**
     * Called each frame to render the components
     * @method render
     */
    /**
     * Event when new renderable is added to scene
     * @method addRenderableComponent
     * @param {KICK.scene.Component} component
     */
    /**
     * Event when new renderable is removed from scene
     * @method removeRenderableComponent
     * @param {KICK.scene.Component} component
     */


    /**
     * Does not render any components
     * @class NullRenderer
     * @namespace KICK.renderer
     * @constructor
     * @extends KICK.renderer.Renderer
     */
    renderer.NullRenderer = function () {};

    renderer.NullRenderer.prototype.render = function () {};
    renderer.NullRenderer.prototype.init = function (gl) {};
    renderer.NullRenderer.prototype.addRenderableComponent = function () {};
    renderer.NullRenderer.prototype.removeRenderableComponent = function () {};

    /**
     * Forward renderer
     * @class ForwardRenderer
     * @namespace KICK.renderer
     * @constructor
     * @extends KICK.renderer.Renderer
     */
    renderer.ForwardRenderer = function () {
        var renderableComponents = [],
            cameras = [],
            gl;

        this.init = function (glContext) {
            gl = glContext;
        }

        this.render = function () {
            var i,j;
            for (i=cameras.length-1; i >= 0; i--) {
                cameras[i].setupCamera();
                for (j=renderableComponents.length-1; j >= 0; j--) {
                    renderableComponents[j].render();
                }
            }
            gl.flush();
        };

        this.componentsAdded = function (components) {
            for (var i=components.length-1; i>=0; i--) {
                var component = components[i];
                if (component instanceof scene.Camera) {
                    cameras.push(component);
                }
                if (typeof(component.render) === "function") {
                    renderableComponents.push(component);
                }
                if (typeof(component.initGL) === "function") {
                    component.initGL(gl);
                }
            }
        };

        this.componentsRemoved = function (components) {
            for (var i=components.length-1; i>=0; i--) {
                var component = components[i];
                if (component instanceof scene.Camera) {
                    core.Util.removeElementFromArray(cameras,component);
                }
                if (typeof(component.render) === "function") {
                    core.Util.removeElementFromArray(renderableComponents,component);
                }
            }
        };
    };
}());
