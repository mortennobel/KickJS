
var KICK = KICK || {};

KICK.namespace = KICK.namespace || function (ns_string) {
    var parts = ns_string.split("."),
        parent = KICK,
        i;
    // strip redundant leading global
    if (parts[0] === "KICK") {
        parts = parts.slice(1);
    }

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

    var scene = KICK.namespace("KICK.scene"),
        math = KICK.namespace("KICK.math"),
        vec3 = math.vec3;

    /**
     * Class responsible for creating Mesh objects
     * @class MeshFactory
     * @namespace KICK.scene
     * @static
     */
    scene.MeshFactory = {};

    /**
     * Creates a triangle in the XY plane
     * @method createTriangle
     * @static
     * @param {KICK.core.Engine} engine
     * @return {KICK.core.Mesh} triangle mesh
     */
    scene.MeshFactory.createTriangle = function (engine) {
        var config = {
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
        };
        return new scene.Mesh(engine,config);
    };

    /**
     * Creates a Ocosphere with center in the origin. The Icosphere is UV mapped using spheremapping.
     * The mesh objects has also UVs and normals attributes.
     * @method createIcosphere
     * @static
     * @param {KICK.core.Engine} engine
     * @param {Number} subdivisions Optional, Number of subdivisions in sphere. Default value is 2
     * @param {Number} radius Optional, 1 is default
     * @return {KICK.scene.Mesh} Icopphere
     */
    scene.MeshFactory.createIcosphere = function (engine,subdivisions,radius) {
        var vertex = [],
            uv1 = [],
            normal = [],
            indices = [],
            X = .525731112119133606,
            Z = .850650808352039932,
            vec3c = math.vec3.create,
            i = 0;
        var vdata = [[-X, 0.0, Z], [X, 0.0, Z], [-X, 0.0, -Z], [X, 0.0, -Z],
            [0.0, Z, X], [0.0, Z, -X], [0.0, -Z, X], [0.0, -Z, -X],
            [Z, X, 0.0], [-Z, X, 0.0], [Z, -X, 0.0], [-Z, -X, 0.0]
        ];
        var tindices = [
            [0,4,1],  [0,9,4],  [9,5,4], [4,5,8], [4,8,1],
            [8,10,1], [8,3,10], [5,3,8], [5,2,3], [2,7,3],
            [7,10,3], [7,6,10], [7,11,6], [11,0,6], [0,1,6],
            [6,1,10], [9,0,11], [9,11,2], [9,2,5], [7,2,11]];

        // http://www.mvps.org/directx/articles/spheremap.htm
        function sphereMapping(a){
            return [
                Math.asin(a[0])/Math.PI+0.5,
                Math.asin(a[1])/Math.PI+0.5
            ];
        }

        function indexOf(array,data){
            for (var i=array.length-1;i>=0;i--){
                if (array[i][0] === data[0] &&
                    array[i][1] === data[1] &&
                    array[i][2] === data[2]){
                    return i;
                }
            }
            return -1;
        }

        function addtri(n){
            var indexOfN = indexOf(normal,n);
            if (indexOfN !== -1){
                indices.push(indexOfN);
            } else {
                indices.push(normal.length);

                normal.push(n);
                vertex.push(vec3.scale(n,radius,vec3c()));
                uv1.push(sphereMapping(n));
            }
        }

        // based on the code in the OpenGL red book (chapter 2, the example at the end)
        function drawtri(a, b, c, div){
            var divMinusOne = div-1;
            if (div<=0) {
                addtri(a);
                addtri(c);
                addtri(b);
            } else {
                var ab = vec3c(),
                    ac = vec3c(),
                    bc = vec3c();
                for (var i=0;i<3;i++) {
                    ab=vec3.scale(vec3.add(a,b,vec3c()),0.5);
                    ac=vec3.scale(vec3.add(a,c,vec3c()),0.5);
                    bc=vec3.scale(vec3.add(b,c,vec3c()),0.5);
                }
                ab = vec3.normalize(ab);
                ac = vec3.normalize(ac);
                bc = vec3.normalize(bc);
                drawtri(a, ab, ac, divMinusOne);
                drawtri(b, bc, ab, divMinusOne);
                drawtri(c, ac, bc, divMinusOne);
                drawtri(ab, bc, ac, divMinusOne);
            }
        }
        if (typeof subdivisions !== "number"){
            subdivisions = 2;
        }
        if (typeof radius !== "number"){
            radius = 1;
        }

        for (i=0;i<tindices.length;i++) {
            drawtri(vdata[tindices[i][0]], vdata[tindices[i][1]], vdata[tindices[i][2]], subdivisions);
        }

        var allVertices = [];
        var allUv1 = [];
        var allNormals = [];
        for (i=0;i<normal.length;i++){
            for (var j=0;j<3;j++){
                allVertices.push(vertex[i][j]);
                allNormals.push(normal[i][j]);
                if (j<2){
                    allUv1.push(uv1[i][j]);
                }
            }
        }

        var config = {
            name: "Icosphere",
            vertex: allVertices,
            uv1: allUv1,
            normal: allNormals,
            indices:indices
        };
        return new scene.Mesh(engine,config);
    };

    /**
     * Create a plane in the XY plane (made of two triangles). The mesh objects has UVs and normals attributes.
     * @method createPlane
     * @static
     * @param {KICK.core.Engine} engine
     * @return {KICK.scene.Mesh} plane mesh
     */
    scene.MeshFactory.createPlane = function (engine) {
        var config = {
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
        };
        return new scene.Mesh(engine,config);
    };

    /**
     * Create a code of size length. The cube has colors, normals and UVs.
     * @method createCube
     * @static
     * @param {KICK.core.Engine} engine
     * @param {Number} length Optional, default value is 1.0
     * @return {KICK.scene.Mesh} cube mesh
     */
    scene.MeshFactory.createCube = function (engine,length) {
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
        var config = {
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
                1,1,
                1,0,
                1,0,                    // v0-v1-v2-v3
                1,1,
                1,0,
                0,0,
                0,1,              // v0-v3-v4-v5
                1,1,
                0,1,
                0,1,
                1,1,              // v0-v5-v6-v1
                1,1,
                0,1,
                0,0,
                1,0,              // v1-v6-v7-v2
                0,0,
                0,0,
                1,0,
                1,0,              // v7-v4-v3-v2
                0,0,
                0,0,
                0,1,
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
            indices: [0,1,2,
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
        return new scene.Mesh(engine,config);
    };
})();