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
/**
 * description _
 * @module KICK
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

    var core = KICK.namespace("KICK.core"),
        ASSERT = constants._ASSERT,
        DEBUG = constants._DEBUG,
        fail = KICK.core.Util.fail;

    /**
     * Chunk data format object
     * @class ChunkData
     * @namespace KICK.core
     * @constructor
     */
    core.ChunkData = function(){
        var MAGIC_NUMBER = 0xF001,
            VERSION_NUMBER = 1,
            Float32ArrayType = 1,
            Float64ArrayType = 2,
            Int16ArrayType = 3,
            Int32ArrayType = 4,
            Int8ArrayType = 5,
            Uint16ArrayType = 6,
            Uint32ArrayType = 7,
            Uint8ArrayType = 8,
            Chunk = function(chunkId,chunkType,chunkDataLength,data){
                this.chunkId = chunkId;
                this.chunkType = chunkType;
                this.chunkDataLength = chunkDataLength; // contains the actual data
                this.data = data; // data is assumed to have the length
            },
            thisObj = this,
            chunks = [],
            /**
             * Return header size in bytes
             * @method getHeaderSize
             * @private
             */
            getHeaderSize = function(){
                return  2+ // magic number
                    2+ // version number
                    4; // number of chunks
            },
            /**
             * Return chunks size in bytes
             * @method
             * @private
             */
            getChunksSize = function(){
                var sum = 0;
                var chunkHeaderLength = 8;
                for (var i=0;i<chunks.length;i++){
                    sum += chunks[i].chunkLength+chunkHeaderLength;
                }
                return sum;
            },
            getType = function(array){
                if (array instanceof Float32Array) return Float32ArrayType;
                if (array instanceof Float64Array) return Float64ArrayType;
                if (array instanceof Int16Array) return Int16ArrayType;
                if (array instanceof Int32Array) return Int32ArrayType;
                if (array instanceof Int8Array) return Int8ArrayType;
                if (array instanceof Uint16Array) return Uint16ArrayType;
                if (array instanceof Uint8Array) return Uint8ArrayType;
                return null;
            };
        /**
         * Size of chunkdata in bytes
         * @method getSize
         */
        this.getSize = function(){
            return getHeaderSize()+getChunksSize()
        };

        this.serialize = function(){
            var output = new ArrayBuffer(thisObj.getSize());
            var byteOffset = 0;
            var uint16View = new Uint16Array(output,byteOffset);
            uint16View[0] = MAGIC_NUMBER;
            uint16View[1] = VERSION_NUMBER;
            byteOffset += 4;
            var uint32View = new Uint32Array(output,byteOffset);
            uint32View[0] = chunks.length;
            byteOffset += 4;
            for (var i=0;i<chunks.length;i++){
                uint16View = new Uint16Array(output,byteOffset);
                uint16View[0] = chunks[i].chunkId;
                uint16View[1] = chunks[i].chunkType;
                byteOffset += 4;
                uint32View = new Uint32Array(output,byteOffset);
                uint32View[1] = chunks[i].chunkDataLength;
                byteOffset += 4;
                chunks[i].set(output,byteOffset);
                byteOffset += chunks[i].chunkLength;
            }
            return output;
        };

        /**
         * @method get
         * @param {Number} chunkid
         * @return TypedArrayView[Number]
         */
        this.get = function(chunkid){
            for (var i=0;i<chunks;i++){
                if (chunks[i].chunkId===chunkid){
                    return chunks[i].data;
                }
            }
            return null;
        };

        /**
         * @method delete
         * @param {Number} chunkid
         * @return Boolean true when deleted
         */
        this.delete = function(chunkid){
            for (var i=0;i<chunks;i++){
                if (chunks[i].chunkId===chunkid){
                    chunks = chunks.splice(i,1);
                    return true;
                }
            }
            return false;
        };

        /**
         * @method set
         * @param {Number} chunkId
         * @param {TypedArrayView[Number]} array
         */
        this.set = function(chunkId, array){
            thisObj.delete(chunkId);
            var chunkType = getType(array);
            if (chunkType){
                var lengthBytes = array.length*array.BYTES_PER_ELEMENT;
                chunks.push(new Chunk(chunkId,chunkType,lengthBytes,array));
            } else if (DEBUG){
                fail("Unsupported array type");
            }
        };

        /**
         * Loads the binary data into the object
         * @param {ArrayBuffer} binaryData
         * @return {boolean} success
         */
        this.deserialize = function(binaryData){
            if (!(binaryData instanceof ArrayBuffer)){
                if (DEBUG){
                    fail("binaryData is not instanceof ArrayBuffer");
                }
                return false;
            }
            var newChunks = [];
            var byteOffset = 0;
            var uint16View = new Uint16Array(binaryData,byteOffset);
            if (uint16View[0] !== MAGIC_NUMBER || uint16View[1] !== VERSION_NUMBER){
                if (DEBUG){
                    if (uint16View[0] !== MAGIC_NUMBER){
                        fail("Invalid magic number");
                    } else {
                        fail("Unsupported version number");
                    }
                }
                return false;
            }
            byteOffset += 4;
            var uint32View = new Uint32Array(binaryData,byteOffset);
            var chunksLength = uint32View[0];
            byteOffset += 4;
            for (var i=0;i<chunksLength;i++){
                uint16View = new Uint16Array(binaryData,byteOffset);
                var chunkId = uint16View[0];
                var chunkType = uint16View[1];
                byteOffset += 4;
                uint32View = new Uint32Array(binaryData,byteOffset);
                var chunkDataLength = uint32View[1];
                byteOffset += 4;
                var data;
                switch (chunkType){
                    case Float32ArrayType:
                        data = new Float32Array(binaryData,byteOffset,chunkDataLength);
                        break;
                    case Float64ArrayType:
                        data = new Float64Array(binaryData,byteOffset,chunkDataLength);
                        break;
                    case Int16ArrayType:
                        data = new Int16Array(binaryData,byteOffset,chunkDataLength);
                        break;
                    case Int32ArrayType:
                        data = new Int32Array(binaryData,byteOffset,chunkDataLength);
                        break;
                    case Int8ArrayType:
                        data = new Int8Array(binaryData,byteOffset,chunkDataLength);
                        break;
                    case Uint16ArrayType:
                        data = new Uint16Array(binaryData,byteOffset,chunkDataLength);
                        break;
                    case Uint32ArrayType:
                        data = new Uint32Array(binaryData,byteOffset,chunkDataLength);
                        break;
                    case Uint8ArrayType:
                        data = new Uint8Array(binaryData,byteOffset,chunkDataLength);
                        break;
                    default:
                        if (DEBUG){
                            fail("Unknown chunk type "+chunkType);
                        }
                        return false;
                }
                newChunks.push(new Chunk(chunkId,chunkType,chunkDataLength,data));
                byteOffset += chunkDataLength;
            }
            chunks = newChunks;
            return true;
        };
    };
}());