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
         * <pre class="brush: js">
         * var ref = {};
         * var v = kick.math.Vec3.array(2,ref);
         * v[1][1] = 1;
         * ref.mem[4] == v[1][1];
         * </pre>
         * Will be layed out like this: <br>
         * <br>
         * <pre class="brush: js">
         * [vec3][vec3) = [0][1][2][3][4][5]
         * </pre>
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
         * Creates a new instance of a vec3 using the default array type
         * Any javascript array containing at least 3 numeric elements can serve as a vec3
         * @method create
         * @param {Array_Number} vec Optional, vec3 containing values to initialize with
         * @return {kick.math.Vec3} New vec3
         * @static
         */
        create: function (vec) {
            var dest = new Float32Array(3);

            if (vec) {
                dest[0] = vec[0];
                dest[1] = vec[1];
                dest[2] = vec[2];
            }

            return dest;
        },

        /**
         * Copies the values of one vec3 to another
         * @method set
         * @param {kick.math.Vec3} vec vec3 containing values to copy
         * @param {kick.math.Vec3} dest vec3 receiving copied values
         * @return {kick.math.Vec3} dest
         * @static
         */
        set: function (vec, dest) {
            dest[0] = vec[0];
            dest[1] = vec[1];
            dest[2] = vec[2];

            return dest;
        },

        /**
         * Performs a vector addition
         * @method add
         * @param {kick.math.Vec3} vec  first operand
         * @param {kick.math.Vec3} vec2  second operand
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        add: function (vec, vec2, dest) {
            if (!dest || vec === dest) {
                vec[0] += vec2[0];
                vec[1] += vec2[1];
                vec[2] += vec2[2];
                return vec;
            }

            dest[0] = vec[0] + vec2[0];
            dest[1] = vec[1] + vec2[1];
            dest[2] = vec[2] + vec2[2];
            return dest;
        },

        /**
         * Performs a vector subtraction
         * @method subtract
         * @param {kick.math.Vec3} vec first operand
         * @param {kick.math.Vec3} vec2 second operand
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        subtract: function (vec, vec2, dest) {
            if (!dest || vec === dest) {
                vec[0] -= vec2[0];
                vec[1] -= vec2[1];
                vec[2] -= vec2[2];
                return vec;
            }

            dest[0] = vec[0] - vec2[0];
            dest[1] = vec[1] - vec2[1];
            dest[2] = vec[2] - vec2[2];
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
         * Performs a vector multiplication
         * @method multiply
         * @param {kick.math.Vec3} vec first operand
         * @param {kick.math.Vec3} vec2 second operand
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        multiply: function (vec, vec2, dest) {
            if (!dest || vec === dest) {
                vec[0] *= vec2[0];
                vec[1] *= vec2[1];
                vec[2] *= vec2[2];
                return vec;
            }

            dest[0] = vec[0] * vec2[0];
            dest[1] = vec[1] * vec2[1];
            dest[2] = vec[2] * vec2[2];
            return dest;
        },

        /**
         * Negates the components of a vec3
         * @method negate
         * @param {kick.math.Vec3} vec vec3 to negate
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        negate: function (vec, dest) {
            if (!dest) { dest = vec; }

            dest[0] = -vec[0];
            dest[1] = -vec[1];
            dest[2] = -vec[2];
            return dest;
        },

        /**
         * Multiplies the components of a vec3 by a scalar value
         * @method scale
         * @param {kick.math.Vec3} vec vec3 to scale
         * @param {Number} val Numeric value to scale by
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        scale: function (vec, val, dest) {
            if (!dest || vec === dest) {
                vec[0] *= val;
                vec[1] *= val;
                vec[2] *= val;
                return vec;
            }

            dest[0] = vec[0] * val;
            dest[1] = vec[1] * val;
            dest[2] = vec[2] * val;
            return dest;
        },

        /**
         * Generates a unit vector of the same direction as the provided vec3
         * If vector length is 0, returns [0, 0, 0]
         * @method normalize
         * @param {kick.math.Vec3} vec vec3 to normalize
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        normalize: function (vec, dest) {
            if (!dest) { dest = vec; }

            var x = vec[0], y = vec[1], z = vec[2],
                len = Math.sqrt(x * x + y * y + z * z);

            if (!len) {
                dest[0] = 0;
                dest[1] = 0;
                dest[2] = 0;
                return dest;
            } else if (len === 1) {
                dest[0] = x;
                dest[1] = y;
                dest[2] = z;
                return dest;
            }

            len = 1 / len;
            dest[0] = x * len;
            dest[1] = y * len;
            dest[2] = z * len;
            return dest;
        },

        /**
         * Generates the cross product of two vec3s
         * @method cross
         * @param {kick.math.Vec3} vec first operand
         * @param {kick.math.Vec3} vec2 second operand
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        cross: function (vec, vec2, dest) {
            if (!dest) { dest = vec; }

            var x = vec[0], y = vec[1], z = vec[2],
                x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];

            dest[0] = y * z2 - z * y2;
            dest[1] = z * x2 - x * z2;
            dest[2] = x * y2 - y * x2;
            return dest;
        },

        /**
         * Calculates the length of a vec3
         * @method length
         * @param {kick.math.Vec3} vec vec3 to calculate length of
         * @return {Number} Length of vec
         * @static
         */
        length: function (vec) {
            var x = vec[0], y = vec[1], z = vec[2];
            return Math.sqrt(x * x + y * y + z * z);
        },

        /**
         * Calculates the squared length of a vec3
         * @method lengthSqr
         * @param {kick.math.Vec3} vec vec3 to calculate squared length of
         * @return {Number} Squared length of vec
         * @static
         */
        lengthSqr: function (vec) {
            var x = vec[0], y = vec[1], z = vec[2];
            return x * x + y * y + z * z;
        },

        /**
         * Calculates the dot product of two vec3s
         * @method dot
         * @param {kick.math.Vec3} vec first operand
         * @param {kick.math.Vec3} vec2 second operand
         * @return {Number} Dot product of vec and vec2
         * @static
         */
        dot: function (vec, vec2) {
            return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
        },

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
         * Performs a linear interpolation between two vec3
         * @method lerp
         * @param {kick.math.Vec3} vec first vector
         * @param {kick.math.Vec3} vec2 second vector
         * @param {Number} lerp interpolation amount between the two inputs
         * @param {kick.math.Vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {kick.math.Vec3} dest if specified, vec otherwise
         * @static
         */
        lerp: function (vec, vec2, lerp, dest) {
            if (!dest) { dest = vec; }

            dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
            dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
            dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);

            return dest;
        },

        /*
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

        /*
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

                mat4.multiply(proj, modelView, m);
                if (!mat4.inverse(m)) { return null; }

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

