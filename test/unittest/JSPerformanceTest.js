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
            var length = 10000000;
            var largeArrayA = new Array(length);
            var largeArrayB = new Array(length);
            var largeArrayDouble = new Array(length);
            var largeArrayFloat64 = new Float64Array(length);
            var largeArrayFloat32 = new Float32Array(length);
            var largeArrayInt8 = new Uint8Array(length);
            var vec3 = KICK.math.Vec3;

            var createRandomObject = function(i){
                if (Math.random()<0.3){
                    return ""+Math.round( Math.random()*i);
                } else if (Math.random()<0.3){
                    largeArrayA[i] = {};
                } else {
                    return Math.round( Math.random()*i);
                }
            };

            function reflect(L, N){
            	var lDotN = vec3.dot(L,N); // Allocate primitive (stack)
            	var lDotN2 = - 2 * lDotN; // Allocate primitive (stack)
            	var scaledNormal = vec3.scale(N,lDotN2,vec3.create()); // allocate temporary (heap)
            	return vec3.subtract(L,scaledNormal,vec3.create()); // allocate result
            }

            function reflectOptimized(L, N, res){ // res is optional
            	if (!res) res = vec3.create(); // allocate res if not specified
            	var lDotN = vec3.dot(L,N); // Allocate primitive (stack)
            	var lDotN2 = - 2 * lDotN; // Allocate primitive (stack)
            	// use res as a temporary variable
            	// scaledNormal now points to the same object as res
            	// but is keeped for readability
            	var scaledNormal = vec3.scale(N,lDotN2, res);
            	return vec3.subtract(L,scaledNormal,res);
            }


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
                    /*for (var i=0;i<largeArrayA.length;i++){
                        largeArrayA[i] = createRandomObject(i);
                        largeArrayB[i] = createRandomObject(i);
                        largeArrayDouble[i] = i*0.5;
                        largeArrayFloat32[i] = i*0.5;
                        largeArrayFloat64[i] = i*0.5;
                        largeArrayInt8[i] = i*0.5;
                    }*/
                },

                /*
                 * Cleans up everything that was created by setUp().
                 */
                tearDown : function () {
                },

                //---------------------------------------------------------------------
                // Test methods - names must begin with "test"
                //---------------------------------------------------------------------
                testNumberPresicion: function(){
                    var Assert = Y.Assert;
                    // test that the browser is actually performing all calculations with double presicion
                    var x = [12345678,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1];
                    var y = new Float32Array(x);
                    // if this calculation is done with only single precision, you will end up with only y[0], since
                    // all other values are rounded to zero
                    var sumY = y[0]+y[1]+y[2]+y[3]+y[4]+y[5]+y[6]+y[7]+y[8]+y[9]+y[10];
                    Assert.areNotEqual(sumY, y[0], "Browser does not perform calculations with double presision");
                },
                testReflectSimple: function () {
                    var sum = 0;
                    var result = vec3.create();
                    var L = vec3.create([1,2,3]);
                    var N = vec3.create([0,1,0]);
                    for (var i=0;i<length;i++){
                        result = reflect(L,N);
                        sum += result[0];
                    }
                    console.log("Equal "+sum);
                },
                testReflectAdvanced: function () {
                    var sum = 0;
                    var result = vec3.create();
                    var L = vec3.create([1,2,3]);
                    var N = vec3.create([0,1,0]);
                    for (var i=0;i<length;i++){
                        result = reflectOptimized(L,N,result);
                        sum += result[0];
                    }
                    console.log("Equal "+sum);
                },
                testTestImplicitTypecast: function () {
                    var equal = 0;
                    for (var i=0;i<largeArrayA.length;i++){
                        if (largeArrayA[i] == largeArrayB[i]){
                            equal++;
                        }
                    }
                    console.log("Equal "+equal);
                },
                testTestNoImplicitTypecast: function () {
                    var equal = 0;
                    for (var i=0;i<largeArrayA.length;i++){
                        if (largeArrayA[i] === largeArrayB[i]){
                            equal++;
                        }
                    }
                    console.log("Equal "+equal);
                },
                testArraySum: function () {
                    var sum = 0;
                    for (var i=0;i<largeArrayDouble.length;i++){
                        sum += largeArrayDouble[i];
                    }
                    console.log("Equal "+sum);
                },
                testArrayFloat32Sum: function () {
                    var sum = 0;
                    for (var i=0;i<largeArrayFloat32.length;i++){
                        sum += largeArrayFloat32[i];
                    }
                    console.log("Equal "+sum);
                },
                testArrayFloat64Sum: function () {
                    var sum = 0;
                    for (var i=0;i<largeArrayFloat64.length;i++){
                        sum += largeArrayFloat64[i];
                    }
                    console.log("Equal "+sum);
                },
                testArrayUint8Sum: function () {
                    var sum = 0;
                    for (var i=0;i<largeArrayInt8.length;i++){
                        sum += largeArrayInt8[i];
                    }
                    console.log("Equal "+sum);
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