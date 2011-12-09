float unpackDepth( const in vec4 rgba_depth ) {
    const vec4 bit_shift = vec4( 1.0 / ( 16777216.0 ), 1.0 / ( 65536.0 ), 1.0 / 256.0, 1.0 );
    return dot( rgba_depth, bit_shift );
}

float linearizedDepth(in float f, int float n, int float z){
        return (2.0 * n) / (f + n - z * (f - n));
}