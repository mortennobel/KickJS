define(["kick/core/Constants", "./Mat4"], function (constants, mat4) {
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
     * Vec3 - 3 Dimensional Vector
     * @class Vec3
     * @namespace kick.math
     */
    return {
        /**
         * See kick.math.Vec4.wrapArray
         * @method wrapArray
         * @param {Float32Array} array
         * @return {Array_kick.math.Vec3} of vec3
         * @static
         */
        wrapArray: function (array) {
            return wrapArray(array, 3);
        },

        /**
         * Create a continuous array in memory mapped to vec3. <br>
         * <br>
         * Example<br>
         * @example
         *     var ref = {};
         *     var v = kick.math.Vec3.array(2,ref);
         *     v[1][1] = 1;
         *     ref.mem[4] == v[1][1];
         *
         * Will be layed out like this: <br>
         * <br>
         * @example
         *     [vec3][vec3) = [0][1][2][3][4][5]
         *
         *
         * @method array
         * @param {Number} count Number of vec 3 to be layed out in memory
         * @param {Object} ref Optional, if set a memory reference is set to ref.mem
         * @return {kick.math.Vec3} New vec3
         * @static
         */
        array: function (count, ref) {
            var memory = new Float32Array(count * 3);
            if (ref) {
                ref.mem = memory;
            }
            return wrapArray(memory, 3);
        },
        /**
         * Creates a new, empty vec3
         *
         * @method create
         * @return {kick.math.Vec3} New vec3
         * @static
         */
        create: function () {
            return new Float32Array(3);
        },

        /**
         * @method clone
         * @param {kick.math.Vec3} a vector to clone
         * @return {kick.math.Vec3} a new 3D vector
         * @static
         */
        clone: function (a) {
            var out = new Float32Array(3);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            return out;
        },

        /**
         * Creates a new vec3 initialized with the given values
         * @method fromValues
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @return {kick.math.Vec3} a new 3D vector
         * @static
         */
        fromValues: function (x, y, z) {
            var out = new Float32Array(3);
            out[0] = x;
            out[1] = y;
            out[2] = z;
            return out;
        },

        /**
         * Copy the values from one vec3 to another
         *
         * @method copy
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the source vector
         * @return {kick.math.Vec3} out
         * @static
         */
        copy: function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            return out;
        },

        /**
         * Set the components of a vec3 to the given values
         *
         * @method set
         * @param {kick.math.Vec3} out the receiving vector
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @return {kick.math.Vec3} out
         * @static
         */
        set: function (out, x, y, z) {
            out[0] = x;
            out[1] = y;
            out[2] = z;
            return out;
        },

        /**
         * Adds two vec3's
         * @method add
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {kick.math.Vec3} out
         * @static
         */
        add: function (out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            return out;
        },

        /**
         * Subtracts two vec3's
         *
         * @method subtract
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {kick.math.Vec3} out
         * @static
         */
        subtract: function (out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            return out;
        },


        /**
         * Multiplies two vec3's
         * @method multiply
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {kick.math.Vec3} out
         * @static
         */
        multiply: function (out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            return out;
        },

        /**
         * Divides two vec3's
         *
         * @method divide
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {kick.math.Vec3} out
         * @static
         */
        divide: function (out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            out[2] = a[2] / b[2];
            return out;
        },

        /**
         * Returns the minimum of two vec3's
         *
         * @method min
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {kick.math.Vec3} out
         * @static
         */
        min: function (out, a, b) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            out[2] = Math.min(a[2], b[2]);
            return out;
        },

        /**
         * Returns the maximum of two vec3's
         *
         * @method max
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {kick.math.Vec3} out
         * @static
         */
        max: function (out, a, b) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            out[2] = Math.max(a[2], b[2]);
            return out;
        },

        /**
         * Scales a vec3 by a scalar number
         * @method scale
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @return {kick.math.Vec3} out
         * @static
         */
        scale: function (out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            return out;
        },

        /**
         * Calculates the euclidian distance between two vec3's
         *
         * @method distance
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {Number} distance between a and b
         * @static
         */
        distance: function (a, b) {
            var x = b[0] - a[0],
                y = b[1] - a[1],
                z = b[2] - a[2];
            return Math.sqrt(x * x + y * y + z * z);
        },

        /**
         * Calculates the squared euclidian distance between two vec3's
         *
         * @method squaredDistance
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {Number} squared distance between a and b
         * @static
         */
        squaredDistance: function (a, b) {
            var x = b[0] - a[0],
                y = b[1] - a[1],
                z = b[2] - a[2];
            return x * x + y * y + z * z;
        },

        /**
         * Calculates the length of a vec3
         *
         * @method length
         * @param {kick.math.Vec3} a vector to calculate length of
         * @return {Number} Length of vec
         * @static
         */
        length: function (a) {
            var x = a[0],
                y = a[1],
                z = a[2];
            return Math.sqrt(x * x + y * y + z * z);
        },

        /**
         * Calculates the squared length of a vec3
         * @method squaredLength
         * @param {kick.math.Vec3} a vector to calculate squared length of
         * @return {Number} Squared length of vec
         * @static
         */
        squaredLength: function (a) {
            var x = a[0],
                y = a[1],
                z = a[2];
            return x * x + y * y + z * z;
        },

        /**
         * Negates the components of a vec3
         * @method negate
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a vector to negate
         * @return {kick.math.Vec3} out
         * @static
         */
        negate: function (out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            return out;
        },



        /**
         * Normalize a vec3
         *
         * @method normalize
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a vector to normalize
         * @return {kick.math.Vec3} out
         * @static
         */
        normalize: function (out, a) {
            var x = a[0],
                y = a[1],
                z = a[2],
                len = x * x + y * y + z * z;
            if (len > 0) {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
                out[2] = a[2] * len;
            }
            return out;
        },

        /**
         * Calculates the dot product of two vec3s
         * @method dot
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @return {Number} dot product of a and b
         * @static
         */
        dot: function (a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        },

        /**
         * Generates the cross product of two vec3s
         * @method cross
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @return {kick.math.Vec3} out
         * @static
         */
        cross: function (out, a, b) {
            var ax = a[0], ay = a[1], az = a[2],
                bx = b[0], by = b[1], bz = b[2];

            out[0] = ay * bz - az * by;
            out[1] = az * bx - ax * bz;
            out[2] = ax * by - ay * bx;
            return out;
        },

        /**
         * Performs a linear interpolation between two vec3
         *
         * @method lerp
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the first operand
         * @param {kick.math.Vec3} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @return {kick.math.Vec3} out
         * @static
         */
        lerp: function (out, a, b, t) {
            var ax = a[0],
                ay = a[1],
                az = a[2];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            out[2] = az + t * (b[2] - az);
            return out;
        },

        /**
         * Transforms the vec3 with a mat4.
         * 4th vector component is implicitly '1'
         *
         * @method transformMat4
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the vector to transform
         * @param {kick.math.Mat4} m matrix to transform with
         * @return {kick.math.Vec3} out
         * @static
         */
        transformMat4: function (out, a, m) {
            var x = a[0], y = a[1], z = a[2];
            out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
            out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
            out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
            return out;
        },

        /**
         * Transforms the vec3 with a quat
         *
         * @method transformQuat
         * @param {kick.math.Vec3} out the receiving vector
         * @param {kick.math.Vec3} a the vector to transform
         * @param {kick.math.Quat} q quaternion to transform with
         * @return {kick.math.Vec3} out
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
         * Perform some operation over an array of vec3s.
         *
         * @method forEach
         * @param {Array} a the array of vectors to iterate over
         * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
         * @param {Number} offset Number of elements to skip at the beginning of the array
         * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
         * @param {Function} fn Function to call for each vector in the array
         * @param {Object} [arg] additional argument to pass to fn
         * @return {Array} a
         * @static
         */
        forEach: (function () {
            var vec = new Float32Array(3);

            return function (a, stride, offset, count, fn, arg) {
                var i, l;
                if (!stride) {
                    stride = 3;
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
                    vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
                    fn(vec, vec, arg);
                    a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
                }

                return a;
            };
        }()),

        /**
         * Generates a unit vector pointing from one vector to another
         * @method direction
         * @param {kick.math.Vec3} vec origin vec3
         * @param {kick.math.Vec3} vec2 vec3 to point to
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        direction: function (vec, vec2, dest) {
            if (!dest) { dest = vec; }

            var x = vec[0] - vec2[0],
                y = vec[1] - vec2[1],
                z = vec[2] - vec2[2],
                len = Math.sqrt(x * x + y * y + z * z);

            if (!len) {
                dest[0] = 0;
                dest[1] = 0;
                dest[2] = 0;
                return dest;
            }

            len = 1 / len;
            dest[0] = x * len;
            dest[1] = y * len;
            dest[2] = z * len;
            return dest;
        },



        /**
         * Calculates the euclidean distance between two vec3
         *
         * @method dist
         * @param {kick.math.Vec3} vec first vector
         * @param {kick.math.Vec3} vec2 second vector
         * @return {Number} distance between vec and vec2
         * @static
         */
        dist: function (vec, vec2) {
            var x = vec2[0] - vec[0],
                y = vec2[1] - vec[1],
                z = vec2[2] - vec[2];

            return Math.sqrt(x * x + y * y + z * z);
        },

        /**
         * Projects the specified vec3 from screen space into object space
         * Based on Mesa gluUnProject implementation at:
         * http://webcvs.freedesktop.org/mesa/Mesa/src/glu/mesa/project.c?revision=1.4&view=markup
         *
         * @method unproject
         * @param {kick.math.Vec3} vec screen-space vector to project
         * @param {kick.math.Mat4} modelView Model-View matrix
         * @param {kick.math.Mat4} proj Projection matrix
         * @param {kick.math.Vec4} viewport Viewport as given to gl.viewport [x, y, width, height]
         * @param {kick.math.Vec3} dest Optional, vec3 receiving unprojected result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        unproject: (function () {
            var m = new Float32Array(16),
                v = new Float32Array(4);
            return function (vec, modelView, proj, viewport, dest) {
                if (!dest) { dest = vec; }

                v[0] = (vec[0] - viewport[0]) * 2.0 / viewport[2] - 1.0;
                v[1] = (vec[1] - viewport[1]) * 2.0 / viewport[3] - 1.0;
                v[2] = 2.0 * vec[2] - 1.0;
                v[3] = 1.0;

                mat4.multiply(m, proj, modelView);
                if (!mat4.invert(m, m)) { return null; }

                mat4.multiplyVec4(m, v);
                if (v[3] === 0.0) { return null; }

                dest[0] = v[0] / v[3];
                dest[1] = v[1] / v[3];
                dest[2] = v[2] / v[3];

                return dest;
            };
        }()),

        /**
         * Converts the spherical coordinates (in radians) to carterian coordinates.<br>
         * Spherical coordinates are mapped so vec[0] is radius, vec[1] is polar and vec[2] is elevation
         * @method sphericalToCarterian
         * @param {kick.math.Vec3} spherical spherical coordinates
         * @param {kick.math.Vec3} dest optionally if not specified a new vec3 is returned
         * @return {kick.math.Vec3} position in cartesian angles
         * @static
         */
        sphericalToCarterian: function (spherical, dest) {
            var radius = spherical[0],
                polar = -spherical[1],
                elevation = spherical[2],
                a = radius * Math.cos(elevation);
            if (!dest) {
                dest =  new Float32Array(3);
            }
            dest[0] = a * Math.cos(polar);
            dest[1] = radius * Math.sin(elevation);
            dest[2] = a * Math.sin(polar);
            return dest;
        },

        /**
         * Test to see if vectors are equal (difference is less than epsilon)
         * @method equal
         * @param {kick.math.Vec3} vec first operand
         * @param {kick.math.Vec3} vec2 second operand
         * @param {Number} epsilon Optional - default value is
         * @return {Boolean} true if two vectors are equals
         * @static
         */
        equal: function (vec, vec2, epsilon) {
            var i;
            if (!epsilon) {
                epsilon = constants._EPSILON;
            }
            for (i = 0; i < 3; i++) {
                if (Math.abs(vec[i] - vec2[i]) > epsilon) {
                    return false;
                }
            }
            return true;
        },



        /**
         * Converts from cartesian coordinates to spherical coordinates (in radians)<br>
         * Spherical coordinates are mapped so vec[0] is radius, vec[1] is polar and vec[2] is elevation
         * @method cartesianToSpherical
         * @param {kick.math.Vec3} cartesian
         * @param {kick.math.Vec3} dest Optional
         * @return {kick.math.Vec3}
         * @static
         */
        cartesianToSpherical: function (cartesian, dest) {
            var x = cartesian[0],
                y = cartesian[1],
                z = cartesian[2],
                sphericalX;
            if (x === 0) {
                x = constants._EPSILON;
            }
            if (!dest) {
                dest =  new Float32Array(3);
            }

            dest[0] = sphericalX = Math.sqrt(x * x + y * y + z * z);
            dest[1] = -Math.atan(z / x);
            if (x < 0) {
                dest[1] += Math.PI;
            }
            dest[2] = Math.asin(y / sphericalX);
            return dest;
        },

        /**
         * Returns a string representation of a vector
         * @method str
         * @param {kick.math.Vec3} vec vec3 to represent as a string
         * @return {String} string representation of vec
         * @static
         */
        str: function (vec) {
            return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']';
        }
    };
});

