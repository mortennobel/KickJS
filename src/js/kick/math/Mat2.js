define([], function () {
    "use strict";

    /**
     * Mat2 - 2x2 Matrix
     * Any javascript array containing at least 4 numeric elements can serve as a mat2, however creating matrices
     * using Mat2 constructor functions will use Float32Array
     * @class Mat2
     * @namespace kick.math
     */
    return {
        /**
         * Creates a new instance of a mat2 using Float32Array<br>
         *
         * @method create
         * @return {kick.math.Mat2} New mat2
         * @static
         */
        create: function () {
            var out = new Float32Array(4);
            out[0] = 1;
            out[3] = 1;
            return out;
        },

        /**
         * Creates a new mat2 initialized with values from an existing matrix
         * @method clone
         * @param {kick.math.Mat2} a matrix to clone
         * @return {kick.math.Mat2} a new 2x2 matrix
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
         * Copies the values of one mat3 to another
         * @method copy
         * @param {kick.math.Mat2} out the receiving matrix
         * @param {kick.math.Mat2} a the source matrix
         * @return {kick.math.Mat2} out
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
         * Sets a Mat2 to the identity matrix
         * @method identity
         * @param {kick.math.Mat2} out the receiving matrix
         * @return {kick.math.Mat2} out
         * @static
         */
        identity: function (out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        },

        /**
         * Transposes a Mat2 (flips the values over the diagonal)
         * @method transpose
         * @param {kick.math.Mat2} out the receiving matrix
         * @param {kick.math.Mat2} a the source matrix
         * @return {kick.math.Mat2} out
         * @static
         */
        transpose: function (out, a) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a1 = a[1];
                out[1] = a[2];
                out[2] = a1;
            } else {
                out[0] = a[0];
                out[1] = a[2];
                out[2] = a[1];
                out[3] = a[3];
            }
            return out;
        },
        /**
         * Inverts a Mat2
         * @method invert
         * @param {kick.math.Mat2} out the receiving matrix
         * @param {kick.math.Mat2} a the source matrix
         * @return {kick.math.Mat2} out
         * @static
         */
        invert: function (out, a) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

                // Calculate the determinant
                det = a0 * a3 - a2 * a1;

            if (!det) {
                return null;
            }
            det = 1.0 / det;

            out[0] =  a3 * det;
            out[1] = -a1 * det;
            out[2] = -a2 * det;
            out[3] =  a0 * det;

            return out;
        },

        /**
         * Calculates the adjugate of a mat2
         * @method adjoint
         * @param {kick.math.Mat2} out the receiving matrix
         * @param {kick.math.Mat2} a the source matrix
         * @return {kick.math.Mat2} out
         * @static
         */
        adjoint: function (out, a) {
            // Caching this value is nessecary if out == a
            var a0 = a[0];
            out[0] =  a[3];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] =  a0;

            return out;
        },

        /**
         * Calculates the determinant of a Mat2
         * @method determinant
         * @param {kick.math.Mat2} a the source matrix
         * @return {Number} determinant of a
         * @static
         */
        determinant: function (a) {
            return a[0] * a[3] - a[2] * a[1];
        },

        /**
         * Multiplies two Mat2's
         * @method multiply
         * @param {kick.math.Mat2} out the receiving matrix
         * @param {kick.math.Mat2} a the first operand
         * @param {kick.math.Mat2} b the second operand
         * @return {kick.math.Mat2} out
         * @static
         */
        multiply: function (out, a, b) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
                b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            out[0] = a0 * b0 + a1 * b2;
            out[1] = a0 * b1 + a1 * b3;
            out[2] = a2 * b0 + a3 * b2;
            out[3] = a2 * b1 + a3 * b3;
            return out;
        },

        /**
         * Rotates a mat2 by the given angle
         * @method rotate
         * @param {kick.math.Mat2} out the receiving matrix
         * @param {kick.math.Mat2} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @return {kick.math.Mat2} out
         * @static
         */
        rotate: function (out, a, rad) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
                s = Math.sin(rad),
                c = Math.cos(rad);
            out[0] = a0 *  c + a1 * s;
            out[1] = a0 * -s + a1 * c;
            out[2] = a2 *  c + a3 * s;
            out[3] = a2 * -s + a3 * c;
            return out;
        },

        /**
         * Scales the mat2 by the dimensions in the given vec2
         * @method scale
         * @param {kick.math.Mat2} out the receiving matrix
         * @param {kick.math.Mat2} a the matrix to rotate
         * @param {kick.math.Vec2} v the vec2 to scale the matrix by
         * @return {kick.math.Mat2} out
         * @static
         **/
        scale: function (out, a, v) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
                v0 = v[0], v1 = v[1];
            out[0] = a0 * v0;
            out[1] = a1 * v1;
            out[2] = a2 * v0;
            out[3] = a3 * v1;
            return out;
        },

        /**
         * Returns a string representation of a Mat2
         * @method str
         * @param {kick.math.Mat2} a matrix to represent as a string
         * @return {String} string representation of the matrix
         * @static
         */
        str: function (a) {
            return '[' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ']';
        },

        /**
         * Returns a string representation of a Mat2 printed as a 2x2 matrix (on 2 lines)
         * @method strPretty
         * @param {kick.math.Mat2} mat mat2 to represent as a string
         * @return {String} string representation of mat
         * @static
         */
        strPretty: function (mat) {
            return '[' + mat[0] + ', ' + mat[2] + '\n' +
                ', ' + mat[1] + ', ' + mat[3] + ']';
        }
    };
});