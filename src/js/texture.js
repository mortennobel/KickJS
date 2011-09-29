
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
     */
    texture.Texture = function (engine, config) {
        var gl = engine.gl,
            constants = core.Constants,
            thisConfig = config || {},
            textureId = gl.createTexture(),
            _wrapS = thisConfig.wrapS ||  constants.GL_REPEAT,
            _wrapT = thisConfig.wrapT || constants.GL_REPEAT,
            _minFilter = thisConfig.minFilter || constants.GL_LINEAR,
            _magFilter = thisConfig.magFilter || constants.GL_LINEAR,
            _generateMipmaps = typeof (thisConfig.generateMipmaps) === 'boolean'? thisConfig.generateMipmaps : true,
            _autoScaleImage = typeof (thisConfig.autoScaleImage) === 'boolean'? thisConfig.autoScaleImage : true,
            _dataURI = null,
            _flipY = true,
            _asPreMultipliedAlpha = false,
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
        /**
         * Bind the current texture
         * @method bind
         */
        this.bind = function(){
            gl.bindTexture(constants.GL_TEXTURE_2D, textureId);
        };

        /**
         * Set texture image based on a image object
         * @method setImage
         * @param {Image} imageObj image object to import
         * @param {String} dataURI String representing the image
         */
        this.setImage = function(imageObj, dataURI){
            _dataURI = dataURI;
            if (_autoScaleImage){
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
            }
            this.bind();
            gl.texImage2D(constants.GL_TEXTURE_2D, 0, imageObj, _flipY, _asPreMultipliedAlpha);
            if (_generateMipmaps){
                gl.generateMipmap(constants.GL_TEXTURE_2D);
            }
        };
        
        /**
         * Set a image using a raw bytearray in a specified format
         * @method setImageData
         * @param {Object} intformat GL_ALPHA, GL_RGB, GL_RGBA, GL_LUMINANCE, or LUMINANCE_ALPHA
         * @param {Number} width image width in pixels
         * @param {Number} height image height in pixels
         * @param {Number} border image border in pixels
         * @param {Object} format GL_ALPHA, GL_RGB, GL_RGBA, GL_LUMINANCE, or LUMINANCE_ALPHA
         * @param {Object} type GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT_4_4_4_4, GL_UNSIGNED_SHORT_5_5_5_1 or GL_UNSIGNED_SHORT_5_6_5
         * @param {Array} pixels array of pixels
         * @param {String} dataURI String representing the image
         */
        this.setImageData = function(intformat, width, height, border, format, type, pixels, dataURI){
            if (constants._ASSERT){
                if (intformat !== constants.GL_ALPHA &&
                    intformat !== constants.GL_RGB  &&
                    intformat !== constants.GL_RGBA &&
                    intformat !== constants.GL_LUMINANCE &&
                    intformat !== constants.GL_LUMINANCE_ALPHA){
                    throw new Error("Texture.setImageData (intformat) should be either GL_ALPHA, GL_RGB, GL_RGBA, GL_LUMINANCE, or LUMINANCE_ALPHA");
                }
                if (format !== constants.GL_ALPHA &&
                    format !== constants.GL_RGB  &&
                    format !== constants.GL_RGBA &&
                    format !== constants.GL_LUMINANCE &&
                    format !== constants.GL_LUMINANCE_ALPHA){
                    throw new Error("Texture.setImageData (format) should be either GL_ALPHA, GL_RGB, GL_RGBA, GL_LUMINANCE, or LUMINANCE_ALPHA");
                }
                if (type !== constants.GL_UNSIGNED_BYTE &&
                    type !== constants.GL_UNSIGNED_SHORT_4_4_4_4  &&
                    type !== constants.GL_UNSIGNED_SHORT_5_5_5_1 &&
                    type !== constants.GL_UNSIGNED_SHORT_5_6_5 ){
                    throw new Error("Texture.setImageData (type) should be either GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT_4_4_4_4, GL_UNSIGNED_SHORT_5_5_5_1 or GL_UNSIGNED_SHORT_5_6_5");
                }
            }
            _dataURI = dataURI;

            this.bind();
            gl.pixelStorei(constants.GL_UNPACK_ALIGNMENT, 1);
            gl.texImage2D(constants.GL_TEXTURE_2D, 0, intformat, width, height, border, format, type, pixels);
            if (_generateMipmaps){
                gl.generateMipmap(gl.TEXTURE_2D);
            }
        };

        Object.defineProperties(this,{
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
             * Import image as premultiplied alpha
             * (Default false)
             * @property asPreMultipliedAlpha
             * @type Boolean
             */
            asPreMultipliedAlpha:{
                get: function(){
                    return _asPreMultipliedAlpha;
                },
                set: function(value){
                    if (constants._ASSERT){
                        if (typeof value !== 'boolean'){
                            throw new Error("Texture.asPreMultipliedAlpha was not a boolean");
                        }
                    }
                    _asPreMultipliedAlpha = value;
                }
            }
        });
    };
})();