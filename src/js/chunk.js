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
        utf8Decode = core.Util.utf8Decode,
        utf8Encode = core.Util.utf8Encode,
        constants = KICK.core.Constants,
        ASSERT = constants._ASSERT,
        DEBUG = constants._DEBUG,
        fail = KICK.core.Util.fail,
        paddingArray = new Uint8Array(4);

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
                var thisObj = this;
                this.chunkId = chunkId;
                this.chunkType = chunkType;
                this.chunkDataLength = chunkDataLength; // contains the actual data
                this.data = data; // data is assumed to have the length
                Object.defineProperties(this,{
                    paddingSize:{
                        get:function(){
                            var dataSize = thisObj.data.length*thisObj.data.BYTES_PER_ELEMENT;
                            var dataSizeMod4 = dataSize%4;
                            if (dataSizeMod4){
                                return 4-dataSizeMod4;
                            }
                            return 0;
                        }
                    },
                    paddingData:{
                        get:function(){
                            return paddingArray.subarray(0,thisObj.paddingSize);
                        }
                    }
                });
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
                    sum += chunks[i].chunkDataLength +
                        chunkHeaderLength +
                        chunks[i].paddingSize;
                }
                return sum;
            },
            getTypeEnum = function(array){
                if (array instanceof Float32Array) return Float32ArrayType;
                if (array instanceof Float64Array) return Float64ArrayType;
                if (array instanceof Int16Array) return Int16ArrayType;
                if (array instanceof Int32Array) return Int32ArrayType;
                if (array instanceof Int8Array) return Int8ArrayType;
                if (array instanceof Uint16Array) return Uint16ArrayType;
                if (array instanceof Uint8Array) return Uint8ArrayType;
                return null;
            },
            getTypeClass = function(id){
                if (id === Float32ArrayType) return Float32Array;
                if (id === Float64ArrayType) return Float64Array;
                if (id === Int16ArrayType) return Int16Array;
                if (id === Int32ArrayType) return Int32Array;
                if (id === Int8ArrayType) return Int8Array;
                if (id === Uint16ArrayType) return Uint16Array;
                if (id === Uint8ArrayType) return Uint8Array;
                return null;
            };
        /**
         * Size of chunkdata in bytes
         * @method getSize
         */
        this.getSize = function(){
            return getHeaderSize()+getChunksSize()
        };

        /**
         * @method serialize
         * @return ArrayBuffer
         */
        this.serialize = function(){
            var output = new ArrayBuffer(thisObj.getSize());
            var byteOffset = 0;
            var uint8View = new Uint8Array(output,0);
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
                uint32View[0] = chunks[i].chunkDataLength;
                byteOffset += 4;
                var viewType = getTypeClass(chunks[i].chunkType);
                var view = new viewType(output);
                view.set(chunks[i].data,byteOffset/view.BYTES_PER_ELEMENT);
                byteOffset += chunks[i].chunkDataLength;

                uint8View.set(chunks[i].paddingData,byteOffset); // write padding data
                byteOffset += chunks[i].paddingSize;
            }
            return output;
        };

        /**
         * @method get
         * @param {Number} chunkid
         * @return TypedArrayView[Number]
         */
        this.get = function(chunkid){
            for (var i=0;i<chunks.length;i++){
                if (chunks[i].chunkId===chunkid){
                    return chunks[i].data;
                }
            }
            return null;
        };
        /**
         * @method getString
         * @param {Number} chunkid
         * @return String or null
         */
        this.getString = function(chunkid){
            var value = thisObj.get(chunkid);
            if (value){
                return utf8Decode(value);
            }
            return null;
        };


        /**
         * @method remove
         * @param {Number} chunkid
         * @return Boolean true when deleted
         */
        this.remove = function(chunkid){
            for (var i=0;i<chunks.length;i++){
                if (chunks[i].chunkId===chunkid){
                    chunks = chunks.splice(i,1);
                    return true;
                }
            }
            return false;
        };

        /**
         * @method setString
         * @param {String} str
         * @param {TypedArrayView[Number]} array
         */
        this.setString = function(chunkId, str){
            var array = utf8Encode(str);
            thisObj.set(chunkId,array);
        };

        /**
         * Note that this method saves a reference to the array (it does not copy data)
         * @method set
         * @param {Number} chunkId
         * @param {TypedArrayView[Number]} array
         */
        this.set = function(chunkId, array){
            thisObj.remove(chunkId);
            var chunkType = getTypeEnum(array);
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
                var chunkDataLength = uint32View[0];
                byteOffset += 4;
                var dataType = getTypeClass(chunkType);
                var data = new dataType(binaryData,byteOffset,chunkDataLength/dataType.BYTES_PER_ELEMENT);
                var chunk = new Chunk(chunkId,chunkType,chunkDataLength,data);
                newChunks.push(chunk);
                byteOffset += chunkDataLength;
                byteOffset += chunk.paddingSize; // skip padding data
            }
            chunks = newChunks;
            return true;
        };
    };
}());