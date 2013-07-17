precision mediump float;

varying vec2 vUV;

void main(void)
{
    gl_FragColor = vec4(vUV, 0, 0);
}