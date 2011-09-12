function ArrayBuffer(length) {};
ArrayBuffer.prototype.length = 0;

ArrayBufferView.prototype.buffer = {}; // ArrayBuffer
ArrayBufferView.prototype.byteLength = 0; // readonly
ArrayBufferView.prototype.byteOffset = 0;

function Float32Array(array) {}
function Float32Array(length) {}
function Float32Array(buffer,byteOffset,length) {}

Float32Array.prototype.set = function ( array, offset) {};
Float32Array.prototype.subarray = function ( begin, end) {};
Float32Array.prototype.length = 0;
Float32Array.prototype.BYTES_PER_ELEMENT = 4;


function Int8Array() {};//	1	8-bit twos complement signed integer	signed char
function Uint8Array() {}; //1	8-bit unsigned integer	unsigned char
function Int16Array() {}; //2	16-bit twos complement signed integer	short
function Uint16Array() {}; //2	16-bit unsigned integer	unsigned short
function Int32Array() {}; //4	32-bit twos complement signed integer	int
function Uint32Array() {}; // 4	32-bit unsigned integer	unsigned int
function Float64Array() {};//8	64-bit IEEE floating point number	double