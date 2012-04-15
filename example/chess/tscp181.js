// The following code is crosscompiled from the chess engine TSCP (C++).
// The code is used by permission from Tom Kerrigan
//
// License
//
// TSCP is copyrighted. You have my permission to download it, look at the code, and run it. If you want to do anything else with TSCP you must get my explicit permission. This includes redistributing TSCP, creating a derivative work, or using any of its code for any reason.
//
// To get permission, just e-mail me at tom.kerrigan@gmail.com. As long as you aren't trying to proft off my work or take credit for it, I will almost certainly give you permission.

// Note: Some Emscripten settings will significantly limit the speed of the generated code.
// Note: Some Emscripten settings may limit the speed of the generated code.
// TODO: " u s e   s t r i c t ";


// *** Environment setup code ***
var arguments_ = [];

var ENVIRONMENT_IS_NODE = typeof process === 'object';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  print = function(x) {
    process['stdout'].write(x + '\n');
  };
  printErr = function(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');

  read = function(filename) {
    var ret = nodeFS['readFileSync'](filename).toString();
    if (!ret && filename[0] != '/') {
      filename = __dirname.split('/').slice(0, -1).join('/') + '/src/' + filename;
      ret = nodeFS['readFileSync'](filename).toString();
    }
    return ret;
  };

  load = function(f) {
    globalEval(read(f));
  };

  arguments_ = process['argv'].slice(2);

} else if (ENVIRONMENT_IS_SHELL) {
  // Polyfill over SpiderMonkey/V8 differences
  if (!this['read']) {
    this['read'] = function(f) { snarf(f) };
  }

  if (!this['arguments']) {
    arguments_ = scriptArgs;
  } else {
    arguments_ = arguments;
  }

} else if (ENVIRONMENT_IS_WEB) {
  this['print'] = printErr = function(x) {
    console.log(x);
  };

  this['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (this['arguments']) {
    arguments_ = arguments;
  }
} else if (ENVIRONMENT_IS_WORKER) {
  // We can do very little here...

  this['load'] = importScripts;

} else {
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}

if (typeof load == 'undefined' && typeof read != 'undefined') {
  this['load'] = function(f) {
    globalEval(read(f));
  };
}

if (typeof printErr === 'undefined') {
  this['printErr'] = function(){};
}

if (typeof print === 'undefined') {
  this['print'] = printErr;
}
// *** Environment setup code ***


try {
  this['Module'] = Module;
} catch(e) {
  this['Module'] = Module = {};
}
if (!Module.arguments) {
  Module.arguments = arguments_;
}
if (Module.print) {
  print = Module.print;
}

  
// Warning: .ll contains i64 or double values. These 64-bit values are dangerous in USE_TYPED_ARRAYS == 2. We store i64 as i32, and double as float. This can cause serious problems!
// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (/^\[\d+\ x\ (.*)\]/.test(type)) return true; // [15 x ?] blocks. Like structs
  if (/<?{ [^}]* }>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  bitshift64: function (low, high, op, bits) {
    var ander = Math.pow(2, bits)-1;
    if (bits < 32) {
      switch (op) {
        case 'shl':
          return [low << bits, (high << bits) | ((low&(ander << (32 - bits))) >>> (32 - bits))];
        case 'ashr':
          return [(((low >>> bits ) | ((high&ander) << (32 - bits))) >> 0) >>> 0, (high >> bits) >>> 0];
        case 'lshr':
          return [((low >>> bits) | ((high&ander) << (32 - bits))) >>> 0, high >>> bits];
      }
    } else if (bits == 32) {
      switch (op) {
        case 'shl':
          return [0, low];
        case 'ashr':
          return [high, (high|0) < 0 ? ander : 0];
        case 'lshr':
          return [high, 0];
      }
    } else { // bits > 32
      switch (op) {
        case 'shl':
          return [0, low << (bits - 32)];
        case 'ashr':
          return [(high >> (bits - 32)) >>> 0, (high|0) < 0 ? ander : 0];
        case 'lshr':
          return [high >>>  (bits - 32) , 0];
      }
    }
    abort('unknown bitshift64 op: ' + [value, op, bits]);
  },
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type[type.length-1] == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map(function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = size;
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Types.types[field].alignSize;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      alignSize = type.packed ? 1 : Math.min(alignSize, Runtime.QUANTUM_SIZE);
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      assert(type.fields.length === struct.length, 'Number of named fields must match the type for ' + typeName);
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  stackAlloc: function stackAlloc(size) { var ret = STACKTOP;STACKTOP += size;STACKTOP = ((((STACKTOP)+3)>>2)<<2);assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"); return ret; },
  staticAlloc: function staticAlloc(size) { var ret = STATICTOP;STATICTOP += size;STATICTOP = ((((STATICTOP)+3)>>2)<<2); if (STATICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function alignMemory(size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 4))*(quantum ? quantum : 4); return ret; },
  makeBigInt: function makeBigInt(low,high,unsigned) { var ret = (unsigned ? (((low)>>>0)+(((high)>>>0)*4294967296)) : (((low)>>>0)+(((high)|0)*4294967296))); return ret; },
  QUANTUM_SIZE: 4,
  __dummy__: 0
}



var CorrectionsMonitor = {
  MAX_ALLOWED: 0, // XXX
  corrections: 0,
  sigs: {},

  note: function(type, succeed, sig) {
    if (!succeed) {
      this.corrections++;
      if (this.corrections >= this.MAX_ALLOWED) abort('\n\nToo many corrections!');
    }
  },

  print: function() {
  }
};





//========================================
// Runtime essentials
//========================================

var __THREW__ = false; // Used in checking for thrown exceptions.

var ABORT = false;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;

function abort(text) {
  print(text + ':\n' + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Adding
//
//         __attribute__((used))
//
//       to the function definition will prevent that.
//
// Note: Closure optimizations will minify function names, making
//       functions no longer callable. If you run closure (on by default
//       in -O2 and above), you should export the functions you will call
//       by calling emcc with something like
//
//         -s EXPORTED_FUNCTIONS='["_func1","_func2"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number' or 'string' (use 'number' for any C pointer).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType.
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  function toC(value, type) {
    if (type == 'string') {
      var ret = STACKTOP;
      Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    return value;
  }
  try {
    var func = eval('_' + ident);
  } catch(e) {
    try {
      func = globalScope['Module']['_' + ident]; // closure exported function
    } catch(e) {}
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  return fromC(func.apply(null, cArgs), returnType);
}
Module["ccall"] = ccall;

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  // TODO: optimize this, eval the whole function once instead of going through ccall each time
  return function() {
    return ccall(ident, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type[type.length-1] === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': HEAP32[((ptr)>>2)]=value; break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': (tempDoubleF64[0]=value,HEAP32[((ptr)>>2)]=tempDoubleI32[0],HEAP32[((ptr+4)>>2)]=tempDoubleI32[1]); break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type[type.length-1] === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return (tempDoubleI32[0]=HEAP32[((ptr)>>2)],tempDoubleI32[1]=HEAP32[((ptr+4)>>2)],tempDoubleF64[0]);
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

// Allocates memory for some data and initializes it properly.

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;

function allocate(slab, types, allocator) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));

  if (zeroinit) {
      _memset(ret, 0, size);
      return ret;
  }
  
  var i = 0, type;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);
    i += Runtime.getNativeTypeSize(type);
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  var nullTerminated = typeof(length) == "undefined";
  var ret = "";
  var i = 0;
  var t;
  var nullByte = String.fromCharCode(0);
  while (1) {
    t = String.fromCharCode(HEAPU8[(ptr+i)]);
    if (nullTerminated && t == nullByte) { break; } else {}
    ret += t;
    i += 1;
    if (!nullTerminated && i == length) { break; }
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

function Array_stringify(array) {
  var ret = "";
  for (var i = 0; i < array.length; i++) {
    ret += String.fromCharCode(array[i]);
  }
  return ret;
}
Module['Array_stringify'] = Array_stringify;

// Memory management

var FUNCTION_TABLE; // XXX: In theory the indexes here can be equal to pointers to stacked or malloced memory. Such comparisons should
                    //      be false, but can turn out true. We should probably set the top bit to prevent such issues.

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32;

var STACK_ROOT, STACKTOP, STACK_MAX;
var STATICTOP;
function enlargeMemory() {
  // TOTAL_MEMORY is the current size of the actual array, and STATICTOP is the new top.
  printErr('Warning: Enlarging memory arrays, this is not fast! ' + [STATICTOP, TOTAL_MEMORY]);
  assert(STATICTOP >= TOTAL_MEMORY);
  assert(TOTAL_MEMORY > 4); // So the loop below will not be infinite
  while (TOTAL_MEMORY <= STATICTOP) { // Simple heuristic. Override enlargeMemory() if your program has something more optimal for it
    TOTAL_MEMORY = alignMemoryPage(2*TOTAL_MEMORY);
  }
  var oldHEAP8 = HEAP8;
  var buffer = new ArrayBuffer(TOTAL_MEMORY);
  HEAP8 = new Int8Array(buffer);
  HEAP16 = new Int16Array(buffer);
  HEAP32 = new Int32Array(buffer);
  HEAPU8 = new Uint8Array(buffer);
  HEAPU16 = new Uint16Array(buffer);
  HEAPU32 = new Uint32Array(buffer);
  HEAPF32 = new Float32Array(buffer);
  HEAP8.set(oldHEAP8);
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 10485760;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
  assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
         'Cannot fallback to non-typed array case: Code is too specialized');

  var buffer = new ArrayBuffer(TOTAL_MEMORY);
  HEAP8 = new Int8Array(buffer);
  HEAP16 = new Int16Array(buffer);
  HEAP32 = new Int32Array(buffer);
  HEAPU8 = new Uint8Array(buffer);
  HEAPU16 = new Uint16Array(buffer);
  HEAPU32 = new Uint32Array(buffer);
  HEAPF32 = new Float32Array(buffer);

  // Endianness check (note: assumes compiler arch was little-endian)
  HEAP32[0] = 255;
  assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

var base = intArrayFromString('(null)'); // So printing %s of NULL gives '(null)'
                                         // Also this ensures we leave 0 as an invalid address, 'NULL'
STATICTOP = base.length;
for (var i = 0; i < base.length; i++) {
  HEAP8[(i)]=base[i]
}

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;

STACK_ROOT = STACKTOP = Runtime.alignMemory(STATICTOP);
STACK_MAX = STACK_ROOT + TOTAL_STACK;

var tempDoublePtr = Runtime.alignMemory(STACK_MAX, 8);
var tempDoubleI8  = HEAP8.subarray(tempDoublePtr);
var tempDoubleI32 = HEAP32.subarray(tempDoublePtr >> 2);
var tempDoubleF32 = HEAPF32.subarray(tempDoublePtr >> 2);
var tempDoubleF64 = new Float64Array(HEAP8.buffer).subarray(tempDoublePtr >> 3);
function copyTempFloat(ptr) { // functions, because inlining this code is increases code size too much
  tempDoubleI8[0] = HEAP8[ptr];
  tempDoubleI8[1] = HEAP8[ptr+1];
  tempDoubleI8[2] = HEAP8[ptr+2];
  tempDoubleI8[3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  tempDoubleI8[0] = HEAP8[ptr];
  tempDoubleI8[1] = HEAP8[ptr+1];
  tempDoubleI8[2] = HEAP8[ptr+2];
  tempDoubleI8[3] = HEAP8[ptr+3];
  tempDoubleI8[4] = HEAP8[ptr+4];
  tempDoubleI8[5] = HEAP8[ptr+5];
  tempDoubleI8[6] = HEAP8[ptr+6];
  tempDoubleI8[7] = HEAP8[ptr+7];
}
STACK_MAX = tempDoublePtr + 8;

STATICTOP = alignMemoryPage(STACK_MAX);

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    var func = callback.func;
    if (typeof func === 'number') {
      func = FUNCTION_TABLE[func];
    }
    func(callback.arg === undefined ? null : callback.arg);
  }
}

var __ATINIT__ = []; // functions called during startup
var __ATEXIT__ = []; // functions called during shutdown

function initRuntime() {
  callRuntimeCallbacks(__ATINIT__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);

  // Print summary of correction activity
  CorrectionsMonitor.print();
}


// Copies a list of num items on the HEAP into a
// a normal JavaScript array of numbers
function Array_copy(ptr, num) {
  return Array.prototype.slice.call(HEAP8.subarray(ptr, ptr+num)); // Make a normal array out of the typed 'view'
                                                                   // Consider making a typed array here, for speed?
  return HEAP.slice(ptr, ptr+num);
}
Module['Array_copy'] = Array_copy;

// Copies a list of num items on the HEAP into a
// JavaScript typed array.
function TypedArray_copy(ptr, num) {
  // TODO: optimize this!
  var arr = new Uint8Array(num);
  for (var i = 0; i < num; ++i) {
    arr[i] = HEAP8[(ptr+i)];
  }
  return arr.buffer;
}
Module['TypedArray_copy'] = TypedArray_copy;

function String_len(ptr) {
  var i = 0;
  while (HEAP8[(ptr+i)]) i++; // Note: should be |!= 0|, technically. But this helps catch bugs with undefineds
  return i;
}
Module['String_len'] = String_len;

// Copies a C-style string, terminated by a zero, from the HEAP into
// a normal JavaScript array of numbers
function String_copy(ptr, addZero) {
  var len = String_len(ptr);
  if (addZero) len++;
  var ret = Array_copy(ptr, len);
  if (addZero) ret[len-1] = 0;
  return ret;
}
Module['String_copy'] = String_copy;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull) {
  var ret = [];
  var t;
  var i = 0;
  while (i < stringy.length) {
    var chr = stringy.charCodeAt(i);
    if (chr > 0xFF) {
        assert(false, 'Character code ' + chr + ' (' + stringy[i] + ')  at offset ' + i + ' not in 0x00-0xFF.');
      chr &= 0xFF;
    }
    ret.push(chr);
    i = i + 1;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var i = 0;
  while (i < string.length) {
    var chr = string.charCodeAt(i);
    if (chr > 0xFF) {
        assert(false, 'Character code ' + chr + ' (' + string[i] + ')  at offset ' + i + ' not in 0x00-0xFF.');
      chr &= 0xFF;
    }
    HEAP8[(buffer+i)]=chr
    i = i + 1;
  }
  if (!dontAddNull) {
    HEAP8[(buffer+i)]=0
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

var STRING_TABLE = [];

function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
  // TODO: clean up previous line
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// === Body ===




function _set_hash() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      HEAP32[((_hash)>>2)]=0;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $2=$i;
      var $3=(($2)|0) < 64;
      if ($3) { __label__ = 3; break; } else { __label__ = 7; break; }
    case 3: 
      var $5=$i;
      var $6=((_color+($5<<2))|0);
      var $7=HEAP32[(($6)>>2)];
      var $8=(($7)|0)!=6;
      if ($8) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $10=$i;
      var $11=$i;
      var $12=((_piece+($11<<2))|0);
      var $13=HEAP32[(($12)>>2)];
      var $14=$i;
      var $15=((_color+($14<<2))|0);
      var $16=HEAP32[(($15)>>2)];
      var $17=((_hash_piece+$16*1536)|0);
      var $18=(($17+($13<<8))|0);
      var $19=(($18+($10<<2))|0);
      var $20=HEAP32[(($19)>>2)];
      var $21=HEAP32[((_hash)>>2)];
      var $22=$21 ^ $20;
      HEAP32[((_hash)>>2)]=$22;
      __label__ = 5; break;
    case 5: 
      __label__ = 6; break;
    case 6: 
      var $25=$i;
      var $26=(($25+1)|0);
      $i=$26;
      __label__ = 2; break;
    case 7: 
      var $28=HEAP32[((_side)>>2)];
      var $29=(($28)|0)==1;
      if ($29) { __label__ = 8; break; } else { __label__ = 9; break; }
    case 8: 
      var $31=HEAP32[((_hash_side)>>2)];
      var $32=HEAP32[((_hash)>>2)];
      var $33=$32 ^ $31;
      HEAP32[((_hash)>>2)]=$33;
      __label__ = 9; break;
    case 9: 
      var $35=HEAP32[((_ep)>>2)];
      var $36=(($35)|0)!=-1;
      if ($36) { __label__ = 10; break; } else { __label__ = 11; break; }
    case 10: 
      var $38=HEAP32[((_ep)>>2)];
      var $39=((_hash_ep+($38<<2))|0);
      var $40=HEAP32[(($39)>>2)];
      var $41=HEAP32[((_hash)>>2)];
      var $42=$41 ^ $40;
      HEAP32[((_hash)>>2)]=$42;
      __label__ = 11; break;
    case 11: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_set_hash["X"]=1;

function _attack($sq, $s) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $3;
      var $i;
      var $j;
      var $n;
      $2=$sq;
      $3=$s;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $5=$i;
      var $6=(($5)|0) < 64;
      if ($6) { __label__ = 3; break; } else { __label__ = 39; break; }
    case 3: 
      var $8=$i;
      var $9=((_color+($8<<2))|0);
      var $10=HEAP32[(($9)>>2)];
      var $11=$3;
      var $12=(($10)|0)==(($11)|0);
      if ($12) { __label__ = 4; break; } else { __label__ = 37; break; }
    case 4: 
      var $14=$i;
      var $15=((_piece+($14<<2))|0);
      var $16=HEAP32[(($15)>>2)];
      var $17=(($16)|0)==0;
      if ($17) { __label__ = 5; break; } else { __label__ = 21; break; }
    case 5: 
      var $19=$3;
      var $20=(($19)|0)==0;
      if ($20) { __label__ = 6; break; } else { __label__ = 13; break; }
    case 6: 
      var $22=$i;
      var $23=$22 & 7;
      var $24=(($23)|0)!=0;
      if ($24) { __label__ = 7; break; } else { __label__ = 9; break; }
    case 7: 
      var $26=$i;
      var $27=(($26-9)|0);
      var $28=$2;
      var $29=(($27)|0)==(($28)|0);
      if ($29) { __label__ = 8; break; } else { __label__ = 9; break; }
    case 8: 
      $1=1;
      __label__ = 40; break;
    case 9: 
      var $32=$i;
      var $33=$32 & 7;
      var $34=(($33)|0)!=7;
      if ($34) { __label__ = 10; break; } else { __label__ = 12; break; }
    case 10: 
      var $36=$i;
      var $37=(($36-7)|0);
      var $38=$2;
      var $39=(($37)|0)==(($38)|0);
      if ($39) { __label__ = 11; break; } else { __label__ = 12; break; }
    case 11: 
      $1=1;
      __label__ = 40; break;
    case 12: 
      __label__ = 20; break;
    case 13: 
      var $43=$i;
      var $44=$43 & 7;
      var $45=(($44)|0)!=0;
      if ($45) { __label__ = 14; break; } else { __label__ = 16; break; }
    case 14: 
      var $47=$i;
      var $48=(($47+7)|0);
      var $49=$2;
      var $50=(($48)|0)==(($49)|0);
      if ($50) { __label__ = 15; break; } else { __label__ = 16; break; }
    case 15: 
      $1=1;
      __label__ = 40; break;
    case 16: 
      var $53=$i;
      var $54=$53 & 7;
      var $55=(($54)|0)!=7;
      if ($55) { __label__ = 17; break; } else { __label__ = 19; break; }
    case 17: 
      var $57=$i;
      var $58=(($57+9)|0);
      var $59=$2;
      var $60=(($58)|0)==(($59)|0);
      if ($60) { __label__ = 18; break; } else { __label__ = 19; break; }
    case 18: 
      $1=1;
      __label__ = 40; break;
    case 19: 
      __label__ = 20; break;
    case 20: 
      __label__ = 36; break;
    case 21: 
      $j=0;
      __label__ = 22; break;
    case 22: 
      var $66=$j;
      var $67=$i;
      var $68=((_piece+($67<<2))|0);
      var $69=HEAP32[(($68)>>2)];
      var $70=((_offsets+($69<<2))|0);
      var $71=HEAP32[(($70)>>2)];
      var $72=(($66)|0) < (($71)|0);
      if ($72) { __label__ = 23; break; } else { __label__ = 35; break; }
    case 23: 
      var $74=$i;
      $n=$74;
      __label__ = 24; break;
    case 24: 
      var $76=$n;
      var $77=((_mailbox64+($76<<2))|0);
      var $78=HEAP32[(($77)>>2)];
      var $79=$j;
      var $80=$i;
      var $81=((_piece+($80<<2))|0);
      var $82=HEAP32[(($81)>>2)];
      var $83=((_offset+($82<<5))|0);
      var $84=(($83+($79<<2))|0);
      var $85=HEAP32[(($84)>>2)];
      var $86=(($78+$85)|0);
      var $87=((_mailbox+($86<<2))|0);
      var $88=HEAP32[(($87)>>2)];
      $n=$88;
      var $89=$n;
      var $90=(($89)|0)==-1;
      if ($90) { __label__ = 25; break; } else { __label__ = 26; break; }
    case 25: 
      __label__ = 33; break;
    case 26: 
      var $93=$n;
      var $94=$2;
      var $95=(($93)|0)==(($94)|0);
      if ($95) { __label__ = 27; break; } else { __label__ = 28; break; }
    case 27: 
      $1=1;
      __label__ = 40; break;
    case 28: 
      var $98=$n;
      var $99=((_color+($98<<2))|0);
      var $100=HEAP32[(($99)>>2)];
      var $101=(($100)|0)!=6;
      if ($101) { __label__ = 29; break; } else { __label__ = 30; break; }
    case 29: 
      __label__ = 33; break;
    case 30: 
      var $104=$i;
      var $105=((_piece+($104<<2))|0);
      var $106=HEAP32[(($105)>>2)];
      var $107=((_slide+($106<<2))|0);
      var $108=HEAP32[(($107)>>2)];
      var $109=(($108)|0)!=0;
      if ($109) { __label__ = 32; break; } else { __label__ = 31; break; }
    case 31: 
      __label__ = 33; break;
    case 32: 
      __label__ = 24; break;
    case 33: 
      __label__ = 34; break;
    case 34: 
      var $114=$j;
      var $115=(($114+1)|0);
      $j=$115;
      __label__ = 22; break;
    case 35: 
      __label__ = 36; break;
    case 36: 
      __label__ = 37; break;
    case 37: 
      __label__ = 38; break;
    case 38: 
      var $120=$i;
      var $121=(($120+1)|0);
      $i=$121;
      __label__ = 2; break;
    case 39: 
      $1=0;
      __label__ = 40; break;
    case 40: 
      var $124=$1;
      ;
      return $124;
    default: assert(0, "bad label: " + __label__);
  }
}
_attack["X"]=1;

function _init_board() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $2=$i;
      var $3=(($2)|0) < 64;
      if ($3) { __label__ = 3; break; } else { __label__ = 5; break; }
    case 3: 
      var $5=$i;
      var $6=((_init_color+($5<<2))|0);
      var $7=HEAP32[(($6)>>2)];
      var $8=$i;
      var $9=((_color+($8<<2))|0);
      HEAP32[(($9)>>2)]=$7;
      var $10=$i;
      var $11=((_init_piece+($10<<2))|0);
      var $12=HEAP32[(($11)>>2)];
      var $13=$i;
      var $14=((_piece+($13<<2))|0);
      HEAP32[(($14)>>2)]=$12;
      __label__ = 4; break;
    case 4: 
      var $16=$i;
      var $17=(($16+1)|0);
      $i=$17;
      __label__ = 2; break;
    case 5: 
      HEAP32[((_side)>>2)]=0;
      HEAP32[((_xside)>>2)]=1;
      HEAP32[((_castle)>>2)]=15;
      HEAP32[((_ep)>>2)]=-1;
      HEAP32[((_fifty)>>2)]=0;
      HEAP32[((_ply)>>2)]=0;
      HEAP32[((_hply)>>2)]=0;
      _set_hash();
      HEAP32[((((_first_move)|0))>>2)]=0;
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}


function _init_hash() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      var $j;
      var $k;
      _srand(0);
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $2=$i;
      var $3=(($2)|0) < 2;
      if ($3) { __label__ = 3; break; } else { __label__ = 13; break; }
    case 3: 
      $j=0;
      __label__ = 4; break;
    case 4: 
      var $6=$j;
      var $7=(($6)|0) < 6;
      if ($7) { __label__ = 5; break; } else { __label__ = 11; break; }
    case 5: 
      $k=0;
      __label__ = 6; break;
    case 6: 
      var $10=$k;
      var $11=(($10)|0) < 64;
      if ($11) { __label__ = 7; break; } else { __label__ = 9; break; }
    case 7: 
      var $13=_hash_rand();
      var $14=$k;
      var $15=$j;
      var $16=$i;
      var $17=((_hash_piece+$16*1536)|0);
      var $18=(($17+($15<<8))|0);
      var $19=(($18+($14<<2))|0);
      HEAP32[(($19)>>2)]=$13;
      __label__ = 8; break;
    case 8: 
      var $21=$k;
      var $22=(($21+1)|0);
      $k=$22;
      __label__ = 6; break;
    case 9: 
      __label__ = 10; break;
    case 10: 
      var $25=$j;
      var $26=(($25+1)|0);
      $j=$26;
      __label__ = 4; break;
    case 11: 
      __label__ = 12; break;
    case 12: 
      var $29=$i;
      var $30=(($29+1)|0);
      $i=$30;
      __label__ = 2; break;
    case 13: 
      var $32=_hash_rand();
      HEAP32[((_hash_side)>>2)]=$32;
      $i=0;
      __label__ = 14; break;
    case 14: 
      var $34=$i;
      var $35=(($34)|0) < 64;
      if ($35) { __label__ = 15; break; } else { __label__ = 17; break; }
    case 15: 
      var $37=_hash_rand();
      var $38=$i;
      var $39=((_hash_ep+($38<<2))|0);
      HEAP32[(($39)>>2)]=$37;
      __label__ = 16; break;
    case 16: 
      var $41=$i;
      var $42=(($41+1)|0);
      $i=$42;
      __label__ = 14; break;
    case 17: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_init_hash["X"]=1;

function _hash_rand() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      var $r;
      $r=0;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $2=$i;
      var $3=(($2)|0) < 32;
      if ($3) { __label__ = 3; break; } else { __label__ = 5; break; }
    case 3: 
      var $5=_rand();
      var $6=$i;
      var $7=$5 << $6;
      var $8=$r;
      var $9=$8 ^ $7;
      $r=$9;
      __label__ = 4; break;
    case 4: 
      var $11=$i;
      var $12=(($11+1)|0);
      $i=$12;
      __label__ = 2; break;
    case 5: 
      var $14=$r;
      ;
      return $14;
    default: assert(0, "bad label: " + __label__);
  }
}


function _in_check($s) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $i;
      $2=$s;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $4=$i;
      var $5=(($4)|0) < 64;
      if ($5) { __label__ = 3; break; } else { __label__ = 8; break; }
    case 3: 
      var $7=$i;
      var $8=((_piece+($7<<2))|0);
      var $9=HEAP32[(($8)>>2)];
      var $10=(($9)|0)==5;
      if ($10) { __label__ = 4; break; } else { __label__ = 6; break; }
    case 4: 
      var $12=$i;
      var $13=((_color+($12<<2))|0);
      var $14=HEAP32[(($13)>>2)];
      var $15=$2;
      var $16=(($14)|0)==(($15)|0);
      if ($16) { __label__ = 5; break; } else { __label__ = 6; break; }
    case 5: 
      var $18=$i;
      var $19=$2;
      var $20=$19 ^ 1;
      var $21=_attack($18, $20);
      $1=$21;
      __label__ = 9; break;
    case 6: 
      __label__ = 7; break;
    case 7: 
      var $24=$i;
      var $25=(($24+1)|0);
      $i=$25;
      __label__ = 2; break;
    case 8: 
      $1=1;
      __label__ = 9; break;
    case 9: 
      var $28=$1;
      ;
      return $28;
    default: assert(0, "bad label: " + __label__);
  }
}


