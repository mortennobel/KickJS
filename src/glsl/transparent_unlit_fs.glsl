precision mediump float;

varying vec2 vUv;

uniform vec4 mainColor;
uniform sampler2D mainTexture;

void main(void)
{
    gl_FragColor = texture2D(mainTexture,vUv)*mainColor;
}
