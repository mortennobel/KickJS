Math.seedrandom("hello");

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
    function (kick) {
        YUI().use('node', 'console', 'test', function (Y) {
            "use strict";
            Y.namespace("KICK.math");
            var math = kick.math;
            Y.KICK.math.vec3Test = new Y.Test.Case({

                //name of the test case - if not provided, one is auto-generated
                name : "animationtest",

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


                testNumberAnimationCurve : function(){
                    var animData = [
                            { time: 0,
                               value: -.844642997,
                               inSlope: .0358512178,
                               outSlope: .0358512178,
                               tangentMode: 10},
                            { time: .183333337,
                               value: -.838070273,
                               inSlope: .0359076932,
                               outSlope: .0359076932,
                               tangentMode: 10},
                            { time: 10,
                               value: -.485022008,
                               inSlope: .0421151593,
                               outSlope: .0421151593,
                               tangentMode: 10},
                            { time: 20,
                               value: -.00236049294,
                               inSlope: .024310112,
                               outSlope: .024310112,
                               tangentMode: 10},
                            { time: 26.666666,
                               value: 0,
                               inSlope: .000177100272,
                               outSlope: .000177100272,
                               tangentMode: 10},
                            { time: 49.9500008,
                               value: 2.94708866e-06,
                               inSlope: .0573863313,
                               outSlope: .0573863313,
                               tangentMode: 10},
                            { time: 60.0499992,
                               value: 1.15920544,
                               inSlope: .114772536,
                               outSlope: .114772536,
                               tangentMode: 10}];
                    var animationCurve = new kick.animation.Curve();

                    for (var i = 0;i < animData.length; i++) {
                        animationCurve.addControlPoint(new kick.animation.ControlPoint(animData[i]));
                    }
                    var expected = [-0.844642997, -0.8091214347801265, -0.7744887268049725, -0.7403968328583707, -0.7064662962732784, -0.6723176603826522, -0.6375714685194488, -0.6018482640166252, -0.5647685902071379, -0.525952990423944, -0.485022008, -0.4395821166253201, -0.38869704236976016, -0.3341732071360399, -0.27781703282688003, -0.221434941345, -0.16683335459312001, -0.11581869447396002, -0.07019738289024, -0.03177584174467999, -0.00236049294, 0.015324382046744191, 0.02189889922372667, 0.02057323291607225, 0.014557557448905797, 0.007062047147352125, 0.0012968763365360755, -0.00021257837661252507, -0.003920874138015976, -0.011739490323683918, -0.023031329801316894, -0.03715929543861544, -0.05348629010328009, -0.0713752166630114, -0.09018897798550989, -0.10929047693847613, -0.12804261638961062, -0.14580829920661395, -0.16195042825718667, -0.17583190640902932, -0.18681563652984234, -0.19426452148732634, -0.19754146414918192, -0.19600936738310953, -0.18903113405680974, -0.1759696670379831, -0.1561878691943302, -0.1290486433935515, -0.09391489250334761, -0.050149519391419, 0.0029005555408703866, 0.07213568213077406, 0.16055393201845794, 0.2647799752158851, 0.38143848173501843, 0.5071541215878209, 0.6385515647862556, 0.7722554813422857, 0.9048905412678737, 1.0330814145749831, 1.1534527712755769];
                    for (i=0;i<=60;i++){
                        var value = animationCurve.evaluate(i);
                        Y.Assert.compareFloat(value, expected[i]);
                    }
                },
                testNumberAnimationCurveVec2 : function(){
                    var animData = [
                            { time: 0,
                               value: -.844642997,
                               inSlope: .0358512178,
                               outSlope: .0358512178,
                               tangentMode: 10},
                            { time: .183333337,
                               value: -.838070273,
                               inSlope: .0359076932,
                               outSlope: .0359076932,
                               tangentMode: 10},
                            { time: 10,
                               value: -.485022008,
                               inSlope: .0421151593,
                               outSlope: .0421151593,
                               tangentMode: 10},
                            { time: 20,
                               value: -.00236049294,
                               inSlope: .024310112,
                               outSlope: .024310112,
                               tangentMode: 10},
                            { time: 26.666666,
                               value: 0,
                               inSlope: .000177100272,
                               outSlope: .000177100272,
                               tangentMode: 10},
                            { time: 49.9500008,
                               value: 2.94708866e-06,
                               inSlope: .0573863313,
                               outSlope: .0573863313,
                               tangentMode: 10},
                            { time: 60.0499992,
                               value: 1.15920544,
                               inSlope: .114772536,
                               outSlope: .114772536,
                               tangentMode: 10}];
                    var animationCurve = new kick.animation.Curve();
                    animationCurve.curveType = kick.animation.Curve.VEC2;

                    for (var i = 0;i < animData.length; i++) {
                        animData[i].value = [animData[i].value,animData[i].value+1];
                        animData[i].inSlope = [animData[i].inSlope,animData[i].inSlope];
                        animData[i].outSlope = [animData[i].outSlope,animData[i].outSlope];
                        animationCurve.addControlPoint(new kick.animation.ControlPoint(animData[i]));
                    }
                    var expected = [-0.844642997, -0.8091214347801265, -0.7744887268049725, -0.7403968328583707, -0.7064662962732784, -0.6723176603826522, -0.6375714685194488, -0.6018482640166252, -0.5647685902071379, -0.525952990423944, -0.485022008, -0.4395821166253201, -0.38869704236976016, -0.3341732071360399, -0.27781703282688003, -0.221434941345, -0.16683335459312001, -0.11581869447396002, -0.07019738289024, -0.03177584174467999, -0.00236049294, 0.015324382046744191, 0.02189889922372667, 0.02057323291607225, 0.014557557448905797, 0.007062047147352125, 0.0012968763365360755, -0.00021257837661252507, -0.003920874138015976, -0.011739490323683918, -0.023031329801316894, -0.03715929543861544, -0.05348629010328009, -0.0713752166630114, -0.09018897798550989, -0.10929047693847613, -0.12804261638961062, -0.14580829920661395, -0.16195042825718667, -0.17583190640902932, -0.18681563652984234, -0.19426452148732634, -0.19754146414918192, -0.19600936738310953, -0.18903113405680974, -0.1759696670379831, -0.1561878691943302, -0.1290486433935515, -0.09391489250334761, -0.050149519391419, 0.0029005555408703866, 0.07213568213077406, 0.16055393201845794, 0.2647799752158851, 0.38143848173501843, 0.5071541215878209, 0.6385515647862556, 0.7722554813422857, 0.9048905412678737, 1.0330814145749831, 1.1534527712755769];
                    for (i=0;i<=60;i++){
                        var value = animationCurve.evaluate(i);
                        Y.Assert.compareFloat(value[0], expected[i]);
                        Y.Assert.compareFloat(value[1], expected[i]+1);
                    }
                },
                testNumberAnimationCurveVec3 : function(){
                    var animData = [
                            { time: 0,
                               value: -.844642997,
                               inSlope: .0358512178,
                               outSlope: .0358512178,
                               tangentMode: 10},
                            { time: .183333337,
                               value: -.838070273,
                               inSlope: .0359076932,
                               outSlope: .0359076932,
                               tangentMode: 10},
                            { time: 10,
                               value: -.485022008,
                               inSlope: .0421151593,
                               outSlope: .0421151593,
                               tangentMode: 10},
                            { time: 20,
                               value: -.00236049294,
                               inSlope: .024310112,
                               outSlope: .024310112,
                               tangentMode: 10},
                            { time: 26.666666,
                               value: 0,
                               inSlope: .000177100272,
                               outSlope: .000177100272,
                               tangentMode: 10},
                            { time: 49.9500008,
                               value: 2.94708866e-06,
                               inSlope: .0573863313,
                               outSlope: .0573863313,
                               tangentMode: 10},
                            { time: 60.0499992,
                               value: 1.15920544,
                               inSlope: .114772536,
                               outSlope: .114772536,
                               tangentMode: 10}];
                    var animationCurve = new kick.animation.Curve();
                    animationCurve.curveType = kick.animation.Curve.VEC3;

                    for (var i = 0;i < animData.length; i++) {
                        animData[i].value = [animData[i].value,animData[i].value+1,animData[i].value+2];
                        animData[i].inSlope = [animData[i].inSlope,animData[i].inSlope,animData[i].inSlope];
                        animData[i].outSlope = [animData[i].outSlope,animData[i].outSlope,animData[i].outSlope];
                        animationCurve.addControlPoint(new kick.animation.ControlPoint(animData[i]));
                    }
                    var expected = [-0.844642997, -0.8091214347801265, -0.7744887268049725, -0.7403968328583707, -0.7064662962732784, -0.6723176603826522, -0.6375714685194488, -0.6018482640166252, -0.5647685902071379, -0.525952990423944, -0.485022008, -0.4395821166253201, -0.38869704236976016, -0.3341732071360399, -0.27781703282688003, -0.221434941345, -0.16683335459312001, -0.11581869447396002, -0.07019738289024, -0.03177584174467999, -0.00236049294, 0.015324382046744191, 0.02189889922372667, 0.02057323291607225, 0.014557557448905797, 0.007062047147352125, 0.0012968763365360755, -0.00021257837661252507, -0.003920874138015976, -0.011739490323683918, -0.023031329801316894, -0.03715929543861544, -0.05348629010328009, -0.0713752166630114, -0.09018897798550989, -0.10929047693847613, -0.12804261638961062, -0.14580829920661395, -0.16195042825718667, -0.17583190640902932, -0.18681563652984234, -0.19426452148732634, -0.19754146414918192, -0.19600936738310953, -0.18903113405680974, -0.1759696670379831, -0.1561878691943302, -0.1290486433935515, -0.09391489250334761, -0.050149519391419, 0.0029005555408703866, 0.07213568213077406, 0.16055393201845794, 0.2647799752158851, 0.38143848173501843, 0.5071541215878209, 0.6385515647862556, 0.7722554813422857, 0.9048905412678737, 1.0330814145749831, 1.1534527712755769];
                    for (i=0;i<=60;i++){
                        var value = animationCurve.evaluate(i);
                        Y.Assert.compareFloat(value[0], expected[i]);
                        Y.Assert.compareFloat(value[1], expected[i]+1);
                        Y.Assert.compareFloat(value[2], expected[i]+2);
                    }
                },
                testNumberAnimationCurveVec4 : function(){
                    var animData = [
                            { time: 0,
                               value: -.844642997,
                               inSlope: .0358512178,
                               outSlope: .0358512178,
                               tangentMode: 10},
                            { time: .183333337,
                               value: -.838070273,
                               inSlope: .0359076932,
                               outSlope: .0359076932,
                               tangentMode: 10},
                            { time: 10,
                               value: -.485022008,
                               inSlope: .0421151593,
                               outSlope: .0421151593,
                               tangentMode: 10},
                            { time: 20,
                               value: -.00236049294,
                               inSlope: .024310112,
                               outSlope: .024310112,
                               tangentMode: 10},
                            { time: 26.666666,
                               value: 0,
                               inSlope: .000177100272,
                               outSlope: .000177100272,
                               tangentMode: 10},
                            { time: 49.9500008,
                               value: 2.94708866e-06,
                               inSlope: .0573863313,
                               outSlope: .0573863313,
                               tangentMode: 10},
                            { time: 60.0499992,
                               value: 1.15920544,
                               inSlope: .114772536,
                               outSlope: .114772536,
                               tangentMode: 10}];
                    var animationCurve = new kick.animation.Curve();
                    animationCurve.curveType = kick.animation.Curve.VEC4;

                    for (var i = 0;i < animData.length; i++) {
                        animData[i].value = [animData[i].value,animData[i].value+1,animData[i].value+2,animData[i].value+3];
                        animData[i].inSlope = [animData[i].inSlope,animData[i].inSlope,animData[i].inSlope,animData[i].inSlope];
                        animData[i].outSlope = [animData[i].outSlope,animData[i].outSlope,animData[i].outSlope,animData[i].outSlope];
                        animationCurve.addControlPoint(new kick.animation.ControlPoint(animData[i]));
                    }
                    var expected = [-0.844642997, -0.8091214347801265, -0.7744887268049725, -0.7403968328583707, -0.7064662962732784, -0.6723176603826522, -0.6375714685194488, -0.6018482640166252, -0.5647685902071379, -0.525952990423944, -0.485022008, -0.4395821166253201, -0.38869704236976016, -0.3341732071360399, -0.27781703282688003, -0.221434941345, -0.16683335459312001, -0.11581869447396002, -0.07019738289024, -0.03177584174467999, -0.00236049294, 0.015324382046744191, 0.02189889922372667, 0.02057323291607225, 0.014557557448905797, 0.007062047147352125, 0.0012968763365360755, -0.00021257837661252507, -0.003920874138015976, -0.011739490323683918, -0.023031329801316894, -0.03715929543861544, -0.05348629010328009, -0.0713752166630114, -0.09018897798550989, -0.10929047693847613, -0.12804261638961062, -0.14580829920661395, -0.16195042825718667, -0.17583190640902932, -0.18681563652984234, -0.19426452148732634, -0.19754146414918192, -0.19600936738310953, -0.18903113405680974, -0.1759696670379831, -0.1561878691943302, -0.1290486433935515, -0.09391489250334761, -0.050149519391419, 0.0029005555408703866, 0.07213568213077406, 0.16055393201845794, 0.2647799752158851, 0.38143848173501843, 0.5071541215878209, 0.6385515647862556, 0.7722554813422857, 0.9048905412678737, 1.0330814145749831, 1.1534527712755769];
                    for (i=0;i<=60;i++){
                        var value = animationCurve.evaluate(i);
                        Y.Assert.compareFloat(value[0], expected[i]);
                        Y.Assert.compareFloat(value[1], expected[i]+1);
                        Y.Assert.compareFloat(value[2], expected[i]+2);
                        Y.Assert.compareFloat(value[3], expected[i]+3);
                    }
                }


            });

            /**
             * Assumes that the quaternions is normalized
             * @param expected
             * @param actual
             * @param message
             */
            Y.Assert.compareQuat = function(expected,actual, message){
                var quat = math.Quat;
                var epsilon = 0.001;
                var message = "Expected \n"+math.Vec4.str(expected)+" \nActual \n"+math.Vec4.str(actual);
                var isEqual = function(quat){
                    for (var i=0;i<4;i++){
                        if (Math.abs(expected[i])-Math.abs(quat[i])>epsilon){
                            return false;
                        }
                    }
                    return true;
                };
                if (isEqual(actual)){
                    return;
                }
                var actualAlternative = quat.create([actual[0]*-1,actual[1]*-1,actual[2]*-1,actual[3]*-1]);
                if (isEqual(actualAlternative)){
                    return;
                }
                Y.Assert.isTrue(false,message);
            };

            /// extend Asset to compare float values
            Y.Assert.compareVec = function(expected,actual,message){
                if (!message){
                    if (expected.length === 3){
                        message = "Expected "+math.Vec3.str(expected)+" Actual "+math.Vec3.str(actual);
                    }
                }
                var vectorType;
                if (expected.length === 2){
                    vectorType = math.Vec2;
                } else if (expected.length === 3){
                    vectorType = math.Vec3;
                } else if (expected.length === 4){
                    vectorType = math.Vec4;
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
                var epsilon = 0.1;
                var res = Math.abs(f1-f2)<epsilon;
                if (!res){
                    debugger;
                }
                if (!message){
                    message = "Was "+f1+" Expected "+f2;
                }
                return Y.Assert.isTrue(res,message);
            };

            var ExampleSuite = new Y.Test.Suite("Example Suite");
            ExampleSuite.add(Y.KICK.math.vec3Test);

            /**
             * Rotates a matrix by three rotations given in eulers angles<br>
             * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
             * This method is only used to verify quaternion rotation and therefor not available in math.js
             * @method rotateEuler
             * @param {math.mat4} mat mat4 to rotate
             * @param {math.vec3} eulerAngle angle (in degrees) to rotate
             * @param {math.mat4} out
             * @return {math.mat4} out
             */
            math.Mat4.rotateEuler = function(out, mat, eulerAngle) {
                var degreeToRadian = constants._DEGREE_TO_RADIAN;

                math.Mat4.copy(out, mat);


                // Note unoptimized code
                if (eulerAngle[2] !== 0){
                    math.Mat4.rotateZ(mat, mat, eulerAngle[2]*degreeToRadian);
                }
                if (eulerAngle[1] !== 0){
                    math.Mat4.rotateY(mat, mat, eulerAngle[1]*degreeToRadian);
                }
                if (eulerAngle[0] !== 0){
                    math.Mat4.rotateX(mat, mat, eulerAngle[0]*degreeToRadian);
                }
                return mat;
            };

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

    }
);