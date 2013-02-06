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
         * @example
         *     var ref = {};
         *     var v = kick.math.Vec4.array(2,ref);
         *     v[1][1] = 1;
         *     ref.mem[5] == v[1][1];
         *
         * Will be layout like this:
         * @example
         *     [vec4][vec4] = [0][1][2][3][4][5][6][7]
         *
         * @method array
         * @param {Number} count Number of vec 3 to be layout in memory
         * @param {Object} ref Optional, if set a memory reference is set to ref.mem
         * @return {kick.math.Vec3} New vec3
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
         * Wraps a Float32Array with multiple vec4 arrays. For instance if you have colors defined in a single
         * Float32Array, but need to do vector operations on the elements of the array, instead of copying data out of the
         * Float32Array, wrapArray will give you access to the same data.
         * <br>
         * Example:<br>
         * @example
         *     function averageColor(float32arrayColor){
         *         var sum = vec4.create(),
         *             wrappedArray = vec4.wrapArray(float32arrayColor),
         *             weigth = 1.0/wrappedArray;
         *         for (var i=0;i  &lt; wrappedArray.length;i++){
         *             vec4.add(sum,wrappedArray[i]);
         *         }
         *         return vec4.multiply(sum, sum, [weight, weight, weight, weight]);
         *     }
         * @method wrapArray
         * @param {Float32Array} array
         * @return {Array_kick.math.Vec4}
         * @static
         */
        wrapArray: function (array) {
            return wrapArray(array, 4);
        },


        /**
         * Creates a new, empty vec4
         *
         * @method create
         * @return {kick.math.Vec4} New vec4
         * @static
         */
        create: function () {
            return new Float32Array(4);
        },

        /**
         * Creates a new vec4 initialized with values from an existing vector
         *
         * @method clone
         * @param {kick.math.Vec4} a vector to clone
         * @return {kick.math.Vec4} a new 4D vector
         * @static
         */
        clone: function (a) {
            var out = new Float32Array(4);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        },

        /**
         * Creates a new vec4 initialized with the given values
         *
         * @method fromValues
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @return {kick.math.Vec4} a new 4D vector
         * @static
         */
        fromValues: function (x, y, z, w) {
            var out = new Float32Array(4);
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = w;
            return out;
        },

        /**
         * Copy the values from one vec4 to another
         *
         * @method copy
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the source vector
         * @return {kick.math.Vec4} out
         * @static
         */
        copy: function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        },

        /**
         * Set the components of a vec4 to the given values
         *
         * @method set
         * @param {kick.math.Vec4} out the receiving vector
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @return {kick.math.Vec4} out
         * @static
         */
        set: function (out, x, y, z, w) {
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = w;
            return out;
        },

        /**
         * Adds two vec4's
         *
         * @method add
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {kick.math.Vec4} out
         * @static
         */
        add: function (out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            return out;
        },


        /**
         * Subtracts two vec4's
         * @method subtract
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {kick.math.Vec4} out
         * @static
         */
        subtract: function (out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            return out;
        },


        /**
         * Multiplies two vec4's
         * @method multiply
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {kick.math.Vec4} out
         * @static
         */
        multiply: function (out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            out[3] = a[3] * b[3];
            return out;
        },


        /**
         * Divides two vec4's
         *
         * @method divide
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {kick.math.Vec4} out
         * @static
         */
        divide: function (out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            out[2] = a[2] / b[2];
            out[3] = a[3] / b[3];
            return out;
        },

        /**
         * Returns the minimum of two vec4's
         *
         * @method min
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {kick.math.Vec4} out
         * @static
         */
        min: function (out, a, b) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            out[2] = Math.min(a[2], b[2]);
            out[3] = Math.min(a[3], b[3]);
            return out;
        },

        /**
         * Returns the maximum of two vec4's
         *
         * @method max
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {kick.math.Vec4} out
         * @static
         */
        max: function (out, a, b) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            out[2] = Math.max(a[2], b[2]);
            out[3] = Math.max(a[3], b[3]);
            return out;
        },

        /**
         * Scales a vec4 by a scalar number
         *
         * @method scale
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @return {kick.math.Vec4} out
         * @static
         */
        scale: function (out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            return out;
        },

        /**
         * Calculates the euclidian distance between two vec4's
         *
         * @method distance
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {Number} distance between a and b
         * @static
         */
        distance: function (a, b) {
            var x = b[0] - a[0],
                y = b[1] - a[1],
                z = b[2] - a[2],
                w = b[3] - a[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        },

        /**
         * Calculates the squared euclidian distance between two vec4's
         *
         * @method squaredDistance
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {Number} squared distance between a and b
         * @static
         */
        squaredDistance: function (a, b) {
            var x = b[0] - a[0],
                y = b[1] - a[1],
                z = b[2] - a[2],
                w = b[3] - a[3];
            return x * x + y * y + z * z + w * w;
        },

        /**
         * Calculates the length of a vec4
         *
         * @method length
         * @param {kick.math.Vec4} a vector to calculate length of
         * @return {Number} length of a
         * @static
         */
        length: function (a) {
            var x = a[0],
                y = a[1],
                z = a[2],
                w = a[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        },

        /**
         * Calculates the squared length of a vec4
         *
         * @method squaredLength
         * @param {kick.math.Vec4} a vector to calculate squared length of
         * @return {Number} squared length of a
         * @static
         */
        squaredLength: function (a) {
            var x = a[0],
                y = a[1],
                z = a[2],
                w = a[3];
            return x * x + y * y + z * z + w * w;
        },

        /**
         * Negates the components of a Vec4
         * @method negate
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a vector to negate
         * @return {kick.math.Vec4} out
         * @static
         */
        negate: function (out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = -a[3];
            return out;
        },

        /**
         * Normalize a vec4
         *
         * @method normalize
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a vector to normalize
         * @return {kick.math.Vec4} out
         * @static
         */
        normalize: function (out, a) {
            var x = a[0],
                y = a[1],
                z = a[2],
                w = a[3];
            var len = x*x + y*y + z*z + w*w;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
                out[2] = a[2] * len;
                out[3] = a[3] * len;
            }
            return out;
        },


        /**
         * Calculates the dot product of two vec4's
         * @method dot
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @return {Number} dot product of a and b
         * @static
         */
        dot: function (a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
        },

        /**
         * Performs a linear interpolation between two vec4's
         *
         * @method lerp
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the first operand
         * @param {kick.math.Vec4} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @return {kick.math.Vec4} out
         * @static
         */
        lerp: function (out, a, b, t) {
            var ax = a[0],
                ay = a[1],
                az = a[2],
                aw = a[3];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            out[2] = az + t * (b[2] - az);
            out[3] = aw + t * (b[3] - aw);
            return out;
        },

        /**
         * Transforms the vec4 with a mat4.
         *
         * @method transformMat4
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the vector to transform
         * @param {kick.math.Mat4} m matrix to transform with
         * @return {kick.math.Vec4} out
         * @static
         */
        transformMat4: function (out, a, m) {
            var x = a[0], y = a[1], z = a[2], w = a[3];
            out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
            out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
            out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
            out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
            return out;
        },

        /**
         * Transforms the vec4 with a quat
         *
         * @method transformQuat
         * @param {kick.math.Vec4} out the receiving vector
         * @param {kick.math.Vec4} a the vector to transform
         * @param {kick.math.Quat} q quaternion to transform with
         * @return {kick.math.Vec4} out
         * @static
         */
        transformQuat: function (out, a, q) {
            var x = a[0], y = a[1], z = a[2],
                qx = q[0], qy = q[1], qz = q[2], qw = q[3],

            // calculate quat * vec
                ix = qw * x + qy * z - qz * y,
                iy = qw * y + qz * x - qx * z,
                iz = qw * z + qx * y - qy * x,
                iw = -qx * x - qy * y - qz * z;

            // calculate result * inverse quat
            out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return out;
        },

        /**
         * Perform some operation over an array of vec4s.
         *
         * @method forEach
         * @param {Array} a the array of vectors to iterate over
         * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
         * @param {Number} offset Number of elements to skip at the beginning of the array
         * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
         * @param {Function} fn Function to call for each vector in the array
         * @param {Object} [arg] additional argument to pass to fn
         * @return {Array} a
         * @static
         */
        forEach: (function () {
            var vec = new Float32Array(4);

            return function (a, stride, offset, count, fn, arg) {
                var i, l;
                if (!stride) {
                    stride = 4;
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
                    vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
                    fn(vec, vec, arg);
                    a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
                }

                return a;
            };
        }()),

        /**
         * Test to see if vectors are equal (difference is less than epsilon)
         * @method equal
         * @param {kick.math.Vec4} vec first operand
         * @param {kick.math.Vec4} vec2 second operand
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
         * @param {kick.math.Vec4} vec vec4 to represent as a string
         * @return {String} string representation of vec
         * @static
         */
        str: function (vec) {
            return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ', ' + vec[3] + ']';
        }
    };
});