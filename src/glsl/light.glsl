vec3 getPointLightDiffuse(vec3 normal, vec3 ecPosition, mat3 pLights[LIGHTS]){
    vec3 diffuse = vec3(0.0);
    for (int i=0;i<LIGHTS;i++){
        vec3 ecLightPos = pLights[i][0]; // light position in eye coordinates
        vec3 colorIntensity = pLights[i][1];
        vec3 attenuationVector = pLights[i][2];
        bool isLightEnabled = (attenuationVector[0]+attenuationVector[1]+attenuationVector[2])>0.0;
        if (isLightEnabled){
            // direction from surface to light position
            vec3 VP = ecLightPos -  ecPosition;

            // compute distance between surface and light position
            float d = length(VP);

            // normalize the vector from surface to light position
            VP = normalize(VP);

            // compute attenuation
            float attenuation = 1.0 / dot(vec3(1.0,d,d*d),attenuationVector); // short for constA + liniearA * d + quadraticA * d^2

            float nDotVP = max(0.0, dot(normal, VP));

            diffuse += colorIntensity*nDotVP * attenuation;
        }
    }
    return diffuse;
}

void getPointLight(vec3 normal, vec3 ecPosition, mat3 pLights[LIGHTS],float specularExponent, out vec3 diffuse, out float specular){
    diffuse = vec3(0.0, 0.0, 0.0);
    specular = 0.0;
    vec3 eye = vec3(0.0,0.0,1.0);
    for (int i=0;i<LIGHTS;i++){
        vec3 ecLightPos = pLights[i][0]; // light position in eye coordinates
        vec3 colorIntensity = pLights[i][1];
        vec3 attenuationVector = pLights[i][2];
        bool isLightEnabled = (attenuationVector[0]+attenuationVector[1]+attenuationVector[2])>0.0;
        if (isLightEnabled){
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

            diffuse += colorIntensity * nDotVP * attenuation;
            specular += pf * attenuation;
        }
    }
}

vec3 getDirectionalLightDiffuse(vec3 normal, mat3 dLight){
    vec3 ecLightDir = dLight[0]; // light direction in eye coordinates
    vec3 colorIntensity = dLight[1];
    float diffuseContribution = max(dot(normal, -ecLightDir), 0.0);
    return (colorIntensity * diffuseContribution);
}

// assumes that normal is normalized
void getDirectionalLight(vec3 normal, mat3 dLight, float specularExponent, out vec3 diffuse, out float specular){
    vec3 ecLightDir = dLight[0]; // light direction in eye coordinates
    vec3 colorIntensity = dLight[1];
    vec3 halfVector = dLight[2];
    float diffuseContribution = max(dot(normal, -ecLightDir), 0.0);
    float specularContribution = max(dot(normal, -halfVector), 0.0);
    specular =  pow(specularContribution, specularExponent);
    diffuse = (colorIntensity * diffuseContribution);
}

uniform mat3 _dLight;
uniform vec3 _ambient;
uniform mat3 _pLights[LIGHTS];
