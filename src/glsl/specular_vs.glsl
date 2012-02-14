attribute vec3 vertex;
attribute vec3 normal;
attribute vec2 uv1;

uniform mat4 _mvProj;
uniform mat4 _mv;
uniform mat4 _lightMat;
uniform mat3 _norm;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEcPosition;
varying vec4 vShadowMapCoord;

void main(void) {
    vec4 v = vec4(vertex, 1.0);
    gl_Position = _mvProj * v;
    vUv = uv1;
    vEcPosition = (_mv * v).xyz;
    vNormal= _norm * normal;
    vShadowMapCoord = _lightMat * v;
} 