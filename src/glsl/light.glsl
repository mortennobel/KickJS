// assumes that normal is normalized
void getDirectionalLight(vec3 normal, mat3 dLight, float specularExponent, out vec3 diffuse, out float specular){
    vec3 ECLigDir = dLight[0];
    vec3 colInt = dLight[1];
    vec3 halfV = dLight[2];
    float diffuseContribution = max(dot(normal, ECLigDir), 0.0);
	float specularContribution = max(dot(normal, halfV), 0.0);
    specular =  pow(specularContribution, specularExponent);
	diffuse = (colInt * diffuseContribution);
}
uniform mat3 _dLight;
uniform vec3 _ambient;
