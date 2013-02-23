//attribute vec3 vertex;
//attribute vec2 uv1;
//
//uniform mat4 _mvProj;
//
//varying vec2 vUv;
//
//void main(void) {
//    gl_Position = _mvProj * vec4(vertex, 1.0);
//    vUv = uv1;/
//}

// http://www.geeks3d.com/20091019/shader-library-bump-mapping-shader-with-multiple-lights-glsl/

attribute vec4 vertex;
attribute vec2 uv1;
attribute vec3 normal;
attribute vec4 tangent;

uniform mat3 _norm;

uniform mat4 _mvProj;
uniform mat4 _mv;
uniform mat4 _world2object;
uniform vec4 _worldCamPos;

varying vec2 v_uv;
varying vec3 viewVec;
varying vec3 lightVec;

#pragma include "light.glsl"

void main()
{
    vec3 lightVecDir = _dLight[0]; // light direction in eye coordinates
    gl_Position = _mvProj * vertex;
    v_uv = uv1;

	vec3 n = normalize(_norm * normal);
    vec3 t = normalize(_norm * tangent.xyz);
    vec3 b = cross(n, t);

    vec3 v;
    vec3 vVertex = vec3(_mv * vertex);
    vec3 lVec = lightVecDir;
    v.x = dot(lVec, t);
    v.y = dot(lVec, b);
    v.z = dot(lVec, n);
    lightVec = v;

    vec3 vVec = -vVertex;
    v.x = dot(vVec, t);
    v.y = dot(vVec, b);
    v.z = dot(vVec, n);
    viewVec = v;
}