function _gen() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      var $j;
      var $n;
      var $1=HEAP32[((_ply)>>2)];
      var $2=((_first_move+($1<<2))|0);
      var $3=HEAP32[(($2)>>2)];
      var $4=HEAP32[((_ply)>>2)];
      var $5=(($4+1)|0);
      var $6=((_first_move+($5<<2))|0);
      HEAP32[(($6)>>2)]=$3;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $8=$i;
      var $9=(($8)|0) < 64;
      if ($9) { __label__ = 3; break; } else { __label__ = 49; break; }
    case 3: 
      var $11=$i;
      var $12=((_color+($11<<2))|0);
      var $13=HEAP32[(($12)>>2)];
      var $14=HEAP32[((_side)>>2)];
      var $15=(($13)|0)==(($14)|0);
      if ($15) { __label__ = 4; break; } else { __label__ = 47; break; }
    case 4: 
      var $17=$i;
      var $18=((_piece+($17<<2))|0);
      var $19=HEAP32[(($18)>>2)];
      var $20=(($19)|0)==0;
      if ($20) { __label__ = 5; break; } else { __label__ = 31; break; }
    case 5: 
      var $22=HEAP32[((_side)>>2)];
      var $23=(($22)|0)==0;
      if ($23) { __label__ = 6; break; } else { __label__ = 18; break; }
    case 6: 
      var $25=$i;
      var $26=$25 & 7;
      var $27=(($26)|0)!=0;
      if ($27) { __label__ = 7; break; } else { __label__ = 9; break; }
    case 7: 
      var $29=$i;
      var $30=(($29-9)|0);
      var $31=((_color+($30<<2))|0);
      var $32=HEAP32[(($31)>>2)];
      var $33=(($32)|0)==1;
      if ($33) { __label__ = 8; break; } else { __label__ = 9; break; }
    case 8: 
      var $35=$i;
      var $36=$i;
      var $37=(($36-9)|0);
      _gen_push($35, $37, 17);
      __label__ = 9; break;
    case 9: 
      var $39=$i;
      var $40=$39 & 7;
      var $41=(($40)|0)!=7;
      if ($41) { __label__ = 10; break; } else { __label__ = 12; break; }
    case 10: 
      var $43=$i;
      var $44=(($43-7)|0);
      var $45=((_color+($44<<2))|0);
      var $46=HEAP32[(($45)>>2)];
      var $47=(($46)|0)==1;
      if ($47) { __label__ = 11; break; } else { __label__ = 12; break; }
    case 11: 
      var $49=$i;
      var $50=$i;
      var $51=(($50-7)|0);
      _gen_push($49, $51, 17);
      __label__ = 12; break;
    case 12: 
      var $53=$i;
      var $54=(($53-8)|0);
      var $55=((_color+($54<<2))|0);
      var $56=HEAP32[(($55)>>2)];
      var $57=(($56)|0)==6;
      if ($57) { __label__ = 13; break; } else { __label__ = 17; break; }
    case 13: 
      var $59=$i;
      var $60=$i;
      var $61=(($60-8)|0);
      _gen_push($59, $61, 16);
      var $62=$i;
      var $63=(($62)|0) >= 48;
      if ($63) { __label__ = 14; break; } else { __label__ = 16; break; }
    case 14: 
      var $65=$i;
      var $66=(($65-16)|0);
      var $67=((_color+($66<<2))|0);
      var $68=HEAP32[(($67)>>2)];
      var $69=(($68)|0)==6;
      if ($69) { __label__ = 15; break; } else { __label__ = 16; break; }
    case 15: 
      var $71=$i;
      var $72=$i;
      var $73=(($72-16)|0);
      _gen_push($71, $73, 24);
      __label__ = 16; break;
    case 16: 
      __label__ = 17; break;
    case 17: 
      __label__ = 30; break;
    case 18: 
      var $77=$i;
      var $78=$77 & 7;
      var $79=(($78)|0)!=0;
      if ($79) { __label__ = 19; break; } else { __label__ = 21; break; }
    case 19: 
      var $81=$i;
      var $82=(($81+7)|0);
      var $83=((_color+($82<<2))|0);
      var $84=HEAP32[(($83)>>2)];
      var $85=(($84)|0)==0;
      if ($85) { __label__ = 20; break; } else { __label__ = 21; break; }
    case 20: 
      var $87=$i;
      var $88=$i;
      var $89=(($88+7)|0);
      _gen_push($87, $89, 17);
      __label__ = 21; break;
    case 21: 
      var $91=$i;
      var $92=$91 & 7;
      var $93=(($92)|0)!=7;
      if ($93) { __label__ = 22; break; } else { __label__ = 24; break; }
    case 22: 
      var $95=$i;
      var $96=(($95+9)|0);
      var $97=((_color+($96<<2))|0);
      var $98=HEAP32[(($97)>>2)];
      var $99=(($98)|0)==0;
      if ($99) { __label__ = 23; break; } else { __label__ = 24; break; }
    case 23: 
      var $101=$i;
      var $102=$i;
      var $103=(($102+9)|0);
      _gen_push($101, $103, 17);
      __label__ = 24; break;
    case 24: 
      var $105=$i;
      var $106=(($105+8)|0);
      var $107=((_color+($106<<2))|0);
      var $108=HEAP32[(($107)>>2)];
      var $109=(($108)|0)==6;
      if ($109) { __label__ = 25; break; } else { __label__ = 29; break; }
    case 25: 
      var $111=$i;
      var $112=$i;
      var $113=(($112+8)|0);
      _gen_push($111, $113, 16);
      var $114=$i;
      var $115=(($114)|0) <= 15;
      if ($115) { __label__ = 26; break; } else { __label__ = 28; break; }
    case 26: 
      var $117=$i;
      var $118=(($117+16)|0);
      var $119=((_color+($118<<2))|0);
      var $120=HEAP32[(($119)>>2)];
      var $121=(($120)|0)==6;
      if ($121) { __label__ = 27; break; } else { __label__ = 28; break; }
    case 27: 
      var $123=$i;
      var $124=$i;
      var $125=(($124+16)|0);
      _gen_push($123, $125, 24);
      __label__ = 28; break;
    case 28: 
      __label__ = 29; break;
    case 29: 
      __label__ = 30; break;
    case 30: 
      __label__ = 46; break;
    case 31: 
      $j=0;
      __label__ = 32; break;
    case 32: 
      var $131=$j;
      var $132=$i;
      var $133=((_piece+($132<<2))|0);
      var $134=HEAP32[(($133)>>2)];
      var $135=((_offsets+($134<<2))|0);
      var $136=HEAP32[(($135)>>2)];
      var $137=(($131)|0) < (($136)|0);
      if ($137) { __label__ = 33; break; } else { __label__ = 45; break; }
    case 33: 
      var $139=$i;
      $n=$139;
      __label__ = 34; break;
    case 34: 
      var $141=$n;
      var $142=((_mailbox64+($141<<2))|0);
      var $143=HEAP32[(($142)>>2)];
      var $144=$j;
      var $145=$i;
      var $146=((_piece+($145<<2))|0);
      var $147=HEAP32[(($146)>>2)];
      var $148=((_offset+($147<<5))|0);
      var $149=(($148+($144<<2))|0);
      var $150=HEAP32[(($149)>>2)];
      var $151=(($143+$150)|0);
      var $152=((_mailbox+($151<<2))|0);
      var $153=HEAP32[(($152)>>2)];
      $n=$153;
      var $154=$n;
      var $155=(($154)|0)==-1;
      if ($155) { __label__ = 35; break; } else { __label__ = 36; break; }
    case 35: 
      __label__ = 43; break;
    case 36: 
      var $158=$n;
      var $159=((_color+($158<<2))|0);
      var $160=HEAP32[(($159)>>2)];
      var $161=(($160)|0)!=6;
      if ($161) { __label__ = 37; break; } else { __label__ = 40; break; }
    case 37: 
      var $163=$n;
      var $164=((_color+($163<<2))|0);
      var $165=HEAP32[(($164)>>2)];
      var $166=HEAP32[((_xside)>>2)];
      var $167=(($165)|0)==(($166)|0);
      if ($167) { __label__ = 38; break; } else { __label__ = 39; break; }
    case 38: 
      var $169=$i;
      var $170=$n;
      _gen_push($169, $170, 1);
      __label__ = 39; break;
    case 39: 
      __label__ = 43; break;
    case 40: 
      var $173=$i;
      var $174=$n;
      _gen_push($173, $174, 0);
      var $175=$i;
      var $176=((_piece+($175<<2))|0);
      var $177=HEAP32[(($176)>>2)];
      var $178=((_slide+($177<<2))|0);
      var $179=HEAP32[(($178)>>2)];
      var $180=(($179)|0)!=0;
      if ($180) { __label__ = 42; break; } else { __label__ = 41; break; }
    case 41: 
      __label__ = 43; break;
    case 42: 
      __label__ = 34; break;
    case 43: 
      __label__ = 44; break;
    case 44: 
      var $185=$j;
      var $186=(($185+1)|0);
      $j=$186;
      __label__ = 32; break;
    case 45: 
      __label__ = 46; break;
    case 46: 
      __label__ = 47; break;
    case 47: 
      __label__ = 48; break;
    case 48: 
      var $191=$i;
      var $192=(($191+1)|0);
      $i=$192;
      __label__ = 2; break;
    case 49: 
      var $194=HEAP32[((_side)>>2)];
      var $195=(($194)|0)==0;
      if ($195) { __label__ = 50; break; } else { __label__ = 55; break; }
    case 50: 
      var $197=HEAP32[((_castle)>>2)];
      var $198=$197 & 1;
      var $199=(($198)|0)!=0;
      if ($199) { __label__ = 51; break; } else { __label__ = 52; break; }
    case 51: 
      _gen_push(60, 62, 2);
      __label__ = 52; break;
    case 52: 
      var $202=HEAP32[((_castle)>>2)];
      var $203=$202 & 2;
      var $204=(($203)|0)!=0;
      if ($204) { __label__ = 53; break; } else { __label__ = 54; break; }
    case 53: 
      _gen_push(60, 58, 2);
      __label__ = 54; break;
    case 54: 
      __label__ = 60; break;
    case 55: 
      var $208=HEAP32[((_castle)>>2)];
      var $209=$208 & 4;
      var $210=(($209)|0)!=0;
      if ($210) { __label__ = 56; break; } else { __label__ = 57; break; }
    case 56: 
      _gen_push(4, 6, 2);
      __label__ = 57; break;
    case 57: 
      var $213=HEAP32[((_castle)>>2)];
      var $214=$213 & 8;
      var $215=(($214)|0)!=0;
      if ($215) { __label__ = 58; break; } else { __label__ = 59; break; }
    case 58: 
      _gen_push(4, 2, 2);
      __label__ = 59; break;
    case 59: 
      __label__ = 60; break;
    case 60: 
      var $219=HEAP32[((_ep)>>2)];
      var $220=(($219)|0)!=-1;
      if ($220) { __label__ = 61; break; } else { __label__ = 81; break; }
    case 61: 
      var $222=HEAP32[((_side)>>2)];
      var $223=(($222)|0)==0;
      if ($223) { __label__ = 62; break; } else { __label__ = 71; break; }
    case 62: 
      var $225=HEAP32[((_ep)>>2)];
      var $226=$225 & 7;
      var $227=(($226)|0)!=0;
      if ($227) { __label__ = 63; break; } else { __label__ = 66; break; }
    case 63: 
      var $229=HEAP32[((_ep)>>2)];
      var $230=(($229+7)|0);
      var $231=((_color+($230<<2))|0);
      var $232=HEAP32[(($231)>>2)];
      var $233=(($232)|0)==0;
      if ($233) { __label__ = 64; break; } else { __label__ = 66; break; }
    case 64: 
      var $235=HEAP32[((_ep)>>2)];
      var $236=(($235+7)|0);
      var $237=((_piece+($236<<2))|0);
      var $238=HEAP32[(($237)>>2)];
      var $239=(($238)|0)==0;
      if ($239) { __label__ = 65; break; } else { __label__ = 66; break; }
    case 65: 
      var $241=HEAP32[((_ep)>>2)];
      var $242=(($241+7)|0);
      var $243=HEAP32[((_ep)>>2)];
      _gen_push($242, $243, 21);
      __label__ = 66; break;
    case 66: 
      var $245=HEAP32[((_ep)>>2)];
      var $246=$245 & 7;
      var $247=(($246)|0)!=7;
      if ($247) { __label__ = 67; break; } else { __label__ = 70; break; }
    case 67: 
      var $249=HEAP32[((_ep)>>2)];
      var $250=(($249+9)|0);
      var $251=((_color+($250<<2))|0);
      var $252=HEAP32[(($251)>>2)];
      var $253=(($252)|0)==0;
      if ($253) { __label__ = 68; break; } else { __label__ = 70; break; }
    case 68: 
      var $255=HEAP32[((_ep)>>2)];
      var $256=(($255+9)|0);
      var $257=((_piece+($256<<2))|0);
      var $258=HEAP32[(($257)>>2)];
      var $259=(($258)|0)==0;
      if ($259) { __label__ = 69; break; } else { __label__ = 70; break; }
    case 69: 
      var $261=HEAP32[((_ep)>>2)];
      var $262=(($261+9)|0);
      var $263=HEAP32[((_ep)>>2)];
      _gen_push($262, $263, 21);
      __label__ = 70; break;
    case 70: 
      __label__ = 80; break;
    case 71: 
      var $266=HEAP32[((_ep)>>2)];
      var $267=$266 & 7;
      var $268=(($267)|0)!=0;
      if ($268) { __label__ = 72; break; } else { __label__ = 75; break; }
    case 72: 
      var $270=HEAP32[((_ep)>>2)];
      var $271=(($270-9)|0);
      var $272=((_color+($271<<2))|0);
      var $273=HEAP32[(($272)>>2)];
      var $274=(($273)|0)==1;
      if ($274) { __label__ = 73; break; } else { __label__ = 75; break; }
    case 73: 
      var $276=HEAP32[((_ep)>>2)];
      var $277=(($276-9)|0);
      var $278=((_piece+($277<<2))|0);
      var $279=HEAP32[(($278)>>2)];
      var $280=(($279)|0)==0;
      if ($280) { __label__ = 74; break; } else { __label__ = 75; break; }
    case 74: 
      var $282=HEAP32[((_ep)>>2)];
      var $283=(($282-9)|0);
      var $284=HEAP32[((_ep)>>2)];
      _gen_push($283, $284, 21);
      __label__ = 75; break;
    case 75: 
      var $286=HEAP32[((_ep)>>2)];
      var $287=$286 & 7;
      var $288=(($287)|0)!=7;
      if ($288) { __label__ = 76; break; } else { __label__ = 79; break; }
    case 76: 
      var $290=HEAP32[((_ep)>>2)];
      var $291=(($290-7)|0);
      var $292=((_color+($291<<2))|0);
      var $293=HEAP32[(($292)>>2)];
      var $294=(($293)|0)==1;
      if ($294) { __label__ = 77; break; } else { __label__ = 79; break; }
    case 77: 
      var $296=HEAP32[((_ep)>>2)];
      var $297=(($296-7)|0);
      var $298=((_piece+($297<<2))|0);
      var $299=HEAP32[(($298)>>2)];
      var $300=(($299)|0)==0;
      if ($300) { __label__ = 78; break; } else { __label__ = 79; break; }
    case 78: 
      var $302=HEAP32[((_ep)>>2)];
      var $303=(($302-7)|0);
      var $304=HEAP32[((_ep)>>2)];
      _gen_push($303, $304, 21);
      __label__ = 79; break;
    case 79: 
      __label__ = 80; break;
    case 80: 
      __label__ = 81; break;
    case 81: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_gen["X"]=1;

function _gen_push($from, $to, $bits) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $3;
      var $g;
      $1=$from;
      $2=$to;
      $3=$bits;
      var $4=$3;
      var $5=$4 & 16;
      var $6=(($5)|0)!=0;
      if ($6) { __label__ = 2; break; } else { __label__ = 10; break; }
    case 2: 
      var $8=HEAP32[((_side)>>2)];
      var $9=(($8)|0)==0;
      if ($9) { __label__ = 3; break; } else { __label__ = 6; break; }
    case 3: 
      var $11=$2;
      var $12=(($11)|0) <= 7;
      if ($12) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $14=$1;
      var $15=$2;
      var $16=$3;
      _gen_promote($14, $15, $16);
      __label__ = 13; break;
    case 5: 
      __label__ = 9; break;
    case 6: 
      var $19=$2;
      var $20=(($19)|0) >= 56;
      if ($20) { __label__ = 7; break; } else { __label__ = 8; break; }
    case 7: 
      var $22=$1;
      var $23=$2;
      var $24=$3;
      _gen_promote($22, $23, $24);
      __label__ = 13; break;
    case 8: 
      __label__ = 9; break;
    case 9: 
      __label__ = 10; break;
    case 10: 
      var $28=HEAP32[((_ply)>>2)];
      var $29=(($28+1)|0);
      var $30=((_first_move+($29<<2))|0);
      var $31=HEAP32[(($30)>>2)];
      var $32=(($31+1)|0);
      HEAP32[(($30)>>2)]=$32;
      var $33=((_gen_dat+($31<<3))|0);
      $g=$33;
      var $34=$1;
      var $35=(($34) & 255);
      var $36=$g;
      var $37=(($36)|0);
      var $38=$37;
      var $39=(($38)|0);
      HEAP8[($39)]=$35;
      var $40=$2;
      var $41=(($40) & 255);
      var $42=$g;
      var $43=(($42)|0);
      var $44=$43;
      var $45=(($44+1)|0);
      HEAP8[($45)]=$41;
      var $46=$g;
      var $47=(($46)|0);
      var $48=$47;
      var $49=(($48+2)|0);
      HEAP8[($49)]=0;
      var $50=$3;
      var $51=(($50) & 255);
      var $52=$g;
      var $53=(($52)|0);
      var $54=$53;
      var $55=(($54+3)|0);
      HEAP8[($55)]=$51;
      var $56=$2;
      var $57=((_color+($56<<2))|0);
      var $58=HEAP32[(($57)>>2)];
      var $59=(($58)|0)!=6;
      if ($59) { __label__ = 11; break; } else { __label__ = 12; break; }
    case 11: 
      var $61=$2;
      var $62=((_piece+($61<<2))|0);
      var $63=HEAP32[(($62)>>2)];
      var $64=(($63*10)|0);
      var $65=(($64+1000000)|0);
      var $66=$1;
      var $67=((_piece+($66<<2))|0);
      var $68=HEAP32[(($67)>>2)];
      var $69=(($65-$68)|0);
      var $70=$g;
      var $71=(($70+4)|0);
      HEAP32[(($71)>>2)]=$69;
      __label__ = 13; break;
    case 12: 
      var $73=$2;
      var $74=$1;
      var $75=((_history+($74<<8))|0);
      var $76=(($75+($73<<2))|0);
      var $77=HEAP32[(($76)>>2)];
      var $78=$g;
      var $79=(($78+4)|0);
      HEAP32[(($79)>>2)]=$77;
      __label__ = 13; break;
    case 13: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_gen_push["X"]=1;

function _gen_promote($from, $to, $bits) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $3;
      var $i;
      var $g;
      $1=$from;
      $2=$to;
      $3=$bits;
      $i=1;
      __label__ = 2; break;
    case 2: 
      var $5=$i;
      var $6=(($5)|0) <= 4;
      if ($6) { __label__ = 3; break; } else { __label__ = 5; break; }
    case 3: 
      var $8=HEAP32[((_ply)>>2)];
      var $9=(($8+1)|0);
      var $10=((_first_move+($9<<2))|0);
      var $11=HEAP32[(($10)>>2)];
      var $12=(($11+1)|0);
      HEAP32[(($10)>>2)]=$12;
      var $13=((_gen_dat+($11<<3))|0);
      $g=$13;
      var $14=$1;
      var $15=(($14) & 255);
      var $16=$g;
      var $17=(($16)|0);
      var $18=$17;
      var $19=(($18)|0);
      HEAP8[($19)]=$15;
      var $20=$2;
      var $21=(($20) & 255);
      var $22=$g;
      var $23=(($22)|0);
      var $24=$23;
      var $25=(($24+1)|0);
      HEAP8[($25)]=$21;
      var $26=$i;
      var $27=(($26) & 255);
      var $28=$g;
      var $29=(($28)|0);
      var $30=$29;
      var $31=(($30+2)|0);
      HEAP8[($31)]=$27;
      var $32=$3;
      var $33=$32 | 32;
      var $34=(($33) & 255);
      var $35=$g;
      var $36=(($35)|0);
      var $37=$36;
      var $38=(($37+3)|0);
      HEAP8[($38)]=$34;
      var $39=$i;
      var $40=(($39*10)|0);
      var $41=(($40+1000000)|0);
      var $42=$g;
      var $43=(($42+4)|0);
      HEAP32[(($43)>>2)]=$41;
      __label__ = 4; break;
    case 4: 
      var $45=$i;
      var $46=(($45+1)|0);
      $i=$46;
      __label__ = 2; break;
    case 5: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_gen_promote["X"]=1;

function _gen_caps() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      var $j;
      var $n;
      var $1=HEAP32[((_ply)>>2)];
      var $2=((_first_move+($1<<2))|0);
      var $3=HEAP32[(($2)>>2)];
      var $4=HEAP32[((_ply)>>2)];
      var $5=(($4+1)|0);
      var $6=((_first_move+($5<<2))|0);
      HEAP32[(($6)>>2)]=$3;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $8=$i;
      var $9=(($8)|0) < 64;
      if ($9) { __label__ = 3; break; } else { __label__ = 46; break; }
    case 3: 
      var $11=$i;
      var $12=((_color+($11<<2))|0);
      var $13=HEAP32[(($12)>>2)];
      var $14=HEAP32[((_side)>>2)];
      var $15=(($13)|0)==(($14)|0);
      if ($15) { __label__ = 4; break; } else { __label__ = 44; break; }
    case 4: 
      var $17=$i;
      var $18=((_piece+($17<<2))|0);
      var $19=HEAP32[(($18)>>2)];
      var $20=(($19)|0)==0;
      if ($20) { __label__ = 5; break; } else { __label__ = 28; break; }
    case 5: 
      var $22=HEAP32[((_side)>>2)];
      var $23=(($22)|0)==0;
      if ($23) { __label__ = 6; break; } else { __label__ = 16; break; }
    case 6: 
      var $25=$i;
      var $26=$25 & 7;
      var $27=(($26)|0)!=0;
      if ($27) { __label__ = 7; break; } else { __label__ = 9; break; }
    case 7: 
      var $29=$i;
      var $30=(($29-9)|0);
      var $31=((_color+($30<<2))|0);
      var $32=HEAP32[(($31)>>2)];
      var $33=(($32)|0)==1;
      if ($33) { __label__ = 8; break; } else { __label__ = 9; break; }
    case 8: 
      var $35=$i;
      var $36=$i;
      var $37=(($36-9)|0);
      _gen_push($35, $37, 17);
      __label__ = 9; break;
    case 9: 
      var $39=$i;
      var $40=$39 & 7;
      var $41=(($40)|0)!=7;
      if ($41) { __label__ = 10; break; } else { __label__ = 12; break; }
    case 10: 
      var $43=$i;
      var $44=(($43-7)|0);
      var $45=((_color+($44<<2))|0);
      var $46=HEAP32[(($45)>>2)];
      var $47=(($46)|0)==1;
      if ($47) { __label__ = 11; break; } else { __label__ = 12; break; }
    case 11: 
      var $49=$i;
      var $50=$i;
      var $51=(($50-7)|0);
      _gen_push($49, $51, 17);
      __label__ = 12; break;
    case 12: 
      var $53=$i;
      var $54=(($53)|0) <= 15;
      if ($54) { __label__ = 13; break; } else { __label__ = 15; break; }
    case 13: 
      var $56=$i;
      var $57=(($56-8)|0);
      var $58=((_color+($57<<2))|0);
      var $59=HEAP32[(($58)>>2)];
      var $60=(($59)|0)==6;
      if ($60) { __label__ = 14; break; } else { __label__ = 15; break; }
    case 14: 
      var $62=$i;
      var $63=$i;
      var $64=(($63-8)|0);
      _gen_push($62, $64, 16);
      __label__ = 15; break;
    case 15: 
      __label__ = 16; break;
    case 16: 
      var $67=HEAP32[((_side)>>2)];
      var $68=(($67)|0)==1;
      if ($68) { __label__ = 17; break; } else { __label__ = 27; break; }
    case 17: 
      var $70=$i;
      var $71=$70 & 7;
      var $72=(($71)|0)!=0;
      if ($72) { __label__ = 18; break; } else { __label__ = 20; break; }
    case 18: 
      var $74=$i;
      var $75=(($74+7)|0);
      var $76=((_color+($75<<2))|0);
      var $77=HEAP32[(($76)>>2)];
      var $78=(($77)|0)==0;
      if ($78) { __label__ = 19; break; } else { __label__ = 20; break; }
    case 19: 
      var $80=$i;
      var $81=$i;
      var $82=(($81+7)|0);
      _gen_push($80, $82, 17);
      __label__ = 20; break;
    case 20: 
      var $84=$i;
      var $85=$84 & 7;
      var $86=(($85)|0)!=7;
      if ($86) { __label__ = 21; break; } else { __label__ = 23; break; }
    case 21: 
      var $88=$i;
      var $89=(($88+9)|0);
      var $90=((_color+($89<<2))|0);
      var $91=HEAP32[(($90)>>2)];
      var $92=(($91)|0)==0;
      if ($92) { __label__ = 22; break; } else { __label__ = 23; break; }
    case 22: 
      var $94=$i;
      var $95=$i;
      var $96=(($95+9)|0);
      _gen_push($94, $96, 17);
      __label__ = 23; break;
    case 23: 
      var $98=$i;
      var $99=(($98)|0) >= 48;
      if ($99) { __label__ = 24; break; } else { __label__ = 26; break; }
    case 24: 
      var $101=$i;
      var $102=(($101+8)|0);
      var $103=((_color+($102<<2))|0);
      var $104=HEAP32[(($103)>>2)];
      var $105=(($104)|0)==6;
      if ($105) { __label__ = 25; break; } else { __label__ = 26; break; }
    case 25: 
      var $107=$i;
      var $108=$i;
      var $109=(($108+8)|0);
      _gen_push($107, $109, 16);
      __label__ = 26; break;
    case 26: 
      __label__ = 27; break;
    case 27: 
      __label__ = 43; break;
    case 28: 
      $j=0;
      __label__ = 29; break;
    case 29: 
      var $114=$j;
      var $115=$i;
      var $116=((_piece+($115<<2))|0);
      var $117=HEAP32[(($116)>>2)];
      var $118=((_offsets+($117<<2))|0);
      var $119=HEAP32[(($118)>>2)];
      var $120=(($114)|0) < (($119)|0);
      if ($120) { __label__ = 30; break; } else { __label__ = 42; break; }
    case 30: 
      var $122=$i;
      $n=$122;
      __label__ = 31; break;
    case 31: 
      var $124=$n;
      var $125=((_mailbox64+($124<<2))|0);
      var $126=HEAP32[(($125)>>2)];
      var $127=$j;
      var $128=$i;
      var $129=((_piece+($128<<2))|0);
      var $130=HEAP32[(($129)>>2)];
      var $131=((_offset+($130<<5))|0);
      var $132=(($131+($127<<2))|0);
      var $133=HEAP32[(($132)>>2)];
      var $134=(($126+$133)|0);
      var $135=((_mailbox+($134<<2))|0);
      var $136=HEAP32[(($135)>>2)];
      $n=$136;
      var $137=$n;
      var $138=(($137)|0)==-1;
      if ($138) { __label__ = 32; break; } else { __label__ = 33; break; }
    case 32: 
      __label__ = 40; break;
    case 33: 
      var $141=$n;
      var $142=((_color+($141<<2))|0);
      var $143=HEAP32[(($142)>>2)];
      var $144=(($143)|0)!=6;
      if ($144) { __label__ = 34; break; } else { __label__ = 37; break; }
    case 34: 
      var $146=$n;
      var $147=((_color+($146<<2))|0);
      var $148=HEAP32[(($147)>>2)];
      var $149=HEAP32[((_xside)>>2)];
      var $150=(($148)|0)==(($149)|0);
      if ($150) { __label__ = 35; break; } else { __label__ = 36; break; }
    case 35: 
      var $152=$i;
      var $153=$n;
      _gen_push($152, $153, 1);
      __label__ = 36; break;
    case 36: 
      __label__ = 40; break;
    case 37: 
      var $156=$i;
      var $157=((_piece+($156<<2))|0);
      var $158=HEAP32[(($157)>>2)];
      var $159=((_slide+($158<<2))|0);
      var $160=HEAP32[(($159)>>2)];
      var $161=(($160)|0)!=0;
      if ($161) { __label__ = 39; break; } else { __label__ = 38; break; }
    case 38: 
      __label__ = 40; break;
    case 39: 
      __label__ = 31; break;
    case 40: 
      __label__ = 41; break;
    case 41: 
      var $166=$j;
      var $167=(($166+1)|0);
      $j=$167;
      __label__ = 29; break;
    case 42: 
      __label__ = 43; break;
    case 43: 
      __label__ = 44; break;
    case 44: 
      __label__ = 45; break;
    case 45: 
      var $172=$i;
      var $173=(($172+1)|0);
      $i=$173;
      __label__ = 2; break;
    case 46: 
      var $175=HEAP32[((_ep)>>2)];
      var $176=(($175)|0)!=-1;
      if ($176) { __label__ = 47; break; } else { __label__ = 67; break; }
    case 47: 
      var $178=HEAP32[((_side)>>2)];
      var $179=(($178)|0)==0;
      if ($179) { __label__ = 48; break; } else { __label__ = 57; break; }
    case 48: 
      var $181=HEAP32[((_ep)>>2)];
      var $182=$181 & 7;
      var $183=(($182)|0)!=0;
      if ($183) { __label__ = 49; break; } else { __label__ = 52; break; }
    case 49: 
      var $185=HEAP32[((_ep)>>2)];
      var $186=(($185+7)|0);
      var $187=((_color+($186<<2))|0);
      var $188=HEAP32[(($187)>>2)];
      var $189=(($188)|0)==0;
      if ($189) { __label__ = 50; break; } else { __label__ = 52; break; }
    case 50: 
      var $191=HEAP32[((_ep)>>2)];
      var $192=(($191+7)|0);
      var $193=((_piece+($192<<2))|0);
      var $194=HEAP32[(($193)>>2)];
      var $195=(($194)|0)==0;
      if ($195) { __label__ = 51; break; } else { __label__ = 52; break; }
    case 51: 
      var $197=HEAP32[((_ep)>>2)];
      var $198=(($197+7)|0);
      var $199=HEAP32[((_ep)>>2)];
      _gen_push($198, $199, 21);
      __label__ = 52; break;
    case 52: 
      var $201=HEAP32[((_ep)>>2)];
      var $202=$201 & 7;
      var $203=(($202)|0)!=7;
      if ($203) { __label__ = 53; break; } else { __label__ = 56; break; }
    case 53: 
      var $205=HEAP32[((_ep)>>2)];
      var $206=(($205+9)|0);
      var $207=((_color+($206<<2))|0);
      var $208=HEAP32[(($207)>>2)];
      var $209=(($208)|0)==0;
      if ($209) { __label__ = 54; break; } else { __label__ = 56; break; }
    case 54: 
      var $211=HEAP32[((_ep)>>2)];
      var $212=(($211+9)|0);
      var $213=((_piece+($212<<2))|0);
      var $214=HEAP32[(($213)>>2)];
      var $215=(($214)|0)==0;
      if ($215) { __label__ = 55; break; } else { __label__ = 56; break; }
    case 55: 
      var $217=HEAP32[((_ep)>>2)];
      var $218=(($217+9)|0);
      var $219=HEAP32[((_ep)>>2)];
      _gen_push($218, $219, 21);
      __label__ = 56; break;
    case 56: 
      __label__ = 66; break;
    case 57: 
      var $222=HEAP32[((_ep)>>2)];
      var $223=$222 & 7;
      var $224=(($223)|0)!=0;
      if ($224) { __label__ = 58; break; } else { __label__ = 61; break; }
    case 58: 
      var $226=HEAP32[((_ep)>>2)];
      var $227=(($226-9)|0);
      var $228=((_color+($227<<2))|0);
      var $229=HEAP32[(($228)>>2)];
      var $230=(($229)|0)==1;
      if ($230) { __label__ = 59; break; } else { __label__ = 61; break; }
    case 59: 
      var $232=HEAP32[((_ep)>>2)];
      var $233=(($232-9)|0);
      var $234=((_piece+($233<<2))|0);
      var $235=HEAP32[(($234)>>2)];
      var $236=(($235)|0)==0;
      if ($236) { __label__ = 60; break; } else { __label__ = 61; break; }
    case 60: 
      var $238=HEAP32[((_ep)>>2)];
      var $239=(($238-9)|0);
      var $240=HEAP32[((_ep)>>2)];
      _gen_push($239, $240, 21);
      __label__ = 61; break;
    case 61: 
      var $242=HEAP32[((_ep)>>2)];
      var $243=$242 & 7;
      var $244=(($243)|0)!=7;
      if ($244) { __label__ = 62; break; } else { __label__ = 65; break; }
    case 62: 
      var $246=HEAP32[((_ep)>>2)];
      var $247=(($246-7)|0);
      var $248=((_color+($247<<2))|0);
      var $249=HEAP32[(($248)>>2)];
      var $250=(($249)|0)==1;
      if ($250) { __label__ = 63; break; } else { __label__ = 65; break; }
    case 63: 
      var $252=HEAP32[((_ep)>>2)];
      var $253=(($252-7)|0);
      var $254=((_piece+($253<<2))|0);
      var $255=HEAP32[(($254)>>2)];
      var $256=(($255)|0)==0;
      if ($256) { __label__ = 64; break; } else { __label__ = 65; break; }
    case 64: 
      var $258=HEAP32[((_ep)>>2)];
      var $259=(($258-7)|0);
      var $260=HEAP32[((_ep)>>2)];
      _gen_push($259, $260, 21);
      __label__ = 65; break;
    case 65: 
      __label__ = 66; break;
    case 66: 
      __label__ = 67; break;
    case 67: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_gen_caps["X"]=1;

