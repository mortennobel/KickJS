precision mediump float;

uniform sampler2D mainTexture;
uniform vec4 mainColor;

void main(void)
{
	vec2 UVflippedY = gl_PointCoord;
	UVflippedY.y = 1.0 - UVflippedY.y;
    gl_FragColor = texture2D(mainTexture, UVflippedY) * mainColor;
}
	