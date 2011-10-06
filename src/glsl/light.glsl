struct DirectionalLight {
   vec3 lDir;
   vec3 colInt;
   vec3 halfV;
};
// assumes that normal is normalized
void getDirectionalLight(vec3 normal, DirectionalLight dLight, float specularExponent, out vec3 diffuse, out float specular){
    float diffuseContribution = max(dot(normal, dLight.lDir), 0.0);
	float specularContribution = max(dot(normal, dLight.halfV), 0.0);
    specular =  pow(specularContribution, specularExponent);
	diffuse = (dLight.colInt * diffuseContribution);
}
uniform DirectionalLight _dLight;
uniform vec3 _ambient;