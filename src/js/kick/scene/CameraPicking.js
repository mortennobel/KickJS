define(["kick/math/Vec4", "kick/material/Material", "kick/texture/RenderTexture", "kick/core/Constants", "kick/core/Util", "./PickResult"],
    function (Vec4, Material, RenderTexture, Constants, Util, PickResult) {
        "use strict";

        /**
         * Camera picking object used by Camera objects to manage picking
         * @private
         * @class CameraPicking
         * @param {KICK.core.Engine} engine
         * @param {Function} setupClearColor
         * @param {Function} renderSceneObjects
         * @param {Scene} sceneObj
         * @constructor
         */
        return function (engine, setupClearColor, renderSceneObjects, sceneObj, setupCamera) {
            var pickingQueue = null,
                pickingMaterial = null,
                pickingRenderTarget = null,
                pickingClearColor = Vec4.create(),
                glState = engine.glState,
                i,
                init = function () {
                    pickingQueue = [];
                    pickingMaterial = new Material(engine,
                        {
                            shader: engine.project.load(engine.project.ENGINE_SHADER___PICK),
                            name: "Picking material"
                        });
                    pickingRenderTarget = new RenderTexture(engine, {
                        dimension: glState.viewportSize

                    });
                    pickingRenderTarget.name = "__pickRenderTexture";
                };

            init();

            /**
             * Add an object to the picking queue.
             * Picking object must have the signature
             * {gameObjectPickedFn: gameObjectPickedFn,
             * x: x,
             * y: glState.viewportSize[1] - y,
             * width: 1,
             * height: 1,
             * point: true
             * }
             * @method add
             * @param {Object} pickingObject
             */
            this.add = function (pickingObject) {
                pickingQueue.push(pickingObject);
            };

            /**
             * @method handlePickRequests
             * @param {KICK.scene.SceneLights} sceneLightObj
             */
            this.handlePickRequests = function (sceneLightObj, engineUniforms) {
                if (pickingQueue.length > 0) {
                    glState.currentMaterial = null; // clear current material
                    pickingRenderTarget.bind();
                    setupClearColor(pickingClearColor);
                    engine.gl.clear(Constants.GL_COLOR_BUFFER_BIT | Constants.GL_DEPTH_BUFFER_BIT);
                    renderSceneObjects(sceneLightObj, pickingMaterial);
                    for (i = pickingQueue.length - 1; i >= 0; i--) {
                        // create clojure
                        (function () {
                            var pick = pickingQueue[i],
                                pickArrayLength = pick.width * pick.width * 4,
                                array = new Uint8Array(pickArrayLength),
                                objects = [],
                                objectCount = {},
                                j,
                                subArray,
                                uid,
                                foundObj;
                            engine.gl.readPixels(pick.x, pick.y, pick.width, pick.height, Constants.GL_RGBA, Constants.GL_UNSIGNED_BYTE, array);
                            for (j = 0; j < pickArrayLength; j += 4) {
                                subArray = array.subarray(j, j + 4);
                                uid = Util.vec4uint8ToUint32(subArray);
                                if (uid > 0) {
                                    if (objectCount[uid]) {
                                        objectCount[uid]++;
                                    } else {
                                        foundObj = sceneObj.getObjectByUID(uid);
                                        if (foundObj) {
                                            if (pick.point) {
                                                foundObj = new PickResult(engine, pickingRenderTarget, foundObj, pick.x, pick.y, setupCamera, engineUniforms);
                                            }
                                            objects.push(foundObj);
                                            objectCount[uid] = 1;
                                        }
                                    }
                                }
                            }
                            if (objects.length) {
                                engine.eventQueue.add(function () {
                                    var i,
                                        obj;
                                    for (i = 0; i < objects.length; i++) {
                                        obj = objects[i];
                                        pick.gameObjectPickedFn(obj, objectCount[obj.uid]);
                                    }
                                }, 0);
                            }
                        }());
                    }
                    pickingQueue.length = 0;
                }
            };
        };

    });