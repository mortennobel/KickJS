define(["kick/core/ProjectAsset", "kick/core/Constants", "kick/core/Util", "kick/core/EngineSingleton"],
    function (ProjectAsset, Constants, Util, EngineSingleton) {
        "use strict";

        /**
         * @module kick.texture
         */

        /**
         * A movie texture associated with a video element (or canvas tag) will update the content every frame (when it is bound).
         * @class MovieTexture
         * @namespace kick.texture
         * @constructor
         * @param {Object} config Optional
         * @extends kick.core.ProjectAsset
         */
        return function (config) {
            // extend ProjectAsset
            ProjectAsset(this, config, "kick.texture.MovieTexture");
            if (Constants._ASSERT){
                if (config === EngineSingleton.engine){
                    Util.fail("MovieTexture constructor changed - engine parameter is removed");
                }
            }
            var engine = EngineSingleton.engine,
                gl = engine.gl,
                glState = engine.glState,
                texture0 = Constants.GL_TEXTURE0,
                _name = "MovieTexture",
                _videoElement = null,
                _textureId = gl.createTexture(),
                _wrapS = Constants.GL_CLAMP_TO_EDGE,
                _wrapT = Constants.GL_CLAMP_TO_EDGE,
                _minFilter = Constants.GL_NEAREST,
                _magFilter = Constants.GL_NEAREST,
                _intFormat = Constants.GL_RGBA,
                _skipFrames = 0,
                _generateMipmaps = false,
                timer = engine.time,
                thisObj = this,
                lastGrappedFrame = -1;

            /**
             * Bind the current texture
             * And update the texture from the video element (unless it has already been updated in this frame)
             * @method bind
             */
            this.bind = function (textureSlot) {
                gl.activeTexture(texture0 + textureSlot);
                gl.bindTexture(Constants.GL_TEXTURE_2D, _textureId);

                if (lastGrappedFrame < timer.frame && _videoElement) {
                    lastGrappedFrame = timer.frame + _skipFrames;
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                        gl.UNSIGNED_BYTE, _videoElement);
                    if (_generateMipmaps) {
                        gl.generateMipmap(Constants.GL_TEXTURE_2D);
                    }
                }
            };

            /**
             * Deallocates the texture from memory
             * @method destroy
             */
            this.destroy = function () {
                if (_textureId !== null) {
                    glState.currentMaterial = null; // for material to rebind
                    gl.deleteTexture(_textureId);
                    _textureId = null;
                    engine.project.removeResourceDescriptor(thisObj.uid);
                }
            };

            /**
             * Creates a 2x2 temporary image (checkerboard)
             * @method setTemporaryTexture
             */
            this.setTemporaryTexture = function () {
                var blackWhiteCheckerboard = new Uint8Array([255, 255, 255, 0, 0, 0, 0, 0, 0, 255, 255, 255]);
                thisObj.bind(0); // bind to texture slot 0
                gl.pixelStorei(Constants.GL_UNPACK_ALIGNMENT, 1);
                gl.texImage2D(Constants.GL_TEXTURE_2D, 0, Constants.GL_RGB, 2, 2, 0, Constants.GL_RGB, Constants.GL_UNSIGNED_BYTE, blackWhiteCheckerboard);
                gl.texParameteri(Constants.GL_TEXTURE_2D, Constants.GL_TEXTURE_MAG_FILTER, _magFilter);
                gl.texParameteri(Constants.GL_TEXTURE_2D, Constants.GL_TEXTURE_MIN_FILTER, _minFilter);
                gl.texParameteri(Constants.GL_TEXTURE_2D, Constants.GL_TEXTURE_WRAP_S, _wrapS);
                gl.texParameteri(Constants.GL_TEXTURE_2D, Constants.GL_TEXTURE_WRAP_T, _wrapT);
                glState.currentMaterial = null; // for material to rebind
            };

            Object.defineProperties(this, {
                /**
                 * @property name
                 * @type String
                 */
                name: {
                    get: function () {
                        return _name;
                    },
                    set: function (newValue) {
                        _name = newValue;
                    }
                },
                /**
                 * Default value is 0 (update movie texture every frame). 1 skip one frame update, 2 skips two frames etc.
                 * @property skipFrames
                 * @type {Number}
                 */
                skipFrames: {
                    get: function () {
                        return _skipFrames;
                    },
                    set: function (newValue) {
                        _skipFrames = newValue;
                    }
                },
                /**
                 * @property videoElement
                 * @type {VideoElement}
                 */
                videoElement: {
                    get: function () {
                        return _videoElement;
                    },
                    set: function (newValue) {
                        _videoElement = newValue;
                    }
                },
                /**
                 * Autogenerate mipmap levels<br>
                 * Note that enabling auto mipmap on movie textures uses a lot of resources.
                 * (Default false)
                 * @property generateMipmaps
                 * @type Boolean
                 */
                generateMipmaps: {
                    get: function () {
                        return _generateMipmaps;
                    },
                    set: function (value) {
                        if (Constants._ASSERT) {
                            if (typeof value !== 'boolean') {
                                Util.fail("MovieTexture.generateMipmaps was not a boolean");
                            }
                        }
                        _generateMipmaps = value;
                    }
                },
                /**
                 * @property textureId
                 * @type {Number}
                 * @protected
                 */
                textureId: {
                    value: _textureId
                },
                /**
                 * Texture.wrapS should be either GL_CLAMP_TO_EDGE or GL_REPEAT<br>
                 * Default: GL_REPEAT
                 * @property wrapS
                 * @type Object
                 */
                wrapS: {
                    get: function () {
                        return _wrapS;
                    },
                    set: function (value) {
                        if (Constants._ASSERT) {
                            if (value !== Constants.GL_CLAMP_TO_EDGE && value !== Constants.GL_REPEAT) {
                                Util.fail("Texture.wrapS should be either GL_CLAMP_TO_EDGE or GL_REPEAT");
                            }
                        }
                        _wrapS = value;
                    }
                },
                /**
                 * Texture.wrapT should be either GL_CLAMP_TO_EDGE or GL_REPEAT<br>
                 * Default: GL_REPEAT
                 * @property wrapT
                 * @type Object
                 */
                wrapT: {
                    get: function () {
                        return _wrapT;
                    },
                    set: function (value) {
                        if (Constants._ASSERT) {
                            if (value !== Constants.GL_CLAMP_TO_EDGE && value !== Constants.GL_REPEAT) {
                                Util.fail("Texture.wrapT should be either GL_CLAMP_TO_EDGE or GL_REPEAT");
                            }
                        }
                        _wrapT = value;
                    }
                },
                /**
                 * Texture.minFilter should be either GL_NEAREST, GL_LINEAR, GL_NEAREST_MIPMAP_NEAREST, <br>
                 * GL_LINEAR_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR, GL_LINEAR_MIPMAP_LINEAR<br>
                 * Default: GL_LINEAR
                 * @property minFilter
                 * @type Object
                 */
                minFilter: {
                    get: function () {
                        return _minFilter;
                    },
                    set: function (value) {
                        if (Constants._ASSERT) {
                            if (value !== Constants.GL_NEAREST &&
                                    value !== Constants.GL_LINEAR &&
                                    value !== Constants.GL_NEAREST_MIPMAP_NEAREST &&
                                    value !== Constants.GL_LINEAR_MIPMAP_NEAREST &&
                                    value !== Constants.GL_NEAREST_MIPMAP_LINEAR &&
                                    value !== Constants.GL_LINEAR_MIPMAP_LINEAR) {
                                Util.fail("Texture.minFilter should be either GL_NEAREST, GL_LINEAR, GL_NEAREST_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR, GL_LINEAR_MIPMAP_LINEAR");
                            }
                        }
                        _minFilter = value;
                    }
                },
                /**
                 * Texture.magFilter should be either GL_NEAREST or GL_LINEAR. <br>
                 * Default: GL_LINEAR
                 * @property magFilter
                 * @type Object
                 */
                magFilter: {
                    get: function () {
                        return _magFilter;
                    },
                    set: function (value) {
                        if (Constants._ASSERT) {
                            if (value !== Constants.GL_NEAREST && value !== Constants.GL_LINEAR) {
                                Util.fail("Texture.magFilter should be either GL_NEAREST or GL_LINEAR");
                            }
                        }
                        _magFilter = value;
                    }
                },
                /**
                 * Specifies the internal format of the image (format on GPU)<br>
                 * Default is GL_RGBA<br>
                 * Must be one of the following:
                 * GL_ALPHA,
                 * GL_RGB,
                 * GL_RGBA,
                 * GL_LUMINANCE,
                 * GL_LUMINANCE_ALPHA
                 * @property internalFormat
                 * @type Number
                 */
                internalFormat: {
                    get: function () {
                        return _intFormat;
                    },
                    set: function (value) {
                        if (value !== Constants.GL_ALPHA &&
                                value !== Constants.GL_RGB  &&
                                value !== Constants.GL_RGBA &&
                                value !== Constants.GL_LUMINANCE &&
                                value !== Constants.GL_LUMINANCE_ALPHA) {
                            Util.fail("Texture.internalFormat should be either GL_ALPHA, GL_RGB, GL_RGBA, GL_LUMINANCE, or LUMINANCE_ALPHA");
                        }
                        _intFormat = value;
                    }
                }
            });

            /**
             * Serializes the data into a JSON object (that can be used as a config parameter in the constructor)<br>
             * Note that the texture data is not serialized in the json format. <br>
             * This means that either setImage() or setImageData() must be called before the texture can be bound<br>
             * @method toJSON
             * @return {Object} config element
             */
            this.toJSON = function () {
                return {
                    uid: thisObj.uid,
                    wrapS: _wrapS,
                    wrapT: _wrapT,
                    minFilter: _minFilter,
                    name: _name,
                    magFilter: _magFilter,
                    internalFormat: _intFormat
                };
            };

            this.init(config);
        };
    });