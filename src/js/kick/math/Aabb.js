define(["kick/core/Constants", "./Vec3", "./Mat4"], function (constants, vec3, mat4) {
    "use strict";

    /**
     * @module kick.math
     */

    /**
     * Axis-Aligned Bounding Box. A rectangle or box with the restriction that it's sides or faces are parallel to the
     * axes of the system.
     * The aabb is represented using an array: [min\_x,min\_y,min\_z,max\_x,max\_y,max\_z]
     * @class Aabb
     * @namespace kick.math
     */
    return {
        /**
         * Default value is min=MAX, max=MIN (meaning that it has a negative size)
         * @method create
         * @param {Array_Number | kick.math.Aabb} vec3Min Optional, vec3Min containing values to initialize minimum values with Default. Or an aabb.
         * @param {Array_Number} vec3Max Optional, vec3Max containing values to initialize maximum values with
         * @return {kick.math.Aabb} New aabb
         * @static
         */
        create: function (vec3Min, vec3Max) {
            var dest = new Float32Array(6);

            if (vec3Min) {
                dest[0] = vec3Min[0];
                dest[1] = vec3Min[1];
                dest[2] = vec3Min[2];
                if (vec3Min.length === 6) {
                    dest[3] = vec3Min[3];
                    dest[4] = vec3Min[4];
                    dest[5] = vec3Min[5];
                } else if (vec3Max) {
                    dest[3] = vec3Max[0];
                    dest[4] = vec3Max[1];
                    dest[5] = vec3Max[2];
                } else {
                    dest[3] = dest[0];
                    dest[4] = dest[1];
                    dest[5] = dest[2];
                }
            } else {
                dest[0] = Number.MAX_VALUE;
                dest[1] = Number.MAX_VALUE;
                dest[2] = Number.MAX_VALUE;
                dest[3] = -Number.MAX_VALUE;
                dest[4] = -Number.MAX_VALUE;
                dest[5] = -Number.MAX_VALUE;
            }
            return dest;
        },

        /**
         * Copies the values of one aabb to another
         * @method copy
         * @param {kick.math.Aabb} out receiving copied values
         * @param {kick.math.Aabb} aabb containing values to copy
         * @return {kick.math.Aabb} dest
         * @static
         */
        copy: function (out, aabb) {
            out[0] = aabb[0];
            out[1] = aabb[1];
            out[2] = aabb[2];
            out[3] = aabb[3];
            out[4] = aabb[4];
            out[5] = aabb[5];
            return out;
        },

        /**
         * Transforms the eight points of the Axis-Aligned Bounding Box into a new AABB
         * @method transform
         * @param {kick.math.Aabb} out
         * @param {kick.math.Aabb} aabbIn
         * @param {kick.math.Mat4} mat
         * @return {kick.math.Aabb}
         * @static
         */
        transform: (function () {
            var point = vec3.create(),
                temp = new Float32Array(6);
            return function (out, aabbIn, mat) {
                var max = Number.MAX_VALUE,
                    min = -Number.MAX_VALUE,
                    i,
                    j,
                    k,
                    transformedPoint;

                this.copy(temp, [max, max, max, min, min, min]);

                for (i = 0; i < 2; i++) {
                    for (j = 0; j < 2; j++) {
                        for (k = 0; k < 2; k++) {
                            point[0] = aabbIn[i * 3];
                            point[1] = aabbIn[j * 3 + 1];
                            point[2] = aabbIn[k * 3 + 2];
                            transformedPoint = mat4.multiplyVec3(point, mat, point);
                            this.addPoint(temp, temp, transformedPoint);
                        }
                    }
                }
                this.copy(out, temp);
                return out;
            };
        }()),

        /**
         * @method merge
         * @param {kick.math.Aabb} out
         * @param {kick.math.Aabb} aabb
         * @param {kick.math.Aabb} aabb2
         * @return {kick.math.Aabb} out
         * @static
         */
        merge: function (out, aabb, aabb2) {
            out[0] = Math.min(aabb[0], aabb2[0]);
            out[1] = Math.min(aabb[1], aabb2[1]);
            out[2] = Math.min(aabb[2], aabb2[2]);
            out[3] = Math.max(aabb[3], aabb2[3]);
            out[4] = Math.max(aabb[4], aabb2[4]);
            out[5] = Math.max(aabb[5], aabb2[5]);
            return out;
        },

        /**
         * @method addPoint
         * @param {kick.math.Aabb} out
         * @param {kick.math.Aabb} aabb
         * @param {kick.math.Vec3} a point
         * @return {kick.math.Aabb} aabb (same object as input)
         * @static
         */
        addPoint: function (out, aabb, a) {
            var vpX = a[0],
                vpY = a[1],
                vpZ = a[2];
            out[0] = Math.min(aabb[0], vpX);
            out[1] = Math.min(aabb[1], vpY);
            out[2] = Math.min(aabb[2], vpZ);
            out[3] = Math.max(aabb[3], vpX);
            out[4] = Math.max(aabb[4], vpY);
            out[5] = Math.max(aabb[5], vpZ);
            return aabb;
        },
        /**
         * @method addPointIndexed
         * @param {kick.math.Aabb} out
         * @param {kick.math.Aabb} aabb
         * @param {Array} a array of Numbers
         * @param {Number} offset
         * @return {kick.math.Aabb} aabb (same object as input)
         * @static
         */
        addPointIndexed: function (out, aabb, a, offset) {
            var vpX = a[0+offset],
                vpY = a[1+offset],
                vpZ = a[2+offset];
            out[0] = Math.min(aabb[0], vpX);
            out[1] = Math.min(aabb[1], vpY);
            out[2] = Math.min(aabb[2], vpZ);
            out[3] = Math.max(aabb[3], vpX);
            out[4] = Math.max(aabb[4], vpY);
            out[5] = Math.max(aabb[5], vpZ);
            return aabb;
        },


        /**
         * @method center
         * @param {kick.math.Vec3} out
         * @param {kick.math.Aabb} aabb
         * @return {kick.math.Vec3} out
         * @static
         */
        center: function (out, aabb) {
            out[0] = (aabb[0] + aabb[3]) * 0.5;
            out[1] = (aabb[1] + aabb[4]) * 0.5;
            out[2] = (aabb[2] + aabb[5]) * 0.5;

            return out;
        },

        /**
         * @method halfVector
         * @param {kick.math.Vec3} out
         * @param {kick.math.Aabb} aabb
         * @return {kick.math.Vec3} out
         * @static
         */
        halfVec3: function (out, aabb) {
            out[0] = (aabb[3] - aabb[0]) * 0.5;
            out[1] = (aabb[4] - aabb[1]) * 0.5;
            out[2] = (aabb[5] - aabb[2]) * 0.5;

            return out;
        },

        /**
         * Diagonal from min to max
         * @method diagonal
         * @param {kick.math.Vec3} out
         * @param {kick.math.Aabb} aabb
         * @return {kick.math.Vec3} out
         * @static
         */
        diagonal: function (out, aabb) {
            out[0] = aabb[3] - aabb[0];
            out[1] = aabb[4] - aabb[1];
            out[2] = aabb[5] - aabb[2];
            return out;
        },

        /**
         * @method str
         * @param {kick.math.Aabb} aabb
         * @static
         */
        str: function (aabb) {
            return "{(" +
                aabb[0] + "," +
                aabb[1] + "," +
                aabb[2] + "),(" +
                aabb[3] + "," +
                aabb[4] + "," +
                aabb[5] + ")}";
        }
    };
});