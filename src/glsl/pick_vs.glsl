attribute vec3 vertex;

uniform mat4 _mvProj;
uniform vec4 _gameObjectUID;

varying vec4 gameObjectUID;

void main(void) {
    // compute position
    gl_Position = _mvProj * vec4(vertex, 1.0);

    gameObjectUID = _gameObjectUID;
}