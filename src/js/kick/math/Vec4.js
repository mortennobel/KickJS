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
     * Vec4 - 4 Dimensional Vector<br>
     * Note: To perform vec3 functions on vec4, simply call the vec3 functions<br>
     * @class Vec4
     * @namespace kick.math
     */
    return {
        /**
         * Create a continuous array in memory mapped to vec4.
         *
         * Example
         * <pre class="brush: js">
         * var ref = {};
         * var v = kick.math.vec4.array(2,ref);
         * v[1][1] = 1;
         * ref.mem[5] == v[1][1];
         * </pre>
         * Will be layout like this:
         * <pre class="brush: js">
         * [vec4][vec4] = [0][1][2][3][4][5][6][7]
         * </pre>
         * @method array
         * @param {Number} count Number of vec 3 to be layout in memory
         * @param {Object} ref Optional, if set a memory reference is set to ref.mem
         * @return {kick.math.vec3} New vec3
         * @static
         */
        array: function (count, ref) {
            var memory = new Float32Array(count * 4);
            if (ref) {
                ref.mem = memory;
            }
            return wrapArray(memory, 4);
        },

        /**
         * Creates a new instance of a vec4 using the default array type<br>
         * Any javascript array containing at least 4 numeric elements can serve as a vec4
         * @method create
         * @param {Array_Number} vec Optional, vec4 containing values to initialize with
         * @return {kick.math.vec4} New vec4
         * @static
         */
        create: function (vec) {
            var dest = new Float32Array(4);

            if (vec) {
                dest[0] = vec[0];
                dest[1] = vec[1];
                dest[2] = vec[2];
                dest[3] = vec[3];
            }

            return dest;
        },

        /**
         * Copies the values of one vec4 to another
         * @method set
         * @param {kick.math.vec4} vec vec4 containing values to copy
         * @param {kick.math.vec4} dest vec4 receiving copied values
         * @return {kick.math.vec4} dest
         * @static
         */
        set: function (vec, dest) {
            dest[0] = vec[0];
            dest[1] = vec[1];
            dest[2] = vec[2];
            dest[3] = vec[3];

            return dest;
        },

        /**
         * Performs a vector addition
         * @method add
         * @param {kick.math.vec4} vec  first operand
         * @param {kick.math.vec4} vec2  second operand
         * @param {kick.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
         * @return {kick.math.vec4} dest if specified, vec otherwise
         * @static
         */
        add: function (vec, vec2, dest) {
            if (!dest || vec === dest) {
                vec[0] += vec2[0];
                vec[1] += vec2[1];
                vec[2] += vec2[2];
                vec[3] += vec2[3];
                return vec;
            }

            dest[0] = vec[0] + vec2[0];
            dest[1] = vec[1] + vec2[1];
            dest[2] = vec[2] + vec2[2];
            dest[3] = vec[3] + vec2[3];
            return dest;
        },

        /**
         * Wraps a Float32Array with multiple vec4 arrays. For instance if you have colors defined in a single
         * Float32Array, but need to do vector operations on the elements of the array, instead of copying data out of the
         * Float32Array, wrapArray will give you access to the same data.
         * <br>
         * Example:<br>
         * <pre class="brush: js">
         * function avarageColor(float32arrayColor){
         *     var sum = vec4.create(),
         *         wrappedArray = vec4.wrapArray(float32arrayColor),
         *         weigth = 1.0/wrappedArray;
         *     for (var i=0;i  &lt; wrappedArray.length;i++){
         *         vec4.add(sum,wrappedArray[i]);
         *     }
         *     return vec4.multiply(sum, [weight, weight, weight, weight]);
         * }
         * </pre>
         * @method wrapArray
         * @param {Float32Array} array
         * @return {Array_kick.math.vec4}
         * @static
         */
        wrapArray: function (array) {
            return wrapArray(array, 4);
        },

        /**
         * Performs a vector subtraction
         * @method subtract
         * @param {kick.math.vec4} vec first operand
         * @param {kick.math.vec4} vec2 second operand
         * @param {kick.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
         * @return {kick.math.vec4} dest if specified, vec otherwise
         * @static
         */
        subtract: function (vec, vec2, dest) {
            if (!dest || vec === dest) {
                vec[0] -= vec2[0];
                vec[1] -= vec2[1];
                vec[2] -= vec2[2];
                vec[3] -= vec2[3];
                return vec;
            }

            dest[0] = vec[0] - vec2[0];
            dest[1] = vec[1] - vec2[1];
            dest[2] = vec[2] - vec2[2];
            dest[3] = vec[3] - vec2[3];
            return dest;
        },

        /**
         * Test to see if vectors are equal (difference is less than epsilon)
         * @method equal
         * @param {kick.math.vec4} vec first operand
         * @param {kick.math.vec4} vec2 second operand
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
         * Performs a vector multiplication
         * @method multiply
         * @param {kick.math.vec4} vec first operand
         * @param {kick.math.vec4} vec2 second operand
         * @param {kick.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
         * @return {kick.math.vec4} dest if specified, vec otherwise
         * @static
         */
        multiply: function (vec, vec2, dest) {
            if (!dest || vec === dest) {
                vec[0] *= vec2[0];
                vec[1] *= vec2[1];
                vec[2] *= vec2[2];
                vec[3] *= vec2[3];
                return vec;
            }

            dest[0] = vec[0] * vec2[0];
            dest[1] = vec[1] * vec2[1];
            dest[2] = vec[2] * vec2[2];
            dest[3] = vec[3] * vec2[3];
            return dest;
        },

        /**
         * Negates the components of a vec4
         * @method negate
         * @param {kick.math.vec4} vec vec4 to negate
         * @param {kick.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
         * @return {kick.math.vec4} dest if specified, vec otherwise
         * @static
         */
        negate: function (vec, dest) {
            if (!dest) { dest = vec; }

            dest[0] = -vec[0];
            dest[1] = -vec[1];
            dest[2] = -vec[2];
            dest[3] = -vec[3];
            return dest;
        },

        /**
         * Calculates the length of a vec4
         * @method length
         * @param {kick.math.vec4} vec vec4 to calculate length of
         * @return {Number} Length of vec
         * @static
         */
        length: function (vec) {
            var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        },

        /**
         * Calculates the dot product of two vec3s
         * @method dot
         * @param {kick.math.vec4} vec first operand
         * @param {kick.math.vec4} vec2 second operand
         * @return {Number} Dot product of vec and vec2
         * @static
         */
        dot: function (vec, vec2) {
            return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2] + vec[3] * vec2[3];
        },

        /**
         * Multiplies the components of a vec4 by a scalar value
         * @method scale
         * @param {kick.math.vec4} vec vec4 to scale
         * @param {Number} val Numeric value to scale by
         * @param {kick.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
         * @return {kick.math.vec4} dest if specified, vec otherwise
         * @static
         */
        scale: function (vec, val, dest) {
            if (!dest || vec === dest) {
                vec[0] *= val;
                vec[1] *= val;
                vec[2] *= val;
                vec[3] *= val;
                return vec;
            }

            dest[0] = vec[0] * val;
            dest[1] = vec[1] * val;
            dest[2] = vec[2] * val;
            dest[3] = vec[2] * val;
            return dest;
        },
        /**
         * Returns a string representation of a vector
         * @method str
         * @param {kick.math.vec4} vec vec4 to represent as a string
         * @return {String} string representation of vec
         * @static
         */
        str: function (vec) {
            return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ', ' + vec[3] + ']';
        }
    };
});