define(["kick/core/Constants", "./Vec3", "./Aabb"], function (constants, vec3, aabb) {
    "use strict";
    var OUTSIDE = 0,
        INSIDE = 1,
        INTERSECTING = 2;

    /**
     * Frustum represented as 6 line equations (a*x+b*y+c*z+d=0 , where [a,b,c] is the normal of the plane).
     * Note the normals of the frustum points inwards. The order of the planes are left, right, top, bottom, near, far
     * The implementation is based on
     * "Fast Extraction of Viewing Frustum Planes from the WorldView-Projection Matrix" by Gil Grib and Klaus Hartmann
     * http://www.cs.otago.ac.nz/postgrads/alexis/planeExtraction.pdf
     * @class frustum
     * @namespace kick.math
     */
    return {
        /**
         * @method extractPlanes
         * @param {kick.math.mat4} modelViewMatrix
         * @param {Boolean} normalize normalize plane normal
         * @param {Array_24} dest
         * @return {Array_24} 6 plane equations
         * @static
         */
        extractPlanes: function (modelViewMatrix, normalize, dest) {
            if (!dest) {
                dest = new Float32Array(6 * 4);
            }
            var _11 = modelViewMatrix[0], _21 = modelViewMatrix[1], _31 = modelViewMatrix[2], _41 = modelViewMatrix[3],
                _12 = modelViewMatrix[4], _22 = modelViewMatrix[5], _32 = modelViewMatrix[6], _42 = modelViewMatrix[7],
                _13 = modelViewMatrix[8], _23 = modelViewMatrix[9], _33 = modelViewMatrix[10], _43 = modelViewMatrix[11],
                _14 = modelViewMatrix[12], _24 = modelViewMatrix[13], _34 = modelViewMatrix[14], _44 = modelViewMatrix[15],
                i,
                x,
                y,
                z,
                length,
                lengthRecip;
            // Left clipping plane
            dest[0] = _41 + _11;
            dest[1] = _42 + _12;
            dest[2] = _43 + _13;
            dest[3] = _44 + _14;
            // Right clipping plane
            dest[4] = _41 - _11;
            dest[4 + 1] = _42 - _12;
            dest[4 + 2] = _43 - _13;
            dest[4 + 3] = _44 - _14;
            // Top clipping plane
            dest[2 * 4] = _41 - _21;
            dest[2 * 4 + 1] = _42 - _22;
            dest[2 * 4 + 2] = _43 - _23;
            dest[2 * 4 + 3] = _44 - _24;
            // Bottom clipping plane
            dest[3 * 4] = _41 + _21;
            dest[3 * 4 + 1] = _42 + _22;
            dest[3 * 4 + 2] = _43 + _23;
            dest[3 * 4 + 3] = _44 + _24;
            // Near clipping plane
            dest[4 * 4] = _41 + _31;
            dest[4 * 4 + 1] = _42 + _32;
            dest[4 * 4 + 2] = _43 + _33;
            dest[4 * 4 + 3] = _44 + _34;
            // Far clipping plane
            dest[5 * 4] = _41 - _31;
            dest[5 * 4 + 1] = _42 - _32;
            dest[5 * 4 + 2] = _43 - _33;
            dest[5 * 4 + 3] = _44 - _34;
            if (normalize) {
                for (i = 0; i < 6; i++) {
                    x = dest[i * 4];
                    y = dest[i * 4 + 1];
                    z = dest[i * 4 + 2];
                    length = Math.sqrt(x * x + y * y + z * z);
                    lengthRecip = 1 / length;
                    dest[i * 4] *= lengthRecip;
                    dest[i * 4 + 1] *= lengthRecip;
                    dest[i * 4 + 2] *= lengthRecip;
                    dest[i * 4 + 3] *= lengthRecip;
                }
            }
            return dest;
        },

        /**
         * Value = 0
         * @property OUTSIDE
         * @type Number
         * @static
         */
        OUTSIDE: OUTSIDE,

        /**
         * Value = 1
         * @property INSIDE
         * @type Number
         * @static
         */
        INSIDE: INSIDE,

        /**
         * Value = 2
         * @property INTERSECTING
         * @type Number
         * @static
         */
        INTERSECTING: INTERSECTING,

        /**
         * Based on [Akenine-Moller's Real-Time Rendering 3rd Ed] chapter 16.14.3
         * @method intersectAabb
         * @param {kick.math.frustum} frustumPlanes
         * @param {kick.math.aabb} aabbIn
         * @return {Number} frustum.OUTSIDE = outside(0), frustum.INSIDE = inside(1), frustum.INTERSECTING = intersecting(2)
         * @static
         */
        intersectAabb: (function () {
            var center = vec3.create(),
                halfVector = vec3.create();
            return function (frustumPlanes, aabbIn) {
                var result = INSIDE, i,
                    testResult,
                    centerX, centerY, centerZ,
                    halfVectorX, halfVectorY, halfVectorZ,
                    // based on [Akenine-Moller's Real-Time Rendering 3rd Ed] chapter 16.10.1
                    planeAabbIntersect = function (planeIndex) {
                        var offset = planeIndex * 4,
                            nx = frustumPlanes[offset],
                            ny = frustumPlanes[offset + 1],
                            nz = frustumPlanes[offset + 2],
                            d = frustumPlanes[offset + 3],
                            e = halfVectorX * Math.abs(nx) + halfVectorY * Math.abs(ny) + halfVectorZ * Math.abs(nz),
                            s = centerX * nx + centerY * ny + centerZ * nz + d;
                        // Note that the following is reverse than in [Akenine-Moller's Real-Time Rendering 3rd Ed],
                        // since we define outside as the negative halfspace
                        if (s - e > 0) { return INSIDE; }
                        if (s + e < 0) { return OUTSIDE; }
                        return INTERSECTING;
                    };
                aabb.center(aabbIn, center);
                aabb.halfVec3(aabbIn, halfVector);
                centerX = center[0];
                centerY = center[1];
                centerZ = center[2];
                halfVectorX = halfVector[0];
                halfVectorY = halfVector[1];
                halfVectorZ = halfVector[2];
                for (i = 0; i < 6; i++) {
                    testResult = planeAabbIntersect(i);
                    if (testResult === OUTSIDE) {
                        return testResult;
                    } else if (testResult === INTERSECTING) {
                        result = INTERSECTING;
                    }
                }
                return result;
            };
        }())
    };
});