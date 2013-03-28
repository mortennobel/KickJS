requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "kick",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        kick: '../../../../src/js/kick'
    }
});

// Start the main app logic.
requirejs(['kick'],
    function (KICK) {

YUI().use('node', 'console', 'test', function (Y) {
    "use strict";
    Y.namespace("KICK.engine");
    var engine,canvas;
    Y.KICK.engine.engineTest = new Y.Test.Case({

        //name of the test case - if not provided, one is auto-generated
        name : "engineTest",


        //---------------------------------------------------------------------
        // setUp and tearDown methods - optional
        //---------------------------------------------------------------------

        /*
         * Sets up data that is needed by each test.
         */
        setUp : function () {
            if (!canvas){
                canvas = document.createElement("canvas");
                canvas.width = 10;
                canvas.height = 10;
                document.body.appendChild(canvas);
            }
            engine = new KICK.core.Engine(canvas);
        },

        /*
         * Cleans up everything that was created by setUp().
         */
        tearDown : function () {
            engine.paused = true;
        },

        //---------------------------------------------------------------------
        // Test methods - names must begin with "test"
        //---------------------------------------------------------------------
        testResourceDescriptor : function () {
            var Assert = Y.Assert;

            var resourceDescriptorConfig = {
                "type": "kick.scene.Scene",
                "uid": 1,
                "config": {
                    "uid": 1,
                    "gameObjects": [
                        {
                            "name": "Triangle",
                            "layer": 1,
                            "uid": 10,
                            "components": [
                                {
                                    "type": "kick.scene.Transform",
                                    "uid": 18,
                                    "config": {
                                        "localPosition": [
                                            -2,
                                            0,
                                            0
                                        ],
                                        "localRotation": [
                                            0,
                                            0,
                                            0,
                                            1
                                        ],
                                        "localScale": [
                                            1,
                                            1,
                                            1
                                        ],
                                        "parent": null
                                    }
                                }]
                        }]
                }
            };
            var materialDescriptor = new KICK.core.ResourceDescriptor(resourceDescriptorConfig);
            materialDescriptor.instantiate(function(object){
                console.log("Loaded successfully");
            }, function(){
                console.log("Failed loading resource");
                Assert.fail("testResourceDescriptor failed");
            })

        },
        testLoadMesh : function () {
            var Assert = Y.Assert;

            var mesh = engine.project.load(engine.project.ENGINE_MESH_CUBE);
            Assert.areEqual(engine.project.ENGINE_MESH_CUBE,mesh.uid);
        },
        testLoadShader : function(){
            var Assert = Y.Assert;
            var shader = engine.project.load(engine.project.ENGINE_SHADER_DEFAULT);
            Assert.areEqual(engine.project.ENGINE_SHADER_DEFAULT,shader.uid );
        },
        testLoadTexture : function(){
            var Assert = Y.Assert;
            var texture = engine.project.load(engine.project.ENGINE_TEXTURE_GRAY);
            Assert.areEqual(engine.project.ENGINE_TEXTURE_GRAY,texture.uid);
        },
        testComputeNormalsDegenerateTriangle : function(){
            var Assert = Y.Assert;
            var meshData =  new KICK.mesh.MeshData({
                            name: "Triangle",
                            vertex: [
                                0, 0, 0,
                                0, 0, 0,
                                9984, 2007, 8047
                            ],
                            uv1: [
                                0.5, 1,
                                0.125, 0.25,
                                1 - 0.125, 0.25
                            ],
                            normal: [
                                0, 0, 1,
                                0, 0, 1,
                                0, 0, 1
                            ],
                            indices: [0, 1, 2]
                        });
            meshData.recalculateNormals();
            for (var i=0;i<9;i++){
                Assert.areEqual(0, meshData.normal[i]);
            }
        },
        testLoadProject : function(){
            var Assert = Y.Assert;
            var projectConfig = {
                   "engineVersion": "0.3.0",
                   "maxUID": 28,
                   "activeScene": 1,
                   "resourceDescriptors": [
                      {
                         "type": "kick.scene.Scene",
                         "uid": 1,
                         "config": {
                            "uid": 1,
                            "gameObjects": [
                               {
                                  "name": "Triangle",
                                  "layer": 1,
                                  "uid": 10,
                                  "components": [
                                     {
                                        "type": "kick.scene.Transform",
                                        "uid": 18,
                                        "config": {
                                           "localPosition": [
                                              -2,
                                              0,
                                              0
                                           ],
                                           "localRotation": [
                                              0,
                                              0,
                                              0,
                                              1
                                           ],
                                           "localScale": [
                                              1,
                                              1,
                                              1
                                           ],
                                           "parent": null
                                        }
                                     },
                                     {
                                        "type": "kick.scene.MeshRenderer",
                                        "uid": 11,
                                        "config": {
                                           "materials": [
                                              {
                                                 "ref": 8,
                                                 "name": "White material",
                                                 "reftype": "project"
                                              }
                                           ],
                                           "mesh": {
                                              "ref": -300,
                                              "name": "Triangle",
                                              "reftype": "project"
                                           },
                                           "uid": 11,
                                           "scriptPriority": 0
                                        }
                                     }
                                  ]
                               },
                               {
                                  "name": "Cube",
                                  "layer": 1,
                                  "uid": 12,
                                  "components": [
                                     {
                                        "type": "kick.scene.Transform",
                                        "uid": 19,
                                        "config": {
                                           "localPosition": [
                                              2,
                                              0,
                                              0
                                           ],
                                           "localRotation": [
                                              0,
                                              0,
                                              0,
                                              1
                                           ],
                                           "localScale": [
                                              1,
                                              1,
                                              1
                                           ],
                                           "parent": null
                                        }
                                     },
                                     {
                                        "type": "kick.scene.MeshRenderer",
                                        "uid": 13,
                                        "config": {
                                           "materials": [
                                              {
                                                 "ref": 9,
                                                 "name": "Gray material",
                                                 "reftype": "project"
                                              }
                                           ],
                                           "mesh": {
                                              "ref": -303,
                                              "name": "Cube",
                                              "reftype": "project"
                                           },
                                           "uid": 13,
                                           "scriptPriority": 0
                                        }
                                     }
                                  ]
                               },
                               {
                                  "name": "Camera",
                                  "layer": 1,
                                  "uid": 14,
                                  "components": [
                                     {
                                        "type": "kick.scene.Transform",
                                        "uid": 20,
                                        "config": {
                                           "localPosition": [
                                              0,
                                              1,
                                              10
                                           ],
                                           "localRotation": [
                                              0,
                                              0,
                                              0,
                                              1
                                           ],
                                           "localScale": [
                                              1,
                                              1,
                                              1
                                           ],
                                           "parent": null
                                        }
                                     },
                                     {
                                        "type": "kick.scene.Camera",
                                        "uid": 15,
                                        "config": {
                                           "enabled": true,
                                           "renderShadow": false,
                                           "renderer": "kick.renderer.ForwardRenderer",
                                           "layerMask": 4294967295,
                                           "renderTarget": null,
                                           "fieldOfView": 60,
                                           "near": 0.1,
                                           "far": 1000,
                                           "perspective": true,
                                           "left": -1,
                                           "right": 1,
                                           "bottom": -1,
                                           "top": 1,
                                           "cameraIndex": 1,
                                           "clearColor": [
                                              0,
                                              0,
                                              0,
                                              1
                                           ],
                                           "clearFlagColor": true,
                                           "clearFlagDepth": true,
                                           "normalizedViewportRect": [
                                              0,
                                              0,
                                              1,
                                              1
                                           ]
                                        }
                                     }
                                  ]
                               }
                            ],
                            "name": "Scene"
                         }
                      },
                      {
                         "type": "KICK.material.Material",
                         "uid": 8,
                         "config": {
                            "uid": 8,
                            "name": "White material",
                            "shader": {
                               "ref": -102,
                               "name": "Unlit",
                               "reftype": "project"
                            },
                            "uniforms": {
                               "mainColor": {
                                  "type": 35665,
                                  "value": [
                                     1,
                                     1,
                                     1,
                                     1
                                  ]
                               },
                               "mainTexture": {
                                  "type": 35678,
                                  "value": {
                                     "ref": -201,
                                     "name": "White",
                                     "reftype": "project"
                                  }
                               }
                            }
                         }
                      },
                      {
                         "type": "kick.material.Material",
                         "uid": 9,
                         "config": {
                            "uid": 9,
                            "name": "Gray material",
                            "shader": {
                               "ref": -102,
                               "name": "Unlit",
                               "reftype": "project"
                            },
                            "uniforms": {
                               "mainColor": {
                                  "type": 35665,
                                  "value": [
                                     1,
                                     1,
                                     1,
                                     1
                                  ]
                               },
                               "mainTexture": {
                                  "type": 35678,
                                  "value": {
                                     "ref": -202,
                                     "name": "Gray",
                                     "reftype": "project"
                                  }
                               }
                            }
                         }
                      }
                   ]
                };
            engine.project.loadProject(projectConfig);
            var expectedValue = 1; // since the project only contains a single scene, no other scene should be added
            Assert.areEqual(expectedValue,engine.project.getResourceDescriptorsByType("kick.scene.Scene").length);
            var expectedUid = 1;
            Assert.areEqual(expectedUid,engine.activeScene.uid);
        },
        testGetDefaultAssets: function(){
            var Assert = Y.Assert;
            var isAllNegativeUIDSAndHaveName = function(array){
                for (var i=0;i<array.length;i++){
                    Assert.isTrue(array[i].config.uid < 0);
                    Assert.isTrue(array[i].name && array[i].name.length > 0);
                    Assert.isTrue(array[i].name.charAt(1).toLowerCase() == array[i].name.charAt(1));
                }
            };
            var meshes = engine.project.getResourceDescriptorsByType("kick.mesh.Mesh")
            Assert.areEqual(0,meshes.length);
            meshes = engine.project.getEngineResourceDescriptorsByType("kick.mesh.Mesh");
            Assert.areNotEqual(0,meshes.length);
            isAllNegativeUIDSAndHaveName(meshes);

            var textures = engine.project.getResourceDescriptorsByType("kick.texture.Texture")
            Assert.areEqual(0,textures.length);
            textures = engine.project.getEngineResourceDescriptorsByType("kick.texture.Texture");
            Assert.areNotEqual(0,textures.length);
            isAllNegativeUIDSAndHaveName(textures);

            var shaders = engine.project.getResourceDescriptorsByType("kick.material.Shader")
            Assert.areEqual(0,shaders.length);
            shaders = engine.project.getEngineResourceDescriptorsByType("kick.material.Shader");
            Assert.areNotEqual(0,shaders.length);
            isAllNegativeUIDSAndHaveName(shaders);
        },
        testProjectLoadShouldNotChangeConfigObj:function(){
            var Assert = Y.Assert;
            var before = JSON.stringify(pointProject,null,3);
            engine.project.loadProject(pointProject);
            var after = JSON.stringify(pointProject,null,3);
            Assert.areEqual(before,after);
        },
        testDeepCopy:function(){
            var Assert = Y.Assert;
            var deepCopy = KICK.core.Util.deepCopy;
            var simpleObj = {test:"Simple"};
            var simpleObjCopy = deepCopy(simpleObj);
            Assert.areEqual(simpleObj.test,simpleObjCopy.test);
            var deepObj = {test:{test:"Deep"}};
            var deepObjCopy = deepCopy(deepObj);
            Assert.areEqual(deepObj.test.test,deepObjCopy.test.test);
            var number = 123;
            var numberCopy = deepCopy(number);
            Assert.areEqual(number,numberCopy);
            var array = [1,{test:1},"test"];
            var arrayCopy = deepCopy(array);
            Assert.areEqual(array[0],arrayCopy[0]);
            Assert.areEqual(array[1].test,arrayCopy[1].test);
            Assert.areEqual(array[2],arrayCopy[2]);
            Assert.areNotSame(array,arrayCopy);
        },
        testKeepTransformParent:function(){
            var Assert = Y.Assert;

            engine.project.loadProject(pointProject);
            var red = engine.activeScene.getGameObjectByName('Red');
            var green = engine.activeScene.getGameObjectByName('Green');
            red.transform.parent = green.transform;
            var seralizedProject = engine.project.toJSON();
            engine.project.loadProject(seralizedProject);
            console.log(JSON.stringify(seralizedProject, null,3));
            red = engine.activeScene.getGameObjectByName('Red');
            green = engine.activeScene.getGameObjectByName('Green');
            Assert.areSame(red.transform.parent, green.transform);
        },
        testDefaultShaderValue:function(){
            var Assert = Y.Assert;

            var shader = new KICK.material.Shader();

            shader.vertexShaderSrc = "attribute vec3 vertex;\n"+
                "uniform mat4 _mvProj;\n"+
                "void main(void) {\n"+
                "   gl_Position = _mvProj * vec4(vertex, 1.0);\n"+
                "}";
            shader.fragmentShaderSrc = "precision highp float;\n"+
                "uniform vec4 color;\n"+
                "void main(void){\n"+
                "   gl_FragColor = color;\n"+
            	"}";
            shader.errorLog = function(msg){Assert.fail(msg);};
            shader.name = "Depth";
            shader.apply();

            Assert.isNotUndefined(shader.defaultUniforms,"#1");
            Assert.isNotUndefined(shader.defaultUniforms.color,"#2"+JSON.stringify(shader.defaultUniforms));
            Assert.isTrue(shader.defaultUniforms.color instanceof Float32Array,"#3");
            Assert.isTrue(shader.defaultUniforms.color.length==4,"#4");
        },
        testUniformShaderValue:function(){
            var Assert = Y.Assert;

            var shader = new KICK.material.Shader();

            shader.vertexShaderSrc = "attribute vec3 vertex;\n"+
                    "uniform mat4 _mvProj;\n"+
                    "void main(void) {\n"+
                    "   gl_Position = _mvProj * vec4(vertex, 1.0);\n"+
                    "}";
            shader.fragmentShaderSrc = "precision highp float;\n"+
                    "uniform vec4 color;\n"+
                    "void main(void){\n"+
                    "   gl_FragColor = color;\n"+
                    "}";
            shader.errorLog = function(msg){Assert.fail(msg);};
            shader.name = "Depth";
            shader.apply();
            Assert.isTrue(Array.isArray(shader.engineUniforms) ,"#1");
            Assert.isTrue(Array.isArray(shader.materialUniforms) ,"#2");
            Assert.areEqual(1,shader.engineUniforms.length, "#3");
            Assert.areEqual(1,shader.materialUniforms.length ,"#4");
            Assert.areEqual("_mvProj",shader.engineUniforms[0].name, "#3");
            Assert.areEqual("color",shader.materialUniforms[0].name, "#4");

        },
        testRenderOrder: function (){
            var kick = KICK;
            var vertexShaderStr = "attribute vec3 vertex;\n"+
                "uniform mat4 _mvProj;\n"+
                "void main(void) {\n"+
                "    gl_Position = _mvProj * vec4(vertex, 1.0);\n"+
                "}";
            var fragmentShaderStr = "uniform highp float _time;\n"+
                "void main(void) {\n"+
                "  highp float fraction = mod(_time/1000.0,1.0);\n"+
                "  gl_FragColor = vec4(fraction,fraction,fraction, 1.0);\n"+
                "}";
            var shader1 = new kick.material.Shader({
                     vertexShaderSrc: vertexShaderStr,
                     fragmentShaderSrc: fragmentShaderStr
                 });
            shader1.renderOrder = 1;
            var shader2 = new kick.material.Shader({
                     vertexShaderSrc: vertexShaderStr,
                     fragmentShaderSrc: fragmentShaderStr
                 });

            shader2.renderOrder = 2;
            var material = new kick.material.Material();
            material.shader = shader1;
            var material2 = new kick.material.Material();
            material2.shader = shader1;

            Y.Assert.areEqual(1, material.renderOrder);
            material.shader = shader2;
            Y.Assert.areEqual(2, material.renderOrder);

            // check render order of meshRenderer
            var meshRenderer = new kick.scene.MeshRenderer();
            meshRenderer = new kick.scene.MeshRenderer();
            meshRenderer.material = material;
            Y.Assert.areEqual(2, meshRenderer.renderOrder);

            meshRenderer.material = material2;
            Y.Assert.areEqual(1, meshRenderer.renderOrder);
            material2.shader = shader2;
            Y.Assert.areEqual(2, material2.renderOrder);
            Y.Assert.areEqual(2, meshRenderer.renderOrder);
            shader2.renderOrder = 3;
            Y.Assert.areEqual(3, material2.renderOrder, "material2 has renderorder 3");
            Y.Assert.areEqual(3, meshRenderer.renderOrder, "meshrenderer has renderorder 3");
        },
        testObservable: function(){
            var kick = KICK;
            var observable = new kick.core.Observable(["Foo"]);
            Y.Assert.isUndefined(observable.getObservers("Unused"), "Observable must return a undefined on non-registered event names");
            var fooValue = 0;
            var eventListener = function(v){fooValue = v;};
            observable.addEventListener("Foo", eventListener);
            Y.Assert.areEqual(0, fooValue);
            observable.fireEvent("Foo", 1);
            Y.Assert.areEqual(1, fooValue);
            observable.removeEventListener("Foo", eventListener);
            observable.fireEvent("Foo", 2);
            Y.Assert.areEqual(1, fooValue);

            observable.Foo = eventListener;
            observable.fireEvent("Foo", 3);
            Y.Assert.areEqual(3, fooValue);
        },
        testObservableMixin: function(){
            var kick = KICK;
            var observable = {};
            kick.core.Observable.call(observable,["Foo"]);
            Y.Assert.isUndefined(observable.getObservers("Unused"), "Observable must return a undefined on non-registered event names");
            var fooValue = 0;
            var eventListener = function(v){fooValue = v;};
            observable.addEventListener("Foo", eventListener);
            Y.Assert.areEqual(0, fooValue);
            observable.fireEvent("Foo", 1);
            Y.Assert.areEqual(1, fooValue);
            observable.removeEventListener("Foo", eventListener);
            observable.fireEvent("Foo", 2);
            Y.Assert.areEqual(1, fooValue);

            observable.Foo = eventListener;
            observable.fireEvent("Foo", 3);
            Y.Assert.areEqual(3, fooValue);
        },
        testObservableMeshRenderer: function(){
            var kick = KICK;
            var meshRenderer = new kick.scene.MeshRenderer();
            var value = 1;
            var updateValue = function(){
                value = 2;
            };
            var project = engine.project;
            var material = new KICK.material.Material({
                  shader: project.load(project.ENGINE_SHADER_DIFFUSE),
                     uniformData:{
                          mainColor:[1.0,0.0,0.9,0.5],
                          mainTexture: project.load(project.ENGINE_TEXTURE_WHITE)
                      }
                  });
            meshRenderer.addEventListener("componentUpdated", updateValue);
            meshRenderer.material = material; // invokes componentUpdated
            Y.Assert.areEqual(2, value);
        }
    });

    /**
     * Assumes that the quaternions is normalized
     * @param expected
     * @param actual
     * @param message
     */
    Y.Assert.compareQuat = function(expected,actual, message){
        var quat = KICK.math.Quat;
        var epsilon = 0.001;
        var message = "Expected \n"+KICK.math.vec4.str(expected)+" \nActual \n"+KICK.math.vec4.str(actual);
        var isEqual = function(quat){
            for (var i=0;i<4;i++){
                if (Math.abs(expected[i]-quat[i])>epsilon){
                    return false;
                }
            }
            return true;
        };
        if (isEqual(actual)){
            return;
        }
        var actualAlternative = quat.clone([actual[0]*-1,actual[1]*-1,actual[2]*-1,actual[3]*-1]);
        if (isEqual(actualAlternative)){
            return;
        }
        Y.Assert.isTrue(false,message);
    };

    /// extend Asset to compare float values
    Y.Assert.compareVec = function(expected,actual,message){
        if (!message){
            if (expected.length==3){
                message = "Expected "+KICK.math.vec3.str(expected)+" Actual "+KICK.math.vec3.str(actual);
            }
        }
        var vectorType;
        if (expected.length==2){
            vectorType = KICK.math.vec2;
        } else if (expected.length==3){
            vectorType = KICK.math.vec3;
        } else if (expected.length==4){
            vectorType = KICK.math.vec4;
        }
        if (vectorType){
            Y.Assert.isTrue(vectorType.equal(expected,actual,0.001),message);
        } else {
            for (var i=0;i<expected.length;i++){
                Y.Assert.compareFloat(expected[i],actual[i],message);
            }
        }
    };
    Y.Assert.compareFloat = function(f1,f2,message){
        var epsilon = 0.001;
        var res = Math.abs(f1-f2)<epsilon;
        if (!res){
            debugger;
        }
        return Y.Assert.isTrue(res,message);
    };

    var ExampleSuite = new Y.Test.Suite("Example Suite");
    ExampleSuite.add(Y.KICK.engine.engineTest);



    //create the console
    var r = new Y.Console({
        newestOnTop : false,
        style: 'block', // to anchor in the example content,
        width: 600,
        height: 600
    });

    r.render('#testLogger');

    Y.Test.Runner.add(ExampleSuite);

    //run the tests
    Y.Test.Runner.run();

});
    });