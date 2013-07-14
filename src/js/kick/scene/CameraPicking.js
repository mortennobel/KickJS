define(["kick/math/Vec4", "kick/material/Material", "kick/texture/RenderTexture", "kick/core/Constants", "kick/core/Util", "./PickResult", "kick/core/EngineSingleton"],
    function (Vec4, Material, RenderTexture, Constants, Util, PickResult, EngineSingleton) {
        "use strict";

        /**
         * Camera picking object used by Camera objects to manage picking
         * @private
         * @class CameraPicking
         * @param {Function} setupClearColor
         * @param {Function} renderSceneObjects
         * @param {Scene} sceneObj
         * @param {kick.scene.Camera} camera
         * @constructor
         */
        return function (setupClearColor, renderSceneObjects, sceneObj, camera) {
            if (Constants._ASSERT) {
                if (setupClearColor === EngineSingleton.engine) {
                    Util.fail("CameraPicking constructor changed - engine parameter is removed");
                }
            }
            var engine = EngineSingleton.engine,
                pickingQueue = null,
                pickingMaterial = null,
                pickingRenderTarget = null,
                pickingClearColor = Vec4.create(),
                glState = engine.glState,
                i,
                size = new Float32Array(glState.viewportSize),
                canvasResizedListener = function(newCanvasDimensions){
                    size = new Float32Array(newCanvasDimensions);
                },
                init = function () {
                    pickingQueue = [];
                    pickingMaterial = new Material(
                        {
                            shader: engine.project.load(engine.project.ENGINE_SHADER___PICK),
                            name: "Picking material"
                        }
                    );
                    pickingRenderTarget = new RenderTexture({
                        dimension: size
                    });
                    engine.addEventListener("canvasResized",canvasResizedListener);
                    pickingRenderTarget.name = "__pickRenderTexture";
                };

            init();

            /**
             * @method destroy
             */
            this.destroy = function(){
                engine.removeEventListener("canvasResized",canvasResizedListener);
                if (pickingRenderTarget){
                    pickingRenderTarget.destroy();
                    pickingRenderTarget = null;
                }
            };

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
             * @param {kick.scene.SceneLights} sceneLightObj
             * @param {kick.scene.EngineUniforms} engineUniforms
             */
            this.handlePickRequests = function (sceneLightObj, engineUniforms) {
                if (pickingQueue.length > 0) {
                    if (pickingRenderTarget.dimension[0] !== size[0] ||
                        pickingRenderTarget.dimension[1] !== size[1]){
                        pickingRenderTarget.dimension = size;
                    }
                    glState.currentMaterial = null; // clear current material
                    pickingRenderTarget.bind();
                    setupClearColor(pickingClearColor);
                    engine.gl.clear(Constants.GL_COLOR_BUFFER_BIT | Constants.GL_DEPTH_BUFFER_BIT);
                    engine.gl.pixelStorei(Constants.GL_PACK_ALIGNMENT, 1);
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
                                                foundObj = new PickResult(pickingRenderTarget, foundObj, pick.x, pick.y, engineUniforms, camera);
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
                    pickingRenderTarget.unbind();
                }
            };
        };

    });