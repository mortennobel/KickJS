#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUV;

void main(void)
{
    gl_FragColor = vec4(vUV, 0, 0);
}