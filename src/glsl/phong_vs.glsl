attribute vec3 vertex;
attribute vec3 normal;
attribute vec2 uv1;

uniform mat4 _mvProj;
uniform mat3 _norm;

varying vec2 uv;
varying vec3 vNormal;

void main(void) {
 // compute position
 gl_Position = _mvProj * vec4(vertex, 1.0);

 uv = uv1;
 // compute light info
 vNormal= normalize(_norm * normal);

} 