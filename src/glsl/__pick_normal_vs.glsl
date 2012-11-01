attribute vec3 vertex;
attribute vec3 normal;

uniform mat4 _mvProj;

varying vec3 vNormal;

void main(void) {
    // compute position
    gl_Position = _mvProj * vec4(vertex, 1.0);
    vNormal = normal;
}