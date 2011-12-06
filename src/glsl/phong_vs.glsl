attribute vec3 vertex;
attribute vec3 normal;
attribute vec2 uv1;

uniform mat4 _mvProj;
uniform mat3 _norm;

varying vec2 vUv;
varying vec3 vNormal;

void main(void) {
    gl_Position = _mvProj * vec4(vertex, 1.0);
    vUv = uv1;
    vNormal= normalize(_norm * normal);
} 