function _makemove($m) {
  var __stackBase__  = STACKTOP; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var tempParam = $m; $m = STACKTOP;STACKTOP += 4;assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack");HEAP32[(($m)>>2)]=HEAP32[((tempParam)>>2)];
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $from;
      var $to;
      var $2=(($m+3)|0);
      var $3=HEAP8[($2)];
      var $4=(($3 << 24) >> 24);
      var $5=$4 & 2;
      var $6=(($5)|0)!=0;
      if ($6) { __label__ = 2; break; } else { __label__ = 33; break; }
    case 2: 
      var $8=HEAP32[((_side)>>2)];
      var $9=_in_check($8);
      var $10=(($9)|0)!=0;
      if ($10) { __label__ = 3; break; } else { __label__ = 4; break; }
    case 3: 
      $1=0;
      __label__ = 53; break;
    case 4: 
      var $13=(($m+1)|0);
      var $14=HEAP8[($13)];
      var $15=(($14 << 24) >> 24);
      if ($15 == 62) {
        __label__ = 5; break;
      }
      else if ($15 == 58) {
        __label__ = 11; break;
      }
      else if ($15 == 6) {
        __label__ = 18; break;
      }
      else if ($15 == 2) {
        __label__ = 24; break;
      }
      else {
      __label__ = 31; break;
      }
      
    case 5: 
      var $17=HEAP32[((((_color+244)|0))>>2)];
      var $18=(($17)|0)!=6;
      if ($18) { __label__ = 9; break; } else { __label__ = 6; break; }
    case 6: 
      var $20=HEAP32[((((_color+248)|0))>>2)];
      var $21=(($20)|0)!=6;
      if ($21) { __label__ = 9; break; } else { __label__ = 7; break; }
    case 7: 
      var $23=HEAP32[((_xside)>>2)];
      var $24=_attack(61, $23);
      var $25=(($24)|0)!=0;
      if ($25) { __label__ = 9; break; } else { __label__ = 8; break; }
    case 8: 
      var $27=HEAP32[((_xside)>>2)];
      var $28=_attack(62, $27);
      var $29=(($28)|0)!=0;
      if ($29) { __label__ = 9; break; } else { __label__ = 10; break; }
    case 9: 
      $1=0;
      __label__ = 53; break;
    case 10: 
      $from=63;
      $to=61;
      __label__ = 32; break;
    case 11: 
      var $33=HEAP32[((((_color+228)|0))>>2)];
      var $34=(($33)|0)!=6;
      if ($34) { __label__ = 16; break; } else { __label__ = 12; break; }
    case 12: 
      var $36=HEAP32[((((_color+232)|0))>>2)];
      var $37=(($36)|0)!=6;
      if ($37) { __label__ = 16; break; } else { __label__ = 13; break; }
    case 13: 
      var $39=HEAP32[((((_color+236)|0))>>2)];
      var $40=(($39)|0)!=6;
      if ($40) { __label__ = 16; break; } else { __label__ = 14; break; }
    case 14: 
      var $42=HEAP32[((_xside)>>2)];
      var $43=_attack(58, $42);
      var $44=(($43)|0)!=0;
      if ($44) { __label__ = 16; break; } else { __label__ = 15; break; }
    case 15: 
      var $46=HEAP32[((_xside)>>2)];
      var $47=_attack(59, $46);
      var $48=(($47)|0)!=0;
      if ($48) { __label__ = 16; break; } else { __label__ = 17; break; }
    case 16: 
      $1=0;
      __label__ = 53; break;
    case 17: 
      $from=56;
      $to=59;
      __label__ = 32; break;
    case 18: 
      var $52=HEAP32[((((_color+20)|0))>>2)];
      var $53=(($52)|0)!=6;
      if ($53) { __label__ = 22; break; } else { __label__ = 19; break; }
    case 19: 
      var $55=HEAP32[((((_color+24)|0))>>2)];
      var $56=(($55)|0)!=6;
      if ($56) { __label__ = 22; break; } else { __label__ = 20; break; }
    case 20: 
      var $58=HEAP32[((_xside)>>2)];
      var $59=_attack(5, $58);
      var $60=(($59)|0)!=0;
      if ($60) { __label__ = 22; break; } else { __label__ = 21; break; }
    case 21: 
      var $62=HEAP32[((_xside)>>2)];
      var $63=_attack(6, $62);
      var $64=(($63)|0)!=0;
      if ($64) { __label__ = 22; break; } else { __label__ = 23; break; }
    case 22: 
      $1=0;
      __label__ = 53; break;
    case 23: 
      $from=7;
      $to=5;
      __label__ = 32; break;
    case 24: 
      var $68=HEAP32[((((_color+4)|0))>>2)];
      var $69=(($68)|0)!=6;
      if ($69) { __label__ = 29; break; } else { __label__ = 25; break; }
    case 25: 
      var $71=HEAP32[((((_color+8)|0))>>2)];
      var $72=(($71)|0)!=6;
      if ($72) { __label__ = 29; break; } else { __label__ = 26; break; }
    case 26: 
      var $74=HEAP32[((((_color+12)|0))>>2)];
      var $75=(($74)|0)!=6;
      if ($75) { __label__ = 29; break; } else { __label__ = 27; break; }
    case 27: 
      var $77=HEAP32[((_xside)>>2)];
      var $78=_attack(2, $77);
      var $79=(($78)|0)!=0;
      if ($79) { __label__ = 29; break; } else { __label__ = 28; break; }
    case 28: 
      var $81=HEAP32[((_xside)>>2)];
      var $82=_attack(3, $81);
      var $83=(($82)|0)!=0;
      if ($83) { __label__ = 29; break; } else { __label__ = 30; break; }
    case 29: 
      $1=0;
      __label__ = 53; break;
    case 30: 
      $from=0;
      $to=3;
      __label__ = 32; break;
    case 31: 
      $from=-1;
      $to=-1;
      __label__ = 32; break;
    case 32: 
      var $88=$from;
      var $89=((_color+($88<<2))|0);
      var $90=HEAP32[(($89)>>2)];
      var $91=$to;
      var $92=((_color+($91<<2))|0);
      HEAP32[(($92)>>2)]=$90;
      var $93=$from;
      var $94=((_piece+($93<<2))|0);
      var $95=HEAP32[(($94)>>2)];
      var $96=$to;
      var $97=((_piece+($96<<2))|0);
      HEAP32[(($97)>>2)]=$95;
      var $98=$from;
      var $99=((_color+($98<<2))|0);
      HEAP32[(($99)>>2)]=6;
      var $100=$from;
      var $101=((_piece+($100<<2))|0);
      HEAP32[(($101)>>2)]=6;
      __label__ = 33; break;
    case 33: 
      var $103=HEAP32[((_hply)>>2)];
      var $104=((_hist_dat+$103*24)|0);
      var $105=(($104)|0);
      var $106=$105;
      var $107=$106;
      var $108=$m;
      assert(4 % 1 === 0, 'memcpy given ' + 4 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP8[($107)]=HEAP8[($108)];HEAP8[($107+1)]=HEAP8[($108+1)];HEAP8[($107+2)]=HEAP8[($108+2)];HEAP8[($107+3)]=HEAP8[($108+3)];
      var $109=(($m+1)|0);
      var $110=HEAP8[($109)];
      var $111=(($110 << 24) >> 24);
      var $112=((_piece+($111<<2))|0);
      var $113=HEAP32[(($112)>>2)];
      var $114=HEAP32[((_hply)>>2)];
      var $115=((_hist_dat+$114*24)|0);
      var $116=(($115+4)|0);
      HEAP32[(($116)>>2)]=$113;
      var $117=HEAP32[((_castle)>>2)];
      var $118=HEAP32[((_hply)>>2)];
      var $119=((_hist_dat+$118*24)|0);
      var $120=(($119+8)|0);
      HEAP32[(($120)>>2)]=$117;
      var $121=HEAP32[((_ep)>>2)];
      var $122=HEAP32[((_hply)>>2)];
      var $123=((_hist_dat+$122*24)|0);
      var $124=(($123+12)|0);
      HEAP32[(($124)>>2)]=$121;
      var $125=HEAP32[((_fifty)>>2)];
      var $126=HEAP32[((_hply)>>2)];
      var $127=((_hist_dat+$126*24)|0);
      var $128=(($127+16)|0);
      HEAP32[(($128)>>2)]=$125;
      var $129=HEAP32[((_hash)>>2)];
      var $130=HEAP32[((_hply)>>2)];
      var $131=((_hist_dat+$130*24)|0);
      var $132=(($131+20)|0);
      HEAP32[(($132)>>2)]=$129;
      var $133=HEAP32[((_ply)>>2)];
      var $134=(($133+1)|0);
      HEAP32[((_ply)>>2)]=$134;
      var $135=HEAP32[((_hply)>>2)];
      var $136=(($135+1)|0);
      HEAP32[((_hply)>>2)]=$136;
      var $137=(($m)|0);
      var $138=HEAP8[($137)];
      var $139=(($138 << 24) >> 24);
      var $140=((_castle_mask+($139<<2))|0);
      var $141=HEAP32[(($140)>>2)];
      var $142=(($m+1)|0);
      var $143=HEAP8[($142)];
      var $144=(($143 << 24) >> 24);
      var $145=((_castle_mask+($144<<2))|0);
      var $146=HEAP32[(($145)>>2)];
      var $147=$141 & $146;
      var $148=HEAP32[((_castle)>>2)];
      var $149=$148 & $147;
      HEAP32[((_castle)>>2)]=$149;
      var $150=(($m+3)|0);
      var $151=HEAP8[($150)];
      var $152=(($151 << 24) >> 24);
      var $153=$152 & 8;
      var $154=(($153)|0)!=0;
      if ($154) { __label__ = 34; break; } else { __label__ = 38; break; }
    case 34: 
      var $156=HEAP32[((_side)>>2)];
      var $157=(($156)|0)==0;
      if ($157) { __label__ = 35; break; } else { __label__ = 36; break; }
    case 35: 
      var $159=(($m+1)|0);
      var $160=HEAP8[($159)];
      var $161=(($160 << 24) >> 24);
      var $162=(($161+8)|0);
      HEAP32[((_ep)>>2)]=$162;
      __label__ = 37; break;
    case 36: 
      var $164=(($m+1)|0);
      var $165=HEAP8[($164)];
      var $166=(($165 << 24) >> 24);
      var $167=(($166-8)|0);
      HEAP32[((_ep)>>2)]=$167;
      __label__ = 37; break;
    case 37: 
      __label__ = 39; break;
    case 38: 
      HEAP32[((_ep)>>2)]=-1;
      __label__ = 39; break;
    case 39: 
      var $171=(($m+3)|0);
      var $172=HEAP8[($171)];
      var $173=(($172 << 24) >> 24);
      var $174=$173 & 17;
      var $175=(($174)|0)!=0;
      if ($175) { __label__ = 40; break; } else { __label__ = 41; break; }
    case 40: 
      HEAP32[((_fifty)>>2)]=0;
      __label__ = 42; break;
    case 41: 
      var $178=HEAP32[((_fifty)>>2)];
      var $179=(($178+1)|0);
      HEAP32[((_fifty)>>2)]=$179;
      __label__ = 42; break;
    case 42: 
      var $181=HEAP32[((_side)>>2)];
      var $182=(($m+1)|0);
      var $183=HEAP8[($182)];
      var $184=(($183 << 24) >> 24);
      var $185=((_color+($184<<2))|0);
      HEAP32[(($185)>>2)]=$181;
      var $186=(($m+3)|0);
      var $187=HEAP8[($186)];
      var $188=(($187 << 24) >> 24);
      var $189=$188 & 32;
      var $190=(($189)|0)!=0;
      if ($190) { __label__ = 43; break; } else { __label__ = 44; break; }
    case 43: 
      var $192=(($m+2)|0);
      var $193=HEAP8[($192)];
      var $194=(($193 << 24) >> 24);
      var $195=(($m+1)|0);
      var $196=HEAP8[($195)];
      var $197=(($196 << 24) >> 24);
      var $198=((_piece+($197<<2))|0);
      HEAP32[(($198)>>2)]=$194;
      __label__ = 45; break;
    case 44: 
      var $200=(($m)|0);
      var $201=HEAP8[($200)];
      var $202=(($201 << 24) >> 24);
      var $203=((_piece+($202<<2))|0);
      var $204=HEAP32[(($203)>>2)];
      var $205=(($m+1)|0);
      var $206=HEAP8[($205)];
      var $207=(($206 << 24) >> 24);
      var $208=((_piece+($207<<2))|0);
      HEAP32[(($208)>>2)]=$204;
      __label__ = 45; break;
    case 45: 
      var $210=(($m)|0);
      var $211=HEAP8[($210)];
      var $212=(($211 << 24) >> 24);
      var $213=((_color+($212<<2))|0);
      HEAP32[(($213)>>2)]=6;
      var $214=(($m)|0);
      var $215=HEAP8[($214)];
      var $216=(($215 << 24) >> 24);
      var $217=((_piece+($216<<2))|0);
      HEAP32[(($217)>>2)]=6;
      var $218=(($m+3)|0);
      var $219=HEAP8[($218)];
      var $220=(($219 << 24) >> 24);
      var $221=$220 & 4;
      var $222=(($221)|0)!=0;
      if ($222) { __label__ = 46; break; } else { __label__ = 50; break; }
    case 46: 
      var $224=HEAP32[((_side)>>2)];
      var $225=(($224)|0)==0;
      if ($225) { __label__ = 47; break; } else { __label__ = 48; break; }
    case 47: 
      var $227=(($m+1)|0);
      var $228=HEAP8[($227)];
      var $229=(($228 << 24) >> 24);
      var $230=(($229+8)|0);
      var $231=((_color+($230<<2))|0);
      HEAP32[(($231)>>2)]=6;
      var $232=(($m+1)|0);
      var $233=HEAP8[($232)];
      var $234=(($233 << 24) >> 24);
      var $235=(($234+8)|0);
      var $236=((_piece+($235<<2))|0);
      HEAP32[(($236)>>2)]=6;
      __label__ = 49; break;
    case 48: 
      var $238=(($m+1)|0);
      var $239=HEAP8[($238)];
      var $240=(($239 << 24) >> 24);
      var $241=(($240-8)|0);
      var $242=((_color+($241<<2))|0);
      HEAP32[(($242)>>2)]=6;
      var $243=(($m+1)|0);
      var $244=HEAP8[($243)];
      var $245=(($244 << 24) >> 24);
      var $246=(($245-8)|0);
      var $247=((_piece+($246<<2))|0);
      HEAP32[(($247)>>2)]=6;
      __label__ = 49; break;
    case 49: 
      __label__ = 50; break;
    case 50: 
      var $250=HEAP32[((_side)>>2)];
      var $251=$250 ^ 1;
      HEAP32[((_side)>>2)]=$251;
      var $252=HEAP32[((_xside)>>2)];
      var $253=$252 ^ 1;
      HEAP32[((_xside)>>2)]=$253;
      var $254=HEAP32[((_xside)>>2)];
      var $255=_in_check($254);
      var $256=(($255)|0)!=0;
      if ($256) { __label__ = 51; break; } else { __label__ = 52; break; }
    case 51: 
      _takeback();
      $1=0;
      __label__ = 53; break;
    case 52: 
      _set_hash();
      $1=1;
      __label__ = 53; break;
    case 53: 
      var $260=$1;
      STACKTOP = __stackBase__;
      return $260;
    default: assert(0, "bad label: " + __label__);
  }
}
_makemove["X"]=1;

function _takeback() {
  var __stackBase__  = STACKTOP; STACKTOP += 4; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $m=__stackBase__;
      var $from;
      var $to;
      var $1=HEAP32[((_side)>>2)];
      var $2=$1 ^ 1;
      HEAP32[((_side)>>2)]=$2;
      var $3=HEAP32[((_xside)>>2)];
      var $4=$3 ^ 1;
      HEAP32[((_xside)>>2)]=$4;
      var $5=HEAP32[((_ply)>>2)];
      var $6=(($5-1)|0);
      HEAP32[((_ply)>>2)]=$6;
      var $7=HEAP32[((_hply)>>2)];
      var $8=(($7-1)|0);
      HEAP32[((_hply)>>2)]=$8;
      var $9=HEAP32[((_hply)>>2)];
      var $10=((_hist_dat+$9*24)|0);
      var $11=(($10)|0);
      var $12=$11;
      var $13=$m;
      var $14=$12;
      assert(4 % 1 === 0, 'memcpy given ' + 4 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP8[($13)]=HEAP8[($14)];HEAP8[($13+1)]=HEAP8[($14+1)];HEAP8[($13+2)]=HEAP8[($14+2)];HEAP8[($13+3)]=HEAP8[($14+3)];
      var $15=HEAP32[((_hply)>>2)];
      var $16=((_hist_dat+$15*24)|0);
      var $17=(($16+8)|0);
      var $18=HEAP32[(($17)>>2)];
      HEAP32[((_castle)>>2)]=$18;
      var $19=HEAP32[((_hply)>>2)];
      var $20=((_hist_dat+$19*24)|0);
      var $21=(($20+12)|0);
      var $22=HEAP32[(($21)>>2)];
      HEAP32[((_ep)>>2)]=$22;
      var $23=HEAP32[((_hply)>>2)];
      var $24=((_hist_dat+$23*24)|0);
      var $25=(($24+16)|0);
      var $26=HEAP32[(($25)>>2)];
      HEAP32[((_fifty)>>2)]=$26;
      var $27=HEAP32[((_hply)>>2)];
      var $28=((_hist_dat+$27*24)|0);
      var $29=(($28+20)|0);
      var $30=HEAP32[(($29)>>2)];
      HEAP32[((_hash)>>2)]=$30;
      var $31=HEAP32[((_side)>>2)];
      var $32=(($m)|0);
      var $33=HEAP8[($32)];
      var $34=(($33 << 24) >> 24);
      var $35=((_color+($34<<2))|0);
      HEAP32[(($35)>>2)]=$31;
      var $36=(($m+3)|0);
      var $37=HEAP8[($36)];
      var $38=(($37 << 24) >> 24);
      var $39=$38 & 32;
      var $40=(($39)|0)!=0;
      if ($40) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      var $42=(($m)|0);
      var $43=HEAP8[($42)];
      var $44=(($43 << 24) >> 24);
      var $45=((_piece+($44<<2))|0);
      HEAP32[(($45)>>2)]=0;
      __label__ = 4; break;
    case 3: 
      var $47=(($m+1)|0);
      var $48=HEAP8[($47)];
      var $49=(($48 << 24) >> 24);
      var $50=((_piece+($49<<2))|0);
      var $51=HEAP32[(($50)>>2)];
      var $52=(($m)|0);
      var $53=HEAP8[($52)];
      var $54=(($53 << 24) >> 24);
      var $55=((_piece+($54<<2))|0);
      HEAP32[(($55)>>2)]=$51;
      __label__ = 4; break;
    case 4: 
      var $57=HEAP32[((_hply)>>2)];
      var $58=((_hist_dat+$57*24)|0);
      var $59=(($58+4)|0);
      var $60=HEAP32[(($59)>>2)];
      var $61=(($60)|0)==6;
      if ($61) { __label__ = 5; break; } else { __label__ = 6; break; }
    case 5: 
      var $63=(($m+1)|0);
      var $64=HEAP8[($63)];
      var $65=(($64 << 24) >> 24);
      var $66=((_color+($65<<2))|0);
      HEAP32[(($66)>>2)]=6;
      var $67=(($m+1)|0);
      var $68=HEAP8[($67)];
      var $69=(($68 << 24) >> 24);
      var $70=((_piece+($69<<2))|0);
      HEAP32[(($70)>>2)]=6;
      __label__ = 7; break;
    case 6: 
      var $72=HEAP32[((_xside)>>2)];
      var $73=(($m+1)|0);
      var $74=HEAP8[($73)];
      var $75=(($74 << 24) >> 24);
      var $76=((_color+($75<<2))|0);
      HEAP32[(($76)>>2)]=$72;
      var $77=HEAP32[((_hply)>>2)];
      var $78=((_hist_dat+$77*24)|0);
      var $79=(($78+4)|0);
      var $80=HEAP32[(($79)>>2)];
      var $81=(($m+1)|0);
      var $82=HEAP8[($81)];
      var $83=(($82 << 24) >> 24);
      var $84=((_piece+($83<<2))|0);
      HEAP32[(($84)>>2)]=$80;
      __label__ = 7; break;
    case 7: 
      var $86=(($m+3)|0);
      var $87=HEAP8[($86)];
      var $88=(($87 << 24) >> 24);
      var $89=$88 & 2;
      var $90=(($89)|0)!=0;
      if ($90) { __label__ = 8; break; } else { __label__ = 15; break; }
    case 8: 
      var $92=(($m+1)|0);
      var $93=HEAP8[($92)];
      var $94=(($93 << 24) >> 24);
      if ($94 == 62) {
        __label__ = 9; break;
      }
      else if ($94 == 58) {
        __label__ = 10; break;
      }
      else if ($94 == 6) {
        __label__ = 11; break;
      }
      else if ($94 == 2) {
        __label__ = 12; break;
      }
      else {
      __label__ = 13; break;
      }
      
    case 9: 
      $from=61;
      $to=63;
      __label__ = 14; break;
    case 10: 
      $from=59;
      $to=56;
      __label__ = 14; break;
    case 11: 
      $from=5;
      $to=7;
      __label__ = 14; break;
    case 12: 
      $from=3;
      $to=0;
      __label__ = 14; break;
    case 13: 
      $from=-1;
      $to=-1;
      __label__ = 14; break;
    case 14: 
      var $101=HEAP32[((_side)>>2)];
      var $102=$to;
      var $103=((_color+($102<<2))|0);
      HEAP32[(($103)>>2)]=$101;
      var $104=$to;
      var $105=((_piece+($104<<2))|0);
      HEAP32[(($105)>>2)]=3;
      var $106=$from;
      var $107=((_color+($106<<2))|0);
      HEAP32[(($107)>>2)]=6;
      var $108=$from;
      var $109=((_piece+($108<<2))|0);
      HEAP32[(($109)>>2)]=6;
      __label__ = 15; break;
    case 15: 
      var $111=(($m+3)|0);
      var $112=HEAP8[($111)];
      var $113=(($112 << 24) >> 24);
      var $114=$113 & 4;
      var $115=(($114)|0)!=0;
      if ($115) { __label__ = 16; break; } else { __label__ = 20; break; }
    case 16: 
      var $117=HEAP32[((_side)>>2)];
      var $118=(($117)|0)==0;
      if ($118) { __label__ = 17; break; } else { __label__ = 18; break; }
    case 17: 
      var $120=HEAP32[((_xside)>>2)];
      var $121=(($m+1)|0);
      var $122=HEAP8[($121)];
      var $123=(($122 << 24) >> 24);
      var $124=(($123+8)|0);
      var $125=((_color+($124<<2))|0);
      HEAP32[(($125)>>2)]=$120;
      var $126=(($m+1)|0);
      var $127=HEAP8[($126)];
      var $128=(($127 << 24) >> 24);
      var $129=(($128+8)|0);
      var $130=((_piece+($129<<2))|0);
      HEAP32[(($130)>>2)]=0;
      __label__ = 19; break;
    case 18: 
      var $132=HEAP32[((_xside)>>2)];
      var $133=(($m+1)|0);
      var $134=HEAP8[($133)];
      var $135=(($134 << 24) >> 24);
      var $136=(($135-8)|0);
      var $137=((_color+($136<<2))|0);
      HEAP32[(($137)>>2)]=$132;
      var $138=(($m+1)|0);
      var $139=HEAP8[($138)];
      var $140=(($139 << 24) >> 24);
      var $141=(($140-8)|0);
      var $142=((_piece+($141<<2))|0);
      HEAP32[(($142)>>2)]=0;
      __label__ = 19; break;
    case 19: 
      __label__ = 20; break;
    case 20: 
      STACKTOP = __stackBase__;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_takeback["X"]=1;

function _open_book() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1=_time(0);
      _srand($1);
      var $2=_fopen(((STRING_TABLE.__str)|0), ((STRING_TABLE.__str1)|0));
      HEAP32[((_book_file)>>2)]=$2;
      var $3=HEAP32[((_book_file)>>2)];
      var $4=(($3)|0)!=0;
      if ($4) { __label__ = 3; break; } else { __label__ = 2; break; }
    case 2: 
      var $6=_printf(((STRING_TABLE.__str2)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      __label__ = 3; break;
    case 3: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}


function _close_book() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1=HEAP32[((_book_file)>>2)];
      var $2=(($1)|0)!=0;
      if ($2) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      var $4=HEAP32[((_book_file)>>2)];
      var $5=_fclose($4);
      __label__ = 3; break;
    case 3: 
      HEAP32[((_book_file)>>2)]=0;
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}


function _book_move() {
  var __stackBase__  = STACKTOP; STACKTOP += 912; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $line=__stackBase__;
      var $book_line=__stackBase__+256;
      var $i;
      var $j;
      var $m;
      var $move=__stackBase__+512;
      var $count=__stackBase__+712;
      var $moves;
      var $total_count;
      $moves=0;
      $total_count=0;
      var $2=HEAP32[((_book_file)>>2)];
      var $3=(($2)|0)!=0;
      if ($3) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      var $5=HEAP32[((_hply)>>2)];
      var $6=(($5)|0) > 25;
      if ($6) { __label__ = 3; break; } else { __label__ = 4; break; }
    case 3: 
      $1=-1;
      __label__ = 32; break;
    case 4: 
      var $9=(($line)|0);
      HEAP8[($9)]=0;
      $j=0;
      $i=0;
      __label__ = 5; break;
    case 5: 
      var $11=$i;
      var $12=HEAP32[((_hply)>>2)];
      var $13=(($11)|0) < (($12)|0);
      if ($13) { __label__ = 6; break; } else { __label__ = 8; break; }
    case 6: 
      var $15=(($line)|0);
      var $16=$j;
      var $17=(($15+$16)|0);
      var $18=$i;
      var $19=((_hist_dat+$18*24)|0);
      var $20=(($19)|0);
      var $21=$20;
      var $22=_move_str($21);
      var $23=_sprintf($17, ((STRING_TABLE.__str3)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$22,tempInt));
      var $24=$j;
      var $25=(($24+$23)|0);
      $j=$25;
      __label__ = 7; break;
    case 7: 
      var $27=$i;
      var $28=(($27+1)|0);
      $i=$28;
      __label__ = 5; break;
    case 8: 
      var $30=HEAP32[((_book_file)>>2)];
      var $31=_fseek($30, 0, 0);
      __label__ = 9; break;
    case 9: 
      var $33=(($book_line)|0);
      var $34=HEAP32[((_book_file)>>2)];
      var $35=_fgets($33, 256, $34);
      var $36=(($35)|0)!=0;
      if ($36) { __label__ = 10; break; } else { __label__ = 23; break; }
    case 10: 
      var $38=(($line)|0);
      var $39=(($book_line)|0);
      var $40=_book_match($38, $39);
      var $41=(($40)|0)!=0;
      if ($41) { __label__ = 11; break; } else { __label__ = 22; break; }
    case 11: 
      var $43=(($line)|0);
      var $44=_strlen($43);
      var $45=(($book_line+$44)|0);
      var $46=_parse_move($45);
      $m=$46;
      var $47=$m;
      var $48=(($47)|0)==-1;
      if ($48) { __label__ = 12; break; } else { __label__ = 13; break; }
    case 12: 
      __label__ = 9; break;
    case 13: 
      var $51=$m;
      var $52=((_gen_dat+($51<<3))|0);
      var $53=(($52)|0);
      var $54=$53;
      var $55=HEAP32[(($54)>>2)];
      $m=$55;
      $j=0;
      __label__ = 14; break;
    case 14: 
      var $57=$j;
      var $58=$moves;
      var $59=(($57)|0) < (($58)|0);
      if ($59) { __label__ = 15; break; } else { __label__ = 19; break; }
    case 15: 
      var $61=$j;
      var $62=(($move+($61<<2))|0);
      var $63=HEAP32[(($62)>>2)];
      var $64=$m;
      var $65=(($63)|0)==(($64)|0);
      if ($65) { __label__ = 16; break; } else { __label__ = 17; break; }
    case 16: 
      var $67=$j;
      var $68=(($count+($67<<2))|0);
      var $69=HEAP32[(($68)>>2)];
      var $70=(($69+1)|0);
      HEAP32[(($68)>>2)]=$70;
      __label__ = 19; break;
    case 17: 
      __label__ = 18; break;
    case 18: 
      var $73=$j;
      var $74=(($73+1)|0);
      $j=$74;
      __label__ = 14; break;
    case 19: 
      var $76=$j;
      var $77=$moves;
      var $78=(($76)|0)==(($77)|0);
      if ($78) { __label__ = 20; break; } else { __label__ = 21; break; }
    case 20: 
      var $80=$m;
      var $81=$moves;
      var $82=(($move+($81<<2))|0);
      HEAP32[(($82)>>2)]=$80;
      var $83=$moves;
      var $84=(($count+($83<<2))|0);
      HEAP32[(($84)>>2)]=1;
      var $85=$moves;
      var $86=(($85+1)|0);
      $moves=$86;
      __label__ = 21; break;
    case 21: 
      var $88=$total_count;
      var $89=(($88+1)|0);
      $total_count=$89;
      __label__ = 22; break;
    case 22: 
      __label__ = 9; break;
    case 23: 
      var $92=$moves;
      var $93=(($92)|0)==0;
      if ($93) { __label__ = 24; break; } else { __label__ = 25; break; }
    case 24: 
      $1=-1;
      __label__ = 32; break;
    case 25: 
      var $96=_rand();
      var $97=$total_count;
      var $98=(($96)|0)%(($97)|0);
      $j=$98;
      $i=0;
      __label__ = 26; break;
    case 26: 
      var $100=$i;
      var $101=$moves;
      var $102=(($100)|0) < (($101)|0);
      if ($102) { __label__ = 27; break; } else { __label__ = 31; break; }
    case 27: 
      var $104=$i;
      var $105=(($count+($104<<2))|0);
      var $106=HEAP32[(($105)>>2)];
      var $107=$j;
      var $108=(($107-$106)|0);
      $j=$108;
      var $109=$j;
      var $110=(($109)|0) < 0;
      if ($110) { __label__ = 28; break; } else { __label__ = 29; break; }
    case 28: 
      var $112=$i;
      var $113=(($move+($112<<2))|0);
      var $114=HEAP32[(($113)>>2)];
      $1=$114;
      __label__ = 32; break;
    case 29: 
      __label__ = 30; break;
    case 30: 
      var $117=$i;
      var $118=(($117+1)|0);
      $i=$118;
      __label__ = 26; break;
    case 31: 
      $1=-1;
      __label__ = 32; break;
    case 32: 
      var $121=$1;
      STACKTOP = __stackBase__;
      return $121;
    default: assert(0, "bad label: " + __label__);
  }
}
_book_move["X"]=1;

function _book_match($s1, $s2) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $3;
      var $i;
      $2=$s1;
      $3=$s2;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $5=$i;
      var $6=$2;
      var $7=_strlen($6);
      var $8=(($5)|0) < (($7)|0);
      if ($8) { __label__ = 3; break; } else { __label__ = 8; break; }
    case 3: 
      var $10=$i;
      var $11=$3;
      var $12=(($11+$10)|0);
      var $13=HEAP8[($12)];
      var $14=(($13 << 24) >> 24);
      var $15=(($14)|0)==0;
      if ($15) { __label__ = 5; break; } else { __label__ = 4; break; }
    case 4: 
      var $17=$i;
      var $18=$3;
      var $19=(($18+$17)|0);
      var $20=HEAP8[($19)];
      var $21=(($20 << 24) >> 24);
      var $22=$i;
      var $23=$2;
      var $24=(($23+$22)|0);
      var $25=HEAP8[($24)];
      var $26=(($25 << 24) >> 24);
      var $27=(($21)|0)!=(($26)|0);
      if ($27) { __label__ = 5; break; } else { __label__ = 6; break; }
    case 5: 
      $1=0;
      __label__ = 9; break;
    case 6: 
      __label__ = 7; break;
    case 7: 
      var $31=$i;
      var $32=(($31+1)|0);
      $i=$32;
      __label__ = 2; break;
    case 8: 
      $1=1;
      __label__ = 9; break;
    case 9: 
      var $35=$1;
      ;
      return $35;
    default: assert(0, "bad label: " + __label__);
  }
}


function _eval_light_pawn($sq) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $r;
      var $f;
      $1=$sq;
      $r=0;
      var $2=$1;
      var $3=$2 & 7;
      var $4=(($3+1)|0);
      $f=$4;
      var $5=$1;
      var $6=((_pawn_pcsq+($5<<2))|0);
      var $7=HEAP32[(($6)>>2)];
      var $8=$r;
      var $9=(($8+$7)|0);
      $r=$9;
      var $10=$f;
      var $11=((((_pawn_rank)|0)+($10<<2))|0);
      var $12=HEAP32[(($11)>>2)];
      var $13=$1;
      var $14=$13 >> 3;
      var $15=(($12)|0) > (($14)|0);
      if ($15) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      var $17=$r;
      var $18=(($17-10)|0);
      $r=$18;
      __label__ = 3; break;
    case 3: 
      var $20=$f;
      var $21=(($20-1)|0);
      var $22=((((_pawn_rank)|0)+($21<<2))|0);
      var $23=HEAP32[(($22)>>2)];
      var $24=(($23)|0)==0;
      if ($24) { __label__ = 4; break; } else { __label__ = 6; break; }
    case 4: 
      var $26=$f;
      var $27=(($26+1)|0);
      var $28=((((_pawn_rank)|0)+($27<<2))|0);
      var $29=HEAP32[(($28)>>2)];
      var $30=(($29)|0)==0;
      if ($30) { __label__ = 5; break; } else { __label__ = 6; break; }
    case 5: 
      var $32=$r;
      var $33=(($32-20)|0);
      $r=$33;
      __label__ = 10; break;
    case 6: 
      var $35=$f;
      var $36=(($35-1)|0);
      var $37=((((_pawn_rank)|0)+($36<<2))|0);
      var $38=HEAP32[(($37)>>2)];
      var $39=$1;
      var $40=$39 >> 3;
      var $41=(($38)|0) < (($40)|0);
      if ($41) { __label__ = 7; break; } else { __label__ = 9; break; }
    case 7: 
      var $43=$f;
      var $44=(($43+1)|0);
      var $45=((((_pawn_rank)|0)+($44<<2))|0);
      var $46=HEAP32[(($45)>>2)];
      var $47=$1;
      var $48=$47 >> 3;
      var $49=(($46)|0) < (($48)|0);
      if ($49) { __label__ = 8; break; } else { __label__ = 9; break; }
    case 8: 
      var $51=$r;
      var $52=(($51-8)|0);
      $r=$52;
      __label__ = 9; break;
    case 9: 
      __label__ = 10; break;
    case 10: 
      var $55=$f;
      var $56=(($55-1)|0);
      var $57=((((_pawn_rank+40)|0)+($56<<2))|0);
      var $58=HEAP32[(($57)>>2)];
      var $59=$1;
      var $60=$59 >> 3;
      var $61=(($58)|0) >= (($60)|0);
      if ($61) { __label__ = 11; break; } else { __label__ = 14; break; }
    case 11: 
      var $63=$f;
      var $64=((((_pawn_rank+40)|0)+($63<<2))|0);
      var $65=HEAP32[(($64)>>2)];
      var $66=$1;
      var $67=$66 >> 3;
      var $68=(($65)|0) >= (($67)|0);
      if ($68) { __label__ = 12; break; } else { __label__ = 14; break; }
    case 12: 
      var $70=$f;
      var $71=(($70+1)|0);
      var $72=((((_pawn_rank+40)|0)+($71<<2))|0);
      var $73=HEAP32[(($72)>>2)];
      var $74=$1;
      var $75=$74 >> 3;
      var $76=(($73)|0) >= (($75)|0);
      if ($76) { __label__ = 13; break; } else { __label__ = 14; break; }
    case 13: 
      var $78=$1;
      var $79=$78 >> 3;
      var $80=((7-$79)|0);
      var $81=(($80*20)|0);
      var $82=$r;
      var $83=(($82+$81)|0);
      $r=$83;
      __label__ = 14; break;
    case 14: 
      var $85=$r;
      ;
      return $85;
    default: assert(0, "bad label: " + __label__);
  }
}
_eval_light_pawn["X"]=1;

