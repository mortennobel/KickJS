define(["kick/core/Constants", "kick/core/Util", "kick/math/Quat", "kick/math/Mat4", "kick/math/Vec4", "kick/math/Vec3", "kick/math/Aabb", "kick/math/Frustum", "./EngineUniforms", "./CameraPicking", "kick/material/Material", "kick/texture/RenderTexture"],
    function (Constants, Util, Quat, Mat4, Vec4, Vec3, Aabb, Frustum, EngineUniforms, CameraPicking, Material, RenderTexture) {
        "use strict";

        /**
         * @module kick.scene
         */

        var DEBUG = Constants._DEBUG,
            ASSERT = Constants._ASSERT,
            Camera;

        /**
         * Creates a game camera
         * @class Camera
         * @namespace kick.scene
         * @extends kick.scene.Component
         * @constructor
         * @param {Config} configuration with same properties as the Camera
         */
        Camera = function (config) {
            var gl,
                glState,
                thisObj = this,
                transform,
                engine,
                _enabled = true,
                c = Constants,
                _renderShadow = false,
                _renderTarget = null,
                _fieldOfView = 60 * Constants._DEGREE_TO_RADIAN,
                _near = 0.1,
                _far = 1000,
                _left = -1,
                _right = 1,
                _bottom = -1,
                _top = 1,
                _clearColor = Vec4.clone([0, 0, 0, 1]),
                _shadowmapClearColor = Vec4.clone([1, 1, 1, 1]),
                _perspective = true,
                _clearFlagColor = true,
                _clearFlagDepth = true,
                _replacementMaterial = null,
                _currentClearFlags,
                _cameraIndex = 1,
                _layerMask = 0xffffffff,
                _shadowmapMaterial,
                _scene,
                pickingObject = null,
                projectionMatrix = Mat4.create(),
                viewMatrix = Mat4.create(),
                viewProjectionMatrix = Mat4.create(),
                lightMatrix = Mat4.create(),
                engineUniforms = new EngineUniforms({
                    viewMatrix: viewMatrix,
                    projectionMatrix: projectionMatrix,
                    viewProjectionMatrix: viewProjectionMatrix,
                    lightMatrix: lightMatrix,
                    currentCamera: thisObj,
                    currentCameraTransform: null
                }),
                isContextListenerRegistered = false,
                contextListener = {
                    contextLost: function () {
                        gl = null;
                    },
                    contextRestored: function (newGL) {
                        gl = newGL;
                    }
                },
                renderableComponentsBackGroundAndGeometry = [],
                renderableComponentsTransparent = [],
                renderableComponentsOverlay = [],
                renderableComponentsArray = [renderableComponentsBackGroundAndGeometry, renderableComponentsTransparent, renderableComponentsOverlay],
                _normalizedViewportRect = Vec4.clone([0, 0, 1, 1]),
                offsetMatrix = Mat4.clone([
                    0.5, 0, 0, 0,
                    0, 0.5, 0, 0,
                    0, 0, 0.5, 0,
                    0.5, 0.5, 0.5, 1
                ]),
                shadowLightProjection,
                shadowLightOffsetFromCamera,
                isNumber = function (o) {
                    return typeof (o) === "number";
                },
                isBoolean = function (o) {
                    return typeof (o) === "boolean";
                },
                computeClearFlag = function () {
                    _currentClearFlags = (_clearFlagColor ? c.GL_COLOR_BUFFER_BIT : 0) | (_clearFlagDepth ? c.GL_DEPTH_BUFFER_BIT : 0);
                },
                setupClearColor = function (color) {
                    if (glState.currentClearColor !== color) {
                        glState.currentClearColor = color;
                        gl.clearColor(color[0], color[1], color[2], color[3]);
                    }
                },
                assertNumber = function (newValue, name) {
                    if (!isNumber(newValue)) {
                        Util.fail("Camera." + name + " must be number");
                    }
                },
                setupViewport = function (offsetX, offsetY, width, height) {
                    gl.viewport(offsetX, offsetY, width, height);
                    gl.scissor(offsetX, offsetY, width, height);
                },
                /**
                 * Clear the screen and set the projectionMatrix and modelViewMatrix on the glState object
                 * @method setupCamera
                 * @private
                 */
                setupCamera = function () {
                    var viewportDimension = _renderTarget ? _renderTarget.dimension : glState.viewportSize,
                        viewPortWidth = viewportDimension[0],
                        viewPortHeight = viewportDimension[1],
                        offsetX = viewPortWidth * _normalizedViewportRect[0],
                        offsetY = viewPortHeight * _normalizedViewportRect[1],
                        width = viewPortWidth * _normalizedViewportRect[2],
                        height = viewPortHeight * _normalizedViewportRect[3],
                        globalMatrixInv;
                    setupViewport(offsetX, offsetY, width, height);
                    glState.currentMaterial = null; // clear current material
                    // setup render target
                    if (glState.renderTarget !== _renderTarget) {
                        if (_renderTarget) {
                            _renderTarget.bind();
                        } else {
                            gl.bindFramebuffer(Constants.GL_FRAMEBUFFER, null);
                        }
                        glState.renderTarget = _renderTarget;
                    }

                    setupClearColor(_clearColor);
                    gl.clear(_currentClearFlags);

                    if (_perspective) {
                        Mat4.perspective(projectionMatrix, _fieldOfView, glState.viewportSize[0] / glState.viewportSize[1],
                            _near, _far);
                    } else {
                        Mat4.ortho(projectionMatrix, _left, _right, _bottom, _top,
                            _near, _far);
                    }

                    globalMatrixInv = transform.getGlobalTRSInverse();
                    Mat4.copy(viewMatrix, globalMatrixInv);

                    Mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

                },
                /**
                 * Compare two objects based on renderOrder value, then on material.shader.uid (if exist)
                 * and finally on mesh.
                 * @method compareRenderOrder
                 * @param {Component} a
                 * @param {Component} b
                 * @return Number
                 * @private
                 */
                compareRenderOrder = function (a, b) {
                    var aRenderOrder = a.renderOrder || 1000,
                        bRenderOrder = b.renderOrder || 1000,
                        getMeshUid,
                        getMeshShaderUid = function (o, defaultValue) {
                            var names = ["material", "shader", "uid"],
                                i;
                            for (i = 0; i < names.length; i++) {
                                o = o[names[i]];
                                if (!o) {
                                    if (DEBUG) {
                                        Util.warn("Cannot find uid of " + o);
                                    }
                                    return defaultValue;
                                }
                            }
                            return o;
                        };
                    getMeshUid = function (o, defaultValue) {
                        return o.mesh.uid || defaultValue;
                    };
                    if (aRenderOrder === bRenderOrder && a.material && b.material) {
                        aRenderOrder = getMeshShaderUid(a, aRenderOrder);
                        bRenderOrder = getMeshShaderUid(b, aRenderOrder);
                    }
                    if (aRenderOrder === bRenderOrder && a.mesh && b.mesh) {
                        aRenderOrder = getMeshUid(a, aRenderOrder);
                        bRenderOrder = getMeshUid(b, aRenderOrder);
                    }
                    return aRenderOrder - bRenderOrder;
                },
                sortTransparentBackToFront = function () {
                    // calculate distances
                    var temp = Vec3.create(),
                        cameraPosition = transform.position,
                        i,
                        object,
                        objectPosition;
                    for (i = renderableComponentsTransparent.length - 1; i >= 0; i--) {
                        object = renderableComponentsTransparent[i];
                        objectPosition = object.gameObject.transform.position;
                        object.distanceToCamera = Vec3.squaredLength(Vec3.subtract(temp, objectPosition, cameraPosition));
                    }
                    function compareDistanceToCamera(a, b) {
                        return b.distanceToCamera - a.distanceToCamera;
                    }
                    renderableComponentsTransparent.sort(compareDistanceToCamera);
                },
                /**
                 * @method renderSceneObjects
                 * @param sceneLightObj
                 * @param shader
                 * @private
                 */
                renderSceneObjects = (function () {
                    var aabbWorldSpace = Aabb.create(),
                        frustumPlanes = new Float32Array(24);
                    return function (sceneLightObj, replacementMaterial) {
                        var cullByViewFrustum = function (component) {
                                var componentAabb = component.aabb,
                                    gameObject = component.gameObject;
                                if (componentAabb && gameObject) {
                                    Aabb.transform(aabbWorldSpace, componentAabb, gameObject.transform.getGlobalMatrix());
                                    return Frustum.intersectAabb(frustumPlanes, aabbWorldSpace) === Frustum.OUTSIDE;
                                }
                                return false;
                            },
                            render = function (renderableComponents) {
                                var length = renderableComponents.length,
                                    j,
                                    renderableComponent;
                                for (j = 0; j < length; j++) {
                                    renderableComponent = renderableComponents[j];
                                    if (!cullByViewFrustum(renderableComponent)) {
                                        renderableComponent.render(engineUniforms, replacementMaterial);
                                    }
                                }
                            };
                        // update frustum planes
                        Frustum.extractPlanes(frustumPlanes, engineUniforms.viewProjectionMatrix, false);
                        engineUniforms.sceneLights = sceneLightObj;
                        render(renderableComponentsBackGroundAndGeometry);
                        render(renderableComponentsTransparent);
                        render(renderableComponentsOverlay);
                    };
                }()),
                renderShadowMap = function (sceneLightObj) {
                    var directionalLight = sceneLightObj.directionalLight,
                        directionalLightTransform = directionalLight.gameObject.transform,
                        shadowRenderTexture = directionalLight.shadowRenderTexture,
                        renderTextureDimension = shadowRenderTexture.dimension,
                        renderTextureWidth = renderTextureDimension[0],
                        renderTextureHeight = renderTextureDimension[1],
                        transformedOffsetFromCamera = Vec3.create(),
                        cameraPosition = Vec3.create();
                    setupViewport(0, 0, renderTextureWidth, renderTextureHeight);

                    shadowRenderTexture.bind();
                    setupClearColor(_shadowmapClearColor);
                    gl.clear(c.GL_COLOR_BUFFER_BIT | c.GL_DEPTH_BUFFER_BIT);

                    // fitting:
                    // Using a sphere with the center in front of the camera (based on 0.5 * engine.config.shadowDistance)
                    // The actual light volume is a bit larger than the sphere (to include the corners).
                    // The near plane of the light volume is extended by the engine.config.shadowNearMultiplier
                    // Note that this is a very basic fitting algorithm with rooms for improvement
                    Mat4.copy(projectionMatrix, shadowLightProjection);

                    // find the position of the light 'center' in world space
                    transformedOffsetFromCamera = Quat.multiplyVec3(transformedOffsetFromCamera, transform.rotation, [0, 0, -shadowLightOffsetFromCamera]);
                    cameraPosition = Vec3.add(cameraPosition, transformedOffsetFromCamera, transform.position);
                    // adjust to reduce flicker when rotating camera
                    cameraPosition[0] = Math.round(cameraPosition[0]);
                    cameraPosition[1] = Math.round(cameraPosition[1]);
                    cameraPosition[2] = Math.round(cameraPosition[2]);

                    Mat4.setTRSInverse(viewMatrix, cameraPosition, directionalLightTransform.localRotation, [1, 1, 1]);

                    Mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

                    // update light matrix (will be used when scene is rendering with shadow map shader)
                    Mat4.multiply(lightMatrix, Mat4.multiply(lightMatrix, offsetMatrix, projectionMatrix), viewMatrix);

                    renderSceneObjects(sceneLightObj, _shadowmapMaterial);
                },
                componentListener = {
                    /**
                     * Add components that implements the render function and match the camera layerMask to cameras renderable components
                     * @method componentsAdded
                     * @param {Array_kick.scene.Component} components
                     * @private
                     */
                    componentsAdded : function (components) {
                        var i,
                            component,
                            renderOrder,
                            array;
                        for (i = components.length - 1; i >= 0; i--) {
                            component = components[i];
                            if (typeof (component.render) === "function" && (component.gameObject.layer & _layerMask)) {
                                renderOrder = component.renderOrder || 1000;
                                if (renderOrder < 2000) {
                                    array = renderableComponentsBackGroundAndGeometry;
                                } else if (renderOrder >= 3000) {
                                    array = renderableComponentsOverlay;
                                } else {
                                    array = renderableComponentsTransparent;
                                }
                                if (!Util.contains(array, component)) {
                                    Util.insertSorted(component, array, compareRenderOrder);
                                }
                            }
                        }
                    },

                    /**
                     * @method componentsRemoved
                     * @param {Array_kick.scene.Component} components
                     * @return {Boolean}
                     * @private
                     */
                    componentsRemoved : function (components) {
                        var removed = false,
                            i,
                            j,
                            component;
                        for (i = components.length - 1; i >= 0; i--) {
                            component = components[i];
                            if (typeof (component.render) === "function") {
                                for (j = renderableComponentsArray.length - 1; j >= 0; j--) {
                                    removed |= Util.removeElementFromArray(renderableComponentsArray[j], component);
                                }
                            }
                        }
                        return removed;
                    },
                    componentUpdated : function (component) {
                        var wrap = [component],
                            isRemoved = componentListener.componentsRemoved(wrap);
                        if (isRemoved) { // only add if component also removed
                            componentListener.componentsAdded(wrap);
                        }
                    }
                };

            /**
             * Schedules a camera picking session. During next repaint a picking session is done. If the pick hits some
             * game objects, then a callback is added to the event queue (and will run in next frame). The pickObject can
             * be used for getting UV coordinate for the point (if available)
             * @method pickPoint
             * @param {function} gameObjectPickedFn callback function with the signature function(pickObject)
             * @param {Number} x coordinate in screen coordinates (between 0 and canvas width - 1)
             * @param {Number} y coordinate in screen coordinates (between 0 and canvas height - 1)
             */
            this.pickPoint = function (gameObjectPickedFn, x, y) {
                if (!pickingObject) {
                    pickingObject = new CameraPicking(setupClearColor, renderSceneObjects, _scene, setupCamera);
                }
                pickingObject.add({
                    gameObjectPickedFn: gameObjectPickedFn,
                    x: x,
                    y: glState.viewportSize[1] - y,
                    width: 1,
                    height: 1,
                    point: true
                });
            };

            /**
             * Schedules a camera picking session. During next repaint a picking session is done. If the pick hits some
             * game objects, then a callback is added to the event queue (and will run in next frame).
             * Note since the WebGL window coordinate has the origin in the lower left corner and browsers coordinate
             * system has the origin in the upper left corner, you may need to compute y as canvas.height - mouseCoordinate.y
             * @method pick
             * @param {function} gameObjectPickedFn callback function with the signature function(gameObject, hitCount)
             * @param {Number} x coordinate in screen coordinates (between 0 and canvas width - 1)
             * @param {Number} y coordinate in screen coordinates (between 0 and canvas height - 1)
             */
            this.pick = function (gameObjectPickedFn, x, y, width, height) {
                width = width || 1;
                height = height || 1;
                if (!pickingObject) {
                    pickingObject = new CameraPicking(setupClearColor, renderSceneObjects, _scene);
                }
                pickingObject.add({
                    gameObjectPickedFn: gameObjectPickedFn,
                    x: x,
                    y: y,
                    width: width,
                    height: height
                });
            };

            /**
             * Handles the camera setup (get fast reference to transform and glcontext).
             * Also register component listener on scene
             * @method activated
             */
            this.activated = function () {
                var gameObject = this.gameObject,
                    shadowRadius,
                    nearPlanePosition,
                    _shadowmapShader,
                    materialConfig;
                engineUniforms.currentCameraTransform = gameObject.transform;
                engine = gameObject.engine;
                if (!isContextListenerRegistered) {
                    isContextListenerRegistered = true;
                    engine.addContextListener(contextListener);
                }
                transform = gameObject.transform;
                gl = engine.gl;
                glState = engine.glState;
                _scene = gameObject.scene;
                _scene.addComponentListener(componentListener);

                if (engine.config.shadows) {
                    _shadowmapShader = engine.project.load(engine.project.ENGINE_SHADER___SHADOWMAP);
                    materialConfig = {
                        name: "Shadow map material",
                        shader: _shadowmapShader
                    };
                    _shadowmapMaterial = new Material(materialConfig);

                    // calculate the shadow projection based on engine.config parameters
                    shadowLightOffsetFromCamera = engine.config.shadowDistance * 0.5; // first find radius
                    shadowRadius = shadowLightOffsetFromCamera * 1.55377397403004; // sqrt(2+sqrt(2))
                    nearPlanePosition = -shadowRadius * engine.config.shadowNearMultiplier;
                    shadowLightProjection = Mat4.create();
                    Mat4.ortho(shadowLightProjection, -shadowRadius, shadowRadius, -shadowRadius, shadowRadius,
                        nearPlanePosition, shadowRadius);

                } else if (_renderShadow) {
                    _renderShadow = false; // disable render shadow
                    if (ASSERT) {
                        Util.fail("engine.config.shadows must be enabled for shadows");
                    }
                }
            };

            /**
             * Deregister component listener on scene
             * @method deactivated
             */
            this.deactivated = function () {
                _scene.removeComponentListener(thisObj);
            };

            /**
             * @method renderScene
             * @param {kick.scene.SceneLights} sceneLightObj
             */
            this.renderScene = function (sceneLightObj) {
                var i,
                    textureId;
                if (!_enabled) {
                    return;
                }
                if (_renderShadow && sceneLightObj.directionalLight && sceneLightObj.directionalLight.shadow) {
                    glState.currentMaterial = null; // clear current material
                    renderShadowMap(sceneLightObj);
                }
                setupCamera();

                sceneLightObj.recomputeLight(viewMatrix);
                if (renderableComponentsTransparent.length > 0) {
                    sortTransparentBackToFront();
                }
                renderSceneObjects(sceneLightObj, _replacementMaterial);

                if (_renderTarget && _renderTarget.colorTexture && _renderTarget.colorTexture.generateMipmaps) {
                    textureId = _renderTarget.colorTexture.textureId;
                    gl.bindTexture(gl.TEXTURE_2D, textureId);
                    gl.generateMipmap(gl.TEXTURE_2D);
                }
                if (pickingObject) {
                    pickingObject.handlePickRequests(sceneLightObj, engineUniforms);
                }
            };

            Object.defineProperties(this, {
                /**
                 * Allows usage of replacement material on camera rendering
                 * Default value is null.
                 * @property replacementMaterial
                 * @type kick.material.Shader
                 */
                replacementMaterial: {
                    get: function () { return _replacementMaterial; },
                    set: function (newValue) { _replacementMaterial = newValue; }
                },
                /**
                 * Default is true
                 * @property enabled
                 * @type Boolean
                 */
                enabled: {
                    get: function () { return _enabled; },
                    set: function (newValue) { _enabled = newValue; }
                },
                /**
                 * Default false
                 * @property renderShadow
                 * @type Boolean
                 */
                renderShadow: {
                    get: function () { return _renderShadow; },
                    set: function (newValue) {
                        if (engine) { // if object is initialized
                            if (engine.config.shadows) {
                                _renderShadow = newValue;
                            } else if (newValue) {
                                if (ASSERT) {
                                    Util.fail("engine.config.shadows must be enabled for shadows");
                                }
                            }
                        } else {
                            _renderShadow = newValue;
                        }
                    }
                },
                /**
                 * Camera renders only objects where the components layer exist in the layer mask. <br>
                 * @property layerMask
                 * @type Number
                 */
                layerMask: {
                    get: function () { return _layerMask; },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            if (!isNumber(newValue)) {
                                Util.fail("Camera.layerMask should be a number");
                            }
                        }
                        _layerMask = newValue;
                    }
                },
                /**
                 * Set the render target of the camera. Null means screen framebuffer.<br>
                 * @property renderTarget
                 * @type kick.texture.RenderTexture
                 */
                renderTarget: {
                    get: function () { return _renderTarget; },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            if (newValue !== null && !(newValue instanceof RenderTexture)) {
                                Util.fail("Camera.renderTarget should be null or a kick.texture.RenderTexture");
                            }
                        }
                        _renderTarget = newValue;
                    }
                },
                /**
                 * Set the field of view Y in degrees<br>
                 * Only used when perspective camera type. Default 60.0.
                 * Must be between 1 and 179
                 * @property fieldOfView
                 * @type Number
                 */
                fieldOfView: {
                    get: function () { return _fieldOfView * Constants._RADIAN_TO_DEGREE; },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            assertNumber(newValue, "fieldOfView");
                        }
                        _fieldOfView = Math.min(179, Math.max(newValue, 1)) * Constants._DEGREE_TO_RADIAN;
                    }
                },
                /**
                 * Set the near clipping plane of the view volume<br>
                 * Used in both perspective and orthogonale camera.<br>
                 * Default 0.1
                 * @property near
                 * @type Number
                 */
                near: {
                    get: function () {
                        return _near;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            assertNumber(newValue, "near");
                        }
                        _near = newValue;
                    }
                },
                /**
                 * Set the far clipping plane of the view volume<br>
                 * Used in both perspective and orthogonale camera.<br>
                 * Default 1000.0
                 * @property far
                 * @type Number
                 */
                far: {
                    get: function () {
                        return _far;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            assertNumber(newValue, "far");
                        }
                        _far = newValue;
                    }
                },
                /**
                 * True means camera is perspective projection, false means orthogonale projection<br>
                 * Default true
                 * @property perspective
                 * @type Boolean
                 */
                perspective: {
                    get: function () {
                        return _perspective;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            if (!isBoolean(newValue)) {
                                Util.fail("Camera.perspective must be a boolean");
                            }
                        }
                        _perspective = newValue;
                    }
                },
                /**
                 * Only used for orthogonal camera type (!cameraTypePerspective). Default -1
                 * @property left
                 * @type Number
                 */
                left: {
                    get: function () {
                        return _left;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            assertNumber(newValue, "left");
                        }
                        _left = newValue;
                    }
                },
                /**
                 * Only used for orthogonal camera type (!cameraTypePerspective). Default 1
                 * @property left
                 * @type Number
                 */
                right: {
                    get: function () {
                        return _right;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            assertNumber(newValue, "right");
                        }
                        _right = newValue;
                    }
                },
                /**
                 * Only used when orthogonal camera type (!cameraTypePerspective). Default -1
                 * @property bottom
                 * @type Number
                 */
                bottom: {
                    get: function () {
                        return _bottom;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            assertNumber(newValue, "bottom");
                        }
                        _bottom = newValue;
                    }
                },
                /**
                 * Only used when orthogonal camera type (!cameraTypePerspective). Default 1
                 * @property top
                 * @type Number
                 */
                top: {
                    get: function () {
                        return _top;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            assertNumber(newValue, "top");
                        }
                        _top = newValue;
                    }
                },
                /**
                 * The sorting order when multiple cameras exists in the scene.<br>
                 * Cameras with lowest number is rendered first.
                 * @property cameraIndex
                 * @type Number
                 */
                cameraIndex: {
                    get: function () {
                        return _cameraIndex;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            assertNumber(newValue, "cameraIndex");
                        }
                        _cameraIndex = newValue;
                    }
                },
                /**
                 * Only used when orthogonal camera type (!cameraTypePerspective). Default [0,0,0,1]
                 * @property clearColor
                 * @type kick.math.Vec4
                 */
                clearColor: {
                    get: function () {
                        return Vec4.clone(_clearColor);
                    },
                    set: function (newValue) {
                        _clearColor = Vec4.clone(newValue);
                    }
                },
                /**
                 * Indicates if the camera should clear color buffer.<br>
                 * Default value is true
                 * @property clearFlagColor
                 * @type Boolean
                 */
                clearFlagColor: {
                    get: function () {
                        return _clearFlagColor;
                    },
                    set: function (newValue) {
                        computeClearFlag();
                        _clearFlagColor = newValue;
                    }
                },
                /**
                 * Indicates if the camera should clear the depth buffer.<br>
                 * Default is true.
                 * @property clearFlagDepth
                 * @type Boolean
                 */
                clearFlagDepth: {
                    get: function () {
                        return _clearFlagDepth;
                    },
                    set: function (newValue) {
                        computeClearFlag();
                        _clearFlagDepth = newValue;
                    }
                },
                /**
                 * Normalized viewport rect [xOffset,yOffset,xWidth,yHeight]<br>
                 * Default is [0,0,1,1]
                 * @property normalizedViewportRect
                 * @type Array_Number
                 */
                normalizedViewportRect: {
                    get: function () {
                        return _normalizedViewportRect;
                    },
                    set: function (newValue) {
                        if (c._ASSERT) {
                            if (newValue.length !== 4) {
                                Util.fail("Camera.normalizedViewportRect must be Float32Array of length 4");
                            }
                        }
                        Vec4.copy(_normalizedViewportRect, newValue);
                    }
                }
            });

            /**
             * Destroy camera component
             * @method destroy
             */
            this.destroy = function () {
                if (isContextListenerRegistered) {
                    isContextListenerRegistered = false;
                    engine.removeContextListener(contextListener);
                }
            };

            /**
             * Serialize object
             * @method toJSON
             * @return {Object} data object
             */
            this.toJSON = function () {
                return {
                    type: "kick/scene/Camera",
                    uid: thisObj.uid || (engine ? engine.getUID(thisObj) : 0),
                    config: {
                        enabled: _enabled,
                        renderShadow: _renderShadow,
                        layerMask: _layerMask,
                        renderTarget: Util.getJSONReference(engine, _renderTarget),
                        fieldOfView: _fieldOfView,
                        near: _near,
                        far: _far,
                        perspective: _perspective,
                        left: _left,
                        right: _right,
                        bottom: _bottom,
                        top: _top,
                        cameraIndex: _cameraIndex,
                        clearColor: Util.typedArrayToArray(_clearColor),
                        clearFlagColor: _clearFlagColor,
                        clearFlagDepth: _clearFlagDepth,
                        normalizedViewportRect: Util.typedArrayToArray(_normalizedViewportRect)
                    }
                };
            };

            Util.applyConfig(this, config);
            computeClearFlag();
        };

        /**
         * Reset the camera clear flags
         * @method setupClearFlags
         * @param {Boolean} clearColor
         * @param {Boolean} clearDepth
         */
        Camera.prototype.setupClearFlags = function (clearColor, clearDepth) {
            this.clearColor = clearColor;
            this.clearDepth = clearDepth;
            delete this._currentClearFlags;
        };

        return Camera;
    });