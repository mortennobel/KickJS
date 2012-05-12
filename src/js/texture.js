/*!
 * New BSD License
 *
 * Copyright (c) 2011, Morten Nobel-Joergensen, Kickstart Games ( http://www.kickstartgames.com/ )
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var KICK = KICK || {};
KICK.namespace = function (ns_string) {
    "use strict"; // force strict ECMAScript 5
    var parts = ns_string.split("."),
        parent = window,
        i;

    for (i = 0; i < parts.length; i += 1) {
        // create property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

(function () {
    "use strict"; // force strict ECMAScript 5

    var texture = KICK.namespace("KICK.texture"),
        core = KICK.namespace("KICK.core"),
        constants = core.Constants,
        vec2 = KICK.math.vec2,
        isPowerOfTwo = function (x) {
            return (x & (x - 1)) === 0;
        },
        nextHighestPowerOfTwo = function (x) {
            var i;
            --x;
            for (i = 1; i < 32; i <<= 1) {
                x = x | x >> i;
            }
            return x + 1;
        },
        applyConfig = KICK.core.Util.applyConfig;

    /**
     * Render texture (used for camera's render target)
     * @class RenderTexture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config Optional
     * @extends KICK.core.ProjectAsset
     */
    texture.RenderTexture = function (engine, config) {
        var gl = engine.gl,
            _config = config || {},
            framebuffer = gl.createFramebuffer(),
            colorTexture = null,
            _dimension = vec2.create(),
            renderBuffers = [],
            thisObj = this,
            _name = "",
            cleanUpRenderBuffers = function () {
                var i;
                for (i = 0; i < renderBuffers.length; i++) {
                    gl.deleteRenderbuffer(renderBuffers[i]);
                }
            },
            initFBO = function () {
                var renderbuffer,
                    frameBufferStatus;
                _dimension = colorTexture ? colorTexture.dimension : _dimension;
                cleanUpRenderBuffers();
                gl.bindFramebuffer(constants.GL_FRAMEBUFFER, framebuffer);

                if (colorTexture) {
                    gl.framebufferTexture2D(constants.GL_FRAMEBUFFER, constants.GL_COLOR_ATTACHMENT0, constants.GL_TEXTURE_2D, colorTexture.textureId, 0);
                } else {
                    renderbuffer = gl.createRenderbuffer();
                    gl.bindRenderbuffer(constants.GL_RENDERBUFFER, renderbuffer);
                    gl.renderbufferStorage(constants.GL_RENDERBUFFER, constants.GL_RGBA4, _dimension[0], _dimension[1]);
                    gl.framebufferRenderbuffer(constants.GL_FRAMEBUFFER, constants.GL_COLOR_ATTACHMENT0, constants.GL_RENDERBUFFER, renderbuffer);
                    renderBuffers.push(renderbuffer);
                }

                renderbuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(constants.GL_RENDERBUFFER, renderbuffer);
                gl.renderbufferStorage(constants.GL_RENDERBUFFER, constants.GL_DEPTH_COMPONENT16, _dimension[0], _dimension[1]);
                gl.framebufferRenderbuffer(constants.GL_FRAMEBUFFER, constants.GL_DEPTH_ATTACHMENT, constants.GL_RENDERBUFFER, renderbuffer);
                renderBuffers.push(renderbuffer);

                if (constants._ASSERT) {
                    frameBufferStatus = gl.checkFramebufferStatus(constants.GL_FRAMEBUFFER);
                    if (frameBufferStatus !== constants.GL_FRAMEBUFFER_COMPLETE) {
                        switch (frameBufferStatus) {
                        case constants.GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                            KICK.core.Util.fail("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                            break;
                        case constants.GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                            KICK.core.Util.fail("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                            break;
                        case constants.GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                            KICK.core.Util.fail("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                            break;
                        case constants.GL_FRAMEBUFFER_UNSUPPORTED:
                            KICK.core.Util.fail("FRAMEBUFFER_UNSUPPORTED");
                            break;
                        }
                    }
                }
                gl.bindFramebuffer(constants.GL_FRAMEBUFFER, null);
            };

        /**
         * @method bind
         */
        this.bind = function () {
            gl.renderTarget = thisObj;
            gl.bindFramebuffer(constants.GL_FRAMEBUFFER, framebuffer);
        };

        Object.defineProperties(this, {
            /**
             * @property dimension
             * @type KICK.math.vec2
             */
            dimension: {
                get: function () {
                    return _dimension;
                },
                set: function (newValue) {
                    _dimension = newValue;
                    if (_dimension) {
                        initFBO();
                    }
                }
            },
            /**
             * @property colorTexture
             * @type KICK.texture.Texture
             */
            colorTexture: {
                get: function () { return colorTexture; },
                set: function (newValue) {
                    colorTexture = newValue;
                    if (colorTexture) {
                        initFBO();
                    }
                }
            },
            /**
             * @property name
             * @type String
             */
            name: {
                get: function () { return _name; },
                set: function (newValue) { _name = newValue; }
            }
        });

        /**
         * @method destroy
         */
        this.destroy = function () {
            if (framebuffer !== null) {
                cleanUpRenderBuffers();
                gl.deleteFramebuffer(framebuffer);
                framebuffer = null;
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * @method toJSON
         */
        this.toJSON = function () {
            return {
                uid: thisObj.uid,
                name: _name,
                colorTexture: KICK.core.Util.getJSONReference(engine, colorTexture)
            };
        };

        (function init() {
            // apply
            applyConfig(thisObj, config);
            engine.project.registerObject(thisObj, "KICK.texture.RenderTexture");
        }());
    };

    /**
     * Encapsulate a texture object and its configuration. Note that the texture configuration
     * must be set prior to assigning the texture (using either init, setImage or setImageData).<br>
     *
     * Cubemaps must have dimensions width = height * 6 and the order of the cubemap is
     * positiveX, negativeX, positiveY, negativeY, positiveZ, negativeZ
     * @class Texture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config Optional
     * @extends KICK.core.ProjectAsset
     */
    texture.Texture = function (engine, config) {
        var gl = engine.gl,
            texture0 = constants.GL_TEXTURE0,
            _textureId = gl.createTexture(),
            _name = "Texture",
            _wrapS =  constants.GL_REPEAT,
            _wrapT = constants.GL_REPEAT,
            _minFilter = constants.GL_LINEAR,
            _magFilter = constants.GL_LINEAR,
            _generateMipmaps = true,
            _dataURI =  "memory://void",
            _flipY =  true,
            _intFormat = constants.GL_RGBA,
            _textureType = constants.GL_TEXTURE_2D,
            _boundTextureType = null,
            thisObj = this,
            _dimension = vec2.create(),
            /**
             * @method recreateTextureIfDifferentType
             * @private
             */
            recreateTextureIfDifferentType = function () {
                if (_boundTextureType !== null && _boundTextureType !== _textureType) {
                    gl.deleteTexture(_textureId);
                    _textureId = gl.createTexture();
                }
                _boundTextureType = _textureType;
            };

        /**
         * Trigger getImageData if dataURI is defined
         * @method init
         */
        this.init = function () {
            if (_dataURI) {
                engine.resourceLoader.getImageData(_dataURI, thisObj);
            }
        };

        /**
         * Applies the texture settings
         * @method apply
         */
        this.apply = function () {
            thisObj.bind(0); // bind to texture slot 0
            if (_textureType === constants.GL_TEXTURE_2D) {
                gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_WRAP_S, _wrapS);
                gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_WRAP_T, _wrapT);
            }
            gl.texParameteri(_textureType, constants.GL_TEXTURE_MAG_FILTER, _magFilter);
            gl.texParameteri(_textureType, constants.GL_TEXTURE_MIN_FILTER, _minFilter);
        };

        /**
         * Bind the current texture
         * @method bind
         */
        this.bind = function (textureSlot) {
            gl.activeTexture(texture0 + textureSlot);
            gl.bindTexture(_textureType, _textureId);
        };

        /**
         * Deallocates the texture from memory
         * @method destroy
         */
        this.destroy = function () {
            if (_textureId !== null) {
                gl.deleteTexture(_textureId);
                _textureId = null;
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * Set texture image based on a image object.<br>
         * The image is automatically resized nearest power of two<br>
         * When a textureType == TEXTURE_CUBE_MAP the image needs to be in the following format:
         * <ul>
         *     <li>width = 6*height</li>
         *     <li>Image needs to be ordered: [Right, Left, Top, Bottom, Front, Back] (As in <a href="http://www.cgtextures.com/content.php?action=tutorial&name=cubemaps">NVidia DDS Exporter</a>)</li>
         * </ul>
         * @method setImage
         * @param {Image} imageObj image object to import
         * @param {String} dataURI String representing the image
         */
        this.setImage = function (imageObj, dataURI) {
            var width, height, cubemapOrder, srcWidth, srcHeight, canvas, ctx, i;
            _dataURI = dataURI;
            recreateTextureIfDifferentType();
            thisObj.bind(0); // bind to texture slot 0
            if (_textureType === constants.GL_TEXTURE_2D) {
                if (!isPowerOfTwo(imageObj.width) || !isPowerOfTwo(imageObj.height)) {
                    width = nextHighestPowerOfTwo(imageObj.width);
                    height = nextHighestPowerOfTwo(imageObj.height);
                    imageObj = core.Util.scaleImage(imageObj, width, height);
                }

                if (_flipY) {
                    gl.pixelStorei(constants.GL_UNPACK_FLIP_Y_WEBGL, true);
                } else {
                    gl.pixelStorei(constants.GL_UNPACK_FLIP_Y_WEBGL, false);
                }
                gl.pixelStorei(constants.GL_UNPACK_ALIGNMENT, 1);
                gl.texImage2D(constants.GL_TEXTURE_2D, 0, _intFormat, _intFormat, constants.GL_UNSIGNED_BYTE, imageObj);

                vec2.set([imageObj.width, imageObj.height], _dimension);
            } else {
                cubemapOrder = [
                    constants.GL_TEXTURE_CUBE_MAP_POSITIVE_X,
                    constants.GL_TEXTURE_CUBE_MAP_NEGATIVE_X,
                    constants.GL_TEXTURE_CUBE_MAP_POSITIVE_Y,
                    constants.GL_TEXTURE_CUBE_MAP_NEGATIVE_Y,
                    constants.GL_TEXTURE_CUBE_MAP_POSITIVE_Z,
                    constants.GL_TEXTURE_CUBE_MAP_NEGATIVE_Z
                ];
                srcWidth = imageObj.width / 6;
                srcHeight = imageObj.height;
                height = nextHighestPowerOfTwo(imageObj.height);
                width = height;
                canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext("2d");
                for (i = 0; i < 6; i++) {
                    ctx.drawImage(imageObj,
                        i * srcWidth, 0, srcWidth, srcHeight,
                        0, 0, width, height);
                    gl.pixelStorei(constants.GL_UNPACK_FLIP_Y_WEBGL, false);
                    gl.pixelStorei(constants.GL_UNPACK_ALIGNMENT, 1);
                    gl.texImage2D(cubemapOrder[i], 0, _intFormat, _intFormat, constants.GL_UNSIGNED_BYTE, canvas);
                }
                vec2.set([width, height], _dimension);
            }
            thisObj.apply();
            if (_generateMipmaps) {
                gl.generateMipmap(_textureType);
            }
            gl.currentMaterial = null; // for material to rebind
        };

        /**
         * Calling this function has the side effect of enabling floating point texture (in available on platform)
         * @method isFPTexturesSupported
         * @return {Boolean}
         */
        this.isFPTexturesSupported = function () {
            var res = gl.isTexFloatEnabled;
            if (typeof res !== 'boolean') {
                res = gl.getExtension("OES_texture_float"); // this has the side effect of enabling the extension
                gl.isTexFloatEnabled = res;
            }
            return res;
        };

        /**
         * Set a image using a raw bytearray in a specified format.
         * GL_FLOAT should only be used if floating point textures is supported (See Texture.isFPTexturesSupported() ).
         * @method setImageData
         * @param {Number} width image width in pixels
         * @param {Number} height image height in pixels
         * @param {Number} border image border in pixels
         * @param {Object} type GL_FLOAT, GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT_4_4_4_4, GL_UNSIGNED_SHORT_5_5_5_1 or GL_UNSIGNED_SHORT_5_6_5
         * @param {Array} pixels array of pixels (may be null)
         * @param {String} dataURI String representing the image
         */
        this.setImageData = function (width, height, border, type, pixels, dataURI) {
            var format;
            recreateTextureIfDifferentType();
            if (type === constants.GL_FLOAT && !gl.isTexFloatEnabled) {
                var res = thisObj.isFPTexturesSupported(); // enable extension
                if (!res) {
                    KICK.core.Util.fail("OES_texture_float unsupported on the platform. Using GL_UNSIGNED_BYTE instead of GL_FLOAT.");
                    type = constants.GL_UNSIGNED_BYTE;
                }
            }
            if (constants._ASSERT) {
                if (type !== constants.GL_FLOAT &&
                    type !== constants.GL_UNSIGNED_BYTE &&
                    type !== constants.GL_UNSIGNED_SHORT_4_4_4_4  &&
                    type !== constants.GL_UNSIGNED_SHORT_5_5_5_1 &&
                    type !== constants.GL_UNSIGNED_SHORT_5_6_5) {
                    KICK.core.Util.fail("Texture.setImageData (type) should be either GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT_4_4_4_4, GL_UNSIGNED_SHORT_5_5_5_1 or GL_UNSIGNED_SHORT_5_6_5");
                }
            }
            if (_textureType !== constants.GL_TEXTURE_2D) {
                KICK.core.Util.fail("Texture.setImageData only supported by TEXTURE_2D");
                return;
            }
            format = _intFormat;

            vec2.set([width, height], _dimension);
            _dataURI = dataURI;

            thisObj.bind(0); // bind to texture slot 0
            gl.pixelStorei(constants.GL_UNPACK_ALIGNMENT, 1);
            gl.texImage2D(constants.GL_TEXTURE_2D, 0, _intFormat, width, height, border, format, type, pixels);
            gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_MAG_FILTER, _magFilter);
            gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_MIN_FILTER, _minFilter);
            gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_WRAP_S, _wrapS);
            gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_WRAP_T, _wrapT);
            if (_generateMipmaps) {
                gl.generateMipmap(constants.GL_TEXTURE_2D);
            }
            gl.currentMaterial = null; // for material to rebind
        };

        /**
         * Creates a 2x2 temporary image (checkerboard)
         * @method setTemporaryTexture
         */
        this.setTemporaryTexture = function () {
            var blackWhiteCheckerboard = new Uint8Array([255, 255, 255,
                                             0,   0,   0,
                                             0,   0,   0,
                                             255, 255, 255]),
                oldIntFormat = _intFormat;
            _intFormat = constants.GL_RGB;
            this.setImageData(2, 2, 0, constants.GL_UNSIGNED_BYTE, blackWhiteCheckerboard, "tempTexture");
            _intFormat = oldIntFormat;
        };

        /**
         * Allows setting the dataURI without reloading the image
         * @method setDataURI
         * @param newValue
         * @param automaticGetTextureData
         */
        this.setDataURI = function (newValue, automaticGetTextureData) {
            if (newValue !== _dataURI) {
                _dataURI = newValue;
                if (automaticGetTextureData) {
                    engine.resourceLoader.getImageData(_dataURI, thisObj);
                }
            }
        };

        Object.defineProperties(this, {
            /**
             * @property engine
             * @type KICK.core.Engine
             */
            engine: {
                value: engine
            },
            /**
             * @property textureId
             * @type Number
             * @protected
             */
            textureId: {
                value: _textureId
            },
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
             * Dimension of texture [width,height].<br>
             * Note for cube maps the size is for one face
             * @property dimension
             * @type {vec2}
             */
            dimension: {
                get: function () {
                    return _dimension;
                }
            },
            /**
             * URI of the texture. This property does not load any texture. To load a texture, set this property and
             * call the init function (or load the image manually and call the setImage() function).<br>
             * If texture is not on same server, then the web server must support CORS<br>
             * See http://hacks.mozilla.org/2011/11/using-cors-to-load-webgl-textures-from-cross-domain-images/
             * @property dataURI
             * @type String
             */
            dataURI: {
                get: function () {
                    return _dataURI;
                },
                set: function (newValue) {
                    thisObj.setDataURI(newValue, true);
                }
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
                    if (constants._ASSERT) {
                        if (value !== constants.GL_CLAMP_TO_EDGE &&
                            value !== constants.GL_REPEAT) {
                            KICK.core.Util.fail("Texture.wrapS should be either GL_CLAMP_TO_EDGE or GL_REPEAT");
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
                    if (constants._ASSERT) {
                        if (value !== constants.GL_CLAMP_TO_EDGE &&
                            value !== constants.GL_REPEAT) {
                            KICK.core.Util.fail("Texture.wrapT should be either GL_CLAMP_TO_EDGE or GL_REPEAT");
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
                    if (constants._ASSERT) {
                        if (value !== constants.GL_NEAREST &&
                            value !== constants.GL_LINEAR &&
                            value !== constants.GL_NEAREST_MIPMAP_NEAREST &&
                            value !== constants.GL_LINEAR_MIPMAP_NEAREST &&
                            value !== constants.GL_NEAREST_MIPMAP_LINEAR &&
                            value !== constants.GL_LINEAR_MIPMAP_LINEAR) {
                            KICK.core.Util.fail("Texture.minFilter should be either GL_NEAREST, GL_LINEAR, GL_NEAREST_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR, GL_LINEAR_MIPMAP_LINEAR");
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
                    if (constants._ASSERT) {
                        if (value !== constants.GL_NEAREST &&
                            value !== constants.GL_LINEAR) {
                            KICK.core.Util.fail("Texture.magFilter should be either GL_NEAREST or GL_LINEAR");
                        }
                    }
                    _magFilter = value;
                }
            },
            /**
             * Autogenerate mipmap levels<br>
             * (Default true)
             * @property generateMipmaps
             * @type Boolean
             */
            generateMipmaps: {
                get: function () {
                    return _generateMipmaps;
                },
                set: function (value) {
                    if (constants._ASSERT) {
                        if (typeof value !== 'boolean') {
                            KICK.core.Util.fail("Texture.generateMipmaps was not a boolean");
                        }
                    }
                    _generateMipmaps = value;
                }
            },
            /**
             * When importing image flip the Y direction of the image
             * (Default true).<br>
             * This property is ignored for cube maps.
             * @property flipY
             * @type Boolean
             */
            flipY: {
                get: function () {
                    return _flipY;
                },
                set: function (value) {
                    if (constants._ASSERT) {
                        if (typeof value !== 'boolean') {
                            KICK.core.Util.fail("Texture.flipY was not a boolean");
                        }
                    }
                    _flipY = value;
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
                    if (value !== constants.GL_ALPHA &&
                        value !== constants.GL_RGB  &&
                        value !== constants.GL_RGBA &&
                        value !== constants.GL_LUMINANCE &&
                        value !== constants.GL_LUMINANCE_ALPHA) {
                        KICK.core.Util.fail("Texture.internalFormat should be either GL_ALPHA, GL_RGB, GL_RGBA, GL_LUMINANCE, or LUMINANCE_ALPHA");
                    }
                    _intFormat = value;
                }
            },
            /**
             * Specifies the texture type<br>
             * Default is GL_TEXTURE_2D<br>
             * Must be one of the following:
             * GL_TEXTURE_2D,
             * GL_TEXTURE_CUBE_MAP
             * @property textureType
             * @type Number
             */
            textureType: {
                get: function () {
                    return _textureType;
                },
                set: function (value) {
                    if (value !== constants.GL_TEXTURE_2D &&
                        value !== constants.GL_TEXTURE_CUBE_MAP) {
                        KICK.core.Util.fail("Texture.textureType should be either GL_TEXTURE_2D or GL_TEXTURE_CUBE_MAP");
                    }
                    _textureType = value;
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
                magFilter: _magFilter,
                name: _name,
                generateMipmaps: _generateMipmaps,
                flipY: _flipY,
                internalFormat: _intFormat,
                textureType: _textureType,
                dataURI: _dataURI
            };
        };

        (function init() {
            // apply
            applyConfig(thisObj, config, ["dataURI"]);
            if (config && config.dataURI) {
                // set dataURI last to make sure that object is configured before initialization
                thisObj.dataURI = config.dataURI;
            }

            engine.project.registerObject(thisObj, "KICK.texture.Texture");
        }());
    };

    /**
     * A movie texture associated with a video element (or canvas tag) will update the content every frame (when it is bound).
     * @class MovieTexture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config Optional
     * @extends KICK.core.ProjectAsset
     */
    texture.MovieTexture = function (engine, config) {
        var gl = engine.gl,
            texture0 = constants.GL_TEXTURE0,
            _name = "MovieTexture",
            _videoElement = null,
            _textureId = gl.createTexture(),
            _wrapS = constants.GL_CLAMP_TO_EDGE,
            _wrapT = constants.GL_CLAMP_TO_EDGE,
            _minFilter = constants.GL_NEAREST,
            _magFilter = constants.GL_NEAREST,
            _intFormat = constants.GL_RGBA,
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
            gl.bindTexture(constants.GL_TEXTURE_2D, _textureId);

            if (lastGrappedFrame < timer.frame && _videoElement) {
                lastGrappedFrame = timer.frame + _skipFrames;
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, _videoElement);
                if (_generateMipmaps) {
                    gl.generateMipmap(constants.GL_TEXTURE_2D);
                }
            }
        };

        /**
         * Deallocates the texture from memory
         * @method destroy
         */
        this.destroy = function () {
            if (_textureId !== null) {
                gl.currentMaterial = null; // for material to rebind
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
            gl.pixelStorei(constants.GL_UNPACK_ALIGNMENT, 1);
            gl.texImage2D(constants.GL_TEXTURE_2D, 0, _intFormat, 2, 2, 0, constants.GL_RGB, constants.GL_UNSIGNED_BYTE, blackWhiteCheckerboard);
            gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_MAG_FILTER, _magFilter);
            gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_MIN_FILTER, _minFilter);
            gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_WRAP_S, _wrapS);
            gl.texParameteri(constants.GL_TEXTURE_2D, constants.GL_TEXTURE_WRAP_T, _wrapT);
            gl.currentMaterial = null; // for material to rebind
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
                    if (constants._ASSERT) {
                        if (typeof value !== 'boolean') {
                            KICK.core.Util.fail("MovieTexture.generateMipmaps was not a boolean");
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
                    if (constants._ASSERT) {
                        if (value !== constants.GL_CLAMP_TO_EDGE &&
                            value !== constants.GL_REPEAT) {
                            KICK.core.Util.fail("Texture.wrapS should be either GL_CLAMP_TO_EDGE or GL_REPEAT");
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
                    if (constants._ASSERT) {
                        if (value !== constants.GL_CLAMP_TO_EDGE &&
                            value !== constants.GL_REPEAT) {
                            KICK.core.Util.fail("Texture.wrapT should be either GL_CLAMP_TO_EDGE or GL_REPEAT");
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
                    if (constants._ASSERT) {
                        if (value !== constants.GL_NEAREST &&
                            value !== constants.GL_LINEAR &&
                            value !== constants.GL_NEAREST_MIPMAP_NEAREST &&
                            value !== constants.GL_LINEAR_MIPMAP_NEAREST &&
                            value !== constants.GL_NEAREST_MIPMAP_LINEAR &&
                            value !== constants.GL_LINEAR_MIPMAP_LINEAR) {
                            KICK.core.Util.fail("Texture.minFilter should be either GL_NEAREST, GL_LINEAR, GL_NEAREST_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR, GL_LINEAR_MIPMAP_LINEAR");
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
                    if (constants._ASSERT) {
                        if (value !== constants.GL_NEAREST &&
                            value !== constants.GL_LINEAR) {
                            KICK.core.Util.fail("Texture.magFilter should be either GL_NEAREST or GL_LINEAR");
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
                    if (value !== constants.GL_ALPHA &&
                        value !== constants.GL_RGB  &&
                        value !== constants.GL_RGBA &&
                        value !== constants.GL_LUMINANCE &&
                        value !== constants.GL_LUMINANCE_ALPHA) {
                        KICK.core.Util.fail("Texture.internalFormat should be either GL_ALPHA, GL_RGB, GL_RGBA, GL_LUMINANCE, or LUMINANCE_ALPHA");
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

        (function init() {
            // apply
            applyConfig(thisObj, config);

            engine.project.registerObject(thisObj, "KICK.texture.MovieTexture");
        }());
    };
}());