function _eval_dark_pawn($sq) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $r;
      var $f;
      $1=$sq;
      $r=0;
      var $2=$1;
      var $3=$2 & 7;
      var $4=(($3+1)|0);
      $f=$4;
      var $5=$1;
      var $6=((_flip+($5<<2))|0);
      var $7=HEAP32[(($6)>>2)];
      var $8=((_pawn_pcsq+($7<<2))|0);
      var $9=HEAP32[(($8)>>2)];
      var $10=$r;
      var $11=(($10+$9)|0);
      $r=$11;
      var $12=$f;
      var $13=((((_pawn_rank+40)|0)+($12<<2))|0);
      var $14=HEAP32[(($13)>>2)];
      var $15=$1;
      var $16=$15 >> 3;
      var $17=(($14)|0) < (($16)|0);
      if ($17) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      var $19=$r;
      var $20=(($19-10)|0);
      $r=$20;
      __label__ = 3; break;
    case 3: 
      var $22=$f;
      var $23=(($22-1)|0);
      var $24=((((_pawn_rank+40)|0)+($23<<2))|0);
      var $25=HEAP32[(($24)>>2)];
      var $26=(($25)|0)==7;
      if ($26) { __label__ = 4; break; } else { __label__ = 6; break; }
    case 4: 
      var $28=$f;
      var $29=(($28+1)|0);
      var $30=((((_pawn_rank+40)|0)+($29<<2))|0);
      var $31=HEAP32[(($30)>>2)];
      var $32=(($31)|0)==7;
      if ($32) { __label__ = 5; break; } else { __label__ = 6; break; }
    case 5: 
      var $34=$r;
      var $35=(($34-20)|0);
      $r=$35;
      __label__ = 10; break;
    case 6: 
      var $37=$f;
      var $38=(($37-1)|0);
      var $39=((((_pawn_rank+40)|0)+($38<<2))|0);
      var $40=HEAP32[(($39)>>2)];
      var $41=$1;
      var $42=$41 >> 3;
      var $43=(($40)|0) > (($42)|0);
      if ($43) { __label__ = 7; break; } else { __label__ = 9; break; }
    case 7: 
      var $45=$f;
      var $46=(($45+1)|0);
      var $47=((((_pawn_rank+40)|0)+($46<<2))|0);
      var $48=HEAP32[(($47)>>2)];
      var $49=$1;
      var $50=$49 >> 3;
      var $51=(($48)|0) > (($50)|0);
      if ($51) { __label__ = 8; break; } else { __label__ = 9; break; }
    case 8: 
      var $53=$r;
      var $54=(($53-8)|0);
      $r=$54;
      __label__ = 9; break;
    case 9: 
      __label__ = 10; break;
    case 10: 
      var $57=$f;
      var $58=(($57-1)|0);
      var $59=((((_pawn_rank)|0)+($58<<2))|0);
      var $60=HEAP32[(($59)>>2)];
      var $61=$1;
      var $62=$61 >> 3;
      var $63=(($60)|0) <= (($62)|0);
      if ($63) { __label__ = 11; break; } else { __label__ = 14; break; }
    case 11: 
      var $65=$f;
      var $66=((((_pawn_rank)|0)+($65<<2))|0);
      var $67=HEAP32[(($66)>>2)];
      var $68=$1;
      var $69=$68 >> 3;
      var $70=(($67)|0) <= (($69)|0);
      if ($70) { __label__ = 12; break; } else { __label__ = 14; break; }
    case 12: 
      var $72=$f;
      var $73=(($72+1)|0);
      var $74=((((_pawn_rank)|0)+($73<<2))|0);
      var $75=HEAP32[(($74)>>2)];
      var $76=$1;
      var $77=$76 >> 3;
      var $78=(($75)|0) <= (($77)|0);
      if ($78) { __label__ = 13; break; } else { __label__ = 14; break; }
    case 13: 
      var $80=$1;
      var $81=$80 >> 3;
      var $82=(($81*20)|0);
      var $83=$r;
      var $84=(($83+$82)|0);
      $r=$84;
      __label__ = 14; break;
    case 14: 
      var $86=$r;
      ;
      return $86;
    default: assert(0, "bad label: " + __label__);
  }
}
_eval_dark_pawn["X"]=1;

function _eval() {
  var __stackBase__  = STACKTOP; STACKTOP += 8; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $i;
      var $f;
      var $score=__stackBase__;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $3=$i;
      var $4=(($3)|0) < 10;
      if ($4) { __label__ = 3; break; } else { __label__ = 5; break; }
    case 3: 
      var $6=$i;
      var $7=((((_pawn_rank)|0)+($6<<2))|0);
      HEAP32[(($7)>>2)]=0;
      var $8=$i;
      var $9=((((_pawn_rank+40)|0)+($8<<2))|0);
      HEAP32[(($9)>>2)]=7;
      __label__ = 4; break;
    case 4: 
      var $11=$i;
      var $12=(($11+1)|0);
      $i=$12;
      __label__ = 2; break;
    case 5: 
      HEAP32[((((_piece_mat)|0))>>2)]=0;
      HEAP32[((((_piece_mat+4)|0))>>2)]=0;
      HEAP32[((((_pawn_mat)|0))>>2)]=0;
      HEAP32[((((_pawn_mat+4)|0))>>2)]=0;
      $i=0;
      __label__ = 6; break;
    case 6: 
      var $15=$i;
      var $16=(($15)|0) < 64;
      if ($16) { __label__ = 7; break; } else { __label__ = 21; break; }
    case 7: 
      var $18=$i;
      var $19=((_color+($18<<2))|0);
      var $20=HEAP32[(($19)>>2)];
      var $21=(($20)|0)==6;
      if ($21) { __label__ = 8; break; } else { __label__ = 9; break; }
    case 8: 
      __label__ = 20; break;
    case 9: 
      var $24=$i;
      var $25=((_piece+($24<<2))|0);
      var $26=HEAP32[(($25)>>2)];
      var $27=(($26)|0)==0;
      if ($27) { __label__ = 10; break; } else { __label__ = 18; break; }
    case 10: 
      var $29=HEAP32[((((_piece_value)|0))>>2)];
      var $30=$i;
      var $31=((_color+($30<<2))|0);
      var $32=HEAP32[(($31)>>2)];
      var $33=((_pawn_mat+($32<<2))|0);
      var $34=HEAP32[(($33)>>2)];
      var $35=(($34+$29)|0);
      HEAP32[(($33)>>2)]=$35;
      var $36=$i;
      var $37=$36 & 7;
      var $38=(($37+1)|0);
      $f=$38;
      var $39=$i;
      var $40=((_color+($39<<2))|0);
      var $41=HEAP32[(($40)>>2)];
      var $42=(($41)|0)==0;
      if ($42) { __label__ = 11; break; } else { __label__ = 14; break; }
    case 11: 
      var $44=$f;
      var $45=((((_pawn_rank)|0)+($44<<2))|0);
      var $46=HEAP32[(($45)>>2)];
      var $47=$i;
      var $48=$47 >> 3;
      var $49=(($46)|0) < (($48)|0);
      if ($49) { __label__ = 12; break; } else { __label__ = 13; break; }
    case 12: 
      var $51=$i;
      var $52=$51 >> 3;
      var $53=$f;
      var $54=((((_pawn_rank)|0)+($53<<2))|0);
      HEAP32[(($54)>>2)]=$52;
      __label__ = 13; break;
    case 13: 
      __label__ = 17; break;
    case 14: 
      var $57=$f;
      var $58=((((_pawn_rank+40)|0)+($57<<2))|0);
      var $59=HEAP32[(($58)>>2)];
      var $60=$i;
      var $61=$60 >> 3;
      var $62=(($59)|0) > (($61)|0);
      if ($62) { __label__ = 15; break; } else { __label__ = 16; break; }
    case 15: 
      var $64=$i;
      var $65=$64 >> 3;
      var $66=$f;
      var $67=((((_pawn_rank+40)|0)+($66<<2))|0);
      HEAP32[(($67)>>2)]=$65;
      __label__ = 16; break;
    case 16: 
      __label__ = 17; break;
    case 17: 
      __label__ = 19; break;
    case 18: 
      var $71=$i;
      var $72=((_piece+($71<<2))|0);
      var $73=HEAP32[(($72)>>2)];
      var $74=((_piece_value+($73<<2))|0);
      var $75=HEAP32[(($74)>>2)];
      var $76=$i;
      var $77=((_color+($76<<2))|0);
      var $78=HEAP32[(($77)>>2)];
      var $79=((_piece_mat+($78<<2))|0);
      var $80=HEAP32[(($79)>>2)];
      var $81=(($80+$75)|0);
      HEAP32[(($79)>>2)]=$81;
      __label__ = 19; break;
    case 19: 
      __label__ = 20; break;
    case 20: 
      var $84=$i;
      var $85=(($84+1)|0);
      $i=$85;
      __label__ = 6; break;
    case 21: 
      var $87=HEAP32[((((_piece_mat)|0))>>2)];
      var $88=HEAP32[((((_pawn_mat)|0))>>2)];
      var $89=(($87+$88)|0);
      var $90=(($score)|0);
      HEAP32[(($90)>>2)]=$89;
      var $91=HEAP32[((((_piece_mat+4)|0))>>2)];
      var $92=HEAP32[((((_pawn_mat+4)|0))>>2)];
      var $93=(($91+$92)|0);
      var $94=(($score+4)|0);
      HEAP32[(($94)>>2)]=$93;
      $i=0;
      __label__ = 22; break;
    case 22: 
      var $96=$i;
      var $97=(($96)|0) < 64;
      if ($97) { __label__ = 23; break; } else { __label__ = 62; break; }
    case 23: 
      var $99=$i;
      var $100=((_color+($99<<2))|0);
      var $101=HEAP32[(($100)>>2)];
      var $102=(($101)|0)==6;
      if ($102) { __label__ = 24; break; } else { __label__ = 25; break; }
    case 24: 
      __label__ = 61; break;
    case 25: 
      var $105=$i;
      var $106=((_color+($105<<2))|0);
      var $107=HEAP32[(($106)>>2)];
      var $108=(($107)|0)==0;
      if ($108) { __label__ = 26; break; } else { __label__ = 43; break; }
    case 26: 
      var $110=$i;
      var $111=((_piece+($110<<2))|0);
      var $112=HEAP32[(($111)>>2)];
      if ($112 == 0) {
        __label__ = 27; break;
      }
      else if ($112 == 1) {
        __label__ = 28; break;
      }
      else if ($112 == 2) {
        __label__ = 29; break;
      }
      else if ($112 == 3) {
        __label__ = 30; break;
      }
      else if ($112 == 5) {
        __label__ = 38; break;
      }
      else {
      __label__ = 42; break;
      }
      
    case 27: 
      var $114=$i;
      var $115=_eval_light_pawn($114);
      var $116=(($score)|0);
      var $117=HEAP32[(($116)>>2)];
      var $118=(($117+$115)|0);
      HEAP32[(($116)>>2)]=$118;
      __label__ = 42; break;
    case 28: 
      var $120=$i;
      var $121=((_knight_pcsq+($120<<2))|0);
      var $122=HEAP32[(($121)>>2)];
      var $123=(($score)|0);
      var $124=HEAP32[(($123)>>2)];
      var $125=(($124+$122)|0);
      HEAP32[(($123)>>2)]=$125;
      __label__ = 42; break;
    case 29: 
      var $127=$i;
      var $128=((_bishop_pcsq+($127<<2))|0);
      var $129=HEAP32[(($128)>>2)];
      var $130=(($score)|0);
      var $131=HEAP32[(($130)>>2)];
      var $132=(($131+$129)|0);
      HEAP32[(($130)>>2)]=$132;
      __label__ = 42; break;
    case 30: 
      var $134=$i;
      var $135=$134 & 7;
      var $136=(($135+1)|0);
      var $137=((((_pawn_rank)|0)+($136<<2))|0);
      var $138=HEAP32[(($137)>>2)];
      var $139=(($138)|0)==0;
      if ($139) { __label__ = 31; break; } else { __label__ = 35; break; }
    case 31: 
      var $141=$i;
      var $142=$141 & 7;
      var $143=(($142+1)|0);
      var $144=((((_pawn_rank+40)|0)+($143<<2))|0);
      var $145=HEAP32[(($144)>>2)];
      var $146=(($145)|0)==7;
      if ($146) { __label__ = 32; break; } else { __label__ = 33; break; }
    case 32: 
      var $148=(($score)|0);
      var $149=HEAP32[(($148)>>2)];
      var $150=(($149+15)|0);
      HEAP32[(($148)>>2)]=$150;
      __label__ = 34; break;
    case 33: 
      var $152=(($score)|0);
      var $153=HEAP32[(($152)>>2)];
      var $154=(($153+10)|0);
      HEAP32[(($152)>>2)]=$154;
      __label__ = 34; break;
    case 34: 
      __label__ = 35; break;
    case 35: 
      var $157=$i;
      var $158=$157 >> 3;
      var $159=(($158)|0)==1;
      if ($159) { __label__ = 36; break; } else { __label__ = 37; break; }
    case 36: 
      var $161=(($score)|0);
      var $162=HEAP32[(($161)>>2)];
      var $163=(($162+20)|0);
      HEAP32[(($161)>>2)]=$163;
      __label__ = 37; break;
    case 37: 
      __label__ = 42; break;
    case 38: 
      var $166=HEAP32[((((_piece_mat+4)|0))>>2)];
      var $167=(($166)|0) <= 1200;
      if ($167) { __label__ = 39; break; } else { __label__ = 40; break; }
    case 39: 
      var $169=$i;
      var $170=((_king_endgame_pcsq+($169<<2))|0);
      var $171=HEAP32[(($170)>>2)];
      var $172=(($score)|0);
      var $173=HEAP32[(($172)>>2)];
      var $174=(($173+$171)|0);
      HEAP32[(($172)>>2)]=$174;
      __label__ = 41; break;
    case 40: 
      var $176=$i;
      var $177=_eval_light_king($176);
      var $178=(($score)|0);
      var $179=HEAP32[(($178)>>2)];
      var $180=(($179+$177)|0);
      HEAP32[(($178)>>2)]=$180;
      __label__ = 41; break;
    case 41: 
      __label__ = 42; break;
    case 42: 
      __label__ = 60; break;
    case 43: 
      var $184=$i;
      var $185=((_piece+($184<<2))|0);
      var $186=HEAP32[(($185)>>2)];
      if ($186 == 0) {
        __label__ = 44; break;
      }
      else if ($186 == 1) {
        __label__ = 45; break;
      }
      else if ($186 == 2) {
        __label__ = 46; break;
      }
      else if ($186 == 3) {
        __label__ = 47; break;
      }
      else if ($186 == 5) {
        __label__ = 55; break;
      }
      else {
      __label__ = 59; break;
      }
      
    case 44: 
      var $188=$i;
      var $189=_eval_dark_pawn($188);
      var $190=(($score+4)|0);
      var $191=HEAP32[(($190)>>2)];
      var $192=(($191+$189)|0);
      HEAP32[(($190)>>2)]=$192;
      __label__ = 59; break;
    case 45: 
      var $194=$i;
      var $195=((_flip+($194<<2))|0);
      var $196=HEAP32[(($195)>>2)];
      var $197=((_knight_pcsq+($196<<2))|0);
      var $198=HEAP32[(($197)>>2)];
      var $199=(($score+4)|0);
      var $200=HEAP32[(($199)>>2)];
      var $201=(($200+$198)|0);
      HEAP32[(($199)>>2)]=$201;
      __label__ = 59; break;
    case 46: 
      var $203=$i;
      var $204=((_flip+($203<<2))|0);
      var $205=HEAP32[(($204)>>2)];
      var $206=((_bishop_pcsq+($205<<2))|0);
      var $207=HEAP32[(($206)>>2)];
      var $208=(($score+4)|0);
      var $209=HEAP32[(($208)>>2)];
      var $210=(($209+$207)|0);
      HEAP32[(($208)>>2)]=$210;
      __label__ = 59; break;
    case 47: 
      var $212=$i;
      var $213=$212 & 7;
      var $214=(($213+1)|0);
      var $215=((((_pawn_rank+40)|0)+($214<<2))|0);
      var $216=HEAP32[(($215)>>2)];
      var $217=(($216)|0)==7;
      if ($217) { __label__ = 48; break; } else { __label__ = 52; break; }
    case 48: 
      var $219=$i;
      var $220=$219 & 7;
      var $221=(($220+1)|0);
      var $222=((((_pawn_rank)|0)+($221<<2))|0);
      var $223=HEAP32[(($222)>>2)];
      var $224=(($223)|0)==0;
      if ($224) { __label__ = 49; break; } else { __label__ = 50; break; }
    case 49: 
      var $226=(($score+4)|0);
      var $227=HEAP32[(($226)>>2)];
      var $228=(($227+15)|0);
      HEAP32[(($226)>>2)]=$228;
      __label__ = 51; break;
    case 50: 
      var $230=(($score+4)|0);
      var $231=HEAP32[(($230)>>2)];
      var $232=(($231+10)|0);
      HEAP32[(($230)>>2)]=$232;
      __label__ = 51; break;
    case 51: 
      __label__ = 52; break;
    case 52: 
      var $235=$i;
      var $236=$235 >> 3;
      var $237=(($236)|0)==6;
      if ($237) { __label__ = 53; break; } else { __label__ = 54; break; }
    case 53: 
      var $239=(($score+4)|0);
      var $240=HEAP32[(($239)>>2)];
      var $241=(($240+20)|0);
      HEAP32[(($239)>>2)]=$241;
      __label__ = 54; break;
    case 54: 
      __label__ = 59; break;
    case 55: 
      var $244=HEAP32[((((_piece_mat)|0))>>2)];
      var $245=(($244)|0) <= 1200;
      if ($245) { __label__ = 56; break; } else { __label__ = 57; break; }
    case 56: 
      var $247=$i;
      var $248=((_flip+($247<<2))|0);
      var $249=HEAP32[(($248)>>2)];
      var $250=((_king_endgame_pcsq+($249<<2))|0);
      var $251=HEAP32[(($250)>>2)];
      var $252=(($score+4)|0);
      var $253=HEAP32[(($252)>>2)];
      var $254=(($253+$251)|0);
      HEAP32[(($252)>>2)]=$254;
      __label__ = 58; break;
    case 57: 
      var $256=$i;
      var $257=_eval_dark_king($256);
      var $258=(($score+4)|0);
      var $259=HEAP32[(($258)>>2)];
      var $260=(($259+$257)|0);
      HEAP32[(($258)>>2)]=$260;
      __label__ = 58; break;
    case 58: 
      __label__ = 59; break;
    case 59: 
      __label__ = 60; break;
    case 60: 
      __label__ = 61; break;
    case 61: 
      var $265=$i;
      var $266=(($265+1)|0);
      $i=$266;
      __label__ = 22; break;
    case 62: 
      var $268=HEAP32[((_side)>>2)];
      var $269=(($268)|0)==0;
      if ($269) { __label__ = 63; break; } else { __label__ = 64; break; }
    case 63: 
      var $271=(($score)|0);
      var $272=HEAP32[(($271)>>2)];
      var $273=(($score+4)|0);
      var $274=HEAP32[(($273)>>2)];
      var $275=(($272-$274)|0);
      $1=$275;
      __label__ = 65; break;
    case 64: 
      var $277=(($score+4)|0);
      var $278=HEAP32[(($277)>>2)];
      var $279=(($score)|0);
      var $280=HEAP32[(($279)>>2)];
      var $281=(($278-$280)|0);
      $1=$281;
      __label__ = 65; break;
    case 65: 
      var $283=$1;
      STACKTOP = __stackBase__;
      return $283;
    default: assert(0, "bad label: " + __label__);
  }
}
_eval["X"]=1;

function _eval_light_king($sq) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $r;
      var $i;
      $1=$sq;
      var $2=$1;
      var $3=((_king_pcsq+($2<<2))|0);
      var $4=HEAP32[(($3)>>2)];
      $r=$4;
      var $5=$1;
      var $6=$5 & 7;
      var $7=(($6)|0) < 3;
      if ($7) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      var $9=_eval_lkp(1);
      var $10=$r;
      var $11=(($10+$9)|0);
      $r=$11;
      var $12=_eval_lkp(2);
      var $13=$r;
      var $14=(($13+$12)|0);
      $r=$14;
      var $15=_eval_lkp(3);
      var $16=(((($15)|0)/2)|0);
      var $17=$r;
      var $18=(($17+$16)|0);
      $r=$18;
      __label__ = 14; break;
    case 3: 
      var $20=$1;
      var $21=$20 & 7;
      var $22=(($21)|0) > 4;
      if ($22) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $24=_eval_lkp(8);
      var $25=$r;
      var $26=(($25+$24)|0);
      $r=$26;
      var $27=_eval_lkp(7);
      var $28=$r;
      var $29=(($28+$27)|0);
      $r=$29;
      var $30=_eval_lkp(6);
      var $31=(((($30)|0)/2)|0);
      var $32=$r;
      var $33=(($32+$31)|0);
      $r=$33;
      __label__ = 13; break;
    case 5: 
      var $35=$1;
      var $36=$35 & 7;
      $i=$36;
      __label__ = 6; break;
    case 6: 
      var $38=$i;
      var $39=$1;
      var $40=$39 & 7;
      var $41=(($40+2)|0);
      var $42=(($38)|0) <= (($41)|0);
      if ($42) { __label__ = 7; break; } else { __label__ = 12; break; }
    case 7: 
      var $44=$i;
      var $45=((((_pawn_rank)|0)+($44<<2))|0);
      var $46=HEAP32[(($45)>>2)];
      var $47=(($46)|0)==0;
      if ($47) { __label__ = 8; break; } else { __label__ = 10; break; }
    case 8: 
      var $49=$i;
      var $50=((((_pawn_rank+40)|0)+($49<<2))|0);
      var $51=HEAP32[(($50)>>2)];
      var $52=(($51)|0)==7;
      if ($52) { __label__ = 9; break; } else { __label__ = 10; break; }
    case 9: 
      var $54=$r;
      var $55=(($54-10)|0);
      $r=$55;
      __label__ = 10; break;
    case 10: 
      __label__ = 11; break;
    case 11: 
      var $58=$i;
      var $59=(($58+1)|0);
      $i=$59;
      __label__ = 6; break;
    case 12: 
      __label__ = 13; break;
    case 13: 
      __label__ = 14; break;
    case 14: 
      var $63=HEAP32[((((_piece_mat+4)|0))>>2)];
      var $64=$r;
      var $65=(($64*$63)|0);
      $r=$65;
      var $66=$r;
      var $67=(((($66)|0)/3100)|0);
      $r=$67;
      var $68=$r;
      ;
      return $68;
    default: assert(0, "bad label: " + __label__);
  }
}
_eval_light_king["X"]=1;

function _eval_dark_king($sq) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $r;
      var $i;
      $1=$sq;
      var $2=$1;
      var $3=((_flip+($2<<2))|0);
      var $4=HEAP32[(($3)>>2)];
      var $5=((_king_pcsq+($4<<2))|0);
      var $6=HEAP32[(($5)>>2)];
      $r=$6;
      var $7=$1;
      var $8=$7 & 7;
      var $9=(($8)|0) < 3;
      if ($9) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      var $11=_eval_dkp(1);
      var $12=$r;
      var $13=(($12+$11)|0);
      $r=$13;
      var $14=_eval_dkp(2);
      var $15=$r;
      var $16=(($15+$14)|0);
      $r=$16;
      var $17=_eval_dkp(3);
      var $18=(((($17)|0)/2)|0);
      var $19=$r;
      var $20=(($19+$18)|0);
      $r=$20;
      __label__ = 14; break;
    case 3: 
      var $22=$1;
      var $23=$22 & 7;
      var $24=(($23)|0) > 4;
      if ($24) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $26=_eval_dkp(8);
      var $27=$r;
      var $28=(($27+$26)|0);
      $r=$28;
      var $29=_eval_dkp(7);
      var $30=$r;
      var $31=(($30+$29)|0);
      $r=$31;
      var $32=_eval_dkp(6);
      var $33=(((($32)|0)/2)|0);
      var $34=$r;
      var $35=(($34+$33)|0);
      $r=$35;
      __label__ = 13; break;
    case 5: 
      var $37=$1;
      var $38=$37 & 7;
      $i=$38;
      __label__ = 6; break;
    case 6: 
      var $40=$i;
      var $41=$1;
      var $42=$41 & 7;
      var $43=(($42+2)|0);
      var $44=(($40)|0) <= (($43)|0);
      if ($44) { __label__ = 7; break; } else { __label__ = 12; break; }
    case 7: 
      var $46=$i;
      var $47=((((_pawn_rank)|0)+($46<<2))|0);
      var $48=HEAP32[(($47)>>2)];
      var $49=(($48)|0)==0;
      if ($49) { __label__ = 8; break; } else { __label__ = 10; break; }
    case 8: 
      var $51=$i;
      var $52=((((_pawn_rank+40)|0)+($51<<2))|0);
      var $53=HEAP32[(($52)>>2)];
      var $54=(($53)|0)==7;
      if ($54) { __label__ = 9; break; } else { __label__ = 10; break; }
    case 9: 
      var $56=$r;
      var $57=(($56-10)|0);
      $r=$57;
      __label__ = 10; break;
    case 10: 
      __label__ = 11; break;
    case 11: 
      var $60=$i;
      var $61=(($60+1)|0);
      $i=$61;
      __label__ = 6; break;
    case 12: 
      __label__ = 13; break;
    case 13: 
      __label__ = 14; break;
    case 14: 
      var $65=HEAP32[((((_piece_mat)|0))>>2)];
      var $66=$r;
      var $67=(($66*$65)|0);
      $r=$67;
      var $68=$r;
      var $69=(((($68)|0)/3100)|0);
      $r=$69;
      var $70=$r;
      ;
      return $70;
    default: assert(0, "bad label: " + __label__);
  }
}
_eval_dark_king["X"]=1;

function _eval_lkp($f) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $r;
      $1=$f;
      $r=0;
      var $2=$1;
      var $3=((((_pawn_rank)|0)+($2<<2))|0);
      var $4=HEAP32[(($3)>>2)];
      var $5=(($4)|0)==6;
      if ($5) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      __label__ = 10; break;
    case 3: 
      var $8=$1;
      var $9=((((_pawn_rank)|0)+($8<<2))|0);
      var $10=HEAP32[(($9)>>2)];
      var $11=(($10)|0)==5;
      if ($11) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $13=$r;
      var $14=(($13-10)|0);
      $r=$14;
      __label__ = 9; break;
    case 5: 
      var $16=$1;
      var $17=((((_pawn_rank)|0)+($16<<2))|0);
      var $18=HEAP32[(($17)>>2)];
      var $19=(($18)|0)!=0;
      if ($19) { __label__ = 6; break; } else { __label__ = 7; break; }
    case 6: 
      var $21=$r;
      var $22=(($21-20)|0);
      $r=$22;
      __label__ = 8; break;
    case 7: 
      var $24=$r;
      var $25=(($24-25)|0);
      $r=$25;
      __label__ = 8; break;
    case 8: 
      __label__ = 9; break;
    case 9: 
      __label__ = 10; break;
    case 10: 
      var $29=$1;
      var $30=((((_pawn_rank+40)|0)+($29<<2))|0);
      var $31=HEAP32[(($30)>>2)];
      var $32=(($31)|0)==7;
      if ($32) { __label__ = 11; break; } else { __label__ = 12; break; }
    case 11: 
      var $34=$r;
      var $35=(($34-15)|0);
      $r=$35;
      __label__ = 18; break;
    case 12: 
      var $37=$1;
      var $38=((((_pawn_rank+40)|0)+($37<<2))|0);
      var $39=HEAP32[(($38)>>2)];
      var $40=(($39)|0)==5;
      if ($40) { __label__ = 13; break; } else { __label__ = 14; break; }
    case 13: 
      var $42=$r;
      var $43=(($42-10)|0);
      $r=$43;
      __label__ = 17; break;
    case 14: 
      var $45=$1;
      var $46=((((_pawn_rank+40)|0)+($45<<2))|0);
      var $47=HEAP32[(($46)>>2)];
      var $48=(($47)|0)==4;
      if ($48) { __label__ = 15; break; } else { __label__ = 16; break; }
    case 15: 
      var $50=$r;
      var $51=(($50-5)|0);
      $r=$51;
      __label__ = 16; break;
    case 16: 
      __label__ = 17; break;
    case 17: 
      __label__ = 18; break;
    case 18: 
      var $55=$r;
      ;
      return $55;
    default: assert(0, "bad label: " + __label__);
  }
}
_eval_lkp["X"]=1;

function _eval_dkp($f) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $r;
      $1=$f;
      $r=0;
      var $2=$1;
      var $3=((((_pawn_rank+40)|0)+($2<<2))|0);
      var $4=HEAP32[(($3)>>2)];
      var $5=(($4)|0)==1;
      if ($5) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      __label__ = 10; break;
    case 3: 
      var $8=$1;
      var $9=((((_pawn_rank+40)|0)+($8<<2))|0);
      var $10=HEAP32[(($9)>>2)];
      var $11=(($10)|0)==2;
      if ($11) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $13=$r;
      var $14=(($13-10)|0);
      $r=$14;
      __label__ = 9; break;
    case 5: 
      var $16=$1;
      var $17=((((_pawn_rank+40)|0)+($16<<2))|0);
      var $18=HEAP32[(($17)>>2)];
      var $19=(($18)|0)!=7;
      if ($19) { __label__ = 6; break; } else { __label__ = 7; break; }
    case 6: 
      var $21=$r;
      var $22=(($21-20)|0);
      $r=$22;
      __label__ = 8; break;
    case 7: 
      var $24=$r;
      var $25=(($24-25)|0);
      $r=$25;
      __label__ = 8; break;
    case 8: 
      __label__ = 9; break;
    case 9: 
      __label__ = 10; break;
    case 10: 
      var $29=$1;
      var $30=((((_pawn_rank)|0)+($29<<2))|0);
      var $31=HEAP32[(($30)>>2)];
      var $32=(($31)|0)==0;
      if ($32) { __label__ = 11; break; } else { __label__ = 12; break; }
    case 11: 
      var $34=$r;
      var $35=(($34-15)|0);
      $r=$35;
      __label__ = 18; break;
    case 12: 
      var $37=$1;
      var $38=((((_pawn_rank)|0)+($37<<2))|0);
      var $39=HEAP32[(($38)>>2)];
      var $40=(($39)|0)==2;
      if ($40) { __label__ = 13; break; } else { __label__ = 14; break; }
    case 13: 
      var $42=$r;
      var $43=(($42-10)|0);
      $r=$43;
      __label__ = 17; break;
    case 14: 
      var $45=$1;
      var $46=((((_pawn_rank)|0)+($45<<2))|0);
      var $47=HEAP32[(($46)>>2)];
      var $48=(($47)|0)==3;
      if ($48) { __label__ = 15; break; } else { __label__ = 16; break; }
    case 15: 
      var $50=$r;
      var $51=(($50-5)|0);
      $r=$51;
      __label__ = 16; break;
    case 16: 
      __label__ = 17; break;
    case 17: 
      __label__ = 18; break;
    case 18: 
      var $55=$r;
      ;
      return $55;
    default: assert(0, "bad label: " + __label__);
  }
}
_eval_dkp["X"]=1;

