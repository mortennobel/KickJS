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

                Y.namespace("KICK.math");

                Y.KICK.math.vec3Test = new Y.Test.Case({

                    //name of the test case - if not provided, one is auto-generated
                    name : "vec3test",

                    //---------------------------------------------------------------------
                    // setUp and tearDown methods - optional
                    //---------------------------------------------------------------------

                    /*
                     * Sets up data that is needed by each test.
                     */
                    setUp : function () {
                    },

                    /*
                     * Cleans up everything that was created by setUp().
                     */
                    tearDown : function () {
                    },

                    //---------------------------------------------------------------------
                    // Test methods - names must begin with "test"
                    //---------------------------------------------------------------------

                    testRecalculateNormals: function () {
                        var Assert = Y.Assert;

                        var meshData = new KICK.mesh.MeshData();
                        meshData.vertex = [0,0,0,
                                           1,0,0,
                                           0,0,-1];
                        meshData.indices = [0,1,2];
                        meshData.recalculateNormals();
                        Assert.compareVec([0,1,0],meshData.normal);
                        Assert.compareFloat(meshData.normal.length,meshData.vertex.length);
                    },
                    testInterleavedArray: function () {
                        var Assert = Y.Assert;

                        var meshData = new KICK.mesh.MeshData();
                        meshData.vertex = [0,0,0,
                                           1,0,0,
                                           0,0,-1];
                        meshData.indices = [0,1,2];
                        meshData.recalculateNormals();
                        var interleavedBytes = meshData.interleavedArray;
                        Assert.isTrue(interleavedBytes instanceof ArrayBuffer,"interleavedBytes instanceof ArrayBuffer");
                        Assert.isTrue(!(interleavedBytes instanceof Float32Array),"!(interleavedBytes instanceof Float32Array)");
                        var interleaved = new Float32Array(interleavedBytes);

                        var numberOfElements = meshData.vertex.length + meshData.normal.length;
                        Assert.compareFloat(numberOfElements, interleaved.length,"Wrong data length. Was "+interleaved.length+" expected "+numberOfElements);
                        var vertexAttrLength = meshData.vertexAttrLength/4;

                        for (var i=0;i<interleaved.length/vertexAttrLength;i++){
                            var offset = i*vertexAttrLength;
                            for (var j=0;j<3;j++){
                                Assert.compareFloat(meshData.vertex[i*3+j], interleaved[offset+j]);
                                Assert.compareFloat(meshData.normal[i*3+j], interleaved[offset+3+j]);

                            }
                        }
                    },
                    // test that ints in interleaved arrays
                    testInt32: function () {
                        var Assert = Y.Assert;

                        var meshData = new KICK.mesh.MeshData();
                        meshData.vertex = [0,0,0,
                                           1,0,0,
                                           0,0,-1];
                        meshData.int1 = [1,2,-3];
                        meshData.indices = [0,1,2];

                        var interleavedBytes = meshData.interleavedArray;
                        var vertexAttrLength = meshData.vertexAttrLength;
                        Assert.compareFloat(vertexAttrLength, (3+1)*4);
                        var length = interleavedBytes.byteLength;
                        Assert.compareFloat(length, (meshData.vertex.length+meshData.int1.length)*4,"data length");
                        for (var i=0;i<3;i++){
                            var offset = i*vertexAttrLength;
                            var floatArray = new Float32Array(interleavedBytes,offset);
                            for (var j=0;j<3;j++){
                                Assert.compareFloat(floatArray[j],meshData.vertex[i*3+j] );
                            }
                            var intArray = new Int32Array(interleavedBytes,offset+3*4);
                            Assert.compareFloat(intArray[0],meshData.int1[i]);
                        }
                    },
                    // test that ints in interleaved arrays
                    testInt32Combine: function () {
                        var Assert = Y.Assert;

                        var meshData1 = new KICK.mesh.MeshData();
                        meshData1.vertex = [0,0,0,
                                           1,0,0,
                                           0,0,-1];
                        meshData1.int1 = [1,2,-3];
                        meshData1.indices = [0,1,2];

                        var meshData2 = new KICK.mesh.MeshData();
                        meshData2.vertex = [0,2,0,
                                           1,2,0,
                                           0,2,-1];
                        meshData2.int1 = [5,6,7];
                        meshData2.indices = [0,1,2];

                        var matrix = KICK.math.Mat4.create();
                        KICK.math.Mat4.identity(matrix);

                        var meshData3 = meshData1.combine(meshData2,matrix);

                        Assert.isTrue(meshData3 !== null);
                        Assert.isTrue(meshData3.vertex !== null,"vertex should be defined");
                        Assert.compareFloat(meshData3.vertex.length, 9*2,"vertex");
                        Assert.compareFloat(meshData3.int1.length, 3*2,"int");
                        Assert.compareFloat(meshData3.indices.length, 3*2,"indices");

                        var interleavedBytes = meshData3.interleavedArray;
                        var vertexAttrLength = meshData3.vertexAttrLength;

                        Assert.compareFloat(vertexAttrLength, (3+1)*4);
                        var length = interleavedBytes.byteLength;
                        Assert.compareFloat(length, (meshData1.vertex.length+meshData1.int1.length)*4*2,"data length");
                    },
                    // Test that a mesh can be transformed using the function MeshData.transform
                    testMeshDataTransform: function () {
                       var Assert = Y.Assert;

                        var meshData1 = new KICK.mesh.MeshData();
                        meshData1.vertex = [0,0,0,
                                           1,0,0,
                                           0,0,-1];
                        meshData1.int1 = [1,2,-3];
                        meshData1.indices = [0,1,2];

                        var mat = KICK.math.Mat4.create();
                        KICK.math.Mat4.identity(mat);
                        var translateVector = [1,2,3];
                        KICK.math.Mat4.translate(mat, mat, translateVector);
                        var meshData2 = meshData1.transform(mat);

                        for (var i=0;i<3;i++){
                            var index = i*3;
                            for (var j=0;j<3;j++){
                                Y.Assert.compareFloat(meshData1.vertex[index+j]+translateVector[j],meshData2.vertex[index+j]);
                            }
                        }
                    },
                    // Test that mesh attributes can be extracted from a compact representation
                    // of interleavedArray and description
                    testMeshVertexFromInterleavedArray: function () {
                       var Assert = Y.Assert;

                        var meshData1 = new KICK.mesh.MeshData();
                        meshData1.vertex = [0,0,0,
                                           1,0,0,
                                           0,0,-1];
                        meshData1.int1 = [1,2,-3];
                        meshData1.indices = [0,1,2];

                        var config = {
                            interleavedArray: meshData1.interleavedArray,
                            vertexAttrLength: meshData1.vertexAttrLength,
                            interleavedArrayFormat: meshData1.interleavedArrayFormat,
                            indices: meshData1.indices
                        };

                        var meshData2 = new KICK.mesh.MeshData(config);

                        var mesh2Vertex = meshData2.vertex;
                        Y.Assert.compareFloat(mesh2Vertex.length,meshData1.vertex.length);
                        for (var i = 0;i<mesh2Vertex.length;i++){
                            Y.Assert.compareFloat(mesh2Vertex[i],meshData1.vertex[i]);
                        }
                        var mesh2int1 = meshData2.int1;
                        for (var i = 0;i<mesh2int1.length;i++){
                            Y.Assert.compareFloat(mesh2int1[i],meshData1.int1[i]);
                        }
                    },
                    // test that two cube can be combined
                    testCubeCombine: function () {
                        var Assert = Y.Assert;

                        var meshData1 = KICK.mesh.MeshFactory.createCubeData(0.5);
                        var meshData2 = KICK.mesh.MeshFactory.createCubeData(0.5);

                        var matrix = KICK.math.Mat4.create();
                        KICK.math.Mat4.identity(matrix);

                        var meshData3 = meshData1.combine(meshData2,matrix);

                        Assert.isTrue(meshData3 !== null);
                        Assert.isTrue(meshData3.vertex !== null,"vertex should be defined");
                        Assert.compareFloat(meshData3.vertex.length, meshData1.vertex.length*2,"vertex");
                        Assert.compareFloat(meshData3.color.length, meshData1.color.length*2,"vertex");
                        Assert.compareFloat(meshData3.indices.length, meshData1.indices.length*2,"indices");
                        Assert.isTrue(meshData3.isValid());
                    },
                    testSerialize: function () {
                        var Assert = Y.Assert;

                        var meshData1 = KICK.mesh.MeshFactory.createCubeData(0.5);
                        var meshData1Serialized = meshData1.serialize();
                        var meshData2 = new KICK.mesh.MeshData();
                        meshData2.deserialize(meshData1Serialized);

                        var meshData1Vertex = meshData1.vertex;
                        var meshData2Vertex = meshData2.vertex;

                        Assert.isTrue(typeof(meshData1Vertex) === "object","meshData1Vertex");
                        Assert.isTrue(typeof(meshData2Vertex) === "object","meshData2Vertex");
                        Assert.isTrue(meshData1Vertex.length === meshData2Vertex.length);
                        for (var i=0;i<meshData1Vertex.length;i++){
                            Assert.isTrue(meshData1Vertex[i]=== meshData2Vertex[i]);
                        }
                    }
                });

                /// extend Asset to compare float values
                Y.Assert.compareVec = function(f1,f2,message){
                    if (!message){
                        if (f1.length==3){
                            message = "Expected "+KICK.math.Vec3.str(f1)+" Actual "+KICK.math.Vec3.str(f2);
                        }
                    }
                    for (var i=0;i<f1.length;i++){
                        Y.Assert.compareFloat(f1[i],f2[i],message);
                    }
                };
                Y.Assert.compareFloat = function(f1,f2,message){
                    var epsilon = 0.001;
                    if (!message){
                        message = "f1 "+f1+" f2 "+f2;
                    }
                    var bool = Math.abs(f1-f2)<epsilon;
                    if (!bool){
                        debugger;
                    }
                    return Y.Assert.isTrue(bool,message);
                };

                var ExampleSuite = new Y.Test.Suite("Example Suite");
                ExampleSuite.add(Y.KICK.math.vec3Test);

                //create the console
                var r = new Y.Console({
                    newestOnTop : false,
                    style: 'block', // to anchor in the example content,
                    width: 600,
                    height: 600
                });

                r.render('#testLogger');

                window.logger = r;

                Y.Test.Runner.add(ExampleSuite);

                //run the tests
                Y.Test.Runner.run();

            });
    });