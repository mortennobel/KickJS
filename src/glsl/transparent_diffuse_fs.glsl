#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;
varying vec3 vNormal;

uniform vec4 mainColor;
uniform float specularExponent;
uniform vec4 specularColor;
uniform sampler2D mainTexture;

uniform mat3 _dLight;
uniform vec3 _ambient;

void main(void)
{
    vec3 ECLigDir = _dLight[0];
    vec3 colInt = _dLight[1];
    float diffuseContribution = max(dot(vNormal, ECLigDir), 0.0);
    vec3 diffuse = (colInt * diffuseContribution);
    vec4 color = vec4(max(diffuse,_ambient.xyz),1.0)*mainColor;

    gl_FragColor = texture2D(mainTexture,vUv)*color;
}
 