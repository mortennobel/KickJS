#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;

uniform vec4 mainColor;
uniform sampler2D mainTexture;

void main(void)
{
    gl_FragColor = texture2D(mainTexture,vUv)*vec4(mainColor.xyz,1.0);
}
 