function _parse_move($s) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $from;
      var $to;
      var $i;
      $2=$s;
      var $3=$2;
      var $4=(($3)|0);
      var $5=HEAP8[($4)];
      var $6=(($5 << 24) >> 24);
      var $7=(($6)|0) < 97;
      if ($7) { __label__ = 9; break; } else { __label__ = 2; break; }
    case 2: 
      var $9=$2;
      var $10=(($9)|0);
      var $11=HEAP8[($10)];
      var $12=(($11 << 24) >> 24);
      var $13=(($12)|0) > 104;
      if ($13) { __label__ = 9; break; } else { __label__ = 3; break; }
    case 3: 
      var $15=$2;
      var $16=(($15+1)|0);
      var $17=HEAP8[($16)];
      var $18=(($17 << 24) >> 24);
      var $19=(($18)|0) < 48;
      if ($19) { __label__ = 9; break; } else { __label__ = 4; break; }
    case 4: 
      var $21=$2;
      var $22=(($21+1)|0);
      var $23=HEAP8[($22)];
      var $24=(($23 << 24) >> 24);
      var $25=(($24)|0) > 57;
      if ($25) { __label__ = 9; break; } else { __label__ = 5; break; }
    case 5: 
      var $27=$2;
      var $28=(($27+2)|0);
      var $29=HEAP8[($28)];
      var $30=(($29 << 24) >> 24);
      var $31=(($30)|0) < 97;
      if ($31) { __label__ = 9; break; } else { __label__ = 6; break; }
    case 6: 
      var $33=$2;
      var $34=(($33+2)|0);
      var $35=HEAP8[($34)];
      var $36=(($35 << 24) >> 24);
      var $37=(($36)|0) > 104;
      if ($37) { __label__ = 9; break; } else { __label__ = 7; break; }
    case 7: 
      var $39=$2;
      var $40=(($39+3)|0);
      var $41=HEAP8[($40)];
      var $42=(($41 << 24) >> 24);
      var $43=(($42)|0) < 48;
      if ($43) { __label__ = 9; break; } else { __label__ = 8; break; }
    case 8: 
      var $45=$2;
      var $46=(($45+3)|0);
      var $47=HEAP8[($46)];
      var $48=(($47 << 24) >> 24);
      var $49=(($48)|0) > 57;
      if ($49) { __label__ = 9; break; } else { __label__ = 10; break; }
    case 9: 
      $1=-1;
      __label__ = 24; break;
    case 10: 
      var $52=$2;
      var $53=(($52)|0);
      var $54=HEAP8[($53)];
      var $55=(($54 << 24) >> 24);
      var $56=(($55-97)|0);
      $from=$56;
      var $57=$2;
      var $58=(($57+1)|0);
      var $59=HEAP8[($58)];
      var $60=(($59 << 24) >> 24);
      var $61=(($60-48)|0);
      var $62=((8-$61)|0);
      var $63=((($62<<3))|0);
      var $64=$from;
      var $65=(($64+$63)|0);
      $from=$65;
      var $66=$2;
      var $67=(($66+2)|0);
      var $68=HEAP8[($67)];
      var $69=(($68 << 24) >> 24);
      var $70=(($69-97)|0);
      $to=$70;
      var $71=$2;
      var $72=(($71+3)|0);
      var $73=HEAP8[($72)];
      var $74=(($73 << 24) >> 24);
      var $75=(($74-48)|0);
      var $76=((8-$75)|0);
      var $77=((($76<<3))|0);
      var $78=$to;
      var $79=(($78+$77)|0);
      $to=$79;
      $i=0;
      __label__ = 11; break;
    case 11: 
      var $81=$i;
      var $82=HEAP32[((((_first_move+4)|0))>>2)];
      var $83=(($81)|0) < (($82)|0);
      if ($83) { __label__ = 12; break; } else { __label__ = 23; break; }
    case 12: 
      var $85=$i;
      var $86=((_gen_dat+($85<<3))|0);
      var $87=(($86)|0);
      var $88=$87;
      var $89=(($88)|0);
      var $90=HEAP8[($89)];
      var $91=(($90 << 24) >> 24);
      var $92=$from;
      var $93=(($91)|0)==(($92)|0);
      if ($93) { __label__ = 13; break; } else { __label__ = 21; break; }
    case 13: 
      var $95=$i;
      var $96=((_gen_dat+($95<<3))|0);
      var $97=(($96)|0);
      var $98=$97;
      var $99=(($98+1)|0);
      var $100=HEAP8[($99)];
      var $101=(($100 << 24) >> 24);
      var $102=$to;
      var $103=(($101)|0)==(($102)|0);
      if ($103) { __label__ = 14; break; } else { __label__ = 21; break; }
    case 14: 
      var $105=$i;
      var $106=((_gen_dat+($105<<3))|0);
      var $107=(($106)|0);
      var $108=$107;
      var $109=(($108+3)|0);
      var $110=HEAP8[($109)];
      var $111=(($110 << 24) >> 24);
      var $112=$111 & 32;
      var $113=(($112)|0)!=0;
      if ($113) { __label__ = 15; break; } else { __label__ = 20; break; }
    case 15: 
      var $115=$2;
      var $116=(($115+4)|0);
      var $117=HEAP8[($116)];
      var $118=(($117 << 24) >> 24);
      if ($118 == 78) {
        __label__ = 16; break;
      }
      else if ($118 == 66) {
        __label__ = 17; break;
      }
      else if ($118 == 82) {
        __label__ = 18; break;
      }
      else {
      __label__ = 19; break;
      }
      
    case 16: 
      var $120=$i;
      $1=$120;
      __label__ = 24; break;
    case 17: 
      var $122=$i;
      var $123=(($122+1)|0);
      $1=$123;
      __label__ = 24; break;
    case 18: 
      var $125=$i;
      var $126=(($125+2)|0);
      $1=$126;
      __label__ = 24; break;
    case 19: 
      var $128=$i;
      var $129=(($128+3)|0);
      $1=$129;
      __label__ = 24; break;
    case 20: 
      var $131=$i;
      $1=$131;
      __label__ = 24; break;
    case 21: 
      __label__ = 22; break;
    case 22: 
      var $134=$i;
      var $135=(($134+1)|0);
      $i=$135;
      __label__ = 11; break;
    case 23: 
      $1=-1;
      __label__ = 24; break;
    case 24: 
      var $138=$1;
      ;
      return $138;
    default: assert(0, "bad label: " + __label__);
  }
}
_parse_move["X"]=1;

function _get_ms() {
  var __stackBase__  = STACKTOP; STACKTOP += 4; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;

  var $start;
  var $end=__stackBase__;
  var $dif;
  var $1=HEAP32[(($end)>>2)];
  $start=$1;
  var $2=_time($end);
  var $3=HEAP32[(($end)>>2)];
  var $4=$start;
  var $5=_difftime($3, $4);
  $dif=$5;
  var $6=$dif;
  var $7=$6/1000;
  var $8=(($7)|0);
  STACKTOP = __stackBase__;
  return $8;
}


function _initChessEngine($maxTime, $maxDepth) {
  ;
  var __label__;

  var $1;
  var $2;
  $1=$maxTime;
  $2=$maxDepth;
  _init_hash();
  _init_board();
  _open_book();
  _gen();
  HEAP32[((_max_time)>>2)]=33554432;
  HEAP32[((_max_depth)>>2)]=4;
  ;
  return;
}


function _playerMove($move) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $m;
      var $res;
      $2=$move;
      var $3=$2;
      var $4=_parse_move($3);
      $m=$4;
      var $5=$m;
      var $6=(($5)|0)==-1;
      if ($6) { __label__ = 3; break; } else { __label__ = 2; break; }
    case 2: 
      var $8=$m;
      var $9=((_gen_dat+($8<<3))|0);
      var $10=(($9)|0);
      var $11=$10;
      var $12=_makemove($11);
      var $13=(($12)|0)!=0;
      if ($13) { __label__ = 4; break; } else { __label__ = 3; break; }
    case 3: 
      $1=((STRING_TABLE.__str51)|0);
      __label__ = 7; break;
    case 4: 
      HEAP32[((_ply)>>2)]=0;
      _gen();
      var $16=_print_result();
      $res=$16;
      var $17=$res;
      var $18=_strlen($17);
      var $19=(($18)>>>0) > 0;
      if ($19) { __label__ = 5; break; } else { __label__ = 6; break; }
    case 5: 
      var $21=$res;
      $1=$21;
      __label__ = 7; break;
    case 6: 
      $1=((__str152)|0);
      __label__ = 7; break;
    case 7: 
      var $24=$1;
      ;
      return $24;
    default: assert(0, "bad label: " + __label__);
  }
}


function _computerMove() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $moveResult;
      _think(1);
      var $2=HEAP32[((((_pv)|0))>>2)];
      var $3=(($2)|0)!=0;
      if ($3) { __label__ = 3; break; } else { __label__ = 2; break; }
    case 2: 
      $1=((STRING_TABLE.__str253)|0);
      __label__ = 4; break;
    case 3: 
      var $6=_move_str(_pv);
      $moveResult=$6;
      var $7=_makemove(_pv);
      HEAP32[((_ply)>>2)]=0;
      _gen();
      var $8=$moveResult;
      $1=$8;
      __label__ = 4; break;
    case 4: 
      var $10=$1;
      ;
      return $10;
    default: assert(0, "bad label: " + __label__);
  }
}


function _move_str($m) {
  var __stackBase__  = STACKTOP; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var tempParam = $m; $m = STACKTOP;STACKTOP += 4;assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack");HEAP32[(($m)>>2)]=HEAP32[((tempParam)>>2)];
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $c;
      var $1=(($m+3)|0);
      var $2=HEAP8[($1)];
      var $3=(($2 << 24) >> 24);
      var $4=$3 & 32;
      var $5=(($4)|0)!=0;
      if ($5) { __label__ = 2; break; } else { __label__ = 8; break; }
    case 2: 
      var $7=(($m+2)|0);
      var $8=HEAP8[($7)];
      var $9=(($8 << 24) >> 24);
      if ($9 == 1) {
        __label__ = 3; break;
      }
      else if ($9 == 2) {
        __label__ = 4; break;
      }
      else if ($9 == 3) {
        __label__ = 5; break;
      }
      else {
      __label__ = 6; break;
      }
      
    case 3: 
      $c=110;
      __label__ = 7; break;
    case 4: 
      $c=98;
      __label__ = 7; break;
    case 5: 
      $c=114;
      __label__ = 7; break;
    case 6: 
      $c=113;
      __label__ = 7; break;
    case 7: 
      var $15=(($m)|0);
      var $16=HEAP8[($15)];
      var $17=(($16 << 24) >> 24);
      var $18=$17 & 7;
      var $19=(($18+97)|0);
      var $20=(($m)|0);
      var $21=HEAP8[($20)];
      var $22=(($21 << 24) >> 24);
      var $23=$22 >> 3;
      var $24=((8-$23)|0);
      var $25=(($m+1)|0);
      var $26=HEAP8[($25)];
      var $27=(($26 << 24) >> 24);
      var $28=$27 & 7;
      var $29=(($28+97)|0);
      var $30=(($m+1)|0);
      var $31=HEAP8[($30)];
      var $32=(($31 << 24) >> 24);
      var $33=$32 >> 3;
      var $34=((8-$33)|0);
      var $35=$c;
      var $36=(($35 << 24) >> 24);
      var $37=_sprintf(((_move_str_str)|0), ((STRING_TABLE.__str36)|0), (tempInt=STACKTOP,STACKTOP += 20,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$19,HEAP32[((tempInt+4)>>2)]=$24,HEAP32[((tempInt+8)>>2)]=$29,HEAP32[((tempInt+12)>>2)]=$34,HEAP32[((tempInt+16)>>2)]=$36,tempInt));
      __label__ = 9; break;
    case 8: 
      var $39=(($m)|0);
      var $40=HEAP8[($39)];
      var $41=(($40 << 24) >> 24);
      var $42=$41 & 7;
      var $43=(($42+97)|0);
      var $44=(($m)|0);
      var $45=HEAP8[($44)];
      var $46=(($45 << 24) >> 24);
      var $47=$46 >> 3;
      var $48=((8-$47)|0);
      var $49=(($m+1)|0);
      var $50=HEAP8[($49)];
      var $51=(($50 << 24) >> 24);
      var $52=$51 & 7;
      var $53=(($52+97)|0);
      var $54=(($m+1)|0);
      var $55=HEAP8[($54)];
      var $56=(($55 << 24) >> 24);
      var $57=$56 >> 3;
      var $58=((8-$57)|0);
      var $59=_sprintf(((_move_str_str)|0), ((STRING_TABLE.__str37)|0), (tempInt=STACKTOP,STACKTOP += 16,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$43,HEAP32[((tempInt+4)>>2)]=$48,HEAP32[((tempInt+8)>>2)]=$53,HEAP32[((tempInt+12)>>2)]=$58,tempInt));
      __label__ = 9; break;
    case 9: 
      STACKTOP = __stackBase__;
      return ((_move_str_str)|0);
    default: assert(0, "bad label: " + __label__);
  }
}
_move_str["X"]=1;

