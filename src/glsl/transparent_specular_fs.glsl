#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;
varying vec3 vNormal;

uniform vec4 mainColor;
uniform float specularExponent;
uniform vec4 specularColor;
uniform sampler2D mainTexture;

#pragma include "light.glsl"

void main(void)
{
    vec3 diffuse;
    float specular;
    getDirectionalLight(vNormal, _dLight, specularExponent, diffuse, specular);
    vec4 color = vec4(max(diffuse,_ambient.xyz),1.0)*mainColor;

    gl_FragColor = texture2D(mainTexture,vUv)*color+vec4(specular*specularColor.xyz,0.0);
}
 