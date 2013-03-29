#ifdef GL_ES
precision mediump float;
#endif

uniform vec4 mainColor;
uniform samplerCube mainTexture;

varying vec3 vPos;

void main(void)
{
    gl_FragColor =  textureCube(mainTexture,vPos)*mainColor;
}