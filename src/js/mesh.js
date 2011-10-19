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

    var mesh = KICK.namespace("KICK.mesh"),
        scene = KICK.namespace("KICK.scene"),
        core = KICK.namespace("KICK.core"),
        math = KICK.namespace("KICK.math"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat4 = KICK.namespace("KICK.math.mat4"),
        constants = KICK.core.Constants,
        DEBUG = constants._DEBUG,
        ASSERT = constants._ASSERT;


    /**
     * Mesh data
     * @class Mesh
     * @namespace KICK.mesh
     */
    mesh.Mesh = function (engine,config) {
        var gl = engine.gl,
            meshVertexAttBuffer,
            meshVertexAttBufferDescription,
            meshVertexIndexBuffer,
            vertexAttributeNames = [],
            buffers = [],
            c = KICK.core.Constants,
            vertexAttrLength,
            thisObj = this,
             /**
             * @method createInterleavedData
             * @private
             */
             createInterleavedData = function () {
                 var lengthOfVertexAttributes = [],
                     names = [],
                     length = 0,
                     data,
                     i,
                     vertexLen = thisObj.vertex.length,
                     index = 0,
                     description = {},
                     addAttributes = function (name,size){
                         if (thisObj[name]){
                             lengthOfVertexAttributes.push(size);
                             names.push(name);
                             description[name] = {
                                 pointer: length*4,
                                 size: size,
                                 normalized: false,
                                 type: KICK.core.Constants.GL_FLOAT
                             };
                             length += size;
                         }
                     };

                 addAttributes("vertex",3);
                 addAttributes("normal",3);
                 addAttributes("uv1",2);
                 addAttributes("uv2",2);
                 addAttributes("tangent",4);
                 addAttributes("color",4);

                 data = new Float32Array(length*vertexLen);
                 for (i=0;i<vertexLen;i++){
                     for (var j=0;j<names.length;j++){
                         var dataSrc = thisObj[names[j]];
                         var dataSrcLen = lengthOfVertexAttributes[j];
                         for (var k=0;k<dataSrcLen;k++){
                             data[index++] = dataSrc[i*dataSrcLen+k];
                         }
                     }
                 }

                 return {
                     vertexAttrLength:length*4,
                     description:description,
                     data:data
                 };
             };
        if (!config) {
            config = {
                name:"Mesh"
            };
        }
        if (c._ASSERT){
            if (config.vertex.length > 65535){
                KICK.core.Util.fail("Mesh overflow");
            }
        }

        /**
         * @property name
         * @type String
         */
        this.name = config.name?config.name:"Mesh";
        /**
         * @property vertex
         * @type Float32Array
         */
        this.vertex = config.vertex?new Float32Array(config.vertex):null;
        /**
         * @property normal
         * @type Float32Array
         */
        this.normal = config.normal?new Float32Array(config.normal):null;
        /**
         * @property uv1
         * @type Float32Array
         */
        this.uv1 = config.uv1?new Float32Array(config.uv1):null;
        /**
         * @property uv2
         * @type Float32Array
         */
        this.uv2 = config.uv2?new Float32Array(config.uv2):null;
        /**
         * A tangent is represented as vec4
         * @property tangent
         * @type Float32Array
         */
        this.tangent = config.tangent?new Float32Array(config.tangent):null;
        /**
         * @property color (RGBA)
         * @type Float32Array
         */
        this.color = config.color?new Float32Array(config.color):null;
        /**
         * @property indices
         * @type Uint16Array
         */
        this.indices = config.indices?new Uint16Array(config.indices):null;
        /**
         * Must be GL_TRIANGLES,GL_TRIANGLE_FAN, or GL_TRIANGLE_STRIP
         * @property meshType
         * @type Number
         */
        this.meshType = config.meshType?config.meshType:constants.GL_TRIANGLES;



        /**
         * This function verifies that the mesh has the vertex attributes (normals, uvs, tangents) that the shader uses.
         * @method verify
         * @param {KICK.material.Shader} shader
         * @return {Array[String]} list of missing vertex attributes in mesh or null if no missing attributes
         */
        this.verify = function (shader){
            var missingVertexAttributes = [],
                found;
            for (var att in shader.lookupAttribute){
                if (typeof (att) === "string"){
                    found = false;
                    for (var i=0;i<vertexAttributeNames.length;i++){
                        if (vertexAttributeNames[i] === att){
                            found = true;
                            break;
                        }
                    }
                    if (!found){
                        missingVertexAttributes.push(att);
                    }
                }
            }
            if (missingVertexAttributes.length===0){
                return null;
            }
            return missingVertexAttributes;
        };

        /**
         * Bind the vertex attributes of the mesh to the shader
         * @method bind
         * @param {KICK.material.Shader} shader
         */
        this.bind = function (shader) {
            shader.bind();

            gl.bindBuffer(constants.GL_ARRAY_BUFFER, meshVertexAttBuffer);

            for (var descName in meshVertexAttBufferDescription) {
                if (typeof(shader.lookupAttribute[descName]) !== 'undefined') {
                    var desc = meshVertexAttBufferDescription[descName];
                    var attributeIndex = shader.lookupAttribute[descName];
                    gl.enableVertexAttribArray(attributeIndex);
                    gl.vertexAttribPointer(attributeIndex, desc.size,
                       desc.type, false, vertexAttrLength, desc.pointer);
                }
            }
            gl.bindBuffer(constants.GL_ELEMENT_ARRAY_BUFFER, meshVertexIndexBuffer);
        };

        /**
         * Renders the current mesh
         * @method render
         */
        this.render = function () {
            gl.drawElements(this.meshType, meshVertexIndexBuffer.numItems, c.GL_UNSIGNED_SHORT, 0);
        };

        /**
         * Combine two meshes and returns the combined mesh as a new Mesh object.<br>
         * The two meshes must have the same meshType. Only vertex attributes existing in
         * both mesh objects are transferred<br>
         * Triangle fans cannot be combined
         * @method combine
         * @param {KICK.scene.Mesh} secondMesh
         * @param {KICK.math.mat4} transform Optional transformation matrix
         * @return {KICK.scene.Mesh} mesh object or null if incompatible objects
         */
        this.combine = function(secondMesh, transform){
            if (this.meshType !== secondMesh.meshType || this.meshType == c.GL_TRIANGLE_FAN){
                if (c._ASSERT){
                    if (this.meshType !== secondMesh.meshType){
                        KICK.core.Util.fail("Mesh.combine does not support different meshTypes");
                    } else {
                        KICK.core.Util.fail("Mesh.combine does not support triangle fans");
                    }
                    return null;
                }
                return null;
            }
            var dataNames = ["vertex","normal","uv1","uv2","tangent","color","indices"];

            for (var i=dataNames.length-1;i>=0;i--){
                var name = dataNames[i];
                if (!this[name] || !secondMesh[name]){
                    dataNames.splice(i,1); // remove dataName from array
                }
            }

            var appendObject = function(config, source, trans,indexOffset){
                for (var i=dataNames.length-1;i>=0;i--){
                    var name = dataNames[i];
                    if (!config[name]){ // if undefined
                        config[name] = KICK.core.Util.typedArrayToArray(source[name]);
                    } else {
                        var data = source[name];
                        if (trans && name === "vertex"){
                            // todo handle vertex normals as well
                            data = new Float32Array(data);
                            var wrappedVec3Array = vec3.wrapArray(data);
                            for (var j=wrappedVec3Array.length-1;j>=0;j--){
                                mat4.multiplyVec3(trans,wrappedVec3Array[j]);
                            }
                        }
                        if (indexOffset && name === "indices"){
                            // take a copy
                            data = new Uint16Array(data);
                            // add offset to copy
                            var len = data.length;
                            for (var j=0;j<len;j++){
                                data[j] += indexOffset;
                            }
                        }
                        for (var j=0;j<data.length;j++){
                            config[name].push(data[j]);
                        }
                    }

                }
            };

            var newConfig = {
                meshType:this.meshType,
                name:this.name+"-"+secondMesh.name
            };

            appendObject(newConfig,this,null,0);
            appendObject(newConfig,secondMesh,transform,this.indices.length);

            if (this.meshType === c.GL_TRIANGLE_STRIP){
                // create two degenerate triangles to connect the two triangle strips
                newConfig.indices.splice(this.indices,0,this.indices,this.indices+1);
            }

            return new mesh.Mesh(engine,newConfig);
        };

        /**
         * Copy data to the vertex buffer object (VBO)
         * @method updateData
         */
        this.updateData = function () {
            var names = ["vertex", "normal", "tangent","uv1","uv2","color"],
                dataLengths = [3,3,3,2,2,4],
                i, buffer, dataLength,
                interleavedData = createInterleavedData(),
                c = KICK.core.Constants;
            meshVertexAttBufferDescription = interleavedData.description;
            vertexAttrLength = interleavedData.vertexAttrLength;
            // delete current buffers
            for (i=buffers.length-1; i >= 0; i--) {
                gl.deleteBuffer(buffers[i]);
            }
            if (typeof meshVertexIndexBuffer === "number"){
                gl.deleteBuffer(meshVertexIndexBuffer);
            }
            if (typeof meshVertexAttBuffer === "number"){
                gl.deleteBuffer(meshVertexAttBuffer);
            }

            vertexAttributeNames = [];
            buffers = [];

            for (i=names.length-1; i >= 0; i--) {
                var name = names[i],
                    data = this[name];
                if (data) {
                    buffer = gl.createBuffer();
                    dataLength = dataLengths[i];
                    gl.bindBuffer(c.GL_ARRAY_BUFFER, buffer);
                    gl.bufferData(c.GL_ARRAY_BUFFER, data, c.GL_STATIC_DRAW);
                    buffer.itemSize = dataLength;
                    buffer.numItems = data.length / dataLength;
                    buffers.push(buffer);
                    vertexAttributeNames.push(name);
                }
            }

            meshVertexAttBuffer = gl.createBuffer();
            gl.bindBuffer(c.GL_ARRAY_BUFFER, meshVertexAttBuffer);
            gl.bufferData(c.GL_ARRAY_BUFFER, interleavedData.data, c.GL_STATIC_DRAW);

            meshVertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(c.GL_ELEMENT_ARRAY_BUFFER, meshVertexIndexBuffer);
            gl.bufferData(c.GL_ELEMENT_ARRAY_BUFFER, this.indices, c.GL_STATIC_DRAW);
            meshVertexIndexBuffer.itemSize = 1;
            meshVertexIndexBuffer.numItems = this.indices.length;
        };

        this.updateData(); // always update data on load
    };

    /**
     * Recalculate the vertex normals based on the triangle normals
     * @method recalculateNormals
     */
    mesh.Mesh.prototype.recalculateNormals = function(){
        var vertexCount = this.vertex.length/3,
            triangleCount = this.indices.length/3,
            triangles = this.indices,
            vertex = vec3.wrapArray(this.vertex),
            a,
            normalArrayRef = {},
            normalArray = vec3.array(vertexCount,normalArrayRef),
            v1v2 = vec3.create(),
            v1v3 = vec3.create(),
            normal = vec3.create();

        for (a=0;a<triangleCount;a++){
            var i1 = triangles[a*3+0],
                i2 = triangles[a*3+1],
                i3 = triangles[a*3+2],

                v1 = vertex[i1],
                v2 = vertex[i2],
                v3 = vertex[i3];
            vec3.subtract(v2,v1,v1v2);
            vec3.subtract(v3,v1,v1v3);
            vec3.cross(v1v2,v1v3,normal);
            vec3.normalize(normal);
            vec3.add(normalArray[i1],normal);
            vec3.add(normalArray[i2],normal);
            vec3.add(normalArray[i3],normal);
        }
        for (a=0;a<vertexCount;a++){
            vec3.normalize(normalArray[a]);
        }
        this.normal =  normalArrayRef.mem;
    };

    /**
     * Recalculates the tangents.
     * Algorithm is based on
     *   Lengyel, Eric. “Computing Tangent Space Basis Vectors for an Arbitrary Mesh”.
     *   Terathon Software 3D Graphics Library, 2001.
     *   http://www.terathon.com/code/tangent.html
     * @method recalculateTangents
     */
    mesh.Mesh.prototype.recalculateTangents = function(){
        var vertex = vec3.wrapArray(this.vertex),
            vertexCount = vertex.length,
            normal = vec3.wrapArray(this.normal),
            texcoord = this.uv1,
            triangle = this.indices,
            triangleCount = triangle.length/3,
            tangent = this.tangent,
            tan1 = vec3.array(vertexCount),
            tan2 = vec3.array(vertexCount),
            a,
            tmp = vec3.create(),
            tmp2 = vec3.create();

        for (a = 0; a < triangleCount; a++)
        {
            var i1 = triangle[a*3+0],
                i2 = triangle[a*3+1],
                i3 = triangle[a*3+2],

                v1 = vertex[i1],
                v2 = vertex[i2],
                v3 = vertex[i3],

                w1 = texcoord[i1],
                w2 = texcoord[i2],
                w3 = texcoord[i3],

                x1 = v2[0] - v1[0],
                x2 = v3[0] - v1[0],
                y1 = v2[1] - v1[1],
                y2 = v3[1] - v1[1],
                z1 = v2[2] - v1[2],
                z2 = v3[2] - v1[2],

                s1 = w2[0] - w1[0],
                s2 = w3[0] - w1[0],
                t1 = w2[1] - w1[1],
                t2 = w3[1] - w1[1],

                r = 1.0 / (s1 * t2 - s2 * t1),
                sdir = vec3.create([(t2 * x1 - t1 * x2) * r,
                    (t2 * y1 - t1 * y2) * r,
                    (t2 * z1 - t1 * z2) * r]),
                tdir = vec3.create([(s1 * x2 - s2 * x1) * r,
                    (s1 * y2 - s2 * y1) * r,
                    (s1 * z2 - s2 * z1) * r]);

            vec3.add(tan1[i1], sdir);
            vec3.add(tan1[i2], sdir);
            vec3.add(tan1[i3], sdir);

            vec3.add(tan2[i1], tdir);
            vec3.add(tan2[i2], tdir);
            vec3.add(tan2[i3], tdir);
        }
        if (!tangent){
            tangent = new Float32Array(vertexCount*4);
            this.tangent = tangent;
        }
        tangent = vec4.wrapArray(tangent);

        for (a = 0; a < vertexCount; a++)
        {
            var n = normal[a];
            var t = tan1[a];

            // Gram-Schmidt orthogonalize
            // tangent[a] = (t - n * Dot(n, t)).Normalize();
            vec3.subtract(t,n,tmp);
            vec3.dot(n,t,tmp2);
            vec3.set(vec3.normalize(vec3.multiply(tmp,tmp2)),tangent[a]);

            // Calculate handedness
            // tangent[a].w = (Dot(Cross(n, t), tan2[a]) < 0.0F) ? -1.0F : 1.0F;
            tangent[a][3] = (vec3.dot(vec3.cross(n, t,vec3.create()), tan2[a]) < 0.0) ? -1.0 : 1.0;
        }
    };
})();