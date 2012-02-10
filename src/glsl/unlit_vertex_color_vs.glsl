attribute vec3 vertex;
attribute vec2 uv1;
attribute vec4 color;

uniform mat4 _mvProj;

varying vec2 vUv;
varying vec4 vColor;

void main(void) {
    gl_Position = _mvProj * vec4(vertex, 1.0);
    vUv = uv1;
    vColor = color;
}