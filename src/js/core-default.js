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
KICK.namespace = function (ns_string) {
    var parts = ns_string.split("."),
        parent = window,
        i;

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
        mesh = KICK.namespace("KICK.mesh"),
        material = KICK.namespace("KICK.material"),
        constants = core.Constants;

    /**
     * The default resource manager
     * @class DefaultResourceProvider
     * @namespace KICK.core
     * @constructor
     * @extends KICK.core.ResourceProvider
     * @param {KICK.core.Engine} engine
     */
    core.DefaultResourceProvider = function(engine){
        var gl = engine.gl;

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
         * <li><b>Triangle</b> Url: kickjs://mesh/triangle/</li>
         * <li><b>Plane</b> Url: kickjs://mesh/plane/<br></li>
         * <li><b>UVSphere</b> Url: kickjs://mesh/uvsphere/?slides=20&stacks=10&radius=1.0<br>Note that the parameters is optional</li>
         * <li><b>Cube</b> Url: kickjs://mesh/cube/?length=1.0<br>Note that the parameters is optional</li>
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
            if (url.indexOf("kickjs://mesh/triangle/")==0){
                config = {
                    name: "Triangle"
                };
                meshDataObj = mesh.MeshFactory.createTriangleData();
            } else if (url.indexOf("kickjs://mesh/plane/")==0){
                config = {
                    name: "Plane"
                };
                meshDataObj = mesh.MeshFactory.createPlaneData();
            } else if (url.indexOf("kickjs://mesh/uvsphere/")==0){
                config = {
                    name: "UVSphere"
                };
                var slices = getParameterInt(url, "slices"),
                    stacks = getParameterInt(url, "stacks"),
                    radius = getParameterFloat(url, "radius");
                meshDataObj = mesh.MeshFactory.createUVSphereData(slices, stacks, radius);
            } else if (url.indexOf("kickjs://mesh/cube/")==0){
                config = {
                    name: "Cube"
                };
                var length = getParameterFloat(url, "length");
                meshDataObj = mesh.MeshFactory.createCubeData(length);
            } else {
                return null;
            }
            
            if (meshDataObj){
                config.meshData = meshDataObj;
                return new mesh.Mesh(engine,config);
            }
        };

        /**
         * Create a default shader based on a URL<br>
         * The following shaders are available:
         *  <ul>
         *  <li><b>Phong</b> Url: kickjs://shader/phong/</li>
         *  <li><b>Unlit</b> Url: kickjs://shader/unlit/</li>
         *  <li><b>Error</b> Url: kickjs://shader/error/<br></li>
         *  </ul>
         * @method getShader
         * @param {String} url
         * @return {KICK.material.Shader} Shader or null if not found
         */
        this.getShader = function(url,errorLog){
            var vertexShaderSrc,
                fragmentShaderSrc,
                glslConstants = KICK.material.GLSLConstants;
            if (url.indexOf("kickjs://shader/phong/")==0){
                vertexShaderSrc = glslConstants["phong_vs.glsl"];
                fragmentShaderSrc = glslConstants["phong_fs.glsl"];
            } else if (url.indexOf("kickjs://shader/error/")==0){
                vertexShaderSrc = glslConstants["error_vs.glsl"];
                fragmentShaderSrc = glslConstants["error_fs.glsl"];
            } else if (url.indexOf("kickjs://shader/unlit/")==0){
                vertexShaderSrc = glslConstants["unlit_vs.glsl"];
                fragmentShaderSrc = glslConstants["unlit_fs.glsl"];
            } else {
                return null;
            }
            var shader = new KICK.material.Shader(engine);
            shader.vertexShaderSrc = vertexShaderSrc;
            shader.fragmentShaderSrc = fragmentShaderSrc;
            shader.errorLog = errorLog;
            shader.updateShader();
            return shader;
        };

        /**
         * Create a default texture based on a URL.<br>
         * The following default textures exists:
         *  <ul>
         *  <li><b>Black</b> Url: kickjs://texture/black/</li>
         *  <li><b>White</b> Url: kickjs://texture/white/<br></li>
         *  <li><b>Gray</b>  Url: kickjs://texture/gray/<br></li>
         *  </ul>
         * @method getTexture
         * @param {String} url
         * @return {KICK.texture.Texture} Texture object - or null if no texture is found for the specified url
         */
        this.getTexture = function(url){
            var data;
            if (url.indexOf("kickjs://texture/black/")==0){
                data = new Uint8Array([0, 0, 0,
                                         0,   0,   0,
                                         0,   0,   0,
                                         0,   0,   0]);
            } else if (url.indexOf("kickjs://texture/white/")==0){
                data = new Uint8Array([255, 255, 255,
                                         255,   255,   255,
                                         255,   255,   255,
                                         255,   255,   255]);
            } else if (url.indexOf("kickjs://texture/gray/")==0){
                data = new Uint8Array([127, 127, 127,
                                         127,   127,   127,
                                         127,   127,   127,
                                         127,   127,   127]);
            } else {
                return null;
            }
            var texture = new KICK.texture.Texture(engine,{
                minFilter: constants.GL_NEAREST,
                magFilter: constants.GL_NEAREST,
                generateMipmaps: false,
                internalFormat: constants.GL_RGB
            });

            texture.setImageData( 2, 2, 0, constants.GL_UNSIGNED_BYTE,data, url);
            return texture;
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
