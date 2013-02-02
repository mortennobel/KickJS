#ifdef GL_ES
precision highp float;
#endif

#pragma include "shadowmap.glsl"

void main() {
    gl_FragColor = packDepth( gl_FragCoord.z );
}
 