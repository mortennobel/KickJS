define(["kick/core/Constants", "./Vec3", "./Vec4", "./Mat3", "./Mat4"], function (constants, vec3, vec4, mat3, mat4) {
    "use strict";

    /**
     * Quat - Quaternions
     * @class Quat
     * @namespace kick.math
     */
    return {
        /**
         * Creates a new identity quat
         *
         * @method create
         * @return {kick.math.Quat} New quat
         * @static
         */
        create: function () {
            var out = new Float32Array(4);
            out[3] = 1;
            return out;
        },

        /**
         * Creates a new quat initialized with values from an existing quaternion
         * @method clone
         * @param {kick.math.Quat} a quaternion to clone
         * @return {kick.math.Quat} a new quaternion
         * @static
         */
        clone: vec4.clone,

        /**
         * Creates a new quat initialized with the given values
         * @method fromValues
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @return {kick.math.Quat} a new quaternion
         * @static
         */
        fromValues: vec4.fromValues,

        /**
         * Copy the values from one quat to another
         *
         * @method copy
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a the source quaternion
         * @return {kick.math.Quat} out
         * @static
         */
        copy: vec4.copy,

        /**
         * Set the components of a quat to the given values
         *
         * @method set
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @return {kick.math.Quat} out
         * @static
         */
        set: vec4.set,

        /**
         * Set a quat to the identity quaternion (0,0,0,1)
         * @method identity
         * @param {kick.math.Quat} out quat to set the identity to
         * @return {kick.math.Quat} out
         * @static
         */
        identity: function (out) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        },

        /**
         * Sets a quat from the given angle and rotation axis,
         * then returns it.
         * @method setAxisAngle
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Vec3} axis the axis around which to rotate
         * @param {Number} rad the angle in radians
         * @return {kick.math.Quat} out
         * @static
         */
        setAxisAngle: function (out, axis, rad) {
            rad = rad * 0.5;
            var s = Math.sin(rad);
            out[0] = s * axis[0];
            out[1] = s * axis[1];
            out[2] = s * axis[2];
            out[3] = Math.cos(rad);
            return out;
        },

        /**
         * Adds two quat's
         *
         * @method add
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a the first operand
         * @param {kick.math.Quat} b the second operand
         * @return {kick.math.Quat} out
         * @static
         */
        add: vec4.add,

        /**
         * Multiplies two quat's
         *
         * @method multiply
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a the first operand
         * @param {kick.math.Quat} b the second operand
         * @return {kick.math.Quat} out
         * @static
         */
        multiply: function (out, a, b) {
            var ax = a[0], ay = a[1], az = a[2], aw = a[3],
                bx = b[0], by = b[1], bz = b[2], bw = b[3];

            out[0] = ax * bw + aw * bx + ay * bz - az * by;
            out[1] = ay * bw + aw * by + az * bx - ax * bz;
            out[2] = az * bw + aw * bz + ax * by - ay * bx;
            out[3] = aw * bw - ax * bx - ay * by - az * bz;
            return out;
        },

        /**
         * Scales a quat by a scalar number
         *
         * @method scale
         * @param {kick.math.Quat} out the receiving vector
         * @param {kick.math.Quat} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @return {kick.math.Quat} out
         * @static
         */
        scale: vec4.scale,

        /**
         * Rotates a quaternion by the given angle around the X axis
         *
         * @method rotateX
         * @param {kick.math.Quat} out quat receiving operation result
         * @param {kick.math.Quat} a quat to rotate
         * @param {Number} rad angle (in radians) to rotate
         * @return {kick.math.Quat} out
         * @static
         */
        rotateX: function (out, a, rad) {
            rad *= 0.5;

            var ax = a[0], ay = a[1], az = a[2], aw = a[3],
                bx = Math.sin(rad), bw = Math.cos(rad);

            out[0] = ax * bw + aw * bx;
            out[1] = ay * bw + az * bx;
            out[2] = az * bw - ay * bx;
            out[3] = aw * bw - ax * bx;
            return out;
        },

        /**
         * Rotates a quaternion by the given angle around the Y axis
         *
         * @method rotateY
         * @param {kick.math.Quat} out quat receiving operation result
         * @param {kick.math.Quat} a quat to rotate
         * @param {Number} rad angle (in radians) to rotate
         * @return {kick.math.Quat} out
         * @static
         */
        rotateY: function (out, a, rad) {
            rad *= 0.5;

            var ax = a[0], ay = a[1], az = a[2], aw = a[3],
                by = Math.sin(rad), bw = Math.cos(rad);

            out[0] = ax * bw - az * by;
            out[1] = ay * bw + aw * by;
            out[2] = az * bw + ax * by;
            out[3] = aw * bw - ay * by;
            return out;
        },

        /**
         * Rotates a quaternion by the given angle around the Z axis
         *
         * @method rotateZ
         * @param {kick.math.Quat} out quat receiving operation result
         * @param {kick.math.Quat} a quat to rotate
         * @param {Number} rad angle (in radians) to rotate
         * @return {kick.math.Quat} out
         * @static
         */
        rotateZ : function (out, a, rad) {
            rad *= 0.5;

            var ax = a[0], ay = a[1], az = a[2], aw = a[3],
                bz = Math.sin(rad), bw = Math.cos(rad);

            out[0] = ax * bw + ay * bz;
            out[1] = ay * bw - ax * bz;
            out[2] = az * bw + aw * bz;
            out[3] = aw * bw - az * bz;
            return out;
        },

        /**
         * Calculates the W component of a quat from the X, Y, and Z components.
         * Assumes that quaternion is 1 unit in length.
         * Any existing W component will be ignored.
         * @method calculateW
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a quat to calculate W component of
         * @return {kick.math.Quat} out
         * @static
         */
        calculateW: function (out, a) {
            var x = a[0], y = a[1], z = a[2];

            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
            return out;
        },

        /**
         * Returns dot product of q1 and q1
         * @method dot
         * @param {kick.math.Quat} q1
         * @param {kick.math.Quat} q2
         * @return {Number}
         * @static
         */
        dot: vec4.dot,

        /**
         * Performs a linear interpolation between two quat's
         * @method lerp
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a the first operand
         * @param {kick.math.Quat} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @return {kick.math.Quat} out
         * @static
         */
        lerp: vec4.lerp,

        /**
         * Performs a spherical linear interpolation between two quat
         * @method slerp
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a the first operand
         * @param {kick.math.Quat} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @return {kick.math.Quat} out
         * @static
         */
        slerp: function (out, a, b, t) {
            var ax = a[0], ay = a[1], az = a[2], aw = a[3],
                bx = b[0], by = b[1], bz = b[2], bw = a[3],

                cosHalfTheta = ax * bx + ay * by + az * bz + aw * bw,
                halfTheta,
                sinHalfTheta,
                ratioA,
                ratioB;

            if (Math.abs(cosHalfTheta) >= 1.0) {
                if (out !== a) {
                    out[0] = ax;
                    out[1] = ay;
                    out[2] = az;
                    out[3] = aw;
                }
                return out;
            }

            halfTheta = Math.acos(cosHalfTheta);
            sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

            if (Math.abs(sinHalfTheta) < 0.001) {
                out[0] = (ax * 0.5 + bx * 0.5);
                out[1] = (ay * 0.5 + by * 0.5);
                out[2] = (az * 0.5 + bz * 0.5);
                out[3] = (aw * 0.5 + bw * 0.5);
                return out;
            }

            ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

            out[0] = (ax * ratioA + bx * ratioB);
            out[1] = (ay * ratioA + by * ratioB);
            out[2] = (az * ratioA + bz * ratioB);
            out[3] = (aw * ratioA + bw * ratioB);

            return out;
        },

        /**
         * Calculates the inverse of a quat
         *
         * @method inverse
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a quat to calculate inverse of
         * @return {kick.math.Quat} out
         * @static
         */
        invert: function (out, a) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
                dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3,
                invDot = dot ? 1.0 / dot : 0;

            // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

            out[0] = -a0 * invDot;
            out[1] = -a1 * invDot;
            out[2] = -a2 * invDot;
            out[3] = a3 * invDot;
            return out;
        },

        /**
         * Calculates the conjugate of a quat
         * @method conjugate
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a quat to calculate conjugate of
         * @return {kick.math.Quat} out
         * @static
         */
        conjugate: function (out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = a[3];
            return out;
        },

        /**
         * Calculates the length of a quat
         * @method length
         * @param {kick.math.Quat} a vector to calculate length of
         * @return {Number} length of a
         * @static
         */
        length: vec4.length,

        /**
         * Calculates the squared length of a quat
         *
         * @method squaredLength
         * @param {kick.math.Quat} a vector to calculate squared length of
         * @return {Number} squared length of a
         * @static
         */
        squaredLength: vec4.squaredLength,

        /**
         * Normalize a quat
         *
         * @method normalize
         * @param {kick.math.Quat} out the receiving quaternion
         * @param {kick.math.Quat} a quaternion to normalize
         * @return {kick.math.Quat} out
         * @static
         */
        normalize: vec4.normalize,

        /**
         * Transforms a vec3 with the given quaternion
         * @method multiplyVec3
         * @param {kick.math.Vec3} out vec3 receiving operation result
         * @param {kick.math.Quat} quat quat to transform the vector with
         * @param {kick.math.Vec3} vec vec3 to transform
         * @return {kick.math.Vec3} out
         * @static
         */
        multiplyVec3: function (out, quat, vec) {
            var x = vec[0], y = vec[1], z = vec[2],
                qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3],

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
         * Calculates a rotation represented in Eulers angles (in degrees)
         * Pitch->X axis, Yaw->Y axis, Roll->Z axis
         * @method toEuler
         * @param {kick.math.Vec3} out vec3  receiving operation result
         * @param {kick.math.Quat} quat quat to create matrix from
         * @return {kick.math.Vec3} out
         * @static
         */
        toEuler: function (out, quat) {
            var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
                yy = y * y,
                radianToDegree = constants._RADIAN_TO_DEGREE;

            if (!out) { out = vec3.create(); }

            out[0] = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + yy)) * radianToDegree;
            out[1] = Math.asin(2 * (w * y - z * x)) * radianToDegree;
            out[2] = Math.atan2(2 * (w * z + x * y), 1 - 2 * (yy + z * z)) * radianToDegree;

            return out;
        },

        /**
         * Compute the lookAt rotation
         * @method lookAt
         * @param {kick.math.Quat} out
         * @param {kick.math.Vec3} position
         * @param {kick.math.Vec3} target
         * @param {kick.math.Vec3} up
         * @return {kick.math.Quat} out
         * @static
         */
        lookAt: (function () {
            var upVector = vec3.create(),
                rightVector = vec3.create(),
                forwardVector = vec3.create(),
                destMatrix = mat3.create();
            return function (out, position, target, up) {
                // idea create mat3 rotation and transform into quaternion
                vec3.subtract(position, target, forwardVector);
                vec3.normalize(forwardVector, forwardVector);
                vec3.cross(up, forwardVector, rightVector);
                vec3.normalize(rightVector, rightVector); // needed?
                vec3.cross(forwardVector, rightVector, upVector);
                vec3.normalize(upVector, upVector); // needed?
                destMatrix[0] = rightVector[0];
                destMatrix[1] = rightVector[1];
                destMatrix[2] = rightVector[2];
                destMatrix[3] = upVector[0];
                destMatrix[4] = upVector[1];
                destMatrix[5] = upVector[2];
                destMatrix[6] = forwardVector[0];
                destMatrix[7] = forwardVector[1];
                destMatrix[8] = forwardVector[2];
                return mat3.toQuat(out, destMatrix);
            };
        }()),

        /**
         * Set the rotation based on Eulers angles.
         * Pitch->X axis, Yaw->Y axis, Roll->Z axis
         * @method setEuler
         * @param {kick.math.Quat} out quat receiving operation result
         * @param {kick.math.Vec3} vec vec3 eulers angles (degrees)
         * @return {kick.math.Quat} dest if specified, a new quat otherwise
         * @static
         */
        setEuler: function (out, vec) {
            // code based on GLM
            var degreeToRadian = constants._DEGREE_TO_RADIAN, halfDTR = degreeToRadian * 0.5,
                x = vec[0] * halfDTR,
                y = vec[1] * halfDTR,
                z = vec[2] * halfDTR,
                cx = Math.cos(x), cy = Math.cos(y), cz = Math.cos(z),
                sx = Math.sin(x), sy = Math.sin(y), sz = Math.sin(z);
            out[3] = cx * cy * cz + sx * sy * sz;
            out[0] = sx * cy * cz - cx * sy * sz;
            out[1] = cx * sy * cz + sx * cy * sz;
            out[2] = cx * cy * sz - sx * sy * cz;
            return out;
        },


        /**
         * @method setFromRotationMatrix
         * @param {kick.math.Quat} out
         * @param {kick.math.Mat4} mat
         * @return {kick.math.Quat}
         * @static
         */
        setFromRotationMatrix: function (out, mat) {
            var x, y, z, w,
                m00 = mat[0], m01 = mat[4], m02 = mat[8],
                m10 = mat[1], m11 = mat[5], m12 = mat[9],
                m20 = mat[2], m21 = mat[6], m22 = mat[10],
                absQ;
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
            this.copy(out, [x, y, z, w]);
            this.normalize(out, out);
            return out;
        },

        /**
         * Calculates a 3x3 matrix from the given quat
         * @method toMat3
         * @param {kick.math.Mat3} out mat3 receiving operation result
         * @param {kick.math.Quat} quat quat to create matrix from
         * @return {kick.math.Mat3} out
         * @static
         */
        toMat3: function (out, quat) {
            var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
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
         * Calculates a 4x4 matrix from the given quat
         * @method toMat4
         * @param {kick.math.Mat4} out mat4 receiving operation result
         * @param {kick.math.Quat} quat quat to create matrix from
         * @return {kick.math.Mat4} out
         * @static
         */
        toMat4: function (out, quat) {

            var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
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
         * Return rotation that goes from quat to quat2.<br>
         * It is the same as: quat.multiply(dest, quat.invert(quat,quat),quat2);
         * @method difference
         * @param {kick.math.Quat} out
         * @param {kick.math.Quat} quat from rotation
         * @param {kick.math.Quat} quat2 to rotation
         * @return {kick.math.Quat} out
         * @static
         */
        difference: function (out, quat, quat2) {
            var qax = -quat[0], qay = -quat[1], qaz = -quat[2], qaw = quat[3],
                qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];

            out[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            out[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            out[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            out[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

            return out;
        },

        /**
         * Returns a string representation of a quaternion
         * @method str
         * @param {kick.math.Quat} quat quat to represent as a string
         * @return {String} string representation of quat
         * @static
         */
        str: function (quat) {
            return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
        }
    };
});