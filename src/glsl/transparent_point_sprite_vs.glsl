attribute vec3 vertex;

uniform mat4 _mvProj;
uniform float pointSize;

void main(void) {
	gl_Position = _mvProj * vec4(vertex, 1.0);
    gl_PointSize = pointSize / gl_Position.w;
} 