define([], function () {
    "use strict";

    /**
     * Mat3 - 3x3 Matrix
     * @class Mat3
     * @namespace kick.math
     */
    return {
        /**
         * Creates a new instance of a mat3 using the default array type<br>
         * Any javascript array containing at least 9 numeric elements can serve as a mat3
         * @method create
         * @param {Array_Number} mat Optional, mat3 containing values to initialize with
         * @return {kick.math.mat3} New mat3
         * @static
         */
        create: function (mat) {
            var dest = new Float32Array(9);

            if (mat) {
                dest[0] = mat[0];
                dest[1] = mat[1];
                dest[2] = mat[2];
                dest[3] = mat[3];
                dest[4] = mat[4];
                dest[5] = mat[5];
                dest[6] = mat[6];
                dest[7] = mat[7];
                dest[8] = mat[8];
            }

            return dest;
        },

        /**
         * Copies the values of one mat3 to another
         * @method set
         * @param {kick.math.mat3} mat mat3 containing values to copy
         * @param {kick.math.mat3} dest mat3 receiving copied values
         * @return {kick.math.mat3} dest
         * @static
         */
        set: function (mat, dest) {
            dest[0] = mat[0];
            dest[1] = mat[1];
            dest[2] = mat[2];
            dest[3] = mat[3];
            dest[4] = mat[4];
            dest[5] = mat[5];
            dest[6] = mat[6];
            dest[7] = mat[7];
            dest[8] = mat[8];
            return dest;
        },

        /**
         * Sets a mat3 to an identity matrix
         * @method identity
         * @param {kick.math.mat3} dest mat3 to set
         * @return {kick.math.mat3} dest
         * @static
         */
        identity: function (dest) {
            if (!dest) { dest = new Float32Array(9); }
            dest[0] = 1;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            dest[4] = 1;
            dest[5] = 0;
            dest[6] = 0;
            dest[7] = 0;
            dest[8] = 1;
            return dest;
        },

        /**
         * Transposes a mat3 (flips the values over the diagonal)
         * @method transpose
         * @param {kick.math.mat3} mat mat3 to transpose
         * @param {kick.math.mat3} dest Optional, mat3 receiving transposed values. If not specified result is written to mat
         * @return {kick.math.mat3} dest is specified, mat otherwise
         * @static
         */
        transpose: function (mat, dest) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (!dest || mat === dest) {
                var a01 = mat[1], a02 = mat[2],
                    a12 = mat[5];

                mat[1] = mat[3];
                mat[2] = mat[6];
                mat[3] = a01;
                mat[5] = mat[7];
                mat[6] = a02;
                mat[7] = a12;
                return mat;
            }

            dest[0] = mat[0];
            dest[1] = mat[3];
            dest[2] = mat[6];
            dest[3] = mat[1];
            dest[4] = mat[4];
            dest[5] = mat[7];
            dest[6] = mat[2];
            dest[7] = mat[5];
            dest[8] = mat[8];
            return dest;
        },

        /**
         * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
         * @method toMat4
         * @param {kick.math.mat3} mat mat3 containing values to copy
         * @param {kick.math.mat4} dest Optional, mat4 receiving copied values
         * @return {kick.math.mat4} dest if specified, a new mat4 otherwise
         * @static
         */
        toMat4: function (mat, dest) {
            if (!dest) { dest = new Float32Array(9); }

            dest[15] = 1;
            dest[14] = 0;
            dest[13] = 0;
            dest[12] = 0;

            dest[11] = 0;
            dest[10] = mat[8];
            dest[9] = mat[7];
            dest[8] = mat[6];

            dest[7] = 0;
            dest[6] = mat[5];
            dest[5] = mat[4];
            dest[4] = mat[3];

            dest[3] = 0;
            dest[2] = mat[2];
            dest[1] = mat[1];
            dest[0] = mat[0];

            return dest;
        },

        /**
         * Transform a mat3 into a rotation (quaternion).
         * @param {kick.math.mat3} mat
         * @param {kick.math.quat4} dest
         * @return {kick.math.quat4}
         * @static
         */
        toQuat: function (mat, dest) {
            // Code based on http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
            var m00 = mat[0], m10 = mat[1], m20 = mat[2],
                m01 = mat[3], m11 = mat[4], m21 = mat[5],
                m02 = mat[6], m12 = mat[7], m22 = mat[8],
                trace = m00 + m11 + m22,  // trace of matrix
                s;

            if (!dest) {
                dest = new Float32Array(4);
            }
            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                dest[0] = (m21 - m12) * s;
                dest[1] = (m02 - m20) * s;
                dest[2] = (m10 - m01) * s;
                dest[3] = 0.25 / s;
            } else {
                if (m00 > m11 && m00 > m22) {
                    s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
                    dest[0] = 0.25 * s;
                    dest[1] = (m01 + m10) / s;
                    dest[2] = (m02 + m20) / s;
                    dest[3] = (m21 - m12) / s;
                } else if (m11 > m22) {
                    s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
                    dest[0] = (m01 + m10) / s;
                    dest[1] = 0.25 * s;
                    dest[2] = (m12 + m21) / s;
                    dest[3] = (m02 - m20) / s;
                } else {
                    s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
                    dest[0] = (m02 + m20) / s;
                    dest[1] = (m12 + m21) / s;
                    dest[2] = 0.25 * s;
                    dest[3] = (m10 - m01) / s;
                }
            }
            return dest;
        },

        /**
         * Returns a string representation of a mat3
         * @method str
         * @param {kick.math.mat3} mat mat3 to represent as a string
         * @return {String} string representation of mat
         * @static
         */
        str: function (mat) {
            return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] +
                ', ' + mat[3] + ', ' + mat[4] + ', ' + mat[5] +
                ', ' + mat[6] + ', ' + mat[7] + ', ' + mat[8] + ']';
        },

        /**
         * Returns a string representation of a mat3 printed as a 4x4 matrix (on 3 lines)
         * @method strPretty
         * @param {kick.math.mat3} mat mat3 to represent as a string
         * @return {String} string representation of mat
         * @static
         */
        strPretty: function (mat) {
            return '[' + mat[0] + ', ' + mat[3] + ', ' + mat[6] + '\n' +
                ', ' + mat[1] + ', ' + mat[4] + ', ' + mat[7] + '\n' +
                ', ' + mat[2] + ', ' + mat[5] + ', ' + mat[8] + ']';
        }
    };
});