define(["kick/core/Constants", "./Vec3", "./Mat4"], function (constants, vec3, mat4) {
    "use strict";

    /**
     * Axis-Aligned Bounding Box. A rectangle or box with the restriction that it's sides or faces are parallel to the
     * axes of the system.
     * The aabb is represented using an array: [min_x,min_y,min_z,max_x,max_y,max_z]
     * @class aabb
     * @namespace KICK.math
     */
    return {

        /**
         * Default value is min=MAX, max=MIN (meaning that it has a negative size)
         * @method create
         * @param {Array_Number | KICK.math.aabb} vec3Min Optional, vec3Min containing values to initialize minimum values with Default. Or an aabb.
         * @param {Array_Number} vec3Max Optional, vec3Max containing values to initialize maximum values with
         * @return {KICK.math.aabb} New aabb
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
         * @method set
         * @param {KICK.math.aabb} aabb containing values to copy
         * @param {KICK.math.aabb} dest receiving copied values
         * @return {KICK.math.aabb} dest
         * @static
         */
        set: function (aabb, dest) {
            dest[0] = aabb[0];
            dest[1] = aabb[1];
            dest[2] = aabb[2];
            dest[3] = aabb[3];
            dest[4] = aabb[4];
            dest[5] = aabb[5];
            return dest;
        },

        /**
         * Transforms the eight points of the Axis-Aligned Bounding Box into a new AABB
         * @method transform
         * @param {KICK.math.aabb} aabbIn
         * @param {KICK.math.mat4} mat
         * @param {KICK.math.aabb} dest Optional new aabb create if not specified
         * @return {KICK.math.aabb}
         * @static
         */
        transform: (function () {
            var point = vec3.create();
            return function (aabbIn, mat, dest) {
                var max = Number.MAX_VALUE,
                    min = -Number.MAX_VALUE,
                    i,
                    j,
                    k,
                    transformedPoint;
                if (!dest) {
                    dest = this.create();
                } else {
                    this.set([max, max, max, min, min, min], dest);
                }
                for (i = 0; i < 2; i++) {
                    for (j = 0; j < 2; j++) {
                        for (k = 0; k < 2; k++) {
                            point[0] = aabbIn[i * 3];
                            point[1] = aabbIn[j * 3 + 1];
                            point[2] = aabbIn[k * 3 + 2];
                            transformedPoint = mat4.multiplyVec3(mat, point);
                            this.addPoint(dest, transformedPoint);
                        }
                    }
                }
                return dest;
            };
        }()),

        /**
         * @method merge
         * @param {KICK.math.aabb} aabb
         * @param {KICK.math.aabb} aabb2
         * @param {KICK.math.aabb} dest Optional, receiving copied values - otherwise using aabb
         * @return {KICK.math.aabb} dest if specified - otherwise a new value is returned
         * @static
         */
        merge: function (aabb, aabb2, dest) {
            if (!dest) {
                dest = aabb;
            }
            dest[0] = Math.min(aabb[0], aabb2[0]);
            dest[1] = Math.min(aabb[1], aabb2[1]);
            dest[2] = Math.min(aabb[2], aabb2[2]);
            dest[3] = Math.max(aabb[3], aabb2[3]);
            dest[4] = Math.max(aabb[4], aabb2[4]);
            dest[5] = Math.max(aabb[5], aabb2[5]);
            return dest;
        },

        /**
         * @method addPoint
         * @param {KICK.math.aabb} aabb
         * @param {KICK.math.vec3} vec3Point
         * @return {KICK.math.aabb} aabb (same object as input)
         * @static
         */
        addPoint: function (aabb, vec3Point) {
            var vpX = vec3Point[0],
                vpY = vec3Point[1],
                vpZ = vec3Point[2];
            aabb[0] = Math.min(aabb[0], vpX);
            aabb[1] = Math.min(aabb[1], vpY);
            aabb[2] = Math.min(aabb[2], vpZ);
            aabb[3] = Math.max(aabb[3], vpX);
            aabb[4] = Math.max(aabb[4], vpY);
            aabb[5] = Math.max(aabb[5], vpZ);
            return aabb;
        },

        /**
         * @method center
         * @param {KICK.math.aabb} aabb
         * @param {KICK.math.vec3} centerVec3 Optional
         * @return {KICK.math.vec3} Center of aabb, (centerVec3 if specified)
         * @static
         */
        center: function (aabb, centerVec3) {
            if (!centerVec3) {
                centerVec3 = vec3.create();
            }
            centerVec3[0] = (aabb[0] + aabb[3]) * 0.5;
            centerVec3[1] = (aabb[1] + aabb[4]) * 0.5;
            centerVec3[2] = (aabb[2] + aabb[5]) * 0.5;

            return centerVec3;
        },

        /**
         * @method halfVector
         * @param {KICK.math.aabb} aabb
         * @param {KICK.math.vec3} halfVec3 Optional
         * @return {KICK.math.vec3} Halfvector of aabb, (halfVec3 if specified)
         * @static
         */
        halfVec3: function (aabb, halfVec3) {
            if (!halfVec3) {
                halfVec3 = vec3.create();
            }
            halfVec3[0] = (aabb[3] - aabb[0]) * 0.5;
            halfVec3[1] = (aabb[4] - aabb[1]) * 0.5;
            halfVec3[2] = (aabb[5] - aabb[2]) * 0.5;

            return halfVec3;
        },

        /**
         * Diagonal from min to max
         * @method diagonal
         * @param {KICK.math.aabb} aabb
         * @param {KICK.math.vec3} diagonalVec3 optional
         * @return {KICK.math.vec3}
         * @static
         */
        diagonal: function (aabb, diagonalVec3) {
            if (!diagonalVec3) {
                diagonalVec3 = vec3.create();
            }
            diagonalVec3[0] = aabb[3] - aabb[0];
            diagonalVec3[1] = aabb[4] - aabb[1];
            diagonalVec3[2] = aabb[5] - aabb[2];
            return diagonalVec3;
        },

        /**
         * @method str
         * @param {KICK.math.aabb} aabb
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