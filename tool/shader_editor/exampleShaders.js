/*
 * mandelbrot
 * brick
 * slicedGeometry
 * asciiArt
 * transPhong
 * multiTexture
 * */
function setDebugShader(index) {
    "use strict";
    switch (index) {
    case 0:
        controller.setShader(mandelbrot);
        break;
    case 1:
        controller.setShader(brick);
        break;
    case 2:
        controller.setShader(slicedGeometry);
        break;
    case 3:
        controller.setShader(asciiArt);
        break;
    case 4:
        controller.setShader(transPhong);
        break;
    case 5:
        controller.setShader(multiTexture);
        break;
    }
}

function scheduledDebug() {
    "use strict";
    setTimeout(function () {
        setDebugShader(0);
    }, 0);
    setTimeout(function () {
        setDebugShader(1);
    }, 10000);
    setTimeout(function () {
        setDebugShader(2);
    }, 20000);
    setTimeout(function () {
        setDebugShader(3);
    }, 30000);
    setTimeout(function () {
        setDebugShader(4);
    }, 40000);
    setTimeout(function () {
        setDebugShader(5);
    }, 50000);
}


var mandelbrot = {
    "shader":{
        "faceCulling":1029,
        "zTest":513,
        "vertexShaderSrc":"// \n// Look in the fragment shader for the mandelbrot implementation\n//\n\nattribute vec3 vertex;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\n\nvarying vec2 uv;\n\nvoid main(void) {\n gl_Position = _mvProj * vec4(vertex, 1.0);\n uv = uv1;\n} ",
        "fragmentShaderSrc":"precision highp float;\nvarying vec2 uv;\n\nconst float mandel_x = -2.0;\nconst float mandel_y = -2.0;\nconst float mandel_width = 4.0;\nconst float mandel_height = 4.0;\nconst float mandel_x2 = -2.0+1.29;\nconst float mandel_y2 = -2.0+2.27;\nconst float mandel_width2 = 0.04;\nconst float mandel_height2 = 0.04;\n\nconst int mandel_iterations = 128;\n\nuniform sampler2D gradientTexture;\nuniform float _time;\n\n// calcualte the mandelbrot iterations for a given position \nint calculateMandelbrotIterations(vec2 position) {\n    float x = position.x;\n    float y = position.y;\n    float xx = 0.0;\n\tfloat yy = 0.0;\n    int count = 0;\n\tfor (int iter = 0;iter < mandel_iterations;iter++){\n        float xx2 = xx*xx;\n        float yy2 = yy*yy;\n        if (xx2 + yy2 <=4.0){\n    \t\tfloat temp = xx2 - yy2 + x;\n     \t\tyy = 2.0*xx*yy + y;\n    \t\txx = temp;\n     \t\tcount ++;\n        } \n \t}\n \treturn count;\n}\n\n// Calculate the pixel color by looking up in the gradient texture\n// To make it more alive, the texture also interpolates between multiple \n// gradient (each row in the texture)\nvec4 getColor(int iterations) {\n\tif (iterations==mandel_iterations){\n\t\treturn vec4(0.0,0.0,0.0,1.0);\n \t}\n    float uvY = _time*0.00001;\n    float uvX = float(iterations)/float(mandel_iterations);\n    uvX = uvX*uvX;\n    return texture2D(gradientTexture, vec2(uvX,uvY));\n}\n\n// Ping pong between two value\nfloat pingPong(float length,float value){\n    float res = mod(value, (length*2.0));\n    if (res > length){\n        res = 2.0*length-res;\n    }\n    return res;\n}\n\n// Smoothstep between two views on the mandelbrot (based on time)\nvec2 getPosition(){\n    float time = _time*0.00005;\n    float timePP = smoothstep(0.0,1.0,pingPong(1.0,time));\n    \n    float x = mix(mandel_x,mandel_x2,timePP)+uv.x*mix(mandel_width,mandel_width2,timePP);\n    float y = mix(mandel_y,mandel_y2,timePP)+uv.y*mix(mandel_height,mandel_height2,timePP);\n    return vec2(x,y);\n}\n\nvoid main()\n{\n \tvec2 pos = getPosition();\n \tint iterations = calculateMandelbrotIterations(pos);\n \tgl_FragColor = getColor(iterations);\n}"
    },
    "material":{
        "name":"Default material",
        "shader":5,
        "uniforms":{

        }
    },
    "textureData":[
        {
            "uid":6,
            "wrapS":10497,
            "wrapT":10497,
            "minFilter":9729,
            "magFilter":9729,
            "generateMipmaps":true,
            "autoScaleImage":true,
            "dataURI":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAICAIAAAAX52r4AAACWUlEQVQokQXB3W4TRxgG4Hd2/nZn1mBw4hB+IgoVcNKeV70OxLVwHb2SHvUCegVISBFq1FalsYlxghN7Zne+b2aH5xHl/H3oavBi72oycof5Fzy+FI+usEila0YnokPsBLWzII539fSrOLqu81thp9w1g2uGDoNVhLID/4/8H+oV1BZ6BX0B80mMv+Nmgc0JNgvc9tjgx8/4+QJv/sbTW3rAN0vaPE5fT3A3f3IjXq3w4l88W+EoYFaHB9PupG4X9foe7kRegz+I/KeoH8UMOANeAKcQl38MmZjHQpF4zBSZAnPkTJx5mmqeSuZSSmaeiJk4E2VmGlIh5pQoURmJiGnkkjgTMXGhnCmXXKdJHELIzJw5JWIiIk40MlGmkgvnkpkyZaaUxnFMlNIwhiGOwxDCMMQQYowxxH3YDyEcQgjhcDiMMe5DCGPIKYv6m8D4BvwS+RnKQ4hT6OeQTyH8WNvD1A2TG2sbW2znuDoWq2N8u4dsM9xQ3L66KGVaim+ndf0EqwWuW879UPsDfERThMJQsTqvF+f4jBqB5peqfhXmJ2qOd7i/FUebRtw06k7q9UP88wMuzvDXEmlOerFVy7XFWva3r+vlS3y6xodH+Hg/YbnDyRfoLQxDvD17p4WS2mhtjdRKG6uMUq1V1lhrpNWmtcpqZZQySmsjrZJSSS2lllI2jVJaKKt0p43TxhnTKd1q1SplpGgaIYTQ1vau9b33fta73vVu1nvve+97573rfO/bzvnOd751tm27rtXaGmOM0VorKbVW0hhrrLHGGGuN1sYYpSRE8x0To2ATF8GZHgAAAABJRU5ErkJggg%3D%3D",
            "flipY":false,
            "internalFormal":6408
        }
    ],
    "settingsData":{
        "meshsetting":"plane",
        "rotatemesh":"off",
        "lightpos":[
            1,
            1,
            1
        ],
        "lightrot":[
            0,
            0,
            0
        ],
        "lightcolor":[
            1,
            1,
            1
        ],
        "lightAmbient":[
            0.1,
            0.1,
            0.1
        ],
        "lightintensity":1
    },
    "name":"Mandelbrot",
    "about":""
};
var brick = {
    "shader":{
        "faceCulling":1029,
        "zTest":513,
        "vertexShaderSrc":"attribute vec3 vertex;\nattribute vec3 normal;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\n\nvarying vec3 vColor;\nvarying vec3 localPos;\n\n#pragma include \"light.glsl\"\n\n// constants\nvec3 materialColor = vec3(1.0,0.7,0.8);\nvec3 specularColor = vec3(1.0,1.0,1.0);\n\nvoid main(void) {\n // compute position\n gl_Position = _mvProj * vec4(vertex, 1.0);\n\n localPos = vertex;\n\n // compute light info\n vec3 n = normalize(_norm * normal);\n vec3 diffuse;\n float specular;\n float glowingSpecular = 50.0;\n getDirectionalLight(n, _dLight, glowingSpecular, diffuse, specular);\n vColor = max(diffuse,_ambient.xyz)*materialColor+specular*specularColor+_ambient;\n} ",
        "fragmentShaderSrc":"precision highp float;\n\nuniform vec3 BrickColor, MortarColor;\nuniform vec3 BrickSize;\nuniform vec3 BrickPct;\n\nvarying vec3 vColor;\nvarying vec3 localPos;\nvoid main()\n{\n    vec3 color;\n\tvec3 position, useBrick;\n\t\n\n\tposition = localPos / BrickSize.xyz;\n\n\tif (fract(position.y * 0.5) > 0.5){\n\t\tposition.x += 0.5;\n        position.z += 0.5;\n\t}\n    \n\tposition = fract(position);\n\n\tuseBrick = step(position, BrickPct.xyz);\n\n\tcolor = mix(MortarColor, BrickColor, useBrick.x * useBrick.y * useBrick.z);\n\tcolor *= vColor;\n\n\tgl_FragColor = vec4(color, 1.0);\n}\n"
    },
    "material":{
        "name":"Default material",
        "shader":5,
        "uniforms":{
            "BrickColor":{
                "type":35665,
                "value":[
                    1,
                    0.30000001192092896,
                    0.20000000298023224
                ]
            },
            "MortarColor":{
                "type":35665,
                "value":[
                    0.8500000238418579,
                    0.8600000143051147,
                    0.8399999737739563
                ]
            },
            "BrickPct":{
                "type":35665,
                "value":[
                    0.8999999761581421,
                    0.8500000238418579,
                    0.8500000238418579
                ]
            },
            "BrickSize":{
                "type":35665,
                "value":[
                    0.25,
                    0.15000000596046448,
                    0.25
                ]
            }
        }
    },
    "textureData":[
        {
            "uid":6,
            "wrapS":10497,
            "wrapT":10497,
            "minFilter":9729,
            "magFilter":9729,
            "generateMipmaps":true,
            "autoScaleImage":true,
            "dataURI":"http://www.kickjs.org/images/webgl.png",
            "flipY":true,
            "internalFormal":6408
        }
    ],
    "settingsData":{
        "meshsetting":"cube",
        "rotatemesh":"on",
        "lightpos":[
            1,
            1,
            1
        ],
        "lightrot":[
            0,
            0,
            0
        ],
        "lightcolor":[
            1,
            1,
            1
        ],
        "lightAmbient":[
            0.1,
            0.1,
            0.1
        ],
        "lightintensity":1
    },
    "name":"Brick shader",
    "about":"Procedural generated brick shader.\n\nThe brick shader is inspired by the brick shader in the \"OpenGL Shading Language 3rd Ed.\""
};
var slicedGeometry = {
    "shader":{
        "zTest":513,
        "depthMask":true,
        "vertexShaderSrc":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mv;\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nuniform float _time;\n\nvarying vec2 uv;\nvarying vec3 vColor;\nvarying vec3 worldPos;\n\n#pragma include \"light.glsl\"\n\n// constants\nvec3 materialColor = vec3(1.0,0.7,0.8);\nvec3 specularColor = vec3(1.0,1.0,1.0);\n\nvoid main(void) {\n // compute position\n gl_Position = _mvProj * vec4(vertex, 1.0);\n worldPos = (_mv * vec4(vertex,1.0)).xyz;\n\n uv = uv1;\n // compute light info\n vec3 n = normalize(_norm * normal);\n vec3 diffuse;\n float specular;\n float glowingSpecular = sin(_time*0.003)*20.0+20.0;\n getDirectionalLight(n, _dLight, glowingSpecular, diffuse, specular);\n vColor = max(diffuse,_ambient.xyz)*materialColor+specular*specularColor+_ambient;\n} ",
        "fragmentShaderSrc":"precision highp float;\nvarying vec3 vColor;\nvarying vec2 uv;\n\nuniform sampler2D tex;\nvarying vec3 worldPos;\nuniform float numberOfBands;\n\nvoid main(void)\n{\n    if (step(1.0,mod(worldPos.y*numberOfBands,2.0))==1.0){\n        discard;\n    }\n    vec4 textureSample = texture2D(tex,uv);\n    if (gl_FrontFacing){\n        gl_FragColor = textureSample * vec4(vColor.x, vColor.y, vColor.z, 1.0);\n    } else {\n        gl_FragColor = vec4(textureSample.xyz * vec3(0.8,0.8,0.8),1.0);\n    }\n  \n  \n}\n "
    },
    "material":{
        "name":"Default material",
        "shader":5,
        "uniforms":{
            "numberOfBands":{
                "type":5126,
                "value":[
                    40
                ]
            }
        }
    },
    "textureData":[
        {
            "uid":6,
            "wrapS":10497,
            "wrapT":10497,
            "minFilter":9729,
            "magFilter":9729,
            "generateMipmaps":true,
            "autoScaleImage":true,
            "dataURI":"http://www.kickjs.org/images/webgl.png",
            "flipY":true,
            "internalFormal":6408
        }
    ],
    "settingsData":{
        "meshsetting":"sphere",
        "projection":"perspective",
        "rotatemesh":"on",
        "lightpos":[
            1,
            1,
            1
        ],
        "lightrot":[
            0,
            0,
            0
        ],
        "lightcolor":[
            1,
            1,
            1
        ],
        "lightAmbient":[
            0.1,
            0.1,
            0.1
        ],
        "lightintensity":1
    },
    "name":"Sliced geometry",
    "about":""
};
var asciiArt = {
    "shader":{
        "faceCulling":0,
        "zTest":513,
        "depthMask":true,
        "vertexShaderSrc":"attribute vec3 vertex;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\n\nvarying vec2 uv;\n\nvoid main(void) {\n // compute position\n gl_Position = _mvProj * vec4(vertex, 1.0);\n\n uv = uv1;\n} ",
        "fragmentShaderSrc":"precision highp float;\nvarying vec2 uv;\nuniform vec2 _viewport;\nuniform sampler2D tex;\nuniform sampler2D ascii;\nconst vec2 fontSize = vec2(8.0,16.0);\n\nvec4 lookupASCII(float asciiValue){\n  vec2 pos = mod(gl_FragCoord.xy,fontSize.xy);\n\n  pos = pos / vec2(2048.0,16.0);\n  pos.x += asciiValue;\n  return vec4(texture2D(ascii,pos).rgb,1.0);\n}\n\n\nvoid main(void)\n{\n      vec2 invViewport = vec2(1.0) / _viewport;\n      vec2 pixelSize = fontSize;\n      vec4 sum = vec4(0.0);\n      vec2 uvClamped = uv-mod(uv,pixelSize * invViewport);\n      for (float x=0.0;x<fontSize.x;x++){\n        for (float y=0.0;y<fontSize.y;y++){\n            vec2 offset = vec2(x,y);\n            sum += texture2D(tex,uvClamped+(offset*invViewport));\n        }\n      }\n      vec4 avarage = sum / vec4(fontSize.x*fontSize.y);\n      float brightness = (avarage.x+avarage.y+avarage.z)*0.33333;\n      vec4 clampedColor = floor(avarage*8.0)/8.0;\n      float asciiChar = floor((1.0-brightness)*256.0)/256.0;\n      gl_FragColor = clampedColor*lookupASCII(asciiChar);\n}\n"
    },
    "material":{
        "name":"Default material",
        "shader":5,
        "uniforms":{
            "ascii":{
                "type":35678,
                /*"value":7*/
                "value":{
                    "ref":7,
                    "name":"Texture",
                    "reftype":"project"
                }
            },
            "tex":{
                "type":35678,
                /*"value":6*/
                "value":{
                    "ref":6,
                    "name":"Texture",
                    "reftype":"project"
                }
            }
        }
    },
    "textureData":[
        {
            "uid":6,
            "wrapS":10497,
            "wrapT":10497,
            "minFilter":9729,
            "magFilter":9729,
            "generateMipmaps":true,
            "autoScaleImage":true,
            "dataURI":"http://www.kickjs.org/images/webgl.png",
            "flipY":true,
            "internalFormal":6408
        },
        {
            "uid":7,
            "wrapS":33071,
            "wrapT":10497,
            "minFilter":9728,
            "magFilter":9728,
            "generateMipmaps":false,
            "autoScaleImage":false,
            "dataURI":"data:image/gif;base64,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",
            "flipY":true,
            "internalFormal":6409
        }
    ],
    "settingsData":{
        "meshsetting":"sphere",
        "projection":"orthogonale",
        "rotatemesh":"on",
        "lightpos":[
            1,
            1,
            1
        ],
        "lightrot":[
            0,
            0,
            0
        ],
        "lightcolor":[
            1,
            1,
            1
        ],
        "lightAmbient":[
            0.1,
            0.1,
            0.1
        ],
        "lightintensity":1
    },
    "name":"ASCII art",
    "about":""
};
var transPhong = {
    "shader":{
        "faceCulling":0,
        "zTest":513,
        "depthMask":true,
        "vertexShaderSrc":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\n\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nvoid main(void) {\n // compute position\n gl_Position = _mvProj * vec4(vertex, 1.0);\n\n vUv = uv1;\n // compute light info\n vNormal= normalize(_norm * normal);\n} ",
        "fragmentShaderSrc":"precision highp float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec3 specularColor;\nuniform sampler2D mainTexture;\n\n#pragma include \"light.glsl\"\n\nvoid main(void)\n{\n    vec3 diffuse;\n    float specular;\n    getDirectionalLight(vNormal, _dLight, specularExponent, diffuse, specular);\n    vec4 color = vec4(max(diffuse,_ambient.xyz),1.0)*mainColor;\n\n    gl_FragColor = texture2D(mainTexture,vUv)*color+vec4(specular*specularColor,0.0);\n}\n "
    },
    "material":{
        "name":"Default material",
        "shader":11,
        "uniforms":{
            "mainColor":{
                "type":35666,
                "value":[
                    1,
                    1,
                    1,
                    1
                ]
            },
            "specularColor":{
                "type":35665,
                "value":[
                    1,
                    1,
                    1
                ]
            },
            "specularExponent":{
                "type":5126,
                "value":[
                    50
                ]
            }
        }
    },
    "textureData":[
        {
            "uid":12,
            "wrapS":10497,
            "wrapT":10497,
            "minFilter":9729,
            "magFilter":9729,
            "generateMipmaps":true,
            "dataURI":"http://www.kickjs.org/images/webgl.png",
            "flipY":true,
            "internalFormat":6408,
            "textureType":3553
        }
    ],
    "settingsData":{
        "meshsetting":"sphere",
        "projection":"orthogonale",
        "rotatemesh":"on",
        "lightpos":[
            1,
            1,
            1
        ],
        "lightrot":[
            0,
            0,
            0
        ],
        "lightcolor":[
            1,
            1,
            1
        ],
        "lightAmbient":[
            0.1,
            0.1,
            0.1
        ],
        "lightintensity":1
    },
    "name":"Transparent phong",
    "about":""
};
var multiTexture = {
    "shader":{
        "uid":18,
        "name":"",
        "blend":false,
        "blendSFactor":770,
        "blendDFactor":771,
        "dataURI":null,
        "depthMask":true,
        "faceCulling":0,
        "fragmentShaderSrc":"precision highp float;\nvarying vec3 vColor;\nvarying vec2 uv;\n\nuniform sampler2D tex;\nuniform sampler2D tex2;\n\nvoid main(void)\n{\n\tgl_FragColor = mix(texture2D(tex2,uv),texture2D(tex,uv),.3)*vec4(vColor, 1.0);\n}\n\t",
        "vertexShaderSrc":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nuniform float _time;\n\nvarying vec2 uv;\nvarying vec3 vColor;\n\n#pragma include \"light.glsl\"\n\n// constants\nvec3 materialColor = vec3(1.0,0.7,0.8);\nvec3 specularColor = vec3(1.0,1.0,1.0);\n\nvoid main(void) {\n\t// compute position\n\tgl_Position = _mvProj * vec4(vertex, 1.0);\n\n\tuv = uv1;\n\t// compute light info\n\tvec3 n = normalize(_norm * normal);\n\tvec3 diffuse;\n\tfloat specular;\n\tfloat glowingSpecular = sin(_time*0.003)*20.0+20.0;\n\tgetDirectionalLight(n, _dLight, glowingSpecular, diffuse, specular);\n\tvColor = max(diffuse,_ambient.xyz)*materialColor+specular*specularColor;\n} ",
        "polygonOffsetEnabled":false,
        "polygonOffsetFactor":2.5,
        "polygonOffsetUnits":10,
        "renderOrder":1000,
        "zTest":513
    },
    "material":{
        "uid":20,
        "name":"Default material",
        "shader":{
            "ref":18,
            "name":"",
            "reftype":"project"
        },
        "uniforms":{
            "tex":{
                "type":35678,
                "value":{
                    "ref":2,
                    "name":"Texture",
                    "reftype":"project"
                }
            },
            "tex2":{
                "type":35678,
                "value":{
                    "ref":22,
                    "name":"Texture",
                    "reftype":"project"
                }
            }
        }
    },
    "textureData":[
        {
            "uid":2,
            "wrapS":10497,
            "wrapT":10497,
            "minFilter":9729,
            "magFilter":9729,
            "name":"Texture",
            "generateMipmaps":true,
            "flipY":true,
            "internalFormat":6408,
            "textureType":3553,
            "dataURI":"http://www.kickjs.org/images/webgl.png"
        },
        {
            "uid":22,
            "wrapS":10497,
            "wrapT":10497,
            "minFilter":9729,
            "magFilter":9729,
            "name":"Texture",
            "generateMipmaps":true,
            "flipY":true,
            "internalFormat":6407,
            "textureType":3553,
            "dataURI":"http://source.theengineer.co.uk/pictures/64x64/2/0/6/2015206_HT-SMOX-Product-Info.pdf---Adobe-Reader.JPG"
        }
    ],
    "settingsData":{
        "meshsetting":"sphere",
        "projection":"orthogonale",
        "rotatemesh":"on",
        "lightrot":[
            0,
            0,
            0
        ],
        "lightcolor":[
            1,
            1,
            1
        ],
        "lightAmbient":[
            0.1,
            0.1,
            0.1
        ],
        "lightintensity":1
    },
    "name":"Multi texture test",
    "about":""
};
