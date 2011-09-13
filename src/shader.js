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
    var material = KICK.namespace("KICK.material"),
        math = KICK.namespace("KICK.math");

    /**
     * Renders a Mesh
     * @class Shader
     * @namespace KICK.scene
     * @constructor
     * @param {KICK.core.Engine} engine
     */
    material.Shader = function (engine) {
        var gl = engine.gl,
            shaderProgramId = -1,
            thisObj = this;

        /**
         * Get the gl context of the shader
         * @property gl
         * @type Object
         */
        Object.defineProperty(this, "gl",{
            value:gl
        });

        /**
         * @property shaderProgramId
         * @type ShaderProgram
         */
        this.shaderProgramId = -1;

        /**
         * Must be set to KICK.material.Shader.FRONT, KICK.material.Shader.BACK (default), KICK.material.Shader.NONE
         * @property faceCulling
         * @type Object
         */
        this.faceCulling = material.Shader.BACK;

        /**
         * The depth test function. Must be one of
         * KICK.material.Shader.Z_TEST_NEVER
         * KICK.material.Shader.Z_TEST_LESS (default)
         * KICK.material.Shader.Z_TEST_EQUAL
         * KICK.material.Shader.Z_TEST_LEQUAL
         * KICK.material.Shader.Z_TEST_GREATER
         * KICK.material.Shader.Z_TEST_NOTEQUAL
         * KICK.material.Shader.Z_TEST_GEQUAL
         * KICK.material.Shader.Z_TEST_ALWAYS
         * @property zTest
         * @type Object
         */
        this.zTest =  material.Shader.Z_TEST_LESS;

        /**
         * @method compileShader
         * @param {String} str
         * @param {Boolean} isFragmentShader
         * @param {Function} errorLog
         * @private
         */
        var compileShader = function (str, isFragmentShader, errorLog) {
            var shader;
            if (isFragmentShader) {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else {
                shader = gl.createShader(gl.VERTEX_SHADER);
            }

            gl.shaderSource(shader, str);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                var infoLog =gl.getShaderInfoLog(shader);
                if (errorLog) {
                    errorLog(infoLog);
                }
                return null;
            }

            return shader;
        };

        /**
         * @method initShader
         * @param {String} vertexShaderSrc
         * @param {String} fragmentShaderSrc
         * @param {Function} errorLog Optional function that will be invoked in case of error
         */
        this.initShader = function (vertexShaderSrc,fragmentShaderSrc, errorLog) {
            var fragmentShader = compileShader(fragmentShaderSrc, true, errorLog),
                vertexShader = compileShader(vertexShaderSrc, false, errorLog),
                i;

            shaderProgramId = gl.createProgram();

            if (!errorLog) {
                errorLog = console.log;
            }

            this.shaderProgramId = shaderProgramId;

            gl.attachShader(shaderProgramId, vertexShader);
            gl.attachShader(shaderProgramId, fragmentShader);
            gl.linkProgram(shaderProgramId);

            if (!gl.getProgramParameter(shaderProgramId, gl.LINK_STATUS)) {
                errorLog("Could not initialise shaders");
                return;
            }

            gl.useProgram(shaderProgramId);
            var activeUniforms = gl.getProgramParameter( shaderProgramId, gl.ACTIVE_UNIFORMS);
            /**
             * Array of Object with size,type, name and index properties
             * @property activeUniforms
             * @type Object
             */
            this.activeUniforms = new Array(activeUniforms);
            /**
             * Lookup of uniform based on name.
             * @property uniformMap
             * @type Object
             */
            this.lookupUniform = {};
            for (i=0;i<activeUniforms;i++) {
                var uniform = gl.getActiveUniform(shaderProgramId,i);
                this.activeUniforms[i] = {
                    size: uniform.size,
                    type: uniform.type,
                    name: uniform.name,
                    location: gl.getUniformLocation(shaderProgramId,uniform.name)
                };
                this.lookupUniform[uniform.name] = this.activeUniforms[i];
            }

            var activeAttributes = gl.getProgramParameter( shaderProgramId, gl.ACTIVE_ATTRIBUTES);
            /**
             * Array of JSON data with size,type and name
             * @property activeAttributes
             * @type Array
             */
            this.activeAttributes = new Array(activeAttributes);
            /**
             * Lookup of attribute location based on name.
             * @property lookupAttribute
             * @type Object
             */
            this.lookupAttribute = {};
            for (i=0;i<activeAttributes;i++) {
                var attribute = gl.getActiveAttrib(shaderProgramId,i);
                this.activeAttributes[i] = {
                    size: attribute.size,
                    type: attribute.type,
                    name: attribute.name
                };
                this.lookupAttribute[attribute.name] = i;
            }
            this.activeAttributesMaxLength = gl.getProgramParameter( shaderProgramId, gl.ACTIVE_ATTRIBUTE_MAX_LENGTH);
            this.activeUniformsMaxLength = gl.getProgramParameter( shaderProgramId, gl.ACTIVE_UNIFORM_MAX_LENGTH);
        };

        var updateCullFace = function () {
            var s = material.Shader;
            var shaderFaceCulling = thisObj.faceCulling;
            var currentFaceCulling = gl.faceCulling;
            if (currentFaceCulling !== shaderFaceCulling) {
                if (shaderFaceCulling === s.NONE) {
                    gl.disable( gl.CULL_FACE );
                } else {
                    if (!currentFaceCulling || currentFaceCulling === s.NONE) {
                        gl.enable( gl.CULL_FACE );
                    }
                    if (shaderFaceCulling === s.FRONT) {
                        gl.cullFace( gl.FRONT );
                    } else {
                        gl.cullFace( gl.BACK );
                    }
                }
                gl.faceCulling = shaderFaceCulling;
            }
        };

        var updateDepthBuffer = function () {
            var s = material.Shader;
            var zTest = thisObj.zTest;
            if (gl.zTest != zTest) {
                if (zTest === s.Z_TEST_NEVER) {
                    gl.depthFunc(gl.NEVER);
                } else if (zTest === s.Z_TEST_EQUAL) {
                    gl.depthFunc(gl.EQUAL);
                } else if (zTest === s.Z_TEST_LEQUAL) {
                    gl.depthFunc(gl.LEQUAL);
                } else if (zTest === s.Z_TEST_GREATER) {
                    gl.depthFunc(gl.GREATER);
                } else if (zTest === s.Z_TEST_NOTEQUAL) {
                    gl.depthFunc(gl.NOTEQUAL);
                } else if (zTest === s.Z_TEST_GEQUAL) {
                    gl.depthFunc(gl.GEQUAL);
                } else if (zTest === s.Z_TEST_ALWAYS) {
                    gl.depthFunc(gl.ALWAYS);
                } else {
                    gl.depthFunc(gl.LESS);
                }
                gl.zTest = zTest;
            }
        };

        var updateBlending = function () {
            if (!window.updateBlending){
                console.log("Implement update blending");
                window.updateBlending = true;
            }
        };

        // todo: refactor this
        this.bind = function () {
            gl.useProgram(shaderProgramId);
            updateCullFace();
            updateDepthBuffer();
            updateBlending();
        }
    };

    material.Shader.NONE = 0;
    material.Shader.BACK = 1;
    material.Shader.FRONT = 2;

    material.Shader.Z_TEST_NEVER = 0;
    material.Shader.Z_TEST_LESS = 1;
    material.Shader.Z_TEST_EQUAL = 2;
    material.Shader.Z_TEST_LEQUAL = 3;
    material.Shader.Z_TEST_GREATER = 4;
    material.Shader.Z_TEST_NOTEQUAL = 5;
    material.Shader.Z_TEST_GEQUAL = 6;
    material.Shader.Z_TEST_ALWAYS = 7;

    /**
     * Material configuration
     * @class Material
     * @namespace KICK.scene
     * @constructor
     */
    material.Material = function (config) {
        if (!config) {
            config = {};
        }
        /**
         * @property name
         * @type String
         */
        this.name = config.name?config.name:"Material";
        /**
         * @property shader
         * @type KICK.material.Shader
         */
        this.shader = config.shader?config.shader:undefined;

        /**
         * Object with of uniforms.
         * The object has a number of named properties one for each uniform. The uniform object contains value and type.
         * The value is always an array
         * @property uniforms
         * @type Object
         */
        this.uniforms = config.uniforms?config.uniforms:{};

        this.verifyUniforms();
    };

    /**
     * The method replaces any invalid uniform (Array) with a wrapped one (Float32Array or Int32Array)
     * @method verifyUniforms
     */
    material.Material.prototype.verifyUniforms = function(){
        var uniform,
            uniforms = this.uniforms,
            type,
            gl = KICK.core.Constants;
        for (uniform in uniforms){
            if (typeof uniforms[uniform].value === "object"){
                type = uniforms[uniform].type;
                if (type === gl.INT || type===gl.INT_VEC2 || type===gl.INT_VEC3 || type===gl.INT_VEC4){
                    uniforms[uniform].value = new Int32Array(uniforms[uniform].value);
                } else {
                    uniforms[uniform].value = new Float32Array(uniforms[uniform].value);
                }
            }
        }
    };

    /**
     * Binds the uniforms to the current shader.
     * The uniforms is expected to be in a valid format
     * @method bindMatrices
     * @param {Object}
     */
    material.Shader.prototype.bindMatrices = function(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,transform){
        var mv = this.lookupUniform["mv"],
            proj = this.lookupUniform["proj"],
            mvProj = this.lookupUniform["mvProj"],
            gl = this.gl,
            globalTransform;
        if (proj){
            gl.uniformMatrix4fv(proj.location,false,projectionMatrix);
        }
        if (mv){
            globalTransform = transform.getGlobalMatrix();
            gl.uniformMatrix4fv(mv.location,false,math.mat4.multiply(modelViewMatrix,globalTransform,math.mat4.create()));
        }
        if (mvProj){
            globalTransform = globalTransform || transform.getGlobalMatrix();
            gl.uniformMatrix4fv(mvProj.location,false,math.mat4.multiply(modelViewProjectionMatrix,globalTransform,math.mat4.create()));
        }
    };

    /**
     * Binds the uniforms to the current shader.
     * The uniforms is expected to be in a valid format
     * @method bindUniform
     * @param {Object}
     */
    material.Shader.prototype.bindUniform = function(uniforms){
        var shader = this,
            gl = shader.gl,
            uniformName,
            shaderUniform,
            uniform,
            value,
            location;
        for (uniformName in uniforms){
            shaderUniform = shader.lookupUniform[uniformName];
            uniform = uniforms[uniformName];
            location = shaderUniform.location;
            value = uniform.value;
            switch (shaderUniform.type){
                case 5126: // FLOAT
                    gl.uniform1fv(location,value);
                break;
                case 35674: // FLOAT_MAT2
                    gl.uniformMatrix2fv(location,false,value);
                break;
                case 35675: // FLOAT_MAT3
                    gl.uniformMatrix3fv(location,false,value);
                break;
                case 35676: // FLOAT_MAT4
                    gl.uniformMatrix4fv(location,false,value);
                break;
                case 35664: // FLOAT_VEC2
                    gl.uniform2fv(location,value);
                break;
                case 35665: // FLOAT_VEC3
                    gl.uniform3fv(location,value);
                break;
                case 35666: // FLOAT_VEC4
                    gl.uniform4fv(location,value);
                break;
                case 5124: // INT
                    gl.uniform1fv(location,value);
                break;
                case 35667: // INT_VEC2
                    gl.uniform2fv(location,value);
                break;
                case 35668: // INT_VEC3
                    gl.uniform3fv(location,value);
                break;
                case 35669: // INT_VEC4
                    gl.uniform4fv(location,value);
                break;
                default:
                    console.log("Warn cannot find type "+shaderUniform.type);
                break;
            }
        }
    };
})();