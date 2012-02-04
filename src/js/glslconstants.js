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
* @property __error_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property __error_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property __pick_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property __pick_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property __shadowmap_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property __shadowmap_vs.glsl
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
* @property shadowmap.glsl
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
{"__error_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvoid main(void)\n{\ngl_FragColor = vec4(1.0,0.5, 0.9, 1.0);\n}","__error_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\n} ","__pick_fs.glsl":"#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec4 gameObjectUID;\nvoid main(void)\n{\ngl_FragColor = gameObjectUID;\n}","__pick_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nuniform vec4 _gameObjectUID;\nvarying vec4 gameObjectUID;\nvoid main(void) {\n// compute position\ngl_Position = _mvProj * vec4(vertex, 1.0);\ngameObjectUID = _gameObjectUID;\n}","__shadowmap_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvec4 packDepth( const in float depth ) {\nconst vec4 bitShift = vec4( 16777216.0, 65536.0, 256.0, 1.0 );\nconst vec4 bitMask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bitShift );\nres -= res.xxyz * bitMask;\nreturn res;\n}\nvoid main() {\ngl_FragColor = packDepth( gl_FragCoord.z );\n}\n","__shadowmap_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\n} ","light.glsl":"\n// assumes that normal is normalized\nvoid getDirectionalLight(vec3 normal, mat3 dLight, float specularExponent, out vec3 diffuse, out float specular){\nvec3 ECLigDir = dLight[0];\nvec3 colInt = dLight[1];\nvec3 halfV = dLight[2];\nfloat diffuseContribution = max(dot(normal, ECLigDir), 0.0);\n\tfloat specularContribution = max(dot(normal, halfV), 0.0);\nspecular = pow(specularContribution, specularExponent);\n\tdiffuse = (colInt * diffuseContribution);\n}\nuniform mat3 _dLight;\nuniform vec3 _ambient;\n","phong_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nvarying vec3 vNormal;\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec3 specularColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\n#pragma include \"shadowmap.glsl\"\nvoid main(void)\n{\nvec3 diffuse;\nfloat specular;\ngetDirectionalLight(vNormal, _dLight, specularExponent, diffuse, specular);\nfloat visibility;\nif (SHADOWS){\ncomputeLightVisibility();\n} else {\nvisibility = 1.0;\n}\nvec3 color = max(diffuse*visibility,_ambient.xyz)*mainColor.xyz;\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*color.xyz, 1.0)+vec4(specular*specularColor,0.0);\n}\n","phong_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat4 _lightMat;\nuniform mat3 _norm;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec4 vShadowMapCoord;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\ngl_Position = _mvProj * v;\nvUv = uv1;\nvNormal= normalize(_norm * normal);\nvShadowMapCoord = _lightMat * v;\n} ","shadowmap.glsl":"varying vec4 vShadowMapCoord;\nuniform sampler2D _shadowMapTexture;\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 16777216.0 ), 1.0 / ( 65536.0 ), 1.0 / 256.0, 1.0 );\nreturn dot( rgba_depth, bit_shift );\n}\nfloat computeLightVisibility(){\nvec3 shadowCoord = vShadowMapCoord.xyz / vShadowMapCoord.w;\nvec4 packedShadowDepth = texture2D(_shadowMapTexture,shadowCoord.xy);\nfloat shadowDepth = unpackDepth(packedShadowDepth);\nif (shadowDepth < shadowCoord.z){\nreturn 1.0;\n}\nreturn 0.0;\n}","transparent_phong_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nvarying vec3 vNormal;\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec3 specularColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\nvoid main(void)\n{\nvec3 diffuse;\nfloat specular;\ngetDirectionalLight(vNormal, _dLight, specularExponent, diffuse, specular);\nvec4 color = vec4(max(diffuse,_ambient.xyz),1.0)*mainColor;\ngl_FragColor = texture2D(mainTexture,vUv)*color+vec4(specular*specularColor,0.0);\n}\n","transparent_phong_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvoid main(void) {\n// compute position\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\n// compute light info\nvNormal= normalize(_norm * normal);\n} ","transparent_unlit_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nvoid main(void)\n{\ngl_FragColor = texture2D(mainTexture,vUv)*mainColor;\n}\n","transparent_unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nvarying vec2 vUv;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\n}","unlit_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nvoid main(void)\n{\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*mainColor.xyz,1.0);\n}\n","unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nvarying vec2 vUv;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\n}"};
})();