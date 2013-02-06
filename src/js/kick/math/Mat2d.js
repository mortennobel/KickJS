define([], function () {
    "use strict";

    /**
     * Mat2 - 2x3 Matrix
     * A mat2d contains six elements defined as:
     * <pre>
     * [a, b,
     *  c, d,
     *  tx,ty]
     * </pre>
     * This is a short form for the 3x3 matrix:
     * <pre>
     * [a, b, 0
     *  c, d, 0
     *  tx,ty,1]
     * </pre>
     * The last column is ignored so the array is shorter and operations are faster.
     * @class Mat2d
     * @namespace kick.math
     */
    return {
        /**
         * Creates a new identity mat2d
         *
         * @method create
         * @return {kick.math.Mat2d} New mat2d
         * @static
         */
        create: function () {
            var out = new Float32Array(6);
            out[0] = 1;
            out[3] = 1;
            return out;
        },

        /**
         * Creates a new mat2d initialized with values from an existing matrix
         * @method clone
         * @param {kick.math.Mat2d} a matrix to clone
         * @return {kick.math.Mat2d} a new 2x3 matrix
         * @static
         */
        clone: function (a) {
            var out = new Float32Array(6);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];

            return out;
        },

        /**
         * Copy the values from one mat2d to another
         * @method copy
         * @param {kick.math.Mat2d} out the receiving matrix
         * @param {kick.math.Mat2d} a the source matrix
         * @return {kick.math.Mat2d} out
         * @static
         */
        copy: function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            return out;
        },

        /**
         * Sets a Mat2d to the identity matrix
         * @method identity
         * @param {kick.math.Mat2d} out the receiving matrix
         * @return {kick.math.Mat2d} out
         * @static
         */
        identity: function (out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = 0;
            out[5] = 0;
            return out;
        },

        /**
         * Inverts a Mat2d
         * @method invert
         * @param {kick.math.Mat2d} out the receiving matrix
         * @param {kick.math.Mat2d} a the source matrix
         * @return {kick.math.Mat2d} out
         * @static
         */
        invert: function (out, a) {
            var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
                atx = a[4], aty = a[5];

            var det = aa * ad - ab * ac;
            if(!det){
                return null;
            }
            det = 1.0 / det;

            out[0] = ad * det;
            out[1] = -ab * det;
            out[2] = -ac * det;
            out[3] = aa * det;
            out[4] = (ac * aty - ad * atx) * det;
            out[5] = (ab * atx - aa * aty) * det;
            return out;
        },

        /**
         * Calculates the determinant of a Mat2d
         * @method determinant
         * @param {kick.math.Mat2d} a the source matrix
         * @return {Number} determinant of a
         * @static
         */
        determinant: function (a) {
            return a[0] * a[3] - a[1] * a[2];
        },

        /**
         * Multiplies two Mat2d's
         * @method multiply
         * @param {kick.math.Mat2d} out the receiving matrix
         * @param {kick.math.Mat2d} a the first operand
         * @param {kick.math.Mat2d} b the second operand
         * @return {kick.math.Mat2d} out
         * @static
         */
        multiply: function (out, a, b) {
            var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
                atx = a[4], aty = a[5],
                ba = b[0], bb = b[1], bc = b[2], bd = b[3],
                btx = b[4], bty = b[5];

            out[0] = aa*ba + ab*bc;
            out[1] = aa*bb + ab*bd;
            out[2] = ac*ba + ad*bc;
            out[3] = ac*bb + ad*bd;
            out[4] = ba*atx + bc*aty + btx;
            out[5] = bb*atx + bd*aty + bty;
            return out;
        },

        /**
         * Rotates a mat2d by the given angle
         * @method rotate
         * @param {kick.math.Mat2d} out the receiving matrix
         * @param {kick.math.Mat2d} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @return {kick.math.Mat2d} out
         * @static
         */
        rotate: function (out, a, rad) {
            var aa = a[0],
                ab = a[1],
                ac = a[2],
                ad = a[3],
                atx = a[4],
                aty = a[5],
                st = Math.sin(rad),
                ct = Math.cos(rad);

            out[0] = aa*ct + ab*st;
            out[1] = -aa*st + ab*ct;
            out[2] = ac*ct + ad*st;
            out[3] = -ac*st + ct*ad;
            out[4] = ct*atx + st*aty;
            out[5] = ct*aty - st*atx;
            return out;
        },

        /**
         * Scales the mat2d by the dimensions in the given vec2
         * @method scale
         * @param {kick.math.Mat2d} out the receiving matrix
         * @param {kick.math.Mat2d} a the matrix to rotate
         * @param {kick.math.Vec2} v the vec2 to scale the matrix by
         * @return {kick.math.Mat2d} out
         * @static
         **/
        scale: function (out, a, v) {
            var vx = v[0], vy = v[1];
            out[0] = a[0] * vx;
            out[1] = a[1] * vy;
            out[2] = a[2] * vx;
            out[3] = a[3] * vy;
            out[4] = a[4] * vx;
            out[5] = a[5] * vy;
            return out;
        },

        /**
         * Translates the mat2d by the dimensions in the given vec2
         *
         * @method translate
         * @param {kick.math.Mat2d} out the receiving matrix
         * @param {kick.math.Mat2d} a the matrix to translate
         * @param {kick.math.Vec2} v the vec2 to translate the matrix by
         * @return {kick.math.Mat2d} out
         * @static
         */
        translate: function (out, a, v){
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4] + v[0];
            out[5] = a[5] + v[1];
            return out;
        },

        /**
         * Returns a string representation of a Mat2d
         * @method str
         * @param {kick.math.Mat2d} a matrix to represent as a string
         * @return {String} string representation of the matrix
         * @static
         */
        str: function (a) {
            return '[' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
                                a[3] + ', ' + a[4] + ', ' + a[5] + ']';
        },

        /**
         * Returns a string representation of a Mat2d printed as a 3x3 matrix (on 3 lines)
         * @method strPretty
         * @param {kick.math.Mat2d} mat mat2d to represent as a string
         * @return {String} string representation of mat
         * @static
         */
        strPretty: function (mat) {
            return '[' + mat[0] + ', ' + mat[1] + ', 0\n' +
                ', ' + mat[2] + ', ' + mat[3] + ', 0\n'+
                ', ' + mat[4] + ', ' + mat[5] + ', 1]';
        }
    };
});