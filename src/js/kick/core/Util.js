define(["require", "./Constants"], function (require, Constants) {
    "use strict";

    var ASSERT = Constants._ASSERT,
        DEBUG = Constants._DEBUG,
        packIntToFloatArrayBuffer = new ArrayBuffer(4),
        packIntToFloatInt32Buffer = new Uint32Array(packIntToFloatArrayBuffer),
        packIntToFloatUint8Buffer = new Uint8Array(packIntToFloatArrayBuffer),
        Util;


    /**
     * Utility class for miscellaneous functions. The class is static and is shared between multiple instances.
     * @class Util
     * @namespace kick.core
     */
    Util = {
        /**
         * Used for deserializing a configuration (replaces reference objects with actual references)
         * @method deserializeConfig
         * @param {Object} config
         * @param {kick.engine.Engine} engine usef for looking up references to project assets
         * @param {kick.scene.Scene} scene used for looking up references to gameObjects and components
         */
        deserializeConfig: function (config, engine, scene) {
            var i,
                destArray;
            if (typeof config === 'number') {
                return config;
            }
            if (Array.isArray(config)) {
                destArray = new Array(config.length);
                for (i = 0; i < config.length; i++) {
                    destArray[i] = Util.deserializeConfig(config[i], engine, scene);
                }
                config = destArray;
            } else if (config) {
                if (config && config.ref && config.reftype) {
                    if (config.reftype === "project") {
                        config = engine.project.load(config.ref);
                    } else if (config.reftype === "gameobject" || config.reftype === "component") {
                        config = scene.getObjectByUID(config.ref);
                    }
                }
            }
            return config;
        },
        /**
         * @method deepCopy
         * @param {Object} src
         * @param {Array_Classes} passthroughClasses=null Don't attempt to clone object of these classes (uses instanceof operator)
         * @return Object
         */
        deepCopy : function (object, passthroughClasses) {
            var res,
                isPassthrough = false,
                i,
                typeOfValue,
                name;
            passthroughClasses = passthroughClasses || [];

            for (i = 0; i < passthroughClasses.length; i++) {
                if (object instanceof passthroughClasses[i]) {
                    isPassthrough = true;
                    break;
                }
            }

            typeOfValue = typeof object;
            if (isPassthrough) {
                res = object;
            } else if (object === null || typeof (object) === "undefined") {
                res = null;
            } else if (Array.isArray(object) || object.buffer instanceof ArrayBuffer) { // treat typed arrays as normal arrays
                res = [];
                for (i = 0; i < object.length; i++) {
                    res[i] = Util.deepCopy(object[i], passthroughClasses);
                }
            } else if (typeOfValue === "object") {
                res = {};
                for (name in object) {
                    if (object.hasOwnProperty(name)) {
                        res[name] = Util.deepCopy(object[name], passthroughClasses);
                    }
                }
            } else {
                res = object;
            }
            return res;
        },
        /**
         * @method copyStaticPropertiesToObject
         * @param {Object} object
         * @param {Function} type constructor function
         * @static
         */
        copyStaticPropertiesToObject : function (object, type) {
            var name;
            for (name in type) {
                if (type.hasOwnProperty(name)) {
                    Object.defineProperty(object, name, {
                        value: type[name]
                    });
                }
            }
        },
        /**
         * @method hasProperty
         * @param {Object} obj
         * @param {String} prop
         * @return {Boolean}
         * @static
         */
        hasProperty: function (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        },
        /**
         *
         * @method toCamelCase
         * @param {String} str
         * @param {String} wordSeparator="" Optional - default value is empty string
         */
        toCamelCase: function (str, wordSeparator) {
            if (!wordSeparator) {
                wordSeparator = "";
            }
            // skip initial underscore
            var i,
                wasLastCharSpace = true,
                charVal,
                resStr = "",
                isSpace;
            for (i = 0; i < str.length; i++) {
                charVal = str.charAt(i);
                if (charVal !== "_") {
                    break;
                }
                resStr += charVal;
            }

            for (; i < str.length; i++) {
                charVal = str.charAt(i);
                isSpace = charVal === '_';
                if (isSpace) {
                    charVal = wordSeparator;
                }
                resStr += wasLastCharSpace ? charVal.toUpperCase() : charVal.toLowerCase();
                wasLastCharSpace = isSpace;
            }
            return resStr;
        },
        /**
         * @method getJSONReference
         * @param {kick.core.Engine} engine
         * @param {Object} object
         * @return {JSON}
         */
        getJSONReference: function (engine, object) {
            if (object === null){
                return null;
            }
            Util.warn("Fix wrong usage of require!!!!");
            if (DEBUG) {
                if (!engine instanceof require("kick/core/Engine")) { // todo: fix this
                    Util.fail("getJSONReference - engine not defined");
                }
            }
            var isGameObject = object instanceof require("kick/scene/GameObject"); // todo: fix this
            var isComponent = !isGameObject && object.gameObject instanceof require("kick/scene/GameObject"); // todo: fix this
            if (isComponent || isGameObject) {
                return {
                    ref: engine.getUID(object),
                    name: typeof object.name === 'string'? object.name : "",
                    reftype: isGameObject?"gameobject":"component"
                };
            } else {
                // project type
                return {
                    ref: object.uid,
                    name: object.name,
                    reftype: "project"
                };
            }
        },
        /**
         * @method componentToJSON
         * @param {kick.core.Engine} engine
         * @param {kick.scene.Component} component
         * @param {String} componentType=component.constructor.name
         * @return {JSON}
         */
        componentToJSON: function(engine, component, componentType) {
            var name,
                config = {},
                functionReturnType = {},
                res = {
                    type: componentType || component.constructor.name,
                    uid: engine.getUID(component),
                    config:config
                },
                o,
                serializedObject;
            if (res.type === "") {
                Util.fail("Cannot serialize object type. Either provide toJSON function or use explicit function name 'function SomeObject(){}' ");
            }
            var serializeObject = function(o) {
                var result, i, r, typeofO;
                if (Array.isArray(o)) {
                    result = [];
                    for (i=0;i<o.length;i++) {
                        r = serializeObject(o[i]);
                        result.push(r);
                    }
                    return result;
                }
                typeofO = typeof o;
                if (typeofO !== 'function') {
                    if (o && o.buffer instanceof ArrayBuffer) {
                        // is typed array
                        return Util.typedArrayToArray(o);
                    } else if (typeofO === 'object') {
                        return Util.getJSONReference(engine,o);
                    } else {
                        return o;
                    }
                }
                return functionReturnType;
            };
            // init config object
            for (name in component) {
                if (Util.hasProperty(component,name) && name !== "gameObject") {
                    o = component[name];
                    serializedObject = serializeObject(o);
                    if (serializedObject !== functionReturnType) {
                        config[name] = serializedObject;
                    }
                }
            }
            return res;
        },
        /**
         * For each non function attribute in config, set the attribute on object
         * @method applyConfig
         * @param {Object} object
         * @param {Object} config
         * @param {Array_String} excludeFilter
         * @static
         */
        applyConfig: function (object, config, excludeFilter) {
            var contains = Util.contains,
                hasProperty = Util.hasProperty;
            config = config || {};
            excludeFilter = excludeFilter || [];
            for (var name in config) {
                if (typeof config[name] !== 'function' && !contains(excludeFilter,name) && hasProperty(object,name)) {
                    object[name] = config[name];
                }
            }
            // force setting uid
            if (config.uid && config.uid !== object.uid) {
                object.uid = config.uid;
            }
        },
        /**
         * Reads a parameter from a url string.
         * @method getParameter
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameter: function (url, parameterName) {
            var regexpStr = "[\\?&]" + parameterName + "=([^&#]*)",
                regexp = new RegExp(regexpStr),
                res = regexp.exec(url);
            if( res === null ) {
                return null;
            } else {
                return res[1];
            }
        },
        /**
         * Reads a int parameter from a url string.
         * @method getParameterInt
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameterInt: function(url, parameterName, notFoundValue) {
            var res = Util.getParameter(url,parameterName);
            if (res === null) {
                return notFoundValue;
            } else {
                return parseInt(res, 10);
            }
        },
        /**
         * Reads a float parameter from a url string.
         * @method getParameterInt
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameterFloat: function(url, parameterName, notFoundValue) {
            var res = Util.getParameter(url,parameterName);
            if (res === null) {
                return notFoundValue;
            } else {
                return parseFloat(res);
            }
        },
        /**
         * Scales the image by drawing the image on a canvas object.
         * @method scaleImage
         * @param {Image} imageObj
         * @param {Number} newWidth
         * @param {Number} newHeight
         * @return {Canvas} return a Canvas object (acts as a image)
         * @static
         */
        scaleImage: function (imageObj, newWidth, newHeight) {
            // from http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences
            var canvas = document.createElement("canvas"),
                ctx;
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx = canvas.getContext("2d");
            ctx.drawImage(imageObj,
                0, 0, imageObj.width, imageObj.height,
                0, 0, canvas.width, canvas.height);
            return canvas;
        },
        /**
         * Converts a typed array to a number array
         * @method typedArrayToArray
         * @static
         * @param {TypedArray} typedArray
         * @return {Array_Number}
         */
        typedArrayToArray: function (typedArray) {
            var length = typedArray.length,
                res = new Array(length),
                i;
            for (i = 0; i < length; i++){
                res[i] = typedArray[i];
            }
            return res;
        },

        /**
         * Remove one element from an array - either the first instance or all instances
         * @method removeElementFromArray
         * @static
         * @param {Array} array
         * @param {Object} removeValue value to be deleted
         * @param {boolean} deleteAll  deletaAll objects (or exit function after first deletion)
         * @return {boolean} elementRemoved
         */
        removeElementFromArray: function (array, removeValue, deleteAll) {
            var elementRemoved = false,
                i;
            for(i = array.length-1; i >= 0; i--) {
                if(array[i] === removeValue) {
                    elementRemoved = true;
                    array.splice(i, 1);
                    if (!deleteAll) {
                        break;
                    }
                }
            }
            return elementRemoved;
        },

        /**
         * Removes all values from one array in another array
         * @method removeElementsFromArray
         * @static
         * @param array {Array}
         * @param removeValues {Object} value to be deleted
         */
        removeElementsFromArray: function (array, removeValues) {
            var i,j;
            for (i = array.length-1; i >= 0; i--) {
                for (j = removeValues.length - 1; j >= 0; j--) {
                    if (array[i] === removeValues[j]) {
                        array.splice(i, 1);
                    }
                }
            }
        },
        /**
         * Insert the element into a sorted array
         * @static
         * @method insertSorted
         * @param {Object} element
         * @param {Array} sortedArray
         * @param {Function} sortFunc=kick.core.Util.numberSortFunction has the signature foo(obj1,obj2) returns Number. Optional (uses numberSort as default)
         */
        insertSorted : function (element,sortedArray,sortFunc) {
            var i;
            if (!sortFunc) {
                sortFunc = Util.numberSortFunction;
            }
            // assuming that the array is relative small
            for (i = sortedArray.length-1; i >= 0; i--) {
                if (sortFunc(sortedArray[i],element) <= 0) {
                    sortedArray.splice(i+1, 0, element);
                    return;
                }
            }
            sortedArray.unshift(element);
        },
        /**
         * Returns a-b
         * @static
         * @method numberSortFunction
         * @param {Number} a
         * @param {Number} b
         * @return {Number} a-b
         */
        numberSortFunction : function (a, b) {
            return a - b;
        },
        /**
         * Loops through array and return true if any array element strict equals the element.
         * This uses the === to compare the two elements.
         * @static
         * @method contains
         * @param {Array} array
         * @param {Object} element
         * @return {boolean} array contains element
         */
        contains : function (array, element) {
            var i;
            for (i = array.length - 1; i >= 0; i--) {
                if (array[i] === element) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Packs a Uint32 into a kick.math.Vec4
         * @static
         * @method uint32ToVec4
         * @param {Number} uint32
         * @param {kick.math.Vec4} dest
         * @return {kick.math.Vec4}
         */
        uint32ToVec4 : function(uint32, dest) {
            var i;
            if (!dest) {
                dest = new Float32Array(4);
            }
            packIntToFloatInt32Buffer[0] = uint32;
            for (i = 0; i < 4; i++) {
                dest[i] = packIntToFloatUint8Buffer[i] / 255;
            }
            return dest;
        },
        /**
         * Unpacks a kick.math.Vec4 into a Uint32
         * @static
         * @method vec4ToUint32
         * @param {kick.math.Vec4} vec4
         */
        vec4ToUint32 : function(vec4) {
            var i;
            for (i = 0; i < 4; i++) {
                packIntToFloatUint8Buffer[i] = vec4[i] * 255;
            }
            return packIntToFloatInt32Buffer[0];
        },
        /**
         * Unpacks an array of uint8 into a Uint32
         * @static
         * @method vec4uint8ToUint32
         * @param {Array_Number} vec4uint8
         */
        vec4uint8ToUint32 : function (vec4uint8) {
            var i;
            for (i = 0; i < 4; i++){
                packIntToFloatUint8Buffer[i] = vec4uint8[i];
            }
            return packIntToFloatInt32Buffer[0];
        },
        /**
         * Supports up to 3 byte UTF-8 encoding (including Basic Multilingual Plane)
         * @static
         * @method utf8Encode
         * @param {String} str
         * @return Uint8Array
         */
        utf8Encode:function (str) {
            var res = [],
                i,
                charCode;
            for (i = 0; i < str.length; i++) {
                charCode = str.charCodeAt(i);
                if (charCode < 0x007F) {
                    res.push(charCode);
                } else if (charCode <= 0x07FF) {
                    res.push(0xC0 + (charCode >> 6));
                    res.push(0x80 + (charCode & 0x3F));
                } else if (charCode <= 0xFFFF) {
                    res.push(0xE0 + (charCode >> 12));
                    res.push(0x80 + ((charCode >> 6) & 0x3F));
                    res.push(0x80 + (charCode & 0x3F));
                } else {
                    if (ASSERT) {
                        Util.fail("Unsupported character. Charcode " + charCode);
                    }
                }
            }
            return new Uint8Array(res);
        },
        /**
         * Removes all properties (methods and attributes) of an object
         * @static
         * @method removeAllProperties
         * @param {Object} obj
         */
        removeAllProperties: function (obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    delete obj[name];
                }
            }
        },
        /**
         * Supports up to 3 byte UTF-8 encoding (including Basic Multilingual Plane)
         * @static
         * @method utf8Decode
         * @param {Uint8Array} bytes
         * @return String
         */
        utf8Decode: function (bytes) {
            var str = "",
                i,
                byteVal,
                byte2,
                byte3,
                charValue;
            for (i = 0; i < bytes.length; i++) {
                byteVal = bytes[i];
                if ((byteVal & 0x80) === 0) { // Bytes 0xxxxxxx
                    str += String.fromCharCode(byteVal);
                } else if ((byteVal & 0xE0) === 0xC0) { // Bytes 110xxxxx
                    i++;
                    byte2 = bytes[i];
                    byteVal = (byteVal & 0x1F) << 6;
                    byte2 = byte2 & 0x3F;
                    charValue = byteVal + byte2;
                    str += String.fromCharCode(charValue);
                } else if ((byteVal & 0xF0) === 0xE0) { // Bytes 1110xxxx
                    i++;
                    byte2 = bytes[i];
                    i++;
                    byte3 = bytes[i];
                    byteVal = (byteVal & 0x1F) << 12;
                    byte2 = (byte2 & 0x3F) << 6;
                    byte3 = byte3 & 0x3F;
                    charValue = byteVal + byte2 + byte3;
                    str += String.fromCharCode(charValue);
                } else {
                    if (ASSERT) {
                        Util.fail("Unsupported encoding");
                    }
                }
            }
            return str;
        },
        /**
         * @static
         * @method isPowerOfTwo
         * @param {Number} x value
         * @return {Number}
         */
        isPowerOfTwo: function (x) {
            return (x & (x - 1)) === 0;
        },
        /**
         * @static
         * @method nextHighestPowerOfTwo
         * @param {Number} x value
         * @return {Number}
         */
        nextHighestPowerOfTwo: function (x) {
            var i;
            --x;
            for (i = 1; i < 32; i <<= 1) {
                x = x | x >> i;
            }
            return x + 1;
        },

        /**
         * @static
         * @method convertToTriangleIndices
         * @param {Array} triangleStripIndices index array
         * @param {Number} meshType such as Constants.GL_TRIANGLES or Constants.GL_TRIANGLE_STRIP
         * @param {Bool} removeDegenerate remove degenerate triangles
         * @return {Array|null} triangleIndices or null if not possible to convert
         */
        convertToTriangleIndices: function (triangleStripIndices, primitiveType, removeDegenerate) {
            if (primitiveType === Constants.GL_TRIANGLES){
                return triangleStripIndices;
            } else if (primitiveType !== Constants.GL_TRIANGLE_STRIP){
                return null;
            }
            var i,
                even = 1,
                trianleIndices = [triangleStripIndices[0], triangleStripIndices[1], triangleStripIndices[2]];

            for (i=3;i<triangleStripIndices.length;i++){
                if (removeDegenerate){
                    if (triangleStripIndices[i-1] === triangleStripIndices[i] ||
                        triangleStripIndices[i-2] === triangleStripIndices[i] ||
                        triangleStripIndices[i-1] === triangleStripIndices[i-2]){
                        continue;
                    }
                }
                if (i % 2 === even) {
                    trianleIndices.push(triangleStripIndices[i-1]);
                    trianleIndices.push(triangleStripIndices[i-2]);
                    trianleIndices.push(triangleStripIndices[i]);
                } else {
                    trianleIndices.push(triangleStripIndices[i-2]);
                    trianleIndices.push(triangleStripIndices[i-1]);
                    trianleIndices.push(triangleStripIndices[i]);
                }
            }
            return trianleIndices;
        },

        /**
         * @method namespace
         * @param {String} ns_string
         * @static
         * @deprecated
         * @return {Object}
         */
        namespace: function (ns_string) {
            console.log("Util.namespace is deprecated and will be removed in future version of KickJS");
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
        },
        /**
         * Invokes debugger and logs a warning
         * @method warn
         * @static
         */
        warn:function (message) {
            debugger;
            console.log(message);
        },
        /**
         * Invokes debugger and logs an error
         * @method fail
         * @static
         */
        fail:function (message) {
            debugger;
            console.error(message);
        }
    };

    return Util;
});