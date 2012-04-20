Object.defineProperty(window,"defaultMaterial",{
    value: JSON.stringify (
        {"shader":{
            "faceCulling":1029,
            "zTest":513,
            "vertexShaderSrc":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nuniform float _time;\n\nvarying vec2 uv;\nvarying vec3 vColor;\n\n#pragma include \"light.glsl\"\n\n// constants\nvec3 materialColor = vec3(1.0,0.7,0.8);\nvec3 specularColor = vec3(1.0,1.0,1.0);\n\nvoid main(void) {\n\t// compute position\n\tgl_Position = _mvProj * vec4(vertex, 1.0);\n\n\tuv = uv1;\n\t// compute light info\n\tvec3 n = normalize(_norm * normal);\n\tvec3 diffuse;\n\tfloat specular;\n\tfloat glowingSpecular = sin(_time*0.003)*20.0+20.0;\n\tgetDirectionalLight(n, _dLight, glowingSpecular, diffuse, specular);\n\tvColor = max(diffuse,_ambient.xyz)*materialColor+specular*specularColor;\n} ",
            "fragmentShaderSrc":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec3 vColor;\nvarying vec2 uv;\n\nuniform sampler2D tex;\n\nvoid main(void)\n{\n\tgl_FragColor = texture2D(tex,uv)*vec4(vColor, 1.0);\n}\n\t"},
            "material":{
                "name":"Default material",
                "shader":1,
                "uniforms":{
                    "tex": {
                        "type": 35678,
                        "value": {
                            "name": "Texture",
                            "ref": 2,
                            "reftype": "project"
                        }
                    }
                }
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
                "internalFormat":6408}],
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
