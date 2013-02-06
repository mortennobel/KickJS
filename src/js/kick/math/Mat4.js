define(["./Vec4"], function (vec4) {
    "use strict";
    var epsilon = 0.000001,
        vec3length = function (vec) {
            var x = vec[0], y = vec[1], z = vec[2];
            return Math.sqrt(x * x + y * y + z * z);
        },
        mat4,
        quatNormalize = function (quat, dest) {
            if (!dest) { dest = quat; }

            var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
                len = Math.sqrt(x * x + y * y + z * z + w * w);
            if (len === 0) {
                dest[0] = 0;
                dest[1] = 0;
                dest[2] = 0;
                dest[3] = 0;
                return dest;
            }
            len = 1 / len;
            dest[0] = x * len;
            dest[1] = y * len;
            dest[2] = z * len;
            dest[3] = w * len;

            return dest;
        },
        quatSetFromRotationMatrix = function (out, mat) {
            var x, y, z, w,
                m00 = mat[0], m01 = mat[4], m02 = mat[8],
                m10 = mat[1], m11 = mat[5], m12 = mat[9],
                m20 = mat[2], m21 = mat[6], m22 = mat[10],
                absQ,
                quat = vec4;  // here vec4 are used to avoid circular dependency (Only 'constuctor' and 'set' methods are used)
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
            function copySign(a, b) {
                return b < 0 ? -Math.abs(a) : Math.abs(a);
            }
            absQ = Math.pow(mat4.determinant(mat), 1.0 / 3.0);
            w = Math.sqrt(Math.max(0, absQ + m00  + m11 + m22)) / 2;
            x = Math.sqrt(Math.max(0, absQ + m00  - m11 - m22)) / 2;
            y = Math.sqrt(Math.max(0, absQ - m00  + m11 - m22)) / 2;
            z = Math.sqrt(Math.max(0, absQ - m00  - m11 + m22)) / 2;
            x = copySign(x, (m21 - m12)); // m21 - m12
            y = copySign(y, (m02 - m20)); // m02 - m20
            z = copySign(z, (m10 - m01)); // m10 - m01
            quat.copy(out, [x, y, z, w]);
            quatNormalize(out);
            return out;
        };

    /**
     * mat4 - 4x4 Matrix<br>
     * Any javascript array containing at least 16 numeric elements can serve as a Mat4
     * @class Mat4
     * @namespace kick.math
     */
    mat4 = {
        /**
         * Creates a new identity Mat4 using the Float32Arrat<br>
         *
         * @method create
         * @return {kick.math.Mat4} New mat4
         * @static
         */
        create: function () {
            var out = new Float32Array(16);

            out[0] = 1;
            out[5] = 1;
            out[10] = 1;
            out[15] = 1;
            return out;
        },

        /**
         * Creates a new mat4 initialized with values from an existing matrix
         * @method clone
         * @param {kick.math.Mat4} a matrix to clone
         * @return {kick.math.Mat4} a new 4x4 matrix
         * @static
         */
        clone: function (a) {
            var out = new Float32Array(16);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        },

        /**
         * Copies the values of one mat4 to another
         * @method copy
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the source matrix
         * @return {kick.math.Mat4} out
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
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        },


        /**
         * Set translate, rotate, scale
         * @method setTRS
         * @param {kick.math.Mat4} dest
         * @param {kick.math.Vec3} translate
         * @param {kick.math.Quat} rotateQuat
         * @param {kick.math.Vec3} scale
         * @return {kick.math.Mat4} dest
         * @static
         */
        setTRS: function (out, translate, rotateQuat, scale) {
            // Quaternion math
            var scaleX = scale[0], scaleY = scale[1], scaleZ = scale[2],
                x = rotateQuat[0], y = rotateQuat[1], z = rotateQuat[2], w = rotateQuat[3],
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

            out[0] = (1 - (yy + zz)) * scaleX;
            out[1] = (xy + wz) * scaleX;
            out[2] = (xz - wy) * scaleX;
            out[3] = 0;
            out[4] = (xy - wz) * scaleY;
            out[5] = (1 - (xx + zz)) * scaleY;
            out[6] = (yz + wx) * scaleY;
            out[7] = 0;
            out[8] = (xz + wy) * scaleZ;
            out[9] = (yz - wx) * scaleZ;
            out[10] = (1 - (xx + yy)) * scaleZ;
            out[11] = 0;
            out[12] = translate[0];
            out[13] = translate[1];
            out[14] = translate[2];
            out[15] = 1;

            return out;
        },

        /**
         * Set the inverse of translate, rotate, scale
         * @method setTRSInverse
         * @param {kick.math.Mat4} out
         * @param {kick.math.Vec3} translate
         * @param {kick.math.Quat} rotateQuat must be normalized
         * @param {kick.math.Vec3} scale
         * @return {kick.math.Mat4} out
         * @static
         */
        setTRSInverse: function (out, translate, rotateQuat, scale) {
            // Quaternion math
            var scaleX = scale[0], scaleY = scale[1], scaleZ = scale[2],
                x = rotateQuat[0], y = rotateQuat[1], z = rotateQuat[2], w = rotateQuat[3],
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
                wz = w * z2,

            // compute trs
                a00 = (1 - (yy + zz)) * scaleX,
                a01 = (xy + wz) * scaleX,
                a02 = (xz - wy) * scaleX,
                a10 = (xy - wz) * scaleY,
                a11 = (1 - (xx + zz)) * scaleY,
                a12 = (yz + wx) * scaleY,
                a20 = (xz + wy) * scaleZ,
                a21 = (yz - wx) * scaleZ,
                a22 = (1 - (xx + yy)) * scaleZ,
                a30 = translate[0],
                a31 = translate[1],
                a32 = translate[2],
                a33 = 1,
            // compute inverse
                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b03 = a01 * a12 - a02 * a11,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33,
                b11 = a22 * a33,

                d = (b00 * b11 - b01 * b10 + b03 * b08),
                invDet;

            // Calculate the determinant
            if (!d) { return null; }
            invDet = 1 / d;

            out[0] = (a11 * b11 - a12 * b10) * invDet;
            out[1] = (-a01 * b11 + a02 * b10) * invDet;
            out[2] = (a33 * b03) * invDet;
            out[3] = 0;
            out[4] = (-a10 * b11 + a12 * b08) * invDet;
            out[5] = (a00 * b11 - a02 * b08) * invDet;
            out[6] = (-a33 * b01) * invDet;
            out[7] = 0;
            out[8] = (a10 * b10 - a11 * b08) * invDet;
            out[9] = (-a00 * b10 + a01 * b08) * invDet;
            out[10] = (a33 * b00) * invDet;
            out[11] = 0;
            out[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
            out[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

            return out;
        },

        /**
         * Sets a mat4 to an identity matrix
         * @method identity
         * @param {kick.math.Mat4} out mat4 to set
         * @return {kick.math.Mat4} out
         * @static
         */
        identity: function (out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        },

        /**
         * Transposes a mat4 (flips the values over the diagonal)
         * @method transpose
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the source matrix
         * @return {kick.math.Mat4} out
         * @static
         */
        transpose: function (out, a) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a01 = a[1], a02 = a[2], a03 = a[3],
                    a12 = a[6], a13 = a[7],
                    a23 = a[11];

                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a01;
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a02;
                out[9] = a12;
                out[11] = a[14];
                out[12] = a03;
                out[13] = a13;
                out[14] = a23;
            } else {
                out[0] = a[0];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a[1];
                out[5] = a[5];
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a[2];
                out[9] = a[6];
                out[10] = a[10];
                out[11] = a[14];
                out[12] = a[3];
                out[13] = a[7];
                out[14] = a[11];
                out[15] = a[15];
            }

            return out;
        },

        /**
         * Inverts a Mat4
         * @method invert
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the source matrix
         * @return {kick.math.Mat4} out
         * @static
         */
        invert: function (out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
                a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
                a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32,

            // Calculate the determinant
                det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

            if (!det) {
                return null;
            }
            det = 1.0 / det;

            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

            return out;
        },


        /**
         * Calculates the adjugate of a mat4
         *
         * @method adjoint
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the source matrix
         * @return {kick.math.Mat4} out
         * @static
         */
        adjoint: function (out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
                a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
                a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

            out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
            out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
            out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
            out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
            out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
            out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
            out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
            out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
            out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
            out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
            out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
            out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
            out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
            out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
            out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
            out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
            return out;
        },
        /**
         * Calculates the determinant of a mat4
         * @method determinant
         * @param {kick.math.Mat4} a mat4 to calculate determinant of
         * @return {Number} determinant of mat
         * @static
         */
        determinant: function (a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
                a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
                a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32;

            // Calculate the determinant
            return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        },

        /**
         * Performs a matrix multiplication
         * @method multiply
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the first operand
         * @param {kick.math.Mat4} b the second operand
         * @return {kick.math.Mat4} out
         * @static
         */
        multiply: function (out, a, b) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
                a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
                a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

            // Cache only the current line of the second matrix
                b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            return out;
        },

        /**
         * Translates a matrix by the given vector
         * @method translate
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the matrix to translate
         * @param {kick.math.Vec3} v vector to translate by
         * @return {kick.math.Mat4} out
         * @static
         */
        translate: function (out, a, v) {
            var x = v[0], y = v[1], z = v[2],
                a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23;

            if (a === out) {
                out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
            } else {
                a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
                a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
                a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

                out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
                out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
                out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

                out[12] = a00 * x + a10 * y + a20 * z + a[12];
                out[13] = a01 * x + a11 * y + a21 * z + a[13];
                out[14] = a02 * x + a12 * y + a22 * z + a[14];
                out[15] = a03 * x + a13 * y + a23 * z + a[15];
            }

            return out;
        },

        /**
         * Scales a matrix by the given vector
         * @method scale
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the matrix to scale
         * @param {kick.math.Vec3} v the vec3 to scale the matrix by
         * @return {kick.math.Mat4} out
         * @static
         */
        scale: function (out, a, v) {
            var x = v[0], y = v[1], z = v[2];

            out[0] = a[0] * x;
            out[1] = a[1] * x;
            out[2] = a[2] * x;
            out[3] = a[3] * x;
            out[4] = a[4] * y;
            out[5] = a[5] * y;
            out[6] = a[6] * y;
            out[7] = a[7] * y;
            out[8] = a[8] * z;
            out[9] = a[9] * z;
            out[10] = a[10] * z;
            out[11] = a[11] * z;
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        },

        /**
         * Rotates a matrix by the given angle around the specified axis<br>
         * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for
         * performance
         * @method rotate
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @param {kick.math.Vec3} axis the axis to rotate around
         * @return {kick.math.Mat4} out
         * @static
         */
        rotate: function (out, a, rad, axis) {
            var x = axis[0], y = axis[1], z = axis[2],
                len = Math.sqrt(x * x + y * y + z * z),
                s, c, t,
                a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23,
                b00, b01, b02,
                b10, b11, b12,
                b20, b21, b22;

            if (Math.abs(len) < epsilon) { return null; }

            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;

            s = Math.sin(rad);
            c = Math.cos(rad);
            t = 1 - c;

            a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
            a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
            a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

            // Construct the elements of the rotation matrix
            b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
            b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
            b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

            // Perform rotation-specific matrix multiplication
            out[0] = a00 * b00 + a10 * b01 + a20 * b02;
            out[1] = a01 * b00 + a11 * b01 + a21 * b02;
            out[2] = a02 * b00 + a12 * b01 + a22 * b02;
            out[3] = a03 * b00 + a13 * b01 + a23 * b02;
            out[4] = a00 * b10 + a10 * b11 + a20 * b12;
            out[5] = a01 * b10 + a11 * b11 + a21 * b12;
            out[6] = a02 * b10 + a12 * b11 + a22 * b12;
            out[7] = a03 * b10 + a13 * b11 + a23 * b12;
            out[8] = a00 * b20 + a10 * b21 + a20 * b22;
            out[9] = a01 * b20 + a11 * b21 + a21 * b22;
            out[10] = a02 * b20 + a12 * b21 + a22 * b22;
            out[11] = a03 * b20 + a13 * b21 + a23 * b22;

            if (a !== out) { // If the source and destination differ, copy the unchanged last row
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            return out;
        },
        /**
         * Rotates a matrix by the given angle around the X axis
         * @method rotateX
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @return {kick.math.Mat4} out
         * @static
         */
        rotateX: function (out, a, rad) {
            var s = Math.sin(rad),
                c = Math.cos(rad),
                a10 = a[4],
                a11 = a[5],
                a12 = a[6],
                a13 = a[7],
                a20 = a[8],
                a21 = a[9],
                a22 = a[10],
                a23 = a[11];

            if (a !== out) { // If the source and destination differ, copy the unchanged rows
                out[0]  = a[0];
                out[1]  = a[1];
                out[2]  = a[2];
                out[3]  = a[3];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }

            // Perform axis-specific matrix multiplication
            out[4] = a10 * c + a20 * s;
            out[5] = a11 * c + a21 * s;
            out[6] = a12 * c + a22 * s;
            out[7] = a13 * c + a23 * s;
            out[8] = a20 * c - a10 * s;
            out[9] = a21 * c - a11 * s;
            out[10] = a22 * c - a12 * s;
            out[11] = a23 * c - a13 * s;
            return out;
        },

        /**
         * Rotates a matrix by the given angle around the Y axis
         * @method rotateY
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @return {kick.math.Mat4} out
         * @static
         */
        rotateY: function (out, a, rad) {
            var s = Math.sin(rad),
                c = Math.cos(rad),
                a00 = a[0],
                a01 = a[1],
                a02 = a[2],
                a03 = a[3],
                a20 = a[8],
                a21 = a[9],
                a22 = a[10],
                a23 = a[11];

            if (a !== out) { // If the source and destination differ, copy the unchanged rows
                out[4]  = a[4];
                out[5]  = a[5];
                out[6]  = a[6];
                out[7]  = a[7];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }

            // Perform axis-specific matrix multiplication
            out[0] = a00 * c - a20 * s;
            out[1] = a01 * c - a21 * s;
            out[2] = a02 * c - a22 * s;
            out[3] = a03 * c - a23 * s;
            out[8] = a00 * s + a20 * c;
            out[9] = a01 * s + a21 * c;
            out[10] = a02 * s + a22 * c;
            out[11] = a03 * s + a23 * c;
            return out;
        },

        /**
         * Rotates a matrix by the given angle around the Z axis
         * @method rotateZ
         * @param {kick.math.Mat4} out the receiving matrix
         * @param {kick.math.Mat4} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @return {kick.math.Mat4} out
         * @static
         */
        rotateZ: function (out, a, rad) {
            var s = Math.sin(rad),
                c = Math.cos(rad),
                a00 = a[0],
                a01 = a[1],
                a02 = a[2],
                a03 = a[3],
                a10 = a[4],
                a11 = a[5],
                a12 = a[6],
                a13 = a[7];

            if (a !== out) { // If the source and destination differ, copy the unchanged last row
                out[8]  = a[8];
                out[9]  = a[9];
                out[10] = a[10];
                out[11] = a[11];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }

            // Perform axis-specific matrix multiplication
            out[0] = a00 * c + a10 * s;
            out[1] = a01 * c + a11 * s;
            out[2] = a02 * c + a12 * s;
            out[3] = a03 * c + a13 * s;
            out[4] = a10 * c - a00 * s;
            out[5] = a11 * c - a01 * s;
            out[6] = a12 * c - a02 * s;
            out[7] = a13 * c - a03 * s;
            return out;
        },
        /**
         * mat4.fromRotationTranslation
         * Creates a matrix from a quaternion rotation and vector translation
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.translate(dest, vec);
         *     var quatMat = mat4.create();
         *     quat.toMat4(quat, quatMat);
         *     mat4.multiply(dest, quatMat);
         *
         *
         * @method fromRotationTranslation
         * @param {kick.math.Mat4} out mat4 receiving operation result
         * @param {kick.math.Quat} q Rotation quaternion
         * @param {kick.math.Vec3} v Translation vector
         * @return {kick.math.Mat4} out
         * @static
         */
        fromRotationTranslation: function (out, q, v) {
            // Quaternion math
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
            out[3] = 0;
            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;
            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;

            return out;
        },


        /**
         * Calculates a 4x4 matrix from the given quaternion
         * @method fromQuat
         * @param {kick.math.Mat4} out mat4 receiving operation result
         * @param {kick.math.Quat} q Quaternion to create matrix from
         *
         * @return {kick.math.Mat4} out
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
            out[3] = 0;

            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;

            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;

            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;

            return out;
        },

        /**
         * Generates a frustum matrix with the given bounds
         * @method frustum
         * @param {kick.math.Mat4} out mat4 frustum matrix will be written into
         * @param {Number} left Left bound of the frustum
         * @param {Number} right Right bound of the frustum
         * @param {Number} bottom Bottom bound of the frustum
         * @param {Number} top Top bound of the frustum
         * @param {Number} near Near bound of the frustum
         * @param {Number} far Far bound of the frustum
         * @return {kick.math.Mat4} out
         * @static
         */
        frustum: function (out, left, right, bottom, top, near, far) {
            var rl = 1 / (right - left),
                tb = 1 / (top - bottom),
                nf = 1 / (near - far);
            out[0] = (near * 2) * rl;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = (near * 2) * tb;
            out[6] = 0;
            out[7] = 0;
            out[8] = (right + left) * rl;
            out[9] = (top + bottom) * tb;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = (far * near * 2) * nf;
            out[15] = 0;
            return out;
        },

        /**
         * Generates a perspective projection matrix with the given bounds
         * @method perspective
         * @param {kick.math.Mat4} out mat4 frustum matrix will be written into
         * @param {number} fovy Vertical field of view in radians
         * @param {number} aspect Aspect ratio. typically viewport width/height
         * @param {number} near Near bound of the frustum
         * @param {number} far Far bound of the frustum
         * @return {kick.math.Mat4} out
         * @static
         */
        perspective: function (out, fovy, aspect, near, far) {
            var f = 1.0 / Math.tan(fovy / 2),
                nf = 1 / (near - far);
            out[0] = f / aspect;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = (2 * far * near) * nf;
            out[15] = 0;
            return out;
        },

        /**
         * Generates a orthogonal projection matrix with the given bounds
         * @method ortho
         * @param {kick.math.Mat4} out mat4 frustum matrix will be written into
         * @param {number} left Left bound of the frustum
         * @param {number} right Right bound of the frustum
         * @param {number} bottom Bottom bound of the frustum
         * @param {number} top Top bound of the frustum
         * @param {number} near Near bound of the frustum
         * @param {number} far Far bound of the frustum
         * @return {kick.math.Mat4} out
         * @static
         */
        ortho: function (out, left, right, bottom, top, near, far) {
            var lr = 1 / (left - right),
                bt = 1 / (bottom - top),
                nf = 1 / (near - far);
            out[0] = -2 * lr;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = -2 * bt;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 2 * nf;
            out[11] = 0;
            out[12] = (left + right) * lr;
            out[13] = (top + bottom) * bt;
            out[14] = (far + near) * nf;
            out[15] = 1;
            return out;
        },

        /**
         * Generates a look-at matrix with the given eye position, focal point, and up axis
         * @method lookAt
         * @param {kick.math.Mat4} out mat4 frustum matrix will be written into
         * @param {kick.math.Vec3} eye Position of the viewer
         * @param {kick.math.Vec3} center Point the viewer is looking at
         * @param {kick.math.Vec3} up vec3 pointing up
         * @return {kick.math.Mat4} out
         * @static
         */
        lookAt: function (out, eye, center, up) {
            var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
                eyex = eye[0],
                eyey = eye[1],
                eyez = eye[2],
                upx = up[0],
                upy = up[1],
                upz = up[2],
                centerx = center[0],
                centery = center[1],
                centerz = center[2];

            if (Math.abs(eyex - centerx) < epsilon &&
                Math.abs(eyey - centery) < epsilon &&
                Math.abs(eyez - centerz) < epsilon) {
                return mat4.identity(out);
            }

            z0 = eyex - centerx;
            z1 = eyey - centery;
            z2 = eyez - centerz;

            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;

            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            } else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }

            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;

            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            } else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }

            out[0] = x0;
            out[1] = y0;
            out[2] = z0;
            out[3] = 0;
            out[4] = x1;
            out[5] = y1;
            out[6] = z1;
            out[7] = 0;
            out[8] = x2;
            out[9] = y2;
            out[10] = z2;
            out[11] = 0;
            out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
            out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
            out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
            out[15] = 1;

            return out;
        },

        /**
         * Copies the upper 3x3 elements of a mat4 into another mat4
         * @method toRotationMat
         * @param {kick.math.Mat4} out mat4 receiving copied values
         * @param {kick.math.Mat4} mat mat4 containing values to copy
         * @return {kick.math.Mat4} out
         * @static
         */
        toRotationMat: function (out, mat) {
            out[0] = mat[0];
            out[1] = mat[1];
            out[2] = mat[2];
            out[3] = mat[3];
            out[4] = mat[4];
            out[5] = mat[5];
            out[6] = mat[6];
            out[7] = mat[7];
            out[8] = mat[8];
            out[9] = mat[9];
            out[10] = mat[10];
            out[11] = mat[11];
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;

            return out;
        },

        /**
         * Copies the upper 3x3 elements of a mat4 into a mat3
         * @method toMat3
         * @param {kick.math.Mat3} out Optional, mat3 receiving copied values
         * @param {kick.math.Mat4} mat mat4 containing values to copy
         * @return {kick.math.Mat3} out
         * @static
         */
        toMat3: function (out, mat) {
            out[0] = mat[0];
            out[1] = mat[1];
            out[2] = mat[2];
            out[3] = mat[4];
            out[4] = mat[5];
            out[5] = mat[6];
            out[6] = mat[8];
            out[7] = mat[9];
            out[8] = mat[10];

            return out;
        },

        /**
         * Calculates the normal matrix (that is the transpose of the inverse of the upper 3x3 elements of a mat4) and
         * copies the result into a mat3<br>
         * @method toNormalMat3
         * @param {kick.math.Mat3} out mat3 receiving values
         * @param {kick.math.Mat4} mat mat4 containing values to transpose, invert and copy
         * @return {kick.math.Mat3} out
         * @static
         */
        toNormalMat3: function (out, mat) {
            // Cache the matrix values (makes for huge speed increases!)
            var a00 = mat[0], a01 = mat[1], a02 = mat[2],
                a10 = mat[4], a11 = mat[5], a12 = mat[6],
                a20 = mat[8], a21 = mat[9], a22 = mat[10],
                b01 = a22 * a11 - a12 * a21,
                b11 = -a22 * a10 + a12 * a20,
                b21 = a21 * a10 - a11 * a20,
                d = a00 * b01 + a01 * b11 + a02 * b21,
                id;
            if (!d) { return null; }
            id = 1 / d;


            out[0] = b01 * id;
            out[3] = (-a22 * a01 + a02 * a21) * id;
            out[6] = (a12 * a01 - a02 * a11) * id;

            out[1] = b11 * id;
            out[4] = (a22 * a00 - a02 * a20) * id;
            out[7] = (-a12 * a00 + a02 * a10) * id;

            out[2] = b21 * id;
            out[5] = (-a21 * a00 + a01 * a20) * id;
            out[8] = (a11 * a00 - a01 * a10) * id;

            return out;
        },

        /**
         * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3<br>
         * The resulting matrix is useful for calculating transformed normals
         * @method toInverseMat3
         * @param {kick.math.Mat4} mat mat4 containing values to invert and copy
         * @param {kick.math.Mat3} out mat3 receiving values
         * @return {kick.math.Mat3} out
         * @static
         */
        toInverseMat3: function (out, mat) {
            // Cache the matrix values (makes for huge speed increases!)
            var a00 = mat[0], a01 = mat[1], a02 = mat[2],
                a10 = mat[4], a11 = mat[5], a12 = mat[6],
                a20 = mat[8], a21 = mat[9], a22 = mat[10],

                b01 = a22 * a11 - a12 * a21,
                b11 = -a22 * a10 + a12 * a20,
                b21 = a21 * a10 - a11 * a20,

                d = a00 * b01 + a01 * b11 + a02 * b21,
                id;

            if (!d) { return null; }
            id = 1 / d;

            out[0] = b01 * id;
            out[1] = (-a22 * a01 + a02 * a21) * id;
            out[2] = (a12 * a01 - a02 * a11) * id;
            out[3] = b11 * id;
            out[4] = (a22 * a00 - a02 * a20) * id;
            out[5] = (-a12 * a00 + a02 * a10) * id;
            out[6] = b21 * id;
            out[7] = (-a21 * a00 + a01 * a20) * id;
            out[8] = (a11 * a00 - a01 * a10) * id;

            return out;
        },



        /**
         * Transforms a vec3 with the given matrix<br>
         * 4th vector component is implicitly '1'
         * @method multiplyVec3
         * @param {kick.math.Vec3} out vec3 receiving operation result.
         * @param {kick.math.Mat4} mat mat4 to transform the vector with
         * @param {kick.math.Vec3} vec vec3 to transform
         * @return {kick.math.Vec3} out
         * @static
         */
        multiplyVec3: function (out, mat, vec) {
            var x = vec[0], y = vec[1], z = vec[2];

            out[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
            out[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
            out[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

            return out;
        },

        /**
         * Transforms a vec3 with the given matrix<br>
         * 4th vector component is implicitly '0'
         * @method multiplyVec3Vector
         * @param {kick.math.Vec3} out vec3 receiving operation result.
         * @param {kick.math.Mat4} mat mat4 to transform the vector with
         * @param {kick.math.Vec3} vec vec3 to transform
         * @return {kick.math.Vec3} out
         * @static
         */
        multiplyVec3Vector: function (out, mat, vec) {
            var x = vec[0], y = vec[1], z = vec[2];

            out[0] = mat[0] * x + mat[4] * y + mat[8] * z;
            out[1] = mat[1] * x + mat[5] * y + mat[9] * z;
            out[2] = mat[2] * x + mat[6] * y + mat[10] * z;
            out[3] = mat[3] * x + mat[7] * y + mat[11] * z;

            return out;
        },

        /**
         * Transforms a vec4 with the given matrix
         * @method multiplyVec4
         * @param {kick.math.Vec4} out vec4 receiving operation result.
         * @param {kick.math.Mat4} mat mat4 to transform the vector with
         * @param {kick.math.Vec4} vec vec4 to transform
         * @return {kick.math.Vec4} out
         * @static
         */
        multiplyVec4: function (out, mat, vec) {
            var x = vec[0], y = vec[1], z = vec[2], w = vec[3];

            out[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
            out[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
            out[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
            out[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;

            return out;
        },

        /**
         * Returns array with translate, rotate scale
         * @method decompose
         * @param {kick.math.Mat4} mat mat4 to decompose
         * @param {kick.math.Vec3} translate
         * @param {kick.math.Quat} rotate
         * @param {kick.math.Vec3} scale
         * @return Array_tranlate_rotate_scale
         * @static
         */
        decompose: (function () {
            var copy = new Float32Array(16);
            return function (mat, tranlate, rotate, scale) {
                var x = [mat[0], mat[1], mat[2]],
                    y = [mat[4], mat[5], mat[6]],
                    z = [mat[8], mat[9], mat[10]],
                    scaleX,
                    scaleY,
                    scaleZ;

                tranlate[0] = mat[12];
                tranlate[1] = mat[13];
                tranlate[2] = mat[14];

                scale[0] = scaleX = vec3length(x);
                scale[1] = scaleY = vec3length(y);
                scale[2] = scaleZ = vec3length(z);

                this.copy(copy, mat);

                copy[0] /= scaleX;
                copy[1] /= scaleX;
                copy[2] /= scaleX;

                copy[4] /= scaleY;
                copy[5] /= scaleY;
                copy[6] /= scaleY;

                copy[8] /= scaleZ;
                copy[9] /= scaleZ;
                copy[10] /= scaleZ;


                quatSetFromRotationMatrix(rotate, copy);

                return [tranlate, rotate, scale];
            };
        }()),



        /**
         * Returns a string representation of a mat4
         * @method str
         * @param {kick.math.Mat4} mat mat4 to represent as a string
         * @return {String} string representation of mat
         * @static
         */
        str: function (mat) {
            return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] +
                ', ' + mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] +
                ', ' + mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] +
                ', ' + mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
        },

        /**
         * Returns a string representation of a mat4 printed as a 4x4 matrix (on 4 lines)
         * @method strPretty
         * @param {kick.math.Mat4} mat mat4 to represent as a string
         * @return {String} string representation of mat
         * @static
         */
        strPretty: function (mat) {
            return '[' + mat[0] + ', ' + mat[4] + ', ' + mat[8] + ', ' + mat[12] + '\n' +
                ', ' + mat[1] + ', ' + mat[5] + ', ' + mat[9] + ', ' + mat[13] + '\n' +
                ', ' + mat[2] + ', ' + mat[6] + ', ' + mat[10] + ', ' + mat[14] + '\n' +
                ', ' + mat[3] + ', ' + mat[7] + ', ' + mat[11] + ', ' + mat[15] + ']';
        }
    };
    return mat4;
});


