define(["./MeshData", "kick/math/Vec2", "kick/math/Vec3", "kick/core/Constants", "kick/core/Util"], function (MeshData, Vec2, Vec3, Constants, Util) {
    "use strict";

    /**
     * Class responsible for creating Mesh objects
     * @class MeshFactory
     * @namespace kick.mesh
     * @static
     */
    return {

        /**
         * Creates a triangle in the XY plane
         * @method createTriangleData
         * @static
         * @return {kick.core.MeshData} triangle mesh
         */
        createTriangleData : function () {
            var sqrt75 = Math.sqrt(0.75);
            return new MeshData({
                name: "Triangle",
                vertex: [
                    0, 1, 0,
                    -sqrt75, -0.5, 0,
                    sqrt75, -0.5, 0
                ],
                uv1: [
                    0.5, 1,
                    0.125, 0.25,
                    1 - 0.125, 0.25
                ],
                normal: [
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1
                ],
                indices: [0, 1, 2]
            });
        },

        /**
         * Create a plane in the XY plane (made of two triangles). The mesh objects has UVs and normals attributes.
         * @method createPlaneData
         * @static
         * @return {kick.mesh.MeshData} plane mesh
         */
        createPlaneData : function () {
            return new MeshData({
                name: "Plane",
                vertex: [
                    1, -1, 0,
                    1, 1, 0,
                    -1, -1, 0,
                    -1, 1, 0

                ],
                uv1: [
                    1, 0,
                    1, 1,
                    0, 0,
                    0, 1
                ],
                normal: [
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1
                ],
                indices: [0, 1, 2, 2, 1, 3]
            });
        },

        /**
         * Create a UV sphere
         * @method createUVSphereData
         * @static
         * @param {Number} slices Optional default value is 64
         * @param {Number} stacks Optional default value is 32
         * @param {Number} radius
         * @return {kick.mesh.MeshData} uv-sphere mesh
         */
        createUVSphereData : function (slices, stacks, radius) {
            if (!slices || slices < 3) {
                slices = 64;
            }
            if (!stacks || stacks < 2) {
                stacks = 32;
            }
            if (!radius) {
                radius = 1;
            }
            var j, i,
                vertexCount = stacks * (slices + 1) * 2 + 2 * (stacks - 1), // degenerate vertex info
                normalsMemory = {},
                normals = Vec3.array(vertexCount, normalsMemory),
                verticesMemory = {},
                vertices = Vec3.array(vertexCount, verticesMemory),
                uvsMemory = {},
                uvs = Vec2.array(vertexCount, uvsMemory),
                indices = [],
                piDivStacks = Math.PI / stacks,
                PIDiv2 = Math.PI / 2,
                PI2 = Math.PI * 2,
                index = 0,
                latitude1,
                sinLat1,
                cosLat1,
                longitude,
                sinLong, cosLong,
                x1, y1, z1,
                meshDataConf;
            // create vertices
            for (j = 0; j <= stacks; j++) {
                latitude1 = piDivStacks * j - PIDiv2;
                sinLat1 = Math.sin(latitude1);
                cosLat1 = Math.cos(latitude1);
                for (i = 0; i <= slices; i++) {
                    longitude = (PI2 / slices) * i;
                    sinLong = Math.sin(longitude);
                    cosLong = Math.cos(longitude);
                    x1 = cosLong * cosLat1;
                    y1 = sinLat1;
                    z1 = sinLong * cosLat1;
                    Vec3.set([x1, y1, z1], normals[index]);
                    Vec2.set([1 - i / slices, j / stacks], uvs[index]);
                    Vec3.set([radius * x1, radius * y1, radius * z1], vertices[index]);
                    index++;
                }
            }
            // create indices
            for (j = 0; j < stacks; j++) {
                if (j > 0) {
                    indices.push(j * (slices + 1)); // make degenerate
                }
                for (i = 0; i <= slices; i++) {
                    index = j * (slices + 1) + i;
                    indices.push(index);
                    indices.push(index + slices + 1);
                }
                if (j + 1 < stacks) {
                    indices.push(index + slices + 1); // make degenerate
                }
            }
            meshDataConf = {
                name: "UVSphere",
                vertex: verticesMemory.mem,
                uv1: uvsMemory.mem,
                normal: normalsMemory.mem,
                indices: indices,
                meshType: Constants.GL_TRIANGLE_STRIP
            };
            return new MeshData(meshDataConf);
        },

        /**
         * Create a code of size length. The cube has colors, normals and UVs.<br>
         * Note that the length of the sides are 2*length
         * @method createCubeData
         * @static
         * @param {Number} length Optional, default value is 1.0
         * @return {kick.mesh.Mesh} cube mesh
         */
        createCubeData : function (length) {
            if (!length) {
                length = 1;
            }

            //    v6----- v5
            //   /|      /|
            //  v1------v0|
            //  | |     | |
            //  | |v7---|-|v4
            //  |/      |/
            //  v2------v3
            var meshDataConf = {
                name: "Cube",
                vertex: [
                    length, length, length,
                    -length, length, length,
                    -length, -length, length,
                    length, -length, length,        // v0-v1-v2-v3
                    length, length, length,
                    length, -length, length,
                    length, -length, -length,
                    length, length, -length,        // v0-v3-v4-v5
                    length, length, length,
                    length, length, -length,
                    -length, length, -length,
                    -length, length, length,        // v0-v5-v6-v1
                    -length, length, length,
                    -length, length, -length,
                    -length, -length, -length,
                    -length, -length, length,    // v1-v6-v7-v2
                    -length, -length, -length,
                    length, -length, -length,
                    length, -length, length,
                    -length, -length, length,    // v7-v4-v3-v2
                    length, -length, -length,
                    -length, -length, -length,
                    -length, length, -length,
                    length, length, -length   // v4-v7-v6-v5
                ],
                uv1: [
                    1, 1,
                    0, 1,
                    0, 0,
                    1, 0,                    // v0-v1-v2-v3
                    0, 1,
                    0, 0,
                    1, 0,
                    1, 1,              // v0-v3-v4-v5
                    1, 0,
                    1, 1,
                    0, 1,
                    0, 0,              // v0-v5-v6-v1 (top)
                    1, 1,
                    0, 1,
                    0, 0,
                    1, 0,              // v1-v6-v7-v2
                    1, 1,
                    0, 1,
                    0, 0,
                    1, 0,              // v7-v4-v3-v2 (bottom)
                    0, 0,
                    1, 0,
                    1, 1,
                    0, 1             // v4-v7-v6-v5
                ],
                normal: [
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,             // v0-v1-v2-v3
                    1, 0, 0,
                    1, 0, 0,
                    1, 0, 0,
                    1, 0, 0,              // v0-v3-v4-v5
                    0, 1, 0,
                    0, 1, 0,
                    0, 1, 0,
                    0, 1, 0,              // v0-v5-v6-v1
                    -1, 0, 0,
                    -1, 0, 0,
                    -1, 0, 0,
                    -1, 0, 0,          // v1-v6-v7-v2
                    0, -1, 0,
                    0, -1, 0,
                    0, -1, 0,
                    0, -1, 0,         // v7-v4-v3-v2
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, -1        // v4-v7-v6-v5
                ],
                color: [
                    1, 1, 1, 1,
                    1, 1, 0, 1,
                    1, 0, 0, 1,
                    1, 0, 1, 1,              // v0-v1-v2-v3
                    1, 1, 1, 1,
                    1, 0, 1, 1,
                    0, 0, 1, 1,
                    0, 1, 1, 1,              // v0-v3-v4-v5
                    1, 1, 1, 1,
                    0, 1, 1, 1,
                    0, 1, 0, 1,
                    1, 1, 0, 1,              // v0-v5-v6-v1
                    1, 1, 0, 1,
                    0, 1, 0, 1,
                    0, 0, 0, 1,
                    1, 0, 0, 1,              // v1-v6-v7-v2
                    0, 0, 0, 1,
                    0, 0, 1, 1,
                    1, 0, 1, 1,
                    1, 0, 0, 1,              // v7-v4-v3-v2
                    0, 0, 1, 1,
                    0, 0, 0, 1,
                    0, 1, 0, 1,
                    0, 1, 1, 1             // v4-v7-v6-v5
                ],
                indices: [
                    0, 1, 2,
                    0, 2, 3,
                    4, 5, 6,
                    4, 6, 7,
                    8, 9, 10,
                    8, 10, 11,
                    12, 13, 14,
                    12, 14, 15,
                    16, 17, 18,
                    16, 18, 19,
                    20, 21, 22,
                    20, 22, 23]
            };
            return new MeshData(meshDataConf);
        }
    };
});