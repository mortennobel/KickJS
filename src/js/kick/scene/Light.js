define(["kick/core/Constants", "kick/core/Util", "kick/math/Vec3", "kick/texture/Texture", "kick/texture/RenderTexture"],
    function (Constants, Util, Vec3, Texture, RenderTexture) {
        "use strict";

        var ASSERT = Constants._ASSERT,
            Light;

        /**
         * A light object.<br>
         * Note that each scene can only have one ambient light and one directional light.
         * @class Light
         * @namespace kick.scene
         * @extends kick.scene.Component
         * @constructor
         * @param {Object} config
         * @final
         */
        Light = function (config) {
            var thisObj = this,
                color = Vec3.clone([1.0, 1.0, 1.0]),
                engine,
                type = Constants._LIGHT_TYPE_POINT,
                _shadow = false,
                _shadowStrength = 1.0,
                _shadowBias = 0.05,
                _shadowTexture = null,
                _shadowRenderTexture = null,
                attenuation = Vec3.clone([1, 0, 0]),
                intensity = 1,
                transform,
                colorIntensity = Vec3.clone([1.0, 1.0, 1.0]),
                updateIntensity = function () {
                    Vec3.copy(colorIntensity, [color[0] * intensity, color[1] * intensity, color[2] * intensity]);
                },
                gameObject,
                scriptPriority,
                updateShadowTexture = function () {
                    if (_shadow) {
                        if (!_shadowTexture) {
                            _shadowTexture = new Texture({
                                minFilter: Constants.GL_NEAREST,
                                magFilter: Constants.GL_NEAREST,
                                wrapS: Constants.GL_CLAMP_TO_EDGE,
                                wrapT: Constants.GL_CLAMP_TO_EDGE,
                                flipY: false,
                                generateMipmaps: false
                            });
                            var maxTextureSize = Math.min(engine.gl.getParameter(Constants.GL_MAX_RENDERBUFFER_SIZE),
                                engine.gl.getParameter(Constants.GL_MAX_TEXTURE_SIZE));
                            maxTextureSize = Math.min(maxTextureSize, 4096) * engine.config.shadowMapQuality;
                            _shadowTexture.setImageData(maxTextureSize, maxTextureSize, 0, Constants.GL_UNSIGNED_BYTE, null, "");
                            _shadowRenderTexture = new RenderTexture({
                                colorTexture: _shadowTexture
                            });
                        }
                    } else if (_shadowRenderTexture) {
                        _shadowRenderTexture.destroy();
                        _shadowTexture.destroy();
                        _shadowRenderTexture = null;
                        _shadowTexture = null;
                    }
                };
            Object.defineProperties(this, {
                /**
                 * Short for lightObj.gameObject.transform
                 * @property transform
                 * @type kick.scene.Transform
                 */
                transform: {
                    get: function () {
                        return transform;
                    }
                },
                /**
                 * @property shadowRenderTexture
                 * @type kick.texture.RenderTexture
                 */
                shadowRenderTexture: {
                    get: function () {
                        return _shadowRenderTexture;
                    }
                },
                /**
                 * @property shadowTexture
                 * @type kick.texture.Texture
                 */
                shadowTexture: {
                    get: function () {
                        return _shadowTexture;
                    }
                },
                /**
                 * Default value is false.
                 * Only directional light supports shadows.
                 * @property shadow
                 * @type boolean
                 */
                shadow: {
                    get: function () {
                        return _shadow;
                    },
                    set: function (value) {
                        if (value !== _shadow) {
                            _shadow = value;
                            if (engine) {
                                updateShadowTexture();
                            }
                        }
                    },
                    enumerable: true
                },
                /**
                 * Shadow strength (between 0.0 and 1.0). Default value is 1.0
                 * @property shadowStrength
                 * @type Number
                 */
                shadowStrength: {
                    get: function () {
                        return _shadowStrength;
                    },
                    set: function (value) {
                        _shadowStrength = value;
                    },
                    enumerable: true
                },
                /**
                 * Shadow bias. Default value is 0.05
                 * @property shadowBias
                 * @type Number
                 */
                shadowBias: {
                    get: function () {
                        return _shadowBias;
                    },
                    set: function (value) {
                        _shadowBias = value;
                    },
                    enumerable: true
                },
                /**
                 * Color intensity of the light (RGB). Default [1,1,1]
                 * @property color
                 * @type kick.math.Vec3
                 */
                color: {
                    get: function () {
                        return Vec3.clone(color);
                    },
                    set: function (value) {
                        if (ASSERT) {
                            if (value.length !== 3) {
                                Util.fail("Light color must be vec3");
                            }
                        }
                        Vec3.copy(color, value);
                        updateIntensity();
                    },
                    enumerable: true
                },
                /**
                 * Color type. Must be either:<br>
                 * Light.TYPE_AMBIENT,
                 * Light.TYPE_DIRECTIONAL,
                 * Light.TYPE_POINT <br>
                 * Note that this value is readonly after initialization. To change it create a new Light component and replace the current light
                 * component of its gameObject.
                 * Default type is TYPE_POINT
                 * @property type
                 * @type Enum
                 * @final
                 */
                type: {
                    get: function () {
                        return type;
                    },
                    set: function (newValue) {
                        if (!engine) {
                            type = newValue;
                        } else {
                            if (ASSERT) {
                                Util.fail("Light type cannot be changed after initialization");
                            }
                        }
                    },
                    enumerable: true
                },
                /**
                 * Light intensity (a multiplier to color)
                 * @property intensity
                 * @type Number
                 */
                intensity: {
                    get: function () {
                        return intensity;
                    },
                    set: function (value) {
                        intensity = value;
                        updateIntensity();
                    },
                    enumerable: true
                },
                /**
                 * Specifies the light falloff.<br>
                 * attenuation[0] is constant attenuation,<br>
                 * attenuation[1] is linear attenuation,<br>
                 * attenuation[2] is quadratic attenuation.<br>
                 * Default value is (1,0,0)
                 * @property attenuation
                 * @type kick.math.Vec3
                 */
                attenuation: {
                    get: function () {
                        return attenuation;
                    },
                    set: function (newValue) {
                        Vec3.copy(attenuation, newValue);
                    },
                    enumerable: true
                },
                /**
                 * color RGB multiplied with intensity (plus color A).<br>
                 * This property exposes a internal value. This value should not be modified.
                 * Instead use the intensity and color property.
                 * @property colorIntensity
                 * @type kick.math.Vec3
                 * @final
                 */
                colorIntensity: {
                    get: function () {
                        return colorIntensity;
                    },
                    set: function (newValue) {
                        colorIntensity = newValue;
                    },
                    enumerable: true
                },
                // inherited interface from component
                gameObject: {
                    get: function () {
                        return gameObject;
                    },
                    set: function (value) {
                        gameObject = value;
                    }
                },
                // inherited interface from component
                scriptPriority: {
                    get: function () {
                        return scriptPriority;
                    },
                    set: function (value) {
                        scriptPriority = value;
                    },
                    enumerable: true
                }
            });

            this.activated = function () {
                var gameObject = thisObj.gameObject;
                engine = gameObject.engine;
                transform = gameObject.transform;
                updateShadowTexture();
            };

            /**
             * @method toJSON
             * @return {JSON}
             */
            this.toJSON = function () {
                return Util.componentToJSON(thisObj.gameObject.engine, this, "kick.scene.Light");
            };

            Util.applyConfig(this, config);
            Util.copyStaticPropertiesToObject(this, Light);
        };

        /**
         * @property TYPE_AMBIENT
         * @type Number
         * @static
         */
        Light.TYPE_AMBIENT = Constants._LIGHT_TYPE_AMBIENT;
        /**
         * @property TYPE_DIRECTIONAL
         * @type Number
         * @static
         */
        Light.TYPE_DIRECTIONAL = Constants._LIGHT_TYPE_DIRECTIONAL;
        /**
         * @property TYPE_POINT
         * @type Number
         * @static
         */
        Light.TYPE_POINT = Constants._LIGHT_TYPE_POINT;

        Object.freeze(Light);

        return Light;
    });