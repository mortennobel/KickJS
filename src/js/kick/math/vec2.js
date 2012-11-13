define(["kick/core/Constants"], function (constants) {
    "use strict";
    var wrapArray = function (array, length) {
        var i,
            index = 0,
            count = array.length / length,
            res = [];
        for (i = 0; i < count; i++, index += length) {
            res[i] = array.subarray(index, index + length);
        }
        return res;
    };

    /**
     * Vec2 - 2 dimensional vector
     * @class Vec2
     * @namespace kick.math
     */
    return {
        /**
         * See kick.math.vec4.wrapArray
         * @method wrapArray
         * @param {Float32Array} array
         * @return {Array_KICK.math.Vec2} of vec2
         * @static
         */
        wrapArray: function (array) {
            return wrapArray(array, 2);
        },


        /**
         * Create a continuous array in memory mapped to vec2. <br>
         * @method array
         * @param {Number} count Number of vec 2 to be layed out in memory
         * @param {Object} ref Optional, if set a memory reference is set to ref.mem
         * @return {KICK.math.vec2} New vec2
         * @static
         */
        array: function (count, ref) {
            var memory = new Float32Array(count * 2);
            if (ref) {
                ref.mem = memory;
            }
            return wrapArray(memory, 2);
        },

        /**
         * Creates a new instance of a vec2 using the default array type
         * Any javascript array containing at least 2 numeric elements can serve as a vec2
         * @method create
         * @param {Array_Number} vec Optional, vec2 containing values to initialize with
         * @return {KICK.math.vec2} New vec2
         * @static
         */
        create: function (vec) {
            var dest = new Float32Array(2);

            if (vec) {
                dest[0] = vec[0];
                dest[1] = vec[1];
            }

            return dest;
        },

        /**
         * Copies the values of one vec2 to another
         * @method set
         * @param {KICK.math.vec2} vec vec2 containing values to copy
         * @param {KICK.math.vec2} dest vec2 receiving copied values
         * @return {KICK.math.vec2} dest
         * @static
         */
        set: function (vec, dest) {
            dest[0] = vec[0];
            dest[1] = vec[1];

            return dest;
        },

        /**
         * Performs a vector addition
         * @method add
         * @param {KICK.math.vec2} vec  first operand
         * @param {KICK.math.vec2} vec2  second operand
         * @param {KICK.math.vec2} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {KICK.math.vec2} dest if specified, vec otherwise
         * @static
         */
        add: function (vec, vec2, dest) {
            if (!dest || vec === dest) {
                vec[0] += vec2[0];
                vec[1] += vec2[1];
                return vec;
            }

            dest[0] = vec[0] + vec2[0];
            dest[1] = vec[1] + vec2[1];
            return dest;
        },

        /**
         * Performs a vector subtraction
         * @method subtract
         * @param {KICK.math.vec2} vec first operand
         * @param {KICK.math.vec2} vec2 second operand
         * @param {KICK.math.vec2} dest Optional, vec2 receiving operation result. If not specified result is written to vec
         * @return {KICK.math.vec2} dest if specified, vec otherwise
         * @static
         */
        subtract: function (vec, vec2, dest) {
            if (!dest || vec === dest) {
                vec[0] -= vec2[0];
                vec[1] -= vec2[1];
                return vec;
            }

            dest[0] = vec[0] - vec2[0];
            dest[1] = vec[1] - vec2[1];
            return dest;
        },

        /**
         * Test to see if vectors are equal (difference is less than epsilon)
         * @method equal
         * @param {KICK.math.vec2} vec first operand
         * @param {KICK.math.vec2} vec2 second operand
         * @param {Number} epsilon Optional - default value is
         * @return {Boolean} true if two vectors are equals
         * @static
         */
        equal: function (vec, vec2, epsilon) {
            var i;
            if (!epsilon) {
                epsilon = constants._EPSILON;
            }
            for (i = 0; i < 2; i++) {
                if (Math.abs(vec[i] - vec2[i]) > epsilon) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Generates a unit vector of the same direction as the provided vec2
         * If vector length is 0, returns [0, 0]
         * @method normalize
         * @param {KICK.math.vec2} vec vec3 to normalize
         * @param {KICK.math.vec2} dest Optional, vec2 receiving operation result. If not specified result is written to vec
         * @return {KICK.math.vec2} dest if specified, vec otherwise
         * @static
         */
        normalize: function (vec, dest) {
            var x, y, len;
            if (!dest) { dest = vec; }

            x = vec[0];
            y = vec[1];
            len = Math.sqrt(x * x + y * y);

            if (!len) {
                dest[0] = 0;
                dest[1] = 0;
                return dest;
            } else if (len === 1) {
                dest[0] = x;
                dest[1] = y;
                return dest;
            }

            len = 1 / len;
            dest[0] = x * len;
            dest[1] = y * len;
            return dest;
        }
    };
});