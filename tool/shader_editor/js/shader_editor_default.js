define(['text!shaders/default_vert.glsl',
    'text!shaders/default_frag.glsl'],
    function (vert, frag) {
        return {
            "shader": {
                "faceCulling": 1029,
                "zTest": 513,
                "vertexShaderSrc": vert,
                "fragmentShaderSrc": frag
            },
            "material": {
                "name": "Default material",
                "shader": 1,
                "uniforms": {
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
            "textureData": [{
                "uid": 2,
                "wrapS": 10497,
                "wrapT": 10497,
                "minFilter": 9729,
                "magFilter": 9729,
                "generateMipmaps": true,
                "autoScaleImage": true,
                "dataURI": "http://www.kickjs.org/images/webgl.png",
                "flipY": true,
                "internalFormat": 6408
            }],
            "settingsData": {
                "meshsetting": "sphere",
                "rotatemesh": "on",
                "lightpos": [1, 1, 1],
                "lightrot": [0, 0, 0],
                "lightcolor": [1, 1, 1],
                "lightAmbient": [0.1, 0.1, 0.1],
                "lightintensity": 1
            },
            "about": "",
            "name": "Default shader"
        };

    });