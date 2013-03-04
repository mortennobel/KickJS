attribute vec3 vertex;
attribute vec4 color;

varying vec4 vColor;

void main(void) {
    gl_Position = vec4(vertex.xy, 0.9999, 1.0);
    vColor = color;
}