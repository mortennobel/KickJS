attribute vec3 vertex;

uniform mat4 _mvProj;

void main(void) {
    gl_Position = _mvProj * vec4(vertex, 1.0);
} 