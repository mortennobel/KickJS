varying vec4 vShadowMapCoord;
uniform sampler2D _shadowMapTexture;

const float shadowBias = 0.005;

float unpackDepth( const in vec4 rgba_depth ) {
    const vec4 bit_shift = vec4( 1.0 / ( 16777216.0 ), 1.0 / ( 65536.0 ), 1.0 / 256.0, 1.0 );
    return dot( rgba_depth, bit_shift );
}

float computeLightVisibility(){
    vec3 shadowCoord = vShadowMapCoord.xyz / vShadowMapCoord.w;
    if (shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0){
        vec4 packedShadowDepth = texture2D(_shadowMapTexture,shadowCoord.xy);
        bool isMaxDepth = dot(packedShadowDepth, vec4(1.0,1.0,1.0,1.0))==4.0;
        if (!isMaxDepth){
            float shadowDepth = unpackDepth(packedShadowDepth);
            if (shadowDepth > shadowCoord.z - shadowBias){
                return 1.0;
            }
            return 0.0;
        }
    }
    return 1.0; // if outside shadow map, then not occcluded
}