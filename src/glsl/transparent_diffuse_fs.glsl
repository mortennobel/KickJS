precision mediump float;

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
    vec3 diffuseDirectionalLight = getDirectionalLightDiffuse(vNormal,_dLight);
    vec3 diffusePointLight = getPointLightDiffuse(vNormal,vEcPosition, _pLights);
    vec4 color = vec4(max(diffuseDirectionalLight+diffusePointLight,_ambient.xyz),1.0)*mainColor;

    gl_FragColor = texture2D(mainTexture,vUv)*color;
}
 