define(["kick/core/Constants", "./Vec3", "./Vec4", "./Mat3", "./Mat4"], function (constants, vec3, vec4, mat3, mat4) {
    "use strict";

    /**
     * Quat4 - Quaternions
     * @class Quat4
     * @namespace kick.math
     */
    return {
        /**
         * Creates a new instance of a quat4 using the default array type<br>
         * Any javascript array containing at least 4 numeric elements can serve as a quat4
         * @method create
         * @param {Array_Number} quat Optional, quat4 containing values to initialize with
         * @return {KICK.math.quat4} New quat4
         * @static
         */
        create: vec4.create,

        /**
         * Copies the values of one quat4 to another
         * @method set
         * @param {KICK.math.quat4} quat quat4 containing values to copy
         * @param {KICK.math.quat4} dest quat4 receiving copied values
         * @return {KICK.math.quat4} dest
         * @static
         */
        set: vec4.set,

        /**
         * Calculates the W component of a quat4 from the X, Y, and Z components.<br>
         * Assumes that quaternion is 1 unit in length.<br>
         * Any existing W component will be ignored.
         * @method calculateW
         * @param {KICK.math.quat4} quat quat4 to calculate W component of
         * @param {KICK.math.quat4} dest Optional, quat4 receiving calculated values. If not specified result is written to quat
         * @return {KICK.math.quat4} dest if specified, quat otherwise
         * @static
         */
        calculateW: function (quat, dest) {
            var x = quat[0], y = quat[1], z = quat[2],
                w = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));

            if (!dest || quat === dest) {
                quat[3] = w;
                return quat;
            }
            dest[0] = x;
            dest[1] = y;
            dest[2] = z;
            dest[3] = w;
            return dest;
        },

        /**
         * Calculates the inverse of a quat4.
         * Note that if the quat is normalized, it is much faster to use quat4.conjugate
         * @method inverse
         * @param {KICK.math.quat4} quat quat4 to calculate inverse of
         * @param {KICK.math.quat4} dest Optional, quat4 receiving inverse values. If not specified result is written to quat
         * @return {KICK.math.quat4} dest if specified, quat otherwise
         * @static
         */
        inverse: function (quat, dest) {
            var dot = this.dot(quat, quat),
                invDot = 1.0 / dot;
            if (!dest || quat === dest) {
                quat[0] *= -invDot;
                quat[1] *= -invDot;
                quat[2] *= -invDot;
                quat[3] *= invDot;
                return quat;
            }
            dest[0] = -quat[0] * invDot;
            dest[1] = -quat[1] * invDot;
            dest[2] = -quat[2] * invDot;
            dest[3] = quat[3] * invDot;
            return dest;
        },

        /**
         * Calculates the conjugate of a quat4
         * @method conjugate
         * @param {KICK.math.quat4} quat quat4 to calculate conjugate of
         * @param {KICK.math.quat4} dest Optional, quat4 receiving inverse values. If not specified result is written to quat
         * @return {KICK.math.quat4} dest if specified, quat otherwise
         * @static
         */
        conjugate: function (quat, dest) {
            if (!dest || quat === dest) {
                quat[0] *= -1;
                quat[1] *= -1;
                quat[2] *= -1;
                return quat;
            }
            dest[0] = -quat[0];
            dest[1] = -quat[1];
            dest[2] = -quat[2];
            dest[3] = quat[3];
            return dest;
        },

        /**
         * Calculates the length of a quat4
         * @method length
         * @param {KICK.math.quat4} quat quat4 to calculate length of
         * @return {Number} Length of quat
         * @static
         */
        length: vec4.length,

        /**
         * Returns dot product of q1 and q1
         * @method dot
         * @param {KICK.math.quat4} q1
         * @param {KICK.math.quat4} q2
         * @return {Number}
         * @static
         */
        dot: vec4.dot,

        /**
         * Generates a unit quaternion of the same direction as the provided quat4<br>
         * If quaternion length is 0, returns [0, 0, 0, 0]
         * @method normalize
         * @param {KICK.math.quat4} quat quat4 to normalize
         * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
         * @return {KICK.math.quat4} dest if specified, quat otherwise
         * @static
         */
        normalize: function (quat, dest) {
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

        /**
         * Performs a quaternion multiplication
         * @method multiply
         * @param {KICK.math.quat4} quat first operand
         * @param {KICK.math.quat4} quat2 second operand
         * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
         * @return {KICK.math.quat4} dest if specified, quat otherwise
         * @static
         */
        multiply: function (quat, quat2, dest) {
            if (!dest) { dest = quat; }

            var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3],
                qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];

            dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

            return dest;
        },

        /**
         * Transforms a vec3 with the given quaternion
         * @method multiplyVec3
         * @param {KICK.math.quat4} quat quat4 to transform the vector with
         * @param {KICK.math.vec3} vec vec3 to transform
         * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
         * @return {KICK.math.vec3} dest if specified, vec otherwise
         * @static
         */
        multiplyVec3: function (quat, vec, dest) {
            if (!dest) { dest = vec; }

            var x = vec[0], y = vec[1], z = vec[2],
                qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3],

            // calculate quat * vec
                ix = qw * x + qy * z - qz * y,
                iy = qw * y + qz * x - qx * z,
                iz = qw * z + qx * y - qy * x,
                iw = -qx * x - qy * y - qz * z;

            // calculate result * inverse quat
            dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

            return dest;
        },

        /**
         * Set the identity to the quaternion (0,0,0,1)
         * @method identity
         * @param {KICK.math.quat4} dest Optional, quat4 to set the identity to
         * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
         * @static
         */
        identity: function (dest) {
            if (!dest) { dest = this.create(); }
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 1;
            return dest;
        },

        /**
         * Calculates a rotation represented in Eulers angles (in degrees)
         * Pitch->X axis, Yaw->Y axis, Roll->Z axis
         * @method toEuler
         * @param {KICK.math.quat4} quat quat4 to create matrix from
         * @param {KICK.math.vec3} dest Optional, vec3  receiving operation result
         * @return {KICK.math.vec3} dest if specified, a new vec3 otherwise
         * @static
         */
        toEuler: function (quat, dest) {
            var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
                yy = y * y,
                radianToDegree = constants._RADIAN_TO_DEGREE;

            if (!dest) { dest = vec3.create(); }

            dest[0] = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + yy)) * radianToDegree;
            dest[1] = Math.asin(2 * (w * y - z * x)) * radianToDegree;
            dest[2] = Math.atan2(2 * (w * z + x * y), 1 - 2 * (yy + z * z)) * radianToDegree;

            return dest;
        },

        /**
         * Set the rotation based on an angle and a axis
         * @method angleAxis
         * @param {Number} angle rotation angle in degrees
         * @param {KICK.math.vec3} vec normalized axis
         * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result
         * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
         * @static
         */
        angleAxis: function (angle, vec, dest) {
            var degreeToRadian = constants._DEGREE_TO_RADIAN,
                angleRadiansHalf = degreeToRadian * 0.5 * angle,
                s = Math.sin(angleRadiansHalf);
            if (!dest) { dest = this.create(); }

            dest[3] = Math.cos(angleRadiansHalf);
            dest[2] = vec[2] * s;
            dest[1] = vec[1] * s;
            dest[0] = vec[0] * s;

            return dest;
        },

        /**
         * Compute the lookAt rotation
         * @method lookAt
         * @param {KICK.math.vec3} position
         * @param {KICK.math.vec3} target
         * @param {KICK.math.vec3} up
         * @param {KICK.math.quat4} dest optional
         * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
         * @static
         */
        lookAt: (function () {
            var upVector = vec3.create(),
                rightVector = vec3.create(),
                forwardVector = vec3.create(),
                destMatrix = mat3.create();
            return function (position, target, up, dest) {
                // idea create mat3 rotation and transform into quaternion
                vec3.subtract(position, target, forwardVector);
                vec3.normalize(forwardVector);
                vec3.cross(up, forwardVector, rightVector);
                vec3.normalize(rightVector); // needed?
                vec3.cross(forwardVector, rightVector, upVector);
                vec3.normalize(upVector); // needed?
                destMatrix[0] = rightVector[0];
                destMatrix[1] = rightVector[1];
                destMatrix[2] = rightVector[2];
                destMatrix[3] = upVector[0];
                destMatrix[4] = upVector[1];
                destMatrix[5] = upVector[2];
                destMatrix[6] = forwardVector[0];
                destMatrix[7] = forwardVector[1];
                destMatrix[8] = forwardVector[2];
                return mat3.toQuat(destMatrix, dest);
            };
        }()),

        /**
         * Set the rotation based on Eulers angles.
         * Pitch->X axis, Yaw->Y axis, Roll->Z axis
         * @method setEuler
         * @param {KICK.math.vec3} vec vec3 eulers angles (degrees)
         * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result
         * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
         * @static
         */
        setEuler: function (vec, dest) {
            // code based on GLM
            var degreeToRadian = constants._DEGREE_TO_RADIAN, halfDTR = degreeToRadian * 0.5,
                x = vec[0] * halfDTR,
                y = vec[1] * halfDTR,
                z = vec[2] * halfDTR,
                cx = Math.cos(x), cy = Math.cos(y), cz = Math.cos(z),
                sx = Math.sin(x), sy = Math.sin(y), sz = Math.sin(z);
            if (!dest) {
                dest = this.create();
            }
            dest[3] = cx * cy * cz + sx * sy * sz;
            dest[0] = sx * cy * cz - cx * sy * sz;
            dest[1] = cx * sy * cz + sx * cy * sz;
            dest[2] = cx * cy * sz - sx * sy * cz;
            return dest;
        },


        /**
         * @method setFromRotationMatrix
         * @param {KICK.math.mat4} mat
         * @param {KICK.math.quat4} dest Optional
         * @return {KICK.math.quat4}
         * @static
         */
        setFromRotationMatrix: function (mat, dest) {
            var x, y, z, w,
                m00 = mat[0], m01 = mat[4], m02 = mat[8],
                m10 = mat[1], m11 = mat[5], m12 = mat[9],
                m20 = mat[2], m21 = mat[6], m22 = mat[10],
                absQ,
                destArray;
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
            destArray = [x, y, z, w];
            if (!dest) {
                dest = this.create(destArray);
            } else {
                this.set(destArray, dest);
            }
            this.normalize(dest);
            return dest;
        },

        /**
         * Calculates a 3x3 matrix from the given quat4
         * @method toMat3
         * @param {KICK.math.quat4} quat quat4 to create matrix from
         * @param {KICK.math.mat3} dest Optional, mat3 receiving operation result
         * @return {KICK.math.mat3} dest if specified, a new mat3 otherwise
         * @static
         */
        toMat3: function (quat, dest) {
            if (!dest) { dest = mat3.create(); }

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

            dest[0] = 1 - (yy + zz);
            dest[1] = xy + wz;
            dest[2] = xz - wy;

            dest[3] = xy - wz;
            dest[4] = 1 - (xx + zz);
            dest[5] = yz + wx;

            dest[6] = xz + wy;
            dest[7] = yz - wx;
            dest[8] = 1 - (xx + yy);

            return dest;
        },

        /**
         * Calculates a 4x4 matrix from the given quat4
         * @method toMat4
         * @param {KICK.math.quat4} quat quat4 to create matrix from
         * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result
         * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
         * @static
         */
        toMat4: function (quat, dest) {
            if (!dest) { dest = mat4.create(); }

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

            dest[0] = 1 - (yy + zz);
            dest[1] = xy + wz;
            dest[2] = xz - wy;
            dest[3] = 0;

            dest[4] = xy - wz;
            dest[5] = 1 - (xx + zz);
            dest[6] = yz + wx;
            dest[7] = 0;

            dest[8] = xz + wy;
            dest[9] = yz - wx;
            dest[10] = 1 - (xx + yy);
            dest[11] = 0;

            dest[12] = 0;
            dest[13] = 0;
            dest[14] = 0;
            dest[15] = 1;

            return dest;
        },

        /**
         * Performs a spherical linear interpolation between two quat4
         * @method slerp
         * @param {KICK.math.quat4} quat first quaternion
         * @param {KICK.math.quat4} quat2 second quaternion
         * @param {Number} slerp interpolation amount between the two inputs
         * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
         * @return {KICK.math.quat4} dest if specified, quat otherwise
         * @static
         */
        slerp: function (quat, quat2, slerp, dest) {
            if (!dest) { dest = quat; }

            var cosHalfTheta =  quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3],
                halfTheta,
                sinHalfTheta,
                ratioA,
                ratioB;

            if (Math.abs(cosHalfTheta) >= 1.0) {
                if (dest !== quat) {
                    dest[0] = quat[0];
                    dest[1] = quat[1];
                    dest[2] = quat[2];
                    dest[3] = quat[3];
                }
                return dest;
            }

            halfTheta = Math.acos(cosHalfTheta);
            sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

            if (Math.abs(sinHalfTheta) < 0.001) {
                dest[0] = (quat[0] * 0.5 + quat2[0] * 0.5);
                dest[1] = (quat[1] * 0.5 + quat2[1] * 0.5);
                dest[2] = (quat[2] * 0.5 + quat2[2] * 0.5);
                dest[3] = (quat[3] * 0.5 + quat2[3] * 0.5);
                return dest;
            }

            ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
            ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;

            dest[0] = (quat[0] * ratioA + quat2[0] * ratioB);
            dest[1] = (quat[1] * ratioA + quat2[1] * ratioB);
            dest[2] = (quat[2] * ratioA + quat2[2] * ratioB);
            dest[3] = (quat[3] * ratioA + quat2[3] * ratioB);

            return dest;
        },

        /**
         * Return rotation that goes from quat to quat2.<br>
         * It is the same as: quat4.multiply(quat4.inverse(quat),quat2,dest);
         * @method difference
         * @param {KICK.math.quat4} quat from rotation
         * @param {KICK.math.quat4} quat2 to rotation
         * @param {KICK.math.quat4} dest Optional
         * @return {KICK.math.quat4} dest if specified, quat otherwise
         * @static
         */
        difference: function (quat, quat2, dest) {
            if (!dest) { dest = quat; }

            var qax = -quat[0], qay = -quat[1], qaz = -quat[2], qaw = quat[3],
                qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];

            dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

            return dest;
        },

        /**
         * Returns a string representation of a quaternion
         * @method str
         * @param {KICK.math.quat4} quat quat4 to represent as a string
         * @return {String} string representation of quat
         * @static
         */
        str: function (quat) {
            return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
        }
    };
});