varying vec4 vShadowMapCoord;
uniform sampler2D _shadowMapTexture;

float unpackDepth( const in vec4 rgba_depth ) {
    const vec4 bit_shift = vec4( 1.0 / ( 16777216.0 ), 1.0 / ( 65536.0 ), 1.0 / 256.0, 1.0 );
    return dot( rgba_depth, bit_shift );
}

float computeLightVisibility(){
    vec3 shadowCoord = vShadowMapCoord.xyz / vShadowMapCoord.w;
    vec4 packedShadowDepth = texture2D(_shadowMapTexture,shadowCoord.xy);
    float shadowDepth = unpackDepth(packedShadowDepth);
    if (shadowDepth < shadowCoord.z){
        return 1.0;
    }
    return 0.0;
}