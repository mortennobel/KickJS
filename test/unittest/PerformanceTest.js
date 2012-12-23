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

                // The Great Computer Language Shootout
                // http://shootout.alioth.debian.org/
                //
                // contributed by David Hedbor
                // modified by Isaac Gouy

                mkmatrix: function (rows, cols) {
                    var i, j, count = 1;
                    var m = new Array(rows);
                    for (i = 0; i < rows; i++) {
                        m[i] = new Array(cols);
                        for (j = 0; j < cols; j++) {
                            m[i][j] = count++;
                        }
                    }
                    return m;
                },
                mmult: function (rows, cols,  m1, m2, m3) {
                    var i, j, k, val;
                    for (i = 0; i < rows; i++) {
                        for (j = 0; j < cols; j++) {
                            val = 0;
                            for (k = 0; k < cols; k++) {
                                val += m1[i][k] * m2[k][j];
                            }
                            m3[i][j] = val+0.5;
                        }
                    }
                    return m3;
                },
                mkmatrixOptimizedFloat32: function (rows, cols) {
                    var i, j, count = 1, index=0;
                    var m = new Float32Array(rows*cols);
                    for (i = 0; i < rows; i++) {
                        for (j = 0; j < cols; j++) {
                            m[index++] = count++;
                        }
                    }
                    return m;
                },
                mmultOptimizedFloat32: function (rows, cols,  m1, m2, m3) {
                    var i, j, k, val,iTimesCols = 0,kTimesColsPlusJ = 0;

                    for (i = 0; i < rows; i++) {
                        for (j = 0; j < cols; j++) {
                            val = 0;
                            kTimesColsPlusJ = j;
                            for (k = 0; k < cols; k++) {
                                val += m1[iTimesCols+k] * m2[kTimesColsPlusJ];
                                kTimesColsPlusJ += cols;
                            }
                            m3[iTimesCols+j] = val+0.5;
                        }
                        iTimesCols += cols;
                    }
                    return m3;
                },

                //---------------------------------------------------------------------
                // Test methods - names must begin with "test"
                //---------------------------------------------------------------------


                testTestUnoptimized : function () {
                    var n = 10000,
                            SIZE=32,
                            i,
                            m1 = this.mkmatrix(SIZE, SIZE),
                            m2 = this.mkmatrix(SIZE, SIZE),
                            mm = this.mkmatrix(SIZE, SIZE);

                    for (i = 0; i < n; i++) {
                        this.mmult(SIZE, SIZE, m1, m2, mm);
                    }

                    console.log(mm[0][0], mm[2][3], mm[3][2], mm[4][4]);
                },
                testTestOptimizedFloat32 : function () {
                    var n = 10000,
                            i,
                            SIZE=32,
                            m1 = this.mkmatrixOptimizedFloat32(SIZE, SIZE),
                            m2 = this.mkmatrixOptimizedFloat32(SIZE, SIZE),
                            mm = this.mkmatrixOptimizedFloat32(SIZE, SIZE);

                    for (i = 0; i < n; i++) {
                        this.mmultOptimizedFloat32(SIZE, SIZE, m1, m2, mm);
                    }
                    console.log(mm[0*SIZE+0], mm[2*SIZE+3], mm[3*SIZE+2], mm[4*SIZE+4]);
                }

            });

            var ExampleSuite = new Y.Test.Suite("Example Suite");
            ExampleSuite.add(Y.KICK.math.vec3Test);

            //create the console
            var r = new Y.Console({
                newestOnTop : false,
                style: 'block' // to anchor in the example content
            });

            r.render('#testLogger');

            Y.Test.Runner.add(ExampleSuite);

            //run the tests
            Y.Test.Runner.run();

        });
    });