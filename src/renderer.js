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
