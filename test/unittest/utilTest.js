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

                testInsertionSort : function () {
                    var Assert = Y.Assert;
                    var i;
                    var sortFunction = function (a,b) {
                        return a-b;
                    };
                    var shuffle = function (o) {
                        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                        return o;
                    }
                    var array = [-1,3,2,4,99,-12,23,33,11,-6,10];
                    shuffle(array);
                    var sortedArray = [];
                    for (i=0;i<array.length;i++) {
                        KICK.core.Util.insertSorted(array[i],sortedArray,sortFunction);
                    }
                    for (i=1;i<array.length;i++){
                        Assert.isTrue(sortedArray[i-1]<sortedArray[i],JSON.stringify(sortedArray));
                    }

                },
                testInsertionSortDefaultSortFunc  : function () {
                    var Assert = Y.Assert;
                    var i;
                    var shuffle = function (o) {
                        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                        return o;
                    }
                    var array = [-1,3,2,4,99,-12,23,33,11,-6,10];
                    shuffle(array);
                    var sortedArray = [];
                    for (i=0;i<array.length;i++) {
                        KICK.core.Util.insertSorted(array[i],sortedArray);
                    }
                    for (i=1;i<array.length;i++){
                        Assert.isTrue(sortedArray[i-1]<sortedArray[i],JSON.stringify(sortedArray));
                    }
                },
                testApplyConfig : function(){
                    var Assert = Y.Assert;
                    var AClass = function(){
                        this.test = function(x,y){
                            return x+y;
                        };
                        Object.defineProperties(this,{
                            a:{
                                value:123,
                                writable:true
                            },
                            b:{
                                value:1234,
                                writable:true
                            },
                            c:{
                                value:1234
                            }
                        });
                    };
                    var AObj = new AClass();
                    var AConf = {
                        a:999,
                        b:888,
                        c:1
                    };
                    KICK.core.Util.applyConfig(AObj,AConf,["c"]);
                    Assert.isTrue(AObj.a === AConf.a);
                    Assert.isTrue(AObj.b === AConf.b);
                    Assert.isTrue(AObj.c !== AConf.c);
                },
                testPackIntToFloat : function(){
                    var Assert = Y.Assert,
                            vec4,
                            res;
                    for (var i=1;i<500000;i++){
                        vec4 = KICK.core.Util.uint32ToVec4(i);
                        res = KICK.core.Util.vec4ToUint32(vec4);
                        Assert.isTrue(i === res);
                    }
                    vec4 = new Float32Array(4);
                    for (var i=1;i<500000;i++){
                        KICK.core.Util.uint32ToVec4(i,vec4);
                        res = KICK.core.Util.vec4ToUint32(vec4);
                        Assert.isTrue(i === res);
                    }
                    var uint8 = new Uint8Array(4);
                    for (var i=1;i<500000;i++){
                        KICK.core.Util.uint32ToVec4(i,vec4);
                        for (var j=0;j<4;j++){
                            uint8[j] = vec4[j]*255;
                        }
                        res = KICK.core.Util.vec4uint8ToUint32(uint8);
                        Assert.isTrue(i === res);
                    }


                }
            });

            /// extend Asset to compare float values
            Y.Assert.compareVec = function(f1,f2,message){
                for (var i=0;i<f1.length;i++){
                    Y.Assert.compareFloat(f1[i],f2[i],message);
                }
            };
            Y.Assert.compareFloat = function(f1,f2,message){
                var epsilon = 0.001;
                return Y.Assert.isTrue(Math.abs(f1-f2)<epsilon,message);
            };

            var ExampleSuite = new Y.Test.Suite("Sort test");
            ExampleSuite.add(Y.KICK.math.vec3Test);

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