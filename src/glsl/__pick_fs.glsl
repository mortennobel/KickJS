precision mediump float;

varying vec4 gameObjectUID;

void main(void)
{
    gl_FragColor = gameObjectUID;
}