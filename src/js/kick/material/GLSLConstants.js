define([], function () {
    "use strict";

    /**
     * Contains glsl source code constants<br>
     * The content of this class is generated from the content of the file folder src/glsl
     * @class GLSLConstants
     * @namespace kick.material
     * @static
     */
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
* @property __pick_normal_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property __pick_normal_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property __pick_uv_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property __pick_uv_vs.glsl
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
* @property bumped_specular_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property bumped_specular_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property diffuse_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property diffuse_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property light.glsl
* @type String
*/
/**
* GLSL file content
* @property shadowmap.glsl
* @type String
*/
/**
* GLSL file content
* @property specular_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property specular_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_diffuse_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_diffuse_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_point_sprite_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_point_sprite_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_specular_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_specular_vs.glsl
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
* @property unlit_vertex_color_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_vertex_color_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_vs.glsl
* @type String
*/
return {"__error_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvoid main(void)\n{\ngl_FragColor = vec4(1.0,0.5, 0.9, 1.0);\n}","__error_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\n} ","__pick_fs.glsl":"#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec4 gameObjectUID;\nvoid main(void)\n{\ngl_FragColor = gameObjectUID;\n}","__pick_normal_fs.glsl":"#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec3 vNormal;\nvoid main(void)\n{\ngl_FragColor = vec4(vNormal,0);\n}","__pick_normal_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nvarying vec3 vNormal;\nvoid main(void) {\n// compute position\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvNormal = (_norm * normal) / 2.0 + vec3(0.5, 0.5, 0.5);\n}","__pick_uv_fs.glsl":"#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec2 vUV;\nvoid main(void)\n{\ngl_FragColor = vec4(vUV, 0, 0);\n}","__pick_uv_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nvarying vec2 vUV;\nvoid main(void) {\n// compute position\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUV = uv1;\n}","__pick_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nuniform vec4 _gameObjectUID;\nvarying vec4 gameObjectUID;\nvoid main(void) {\n// compute position\ngl_Position = _mvProj * vec4(vertex, 1.0);\ngameObjectUID = _gameObjectUID;\n}","__shadowmap_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\n#pragma include \"shadowmap.glsl\"\nvoid main() {\ngl_FragColor = packDepth( gl_FragCoord.z );\n}\n","__shadowmap_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\n} ","bumped_specular_fs.glsl":"precision mediump float;\nvarying vec2 v_uv;\nvarying vec3 viewVec;\nvarying vec3 lightVec;\nvarying vec3 pointLight[LIGHTS];\n#pragma include \"light.glsl\"\n#pragma include \"shadowmap.glsl\"\nuniform float specularExponent;\nuniform vec4 specularColor;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nuniform sampler2D normalMap;\nvoid getDirectionalLight(vec3 normal, vec3 ecLightDir, vec3 reflection, vec3 colorIntensity, float specularExponent, out vec3 diffuse, out float specular){\nfloat diffuseContribution = max(dot(normal, ecLightDir), 0.0);\nif ( diffuseContribution > 0.0){\nfloat specularContribution = max(dot(normal, reflection), 0.0);\nspecular = pow(specularContribution, specularExponent);\n} else {\nspecular = 0.0;\n}\ndiffuse = (colorIntensity * diffuseContribution);\n}\nvoid getPointLight(vec3 normal, vec3 ecPosition, vec3 ecLightPos2[LIGHTS], mat3 pLights[LIGHTS],float specularExponent, out vec3 diffuse, out float specular){\ndiffuse = vec3(0.0, 0.0, 0.0);\nspecular = 0.0;\nvec3 eye = vec3(0.0,0.0,1.0);\nfor (int i=0;i<LIGHTS;i++){\nvec3 ecLightPos = ecLightPos2[i];\nvec3 colorIntensity = pLights[i][1];\nvec3 attenuationVector = pLights[i][2];\n// direction from surface to light position\nvec3 VP = ecLightPos - ecPosition;\n// compute distance between surface and light position\nfloat d = length(VP);\n// normalize the vector from surface to light position\nVP = normalize(VP);\n// compute attenuation\nfloat attenuation = 1.0 / dot(vec3(1.0,d,d*d),attenuationVector); // short for constA + liniearA * d + quadraticA * d^2\nvec3 halfVector = normalize(VP + eye);\nfloat nDotVP = max(0.0, dot(normal, VP));\nfloat nDotHV = max(0.0, dot(normal, halfVector));\nfloat pf;\nif (nDotVP <= 0.0){\npf = 0.0;\n} else {\npf = pow(nDotHV, specularExponent);\n}\nbool isLightEnabled = (attenuationVector[0]+attenuationVector[1]+attenuationVector[2])>0.0;\nif (isLightEnabled){\ndiffuse += colorIntensity * nDotVP * attenuation;\nspecular += pf * attenuation;\n}\n}\n}\nvoid main()\n{\nvec4 base = texture2D(mainTexture, v_uv);\nvec3 bump = normalize(texture2D(normalMap, v_uv).xyz * 2.0 - vec3(1.0,1.0,1.0));\nvec3 vVec = normalize(viewVec);\nvec3 reflection = reflect(-vVec, bump);\nvec3 lVec = normalize(lightVec);\nvec3 diffuse;\nfloat specular;\nvec3 colorIntensity = _dLight[1];\ngetDirectionalLight(lVec, bump ,reflection, colorIntensity, specularExponent, diffuse, specular);\nvec3 diffusePoint;\nfloat specularPoint;\ngetPointLight(bump,viewVec,pointLight, _pLights,specularExponent,diffusePoint,specularPoint);\nfloat visibility;\nif (SHADOWS){\nvisibility = computeLightVisibility();\n} else {\nvisibility = 1.0;\n}\nvec3 color = max((diffuse +diffusePoint)*visibility,_ambient.xyz)*mainColor.xyz;\ngl_FragColor = vec4(base.xyz*color.xyz, 1.0) + vec4((specular +specularPoint)*specularColor.xyz,1.0);\t\n}\n","bumped_specular_vs.glsl":"// Based on\n// http://www.geeks3d.com/20091019/shader-library-bump-mapping-shader-with-multiple-lights-glsl/\nattribute vec4 vertex;\nattribute vec2 uv1;\nattribute vec3 normal;\nattribute vec4 tangent;\nuniform mat3 _norm;\nuniform mat4 _mvProj;\nuniform mat4 _mv;\nuniform mat4 _world2object;\nuniform vec4 _worldCamPos;\nvarying vec2 v_uv;\nvarying vec3 viewVec;\nvarying vec3 lightVec;\n#pragma include \"light.glsl\"\nvarying vec3 pointLight[LIGHTS];\nvoid main()\n{\nvec3 lightVecDir = _dLight[0]; // light direction in eye coordinates\ngl_Position = _mvProj * vertex;\nv_uv = uv1;\n\tvec3 n = normalize(_norm * normal);\nvec3 t = normalize(_norm * tangent.xyz);\nvec3 b = cross(n, t);\nmat3 tbn = mat3(t,b,n);\nvec3 v;\nvec3 vVertex = vec3(_mv * vertex);\nvec3 lVec = lightVecDir;\nlightVec = lVec * tbn;\nvec3 vVec = -vVertex;\nviewVec = vVec * tbn;\nfor (int i=0;i<LIGHTS;i++){\npointLight[i] = _pLights[i][0] * tbn;\n}\n} ","diffuse_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\n#pragma include \"shadowmap.glsl\"\nvoid main(void)\n{\nvec3 normal = normalize(vNormal);\nvec3 directionalLight = getDirectionalLightDiffuse(normal,_dLight);\nvec3 pointLight = getPointLightDiffuse(normal,vEcPosition, _pLights);\nfloat visibility;\nif (SHADOWS){\nvisibility = computeLightVisibility();\n} else {\nvisibility = 1.0;\n}\nvec3 color = max((directionalLight+pointLight)*visibility,_ambient.xyz)*mainColor.xyz;\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*color, 1.0);\n}\n","diffuse_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat4 _mv;\nuniform mat4 _lightMat;\nuniform mat3 _norm;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec4 vShadowMapCoord;\nvarying vec3 vEcPosition;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\ngl_Position = _mvProj * v;\nvEcPosition = (_mv * v).xyz;\nvUv = uv1;\nvNormal = normalize(_norm * normal);\nvShadowMapCoord = _lightMat * v;\n} ","light.glsl":"vec3 getPointLightDiffuse(vec3 normal, vec3 ecPosition, mat3 pLights[LIGHTS]){\nvec3 diffuse = vec3(0.0);\nfor (int i=0;i<LIGHTS;i++){\nvec3 ecLightPos = pLights[i][0]; // light position in eye coordinates\nvec3 colorIntensity = pLights[i][1];\nvec3 attenuationVector = pLights[i][2];\n// direction from surface to light position\nvec3 VP = ecLightPos - ecPosition;\n// compute distance between surface and light position\nfloat d = length(VP);\n// normalize the vector from surface to light position\nVP = normalize(VP);\n// compute attenuation\nfloat attenuation = 1.0 / dot(vec3(1.0,d,d*d),attenuationVector); // short for constA + liniearA * d + quadraticA * d^2\nfloat nDotVP = max(0.0, dot(normal, VP));\ndiffuse += colorIntensity*nDotVP * attenuation;\n}\nreturn diffuse;\n}\nvoid getPointLight(vec3 normal, vec3 ecPosition, mat3 pLights[LIGHTS],float specularExponent, out vec3 diffuse, out float specular){\ndiffuse = vec3(0.0, 0.0, 0.0);\nspecular = 0.0;\nvec3 eye = vec3(0.0,0.0,1.0);\nfor (int i=0;i<LIGHTS;i++){\nvec3 ecLightPos = pLights[i][0]; // light position in eye coordinates\nvec3 colorIntensity = pLights[i][1];\nvec3 attenuationVector = pLights[i][2];\n// direction from surface to light position\nvec3 VP = ecLightPos - ecPosition;\n// compute distance between surface and light position\nfloat d = length(VP);\n// normalize the vector from surface to light position\nVP = normalize(VP);\n// compute attenuation\nfloat attenuation = 1.0 / dot(vec3(1.0,d,d*d),attenuationVector); // short for constA + liniearA * d + quadraticA * d^2\nvec3 halfVector = normalize(VP + eye);\nfloat nDotVP = max(0.0, dot(normal, VP));\nfloat nDotHV = max(0.0, dot(normal, halfVector));\nfloat pf;\nif (nDotVP <= 0.0){\npf = 0.0;\n} else {\npf = pow(nDotHV, specularExponent);\n}\nbool isLightEnabled = (attenuationVector[0]+attenuationVector[1]+attenuationVector[2])>0.0;\nif (isLightEnabled){\ndiffuse += colorIntensity * nDotVP * attenuation;\nspecular += pf * attenuation;\n}\n}\n}\nvec3 getDirectionalLightDiffuse(vec3 normal, mat3 dLight){\nvec3 ecLightDir = dLight[0]; // light direction in eye coordinates\nvec3 colorIntensity = dLight[1];\nfloat diffuseContribution = max(dot(normal, ecLightDir), 0.0);\nreturn (colorIntensity * diffuseContribution);\n}\n// assumes that normal is normalized\nvoid getDirectionalLight(vec3 normal, mat3 dLight, float specularExponent, out vec3 diffuse, out float specular){\nvec3 ecLightDir = dLight[0]; // light direction in eye coordinates\nvec3 colorIntensity = dLight[1];\nvec3 halfVector = dLight[2];\nfloat diffuseContribution = max(dot(normal, ecLightDir), 0.0);\nfloat specularContribution = max(dot(normal, halfVector), 0.0);\nspecular = pow(specularContribution, specularExponent);\ndiffuse = (colorIntensity * diffuseContribution);\n}\nuniform mat3 _dLight;\nuniform vec3 _ambient;\nuniform mat3 _pLights[LIGHTS];\n","shadowmap.glsl":"varying vec4 vShadowMapCoord;\nuniform sampler2D _shadowMapTexture;\nconst float shadowBias = 0.005;\nvec4 packDepth( const in float depth ) {\nconst vec4 bitShift = vec4( 16777216.0, 65536.0, 256.0, 1.0 );\nconst vec4 bitMask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bitShift );\nres -= res.xxyz * bitMask;\nreturn res;\n}\nfloat unpackDepth(const in vec4 rgba_depth)\n{\nconst vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);\nfloat depth = dot(rgba_depth, bit_shift);\nreturn depth;\n}\nfloat computeLightVisibility(){\nvec3 shadowCoord = vShadowMapCoord.xyz / vShadowMapCoord.w;\nif (shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0){\nvec4 packedShadowDepth = texture2D(_shadowMapTexture,shadowCoord.xy);\nbool isMaxDepth = dot(packedShadowDepth, vec4(1.0,1.0,1.0,1.0))==4.0;\nif (!isMaxDepth){\nfloat shadowDepth = unpackDepth(packedShadowDepth);\nif (shadowDepth > shadowCoord.z - shadowBias){\nreturn 1.0;\n}\nreturn 0.0;\n}\n}\nreturn 1.0; // if outside shadow map, then not occcluded\n}","specular_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec4 specularColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\n#pragma include \"shadowmap.glsl\"\nvoid main(void)\n{\nvec3 normal = normalize(vNormal);\nvec3 diffuse;\nfloat specular;\ngetDirectionalLight(normal, _dLight, specularExponent, diffuse, specular);\nvec3 diffusePoint;\nfloat specularPoint;\ngetPointLight(normal,vEcPosition, _pLights,specularExponent,diffusePoint,specularPoint);\nfloat visibility;\nif (SHADOWS){\nvisibility = computeLightVisibility();\n} else {\nvisibility = 1.0;\n}\nvec3 color = max((diffuse+diffusePoint)*visibility,_ambient.xyz)*mainColor.xyz;\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*color.xyz, 1.0)+vec4((specular+specularPoint)*specularColor.xyz,0.0);\n}\n","specular_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat4 _mv;\nuniform mat4 _lightMat;\nuniform mat3 _norm;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nvarying vec4 vShadowMapCoord;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\ngl_Position = _mvProj * v;\nvUv = uv1;\nvEcPosition = (_mv * v).xyz;\nvNormal= normalize(_norm * normal);\nvShadowMapCoord = _lightMat * v;\n} ","transparent_diffuse_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec4 specularColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\nvoid main(void)\n{\nvec3 normal = normalize(vNormal);\nvec3 diffuseDirectionalLight = getDirectionalLightDiffuse(normal,_dLight);\nvec3 diffusePointLight = getPointLightDiffuse(normal,vEcPosition, _pLights);\nvec4 color = vec4(max(diffuseDirectionalLight+diffusePointLight,_ambient.xyz),1.0)*mainColor;\ngl_FragColor = texture2D(mainTexture,vUv)*color;\n}\n","transparent_diffuse_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nuniform mat4 _mv;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\n// compute position\ngl_Position = _mvProj * v;\nvEcPosition = (_mv * v).xyz;\nvUv = uv1;\n// compute light info\nvNormal= normalize(_norm * normal);\n} ","transparent_point_sprite_fs.glsl":"#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D mainTexture;\nuniform vec4 mainColor;\nvoid main(void)\n{\n\tvec2 UVflippedY = gl_PointCoord;\n\tUVflippedY.y = 1.0 - UVflippedY.y;\ngl_FragColor = texture2D(mainTexture, UVflippedY) * mainColor;\n}\n\t","transparent_point_sprite_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nuniform float pointSize;\nvoid main(void) {\n\tgl_Position = _mvProj * vec4(vertex, 1.0);\ngl_PointSize = pointSize / gl_Position.w;\n} ","transparent_specular_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec4 specularColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\nvoid main(void)\n{\nvec3 normal = normalize(vNormal);\nvec3 diffuse;\nfloat specular;\ngetDirectionalLight(normal, _dLight, specularExponent, diffuse, specular);\nvec3 diffusePoint;\nfloat specularPoint;\ngetPointLight(normal,vEcPosition, _pLights,specularExponent,diffusePoint,specularPoint);\nvec4 color = vec4(max(diffuse+diffusePoint,_ambient.xyz),1.0)*mainColor;\ngl_FragColor = texture2D(mainTexture,vUv)*color+vec4((specular+specularPoint)*specularColor.xyz,0.0);\n}\n","transparent_specular_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat4 _mv;\nuniform mat3 _norm;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\n// compute position\ngl_Position = _mvProj * v;\nvEcPosition = (_mv * v).xyz;\nvUv = uv1;\n// compute light info\nvNormal= normalize(_norm * normal);\n} ","transparent_unlit_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nvoid main(void)\n{\ngl_FragColor = texture2D(mainTexture,vUv)*mainColor;\n}\n","transparent_unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nvarying vec2 vUv;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\n}","unlit_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nvoid main(void)\n{\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*mainColor.xyz,1.0);\n}\n","unlit_vertex_color_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec4 vColor;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nvoid main(void)\n{\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*mainColor.xyz*vColor.xyz,1.0);\n}\n","unlit_vertex_color_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nattribute vec4 color;\nuniform mat4 _mvProj;\nvarying vec2 vUv;\nvarying vec4 vColor;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\nvColor = color;\n}","unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nvarying vec2 vUv;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\n}"};
});