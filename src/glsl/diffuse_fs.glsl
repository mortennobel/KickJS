precision mediump float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEcPosition;
varying vec4 vShadowMapCoord;

uniform vec4 mainColor;
uniform sampler2D mainTexture;

#pragma include "light.glsl"
#pragma include "shadowmap.glsl"

void main(void)
{
    vec3 normal = normalize(vNormal);
    vec3 directionalLight = getDirectionalLightDiffuse(normal,_dLight);
    vec3 pointLight = getPointLightDiffuse(normal,vEcPosition, _pLights);
    float visibility;
    if (SHADOWS){
        visibility = computeLightVisibility(vShadowMapCoord);
    } else {
        visibility = 1.0;
    }
    vec3 color = max((directionalLight+pointLight)*visibility,_ambient.xyz)*mainColor.xyz;

    gl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*color, 1.0);
}
 