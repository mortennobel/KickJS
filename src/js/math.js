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
 *
 * This math library is a part of Kickstart Engine, but has no dependency to the rest of the project except for the
 * KICK.core.Constants (in constants.js)
 *
 * KICK.math is based on
 * glMatrix.js - version 0.9.6 - High performance matrix and vector operations for WebGL
 * But is extended in several ways
 *
 * glMatrix.js
 * Copyright (c) 2011 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
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

    var math = KICK.namespace("KICK.math"),
        vec2 = KICK.namespace("KICK.math.vec2"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat3 = KICK.namespace("KICK.math.mat3"),
        mat4 = KICK.namespace("KICK.math.mat4"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        wrapArray = function(array, length){
            var i,
                index=0,
                count = array.length/length,
                res = new Array(count);
            for (i=0;i<count;i++,index += length){
                res[i] = array.subarray(index,index+length);
            }
            return res;
        };


    /**
     * vec2 - 2 dimensional vector
     */
    math.vec2 = vec2;

    /**
     * See KICK.math.vec4.wrapArray
     * @method wrapArray
     * @param {Float32Array} array
     * @return {Array[KICK.math.vec2]} of vec2
     */
    vec2.wrapArray = function(array){
        return wrapArray(array,2);
    };


    /**
     * Create a continuous array in memory mapped to vec2. <br>
     * @method array
     * @param {Number} count Number of vec 2 to be layed out in memory
     * @param {Object} ref Optional, if set a memory reference is set to ref.mem
     * @return {KICK.math.vec2} New vec2
     */
    vec2.array = function(count,ref){
        var memory = new Float32Array(count*2);
        if (ref){
            ref.mem = memory;
        }
        return vec2.wrapArray(memory);
    };

    /**
     * Creates a new instance of a vec2 using the default array type
     * Any javascript array containing at least 2 numeric elements can serve as a vec2
     * @method create
     * @param {Array[Number]} vec Optional, vec2 containing values to initialize with
     * @return {KICK.math.vec2} New vec2
     */
    vec2.create = function(vec) {
        var dest = new Float32Array(2);

        if(vec) {
            dest[0] = vec[0];
            dest[1] = vec[1];
        }

        return dest;
    };

    /**
     * Copies the values of one vec2 to another
     * @method set
     * @param {KICK.math.vec2} vec vec2 containing values to copy
     * @param {KICK.math.vec2} dest vec2 receiving copied values
     * @return {KICK.math.vec2} dest
     */
    vec2.set = function(vec, dest) {
        dest[0] = vec[0];
        dest[1] = vec[1];

        return dest;
    };

    /**
     * Performs a vector addition
     * @method add
     * @param {KICK.math.vec2} vec  first operand
     * @param {KICK.math.vec2} vec2  second operand
     * @param {KICK.math.vec2} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec2} dest if specified, vec otherwise
     */
    vec2.add = function(vec, vec2, dest) {
        if(!dest || vec == dest) {
            vec[0] += vec2[0];
            vec[1] += vec2[1];
            return vec;
        }

        dest[0] = vec[0] + vec2[0];
        dest[1] = vec[1] + vec2[1];
        return dest;
    };

    /**
     * Performs a vector subtraction
     * @method subtract
     * @param {KICK.math.vec2} vec first operand
     * @param {KICK.math.vec2} vec2 second operand
     * @param {KICK.math.vec2} dest Optional, vec2 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec2} dest if specified, vec otherwise
     */
    vec2.subtract = function(vec, vec2, dest) {
        if(!dest || vec == dest) {
            vec[0] -= vec2[0];
            vec[1] -= vec2[1];
            return vec;
        }

        dest[0] = vec[0] - vec2[0];
        dest[1] = vec[1] - vec2[1];
        return dest;
    };

    /**
     * Generates a unit vector of the same direction as the provided vec2
     * If vector length is 0, returns [0, 0]
     * @method normalize
     * @param {KICK.math.vec2} vec vec3 to normalize
     * @param {KICK.math.vec2} dest Optional, vec2 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec2} dest if specified, vec otherwise
     */
    vec2.normalize = function(vec, dest) {
        if(!dest) { dest = vec; }

        var x = vec[0], y = vec[1];
        var len = Math.sqrt(x*x + y*y);

        if (!len) {
            dest[0] = 0;
            dest[1] = 0;
            return dest;
        } else if (len == 1) {
            dest[0] = x;
            dest[1] = y;
            return dest;
        }

        len = 1 / len;
        dest[0] = x*len;
        dest[1] = y*len;
        return dest;
    };

    // glMatrix start

    /**
     * vec3 - 3 Dimensional Vector
     * @class vec3
     * @namespace KICK.math
     */
    math.vec3 = vec3;

    /**
     * See KICK.math.vec4.wrapArray
     * @method wrapArray
     * @param {Float32Array} array
     * @return {Array[KICK.math.vec3]} of vec3
     */
    vec3.wrapArray = function(array){
        return wrapArray(array,3);
    };

    /**
     * Create a continuous array in memory mapped to vec3. <br>
     * <br>
     * Example<br>
     * <pre class="brush: js">
     * var ref = {};
     * var v = KICK.math.vec3.array(2,ref);
     * v[1][1] = 1;
     * ref.mem[4] == v[1][1];
     * </pre>
     * Will be layed out like this: <br>
     * <br>
     * <pre class="brush: js">
     * [vec3][vec3) = [0][1][2][3][4][5]
     * </pre>
     *
     * @method array
     * @param {Number} count Number of vec 3 to be layed out in memory
     * @param {Object} ref Optional, if set a memory reference is set to ref.mem
     * @return {KICK.math.vec3} New vec3
     */
    vec3.array = function(count,ref){
        var memory = new Float32Array(count*3);
        if (ref){
            ref.mem = memory;
        }
        return vec3.wrapArray(memory);
    };

    /**
     * Creates a new instance of a vec3 using the default array type
     * Any javascript array containing at least 3 numeric elements can serve as a vec3
     * @method create
     * @param {Array[Number]} vec Optional, vec3 containing values to initialize with
     * @return {KICK.math.vec3} New vec3
     */
    vec3.create = function(vec) {
        var dest = new Float32Array(3);

        if(vec) {
            dest[0] = vec[0];
            dest[1] = vec[1];
            dest[2] = vec[2];
        }

        return dest;
    };

    /**
     * Copies the values of one vec3 to another
     * @method set
     * @param {KICK.math.vec3} vec vec3 containing values to copy
     * @param {KICK.math.vec3} dest vec3 receiving copied values
     * @return {KICK.math.vec3} dest
     */
    vec3.set = function(vec, dest) {
        dest[0] = vec[0];
        dest[1] = vec[1];
        dest[2] = vec[2];

        return dest;
    };

    /**
     * Performs a vector addition
     * @method add
     * @param {KICK.math.vec3} vec  first operand
     * @param {KICK.math.vec3} vec2  second operand
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.add = function(vec, vec2, dest) {
        if(!dest || vec == dest) {
            vec[0] += vec2[0];
            vec[1] += vec2[1];
            vec[2] += vec2[2];
            return vec;
        }

        dest[0] = vec[0] + vec2[0];
        dest[1] = vec[1] + vec2[1];
        dest[2] = vec[2] + vec2[2];
        return dest;
    };

    /**
     * Performs a vector subtraction
     * @method subtract
     * @param {KICK.math.vec3} vec first operand
     * @param {KICK.math.vec3} vec2 second operand
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.subtract = function(vec, vec2, dest) {
        if(!dest || vec == dest) {
            vec[0] -= vec2[0];
            vec[1] -= vec2[1];
            vec[2] -= vec2[2];
            return vec;
        }

        dest[0] = vec[0] - vec2[0];
        dest[1] = vec[1] - vec2[1];
        dest[2] = vec[2] - vec2[2];
        return dest;
    };

    /**
     * Performs a vector multiplication
     * @method multiply
     * @param {KICK.math.vec3} vec first operand
     * @param {KICK.math.vec3} vec2 second operand
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.multiply = function(vec, vec2, dest) {
        if(!dest || vec == dest) {
            vec[0] *= vec2[0];
            vec[1] *= vec2[1];
            vec[2] *= vec2[2];
            return vec;
        }

        dest[0] = vec[0] * vec2[0];
        dest[1] = vec[1] * vec2[1];
        dest[2] = vec[2] * vec2[2];
        return dest;
    };

    /**
     * Negates the components of a vec3
     * @method negate
     * @param {KICK.math.vec3} vec vec3 to negate
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.negate = function(vec, dest) {
        if(!dest) { dest = vec; }

        dest[0] = -vec[0];
        dest[1] = -vec[1];
        dest[2] = -vec[2];
        return dest;
    };

    /**
     * Multiplies the components of a vec3 by a scalar value
     * @method scale
     * @param {KICK.math.vec3} vec vec3 to scale
     * @param {Number} val Numeric value to scale by
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.scale = function(vec, val, dest) {
        if(!dest || vec == dest) {
            vec[0] *= val;
            vec[1] *= val;
            vec[2] *= val;
            return vec;
        }

        dest[0] = vec[0]*val;
        dest[1] = vec[1]*val;
        dest[2] = vec[2]*val;
        return dest;
    };

    /**
     * Generates a unit vector of the same direction as the provided vec3
     * If vector length is 0, returns [0, 0, 0]
     * @method normalize
     * @param {KICK.math.vec3} vec vec3 to normalize
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.normalize = function(vec, dest) {
        if(!dest) { dest = vec; }

        var x = vec[0], y = vec[1], z = vec[2];
        var len = Math.sqrt(x*x + y*y + z*z);

        if (!len) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            return dest;
        } else if (len == 1) {
            dest[0] = x;
            dest[1] = y;
            dest[2] = z;
            return dest;
        }

        len = 1 / len;
        dest[0] = x*len;
        dest[1] = y*len;
        dest[2] = z*len;
        return dest;
    };

    /**
     * Generates the cross product of two vec3s
     * @method cross
     * @param {KICK.math.vec3} vec first operand
     * @param {KICK.math.vec3} vec2 second operand
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.cross = function(vec, vec2, dest){
        if(!dest) { dest = vec; }

        var x = vec[0], y = vec[1], z = vec[2];
        var x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];

        dest[0] = y*z2 - z*y2;
        dest[1] = z*x2 - x*z2;
        dest[2] = x*y2 - y*x2;
        return dest;
    };

    /**
     * Calculates the length of a vec3
     * @method length
     * @param {KICK.math.vec3} vec vec3 to calculate length of
     * @return {Number} Length of vec
     */
    vec3.length = function(vec){
        var x = vec[0], y = vec[1], z = vec[2];
        return Math.sqrt(x*x + y*y + z*z);
    };

    /**
     * Calculates the squared length of a vec3
     * @method lengthSqr
     * @param {KICK.math.vec3} vec vec3 to calculate squared length of
     * @return {Number} Squared length of vec
     */
    vec3.lengthSqr = function(vec){
        var x = vec[0], y = vec[1], z = vec[2];
        return x*x + y*y + z*z;
    };

    /**
     * Calculates the dot product of two vec3s
     * @method dot
     * @param {KICK.math.vec3} vec first operand
     * @param {KICK.math.vec3} vec2 second operand
     * @return {Number} Dot product of vec and vec2
     */
    vec3.dot = function(vec, vec2){
        return vec[0]*vec2[0] + vec[1]*vec2[1] + vec[2]*vec2[2];
    };

    /**
     * Generates a unit vector pointing from one vector to another
     * @method direction
     * @param {KICK.math.vec3} vec origin vec3
     * @param {KICK.math.vec3} vec2 vec3 to point to
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.direction = function(vec, vec2, dest) {
        if(!dest) { dest = vec; }

        var x = vec[0] - vec2[0];
        var y = vec[1] - vec2[1];
        var z = vec[2] - vec2[2];

        var len = Math.sqrt(x*x + y*y + z*z);
        if (!len) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            return dest;
        }

        len = 1 / len;
        dest[0] = x * len;
        dest[1] = y * len;
        dest[2] = z * len;
        return dest;
    };

    /**
     * Performs a linear interpolation between two vec3
     * @method lerp
     * @param {KICK.math.vec3} vec first vector
     * @param {KICK.math.vec3} vec2 second vector
     * @param {Number} lerp interpolation amount between the two inputs
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    vec3.lerp = function(vec, vec2, lerp, dest){
        if(!dest) { dest = vec; }

        dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
        dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
        dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);

        return dest;
    };

    /**
     * Converts the spherical coordinates (in radians) to carterian coordinates.<br>
     * Spherical coordinates are mapped so vec[0] is radius, vec[1] is polar and vec[2] is elevation
     * @method sphericalToCarterian
     * @param {KICK.math.vec3} spherical spherical coordinates
     * @param {KICK.math.vec3} cartesian optionally if not specified a new vec3 is returned
     * @return {KICK.math.vec3} position in cartesian angles
     */
    vec3.sphericalToCarterian = function(spherical, cartesian){
        var radius = spherical[0],
            polar = -spherical[1],
            elevation = spherical[2],
            a = radius * Math.cos(elevation);
        if (!cartesian){
            cartesian = vec3.create();
        }
        cartesian[0] = a * Math.cos(polar);
        cartesian[1] = radius * Math.sin(elevation);
        cartesian[2] = a * Math.sin(polar);
        return cartesian;
    };

    /**
     * Converts from cartesian coordinates to spherical coordinates (in radians)<br>
     * Spherical coordinates are mapped so vec[0] is radius, vec[1] is polar and vec[2] is elevation
     * @method cartesianToSpherical
     * @param {KICK.math.vec3} cartesian
     * @param {KICK.math.vec3} spherical Optional
     * @return {KICK.math.vec3}
     */
    vec3.cartesianToSpherical = function(cartesian, spherical){
        var x = cartesian[0],
            y = cartesian[1],
            z = cartesian[2],
            sphericalX;
        if (x == 0)
            x = KICK.core.Constants._EPSILON;
        if (!spherical){
            spherical = vec3.create();
        }

        spherical[0] = sphericalX = Math.sqrt(x*x+y*y+z*z);
        spherical[1] = -Math.atan(z/x);
        if (x < 0){
            spherical[1] += Math.PI;
        }
        spherical[2] = Math.asin(y/sphericalX);
        return spherical;
    };

    /**
     * Returns a string representation of a vector
     * @method str
     * @param {KICK.math.vec3} vec vec3 to represent as a string
     * @return {String} string representation of vec
     */
    vec3.str = function(vec) {
        return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']';
    };


    /////////////////////////////////////////
    /**
     * vec4 - 4 Dimensional Vector<br>
     * Note: To perform vec3 functions on vec4, simply call the vec3 functions<br>
     * @class vec4
     * @namespace KICK.math
     */
    math.vec4 = vec4;

    /**
     * Wraps a Float32Array with multiple vec4 arrays. For instance if you have colors defined in a single
     * Float32Array, but need to do vector operations on the elements of the array, instead of copying data out of the
     * Float32Array, wrapArray will give you access to the same data.
     * <br>
     * Example:<br>
     * <pre class="brush: js">
     * function avarageColor(float32arrayColor){
     *     var sum = vec4.create(),
     *         wrappedArray = vec4.wrapArray(float32arrayColor),
     *         weigth = 1.0/wrappedArray;
     *     for (var i=0;i  &lt; wrappedArray.length;i++){
     *         vec4.add(sum,wrappedArray[i]);
     *     }
     *     return vec4.multiply(sum,[weigth,weigth,weigth,weigth]);
     * }
     * </pre>
     * @method wrapArray
     * @param {Float32Array} array
     * @return {Array[KICK.math.vec4]} 
     */
    vec4.wrapArray = function(array){
        return wrapArray(array,4);
    };

    /**
     * Create a continuous array in memory mapped to vec4.
     *
     * Example
     * <pre class="brush: js">
     * var ref = {};
     * var v = KICK.math.vec4.array(2,ref);
     * v[1][1] = 1;
     * ref.mem[5] == v[1][1];
     * </pre>
     * Will be layed out like this:
     * <pre class="brush: js">
     * [vec4][vec4] = [0][1][2][3][4][5][6][7]
     * </pre>
     * @method array
     * @param {Number} count Number of vec 3 to be layed out in memory
     * @param {Object} ref Optional, if set a memory reference is set to ref.mem
     * @return {KICK.math.vec3} New vec3
     */
    vec4.array = function(count,ref){
        var memory = new Float32Array(count*4);
        if (ref){
            ref.mem = memory;
        }
        return vec4.wrapArray(memory);
    };

    /**
     * Creates a new instance of a vec4 using the default array type<br>
     * Any javascript array containing at least 4 numeric elements can serve as a vec4
     * @method create
     * @param {Array[Number]} vec Optional, vec4 containing values to initialize with
     * @return {KICK.math.vec4} New vec4
     */
    vec4.create = function(vec) {
        var dest = new Float32Array(4);

        if(vec) {
            dest[0] = vec[0];
            dest[1] = vec[1];
            dest[2] = vec[2];
            dest[3] = vec[3];
        }

        return dest;
    };

    /**
     * Copies the values of one vec4 to another
     * @method set
     * @param {KICK.math.vec4} vec vec4 containing values to copy
     * @param {KICK.math.vec4} dest vec4 receiving copied values
     * @return {KICK.math.vec4} dest
     */
    vec4.set = function(vec, dest) {
        dest[0] = vec[0];
        dest[1] = vec[1];
        dest[2] = vec[2];
        dest[3] = vec[3];

        return dest;
    };

    /**
     * Performs a vector addition
     * @method add
     * @param {KICK.math.vec4} vec  first operand
     * @param {KICK.math.vec4} vec2  second operand
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     */
    vec4.add = function(vec, vec2, dest) {
        if(!dest || vec == dest) {
            vec[0] += vec2[0];
            vec[1] += vec2[1];
            vec[2] += vec2[2];
            vec[3] += vec2[3];
            return vec;
        }

        dest[0] = vec[0] + vec2[0];
        dest[1] = vec[1] + vec2[1];
        dest[2] = vec[2] + vec2[2];
        dest[3] = vec[3] + vec2[3];
        return dest;
    };

    /**
     * Performs a vector subtraction
     * @method subtract
     * @param {KICK.math.vec4} vec first operand
     * @param {KICK.math.vec4} vec2 second operand
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     */
    vec4.subtract = function(vec, vec2, dest) {
        if(!dest || vec == dest) {
            vec[0] -= vec2[0];
            vec[1] -= vec2[1];
            vec[2] -= vec2[2];
            vec[3] -= vec2[3];
            return vec;
        }

        dest[0] = vec[0] - vec2[0];
        dest[1] = vec[1] - vec2[1];
        dest[2] = vec[2] - vec2[2];
        dest[3] = vec[3] - vec2[3];
        return dest;
    };

    /**
     * Performs a vector multiplication
     * @method multiply
     * @param {KICK.math.vec4} vec first operand
     * @param {KICK.math.vec4} vec2 second operand
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     */
    vec4.multiply = function(vec, vec2, dest) {
        if(!dest || vec == dest) {
            vec[0] *= vec2[0];
            vec[1] *= vec2[1];
            vec[2] *= vec2[2];
            vec[3] *= vec2[3];
            return vec;
        }

        dest[0] = vec[0] * vec2[0];
        dest[1] = vec[1] * vec2[1];
        dest[2] = vec[2] * vec2[2];
        dest[3] = vec[3] * vec2[3];
        return dest;
    };

    /**
     * Negates the components of a vec4
     * @method negate
     * @param {KICK.math.vec4} vec vec4 to negate
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     */
    vec4.negate = function(vec, dest) {
        if(!dest) { dest = vec; }

        dest[0] = -vec[0];
        dest[1] = -vec[1];
        dest[2] = -vec[2];
        dest[3] = -vec[3];
        return dest;
    };

    /**
     * Multiplies the components of a vec4 by a scalar value
     * @method scale
     * @param {KICK.math.vec4} vec vec4 to scale
     * @param {Number} val Numeric value to scale by
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     */
    vec4.scale = function(vec, val, dest) {
        if(!dest || vec == dest) {
            vec[0] *= val;
            vec[1] *= val;
            vec[2] *= val;
            vec[3] *= val;
            return vec;
        }

        dest[0] = vec[0]*val;
        dest[1] = vec[1]*val;
        dest[2] = vec[2]*val;
        dest[3] = vec[2]*val;
        return dest;
    };

    /**
     * Returns a string representation of a vector
     * @method str
     * @param {KICK.math.vec4} vec vec4 to represent as a string
     * @return {String} string representation of vec
     */
    vec4.str = function(vec) {
        return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2]+ ', ' + vec[3] + ']';
    };
    /////////////////////////////////////////

    /**
     * mat3 - 3x3 Matrix
     * @class mat3
     * @namespace KICK.math
     */
    math.mat3 = mat3;

    /**
     * Creates a new instance of a mat3 using the default array type<br>
     * Any javascript array containing at least 9 numeric elements can serve as a mat3
     * @method create
     * @param {Array[Number]} mat Optional, mat3 containing values to initialize with
     * @return {KICK.math.mat3} New mat3
     */
    mat3.create = function(mat) {
        var dest = new Float32Array(9);

        if(mat) {
            dest[0] = mat[0];
            dest[1] = mat[1];
            dest[2] = mat[2];
            dest[3] = mat[3];
            dest[4] = mat[4];
            dest[5] = mat[5];
            dest[6] = mat[6];
            dest[7] = mat[7];
            dest[8] = mat[8];
        }

        return dest;
    };

    /**
     * Copies the values of one mat3 to another
     * @method set
     * @param {KICK.math.mat3} mat mat3 containing values to copy
     * @param {KICK.math.mat3} dest mat3 receiving copied values
     * @return {KICK.math.mat3} dest
     */
    mat3.set = function(mat, dest) {
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];
        dest[8] = mat[8];
        return dest;
    };

    /**
     * Sets a mat3 to an identity matrix
     * @method identity
     * @param {KICK.math.mat3} dest mat3 to set
     * @return {KICK.math.mat3} dest
     */
    mat3.identity = function(dest) {
        dest[0] = 1;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 1;
        dest[5] = 0;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 1;
        return dest;
    };

    /**
     * Transposes a mat3 (flips the values over the diagonal)
     * @method transpose
     * @param {KICK.math.mat3} mat mat3 to transpose
     * @param {KICK.math.mat3} dest Optional, mat3 receiving transposed values. If not specified result is written to mat
     * @return {KICK.math.mat3} dest is specified, mat otherwise
     */
    mat3.transpose = function(mat, dest) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if(!dest || mat == dest) {
            var a01 = mat[1], a02 = mat[2];
            var a12 = mat[5];

            mat[1] = mat[3];
            mat[2] = mat[6];
            mat[3] = a01;
            mat[5] = mat[7];
            mat[6] = a02;
            mat[7] = a12;
            return mat;
        }

        dest[0] = mat[0];
        dest[1] = mat[3];
        dest[2] = mat[6];
        dest[3] = mat[1];
        dest[4] = mat[4];
        dest[5] = mat[7];
        dest[6] = mat[2];
        dest[7] = mat[5];
        dest[8] = mat[8];
        return dest;
    };

    /**
     * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
     * @method toMat4
     * @param {KICK.math.mat3} mat mat3 containing values to copy
     * @param {KICK.math.mat4} dest Optional, mat4 receiving copied values
     * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
     */
    mat3.toMat4 = function(mat, dest) {
        if(!dest) { dest = mat4.create(); }

        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = 0;

        dest[4] = mat[3];
        dest[5] = mat[4];
        dest[6] = mat[5];
        dest[7] = 0;

        dest[8] = mat[6];
        dest[9] = mat[7];
        dest[10] = mat[8];
        dest[11] = 0;

        dest[12] = 0;
        dest[13] = 0;
        dest[14] = 0;
        dest[15] = 1;

        return dest;
    }

    /**
     * Returns a string representation of a mat3
     * @method str
     * @param {KICK.math.mat3} mat mat3 to represent as a string
     * @return {String} string representation of mat
     */
    mat3.str = function(mat) {
        return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] +
            ', ' + mat[3] + ', '+ mat[4] + ', ' + mat[5] +
            ', ' + mat[6] + ', ' + mat[7] + ', '+ mat[8] + ']';
    };

    /**
     * Returns a string representation of a mat3 printed as a 4x4 matrix (on 3 lines)
     * @method strPretty
     * @param {KICK.math.mat3} mat mat3 to represent as a string
     * @return {String} string representation of mat
     */
    mat3.strPretty = function(mat) {
        return '[' + mat[0] + ', ' + mat[3] + ', ' + mat[6] + '\n' +
            ', ' + mat[1] + ', '+ mat[4] + ', ' + mat[7] + '\n' +
            ', ' + mat[2] + ', ' + mat[5] + ', '+ mat[8] + ']';
    };

    /**
     * mat4 - 4x4 Matrix<br>
     * @class mat4
     * @namespace KICK.math
     */
    math.mat4 = mat4;

    /**
     * Creates a new instance of a mat4 using the default array type<br>
     * Any javascript array containing at least 16 numeric elements can serve as a mat4
     * @method create
     * @param {Array[Number]} mat Optional, mat4 containing values to initialize with
     * @return {KICK.math.mat4} New mat4
     */
    mat4.create = function(mat) {
        var dest = new Float32Array(16);

        if(mat) {
            dest[0] = mat[0];
            dest[1] = mat[1];
            dest[2] = mat[2];
            dest[3] = mat[3];
            dest[4] = mat[4];
            dest[5] = mat[5];
            dest[6] = mat[6];
            dest[7] = mat[7];
            dest[8] = mat[8];
            dest[9] = mat[9];
            dest[10] = mat[10];
            dest[11] = mat[11];
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        }

        return dest;
    };

    /**
     * Copies the values of one mat4 to another
     * @method set
     * @param {KICK.math.mat4} mat mat4 containing values to copy
     * @param {KICK.math.mat4} dest mat4 receiving copied values
     * @return {KICK.math.mat4} dest
     */
    mat4.set = function(mat, dest) {
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];
        dest[8] = mat[8];
        dest[9] = mat[9];
        dest[10] = mat[10];
        dest[11] = mat[11];
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
        return dest;
    };

    /**
     * Set translate, rotate, scale
     * @method setTRS
     * @param {KICK.math.vec3} translate
     * @param {KICK.math.quat4} rotateQuat
     * @param {KICK.math.vec3} scale
     * @param {KICK.math.mat4} dest Optinal
     * @return {KICK.math.mat4} dest if specified mat4 otherwise
     */
    mat4.setTRS = function(translate, rotateQuat, scale, dest){
        if(!dest) { dest = mat4.create(); }
        // todo: optimize this code
        mat4.identity(dest);
        mat4.translate(dest, translate);
        mat4.multiply(dest,quat4.toMat4(rotateQuat));
        mat4.scale(dest, scale);
        return dest;
    }

    /**
     * Set the inverse of translate, rotate, scale
     * @method setTRSInverse
     * @param {KICK.math.vec3} translate
     * @param {KICK.math.quat4} rotateQuat
     * @param {KICK.math.vec3} scale
     * @param {KICK.math.mat4} dest Optinal
     * @return {KICK.math.mat4} dest if specified mat4 otherwise
     */
    mat4.setTRSInverse = function(translate, rotateQuat, scale, dest){
        if(!dest) { dest = mat4.create(); }
        // todo: optimize this code
        mat4.identity(dest);
        mat4.scale(dest, [1/scale[0],1/scale[1],1/scale[2]]);
        mat4.multiply(dest,quat4.toMat4(quat4.inverse(rotateQuat)));
        mat4.translate(dest, [-translate[0],-translate[1],-translate[2]]);
        return dest;
    }

    /**
     * Sets a mat4 to an identity matrix
     * @method identity
     * @param {KICK.math.mat4} dest mat4 to set
     * @return {KICK.math.mat4} dest
     */
    mat4.identity = function(dest) {
        dest[0] = 1;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = 1;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 0;
        dest[9] = 0;
        dest[10] = 1;
        dest[11] = 0;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = 0;
        dest[15] = 1;
        return dest;
    };

    /**
     * Transposes a mat4 (flips the values over the diagonal)
     * @method transpose
     * @param {KICK.math.mat4} mat mat4 to transpose
     * @param {KICK.math.mat4} dest Optional, mat4 receiving transposed values. If not specified result is written to mat
     * @return {KICK.math.mat4} dest is specified, mat otherwise
     */
    mat4.transpose = function(mat, dest) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if(!dest || mat == dest) {
            var a01 = mat[1], a02 = mat[2], a03 = mat[3];
            var a12 = mat[6], a13 = mat[7];
            var a23 = mat[11];

            mat[1] = mat[4];
            mat[2] = mat[8];
            mat[3] = mat[12];
            mat[4] = a01;
            mat[6] = mat[9];
            mat[7] = mat[13];
            mat[8] = a02;
            mat[9] = a12;
            mat[11] = mat[14];
            mat[12] = a03;
            mat[13] = a13;
            mat[14] = a23;
            return mat;
        }

        dest[0] = mat[0];
        dest[1] = mat[4];
        dest[2] = mat[8];
        dest[3] = mat[12];
        dest[4] = mat[1];
        dest[5] = mat[5];
        dest[6] = mat[9];
        dest[7] = mat[13];
        dest[8] = mat[2];
        dest[9] = mat[6];
        dest[10] = mat[10];
        dest[11] = mat[14];
        dest[12] = mat[3];
        dest[13] = mat[7];
        dest[14] = mat[11];
        dest[15] = mat[15];
        return dest;
    };

    /**
     * Calculates the determinant of a mat4
     * @method determinant
     * @param {KICK.math.mat4} mat mat4 to calculate determinant of
     * @return {Number} determinant of mat
     */
    mat4.determinant = function(mat) {
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
        var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

        return  a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
            a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
            a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
            a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
            a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
            a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
    };

    /**
     * Calculates the inverse matrix of a mat4
     * @method inverse
     * @param {KICK.math.mat4} mat mat4 to calculate inverse of
     * @param {KICK.math.mat4} dest Optional, mat4 receiving inverse matrix. If not specified result is written to mat
     * @return {KICK.math.mat4} dest is specified, mat otherwise
     */
    mat4.inverse = function(mat, dest) {
        if(!dest) { dest = mat; }

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
        var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

        var b00 = a00*a11 - a01*a10;
        var b01 = a00*a12 - a02*a10;
        var b02 = a00*a13 - a03*a10;
        var b03 = a01*a12 - a02*a11;
        var b04 = a01*a13 - a03*a11;
        var b05 = a02*a13 - a03*a12;
        var b06 = a20*a31 - a21*a30;
        var b07 = a20*a32 - a22*a30;
        var b08 = a20*a33 - a23*a30;
        var b09 = a21*a32 - a22*a31;
        var b10 = a21*a33 - a23*a31;
        var b11 = a22*a33 - a23*a32;

        // Calculate the determinant (inlined to avoid double-caching)
        var invDet = 1/(b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);

        dest[0] = (a11*b11 - a12*b10 + a13*b09)*invDet;
        dest[1] = (-a01*b11 + a02*b10 - a03*b09)*invDet;
        dest[2] = (a31*b05 - a32*b04 + a33*b03)*invDet;
        dest[3] = (-a21*b05 + a22*b04 - a23*b03)*invDet;
        dest[4] = (-a10*b11 + a12*b08 - a13*b07)*invDet;
        dest[5] = (a00*b11 - a02*b08 + a03*b07)*invDet;
        dest[6] = (-a30*b05 + a32*b02 - a33*b01)*invDet;
        dest[7] = (a20*b05 - a22*b02 + a23*b01)*invDet;
        dest[8] = (a10*b10 - a11*b08 + a13*b06)*invDet;
        dest[9] = (-a00*b10 + a01*b08 - a03*b06)*invDet;
        dest[10] = (a30*b04 - a31*b02 + a33*b00)*invDet;
        dest[11] = (-a20*b04 + a21*b02 - a23*b00)*invDet;
        dest[12] = (-a10*b09 + a11*b07 - a12*b06)*invDet;
        dest[13] = (a00*b09 - a01*b07 + a02*b06)*invDet;
        dest[14] = (-a30*b03 + a31*b01 - a32*b00)*invDet;
        dest[15] = (a20*b03 - a21*b01 + a22*b00)*invDet;

        return dest;
    };

    /**
     * Copies the upper 3x3 elements of a mat4 into another mat4
     * @method toRotationMat
     * @param {KICK.math.mat4} mat mat4 containing values to copy
     * @param {KICK.math.mat4} dest Optional, mat4 receiving copied values
     * @return {KICK.math.mat4} dest is specified, a new mat4 otherwise
     */
    mat4.toRotationMat = function(mat, dest) {
        if(!dest) { dest = mat4.create(); }

        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];
        dest[8] = mat[8];
        dest[9] = mat[9];
        dest[10] = mat[10];
        dest[11] = mat[11];
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = 0;
        dest[15] = 1;

        return dest;
    };

    /**
     * Copies the upper 3x3 elements of a mat4 into a mat3
     * @method toMat3
     * @param {KICK.math.mat4} mat mat4 containing values to copy
     * @param {KICK.math.mat3} dest Optional, mat3 receiving copied values
     * return {KICK.math.mat3} dest is specified, a new mat3 otherwise
     */
    mat4.toMat3 = function(mat, dest) {
        if(!dest) { dest = mat3.create(); }

        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[4];
        dest[4] = mat[5];
        dest[5] = mat[6];
        dest[6] = mat[8];
        dest[7] = mat[9];
        dest[8] = mat[10];

        return dest;
    };

    /**
     * Calculates the normal matrix (that is the transpose of the inverse of the upper 3x3 elements of a mat4) and
     * copies the result into a mat3<br>
     * @method toNormalMat3
     * @param {KICK.math.mat4} mat mat4 containing values to tranpose, invert and copy
     * @param {KICK.math.mat3} dest Optional, mat3 receiving values
     * @return {KICK.math.mat3} dest is specified, a new mat3 otherwise
     */
    mat4.toNormalMat3 = function(mat, dest){
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2],
            a10 = mat[4], a11 = mat[5], a12 = mat[6],
            a20 = mat[8], a21 = mat[9], a22 = mat[10];

        var b01 = a22*a11-a12*a21;
        var b11 = -a22*a10+a12*a20;
        var b21 = a21*a10-a11*a20;

        var d = a00*b01 + a01*b11 + a02*b21;
        if (!d) { return null; }
        var id = 1/d;

        if(!dest) { dest = mat3.create(); }

        dest[0] = b01*id;
        dest[3] = (-a22*a01 + a02*a21)*id;
        dest[6] = (a12*a01 - a02*a11)*id;

        dest[1] = b11*id;
        dest[4] = (a22*a00 - a02*a20)*id;
        dest[7] = (-a12*a00 + a02*a10)*id;

        dest[2] = b21*id;
        dest[5] = (-a21*a00 + a01*a20)*id;
        dest[8] = (a11*a00 - a01*a10)*id;

        return dest;
    };

    /**
     * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3<br>
     * The resulting matrix is useful for calculating transformed normals
     * @method toInverseMat3
     * @param {KICK.math.mat4} mat mat4 containing values to invert and copy
     * @param {KICK.math.mat3} dest Optional, mat3 receiving values
     * @return {KICK.math.mat3} dest is specified, a new mat3 otherwise
     */
    mat4.toInverseMat3 = function(mat, dest) {
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10];

        var b01 = a22*a11-a12*a21;
        var b11 = -a22*a10+a12*a20;
        var b21 = a21*a10-a11*a20;

        var d = a00*b01 + a01*b11 + a02*b21;
        if (!d) { return null; }
        var id = 1/d;

        if(!dest) { dest = mat3.create(); }

        dest[0] = b01*id;
        dest[1] = (-a22*a01 + a02*a21)*id;
        dest[2] = (a12*a01 - a02*a11)*id;
        dest[3] = b11*id;
        dest[4] = (a22*a00 - a02*a20)*id;
        dest[5] = (-a12*a00 + a02*a10)*id;
        dest[6] = b21*id;
        dest[7] = (-a21*a00 + a01*a20)*id;
        dest[8] = (a11*a00 - a01*a10)*id;

        return dest;
    };

    /**
     * Performs a matrix multiplication
     * @method multiply
     * @param {KICK.math.mat4} mat first operand
     * @param {KICK.math.mat4} mat2 second operand
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     */
    mat4.multiply = function(mat, mat2, dest) {
        if(!dest) { dest = mat }

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
        var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

        var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
        var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
        var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
        var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];

        dest[0] = b00*a00 + b01*a10 + b02*a20 + b03*a30;
        dest[1] = b00*a01 + b01*a11 + b02*a21 + b03*a31;
        dest[2] = b00*a02 + b01*a12 + b02*a22 + b03*a32;
        dest[3] = b00*a03 + b01*a13 + b02*a23 + b03*a33;
        dest[4] = b10*a00 + b11*a10 + b12*a20 + b13*a30;
        dest[5] = b10*a01 + b11*a11 + b12*a21 + b13*a31;
        dest[6] = b10*a02 + b11*a12 + b12*a22 + b13*a32;
        dest[7] = b10*a03 + b11*a13 + b12*a23 + b13*a33;
        dest[8] = b20*a00 + b21*a10 + b22*a20 + b23*a30;
        dest[9] = b20*a01 + b21*a11 + b22*a21 + b23*a31;
        dest[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
        dest[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
        dest[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
        dest[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
        dest[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
        dest[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;

        return dest;
    };

    /**
     * Transforms a vec3 with the given matrix<br>
     * 4th vector component is implicitly '1'
     * @method multiplyVec3
     * @param {KICK.math.mat4} mat mat4 to transform the vector with
     * @param {KICK.math.vec3} vec vec3 to transform
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    mat4.multiplyVec3 = function(mat, vec, dest) {
        if(!dest) { dest = vec }

        var x = vec[0], y = vec[1], z = vec[2];

        dest[0] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
        dest[1] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
        dest[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];

        return dest;
    };

    /**
     * Transforms a vec4 with the given matrix
     * @method multiplyVec4
     * @param {KICK.math.mat4} mat mat4 to transform the vector with
     * @param {KICK.math.vec4} vec vec4 to transform
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     */
    mat4.multiplyVec4 = function(mat, vec, dest) {
        if(!dest) { dest = vec }

        var x = vec[0], y = vec[1], z = vec[2], w = vec[3];

        dest[0] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12]*w;
        dest[1] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13]*w;
        dest[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14]*w;
        dest[3] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15]*w;

        return dest;
    };

    /**
     * Translates a matrix by the given vector
     * @method translate
     * @param {KICK.math.mat4} mat mat4 to translate
     * @param {KICK.math.vec3} vec vec3 specifying the translation
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     */
    mat4.translate = function(mat, vec, dest) {
        var x = vec[0], y = vec[1], z = vec[2];

        if(!dest || mat == dest) {
            mat[12] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
            mat[13] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
            mat[14] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
            mat[15] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15];
            return mat;
        }

        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

        dest[0] = a00;
        dest[1] = a01;
        dest[2] = a02;
        dest[3] = a03;
        dest[4] = a10;
        dest[5] = a11;
        dest[6] = a12;
        dest[7] = a13;
        dest[8] = a20;
        dest[9] = a21;
        dest[10] = a22;
        dest[11] = a23;

        dest[12] = a00*x + a10*y + a20*z + mat[12];
        dest[13] = a01*x + a11*y + a21*z + mat[13];
        dest[14] = a02*x + a12*y + a22*z + mat[14];
        dest[15] = a03*x + a13*y + a23*z + mat[15];
        return dest;
    };

    /**
     * Scales a matrix by the given vector
     * @method scale
     * @param {KICK.math.mat4} mat mat4 to scale
     * @param {KICK.math.vec3} vec vec3 specifying the scale for each axis
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     */
    mat4.scale = function(mat, vec, dest) {
        var x = vec[0], y = vec[1], z = vec[2];

        if(!dest || mat == dest) {
            mat[0] *= x;
            mat[1] *= x;
            mat[2] *= x;
            mat[3] *= x;
            mat[4] *= y;
            mat[5] *= y;
            mat[6] *= y;
            mat[7] *= y;
            mat[8] *= z;
            mat[9] *= z;
            mat[10] *= z;
            mat[11] *= z;
            return mat;
        }

        dest[0] = mat[0]*x;
        dest[1] = mat[1]*x;
        dest[2] = mat[2]*x;
        dest[3] = mat[3]*x;
        dest[4] = mat[4]*y;
        dest[5] = mat[5]*y;
        dest[6] = mat[6]*y;
        dest[7] = mat[7]*y;
        dest[8] = mat[8]*z;
        dest[9] = mat[9]*z;
        dest[10] = mat[10]*z;
        dest[11] = mat[11]*z;
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
        return dest;
    };

    /**
     * Rotates a matrix by three rotations given in eulers angles<br>
     * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
     * @method rotateEuler
     * @param {KICK.math.mat4} mat mat4 to rotate
     * @param {KICK.math.vec3} angle angle (in degrees) to rotate
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     */
    mat4.rotateEuler = function(mat, euler, dest) {
        var degreeToRadian = KICK.core.Constants._DEGREE_TO_RADIAN;
        if (dest) {
            mat4.set(mat,dest);
            mat = dest;
        }

        // todo: Optimized code!!!
        if (euler[2] !== 0){
            mat4.rotateZ(mat, euler[2]*degreeToRadian);
        }
        if (euler[1] !== 0){
            mat4.rotateY(mat, euler[1]*degreeToRadian);
        }
        if (euler[0] !== 0){
            mat4.rotateX(mat, euler[0]*degreeToRadian);
        }
        return mat;
    };

    /**
     * Rotates a matrix by the given angle around the specified axis<br>
     * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for
     * performance
     * @method rotate
     * @param {KICK.math.mat4} mat mat4 to rotate
     * @param {Number} angle angle (in radians) to rotate
     * @param {KICK.math.vec3} axis vec3 representing the axis to rotate around
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     */
    mat4.rotate = function(mat, angle, axis, dest) {
        var x = axis[0], y = axis[1], z = axis[2];
        var len = Math.sqrt(x*x + y*y + z*z);
        if (!len) { return null; }
        if (len != 1) {
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
        }

        var s = Math.sin(angle);
        var c = Math.cos(angle);
        var t = 1-c;

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

        // Construct the elements of the rotation matrix
        var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
        var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
        var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;

        if(!dest) {
            dest = mat
        } else if(mat != dest) { // If the source and destination differ, copy the unchanged last row
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        }

        // Perform rotation-specific matrix multiplication
        dest[0] = a00*b00 + a10*b01 + a20*b02;
        dest[1] = a01*b00 + a11*b01 + a21*b02;
        dest[2] = a02*b00 + a12*b01 + a22*b02;
        dest[3] = a03*b00 + a13*b01 + a23*b02;

        dest[4] = a00*b10 + a10*b11 + a20*b12;
        dest[5] = a01*b10 + a11*b11 + a21*b12;
        dest[6] = a02*b10 + a12*b11 + a22*b12;
        dest[7] = a03*b10 + a13*b11 + a23*b12;

        dest[8] = a00*b20 + a10*b21 + a20*b22;
        dest[9] = a01*b20 + a11*b21 + a21*b22;
        dest[10] = a02*b20 + a12*b21 + a22*b22;
        dest[11] = a03*b20 + a13*b21 + a23*b22;
        return dest;
    };

    /**
     * Rotates a matrix by the given angle around the X axis
     * @method rotateX
     * @param {KICK.math.mat4} mat mat4 to rotate
     * @param {Number} angle angle (in radians) to rotate
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     */
    mat4.rotateX = function(mat, angle, dest) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);

        // Cache the matrix values (makes for huge speed increases!)
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

        if(!dest) {
            dest = mat
        } else if(mat != dest) { // If the source and destination differ, copy the unchanged rows
            dest[0] = mat[0];
            dest[1] = mat[1];
            dest[2] = mat[2];
            dest[3] = mat[3];

            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        }

        // Perform axis-specific matrix multiplication
        dest[4] = a10*c + a20*s;
        dest[5] = a11*c + a21*s;
        dest[6] = a12*c + a22*s;
        dest[7] = a13*c + a23*s;

        dest[8] = a10*-s + a20*c;
        dest[9] = a11*-s + a21*c;
        dest[10] = a12*-s + a22*c;
        dest[11] = a13*-s + a23*c;
        return dest;
    };

    /**
     * Rotates a matrix by the given angle around the Y axis
     * @method rotateY
     * @param {KICK.math.mat4} mat mat4 to rotate
     * @param {Number} angle angle (in radians) to rotate
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     */
    mat4.rotateY = function(mat, angle, dest) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

        if(!dest) {
            dest = mat
        } else if(mat != dest) { // If the source and destination differ, copy the unchanged rows
            dest[4] = mat[4];
            dest[5] = mat[5];
            dest[6] = mat[6];
            dest[7] = mat[7];

            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        }

        // Perform axis-specific matrix multiplication
        dest[0] = a00*c + a20*-s;
        dest[1] = a01*c + a21*-s;
        dest[2] = a02*c + a22*-s;
        dest[3] = a03*c + a23*-s;

        dest[8] = a00*s + a20*c;
        dest[9] = a01*s + a21*c;
        dest[10] = a02*s + a22*c;
        dest[11] = a03*s + a23*c;
        return dest;
    };

    /**
     * Rotates a matrix by the given angle around the Z axis
     * @method rotateZ
     * @param {KICK.math.mat4} mat mat4 to rotate
     * @param {Number} angle angle (in radians) to rotate
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     */
    mat4.rotateZ = function(mat, angle, dest) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];

        if(!dest) {
            dest = mat
        } else if(mat != dest) { // If the source and destination differ, copy the unchanged last row
            dest[8] = mat[8];
            dest[9] = mat[9];
            dest[10] = mat[10];
            dest[11] = mat[11];

            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
        }

        // Perform axis-specific matrix multiplication
        dest[0] = a00*c + a10*s;
        dest[1] = a01*c + a11*s;
        dest[2] = a02*c + a12*s;
        dest[3] = a03*c + a13*s;

        dest[4] = a00*-s + a10*c;
        dest[5] = a01*-s + a11*c;
        dest[6] = a02*-s + a12*c;
        dest[7] = a03*-s + a13*c;

        return dest;
    };

    /**
     * Generates a frustum matrix with the given bounds
     * @method frustum
     * @param {Number} left left bounds of the frustum
     * @param {Number} right right bounds of the frustum
     * @param {Number} bottom bottom bounds of the frustum
     * @param {Number} top top bounds of the frustum
     * @param {Number} near near bounds of the frustum
     * @param {Number} far far bounds of the frustum
     * @param {KICK.math.mat4} dest Optional, mat4 frustum matrix will be written into
     * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
     */
    mat4.frustum = function(left, right, bottom, top, near, far, dest) {
        if(!dest) { dest = mat4.create(); }
        var rl = (right - left);
        var tb = (top - bottom);
        var fn = (far - near);
        dest[0] = (near*2) / rl;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = (near*2) / tb;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = (right + left) / rl;
        dest[9] = (top + bottom) / tb;
        dest[10] = -(far + near) / fn;
        dest[11] = -1;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = -(far*near*2) / fn;
        dest[15] = 0;
        return dest;
    };

    /**
     * Generates a perspective projection matrix with the given bounds
     * @method perspective
     * @param {Number} fovy vertical field of view
     * @param {Number} aspect aspect ratio. typically viewport width/height
     * @param {Number} near near bounds of the frustum
     * @param {Number} far far bounds of the frustum
     * @param {KICK.math.mat4} dest Optional, mat4 frustum matrix will be written into
     * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
     */
    mat4.perspective = function(fovy, aspect, near, far, dest) {
        var top = near*Math.tan(fovy*Math.PI / 360.0);
        var right = top*aspect;
        return mat4.frustum(-right, right, -top, top, near, far, dest);
    };

    /**
     * Generates a orthogonal projection matrix with the given bounds
     * @method ortho
     * @param {Number} left left bounds of the frustum
     * @param {Number} right right bounds of the frustum
     * @param {Number} bottom bottom bounds of the frustum
     * @param {Number} top top bounds of the frustum
     * @param {Number} near near bounds of the frustum
     * @param {Number} far far bounds of the frustum
     * @param {KICK.math.mat4} dest Optional, mat4 frustum matrix will be written into
     * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
     */
    mat4.ortho = function(left, right, bottom, top, near, far, dest) {
        if(!dest) { dest = mat4.create(); }
        var rl = (right - left);
        var tb = (top - bottom);
        var fn = (far - near);
        dest[0] = 2 / rl;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = 2 / tb;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 0;
        dest[9] = 0;
        dest[10] = -2 / fn;
        dest[11] = 0;
        dest[12] = -(left + right) / rl;
        dest[13] = -(top + bottom) / tb;
        dest[14] = -(far + near) / fn;
        dest[15] = 1;
        return dest;
    };

    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis
     * @method lookAt
     * @param {KICK.math.vec3} eye position of the viewer
     * @param {KICK.math.vec3} center point the viewer is looking at
     * @param {KICK.math.vec3} up vec3 pointing "up"
     * @param {KICK.math.mat4} dest Optional, mat4 frustum matrix will be written into
     * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
     */
    mat4.lookAt = function(eye, center, up, dest) {
        if(!dest) { dest = mat4.create(); }

        var eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2],
            centerx = center[0],
            centery = center[1],
            centerz = center[2];

        if (eyex == centerx && eyey == centery && eyez == centerz) {
            return mat4.identity(dest);
        }

        var z0,z1,z2,x0,x1,x2,y0,y1,y2,len;

        //vec3.direction(eye, center, z);
        z0 = eyex - center[0];
        z1 = eyey - center[1];
        z2 = eyez - center[2];

        // normalize (no check needed for 0 because of early return)
        len = 1/Math.sqrt(z0*z0 + z1*z1 + z2*z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        //vec3.normalize(vec3.cross(up, z, x));
        x0 = upy*z2 - upz*z1;
        x1 = upz*z0 - upx*z2;
        x2 = upx*z1 - upy*z0;
        len = Math.sqrt(x0*x0 + x1*x1 + x2*x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1/len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        };

        //vec3.normalize(vec3.cross(z, x, y));
        y0 = z1*x2 - z2*x1;
        y1 = z2*x0 - z0*x2;
        y2 = z0*x1 - z1*x0;

        len = Math.sqrt(y0*y0 + y1*y1 + y2*y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1/len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        dest[0] = x0;
        dest[1] = y0;
        dest[2] = z0;
        dest[3] = 0;
        dest[4] = x1;
        dest[5] = y1;
        dest[6] = z1;
        dest[7] = 0;
        dest[8] = x2;
        dest[9] = y2;
        dest[10] = z2;
        dest[11] = 0;
        dest[12] = -(x0*eyex + x1*eyey + x2*eyez);
        dest[13] = -(y0*eyex + y1*eyey + y2*eyez);
        dest[14] = -(z0*eyex + z1*eyey + z2*eyez);
        dest[15] = 1;

        return dest;
    };

    /**
     * Returns a string representation of a mat4
     * @method str
     * @param {KICK.math.mat4} mat mat4 to represent as a string
     * @return {String} string representation of mat
     */
    mat4.str = function(mat) {
        return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] +
            ', '+ mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] +
            ', '+ mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] +
            ', '+ mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
    };

    /**
     * Returns a string representation of a mat4 printed as a 4x4 matrix (on 4 lines)
     * @method strPretty
     * @param {KICK.math.mat4} mat mat4 to represent as a string
     * @return {String} string representation of mat
     */
    mat4.strPretty = function(mat) {
        return '[' + mat[0] + ', ' + mat[4] + ', ' + mat[8] + ', ' + mat[12] + '\n' +
            ', '+ mat[1] + ', ' + mat[5] + ', ' + mat[9] + ', ' + mat[13] +'\n' +
            ', '+ mat[2] + ', ' + mat[6] + ', ' + mat[10] + ', ' + mat[14] +'\n' +
            ', '+ mat[3] + ', ' + mat[7] + ', ' + mat[11] + ', ' + mat[15] + ']';
    };

    /**
     * quat4 - Quaternions
     * @class quat4
     * @namespace KICK.math
     */
    math.quat4 = quat4;

    /**
     * Creates a new instance of a quat4 using the default array type<br>
     * Any javascript array containing at least 4 numeric elements can serve as a quat4
     * @method create
     * @param {Array[Number]} quat Optional, quat4 containing values to initialize with
     * @return {KICK.math.quat4} New quat4
     */
    quat4.create = function(quat) {
        var dest = new Float32Array(4);

        if(quat) {
            dest[0] = quat[0];
            dest[1] = quat[1];
            dest[2] = quat[2];
            dest[3] = quat[3];
        }

        return dest;
    };

    /**
     * Copies the values of one quat4 to another
     * @method set
     * @param {KICK.math.quat4} quat quat4 containing values to copy
     * @param {KICK.math.quat4} dest quat4 receiving copied values
     * @return {KICK.math.quat4} dest
     */
    quat4.set = function(quat, dest) {
        dest[0] = quat[0];
        dest[1] = quat[1];
        dest[2] = quat[2];
        dest[3] = quat[3];

        return dest;
    };

    /**
     * Calculates the W component of a quat4 from the X, Y, and Z components.<br>
     * Assumes that quaternion is 1 unit in length.<br>
     * Any existing W component will be ignored.
     * @method calculateW
     * @param {KICK.math.quat4} quat quat4 to calculate W component of
     * @param {KICK.math.quat4} dest Optional, quat4 receiving calculated values. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     */
    quat4.calculateW = function(quat, dest) {
        var x = quat[0], y = quat[1], z = quat[2];

        if(!dest || quat == dest) {
            quat[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
            return quat;
        }
        dest[0] = x;
        dest[1] = y;
        dest[2] = z;
        dest[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
        return dest;
    }

    /**
     * Calculates the inverse of a quat4
     * @method inverse
     * @param {KICK.math.quat4} quat quat4 to calculate inverse of
     * @param {KICK.math.quat4} dest Optional, quat4 receiving inverse values. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     */
    quat4.inverse = function(quat, dest) {
        if(!dest || quat == dest) {
            quat[0] *= -1;
            quat[1] *= -1;
            quat[2] *= -1;
            return quat;
        }
        dest[0] = -quat[0];
        dest[1] = -quat[1];
        dest[2] = -quat[2];
        dest[3] = quat[3];
        return dest;
    }

    /**
     * Calculates the length of a quat4
     * @method length
     * @param {KICK.math.quat4} quat quat4 to calculate length of
     * @return {Number} Length of quat
     *
     */
    quat4.length = function(quat) {
        var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
        return Math.sqrt(x*x + y*y + z*z + w*w);
    }

    /**
     * Generates a unit quaternion of the same direction as the provided quat4<br>
     * If quaternion length is 0, returns [0, 0, 0, 0]
     * @method normalize
     * @param {KICK.math.quat4} quat quat4 to normalize
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     */
    quat4.normalize = function(quat, dest) {
        if(!dest) { dest = quat; }

        var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
        var len = Math.sqrt(x*x + y*y + z*z + w*w);
        if(len == 0) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            return dest;
        }
        len = 1/len;
        dest[0] = x * len;
        dest[1] = y * len;
        dest[2] = z * len;
        dest[3] = w * len;

        return dest;
    }

    /**
     * Performs a quaternion multiplication
     * @method multiply
     * @param {KICK.math.quat4} quat first operand
     * @param {KICK.math.quat4} quat2 second operand
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     */
    quat4.multiply = function(quat, quat2, dest) {
        if(!dest) { dest = quat; }

        var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3];
        var qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];

        dest[0] = qax*qbw + qaw*qbx + qay*qbz - qaz*qby;
        dest[1] = qay*qbw + qaw*qby + qaz*qbx - qax*qbz;
        dest[2] = qaz*qbw + qaw*qbz + qax*qby - qay*qbx;
        dest[3] = qaw*qbw - qax*qbx - qay*qby - qaz*qbz;

        return dest;
    }

    /**
     * Transforms a vec3 with the given quaternion
     * @method multiplyVec3
     * @param {KICK.math.quat4} quat quat4 to transform the vector with
     * @param {KICK.math.vec3} vec vec3 to transform
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     */
    quat4.multiplyVec3 = function(quat, vec, dest) {
        if(!dest) { dest = vec; }

        var x = vec[0], y = vec[1], z = vec[2];
        var qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3];

        // calculate quat * vec
        var ix = qw*x + qy*z - qz*y;
        var iy = qw*y + qz*x - qx*z;
        var iz = qw*z + qx*y - qy*x;
        var iw = -qx*x - qy*y - qz*z;

        // calculate result * inverse quat
        dest[0] = ix*qw + iw*-qx + iy*-qz - iz*-qy;
        dest[1] = iy*qw + iw*-qy + iz*-qx - ix*-qz;
        dest[2] = iz*qw + iw*-qz + ix*-qy - iy*-qx;

        return dest;
    };

    /**
     * Set the identity to the quaternion (0,0,0,1)
     * @method identity
     * @param {KICK.math.quat4} quat Optional, quat4 to set the identity to
     * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
     */
    quat4.identity = function(dest){
        if(!dest) { dest = quat4.create(); }
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 1;
        return dest;
    };

    /**
     * Calculates a rotation represented in eulers angles (in degrees)
     * @method toEuler
     * @param {KICK.math.quat4} quat quat4 to create matrix from
     * @param {KICK.math.vec3} dest Optional, vec3  receiving operation result
     * @return {KICK.math.vec3} dest if specified, a new vec3 otherwise
     */
    quat4.toEuler = function(quat, dest) {
        var x = quat[0], y = quat[1], z = quat[2],w = quat[3],
            yy = y*y,
            radianToDegree = KICK.core.Constants._RADIAN_TO_DEGREE;

        if(!dest) { dest = vec3.create(); }

        dest[0] = Math.atan2(2*(w*x+y*z),1-2*(x*x+yy))*radianToDegree;
        dest[1] = Math.asin(2*(w*y-z*x))*radianToDegree;
        dest[2] = Math.atan2(2*(w*z+x*y),1-2*(yy+z*z))*radianToDegree;

        return dest;
    };

    /**
     * Set the rotation based on eulers angles.
     * @method angleAxis
     * @param {Number} angle rotation angle in degrees
     * @param {KICK.math.vec3} vec normalized axis
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result
     * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
     */
    quat4.angleAxis = function(angle,vec, dest) {
        var degreeToRadian = KICK.core.Constants._DEGREE_TO_RADIAN,
            angleRadiansHalf = degreeToRadian*0.5*angle,
            s = Math.sin(angleRadiansHalf);
        if(!dest) { dest = quat4.create(); }

        dest[3] = Math.cos(angleRadiansHalf);
        dest[2] = vec[2]*s;
        dest[1] = vec[1]*s;
        dest[0] = vec[0]*s;

        return dest;
    };

    /**
     * Set the rotation based on eulers angles.
     * @method setEuler
     * @param {KICK.math.vec3} vec vec3 eulers angles (degrees)
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result
     * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
     */
    quat4.setEuler = function(vec, dest) {
        var axisX = quat4.angleAxis(vec[0],[1,0,0]),
            axisY = quat4.angleAxis(vec[1],[0,1,0]),
            axisZ = quat4.angleAxis(vec[2],[0,0,1]);
        if(!dest) {
            dest = quat4.create();
        }

        // todo optimize this method. It should basically inline all three multiplications like the code below
        quat4.multiply(axisZ,axisY,dest);
        quat4.multiply(dest,axisX,dest);
        return dest;
    }


    /**
     * Calculates a 3x3 matrix from the given quat4
     * @method toMat3
     * @param {KICK.math.quat4} quat quat4 to create matrix from
     * @param {KICK.math.mat3} dest Optional, mat3 receiving operation result
     * @return {KICK.math.mat3} dest if specified, a new mat3 otherwise
     */
    quat4.toMat3 = function(quat, dest) {
        if(!dest) { dest = mat3.create(); }

        var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
            x2 = 2*x,
            y2 = 2*y,
            z2 = 2*z,
            yy = y2*y,
            zz = z2*z,
            xy = x2*y,
            wz = z2*w,
            xz = x2*z,
            wy = y2*w,
            xx = x2*x,
            yz = y2*z,
            wx = x2*w;

        dest[0] = 1 - yy - zz;
        dest[1] = xy + wz;
        dest[2] = xz - wy;

        dest[3] = xy - wz;
        dest[4] = 1 - xx - zz;
        dest[5] = yz + wx;

        dest[6] = xz + wy;
        dest[7] = yz - wx;
        dest[8] = 1 - xx - yy;

        return dest;
    }

    /**
     * Calculates a 4x4 matrix from the given quat4
     * @method toMat4
     * @param {KICK.math.quat4} quat quat4 to create matrix from
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result
     * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
     */
    quat4.toMat4 = function(quat, dest) {
        if(!dest) { dest = mat4.create(); }

        var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
            x2 = 2*x,
            y2 = 2*y,
            z2 = 2*z,
            yy = y2*y,
            zz = z2*z,
            xy = x2*y,
            wz = z2*w,
            xz = x2*z,
            wy = y2*w,
            xx = x2*x,
            yz = y2*z,
            wx = x2*w;

        dest[0] = 1 - yy - zz;
        dest[1] = xy + wz;
        dest[2] = xz - wy;
        dest[3] = 0;

        dest[4] = xy - wz;
        dest[5] = 1 - xx - zz;
        dest[6] = yz + wx;
        dest[7] = 0;

        dest[8] = xz + wy;
        dest[9] = yz - wx;
        dest[10] = 1 - xx - yy;
        dest[11] = 0;

        dest[12] = 0;
        dest[13] = 0;
        dest[14] = 0;
        dest[15] = 1;

        return dest;
    }

    /**
     * Performs a spherical linear interpolation between two quat4
     * @method slerp
     * @param {KICK.math.quat4} quat first quaternion
     * @param {KICK.math.quat4} quat2 second quaternion
     * @param {Number} slerp interpolation amount between the two inputs
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     */
    quat4.slerp = function(quat, quat2, slerp, dest) {
        if(!dest) { dest = quat; }

        var cosHalfTheta =  quat[0]*quat2[0] + quat[1]*quat2[1] + quat[2]*quat2[2] + quat[3]*quat2[3];

        if (Math.abs(cosHalfTheta) >= 1.0){
            if(dest != quat) {
                dest[0] = quat[0];
                dest[1] = quat[1];
                dest[2] = quat[2];
                dest[3] = quat[3];
            }
            return dest;
        }

        var halfTheta = Math.acos(cosHalfTheta),
            sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta*cosHalfTheta);

        if (Math.abs(sinHalfTheta) < 0.001){
            dest[0] = (quat[0]*0.5 + quat2[0]*0.5);
            dest[1] = (quat[1]*0.5 + quat2[1]*0.5);
            dest[2] = (quat[2]*0.5 + quat2[2]*0.5);
            dest[3] = (quat[3]*0.5 + quat2[3]*0.5);
            return dest;
        }

        var ratioA = Math.sin((1 - slerp)*halfTheta) / sinHalfTheta,
            ratioB = Math.sin(slerp*halfTheta) / sinHalfTheta;

        dest[0] = (quat[0]*ratioA + quat2[0]*ratioB);
        dest[1] = (quat[1]*ratioA + quat2[1]*ratioB);
        dest[2] = (quat[2]*ratioA + quat2[2]*ratioB);
        dest[3] = (quat[3]*ratioA + quat2[3]*ratioB);

        return dest;
    };

    /**
     * Return rotation that goes from quat to quat2.<br>
     * It is the same as: quat4.multiply(quat4.inverse(quat),quat2,dest);
     * @method difference
     * @param {KICK.math.quat4} quat from rotation
     * @param {KICK.math.quat4} quat2 to rotation
     * @param {KICK.math.quat4} dest Optional
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     */
    quat4.difference = function(quat, quat2, dest) {
        if(!dest) { dest = quat; }

        var qax = -quat[0], qay = -quat[1], qaz = -quat[2], qaw = quat[3],
            qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];

        dest[0] = qax*qbw + qaw*qbx + qay*qbz - qaz*qby;
        dest[1] = qay*qbw + qaw*qby + qaz*qbx - qax*qbz;
        dest[2] = qaz*qbw + qaw*qbz + qax*qby - qay*qbx;
        dest[3] = qaw*qbw - qax*qbx - qay*qby - qaz*qbz;

        return dest;
    };



    /**
     * Returns a string representation of a quaternion
     * @method str
     * @param {KICK.math.quat4} quat quat4 to represent as a string
     * @return {String} string representation of quat
     */
    quat4.str = function(quat) {
        return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
    };

    // glMatrix end

})();