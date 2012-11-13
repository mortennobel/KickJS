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
requirejs(['kick/math',  'kick/core/Constants'],
    function (math,  constants) {
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

                testVec3Array : function () {
                    var Assert = Y.Assert;

                    var ref = {};
                    var v = math.Vec3.array(2,ref);
                    v[1][1] = 1;

                    Assert.areEqual(ref.mem[4],v[1][1]);
                    Assert.areEqual(3,v[1].length);
                    Assert.areEqual(0,v[0][0]);
                    Assert.areEqual(0,v[0][1]);
                    Assert.areEqual(0,v[0][2]);
                    Assert.areEqual(0,v[1][0]);
                    Assert.areEqual(0,v[1][2]);
                },
                testVec3WrapArray : function () {
                    var Assert = Y.Assert;

                    var array = new Float32Array(6);
                    for (var i=0;i<6;i++){
                        array[i] = i;
                    }
                    var wrappedArray = math.Vec3.wrapArray(array);

                    Assert.areEqual(wrappedArray.length,2);
                    Assert.areEqual(wrappedArray[0].length,3);
                    Assert.areEqual(wrappedArray[1].length,3);
                    Assert.areEqual(wrappedArray[0][0],0);
                    Assert.areEqual(wrappedArray[0][1],1);
                    Assert.areEqual(wrappedArray[0][2],2);
                    Assert.areEqual(wrappedArray[1][0],3);
                    Assert.areEqual(wrappedArray[1][1],4);
                    Assert.areEqual(wrappedArray[1][2],5);
                },
                testVec3LengthSqr: function () {
                    var Assert = Y.Assert;

                    var v1 = [1,2,3];
                    var v2 = [-1,-2,-3];
                    var lenSqr1 = math.Vec3.lengthSqr(v1);
                    var lenSqr2 = math.Vec3.lengthSqr(v2);

                    Assert.areEqual(14,lenSqr1);
                    Assert.areEqual(14,lenSqr2);
                },
                testVec3Multiply: function () {
                    var Assert = Y.Assert;

                    var v1 = [1,2,3];
                    var v2 = [-1,-2,3];
                    var res = math.Vec3.multiply(v1,v2,math.Vec3.create());
                    var expected = math.Vec3.create([-1,-4,9]);
                    for (var i=0;i<3;i++){
                        Assert.areEqual(expected[i],res[i]);
                    }
                },
                testVec4WrapArray : function () {
                    var Assert = Y.Assert;

                    var array = new Float32Array(8);
                    for (var i=0;i<8;i++){
                        array[i] = i;
                    }
                    var wrappedArray = math.Vec4.wrapArray(array);

                    Assert.areEqual(wrappedArray.length,2);
                    Assert.areEqual(wrappedArray[0].length,4);
                    Assert.areEqual(wrappedArray[1].length,4);
                    Assert.areEqual(wrappedArray[0][0],0);
                    Assert.areEqual(wrappedArray[0][1],1);
                    Assert.areEqual(wrappedArray[0][2],2);
                    Assert.areEqual(wrappedArray[0][3],3);
                    Assert.areEqual(wrappedArray[1][0],4);
                    Assert.areEqual(wrappedArray[1][1],5);
                    Assert.areEqual(wrappedArray[1][2],6);
                    Assert.areEqual(wrappedArray[1][3],7);
                },
                testVec4Array : function () {
                    var Assert = Y.Assert;

                    var ref = {};
                    var v = math.Vec4.array(2,ref);
                    v[1][1] = 1;
                    Assert.areEqual(ref.mem[5],v[1][1],"Memory location");
                    Assert.areEqual(4,v[1].length,"Content");
                    Assert.areEqual(0,v[1][3],"Zero'ed");
                },
                testQuad4SetEuler: function(){
                    var Assert = Y.Assert;
                    var quat4 = math.Quat4.create();
                    for (var i=0;i<1000;i++){
                        var euler = math.Vec3.create();
                        if (i<3){
                            euler[i] = 90; // test 90 degree rotation
                        } else {
                            euler = [Math.random()*720-360,Math.random()*720-360,Math.random()*720-360];
                        }
                        math.Quat4.setEuler(euler,quat4);
                        var mat = math.Mat4.create();
                        math.Mat4.identity(mat);
                        math.Mat4.rotateEuler(mat,euler);
                        var point = [Math.random()*720-360,Math.random()*720-360,Math.random()*720-360];

                        var matrixPoint = math.Vec3.create();
                        var quatPoint = math.Vec3.create();
                        math.Mat4.multiplyVec3(mat,point,matrixPoint);
                        math.Quat4.multiplyVec3(quat4,point,quatPoint);
                        var msg = "matrixPoint:\n"+math.Vec3.str(matrixPoint)+
                                "\nquatPoint:\n"+math.Vec3.str(quatPoint);
                        Assert.compareVec(matrixPoint,quatPoint,msg);
                    }
                },
                testQuad4SetEulerToMatrix: function(){
                    var Assert = Y.Assert;
                    var quat4 = math.Quat4.create();
                    for (var i=0;i<1000;i++){
                        var euler = math.Vec3.create();
                        if (i<3){
                            euler[i] = 90; // test 90 degree rotation
                        } else {
                            euler = [Math.random()*720-360,Math.random()*720-360,Math.random()*720-360];
                        }
                        math.Quat4.setEuler(euler,quat4);
                        var quatMat = math.Quat4.toMat4(quat4);
                        var mat = math.Mat4.create();
                        math.Mat4.identity(mat);
                        math.Mat4.rotateEuler(mat,euler);

                        var msg = "quat euler to matrix:\n"+math.Mat4.strPretty(quatMat)+
                                "\nmat euler:\n"+math.Mat4.strPretty(mat);
                        Assert.compareVec(quatMat,mat,msg);
                    }
                },

                testQuad4AngleAxis: function(){
                    var Assert = Y.Assert;
                    var quat4 = math.Quat4.create();

                    var rotationAxis = [[1,0,0],[0,1,0],[0,0,1]];
                    var rotationAxisMatFunc = [math.Mat4.rotateX,math.Mat4.rotateY,math.Mat4.rotateZ];
                    for (var i=0;i<3;i++){
                        var angle = 12.145;
                        math.Quat4.angleAxis(angle,rotationAxis[i],quat4);
                        var mat = math.Mat4.create();
                        math.Mat4.identity(mat);
                        rotationAxisMatFunc[i](mat,angle*constants._DEGREE_TO_RADIAN);

                        var point = math.Vec3.create([12.451,123.5,.9]);

                        var matrixPoint = math.Vec3.create();
                        var quatPoint = math.Vec3.create();
                        math.Mat4.multiplyVec3(mat,point,matrixPoint);
                        math.Quat4.multiplyVec3(quat4,point,quatPoint);

                        var msg = "matrixPoint:\n"+math.Vec3.str(matrixPoint)+
                                "\nquatPoint:\n"+math.Vec3.str(quatPoint)+
                                "\nAxis: "+i;
                        Assert.compareVec(matrixPoint,quatPoint,msg);
                    }
                },
                testQuad4Euler: function(){
                    var Assert = Y.Assert;
                    var quat = math.Quat4.create([0,0,0,1]);
                    var vec = math.Vec3.create([0,0,0]);

                    math.Quat4.toEuler(quat,vec);
                    Assert.compareVec([0,0,0],vec);
                },
                testQuad4EulerRotation: function(){
                    var Assert = Y.Assert;
                    var quat = math.Quat4.create([0,0,0,1]);
                    math.Quat4.setEuler([0,180,0],quat);
                    var left = math.Vec3.create([1,0,0]);
                    var right = math.Vec3.create([-1,0,0]);
                    var res = math.Vec3.create([0,0,0]);
                    var testRotation = math.Quat4.create();
                    math.Quat4.angleAxis(180,[0,1,0],testRotation);
                    math.Quat4.multiplyVec3(testRotation,left,res);
                    Assert.compareVec(res,right);
                    math.Quat4.multiplyVec3(quat,left,res);
                    Assert.compareVec(res,right);
                    math.Quat4.multiplyVec3(quat,right,res);
                    Assert.compareVec(res,left);
                },
                testQuad4Difference: function(){
                    var Assert = Y.Assert;
                    var quat1 = math.Quat4.create([0,0,0,1]);
                    var quat2 = math.Quat4.create([0,0,0,1]);

                    math.Quat4.setEuler([15,0,0],quat1);
                    math.Quat4.setEuler([-25,0,0],quat2);
                    var res = math.Quat4.difference(quat1,quat2);
                    var resEuler = math.Quat4.toEuler(res);
                    Assert.compareVec([-40,0,0],resEuler);
                },
                testCartesialToSpherical:function(){
                    var Assert = Y.Assert;
                    var vecCartesial = [1,0,0];
                    var spherical = math.Vec3.cartesianToSpherical(vecCartesial);
                    Assert.compareVec (spherical,[1,0,0]);

                    vecCartesial = [0,0,1];
                    spherical = math.Vec3.cartesianToSpherical(vecCartesial);
                    Assert.compareVec (spherical,[1,-1.5707963705062866,0]);

                    vecCartesial = [0,0,0];
                    spherical = math.Vec3.cartesianToSpherical(vecCartesial);
                    Assert.compareVec (spherical,[0,0,0]);

                    for (var i=0;i<100;i++){
                        vecCartesial = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        spherical = math.Vec3.cartesianToSpherical(vecCartesial);
                        var vecCartesial2 = math.Vec3.sphericalToCarterian(spherical);
                        Assert.compareVec(vecCartesial,vecCartesial2,"Error in "+i);
                    }
                },
                testSetTRS:function(){
                    var mat4 = math.Mat4;
                    var quat4 = math.Quat4;
                    mat4.setTRSOld = function(translate, rotateQuat, scale, dest){
                        dest = mat4.fromRotationTranslation(rotateQuat,translate,dest);
                        if (scale[0] !== 0 || scale[1] !== 0 || scale[1] !== 0){
                            mat4.scale(dest, scale);
                        }
                        return dest;
                    };

                    for (var i=0;i<1000;i++){
                        var translate = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var rotate = quat4.setEuler([Math.random()*360,Math.random()*360,Math.random()*360],rotate);
                        var scale = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var oldTRSRes = mat4.setTRSOld(translate,rotate,scale);
                        var newTRSRes = mat4.setTRS(translate,rotate,scale);
                        Y.Assert.compareVec(oldTRSRes,newTRSRes);
                    }
                },
                testSetTRSInverse:function(){
                    var mat4 = math.Mat4;
                    var quat4 = math.Quat4;

                    mat4.setTRSInverseOld = (function(){
                            var conjugateRotation = new Float32Array(4);
                            return function(translate, rotateQuat, scale, dest){
                                if(!dest) { dest = mat4.create(); }
                                mat4.identity(dest);
                                mat4.scale(dest, [1/scale[0],1/scale[1],1/scale[2]]);
                                quat4.conjugate(rotateQuat,conjugateRotation);
                                mat4.multiply(dest,quat4.toMat4(conjugateRotation));
                                mat4.translate(dest, [-translate[0],-translate[1],-translate[2]]);
                                return dest;
                            };
                        })();


                    for (var i=0;i<1000;i++){
                        var translate = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var rotate = quat4.setEuler([Math.random()*360,Math.random()*360,Math.random()*360],rotate);
                        var scale = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var oldTRSRes = mat4.setTRSInverseOld(translate,rotate,scale);
                        var newTRSRes = mat4.setTRSInverse(translate,rotate,scale);
                        Y.Assert.compareVec(oldTRSRes,newTRSRes);
                    }
                },
                /*testSetTRSInverseOld:function(){ // bench mark test
                    var mat4 = math.Mat4;
                    var quat4 = math.Quat4;

                    mat4.setTRSInverseOld = (function(){
                            var conjugateRotation = new Float32Array(4);
                            return function(translate, rotateQuat, scale, dest){
                                if(!dest) { dest = mat4.create(); }
                                mat4.identity(dest);
                                mat4.scale(dest, [1/scale[0],1/scale[1],1/scale[2]]);
                                quat4.conjugate(rotateQuat,conjugateRotation);
                                mat4.multiply(dest,quat4.toMat4(conjugateRotation));
                                mat4.translate(dest, [-translate[0],-translate[1],-translate[2]]);
                                return dest;
                            };
                        })();


                    for (var i=0;i<100000;i++){
                        var translate = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var rotate = quat4.setEuler([Math.random()*360,Math.random()*360,Math.random()*360],rotate);
                        var scale = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var oldTRSRes = mat4.setTRSInverseOld(translate,rotate,scale);
                        var newTRSRes = mat4.setTRSInverseOld(translate,rotate,scale);
                        Y.Assert.compareVec(oldTRSRes,newTRSRes);
                    }
                },
                testSetTRSInverseOld2:function(){ // bench mark test
                    var mat4 = math.Mat4;
                    var quat4 = math.Quat4;

                    mat4.setTRSInverseOld = function(translate, rotateQuat, scale, dest){
                            dest = mat4.setTRS(translate, rotateQuat, scale, dest);
                            return mat4.inverse(dest);
                        };



                    for (var i=0;i<100000;i++){
                        var translate = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var rotate = quat4.setEuler([Math.random()*360,Math.random()*360,Math.random()*360],rotate);
                        var scale = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var oldTRSRes = mat4.setTRSInverseOld(translate,rotate,scale);
                        var newTRSRes = mat4.setTRSInverseOld(translate,rotate,scale);
                        Y.Assert.compareVec(oldTRSRes,newTRSRes);
                    }
                },
                testSetTRSInverseNew:function(){ // bench mark test
                    var mat4 = math.Mat4;
                    var quat4 = math.Quat4;

                    for (var i=0;i<100000;i++){
                        var translate = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var rotate = quat4.setEuler([Math.random()*360,Math.random()*360,Math.random()*360],rotate);
                        var scale = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        var oldTRSRes = mat4.setTRSInverse(translate,rotate,scale);
                        var newTRSRes = mat4.setTRSInverse(translate,rotate,scale);
                        Y.Assert.compareVec(oldTRSRes,newTRSRes);
                    }
                },*/
                testDecomposeMat4:function(){
                    var Assert = Y.Assert;
                    var quat4 = math.Quat4;
                    var translate = [10,20,30];
                    var rotate = [0,0,0,1];
                    var scale = [1,2,3];
                    for (var i=0;i<10000;i++){
                        translate = [Math.random()*100-50,Math.random()*100-50,Math.random()*100-50];
                        rotate = quat4.setEuler([Math.random()*360,Math.random()*360,Math.random()*360],rotate);
                        quat4.normalize(rotate);
                        scale = [Math.random()*100,Math.random()*100,Math.random()*100];
                        var matrix = math.Mat4.setTRS (translate , rotate , scale);
                        var decomposedMatrix = math.Mat4.decompose(matrix);
                        var decomposedTranslate = decomposedMatrix[0];
                        var decomposedRotate = decomposedMatrix[1];
                        var decomposedScale = decomposedMatrix[2];

                        Y.Assert.compareVec(translate,decomposedTranslate);
                        Y.Assert.compareQuat4(rotate,decomposedRotate);
                        Y.Assert.compareVec(scale,decomposedScale);
                    }
                },
                testAABBTransformTranslate:function(){
                    var Assert = Y.Assert,
                            quat4 = math.Quat4,
                            mat4 = math.Mat4,
                            aabb = math.Aabb;
                    var ab = aabb.create([-1,-1,-1],[1,1,1]);
                    var translateMat = mat4.setTRS([3,0,0],[0,0,0,1],[1,1,1]);
                    var transformedAABB = aabb.transform(ab,translateMat);
                    var expectedRes = aabb.create([2,-1,-1],[4,1,1]);
                    Y.Assert.compareVec(expectedRes,transformedAABB);

                    ab = aabb.create([-1,-1,-1],[1,1,1]);
                    translateMat = mat4.setTRS([-5,0,0],[0,0,0,1],[1,1,1]);
                    transformedAABB = aabb.transform(ab,translateMat);
                    expectedRes = aabb.create([-6,-1,-1],[-4,1,1]);
                    Y.Assert.compareVec(expectedRes,transformedAABB);
                },
                testAABBTransformTranslateScale:function(){
                    var Assert = Y.Assert,
                            quat4 = math.Quat4,
                            mat4 = math.Mat4,
                            aabb = math.Aabb;
                    var ab = aabb.create([-1,-1,-1],[1,1,1]);
                    var translateMat = mat4.setTRS([3,0,0],[0,0,0,1],[2,2,2]);
                    var transformedAABB = aabb.transform(ab,translateMat);
                    var expectedRes = aabb.create([1,-2,-2],[5,2,2]);
                    Y.Assert.compareVec(expectedRes,transformedAABB, "Was "+aabb.str(transformedAABB)+" expected "+aabb.str(expectedRes));
                },
                testAABBCenter:function(){
                    var Assert = Y.Assert,
                            quat4 = math.Quat4,
                            mat4 = math.Mat4,
                            aabb = math.Aabb;
                    var ab = aabb.create([-1,-1,-1],[1,1,1]);
                    var center = aabb.center(ab);
                    var expectedRes = [0,0,0];
                    Y.Assert.compareVec(center,expectedRes);
                    var ab = aabb.create([1,2,3],[4,6,8]);
                    var center = aabb.center(ab);
                    var expectedRes = [2.5,4,5.5];
                    Y.Assert.compareVec(center,expectedRes);
                },
                testFrustumTest:function(){
                    var Assert = Y.Assert,
                            mat4 = math.Mat4,
                            vec3 = math.Vec3,
                            frustum = math.Frustum;
                    for (var i=0;i<2;i++){
                        // Test a simple case where the view projection has a near plane of 1 and far plane of 5
                        var projectionMat = mat4.perspective ( 60 , 1, 1, 5);
                        var normalize = i;
                        var frustumPlanes = frustum.extractPlanes(projectionMat,normalize);
                        Y.Assert.areEqual(frustumPlanes.length,4*6);
                        var near = frustumPlanes.subarray(4*4,5*4);
                        var far = frustumPlanes.subarray(5*4,6*4);

                        Y.Assert.areEqual(near.length,4);
                        Y.Assert.areEqual(far.length,4);
                        Y.Assert.areEqual(vec3.dot(near, [0,0,-1]), -near[3]); // (0*near.x+0*near.y-1*near.z + near.w = 0)
                        Y.Assert.areEqual(vec3.dot(far, [0,0,-5]), -far[3]); // (0*near.x+0*near.y-5*near.z + near.w = 0)
                        if (normalize){
                            Y.Assert.areEqual(vec3.length(near),1);
                            Y.Assert.areEqual(vec3.length(far),1);
                        }

                        // Test modelView where translated with z=+2
                        var projectionMat = mat4.perspective ( 60 , 1, 1, 5);
                        var cameraTransform = mat4.translate(mat4.identity(mat4.create()),[0,0,2]);
                        var viewMatrix = mat4.inverse(cameraTransform);
                        var modelView = mat4.multiply(projectionMat,viewMatrix);
                        var frustumPlanes = frustum.extractPlanes(modelView,normalize);
                        Y.Assert.areEqual(frustumPlanes.length,4*6);
                        var near = frustumPlanes.subarray(4*4,5*4);
                        var far = frustumPlanes.subarray(5*4,6*4);
                        Y.Assert.areEqual(vec3.dot(near, [0,0,1]), -near[3]); // (0*near.x+0*near.y-1*near.z + near.w = 0)
                        Y.Assert.areEqual(vec3.dot(far, [0,0,-3]), -far[3]); // (0*near.x+0*near.y-5*near.z + near.w = 0)
                        if (normalize){
                            Y.Assert.areEqual(vec3.length(near),1);
                            Y.Assert.areEqual(vec3.length(far),1);
                        }

                        // Test modelView where rotated -90 degree around y
                        var projectionMat = mat4.perspective ( 60 , 1, 1, 5);
                        var cameraTransform = mat4.rotateEuler(mat4.identity(mat4.create()),[0,-90,0]);
                        var viewMatrix = mat4.inverse(cameraTransform);
                        var modelView = mat4.multiply(projectionMat,viewMatrix);
                        var frustumPlanes = frustum.extractPlanes(modelView,normalize);
                        Y.Assert.areEqual(frustumPlanes.length,4*6);
                        var near = frustumPlanes.subarray(4*4,5*4);
                        var far = frustumPlanes.subarray(5*4,6*4);
                        Y.Assert.areEqual(vec3.dot(near, [1,0,0]), -near[3]); // (0*near.x+0*near.y-1*near.z + near.w = 0)
                        Y.Assert.areEqual(vec3.dot(far, [5,0,0]), -far[3]); // (0*near.x+0*near.y-5*near.z + near.w = 0)
                        if (normalize){
                            Y.Assert.areEqual(vec3.length(near),1);
                            Y.Assert.areEqual(vec3.length(far),1);
                        }
                    }
                },
                testFrustumIntersectTestOutside:function(){
                    var Assert = Y.Assert,
                            mat4 = math.Mat4,
                            vec3 = math.Vec3,
                            aabb = math.Aabb,
                            frustum = math.Frustum;
                    for (var i=1;i<2;i++){
                        // Test a simple case where the view projection has a near plane of 1 and far plane of 5
                        var projectionMat = mat4.perspective ( 60 , 1, 1, 5);
                        var normalize = i;
                        var frustumPlanes = frustum.extractPlanes(projectionMat,normalize);

                        var aabb05 = aabb.create([0,0,0],[.5,.5,.5]);
                        var res = frustum.intersectAabb(frustumPlanes, aabb05);
                        Y.Assert.areEqual(frustum.OUTSIDE,res);

                        var length = 1.5;
                        var aabbOffset5 = aabb.create([-length,-length,-length-10],[length,length,length-10]);
                        var res = frustum.intersectAabb(frustumPlanes, aabbOffset5);
                        Y.Assert.areEqual(frustum.OUTSIDE,res, aabb.str(aabbOffset5)+" normalize "+normalize);
                    }
                },
                testFrustumIntersectTestIntersecting:function(){
                    var Assert = Y.Assert,
                            mat4 = math.Mat4,
                            vec3 = math.Vec3,
                            aabb = math.Aabb,
                            frustum = math.Frustum;
                    for (var i=1;i<2;i++){
                        // Test a simple case where the view projection has a near plane of 1 and far plane of 5
                        var projectionMat = mat4.perspective ( 60 , 1, 1, 5);
                        var normalize = i;
                        var frustumPlanes = frustum.extractPlanes(projectionMat,normalize);

                        var length = 1.5;
                        var aabb15 = aabb.create([-length,-length,-length],[length,length,length]);
                        var res = frustum.intersectAabb(frustumPlanes, aabb15);
                        Y.Assert.areEqual(frustum.INTERSECTING,res, aabb.str(aabb15)+" normalize "+normalize);
                    }
                },
                testFrustumIntersectTestInside:function(){
                    var Assert = Y.Assert,
                            mat4 = math.Mat4,
                            vec3 = math.Vec3,
                            aabb = math.Aabb,
                            frustum = math.Frustum;
                    for (var i=1;i<2;i++){
                        // Test a simple case where the view projection has a near plane of 1 and far plane of 5
                        var projectionMat = mat4.perspective ( 60 , 1, 1, 5);
                        var normalize = i;
                        var frustumPlanes = frustum.extractPlanes(projectionMat,normalize);

                        var aabb45 = aabb.create([0,0,-4.5],[.1,.1,-4.0]);
                        var res = frustum.intersectAabb(frustumPlanes, aabb45);
                        Y.Assert.areEqual(frustum.INSIDE,res, aabb.str(aabb45)+" normalize "+normalize);
                    }
                }
            });

            /**
             * Assumes that the quaternions is normalized
             * @param expected
             * @param actual
             * @param message
             */
            Y.Assert.compareQuat4 = function(expected,actual, message){
                var quat4 = math.Quat4;
                var epsilon = 0.001;
                var message = "Expected \n"+math.Vec4.str(expected)+" \nActual \n"+math.Vec4.str(actual);
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
                var actualAlternative = quat4.create([actual[0]*-1,actual[1]*-1,actual[2]*-1,actual[3]*-1]);
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
                var epsilon = 0.001;
                var res = Math.abs(f1-f2)<epsilon;
                if (!res){
                    debugger;
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
             * @param {math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
             * @return {math.mat4} dest if specified, mat otherwise
             */
            math.Mat4.rotateEuler = function(mat, eulerAngle, dest) {
                var degreeToRadian = constants._DEGREE_TO_RADIAN;
                if (dest) {
                    mat4.set(mat,dest);
                    mat = dest;
                }

                // Note unoptimized code
                if (eulerAngle[2] !== 0){
                    math.Mat4.rotateZ(mat, eulerAngle[2]*degreeToRadian);
                }
                if (eulerAngle[1] !== 0){
                    math.Mat4.rotateY(mat, eulerAngle[1]*degreeToRadian);
                }
                if (eulerAngle[0] !== 0){
                    math.Mat4.rotateX(mat, eulerAngle[0]*degreeToRadian);
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