#ifdef GL_ES
precision mediump float;
#endif
varying vec4 gameObjectUID;

void main(void)
{
    gl_FragColor = gameObjectUID;
}