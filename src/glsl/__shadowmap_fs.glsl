precision highp float;

#pragma include "shadowmap.glsl"

void main() {
    gl_FragColor = packDepth( gl_FragCoord.z );
}
 