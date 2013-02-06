define([], function () {
    "use strict";

    /**
     * Mat3 - 3x3 Matrix
     * @class Mat3
     * @namespace kick.math
     */
    return {
        /**
         * Creates a new identity Mat3 using the default array type<br>
         * Any javascript array containing at least 9 numeric elements can serve as a mat3
         * @method create
         * @return {kick.math.Mat3} New mat3
         * @static
         */
        create: function () {
            var out = new Float32Array(9);

            out[0] = 1;
            out[4] = 1;
            out[8] = 1;
            return out;
        },

        /**
         * Creates a new mat3 initialized with values from an existing matrix
         * @method clone
         * @param {kick.math.Mat3} a matrix to clone
         * @return {kick.math.Mat3} a new 3x3 matrix
         * @static
         */
        clone: function (a) {
            var out = new Float32Array(9);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        },

        /**
         * Copies the values of one mat3 to another
         * @method copy
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the source matrix
         * @return {kick.math.Mat3} out
         * @static
         */
        copy: function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        },

        /**
         * Sets a mat3 to an identity matrix
         * @method identity
         * @param {kick.math.Mat3} out mat3 to set
         * @return {kick.math.Mat3} dest
         * @static
         */
        identity: function (out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        },

        /**
         * Transposes a mat3 (flips the values over the diagonal)
         * @method transpose
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the source matrix
         * @return {kick.math.Mat3} out
         * @static
         */
        transpose: function (out, a) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a01 = a[1], a02 = a[2], a12 = a[5];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a01;
                out[5] = a[7];
                out[6] = a02;
                out[7] = a12;
            } else {
                out[0] = a[0];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a[1];
                out[4] = a[4];
                out[5] = a[7];
                out[6] = a[2];
                out[7] = a[5];
                out[8] = a[8];
            }

            return out;
        },

        /**
         * Inverts a Mat3
         * @method invert
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the source matrix
         * @return {kick.math.Mat3} out
         * @static
         */
        invert: function (out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2],
                a10 = a[3], a11 = a[4], a12 = a[5],
                a20 = a[6], a21 = a[7], a22 = a[8],

                b01 = a22 * a11 - a12 * a21,
                b11 = -a22 * a10 + a12 * a20,
                b21 = a21 * a10 - a11 * a20,

            // Calculate the determinant
                det = a00 * b01 + a01 * b11 + a02 * b21;

            if (!det) {
                return null;
            }
            det = 1.0 / det;

            out[0] = b01 * det;
            out[1] = (-a22 * a01 + a02 * a21) * det;
            out[2] = (a12 * a01 - a02 * a11) * det;
            out[3] = b11 * det;
            out[4] = (a22 * a00 - a02 * a20) * det;
            out[5] = (-a12 * a00 + a02 * a10) * det;
            out[6] = b21 * det;
            out[7] = (-a21 * a00 + a01 * a20) * det;
            out[8] = (a11 * a00 - a01 * a10) * det;
            return out;
        },
        /**
         * Calculates the adjugate of a mat3
         * @method adjoint
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the source matrix
         * @return {kick.math.Mat3} out
         * @static
         */
        adjoint: function (out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2],
                a10 = a[3], a11 = a[4], a12 = a[5],
                a20 = a[6], a21 = a[7], a22 = a[8];

            out[0] = (a11 * a22 - a12 * a21);
            out[1] = (a02 * a21 - a01 * a22);
            out[2] = (a01 * a12 - a02 * a11);
            out[3] = (a12 * a20 - a10 * a22);
            out[4] = (a00 * a22 - a02 * a20);
            out[5] = (a02 * a10 - a00 * a12);
            out[6] = (a10 * a21 - a11 * a20);
            out[7] = (a01 * a20 - a00 * a21);
            out[8] = (a00 * a11 - a01 * a10);
            return out;
        },

        /**
         * Calculates the determinant of a Mat3
         * @method determinant
         * @param {kick.math.Mat3} a the source matrix
         * @return {Number} determinant of a matrix
         * @static
         */
        determinant: function (a) {
            var a00 = a[0], a01 = a[1], a02 = a[2],
                a10 = a[3], a11 = a[4], a12 = a[5],
                a20 = a[6], a21 = a[7], a22 = a[8];

            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        },

        /**
         * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
         * @method toMat4
         * @param {kick.math.Mat4} out  mat4 receiving copied values
         * @param {kick.math.Mat3} mat mat3 containing values to copy
         * @return {kick.math.Mat4} out
         * @static
         */
        toMat4: function (out, mat) {
            out[15] = 1;
            out[14] = 0;
            out[13] = 0;
            out[12] = 0;

            out[11] = 0;
            out[10] = mat[8];
            out[9] = mat[7];
            out[8] = mat[6];

            out[7] = 0;
            out[6] = mat[5];
            out[5] = mat[4];
            out[4] = mat[3];

            out[3] = 0;
            out[2] = mat[2];
            out[1] = mat[1];
            out[0] = mat[0];

            return out;
        },

        /**
         * Multiplies two mat3's
         * @method multiply
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the first operand
         * @param {kick.math.Mat3} b the second operand
         * @return {kick.math.Mat3} out
         * @static
         */
        multiply: function (out, a, b) {
            var a00 = a[0], a01 = a[1], a02 = a[2],
                a10 = a[3], a11 = a[4], a12 = a[5],
                a20 = a[6], a21 = a[7], a22 = a[8],

                b00 = b[0], b01 = b[1], b02 = b[2],
                b10 = b[3], b11 = b[4], b12 = b[5],
                b20 = b[6], b21 = b[7], b22 = b[8];

            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b00 * a02 + b01 * a12 + b02 * a22;

            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b10 * a02 + b11 * a12 + b12 * a22;

            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return out;
        },

        /**
         * Translate a mat3 by the given vector
         * @method translate
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the matrix to translate
         * @param {kick.math.Vec2} v vector to translate by
         * @return {kick.math.Mat3} out
         * @static
         */
        translate: function(out, a, v) {
            var a00 = a[0], a01 = a[1], a02 = a[2],
                a10 = a[3], a11 = a[4], a12 = a[5],
                a20 = a[6], a21 = a[7], a22 = a[8],
                x = v[0], y = v[1];

            out[0] = a00;
            out[1] = a01;
            out[2] = a02;

            out[3] = a10;
            out[4] = a11;
            out[5] = a12;

            out[6] = x * a00 + y * a10 + a20;
            out[7] = x * a01 + y * a11 + a21;
            out[8] = x * a02 + y * a12 + a22;
            return out;
        },

        /**
         * Rotates a mat3 by the given angle
         * @method rotate
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @return {kick.math.Mat3} out
         * @static
         */
        rotate: function (out, a, rad) {
            var a00 = a[0], a01 = a[1], a02 = a[2],
                a10 = a[3], a11 = a[4], a12 = a[5],
                a20 = a[6], a21 = a[7], a22 = a[8],

                s = Math.sin(rad),
                c = Math.cos(rad);

            out[0] = c * a00 + s * a10;
            out[1] = c * a01 + s * a11;
            out[2] = c * a02 + s * a12;

            out[3] = c * a10 - s * a00;
            out[4] = c * a11 - s * a01;
            out[5] = c * a12 - s * a02;

            out[6] = a20;
            out[7] = a21;
            out[8] = a22;
            return out;
        },

        /**
         * Scales the mat3 by the dimensions in the given vec2
         * @method scale
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the matrix to rotate
         * @param {kick.math.Vec2} v the vec2 to scale the matrix by
         * @return {kick.math.Mat3} out
         * @static
         **/
        scale: function(out, a, v) {
            var x = v[0], y = v[2];

            out[0] = x * a[0];
            out[1] = x * a[1];
            out[2] = x * a[2];

            out[3] = y * a[3];
            out[4] = y * a[4];
            out[5] = y * a[5];

            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        },

        /**
         * Copies the values from a mat2d into a mat3
         * @method fromMat2d
         * @param {kick.math.Mat3} out the receiving matrix
         * @param {kick.math.Mat3} a the matrix to rotate
         * @return {kick.math.Mat3} out
         * @static
         **/
        fromMat2d: function(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = 0;

            out[3] = a[2];
            out[4] = a[3];
            out[5] = 0;

            out[6] = a[4];
            out[7] = a[5];
            out[8] = 1;
            return out;
        },

        /**
        * Calculates a 3x3 matrix from the given quaternion
        * @method fromQuat
        * @param {kick.math.Mat3} out mat3 receiving operation result
        * @param {kick.math.Quat} q Quaternion to create matrix from
        *
        * @return {kick.math.Mat3} out
        * @static
        */
        fromQuat: function (out, q) {
            var x = q[0], y = q[1], z = q[2], w = q[3],
                x2 = x + x,
                y2 = y + y,
                z2 = z + z,

                xx = x * x2,
                xy = x * y2,
                xz = x * z2,
                yy = y * y2,
                yz = y * z2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2;

            out[0] = 1 - (yy + zz);
            out[1] = xy + wz;
            out[2] = xz - wy;

            out[3] = xy - wz;
            out[4] = 1 - (xx + zz);
            out[5] = yz + wx;

            out[6] = xz + wy;
            out[7] = yz - wx;
            out[8] = 1 - (xx + yy);

            return out;
        },


        /**
         * Transform a mat3 into a rotation (quaternion).
         * @method toQuat
         * @param {kick.math.Quat} out
         * @param {kick.math.Mat3} mat
         * @return {kick.math.Quat}
         * @static
         */
        toQuat: function (out, mat) {
            // Code based on http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
            var m00 = mat[0], m10 = mat[1], m20 = mat[2],
                m01 = mat[3], m11 = mat[4], m21 = mat[5],
                m02 = mat[6], m12 = mat[7], m22 = mat[8],
                trace = m00 + m11 + m22,  // trace of matrix
                s;

            if (!out) {
                out = new Float32Array(4);
            }
            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                out[0] = (m21 - m12) * s;
                out[1] = (m02 - m20) * s;
                out[2] = (m10 - m01) * s;
                out[3] = 0.25 / s;
            } else {
                if (m00 > m11 && m00 > m22) {
                    s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
                    out[0] = 0.25 * s;
                    out[1] = (m01 + m10) / s;
                    out[2] = (m02 + m20) / s;
                    out[3] = (m21 - m12) / s;
                } else if (m11 > m22) {
                    s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
                    out[0] = (m01 + m10) / s;
                    out[1] = 0.25 * s;
                    out[2] = (m12 + m21) / s;
                    out[3] = (m02 - m20) / s;
                } else {
                    s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
                    out[0] = (m02 + m20) / s;
                    out[1] = (m12 + m21) / s;
                    out[2] = 0.25 * s;
                    out[3] = (m10 - m01) / s;
                }
            }
            return out;
        },

        /**
         * Returns a string representation of a mat3
         * @method str
         * @param {kick.math.Mat3} mat mat3 to represent as a string
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
         * @param {kick.math.Mat3} mat mat3 to represent as a string
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