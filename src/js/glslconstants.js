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
* @property default_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property default_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property light.glsl
* @type String
*/
{"default_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvoid main(void)\n{\n    gl_FragColor = vec4(1.0,0.5, 0.9, 1.0);\n}","default_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\n  gl_Position = _mvProj * vec4(vertex, 1.0);\n}  ","light.glsl":"struct DirectionalLight {\n   vec3 lDir;\n   vec3 colInt;\n   vec3 halfV;\n};\n// assumes that normal is normalized\nvoid getDirectionalLight(vec3 normal, DirectionalLight dLight, float specularExponent, out vec3 diffuse, out float specular){\n    float diffuseContribution = max(dot(normal, dLight.lDir), 0.0);\n\tfloat specularContribution = max(dot(normal, dLight.halfV), 0.0);\n    specular =  pow(specularContribution, specularExponent);\n\tdiffuse = (dLight.colInt * diffuseContribution);\n}\nuniform DirectionalLight _dLight;\nuniform vec3 _ambient;"};
})();