function _main_original() {
  var __stackBase__  = STACKTOP; STACKTOP += 256; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $computer_side;
      var $s=__stackBase__;
      var $m;
      var $2=_printf(((STRING_TABLE.__str354)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $3=_printf(((STRING_TABLE.__str4)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $4=_printf(((STRING_TABLE.__str5)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $5=_printf(((STRING_TABLE.__str6)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $6=_printf(((STRING_TABLE.__str354)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $7=_printf(((STRING_TABLE.__str7)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $8=_printf(((STRING_TABLE.__str354)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      _init_hash();
      _init_board();
      _open_book();
      _gen();
      $computer_side=6;
      HEAP32[((_max_time)>>2)]=33554432;
      HEAP32[((_max_depth)>>2)]=4;
      __label__ = 2; break;
    case 2: 
      var $10=HEAP32[((_side)>>2)];
      var $11=$computer_side;
      var $12=(($10)|0)==(($11)|0);
      if ($12) { __label__ = 3; break; } else { __label__ = 6; break; }
    case 3: 
      _think(1);
      var $14=HEAP32[((((_pv)|0))>>2)];
      var $15=(($14)|0)!=0;
      if ($15) { __label__ = 5; break; } else { __label__ = 4; break; }
    case 4: 
      var $17=_printf(((STRING_TABLE.__str253)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      $computer_side=6;
      __label__ = 2; break;
    case 5: 
      var $19=_move_str(_pv);
      var $20=_printf(((STRING_TABLE.__str8)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$19,tempInt));
      var $21=_makemove(_pv);
      HEAP32[((_ply)>>2)]=0;
      _gen();
      var $22=_print_result();
      __label__ = 2; break;
    case 6: 
      var $24=_printf(((STRING_TABLE.__str9)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $25=(($s)|0);
      var $26=_scanf(((STRING_TABLE.__str10)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$25,tempInt));
      var $27=(($26)|0)==-1;
      if ($27) { __label__ = 7; break; } else { __label__ = 8; break; }
    case 7: 
      $1=0;
      __label__ = 38; break;
    case 8: 
      var $30=(($s)|0);
      var $31=_strcmp($30, ((STRING_TABLE.__str11)|0));
      var $32=(($31)|0)!=0;
      if ($32) { __label__ = 10; break; } else { __label__ = 9; break; }
    case 9: 
      var $34=HEAP32[((_side)>>2)];
      $computer_side=$34;
      __label__ = 2; break;
    case 10: 
      var $36=(($s)|0);
      var $37=_strcmp($36, ((STRING_TABLE.__str12)|0));
      var $38=(($37)|0)!=0;
      if ($38) { __label__ = 12; break; } else { __label__ = 11; break; }
    case 11: 
      $computer_side=6;
      __label__ = 2; break;
    case 12: 
      var $41=(($s)|0);
      var $42=_strcmp($41, ((STRING_TABLE.__str13)|0));
      var $43=(($42)|0)!=0;
      if ($43) { __label__ = 14; break; } else { __label__ = 13; break; }
    case 13: 
      var $45=_scanf(((STRING_TABLE.__str14)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=_max_time,tempInt));
      var $46=HEAP32[((_max_time)>>2)];
      var $47=(($46*1000)|0);
      HEAP32[((_max_time)>>2)]=$47;
      HEAP32[((_max_depth)>>2)]=32;
      __label__ = 2; break;
    case 14: 
      var $49=(($s)|0);
      var $50=_strcmp($49, ((STRING_TABLE.__str15)|0));
      var $51=(($50)|0)!=0;
      if ($51) { __label__ = 16; break; } else { __label__ = 15; break; }
    case 15: 
      var $53=_scanf(((STRING_TABLE.__str14)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=_max_depth,tempInt));
      HEAP32[((_max_time)>>2)]=33554432;
      __label__ = 2; break;
    case 16: 
      var $55=(($s)|0);
      var $56=_strcmp($55, ((STRING_TABLE.__str16)|0));
      var $57=(($56)|0)!=0;
      if ($57) { __label__ = 20; break; } else { __label__ = 17; break; }
    case 17: 
      var $59=HEAP32[((_hply)>>2)];
      var $60=(($59)|0)!=0;
      if ($60) { __label__ = 19; break; } else { __label__ = 18; break; }
    case 18: 
      __label__ = 2; break;
    case 19: 
      $computer_side=6;
      _takeback();
      HEAP32[((_ply)>>2)]=0;
      _gen();
      __label__ = 2; break;
    case 20: 
      var $64=(($s)|0);
      var $65=_strcmp($64, ((STRING_TABLE.__str17)|0));
      var $66=(($65)|0)!=0;
      if ($66) { __label__ = 22; break; } else { __label__ = 21; break; }
    case 21: 
      $computer_side=6;
      _init_board();
      _gen();
      __label__ = 2; break;
    case 22: 
      var $69=(($s)|0);
      var $70=_strcmp($69, ((STRING_TABLE.__str18)|0));
      var $71=(($70)|0)!=0;
      if ($71) { __label__ = 24; break; } else { __label__ = 23; break; }
    case 23: 
      _print_board();
      __label__ = 2; break;
    case 24: 
      var $74=(($s)|0);
      var $75=_strcmp($74, ((STRING_TABLE.__str19)|0));
      var $76=(($75)|0)!=0;
      if ($76) { __label__ = 26; break; } else { __label__ = 25; break; }
    case 25: 
      $computer_side=6;
      _bench();
      __label__ = 2; break;
    case 26: 
      var $79=(($s)|0);
      var $80=_strcmp($79, ((STRING_TABLE.__str20)|0));
      var $81=(($80)|0)!=0;
      if ($81) { __label__ = 28; break; } else { __label__ = 27; break; }
    case 27: 
      var $83=_printf(((STRING_TABLE.__str21)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      __label__ = 37; break;
    case 28: 
      var $85=(($s)|0);
      var $86=_strcmp($85, ((STRING_TABLE.__str22)|0));
      var $87=(($86)|0)!=0;
      if ($87) { __label__ = 30; break; } else { __label__ = 29; break; }
    case 29: 
      _xboard();
      __label__ = 37; break;
    case 30: 
      var $90=(($s)|0);
      var $91=_strcmp($90, ((STRING_TABLE.__str23)|0));
      var $92=(($91)|0)!=0;
      if ($92) { __label__ = 32; break; } else { __label__ = 31; break; }
    case 31: 
      var $94=_printf(((STRING_TABLE.__str24)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $95=_printf(((STRING_TABLE.__str25)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $96=_printf(((STRING_TABLE.__str26)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $97=_printf(((STRING_TABLE.__str27)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $98=_printf(((STRING_TABLE.__str28)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $99=_printf(((STRING_TABLE.__str29)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $100=_printf(((STRING_TABLE.__str30)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $101=_printf(((STRING_TABLE.__str31)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $102=_printf(((STRING_TABLE.__str32)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $103=_printf(((STRING_TABLE.__str33)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $104=_printf(((STRING_TABLE.__str34)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      __label__ = 2; break;
    case 32: 
      var $106=(($s)|0);
      var $107=_parse_move($106);
      $m=$107;
      var $108=$m;
      var $109=(($108)|0)==-1;
      if ($109) { __label__ = 34; break; } else { __label__ = 33; break; }
    case 33: 
      var $111=$m;
      var $112=((_gen_dat+($111<<3))|0);
      var $113=(($112)|0);
      var $114=$113;
      var $115=_makemove($114);
      var $116=(($115)|0)!=0;
      if ($116) { __label__ = 35; break; } else { __label__ = 34; break; }
    case 34: 
      var $118=_printf(((STRING_TABLE.__str35)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      __label__ = 36; break;
    case 35: 
      HEAP32[((_ply)>>2)]=0;
      _gen();
      var $120=_print_result();
      __label__ = 36; break;
    case 36: 
      __label__ = 2; break;
    case 37: 
      _close_book();
      $1=0;
      __label__ = 38; break;
    case 38: 
      var $124=$1;
      STACKTOP = __stackBase__;
      return $124;
    default: assert(0, "bad label: " + __label__);
  }
}
_main_original["X"]=1;

function _print_board() {
  var __stackBase__  = STACKTOP; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      var $1=_printf(((STRING_TABLE.__str38)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $3=$i;
      var $4=(($3)|0) < 64;
      if ($4) { __label__ = 3; break; } else { __label__ = 12; break; }
    case 3: 
      var $6=$i;
      var $7=((_color+($6<<2))|0);
      var $8=HEAP32[(($7)>>2)];
      if ($8 == 6) {
        __label__ = 4; break;
      }
      else if ($8 == 0) {
        __label__ = 5; break;
      }
      else if ($8 == 1) {
        __label__ = 6; break;
      }
      else {
      __label__ = 7; break;
      }
      
    case 4: 
      var $10=_printf(((STRING_TABLE.__str39)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      __label__ = 7; break;
    case 5: 
      var $12=$i;
      var $13=((_piece+($12<<2))|0);
      var $14=HEAP32[(($13)>>2)];
      var $15=((STRING_TABLE._piece_char+$14)|0);
      var $16=HEAP8[($15)];
      var $17=(($16 << 24) >> 24);
      var $18=_printf(((STRING_TABLE.__str40)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$17,tempInt));
      __label__ = 7; break;
    case 6: 
      var $20=$i;
      var $21=((_piece+($20<<2))|0);
      var $22=HEAP32[(($21)>>2)];
      var $23=((STRING_TABLE._piece_char+$22)|0);
      var $24=HEAP8[($23)];
      var $25=(($24 << 24) >> 24);
      var $26=(($25+32)|0);
      var $27=_printf(((STRING_TABLE.__str40)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$26,tempInt));
      __label__ = 7; break;
    case 7: 
      var $29=$i;
      var $30=(($29+1)|0);
      var $31=(($30)|0)%8;
      var $32=(($31)|0)==0;
      if ($32) { __label__ = 8; break; } else { __label__ = 10; break; }
    case 8: 
      var $34=$i;
      var $35=(($34)|0)!=63;
      if ($35) { __label__ = 9; break; } else { __label__ = 10; break; }
    case 9: 
      var $37=$i;
      var $38=$37 >> 3;
      var $39=((7-$38)|0);
      var $40=_printf(((STRING_TABLE.__str41)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$39,tempInt));
      __label__ = 10; break;
    case 10: 
      __label__ = 11; break;
    case 11: 
      var $43=$i;
      var $44=(($43+1)|0);
      $i=$44;
      __label__ = 2; break;
    case 12: 
      var $46=_printf(((STRING_TABLE.__str42)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      STACKTOP = __stackBase__;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_print_board["X"]=1;

function _xboard() {
  var __stackBase__  = STACKTOP; STACKTOP += 512; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $computer_side;
      var $line=__stackBase__;
      var $command=__stackBase__+256;
      var $m;
      var $post;
      $post=0;
      var $1=_signal(2, 1);
      var $2=_printf(((STRING_TABLE.__str354)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      _init_board();
      _gen();
      $computer_side=6;
      __label__ = 2; break;
    case 2: 
      var $4=HEAP32[((__impure_ptr)>>2)];
      var $5=(($4+8)|0);
      var $6=HEAP32[(($5)>>2)];
      var $7=_fflush($6);
      var $8=HEAP32[((_side)>>2)];
      var $9=$computer_side;
      var $10=(($8)|0)==(($9)|0);
      if ($10) { __label__ = 3; break; } else { __label__ = 6; break; }
    case 3: 
      var $12=$post;
      _think($12);
      var $13=HEAP32[((((_pv)|0))>>2)];
      var $14=(($13)|0)!=0;
      if ($14) { __label__ = 5; break; } else { __label__ = 4; break; }
    case 4: 
      $computer_side=6;
      __label__ = 2; break;
    case 5: 
      var $17=_move_str(_pv);
      var $18=_printf(((STRING_TABLE.__str43)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$17,tempInt));
      var $19=_makemove(_pv);
      HEAP32[((_ply)>>2)]=0;
      _gen();
      var $20=_print_result();
      __label__ = 2; break;
    case 6: 
      var $22=(($line)|0);
      var $23=HEAP32[((__impure_ptr)>>2)];
      var $24=(($23+4)|0);
      var $25=HEAP32[(($24)>>2)];
      var $26=_fgets($22, 256, $25);
      var $27=(($26)|0)!=0;
      if ($27) { __label__ = 8; break; } else { __label__ = 7; break; }
    case 7: 
      __label__ = 53; break;
    case 8: 
      var $30=(($line)|0);
      var $31=HEAP8[($30)];
      var $32=(($31 << 24) >> 24);
      var $33=(($32)|0)==10;
      if ($33) { __label__ = 9; break; } else { __label__ = 10; break; }
    case 9: 
      __label__ = 2; break;
    case 10: 
      var $36=(($line)|0);
      var $37=(($command)|0);
      var $38=_sscanf($36, ((STRING_TABLE.__str10)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$37,tempInt));
      var $39=(($command)|0);
      var $40=_strcmp($39, ((STRING_TABLE.__str22)|0));
      var $41=(($40)|0)!=0;
      if ($41) { __label__ = 12; break; } else { __label__ = 11; break; }
    case 11: 
      __label__ = 2; break;
    case 12: 
      var $44=(($command)|0);
      var $45=_strcmp($44, ((STRING_TABLE.__str17)|0));
      var $46=(($45)|0)!=0;
      if ($46) { __label__ = 14; break; } else { __label__ = 13; break; }
    case 13: 
      _init_board();
      _gen();
      $computer_side=1;
      __label__ = 2; break;
    case 14: 
      var $49=(($command)|0);
      var $50=_strcmp($49, ((STRING_TABLE.__str44)|0));
      var $51=(($50)|0)!=0;
      if ($51) { __label__ = 16; break; } else { __label__ = 15; break; }
    case 15: 
      __label__ = 53; break;
    case 16: 
      var $54=(($command)|0);
      var $55=_strcmp($54, ((STRING_TABLE.__str45)|0));
      var $56=(($55)|0)!=0;
      if ($56) { __label__ = 18; break; } else { __label__ = 17; break; }
    case 17: 
      $computer_side=6;
      __label__ = 2; break;
    case 18: 
      var $59=(($command)|0);
      var $60=_strcmp($59, ((STRING_TABLE.__str46)|0));
      var $61=(($60)|0)!=0;
      if ($61) { __label__ = 20; break; } else { __label__ = 19; break; }
    case 19: 
      HEAP32[((_side)>>2)]=0;
      HEAP32[((_xside)>>2)]=1;
      _gen();
      $computer_side=1;
      __label__ = 2; break;
    case 20: 
      var $64=(($command)|0);
      var $65=_strcmp($64, ((STRING_TABLE.__str47)|0));
      var $66=(($65)|0)!=0;
      if ($66) { __label__ = 22; break; } else { __label__ = 21; break; }
    case 21: 
      HEAP32[((_side)>>2)]=1;
      HEAP32[((_xside)>>2)]=0;
      _gen();
      $computer_side=0;
      __label__ = 2; break;
    case 22: 
      var $69=(($command)|0);
      var $70=_strcmp($69, ((STRING_TABLE.__str13)|0));
      var $71=(($70)|0)!=0;
      if ($71) { __label__ = 24; break; } else { __label__ = 23; break; }
    case 23: 
      var $73=(($line)|0);
      var $74=_sscanf($73, ((STRING_TABLE.__str48)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=_max_time,tempInt));
      var $75=HEAP32[((_max_time)>>2)];
      var $76=(($75*1000)|0);
      HEAP32[((_max_time)>>2)]=$76;
      HEAP32[((_max_depth)>>2)]=32;
      __label__ = 2; break;
    case 24: 
      var $78=(($command)|0);
      var $79=_strcmp($78, ((STRING_TABLE.__str15)|0));
      var $80=(($79)|0)!=0;
      if ($80) { __label__ = 26; break; } else { __label__ = 25; break; }
    case 25: 
      var $82=(($line)|0);
      var $83=_sscanf($82, ((STRING_TABLE.__str49)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=_max_depth,tempInt));
      HEAP32[((_max_time)>>2)]=33554432;
      __label__ = 2; break;
    case 26: 
      var $85=(($command)|0);
      var $86=_strcmp($85, ((STRING_TABLE.__str50)|0));
      var $87=(($86)|0)!=0;
      if ($87) { __label__ = 28; break; } else { __label__ = 27; break; }
    case 27: 
      var $89=(($line)|0);
      var $90=_sscanf($89, ((STRING_TABLE.__str5155)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=_max_time,tempInt));
      var $91=HEAP32[((_max_time)>>2)];
      var $92=(($91*10)|0);
      HEAP32[((_max_time)>>2)]=$92;
      var $93=HEAP32[((_max_time)>>2)];
      var $94=(((($93)|0)/30)|0);
      HEAP32[((_max_time)>>2)]=$94;
      HEAP32[((_max_depth)>>2)]=32;
      __label__ = 2; break;
    case 28: 
      var $96=(($command)|0);
      var $97=_strcmp($96, ((STRING_TABLE.__str52)|0));
      var $98=(($97)|0)!=0;
      if ($98) { __label__ = 30; break; } else { __label__ = 29; break; }
    case 29: 
      __label__ = 2; break;
    case 30: 
      var $101=(($command)|0);
      var $102=_strcmp($101, ((STRING_TABLE.__str53)|0));
      var $103=(($102)|0)!=0;
      if ($103) { __label__ = 32; break; } else { __label__ = 31; break; }
    case 31: 
      var $105=HEAP32[((_side)>>2)];
      $computer_side=$105;
      __label__ = 2; break;
    case 32: 
      var $107=(($command)|0);
      var $108=_strcmp($107, ((STRING_TABLE.__str54)|0));
      var $109=(($108)|0)!=0;
      if ($109) { __label__ = 36; break; } else { __label__ = 33; break; }
    case 33: 
      _think(0);
      var $111=HEAP32[((((_pv)|0))>>2)];
      var $112=(($111)|0)!=0;
      if ($112) { __label__ = 35; break; } else { __label__ = 34; break; }
    case 34: 
      __label__ = 2; break;
    case 35: 
      var $115=_move_str(_pv);
      var $116=_printf(((STRING_TABLE.__str55)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$115,tempInt));
      __label__ = 2; break;
    case 36: 
      var $118=(($command)|0);
      var $119=_strcmp($118, ((STRING_TABLE.__str16)|0));
      var $120=(($119)|0)!=0;
      if ($120) { __label__ = 40; break; } else { __label__ = 37; break; }
    case 37: 
      var $122=HEAP32[((_hply)>>2)];
      var $123=(($122)|0)!=0;
      if ($123) { __label__ = 39; break; } else { __label__ = 38; break; }
    case 38: 
      __label__ = 2; break;
    case 39: 
      _takeback();
      HEAP32[((_ply)>>2)]=0;
      _gen();
      __label__ = 2; break;
    case 40: 
      var $127=(($command)|0);
      var $128=_strcmp($127, ((STRING_TABLE.__str56)|0));
      var $129=(($128)|0)!=0;
      if ($129) { __label__ = 44; break; } else { __label__ = 41; break; }
    case 41: 
      var $131=HEAP32[((_hply)>>2)];
      var $132=(($131)|0) < 2;
      if ($132) { __label__ = 42; break; } else { __label__ = 43; break; }
    case 42: 
      __label__ = 2; break;
    case 43: 
      _takeback();
      _takeback();
      HEAP32[((_ply)>>2)]=0;
      _gen();
      __label__ = 2; break;
    case 44: 
      var $136=(($command)|0);
      var $137=_strcmp($136, ((STRING_TABLE.__str57)|0));
      var $138=(($137)|0)!=0;
      if ($138) { __label__ = 46; break; } else { __label__ = 45; break; }
    case 45: 
      $post=2;
      __label__ = 2; break;
    case 46: 
      var $141=(($command)|0);
      var $142=_strcmp($141, ((STRING_TABLE.__str58)|0));
      var $143=(($142)|0)!=0;
      if ($143) { __label__ = 48; break; } else { __label__ = 47; break; }
    case 47: 
      $post=0;
      __label__ = 2; break;
    case 48: 
      var $146=(($line)|0);
      var $147=_parse_move($146);
      $m=$147;
      var $148=$m;
      var $149=(($148)|0)==-1;
      if ($149) { __label__ = 50; break; } else { __label__ = 49; break; }
    case 49: 
      var $151=$m;
      var $152=((_gen_dat+($151<<3))|0);
      var $153=(($152)|0);
      var $154=$153;
      var $155=_makemove($154);
      var $156=(($155)|0)!=0;
      if ($156) { __label__ = 51; break; } else { __label__ = 50; break; }
    case 50: 
      var $158=(($command)|0);
      var $159=_printf(((STRING_TABLE.__str59)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$158,tempInt));
      __label__ = 52; break;
    case 51: 
      HEAP32[((_ply)>>2)]=0;
      _gen();
      var $161=_print_result();
      __label__ = 52; break;
    case 52: 
      __label__ = 2; break;
    case 53: 
      STACKTOP = __stackBase__;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_xboard["X"]=1;

function _print_result() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $i;
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $3=$i;
      var $4=HEAP32[((((_first_move+4)|0))>>2)];
      var $5=(($3)|0) < (($4)|0);
      if ($5) { __label__ = 3; break; } else { __label__ = 7; break; }
    case 3: 
      var $7=$i;
      var $8=((_gen_dat+($7<<3))|0);
      var $9=(($8)|0);
      var $10=$9;
      var $11=_makemove($10);
      var $12=(($11)|0)!=0;
      if ($12) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      _takeback();
      __label__ = 7; break;
    case 5: 
      __label__ = 6; break;
    case 6: 
      var $16=$i;
      var $17=(($16+1)|0);
      $i=$17;
      __label__ = 2; break;
    case 7: 
      var $19=$i;
      var $20=HEAP32[((((_first_move+4)|0))>>2)];
      var $21=(($19)|0)==(($20)|0);
      if ($21) { __label__ = 8; break; } else { __label__ = 13; break; }
    case 8: 
      var $23=HEAP32[((_side)>>2)];
      var $24=_in_check($23);
      var $25=(($24)|0)!=0;
      if ($25) { __label__ = 9; break; } else { __label__ = 12; break; }
    case 9: 
      var $27=HEAP32[((_side)>>2)];
      var $28=(($27)|0)==0;
      if ($28) { __label__ = 10; break; } else { __label__ = 11; break; }
    case 10: 
      $1=((STRING_TABLE.__str60)|0);
      __label__ = 20; break;
    case 11: 
      $1=((STRING_TABLE.__str61)|0);
      __label__ = 20; break;
    case 12: 
      $1=((STRING_TABLE.__str62)|0);
      __label__ = 20; break;
    case 13: 
      var $33=_reps();
      var $34=(($33)|0)==3;
      if ($34) { __label__ = 14; break; } else { __label__ = 15; break; }
    case 14: 
      $1=((STRING_TABLE.__str63)|0);
      __label__ = 20; break;
    case 15: 
      var $37=HEAP32[((_fifty)>>2)];
      var $38=(($37)|0) >= 100;
      if ($38) { __label__ = 16; break; } else { __label__ = 17; break; }
    case 16: 
      $1=((STRING_TABLE.__str64)|0);
      __label__ = 20; break;
    case 17: 
      __label__ = 18; break;
    case 18: 
      __label__ = 19; break;
    case 19: 
      $1=((__str152)|0);
      __label__ = 20; break;
    case 20: 
      var $44=$1;
      ;
      return $44;
    default: assert(0, "bad label: " + __label__);
  }
}
_print_result["X"]=1;

function _bench() {
  var __stackBase__  = STACKTOP; STACKTOP += 12; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      var $t=__stackBase__;
      var $nps;
      _close_book();
      $i=0;
      __label__ = 2; break;
    case 2: 
      var $2=$i;
      var $3=(($2)|0) < 64;
      if ($3) { __label__ = 3; break; } else { __label__ = 5; break; }
    case 3: 
      var $5=$i;
      var $6=((_bench_color+($5<<2))|0);
      var $7=HEAP32[(($6)>>2)];
      var $8=$i;
      var $9=((_color+($8<<2))|0);
      HEAP32[(($9)>>2)]=$7;
      var $10=$i;
      var $11=((_bench_piece+($10<<2))|0);
      var $12=HEAP32[(($11)>>2)];
      var $13=$i;
      var $14=((_piece+($13<<2))|0);
      HEAP32[(($14)>>2)]=$12;
      __label__ = 4; break;
    case 4: 
      var $16=$i;
      var $17=(($16+1)|0);
      $i=$17;
      __label__ = 2; break;
    case 5: 
      HEAP32[((_side)>>2)]=0;
      HEAP32[((_xside)>>2)]=1;
      HEAP32[((_castle)>>2)]=0;
      HEAP32[((_ep)>>2)]=-1;
      HEAP32[((_fifty)>>2)]=0;
      HEAP32[((_ply)>>2)]=0;
      HEAP32[((_hply)>>2)]=0;
      _set_hash();
      _print_board();
      HEAP32[((_max_time)>>2)]=33554432;
      HEAP32[((_max_depth)>>2)]=5;
      $i=0;
      __label__ = 6; break;
    case 6: 
      var $20=$i;
      var $21=(($20)|0) < 3;
      if ($21) { __label__ = 7; break; } else { __label__ = 9; break; }
    case 7: 
      _think(1);
      var $23=_get_ms();
      var $24=HEAP32[((_start_time)>>2)];
      var $25=(($23-$24)|0);
      var $26=$i;
      var $27=(($t+($26<<2))|0);
      HEAP32[(($27)>>2)]=$25;
      var $28=$i;
      var $29=(($t+($28<<2))|0);
      var $30=HEAP32[(($29)>>2)];
      var $31=_printf(((STRING_TABLE.__str65)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$30,tempInt));
      __label__ = 8; break;
    case 8: 
      var $33=$i;
      var $34=(($33+1)|0);
      $i=$34;
      __label__ = 6; break;
    case 9: 
      var $36=(($t+4)|0);
      var $37=HEAP32[(($36)>>2)];
      var $38=(($t)|0);
      var $39=HEAP32[(($38)>>2)];
      var $40=(($37)|0) < (($39)|0);
      if ($40) { __label__ = 10; break; } else { __label__ = 11; break; }
    case 10: 
      var $42=(($t+4)|0);
      var $43=HEAP32[(($42)>>2)];
      var $44=(($t)|0);
      HEAP32[(($44)>>2)]=$43;
      __label__ = 11; break;
    case 11: 
      var $46=(($t+8)|0);
      var $47=HEAP32[(($46)>>2)];
      var $48=(($t)|0);
      var $49=HEAP32[(($48)>>2)];
      var $50=(($47)|0) < (($49)|0);
      if ($50) { __label__ = 12; break; } else { __label__ = 13; break; }
    case 12: 
      var $52=(($t+8)|0);
      var $53=HEAP32[(($52)>>2)];
      var $54=(($t)|0);
      HEAP32[(($54)>>2)]=$53;
      __label__ = 13; break;
    case 13: 
      var $56=_printf(((STRING_TABLE.__str354)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $57=HEAP32[((_nodes)>>2)];
      var $58=_printf(((STRING_TABLE.__str66)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$57,tempInt));
      var $59=(($t)|0);
      var $60=HEAP32[(($59)>>2)];
      var $61=_printf(((STRING_TABLE.__str67)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$60,tempInt));
      var $62=HEAP32[((_ftime_ok)>>2)];
      var $63=(($62)|0)!=0;
      if ($63) { __label__ = 15; break; } else { __label__ = 14; break; }
    case 14: 
      var $65=_printf(((STRING_TABLE.__str354)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $66=_printf(((STRING_TABLE.__str68)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $67=_printf(((STRING_TABLE.__str69)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $68=_printf(((STRING_TABLE.__str70)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $69=_printf(((STRING_TABLE.__str354)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      __label__ = 18; break;
    case 15: 
      var $71=(($t)|0);
      var $72=HEAP32[(($71)>>2)];
      var $73=(($72)|0)==0;
      if ($73) { __label__ = 16; break; } else { __label__ = 17; break; }
    case 16: 
      var $75=_printf(((STRING_TABLE.__str71)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      __label__ = 18; break;
    case 17: 
      var $77=HEAP32[((_nodes)>>2)];
      var $78=(($77)|0);
      var $79=(($t)|0);
      var $80=HEAP32[(($79)>>2)];
      var $81=(($80)|0);
      var $82=$78/$81;
      $nps=$82;
      var $83=$nps;
      var $84=$83*1000;
      $nps=$84;
      var $85=$nps;
      var $86=(($85)|0);
      var $87=$nps;
      var $88=$87;
      var $89=$88;
      var $90=$89/243169;
      var $91=_printf(((STRING_TABLE.__str72)|0), (tempInt=STACKTOP,STACKTOP += 12,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$86,(tempDoubleF64[0]=$90,HEAP32[((tempInt+4)>>2)]=tempDoubleI32[0],HEAP32[((tempInt+4+4)>>2)]=tempDoubleI32[1]),tempInt));
      _init_board();
      _open_book();
      _gen();
      __label__ = 18; break;
    case 18: 
      STACKTOP = __stackBase__;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_bench["X"]=1;

function _think($output) {
  ;
  var __label__;
  __label__ = 1; 
  var setjmpTable = {"3": function(value) { __label__ = 29; $7 = value },dummy: 0};
  while(1) try { switch(__label__) {
    case 1: 
      var $1;
      var $i;
      var $j;
      var $x;
      $1=$output;
      var $2=_book_move();
      HEAP32[((((_pv)|0))>>2)]=$2;
      var $3=HEAP32[((((_pv)|0))>>2)];
      var $4=(($3)|0)!=-1;
      if ($4) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      __label__ = 28; break;
    case 3: 
      HEAP32[((_stop_search)>>2)]=0;
      var $7=(HEAP32[((((_env)|0))>>2)]=__label__, 0);
      __label__ = 29; break;
    case 29: 
      var $8=HEAP32[((_stop_search)>>2)];
      var $9=(($8)|0)!=0;
      if ($9) { __label__ = 4; break; } else { __label__ = 8; break; }
    case 4: 
      __label__ = 5; break;
    case 5: 
      var $12=HEAP32[((_ply)>>2)];
      var $13=(($12)|0)!=0;
      if ($13) { __label__ = 6; break; } else { __label__ = 7; break; }
    case 6: 
      _takeback();
      __label__ = 5; break;
    case 7: 
      __label__ = 28; break;
    case 8: 
      var $17=_get_ms();
      HEAP32[((_start_time)>>2)]=$17;
      var $18=HEAP32[((_start_time)>>2)];
      var $19=HEAP32[((_max_time)>>2)];
      var $20=(($18+$19)|0);
      HEAP32[((_stop_time)>>2)]=$20;
      HEAP32[((_ply)>>2)]=0;
      HEAP32[((_nodes)>>2)]=0;
      _memset(_pv, 0, 4096, 1);
      _memset(_history, 0, 16384, 1);
      var $21=$1;
      var $22=(($21)|0)==1;
      if ($22) { __label__ = 9; break; } else { __label__ = 10; break; }
    case 9: 
      var $24=_printf(((STRING_TABLE.__str73)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      __label__ = 10; break;
    case 10: 
      $i=1;
      __label__ = 11; break;
    case 11: 
      var $27=$i;
      var $28=HEAP32[((_max_depth)>>2)];
      var $29=(($27)|0) <= (($28)|0);
      if ($29) { __label__ = 12; break; } else { __label__ = 28; break; }
    case 12: 
      HEAP32[((_follow_pv)>>2)]=1;
      var $31=$i;
      var $32=_search(-10000, 10000, $31);
      $x=$32;
      var $33=$1;
      var $34=(($33)|0)==1;
      if ($34) { __label__ = 13; break; } else { __label__ = 14; break; }
    case 13: 
      var $36=$i;
      var $37=HEAP32[((_nodes)>>2)];
      var $38=$x;
      var $39=_printf(((STRING_TABLE.__str174)|0), (tempInt=STACKTOP,STACKTOP += 12,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$36,HEAP32[((tempInt+4)>>2)]=$37,HEAP32[((tempInt+8)>>2)]=$38,tempInt));
      __label__ = 17; break;
    case 14: 
      var $41=$1;
      var $42=(($41)|0)==2;
      if ($42) { __label__ = 15; break; } else { __label__ = 16; break; }
    case 15: 
      var $44=$i;
      var $45=$x;
      var $46=_get_ms();
      var $47=HEAP32[((_start_time)>>2)];
      var $48=(($46-$47)|0);
      var $49=(((($48)|0)/10)|0);
      var $50=HEAP32[((_nodes)>>2)];
      var $51=_printf(((STRING_TABLE.__str275)|0), (tempInt=STACKTOP,STACKTOP += 16,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$44,HEAP32[((tempInt+4)>>2)]=$45,HEAP32[((tempInt+8)>>2)]=$49,HEAP32[((tempInt+12)>>2)]=$50,tempInt));
      __label__ = 16; break;
    case 16: 
      __label__ = 17; break;
    case 17: 
      var $54=$1;
      var $55=(($54)|0)!=0;
      if ($55) { __label__ = 18; break; } else { __label__ = 23; break; }
    case 18: 
      $j=0;
      __label__ = 19; break;
    case 19: 
      var $58=$j;
      var $59=HEAP32[((((_pv_length)|0))>>2)];
      var $60=(($58)|0) < (($59)|0);
      if ($60) { __label__ = 20; break; } else { __label__ = 22; break; }
    case 20: 
      var $62=$j;
      var $63=((((_pv)|0)+($62<<2))|0);
      var $64=$63;
      var $65=_move_str($64);
      var $66=_printf(((STRING_TABLE.__str376)|0), (tempInt=STACKTOP,STACKTOP += 4,assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=$65,tempInt));
      __label__ = 21; break;
    case 21: 
      var $68=$j;
      var $69=(($68+1)|0);
      $j=$69;
      __label__ = 19; break;
    case 22: 
      var $71=_printf(((STRING_TABLE.__str477)|0), (tempInt=STACKTOP,STACKTOP += 1,STACKTOP = ((((STACKTOP)+3)>>2)<<2),assert(STACKTOP < STACK_ROOT + STACK_MAX, "Ran out of stack"),HEAP32[((tempInt)>>2)]=0,tempInt));
      var $72=HEAP32[((__impure_ptr)>>2)];
      var $73=(($72+8)|0);
      var $74=HEAP32[(($73)>>2)];
      var $75=_fflush($74);
      __label__ = 23; break;
    case 23: 
      var $77=$x;
      var $78=(($77)|0) > 9000;
      if ($78) { __label__ = 25; break; } else { __label__ = 24; break; }
    case 24: 
      var $80=$x;
      var $81=(($80)|0) < -9000;
      if ($81) { __label__ = 25; break; } else { __label__ = 26; break; }
    case 25: 
      __label__ = 28; break;
    case 26: 
      __label__ = 27; break;
    case 27: 
      var $85=$i;
      var $86=(($85+1)|0);
      $i=$86;
      __label__ = 11; break;
    case 28: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  } } catch(e) { if (!e.longjmp) throw(e); setjmpTable[e.label](e.value) }
}
_think["X"]=1;

function _reps() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      var $r;
      $r=0;
      var $1=HEAP32[((_hply)>>2)];
      var $2=HEAP32[((_fifty)>>2)];
      var $3=(($1-$2)|0);
      $i=$3;
      __label__ = 2; break;
    case 2: 
      var $5=$i;
      var $6=HEAP32[((_hply)>>2)];
      var $7=(($5)|0) < (($6)|0);
      if ($7) { __label__ = 3; break; } else { __label__ = 7; break; }
    case 3: 
      var $9=$i;
      var $10=((_hist_dat+$9*24)|0);
      var $11=(($10+20)|0);
      var $12=HEAP32[(($11)>>2)];
      var $13=HEAP32[((_hash)>>2)];
      var $14=(($12)|0)==(($13)|0);
      if ($14) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $16=$r;
      var $17=(($16+1)|0);
      $r=$17;
      __label__ = 5; break;
    case 5: 
      __label__ = 6; break;
    case 6: 
      var $20=$i;
      var $21=(($20+1)|0);
      $i=$21;
      __label__ = 2; break;
    case 7: 
      var $23=$r;
      ;
      return $23;
    default: assert(0, "bad label: " + __label__);
  }
}


function _sort_pv() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $i;
      HEAP32[((_follow_pv)>>2)]=0;
      var $1=HEAP32[((_ply)>>2)];
      var $2=((_first_move+($1<<2))|0);
      var $3=HEAP32[(($2)>>2)];
      $i=$3;
      __label__ = 2; break;
    case 2: 
      var $5=$i;
      var $6=HEAP32[((_ply)>>2)];
      var $7=(($6+1)|0);
      var $8=((_first_move+($7<<2))|0);
      var $9=HEAP32[(($8)>>2)];
      var $10=(($5)|0) < (($9)|0);
      if ($10) { __label__ = 3; break; } else { __label__ = 7; break; }
    case 3: 
      var $12=$i;
      var $13=((_gen_dat+($12<<3))|0);
      var $14=(($13)|0);
      var $15=$14;
      var $16=HEAP32[(($15)>>2)];
      var $17=HEAP32[((_ply)>>2)];
      var $18=((((_pv)|0)+($17<<2))|0);
      var $19=$18;
      var $20=HEAP32[(($19)>>2)];
      var $21=(($16)|0)==(($20)|0);
      if ($21) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      HEAP32[((_follow_pv)>>2)]=1;
      var $23=$i;
      var $24=((_gen_dat+($23<<3))|0);
      var $25=(($24+4)|0);
      var $26=HEAP32[(($25)>>2)];
      var $27=(($26+10000000)|0);
      HEAP32[(($25)>>2)]=$27;
      __label__ = 7; break;
    case 5: 
      __label__ = 6; break;
    case 6: 
      var $30=$i;
      var $31=(($30+1)|0);
      $i=$31;
      __label__ = 2; break;
    case 7: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}


function _search($alpha, $beta, $depth) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $3;
      var $4;
      var $i;
      var $j;
      var $x;
      var $c;
      var $f;
      $2=$alpha;
      $3=$beta;
      $4=$depth;
      var $5=$4;
      var $6=(($5)|0)!=0;
      if ($6) { __label__ = 3; break; } else { __label__ = 2; break; }
    case 2: 
      var $8=$2;
      var $9=$3;
      var $10=_quiesce($8, $9);
      $1=$10;
      __label__ = 37; break;
    case 3: 
      var $12=HEAP32[((_nodes)>>2)];
      var $13=(($12+1)|0);
      HEAP32[((_nodes)>>2)]=$13;
      var $14=HEAP32[((_nodes)>>2)];
      var $15=$14 & 1023;
      var $16=(($15)|0)==0;
      if ($16) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      _checkup();
      __label__ = 5; break;
    case 5: 
      var $19=HEAP32[((_ply)>>2)];
      var $20=HEAP32[((_ply)>>2)];
      var $21=((_pv_length+($20<<2))|0);
      HEAP32[(($21)>>2)]=$19;
      var $22=HEAP32[((_ply)>>2)];
      var $23=(($22)|0)!=0;
      if ($23) { __label__ = 6; break; } else { __label__ = 8; break; }
    case 6: 
      var $25=_reps();
      var $26=(($25)|0)!=0;
      if ($26) { __label__ = 7; break; } else { __label__ = 8; break; }
    case 7: 
      $1=0;
      __label__ = 37; break;
    case 8: 
      var $29=HEAP32[((_ply)>>2)];
      var $30=(($29)|0) >= 31;
      if ($30) { __label__ = 9; break; } else { __label__ = 10; break; }
    case 9: 
      var $32=_eval();
      $1=$32;
      __label__ = 37; break;
    case 10: 
      var $34=HEAP32[((_hply)>>2)];
      var $35=(($34)|0) >= 399;
      if ($35) { __label__ = 11; break; } else { __label__ = 12; break; }
    case 11: 
      var $37=_eval();
      $1=$37;
      __label__ = 37; break;
    case 12: 
      var $39=HEAP32[((_side)>>2)];
      var $40=_in_check($39);
      $c=$40;
      var $41=$c;
      var $42=(($41)|0)!=0;
      if ($42) { __label__ = 13; break; } else { __label__ = 14; break; }
    case 13: 
      var $44=$4;
      var $45=(($44+1)|0);
      $4=$45;
      __label__ = 14; break;
    case 14: 
      _gen();
      var $47=HEAP32[((_follow_pv)>>2)];
      var $48=(($47)|0)!=0;
      if ($48) { __label__ = 15; break; } else { __label__ = 16; break; }
    case 15: 
      _sort_pv();
      __label__ = 16; break;
    case 16: 
      $f=0;
      var $51=HEAP32[((_ply)>>2)];
      var $52=((_first_move+($51<<2))|0);
      var $53=HEAP32[(($52)>>2)];
      $i=$53;
      __label__ = 17; break;
    case 17: 
      var $55=$i;
      var $56=HEAP32[((_ply)>>2)];
      var $57=(($56+1)|0);
      var $58=((_first_move+($57<<2))|0);
      var $59=HEAP32[(($58)>>2)];
      var $60=(($55)|0) < (($59)|0);
      if ($60) { __label__ = 18; break; } else { __label__ = 30; break; }
    case 18: 
      var $62=$i;
      _sort($62);
      var $63=$i;
      var $64=((_gen_dat+($63<<3))|0);
      var $65=(($64)|0);
      var $66=$65;
      var $67=_makemove($66);
      var $68=(($67)|0)!=0;
      if ($68) { __label__ = 20; break; } else { __label__ = 19; break; }
    case 19: 
      __label__ = 29; break;
    case 20: 
      $f=1;
      var $71=$3;
      var $72=(((-$71))|0);
      var $73=$2;
      var $74=(((-$73))|0);
      var $75=$4;
      var $76=(($75-1)|0);
      var $77=_search($72, $74, $76);
      var $78=(((-$77))|0);
      $x=$78;
      _takeback();
      var $79=$x;
      var $80=$2;
      var $81=(($79)|0) > (($80)|0);
      if ($81) { __label__ = 21; break; } else { __label__ = 28; break; }
    case 21: 
      var $83=$4;
      var $84=$i;
      var $85=((_gen_dat+($84<<3))|0);
      var $86=(($85)|0);
      var $87=$86;
      var $88=(($87+1)|0);
      var $89=HEAP8[($88)];
      var $90=(($89 << 24) >> 24);
      var $91=$i;
      var $92=((_gen_dat+($91<<3))|0);
      var $93=(($92)|0);
      var $94=$93;
      var $95=(($94)|0);
      var $96=HEAP8[($95)];
      var $97=(($96 << 24) >> 24);
      var $98=((_history+($97<<8))|0);
      var $99=(($98+($90<<2))|0);
      var $100=HEAP32[(($99)>>2)];
      var $101=(($100+$83)|0);
      HEAP32[(($99)>>2)]=$101;
      var $102=$x;
      var $103=$3;
      var $104=(($102)|0) >= (($103)|0);
      if ($104) { __label__ = 22; break; } else { __label__ = 23; break; }
    case 22: 
      var $106=$3;
      $1=$106;
      __label__ = 37; break;
    case 23: 
      var $108=$x;
      $2=$108;
      var $109=HEAP32[((_ply)>>2)];
      var $110=HEAP32[((_ply)>>2)];
      var $111=((_pv+($110<<7))|0);
      var $112=(($111+($109<<2))|0);
      var $113=$i;
      var $114=((_gen_dat+($113<<3))|0);
      var $115=(($114)|0);
      var $116=$112;
      var $117=$115;
      assert(4 % 1 === 0, 'memcpy given ' + 4 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP32[(($116)>>2)]=HEAP32[(($117)>>2)];
      var $118=HEAP32[((_ply)>>2)];
      var $119=(($118+1)|0);
      $j=$119;
      __label__ = 24; break;
    case 24: 
      var $121=$j;
      var $122=HEAP32[((_ply)>>2)];
      var $123=(($122+1)|0);
      var $124=((_pv_length+($123<<2))|0);
      var $125=HEAP32[(($124)>>2)];
      var $126=(($121)|0) < (($125)|0);
      if ($126) { __label__ = 25; break; } else { __label__ = 27; break; }
    case 25: 
      var $128=$j;
      var $129=HEAP32[((_ply)>>2)];
      var $130=((_pv+($129<<7))|0);
      var $131=(($130+($128<<2))|0);
      var $132=$j;
      var $133=HEAP32[((_ply)>>2)];
      var $134=(($133+1)|0);
      var $135=((_pv+($134<<7))|0);
      var $136=(($135+($132<<2))|0);
      var $137=$131;
      var $138=$136;
      assert(4 % 1 === 0, 'memcpy given ' + 4 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP32[(($137)>>2)]=HEAP32[(($138)>>2)];
      __label__ = 26; break;
    case 26: 
      var $140=$j;
      var $141=(($140+1)|0);
      $j=$141;
      __label__ = 24; break;
    case 27: 
      var $143=HEAP32[((_ply)>>2)];
      var $144=(($143+1)|0);
      var $145=((_pv_length+($144<<2))|0);
      var $146=HEAP32[(($145)>>2)];
      var $147=HEAP32[((_ply)>>2)];
      var $148=((_pv_length+($147<<2))|0);
      HEAP32[(($148)>>2)]=$146;
      __label__ = 28; break;
    case 28: 
      __label__ = 29; break;
    case 29: 
      var $151=$i;
      var $152=(($151+1)|0);
      $i=$152;
      __label__ = 17; break;
    case 30: 
      var $154=$f;
      var $155=(($154)|0)!=0;
      if ($155) { __label__ = 34; break; } else { __label__ = 31; break; }
    case 31: 
      var $157=$c;
      var $158=(($157)|0)!=0;
      if ($158) { __label__ = 32; break; } else { __label__ = 33; break; }
    case 32: 
      var $160=HEAP32[((_ply)>>2)];
      var $161=(($160-10000)|0);
      $1=$161;
      __label__ = 37; break;
    case 33: 
      $1=0;
      __label__ = 37; break;
    case 34: 
      var $164=HEAP32[((_fifty)>>2)];
      var $165=(($164)|0) >= 100;
      if ($165) { __label__ = 35; break; } else { __label__ = 36; break; }
    case 35: 
      $1=0;
      __label__ = 37; break;
    case 36: 
      var $168=$2;
      $1=$168;
      __label__ = 37; break;
    case 37: 
      var $170=$1;
      ;
      return $170;
    default: assert(0, "bad label: " + __label__);
  }
}
_search["X"]=1;

function _quiesce($alpha, $beta) {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $2;
      var $3;
      var $i;
      var $j;
      var $x;
      $2=$alpha;
      $3=$beta;
      var $4=HEAP32[((_nodes)>>2)];
      var $5=(($4+1)|0);
      HEAP32[((_nodes)>>2)]=$5;
      var $6=HEAP32[((_nodes)>>2)];
      var $7=$6 & 1023;
      var $8=(($7)|0)==0;
      if ($8) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      _checkup();
      __label__ = 3; break;
    case 3: 
      var $11=HEAP32[((_ply)>>2)];
      var $12=HEAP32[((_ply)>>2)];
      var $13=((_pv_length+($12<<2))|0);
      HEAP32[(($13)>>2)]=$11;
      var $14=HEAP32[((_ply)>>2)];
      var $15=(($14)|0) >= 31;
      if ($15) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $17=_eval();
      $1=$17;
      __label__ = 28; break;
    case 5: 
      var $19=HEAP32[((_hply)>>2)];
      var $20=(($19)|0) >= 399;
      if ($20) { __label__ = 6; break; } else { __label__ = 7; break; }
    case 6: 
      var $22=_eval();
      $1=$22;
      __label__ = 28; break;
    case 7: 
      var $24=_eval();
      $x=$24;
      var $25=$x;
      var $26=$3;
      var $27=(($25)|0) >= (($26)|0);
      if ($27) { __label__ = 8; break; } else { __label__ = 9; break; }
    case 8: 
      var $29=$3;
      $1=$29;
      __label__ = 28; break;
    case 9: 
      var $31=$x;
      var $32=$2;
      var $33=(($31)|0) > (($32)|0);
      if ($33) { __label__ = 10; break; } else { __label__ = 11; break; }
    case 10: 
      var $35=$x;
      $2=$35;
      __label__ = 11; break;
    case 11: 
      _gen_caps();
      var $37=HEAP32[((_follow_pv)>>2)];
      var $38=(($37)|0)!=0;
      if ($38) { __label__ = 12; break; } else { __label__ = 13; break; }
    case 12: 
      _sort_pv();
      __label__ = 13; break;
    case 13: 
      var $41=HEAP32[((_ply)>>2)];
      var $42=((_first_move+($41<<2))|0);
      var $43=HEAP32[(($42)>>2)];
      $i=$43;
      __label__ = 14; break;
    case 14: 
      var $45=$i;
      var $46=HEAP32[((_ply)>>2)];
      var $47=(($46+1)|0);
      var $48=((_first_move+($47<<2))|0);
      var $49=HEAP32[(($48)>>2)];
      var $50=(($45)|0) < (($49)|0);
      if ($50) { __label__ = 15; break; } else { __label__ = 27; break; }
    case 15: 
      var $52=$i;
      _sort($52);
      var $53=$i;
      var $54=((_gen_dat+($53<<3))|0);
      var $55=(($54)|0);
      var $56=$55;
      var $57=_makemove($56);
      var $58=(($57)|0)!=0;
      if ($58) { __label__ = 17; break; } else { __label__ = 16; break; }
    case 16: 
      __label__ = 26; break;
    case 17: 
      var $61=$3;
      var $62=(((-$61))|0);
      var $63=$2;
      var $64=(((-$63))|0);
      var $65=_quiesce($62, $64);
      var $66=(((-$65))|0);
      $x=$66;
      _takeback();
      var $67=$x;
      var $68=$2;
      var $69=(($67)|0) > (($68)|0);
      if ($69) { __label__ = 18; break; } else { __label__ = 25; break; }
    case 18: 
      var $71=$x;
      var $72=$3;
      var $73=(($71)|0) >= (($72)|0);
      if ($73) { __label__ = 19; break; } else { __label__ = 20; break; }
    case 19: 
      var $75=$3;
      $1=$75;
      __label__ = 28; break;
    case 20: 
      var $77=$x;
      $2=$77;
      var $78=HEAP32[((_ply)>>2)];
      var $79=HEAP32[((_ply)>>2)];
      var $80=((_pv+($79<<7))|0);
      var $81=(($80+($78<<2))|0);
      var $82=$i;
      var $83=((_gen_dat+($82<<3))|0);
      var $84=(($83)|0);
      var $85=$81;
      var $86=$84;
      assert(4 % 1 === 0, 'memcpy given ' + 4 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP32[(($85)>>2)]=HEAP32[(($86)>>2)];
      var $87=HEAP32[((_ply)>>2)];
      var $88=(($87+1)|0);
      $j=$88;
      __label__ = 21; break;
    case 21: 
      var $90=$j;
      var $91=HEAP32[((_ply)>>2)];
      var $92=(($91+1)|0);
      var $93=((_pv_length+($92<<2))|0);
      var $94=HEAP32[(($93)>>2)];
      var $95=(($90)|0) < (($94)|0);
      if ($95) { __label__ = 22; break; } else { __label__ = 24; break; }
    case 22: 
      var $97=$j;
      var $98=HEAP32[((_ply)>>2)];
      var $99=((_pv+($98<<7))|0);
      var $100=(($99+($97<<2))|0);
      var $101=$j;
      var $102=HEAP32[((_ply)>>2)];
      var $103=(($102+1)|0);
      var $104=((_pv+($103<<7))|0);
      var $105=(($104+($101<<2))|0);
      var $106=$100;
      var $107=$105;
      assert(4 % 1 === 0, 'memcpy given ' + 4 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP32[(($106)>>2)]=HEAP32[(($107)>>2)];
      __label__ = 23; break;
    case 23: 
      var $109=$j;
      var $110=(($109+1)|0);
      $j=$110;
      __label__ = 21; break;
    case 24: 
      var $112=HEAP32[((_ply)>>2)];
      var $113=(($112+1)|0);
      var $114=((_pv_length+($113<<2))|0);
      var $115=HEAP32[(($114)>>2)];
      var $116=HEAP32[((_ply)>>2)];
      var $117=((_pv_length+($116<<2))|0);
      HEAP32[(($117)>>2)]=$115;
      __label__ = 25; break;
    case 25: 
      __label__ = 26; break;
    case 26: 
      var $120=$i;
      var $121=(($120+1)|0);
      $i=$121;
      __label__ = 14; break;
    case 27: 
      var $123=$2;
      $1=$123;
      __label__ = 28; break;
    case 28: 
      var $125=$1;
      ;
      return $125;
    default: assert(0, "bad label: " + __label__);
  }
}
_quiesce["X"]=1;

function _sort($from) {
  var __stackBase__  = STACKTOP; STACKTOP += 8; assert(STACKTOP % 4 == 0, "Stack is unaligned"); assert(STACKTOP < STACK_MAX, "Ran out of stack");
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1;
      var $i;
      var $bs;
      var $bi;
      var $g=__stackBase__;
      $1=$from;
      $bs=-1;
      var $2=$1;
      $bi=$2;
      var $3=$1;
      $i=$3;
      __label__ = 2; break;
    case 2: 
      var $5=$i;
      var $6=HEAP32[((_ply)>>2)];
      var $7=(($6+1)|0);
      var $8=((_first_move+($7<<2))|0);
      var $9=HEAP32[(($8)>>2)];
      var $10=(($5)|0) < (($9)|0);
      if ($10) { __label__ = 3; break; } else { __label__ = 7; break; }
    case 3: 
      var $12=$i;
      var $13=((_gen_dat+($12<<3))|0);
      var $14=(($13+4)|0);
      var $15=HEAP32[(($14)>>2)];
      var $16=$bs;
      var $17=(($15)|0) > (($16)|0);
      if ($17) { __label__ = 4; break; } else { __label__ = 5; break; }
    case 4: 
      var $19=$i;
      var $20=((_gen_dat+($19<<3))|0);
      var $21=(($20+4)|0);
      var $22=HEAP32[(($21)>>2)];
      $bs=$22;
      var $23=$i;
      $bi=$23;
      __label__ = 5; break;
    case 5: 
      __label__ = 6; break;
    case 6: 
      var $26=$i;
      var $27=(($26+1)|0);
      $i=$27;
      __label__ = 2; break;
    case 7: 
      var $29=$1;
      var $30=((_gen_dat+($29<<3))|0);
      var $31=$g;
      var $32=$30;
      assert(8 % 1 === 0, 'memcpy given ' + 8 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP32[(($31)>>2)]=HEAP32[(($32)>>2)];HEAP32[(($31+4)>>2)]=HEAP32[(($32+4)>>2)];
      var $33=$1;
      var $34=((_gen_dat+($33<<3))|0);
      var $35=$bi;
      var $36=((_gen_dat+($35<<3))|0);
      var $37=$34;
      var $38=$36;
      assert(8 % 1 === 0, 'memcpy given ' + 8 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP32[(($37)>>2)]=HEAP32[(($38)>>2)];HEAP32[(($37+4)>>2)]=HEAP32[(($38+4)>>2)];
      var $39=$bi;
      var $40=((_gen_dat+($39<<3))|0);
      var $41=$40;
      var $42=$g;
      assert(8 % 1 === 0, 'memcpy given ' + 8 + ' bytes to copy. Problem with quantum=1 corrections perhaps?');HEAP32[(($41)>>2)]=HEAP32[(($42)>>2)];HEAP32[(($41+4)>>2)]=HEAP32[(($42+4)>>2)];
      STACKTOP = __stackBase__;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}
_sort["X"]=1;

function _checkup() {
  ;
  var __label__;
  __label__ = 1; 
  while(1) switch(__label__) {
    case 1: 
      var $1=_get_ms();
      var $2=HEAP32[((_stop_time)>>2)];
      var $3=(($1)|0) >= (($2)|0);
      if ($3) { __label__ = 2; break; } else { __label__ = 3; break; }
    case 2: 
      HEAP32[((_stop_search)>>2)]=1;
      _longjmp(((_env)|0), 0);
      throw "Reached an unreachable!"
    case 3: 
      ;
      return;
    default: assert(0, "bad label: " + __label__);
  }
}


  
  var ___rand_state=42;function _srand(seed) {
      // void srand(unsigned seed);
      ___rand_state = seed;
    }

  function _rand() {
      // int rand(void);
      ___rand_state = (1103515245 * ___rand_state + 12345) % 0x100000000;
      return ___rand_state & 0x7FFFFFFF;
    }

  
  function _memcpy(dest, src, num, align) {
      assert(num % 1 === 0, 'memcpy given ' + num + ' bytes to copy. Problem with quantum=1 corrections perhaps?');
      if (num >= 20 && src % 2 == dest % 2) {
        // This is unaligned, but quite large, and potentially alignable, so work hard to get to aligned settings
        if (src % 4 == dest % 4) {
          var stop = src + num;
          while (src % 4) { // no need to check for stop, since we have large num
            HEAP8[dest++] = HEAP8[src++];
          }
          var src4 = src >> 2, dest4 = dest >> 2, stop4 = stop >> 2;
          while (src4 < stop4) {
            HEAP32[dest4++] = HEAP32[src4++];
          }
          src = src4 << 2;
          dest = dest4 << 2;
          while (src < stop) {
            HEAP8[dest++] = HEAP8[src++];
          }
        } else {
          var stop = src + num;
          if (src % 2) { // no need to check for stop, since we have large num
            HEAP8[dest++] = HEAP8[src++];
          }
          var src2 = src >> 1, dest2 = dest >> 1, stop2 = stop >> 1;
          while (src2 < stop2) {
            HEAP16[dest2++] = HEAP16[src2++];
          }
          src = src2 << 1;
          dest = dest2 << 1;
          if (src < stop) {
            HEAP8[dest++] = HEAP8[src++];
          }
        }
      } else {
        while (num--) {
          HEAP8[dest++] = HEAP8[src++];
        }
      }
    }var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }

  
  
  var ERRNO_CODES={E2BIG:7,EACCES:13,EADDRINUSE:98,EADDRNOTAVAIL:99,EAFNOSUPPORT:97,EAGAIN:11,EALREADY:114,EBADF:9,EBADMSG:74,EBUSY:16,ECANCELED:125,ECHILD:10,ECONNABORTED:103,ECONNREFUSED:111,ECONNRESET:104,EDEADLK:35,EDESTADDRREQ:89,EDOM:33,EDQUOT:122,EEXIST:17,EFAULT:14,EFBIG:27,EHOSTUNREACH:113,EIDRM:43,EILSEQ:84,EINPROGRESS:115,EINTR:4,EINVAL:22,EIO:5,EISCONN:106,EISDIR:21,ELOOP:40,EMFILE:24,EMLINK:31,EMSGSIZE:90,EMULTIHOP:72,ENAMETOOLONG:36,ENETDOWN:100,ENETRESET:102,ENETUNREACH:101,ENFILE:23,ENOBUFS:105,ENODATA:61,ENODEV:19,ENOENT:2,ENOEXEC:8,ENOLCK:37,ENOLINK:67,ENOMEM:12,ENOMSG:42,ENOPROTOOPT:92,ENOSPC:28,ENOSR:63,ENOSTR:60,ENOSYS:38,ENOTCONN:107,ENOTDIR:20,ENOTEMPTY:39,ENOTRECOVERABLE:131,ENOTSOCK:88,ENOTSUP:95,ENOTTY:25,ENXIO:6,EOVERFLOW:75,EOWNERDEAD:130,EPERM:1,EPIPE:32,EPROTO:71,EPROTONOSUPPORT:93,EPROTOTYPE:91,ERANGE:34,EROFS:30,ESPIPE:29,ESRCH:3,ESTALE:116,ETIME:62,ETIMEDOUT:110,ETXTBSY:26,EWOULDBLOCK:11,EXDEV:18};
  
  function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      if (!___setErrNo.ret) ___setErrNo.ret = allocate([0], 'i32', ALLOC_STATIC);
      HEAP32[((___setErrNo.ret)>>2)]=value
      return value;
    }
  
  var _stdin=0;
  
  var _stdout=0;
  
  var _stderr=0;
  
  var __impure_ptr=0;var FS={currentPath:"/",nextInode:2,streams:[null],ignorePermissions:true,absolutePath:function (relative, base) {
        if (typeof relative !== 'string') return null;
        if (base === undefined) base = FS.currentPath;
        if (relative && relative[0] == '/') base = '';
        var full = base + '/' + relative;
        var parts = full.split('/').reverse();
        var absolute = [''];
        while (parts.length) {
          var part = parts.pop();
          if (part == '' || part == '.') {
            // Nothing.
          } else if (part == '..') {
            if (absolute.length > 1) absolute.pop();
          } else {
            absolute.push(part);
          }
        }
        return absolute.length == 1 ? '/' : absolute.join('/');
      },analyzePath:function (path, dontResolveLastLink, linksVisited) {
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };
        path = FS.absolutePath(path);
        if (path == '/') {
          ret.isRoot = true;
          ret.exists = ret.parentExists = true;
          ret.name = '/';
          ret.path = ret.parentPath = '/';
          ret.object = ret.parentObject = FS.root;
        } else if (path !== null) {
          linksVisited = linksVisited || 0;
          path = path.slice(1).split('/');
          var current = FS.root;
          var traversed = [''];
          while (path.length) {
            if (path.length == 1 && current.isFolder) {
              ret.parentExists = true;
              ret.parentPath = traversed.length == 1 ? '/' : traversed.join('/');
              ret.parentObject = current;
              ret.name = path[0];
            }
            var target = path.shift();
            if (!current.isFolder) {
              ret.error = ERRNO_CODES.ENOTDIR;
              break;
            } else if (!current.read) {
              ret.error = ERRNO_CODES.EACCES;
              break;
            } else if (!current.contents.hasOwnProperty(target)) {
              ret.error = ERRNO_CODES.ENOENT;
              break;
            }
            current = current.contents[target];
            if (current.link && !(dontResolveLastLink && path.length == 0)) {
              if (linksVisited > 40) { // Usual Linux SYMLOOP_MAX.
                ret.error = ERRNO_CODES.ELOOP;
                break;
              }
              var link = FS.absolutePath(current.link, traversed.join('/'));
              return FS.analyzePath([link].concat(path).join('/'),
                                    dontResolveLastLink, linksVisited + 1);
            }
            traversed.push(target);
            if (path.length == 0) {
              ret.exists = true;
              ret.path = traversed.join('/');
              ret.object = current;
            }
          }
          return ret;
        }
        return ret;
      },findObject:function (path, dontResolveLastLink) {
        FS.ensureRoot();
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },createObject:function (parent, name, properties, canRead, canWrite) {
        if (!parent) parent = '/';
        if (typeof parent === 'string') parent = FS.findObject(parent);
  
        if (!parent) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent path must exist.');
        }
        if (!parent.isFolder) {
          ___setErrNo(ERRNO_CODES.ENOTDIR);
          throw new Error('Parent must be a folder.');
        }
        if (!parent.write && !FS.ignorePermissions) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent folder must be writeable.');
        }
        if (!name || name == '.' || name == '..') {
          ___setErrNo(ERRNO_CODES.ENOENT);
          throw new Error('Name must not be empty.');
        }
        if (parent.contents.hasOwnProperty(name)) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          throw new Error("Can't overwrite object.");
        }
  
        parent.contents[name] = {
          read: canRead === undefined ? true : canRead,
          write: canWrite === undefined ? false : canWrite,
          timestamp: Date.now(),
          inodeNumber: FS.nextInode++
        };
        for (var key in properties) {
          if (properties.hasOwnProperty(key)) {
            parent.contents[name][key] = properties[key];
          }
        }
  
        return parent.contents[name];
      },createFolder:function (parent, name, canRead, canWrite) {
        var properties = {isFolder: true, isDevice: false, contents: {}};
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createPath:function (parent, path, canRead, canWrite) {
        var current = FS.findObject(parent);
        if (current === null) throw new Error('Invalid parent.');
        path = path.split('/').reverse();
        while (path.length) {
          var part = path.pop();
          if (!part) continue;
          if (!current.contents.hasOwnProperty(part)) {
            FS.createFolder(current, part, canRead, canWrite);
          }
          current = current.contents[part];
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        properties.isFolder = false;
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createDataFile:function (parent, name, data, canRead, canWrite) {
        if (typeof data === 'string') {
          var dataArray = [];
          for (var i = 0; i < data.length; i++) dataArray.push(data.charCodeAt(i));
          data = dataArray;
        }
        var properties = {isDevice: false, contents: data};
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        var properties = {isDevice: false, url: url};
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var properties = {isDevice: false, link: target};
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createDevice:function (parent, name, input, output) {
        if (!(input || output)) {
          throw new Error('A device must have at least one callback defined.');
        }
        var ops = {isDevice: true, input: input, output: output};
        return FS.createFile(parent, name, ops, Boolean(input), Boolean(output));
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          // Browser.
          // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
          var xhr = new XMLHttpRequest();
          xhr.open('GET', obj.url, false);
  
          // Some hints to the browser that we want binary data.
          if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
          }
  
          xhr.send(null);
          if (xhr.status != 200 && xhr.status != 0) success = false;
          if (xhr.response !== undefined) {
            obj.contents = new Uint8Array(xhr.response || []);
          } else {
            obj.contents = intArrayFromString(xhr.responseText || '', true);
          }
        } else if (typeof read !== 'undefined') {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(read(obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },ensureRoot:function () {
        if (FS.root) return;
        // The main file system tree. All the contents are inside this.
        FS.root = {
          read: true,
          write: true,
          isFolder: true,
          isDevice: false,
          timestamp: Date.now(),
          inodeNumber: 1,
          contents: {}
        };
      },init:function (input, output, error) {
        // Make sure we initialize only once.
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureRoot();
  
        // Default handlers.
        if (!input) input = function() {
          if (!input.cache || !input.cache.length) {
            var result;
            if (typeof window != 'undefined' &&
                typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
            }
            if (!result) result = '';
            input.cache = intArrayFromString(result + '\n', true);
          }
          return input.cache.shift();
        };
        if (!output) output = function(val) {
          if (val === null || val === '\n'.charCodeAt(0)) {
            output.printer(output.buffer.join(''));
            output.buffer = [];
          } else {
            output.buffer.push(String.fromCharCode(val));
          }
        };
        if (!output.printer) output.printer = print;
        if (!output.buffer) output.buffer = [];
        if (!error) error = output;
  
        // Create the temporary folder.
        FS.createFolder('/', 'tmp', true, true);
  
        // Create the I/O devices.
        var devFolder = FS.createFolder('/', 'dev', true, true);
        var stdin = FS.createDevice(devFolder, 'stdin', input);
        var stdout = FS.createDevice(devFolder, 'stdout', null, output);
        var stderr = FS.createDevice(devFolder, 'stderr', null, error);
        FS.createDevice(devFolder, 'tty', input, output);
  
        // Create default streams.
        FS.streams[1] = {
          path: '/dev/stdin',
          object: stdin,
          position: 0,
          isRead: true,
          isWrite: false,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[2] = {
          path: '/dev/stdout',
          object: stdout,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[3] = {
          path: '/dev/stderr',
          object: stderr,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: []
        };
        _stdin = allocate([1], 'void*', ALLOC_STATIC);
        _stdout = allocate([2], 'void*', ALLOC_STATIC);
        _stderr = allocate([3], 'void*', ALLOC_STATIC);
  
        // Other system paths
        FS.createPath('/', 'dev/shm/tmp', true, true); // temp files
  
        // Newlib initialization
        FS.streams[_stdin] = FS.streams[1];
        FS.streams[_stdout] = FS.streams[2];
        FS.streams[_stderr] = FS.streams[3];
        __impure_ptr = allocate([ allocate(
          [0, 0, 0, 0, _stdin, 0, 0, 0, _stdout, 0, 0, 0, _stderr, 0, 0, 0],
          'void*', ALLOC_STATIC) ], 'void*', ALLOC_STATIC);
      },quit:function () {
        if (!FS.init.initialized) return;
        // Flush any partially-printed lines in stdout and stderr
        if (FS.streams[2].object.output.buffer.length > 0) FS.streams[2].object.output('\n'.charCodeAt(0));
        if (FS.streams[3].object.output.buffer.length > 0) FS.streams[3].object.output('\n'.charCodeAt(0));
      }};
  
  
  
  
  
  
  
  var ___dirent_struct_layout=null;function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      // NOTE: This implementation tries to mimic glibc rather that strictly
      // following the POSIX standard.
  
      var mode = HEAP32[((varargs)>>2)];
  
      // Simplify flags.
      var accessMode = oflag & 3;
      var isWrite = accessMode != 0;
      var isRead = accessMode != 1;
      var isCreate = Boolean(oflag & 512);
      var isExistCheck = Boolean(oflag & 2048);
      var isTruncate = Boolean(oflag & 1024);
      var isAppend = Boolean(oflag & 8);
  
      // Verify path.
      var origPath = path;
      path = FS.analyzePath(Pointer_stringify(path));
      if (!path.parentExists) {
        ___setErrNo(path.error);
        return -1;
      }
      var target = path.object || null;
      var finalPath;
  
      // Verify the file exists, create if needed and allowed.
      if (target) {
        if (isCreate && isExistCheck) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          return -1;
        }
        if ((isWrite || isCreate || isTruncate) && target.isFolder) {
          ___setErrNo(ERRNO_CODES.EISDIR);
          return -1;
        }
        if (isRead && !target.read || isWrite && !target.write) {
          ___setErrNo(ERRNO_CODES.EACCES);
          return -1;
        }
        if (isTruncate && !target.isDevice) {
          target.contents = [];
        } else {
          if (!FS.forceLoadFile(target)) {
            ___setErrNo(ERRNO_CODES.EIO);
            return -1;
          }
        }
        finalPath = path.path;
      } else {
        if (!isCreate) {
          ___setErrNo(ERRNO_CODES.ENOENT);
          return -1;
        }
        if (!path.parentObject.write) {
          ___setErrNo(ERRNO_CODES.EACCES);
          return -1;
        }
        target = FS.createDataFile(path.parentObject, path.name, [],
                                   mode & 0x100, mode & 0x80);  // S_IRUSR, S_IWUSR.
        finalPath = path.parentPath + '/' + path.name;
      }
      // Actually create an open stream.
      var id = FS.streams.length;
      if (target.isFolder) {
        var entryBuffer = 0;
        if (___dirent_struct_layout) {
          entryBuffer = _malloc(___dirent_struct_layout.__size__);
        }
        var contents = [];
        for (var key in target.contents) contents.push(key);
        FS.streams[id] = {
          path: finalPath,
          object: target,
          // An index into contents. Special values: -2 is ".", -1 is "..".
          position: -2,
          isRead: true,
          isWrite: false,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: [],
          // Folder-specific properties:
          // Remember the contents at the time of opening in an array, so we can
          // seek between them relying on a single order.
          contents: contents,
          // Each stream has its own area for readdir() returns.
          currentEntry: entryBuffer
        };
      } else {
        FS.streams[id] = {
          path: finalPath,
          object: target,
          position: 0,
          isRead: isRead,
          isWrite: isWrite,
          isAppend: isAppend,
          error: false,
          eof: false,
          ungotten: []
        };
      }
      return id;
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 1024;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 8;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }

  
  
  
  
  
  
  
  
  
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var contents = stream.object.contents;
        while (contents.length < offset) contents.push(0);
        for (var i = 0; i < nbyte; i++) {
          contents[offset + i] = HEAPU8[(buf+i)];
        }
        stream.object.timestamp = Date.now();
        return i;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        if (stream.object.isDevice) {
          if (stream.object.output) {
            for (var i = 0; i < nbyte; i++) {
              try {
                stream.object.output(HEAP8[(buf+i)]);
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
            }
            stream.object.timestamp = Date.now();
            return i;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
          if (bytesWritten != -1) stream.position += bytesWritten;
          return bytesWritten;
        }
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return -1;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  
  function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = (tempDoubleI32[0]=HEAP32[((varargs+argIndex)>>2)],tempDoubleI32[1]=HEAP32[((varargs+argIndex+4)>>2)],tempDoubleF64[0]);
        } else if (type == 'i64') {
          ret = [HEAP32[((varargs+argIndex)>>2)],
                 HEAP32[((varargs+argIndex+4)>>2)]];
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[((varargs+argIndex)>>2)];
        }
        argIndex += Runtime.getNativeFieldSize(type);
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[(textIndex+1)];
        if (curr == '%'.charCodeAt(0)) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case '+'.charCodeAt(0):
                flagAlwaysSigned = true;
                break;
              case '-'.charCodeAt(0):
                flagLeftAlign = true;
                break;
              case '#'.charCodeAt(0):
                flagAlternative = true;
                break;
              case '0'.charCodeAt(0):
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[(textIndex+1)];
          }
  
          // Handle width.
          var width = 0;
          if (next == '*'.charCodeAt(0)) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[(textIndex+1)];
          } else {
            while (next >= '0'.charCodeAt(0) && next <= '9'.charCodeAt(0)) {
              width = width * 10 + (next - '0'.charCodeAt(0));
              textIndex++;
              next = HEAP8[(textIndex+1)];
            }
          }
  
          // Handle precision.
          var precisionSet = false;
          if (next == '.'.charCodeAt(0)) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[(textIndex+1)];
            if (next == '*'.charCodeAt(0)) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[(textIndex+1)];
                if (precisionChr < '0'.charCodeAt(0) ||
                    precisionChr > '9'.charCodeAt(0)) break;
                precision = precision * 10 + (precisionChr - '0'.charCodeAt(0));
                textIndex++;
              }
            }
            next = HEAP8[(textIndex+1)];
          } else {
            var precision = 6; // Standard default.
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[(textIndex+2)];
              if (nextNext == 'h'.charCodeAt(0)) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[(textIndex+2)];
              if (nextNext == 'l'.charCodeAt(0)) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[(textIndex+1)];
  
          // Handle type specifier.
          if (['d', 'i', 'u', 'o', 'x', 'X', 'p'].indexOf(String.fromCharCode(next)) != -1) {
            // Integer.
            var signed = next == 'd'.charCodeAt(0) || next == 'i'.charCodeAt(0);
            argSize = argSize || 4;
            var currArg = getNextArg('i' + (argSize * 8));
            // Flatten i64-1 [low, high] into a (slightly rounded) double
            if (argSize == 8) {
              currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 'u'.charCodeAt(0));
            }
            // Truncate to requested size.
            if (argSize <= 4) {
              var limit = Math.pow(256, argSize) - 1;
              currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
            }
            // Format the number.
            var currAbsArg = Math.abs(currArg);
            var argText;
            var prefix = '';
            if (next == 'd'.charCodeAt(0) || next == 'i'.charCodeAt(0)) {
              argText = reSign(currArg, 8 * argSize, 1).toString(10);
            } else if (next == 'u'.charCodeAt(0)) {
              argText = unSign(currArg, 8 * argSize, 1).toString(10);
              currArg = Math.abs(currArg);
            } else if (next == 'o'.charCodeAt(0)) {
              argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
            } else if (next == 'x'.charCodeAt(0) || next == 'X'.charCodeAt(0)) {
              prefix = flagAlternative ? '0x' : '';
              if (currArg < 0) {
                // Represent negative numbers in hex as 2's complement.
                currArg = -currArg;
                argText = (currAbsArg - 1).toString(16);
                var buffer = [];
                for (var i = 0; i < argText.length; i++) {
                  buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                }
                argText = buffer.join('');
                while (argText.length < argSize * 2) argText = 'f' + argText;
              } else {
                argText = currAbsArg.toString(16);
              }
              if (next == 'X'.charCodeAt(0)) {
                prefix = prefix.toUpperCase();
                argText = argText.toUpperCase();
              }
            } else if (next == 'p'.charCodeAt(0)) {
              if (currAbsArg === 0) {
                argText = '(nil)';
              } else {
                prefix = '0x';
                argText = currAbsArg.toString(16);
              }
            }
            if (precisionSet) {
              while (argText.length < precision) {
                argText = '0' + argText;
              }
            }
  
            // Add sign if needed
            if (flagAlwaysSigned) {
              if (currArg < 0) {
                prefix = '-' + prefix;
              } else {
                prefix = '+' + prefix;
              }
            }
  
            // Add padding.
            while (prefix.length + argText.length < width) {
              if (flagLeftAlign) {
                argText += ' ';
              } else {
                if (flagZeroPad) {
                  argText = '0' + argText;
                } else {
                  prefix = ' ' + prefix;
                }
              }
            }
  
            // Insert the result into the buffer.
            argText = prefix + argText;
            argText.split('').forEach(function(chr) {
              ret.push(chr.charCodeAt(0));
            });
          } else if (['f', 'F', 'e', 'E', 'g', 'G'].indexOf(String.fromCharCode(next)) != -1) {
            // Float.
            var currArg = getNextArg('double');
            var argText;
  
            if (isNaN(currArg)) {
              argText = 'nan';
              flagZeroPad = false;
            } else if (!isFinite(currArg)) {
              argText = (currArg < 0 ? '-' : '') + 'inf';
              flagZeroPad = false;
            } else {
              var isGeneral = false;
              var effectivePrecision = Math.min(precision, 20);
  
              // Convert g/G to f/F or e/E, as per:
              // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
              if (next == 'g'.charCodeAt(0) || next == 'G'.charCodeAt(0)) {
                isGeneral = true;
                precision = precision || 1;
                var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                if (precision > exponent && exponent >= -4) {
                  next = ((next == 'g'.charCodeAt(0)) ? 'f' : 'F').charCodeAt(0);
                  precision -= exponent + 1;
                } else {
                  next = ((next == 'g'.charCodeAt(0)) ? 'e' : 'E').charCodeAt(0);
                  precision--;
                }
                effectivePrecision = Math.min(precision, 20);
              }
  
              if (next == 'e'.charCodeAt(0) || next == 'E'.charCodeAt(0)) {
                argText = currArg.toExponential(effectivePrecision);
                // Make sure the exponent has at least 2 digits.
                if (/[eE][-+]\d$/.test(argText)) {
                  argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                }
              } else if (next == 'f'.charCodeAt(0) || next == 'F'.charCodeAt(0)) {
                argText = currArg.toFixed(effectivePrecision);
              }
  
              var parts = argText.split('e');
              if (isGeneral && !flagAlternative) {
                // Discard trailing zeros and periods.
                while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                       (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                  parts[0] = parts[0].slice(0, -1);
                }
              } else {
                // Make sure we have a period in alternative mode.
                if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                // Zero pad until required precision.
                while (precision > effectivePrecision++) parts[0] += '0';
              }
              argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
              // Capitalize 'E' if needed.
              if (next == 'E'.charCodeAt(0)) argText = argText.toUpperCase();
  
              // Add sign.
              if (flagAlwaysSigned && currArg >= 0) {
                argText = '+' + argText;
              }
            }
  
            // Add padding.
            while (argText.length < width) {
              if (flagLeftAlign) {
                argText += ' ';
              } else {
                if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                  argText = argText[0] + '0' + argText.slice(1);
                } else {
                  argText = (flagZeroPad ? '0' : ' ') + argText;
                }
              }
            }
  
            // Adjust case.
            if (next < 'a'.charCodeAt(0)) argText = argText.toUpperCase();
  
            // Insert the result into the buffer.
            argText.split('').forEach(function(chr) {
              ret.push(chr.charCodeAt(0));
            });
          } else if (next == 's'.charCodeAt(0)) {
            // String.
            var arg = getNextArg('i8*');
            var copiedString;
            if (arg) {
              copiedString = String_copy(arg);
              if (precisionSet && copiedString.length > precision) {
                copiedString = copiedString.slice(0, precision);
              }
            } else {
              copiedString = intArrayFromString('(null)', true);
            }
            if (!flagLeftAlign) {
              while (copiedString.length < width--) {
                ret.push(' '.charCodeAt(0));
              }
            }
            ret = ret.concat(copiedString);
            if (flagLeftAlign) {
              while (copiedString.length < width--) {
                ret.push(' '.charCodeAt(0));
              }
            }
          } else if (next == 'c'.charCodeAt(0)) {
            // Character.
            if (flagLeftAlign) ret.push(getNextArg('i8'));
            while (--width > 0) {
              ret.push(' '.charCodeAt(0));
            }
            if (!flagLeftAlign) ret.push(getNextArg('i8'));
          } else if (next == 'n'.charCodeAt(0)) {
            // Write the length written so far to the next parameter.
            var ptr = getNextArg('i32*');
            HEAP32[((ptr)>>2)]=ret.length
          } else if (next == '%'.charCodeAt(0)) {
            // Literal percent sign.
            ret.push(curr);
          } else {
            // Unknown specifiers remain untouched.
            for (var i = startTextIndex; i < textIndex + 2; i++) {
              ret.push(HEAP8[(i)]);
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }

  
  
  
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      if (FS.streams[fildes]) {
        if (FS.streams[fildes].currentEntry) {
          _free(FS.streams[fildes].currentEntry);
        }
        delete FS.streams[fildes];
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }
  
  
  
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      if (FS.streams[fildes]) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }

  
  function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, n - 1);
      for (var i = 0; i < limit; i++) {
        HEAP8[(s+i)]=result[i];
      }
      HEAP8[(s+i)]=0;
      return result.length;
    }function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }

  
  
  
  
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      if (FS.streams[fildes] && !FS.streams[fildes].isDevice) {
        var stream = FS.streams[fildes];
        var position = offset;
        if (whence === 1) {  // SEEK_CUR.
          position += stream.position;
        } else if (whence === 2) {  // SEEK_END.
          position += stream.object.contents.length;
        }
        if (position < 0) {
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
        } else {
          stream.ungotten = [];
          stream.position = position;
          return position;
        }
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var ret = _lseek(stream, offset, whence);
      if (ret == -1) {
        return -1;
      } else {
        FS.streams[stream].eof = false;
        return 0;
      }
    }

  
  
  
  
  
  
  
  
  
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isRead) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var bytesRead = 0;
        while (stream.ungotten.length && nbyte > 0) {
          HEAP8[(buf++)]=stream.ungotten.pop()
          nbyte--;
          bytesRead++;
        }
        var contents = stream.object.contents;
        var size = Math.min(contents.length - offset, nbyte);
        for (var i = 0; i < size; i++) {
          HEAP8[(buf+i)]=contents[offset + i]
          bytesRead++;
        }
        return bytesRead;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.streams[fildes];
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isRead) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var bytesRead;
        if (stream.object.isDevice) {
          if (stream.object.input) {
            bytesRead = 0;
            while (stream.ungotten.length && nbyte > 0) {
              HEAP8[(buf++)]=stream.ungotten.pop()
              nbyte--;
              bytesRead++;
            }
            for (var i = 0; i < nbyte; i++) {
              try {
                var result = stream.object.input();
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              HEAP8[(buf+i)]=result
            }
            return bytesRead;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var ungotSize = stream.ungotten.length;
          bytesRead = _pread(fildes, buf, nbyte, stream.position);
          if (bytesRead != -1) {
            stream.position += (stream.ungotten.length - ungotSize) + bytesRead;
          }
          return bytesRead;
        }
      }
    }function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      if (!(stream in FS.streams)) return -1;
      var streamObj = FS.streams[stream];
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _read(stream, _fgetc.ret, 1);
      if (ret == 0) {
        streamObj.eof = true;
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAP8[(_fgetc.ret)];
      }
    }function _fgets(s, n, stream) {
      // char *fgets(char *restrict s, int n, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgets.html
      if (!(stream in FS.streams)) return 0;
      var streamObj = FS.streams[stream];
      if (streamObj.error || streamObj.eof) return 0;
      var byte_;
      for (var i = 0; i < n - 1 && byte_ != '\n'.charCodeAt(0); i++) {
        byte_ = _fgetc(stream);
        if (byte_ == -1) {
          if (streamObj.error) return 0;
          else if (streamObj.eof) break;
        }
        HEAP8[(s+i)]=byte_
      }
      HEAP8[(s+i)]=0
      return s;
    }

  function _strlen(ptr) {
      return String_len(ptr);
    }

  function _difftime(time1, time0) {
      return time1 - time0;
    }

  
  
  
  
  
  
  function __isFloat(text) {
      return !!(/^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?$/.exec(text));
    }function __scanString(format, get, unget, varargs) {
      // Supports %x, %4x, %d.%d, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      for (var formatIndex = 0; formatIndex < format.length; formatIndex++) {
        if (next <= 0) return fields;
        var next = get();
        if (next <= 0) return fields;  // End of input.
        if (format[formatIndex] === '%') {
          formatIndex++;
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= '0'.charCodeAt(0) &&
                 format[formatIndex].charCodeAt(0) <= '9'.charCodeAt(0)) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          // TODO: Handle type size modifier.
          var long_ = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f') {
            var last = -1;
            while (next > 0) {
              buffer.push(String.fromCharCode(next));
              if (__isFloat(buffer.join(''))) {
                last = buffer.length;
              }
              next = get();
            }
            while (buffer.length > last) {
              buffer.pop();
              unget();
            }
          } else {
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if ((type === 'd' && next >= '0'.charCodeAt(0) && next <= '9'.charCodeAt(0)) ||
                  (type === 'x' && (next >= '0'.charCodeAt(0) && next <= '9'.charCodeAt(0) ||
                                    next >= 'a'.charCodeAt(0) && next <= 'f'.charCodeAt(0) ||
                                    next >= 'A'.charCodeAt(0) && next <= 'F'.charCodeAt(0))) ||
                  (type === 's') &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
              } else {
                break;
              }
            }
          }
          if (buffer.length === 0) return 0;  // Failure.
          var text = buffer.join('');
          var argPtr = HEAP32[((varargs+argIndex)>>2)];
          argIndex += Runtime.getNativeFieldSize('void*');
          switch (type) {
            case 'd':
              HEAP32[((argPtr)>>2)]=parseInt(text, 10)
              break;
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16)
              break;
            case 'f':
              if (long_) {
                (tempDoubleF64[0]=parseFloat(text),HEAP32[((argPtr)>>2)]=tempDoubleI32[0],HEAP32[((argPtr+4)>>2)]=tempDoubleI32[1])
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text)
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(argPtr+j)]=array[j]
              }
              break;
          }
          fields++;
        } else {
          // Not a specifier.
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            return fields;
          }
        }
      }
      return fields;
    }
  
  
  
  var _getc=_fgetc;
  
  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      if (stream in FS.streams) {
        c = unSign(c & 0xFF);
        FS.streams[stream].ungotten.push(c);
        return c;
      } else {
        return -1;
      }
    }function _fscanf(stream, format, varargs) {
      // int fscanf(FILE *restrict stream, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      if (stream in FS.streams) {
        var get = function() { return _fgetc(stream); };
        var unget = function(c) { return _ungetc(c, stream); };
        return __scanString(format, get, unget, varargs);
      } else {
        return -1;
      }
    }function _scanf(format, varargs) {
      // int scanf(const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var stdin = HEAP32[((_stdin)>>2)];
      return _fscanf(stdin, format, varargs);
    }

  
  function _strncmp(px, py, n) {
      var i = 0;
      while (i < n) {
        var x = HEAP8[(px+i)];
        var y = HEAP8[(py+i)];
        if (x == y && x == 0) return 0;
        if (x == 0) return -1;
        if (y == 0) return 1;
        if (x == y) {
          i ++;
          continue;
        } else {
          return x > y ? 1 : -1;
        }
      }
      return 0;
    }function _strcmp(px, py) {
      return _strncmp(px, py, TOTAL_MEMORY);
    }

  function _signal(sig, func) {
      // TODO
      return 0;
    }

  
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      var flush = function(filedes) {
        // Right now we write all data directly, except for output devices.
        if (filedes in FS.streams && FS.streams[filedes].object.output) {
          FS.streams[filedes].object.output(null);
        }
      };
      try {
        if (stream === 0) {
          for (var i in FS.streams) flush(i);
        } else {
          flush(stream);
        }
        return 0;
      } catch (e) {
        ___setErrNo(ERRNO_CODES.EIO);
        return -1;
      }
    }

  function _sscanf(s, format, varargs) {
      // int sscanf(const char *restrict s, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var index = 0;
      var get = function() { return HEAP8[(s+index++)]; };
      var unget = function() { index--; };
      return __scanString(format, get, unget, varargs);
    }
var _setjmp; // stub for _setjmp

  
  function _memset(ptr, value, num, align) {
      // TODO: make these settings, and in memcpy, {{'s
      if (num >= 20) {
        // This is unaligned, but quite large, so work hard to get to aligned settings
        var stop = ptr + num;
        while (ptr % 4) { // no need to check for stop, since we have large num
          HEAP8[ptr++] = value;
        }
        if (value < 0) value += 256; // make it unsigned
        var ptr4 = ptr >> 2, stop4 = stop >> 2, value4 = value | (value << 8) | (value << 16) | (value << 24);
        while (ptr4 < stop4) {
          HEAP32[ptr4++] = value4;
        }
        ptr = ptr4 << 2;
        while (ptr < stop) {
          HEAP8[ptr++] = value;
        }
      } else {
        while (num--) {
          HEAP8[ptr++] = value;
        }
      }
    }var _llvm_memset_p0i8_i32=_memset;

  function _longjmp(env, value) {
      throw { longjmp: true, label: HEAP32[((env)>>2)], value: value || 1 };
    }



  function _malloc(bytes) {
      /* Over-allocate to make sure it is byte-aligned by 8.
       * This will leak memory, but this is only the dummy
       * implementation (replaced by dlmalloc normally) so
       * not an issue.
       */
      ptr = Runtime.staticAlloc(bytes + 8);
      return (ptr+8) & 0xFFFFFFF8;
    }

  function _free(){}
__ATINIT__.unshift({ func: function() { FS.ignorePermissions = false; if (!FS.init.initialized) FS.init() } });__ATEXIT__.push({ func: function() { FS.quit() } });
___setErrNo(0);
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);

// === Auto-generated postamble setup entry stuff ===

Module.callMain = function callMain(args) {
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_STATIC) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_STATIC));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_STATIC);

  return _main(argc, argv, 0);
}




var _book_file;


var _mailbox;
var _mailbox64;
var _slide;
var _offsets;
var _offset;
var _castle_mask;

var _init_color;
var _init_piece;
var _color;
var _piece;
var _side;
var _xside;
var _castle;
var _ep;
var _fifty;
var _hash;
var _ply;
var _hply;
var _gen_dat;
var _first_move;
var _history;
var _hist_dat;
var _max_time;
var _max_depth;
var _start_time;
var _stop_time;
var _nodes;
var _pv;
var _pv_length;
var _follow_pv;
var _hash_piece;
var _hash_side;
var _hash_ep;
var _piece_value;
var _pawn_pcsq;
var _knight_pcsq;
var _bishop_pcsq;
var _king_pcsq;
var _king_endgame_pcsq;
var _flip;
var _pawn_rank;
var _piece_mat;
var _pawn_mat;
var _ftime_ok;

var __str152;


































var _move_str_str;







var __impure_ptr;






















var _bench_color;
var _bench_piece;








var _stop_search;
var _env;





STRING_TABLE.__str=allocate([98,111,111,107,46,116,120,116,0] /* book.txt\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str1=allocate([114,0] /* r\00 */, "i8", ALLOC_STATIC);
_book_file=allocate(1, "%struct.__sFILE*", ALLOC_STATIC);
STRING_TABLE.__str2=allocate([79,112,101,110,105,110,103,32,98,111,111,107,32,109,105,115,115,105,110,103,46,10,0] /* Opening book missing */, "i8", ALLOC_STATIC);
STRING_TABLE.__str3=allocate([37,115,32,0] /* %s \00 */, "i8", ALLOC_STATIC);
_mailbox=allocate([-1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0, 10, 0, 0, 0, 11, 0, 0, 0, 12, 0, 0, 0, 13, 0, 0, 0, 14, 0, 0, 0, 15, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 16, 0, 0, 0, 17, 0, 0, 0, 18, 0, 0, 0, 19, 0, 0, 0, 20, 0, 0, 0, 21, 0, 0, 0, 22, 0, 0, 0, 23, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 24, 0, 0, 0, 25, 0, 0, 0, 26, 0, 0, 0, 27, 0, 0, 0, 28, 0, 0, 0, 29, 0, 0, 0, 30, 0, 0, 0, 31, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 32, 0, 0, 0, 33, 0, 0, 0, 34, 0, 0, 0, 35, 0, 0, 0, 36, 0, 0, 0, 37, 0, 0, 0, 38, 0, 0, 0, 39, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 40, 0, 0, 0, 41, 0, 0, 0, 42, 0, 0, 0, 43, 0, 0, 0, 44, 0, 0, 0, 45, 0, 0, 0, 46, 0, 0, 0, 47, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 48, 0, 0, 0, 49, 0, 0, 0, 50, 0, 0, 0, 51, 0, 0, 0, 52, 0, 0, 0, 53, 0, 0, 0, 54, 0, 0, 0, 55, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 56, 0, 0, 0, 57, 0, 0, 0, 58, 0, 0, 0, 59, 0, 0, 0, 60, 0, 0, 0, 61, 0, 0, 0, 62, 0, 0, 0, 63, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_mailbox64=allocate([21, 0, 0, 0, 22, 0, 0, 0, 23, 0, 0, 0, 24, 0, 0, 0, 25, 0, 0, 0, 26, 0, 0, 0, 27, 0, 0, 0, 28, 0, 0, 0, 31, 0, 0, 0, 32, 0, 0, 0, 33, 0, 0, 0, 34, 0, 0, 0, 35, 0, 0, 0, 36, 0, 0, 0, 37, 0, 0, 0, 38, 0, 0, 0, 41, 0, 0, 0, 42, 0, 0, 0, 43, 0, 0, 0, 44, 0, 0, 0, 45, 0, 0, 0, 46, 0, 0, 0, 47, 0, 0, 0, 48, 0, 0, 0, 51, 0, 0, 0, 52, 0, 0, 0, 53, 0, 0, 0, 54, 0, 0, 0, 55, 0, 0, 0, 56, 0, 0, 0, 57, 0, 0, 0, 58, 0, 0, 0, 61, 0, 0, 0, 62, 0, 0, 0, 63, 0, 0, 0, 64, 0, 0, 0, 65, 0, 0, 0, 66, 0, 0, 0, 67, 0, 0, 0, 68, 0, 0, 0, 71, 0, 0, 0, 72, 0, 0, 0, 73, 0, 0, 0, 74, 0, 0, 0, 75, 0, 0, 0, 76, 0, 0, 0, 77, 0, 0, 0, 78, 0, 0, 0, 81, 0, 0, 0, 82, 0, 0, 0, 83, 0, 0, 0, 84, 0, 0, 0, 85, 0, 0, 0, 86, 0, 0, 0, 87, 0, 0, 0, 88, 0, 0, 0, 91, 0, 0, 0, 92, 0, 0, 0, 93, 0, 0, 0, 94, 0, 0, 0, 95, 0, 0, 0, 96, 0, 0, 0, 97, 0, 0, 0, 98, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_slide=allocate([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_offsets=allocate([0, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_offset=allocate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -21, 0, 0, 0, -19, 0, 0, 0, -12, 0, 0, 0, -8, 0, 0, 0, 8, 0, 0, 0, 12, 0, 0, 0, 19, 0, 0, 0, 21, 0, 0, 0, -11, 0, 0, 0, -9, 0, 0, 0, 9, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -11, 0, 0, 0, -10, 0, 0, 0, -9, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 9, 0, 0, 0, 10, 0, 0, 0, 11, 0, 0, 0, -11, 0, 0, 0, -10, 0, 0, 0, -9, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 9, 0, 0, 0, 10, 0, 0, 0, 11, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_castle_mask=allocate([7, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 3, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 11, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 13, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 12, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 14, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
STRING_TABLE._piece_char=allocate([80,78,66,82,81,75] /* PNBRQK */, "i8", ALLOC_STATIC);
_init_color=allocate([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_init_piece=allocate([3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_color=allocate(256, "i32", ALLOC_STATIC);
_piece=allocate(256, "i32", ALLOC_STATIC);
_side=allocate(1, "i32", ALLOC_STATIC);
_xside=allocate(1, "i32", ALLOC_STATIC);
_castle=allocate(1, "i32", ALLOC_STATIC);
_ep=allocate(1, "i32", ALLOC_STATIC);
_fifty=allocate(1, "i32", ALLOC_STATIC);
_hash=allocate(1, "i32", ALLOC_STATIC);
_ply=allocate(1, "i32", ALLOC_STATIC);
_hply=allocate(1, "i32", ALLOC_STATIC);
_gen_dat=allocate(8960, "i32", ALLOC_STATIC);
_first_move=allocate(128, "i32", ALLOC_STATIC);
_history=allocate(16384, "i32", ALLOC_STATIC);
_hist_dat=allocate(9600, "i32", ALLOC_STATIC);
_max_time=allocate(1, "i32", ALLOC_STATIC);
_max_depth=allocate(1, "i32", ALLOC_STATIC);
_start_time=allocate(1, "i32", ALLOC_STATIC);
_stop_time=allocate(1, "i32", ALLOC_STATIC);
_nodes=allocate(1, "i32", ALLOC_STATIC);
_pv=allocate(4096, "i32", ALLOC_STATIC);
_pv_length=allocate(128, "i32", ALLOC_STATIC);
_follow_pv=allocate(1, "i32", ALLOC_STATIC);
_hash_piece=allocate(3072, "i32", ALLOC_STATIC);
_hash_side=allocate(1, "i32", ALLOC_STATIC);
_hash_ep=allocate(256, "i32", ALLOC_STATIC);
_piece_value=allocate([100, 0, 0, 0, 300, 0, 0, 0, 300, 0, 0, 0, 500, 0, 0, 0, 900, 0, 0, 0, 0, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_pawn_pcsq=allocate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 10, 0, 0, 0, 15, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 15, 0, 0, 0, 10, 0, 0, 0, 5, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 12, 0, 0, 0, 16, 0, 0, 0, 16, 0, 0, 0, 12, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 0, 6, 0, 0, 0, 9, 0, 0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 9, 0, 0, 0, 6, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0, 6, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_knight_pcsq=allocate([-10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -30, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -30, 0, 0, 0, -10, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_bishop_pcsq=allocate([-10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -20, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0, -20, 0, 0, 0, -10, 0, 0, 0, -10, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_king_pcsq=allocate([-40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -40, 0, 0, 0, -20, 0, 0, 0, -20, 0, 0, 0, -20, 0, 0, 0, -20, 0, 0, 0, -20, 0, 0, 0, -20, 0, 0, 0, -20, 0, 0, 0, -20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 40, 0, 0, 0, -20, 0, 0, 0, 0, 0, 0, 0, -20, 0, 0, 0, 40, 0, 0, 0, 20, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_king_endgame_pcsq=allocate([0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0, 30, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0, 40, 0, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0, 40, 0, 0, 0, 50, 0, 0, 0, 50, 0, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0, 40, 0, 0, 0, 50, 0, 0, 0, 60, 0, 0, 0, 60, 0, 0, 0, 50, 0, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, 30, 0, 0, 0, 40, 0, 0, 0, 50, 0, 0, 0, 60, 0, 0, 0, 60, 0, 0, 0, 50, 0, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0, 40, 0, 0, 0, 50, 0, 0, 0, 50, 0, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0, 40, 0, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0, 30, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_flip=allocate([56, 0, 0, 0, 57, 0, 0, 0, 58, 0, 0, 0, 59, 0, 0, 0, 60, 0, 0, 0, 61, 0, 0, 0, 62, 0, 0, 0, 63, 0, 0, 0, 48, 0, 0, 0, 49, 0, 0, 0, 50, 0, 0, 0, 51, 0, 0, 0, 52, 0, 0, 0, 53, 0, 0, 0, 54, 0, 0, 0, 55, 0, 0, 0, 40, 0, 0, 0, 41, 0, 0, 0, 42, 0, 0, 0, 43, 0, 0, 0, 44, 0, 0, 0, 45, 0, 0, 0, 46, 0, 0, 0, 47, 0, 0, 0, 32, 0, 0, 0, 33, 0, 0, 0, 34, 0, 0, 0, 35, 0, 0, 0, 36, 0, 0, 0, 37, 0, 0, 0, 38, 0, 0, 0, 39, 0, 0, 0, 24, 0, 0, 0, 25, 0, 0, 0, 26, 0, 0, 0, 27, 0, 0, 0, 28, 0, 0, 0, 29, 0, 0, 0, 30, 0, 0, 0, 31, 0, 0, 0, 16, 0, 0, 0, 17, 0, 0, 0, 18, 0, 0, 0, 19, 0, 0, 0, 20, 0, 0, 0, 21, 0, 0, 0, 22, 0, 0, 0, 23, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0, 10, 0, 0, 0, 11, 0, 0, 0, 12, 0, 0, 0, 13, 0, 0, 0, 14, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_pawn_rank=allocate(80, "i32", ALLOC_STATIC);
_piece_mat=allocate(8, "i32", ALLOC_STATIC);
_pawn_mat=allocate(8, "i32", ALLOC_STATIC);
_ftime_ok=allocate([1], ["i32",0,0,0,0], ALLOC_STATIC);
STRING_TABLE.__str51=allocate([73,108,108,101,103,97,108,32,109,111,118,101,46,0] /* Illegal move.\00 */, "i8", ALLOC_STATIC);
__str152=allocate(1, "i8", ALLOC_STATIC);
STRING_TABLE.__str253=allocate([40,110,111,32,108,101,103,97,108,32,109,111,118,101,115,41,10,0] /* (no legal moves)\0A\ */, "i8", ALLOC_STATIC);
STRING_TABLE.__str354=allocate([10,0] /* \0A\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str4=allocate([84,111,109,32,75,101,114,114,105,103,97,110,39,115,32,83,105,109,112,108,101,32,67,104,101,115,115,32,80,114,111,103,114,97,109,32,40,84,83,67,80,41,10,0] /* Tom Kerrigan's Simpl */, "i8", ALLOC_STATIC);
STRING_TABLE.__str5=allocate([118,101,114,115,105,111,110,32,49,46,56,49,44,32,50,47,53,47,48,51,10,0] /* version 1.81, 2/5/03 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str6=allocate([67,111,112,121,114,105,103,104,116,32,49,57,57,55,32,84,111,109,32,75,101,114,114,105,103,97,110,10,0] /* Copyright 1997 Tom K */, "i8", ALLOC_STATIC);
STRING_TABLE.__str7=allocate([34,104,101,108,112,34,32,100,105,115,112,108,97,121,115,32,97,32,108,105,115,116,32,111,102,32,99,111,109,109,97,110,100,115,46,10,0] /* \22help\22 displays  */, "i8", ALLOC_STATIC);
STRING_TABLE.__str8=allocate([67,111,109,112,117,116,101,114,39,115,32,109,111,118,101,58,32,37,115,10,0] /* Computer's move: %s\ */, "i8", ALLOC_STATIC);
STRING_TABLE.__str9=allocate([116,115,99,112,62,32,0] /* tscp_ \00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str10=allocate([37,115,0] /* %s\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str11=allocate([111,110,0] /* on\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str12=allocate([111,102,102,0] /* off\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str13=allocate([115,116,0] /* st\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str14=allocate([37,100,0] /* %d\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str15=allocate([115,100,0] /* sd\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str16=allocate([117,110,100,111,0] /* undo\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str17=allocate([110,101,119,0] /* new\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str18=allocate([100,0] /* d\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str19=allocate([98,101,110,99,104,0] /* bench\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str20=allocate([98,121,101,0] /* bye\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str21=allocate([83,104,97,114,101,32,97,110,100,32,101,110,106,111,121,33,10,0] /* Share and enjoy!\0A\ */, "i8", ALLOC_STATIC);
STRING_TABLE.__str22=allocate([120,98,111,97,114,100,0] /* xboard\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str23=allocate([104,101,108,112,0] /* help\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str24=allocate([111,110,32,45,32,99,111,109,112,117,116,101,114,32,112,108,97,121,115,32,102,111,114,32,116,104,101,32,115,105,100,101,32,116,111,32,109,111,118,101,10,0] /* on - computer plays  */, "i8", ALLOC_STATIC);
STRING_TABLE.__str25=allocate([111,102,102,32,45,32,99,111,109,112,117,116,101,114,32,115,116,111,112,115,32,112,108,97,121,105,110,103,10,0] /* off - computer stops */, "i8", ALLOC_STATIC);
STRING_TABLE.__str26=allocate([115,116,32,110,32,45,32,115,101,97,114,99,104,32,102,111,114,32,110,32,115,101,99,111,110,100,115,32,112,101,114,32,109,111,118,101,10,0] /* st n - search for n  */, "i8", ALLOC_STATIC);
STRING_TABLE.__str27=allocate([115,100,32,110,32,45,32,115,101,97,114,99,104,32,110,32,112,108,121,32,112,101,114,32,109,111,118,101,10,0] /* sd n - search n ply  */, "i8", ALLOC_STATIC);
STRING_TABLE.__str28=allocate([117,110,100,111,32,45,32,116,97,107,101,115,32,98,97,99,107,32,97,32,109,111,118,101,10,0] /* undo - takes back a  */, "i8", ALLOC_STATIC);
STRING_TABLE.__str29=allocate([110,101,119,32,45,32,115,116,97,114,116,115,32,97,32,110,101,119,32,103,97,109,101,10,0] /* new - starts a new g */, "i8", ALLOC_STATIC);
STRING_TABLE.__str30=allocate([100,32,45,32,100,105,115,112,108,97,121,32,116,104,101,32,98,111,97,114,100,10,0] /* d - display the boar */, "i8", ALLOC_STATIC);
STRING_TABLE.__str31=allocate([98,101,110,99,104,32,45,32,114,117,110,32,116,104,101,32,98,117,105,108,116,45,105,110,32,98,101,110,99,104,109,97,114,107,10,0] /* bench - run the buil */, "i8", ALLOC_STATIC);
STRING_TABLE.__str32=allocate([98,121,101,32,45,32,101,120,105,116,32,116,104,101,32,112,114,111,103,114,97,109,10,0] /* bye - exit the progr */, "i8", ALLOC_STATIC);
STRING_TABLE.__str33=allocate([120,98,111,97,114,100,32,45,32,115,119,105,116,99,104,32,116,111,32,88,66,111,97,114,100,32,109,111,100,101,10,0] /* xboard - switch to X */, "i8", ALLOC_STATIC);
STRING_TABLE.__str34=allocate([69,110,116,101,114,32,109,111,118,101,115,32,105,110,32,99,111,111,114,100,105,110,97,116,101,32,110,111,116,97,116,105,111,110,44,32,101,46,103,46,44,32,101,50,101,52,44,32,101,55,101,56,81,10,0] /* Enter moves in coord */, "i8", ALLOC_STATIC);
STRING_TABLE.__str35=allocate([73,108,108,101,103,97,108,32,109,111,118,101,46,10,0] /* Illegal move.\0A\00 */, "i8", ALLOC_STATIC);
_move_str_str=allocate(6, "i8", ALLOC_STATIC);
STRING_TABLE.__str36=allocate([37,99,37,100,37,99,37,100,37,99,0] /* %c%d%c%d%c\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str37=allocate([37,99,37,100,37,99,37,100,0] /* %c%d%c%d\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str38=allocate([10,56,32,0] /* \0A8 \00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str39=allocate([32,46,0] /*  .\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str40=allocate([32,37,99,0] /*  %c\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str41=allocate([10,37,100,32,0] /* \0A%d \00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str42=allocate([10,10,32,32,32,97,32,98,32,99,32,100,32,101,32,102,32,103,32,104,10,10,0] /* \0A\0A   a b c d e f */, "i8", ALLOC_STATIC);
STRING_TABLE.__str43=allocate([109,111,118,101,32,37,115,10,0] /* move %s\0A\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str44=allocate([113,117,105,116,0] /* quit\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str45=allocate([102,111,114,99,101,0] /* force\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str46=allocate([119,104,105,116,101,0] /* white\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str47=allocate([98,108,97,99,107,0] /* black\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str48=allocate([115,116,32,37,100,0] /* st %d\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str49=allocate([115,100,32,37,100,0] /* sd %d\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str50=allocate([116,105,109,101,0] /* time\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str5155=allocate([116,105,109,101,32,37,100,0] /* time %d\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str52=allocate([111,116,105,109,0] /* otim\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str53=allocate([103,111,0] /* go\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str54=allocate([104,105,110,116,0] /* hint\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str55=allocate([72,105,110,116,58,32,37,115,10,0] /* Hint: %s\0A\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str56=allocate([114,101,109,111,118,101,0] /* remove\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str57=allocate([112,111,115,116,0] /* post\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str58=allocate([110,111,112,111,115,116,0] /* nopost\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str59=allocate([69,114,114,111,114,32,40,117,110,107,110,111,119,110,32,99,111,109,109,97,110,100,41,58,32,37,115,10,0] /* Error (unknown comma */, "i8", ALLOC_STATIC);
STRING_TABLE.__str60=allocate([48,45,49,32,123,66,108,97,99,107,32,109,97,116,101,115,125,10,0] /* 0-1 {Black mates}\0A */, "i8", ALLOC_STATIC);
STRING_TABLE.__str61=allocate([49,45,48,32,123,87,104,105,116,101,32,109,97,116,101,115,125,10,0] /* 1-0 {White mates}\0A */, "i8", ALLOC_STATIC);
STRING_TABLE.__str62=allocate([49,47,50,45,49,47,50,32,123,83,116,97,108,101,109,97,116,101,125,10,0] /* 1/2-1/2 {Stalemate}\ */, "i8", ALLOC_STATIC);
STRING_TABLE.__str63=allocate([49,47,50,45,49,47,50,32,123,68,114,97,119,32,98,121,32,114,101,112,101,116,105,116,105,111,110,125,10,0] /* 1/2-1/2 {Draw by rep */, "i8", ALLOC_STATIC);
STRING_TABLE.__str64=allocate([49,47,50,45,49,47,50,32,123,68,114,97,119,32,98,121,32,102,105,102,116,121,32,109,111,118,101,32,114,117,108,101,125,10,0] /* 1/2-1/2 {Draw by fif */, "i8", ALLOC_STATIC);
_bench_color=allocate([6, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
_bench_piece=allocate([6, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 6, 0, 0, 0, 2, 0, 0, 0, 6, 0, 0, 0, 3, 0, 0, 0, 6, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0], ["i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0,"i32",0,0,0], ALLOC_STATIC);
STRING_TABLE.__str65=allocate([84,105,109,101,58,32,37,100,32,109,115,10,0] /* Time: %d ms\0A\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str66=allocate([78,111,100,101,115,58,32,37,100,10,0] /* Nodes: %d\0A\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str67=allocate([66,101,115,116,32,116,105,109,101,58,32,37,100,32,109,115,10,0] /* Best time: %d ms\0A\ */, "i8", ALLOC_STATIC);
STRING_TABLE.__str68=allocate([89,111,117,114,32,99,111,109,112,105,108,101,114,39,115,32,102,116,105,109,101,40,41,32,102,117,110,99,116,105,111,110,32,105,115,32,97,112,112,97,114,101,110,116,108,121,32,111,110,108,121,32,97,99,99,117,114,97,116,101,10,0] /* Your compiler's ftim */, "i8", ALLOC_STATIC);
STRING_TABLE.__str69=allocate([116,111,32,116,104,101,32,115,101,99,111,110,100,46,32,80,108,101,97,115,101,32,99,104,97,110,103,101,32,116,104,101,32,103,101,116,95,109,115,40,41,32,102,117,110,99,116,105,111,110,32,105,110,32,109,97,105,110,46,99,10,0] /* to the second. Pleas */, "i8", ALLOC_STATIC);
STRING_TABLE.__str70=allocate([116,111,32,109,97,107,101,32,105,116,32,109,111,114,101,32,97,99,99,117,114,97,116,101,46,10,0] /* to make it more accu */, "i8", ALLOC_STATIC);
STRING_TABLE.__str71=allocate([40,105,110,118,97,108,105,100,41,10,0] /* (invalid)\0A\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str72=allocate([78,111,100,101,115,32,112,101,114,32,115,101,99,111,110,100,58,32,37,100,32,40,83,99,111,114,101,58,32,37,46,51,102,41,10,0] /* Nodes per second: %d */, "i8", ALLOC_STATIC);
_stop_search=allocate(1, "i32", ALLOC_STATIC);
_env=allocate(40, "i16", ALLOC_STATIC);
STRING_TABLE.__str73=allocate([112,108,121,32,32,32,32,32,32,110,111,100,101,115,32,32,115,99,111,114,101,32,32,112,118,10,0] /* ply      nodes  scor */, "i8", ALLOC_STATIC);
STRING_TABLE.__str174=allocate([37,51,100,32,32,37,57,100,32,32,37,53,100,32,0] /* %3d  %9d  %5d \00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str275=allocate([37,100,32,37,100,32,37,100,32,37,100,0] /* %d %d %d %d\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str376=allocate([32,37,115,0] /*  %s\00 */, "i8", ALLOC_STATIC);
STRING_TABLE.__str477=allocate([10,0] /* \0A\00 */, "i8", ALLOC_STATIC);
FUNCTION_TABLE = [0,0]; Module["FUNCTION_TABLE"] = FUNCTION_TABLE;


function run(args) {
  args = args || Module['arguments'];

  initRuntime();

  var ret = null;
  if (Module['_main']) {
    ret = Module.callMain(args);
    if (!Module['noExitRuntime']) {
      exitRuntime();
    }
  }
  return ret;
}
Module['run'] = run;

// {{PRE_RUN_ADDITIONS}}

if (Module['preRun']) {
  Module['preRun']();
}


if (!Module['noInitialRun']) {
  var ret = run();
}

// {{POST_RUN_ADDITIONS}}

if (Module['postRun']) {
  Module['postRun']();
}





  // {{MODULE_ADDITIONS}}


// EMSCRIPTEN_GENERATED_FUNCTIONS: ["_set_hash","_attack","_init_board","_init_hash","_hash_rand","_in_check","_gen","_gen_push","_gen_promote","_gen_caps","_makemove","_takeback","_open_book","_close_book","_book_move","_book_match","_eval_light_pawn","_eval_dark_pawn","_eval","_eval_light_king","_eval_dark_king","_eval_lkp","_eval_dkp","_parse_move","_get_ms","_initChessEngine","_playerMove","_computerMove","_move_str","_main_original","_print_board","_xboard","_print_result","_bench","_think","_reps","_sort_pv","_search","_quiesce","_sort","_checkup"]

