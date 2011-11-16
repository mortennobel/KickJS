/*!
 * New BSD License
 *
 * Copyright (c) 2011, Morten Nobel-Joergensen, Kickstart Games ( http://www.kickstartgames.com/ )
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var KICK = KICK || {};
KICK.namespace = function (ns_string) {
    var parts = ns_string.split("."),
        parent = window,
        i;

    for (i = 0; i < parts.length; i += 1) {
        // create property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

(function () {
    "use strict"; // force strict ECMAScript 5

    var mesh = KICK.namespace("KICK.mesh"),
        math = KICK.namespace("KICK.math"),
        vec3 = math.vec3,
        vec2 = math.vec2,
        constants = KICK.core.Constants;

    /**
     * Class responsible for creating Mesh objects
     * @class MeshFactory
     * @namespace KICK.mesh
     * @static
     */
    mesh.MeshFactory = {

        /**
         * Creates a triangle in the XY plane
         * @method createTriangleData
         * @static
         * @return {KICK.core.MeshData} triangle mesh
         */
        createTriangleData : function () {
            return new mesh.MeshData( {
                name: "Triangle",
                vertex: [
                    0,1,0,
                    -0.866025403784439,-0.5,0, // 0.866025403784439 = sqrt(.75)
                    0.866025403784439,-0.5,0
                ],
                uv1: [
                    0,1,
                    -0.866025403784439,-0.5,
                    0.866025403784439,-0.5
                ],
                normal: [
                    0,0,1,
                    0,0,1,
                    0,0,1
                ],
                indices: [0,1,2]
            });
        },

        /**
         * Create a plane in the XY plane (made of two triangles). The mesh objects has UVs and normals attributes.
         * @method createPlaneData
         * @static
         * @return {KICK.mesh.MeshData} plane mesh
         */
        createPlaneData : function () {
            return new mesh.MeshData({
                name: "Plane",
                vertex: [
                    1,-1,0,
                    1,1,0,
                    -1,-1,0,
                    -1,1,0

                ],
                uv1: [
                    1,0,
                    1,1,
                    0,0,
                    0,1
                ],
                normal: [
                    0,0,1,
                    0,0,1,
                    0,0,1,
                    0,0,1
                ],
                indices: [0,1,2,2,1,3]
            });
        },

        /**
         * Create a UV sphere
         * @method createUVSphereData
         * @static
         * @param {Number} slices
         * @param {Number} stacks
         * @param {Number} radius
         * @return {KICK.mesh.MeshData} uv-sphere mesh
         */
        createUVSphereData : function(slices, stacks, radius){
            if (!slices || slices < 3){
                slices = 20;
            }
            if (!stacks || stacks < 2){
                stacks = 10;
            }
            if (!radius){
                radius = 1;
            }
            var vertexCount =
                stacks*(slices+1)*2+
                2*(stacks-1), // degenerate vertex info
                normalsMemory = {},
                normals = vec3.array(vertexCount,normalsMemory),
                verticesMemory = {},
                vertices = vec3.array(vertexCount,verticesMemory),
                uvsMemory = {},
                uvs = vec2.array(vertexCount,uvsMemory),
                indices = [],
                piDivStacks = Math.PI/stacks,
                PIDiv2 = Math.PI/2,
                PI2 = Math.PI*2;

            var index = 0;

            for (var j = 0; j < stacks; j++) {
                var latitude1 = piDivStacks * j - PIDiv2;
                var latitude2 = piDivStacks * (j+1) - PIDiv2;
                var sinLat1 = Math.sin(latitude1);
                var cosLat1 = Math.cos(latitude1);
                var sinLat2 = Math.sin(latitude2);
                var cosLat2 = Math.cos(latitude2);
                for (var i = 0; i <= slices; i++) {
                    var longitude = (PI2/slices) * i;
                    var sinLong = Math.sin(longitude);
                    var cosLong = Math.cos(longitude);
                    var x1 = cosLong * cosLat1;
                    var y1 = sinLat1;
                    var z1 = sinLong * cosLat1;
                    var x2 = cosLong * cosLat2;
                    var y2 = sinLat2;
                    var z2 = sinLong * cosLat2;
                    vec3.set([x1,y1,z1],normals[index]);
                    vec2.set([1-i/slices, j/stacks ],uvs[index]);
                    vec3.set([radius*x1,radius*y1,radius*z1],vertices[index]);
                    indices.push(index);
                    if (j>0 && i==0){
                        indices.push(index); // make degenerate
                    }
                    index++;

                    vec3.set([x2,y2,z2],normals[index]);
                    vec2.set([ 1-i /slices, (j+1)/stacks],uvs[index]);
                    vec3.set([radius*x2,radius*y2,radius*z2],vertices[index]);
                    indices.push(index);
                    if (i==slices && j<stacks-1){
                        indices.push(index); // make degenerate
                    }
                    index++;
                }
            }
            var meshDataConf = {
                name: "UVSphere",
                vertex: verticesMemory.mem,
                uv1: uvsMemory.mem,
                normal: normalsMemory.mem,
                indices: indices,
                meshType: constants.GL_TRIANGLE_STRIP
            };
            return new mesh.MeshData(meshDataConf);
        },

        /**
         * Create a code of size length. The cube has colors, normals and UVs.<br>
         * Note that the length of the sides are 2*length
         * @method createCubeData
         * @static
         * @param {Number} length Optional, default value is 1.0
         * @return {KICK.mesh.Mesh} cube mesh
         */
        createCubeData : function (length) {
            if (!length){
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
                   length,length,length,
                   -length,length,length,
                   -length,-length,length,
                   length,-length,length,        // v0-v1-v2-v3
                   length,length,length,
                   length,-length,length,
                   length,-length,-length,
                   length,length,-length,        // v0-v3-v4-v5
                   length,length,length,
                   length,length,-length,
                   -length,length,-length,
                   -length,length,length,        // v0-v5-v6-v1
                   -length,length,length,
                   -length,length,-length,
                   -length,-length,-length,
                   -length,-length,length,    // v1-v6-v7-v2
                   -length,-length,-length,
                   length,-length,-length,
                   length,-length,length,
                   -length,-length,length,    // v7-v4-v3-v2
                   length,-length,-length,
                   -length,-length,-length,
                    -length,length,-length,
                    length,length,-length   // v4-v7-v6-v5
                ],
                uv1: [
                    1,1,
                    0,1,
                    0,0,
                    1,0,                    // v0-v1-v2-v3
                    0,1,
                    0,0,
                    1,0,
                    1,1,              // v0-v3-v4-v5
                    1,0,
                    1,1,
                    0,1,
                    0,0,              // v0-v5-v6-v1 (top)
                    1,1,
                    0,1,
                    0,0,
                    1,0,              // v1-v6-v7-v2
                    1,1,
                    0,1,
                    0,0,
                    1,0,              // v7-v4-v3-v2 (bottom)
                    0,0,
                    1,0,
                    1,1,
                    0,1             // v4-v7-v6-v5
                ],
                normal: [
                    0,0,1,
                    0,0,1,
                    0,0,1,
                    0,0,1,             // v0-v1-v2-v3
                    1,0,0,
                    1,0,0,
                    1,0,0,
                    1,0,0,              // v0-v3-v4-v5
                    0,1,0,
                    0,1,0,
                    0,1,0,
                    0,1,0,              // v0-v5-v6-v1
                    -1,0,0,
                    -1,0,0,
                    -1,0,0,
                    -1,0,0,          // v1-v6-v7-v2
                    0,-1,0,
                    0,-1,0,
                    0,-1,0,
                    0,-1,0,         // v7-v4-v3-v2
                    0,0,-1,
                    0,0,-1,
                    0,0,-1,
                    0,0,-1        // v4-v7-v6-v5
                ],
                color: [
                    1,1,1,1,
                    1,1,0,1,
                    1,0,0,1,
                    1,0,1,1,              // v0-v1-v2-v3
                    1,1,1,1,
                    1,0,1,1,
                    0,0,1,1,
                    0,1,1,1,              // v0-v3-v4-v5
                    1,1,1,1,
                    0,1,1,1,
                    0,1,0,1,
                    1,1,0,1,              // v0-v5-v6-v1
                    1,1,0,1,
                    0,1,0,1,
                    0,0,0,1,
                    1,0,0,1,              // v1-v6-v7-v2
                    0,0,0,1,
                    0,0,1,1,
                    1,0,1,1,
                    1,0,0,1,              // v7-v4-v3-v2
                    0,0,1,1,
                    0,0,0,1,
                    0,1,0,1,
                    0,1,1,1             // v4-v7-v6-v5
                ],
                indices: [
                    0,1,2,
                    0,2,3,
                    4,5,6,
                    4,6,7,
                    8,9,10,
                    8,10,11,
                    12,13,14,
                    12,14,15,
                    16,17,18,
                    16,18,19,
                    20,21,22,
                    20,22,23]
            };
            return new mesh.MeshData(meshDataConf);
        }
    };
})();