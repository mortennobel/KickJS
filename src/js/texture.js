
var KICK = KICK || {};

KICK.namespace = KICK.namespace || function (ns_string) {
    var parts = ns_string.split("."),
        parent = KICK,
        i;
    // strip redundant leading global
    if (parts[0] === "KICK") {
        parts = parts.slice(1);
    }

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
        core = KICK.namespace("KICK.core");

    /**
     * Renders a Mesh
     * @class Texture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config Optional
     * @param {Object} uidMapping Optional Maps from old uid to new uid
     */
    texture.Texture = function (engine, config, uidMapping) {
        var gl = engine.gl,
            _uid = engine.createUID(), // note uid is always
            constants = core.Constants,
            texture0 = constants.GL_TEXTURE0,
            thisConfig = config || {},
            textureId = gl.createTexture(),
            _wrapS = thisConfig.wrapS ||  constants.GL_REPEAT,
            _wrapT = thisConfig.wrapT || constants.GL_REPEAT,
            _minFilter = thisConfig.minFilter || constants.GL_LINEAR,
            _magFilter = thisConfig.magFilter || constants.GL_LINEAR,
            _generateMipmaps = typeof (thisConfig.generateMipmaps) === 'boolean'? thisConfig.generateMipmaps : true,
            _autoScaleImage = typeof (thisConfig.autoScaleImage) === 'boolean'? thisConfig.autoScaleImage : true,
            _dataURI = thisConfig.dataURI || null,
            _flipY =  typeof (thisConfig.flipY )==='boolean'? thisConfig.flipY : true,
            _intformat = thisConfig.intformat || constants.GL_RGBA,
            activeTexture,
            isPowerOfTwo = function (x) {
                return (x & (x - 1)) == 0;
            },
            nextHighestPowerOfTwo = function (x) {
                --x;
                for (var i = 1; i < 32; i <<= 1) {
                    x = x | x >> i;
                }
                return x + 1;
            };

        if (uidMapping && thisConfig.uid){
            uidMapping[thisConfig.uid] = _uid;
        }

        (function init(){
            // create active texture component on glContext
            if (!gl.activeTexture){
                gl.activeTexture = {};
            }
            activeTexture = gl.activeTexture;
        })();

        /**
         * Bind the current texture
         * @method bind
         */
        this.bind = function(textureSlot){
            if (activeTexture[textureSlot] !== this){
                gl.activeTexture(texture0+textureSlot);
                gl.bindTexture(constants.GL_TEXTURE_2D, textureId);
                activeTexture[textureSlot] = this;
            }
        };

        /**
         * Set texture image based on a image object
         * @method setImage
         * @param {Image} imageObj image object to import
         * @param {String} dataURI String representing the image
         */
        this.setImage = function(imageObj, dataURI){
            _dataURI = dataURI;

            if (!isPowerOfTwo(imageObj.width) || !isPowerOfTwo(imageObj.height)) {
                // from http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences
                var canvas = document.createElement("canvas");
                canvas.width = nextHighestPowerOfTwo(imageObj.width);
                canvas.height = nextHighestPowerOfTwo(imageObj.height);
                var ctx = canvas.getContext("2d");
                ctx.drawImage(imageObj,
                    0, 0, imageObj.width, imageObj.height,
                    0, 0, canvas.width, canvas.height);
                imageObj = canvas;
            }

            this.bind(0);
            if (_flipY){
                gl.pixelStorei(constants.GL_UNPACK_FLIP_Y_WEBGL, true);
            } else {
                gl.pixelStorei(constants.GL_UNPACK_FLIP_Y_WEBGL, false);
            }
            gl.pixelStorei(constants.GL_UNPACK_ALIGNMENT, 1);
            gl.texImage2D(constants.GL_TEXTURE_2D, 0, _intformat, _intformat, constants.GL_UNSIGNED_BYTE, imageObj);
   
            if (_generateMipmaps){
                gl.generateMipmap(constants.GL_TEXTURE_2D);
            }
        };
        
        /**
         * Set a image using a raw bytearray in a specified format
         * @method setImageData
         * @param {Number} width image width in pixels
         * @param {Number} height image height in pixels
         * @param {Number} border image border in pixels
         * @param {Object} type GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT_4_4_4_4, GL_UNSIGNED_SHORT_5_5_5_1 or GL_UNSIGNED_SHORT_5_6_5
         * @param {Array} pixels array of pixels
         * @param {String} dataURI String representing the image
         */
        this.setImageData = function(width, height, border, type, pixels, dataURI){
            if (constants._ASSERT){
                if (type !== constants.GL_UNSIGNED_BYTE &&
                    type !== constants.GL_UNSIGNED_SHORT_4_4_4_4  &&
                    type !== constants.GL_UNSIGNED_SHORT_5_5_5_1 &&
                    type !== constants.GL_UNSIGNED_SHORT_5_6_5 ){
                    throw new Error("Texture.setImageData (type) should be either GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT_4_4_4_4, GL_UNSIGNED_SHORT_5_5_5_1 or GL_UNSIGNED_SHORT_5_6_5");
                }
            }
            _dataURI = dataURI;

            this.bind(0);
            gl.pixelStorei(constants.GL_UNPACK_ALIGNMENT, 1);
            gl.texImage2D(constants.GL_TEXTURE_2D, 0, _intformat, width, height, border, _intformat, type, pixels);
            if (_generateMipmaps){
                gl.generateMipmap(constants.GL_TEXTURE_2D);
            }
        };

        this.setTemporaryTexture = function(){
            var blackWhiteCheckerboard = new Uint8Array([255, 255, 255,
                                             0,   0,   0,
                                             0,   0,   0,
                                             255, 255, 255]),
                oldIntFormat = _intformat;
            _intformat = constants.GL_RGB;
            this.setImageData( 2, 2, 0, constants.GL_UNSIGNED_BYTE,blackWhiteCheckerboard, "tempTexture");
            _intformat = oldIntFormat;
        };

        Object.defineProperties(this,{
            /**
             * Unique identifier of the texture
             * @property uid
             * @type {Number}
             */
            uid:{
                value:_uid
            },
            /**
             * Identifier of the texture
             * @property dataURI
             * @type String
             */
            dataURI:{
                get:function(){
                    return _dataURI;
                }
            },
            /**
             * Texture.wrapS should be either GL_CLAMP_TO_EDGE or GL_REPEAT<br>
             * Default: GL_REPEAT
             * @property wrapS
             * @type Object
             */
            wrapS:{
                get: function(){
                    return _wrapS;
                },
                set: function(value){
                    if (constants._ASSERT){
                        if (value !== constants.GL_CLAMP_TO_EDGE &&
                            value !== constants.GL_REPEAT){
                            throw new Error("Texture.wrapS should be either GL_CLAMP_TO_EDGE or GL_REPEAT");
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
            wrapT:{
                get: function(){
                    return _wrapT;
                },
                set: function(value){
                    if (constants._ASSERT){
                        if (value !== constants.GL_CLAMP_TO_EDGE &&
                            value !== constants.GL_REPEAT){
                            throw new Error("Texture.wrapT should be either GL_CLAMP_TO_EDGE or GL_REPEAT");
                        }
                    }
                    return _wrapT;
                }
            },
            /**
             * Texture.minFilter should be either GL_NEAREST, GL_LINEAR, GL_NEAREST_MIPMAP_NEAREST, <br>
             * GL_LINEAR_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR, GL_LINEAR_MIPMAP_LINEAR<br>
             * Default: GL_LINEAR
             * @property minFilter
             * @type Object
             */
            minFilter:{
                get: function(){
                    return _minFilter;
                },
                set: function(value){
                    if (constants._ASSERT){
                        if (value !== constants.GL_NEAREST &&
                            value !== constants.GL_LINEAR &&
                            value !== constants.GL_NEAREST_MIPMAP_NEAREST &&
                            value !== constants.GL_LINEAR_MIPMAP_NEAREST &&
                            value !== constants.GL_NEAREST_MIPMAP_LINEAR &&
                            value !== constants.GL_LINEAR_MIPMAP_LINEAR){
                            throw new Error("Texture.minFilter should be either GL_NEAREST, GL_LINEAR, GL_NEAREST_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR, GL_LINEAR_MIPMAP_LINEAR");
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
            magFilter:{
                get: function(){
                    return _magFilter;
                },
                set: function(value){
                    if (constants._ASSERT){
                        if (value !== constants.GL_NEAREST &&
                            value !== constants.GL_LINEAR){
                            throw new Error("Texture.magFilter should be either GL_NEAREST or GL_LINEAR");
                        }
                    }
                    _magFilter = value;
                }
            },
            /**
             * Scales image to nearest power of two if not a power of two. <br>
             * (Default true)
             * @property autoScaleImage
             * @type Boolean
             */
            autoScaleImage:{
                get: function(){
                    return _autoScaleImage;
                },
                set: function(value){
                    if (constants._ASSERT){
                        if (typeof value !== 'boolean'){
                            throw new Error("Texture.autoScaleImage was not be a boolean");
                        }
                    }
                    _autoScaleImage = value;
                }
            },
            /**
             * Autogenerate mipmap levels<br>
             * (Default true)
             * @property generateMipmaps
             * @type Boolean
             */
            generateMipmaps:{
                get: function(){
                    return _generateMipmaps;
                },
                set: function(value){
                    if (constants._ASSERT){
                        if (typeof value !== 'boolean'){
                            throw new Error("Texture.generateMipmaps was not a boolean");
                        }
                    }
                    _generateMipmaps = value;
                }
            },
            /**
             * When importing image flip the Y direction of the image
             * (Default true)
             * @property flipY
             * @type Boolean
             */
            flipY:{
                get: function(){
                    return _flipY;
                },
                set: function(value){
                    if (constants._ASSERT){
                        if (typeof value !== 'boolean'){
                            throw new Error("Texture.flipY was not a boolean");
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
             */
            internalFormal:{
                get:function(){
                    return _intformat;
                },
                set:function(value){
                    if (value !== constants.GL_ALPHA &&
                        value !== constants.GL_RGB  &&
                        value !== constants.GL_RGBA &&
                        value !== constants.GL_LUMINANCE &&
                        value !== constants.GL_LUMINANCE_ALPHA){
                        throw new Error("Texture.internalFormal should be either GL_ALPHA, GL_RGB, GL_RGBA, GL_LUMINANCE, or LUMINANCE_ALPHA");
                    }
                    _intformat = value;
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
        this.toJSON = function(){
            return {
                uid:_uid,
                wrapS:_wrapS,
                wrapT:_wrapT,
                minFilter:_minFilter,
                magFilter:_magFilter,
                generateMipmaps:_generateMipmaps,
                autoScaleImage:_autoScaleImage,
                dataURI:_dataURI,
                flipY:_flipY,
                internalFormal:_intformat
            };
        }
    };
})();