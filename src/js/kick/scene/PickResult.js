define(["./MeshRenderer", "kick/material/Material", "kick/core/Constants", "kick/core/EngineSingleton", "kick/core/Util", "kick/math/Vec4", "kick/math/Vec3", "kick/math/Vec2"],
    function (MeshRenderer, Material, Constants, EngineSingleton, Util, vec4, vec3, vec2) {
        "use strict";

        /**
         * Result of Camera.pickPoint.
         *
         * @class PickResult
         * @namespace kick.scene
         * @constructor
         * @param pickingRenderTarget
         * @param {kick.scene.GameObject} gameObject
         * @param {Integer} x
         * @param {Integer} y
         * @param {EngineUniforms} engineUniforms
         * @param {kick.scene.Camera}
         * @constructor
         */
        return function (pickingRenderTarget, gameObject, x, y, engineUniforms, camera) {
            if (Constants._ASSERT) {
                if (pickingRenderTarget === EngineSingleton.engine) {
                    Util.fail("PickResult constructor changed - engine parameter is removed");
                }
            }
            var normal,
                uv,
                depth,
                engine = EngineSingleton.engine,
                /**
                 * @private
                 * @method renderObjectWithShader
                 * @param {kick.material.Shader} shader
                 * @return kick.math.Vec4
                 */
                renderObjectWithShader = function (shader) {
                    var array = new Uint8Array(4),
                        meshRenderers = gameObject.getComponentsWithMethod("render"),
                        i,
                        material = new Material({
                            name: "PickResult",
                            shader: shader
                        });
                    camera.setupCamera();
                    pickingRenderTarget.bind();
                    engine.gl.clear(Constants.GL_COLOR_BUFFER_BIT | Constants.GL_DEPTH_BUFFER_BIT);
                    for (i = 0; i < meshRenderers.length; i++) {
                        meshRenderers[i].render(engineUniforms, material);
                    }

                    engine.gl.readPixels(x, y, 1, 1, Constants.GL_RGBA, Constants.GL_UNSIGNED_BYTE, array);
                    return array;
                },
                readNormal = function () {
                    var shader = engine.project.load(engine.project.ENGINE_SHADER___PICK_NORMAL);
                    normal = renderObjectWithShader(shader);
                    // normal = (normal / 255 - 0.5) * 2
                    normal = vec3.scale(vec3.create(), normal, 1 / 255);
                    vec3.add(normal, normal, [-0.5, -0.5, -0.5]);
                    vec3.scale(normal, normal, 2);
                },
                readUV = function () {
                    var shader = engine.project.load(engine.project.ENGINE_SHADER___PICK_UV);
                    uv = renderObjectWithShader(shader);
                    uv = vec2.scale(vec2.create(), uv, 1 / 255);
                },
                readDepth = function () {
                    var shader = engine.project.load(engine.project.ENGINE_SHADER___SHADOWMAP),
                        depthPacked = renderObjectWithShader(shader),
                        bit_shift = [1 / (16777216 * 255), 1 / (65536 * 255), 1 / (256 * 255), 1 / 255];
                    depth = vec4.dot(depthPacked, bit_shift);
                };


            Object.defineProperties(this, {
                /**
                 * Reference to the found gameObject
                 * @property gameObject
                 * @type kick.scene.GameObject
                 */
                gameObject: {
                    value: gameObject
                },
                /**
                 * The x value of the pick
                 * @property x
                 * @type Number
                 */
                x: {
                    value: x
                },
                /**
                 * The y value of the pick
                 * @property y
                 * @type Number
                 */
                y: {
                    value: y
                },
                /**
                 * The normal (in object coordinates) at the pick point
                 * @property normal
                 * @type kick.math.Vec3
                 */
                normal: {
                    get: function () {
                        if (!normal) {
                            readNormal();
                        }
                        return normal;
                    }
                },
                /**
                 * The uv of the pick point
                 * @property uv
                 * @type kick.math.Vec2
                 */
                uv: {
                    get: function () {
                        if (!uv) {
                            readUV();
                        }
                        return uv;
                    }
                },
                /**
                 * The distance of the pick point to the camera
                 * @property distance
                 * @type Number
                 */
                distance : {
                    get: function () {
                        if (!depth) {
                            readDepth();
                        }
                        var zFar = camera.far,
                            zNear = camera.near;

                        return 2 * zFar * zNear / (zFar + zNear - (zFar - zNear) * (2 * depth - 1));
                    }
                },
                /**
                 * The 3D point in world coordinates of the selected point
                 * @property point
                 * @type kick.math.Vec3
                 */
                point: {
                    get: function () {
                        if (!depth) {
                            readDepth();
                        }
                        return vec3.unproject(vec3.create(), [x, y, depth], engineUniforms.viewMatrix, engineUniforms.projectionMatrix, camera.viewportRect);
                    }
                }
            });
        };
    });
