attribute vec4 vertex;

uniform mat4 _mvProj;
uniform mat4 _v;

varying vec3 vPos;

void main(void) {
    gl_Position = _mvProj * vertex;
    vPos = (vertex * _v).xyz; // inverse view direction * pos
}