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
/**
 * description _
 * @module KICK
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
        constants = core.Constants,
        scene = KICK.namespace("KICK.scene"),
        ASSERT = constants._ASSERT,
        debug = constants._DEBUG,
        fail = core.Util.fail,
        getUrlAsResourceName = function(url){
            var name = url.split('/');
            if (name.length>2){
                name = name[name.length-2];
                name = name.substring(0,1).toUpperCase()+name.substring(1);
            } else {
                name = url;
            }
            return name;
        };
    
    /**
     * Responsible for allocation and deallocation of resources.
     * @class ResourceManager
     * @namespace KICK.core
     * @constructor
     */
    core.ResourceManager = function (engine) {
        var resourceProviders =
            [
                new core.URLResourceProvider(engine),
                new core.BuiltInResourceProvider(engine)
            ],
            /**
             * Create a callback function
             * @method buildCallbackFunc
             * @private
             */
            buildCallbackFunc = function(methodName){
                return function(url,destination){
                    for (var i=resourceProviders.length-1;i>=0;i--){
                        var resourceProvider = resourceProviders[i];
                        var protocol = resourceProvider.protocol;
                        if (url.indexOf(protocol)===0){
                            resourceProvider[methodName](url,destination);
                            return;
                        }
                    }
                };
            };
        /**
         * @method getMeshData
         * @param {String} uri
         * @param {KICK.mesh.Mesh} meshDestination
         */
        this.getMeshData = buildCallbackFunc("getMeshData");
        /**
         * @method getImageData
         * @param {String} uri
         * @param {KICK.texture.Texture} textureDestination
         */
        this.getImageData = buildCallbackFunc("getImageData");

        /**
         * @method getShaderData
         * @param {String} uri
         * @param {KICK.material.Shader} shaderDestination
         */
        this.getShaderData = buildCallbackFunc("getShaderData");

        /**
         * @method addResourceProvider
         * @param {KICK.resource.ResourceProvider} resourceProvider
         */
        this.addResourceProvider = function(resourceProvider){
            resourceProviders.push(resourceProvider);
        };

        /**
         * @method removeResourceProvider
         * @param {KICK.resource.ResourceProvider} resourceProvider
         */
        this.removeResourceProvider = function(resourceProvider){
            for (var i=resourceProvider.length-1;i>=0;i--){
                if (resourceProviders[i] === resourceProvider){
                    resourceProviders.splice(i,1);
                }
            }
        };
    };

    /**
     * Responsible for creating or loading a resource using a given url
     * @class ResourceProvider
     * @namespace KICK.core
     * @constructor
     * @param {String} protocol
     */
    /**
     * Protocol of the resource, such as http://, kickjs://<br>
     * The protocol must uniquely identify a resource provider
     * @property protocol
     * @type String
     */

    /**
     * @method getMeshData
     * @param {String} uri
     * @param {KICK.mesh.Mesh} meshDestination
     */
    /**
     * @method getImageData
     * @param {String} uri
     * @param {KICK.texture.Texture} textureDestination
     */
    /**
     * @method getShaderData
     * @param {String} uri
     * @param {KICK.material.Shader} shaderDestination
     */
    /**
     * @method getMesh
     * @param {String} url
     * @return {KICK.mesh.Mesh}
     * @deprecated
     */
    /**
     * @method getShader
     * @param {String} url
     * @return {KICK.material.Shader}
     * @deprecated
     */
    /**
     * @method getTexture
     * @param {String} url
     * @return {KICK.texture.Texture}
     * @deprecated
     */


    /**
     * Fall back handler of resources
     * @class URLResourceProvider
     * @namespace KICK.core
     * @constructor
     * @extends KICK.core.ResourceProvider
     * @param {KICK.core.Engine} engine
     * @private
     */
    core.URLResourceProvider = function(engine){
        var gl = engine.gl,
            thisObj = this;
        Object.defineProperties(this,{
            /**
             * Returns empty string (match all)
             * @property protocol
             * @type String
             */
            protocol:{
                value:""
            }
        });

        this.getMeshData = function(url,meshDestination){
            var oReq = new XMLHttpRequest();

            function handler()
            {
                if (oReq.readyState == 4 /* complete */) {
                    if (oReq.status == 200 /* ok */) {
                        var arrayBuffer = oReq.response;
                        var meshData = new KICK.mesh.MeshData();
                        if (meshData.deserialize(arrayBuffer)){
                            meshDestination.meshData = meshData;
                        } else {
                            fail("Cannot deserialize meshdata "+url);
                        }
                    } else {
                        fail("Cannot load meshdata "+url+". Server responded "+oReq.status);
                    }
                }
            }

            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";
            oReq.onreadystatechange = handler;
            oReq.send();
        };

        this.getImageData = function(uri,textureDestination){
            var img = new Image();
            img.onload = function(){
                try{
                    textureDestination.setImage(img,uri);
                } catch (e){
                    fail("Exception when loading image "+uri);
                }
            };
            img.onerror = function(e){
                fail(e);
                fail("Exception when loading image "+uri);
            };
            img.crossOrigin = "anonymous"; // Ask for a CORS image
            img.src = uri;
        };
    };

    /**
     * Responsible for providing the built-in resources (such as textures, shaders and mesh data).
     * All build-in resources have the prefix kickjs
     * @class BuiltInResourceProvider
     * @namespace KICK.core
     * @constructor
     * @extends KICK.core.ResourceProvider
     * @param {KICK.core.Engine} engine
     * @private
     */
    core.BuiltInResourceProvider = function(engine){
        var gl = engine.gl,
            thisObj = this;
        Object.defineProperties(this,{
            /**
             * Returns kickjs
             * @property protocol
             * @type String
             */
            protocol:{
                value:"kickjs://"
            }
        });

        /**
         * <ul>
         * <li><b>Triangle</b> Url: kickjs://mesh/triangle/</li>
         * <li><b>Plane</b> Url: kickjs://mesh/plane/<br></li>
         * <li><b>UVSphere</b> Url: kickjs://mesh/uvsphere/?slides=20&stacks=10&radius=1.0<br>Note that the parameters is optional</li>
         * <li><b>Cube</b> Url: kickjs://mesh/cube/?length=1.0<br>Note that the parameters is optional</li>
         * </ul>
         * @param {String} url
         * @param {KICK.mesh.Mesh} meshDestination
         */
        this.getMeshData = function(url,meshDestination){
            var meshDataObj,
                getParameterInt = core.Util.getParameterInt,
                getParameterFloat = core.Util.getParameterFloat;
            if (url.indexOf("kickjs://mesh/triangle/")==0){
                meshDataObj = mesh.MeshFactory.createTriangleData();
            } else if (url.indexOf("kickjs://mesh/plane/")==0){
                meshDataObj = mesh.MeshFactory.createPlaneData();
            } else if (url.indexOf("kickjs://mesh/uvsphere/")==0){
                var slices = getParameterInt(url, "slices"),
                    stacks = getParameterInt(url, "stacks"),
                    radius = getParameterFloat(url, "radius");
                meshDataObj = mesh.MeshFactory.createUVSphereData(slices, stacks, radius);
            } else if (url.indexOf("kickjs://mesh/cube/")==0){
                var length = getParameterFloat(url, "length");
                meshDataObj = mesh.MeshFactory.createCubeData(length);
            } else {
                KICK.core.Util.fail("No meshdata found for "+url);
                return;
            }

            meshDestination.meshData = meshDataObj;
        };

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
         * @deprecated
         */
        this.getMesh = function(url){
            console.log("getMesh is deprecated. Use getMeshData instead");
            var meshDataObj,
                getParameterInt = core.Util.getParameterInt,
                getParameterFloat = core.Util.getParameterFloat,
                config = {
                    name: getUrlAsResourceName(url)
                };
            if (url.indexOf("kickjs://mesh/triangle/")==0){
                meshDataObj = mesh.MeshFactory.createTriangleData();
            } else if (url.indexOf("kickjs://mesh/plane/")==0){
                meshDataObj = mesh.MeshFactory.createPlaneData();
            } else if (url.indexOf("kickjs://mesh/uvsphere/")==0){
                var slices = getParameterInt(url, "slices"),
                    stacks = getParameterInt(url, "stacks"),
                    radius = getParameterFloat(url, "radius");
                meshDataObj = mesh.MeshFactory.createUVSphereData(slices, stacks, radius);
            } else if (url.indexOf("kickjs://mesh/cube/")==0){
                var length = getParameterFloat(url, "length");
                meshDataObj = mesh.MeshFactory.createCubeData(length);
            } else {
                return null;
            }


            if (meshDataObj){
                config.meshData = meshDataObj;
                config.dataURI = url;
                return new mesh.Mesh(engine,config);
            }
        };

        /**
         * Create a default shader config based on a URL<br>
         * The following shaders are available:
         *  <ul>
         *  <li><b>Default</b> Url: kickjs://shader/default/</li>
         *  <li><b>Phong</b> Url: kickjs://shader/phong/</li>
         *  <li><b>Unlit</b> Url: kickjs://shader/unlit/</li>
         *  <li><b>Transparent Phong</b> Url: kickjs://shader/transparent_phong/</li>
         *  <li><b>Transparent Unlit</b> Url: kickjs://shader/transparent_unlit/</li>
         *  <li><b>Shadowmap</b> Url: kickjs://shader/__shadowmap/</li>
         *  <li><b>Pick</b> Url: kickjs://shader/__pick/</li>
         *  <li><b>Error</b> Url: kickjs://shader/__error/<br></li>
         *  </ul>
         * @method getShaderData
         * @param {String} url
         * @param {KICK.material.Shader} shaderDestination
         */
        this.getShaderData = function(url,shaderDestination){
            var vertexShaderSrc,
                fragmentShaderSrc,
                blend = false,
                polygonOffsetEnabled = false,
                depthMask = true,
                renderOrder = 1000,
                glslConstants = KICK.material.GLSLConstants,
                compareAndSetShader = function(shaderName){
                    var res = url.indexOf("kickjs://shader/"+shaderName+"/")===0;
                    if (res){
                        vertexShaderSrc = glslConstants[shaderName+"_vs.glsl"];
                        fragmentShaderSrc = glslConstants[shaderName+"_fs.glsl"];
                        if (shaderName.indexOf("transparent_")===0){
                            blend = true;
                            depthMask = false;
                            renderOrder = 2000;
                        }
                        if (shaderName==="__shadowmap"){
                            polygonOffsetEnabled = true;
                        }
                    }
                    return res;
                },
                shaderTypes = ["phong","__shadowmap","__error","__pick","transparent_phong","unlit","transparent_unlit"];
            if (url === "kickjs://shader/default/"){
                url = "kickjs://shader/phong/";
            }
            for (var i=0;i<shaderTypes.length;i++){
                if (compareAndSetShader(shaderTypes[i])){
                    break;
                }
            }
            if (ASSERT){
                if (!vertexShaderSrc){
                    KICK.core.Util.fail("Cannot find shader url '"+url+"'");
                }
            }
            var config = {
                blend:blend,
                depthMask:depthMask,
                renderOrder:renderOrder,
                polygonOffsetEnabled:polygonOffsetEnabled,
                vertexShaderSrc: vertexShaderSrc,
                fragmentShaderSrc: fragmentShaderSrc
            };

            KICK.core.Util.applyConfig(shaderDestination,config);
            shaderDestination.apply();
        };

        /**
         * Create a default shader based on a URL<br>
         * The following shaders are available:
         *  <ul>
         *  <li><b>Default</b> Url: kickjs://shader/default/</li>
         *  <li><b>Phong</b> Url: kickjs://shader/phong/</li>
         *  <li><b>Unlit</b> Url: kickjs://shader/unlit/</li>
         *  <li><b>Transparent Phong</b> Url: kickjs://shader/transparent_phong/</li>
         *  <li><b>Transparent Unlit</b> Url: kickjs://shader/transparent_unlit/</li>
         *  <li><b>Shadowmap</b> Url: kickjs://shader/__shadowmap/</li>
         *  <li><b>Pick</b> Url: kickjs://shader/__pick/</li>
         *  <li><b>Error</b> Url: kickjs://shader/__error/<br></li>
         *  </ul>
         * @method getShader
         * @param {String} url
         * @return {KICK.material.Shader} Shader or null if not found
         * @deprecated
         */
        this.getShader = function(url,errorLog){
            console.log("getShader is deprecated");
            var shader = new KICK.material.Shader(engine);
            this.getShaderData(url,shader);
            shader.name = getUrlAsResourceName(url);
            shader.dataURI = url;
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
         * @param uri
         * @param textureDestination
         */
        this.getImageData = function(uri,textureDestination){
            var data;

            if (uri.indexOf("kickjs://texture/black/") == 0){
                data = new Uint8Array([0, 0, 0, 255,
                                         0,   0,   0,255,
                                         0,   0,   0,255,
                                         0,   0,   0,255]);
            } else if (uri.indexOf("kickjs://texture/white/") == 0){
                data = new Uint8Array([255, 255, 255,255,
                                         255,   255,   255,255,
                                         255,   255,   255,255,
                                         255,   255,   255,255]);
            } else if (uri.indexOf("kickjs://texture/gray/") == 0){
                data = new Uint8Array([127, 127, 127,255,
                                         127,   127,   127,255,
                                         127,   127,   127,255,
                                         127,   127,   127,255]);
            } else {
                KICK.core.Util.fail("Unknown uri "+uri);
                return null;
            }
            textureDestination.setImageData( 2, 2, 0, constants.GL_UNSIGNED_BYTE,data, uri);
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
         * @deprecated
         */
        this.getTexture = function(url){
            console.log("getTexture is deprecated!");
            var name = getUrlAsResourceName(url);
            var texture = new KICK.texture.Texture(engine,{
                name:name,
                minFilter: constants.GL_NEAREST,
                magFilter: constants.GL_NEAREST,
                generateMipmaps: false,
                internalFormat: constants.GL_RGBA
            });
            thisObj.getImageData(url,texture);

            return texture;
        };
    };
})();