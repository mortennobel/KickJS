precision mediump float;

varying vec2 v_uv;
varying vec3 viewVec;
varying vec3 lightVec;
varying vec3 pointLight[LIGHTS]; 

#pragma include "light.glsl"  
#pragma include "shadowmap.glsl"

uniform float specularExponent;
uniform vec4 specularColor;
uniform vec4 mainColor;
uniform sampler2D mainTexture;
uniform sampler2D normalMap;

void getDirectionalLight(vec3 normal, vec3 ecLightDir, vec3 reflection, vec3 colorIntensity, float specularExponent, out vec3 diffuse, out float specular){
    float diffuseContribution = max(dot(normal, ecLightDir), 0.0);
    if ( diffuseContribution > 0.0){
        float specularContribution = max(dot(normal, reflection), 0.0);
        specular = pow(specularContribution, specularExponent);
    } else {
        specular = 0.0;
    }
    diffuse = (colorIntensity * diffuseContribution);
}

void getPointLight(vec3 normal, vec3 ecPosition, vec3 ecLightPos2[LIGHTS], mat3 pLights[LIGHTS],float specularExponent, out vec3 diffuse, out float specular){
    diffuse = vec3(0.0, 0.0, 0.0);
    specular = 0.0;
    vec3 eye = vec3(0.0,0.0,1.0);
    for (int i=0;i<LIGHTS;i++){
        vec3 ecLightPos = ecLightPos2[i];
        vec3 colorIntensity = pLights[i][1];
        vec3 attenuationVector = pLights[i][2];

        // direction from surface to light position
        vec3 VP = ecLightPos -  ecPosition;

        // compute distance between surface and light position
        float d = length(VP);

        // normalize the vector from surface to light position
        VP = normalize(VP);

        // compute attenuation
        float attenuation = 1.0 / dot(vec3(1.0,d,d*d),attenuationVector); // short for constA + liniearA * d + quadraticA * d^2

        vec3 halfVector = normalize(VP + eye);

        float nDotVP = max(0.0, dot(normal, VP));
        float nDotHV = max(0.0, dot(normal, halfVector));
        float pf;
        if (nDotVP <= 0.0){
            pf = 0.0;
        } else {
            pf = pow(nDotHV, specularExponent);
        }
        bool isLightEnabled = (attenuationVector[0]+attenuationVector[1]+attenuationVector[2])>0.0;
        if (isLightEnabled){
            diffuse += colorIntensity * nDotVP * attenuation;
            specular += pf * attenuation;
        }
    }
}

void main()
{
    vec4 base = texture2D(mainTexture, v_uv);
    vec3 bump = normalize(texture2D(normalMap, v_uv).xyz * 2.0 - vec3(1.0,1.0,1.0));
    
    vec3 vVec = normalize(viewVec);
    
    vec3 reflection = reflect(-vVec, bump);
    
    vec3 lVec = normalize(lightVec);
    vec3 diffuse;
    float specular;
    vec3 colorIntensity = _dLight[1];
    getDirectionalLight(lVec, bump ,reflection, colorIntensity, specularExponent, diffuse, specular);

    vec3 diffusePoint;
    float specularPoint;
    getPointLight(bump,viewVec,pointLight, _pLights,specularExponent,diffusePoint,specularPoint);

    float visibility;
    if (SHADOWS){
        visibility = computeLightVisibility();
    } else {
        visibility = 1.0;
    }  
    vec3 color = max((diffuse  +diffusePoint)*visibility,_ambient.xyz)*mainColor.xyz;
  
    gl_FragColor = vec4(base.xyz*color.xyz, 1.0) + vec4((specular +specularPoint)*specularColor.xyz,1.0);	
}
 