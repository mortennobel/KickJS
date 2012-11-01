attribute vec3 vertex;
attribute vec2 uv1;

uniform mat4 _mvProj;
uniform mat3 _norm;

varying vec2 vUV;

void main(void) {
    // compute position
    gl_Position = _mvProj * vec4(vertex, 1.0);
    vUV = uv1;
}