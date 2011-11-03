#ifdef GL_ES
precision highp float;
#endif
varying vec2 uv;
varying vec3 vNormal;

uniform float specularExponent;
uniform vec3 specularColor;
uniform vec3 materialColor;

#pragma include "light.glsl"

void main(void)
{
    vec3 diffuse;
    float specular;
    getDirectionalLight(vNormal, _dLight, specularExponent, diffuse, specular);
    vec3 vColor = max(diffuse,_ambient.xyz)*materialColor;
    
    gl_FragColor = vec4(vColor, 1.0)+vec4(specular*specularColor,0.0);
}
 