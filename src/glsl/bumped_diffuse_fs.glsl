precision mediump float;

varying vec2 v_uv;
varying vec3 viewVec;
varying vec3 lightVec;

uniform vec4 mainColor;
uniform sampler2D mainTexture;
uniform sampler2D normalMap;

void main()
{
    vec2 uv = v_uv.st * 4.0;
    vec4 base = texture2D(mainTexture, uv);
    vec4 final_color = vec4(0.2, 0.2, 0.2, 1.0) * base;
    vec3 vVec = normalize(viewVec);
    vec3 bump =
     normalize(texture2D(normalMap, uv).xyz * 2.0 - vec3(1.0,1.0,1.0));
    vec3 R = reflect(-vVec, bump);
    int i;

    vec3 lVec = normalize(lightVec);
    float diffuse = max(dot(lVec, bump), 0.0);
    vec4 vDiffuse =
       mainColor *
       diffuse * base;
    final_color += vDiffuse;


    gl_FragColor = final_color;
}
