Object.defineProperty(window,"defaultMaterial",{
    value: JSON.stringify (
        {"shader":{
            "faceCulling":1029,
            "zTest":513,
            "vertexShaderSrc":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nuniform float _time;\n\nvarying vec2 uv;\nvarying vec3 vColor;\n\n#pragma include \"light.glsl\"\n\n// constants\nvec3 materialColor = vec3(1.0,0.7,0.8);\nvec3 specularColor = vec3(1.0,1.0,1.0);\n\nvoid main(void) {\n // compute position\n gl_Position = _mvProj * vec4(vertex, 1.0);\n\n uv = uv1;\n // compute light info\n vec3 n = normalize(_norm * normal);\n vec3 diffuse;\n float specular;\n float glowingSpecular = sin(_time*0.003)*20.0+20.0;\n getDirectionalLight(n, _dLight, glowingSpecular, diffuse, specular);\n vColor = max(diffuse,_ambient.xyz)*materialColor+specular*specularColor;\n} ",
            "fragmentShaderSrc":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec3 vColor;\nvarying vec2 uv;\n\nuniform sampler2D tex;\n\nvoid main(void)\n{\n gl_FragColor = texture2D(tex,uv)*vec4(vColor.x, vColor.y, vColor.z, 1.0);\n}\n "},
            "material":{
                "name":"Default material",
                "shader":1,
                "uniforms":{}
            },
            "textureData":[{
                "uid":2,
                "wrapS":10497,
                "wrapT":10497,
                "minFilter":9729,
                "magFilter":9729,
                "generateMipmaps":true,
                "autoScaleImage":true,
                "dataURI":"http://www.kickjs.org/images/webgl.png",
                "flipY":true,
                "internalFormal":6408}],
            "settingsData":{
                "meshsetting":"sphere",
                "rotatemesh":"on",
                "lightpos":[1,1,1],
                "lightrot":[0,0,0],
                "lightcolor":[1,1,1],
                "lightAmbient":[0.1,0.1,0.1],
                "lightintensity":1},
            "about":"",
            "name":"Default shader"
        }
    )
});
