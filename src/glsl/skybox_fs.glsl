precision mediump float;

uniform vec4 mainColor;
uniform samplerCube mainTexture;

varying vec3 vPos;

void main(void)
{
    gl_FragColor =  textureCube(mainTexture,vPos)*mainColor;
}