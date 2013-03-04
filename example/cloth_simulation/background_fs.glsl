precision mediump float;

varying vec2 vUv;
varying vec4 vColor;


void main(void)
{
    gl_FragColor = vec4(vColor.xyz,1.0);
}
