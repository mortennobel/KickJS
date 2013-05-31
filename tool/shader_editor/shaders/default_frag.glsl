#ifdef GL_ES
precision highp float;
#endif
varying vec3 n;
varying vec2 uv;

uniform sampler2D tex;


//#pragma include "noise2D.glsl // for snoise(vec2 v)
//#pragma include "noise3D.glsl" //  for snoise(vec3 v)
//#pragma include "noise4D.glsl" //  for snoise(vec4 v)
//#pragma include "cellular2D.glsl" //  for cellular(vec2 P)
//#pragma include "cellular2x2.glsl" //  for cellular2x2(vec2 P)
//#pragma include "cellular2x2x2.glsl" //  for cellular2x2x2(vec3 P)
//#pragma include "cellular3D.glsl" //  cellular(vec3 P)

void main(void)
{
    vec3 eyeSpaceLigthDirection = vec3(0.0,0.0,1.0);
    float diffuse = max(0.0,dot(normalize(n),eyeSpaceLigthDirection));
	gl_FragColor = vec4(texture2D(tex,uv).xyz*diffuse,1.0);
}
