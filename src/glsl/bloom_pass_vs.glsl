attribute vec3 vertex;
attribute vec2 uv1;

uniform mat4 _mvProj;

varying vec2 vUv;

void main(void) {
  gl_Position = _mvProj * vec4(vertex, 1.0);
  vUv = uv1;
}