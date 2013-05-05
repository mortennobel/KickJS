uniform sampler2D _shadowMapTexture;

const float shadowBias = 0.005;

vec4 packDepth( const in float depth ) {
    const vec4 bitShift = vec4( 16777216.0, 65536.0, 256.0, 1.0 );
    const vec4 bitMask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );
    vec4 res = fract( depth * bitShift );
    res -= res.xxyz * bitMask;
    return res;
}

float unpackDepth(const in vec4 rgba_depth)
{
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float depth = dot(rgba_depth, bit_shift);
    return depth;
}

float computeLightVisibility(vec4 vShadowMapCoord){
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