#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEcPosition;

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
    vec3 diffusePoint;
    float specularPoint;
    getPointLight(vNormal,vEcPosition, _pLights,specularExponent,diffusePoint,specularPoint);
    vec4 color = vec4(max(diffuse+diffusePoint,_ambient.xyz),1.0)*mainColor;

    gl_FragColor = texture2D(mainTexture,vUv)*color+vec4((specular+specularPoint)*specularColor.xyz,0.0);
}
 