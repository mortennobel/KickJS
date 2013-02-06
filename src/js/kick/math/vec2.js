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
     * Any javascript array containing at least 2 numeric elements can serve as a vec2
     * @class Vec2
     * @namespace kick.math
     */
    return {
        /**
         * See kick.math.Vec4.wrapArray
         * @method wrapArray
         * @param {Float32Array} array
         * @return {Array_kick.math.Vec2} of vec2
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
         * @return {kick.math.Vec2} New vec2
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
         * Creates a new, empty vec2
         *
         * @method create
         * @return {kick.math.Vec2} New vec2
         * @static
         */
        create: function () {
            return new Float32Array(2);
        },

        /**
         * @method clone
         * @param {kick.math.Vec2} a vector to clone
         * @return {kick.math.Vec2} a new 2D vector
         * @static
         */
        clone: function (a) {
            var out = new Float32Array(2);
            out[0] = a[0];
            out[1] = a[1];
            return out;
        },

        /**
         * Creates a new vec2 initialized with the given values
         *
         * @method fromValues
         * @param {Number} x X component
         * @param {Number} y Y component
         * @return {kick.math.Vec2} a new 2D vector
         * @static
         */
        fromValues: function (x, y) {
            var out = new Float32Array(2);
            out[0] = x;
            out[1] = y;
            return out;
        },

        /**
         * Copies the values of one vec2 to another
         *
         * @method copy
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the source vector
         * @return {kick.math.Vec2} out
         * @static
         */
        copy: function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            return out;
        },

        /**
         * Set the components of a vec2 to the given values
         * @method set
         * @param {kick.math.Vec2} out the receiving vector
         * @param {Number} x X component
         * @param {Number} y Y component
         * @return {kick.math.Vec2} out
         * @static
         */
        set: function (out, x, y) {
            out[0] = x;
            out[1] = y;
            return out;
        },

        /**
         * Adds two vec2's
         * @method add
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {kick.math.Vec2} out
         * @static
         */
        add: function (out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            return out;
        },

        /**
         * Subtracts two vec2's
         * @method subtract
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {kick.math.Vec2} out
         * @static
         */
        subtract: function (out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            return out;
        },

        /**
         * Multiplies two vec2's
         *
         * @method multiply
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {kick.math.Vec2} out
         * @static
         */
        multiply: function (out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            return out;
        },

        /**
         * Divides two vec2's
         *
         * @method divide
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {kick.math.Vec2} out
         * @static
         */
        divide: function (out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            return out;
        },

        /**
         * Returns the minimum of two vec2's
         *
         * @method min
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {kick.math.Vec2} out
         * @static
         */
        min: function (out, a, b) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            return out;
        },

        /**
         * Returns the maximum of two vec2's
         *
         * @method max
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {kick.math.Vec2} out
         * @static
         */
        max: function (out, a, b) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            return out;
        },

        /**
         * Scales a vec2 by a scalar number
         *
         * @method scale
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @return {kick.math.Vec2} out
         * @static
         */
        scale: function (out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            return out;

        },

        /**
         * Calculates the euclidian distance between two vec2's
         *
         * @method distance
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {Number} distance between a and b
         * @static
         */
        distance: function (a, b) {
            var x = b[0] - a[0],
                y = b[1] - a[1];
            return Math.sqrt(x * x + y * y);
        },

        /**
         * Calculates the squared euclidian distance between two vec2's
         *
         * @method squaredDistance
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {Number} squared distance between a and b
         * @static
         */
        squaredDistance: function (a, b) {
            var x = b[0] - a[0],
                y = b[1] - a[1];
            return x * x + y * y;
        },

        /**
         * Calculates the length of a vec2
         *
         * @method length
         * @param {kick.math.Vec2} a vector to calculate length of
         * @return {Number} length of a
         * @static
         */
        length: function (a) {
            var x = a[0],
                y = a[1];
            return Math.sqrt(x * x + y * y);
        },


        /**
         * Calculates the squared length of a vec2
         *
         * @method squaredLength
         * @param {kick.math.Vec2} a vector to calculate squared length of
         * @return {Number} squared length of a
         * @static
         */
        squaredLength: function (a) {
            var x = a[0],
                y = a[1];
            return x * x + y * y;
        },


        /**
         * Negates the components of a vec2
         *
         * @method negate
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a vector to negate
         * @return {kick.math.Vec2} out
         * @static
         */
        negate: function (out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            return out;
        },

        /**
         * Normalize a vec2
         *
         * @method normalize
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a vector to normalize
         * @return {kick.math.Vec2} out
         * @static
         */
        normalize: function (out, a) {
            var x = a[0],
                y = a[1],
                len = x * x + y * y;
            if (len > 0) {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
            }
            return out;
        },

        /**
         * Calculates the dot product of two vec2's
         *
         * @method dot
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {Number} dot product of a and b
         * @static
         */
        dot: function (a, b) {
            return a[0] * b[0] + a[1] * b[1];
        },

        /**
         * Computes the cross product of two vec2's
         * Note that the cross product must by definition produce a 3D vector
         *
         * @method cross
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @return {kick.math.Vec3} out
         * @static
         */
        cross: function (out, a, b) {
            var z = a[0] * b[1] - a[1] * b[0];
            out[0] = out[1] = 0;
            out[2] = z;
            return out;
        },

        /**
         * Performs a linear interpolation between two vec2's
         *
         * @method lerp
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the first operand
         * @param {kick.math.Vec2} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @return {kick.math.Vec2} out
         * @static
         */
        lerp: function (out, a, b, t) {
            var ax = a[0],
                ay = a[1];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            return out;
        },


        /**
         * Transforms the vec2 with a mat2
         *
         * @method transformMat2
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the vector to transform
         * @param {kick.math.Mat2} m matrix to transform with
         * @return {kick.math.Vec2} out
         * @static
         */
        transformMat2: function (out, a, m) {
            var x = a[0],
                y = a[1];
            out[0] = m[0] * x + m[2] * y;
            out[1] = m[1] * x + m[3] * y;
            return out;
        },

        /**
         * Transforms the vec2 with a mat2d
         * @method transformMat2d
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the vector to transform
         * @param {kick.math.Mat2d} m matrix to transform with
         * @return {kick.math.Vec2} out
         * @static
         */
        transformMat2d: function(out, a, m) {
            var x = a[0],
                y = a[1];
            out[0] = m[0] * x + m[2] * y + m[4];
            out[1] = m[1] * x + m[3] * y + m[5];
            return out;
        },


        /**
         * Transforms the vec2 with a mat3
         * 3rd vector component is implicitly '1'
         * @method transformMat3
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the vector to transform
         * @param {kick.math.Mat3} m matrix to transform with
         * @return {kick.math.Vec2} out
         * @static
         */
        transformMat3: function(out, a, m) {
            var x = a[0],
                y = a[1];
            out[0] = m[0] * x + m[3] * y + m[6];
            out[1] = m[1] * x + m[4] * y + m[7];
            return out;
        },

        /**
         * Transforms the vec2 with a mat4
         * 3rd vector component is implicitly '0'
         * 4th vector component is implicitly '1'
         * @method transformMat4
         * @param {kick.math.Vec2} out the receiving vector
         * @param {kick.math.Vec2} a the vector to transform
         * @param {kick.math.Mat4} m matrix to transform with
         * @return {kick.math.Vec2} out
         * @static
         */
        transformMat4: function(out, a, m) {
            var x = a[0],
                y = a[1];
            out[0] = m[0] * x + m[4] * y + m[12];
            out[1] = m[1] * x + m[5] * y + m[13];
            return out;
        },


        /**
         * Perform some operation over an array of vec2s.
         * @method forEach
         * @param {Array} a the array of vectors to iterate over
         * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
         * @param {Number} offset Number of elements to skip at the beginning of the array
         * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
         * @param {Function} fn Function to call for each vector in the array
         * @param {Object} [arg] additional argument to pass to fn
         * @return {Array} a
         * @static
         */
        forEach: (function () {
            var vec = new Float32Array(2);

            return function (a, stride, offset, count, fn, arg) {
                var i, l;
                if (!stride) {
                    stride = 2;
                }

                if (!offset) {
                    offset = 0;
                }

                if (count) {
                    l = Math.min((count * stride) + offset, a.length);
                } else {
                    l = a.length;
                }

                for (i = offset; i < l; i += stride) {
                    vec[0] = a[i]; vec[1] = a[i+1];
                    fn(vec, vec, arg);
                    a[i] = vec[0]; a[i+1] = vec[1];
                }

                return a;
            };
        }()),

        /**
         * Test to see if vectors are equal (difference is less than epsilon)
         * @method equal
         * @param {kick.math.Vec2} vec first operand
         * @param {kick.math.Vec2} vec2 second operand
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
         * Returns a string representation of a vector
         * @method str
         * @param {kick.math.Vec2} vec vec2 to represent as a string
         * @return {String} string representation of vec
         * @static
         */
        str: function (vec) {
            return '[' + vec[0] + ', ' + vec[1] + ']';
        }

    };
});