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
            var engine,canvas;
            Y.KICK.math.vec3Test = new Y.Test.Case({

                //name of the test case - if not provided, one is auto-generated
                name : "obj-import-test",

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

                testImportModel: function () {
                    var Assert = Y.Assert;
                    var objFile = "o Cube\n"+
                            "v 1.000000 -1.000000 -1.000000\n"+
                            "v 1.000000 -1.000000 1.000000\n"+
                            "v -1.000000 -1.000000 1.000000\n"+
                            "v -1.000000 -1.000000 -1.000000\n"+
                            "v 1.000000 1.000000 -1.0\n"+
                            "v 1.0 1.000000 1.000001\n"+
                            "v -1.000000 1.000000 1.000000\n"+
                            "v -1.000000 1.000000 -1.000000\n"+
                            "vt 0.000000 0.000000\n"+
                            "vt 1.000000 0.000000\n"+
                            "vt 1.000000 1.000000\n"+
                            "vt 0.000000 1.000000\n"+
                            "vn 0.000000 -1.000000 0.000000\n"+
                            "vn 0.000000 1.000000 0.000000\n"+
                            "vn 1.000000 0.000000 0.000000\n"+
                            "vn -0.000000 -0.000000 1.000000\n"+
                            "vn -1.000000 -0.000000 -0.000000\n"+
                            "vn 0.000000 0.000000 -1.000000\n"+
                            "usemtl Material\n"+
                            "s off\n"+
                            "f 1/1/1 2/2/1 3/3/1 4/4/1\n"+
                            "f 5/1/2 8/2/2 7/3/2 6/4/2\n"+
                            "f 1/1/3 5/2/3 6/3/3 2/4/3\n"+
                            "f 2/1/4 6/2/4 7/3/4 3/4/4\n"+
                            "f 3/1/5 7/2/5 8/3/5 4/4/5\n"+
                            "f 5/1/6 1/2/6 4/3/6 8/4/6";
                    var obj = KICK.importer.ObjImporter.import(objFile, engine.activeScene);
                    Assert.areEqual(obj.mesh.length, 1);
                    var mesh = obj.mesh[0];
                    var meshData = mesh.meshData;
                    var normal = new Float32Array(meshData.normal);
                    meshData.recalculateNormals ();
                    var recalculatedNormal = new Float32Array(meshData.normal);
                    for (var i=0;i<recalculatedNormal.length;i++){
                        Assert.compareFloat(normal[i], recalculatedNormal[i], "Index "+i+ " "+normal[i]+"  "+ recalculatedNormal[i]);
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