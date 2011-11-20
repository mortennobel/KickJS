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
    var material = KICK.namespace("KICK.material");

    /**
     * Contains glsl source code constants<br>
     * The content of this class is generated from the content of the file folder src/glsl
     * @class GLSLConstants
     * @namespace KICK.material
     * @static
     */
    material.GLSLConstants =
    // created by include_glsl_files.js - do not edit content
/**
* GLSL file content
* @property error_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property error_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property light.glsl
* @type String
*/
/**
* GLSL file content
* @property phong_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property phong_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_phong_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_phong_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_unlit_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_unlit_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_vs.glsl
* @type String
*/
{"error_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvoid main(void)\n{\n    gl_FragColor = vec4(1.0,0.5, 0.9, 1.0);\n}","error_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\n  gl_Position = _mvProj * vec4(vertex, 1.0);\n}  ","light.glsl":"struct DirectionalLight {\n   vec3 lDir;\n   vec3 colInt;\n   vec3 halfV;\n};\n// assumes that normal is normalized\nvoid getDirectionalLight(vec3 normal, DirectionalLight dLight, float specularExponent, out vec3 diffuse, out float specular){\n    float diffuseContribution = max(dot(normal, dLight.lDir), 0.0);\n\tfloat specularContribution = max(dot(normal, dLight.halfV), 0.0);\n    specular =  pow(specularContribution, specularExponent);\n\tdiffuse = (dLight.colInt * diffuseContribution);\n}\nuniform DirectionalLight _dLight;\nuniform vec3 _ambient;","phong_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nuniform vec3 mainColor;\nuniform float specularExponent;\nuniform vec3 specularColor;\nuniform sampler2D mainTexture;\n\n#pragma include \"light.glsl\"\n\nvoid main(void)\n{\n    vec3 diffuse;\n    float specular;\n    getDirectionalLight(vNormal, _dLight, specularExponent, diffuse, specular);\n    vec3 color = max(diffuse,_ambient.xyz)*mainColor;\n    \n    gl_FragColor = texture2D(mainTexture,vUv)*vec4(color, 1.0)+vec4(specular*specularColor,0.0);\n}\n ","phong_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\n\nvarying vec2 vUv;\n\nvoid main(void) {\n    gl_Position = _mvProj * vec4(vertex, 1.0);\n    vUv = uv1;\n    vNormal= normalize(_norm * normal);\n} ","transparent_phong_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec3 specularColor;\nuniform sampler2D mainTexture;\n\n#pragma include \"light.glsl\"\n\nvoid main(void)\n{\n    vec3 diffuse;\n    float specular;\n    getDirectionalLight(vNormal, _dLight, specularExponent, diffuse, specular);\n    vec4 color = vec4(max(diffuse,_ambient.xyz),1.0)*mainColor;\n\n    gl_FragColor = texture2D(mainTexture,vUv)*color+vec4(specular*specularColor,0.0);\n}\n ","transparent_phong_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\n\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nvoid main(void) {\n // compute position\n gl_Position = _mvProj * vec4(vertex, 1.0);\n\n vUv = uv1;\n // compute light info\n vNormal= normalize(_norm * normal);\n} ","transparent_unlit_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\n\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(mainTexture,vUv)*mainColor;\n}\n","transparent_unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\n\nvarying vec2 vUv;\n\nvoid main(void) {\n    gl_Position = _mvProj * vec4(vertex, 1.0);\n    vUv = uv1;\n}","unlit_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\n\nuniform vec3 mainColor;\nuniform sampler2D mainTexture;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(mainTexture,vUv)*vec4(mainColor,1.0);\n}\n ","unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\n\nvarying vec2 vUv;\n\nvoid main(void) {\n    gl_Position = _mvProj * vec4(vertex, 1.0);\n    vUv = uv1;\n}"};
})();