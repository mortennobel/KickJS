#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;

uniform vec4 mainColor;
uniform sampler2D mainTexture;

void main(void)
{
    gl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*mainColor.xyz,1.0);
}
 