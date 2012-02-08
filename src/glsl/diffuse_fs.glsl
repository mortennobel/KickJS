#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;
varying vec3 vNormal;

uniform vec4 mainColor;
uniform sampler2D mainTexture;

uniform mat3 _dLight;
uniform vec3 _ambient;

#pragma include "shadowmap.glsl"

void main(void)
{
    vec3 ECLigDir = _dLight[0];
    vec3 colInt = _dLight[1];
    float diffuseContribution = max(dot(vNormal, ECLigDir), 0.0);
    vec3 diffuse = (colInt * diffuseContribution);
    float visibility;
    if (SHADOWS){
        computeLightVisibility();
    } else {
        visibility = 1.0;
    }
    vec3 color = max(diffuse*visibility,_ambient.xyz)*mainColor.xyz;

    gl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*color.xyz, 1.0);
}
 