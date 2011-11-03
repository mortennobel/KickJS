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

    var core = KICK.namespace("KICK.core"),
        mesh = KICK.namespace("KICK.mesh");

    /**
     * The default resource manager
     * @class DefaultResourceProvider
     * @namespace KICK.core
     * @constructor
     * @extends KICK.core.ResourceProvider
     * @param {KICK.core.Engine} engine
     */
    core.DefaultResourceProvider = function(engine){

        Object.defineProperties(this,{
            /**
             * Protocol of the resource, such as http, kickjs<br>
             * The protocol must uniquely identify a resource provider
             * @property protocol
             * @type String
             */
            protocol:{
                value:"kickjs"
            }
        });

        /**
         * Creates a Mesh object based on a url.<br>
         * The following resources can be created:<br>
         * <ul>
         * <li><b>Triangle</b> Url: kickjs://triangle/</li>
         * <li><b>Plane</b> Url: kickjs://plane/<br></li>
         * <li><b>UVSphere</b> Url: kickjs://uvsphere/?slides=20&stacks=10&radius=1.0<br>Note that the parameters is optional</li>
         * <li><b>Cube</b> Url: kickjs://cube/?length=1.0<br>Note that the parameters is optional</li>
         * </ul>
         * @method getMesh
         * @param {String} url
         * @return {KICK.mesh.Mesh}
         */
        this.getMesh = function(url){
            var config,
                meshDataObj,
                getParameterInt = core.Util.getParameterInt,
                getParameterFloat = core.Util.getParameterFloat;
            if (url.indexOf("kickjs://triangle/")==0){
                config = {
                    name: "Triangle"
                };
                meshDataObj = mesh.MeshFactory.createTriangleData();
            } else if (url.indexOf("kickjs://plane/")==0){
                config = {
                    name: "Plane"
                };
                meshDataObj = mesh.MeshFactory.createPlaneData();
            } else if (url.indexOf("kickjs://uvsphere/")==0){
                config = {
                    name: "UVSphere"
                };
                var slices = getParameterInt(url, "slices"),
                    stacks = getParameterInt(url, "stacks"),
                    radius = getParameterFloat(url, "radius");
                meshDataObj = mesh.MeshFactory.createUVSphereData(slices, stacks, radius);
            } else if (url.indexOf("kickjs://cube/")==0){
                config = {
                    name: "Cube"
                };
                var length = getParameterFloat(url, "length");
                meshDataObj = mesh.MeshFactory.createCubeData(length);
            }
            
            if (meshDataObj){
                return new mesh.Mesh(engine,config, meshDataObj);
            }
        };

        /**
         * @method getShader
         * @param {String} url
         * @return {KICK.material.Shader}
         */
        this.getShader = function(url){

        };

        /**
         * @method getTexture
         * @param {String} url
         * @return {KICK.texture.Texture}
         */
        this.getTexture = function(url){

        };

        /**
         * @method getScene
         * @param {String} url
         * @return {KICK.scene.Scene} or null if scene cannot be initialized
         */
        this.getScene = function(url){
            return null;
        };
    };
})();
