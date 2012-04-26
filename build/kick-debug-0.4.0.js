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
 * -----
 * KICK.math is based on
 * glMatrix.js - High performance matrix and vector operations for WebGL
 * http://code.google.com/p/glmatrix/
 * version 0.9.6
 *
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

    var core = KICK.namespace("KICK.core");

    /**
     * This class contains references to WebGL constants.<br>
     * Constants will be replace with actual values to increase performance when the file is compile by the postprocessor.<br>
     * Note that I have intentionally named the WebGL constants with a prefix 'GL_'. This allows use of normal WebGL
     * constants that will not be replaced by the preprocessor.
     * @class Constants
     * @namespace KICK.core
     */
    core.Constants = {};

    Object.defineProperties(core.Constants,{
        /**
         * The current version of the library
         * @property _VERSION
         * @type String
         * @static
         * @final
         */
        _VERSION: { value: "0.0.0",configurable:true,enumerable:true},
        /**
         * Allows usage of assertions in the code. The assertions will be set to false in the "compiled" code (this
         * will remove dead code in the minify-stage).<br>
         * Example usage:
         * <pre class="brush: js">
         * var constants = KICK.core.Constants;
         * if (constants._ASSERT){
         *     if (!Number.isNumber(x)){
         *         KICK.core.Util.fail("x should be a number");
         *     }
         * }
         * </pre>
         * @property _ASSERT_EDITOR
         * @type Boolean
         * @static
         * @final
         */
        _ASSERT: { value: true,enumerable:true,configurable:true},
        /**
         * Allows usage of debugging in the script code. The flag can be set to false in the "compiled" code (this
         * will remove dead code in the minify-stage).<br>
         * Example usage:<br>
         * <pre class="brush: js">
         * var constants = KICK.core.Constants;
         * if (constants._DEBUG){
         *     console.log("X is now "+x);
         * }
         * </pre>
         * @property _DEBUG
         * @type Boolean
         * @static
         * @final
         */
        _DEBUG: { value: true,enumerable:true,configurable:true},
        /**
         * Value 0.01745329251994
         * @property _DEGREE_TO_RADIAN
         * @type Number
         * @static
         * @final
         */
        _DEGREE_TO_RADIAN : { value: 0.01745329251994,enumerable:true},
        /**
         * Value 57.2957795130824
         * @property _RADIAN_TO_DEGREE
         * @type Number
         * @static
         * @final
         */
        _RADIAN_TO_DEGREE : {value: 57.2957795130824,enumerable:true},
        /**
         * Value 0.00001
         * @property _EPSILON
         * @type Number
         * @static
         * @final
         */
        _EPSILON : {value:0.00001,enumerable:true},
        /**
         * Used to define ambient color in the scene (indirect lightening)
         * @property _LIGHT_TYPE_AMBIENT
         * @type Number
         * @final
         */
        _LIGHT_TYPE_AMBIENT :{value: 1,enumerable:true},
        /**
         * Used to define directional light in the scene (such as sunlight)
         * @property _LIGHT_TYPE_DIRECTIONAL
         * @type Number
         * @final
         */
        _LIGHT_TYPE_DIRECTIONAL:{value: 2,enumerable:true},
        /**
         * Used to define point light in the scene
         * @property _LIGHT_TYPE_POINT
         * @type Number
         * @final
         */
        _LIGHT_TYPE_POINT:{value: 3,enumerable:true},

        /**
         * Value 256
         * @property GL_DEPTH_BUFFER_BIT
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_BUFFER_BIT: { value: 256,enumerable:true},
        /**
         * Value 1024
         * @property GL_STENCIL_BUFFER_BIT
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BUFFER_BIT: { value: 1024,enumerable:true},
        /**
         * Value 16384
         * @property GL_COLOR_BUFFER_BIT
         * @type Number
         * @static
         * @final
         */
        GL_COLOR_BUFFER_BIT: { value: 16384,enumerable:true},
        /**
         * Value 0
         * @property GL_POINTS
         * @type Number
         * @static
         * @final
         */
        GL_POINTS: { value: 0,enumerable:true},
        /**
         * Value 1
         * @property GL_LINES
         * @type Number
         * @static
         * @final
         */
        GL_LINES: { value: 1,enumerable:true},
        /**
         * Value 2
         * @property GL_LINE_LOOP
         * @type Number
         * @static
         * @final
         */
        GL_LINE_LOOP: { value: 2,enumerable:true},
        /**
         * Value 3
         * @property GL_LINE_STRIP
         * @type Number
         * @static
         * @final
         */
        GL_LINE_STRIP: { value: 3,enumerable:true},
        /**
         * Value 4
         * @property GL_TRIANGLES
         * @type Number
         * @static
         * @final
         */
        GL_TRIANGLES: { value: 4,enumerable:true},
        /**
         * Value 5
         * @property GL_TRIANGLE_STRIP
         * @type Number
         * @static
         * @final
         */
        GL_TRIANGLE_STRIP: { value: 5,enumerable:true},
        /**
         * Value 6
         * @property GL_TRIANGLE_FAN
         * @type Number
         * @static
         * @final
         */
        GL_TRIANGLE_FAN: { value: 6,enumerable:true},
        /**
         * Value 0
         * @property GL_ZERO
         * @type Number
         * @static
         * @final
         */
        GL_ZERO: { value: 0,enumerable:true},
        /**
         * Value 1
         * @property GL_ONE
         * @type Number
         * @static
         * @final
         */
        GL_ONE: { value: 1,enumerable:true},
        /**
         * Value 768
         * @property GL_SRC_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_SRC_COLOR: { value: 768,enumerable:true},
        /**
         * Value 769
         * @property GL_ONE_MINUS_SRC_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_SRC_COLOR: { value: 769,enumerable:true},
        /**
         * Value 770
         * @property GL_SRC_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_SRC_ALPHA: { value: 770,enumerable:true},
        /**
         * Value 771
         * @property GL_ONE_MINUS_SRC_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_SRC_ALPHA: { value: 771,enumerable:true},
        /**
         * Value 772
         * @property GL_DST_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_DST_ALPHA: { value: 772,enumerable:true},
        /**
         * Value 773
         * @property GL_ONE_MINUS_DST_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_DST_ALPHA: { value: 773,enumerable:true},
        /**
         * Value 774
         * @property GL_DST_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_DST_COLOR: { value: 774,enumerable:true},
        /**
         * Value 775
         * @property GL_ONE_MINUS_DST_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_DST_COLOR: { value: 775,enumerable:true},
        /**
         * Value 776
         * @property GL_SRC_ALPHA_SATURATE
         * @type Number
         * @static
         * @final
         */
        GL_SRC_ALPHA_SATURATE: { value: 776,enumerable:true},
        /**
         * Value 32774
         * @property GL_FUNC_ADD
         * @type Number
         * @static
         * @final
         */
        GL_FUNC_ADD: { value: 32774,enumerable:true},
        /**
         * Value 32777
         * @property GL_BLEND_EQUATION
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_EQUATION: { value: 32777,enumerable:true},
        /**
         * Value 32777
         * @property GL_BLEND_EQUATION_RGB
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_EQUATION_RGB: { value: 32777,enumerable:true},
        /**
         * Value 34877
         * @property GL_BLEND_EQUATION_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_EQUATION_ALPHA: { value: 34877,enumerable:true},
        /**
         * Value 32778
         * @property GL_FUNC_SUBTRACT
         * @type Number
         * @static
         * @final
         */
        GL_FUNC_SUBTRACT: { value: 32778,enumerable:true},
        /**
         * Value 32779
         * @property GL_FUNC_REVERSE_SUBTRACT
         * @type Number
         * @static
         * @final
         */
        GL_FUNC_REVERSE_SUBTRACT: { value: 32779,enumerable:true},
        /**
         * Value 32968
         * @property GL_BLEND_DST_RGB
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_DST_RGB: { value: 32968,enumerable:true},
        /**
         * Value 32969
         * @property GL_BLEND_SRC_RGB
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_SRC_RGB: { value: 32969,enumerable:true},
        /**
         * Value 32970
         * @property GL_BLEND_DST_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_DST_ALPHA: { value: 32970,enumerable:true},
        /**
         * Value 32971
         * @property GL_BLEND_SRC_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_SRC_ALPHA: { value: 32971,enumerable:true},
        /**
         * Value 32769
         * @property GL_CONSTANT_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_CONSTANT_COLOR: { value: 32769,enumerable:true},
        /**
         * Value 32770
         * @property GL_ONE_MINUS_CONSTANT_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_CONSTANT_COLOR: { value: 32770,enumerable:true},
        /**
         * Value 32771
         * @property GL_CONSTANT_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_CONSTANT_ALPHA: { value: 32771,enumerable:true},
        /**
         * Value 32772
         * @property GL_ONE_MINUS_CONSTANT_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_CONSTANT_ALPHA: { value: 32772,enumerable:true},
        /**
         * Value 32773
         * @property GL_BLEND_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_COLOR: { value: 32773,enumerable:true},
        /**
         * Value 34962
         * @property GL_ARRAY_BUFFER
         * @type Number
         * @static
         * @final
         */
        GL_ARRAY_BUFFER: { value: 34962,enumerable:true},
        /**
         * Value 34963
         * @property GL_ELEMENT_ARRAY_BUFFER
         * @type Number
         * @static
         * @final
         */
        GL_ELEMENT_ARRAY_BUFFER: { value: 34963,enumerable:true},
        /**
         * Value 34964
         * @property GL_ARRAY_BUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_ARRAY_BUFFER_BINDING: { value: 34964,enumerable:true},
        /**
         * Value 34965
         * @property GL_ELEMENT_ARRAY_BUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_ELEMENT_ARRAY_BUFFER_BINDING: { value: 34965,enumerable:true},
        /**
         * Value 35040
         * @property GL_STREAM_DRAW
         * @type Number
         * @static
         * @final
         */
        GL_STREAM_DRAW: { value: 35040,enumerable:true},
        /**
         * Value 35044
         * @property GL_STATIC_DRAW
         * @type Number
         * @static
         * @final
         */
        GL_STATIC_DRAW: { value: 35044,enumerable:true},
        /**
         * Value 35048
         * @property GL_DYNAMIC_DRAW
         * @type Number
         * @static
         * @final
         */
        GL_DYNAMIC_DRAW: { value: 35048,enumerable:true},
        /**
         * Value 34660
         * @property GL_BUFFER_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_BUFFER_SIZE: { value: 34660,enumerable:true},
        /**
         * Value 34661
         * @property GL_BUFFER_USAGE
         * @type Number
         * @static
         * @final
         */
        GL_BUFFER_USAGE: { value: 34661,enumerable:true},
        /**
         * Value 34342
         * @property GL_CURRENT_VERTEX_ATTRIB
         * @type Number
         * @static
         * @final
         */
        GL_CURRENT_VERTEX_ATTRIB: { value: 34342,enumerable:true},
        /**
         * Value 1028
         * @property GL_FRONT
         * @type Number
         * @static
         * @final
         */
        GL_FRONT: { value: 1028,enumerable:true},
        /**
         * Value 1029
         * @property GL_BACK
         * @type Number
         * @static
         * @final
         */
        GL_BACK: { value: 1029,enumerable:true},
        /**
         * Value 1032
         * @property GL_FRONT_AND_BACK
         * @type Number
         * @static
         * @final
         */
        GL_FRONT_AND_BACK: { value: 1032,enumerable:true},
        /**
         * Value 3553
         * @property GL_TEXTURE_2D
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_2D: { value: 3553,enumerable:true},
        /**
         * Value 2884
         * @property GL_CULL_FACE
         * @type Number
         * @static
         * @final
         */
        GL_CULL_FACE: { value: 2884,enumerable:true},
        /**
         * Value 3042
         * @property GL_BLEND
         * @type Number
         * @static
         * @final
         */
        GL_BLEND: { value: 3042,enumerable:true},
        /**
         * Value 3024
         * @property GL_DITHER
         * @type Number
         * @static
         * @final
         */
        GL_DITHER: { value: 3024,enumerable:true},
        /**
         * Value 2960
         * @property GL_STENCIL_TEST
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_TEST: { value: 2960,enumerable:true},
        /**
         * Value 2929
         * @property GL_DEPTH_TEST
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_TEST: { value: 2929,enumerable:true},
        /**
         * Value 3089
         * @property GL_SCISSOR_TEST
         * @type Number
         * @static
         * @final
         */
        GL_SCISSOR_TEST: { value: 3089,enumerable:true},
        /**
         * Value 32823
         * @property GL_POLYGON_OFFSET_FILL
         * @type Number
         * @static
         * @final
         */
        GL_POLYGON_OFFSET_FILL: { value: 32823,enumerable:true},
        /**
         * Value 32926
         * @property GL_SAMPLE_ALPHA_TO_COVERAGE
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_ALPHA_TO_COVERAGE: { value: 32926,enumerable:true},
        /**
         * Value 32928
         * @property GL_SAMPLE_COVERAGE
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_COVERAGE: { value: 32928,enumerable:true},
        /**
         * Value 0
         * @property GL_NO_ERROR
         * @type Number
         * @static
         * @final
         */
        GL_NO_ERROR: { value: 0,enumerable:true},
        /**
         * Value 1280
         * @property GL_INVALID_ENUM
         * @type Number
         * @static
         * @final
         */
        GL_INVALID_ENUM: { value: 1280,enumerable:true},
        /**
         * Value 1281
         * @property GL_INVALID_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_INVALID_VALUE: { value: 1281,enumerable:true},
        /**
         * Value 1282
         * @property GL_INVALID_OPERATION
         * @type Number
         * @static
         * @final
         */
        GL_INVALID_OPERATION: { value: 1282,enumerable:true},
        /**
         * Value 1285
         * @property GL_OUT_OF_MEMORY
         * @type Number
         * @static
         * @final
         */
        GL_OUT_OF_MEMORY: { value: 1285,enumerable:true},
        /**
         * Value 2304
         * @property GL_CW
         * @type Number
         * @static
         * @final
         */
        GL_CW: { value: 2304,enumerable:true},
        /**
         * Value 2305
         * @property GL_CCW
         * @type Number
         * @static
         * @final
         */
        GL_CCW: { value: 2305,enumerable:true},
        /**
         * Value 2849
         * @property GL_LINE_WIDTH
         * @type Number
         * @static
         * @final
         */
        GL_LINE_WIDTH: { value: 2849,enumerable:true},
        /**
         * Value 33901
         * @property GL_ALIASED_POINT_SIZE_RANGE
         * @type Number
         * @static
         * @final
         */
        GL_ALIASED_POINT_SIZE_RANGE: { value: 33901,enumerable:true},
        /**
         * Value 33902
         * @property GL_ALIASED_LINE_WIDTH_RANGE
         * @type Number
         * @static
         * @final
         */
        GL_ALIASED_LINE_WIDTH_RANGE: { value: 33902,enumerable:true},
        /**
         * Value 2885
         * @property GL_CULL_FACE_MODE
         * @type Number
         * @static
         * @final
         */
        GL_CULL_FACE_MODE: { value: 2885,enumerable:true},
        /**
         * Value 2886
         * @property GL_FRONT_FACE
         * @type Number
         * @static
         * @final
         */
        GL_FRONT_FACE: { value: 2886,enumerable:true},
        /**
         * Value 2928
         * @property GL_DEPTH_RANGE
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_RANGE: { value: 2928,enumerable:true},
        /**
         * Value 2930
         * @property GL_DEPTH_WRITEMASK
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_WRITEMASK: { value: 2930,enumerable:true},
        /**
         * Value 2931
         * @property GL_DEPTH_CLEAR_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_CLEAR_VALUE: { value: 2931,enumerable:true},
        /**
         * Value 2932
         * @property GL_DEPTH_FUNC
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_FUNC: { value: 2932,enumerable:true},
        /**
         * Value 2961
         * @property GL_STENCIL_CLEAR_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_CLEAR_VALUE: { value: 2961,enumerable:true},
        /**
         * Value 2962
         * @property GL_STENCIL_FUNC
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_FUNC: { value: 2962,enumerable:true},
        /**
         * Value 2964
         * @property GL_STENCIL_FAIL
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_FAIL: { value: 2964,enumerable:true},
        /**
         * Value 2965
         * @property GL_STENCIL_PASS_DEPTH_FAIL
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_PASS_DEPTH_FAIL: { value: 2965,enumerable:true},
        /**
         * Value 2966
         * @property GL_STENCIL_PASS_DEPTH_PASS
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_PASS_DEPTH_PASS: { value: 2966,enumerable:true},
        /**
         * Value 2967
         * @property GL_STENCIL_REF
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_REF: { value: 2967,enumerable:true},
        /**
         * Value 2963
         * @property GL_STENCIL_VALUE_MASK
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_VALUE_MASK: { value: 2963,enumerable:true},
        /**
         * Value 2968
         * @property GL_STENCIL_WRITEMASK
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_WRITEMASK: { value: 2968,enumerable:true},
        /**
         * Value 34816
         * @property GL_STENCIL_BACK_FUNC
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_FUNC: { value: 34816,enumerable:true},
        /**
         * Value 34817
         * @property GL_STENCIL_BACK_FAIL
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_FAIL: { value: 34817,enumerable:true},
        /**
         * Value 34818
         * @property GL_STENCIL_BACK_PASS_DEPTH_FAIL
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_PASS_DEPTH_FAIL: { value: 34818,enumerable:true},
        /**
         * Value 34819
         * @property GL_STENCIL_BACK_PASS_DEPTH_PASS
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_PASS_DEPTH_PASS: { value: 34819,enumerable:true},
        /**
         * Value 36003
         * @property GL_STENCIL_BACK_REF
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_REF: { value: 36003,enumerable:true},
        /**
         * Value 36004
         * @property GL_STENCIL_BACK_VALUE_MASK
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_VALUE_MASK: { value: 36004,enumerable:true},
        /**
         * Value 36005
         * @property GL_STENCIL_BACK_WRITEMASK
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_WRITEMASK: { value: 36005,enumerable:true},
        /**
         * Value 2978
         * @property GL_VIEWPORT
         * @type Number
         * @static
         * @final
         */
        GL_VIEWPORT: { value: 2978,enumerable:true},
        /**
         * Value 3088
         * @property GL_SCISSOR_BOX
         * @type Number
         * @static
         * @final
         */
        GL_SCISSOR_BOX: { value: 3088,enumerable:true},
        /**
         * Value 3106
         * @property GL_COLOR_CLEAR_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_COLOR_CLEAR_VALUE: { value: 3106,enumerable:true},
        /**
         * Value 3107
         * @property GL_COLOR_WRITEMASK
         * @type Number
         * @static
         * @final
         */
        GL_COLOR_WRITEMASK: { value: 3107,enumerable:true},
        /**
         * Value 3317
         * @property GL_UNPACK_ALIGNMENT
         * @type Number
         * @static
         * @final
         */
        GL_UNPACK_ALIGNMENT: { value: 3317,enumerable:true},
        /**
         * Value 3333
         * @property GL_PACK_ALIGNMENT
         * @type Number
         * @static
         * @final
         */
        GL_PACK_ALIGNMENT: { value: 3333,enumerable:true},
        /**
         * Value 3379
         * @property GL_MAX_TEXTURE_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_MAX_TEXTURE_SIZE: { value: 3379,enumerable:true},
        /**
         * Value 3386
         * @property GL_MAX_VIEWPORT_DIMS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VIEWPORT_DIMS: { value: 3386,enumerable:true},
        /**
         * Value 3408
         * @property GL_SUBPIXEL_BITS
         * @type Number
         * @static
         * @final
         */
        GL_SUBPIXEL_BITS: { value: 3408,enumerable:true},
        /**
         * Value 3410
         * @property GL_RED_BITS
         * @type Number
         * @static
         * @final
         */
        GL_RED_BITS: { value: 3410,enumerable:true},
        /**
         * Value 3411
         * @property GL_GREEN_BITS
         * @type Number
         * @static
         * @final
         */
        GL_GREEN_BITS: { value: 3411,enumerable:true},
        /**
         * Value 3412
         * @property GL_BLUE_BITS
         * @type Number
         * @static
         * @final
         */
        GL_BLUE_BITS: { value: 3412,enumerable:true},
        /**
         * Value 3413
         * @property GL_ALPHA_BITS
         * @type Number
         * @static
         * @final
         */
        GL_ALPHA_BITS: { value: 3413,enumerable:true},
        /**
         * Value 3414
         * @property GL_DEPTH_BITS
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_BITS: { value: 3414,enumerable:true},
        /**
         * Value 3415
         * @property GL_STENCIL_BITS
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BITS: { value: 3415,enumerable:true},
        /**
         * Value 10752
         * @property GL_POLYGON_OFFSET_UNITS
         * @type Number
         * @static
         * @final
         */
        GL_POLYGON_OFFSET_UNITS: { value: 10752,enumerable:true},
        /**
         * Value 32824
         * @property GL_POLYGON_OFFSET_FACTOR
         * @type Number
         * @static
         * @final
         */
        GL_POLYGON_OFFSET_FACTOR: { value: 32824,enumerable:true},
        /**
         * Value 32873
         * @property GL_TEXTURE_BINDING_2D
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_BINDING_2D: { value: 32873,enumerable:true},
        /**
         * Value 32936
         * @property GL_SAMPLE_BUFFERS
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_BUFFERS: { value: 32936,enumerable:true},
        /**
         * Value 32937
         * @property GL_SAMPLES
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLES: { value: 32937,enumerable:true},
        /**
         * Value 32938
         * @property GL_SAMPLE_COVERAGE_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_COVERAGE_VALUE: { value: 32938,enumerable:true},
        /**
         * Value 32939
         * @property GL_SAMPLE_COVERAGE_INVERT
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_COVERAGE_INVERT: { value: 32939,enumerable:true},
        /**
         * Value 34466
         * @property GL_NUM_COMPRESSED_TEXTURE_FORMATS
         * @type Number
         * @static
         * @final
         */
        GL_NUM_COMPRESSED_TEXTURE_FORMATS: { value: 34466,enumerable:true},
        /**
         * Value 34467
         * @property GL_COMPRESSED_TEXTURE_FORMATS
         * @type Number
         * @static
         * @final
         */
        GL_COMPRESSED_TEXTURE_FORMATS: { value: 34467,enumerable:true},
        /**
         * Value 4352
         * @property GL_DONT_CARE
         * @type Number
         * @static
         * @final
         */
        GL_DONT_CARE: { value: 4352,enumerable:true},
        /**
         * Value 4353
         * @property GL_FASTEST
         * @type Number
         * @static
         * @final
         */
        GL_FASTEST: { value: 4353,enumerable:true},
        /**
         * Value 4354
         * @property GL_NICEST
         * @type Number
         * @static
         * @final
         */
        GL_NICEST: { value: 4354,enumerable:true},
        /**
         * Value 33170
         * @property GL_GENERATE_MIPMAP_HINT
         * @type Number
         * @static
         * @final
         */
        GL_GENERATE_MIPMAP_HINT: { value: 33170,enumerable:true},
        /**
         * Value 5120
         * @property GL_BYTE
         * @type Number
         * @static
         * @final
         */
        GL_BYTE: { value: 5120,enumerable:true},
        /**
         * Value 5121
         * @property GL_UNSIGNED_BYTE
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_BYTE: { value: 5121,enumerable:true},
        /**
         * Value 5122
         * @property GL_SHORT
         * @type Number
         * @static
         * @final
         */
        GL_SHORT: { value: 5122,enumerable:true},
        /**
         * Value 5123
         * @property GL_UNSIGNED_SHORT
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_SHORT: { value: 5123,enumerable:true},
        /**
         * Value 5124
         * @property GL_INT
         * @type Number
         * @static
         * @final
         */
        GL_INT: { value: 5124,enumerable:true},
        /**
         * Value 5125
         * @property GL_UNSIGNED_INT
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_INT: { value: 5125,enumerable:true},
        /**
         * Value 5126
         * @property GL_FLOAT
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT: { value: 5126,enumerable:true},
        /**
         * Value 6402
         * @property GL_DEPTH_COMPONENT
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_COMPONENT: { value: 6402,enumerable:true},
        /**
         * Value 6406
         * @property GL_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_ALPHA: { value: 6406,enumerable:true},
        /**
         * Value 6407
         * @property GL_RGB
         * @type Number
         * @static
         * @final
         */
        GL_RGB: { value: 6407,enumerable:true},
        /**
         * Value 6408
         * @property GL_RGBA
         * @type Number
         * @static
         * @final
         */
        GL_RGBA: { value: 6408,enumerable:true},
        /**
         * Value 6409
         * @property GL_LUMINANCE
         * @type Number
         * @static
         * @final
         */
        GL_LUMINANCE: { value: 6409,enumerable:true},
        /**
         * Value 6410
         * @property GL_LUMINANCE_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_LUMINANCE_ALPHA: { value: 6410,enumerable:true},
        /**
         * Value 32819
         * @property GL_UNSIGNED_SHORT_4_4_4_4
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_SHORT_4_4_4_4: { value: 32819,enumerable:true},
        /**
         * Value 32820
         * @property GL_UNSIGNED_SHORT_5_5_5_1
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_SHORT_5_5_5_1: { value: 32820,enumerable:true},
        /**
         * Value 33635
         * @property GL_UNSIGNED_SHORT_5_6_5
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_SHORT_5_6_5: { value: 33635,enumerable:true},
        /**
         * Value 35632
         * @property GL_FRAGMENT_SHADER
         * @type Number
         * @static
         * @final
         */
        GL_FRAGMENT_SHADER: { value: 35632,enumerable:true},
        /**
         * Value 35633
         * @property GL_VERTEX_SHADER
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_SHADER: { value: 35633,enumerable:true},
        /**
         * Value 34921
         * @property GL_MAX_VERTEX_ATTRIBS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VERTEX_ATTRIBS: { value: 34921,enumerable:true},
        /**
         * Value 36347
         * @property GL_MAX_VERTEX_UNIFORM_VECTORS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VERTEX_UNIFORM_VECTORS: { value: 36347,enumerable:true},
        /**
         * Value 36348
         * @property GL_MAX_VARYING_VECTORS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VARYING_VECTORS: { value: 36348,enumerable:true},
        /**
         * Value 35661
         * @property GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS: { value: 35661,enumerable:true},
        /**
         * Value 35660
         * @property GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS: { value: 35660,enumerable:true},
        /**
         * Value 34930
         * @property GL_MAX_TEXTURE_IMAGE_UNITS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_TEXTURE_IMAGE_UNITS: { value: 34930,enumerable:true},
        /**
         * Value 36349
         * @property GL_MAX_FRAGMENT_UNIFORM_VECTORS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_FRAGMENT_UNIFORM_VECTORS: { value: 36349,enumerable:true},
        /**
         * Value 35663
         * @property GL_SHADER_TYPE
         * @type Number
         * @static
         * @final
         */
        GL_SHADER_TYPE: { value: 35663,enumerable:true},
        /**
         * Value 35712
         * @property GL_DELETE_STATUS
         * @type Number
         * @static
         * @final
         */
        GL_DELETE_STATUS: { value: 35712,enumerable:true},
        /**
         * Value 35714
         * @property GL_LINK_STATUS
         * @type Number
         * @static
         * @final
         */
        GL_LINK_STATUS: { value: 35714,enumerable:true},
        /**
         * Value 35715
         * @property GL_VALIDATE_STATUS
         * @type Number
         * @static
         * @final
         */
        GL_VALIDATE_STATUS: { value: 35715,enumerable:true},
        /**
         * Value 35717
         * @property GL_ATTACHED_SHADERS
         * @type Number
         * @static
         * @final
         */
        GL_ATTACHED_SHADERS: { value: 35717,enumerable:true},
        /**
         * Value 35718
         * @property GL_ACTIVE_UNIFORMS
         * @type Number
         * @static
         * @final
         */
        GL_ACTIVE_UNIFORMS: { value: 35718,enumerable:true},
        /**
         * Value 35721
         * @property GL_ACTIVE_ATTRIBUTES
         * @type Number
         * @static
         * @final
         */
        GL_ACTIVE_ATTRIBUTES: { value: 35721,enumerable:true},
        /**
         * Value 35724
         * @property GL_SHADING_LANGUAGE_VERSION
         * @type Number
         * @static
         * @final
         */
        GL_SHADING_LANGUAGE_VERSION: { value: 35724,enumerable:true},
        /**
         * Value 35725
         * @property GL_CURRENT_PROGRAM
         * @type Number
         * @static
         * @final
         */
        GL_CURRENT_PROGRAM: { value: 35725,enumerable:true},
        /**
         * Value 512
         * @property GL_NEVER
         * @type Number
         * @static
         * @final
         */
        GL_NEVER: { value: 512,enumerable:true},
        /**
         * Value 513
         * @property GL_LESS
         * @type Number
         * @static
         * @final
         */
        GL_LESS: { value: 513,enumerable:true},
        /**
         * Value 514
         * @property GL_EQUAL
         * @type Number
         * @static
         * @final
         */
        GL_EQUAL: { value: 514,enumerable:true},
        /**
         * Value 515
         * @property GL_LEQUAL
         * @type Number
         * @static
         * @final
         */
        GL_LEQUAL: { value: 515,enumerable:true},
        /**
         * Value 516
         * @property GL_GREATER
         * @type Number
         * @static
         * @final
         */
        GL_GREATER: { value: 516,enumerable:true},
        /**
         * Value 517
         * @property GL_NOTEQUAL
         * @type Number
         * @static
         * @final
         */
        GL_NOTEQUAL: { value: 517,enumerable:true},
        /**
         * Value 518
         * @property GL_GEQUAL
         * @type Number
         * @static
         * @final
         */
        GL_GEQUAL: { value: 518,enumerable:true},
        /**
         * Value 519
         * @property GL_ALWAYS
         * @type Number
         * @static
         * @final
         */
        GL_ALWAYS: { value: 519,enumerable:true},
        /**
         * Value 7680
         * @property GL_KEEP
         * @type Number
         * @static
         * @final
         */
        GL_KEEP: { value: 7680,enumerable:true},
        /**
         * Value 7681
         * @property GL_REPLACE
         * @type Number
         * @static
         * @final
         */
        GL_REPLACE: { value: 7681,enumerable:true},
        /**
         * Value 7682
         * @property GL_INCR
         * @type Number
         * @static
         * @final
         */
        GL_INCR: { value: 7682,enumerable:true},
        /**
         * Value 7683
         * @property GL_DECR
         * @type Number
         * @static
         * @final
         */
        GL_DECR: { value: 7683,enumerable:true},
        /**
         * Value 5386
         * @property GL_INVERT
         * @type Number
         * @static
         * @final
         */
        GL_INVERT: { value: 5386,enumerable:true},
        /**
         * Value 34055
         * @property GL_INCR_WRAP
         * @type Number
         * @static
         * @final
         */
        GL_INCR_WRAP: { value: 34055,enumerable:true},
        /**
         * Value 34056
         * @property GL_DECR_WRAP
         * @type Number
         * @static
         * @final
         */
        GL_DECR_WRAP: { value: 34056,enumerable:true},
        /**
         * Value 7936
         * @property GL_VENDOR
         * @type Number
         * @static
         * @final
         */
        GL_VENDOR: { value: 7936,enumerable:true},
        /**
         * Value 7937
         * @property GL_RENDERER
         * @type Number
         * @static
         * @final
         */
        GL_RENDERER: { value: 7937,enumerable:true},
        /**
         * Value 7938
         * @property GL_VERSION
         * @type Number
         * @static
         * @final
         */
        GL_VERSION: { value: 7938,enumerable:true},
        /**
         * Value 9728
         * @property GL_NEAREST
         * @type Number
         * @static
         * @final
         */
        GL_NEAREST: { value: 9728,enumerable:true},
        /**
         * Value 9729
         * @property GL_LINEAR
         * @type Number
         * @static
         * @final
         */
        GL_LINEAR: { value: 9729,enumerable:true},
        /**
         * Value 9984
         * @property GL_NEAREST_MIPMAP_NEAREST
         * @type Number
         * @static
         * @final
         */
        GL_NEAREST_MIPMAP_NEAREST: { value: 9984,enumerable:true},
        /**
         * Value 9985
         * @property GL_LINEAR_MIPMAP_NEAREST
         * @type Number
         * @static
         * @final
         */
        GL_LINEAR_MIPMAP_NEAREST: { value: 9985,enumerable:true},
        /**
         * Value 9986
         * @property GL_NEAREST_MIPMAP_LINEAR
         * @type Number
         * @static
         * @final
         */
        GL_NEAREST_MIPMAP_LINEAR: { value: 9986,enumerable:true},
        /**
         * Value 9987
         * @property GL_LINEAR_MIPMAP_LINEAR
         * @type Number
         * @static
         * @final
         */
        GL_LINEAR_MIPMAP_LINEAR: { value: 9987,enumerable:true},
        /**
         * Value 10240
         * @property GL_TEXTURE_MAG_FILTER
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_MAG_FILTER: { value: 10240,enumerable:true},
        /**
         * Value 10241
         * @property GL_TEXTURE_MIN_FILTER
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_MIN_FILTER: { value: 10241,enumerable:true},
        /**
         * Value 10242
         * @property GL_TEXTURE_WRAP_S
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_WRAP_S: { value: 10242,enumerable:true},
        /**
         * Value 10243
         * @property GL_TEXTURE_WRAP_T
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_WRAP_T: { value: 10243,enumerable:true},
        /**
         * Value 5890
         * @property GL_TEXTURE
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE: { value: 5890,enumerable:true},
        /**
         * Value 34067
         * @property GL_TEXTURE_CUBE_MAP
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP: { value: 34067,enumerable:true},
        /**
         * Value 34068
         * @property GL_TEXTURE_BINDING_CUBE_MAP
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_BINDING_CUBE_MAP: { value: 34068,enumerable:true},
        /**
         * Value 34069
         * @property GL_TEXTURE_CUBE_MAP_POSITIVE_X
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_POSITIVE_X: { value: 34069,enumerable:true},
        /**
         * Value 34070
         * @property GL_TEXTURE_CUBE_MAP_NEGATIVE_X
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_NEGATIVE_X: { value: 34070,enumerable:true},
        /**
         * Value 34071
         * @property GL_TEXTURE_CUBE_MAP_POSITIVE_Y
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_POSITIVE_Y: { value: 34071,enumerable:true},
        /**
         * Value 34072
         * @property GL_TEXTURE_CUBE_MAP_NEGATIVE_Y
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_NEGATIVE_Y: { value: 34072,enumerable:true},
        /**
         * Value 34073
         * @property GL_TEXTURE_CUBE_MAP_POSITIVE_Z
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_POSITIVE_Z: { value: 34073,enumerable:true},
        /**
         * Value 34074
         * @property GL_TEXTURE_CUBE_MAP_NEGATIVE_Z
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_NEGATIVE_Z: { value: 34074,enumerable:true},
        /**
         * Value 34076
         * @property GL_MAX_CUBE_MAP_TEXTURE_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_MAX_CUBE_MAP_TEXTURE_SIZE: { value: 34076,enumerable:true},
        /**
         * Value 33984
         * @property GL_TEXTURE0
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE0: { value: 33984,enumerable:true},
        /**
         * Value 33985
         * @property GL_TEXTURE1
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE1: { value: 33985,enumerable:true},
        /**
         * Value 33986
         * @property GL_TEXTURE2
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE2: { value: 33986,enumerable:true},
        /**
         * Value 33987
         * @property GL_TEXTURE3
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE3: { value: 33987,enumerable:true},
        /**
         * Value 33988
         * @property GL_TEXTURE4
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE4: { value: 33988,enumerable:true},
        /**
         * Value 33989
         * @property GL_TEXTURE5
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE5: { value: 33989,enumerable:true},
        /**
         * Value 33990
         * @property GL_TEXTURE6
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE6: { value: 33990,enumerable:true},
        /**
         * Value 33991
         * @property GL_TEXTURE7
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE7: { value: 33991,enumerable:true},
        /**
         * Value 33992
         * @property GL_TEXTURE8
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE8: { value: 33992,enumerable:true},
        /**
         * Value 33993
         * @property GL_TEXTURE9
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE9: { value: 33993,enumerable:true},
        /**
         * Value 33994
         * @property GL_TEXTURE10
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE10: { value: 33994,enumerable:true},
        /**
         * Value 33995
         * @property GL_TEXTURE11
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE11: { value: 33995,enumerable:true},
        /**
         * Value 33996
         * @property GL_TEXTURE12
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE12: { value: 33996,enumerable:true},
        /**
         * Value 33997
         * @property GL_TEXTURE13
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE13: { value: 33997,enumerable:true},
        /**
         * Value 33998
         * @property GL_TEXTURE14
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE14: { value: 33998,enumerable:true},
        /**
         * Value 33999
         * @property GL_TEXTURE15
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE15: { value: 33999,enumerable:true},
        /**
         * Value 34000
         * @property GL_TEXTURE16
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE16: { value: 34000,enumerable:true},
        /**
         * Value 34001
         * @property GL_TEXTURE17
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE17: { value: 34001,enumerable:true},
        /**
         * Value 34002
         * @property GL_TEXTURE18
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE18: { value: 34002,enumerable:true},
        /**
         * Value 34003
         * @property GL_TEXTURE19
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE19: { value: 34003,enumerable:true},
        /**
         * Value 34004
         * @property GL_TEXTURE20
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE20: { value: 34004,enumerable:true},
        /**
         * Value 34005
         * @property GL_TEXTURE21
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE21: { value: 34005,enumerable:true},
        /**
         * Value 34006
         * @property GL_TEXTURE22
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE22: { value: 34006,enumerable:true},
        /**
         * Value 34007
         * @property GL_TEXTURE23
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE23: { value: 34007,enumerable:true},
        /**
         * Value 34008
         * @property GL_TEXTURE24
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE24: { value: 34008,enumerable:true},
        /**
         * Value 34009
         * @property GL_TEXTURE25
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE25: { value: 34009,enumerable:true},
        /**
         * Value 34010
         * @property GL_TEXTURE26
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE26: { value: 34010,enumerable:true},
        /**
         * Value 34011
         * @property GL_TEXTURE27
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE27: { value: 34011,enumerable:true},
        /**
         * Value 34012
         * @property GL_TEXTURE28
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE28: { value: 34012,enumerable:true},
        /**
         * Value 34013
         * @property GL_TEXTURE29
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE29: { value: 34013,enumerable:true},
        /**
         * Value 34014
         * @property GL_TEXTURE30
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE30: { value: 34014,enumerable:true},
        /**
         * Value 34015
         * @property GL_TEXTURE31
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE31: { value: 34015,enumerable:true},
        /**
         * Value 34016
         * @property GL_ACTIVE_TEXTURE
         * @type Number
         * @static
         * @final
         */
        GL_ACTIVE_TEXTURE: { value: 34016,enumerable:true},
        /**
         * Value 10497
         * @property GL_REPEAT
         * @type Number
         * @static
         * @final
         */
        GL_REPEAT: { value: 10497,enumerable:true},
        /**
         * Value 33071
         * @property GL_CLAMP_TO_EDGE
         * @type Number
         * @static
         * @final
         */
        GL_CLAMP_TO_EDGE: { value: 33071,enumerable:true},
        /**
         * Value 33648
         * @property GL_MIRRORED_REPEAT
         * @type Number
         * @static
         * @final
         */
        GL_MIRRORED_REPEAT: { value: 33648,enumerable:true},
        /**
         * Value 35664
         * @property GL_FLOAT_VEC2
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_VEC2: { value: 35664,enumerable:true},
        /**
         * Value 35665
         * @property GL_FLOAT_VEC3
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_VEC3: { value: 35665,enumerable:true},
        /**
         * Value 35666
         * @property GL_FLOAT_VEC4
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_VEC4: { value: 35666,enumerable:true},
        /**
         * Value 35667
         * @property GL_INT_VEC2
         * @type Number
         * @static
         * @final
         */
        GL_INT_VEC2: { value: 35667,enumerable:true},
        /**
         * Value 35668
         * @property GL_INT_VEC3
         * @type Number
         * @static
         * @final
         */
        GL_INT_VEC3: { value: 35668,enumerable:true},
        /**
         * Value 35669
         * @property GL_INT_VEC4
         * @type Number
         * @static
         * @final
         */
        GL_INT_VEC4: { value: 35669,enumerable:true},
        /**
         * Value 35670
         * @property GL_BOOL
         * @type Number
         * @static
         * @final
         */
        GL_BOOL: { value: 35670,enumerable:true},
        /**
         * Value 35671
         * @property GL_BOOL_VEC2
         * @type Number
         * @static
         * @final
         */
        GL_BOOL_VEC2: { value: 35671,enumerable:true},
        /**
         * Value 35672
         * @property GL_BOOL_VEC3
         * @type Number
         * @static
         * @final
         */
        GL_BOOL_VEC3: { value: 35672,enumerable:true},
        /**
         * Value 35673
         * @property GL_BOOL_VEC4
         * @type Number
         * @static
         * @final
         */
        GL_BOOL_VEC4: { value: 35673,enumerable:true},
        /**
         * Value 35674
         * @property GL_FLOAT_MAT2
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_MAT2: { value: 35674,enumerable:true},
        /**
         * Value 35675
         * @property GL_FLOAT_MAT3
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_MAT3: { value: 35675,enumerable:true},
        /**
         * Value 35676
         * @property GL_FLOAT_MAT4
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_MAT4: { value: 35676,enumerable:true},
        /**
         * Value 35678
         * @property GL_SAMPLER_2D
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLER_2D: { value: 35678,enumerable:true},
        /**
         * Value 35680
         * @property GL_SAMPLER_CUBE
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLER_CUBE: { value: 35680,enumerable:true},
        /**
         * Value 34338
         * @property GL_VERTEX_ATTRIB_ARRAY_ENABLED
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_ENABLED: { value: 34338,enumerable:true},
        /**
         * Value 34339
         * @property GL_VERTEX_ATTRIB_ARRAY_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_SIZE: { value: 34339,enumerable:true},
        /**
         * Value 34340
         * @property GL_VERTEX_ATTRIB_ARRAY_STRIDE
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_STRIDE: { value: 34340,enumerable:true},
        /**
         * Value 34341
         * @property GL_VERTEX_ATTRIB_ARRAY_TYPE
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_TYPE: { value: 34341,enumerable:true},
        /**
         * Value 34922
         * @property GL_VERTEX_ATTRIB_ARRAY_NORMALIZED
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_NORMALIZED: { value: 34922,enumerable:true},
        /**
         * Value 34373
         * @property GL_VERTEX_ATTRIB_ARRAY_POINTER
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_POINTER: { value: 34373,enumerable:true},
        /**
         * Value 34975
         * @property GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: { value: 34975,enumerable:true},
        /**
         * Value 35713
         * @property GL_COMPILE_STATUS
         * @type Number
         * @static
         * @final
         */
        GL_COMPILE_STATUS: { value: 35713,enumerable:true},
        /**
         * Value 36346
         * @property GL_SHADER_COMPILER
         * @type Number
         * @static
         * @final
         */
        GL_SHADER_COMPILER: { value: 36346,enumerable:true},
        /**
         * Value 36336
         * @property GL_LOW_FLOAT
         * @type Number
         * @static
         * @final
         */
        GL_LOW_FLOAT: { value: 36336,enumerable:true},
        /**
         * Value 36337
         * @property GL_MEDIUM_FLOAT
         * @type Number
         * @static
         * @final
         */
        GL_MEDIUM_FLOAT: { value: 36337,enumerable:true},
        /**
         * Value 36338
         * @property GL_HIGH_FLOAT
         * @type Number
         * @static
         * @final
         */
        GL_HIGH_FLOAT: { value: 36338,enumerable:true},
        /**
         * Value 36339
         * @property GL_LOW_INT
         * @type Number
         * @static
         * @final
         */
        GL_LOW_INT: { value: 36339,enumerable:true},
        /**
         * Value 36340
         * @property GL_MEDIUM_INT
         * @type Number
         * @static
         * @final
         */
        GL_MEDIUM_INT: { value: 36340,enumerable:true},
        /**
         * Value 36341
         * @property GL_HIGH_INT
         * @type Number
         * @static
         * @final
         */
        GL_HIGH_INT: { value: 36341,enumerable:true},
        /**
         * Value 36160
         * @property GL_FRAMEBUFFER
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER: { value: 36160,enumerable:true},
        /**
         * Value 36161
         * @property GL_RENDERBUFFER
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER: { value: 36161,enumerable:true},
        /**
         * Value 32854
         * @property GL_RGBA4
         * @type Number
         * @static
         * @final
         */
        GL_RGBA4: { value: 32854,enumerable:true},
        /**
         * Value 32855
         * @property GL_RGB5_A1
         * @type Number
         * @static
         * @final
         */
        GL_RGB5_A1: { value: 32855,enumerable:true},
        /**
         * Value 36194
         * @property GL_RGB565
         * @type Number
         * @static
         * @final
         */
        GL_RGB565: { value: 36194,enumerable:true},
        /**
         * Value 33189
         * @property GL_DEPTH_COMPONENT16
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_COMPONENT16: { value: 33189,enumerable:true},
        /**
         * Value 6401
         * @property GL_STENCIL_INDEX
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_INDEX: { value: 6401,enumerable:true},
        /**
         * Value 36168
         * @property GL_STENCIL_INDEX8
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_INDEX8: { value: 36168,enumerable:true},
        /**
         * Value 34041
         * @property GL_DEPTH_STENCIL
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_STENCIL: { value: 34041,enumerable:true},
        /**
         * Value 36162
         * @property GL_RENDERBUFFER_WIDTH
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_WIDTH: { value: 36162,enumerable:true},
        /**
         * Value 36163
         * @property GL_RENDERBUFFER_HEIGHT
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_HEIGHT: { value: 36163,enumerable:true},
        /**
         * Value 36164
         * @property GL_RENDERBUFFER_INTERNAL_FORMAT
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_INTERNAL_FORMAT: { value: 36164,enumerable:true},
        /**
         * Value 36176
         * @property GL_RENDERBUFFER_RED_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_RED_SIZE: { value: 36176,enumerable:true},
        /**
         * Value 36177
         * @property GL_RENDERBUFFER_GREEN_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_GREEN_SIZE: { value: 36177,enumerable:true},
        /**
         * Value 36178
         * @property GL_RENDERBUFFER_BLUE_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_BLUE_SIZE: { value: 36178,enumerable:true},
        /**
         * Value 36179
         * @property GL_RENDERBUFFER_ALPHA_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_ALPHA_SIZE: { value: 36179,enumerable:true},
        /**
         * Value 36180
         * @property GL_RENDERBUFFER_DEPTH_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_DEPTH_SIZE: { value: 36180,enumerable:true},
        /**
         * Value 36181
         * @property GL_RENDERBUFFER_STENCIL_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_STENCIL_SIZE: { value: 36181,enumerable:true},
        /**
         * Value 36048
         * @property GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: { value: 36048,enumerable:true},
        /**
         * Value 36049
         * @property GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: { value: 36049,enumerable:true},
        /**
         * Value 36050
         * @property GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: { value: 36050,enumerable:true},
        /**
         * Value 36051
         * @property GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: { value: 36051,enumerable:true},
        /**
         * Value 36064
         * @property GL_COLOR_ATTACHMENT0
         * @type Number
         * @static
         * @final
         */
        GL_COLOR_ATTACHMENT0: { value: 36064,enumerable:true},
        /**
         * Value 36096
         * @property GL_DEPTH_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_ATTACHMENT: { value: 36096,enumerable:true},
        /**
         * Value 36128
         * @property GL_STENCIL_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_ATTACHMENT: { value: 36128,enumerable:true},
        /**
         * Value 33306
         * @property GL_DEPTH_STENCIL_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_STENCIL_ATTACHMENT: { value: 33306,enumerable:true},
        /**
         * Value 0
         * @property GL_NONE
         * @type Number
         * @static
         * @final
         */
        GL_NONE: { value: 0,enumerable:true},
        /**
         * Value 36053
         * @property GL_FRAMEBUFFER_COMPLETE
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_COMPLETE: { value: 36053,enumerable:true},
        /**
         * Value 36054
         * @property GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT: { value: 36054,enumerable:true},
        /**
         * Value 36055
         * @property GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: { value: 36055,enumerable:true},
        /**
         * Value 36057
         * @property GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS: { value: 36057,enumerable:true},
        /**
         * Value 36061
         * @property GL_FRAMEBUFFER_UNSUPPORTED
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_UNSUPPORTED: { value: 36061,enumerable:true},
        /**
         * Value 36006
         * @property GL_FRAMEBUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_BINDING: { value: 36006,enumerable:true},
        /**
         * Value 36007
         * @property GL_RENDERBUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_BINDING: { value: 36007,enumerable:true},
        /**
         * Value 34024
         * @property GL_MAX_RENDERBUFFER_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_MAX_RENDERBUFFER_SIZE: { value: 34024,enumerable:true},
        /**
         * Value 1286
         * @property GL_INVALID_FRAMEBUFFER_OPERATION
         * @type Number
         * @static
         * @final
         */
        GL_INVALID_FRAMEBUFFER_OPERATION: { value: 1286,enumerable:true},
        /**
         * Value 37440
         * @property GL_UNPACK_FLIP_Y_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_UNPACK_FLIP_Y_WEBGL: { value: 37440,enumerable:true},
        /**
         * Value 37441
         * @property GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL: { value: 37441,enumerable:true},
        /**
         * Value 37442
         * @property GL_CONTEXT_LOST_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_CONTEXT_LOST_WEBGL: { value: 37442,enumerable:true},
        /**
         * Value 37443
         * @property GL_UNPACK_COLORSPACE_CONVERSION_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_UNPACK_COLORSPACE_CONVERSION_WEBGL: { value: 37443,enumerable:true},
        /**
         * Value 37444
         * @property GL_BROWSER_DEFAULT_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_BROWSER_DEFAULT_WEBGL: { value: 37444,enumerable:true}
    });
})();

// Node.js export (used for preprocessor)
this["exports"] = this["exports"] || {};
exports.Constants = KICK.core.Constants;
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
    var material = KICK.namespace("KICK.material");

    /**
     * Contains glsl source code constants<br>
     * The content of this class is generated from the content of the file folder src/glsl
     * @class GLSLConstants
     * @namespace KICK.material
     * @static
     */
    material.GLSLConstants =
    // created by include_glsl_files.js - do not edit content
/**
* GLSL file content
* @property __error_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property __error_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property __pick_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property __pick_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property __shadowmap_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property __shadowmap_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property diffuse_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property diffuse_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property light.glsl
* @type String
*/
/**
* GLSL file content
* @property shadowmap.glsl
* @type String
*/
/**
* GLSL file content
* @property specular_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property specular_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_diffuse_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_diffuse_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_specular_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_specular_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_unlit_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property transparent_unlit_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_vertex_color_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_vertex_color_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_vs.glsl
* @type String
*/
{"__error_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvoid main(void)\n{\ngl_FragColor = vec4(1.0,0.5, 0.9, 1.0);\n}","__error_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\n} ","__pick_fs.glsl":"#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec4 gameObjectUID;\nvoid main(void)\n{\ngl_FragColor = gameObjectUID;\n}","__pick_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nuniform vec4 _gameObjectUID;\nvarying vec4 gameObjectUID;\nvoid main(void) {\n// compute position\ngl_Position = _mvProj * vec4(vertex, 1.0);\ngameObjectUID = _gameObjectUID;\n}","__shadowmap_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvec4 packDepth( const in float depth ) {\nconst vec4 bitShift = vec4( 16777216.0, 65536.0, 256.0, 1.0 );\nconst vec4 bitMask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bitShift );\nres -= res.xxyz * bitMask;\nreturn res;\n}\nvoid main() {\ngl_FragColor = packDepth( gl_FragCoord.z );\n}\n","__shadowmap_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\n} ","diffuse_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\n#pragma include \"shadowmap.glsl\"\nvoid main(void)\n{\nvec3 normal = normalize(vNormal);\nvec3 directionalLight = getDirectionalLightDiffuse(normal,_dLight);\nvec3 pointLight = getPointLightDiffuse(normal,vEcPosition, _pLights);\nfloat visibility;\nif (SHADOWS){\nvisibility = computeLightVisibility();\n} else {\nvisibility = 1.0;\n}\nvec3 color = max((directionalLight+pointLight)*visibility,_ambient.xyz)*mainColor.xyz;\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*color, 1.0);\n}\n","diffuse_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat4 _mv;\nuniform mat4 _lightMat;\nuniform mat3 _norm;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec4 vShadowMapCoord;\nvarying vec3 vEcPosition;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\ngl_Position = _mvProj * v;\nvEcPosition = (_mv * v).xyz;\nvUv = uv1;\nvNormal = _norm * normal;\nvShadowMapCoord = _lightMat * v;\n} ","light.glsl":"vec3 getPointLightDiffuse(vec3 normal, vec3 ecPosition, mat3 pLights[LIGHTS]){\nvec3 diffuse = vec3(0.0);\nfor (int i=0;i<LIGHTS;i++){\nvec3 ecLightPos = pLights[i][0]; // light position in eye coordinates\nvec3 colorIntensity = pLights[i][1];\nvec3 attenuationVector = pLights[i][2];\n// direction from surface to light position\nvec3 VP = ecLightPos - ecPosition;\n// compute distance between surface and light position\nfloat d = length(VP);\n// normalize the vector from surface to light position\nVP = normalize(VP);\n// compute attenuation\nfloat attenuation = 1.0 / dot(vec3(1.0,d,d*d),attenuationVector); // short for constA + liniearA * d + quadraticA * d^2\nfloat nDotVP = max(0.0, dot(normal, VP));\ndiffuse += colorIntensity*nDotVP * attenuation;\n}\nreturn diffuse;\n}\nvoid getPointLight(vec3 normal, vec3 ecPosition, mat3 pLights[LIGHTS],float specularExponent, out vec3 diffuse, out float specular){\ndiffuse = vec3(0.0, 0.0, 0.0);\nspecular = 0.0;\nvec3 eye = vec3(0.0,0.0,1.0);\nfor (int i=0;i<LIGHTS;i++){\nvec3 ecLightPos = pLights[i][0]; // light position in eye coordinates\nvec3 colorIntensity = pLights[i][1];\nvec3 attenuationVector = pLights[i][2];\n// direction from surface to light position\nvec3 VP = ecLightPos - ecPosition;\n// compute distance between surface and light position\nfloat d = length(VP);\n// normalize the vector from surface to light position\nVP = normalize(VP);\n// compute attenuation\nfloat attenuation = 1.0 / dot(vec3(1.0,d,d*d),attenuationVector); // short for constA + liniearA * d + quadraticA * d^2\nvec3 halfVector = normalize(VP + eye);\nfloat nDotVP = max(0.0, dot(normal, VP));\nfloat nDotHV = max(0.0, dot(normal, halfVector));\nfloat pf;\nif (nDotVP == 0.0){\npf = 0.0;\n} else {\npf = pow(nDotHV, specularExponent);\n}\nbool isLightEnabled = (attenuationVector[0]+attenuationVector[1]+attenuationVector[2])>0.0;\nif (isLightEnabled){\ndiffuse += colorIntensity * nDotVP * attenuation;\nspecular += pf * attenuation;\n}\n}\n}\nvec3 getDirectionalLightDiffuse(vec3 normal, mat3 dLight){\nvec3 ecLightDir = dLight[0]; // light direction in eye coordinates\nvec3 colorIntensity = dLight[1];\nfloat diffuseContribution = max(dot(normal, ecLightDir), 0.0);\nreturn (colorIntensity * diffuseContribution);\n}\n// assumes that normal is normalized\nvoid getDirectionalLight(vec3 normal, mat3 dLight, float specularExponent, out vec3 diffuse, out float specular){\nvec3 ecLightDir = dLight[0]; // light direction in eye coordinates\nvec3 colorIntensity = dLight[1];\nvec3 halfVector = dLight[2];\nfloat diffuseContribution = max(dot(normal, ecLightDir), 0.0);\n\tfloat specularContribution = max(dot(normal, halfVector), 0.0);\nspecular = pow(specularContribution, specularExponent);\n\tdiffuse = (colorIntensity * diffuseContribution);\n}\nuniform mat3 _dLight;\nuniform vec3 _ambient;\nuniform mat3 _pLights[LIGHTS];\n","shadowmap.glsl":"varying vec4 vShadowMapCoord;\nuniform sampler2D _shadowMapTexture;\nconst float shadowBias = 0.005;\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 16777216.0 ), 1.0 / ( 65536.0 ), 1.0 / 256.0, 1.0 );\nreturn dot( rgba_depth, bit_shift );\n}\nfloat computeLightVisibility(){\nvec3 shadowCoord = vShadowMapCoord.xyz / vShadowMapCoord.w;\nif (shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0){\nvec4 packedShadowDepth = texture2D(_shadowMapTexture,shadowCoord.xy);\nbool isMaxDepth = dot(packedShadowDepth, vec4(1.0,1.0,1.0,1.0))==4.0;\nif (!isMaxDepth){\nfloat shadowDepth = unpackDepth(packedShadowDepth);\nif (shadowDepth > shadowCoord.z - shadowBias){\nreturn 1.0;\n}\nreturn 0.0;\n}\n}\nreturn 1.0; // if outside shadow map, then not occcluded\n}","specular_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec4 specularColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\n#pragma include \"shadowmap.glsl\"\nvoid main(void)\n{\nvec3 normal = normalize(vNormal);\nvec3 diffuse;\nfloat specular;\ngetDirectionalLight(normal, _dLight, specularExponent, diffuse, specular);\nvec3 diffusePoint;\nfloat specularPoint;\ngetPointLight(normal,vEcPosition, _pLights,specularExponent,diffusePoint,specularPoint);\nfloat visibility;\nif (SHADOWS){\nvisibility = computeLightVisibility();\n} else {\nvisibility = 1.0;\n}\nvec3 color = max((diffuse+diffusePoint)*visibility,_ambient.xyz)*mainColor.xyz;\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*color.xyz, 1.0)+vec4((specular+specularPoint)*specularColor.xyz,0.0);\n}\n","specular_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat4 _mv;\nuniform mat4 _lightMat;\nuniform mat3 _norm;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nvarying vec4 vShadowMapCoord;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\ngl_Position = _mvProj * v;\nvUv = uv1;\nvEcPosition = (_mv * v).xyz;\nvNormal= _norm * normal;\nvShadowMapCoord = _lightMat * v;\n} ","transparent_diffuse_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec4 specularColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\nvoid main(void)\n{\nvec3 normal = normalize(vNormal);\nvec3 diffuseDirectionalLight = getDirectionalLightDiffuse(normal,_dLight);\nvec3 diffusePointLight = getPointLightDiffuse(normal,vEcPosition, _pLights);\nvec4 color = vec4(max(diffuseDirectionalLight+diffusePointLight,_ambient.xyz),1.0)*mainColor;\ngl_FragColor = texture2D(mainTexture,vUv)*color;\n}\n","transparent_diffuse_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat3 _norm;\nuniform mat4 _mv;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\n// compute position\ngl_Position = _mvProj * v;\nvEcPosition = (_mv * v).xyz;\nvUv = uv1;\n// compute light info\nvNormal= _norm * normal;\n} ","transparent_specular_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nuniform vec4 mainColor;\nuniform float specularExponent;\nuniform vec4 specularColor;\nuniform sampler2D mainTexture;\n#pragma include \"light.glsl\"\nvoid main(void)\n{\nvec3 normal = normalize(vNormal);\nvec3 diffuse;\nfloat specular;\ngetDirectionalLight(normal, _dLight, specularExponent, diffuse, specular);\nvec3 diffusePoint;\nfloat specularPoint;\ngetPointLight(normal,vEcPosition, _pLights,specularExponent,diffusePoint,specularPoint);\nvec4 color = vec4(max(diffuse+diffusePoint,_ambient.xyz),1.0)*mainColor;\ngl_FragColor = texture2D(mainTexture,vUv)*color+vec4((specular+specularPoint)*specularColor.xyz,0.0);\n}\n","transparent_specular_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nuniform mat4 _mv;\nuniform mat3 _norm;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vEcPosition;\nvoid main(void) {\nvec4 v = vec4(vertex, 1.0);\n// compute position\ngl_Position = _mvProj * v;\nvEcPosition = (_mv * v).xyz;\nvUv = uv1;\n// compute light info\nvNormal= _norm * normal;\n} ","transparent_unlit_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nvoid main(void)\n{\ngl_FragColor = texture2D(mainTexture,vUv)*mainColor;\n}\n","transparent_unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nvarying vec2 vUv;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\n}","unlit_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nvoid main(void)\n{\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*mainColor.xyz,1.0);\n}\n","unlit_vertex_color_fs.glsl":"precision mediump float;\nvarying vec2 vUv;\nvarying vec4 vColor;\nuniform vec4 mainColor;\nuniform sampler2D mainTexture;\nvoid main(void)\n{\ngl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*mainColor.xyz*vColor.xyz,1.0);\n}\n","unlit_vertex_color_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nattribute vec4 color;\nuniform mat4 _mvProj;\nvarying vec2 vUv;\nvarying vec4 vColor;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\nvColor = color;\n}","unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\nuniform mat4 _mvProj;\nvarying vec2 vUv;\nvoid main(void) {\ngl_Position = _mvProj * vec4(vertex, 1.0);\nvUv = uv1;\n}"};
})();/*!
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

    var math = KICK.namespace("KICK.math"),
        vec2 = KICK.namespace("KICK.math.vec2"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat3 = KICK.namespace("KICK.math.mat3"),
        mat4 = KICK.namespace("KICK.math.mat4"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        aabb = KICK.namespace("KICK.math.aabb"),
        frustum = KICK.namespace("KICK.math.frustum"),
        min = Math.min,
        max = Math.max,
        sqrt = Math.sqrt,
        cos = Math.cos,
        acos = Math.acos,
        sin = Math.sin,
        asin = Math.asin,
        abs = Math.abs,
        tan = Math.tan,
        atan = Math.atan,
        atan2 = Math.atan2,
        PI = Math.PI,
        _epsilon = 0.00001,
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
     * @class vec2
     * @namespace KICK.math
     */
    math.vec2 = vec2;

    /**
     * See KICK.math.vec4.wrapArray
     * @method wrapArray
     * @param {Float32Array} array
     * @return {Array[KICK.math.vec2]} of vec2
     * @static
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
     * @static
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
     * @static
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
     * @static
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
     * @static
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
     * @static
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
     * Test to see if vectors are equal (difference is less than epsilon)
     * @method equal
     * @param {KICK.math.vec2} vec first operand
     * @param {KICK.math.vec2} vec2 second operand
     * @param {Number} epsilon Optional - default value is
     * @return {Boolean} true if two vectors are equals
     * @static
     */
    vec2.equal = function(vec, vec2, epsilon) {
        if (!epsilon){
            epsilon = _epsilon;
        }
        for (var i=0;i<2;i++){
            if (abs(vec[i]-vec2[i])>epsilon){
                return false;
            }
        }
        return true;
    };

    /**
     * Generates a unit vector of the same direction as the provided vec2
     * If vector length is 0, returns [0, 0]
     * @method normalize
     * @param {KICK.math.vec2} vec vec3 to normalize
     * @param {KICK.math.vec2} dest Optional, vec2 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec2} dest if specified, vec otherwise
     * @static
     */
    vec2.normalize = function(vec, dest) {
        if(!dest) { dest = vec; }

        var x = vec[0], y = vec[1];
        var len = sqrt(x*x + y*y);

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
     * @static
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
     * @static
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
     * @static
     */
    vec3.create = function(vec) {
        var dest = new Float32Array(3);

        if (vec) {
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
     * @static
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
     * @static
     */
    vec3.add = function(vec, vec2, dest) {
        if (!dest || vec === dest) {
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
     * @static
     */
    vec3.subtract = function(vec, vec2, dest) {
        if (!dest || vec === dest) {
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
     * Test to see if vectors are equal (difference is less than epsilon)
     * @method equal
     * @param {KICK.math.vec3} vec first operand
     * @param {KICK.math.vec3} vec2 second operand
     * @param {Number} epsilon Optional - default value is
     * @return {Boolean} true if two vectors are equals
     * @static
     */
    vec3.equal = function(vec, vec2, epsilon) {
        if (!epsilon){
            epsilon = _epsilon;
        }
        for (var i=0;i<3;i++){
            if (abs(vec[i]-vec2[i])>epsilon){
                return false;
            }
        }
        return true;
    };

    /**
     * Performs a vector multiplication
     * @method multiply
     * @param {KICK.math.vec3} vec first operand
     * @param {KICK.math.vec3} vec2 second operand
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     * @static
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
     * @static
     */
    vec3.negate = function(vec, dest) {
        if (!dest) { dest = vec; }

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
     * @static
     */
    vec3.scale = function(vec, val, dest) {
        if (!dest || vec === dest) {
            vec[0] *= val;
            vec[1] *= val;
            vec[2] *= val;
            return vec;
        }

        dest[0] = vec[0] * val;
        dest[1] = vec[1] * val;
        dest[2] = vec[2] * val;
        return dest;
    };

    /**
     * Generates a unit vector of the same direction as the provided vec3
     * If vector length is 0, returns [0, 0, 0]
     * @method normalize
     * @param {KICK.math.vec3} vec vec3 to normalize
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     * @static
     */
    vec3.normalize = function(vec, dest) {
        if (!dest) { dest = vec; }

        var x = vec[0], y = vec[1], z = vec[2],
            len = Math.sqrt(x * x + y * y + z * z);

        if (!len) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            return dest;
        } else if (len === 1) {
            dest[0] = x;
            dest[1] = y;
            dest[2] = z;
            return dest;
        }

        len = 1 / len;
        dest[0] = x * len;
        dest[1] = y * len;
        dest[2] = z * len;
        return dest;
    };

    /**
     * Generates the cross product of two vec3s
     * @method cross
     * @param {KICK.math.vec3} vec first operand
     * @param {KICK.math.vec3} vec2 second operand
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     * @static
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
     * @static
     */
    vec3.length = function(vec){
        var x = vec[0], y = vec[1], z = vec[2];
        return sqrt(x*x + y*y + z*z);
    };

    /**
     * Calculates the squared length of a vec3
     * @method lengthSqr
     * @param {KICK.math.vec3} vec vec3 to calculate squared length of
     * @return {Number} Squared length of vec
     * @static
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
     * @static
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
     * @static
     */
    vec3.direction = function(vec, vec2, dest) {
        if (!dest) { dest = vec; }

        var x = vec[0] - vec2[0],
            y = vec[1] - vec2[1],
            z = vec[2] - vec2[2],
            len = sqrt(x * x + y * y + z * z);

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
     * @static
     */
    vec3.lerp = function(vec, vec2, lerp, dest){
        if(!dest) { dest = vec; }

        dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
        dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
        dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);

        return dest;
    };

    /*
     * Calculates the euclidian distance between two vec3
     *
     * @method dist
     * @param {KICK.math.vec3} vec first vector
     * @param {KICK.math.vec3} vec2 second vector
     * @return {Number} distance between vec and vec2
     * @static
     */
    vec3.dist = function (vec, vec2) {
        var x = vec2[0] - vec[0],
            y = vec2[1] - vec[1],
            z = vec2[2] - vec[2];

        return Math.sqrt(x*x + y*y + z*z);
    };

    /*
     * Projects the specified vec3 from screen space into object space
     * Based on Mesa gluUnProject implementation at:
     * http://webcvs.freedesktop.org/mesa/Mesa/src/glu/mesa/project.c?revision=1.4&view=markup
     *
     * @method unproject
     * @param {KICK.math.vec3} vec screen-space vector to project
     * @param {KICK.math.mat4} modelView Model-View matrix
     * @param {KICK.math.mat4} proj Projection matrix
     * @param {KICK.math.vec4} viewport Viewport as given to gl.viewport [x, y, width, height]
     * @param {KICK.math.vec3} dest Optional, vec3 receiving unprojected result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     * @static
     */
    vec3.unproject = (function(){
        var m = new Float32Array(16);
        var v = new Float32Array(4);
        return function (vec, modelView, proj, viewport, dest) {
            if (!dest) { dest = vec; }

            v[0] = (vec[0] - viewport[0]) * 2.0 / viewport[2] - 1.0;
            v[1] = (vec[1] - viewport[1]) * 2.0 / viewport[3] - 1.0;
            v[2] = 2.0 * vec[2] - 1.0;
            v[3] = 1.0;

            mat4.multiply(proj, modelView, m);
            if(!mat4.inverse(m)) { return null; }

            mat4.multiplyVec4(m, v);
            if(v[3] === 0.0) { return null; }

            dest[0] = v[0] / v[3];
            dest[1] = v[1] / v[3];
            dest[2] = v[2] / v[3];

            return dest;
        }
    })();

    /**
     * Converts the spherical coordinates (in radians) to carterian coordinates.<br>
     * Spherical coordinates are mapped so vec[0] is radius, vec[1] is polar and vec[2] is elevation
     * @method sphericalToCarterian
     * @param {KICK.math.vec3} spherical spherical coordinates
     * @param {KICK.math.vec3} dest optionally if not specified a new vec3 is returned
     * @return {KICK.math.vec3} position in cartesian angles
     * @static
     */
    vec3.sphericalToCarterian = function(spherical, dest){
        var radius = spherical[0],
            polar = -spherical[1],
            elevation = spherical[2],
            a = radius * cos(elevation);
        if (!dest){
            dest = vec3.create();
        }
        dest[0] = a * cos(polar);
        dest[1] = radius * sin(elevation);
        dest[2] = a * sin(polar);
        return dest;
    };

    /**
     * Converts from cartesian coordinates to spherical coordinates (in radians)<br>
     * Spherical coordinates are mapped so vec[0] is radius, vec[1] is polar and vec[2] is elevation
     * @method cartesianToSpherical
     * @param {KICK.math.vec3} cartesian
     * @param {KICK.math.vec3} dest Optional
     * @return {KICK.math.vec3}
     * @static
     */
    vec3.cartesianToSpherical = function(cartesian, dest){
        var x = cartesian[0],
            y = cartesian[1],
            z = cartesian[2],
            sphericalX;
        if (x == 0)
            x = _epsilon;
        if (!dest){
            dest = vec3.create();
        }

        dest[0] = sphericalX = sqrt(x*x+y*y+z*z);
        dest[1] = -atan(z/x);
        if (x < 0){
            dest[1] += PI;
        }
        dest[2] = asin(y/sphericalX);
        return dest;
    };

    /**
     * Returns a string representation of a vector
     * @method str
     * @param {KICK.math.vec3} vec vec3 to represent as a string
     * @return {String} string representation of vec
     * @static
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
     * @static
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
     * @static
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
     * @static
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
     * @static
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
     * @static
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
     * @static
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
     * Test to see if vectors are equal (difference is less than epsilon)
     * @method equal
     * @param {KICK.math.vec4} vec first operand
     * @param {KICK.math.vec4} vec2 second operand
     * @param {Number} epsilon Optional - default value is
     * @return {Boolean} true if two vectors are equals
     * @static
     */
    vec4.equal = function(vec, vec2, epsilon) {
        if (!epsilon){
            epsilon = _epsilon;
        }
        for (var i=0;i<2;i++){
            if (abs(vec[i]-vec2[i])>epsilon){
                return false;
            }
        }
        return true;
    };

    /**
     * Performs a vector multiplication
     * @method multiply
     * @param {KICK.math.vec4} vec first operand
     * @param {KICK.math.vec4} vec2 second operand
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     * @static
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
     * @static
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
     * Calculates the length of a vec4
     * @method length
     * @param {KICK.math.vec4} vec vec4 to calculate length of
     * @return {Number} Length of vec
     * @static
     */
    vec4.length = function(vec){
        var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
        return sqrt(x*x + y*y + z*z + w*w);
    };

    /**
     * Calculates the dot product of two vec3s
     * @method dot
     * @param {KICK.math.vec4} vec first operand
     * @param {KICK.math.vec4} vec2 second operand
     * @return {Number} Dot product of vec and vec2
     * @static
     */
    vec4.dot = function(vec, vec2){
        return vec[0]*vec2[0] + vec[1]*vec2[1] + vec[2]*vec2[2] + vec[3]*vec2[3];
    };

    /**
     * Multiplies the components of a vec4 by a scalar value
     * @method scale
     * @param {KICK.math.vec4} vec vec4 to scale
     * @param {Number} val Numeric value to scale by
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     * @static
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
     * @static
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
     * @static
     */
    mat3.create = function(mat) {
        var dest = new Float32Array(9);

        if (mat) {
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
     * @static
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
     * @static
     */
    mat3.identity = function(dest) {
        if (!dest) { dest = mat3.create(); }
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
     * @static
     */
    mat3.transpose = function(mat, dest) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (!dest || mat === dest) {
            var a01 = mat[1], a02 = mat[2],
                a12 = mat[5];

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
     * @static
     */
    mat3.toMat4 = function(mat, dest) {
        if (!dest) { dest = mat4.create(); }

        dest[15] = 1;
        dest[14] = 0;
        dest[13] = 0;
        dest[12] = 0;

        dest[11] = 0;
        dest[10] = mat[8];
        dest[9] = mat[7];
        dest[8] = mat[6];

        dest[7] = 0;
        dest[6] = mat[5];
        dest[5] = mat[4];
        dest[4] = mat[3];

        dest[3] = 0;
        dest[2] = mat[2];
        dest[1] = mat[1];
        dest[0] = mat[0];

        return dest;
    };

    /**
     * Transform a mat3 into a rotation (quaternion).
     * @param {KICK.math.mat3} mat
     * @param {KICK.math.quat4} dest
     * @return {KICK.math.quat4}
     * @static
     */
    mat3.toQuat = function(mat,dest){
        // Code based on http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
        var m00 = mat[0],m10 = mat[1],m20 = mat[2],
            m01 = mat[3],m11 = mat[4],m21 = mat[5],
            m02 = mat[6],m12 = mat[7],m22 = mat[8],
            trace = m00 + m11 + m22,  // trace of matrix
            s;

        if(!dest) {
            dest = quat4.create();
        }
        if( trace > 0 ) {
            s = 0.5 / sqrt(trace+ 1.0);
            dest[0] = ( m21 - m12 ) * s;
            dest[1] = ( m02 - m20 ) * s;
            dest[2] = ( m10 - m01 ) * s;
            dest[3] = 0.25 / s;
        } else {
            if ( m00 > m11 && m00 > m22 ) {
                s = 2.0 * sqrt( 1.0 + m00 - m11 - m22);
                dest[0] = 0.25 * s;
                dest[1] = (m01 + m10 ) / s;
                dest[2] = (m02 + m20 ) / s;
                dest[3] = (m21 - m12 ) / s;
            } else if (m11 > m22) {
                s = 2.0 * sqrt( 1.0 + m11 - m00 - m22);
                dest[0] = (m01 + m10 ) / s;
                dest[1] = 0.25 * s;
                dest[2] = (m12 + m21 ) / s;
                dest[3] = (m02 - m20 ) / s;
            } else {
                s = 2.0 * sqrt( 1.0 + m22 - m00 - m11 );
                dest[0] = (m02 + m20 ) / s;
                dest[1] = (m12 + m21 ) / s;
                dest[2] = 0.25 * s;
                dest[3] = (m10 - m01 ) / s;
            }
        }
        return dest;
    }

    /**
     * Returns a string representation of a mat3
     * @method str
     * @param {KICK.math.mat3} mat mat3 to represent as a string
     * @return {String} string representation of mat
     * @static
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
     * @static
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
     * @static
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
     * @static
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
     * @static
     */
    mat4.setTRS = function(translate, rotateQuat, scale, dest){
        if (!dest) { dest = mat4.create(); }

        // Quaternion math
        var scaleX = scale[0], scaleY = scale[1], scaleZ = scale[2],
            x = rotateQuat[0], y = rotateQuat[1], z = rotateQuat[2], w = rotateQuat[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        dest[0] = (1 - (yy + zz))*scaleX;
        dest[1] = (xy + wz)*scaleX;
        dest[2] = (xz - wy)*scaleX;
        dest[3] = 0;
        dest[4] = (xy - wz)*scaleY;
        dest[5] = (1 - (xx + zz))*scaleY;
        dest[6] = (yz + wx)*scaleY;
        dest[7] = 0;
        dest[8] = (xz + wy)*scaleZ;
        dest[9] = (yz - wx)*scaleZ;
        dest[10] = (1 - (xx + yy))*scaleZ;
        dest[11] = 0;
        dest[12] = translate[0];
        dest[13] = translate[1];
        dest[14] = translate[2];
        dest[15] = 1;

        return dest;
    };

    /**
     * Set the inverse of translate, rotate, scale
     * @method setTRSInverse
     * @param {KICK.math.vec3} translate
     * @param {KICK.math.quat4} rotateQuat must be normalized
     * @param {KICK.math.vec3} scale
     * @param {KICK.math.mat4} dest Optinal
     * @return {KICK.math.mat4} dest if specified mat4 otherwise
     * @static
     */
    mat4.setTRSInverse = function(translate, rotateQuat, scale, dest){
        if (!dest) { dest = mat4.create(); }

        // Quaternion math
        var scaleX = scale[0], scaleY = scale[1], scaleZ = scale[2],
            x = rotateQuat[0], y = rotateQuat[1], z = rotateQuat[2], w = rotateQuat[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2,

            // compute trs
            a00 = (1 - (yy + zz))*scaleX,
            a01 = (xy + wz)*scaleX,
            a02 = (xz - wy)*scaleX,
            a10 = (xy - wz)*scaleY,
            a11 = (1 - (xx + zz))*scaleY,
            a12 = (yz + wx)*scaleY,
            a20 = (xz + wy)*scaleZ,
            a21 = (yz - wx)*scaleZ,
            a22 = (1 - (xx + yy))*scaleZ,
            a30 = translate[0],
            a31 = translate[1],
            a32 = translate[2],
            a33 = 1,
            // compute inverse
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b03 = a01 * a12 - a02 * a11,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33,
            b11 = a22 * a33,

            d = (b00 * b11 - b01 * b10 + b03 * b08),
            invDet;

        // Calculate the determinant
        if (!d) { return null; }
        invDet = 1 / d;

        dest[0] = (a11 * b11 - a12 * b10) * invDet;
        dest[1] = (-a01 * b11 + a02 * b10) * invDet;
        dest[2] = (a33 * b03) * invDet;
        dest[3] = 0;
        dest[4] = (-a10 * b11 + a12 * b08) * invDet;
        dest[5] = (a00 * b11 - a02 * b08) * invDet;
        dest[6] = (- a33 * b01) * invDet;
        dest[7] = 0;
        dest[8] = (a10 * b10 - a11 * b08) * invDet;
        dest[9] = (-a00 * b10 + a01 * b08) * invDet;
        dest[10] = (a33 * b00) * invDet;
        dest[11] = 0;
        dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
        dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
        dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

        return dest;
    };

    /**
     * Sets a mat4 to an identity matrix
     * @method identity
     * @param {KICK.math.mat4} dest mat4 to set
     * @return {KICK.math.mat4} dest
     * @static
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
     * @static
     */
    mat4.transpose = function(mat, dest) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (!dest || mat === dest) {
            var a01 = mat[1], a02 = mat[2], a03 = mat[3],
                a12 = mat[6], a13 = mat[7],
                a23 = mat[11];

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
     * @static
     */
    mat4.determinant = function(mat) {
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
            a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
            a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
            a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

        return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
            a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
            a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
            a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
            a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
            a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
    };

    /**
     * Calculates the inverse matrix of a mat4
     * @method inverse
     * @param {KICK.math.mat4} mat mat4 to calculate inverse of
     * @param {KICK.math.mat4} dest Optional, mat4 receiving inverse matrix. If not specified result is written to mat
     * @return {KICK.math.mat4} dest is specified, mat otherwise
     * @static
     */
    mat4.inverse = function(mat, dest) {
        if (!dest) { dest = mat; }

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
            a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
            a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
            a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
            invDet;

        // Calculate the determinant
        if (!d) { return null; }
        invDet = 1 / d;

        dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
        dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
        dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
        dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
        dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
        dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
        dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
        dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
        dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

        return dest;
    };

    /**
     * Copies the upper 3x3 elements of a mat4 into another mat4
     * @method toRotationMat
     * @param {KICK.math.mat4} mat mat4 containing values to copy
     * @param {KICK.math.mat4} dest Optional, mat4 receiving copied values
     * @return {KICK.math.mat4} dest is specified, a new mat4 otherwise
     * @static
     */
    mat4.toRotationMat = function(mat, dest) {
        if (!dest) { dest = mat4.create(); }

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
     * @return {KICK.math.mat3} dest is specified, a new mat3 otherwise
     * @static
     */
    mat4.toMat3 = function(mat, dest) {
        if (!dest) { dest = mat3.create(); }

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
     * @static
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
     * @static
     */
    mat4.toInverseMat3 = function(mat, dest) {
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2],
            a10 = mat[4], a11 = mat[5], a12 = mat[6],
            a20 = mat[8], a21 = mat[9], a22 = mat[10],

            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,

            d = a00 * b01 + a01 * b11 + a02 * b21,
            id;

        if (!d) { return null; }
        id = 1 / d;

        if (!dest) { dest = mat3.create(); }

        dest[0] = b01 * id;
        dest[1] = (-a22 * a01 + a02 * a21) * id;
        dest[2] = (a12 * a01 - a02 * a11) * id;
        dest[3] = b11 * id;
        dest[4] = (a22 * a00 - a02 * a20) * id;
        dest[5] = (-a12 * a00 + a02 * a10) * id;
        dest[6] = b21 * id;
        dest[7] = (-a21 * a00 + a01 * a20) * id;
        dest[8] = (a11 * a00 - a01 * a10) * id;

        return dest;
    };

    /**
     * Performs a matrix multiplication
     * @method multiply
     * @param {KICK.math.mat4} mat first operand
     * @param {KICK.math.mat4} mat2 second operand
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     * @static
     */
    mat4.multiply = function(mat, mat2, dest) {
        if (!dest) { dest = mat; }

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
            a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
            a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
            a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

            b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3],
            b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7],
            b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11],
            b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];

        dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

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
     * @static
     */
    mat4.multiplyVec3 = function(mat, vec, dest) {
        if (!dest) { dest = vec; }

        var x = vec[0], y = vec[1], z = vec[2];

        dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
        dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
        dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

        return dest;
    };

    /**
     * Transforms a vec3 with the given matrix<br>
     * 4th vector component is implicitly '0'
     * @method multiplyVec3Vector
     * @param {KICK.math.mat4} mat mat4 to transform the vector with
     * @param {KICK.math.vec3} vec vec3 to transform
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     * @static
     */
    mat4.multiplyVec3Vector = function(mat, vec, dest) {
        if(!dest) { dest = vec }

        var x = vec[0], y = vec[1], z = vec[2];

        dest[0] = mat[0]*x + mat[4]*y + mat[8]*z;
        dest[1] = mat[1]*x + mat[5]*y + mat[9]*z;
        dest[2] = mat[2]*x + mat[6]*y + mat[10]*z;
        dest[3] = mat[3]*x + mat[7]*y + mat[11]*z;

        return dest;
    };

    /**
     * Transforms a vec4 with the given matrix
     * @method multiplyVec4
     * @param {KICK.math.mat4} mat mat4 to transform the vector with
     * @param {KICK.math.vec4} vec vec4 to transform
     * @param {KICK.math.vec4} dest Optional, vec4 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec4} dest if specified, vec otherwise
     * @static
     */
    mat4.multiplyVec4 = function(mat, vec, dest) {
        if (!dest) { dest = vec; }

        var x = vec[0], y = vec[1], z = vec[2], w = vec[3];

        dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
        dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
        dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
        dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;

        return dest;
    };

    /**
     * Translates a matrix by the given vector
     * @method translate
     * @param {KICK.math.mat4} mat mat4 to translate
     * @param {KICK.math.vec3} vec vec3 specifying the translation
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     * @static
     */
    mat4.translate = function(mat, vec, dest) {
        var x = vec[0], y = vec[1], z = vec[2],
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23;

        if (!dest || mat === dest) {
            mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
            mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
            mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
            mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
            return mat;
        }

        a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
        a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
        a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];

        dest[0] = a00; dest[1] = a01; dest[2] = a02; dest[3] = a03;
        dest[4] = a10; dest[5] = a11; dest[6] = a12; dest[7] = a13;
        dest[8] = a20; dest[9] = a21; dest[10] = a22; dest[11] = a23;

        dest[12] = a00 * x + a10 * y + a20 * z + mat[12];
        dest[13] = a01 * x + a11 * y + a21 * z + mat[13];
        dest[14] = a02 * x + a12 * y + a22 * z + mat[14];
        dest[15] = a03 * x + a13 * y + a23 * z + mat[15];
        return dest;
    };

    /**
     * Scales a matrix by the given vector
     * @method scale
     * @param {KICK.math.mat4} mat mat4 to scale
     * @param {KICK.math.vec3} vec vec3 specifying the scale for each axis
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     * @static
     */
    mat4.scale = function(mat, vec, dest) {
        var x = vec[0], y = vec[1], z = vec[2];

        if(!dest || mat === dest) {
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
     * Rotates a matrix by the given angle around the specified axis<br>
     * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for
     * performance
     * @method rotate
     * @param {KICK.math.mat4} mat mat4 to rotate
     * @param {Number} angle angle (in radians) to rotate
     * @param {KICK.math.vec3} axis vec3 representing the axis to rotate around
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to mat
     * @return {KICK.math.mat4} dest if specified, mat otherwise
     * @static
     */
    mat4.rotate = function(mat, angle, axis, dest) {
        var x = axis[0], y = axis[1], z = axis[2],
            s,c,t,
            a00,a01,a02,a03,
            a10,a11,a12,a13,
            a20,a21,a22,a23,
            b00,b01,b02,
            b10,b11,b12,
            b20,b21,b22;
        var len = sqrt(x*x + y*y + z*z);
        if (!len) { return null; }
        if (len !== 1) {
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
        }

        s = sin(angle);
        c = cos(angle);
        t = 1-c;

        // Cache the matrix values (makes for huge speed increases!)
        a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
        a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
        a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];

        // Construct the elements of the rotation matrix
        b00 = x*x*t + c; b01 = y*x*t + z*s; b02 = z*x*t - y*s;
        b10 = x*y*t - z*s; b11 = y*y*t + c; b12 = z*y*t + x*s;
        b20 = x*z*t + y*s; b21 = y*z*t - x*s; b22 = z*z*t + c;

        if(!dest) {
            dest = mat;
        } else if(mat !== dest) { // If the source and destination differ, copy the unchanged last row
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
     * @static
     */
    mat4.rotateX = function(mat, angle, dest) {
        var s = sin(angle);
        var c = cos(angle);

        // Cache the matrix values (makes for huge speed increases!)
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

        if(!dest) {
            dest = mat;
        } else if(mat !== dest) { // If the source and destination differ, copy the unchanged rows
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
     * @static
     */
    mat4.rotateY = function(mat, angle, dest) {
        var s = sin(angle);
        var c = cos(angle);

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

        if(!dest) {
            dest = mat;
        } else if(mat !== dest) { // If the source and destination differ, copy the unchanged rows
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
     * @static
     */
    mat4.rotateZ = function(mat, angle, dest) {
        var s = sin(angle);
        var c = cos(angle);

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];

        if(!dest) {
            dest = mat;
        } else if(mat !== dest) { // If the source and destination differ, copy the unchanged last row
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
     * @static
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
     * @static
     */
    mat4.perspective = function(fovy, aspect, near, far, dest) {
        var top = near*tan(fovy*PI / 360.0);
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
     * @static
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
     * @static
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
        len = 1/sqrt(z0*z0 + z1*z1 + z2*z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        //vec3.normalize(vec3.cross(up, z, x));
        x0 = upy*z2 - upz*z1;
        x1 = upz*z0 - upx*z2;
        x2 = upx*z1 - upy*z0;
        len = sqrt(x0*x0 + x1*x1 + x2*x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1/len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        //vec3.normalize(vec3.cross(z, x, y));
        y0 = z1*x2 - z2*x1;
        y1 = z2*x0 - z0*x2;
        y2 = z0*x1 - z1*x0;

        len = sqrt(y0*y0 + y1*y1 + y2*y2);
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
     * @method decompose
     * @param {KICK.math.mat4} mat mat4 to decompose
     * @param {KICK.math.vec3} translate Optional
     * @param {KICK.math.quat4} rotate Optional
     * @param {KICK.math.vec3} scale Optional
     * @return Array[tranlate,rotate,scale]
     * @static
     */
    mat4.decompose = (function(){
        var copy = mat4.create();
        return function(mat,tranlate,rotate,scale){
            var x = [mat[0],mat[1],mat[2]],
                y = [mat[4],mat[5],mat[6]],
                z = [mat[8],mat[9],mat[10]],
                scaleX,
                scaleY,
                scaleZ;

            if (!tranlate){
                tranlate = vec3.create();
            }
            if (!rotate){
                rotate = quat4.create();
            }
            if (!scale){
                scale = vec3.create();
            }

            tranlate[0] = mat[12];
            tranlate[1] = mat[13];
            tranlate[2] = mat[14];

            scale[0] = scaleX = vec3.length(x);
            scale[1] = scaleY = vec3.length(y);
            scale[2] = scaleZ = vec3.length(z);

            mat4.set(mat,copy);

            copy[0] /= scaleX;
            copy[1] /= scaleX;
            copy[2] /= scaleX;

            copy[4] /= scaleY;
            copy[5] /= scaleY;
            copy[6] /= scaleY;

            copy[8] /= scaleZ;
            copy[9] /= scaleZ;
            copy[10] /= scaleZ;


            quat4.setFromRotationMatrix(copy,rotate);

            return [tranlate, rotate, scale];
        };
    })();

    /*
     * mat4.fromRotationTranslation
     * Creates a matrix from a quaternion rotation and vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     var quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *
     *
     * @method fromRotationTranslation
     * @param {KICK.math.quat4} quat specifying the rotation by
     * @param {KICK.math.vec3} vec specifying the translation
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result. If not specified result is written to a new mat4
     * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
     * @static
     */
    mat4.fromRotationTranslation = function (quat, vec, dest) {
        if (!dest) { dest = mat4.create(); }

        // Quaternion math
        var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        dest[0] = 1 - (yy + zz);
        dest[1] = xy + wz;
        dest[2] = xz - wy;
        dest[3] = 0;
        dest[4] = xy - wz;
        dest[5] = 1 - (xx + zz);
        dest[6] = yz + wx;
        dest[7] = 0;
        dest[8] = xz + wy;
        dest[9] = yz - wx;
        dest[10] = 1 - (xx + yy);
        dest[11] = 0;
        dest[12] = vec[0];
        dest[13] = vec[1];
        dest[14] = vec[2];
        dest[15] = 1;

        return dest;
    };

    /**
     * Returns a string representation of a mat4
     * @method str
     * @param {KICK.math.mat4} mat mat4 to represent as a string
     * @return {String} string representation of mat
     * @static
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
     * @static
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
     * @static
     */
    quat4.create = vec4.create;

    /**
     * Copies the values of one quat4 to another
     * @method set
     * @param {KICK.math.quat4} quat quat4 containing values to copy
     * @param {KICK.math.quat4} dest quat4 receiving copied values
     * @return {KICK.math.quat4} dest
     * @static
     */
    quat4.set = vec4.set;

    /**
     * Calculates the W component of a quat4 from the X, Y, and Z components.<br>
     * Assumes that quaternion is 1 unit in length.<br>
     * Any existing W component will be ignored.
     * @method calculateW
     * @param {KICK.math.quat4} quat quat4 to calculate W component of
     * @param {KICK.math.quat4} dest Optional, quat4 receiving calculated values. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     * @static
     */
    quat4.calculateW = function(quat, dest) {
        var x = quat[0], y = quat[1], z = quat[2],
            w = -sqrt(abs(1.0 - x*x - y*y - z*z));

        if(!dest || quat == dest) {
            quat[3] = w;
            return quat;
        }
        dest[0] = x;
        dest[1] = y;
        dest[2] = z;
        dest[3] = w;
        return dest;
    };

    /**
     * Calculates the inverse of a quat4.
     * Note that if the quat is normalized, it is much faster to use quat4.conjugate
     * @method inverse
     * @param {KICK.math.quat4} quat quat4 to calculate inverse of
     * @param {KICK.math.quat4} dest Optional, quat4 receiving inverse values. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     * @static
     */
    quat4.inverse = function(quat, dest) {
        var dot = quat4.dot(quat,quat),
            invDot = 1.0/dot;
        if(!dest || quat == dest) {
            quat[0] *= -invDot;
            quat[1] *= -invDot;
            quat[2] *= -invDot;
            quat[3] *= invDot;
            return quat;
        }
        dest[0] = -quat[0]*invDot;
        dest[1] = -quat[1]*invDot;
        dest[2] = -quat[2]*invDot;
        dest[3] = quat[3]*invDot;
        return dest;
    };

    /**
     * Calculates the conjugate of a quat4
     * @method conjugate
     * @param {KICK.math.quat4} quat quat4 to calculate conjugate of
     * @param {KICK.math.quat4} dest Optional, quat4 receiving inverse values. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     * @static
     */
    quat4.conjugate = function(quat, dest) {
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
    };

    /**
     * Calculates the length of a quat4
     * @method length
     * @param {KICK.math.quat4} quat quat4 to calculate length of
     * @return {Number} Length of quat
     * @static
     */
    quat4.length = vec4.length;

    /**
     * Returns dot product of q1 and q1
     * @method dot
     * @param {KICK.math.quat4} q1
     * @param {KICK.math.quat4} q2
     * @return {Number}
     * @static
     */
    quat4.dot = vec4.dot;

    /**
     * Generates a unit quaternion of the same direction as the provided quat4<br>
     * If quaternion length is 0, returns [0, 0, 0, 0]
     * @method normalize
     * @param {KICK.math.quat4} quat quat4 to normalize
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     * @static
     */
    quat4.normalize = function(quat, dest) {
        if (!dest) { dest = quat; }

        var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
            len = Math.sqrt(x * x + y * y + z * z + w * w);
        if (len === 0) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            return dest;
        }
        len = 1 / len;
        dest[0] = x * len;
        dest[1] = y * len;
        dest[2] = z * len;
        dest[3] = w * len;

        return dest;
    };

    /**
     * Performs a quaternion multiplication
     * @method multiply
     * @param {KICK.math.quat4} quat first operand
     * @param {KICK.math.quat4} quat2 second operand
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     * @static
     */
    quat4.multiply = function(quat, quat2, dest) {
        if (!dest) { dest = quat; }

        var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3],
            qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];

        dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        return dest;
    };

    /**
     * Transforms a vec3 with the given quaternion
     * @method multiplyVec3
     * @param {KICK.math.quat4} quat quat4 to transform the vector with
     * @param {KICK.math.vec3} vec vec3 to transform
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
     * @static
     */
    quat4.multiplyVec3 = function(quat, vec, dest) {
        if (!dest) { dest = vec; }

        var x = vec[0], y = vec[1], z = vec[2],
            qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3],

            // calculate quat * vec
            ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return dest;
    };

    /**
     * Set the identity to the quaternion (0,0,0,1)
     * @method identity
     * @param {KICK.math.quat4} dest Optional, quat4 to set the identity to
     * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
     * @static
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
     * Pitch->X axis, Yaw->Y axis, Roll->Z axis
     * @method toEuler
     * @param {KICK.math.quat4} quat quat4 to create matrix from
     * @param {KICK.math.vec3} dest Optional, vec3  receiving operation result
     * @return {KICK.math.vec3} dest if specified, a new vec3 otherwise
     * @static
     */
    quat4.toEuler = function(quat, dest) {
        var x = quat[0], y = quat[1], z = quat[2],w = quat[3],
            yy = y*y,
            radianToDegree = 57.2957795130824;

        if(!dest) { dest = vec3.create(); }

        dest[0] = atan2(2*(w*x+y*z),1-2*(x*x+yy))*radianToDegree;
        dest[1] = asin(2*(w*y-z*x))*radianToDegree;
        dest[2] = atan2(2*(w*z+x*y),1-2*(yy+z*z))*radianToDegree;

        return dest;
    };

    /**
     * Set the rotation based on an angle and a axis
     * @method angleAxis
     * @param {Number} angle rotation angle in degrees
     * @param {KICK.math.vec3} vec normalized axis
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result
     * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
     * @static
     */
    quat4.angleAxis = function(angle,vec, dest) {
        var degreeToRadian = 0.01745329251994,
            angleRadiansHalf = degreeToRadian*0.5*angle,
            s = sin(angleRadiansHalf);
        if(!dest) { dest = quat4.create(); }

        dest[3] = cos(angleRadiansHalf);
        dest[2] = vec[2]*s;
        dest[1] = vec[1]*s;
        dest[0] = vec[0]*s;

        return dest;
    };

    /**
     * Compute the lookAt rotation
     * @method lookAt
     * @param {KICK.math.vec3} position
     * @param {KICK.math.vec3} target
     * @param {KICK.math.vec3} up
     * @param {KICK.math.quat4} dest optional
     * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
     * @static
     */
    quat4.lookAt = (function(){
        var upVector = vec3.create(),
            rightVector = vec3.create(),
            forwardVector = vec3.create(),
            destMatrix = mat3.create();
        return function(position,target,up,dest){
            // idea create mat3 rotation and transform into quaternion
            vec3.subtract(position,target, forwardVector);
            vec3.normalize(forwardVector);
            vec3.cross(up,forwardVector,rightVector);
            vec3.normalize(rightVector); // needed?
            vec3.cross(forwardVector,rightVector,upVector);
            vec3.normalize(upVector); // needed?
            destMatrix[0] = rightVector[0];
            destMatrix[1] = rightVector[1];
            destMatrix[2] = rightVector[2];
            destMatrix[3] = upVector[0];
            destMatrix[4] = upVector[1];
            destMatrix[5] = upVector[2];
            destMatrix[6] = forwardVector[0];
            destMatrix[7] = forwardVector[1];
            destMatrix[8] = forwardVector[2];
        
            return mat3.toQuat(destMatrix,dest);
        };
    })();
    /**
     * Set the rotation based on eulers angles.
     * Pitch->X axis, Yaw->Y axis, Roll->Z axis
     * @method setEuler
     * @param {KICK.math.vec3} vec vec3 eulers angles (degrees)
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result
     * @return {KICK.math.quat4} dest if specified, a new quat4 otherwise
     * @static
     */
    quat4.setEuler = function(vec, dest) {
        // code based on GLM
        var degreeToRadian = 0.01745329251994,
            halfDTR = degreeToRadian * 0.5,
            x = vec[0] * halfDTR,y=vec[1] * halfDTR,z=vec[2] * halfDTR,
            cx = cos(x), cy = cos(y), cz = cos(z),
            sx = sin(x), sy = sin(y), sz = sin(z);
        if(!dest) {
            dest = quat4.create();
        }
        dest[3] = cx * cy * cz + sx * sy * sz;
        dest[0] = sx * cy * cz - cx * sy * sz;
        dest[1] = cx * sy * cz + sx * cy * sz;
        dest[2] = cx * cy * sz - sx * sy * cz;
        return dest;
    };


    /**
     * @method setFromRotationMatrix
     * @param {KICK.math.mat4} mat
     * @param {KICK.math.quat4} dest Optional
     * @return {KICK.math.quat4}
     * @static
     */
    quat4.setFromRotationMatrix = function(mat,dest){
        var x,y,z,w,
            m00 = mat[0],m01 = mat[4],m02 = mat[8],
            m10 = mat[1],m11 = mat[5],m12 = mat[9],
            m20 = mat[2],m21 = mat[6],m22 = mat[10];
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
		function copySign(a, b) {
			return b < 0 ? -Math.abs(a) : Math.abs(a);
		}
        var absQ = Math.pow(mat4.determinant(mat), 1.0 / 3.0);
		w = Math.sqrt( Math.max( 0, absQ + m00  + m11 + m22 ) ) / 2;
		x = Math.sqrt( Math.max( 0, absQ + m00  - m11 - m22 ) ) / 2;
		y = Math.sqrt( Math.max( 0, absQ - m00  + m11 - m22 ) ) / 2;
		z = Math.sqrt( Math.max( 0, absQ - m00  - m11 + m22 ) ) / 2;
		x = copySign( x, ( m21 - m12 ) ); // m21 - m12
		y = copySign( y, ( m02 - m20 ) ); // m02 - m20
		z = copySign( z, ( m10 - m01 ) ); // m10 - m01
        var destArray = [x,y,z,w];
        if (!dest){
            dest = quat4.create(destArray);
        } else {
            quat4.set(destArray,dest);
        }
		quat4.normalize(dest);
		return dest;
    };

    /**
     * Calculates a 3x3 matrix from the given quat4
     * @method toMat3
     * @param {KICK.math.quat4} quat quat4 to create matrix from
     * @param {KICK.math.mat3} dest Optional, mat3 receiving operation result
     * @return {KICK.math.mat3} dest if specified, a new mat3 otherwise
     * @static
     */
    quat4.toMat3 = function(quat, dest) {
        if (!dest) { dest = mat3.create(); }

        var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        dest[0] = 1 - (yy + zz);
        dest[1] = xy + wz;
        dest[2] = xz - wy;

        dest[3] = xy - wz;
        dest[4] = 1 - (xx + zz);
        dest[5] = yz + wx;

        dest[6] = xz + wy;
        dest[7] = yz - wx;
        dest[8] = 1 - (xx + yy);

        return dest;
    };

    /**
     * Calculates a 4x4 matrix from the given quat4
     * @method toMat4
     * @param {KICK.math.quat4} quat quat4 to create matrix from
     * @param {KICK.math.mat4} dest Optional, mat4 receiving operation result
     * @return {KICK.math.mat4} dest if specified, a new mat4 otherwise
     * @static
     */
    quat4.toMat4 = function(quat, dest) {
        if (!dest) { dest = mat4.create(); }

        var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        dest[0] = 1 - (yy + zz);
        dest[1] = xy + wz;
        dest[2] = xz - wy;
        dest[3] = 0;

        dest[4] = xy - wz;
        dest[5] = 1 - (xx + zz);
        dest[6] = yz + wx;
        dest[7] = 0;

        dest[8] = xz + wy;
        dest[9] = yz - wx;
        dest[10] = 1 - (xx + yy);
        dest[11] = 0;

        dest[12] = 0;
        dest[13] = 0;
        dest[14] = 0;
        dest[15] = 1;

        return dest;
    };

    /**
     * Performs a spherical linear interpolation between two quat4
     * @method slerp
     * @param {KICK.math.quat4} quat first quaternion
     * @param {KICK.math.quat4} quat2 second quaternion
     * @param {Number} slerp interpolation amount between the two inputs
     * @param {KICK.math.quat4} dest Optional, quat4 receiving operation result. If not specified result is written to quat
     * @return {KICK.math.quat4} dest if specified, quat otherwise
     * @static
     */
    quat4.slerp = function(quat, quat2, slerp, dest) {
        if(!dest) { dest = quat; }

        var cosHalfTheta =  quat[0]*quat2[0] + quat[1]*quat2[1] + quat[2]*quat2[2] + quat[3]*quat2[3];

        if (abs(cosHalfTheta) >= 1.0){
            if(dest != quat) {
                dest[0] = quat[0];
                dest[1] = quat[1];
                dest[2] = quat[2];
                dest[3] = quat[3];
            }
            return dest;
        }

        var halfTheta = acos(cosHalfTheta),
            sinHalfTheta = sqrt(1.0 - cosHalfTheta*cosHalfTheta);

        if (abs(sinHalfTheta) < 0.001){
            dest[0] = (quat[0]*0.5 + quat2[0]*0.5);
            dest[1] = (quat[1]*0.5 + quat2[1]*0.5);
            dest[2] = (quat[2]*0.5 + quat2[2]*0.5);
            dest[3] = (quat[3]*0.5 + quat2[3]*0.5);
            return dest;
        }

        var ratioA = sin((1 - slerp)*halfTheta) / sinHalfTheta,
            ratioB = sin(slerp*halfTheta) / sinHalfTheta;

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
     * @static
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
     * @static
     */
    quat4.str = function(quat) {
        return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
    };

    // glMatrix end



    /**
     * Axis-Aligned Bounding Box. A rectangle or box with the restriction that it's sides or faces are parallel to the
     * axes of the system.
     * The aabb is represented using an array: [min_x,min_y,min_z,max_x,max_y,max_z]
     * @class aabb
     * @namespace KICK.math
     */
    math.aabb = aabb;

    /**
     * Default value is min=MAX, max=MIN (meaning that it has a negative size)
     * @method create
     * @param {Array[Number] | KICK.math.aabb} vec3Min Optional, vec3Min containing values to initialize minimum values with Default. Or an aabb.
     * @param {Array[Number]} vec3Max Optional, vec3Max containing values to initialize maximum values with
     * @return {KICK.math.aabb} New aabb
     * @static
     */
    aabb.create = function(vec3Min, vec3Max){
        var dest = new Float32Array(6);

        if(vec3Min) {
            dest[0] = vec3Min[0];
            dest[1] = vec3Min[1];
            dest[2] = vec3Min[2];
            if (vec3Min.length==6){
                dest[3] = vec3Min[3];
                dest[4] = vec3Min[4];
                dest[5] = vec3Min[5];
            } else if (vec3Max){
                dest[3] = vec3Max[0];
                dest[4] = vec3Max[1];
                dest[5] = vec3Max[2];
            } else {
                dest[3] = dest[0];
                dest[4] = dest[1];
                dest[5] = dest[2];
            }
        } else {
            dest[0] = Number.MAX_VALUE;
            dest[1] = Number.MAX_VALUE;
            dest[2] = Number.MAX_VALUE;
            dest[3] = -Number.MAX_VALUE;
            dest[4] = -Number.MAX_VALUE;
            dest[5] = -Number.MAX_VALUE;
        }
        return dest;
    };

    /**
     * Copies the values of one aabb to another
     * @method set
     * @param {KICK.math.aabb} aabb containing values to copy
     * @param {KICK.math.aabb} dest receiving copied values
     * @return {KICK.math.aabb} dest
     * @static
     */
    aabb.set = function(aabb,dest){
        dest[0] = aabb[0];
        dest[1] = aabb[1];
        dest[2] = aabb[2];
        dest[3] = aabb[3];
        dest[4] = aabb[4];
        dest[5] = aabb[5];
        return dest;
    };

    /**
     * Transforms the eight points of the Axis-Aligned Bounding Box into a new AABB
     * @method transform
     * @param {KICK.math.aabb} aabbIn
     * @param {KICK.math.mat4} mat
     * @param {KICK.math.aabb} dest Optional new aabb create if not specified
     * @return {KICK.math.aabb}
     * @static
     */
    aabb.transform = (function(){
        var point = vec3.create();
        return function(aabbIn, mat,dest){
            var max = Number.MAX_VALUE,
                min = -Number.MAX_VALUE;
            if (!dest){
                dest = aabb.create();
            } else {
                aabb.set([max,max,max,min,min,min],dest);
            }
            for (var i=0;i<2;i++){
                for (var j=0;j<2;j++){
                    for (var k=0;k<2;k++){
                        point[0] = aabbIn[i*3];
                        point[1] = aabbIn[j*3+1];
                        point[2] = aabbIn[k*3+2];
                        var transformedPoint = mat4.multiplyVec3(mat,point);
                        aabb.addPoint(dest,transformedPoint);
                    }
                }
            }
            return dest;
        }})();

    /**
     * @method merge
     * @param {KICK.math.aabb} aabb
     * @param {KICK.math.aabb} aabb2
     * @param {KICK.math.aabb} dest Optional, receiving copied values - otherwise using aabb
     * @return {KICK.math.aabb} dest if specified - otherwise a new value is returned
     * @static
     */
    aabb.merge = function(aabb,aabb2,dest){
        if (!dest){
            dest = aabb;
        }
        dest[0] = min(aabb[0],aabb2[0]);
        dest[1] = min(aabb[1],aabb2[1]);
        dest[2] = min(aabb[2],aabb2[2]);
        dest[3] = max(aabb[3],aabb2[3]);
        dest[4] = max(aabb[4],aabb2[4]);
        dest[5] = max(aabb[5],aabb2[5]);
        return dest;
    };

    /**
     * @method addPoint
     * @param {KICK.math.aabb} aabb
     * @param {KICK.math.vec3} vec3Point
     * @return {KICK.math.aabb} aabb (same object as input)
     * @static
     */
    aabb.addPoint = function(aabb,vec3Point){
        var vpX = vec3Point[0],
            vpY = vec3Point[1],
            vpZ = vec3Point[2];
        aabb[0] = min(aabb[0],vpX);
        aabb[1] = min(aabb[1],vpY);
        aabb[2] = min(aabb[2],vpZ);
        aabb[3] = max(aabb[3],vpX);
        aabb[4] = max(aabb[4],vpY);
        aabb[5] = max(aabb[5],vpZ);
        return aabb;
    };

    /**
     * @method center
     * @param {KICK.math.aabb} aabb
     * @param {KICK.math.vec3} centerVec3 Optional
     * @return {KICK.math.vec3} Center of aabb, (centerVec3 if specified)
     * @static
     */
    aabb.center = function(aabb,centerVec3){
        if (!centerVec3){
            centerVec3 = vec3.create();
        }
        centerVec3[0] = (aabb[0]+aabb[3])*0.5;
        centerVec3[1] = (aabb[1]+aabb[4])*0.5;
        centerVec3[2] = (aabb[2]+aabb[5])*0.5;

        return centerVec3;
    };

    /**
     * @method halfVector
     * @param {KICK.math.aabb} aabb
     * @param {KICK.math.vec3} halfVec3 Optional
     * @return {KICK.math.vec3} Halfvector of aabb, (halfVec3 if specified)
     * @static
     */
    aabb.halfVec3 = function(aabb,halfVec3){
        if (!halfVec3){
            halfVec3 = vec3.create();
        }
        halfVec3[0] = (aabb[3]-aabb[0])*0.5;
        halfVec3[1] = (aabb[4]-aabb[1])*0.5;
        halfVec3[2] = (aabb[5]-aabb[2])*0.5;

        return halfVec3;
    };

    /**
     * Diagonal from min to max
     * @method diagonal
     * @param {KICK.math.aabb} aabb
     * @param {KICK.math.vec3} diagonalVec3 optional
     * @return {KICK.math.vec3}
     * @static
     */
    aabb.diagonal = function(aabb,diagonalVec3){
        if (!diagonalVec3){
            diagonalVec3 = vec3.create();
        }
        diagonalVec3[0] = aabb[3]-aabb[0];
        diagonalVec3[1] = aabb[4]-aabb[1];
        diagonalVec3[2] = aabb[5]-aabb[2];
        return diagonalVec3;
    };

    /**
     * @method str
     * @param {KICK.math.aabb} aabb
     * @static
     */
    aabb.str = function(aabb){
        return "{("+
            aabb[0]+","+
            aabb[1]+","+
            aabb[2]+"),("+
            aabb[3]+","+
            aabb[4]+","+
            aabb[5]+")}";
    };

    /**
     * Frustum represented as 6 line equations (a*x+b*y+c*z+d=0 , where [a,b,c] is the normal of the plane).
     * Note the normals of the frustum points inwards. The order of the planes are left, right, top, bottom, near, far
     * The implementation is based on
     * "Fast Extraction of Viewing Frustum Planes from the WorldView-Projection Matrix" by Gil Grib and Klaus Hartmann
     * http://www.cs.otago.ac.nz/postgrads/alexis/planeExtraction.pdf
     * @class frustum
     * @namespace KICK.math
     */
    math.frustum = frustum;

    /**
     * @method extractPlanes
     * @param {KICK.math.mat4} modelViewMatrix
     * @param {Boolean} normalize normalize plane normal
     * @param {Array[24]} dest
     * @return {Array[24]} 6 plane equations
     * @static
     */
    frustum.extractPlanes = function(modelViewMatrix, normalize, dest){
        if (!dest){
            dest = new Float32Array(6*4);
        }
        var   _11 = modelViewMatrix[0], _21 = modelViewMatrix[1], _31 = modelViewMatrix[2], _41 = modelViewMatrix[3];
        var   _12 = modelViewMatrix[4], _22 = modelViewMatrix[5], _32 = modelViewMatrix[6], _42 = modelViewMatrix[7];
        var   _13 = modelViewMatrix[8], _23 = modelViewMatrix[9], _33 = modelViewMatrix[10], _43 = modelViewMatrix[11];
        var   _14 = modelViewMatrix[12], _24 = modelViewMatrix[13], _34 = modelViewMatrix[14], _44 = modelViewMatrix[15];
        // Left clipping plane
        dest[0] = _41 + _11;
        dest[1] = _42 + _12;
        dest[2] = _43 + _13;
        dest[3] = _44 + _14;
        // Right clipping plane
        dest[4] = _41 - _11;
        dest[4+1] = _42 - _12;
        dest[4+2] = _43 - _13;
        dest[4+3] = _44 - _14;
        // Top clipping plane
        dest[2*4] = _41 - _21;
        dest[2*4+1] = _42 - _22;
        dest[2*4+2] = _43 - _23;
        dest[2*4+3] = _44 - _24;
        // Bottom clipping plane
        dest[3*4] = _41 + _21;
        dest[3*4+1] = _42 + _22;
        dest[3*4+2] = _43 + _23;
        dest[3*4+3] = _44 + _24;
        // Near clipping plane
        dest[4*4] = _41 + _31;
        dest[4*4+1] = _42 + _32;
        dest[4*4+2] = _43 + _33;
        dest[4*4+3] = _44 + _34;
        // Far clipping plane
        dest[5*4] = _41 - _31;
        dest[5*4+1] = _42 - _32;
        dest[5*4+2] = _43 - _33;
        dest[5*4+3] = _44 - _34;
        if (normalize){
            for (var i=0;i<6;i++){
                var x = dest[i*4+0],
                    y = dest[i*4+1],
                    z = dest[i*4+2],
                    length = Math.sqrt(x*x+y*y+z*z),
                    lengthRecip = 1 / length;
                dest[i*4+0] *= lengthRecip;
                dest[i*4+1] *= lengthRecip;
                dest[i*4+2] *= lengthRecip;
                dest[i*4+3] *= lengthRecip;
            }
        }
        return dest;
    };

    /**
     * Value = 0
     * @property OUTSIDE
     * @type Number
     * @static
     */
    frustum.OUTSIDE = 0;
    /**
     * Value = 1
     * @property INSIDE
     * @type Number
     * @static
     */
    frustum.INSIDE = 1;
    /**
     * Value = 2
     * @property INTERSECTING
     * @type Number
     * @static
     */
    frustum.INTERSECTING = 2;

    /**
     * Based on [Akenine-Moller's Real-Time Rendering 3rd Ed] chapter 16.14.3
     * @method intersectAabb
     * @param {KICK.math.frustum} frustumPlanes
     * @param {KICK.math.aabb} aabbIn
     * @return {Number} frustum.OUTSIDE = outside(0), frustum.INSIDE = inside(1), frustum.INTERSECTING = intersecting(2)
     * @static
     */
    frustum.intersectAabb = (function(){
        var center = vec3.create();
        var halfVector = vec3.create();
        return function(frustumPlanes,aabbIn){
            var result = frustum.INSIDE,
                testResult,
                centerX,centerY,centerZ,
                halfVectorX,halfVectorY,halfVectorZ,
                // based on [Akenine-Moller's Real-Time Rendering 3rd Ed] chapter 16.10.1
                planeAabbIntersect = function(planeIndex){
                    var offset = planeIndex*4,
                        nx = frustumPlanes[offset],
                        ny = frustumPlanes[offset+1],
                        nz = frustumPlanes[offset+2],
                        d = frustumPlanes[offset+3],
                        e = halfVectorX*Math.abs(nx)+halfVectorY*Math.abs(ny)+halfVectorZ*Math.abs(nz),
                        s = centerX*nx + centerY*ny + centerZ*nz + d;
                    // Note that the following is reverse than in [Akenine-Moller's Real-Time Rendering 3rd Ed],
                    // since we define outside as the negative halfspace
                    if (s-e > 0) return frustum.INSIDE;
                    if (s+e < 0) return frustum.OUTSIDE;
                    return frustum.INTERSECTING;
                };
            aabb.center(aabbIn,center);
            aabb.halfVec3(aabbIn,halfVector);
            centerX = center[0];
            centerY = center[1];
            centerZ = center[2];
            halfVectorX = halfVector[0];
            halfVectorY = halfVector[1];
            halfVectorZ = halfVector[2];
            for (var i=0;i<6;i++){
                testResult = planeAabbIntersect(i);
                if (testResult === frustum.OUTSIDE){
                    return testResult;
                } else if (testResult === frustum.INTERSECTING) {
                    result = frustum.INTERSECTING;
                }
            }
            return result;
        };
    })();
})();/*!
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
        constants = core.Constants,
        scene = KICK.namespace("KICK.scene"),
        ASSERT = true,
        DEBUG = true,
        packIntToFloatArrayBuffer = new ArrayBuffer(4),
        packIntToFloatInt32Buffer = new Uint32Array(packIntToFloatArrayBuffer),
        packIntToFloatUint8Buffer = new Uint8Array(packIntToFloatArrayBuffer);

    /**
     * Game engine object
     * @class Engine
     * @namespace KICK.core
     * @constructor
     * @param {String} idOrElement elementid of canvas tag or the canvas element
     * @param {KICK.core.Config} config Optional, configuration object
     */
    core.Engine = function (idOrElement, config) {
        var gl = null,
            canvas = typeof idOrElement === 'string' ? document.getElementById(idOrElement) : idOrElement,
            webGlContextNames = ["experimental-webgl","webgl"],
            thisObj = this,
            lastTime = new Date().getTime()-16, // ensures valid delta time in next frame
            deltaTime = 0,
            timeObj = new core.Time(),
            timeSinceStart = 0,
            frame = 0,
            timeScale = 1,
            contextListeners = [],
            frameListeners = [],
            eventQueue,
            project = new core.Project(this),
            mouseInput = null,
            keyInput = null,
            activeScene,
            activeSceneNull = {updateAndRender:function(){}},
            animationFrameObj = {},
            wrapperFunctionToMethodOnObject = function (time_) {
                thisObj._gameLoop(time_);
            },
            vec2 = KICK.math.vec2;

        Object.defineProperties(this,{
            /**
             * The current version of KickJS
             * @property version
             * @type String
             */
            version:{
                value:"0.4.0"
            },
            /**
             * Resource manager of the engine. Loads and cache resources.
             * @property resourceManager
             * @type KICK.core.ResourceManager
             */
            resourceLoader:{
                value: new core.ResourceLoader(this)
            },
            /**
             * Project describes the resources available for a given projects (such as Scenes, Materials, Shader and Meshes)
             * @property project
             * @type KICK.core.Project
             */
            project:{
                value: project
            },
            /**
             * The WebGL context (readonly)
             * @property gl
             * @type WebGLContext
             */
            gl: {
                get: function () {return gl;}
            },
            /**
             * The canvas element (readonly)
             * @property canvas
             * @type HTML-Element
             */
            canvas:{
                value: canvas
            },
            /**
             * If null then nothing is rendered
             * @property activeScene
             * @type KICK.scene.Scene
             */
            activeScene:{
                get: function(){
                    if (activeScene === activeSceneNull){
                        return null;
                    }
                    return activeScene;
                },
                set: function(value){
                    if (value === null || typeof value === "undefined"){
                        activeScene = activeSceneNull;
                    } else {
                        activeScene = value;
                    }
                }
            },
            /**
             * Returns a mouseInput object. This object is used to detect mouse input.
             * @property mouseInput
             * @type KICK.core.MouseInput
             */
            mouseInput:{
                get:function(){
                    if (!mouseInput){
                        mouseInput = new core.MouseInput(thisObj);
                        this.addFrameListener(mouseInput);
                    }
                    return mouseInput;
                }
            },
            /**
             * Returns a keyInput object. This object is used to detect key input.
             * @property keyInput
             * @type KICK.core.KeyInput
             */
            keyInput:{
                get: function(){
                    if (!keyInput){
                        keyInput = new core.KeyInput();
                        this.addFrameListener(keyInput);
                    }
                    return keyInput;
                }
            },
            /**
             * @property eventQueue
             * @type KICK.core.EventQueue
             */
            eventQueue:{
                get:function(){
                    return eventQueue;
                }
            },
            /**
             * Time object of the engine. Is updated every frame
             * @property time
             * @type KICK.core.Time
             */
            time:{
                value:timeObj
            },
            /**
             * Configuration of the engine
             * @property config
             * @type KICK.core.Config
             */
            config: {
                value: new core.Config(config || {})
            },
            /**
             * Controls is the gameloop is running
             * @property paused
             * @type boolean
             */
            paused:{
                get:function(){
                    return animationFrameObj === null;
                },
                set:function(pause){
                    var currentValue = thisObj.paused;
                    if (pause != currentValue){
                        if (pause){
                            cancelRequestAnimFrame(animationFrameObj);
                            animationFrameObj = null;
                        } else {
                            lastTime = new Date().getTime()-16; // ensures valid delta time in next frame
                            animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject,thisObj.canvas);
                        }
                    }
                }
            }
        });

        /**
         * @method isFullScreenSupported
         * @return Boolean
         */
        this.isFullScreenSupported = function(){
            return canvas.requestFullscreen || canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen;
        };

        /**
         * Note that fullscreen needs to be invoked directly from a keyboard event or a mouse event from outside the
         * gameLoop. This means it is currently not possible to set fullscreen from a Component's update method.
         * @method setFullscreen
         * @param {Boolean} fullscreen
         */
        this.setFullscreen = function(fullscreen){
            if (thisObj.isFullScreenSupported()){
                if (fullscreen){
                    if (canvas.requestFullscreen){
                        canvas.requestFullscreen();
                    } else if (canvas.webkitRequestFullScreen){
                        canvas.onwebkitfullscreenchange = function() {
                            if(document.webkitIsFullScreen) {
                                canvas.originalWidth = canvas.width;
                                canvas.originalHeight = canvas.height;
                                canvas.width = screen.width;
                                canvas.height = screen.height;
                            } else {
                                canvas.width = canvas.originalWidth;
                                canvas.height = canvas.originalHeight;
                            }
                            thisObj.canvasResized();
                        };
                        canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                    } else if (canvas.mozRequestFullScreen){
                        canvas.mozRequestFullScreen();
                    }
                } else {
                    if (document.exitFullscreen){
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen){
                        document.webkitCancelFullScreen();
                    } else if (document.webkitCancelFullScreen){
                        document.webkitCancelFullScreen();
                    }
                }
            }
        };

        /**
         * @method _gameLoop
         * @param {Number} time current time in milliseconds
         * @private
         */
        this._gameLoop = function (time) {
            deltaTime = time-lastTime;
            lastTime = time;
            deltaTime *= timeScale;
            timeSinceStart += deltaTime;
            frame += 1;
            
            eventQueue.run();

            activeScene.updateAndRender();
            for (var i=frameListeners.length-1;i>=0;i--){
                frameListeners[i].frameUpdated();
            }

            if (animationFrameObj !== null){
                animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject,thisObj.canvas);
            }
        };

        /**
         * Add a framelistener. Frame listeners are invoked last thing in update loop.<br>
         * Frame listener object must define the method frameUpdated()
         * @method addFrameListener
         * @param {Object} frameListener
         */
        this.addFrameListener = function(frameListener){
            if (ASSERT){
                if (typeof frameListener.frameUpdated !== "function"){
                    KICK.core.Util.fail("frameListener must define the method frameUpdated");
                }
            }
            frameListeners.push(frameListener);
        };

        /**
         * @method removeFrameListener
         * @param {Object} frameListener
         * @return {boolean} element removed
         */
        this.removeFrameListener = function(frameListener){
            return core.Util.removeElementFromArray(frameListeners,frameListener);
        };

        /**
         * @method addContextListener
         * @param {Object} contextLostListener implements contextLost() and contextRestored(gl)
         */
        this.addContextListener = function(contextLostListener){
            if (ASSERT){
                if ((typeof contextLostListener.contextLost !== "function") ||
                    (typeof contextLostListener.contextRestored !== "function")){
                    KICK.core.Util.fail("contextLostListener must define the functions contextLost() and contextRestored(gl)");
                }
            }
            contextListeners.push(contextLostListener);
        };

        /**
         * @method removeContextListener
         * @param contextLostListener
         */
        this.removeContextListener = function(contextLostListener){
            return core.Util.removeElementFromArray(contextListeners,contextLostListener);
        };


        /**
         * Creates a uniq id
         * @method createUID
         * @return {Number} uniq id
         */
        this.createUID = function(){
            return ++project.maxUID;
        };

        /**
         * Get the uid of a component (or creates the uid if not defined)
         * @method getUID
         * @param {Object} object
         * @return {String}
         */
        this.getUID = function(object){
            if (!object.uid){
                object.uid = thisObj.createUID();
            }
            return object.uid;
        };

        /**
         * This method should be invoked when the canvas is resized.<br>
         * This will change the viewport size of the WebGL context.<br>
         * Instead of calling this method explicit, the configuration parameter
         * checkCanvasResizeInterval can also be set to support automatically checks
         * @method canvasResized
         */
        this.canvasResized = function(){
            gl.viewportSize = vec2.create([canvas.width,canvas.height]);
            if (mouseInput){
                mouseInput.updateCanvasElementPosition();
            }
        };

        /**
         * @method init
         * @private
         */
        (function init() {
            var c = KICK.core.Constants,
                i,
                wasPaused,
                initGL = function(){
                    for (i = webGlContextNames.length-1; i >= 0; i--) {
                        try {
                            gl = canvas.getContext(webGlContextNames[i],thisObj.config);
                            if (gl) {
                                break;
                            }
                        } catch (e) {
                            // ignore
                            alert(e);
                        }
                    }
                    if (!gl) {
                        return false;
                    }
                    if (thisObj.config.enableDebugContext){
                        if (window["WebGLDebugUtils"]){
                            gl = WebGLDebugUtils.makeDebugContext(gl);
                        } else {
                            console.log("webgl-debug.js not included - cannot find WebGLDebugUtils");
                        }
                    }
                    gl.enable(2929);
                    gl.enable(3089);
                    return true;
                };
            var success = initGL();
            if (!success){
                thisObj.config.webglNotFoundFn(canvas);
                return;
            }

            canvas.addEventListener("webglcontextlost", function(event) {
                wasPaused = thisObj.paused;
                thisObj.pause();
                for (i=0;i<contextListeners.length;i++){
                    contextListeners[i].contextLost();
                }
                event.preventDefault();
            }, false);
            canvas.addEventListener("webglcontextrestored", function(event) {
                initGL();
                for (i=0;i<contextListeners.length;i++){
                    contextListeners[i].contextRestored(gl);
                }
                // restart rendering loop
                if (!wasPaused){
                    thisObj.resume();
                }
                event.preventDefault();
            }, false);
            
            thisObj.canvasResized();
            if (thisObj.config.checkCanvasResizeInterval){
                setInterval(function(){
                    if( canvas.height !== gl.viewportSize[0] || canvas.width !== gl.viewportSize[1] ){
                        thisObj.canvasResized();
                    }
                }, thisObj.config.checkCanvasResizeInterval);
            }

            // API documentation of Time is found in KICK.core.Time
            Object.defineProperties(timeObj,{
                time:{
                    get: function(){return timeSinceStart;}
                },
                deltaTime:{
                    get: function(){return deltaTime;}
                },
                frame:{
                    get: function(){return frame;}
                },
                scale:{
                    get: function(){
                        return timeScale;
                    },
                    set:function(newValue){
                        timeScale = newValue;
                    }
                }
            });
            Object.freeze(timeObj);

            activeScene = new scene.Scene(thisObj);
            eventQueue = new core.EventQueue(thisObj);

            timeSinceStart = 0;
            frame = 0;

            thisObj._gameLoop(lastTime);
        }());
    };

    /**
     * Event queue let you schedule future events in the game engine. Events are invoked just before the
     * Component.update() methods.<br>
     * An event can run for either a single frame or for multiple frames.
     * @class EventQueue
     * @namespace KICK.core
     * @param {KICK.core.Engine} engine
     */
    core.EventQueue = function(engine){
        var queue = [],
            queueSortFn = function(a,b){
                return a.timeStart - b.timeStart;
            },
            time = engine.time;

        /**
         * Add a event to the event queue. Using timeStart = 0 will make the event run in the next frame.
         * @mehtod add
         * @param {function} task
         * @param {Number} timeStart Number of milliseconds from current time
         * @param {Number} timeEnd Optional (defaults to timeStart). Number of milliseconds from current time
         * @return {Object} event object (used for 'cancel' event)
         */
        this.add = function(task, timeStart, timeEnd){
            var currentTime = time.time+1, // schedule for one millisecond in the future - this makes it legal for event call backs to schedule new events
                queueElement = {
                task:task,
                timeStart: timeStart+currentTime,
                timeEnd: (timeEnd || timeStart)+currentTime
            };
            core.Util.insertSorted(queueElement,queue,queueSortFn);
            return queueElement;
        };

        /**
         * Removes an event object from the queue.
         * @method cancel
         * @param {Object} eventObject (should be the object returned from the EventQueue.add method
         */
        this.cancel = function(eventObject){
            core.Util.removeElementFromArray(queue,eventObject);
        };

        /**
         * Run the event queue. This method is invoked by the Engine object just before the components are updated.
         * @protected
         * @method run
         */
        this.run = function(){
            var i=0,
                currentTime = time.time,
                queueLength = queue.length,
                queueElement;
            for (;i<queueLength && (queueElement = queue[i]).timeStart<currentTime;i++){
                queueElement.task();
                if (queueElement.timeEnd<currentTime){
                    queue.splice(i,1);
                    queueLength--;
                }
            }
        };

        /**
         * Clears the queue
         * @method clear
         */
        this.clear = function(){
            queue = [];
        };
    };

    /**
     * Class used for tracking initialization of resources (such as loading, creating, etc.)
     * @class ResourceTracker
     * @param {KICK.core.Project} project
     */
    core.ResourceTracker = function(project){
        var thisObj = this;
        /**
         * Calls project.removeResourceTracker
         * @method resourceReady
         */
        this.resourceReady = function(){
            project.removeResourceTracker(thisObj);
        };

        /**
         * Calls project.removeResourceTracker
         * @method resourceFailed
         */
        this.resourceFailed = function(){
            project.removeResourceTracker(thisObj);
        }
    };


    /**
     * A project asset is an object that can be serialized into a project and restored at a later state.<br>
     * The class only exist in documentation and is used to describe the behavior any project asset must implement.<br>
     * The constructor must take the following two parameters: KICK.core.Engine engine, {Object} config<br>
     * The config parameter is used to initialize the object and the content should match the output of the
     * toJSON method<br>
     * A toJSON method should exist on the object. This method should as a minimum write out the object's uid property.<br>
     * ProjectAsset objects may reference other ProjectAsset objects, however cyclic references are not allowed.
     * @class ProjectAsset
     * @namespace KICK.core
     */

    /**
     * A project is a container of all resources and assets used in a game.
     * @class Project
     * @namespace KICK.core
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {JSON} json project data
     */
    core.Project = function(engine){
        var resourceDescriptorsByUID = {},
            resourceCache = {},
            thisObj = this,
            _maxUID = 0,
            resourceTrackers = [],
            resourceTrackerListeners = [],
            notifyTrackedResourcesChanged = function(){
                for (var i=0;i<resourceTrackerListeners.length;i++){
                    resourceTrackerListeners[i].resourceTrackerChanged();
                }
            },
            refreshResourceDescriptor = function(uid,filter){
                if (resourceDescriptorsByUID[uid] instanceof core.ResourceDescriptor){
                    var liveObject = resourceCache[uid];
                    if (liveObject){
                        resourceDescriptorsByUID[uid].updateConfig(liveObject,filter);
                    }
                }
            },
            getUrlAsResourceName = function(url){
                var name = url.split('/');
                if (name.length>2){
                    name = name[name.length-2];
                    name = name.substring(0,1).toUpperCase()+name.substring(1);
                } else {
                    name = url;
                }
                return name;
            },
            loadEngineAsset = function(uid){
                var p = core.Project,
                    res,
                    url;
                if (uid <= p.ENGINE_SHADER_DEFAULT && uid >= p.ENGINE_SHADER_UNLIT_VERTEX_COLOR){
                    switch (uid){
                        case p.ENGINE_SHADER_DEFAULT:
                            url = "kickjs://shader/default/";
                            break;
                        case p.ENGINE_SHADER_SPECULAR:
                            url = "kickjs://shader/specular/";
                            break;
                        case p.ENGINE_SHADER_DIFFUSE:
                            url = "kickjs://shader/diffuse/";
                            break;
                        case p.ENGINE_SHADER_UNLIT:
                            url = "kickjs://shader/unlit/";
                            break;
                        case p.ENGINE_SHADER_UNLIT_VERTEX_COLOR:
                            url = "kickjs://shader/unlit_vertex_color/";
                            break;
                        case p.ENGINE_SHADER_TRANSPARENT_SPECULAR:
                            url = "kickjs://shader/transparent_specular/";
                            break;
                        case p.ENGINE_SHADER_TRANSPARENT_DIFFUSE:
                            url = "kickjs://shader/transparent_diffuse/";
                            break;
                        case p.ENGINE_SHADER_TRANSPARENT_UNLIT:
                            url = "kickjs://shader/transparent_unlit/";
                            break;
                        case p.ENGINE_SHADER___SHADOWMAP:
                            url = "kickjs://shader/__shadowmap/";
                            break;
                        case p.ENGINE_SHADER___PICK:
                            url = "kickjs://shader/__pick/";
                            break;
                        case p.ENGINE_SHADER___ERROR :
                            url = "kickjs://shader/__error/";
                            break;
                        default:
                            if (ASSERT){
                                core.Util.fail("uid not mapped "+uid);
                            }
                            return null;
                    }
                    res = new KICK.material.Shader(engine,{
                        dataURI:url,
                        name:getUrlAsResourceName(url),
                        uid:uid
                    })
                } else if (uid <= p.ENGINE_TEXTURE_BLACK && uid >= p.ENGINE_TEXTURE_CUBEMAP_WHITE){
                    var isCubemap = uid === p.ENGINE_TEXTURE_CUBEMAP_WHITE;
                    switch (uid){
                        case p.ENGINE_TEXTURE_BLACK:
                            url = "kickjs://texture/black/";
                            break;
                        case p.ENGINE_TEXTURE_WHITE:
                            url = "kickjs://texture/white/";
                            break;
                        case p.ENGINE_TEXTURE_GRAY:
                            url = "kickjs://texture/gray/";
                            break;
                        case p.ENGINE_TEXTURE_LOGO:
                            url = "kickjs://texture/logo/";
                            break;
                        case p.ENGINE_TEXTURE_CUBEMAP_WHITE:
                            // do nothing
                            break;
                        default:
                            if (ASSERT){
                                core.Util.fail("uid not mapped "+uid);
                            }
                            return null;
                    }
                    if (isCubemap){
                        res = new KICK.texture.Texture(engine,
                            {
                                name:"cubemap_white",
                                minFilter: 9728,
                                magFilter: 9728,
                                generateMipmaps: false,
                                uid:uid,
                                textureType: 34067
                            });

                        // create white image
                        var canvas = document.createElement("canvas");
                        canvas.width = 12;
                        canvas.height = 2;
                        var ctx = canvas.getContext("2d");

                        ctx.fillStyle = "rgb(255,255,255)";
                        ctx.fillRect (0, 0, 12, 2);
                        res.setImage(canvas, "memory://cubemap_white/");

                    } else {
                        res = new KICK.texture.Texture(engine,
                            {
                                name:getUrlAsResourceName(url),
                                minFilter: 9728,
                                magFilter: 9728,
                                generateMipmaps: false,
                                uid:uid,
                                textureType: 3553,
                                dataURI:url
                            });
                    }

                } else if (uid <= p.ENGINE_MESH_TRIANGLE && uid >= p.ENGINE_MESH_CUBE){
                    switch (uid){
                        case p.ENGINE_MESH_TRIANGLE:
                            url = "kickjs://mesh/triangle/";
                            break;
                        case p.ENGINE_MESH_PLANE:
                            url = "kickjs://mesh/plane/";
                            break;
                        case p.ENGINE_MESH_UVSPHERE:
                            url = "kickjs://mesh/uvsphere/";
                            break;
                        case p.ENGINE_MESH_CUBE:
                            url = "kickjs://mesh/cube/";
                            break;
                        default:
                            if (ASSERT){
                                core.Util.fail("uid not mapped "+uid);
                            }
                            return null;
                    }
                    res = new KICK.mesh.Mesh(engine,
                        {
                            dataURI:url,
                            name:getUrlAsResourceName(url),
                            uid:uid
                        });
                }

                resourceCache[uid] = res;
                return res;
            };

        core.Util.copyStaticPropertiesToObject(thisObj,core.Project);


        Object.defineProperties(this, {
            /**
             * The maximum UID used in the project
             * @property maxUID
             * @type Number
             */
            maxUID:{
                get:function(){
                    return _maxUID;
                },
                set:function(newValue){
                    _maxUID = newValue;
                }
            },
            /**
             * List the asset uids of project
             * @property resourceDescriptorUIDs
             * @type Array[Number]
             */
            resourceDescriptorUIDs:{
                get:function(){
                    var uids = [],
                        uid;
                    for (uid in resourceDescriptorsByUID){
                        uids.push(uid);
                    }
                    return uids;
                }
            }
        });

        /**
         * Creates a new empty project.
         * @method newProject
         */
        this.newProject = function(){
            thisObj.loadProject({maxUID:0,resourceDescriptors:[]});
        };

        /**
         * Loads a project by URL. This call is asynchronous, and onSuccess or onFail will be called when the loading is
         * complete.
         * @method loadProjectByURL
         * @param {String} url
         * @param {Function} onSuccess
         * @param {Function} onFail
         */
        this.loadProjectByURL = function(url, onSuccess, onError){
            var voidFunction = function(){
                if (DEBUG){
                    console.log(arguments);
                }
            }
                ;
            onSuccess = onSuccess || voidFunction ;
            onError = onError || voidFunction ;

            var oXHR = new XMLHttpRequest();
            oXHR.open("GET", url, true);
            oXHR.onreadystatechange = function (oEvent) {
                if (oXHR.readyState === 4) {
                    if (oXHR.status === 200) {
                        var value = JSON.parse(oXHR.responseText);
                        try{
                            thisObj.loadProject(value,onSuccess,onError);
                        } catch(e) {
                            debugger;
                            onError(e);
                        }
                    } else {
                        onError();
                    }
                }
            };
            oXHR.send(null);
        };

        /**
         * @method createResourceTracker
         * @return {KICK.core.ResourceTracker}
         */
        this.createResourceTracker = function(){
            var newResourceTracker = new KICK.core.ResourceTracker(thisObj);
            resourceTrackers.push(newResourceTracker);
            notifyTrackedResourcesChanged();
            return newResourceTracker;
        };

        /**
         * @method removeResourceTracker
         * @param {KICK.core.ResourceTracker} resourceTracker
         */
        this.removeResourceTracker = function(resourceTracker){
            var removed = KICK.core.Util.removeElementFromArray(resourceTrackers, resourceTracker);
            if (removed){
                notifyTrackedResourcesChanged();
            }
        };

        /**
         * Load a project of the form {maxUID:number,resourceDescriptors:[KICK.core.ResourceDescriptor],activeScene:number}
         * @method loadProject
         * @param {object} config
         * @param {Function} onSuccess
         * @param {Function} onFail
         */
        this.loadProject = function(config, onSuccess, onError){
            if (_maxUID>0){
                thisObj.closeProject();
            }
            config = config || {};
            var resourceDescriptors = config.resourceDescriptors || [];
            _maxUID = config.maxUID || 0;
            for (var i=0;i<resourceDescriptors.length;i++){
                thisObj.addResourceDescriptor(resourceDescriptors[i]);
            }

            // preload all resources
            for (var uid in resourceDescriptorsByUID){
                if (resourceDescriptorsByUID.hasOwnProperty(uid)){
                    try{
                        thisObj.load(uid);
                    }catch(e){
                        onError ? onError(e) : KICK.core.Util.warn(e);
                    }
                }
            }

            var onComplete = function(){
                _maxUID = config.maxUID || 0; // reset maxUID
                if (config.activeScene){
                    engine.activeScene = thisObj.load(config.activeScene);
                } else {
                    engine.activeScene = null;
                }
                if (onSuccess){
                    onSuccess();
                }
            };
            var resourceLoadedListener = {
                resourceTrackerChanged : function(){
                    if (resourceTrackers.length==0){
                        KICK.core.Util.removeElementFromArray(resourceTrackerListeners,resourceLoadedListener);
                        onComplete();
                    }
                }
            };
            resourceTrackerListeners.push(resourceLoadedListener);
            notifyTrackedResourcesChanged();
        };

        /**
         * Close all resources in the project and remove all resource descriptors
         * @method closeProject
         */
        this.closeProject = function(){
            for (var uid in resourceDescriptorsByUID){
                thisObj.removeResourceDescriptor(uid);
            }
            resourceDescriptorsByUID = {};
            resourceCache = {};
        };

        /**
         * Load a resource from the configuration (or cache).
         * Also increases the resource reference counter.
         * @method load
         * @param {String} uid
         * @return {KICK.core.ProjectAsset} resource or null if resource is not found
         */
        this.load = function(uid){
            var resourceObject = resourceCache[uid];
            if (resourceObject){
                return resourceObject;
            }
            var resourceConfig = resourceDescriptorsByUID[uid];
            if (resourceConfig){
                resourceObject = resourceConfig.instantiate(engine);
                resourceCache[uid] = resourceObject;
                return resourceObject;
            }

            return loadEngineAsset(uid);
        };

        /**
         * Remove cache references to an object. Next time load(uid) is called a new object is
         * initialized from the resource config
         * @method removeCacheReference
         * @param {Number} uid
         */
        this.removeCacheReference = function(uid){
            if (resourceCache[uid]){
                delete resourceCache[uid];
            }
        };

        /**
         * Load a resource from the configuration (or cache).
         * Also increases the resource reference counter.
         * If more objects exist with the same name, the first object is returned
         * @method loadByName
         * @param {String} name
         * @param {String} type Optional: limit the search to a specific type
         * @return {KICK.core.ProjectAsset} resource or null if resource is not found
         */
        this.loadByName = function(name,type){
            for (var uid in resourceDescriptorsByUID){
                var resource = resourceDescriptorsByUID[uid];
                if (resource.name === name){
                    if (!type || resource.type === type){
                        return thisObj.load(resource.uid);
                    }
                }
            }
            return null;
        };

        /**
         * Registers an asset in a Project.
         * @method registerObject
         * @param {Object} object
         * @param {String} type
         */
        this.registerObject = function(object, type){
            var uid = engine.getUID(object);
            if (resourceCache[uid]){
                return;
            }
            resourceCache[uid] = object;
            if (!resourceDescriptorsByUID[uid]){ // only update if new object
                resourceDescriptorsByUID[uid] = new core.ResourceDescriptor({
                    uid:uid,
                    type:type,
                    config:{name:object.name} // will be generated on serialization
                });
            }
        };

        /**
         * Updates the resourceDescriptors with data from the initialized objects
         * @method refreshResourceDescriptors
         * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
         */
        this.refreshResourceDescriptors = function(filter){
            filter = filter || function(){return true;};
            for (var uid in resourceDescriptorsByUID){
                refreshResourceDescriptor(uid,filter);
            }
        };

        /**
         * Returns the buildin engine resources
         * @method getEngineResourceDescriptorsByType
         * @param {String} type
         * @return {Array[KICK.core.ResourceDescriptor]}
         */
        this.getEngineResourceDescriptorsByType = function(type){
            var res = [];
            var searchFor;
            if (type === "KICK.mesh.Mesh"){
                searchFor = "ENGINE_MESH_";
            } else if (type === "KICK.material.Shader"){
                searchFor = "ENGINE_SHADER_";
            } else if (type === "KICK.texture.Texture"){
                searchFor = "ENGINE_TEXTURE_";
            }
            if (searchFor){
                for (var name in core.Project){
                    if (typeof core.Project[name] === "number" && core.Project.hasOwnProperty(name) && name.indexOf(searchFor) === 0){
                        var uid = core.Project[name];
                        var name = core.Util.toCamelCase(name.substr(searchFor.length)," ");
                        res.push(new core.ResourceDescriptor({
                            type: type,
                            config:{
                                name: name,
                                uid: uid
                            }}));
                    }
                }
            }
            return res;
        };

        /**
         * @method getResourceDescriptorsByType
         * @param {String} type
         * @return {Array[KICK.core.ResourceDescriptor]}
         */
        this.getResourceDescriptorsByType = function(type){
            var res = [];
            for (var uid in resourceDescriptorsByUID){
                if (resourceDescriptorsByUID[uid].type === type){
                    res.push(resourceDescriptorsByUID[uid]);
                }
            }
            return res;
        };

        /**
         * @method getResourceDescriptorsByName
         * @param {String} type
         * @return {Array[KICK.core.ResourceDescriptor]}
         */
        this.getResourceDescriptorsByName = function(name){
            var res = [];
            for (var uid in resourceDescriptorsByUID){
                if (resourceDescriptorsByUID[uid].name === name){
                    res.push(resourceDescriptorsByUID[uid]);
                }
            }
            return res;
        };



        /**
         * @method getResourceDescriptor
         * @param {Number} uid
         * @return {KICK.core.ResourceDescriptor} resource descriptor (or null if not found)
         */
        this.getResourceDescriptor = function(uid){
            refreshResourceDescriptor(uid);
            return resourceDescriptorsByUID[uid];
        };

        /**
         * @method addResourceDescriptor
         * @param {KICK.core.ResourceDescriptor_or_Object} resourceDescriptor
         * @return {KICK.core.ResourceDescriptor}
         */
        this.addResourceDescriptor = function(resourceDescriptor){
            if (!(resourceDescriptor instanceof core.ResourceDescriptor)){
                resourceDescriptor = new core.ResourceDescriptor(resourceDescriptor);
            }

            resourceDescriptorsByUID[resourceDescriptor.uid] = resourceDescriptor;
            return resourceDescriptor;
        };

        /**
         * Remove resource descriptor and destroy the resource if already allocated.
         * @method removeResourceDescriptor
         * @param {Number} uid
         */
        this.removeResourceDescriptor = function(uid){
            // destroy the resource
            var resource = resourceCache[uid];
            if (resource){
                // remove references
                delete resourceCache[uid];
                // call destroy if exist
                if (resource.destroy){
                    resource.destroy();
                }
            }
            // remove description
            delete resourceDescriptorsByUID[uid];
        };

        /**
         * @method toJSON
         * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
         * @return Object
         */
        this.toJSON = function(filter){
            var res = [];
            filter = filter || function(){return true;};
            thisObj.refreshResourceDescriptors(filter);
            for (var uid in resourceDescriptorsByUID){
                if (uid>=0){ // don't serialize engine assets (since they are static)
                    var rd = resourceDescriptorsByUID[uid];
                    if (rd instanceof core.ResourceDescriptor && filter(rd)){
                        res.push(rd.toJSON(filter));
                    }
                }
            }
            return {
                engineVersion:engine.version,
                maxUID:_maxUID,
                activeScene: engine.activeScene ? engine.activeScene.uid : 0,
                resourceDescriptors:res
            };
        };
    };

    /**
     * @property ENGINE_SHADER_DEFAULT
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_DEFAULT = -100;
    /**
     * @property ENGINE_SHADER_SPECULAR
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_SPECULAR = -101;
    /**
     * @property ENGINE_SHADER_UNLIT
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_UNLIT = -102;
    /**
     * @property ENGINE_SHADER_TRANSPARENT_SPECULAR
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_TRANSPARENT_SPECULAR = -103;
    /**
     * @property ENGINE_SHADER_TRANSPARENT_UNLIT
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_TRANSPARENT_UNLIT = -104;
    /**
     * @property ENGINE_SHADER___SHADOWMAP
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER___SHADOWMAP = -105;
    /**
     * @property ENGINE_SHADER___PICK
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER___PICK = -106;
    /**
     * @property ENGINE_SHADER___ERROR
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER___ERROR = -107;
    /**
     * @property ENGINE_SHADER_DIFFUSE
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_DIFFUSE = -108;
    /**
     * @property ENGINE_SHADER_TRANSPARENT_DIFFUSE
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_TRANSPARENT_DIFFUSE = -109;
    /**
     * @property ENGINE_SHADER_UNLIT_VERTEX_COLOR
     * @type Number
     * @static
     */
    core.Project.ENGINE_SHADER_UNLIT_VERTEX_COLOR = -110;

    /**
     * @property ENGINE_TEXTURE_BLACK
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_BLACK = -200;
    /**
     * @property ENGINE_TEXTURE_WHITE
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_WHITE = -201;
    /**
     * @property ENGINE_TEXTURE_GRAY
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_GRAY = -202;

    /**
     * @property ENGINE_TEXTURE_LOGO
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_LOGO = -203;

    /**
     * @property ENGINE_TEXTURE_CUBEMAP_WHITE
     * @type Number
     * @static
     */
    core.Project.ENGINE_TEXTURE_CUBEMAP_WHITE = -204;

    /**
     * @property ENGINE_MESH_TRIANGLE
     * @type Number
     * @static
     */
    core.Project.ENGINE_MESH_TRIANGLE = -300;

    /**
     * @property ENGINE_MESH_PLANE
     * @type Number
     * @static
     */
    core.Project.ENGINE_MESH_PLANE = -301;

    /**
     * @property ENGINE_MESH_UVSPHERE
     * @type Number
     * @static
     */
    core.Project.ENGINE_MESH_UVSPHERE = -302;

    /**
     * @property ENGINE_MESH_CUBE
     * @type Number
     * @static
     */
    core.Project.ENGINE_MESH_CUBE = -303;

    /**
     * A project is a container of all resources and assets used in a game.<br>
     * Example usage:
     * <pre class="brush: js">
     * var materialConfig = {
     *          name:"Some material",
     *          shader:"Undefined",
     *          uniforms: {
     *              value:42,
     *              type: 5126
     *          }
     *      };
     *      var resourceDescriptorConfig = {
     *          type: "KICK.material.Material",
     *          config: materialConfig,
     *          uid: 132
     *      };
     *      var materialDescriptor = new ResourceDescriptor(resourceDescriptorConfig);
     * </pre>
     * @class ResourceDescriptor
     * @namespace KICK.core
     * @constructor
     * @param {Object} config an object which attributes matches the properties of ResourceDescriptor
     */
    core.ResourceDescriptor = function(config){
        var _config = config || {},
            type = _config.type,
            uid = _config.uid,
            resourceConfig = _config.config,
            hasProperty = core.Util.hasProperty,
            createConfigInitialized = function(engine,config){
                var res = {};
                for (var name in config){
                    if (hasProperty(config,name)){
                        var value = config[name];
                        var reftype = value?value.reftype:null;
                        var ref = value?value.ref:null;
                        if (value && ref && reftype){
                            if (reftype === "resource"){
                                value = engine.resourceLoader[value.refMethod](ref);
                            } else if (reftype === "project"){
                                value = engine.project.load(ref);
                            }
                        }
                        res[name] = value;
                    }
                }
                res.uid = uid;
                return res;
            };
        Object.defineProperties(this,{
            /**
             * The name may contain '/' as folder separator. The name property is a shorthand for config.name
             * @property name
             * @type String
             */
            name:{
                get: function(){
                    return resourceConfig.name;
                },
                set: function(newValue){
                    resourceConfig.name = newValue;
                }
            },
            /**
             * class name of the resource (such as 'KICK.material.Material')
             * @property type
             * @type String
             */
            type:{
                value: type
            },
            /**
             * Configuration of the resource.
             * Optional
             * @property config
             * @type Object
             */
            config:{
                get: function(){return resourceConfig;}
            },
            /**
             * @property uid
             * @type Number
             */
            uid:{
                value: uid
            }
        });

        /**
         * Updates the configuration with the one from object. The method will use object.toJSON(filter)
         * (if toJSON method exist - otherwise the object are used directly)
         * @method updateConfig
         * @param {Object} object
         * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
         */
        this.updateConfig = function(object,filter){
            resourceConfig = object.toJSON ? object.toJSON(filter) : object;
        };

        /**
         * Create a instance of the resource by calling the constructor function with
         * (engine,config) parameters.<br>
         * If the resource object has a init function, this is also invoked.
         * @method instantiate
         * @param {KICK.core.Engine} engine
         * @return {Object} instance of the resource
         */
        this.instantiate = function(engine){
            var resourceClass = KICK.namespace(type);
            var resource = new resourceClass(engine,createConfigInitialized(engine,resourceConfig));
            if (typeof resource.init === 'function'){
                resource.init();
            }
            return resource;
        };

        /**
         * @method toJSON
         * @return {Object} A json data object
         */
        this.toJSON = function(){
            return {
                type:type,
                uid:uid,
                config:resourceConfig
            };
        };
    };

    /**
     * The global configuration of the engine. Cannot be changed during runtime.
     * @class Config
     * @namespace KICK.core
     * @constructor
     * @param {Config} config defines one or more properties
     */
    core.Config = function(config){
        /**
         * Use shadow maps to generate realtime shadows.<br>
         * Default value is false.
         * @property shadows
         * @type Boolean
         */
        this.shadows = config.shadows || false;
        /**
         * The maximum distance shadows are displayed from camera (the smaller the better quality of shadow map).
         * Default value is 20
         * @property shadowDistance
         * @type Number
         */
        this.shadowDistance = config.shadowDistance || 20;
        /**
         * A multiplier that moves the near plane of the shadow map. Default is 2.0
         * @property shadowNearMultiplier
         * @type Number
         */
        this.shadowNearMultiplier = config.shadowNearMultiplier || 2.0;
        /**
         * Shadow map resolution (relative to max texture size). Default is 1.0.
         * Allowed values are 1/2, 1/4, 1/8, etc.
         * @property shadowMapQuality
         * @type Number
         */
        this.shadowMapQuality = config.shadowMapQuality || 1.0;

         /**
         * Maximum number of lights in scene. Default value is 1
         * @property maxNumerOfLights
         * @type Number
         */
        this.maxNumerOfLights = typeof(config.maxNumerOfLights) === 'number' ? config.maxNumerOfLights : 1;

        /**
         * Checks for WebGL errors after each webgl function is called.
         * Should only be used for debugging.
         * Default value is false.
         * @property enableDebugContext
         * @type Boolean
         */
        this.enableDebugContext = typeof(config.enableDebugContext) === 'boolean' ? config.enableDebugContext  : false;

        /**
         * Allows grabbing the content of the canvas using canvasObj.toDataURL(...).<br>
         * Note that this has a performance penalty when enabled.<br>
         * Default value is false<br>
         * WebGL spec:  If false, once the drawing buffer is presented as described in theDrawing Buffer section,
         * the contents of the drawing buffer are cleared to their default values.
         * All elements of the drawing buffer (color, depth and stencil) are cleared.
         * If the value is true the buffers will not be cleared and will preserve their
         * values until cleared or overwritten by the author.
         * @property preserveDrawingBuffer
         * @type Boolean
         */
        this.preserveDrawingBuffer = config.preserveDrawingBuffer || false;

        /**
         * WebGL spec:  Default: true. If the value is true, the drawing buffer has an alpha channel for the purposes
         * of performing OpenGL destination alpha operations and compositing with the page. If the value is false, no
         * alpha buffer is available.
         * @property alpha
         * @type Boolean
         */
        this.alpha = typeof(config.alpha) === 'boolean' ? config.alpha : true;

        /**
         * WebGL spec: Default: true. If the value is true, the drawing buffer has a depth buffer of at least 16 bits.
         * If the value is false, no depth buffer is available.
         * @property alpha
         * @type Boolean
         */
        this.depth = typeof(config.depth) === 'boolean' ? config.depth : true;

        /**
         * WebGL spec: Default: false. If the value is true, the drawing buffer has a stencil buffer of at least 8 bits.
         * If the value is false, no stencil buffer is available.
         * @property stencil
         * @type Boolean
         */
        this.stencil = typeof(config.stencil) === 'boolean' ? config.stencil : false;

        /**
         * WebGL spec: Default: true. If the value is true and the implementation supports antialiasing the drawing
         * buffer will perform antialiasing using its choice of technique (multisample/supersample) and quality.
         * If the value is false or the implementation does not support antialiasing, no antialiasing is performed.
         * @property antialias
         * @type Boolean
         */
        this.antialias = typeof(config.antialias) === 'boolean' ? config.antialias : true;

        /**
         * WebGL spec: Default: true. If the value is true the page compositor will assume the drawing buffer contains
         * colors with premultiplied alpha. If the value is false the page compositor will assume that colors in the
         * drawing buffer are not premultiplied. This flag is ignored if the alpha flag is false.
         * See Premultiplied Alpha for more information on the effects of the premultipliedAlpha flag.
         * @property premultipliedAlpha
         * @type Boolean
         */
        this.premultipliedAlpha = typeof(config.premultipliedAlpha) === 'boolean' ? config.premultipliedAlpha : true;

        /**
         * Polling of canvas resize. Default is 0 (meaning not polling)
         * @property checkCanvasResizeInterval
         * @type Number
         */
        this.checkCanvasResizeInterval = config.checkCanvasResizeInterval || 0;

        /**
         * function (or function name) with the signature function(domElement) called when WebGL cannot be initialized.
         * Default function replaces the canvas element with an error description with a link to
         * http://get.webgl.org/troubleshooting/
         * @property webglNotFoundFn
         * @type Function_or_String
         */
        this.webglNotFoundFn = config.webglNotFoundFn ?
            (typeof (config.webglNotFoundFn) === "string"?
                KICK.namespace(config.webglNotFoundFn):
                config.webglNotFoundFn) :
            function(domElement){
                domElement.innerHTML = "";
                var errorMessage = document.createElement("div");
                errorMessage.style.cssText = domElement.style.cssText+";width:"+domElement.width+"px;height:"+domElement.height+"px;display: table-cell;vertical-align: middle;background:#ffeeee;";
                errorMessage.innerHTML = "<div style='padding:12px;text-align: center;'><img src='http://www.khronos.org/assets/images/api_logos/webgl.png' style='width:74px;35px;margin-bottom: 10px;margin-left: auto;'><br clear='all'>It doesn't appear your computer can support WebGL.<br><br><a href=\"http://get.webgl.org/troubleshooting/\">Click here for more information.</a></div>";
                domElement.parentNode.replaceChild(errorMessage, domElement);
            };

        if (true){
            for (var name in config){
                if (! this.hasOwnProperty(name)){
                    var supportedProperties = "Supported properties for KICK.core.Config are: ";
                    for (var n2 in this){
                        if (this.hasOwnProperty(n2) && typeof this[n2] !== "function"){
                            supportedProperties += "\n - "+n2;
                        }
                    }
                    core.Util.warn("KICK.core.Config does not have any property "+name+"\n"+supportedProperties);

                }
            }
        }
    };

    /**
     * A global timer object
     * @class Time
     * @namespace KICK.core
     */
    core.Time = function(){
        /**
         * Time since start in milliseconds. Read only
         * @property time
         * @type Number
         */
        /**
         * Millis between this frame and last frame. Read only
         * @property deltaTime
         * @type Number
         */
        /**
         * Number of frames since start. Read only
         * @property frame
         * @type Number
         */
        /**
         * Default value is 1.0. Can be used for implementing pause or slow-motion sequences
         * @property scale
         * @type Number
         */

    };

    /**
     * Provides an easy-to-use mouse input interface.
     * Example:<br>
     * <pre class="brush: js">
     * function SimpleMouseComponent(){
     * &nbsp;var mouseInput,
     * &nbsp;&nbsp;thisObj = this;
     * &nbsp;this.activated = function(){
     * &nbsp;&nbsp;mouseInput = thisObj.gameObject.engine.mouseInput;
     * &nbsp;};
     * &nbsp;this.update = function(){
     * &nbsp;&nbsp;if (mouseInput.isButtonDown(0)){
     * &nbsp;&nbsp;&nbsp;var str = "Left mouse down at position "+mouseInput.mousePosition[0]+","+mouseInput.mousePosition[1];
     * &nbsp;&nbsp;&nbsp;console.log(str);
     * &nbsp;&nbsp;}
     * &nbsp;}
     * }
     * </pre>
     * @class MouseInput
     * @namespace KICK.core
     */
    core.MouseInput = function(engine){
        var vec2 = KICK.math.vec2,
            mouse = [],
            mouseUp = [],
            mouseDown = [],
            mousePosition = vec2.create(),
            lastMousePosition = vec2.create(),
            deltaMovement = null,
            objectPosition = vec2.create(),
            mouseWheelDelta = vec2.create(),
            mouseWheelPreventDefaultAction = false,
            canvas = engine.canvas,
            removeElementFromArray = core.Util.removeElementFromArray,
            contains = core.Util.contains,
            mouseMovementListening = true,
            releaseMouseButtonOnMouseOut = true,
            body = document.body,
            isFirefox = navigator.userAgent.indexOf("Firefox") !== -1,
            isChrome = navigator.userAgent.indexOf("Chrome") !== -1,
            mouseContextMenuHandler = function(e){
                e.preventDefault();
                return false;
            },
            mouseMovementHandler = function(e){
                mousePosition[0] = e.clientX - objectPosition[0] + body.scrollLeft;
                mousePosition[1] = e.clientY - objectPosition[1] + body.scrollTop;
                if (deltaMovement){
                    vec2.subtract(mousePosition,lastMousePosition,deltaMovement);
                } else {
                    deltaMovement = vec2.create();
                }
                vec2.set(mousePosition,lastMousePosition);
            },
            mouseWheelHandler = function(e){
                if (isChrome){
                    mouseWheelDelta[0] += e.wheelDeltaX;
                    mouseWheelDelta[1] += e.wheelDeltaY;
                } else {
                    if (e.axis===1){ // horizontal
                        mouseWheelDelta[0] -= e.detail;
                    } else {
                        mouseWheelDelta[1] -= e.detail;
                    }
                }
                if (mouseWheelPreventDefaultAction){
                    e.preventDefault();
                    return false;
                }
            },
            mouseDownHandler = function(e){
                var mouseButton = e.button;
                if (!contains(mouse,mouseButton)){
                    mouseDown.push(mouseButton);
                    mouse.push(mouseButton);
                }
                if (!mouseMovementListening){  // also update mouse position if not listening for mouse movement
                    mouseMovementHandler();
                }
            },
            mouseUpHandler = function(e){
                var mouseButton = e.button;
                mouseUp.push(mouseButton);
                removeElementFromArray(mouse,mouseButton);
                if (!mouseMovementListening){ // also update mouse position if not listening for mouse movement
                    mouseMovementHandler();
                }
            },
            mouseOutHandler = function(e){
                if (releaseMouseButtonOnMouseOut){
                    // simulate mouse up events
                    for (var i=mouse.length-1;i>=0;i--){
                        mouseUpHandler({button:mouse[i]});
                    }
                }
            },
            /**
             * Calculates an object with the x and y coordinates of the given object.
             * Updates the objectPosition variable
             * @method updateCanvasElementPositionPrivate
             * @private
             */
            updateCanvasElementPositionPrivate = function () {
                var object = canvas,
                    left = 0,
                    top = 0;

                while (object.offsetParent) {

                    left += object.offsetLeft;
                    top += object.offsetTop;

                    object = object.offsetParent;
                }

                left += object.offsetLeft;
                top += object.offsetTop;

                objectPosition[0] = left;
                objectPosition[1] = top;
            };
        Object.defineProperties(this,{
            /**
             * Returns the mouse position of the canvas element, where 0,0 is in the upper left corner.
             * @property mousePosition
             * @type KICK.math.vec2
             */
            mousePosition:{
                get:function(){
                    return mousePosition;
                }
            },
            /**
             * Returns the delta movement (relative mouse movement since last frame)
             * @property deltaMovement
             * @type KICK.math.vec2
             */
            deltaMovement:{
                get:function(){
                    return deltaMovement || vec2.create();
                }
            },
            /**
             * Mouse scroll wheel input in two dimensions (horizontal and vertical)
             * @property deltaWheel
             * @type KICK.math.vec2
             */
            deltaWheel:{
                get:function(){
                    return mouseWheelDelta;
                }
            },
            /**
             * If set to true, the engine will prevent screen from scrolling when mouse wheel is used when mouse pointer
             * is over the canvas.<br>
             * Default value is false
             * @property mouseWheelPreventDefaultAction
             * @type Boolean
             */
            mouseWheelPreventDefaultAction:{
                get:function(){
                    return mouseWheelPreventDefaultAction;
                },
                set:function(newValue){
                    mouseWheelPreventDefaultAction = newValue;
                }
            },
            /**
             * When true mouse buttons are auto released when mouse moves outside the canvas.
             * If this is not true, then mouse up events may not be detected. This is important
             * when listening for mouse drag events.
             * Default true
             * @property releaseMouseButtonOnMouseOut
             * @type Boolean
             */
            releaseMouseButtonOnMouseOut:{
                get:function(){
                    return releaseMouseButtonOnMouseOut;
                },
                set:function(newValue){
                    if (newValue !== releaseMouseButtonOnMouseOut){
                        releaseMouseButtonOnMouseOut = newValue;
                        if (releaseMouseButtonOnMouseOut){
                            canvas.addEventListener( "mouseout", mouseOutHandler, false);
                        } else {
                            canvas.removeEventListener( "mouseout", mouseOutHandler, false);
                        }
                    }
                }
            },
            /**
             * Default value is true
             * @property mouseMovementEventsEnabled
             * @type Boolean
             */
            mouseMovementEventsEnabled:{
               get:function(){ return mouseMovementListening; },
               set:function(value){
                   if (mouseMovementListening !== value){
                       mouseMovementListening = value;
                       if (mouseMovementListening){
                           canvas.addEventListener( "mousemove", mouseMovementHandler, false);
                       } else {
                           canvas.removeEventListener( "mousemove", mouseMovementHandler, false);
                           deltaMovement = null;
                       }
                   }
               }
            }
        });

        /**
         * @method isButtonDown
         * @param {Number} mouseButton
         * @return {boolean} true if mouse button is pressed down in this frame
         */
        this.isButtonDown = function(mouseButton){
            return contains(mouseDown,mouseButton);
        };

        /**
         * @method isButtonUp
         * @param {Number} mouseButton
         * @return {boolean} true if mouseButton is released in this frame
         */
        this.isButtonUp = function(mouseButton){
            return contains(mouseUp,mouseButton);
        };

        /**
         * @method isButton
         * @param {Number} mouseButton
         * @return {boolean} true if mouseButton is down
         */
        this.isButton = function(mouseButton){
            return contains(mouse,mouseButton);
        };

        /**
         * Resets the mouse position each frame (mouse buttons down and delta values)
         * @method frameUpdated
         * @private
         */
        this.frameUpdated = function(){
            mouseDown.length = 0;
            mouseUp.length = 0;
            mouseWheelDelta[0] = 0;
            mouseWheelDelta[1] = 0;
            if (deltaMovement){
                deltaMovement[0] = 0;
                deltaMovement[1] = 0;
            }
        };

        /**
         * Update the mouseInput with the relative position of the canvas element.
         * This method should be called whenever the canvas element is moved in the document. <br>
         * This method is automatically called when Engine.canvasResized() is invoked.
         * 
         * @method updateCanvasElementPosition
         */
        this.updateCanvasElementPosition = updateCanvasElementPositionPrivate;

        (function init(){
            updateCanvasElementPositionPrivate();
            var canvas = engine.canvas;
            canvas.addEventListener( "mousedown", mouseDownHandler, true);
            canvas.addEventListener( "mouseup", mouseUpHandler, true);
            canvas.addEventListener( "mousemove", mouseMovementHandler, true);
            canvas.addEventListener( "mouseout", mouseOutHandler, true);
            canvas.addEventListener( "contextmenu", mouseContextMenuHandler, true);
            if (isFirefox){
                canvas.addEventListener( 'MozMousePixelScroll', mouseWheelHandler, true); // Firefox
            } else if (isChrome){
                canvas.addEventListener( 'mousewheel', mouseWheelHandler, true); // Chrome
            } else {
                canvas.addEventListener( 'DOMMouseScroll', mouseWheelHandler, true); // Firefox
            }
        })();
    };

    /**
     * Key Input manager.<br>
     * This class encapsulates keyboard input and makes it easy to
     * test for key input.<br>
     * Example code:
     * <pre class="brush: js">
     * function KeyTestComponent(){
     * &nbsp;var keyInput, thisObj = this;
     * &nbsp;// registers listener (invoked when component is registered)
     * &nbsp;this.activated = function (){
     * &nbsp;&nbsp;var engine = thisObj.gameObject.engine;
     * &nbsp;&nbsp;keyInput = engine.keyInput;
     * &nbsp;};
     * &nbsp;this.update = function(){
     * &nbsp;&nbsp;var keyCodeForA = 65;
     * &nbsp;&nbsp;if (keyInput.isKeyDown(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is down");
     * &nbsp;&nbsp;}
     * &nbsp;&nbsp;if (keyInput.isKey(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is being held down");
     * &nbsp;&nbsp;}
     * &nbsp;&nbsp;if (keyInput.isKeyUp(keyCodeForA)){
     * &nbsp;&nbsp;&nbsp;console.log("A key is up");
     * &nbsp;&nbsp;}
     * &nbsp;};
     * }
     * </pre>
     * <br>
     * Pressing the 'a' key should result in one frame with 'A key is down',
     * multiple frames with 'A key is being held down' and finally one frame
     * with 'A key is up'
     * @class KeyInput
     * @namespace KICK.core
     */
    core.KeyInput = function(){
        var keyDown = [],
            keyUp = [],
            key = [],
            removeElementFromArray = core.Util.removeElementFromArray,
            contains = core.Util.contains,
            keyDownHandler = function(e){
                var keyCode = e.keyCode;
                if (!contains(key,keyCode)){
                    keyDown.push(keyCode);
                    key.push(keyCode);
                }
            },
            keyUpHandler = function(e){
                var keyCode = e.keyCode;
                keyUp.push(keyCode);
                removeElementFromArray(key,keyCode);
            };

        /**
         * @method isKeyDown
         * @param {Number} keyCode
         * @return {boolean} true if key is pressed down in this frame
         */
        this.isKeyDown = function(keyCode){
            return contains(keyDown,keyCode);
        };

        /**
         * @method isKeyUp
         * @param {Number} keyCode
         * @return {boolean} true if key is release in this frame
         */
        this.isKeyUp = function(keyCode){
            return contains(keyUp,keyCode);
        };

        /**
         *
         * @method isKey
         * @param {Number} keyCode
         * @return {boolean} true if key is down
         */
        this.isKey = function(keyCode){
            return contains(key,keyCode);
        };

        /**
         * This method clears key up and key downs each frame (leaving key unmodified)
         * @method update
         * @private
         */
        this.frameUpdated = function(){
            keyDown.length = 0;
            keyUp.length = 0;
        };

        (function init(){
            document.addEventListener( "keydown", keyDownHandler, false);
            document.addEventListener( "keyup", keyUpHandler, false);
        })();
    };

    /**
     * Utility class for miscellaneous functions. The class is static and is shared between multiple instances.
     * @class Util
     * @namespace KICK.core
     */
    core.Util = {
        /**
         * Used for deserializing a configuration (replaces reference objects with actual references)
         * @method deserializeConfig
         * @param {Object} config
         * @param {KICK.engine.Engine} engine usef for looking up references to project assets
         * @param {KICK.scene.Scene} scene used for looking up references to gameObjects and components
         */
        deserializeConfig: function(config, engine, scene){
            if (typeof config === 'number'){
                return config;
            }
            if (Array.isArray(config)){
                var destArray = new Array(config.length);
                for (var i=0;i<config.length;i++){
                    destArray [i] = core.Util.deserializeConfig(config[i], engine, scene);
                }
                config = destArray;
            } else if (config){
                if (config && config.ref && config.reftype){
                    if (config.reftype === "project"){
                        config = engine.project.load(config.ref);
                    } else if (config.reftype === "gameobject" || config.reftype === "component"){
                        config = scene.getObjectByUID(config.ref);
                    }
                }
            }
            return config;
        },
        /**
         * @method deepCopy 
         * @param {Object} src
         * @param {Array[Classes]} passthroughClasses Optional. Don't attempt to clone object of these classes (uses instanceof operator)
         * @return Object
         */
        deepCopy : function(object, passthroughClasses){
            var res,
                isPassthrough = false,
                i;
            passthroughClasses = passthroughClasses || [];

            for (i=0;i<passthroughClasses.length;i++){
                if (object instanceof passthroughClasses[i]){
                    isPassthrough = true;
                    break;
                }
            }

            var typeOfValue = typeof object;
            if (isPassthrough){
                res = object;
            } else if (object === null || typeof(object)==="undefined"){
                res = null;
            } else if (Array.isArray(object)
                || object.buffer instanceof ArrayBuffer){ // treat typed arrays as normal arrays
                res = [];
                for (i=0;i<object.length;i++){
                    res[i] = core.Util.deepCopy(object[i],passthroughClasses);
                }
            } else if (typeOfValue === "object"){
                res = {};
                for (var name in object){
                    if (object.hasOwnProperty(name)){
                        res[name] = core.Util.deepCopy(object[name],passthroughClasses);
                    }
                }
            } else {
                res = object;
            }

            return res;
        },
        /**
         * @method copyStaticPropertiesToObject
         * @param {Object} object
         * @param {Function} type constructor function
         * @static
         */
        copyStaticPropertiesToObject : function(object, type){
            for (var name in type){
                if (type.hasOwnProperty(name)){
                    Object.defineProperty(object,name,{
                        value:type[name]
                    });
                }
            }
        },
        /**
         * @method hasProperty
         * @param {Object} obj
         * @param {String} prop
         * @return {Boolean}
         * @static
         */
        hasProperty:function (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        },
        /**
         *
         * @method toCamelCase
         * @param {String} str
         * @param {String} wordSeparator Optional - default value is empty string
         */
        toCamelCase:function(str, wordSeparator){
            if (!wordSeparator){
                wordSeparator = "";
            }
            // skip initial underscore
            var i,
                wasLastCharSpace = true,
                char,
                resStr = "";
            for (i=0;i<str.length;i++){
                char = str.charAt(i);
                if (char !== "_"){
                    break;
                }
                resStr += char;
            }

            for (;i<str.length;i++){
                var char = str.charAt(i);
                var isSpace = char === '_';
                if (isSpace){
                    char = wordSeparator;
                }
                resStr += wasLastCharSpace ? char.toUpperCase() : char.toLowerCase();
                wasLastCharSpace = isSpace;
            }
            return resStr;
        },
        /**
         * @method getJSONReference
         * @param {KICK.core.Engine} engine
         * @param {Object} object
         * @return {JSON}
         */
        getJSONReference: function(engine,object){
            if (object == null){
                return null;
            }
            if (DEBUG){
                if (!engine instanceof KICK.core.Engine){
                    KICK.core.Util.fail("getJSONReference - engine not defined");
                }
            }
            var isGameObject = object instanceof KICK.scene.GameObject;
            var isComponent = !isGameObject && object.gameObject instanceof KICK.scene.GameObject;
            if (isComponent || isGameObject){
                return {
                    ref: engine.getUID(object),
                    name: typeof object.name === 'string'? object.name : "",
                    reftype: isGameObject?"gameobject":"component"
                }

            } else {
                // project type
                return {
                    ref:object.uid,
                    name:object.name,
                    reftype:"project"
                };
            }
        },
        /**
         * @method componentToJSON
         * @param {KICK.core.Engine} engine
         * @param {KICK.scene.Component} component
         * @param {String} componentType Optional defaults to component.constructor.name
         * @return {JSON}
         */
        componentToJSON: function(engine, component,componentType){
            var name,
                config = {},
                functionReturnType = {},
                res = {
                    type: componentType || component.constructor.name,
                    uid: engine.getUID(component),
                    config:config
                };
            if (res.type === ""){
                core.Util.fail("Cannot serialize object type. Either provide toJSON function or use explicit function name 'function SomeObject(){}' ");
            }
            var serializeObject = function(o){
                if (Array.isArray(o)){
                    var result = [];
                    for (var i=0;i<o.length;i++){
                        var r = serializeObject(o[i]);
                        result.push(r);
                    }
                    return result;
                }
                var typeofO = typeof o;
                if (typeofO !== 'function'){
                    if (o && o.buffer instanceof ArrayBuffer){
                        // is typed array
                        return core.Util.typedArrayToArray(o);
                    } else if (typeofO === 'object'){
                        return core.Util.getJSONReference(engine,o);
                    } else {
                        return o;
                    }
                }
                return functionReturnType;
            };
            // init config object
            for (name in component){
                if (core.Util.hasProperty(component,name) && name !== "gameObject"){
                    var o = component[name];
                    var serializedObject = serializeObject(o);
                    if (serializedObject !== functionReturnType){
                        config[name] = serializedObject;
                    }
                }
            }
            return res;
        },
        /**
         * For each non function attribute in config, set the attribute on object
         * @method applyConfig
         * @param {Object} object
         * @param {Object} config
         * @param {Array[String]} excludeFilter
         * @static
         */
        applyConfig: function(object,config,excludeFilter){
            var contains = core.Util.contains,
                hasProperty = core.Util.hasProperty;
            config = config || {};
            excludeFilter = excludeFilter || [];
            for (var name in config){
                if (typeof config[name] !== 'function' && !contains(excludeFilter,name) && hasProperty(object,name)){
                    object[name] = config[name];
                }
            }
            // force setting uid
            if (config.uid && config.uid !== object.uid){
                object.uid = config.uid;
            }
        },
        /**
         * Reads a parameter from a url string.
         * @method getParameter
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameter: function(url, parameterName){
            var regexpStr = "[\\?&]"+parameterName+"=([^&#]*)",
                regexp = new RegExp( regexpStr ),
                res = regexp.exec( url );
            if( res == null )
                return null;
            else
                return res[1];
        },
        /**
         * Reads a int parameter from a url string.
         * @method getParameterInt
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameterInt: function(url, parameterName, notFoundValue){
            var res = core.Util.getParameter(url,parameterName);
            if( res === null )
                return notFoundValue;
            else
                return parseInt(res);
        },
        /**
         * Reads a float parameter from a url string.
         * @method getParameterInt
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
         * @static
         */
        getParameterFloat: function(url, parameterName, notFoundValue){
            var res = core.Util.getParameter(url,parameterName);
            if( res === null )
                return notFoundValue;
            else
                return parseFloat(res);
        },
        /**
         * Scales the image by drawing the image on a canvas object.
         * @method scaleImage
         * @param {Image} imageObj
         * @param {Number} newWidth
         * @param {Number} newHeight
         * @return {Canvas} return a Canvas object (acts as a image)
         * @static
         */
        scaleImage: function(imageObj, newWidth, newHeight){
            // from http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences
            var canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageObj,
                0, 0, imageObj.width, imageObj.height,
                0, 0, canvas.width, canvas.height);
            return canvas;
        },
        /**
         * Invokes debugger and logs a warning
         * @method warn
         * @static
         */
        warn:function(message){
            debugger;
            console.log(message);
        },
        /**
         * Invokes debugger and logs an error
         * @method fail
         * @static
         */
        fail:function(message){
            debugger;
            console.error(message);
        },
        /**
         * Converts a typed array to a number array
         * @method typedArrayToArray
         * @static
         * @param {TypedArray} typedArray
         * @return {Array[Number]}
         */
        typedArrayToArray: function(typedArray){
            var length = typedArray.length,
                res = new Array(length);
            for (var i=0;i<length;i++){
                res[i] = typedArray[i];
            }
            return res;
        },

        /**
         * Remove one element from an array - either the first instance or all instances
         * @method removeElementFromArray
         * @static
         * @param {Array} array
         * @param {Object} removeValue value to be deleted
         * @param {boolean} deleteAll  deletaAll objects (or exit function after first deletion)
         * @return {boolean} elementRemoved
         */
        removeElementFromArray: function (array, removeValue, deleteAll) {
            var elementRemoved = false;
            for(var i=array.length-1; i>=0; i--) {
                if(array[i] === removeValue) {
                    elementRemoved = true;
                    array.splice(i, 1);
                    if (!deleteAll) {
                        break;
                    }
                }
            }
            return elementRemoved;
        },

        /**
         * Removes all values from one array in another array
         * @method removeElementsFromArray
         * @static
         * @param array {Array}
         * @param removeValues {Object} value to be deleted
         */
        removeElementsFromArray: function (array, removeValues) {
            var i,j;
            for(i=array.length-1; i>=0; i--) {
                for (j=removeValues.length-1;j>=0;j--) {
                    if(array[i] === removeValues[j]) {
                        array.splice(i, 1);
                    }
                }
            }
        },
        /**
         * Insert the element into a sorted array
         * @static
         * @method insertSorted
         * @param {Object} element
         * @param {Array} sortedArray
         * @param {Function} sortFunc has the signature foo(obj1,obj2) returns Number. Optional (uses numberSort as default)
         */
        insertSorted : function (element,sortedArray,sortFunc) {
            var i;
            if (!sortFunc) {
                sortFunc = core.Util.numberSortFunction;
            }
            // assuming that the array is relative small
            for (i = sortedArray.length-1; i >= 0; i--) {
                if (sortFunc(sortedArray[i],element) <= 0) {
                    sortedArray.splice(i+1,0,element);
                    return;
                }
            }
            sortedArray.unshift( element );
        },
        /**
         * Returns a-b
         * @static
         * @method numberSortFunction
         * @param {Number} a
         * @param {Number} b
         * @return {Number} a-b
         */
        numberSortFunction : function (a,b) {
            return a-b;
        },
        /**
         * Loops through array and return true if any array element strict equals the element.
         * This uses the === to compare the two elements.
         * @static
         * @param {Array} array
         * @param {Object} element
         * @return {boolean} array contains element
         */
        contains : function(array,element){
            for (var i=array.length-1;i>=0;i--){
                if (array[i]===element){
                    return true;
                }
            }
            return false;
        },
        /**
         * Packs a Uint32 into a KICK.math.vec4
         * @static
         * @method uint32ToVec4
         * @param {Number} uint32
         * @param {KICK.math.vec4} dest
         * @return {KICK.math.vec4}
         */
        uint32ToVec4 : function(uint32, dest){
            if (!dest){
                dest = new Float32Array(4);
            }
            packIntToFloatInt32Buffer[0] = uint32;
            for (var i=0;i<4;i++){
                dest[i] = packIntToFloatUint8Buffer[i]/255;
            }
            return dest;
        },
        /**
         * Unpacks a KICK.math.vec4 into a Uint32
         * @static
         * @method vec4ToUint32
         * @param {KICK.math.vec4} vec4
         */
        vec4ToUint32 : function(vec4){
            for (var i=0;i<4;i++){
                packIntToFloatUint8Buffer[i] = vec4[i]*255;
            }
            return packIntToFloatInt32Buffer[0];
        },
        /**
         * Unpacks an array of uint8 into a Uint32
         * @static
         * @method vec4uint8ToUint32
         * @param {Array[Number]}
         */
        vec4uint8ToUint32 : function(vec4uint8){
            for (var i=0;i<4;i++){
                packIntToFloatUint8Buffer[i] = vec4uint8[i];
            }
            return packIntToFloatInt32Buffer[0];
        },
        /**
         * Supports up to 3 byte UTF-8 encoding (including Basic Multilingual Plane)
         * @method utf8Encode
         * @param {String} str
         * @return Uint8Array
         */
        utf8Encode:function(str){
            var res = [];
            for (var i=0;i<str.length;i++){
                var charCode = str.charCodeAt(i);
                if (charCode < 0x007F){
                    res.push(charCode);
                } else if (charCode <= 0x07FF){
                    res.push(0xC0 + (charCode >> 6));
                    res.push(0x80 + (charCode & 0x3F));
                } else if (charCode <= 0xFFFF){
                    res.push(0xE0 + (charCode >> 12));
                    res.push(0x80 + ((charCode>>6) & 0x3F));
                    res.push(0x80 + (charCode & 0x3F));
                } else {
                    if (ASSERT){
                        core.Util.fail("Unsupported character. Charcode "+charCode);
                    }
                }
            }
            return new Uint8Array(res);
        },
        /**
         * Supports up to 3 byte UTF-8 encoding (including Basic Multilingual Plane)
         * @method utf8Decode
         * @param {Uint8Array} bytes
         * @return String
         */
        utf8Decode:function(bytes){
            var str = "";
            for (var i=0;i<bytes.length;i++){
                var byte = bytes[i];
                if ((byte & 0x80) === 0){ // Bytes 0xxxxxxx
                    str += String.fromCharCode(byte);
                } else if ((byte & 0xE0) === 0xC0){ // Bytes 110xxxxx
                    i++;
                    var byte2 = bytes[i];
                    byte = (byte & 0x1F) << 6;
                    byte2 = byte2 & 0x3F;
                    var char = byte + byte2;
                    str += String.fromCharCode(char);
                } else if ((byte & 0xF0) === 0xE0){ // Bytes 1110xxxx
                    i++;
                    var byte2 = bytes[i];
                    i++;
                    var byte3 = bytes[i];
                    byte = (byte & 0x1F) << 12;
                    byte2 = (byte2 & 0x3F) << 6;
                    byte3 = byte3 & 0x3F;
                    var char = byte + byte2 + byte3;
                    str += String.fromCharCode(char);
                } else {
                    if (ASSERT){
                        core.Util.fail("Unsupported encoding");
                    }
                }
            }
            return str;
        }
    };


    Object.freeze(core.Util);


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// Usage
// window.requestAnimationFrame(function (/* time */ time) {
// time ~= +new Date // the unix time
// }, /* optional bounding elem */ elem);
//
// shim layer with setTimeout fallback
    if (typeof window.requestAnimationFrame === "undefined") {
        window.requestAnimationFrame = (function () {
            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function (/* function */ callback, /* DOMElement */ element) {
                    var fps60 = 16.7;
                    return window.setTimeout(callback, fps60, new Date().getTime());
                };
        })();

        window.cancelRequestAnimFrame = ( function() {
            return window.cancelAnimationFrame          ||
                window.webkitCancelRequestAnimationFrame    ||
                window.mozCancelRequestAnimationFrame       ||
                window.oCancelRequestAnimationFrame     ||
                window.msCancelRequestAnimationFrame        ||
                clearTimeout
        } )();
    }



// workaround for undefined consoles
    if (typeof window.console === "undefined") {
        window.console = {};
    }
    if (typeof window.console.log === "undefined") {
        window.console.log = function (v) {
            alert (v);
        }
    }
})();
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
        ASSERT = true,
        DEBUG = true,
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
                            var dataSizeMod4 = dataSize%8;
                            if (dataSizeMod4){
                                return 8-dataSizeMod4;
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
         * Size of chunkdata in bytes. Note that the data is added padding so it always fit into a double array.
         * @method getSize
         */
        this.getSize = function(){
            var size = getHeaderSize()+getChunksSize();
            var remainder = size%8;
            if (remainder !== 0){
                size += 8- remainder;
            }
            return size;
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
         * @method getNumber
         * @param {Number} chunkid
         * @return String or null
         */
        this.getNumber = function(chunkid){
            var value = thisObj.get(chunkid);
            if (value){
                return value[0];
            }
            return null;
        };

        /**
         * @method getArrayBuffer
         * @param {Number} chunkid
         * @return ArrayBuffer  or null if not found
         */
        this.getArrayBuffer = function(chunkid){
            var value = thisObj.get(chunkid);
            if (value){
                var arrayBuffer = new ArrayBuffer(value.length*value.BYTES_PER_ELEMENT);
                var res = new Uint8Array(arrayBuffer);
                res.set(value);
                return arrayBuffer;
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
         */
        this.setString = function(chunkId, str){
            var array = utf8Encode(str);
            thisObj.set(chunkId,array);
        };

        /**
         * Uses a Float32Array for storing the number. Note that potentially precision can get lost.
         * @method setNumber
         * @param {Number} num
         */
        this.setNumber = function(chunkId, num){
            var array = new Float32Array([num]);
            thisObj.set(chunkId,array);
        };

        /**
         * @method setArrayBuffer
         * @param ArrayBuffer arrayBuffer
         */
        this.setArrayBuffer = function(chunkId, arrayBuffer){
            thisObj.set(chunkId,new Uint8Array(arrayBuffer));
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
}());/*!
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
        scene = KICK.namespace("KICK.scene"),
        core = KICK.namespace("KICK.core"),
        math = KICK.namespace("KICK.math"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat4 = KICK.namespace("KICK.math.mat4"),
        constants = KICK.core.Constants,
        DEBUG = true,
        ASSERT = true,
        fail = KICK.core.Util.fail;

    /**
     * Mesh data class.
     * Allows for modifying mesh object easily.
     * This is a pure data class with no WebGL dependency
     * @class MeshData
     * @namespace KICK.mesh
     * @param {Object} config
     * @constructor
     */
    mesh.MeshData = function(config){
        var data = {},
            thisObj = this,
            _indices = [],
            _interleavedArray,
            _interleavedArrayFormat,
            _vertexAttrLength,
            _meshType,
            _name,
            clearInterleavedData = function(){
                _interleavedArray = null;
                _interleavedArrayFormat = null;
                _vertexAttrLength = null;
            },
            isVertexDataInitialized = function(){
                return data.vertex;
            },
            isInterleavedDataInitialized = function(){
                return _interleavedArray;
            },
            createVertexDataFromInterleavedData = function(){
                var vertexLength = _interleavedArray.byteLength / (_vertexAttrLength),
                    i,j,
                    attributeName,
                    attributeConfig,
                    offset = 0,
                    floatView;
                data = {};
                for (i=0;i<vertexLength;i++){
                    for (attributeName in _interleavedArrayFormat){
                        attributeConfig = _interleavedArrayFormat[attributeName];
                        var arrayType = attributeConfig.type === 5126?Float32Array:Int32Array;
                        if (i===0){
                            data[attributeName] = new arrayType(vertexLength*attributeConfig.size);
                        }

                        floatView = new arrayType(_interleavedArray,offset+attributeConfig.pointer);
                        for (j=0;j<attributeConfig.size;j++){
                            data[attributeName][i*attributeConfig.size+j] = floatView[j];
                        }
                    }
                    offset += _vertexAttrLength;
                }
            },
            /**
             * @method createGetterSetter
             * @private
             * @param {Number} type 5126 or 5124
             * @param {string} name
             */
            createGetterSetter = function(type,name){
                if (type === 5126 || type===5124){
                    var typedArrayType = (type === 5126)? Float32Array:Int32Array;
                    return {
                        get:function(){
                            if (!isVertexDataInitialized() && isInterleavedDataInitialized()){
                                createVertexDataFromInterleavedData();
                            }
                            return data[name];
                        },
                        set:function(newValue){
                            if (newValue){
                                if (data[name] && data[name].length == newValue.length){
                                    data[name].set(newValue);
                                } else {
                                    data[name] = new typedArrayType(newValue);
                                }
                            } else {
                                data[name] = null;
                            }
                            clearInterleavedData();
                        }
                    };
                } else if (ASSERT){
                    fail("Unexpected type");
                }
            },
            /**
             * @method createInterleavedData
             * @private
             */
             createInterleavedData = function () {
                 var lengthOfVertexAttributes = [],
                     names = [],
                     types = [],
                     length = 0,
                     vertexAttributes = [],
                     data,
                     i,
                     vertex = thisObj.vertex,
                     vertexLen = vertex ?  vertex.length/3 : 0,
                     description = {},
                     addAttributes = function (name,size,type){
                         var array = thisObj[name];

                         if (array){
                             lengthOfVertexAttributes.push(size);
                             names.push(name);
                             types.push(type);
                             vertexAttributes.push(array);
                             description[name] = {
                                 pointer: length*4,
                                 size: size,
                                 normalized: false,
                                 type: type
                             };
                             length += size;
                         }
                     };

                 addAttributes("vertex",3,5126);
                 addAttributes("normal",3,5126);
                 addAttributes("uv1",2,5126);
                 addAttributes("uv2",2,5126);
                 addAttributes("tangent",4,5126);
                 addAttributes("color",4,5126);
                 addAttributes("int1",1,5124);
                 addAttributes("int2",2,5124);
                 addAttributes("int3",3,5124);
                 addAttributes("int4",4,5124);

                 // copy data into array
                 var dataArrayBuffer = new ArrayBuffer(length*vertexLen*4);
                 for (i=0;i<vertexLen;i++){
                     var vertexOffset = i*length*4;
                     for (var j=0;j<names.length;j++){
                         if (types[j] === 5126){
                            data = new Float32Array(dataArrayBuffer,vertexOffset);
                         } else {
                             data = new Int32Array(dataArrayBuffer,vertexOffset);
                         }
                         var dataSrc = vertexAttributes[j];
                         var dataSrcLen = lengthOfVertexAttributes[j];
                         for (var k=0;k<dataSrcLen;k++){
                             data[k] = dataSrc[i*dataSrcLen+k];
                             vertexOffset += 4;
                         }
                     }
                 }
                 _interleavedArray = dataArrayBuffer;
                 _interleavedArrayFormat = description;
                 _vertexAttrLength = length*4;
            };

        /**
         * Saves the MeshData into binary form (ArrayBuffer)
         * @method serialize
         * @return ArrayBuffer
         */
        this.serialize = function(){
            var chunkData = new KICK.core.ChunkData();
            chunkData.setArrayBuffer(1,thisObj.interleavedArray);
            chunkData.setString(2,JSON.stringify(thisObj.interleavedArrayFormat));
            chunkData.setString(3,thisObj.name || "MeshData");
            var subMeshes = thisObj.subMeshes;
            var numberOfSubMeshes = subMeshes.length;
            chunkData.setNumber(4,numberOfSubMeshes);
            chunkData.setNumber(5,thisObj.vertexAttrLength);
            for (var i=0;i<numberOfSubMeshes;i++){
                chunkData.set(10+i,subMeshes[i]);
            }

            return chunkData.serialize();
        };

        /**
         * Restores the
         * @method deserialize
         * @param {ArrayBuffer} data
         * @return Boolean
         */
        this.deserialize = function(data){
            var chunkData = new KICK.core.ChunkData();
            if (chunkData.deserialize(data)){
                thisObj.interleavedArray = chunkData.getArrayBuffer(1);
                thisObj.interleavedArrayFormat = JSON.parse(chunkData.getString(2));
                thisObj.name = chunkData.getString(3);
                var numberOfSubMeshes = chunkData.getNumber(4);
                thisObj.vertexAttrLength = chunkData.getNumber(5);
                var submeshes = [];
                for (var i = 0;i< numberOfSubMeshes;i++){
                    submeshes[i] = chunkData.get(10+i);
                }
                thisObj.subMeshes = submeshes;
                return true;
            }
            return false;
        };


        Object.defineProperties(this,{
            /**
             * Note that this property is not cached. Use KICK.mesh.Mesh.aabb for a cached version.
             * Readonly
             * @property aabb
             * @type KICK.math.aabb
             */
            aabb:{
                get:function(){
                    var vertex = thisObj.vertex;
                    if (!vertex){
                        return null;
                    }
                    var vertexLength = vertex.length;
                    var aabb = KICK.math.aabb.create();
                    for (var i=0;i<vertexLength;i += 3){
                        var point = vertex.subarray(i,i+3);
                        KICK.math.aabb.addPoint(aabb,point);
                    }
                    return aabb;
                }
            },
            /**
             * @property name
             * @type string
             */
            name:{
                get:function(){
                    return _name;
                },
                set:function(newValue){
                    _name = newValue;
                }
            },
            /**
             * @property interleavedArray
             * @type Float32Array
             */
            interleavedArray:{
                get:function(){
                    if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()){
                        createInterleavedData();
                    }
                    return _interleavedArray;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (newValue && !(newValue instanceof ArrayBuffer)){
                            fail("MeshData.interleavedArray must be an ArrayBuffer");
                        }
                    }
                    if (!newValue){
                        clearInterleavedData();
                    } else {
                        _interleavedArray = newValue;
                    }
                }
            },
            /**
             * Describes the interleaved array format.<br>
             * The description is an object with a number of properties.<br>
             * Each property name corresponds to the name of the vertex attribute.<br>
             * Each property has the format <br>
             * <pre class="brush: js">
             * {
             * &nbsp;pointer: 0, // {Number}
             * &nbsp;size: 0, //{Number} number of elements
             * &nbsp;normalized: 0, // {Boolean} should be normalized or not
             * &nbsp;type: 0 // {5126 or 5124}
             * }
             * </pre>
             * <br>
             * Example:<br>
             * <pre class="brush: js">
             * var vertexOffset = meshData.interleavedArrayFormat["vertex"].pointer;
             * </pre>
             * @property interleavedArrayFormat
             * @type Object
             */
            interleavedArrayFormat:{
                get:function(){
                    if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()){
                        createInterleavedData();
                    }
                    return _interleavedArrayFormat;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (newValue !== null){
                            for (var n in newValue){
                                var object = newValue[n];
                                if (typeof (object) === "object" ){
                                    if (typeof(object.pointer) !== "number" ||
                                        typeof(object.size) !== "number" ||
                                        typeof(object.normalized) !== "boolean" ||
                                        typeof(object.type) !== "number"){
                                        fail("Invalid object signature - expected {pointer:,size:,normalized:,type:}");
                                    }
                                }
                            }
                        }
                    }
                    if (!newValue){
                        clearInterleavedData();
                    } else {
                        _interleavedArrayFormat = newValue;
                    }
                }
            },
            /**
             * The length of vertexAttributes for one vertex in bytes
             * @property vertexAttrLength
             * @type Number
             */
            vertexAttrLength:{
                get:function(){
                    if ((!isInterleavedDataInitialized()) && isVertexDataInitialized()){
                        createInterleavedData();
                    }
                    return _vertexAttrLength;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (typeof newValue !== "number" || newValue <0){
                            fail("Invalid MeshData.vertexAttrLength - expected a real number");
                        }
                    }
                    if (!newValue){
                        clearInterleavedData();
                    } else {
                        _vertexAttrLength = newValue;
                    }
                }
            },
            /**
             * Vertex attribute.
             * Vertex (vec3)
             * @property vertex
             * @type Array[Number]
             */
            vertex:createGetterSetter(5126, "vertex"),
            /**
             * Vertex attribute.
             * Normal (vec3)
             * @property normal
             * @type Array[Number]
             */
            normal:createGetterSetter(5126, "normal"),
            /**
             * Vertex attribute.
             * UV1 (vec2)
             * @property uv1
             * @type Array[Number]
             */
            uv1:createGetterSetter(5126, "uv1"),
            /**
             * Vertex attribute.
             * UV2 (vec2)
             * @property uv2
             * @type Array[Number]
             */
            uv2:createGetterSetter(5126, "uv2"),
            /**
             * Vertex attribute.
             * Tangent (vec4)
             * @property tangent
             * @type Array[Number]
             */
            tangent:createGetterSetter(5126, "tangent"),
            /**
             * Vertex attribute.
             * Color (vec4)
             * @property color
             * @type Array[Number]
             */
            color:createGetterSetter(5126, "color"),
            /**
             * Vertex attribute.
             * Integer attribute (onw Int32)
             * @property int1
             * @type Array[Number]
             */
            int1:createGetterSetter(5124, "int1"),
            /**
             * Vertex attribute.
             * Integer attribute (two Int32)
             * @property int2
             * @type Array[Number]
             */
            int2:createGetterSetter(5124, "int2"),
            /**
             * Vertex attribute.
             * Integer attribute (three Int32)
             * @property int3
             * @type Array[Number]
             */
            int3:createGetterSetter(5124, "int3"),
            /**
             * Vertex attribute.
             * Integer attribute (four Int32)
             * @property int4
             * @type Array[Number]
             */
            int4:createGetterSetter(5124, "int4"),
            /**
             * Vertex attribute.
             * indices (integer).
             * indices is shortcut for subMeshes[0]
             * @property indices
             * @type Array[Number]
             */
            indices:{
                get:function(){
                    if (_indices==0){
                        return null;
                    }
                    return _indices[0];
                },
                set:function(newValue){
                    if (newValue && !(newValue instanceof Uint16Array)){
                        newValue = new Uint16Array(newValue);
                    }
                    if (_indices[0] && isVertexDataInitialized()){
                        clearInterleavedData();
                    }
                    if (newValue){
                        _indices[0] = newValue;
                    }
                }
            },
            /**
             * indices (integer)
             * @property subMeshes
             * @type Array[Array[Number]]
             */
            subMeshes:{
                get:function(){
                    return _indices;
                },
                set:function(newValue){
                    for (var i=0;i<newValue.length;i++){
                        if (newValue[i] && !(newValue[i] instanceof Uint16Array)){
                            newValue[i] = new Uint16Array(newValue[i]);
                        }
                    }
                    _indices = newValue;
                }
            },
            /**
             * Must be 4,6, 5, or 1
             * @property meshType
             * @type Number
             */
            meshType:{
                get:function(){
                    return _meshType;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (
                            newValue != 1 &&
                            newValue != 4 &&
                            newValue != 6 &&
                            newValue != 5){
                            fail("MeshData.meshType must be 4, 6 or 5");
                        }
                    }
                    _meshType = newValue;
                }
            }
        });

        /**
         * @method isValid
         * @return {Boolean} if mesh is considered valid
         */
        this.isValid = function(){
            if (!isVertexDataInitialized() && isInterleavedDataInitialized()){
                createVertexDataFromInterleavedData();
            }
            var vertexCount = data.vertex.length/3;
            for (var j=0;j<_indices.length;j++){
                for (var i=_indices[j].length-1;i>=0;i--){
                    if (_indices[j][i] >= vertexCount){
                        debugger;
                        return false;
                    }
                }
            }
            return true;
        };

        /**
         * @method isVertexDataInitialized
         * @return {Boolean} return true if vertex data is initialized
         */
        this.isVertexDataInitialized = isVertexDataInitialized;

        /**
         * @method isInterleavedDataInitialized
         * @return {Boolean} return true if interleaved data is initialized
         */
        this.isInterleavedDataInitialized = isInterleavedDataInitialized;

        /**
         * Creates a copy of the mesh and transform the vertex positions of the MeshData with a mat4.
         * Note that normals are not modified - so they may need to renormalized.
         * @param {KICK.math.mat4} transformMatrix
         * @return {KICK.mesh.MeshData} transformed mesh
         */
        this.transform = function(transformMatrix){
            var copy = new mesh.MeshData(this);
            var wrappedVec3Array = vec3.wrapArray(copy.vertex);
            for (var j=wrappedVec3Array.length-1;j>=0;j--){
                mat4.multiplyVec3(transformMatrix,wrappedVec3Array[j]);
            }
            return copy;
        };
        /**
         * Combine two meshes and returns the combined mesh as a new Mesh object.<br>
         * The two meshes must have the same meshType. Only vertex attributes existing in
         * both mesh objects are transferred<br>
         * Triangle fans cannot be combined
         * @method combine
         * @param {KICK.mesh.MeshData} secondMesh
         * @param {KICK.math.mat4} transform Optional transformation matrix
         * @return {KICK.mesh.MeshData} mesh object or null if incompatible objects
         */
        this.combine = function(secondMesh, transform){
            if (thisObj.meshType !== secondMesh.meshType || thisObj.meshType == 6){
                if (ASSERT){
                    if (thisObj.meshType !== secondMesh.meshType){
                        fail("Mesh.combine does not support different meshTypes");
                    } else {
                        fail("Mesh.combine does not support triangle fans");
                    }
                    return null;
                }
                return null;
            }
            var dataNames = ["vertex","normal","uv1","uv2","tangent","color","int1","int2","int3","int4","indices"];

            for (var i=dataNames.length-1;i>=0;i--){
                var name = dataNames[i];
                if (!thisObj[name] || !secondMesh[name]){
                    dataNames.splice(i,1); // remove dataName from array
                }
            }

            var appendObject = function(config, source, indexOffset){
                var i,j,name,data,len;
                for (i=dataNames.length-1;i>=0;i--){
                    name = dataNames[i];
                    if (!config[name]){ // if undefined
                        config[name] = KICK.core.Util.typedArrayToArray(source[name]);
                    } else {
                        data = source[name];
                        if (indexOffset && name === "indices"){
                            // take a copy
                            data = new Uint16Array(data);
                            // add offset to copy
                            len = data.length;
                            for (j=0;j<len;j++){
                                data[j] += indexOffset;
                            }
                        }
                        for (j=0;j<data.length;j++){
                            config[name].push(data[j]);
                        }
                    }
                }
            };

            var newConfig = {
                meshType:thisObj.meshType
            };

            if (transform){
                secondMesh = secondMesh.transform(transform);
            }

            appendObject(newConfig,thisObj,0);
            appendObject(newConfig,secondMesh,this.vertex.length/3);

            if (thisObj.meshType === 5){
                // create two degenerate triangles to connect the two triangle strips
                newConfig.indices.splice(thisObj.indices,0,newConfig.indices[thisObj.indices.length],newConfig.indices[thisObj.indices.length+1]);
            }

            return new mesh.MeshData(newConfig);
        };

        if (!config){
            config = {};
        }

        var copyVertexData = function(){
            thisObj.vertex = config.vertex ? new Float32Array(config.vertex):null;
            thisObj.normal = config.normal? new Float32Array(config.normal):null;
            thisObj.uv1 = config.uv1? new Float32Array(config.uv1):null;
            thisObj.uv2 = config.uv2? new Float32Array(config.uv2):null;
            thisObj.tangent = config.tangent? new Float32Array(config.tangent):null;
            thisObj.color = config.color? new Float32Array(config.color):null;
            thisObj.int1 = config.int1? new Int32Array(config.int1):null;
            thisObj.int2 = config.int2? new Int32Array(config.int2):null;
            thisObj.int3 = config.int3? new Int32Array(config.int3):null;
            thisObj.int4 = config.int4? new Int32Array(config.int4):null;
        };

        var copyInterleavedData = function(){
            thisObj.interleavedArray = config.interleavedArray;
            thisObj.interleavedArrayFormat = config.interleavedArrayFormat;
            thisObj.vertexAttrLength = config.vertexAttrLength;
        };

        if (config instanceof mesh.MeshData){
            if (config.isVertexDataInitialized()){
                copyVertexData();
            } else {
                if (ASSERT){
                    if (!config.isInterleavedDataInitialized()){
                        KICK.core.Util.fail("Either vertex or interleaved data should be initialized");
                    }
                }
                copyInterleavedData();
            }
        } else {
            if (config.vertex){
                copyVertexData();
            } else if (config.interleavedArray) {
                copyInterleavedData();
            }
        }
        thisObj.name = config.name;
        thisObj.indices = config.indices;
        thisObj.meshType = config.meshType || 4;
    };

    /**
     * Recalculate the vertex normals based on the triangle normals
     * @method recalculateNormals
     */
    mesh.MeshData.prototype.recalculateNormals = function(){
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
     * Recalculates the tangents on a triangle mesh.<br>
     * Algorithm is based on<br>
     *   Lengyel, Eric. “Computing Tangent Space Basis Vectors for an Arbitrary Mesh”.<br>
     *   Terathon Software 3D Graphics Library, 2001.<br>
     *   http://www.terathon.com/code/tangent.html
     * @method recalculateTangents
     * @return {Boolean} false if meshtype is not 4
     */
    mesh.MeshData.prototype.recalculateTangents = function(){
        if (this.meshType != 4){
            return false;
        }
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
        return true;
    };

    /**
     * A Mesh object allows you to bind and render a MeshData object
     * @class Mesh
     * @namespace KICK.mesh
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @extends KICK.core.ProjectAsset
     */
    mesh.Mesh = function (engine,config) {
        var gl = engine.gl,
            meshVertexAttBuffer,
            interleavedArrayFormat,
            meshVertexIndexBuffers = [],
            _name,
            _meshData,
            _dataURI = "memory://void",
            _aabb = null,
            thisObj = this,
            c = KICK.core.Constants,
            vertexAttrLength = 0,
            meshType,
            meshElements = [],
            contextListener = {
                contextLost: function(){},
                contextRestored: function(newGl){
                    meshVertexIndexBuffers = null;
                    meshVertexAttBuffer = null;
                    gl = newGl;
                    updateData();
                }
            },
            deleteBuffers = function(){
                for (var i=0;i<meshVertexIndexBuffers.length;i++){
                    gl.deleteBuffer(meshVertexIndexBuffers[i]);
                }
                if (typeof meshVertexAttBuffer === "number"){
                    gl.deleteBuffer(meshVertexAttBuffer);
                    meshVertexAttBuffer = null;
                }
                meshElements.length = 0;
                meshVertexIndexBuffers.length = 0;
            },
            /**
             * Copy data to the vertex buffer object (VBO)
             * @method updateData
             * @private
             */
            updateData = function () {
                var subMeshes = _meshData.subMeshes;
                // delete current buffers
                deleteBuffers();

                interleavedArrayFormat = _meshData.interleavedArrayFormat;
                vertexAttrLength = _meshData.vertexAttrLength;
                meshType = _meshData.meshType;

                meshVertexAttBuffer = gl.createBuffer();
                gl.bindBuffer(34962, meshVertexAttBuffer);
                gl.bufferData(34962, _meshData.interleavedArray, 35044);

                for (var i=0;i<subMeshes.length;i++){
                    var indices = subMeshes[i];
                    var meshVertexIndexBuffer = gl.createBuffer();
                    meshElements[i] = indices.length;
                    meshVertexIndexBuffers.push(meshVertexIndexBuffer);
                    gl.bindBuffer(34963, meshVertexIndexBuffer);
                    gl.bufferData(34963, indices, 35044);
                }
            };

        if (DEBUG){
            if (!(engine instanceof KICK.core.Engine)){
                fail("Engine param not valid");
            }
        }
        engine.addContextListener(contextListener);

        Object.defineProperties(this,{
            /**
             * Axis aligned bounding box.
             * Readonly.
             * @property aabb
             * @type KICK.math.aabb
             */
            aabb:{
                get:function(){
                    if (!_aabb && _meshData){
                        _aabb = _meshData.aabb;
                    }
                    return _aabb;
                }
            },
            /**
             * @property name
             * @type String
             */
            name:{
                get:function(){
                    return _name;
                },
                set:function(newValue){
                    _name = newValue || "Mesh";
                }
            },
            /**
             * Setting this property to something will update the data in WebGL. Note that
             * changing a MeshData object will not itself update anything.
             * @property meshData
             * @type KICK.mesh.MeshData
             */
            meshData:{
                get:function(){
                    return _meshData;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (newValue && !(newValue instanceof mesh.MeshData)){
                            KICK.core.Util.fail("Mesh.meshData must be instanceof KICK.mesh.MeshData");
                        }
                    }
                    _meshData = newValue;
                    _aabb = null;
                    updateData();
                }
            },
            /**
             * The resource url of the mesh. Setting this property will try to load the meshData.
             * @property dataURI
             * @type String
             */
            dataURI:{
                get:function(){
                    return _dataURI;
                },
                set:function(newValue){
                    thisObj.setDataURI(newValue,true);
                }
            }
        });

        /**
         * @method setDataURI
         * @param {String} newValue
         * @param {Boolean} automaticGetMeshData optional. if true the mesh data is attempted to be loaded by resourceLoader.getMeshData
         */
        this.setDataURI = function(newValue, automaticGetMeshData){
            if (newValue !== _dataURI){
                _dataURI = newValue;
                if (automaticGetMeshData){
                    engine.resourceLoader.getMeshData(newValue,thisObj);
                }
            }
        };

        KICK.core.Util.applyConfig(this,config);
        engine.project.registerObject(this, "KICK.mesh.Mesh");


        /**
         * This function verifies that the mesh has the vertex attributes (normals, uvs, tangents) that the shader uses.
         * @method verify
         * @param {KICK.material.Shader} shader
         * @return {Array[String]} list of missing vertex attributes in mesh or null if no missing attributes
         */
        this.verify = function (shader){
            var missingVertexAttributes = [],
                found;
            for (var attName in shader.lookupAttribute){
                if (typeof (attName) === "string"){
                    found = interleavedArrayFormat[attName];
                    if (!found){
                        missingVertexAttributes.push(attName);
                    }
                }
            }
            if (missingVertexAttributes.length === 0){
                return null;
            }
            return null;
        };

        /**
         * Bind the vertex attributes of the mesh to the shader
         * @method bind
         * @param {KICK.material.Shader} shader
         */
        this.bind = function (shader) {
            shader.bind();

            if (gl.meshBuffer !== meshVertexAttBuffer || gl.meshShader !== shader){
                gl.meshBuffer = meshVertexAttBuffer;
                gl.meshShader = shader;
                gl.bindBuffer(34962, meshVertexAttBuffer);

                for (var descName in interleavedArrayFormat) {
                    if (typeof(shader.lookupAttribute[descName]) !== 'undefined') {
                        var desc = interleavedArrayFormat[descName];
                        var attributeIndex = shader.lookupAttribute[descName];
                        gl.enableVertexAttribArray(attributeIndex);
                        gl.vertexAttribPointer(attributeIndex, desc.size,
                           desc.type, false, vertexAttrLength, desc.pointer);
                    }
                }
                if (ASSERT){
                    for (var i = shader.activeAttributes.length-1;i>=0;i--){
                        var activeAttribute = shader.activeAttributes[i];
                        if (interleavedArrayFormat && !(interleavedArrayFormat[activeAttribute.name])){
                            KICK.core.Util.fail("Shader wants "+activeAttribute.name+" but mesh does not have it.");
                            attributeIndex = shader.lookupAttribute[activeAttribute.name];
                            gl.disableVertexAttribArray(attributeIndex);
                            switch(activeAttribute.type){
                                case 5126:
                                    gl.vertexAttrib1f(attributeIndex,0.0);
                                break;
                                case 35664:
                                    gl.vertexAttrib2f(attributeIndex,0.0,0.0);
                                break;
                                case 35665:
                                    gl.vertexAttrib3f(attributeIndex,0.0,0.0,0.0);
                                break;
                                case 35666:
                                    gl.vertexAttrib4f(attributeIndex,0.0,0.0,0.0,0.0);
                                break;
                                default:
                                    KICK.core.Util.fail("Shader wants "+activeAttribute.name+" no default value for type.");
                                break;
                            }
                        }
                    }
                }

            }
        };

        /**
         * Renders the current mesh.
         * Assumes that the Mesh.bind(shader) has been called prior to this, to setup the mesh with the shader.
         * @method render
         * @param {Number} submeshIndex
         */
        this.render = function (submeshIndex) {
            gl.bindBuffer(34963, meshVertexIndexBuffers[submeshIndex]);
            gl.drawElements(meshType, meshElements[submeshIndex], 5123, 0);
        };

        /**
         * Destroys the mesh data and deletes the associated resources
         * After this the mesh cannot be bound
         * @method destroy
         */
        this.destroy = function(){
            if (meshVertexAttBuffer !== null){
                deleteBuffers();
                engine.removeContextListener(contextListener);
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * @method toJSON
         * @return {Object} data object
         */
        this.toJSON = function(){
            if (ASSERT){
                if (!_dataURI){
                    fail("_dataURI not defined");
                }
            }
            return {
                uid: thisObj.uid,
                name:_name,
                dataURI:_dataURI
            };
        };
    };
})();/*!
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

    var scene = KICK.namespace("KICK.scene"),
        core = KICK.namespace("KICK.core"),
        math = KICK.namespace("KICK.math"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat4 = KICK.namespace("KICK.math.mat4"),
        aabb = KICK.namespace("KICK.math.aabb"),
        frustum = KICK.namespace("KICK.math.frustum"),
        constants = KICK.core.Constants,
        DEBUG = true,
        ASSERT = true,
        warn = KICK.core.Util.warn,
        fail = KICK.core.Util.fail,
        applyConfig = KICK.core.Util.applyConfig,
        insertSorted = KICK.core.Util.insertSorted,
        vec4uint8ToUint32 = KICK.core.Util.vec4uint8ToUint32;

    /**
     * Game objects. (Always attached to a given scene).
     * This constructor should not be called directly - Scene.createGameObject() should be used instead.
     * @class GameObject
     * @namespace KICK.scene
     * @constructor
     * @param {KICK.scene.Scene} scene
     * @param {Object} config configuration for gameObject (components will not be initialized)
     */
    scene.GameObject = function (scene, config) {
        var _transform = new KICK.scene.Transform(this),
            _components = [_transform],
            _layer = 1,
            _name,
            _uid = scene.engine.createUID(),
            thisObj = this;
        Object.defineProperties(this,
            {
                /**
                 * Reference to the containing scene
                 * @property scene
                 * @type KICK.scene.Scene
                 */
                scene:{
                    value:scene
                },
                /**
                 * Reference to the engine
                 * @property engine
                 * @type KICK.core.Engine
                 */
                engine:{
                    value:scene.engine
                },
                /**
                 * Reference to the transform
                 * @property transform
                 * @type KICK.scene.Transform
                 */
                transform:{
                    value:_transform
                },
                /**
                 * Layer bit flag. The default value is 1.
                 * The layer should have a value of 2^n
                 * @property layer
                 * @type Number
                 */
                layer:{
                    get:function(){
                        return _layer;
                    },
                    set:function(newValue){
                        if (typeof newValue !== 'number'){
                            KICK.core.Util.fail("GameObject.layer must be a Number")
                        }
                        _layer = newValue;
                    }
                },
                /**
                 * @property name
                 * @type String
                 */
                name:{
                    get:function(){
                        return _name;
                    },
                    set:function(newValue){
                        _name = newValue;
                    }
                },
                /**
                 * Unique id - identifies a game object (within a scene).
                 * @property uid
                 * @type Number
                 */
                uid:{
                    get:function(){
                        return _uid;
                    },
                    set:function(newValue){
                        _uid = newValue;
                    }
                },
                /**
                 * Number of components
                 * @property numberOfComponents
                 * @type Number
                 */
                numberOfComponents:{
                    get:function(){
                        return _components.length;
                    }
                },
                /**
                 * @property destroyed
                 * @type Boolean
                 */
                destroyed:{
                    get:function(){
                        return _components.length==0;
                    }
                }
            }
        );

        /**
         * Get component by index.
         * @method getComponent
         * @param {Number} index
         * @return {KICK.scene.Component}
         */
        this.getComponent = function(index){
            return _components[index];
        };

        /**
         * Add the component to a gameObject and set the gameObject field on the component
         * @method addComponent
         * @param {KICK.scene.Component} component
         */
        this.addComponent = function (component) {
            if (component instanceof KICK.scene.Transform){
                if (ASSERT){
                    KICK.core.Util.fail("Cannot add another Transform to a GameObject");
                }
                return;
            }
            if (component.gameObject) {
                throw {
                    name: "Error",
                    message: "Component "+component+" already added to gameObject "+component.gameObject
                };
            }
            if (!component.scriptPriority) {
                component.scriptPriority = 0;
            }
            component.gameObject = this;
            _components.push(component);
            scene.addComponent(component);
        };

        /**
         * Remove the component from a gameObject and clear the gameObject field on the component
         * @method removeComponent
         * @param {KICK.scene.Component} component
         */
        this.removeComponent =  function (component) {
            try {
                delete component.gameObject;
            } catch (e){
                // ignore if gameObject cannot be deleted
            }
            core.Util.removeElementFromArray(_components,component);
            scene.removeComponent(component);
        };

        /**
         * Invoked when component updated (such as material change).
         * @method notifyComponentUpdated
         * @param {KICK.scene.Component} component
         */
        this.notifyComponentUpdated = function(component){
            scene.notifyComponentUpdated(component);
        };

        /**
         * Destroys game object after next frame.
         * Removes all components instantly.
         * This method will call destroyObject on the associated scene.
         * @method destroy
         */
        this.destroy = function () {
            var i;
            for (i = _components.length-1; i >= 0 ; i--) {
                thisObj.removeComponent(_components[i]);
            }
            scene.destroyObject(thisObj);
        };
        /**
         * Get the first component of a specified type. Internally uses instanceof.<br>
         * Example usage:<br>
         * <pre class="brush: js">
         * var meshRenderer = someGameObject.getComponentOfType(KICK.scene.MeshRenderer);
         * var material = meshRenderer.material;
         * </pre>
         * @method getComponentOfType
         * @param {Object} type the constructor of the wanted component
         * @return {Object} component of specified type or null
         */
        this.getComponentOfType = function (type) {
            var component,
                i;
            for (i=_components.length-1;i>=0;i--){
                component = _components[i];
                if (component instanceof type){
                    return component;
                }
            }
            return null;
        };

        /**
         * Get all component of a specified type. Internally uses instanceof.<br>
         * Example usage:<br>
         * <pre class="brush: js">
         * var meshRenderer = someGameObject.getComponentsOfType(KICK.scene.MeshRenderer);
         * if (meshRenderer.length > 0){
         * material = meshRenderer[0].material;
         * }
         * </pre>
         * @method getComponentsOfType
         * @param {Object} type the constructor of the wanted component
         * @return {Array[Object]} arrays of components of specified type
         */
        this.getComponentsOfType = function (type) {
            var component,
                i,
                res = [];
            for (i=_components.length-1;i>=0;i--){
                component = _components[i];
                if (component instanceof type){
                    res.push(component);
                }
            }
            return res;
        };

        /**
         * @method toJSON
         * @return JSON object
         */
        this.toJSON = function(){
            var componentsJSON = [],
                component;
            for (var i=0;i<_components.length;i++){
                component = _components[i];
                if (!component.toJSON){
                    componentsJSON.push(KICK.core.Util.componentToJSON(scene.engine,component));
                } else {
                    var componentJSON = component.toJSON();
                    if (componentJSON){
                        componentsJSON.push(componentJSON);
                    }
                }

            }
            return {
                name: _name,
                layer: _layer,
                uid:_uid,
                components:componentsJSON
            };
        };

        (function init(){
            applyConfig(thisObj,config,["uid"]);
        })();
    };

    /**
     * This class only specifies the interface of a component.
     * @namespace KICK.scene
     * @class Component
     */

    /**
     * The gameObject owning the component. Initially undefined. The value is set when the Component object is added
     * to a GameObject
     * @property gameObject
     * @type KICK.scene.GameObject
     */

    /**
     * Abstract method called when a component is added to scene. May be undefined. <br>
     * This method method works in many cases like a constructor function, where references to other game objects can
     * be looked up (this cannot be done when the actual constructor function is called, since the scene may not be
     * loaded completely).
     * @method activated
     */

    /**
     * Abstract method called when a component is removed from scene. May be undefined.
     * @method deactivated
     */


    /**
     * Abstract method called every at every rendering of the object. May be undefined.
     * @method render
     * @param (KICK.math.mat4) projectionMatrix
     * @param {KICK.math.mat4} modelViewMatrix
     * @param {KICK.math.mat4} modelViewProjectionMatrix modelviewMatrix multiplied with projectionMatrix
     */

    /**
     * Components with largest priority are invoked first. (optional - default 0). Cannot be modified after creation.
     * @property scriptPriority
     * @type Number
     */

    /**
     * Defines the axis aligned bounding box used for view frustum culling
     * May be undefined or null.
     * @property aabb
     * @type KICK.math.aabb
     */

    /**
     * Default value is 1000<br>
     * &lt; 2000 default geometry<br>
     * 2000 - 2999 transparent geometry (sorted back-to-front when rendered)<br>
     * &gt; 3000 overlay geometry rendered on top
     * @property renderOrder
     * @type Number
     */

    /**
     * Abstract method called every update. May be undefined.
     * @method update
     */

    /**
     * Creates a JSON version of the configuration of the class. May be undefined, if so the
     * KICK.core.Util.componentToJSON() are used for serializaing of the component.<br>
     * Note that references to assets, gameObjects or other components should be wrapped by the KICK.core.Util.getJSONReference() method
     * @method toJSON
     * @return {Object}
     */


    /**
     * Position, rotation and scale of a game object. This component should not be created manually.
     * It is created when a GameObject is created.
     * @namespace KICK.scene
     * @class Transform
     * @extends KICK.scene.Component
     */
    scene.Transform = function (gameObject) {
        var localMatrix = mat4.identity(mat4.create()),
            globalMatrix = mat4.identity(mat4.create()),
            localMatrixInverse = mat4.identity(mat4.create()),
            globalMatrixInverse = mat4.identity(mat4.create()),
            globalPosition = vec3.create([0,0,0]),
            localPosition = vec3.create([0,0,0]),
            globalRotationQuat = quat4.create([0,0,0,1]),
            localRotationQuat = quat4.create([0,0,0,1]),
            localScale = vec3.create([1,1,1]),
            // the dirty parameter let the
            LOCAL = 0,
            LOCAL_INV = 1,
            GLOBAL = 2,
            GLOBAL_INV = 3,
            GLOBAL_POSITION = 4,
            GLOBAL_ROTATION = 5,
            dirty = new Int8Array(6), // local,localInverse,global,globalInverse
            children = [],
            parentTransform = null,
            thisObj = this,
            markGlobalDirty = function () {
                var i;
                dirty[GLOBAL] = 1;
                dirty[GLOBAL_INV] = 1;
                dirty[GLOBAL_POSITION] = 1;
                dirty[GLOBAL_ROTATION] = 1;
                for (i=children.length-1;i>=0;i--) {
                    children[i]._markGlobalDirty();
                }
            },
            markLocalDirty = function(){
                dirty[LOCAL] = 1;
                dirty[LOCAL_INV] = 1;
                markGlobalDirty();
            };

        Object.defineProperties(this,{
            // inherit description from GameObject
            gameObject:{
                value: gameObject
            },
            /**
             * Global position.
             * @property position
             * @type KICK.math.vec3
             */
            position:{
                get: function(){
                    // if no parent - use local position
                    if (parentTransform === null){
                        return vec3.create(localPosition);
                    }
                    if (dirty[GLOBAL_POSITION]){
                        mat4.multiplyVec3(thisObj.getGlobalMatrix(),[0,0,0],globalPosition);
                        dirty[GLOBAL_POSITION] = 0;
                    }
                    return vec3.create(globalPosition);
                },
                set:function(newValue){
                    var currentPosition;
                    if (parentTransform === null){
                        thisObj.localPosition = newValue;
                        return;
                    }
                    currentPosition = thisObj.position;
                    vec3.set(newValue,localPosition);
                    thisObj.localPosition = [
                        localPosition[0]+currentPosition[0]-newValue[0],
                        localPosition[1]+currentPosition[1]-newValue[1],
                        localPosition[2]+currentPosition[2]-newValue[2]
                    ];
                    markLocalDirty();
                }
            },
            /**
             * Local position.
             * @property localPosition
             * @type KICK.math.vec3
             */
            localPosition:{
                get: function(){
                    return vec3.create(localPosition);
                },
                set: function(newValue){
                    vec3.set(newValue,localPosition);
                    markLocalDirty();
                }
            },
            /**
             * Local rotation in euler angles.
             * @property localRotationEuler
             * @type KICK.math.vec3
             */
            localRotationEuler: {
                get: function(){
                    var vec = vec3.create();
                    quat4.toEuler(localRotationQuat,vec);
                    return vec;
                },
                set: function(newValue){
                    quat4.setEuler(newValue,localRotationQuat);
                    markLocalDirty();
                }
            },
            /**
             * Global rotation in euler angles.
             * @property rotationEuler
             * @type KICK.math.vec3
             */
            rotationEuler: {
                get: function(){
                    var vec = vec3.create();
                    quat4.toEuler(thisObj.rotation,vec);
                    return vec;
                },
                set: function(newValue){
                    var tmp = quat4.create();
                    quat4.setEuler(newValue,tmp);
                    this.rotation = tmp;
                }
            },

            /**
             * Global rotation in quaternion.
             * @property rotation
             * @type KICK.math.quat4
             */
            rotation:{
                get: function(){
                    var parentIterator = null;
                    if (parentTransform === null){
                        return quat4.create(localRotationQuat);
                    }
                    if (dirty[GLOBAL_ROTATION]){
                        quat4.set(localRotationQuat,globalRotationQuat);
                        parentIterator = thisObj.parent;
                        while (parentIterator != null){
                            quat4.multiply(parentIterator.localRotation,globalRotationQuat,globalRotationQuat);
                            parentIterator = parentIterator.parent;
                        }
                        dirty[GLOBAL_ROTATION] = false;
                    }
                    return globalRotationQuat;
                },
                set: function(newValue){
                    if (parentTransform == null){
                        this.localRotation = newValue;
                        return;
                    }
                    var rotationDifference = quat4.create();
                    quat4.difference(newValue,thisObj.rotation,rotationDifference);
                    this.localRotation = quat4.multiply(localRotationQuat,rotationDifference);
                }
            },
            /**
             * Local rotation in quaternion.
             * @property localRotation
             * @type KICK.math.quat4
             */
            localRotation: {
                get: function(){
                    return localRotationQuat;
                },
                set: function(newValue){
                    quat4.set(newValue,localRotationQuat);
                    markLocalDirty();
                }
            },
            /**
             * Local scale.
             * Any zero value will be replaced with an epsilon value.
             * @property localScale
             * @type KICK.math.vec3
             */
            localScale: {
                get: function(){
                    return vec3.create(localScale);
                },
                set: function(newValue){
                    vec3.set(newValue,localScale);
                    // replace 0 value with epsilon to prevent a singular matrix
                    for (var i=0;i<localScale.length;i++){
                        if (localScale[i] === 0){
                            localScale[i] = 0.00001;
                        }
                    }
                    markLocalDirty();
                }
            },
            /**
             * Array of children. The children should not be modified directly. Instead use the parent property
             * @property children
             * @type Array[KICK.scene.Transform]
             */
            children:{
                value: children
            },
            /**
             * Parent transform. Initial null.
             * @property parent
             * @type KICK.scene.Transform
             */
            parent:{
                get: function(){
                    return parentTransform;
                },
                set: function(newParent){
                    if (newParent === this) {
                        KICK.core.Util.fail('Cannot assign parent to self');
                    }
                    if (ASSERT){
                        if (typeof newParent === 'undefined'){
                            fail("Cannot set newParent to undefined - should be null");
                        }
                    }
                    if (newParent !== parentTransform){
                        if (newParent === null){
                            parentTransform = null;
                            core.Util.removeElementFromArray(newParent.children,this);
                        } else {
                            parentTransform = newParent;
                            newParent.children.push(this);
                        }
                        markGlobalDirty();
                    }
                }
            }
        });

        /**
         * Return the local transformation matrix
         * @method getLocalMatrix
         * @return {KICK.math.mat4} local transformation
         */
        this.getLocalMatrix = function () {
            if (dirty[LOCAL]) {
                mat4.setTRS(localPosition,localRotationQuat,localScale,localMatrix);
                dirty[LOCAL] = 0;
            }
            return localMatrix;
        };

        /**
         * Return the local inverse of translate rotate scale
         * @method getLocalTRSInverse
         * @return {KICK.math.mat4} inverse of local transformation
         */
        this.getLocalTRSInverse = function () {
            if (dirty[LOCAL_INV]) {
                mat4.setTRSInverse(localPosition,localRotationQuat,localScale,localMatrixInverse);
                dirty[LOCAL_INV] = 0;
            }
            return localMatrixInverse;
        };

        /**
         * @method getGlobalMatrix
         * @return {KICK.math.mat4} global transform
         */
        this.getGlobalMatrix = function () {
            if (dirty[GLOBAL]) {
                mat4.set(thisObj.getLocalMatrix(), globalMatrix);

                var transformIterator = thisObj.parent;
                while (transformIterator !== null) {
                    mat4.multiply(transformIterator.getLocalMatrix(),globalMatrix,globalMatrix);
                    transformIterator  = transformIterator.parent;
                }
                dirty[GLOBAL] = 0;
            }
            return globalMatrix;
        };

        /**
         * Return the inverse of global rotate translate transform
         * @method getGlobalTRSInverse
         * @return {KICK.math.mat4} inverse global transform
         */
        this.getGlobalTRSInverse = function () {
            if (dirty[GLOBAL_INV]) {
                mat4.set(thisObj.getLocalTRSInverse(), globalMatrixInverse);
                var transformIterator = thisObj.parent;
                while (transformIterator !== null) {
                    mat4.multiply(globalMatrixInverse,transformIterator.getLocalTRSInverse(),globalMatrixInverse);
                    transformIterator  = transformIterator.parent;
                }
                dirty[GLOBAL_INV] = 0;
            }
            return globalMatrixInverse;
        };

        /**
         * Mark the global transform updated.
         * This will mark the transform updated (meaning the global transform must be recomputed based on
         * translation, rotation, scale)
         * @method markGlobalDirty
         * @private
         */
        this._markGlobalDirty = markGlobalDirty;

        /**
         * @method toJSON
         * @return {Object} JSON formatted object
         */
        this.toJSON = function(){
            var typedArrayToArray = KICK.core.Util.typedArrayToArray;
            if (ASSERT){
                if (!thisObj.gameObject || !thisObj.gameObject.engine){
                    fail("Cannot serialize a Transform object that has no reference to gameObject/engine");
                }
            }
            return {
                type:"KICK.scene.Transform",
                uid: gameObject.engine.getUID(thisObj),
                config:{
                    localPosition: typedArrayToArray(localPosition),
                    localRotation: typedArrayToArray(localRotationQuat),
                    localScale: typedArrayToArray(localScale),
                    parent: parentTransform ? KICK.core.Util.getJSONReference(thisObj.gameObject.engine,parentTransform): null
                }
            };
        };

        /**
         * @method
         */
        this.str = function(){
            return JSON.stringify(thisObj.toJSON());
        };
    };

    /**
     * A scene objects contains a list of GameObjects
     * @class Scene
     * @namespace KICK.scene
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @extends KICK.core.ProjectAsset
     */
    scene.Scene = function (engine, config) {
        var objectsById = {},
            gameObjects = [],
            activeGameObjects = [],
            gameObjectsNew = [],
            gameObjectsDelete = [],
            updateableComponents= [],
            componentsNew = [],
            componentsDelete = [],
            componentListenes = [],
            componentsAll = [],
            cameras = [],
            renderableComponents = [],
            sceneLightObj = new KICK.scene.SceneLights(engine.config.maxNumerOfLights),
            _name = "Scene",
            _uid = 0,
            gl,
            i,
            thisObj = this,
            addLight = function(light){
                if (light.type == 1){
                    sceneLightObj.ambientLight = light;
                } else if (light.type === 2){
                    sceneLightObj.directionalLight = light;
                } else {
                    sceneLightObj.addPointLight(light);
                }
            },
            removeLight = function(light){
                if (light.type == 1){
                    sceneLightObj.ambientLight = null;
                } else if (light.type === 2){
                    sceneLightObj.directionalLight = null;
                } else {
                    sceneLightObj.removePointLight(light);
                }
            },
            /**
             * Compares two objects based on scriptPriority
             * @method sortByScriptPriority
             * @param {KICK.scene.Component} a
             * @param {KICK.scene.Component} b
             * @return {Number} order of a,b
             * @private
             */
            sortByScriptPriority = function (a,b) {
                return a.scriptPriority-b.scriptPriority;
            },
            /**
             * Compares two camera objects by their cameraIndex attribute
             * @method cameraSortFunc
             * @param {KICK.scene.Camera} a
             * @param {KICK.scene.Camera} b
             * @param {Number} difference
             * @private
             */
            cameraSortFunc = function(a,b){
                return b.cameraIndex - a.cameraIndex;
            },
            /**
             * Handle insertions of new gameobjects and components. This is done in a separate step to avoid problems
             * with missed updates (or multiple updates) due to modifying the array while iterating it.
             * @method addNewGameObjects
             * @private
             */
            addNewGameObjects = function () {
                var i,
                    component;
                if (gameObjectsNew.length > 0) {
                    activeGameObjects = activeGameObjects.concat(gameObjectsNew);
                    gameObjectsNew.length = 0;
                }
                if (componentsNew.length > 0) {
                    var componentsNewCopy = componentsNew;
                    componentsNew = [];
                    for (i = componentsNewCopy.length-1; i >= 0; i--) {
                        component = componentsNewCopy[i];
                        componentsAll.push(component);
                        if (typeof(component.activated) === "function") {
                            component.activated();
                        }
                        if (typeof(component.update) === "function") {
                            core.Util.insertSorted(component,updateableComponents,sortByScriptPriority);
                        }
                        if (typeof(component.render) === "function") {
                            renderableComponents.push(component);
                        }
                        if (typeof(component.render) === "function") {
                            core.Util.removeElementFromArray(renderableComponents,component);
                        }
                        if (component instanceof scene.Camera){
                            KICK.core.Util.insertSorted(component,cameras,cameraSortFunc);
                        } else if (component instanceof scene.Light){
                            addLight(component);
                        }
                    }
                    for (i=componentListenes.length-1; i >= 0; i--) {
                        componentListenes[i].componentsAdded(componentsNewCopy);
                    }
                }
            },/**
             * Handle deletion of new gameobjects and components. This is done in a separate step to avoid problems
             * with missed updates (or multiple updates) due to modifying the array while iterating it.
             * @method cleanupGameObjects
             * @private
             */
            cleanupGameObjects = function () {
                var i,
                    component;
                if (gameObjectsDelete.length > 0) {
                    core.Util.removeElementsFromArray(activeGameObjects,gameObjectsDelete);
                    core.Util.removeElementsFromArray(gameObjects,gameObjectsDelete);
                    gameObjectsDelete.length = 0;
                }
                if (componentsDelete.length > 0) {
                    var componentsDeleteCopy = componentsDelete;
                    componentsDelete = [];
                    for (i = componentsDeleteCopy.length-1; i >= 0; i--) {
                        component = componentsDeleteCopy[i];
                        core.Util.removeElementFromArray(componentsAll,component);
                        if (typeof(component.deactivated) === "function") {
                            component.deactivated();
                        }
                        if (typeof(component.update) === "function") {
                            core.Util.removeElementFromArray(updateableComponents,component);
                        }
                        if (component instanceof scene.Camera){
                            core.Util.removeElementFromArray(cameras,component);
                        } else if (component instanceof scene.Light){
                            removeLight(component);
                        }
                    }
                    for (i=componentListenes.length-1; i >= 0; i--) {
                        componentListenes[i].componentsRemoved(componentsDeleteCopy);
                    }
                }
            },
            updateComponents = function(){
                cleanupGameObjects();
                addNewGameObjects();
                var i;
                for (i=updateableComponents.length-1; i >= 0; i--) {
                    updateableComponents[i].update();
                }
            },
            renderComponents = function(){
                var i;
                for (i=cameras.length-1; i >= 0; i--) {
                    cameras[i].renderScene(sceneLightObj);
                }
                engine.gl.flush();
            },
            createGameObjectPrivate = function(config){
                var gameObject = new scene.GameObject(thisObj,config);
                gameObjectsNew.push(gameObject);
                gameObjects.push(gameObject);
                objectsById[gameObject.uid] = gameObject;
                return gameObject;
            };


        this.notifyComponentUpdated = function(component){
            for (i=componentListenes.length-1; i >= 0; i--) {
                componentListenes[i].componentUpdated(component);
            }
        };

        /**
         * @method destroy
         */
        this.destroy = function(){
            engine.project.removeResourceDescriptor(thisObj.uid);
            if (thisObj === engine.activeScene){
                engine.activeScene = null;
            }
        };

        /**
         * Add a component listener to the scene. A component listener should contain two functions:
         * {componentsAdded(components) and componentsRemoved(components)}.
         * Throws an exception if the two required functions does not exist.
         * @method addComponentListener
         * @param {KICK.scene.ComponentChangedListener} componentListener
         */
        this.addComponentListener = function (componentListener) {
            if (!scene.ComponentChangedListener.isComponentListener(componentListener) ) {
                KICK.core.Util.fail("Component listener does not have the correct interface. " +
                        "It should contain the two functions: " +
                        "componentsAdded(components) and componentsRemoved(components)");
            }
            if (!componentListener.componentUpdated){
                componentListener.componentUpdated = function(){};
                if (DEBUG){
                    warn("componentListener has no componentUpdated method");
                }
            }
            componentListenes.push(componentListener);
            // add current components to component listener
            componentListener.componentsAdded(componentsAll);
        };

        /**
         * Search the scene for components of the specified type in the scene. Note that this
         * method is slow - do not run in the the update function.
         * @method findComponentsOfType
         * @param {Function} componentType
         * @return {Array[KICK.scene.Component]} components
         */
        this.findComponentsOfType = function(componentType){
            if (ASSERT){
                if (typeof componentType !== 'function'){
                    KICK.core.Util.fail("Scene.findComponentsOfType expects a function");
                }
            }
            var res = [];
            for (var i=gameObjects.length-1;i>=0;i--){
                var component = gameObjects[i].getComponentsOfType(componentType);
                for (var j=0;j<component.length;j++){
                    res.push(component[j]);
                }
            }
            return res;
        };

        /**
         * Removes a component change listener from the scene
         * @method removeComponentListener
         * @param {KICK.scene.ComponentChangedListener} componentListener
         */
        this.removeComponentListener = function (componentListener) {
            core.Util.removeElementFromArray(componentListenes,componentListener);
        };

        /**
         * Should only be called by GameObject when a component is added. If the component is updateable (implements
         * update method) the components is added to the current list of updateable components after the update loop
         * (so it will not recieve any update invocations in the current frame).
         * If the component is renderable (implements), is it added to the renderer's components
         * @method addComponent
         * @param {KICK.scene.Component} component
         * @protected
         */
        this.addComponent = function (component) {
            core.Util.insertSorted(component,componentsNew,sortByScriptPriority);
            var uid = engine.getUID(component);
            if (ASSERT){
                if (objectsById[uid]){
                    core.Util.fail("Component with uid "+uid+" already exist");
                }
            }
            objectsById[uid] = component;
        };

        /**
         * @method getObjectByUID
         * @param {Number} uid
         * @return {Object} GameObject or component
         */
        this.getObjectByUID = function(uid){
            return objectsById[uid];
        };

        /**
         * Returns a gameobject identified by name
         * @method getGameObjectByName
         * @param {String} name
         * @return {KICK.scene.GameObject} GameObject or undefined if not found
         */
        this.getGameObjectByName = function(name){
            for (var i=gameObjects.length-1;i>=0;i--){
                var gameObject = gameObjects[i];
                if (gameObject.name === name){
                    return gameObject;
                }
            }
        };


        /**
         * @method removeComponent
         * @param {KICK.scene} component
         */
        this.removeComponent = function (component) {
            core.Util.removeElementFromArray(componentsNew,component);
            componentsDelete.push(component);
            delete objectsById[component.uid];
        };

        Object.defineProperties(this,{
            /**
             * Reference to the engine
             * @property engine
             * @type KICK.core.Engine
             */
            engine:{
                value:engine
            },
            /**
             * Name of the scene
             * @property name
             * @type String
             */
            name:{
                get:function(){
                    return _name;
                },
                set:function(newValue){
                    _name = newValue;
                }

            },
            /**
             * @property uid
             * @type Number
             */
            uid:{
                get:function(){
                    return _uid;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (_uid){
                            fail("Reassigning uid")
                        }
                    }
                    _uid = newValue;
                }
            }
        });

        /**
         * @method createGameObject
         * @param {Object} config Optionally configuration passed to the game objects
         * @return {KICK.scene.GameObject}
         */
        this.createGameObject = function (config) {
            var gameObject = createGameObjectPrivate(config),
                transform = gameObject.transform;
            objectsById[engine.getUID(transform)] = transform;
            return gameObject;
        };

        /**
         * Destroys the game object and delete it from the scene.
         * This call will call destroy on the gameObject
         * @method destroyObject
         * @param {KICK.scene.GameObject} gameObject
         */
        this.destroyObject = function (gameObject) {
            var isMarkedForDeletion = core.Util.contains(gameObjectsDelete, gameObject);
            if (!isMarkedForDeletion){
                gameObjectsDelete.push(gameObject);
                delete objectsById[gameObject.uid];
            }
            if (!gameObject.destroyed){
                gameObject.destroy();
            }
        };

        /**
         * @method getNumberOfGameObjects
         * @return {Number} number of gameobjects
         */
        this.getNumberOfGameObjects = function () {
            return gameObjects.length;
        };

        /**
         * @method getGameObject
         * @param {Number} index
         * @return {KICK.scene.GameObject}
         */
        this.getGameObject = function (index) {
            return gameObjects[index];
        };

        /**
         * Called by engine every frame. Updates and render scene
         * @method updateAndRender
         */
        this.updateAndRender = function () {
            updateComponents();
            renderComponents();
        };

        /**
         * @method toJSON
         * @param {Function} filter Optional. Filter with function(object): return boolean, where true means include in export.
         * @return {Object}
         */
        this.toJSON = function (filterFn){
            var gameObjectsCopy = [];
            filterFn = filterFn || function(){return true;}
            for (var i=0;i<gameObjects.length;i++){
                var gameObject = gameObjects[i];
                if (filterFn(gameObject)){
                    gameObjectsCopy.push(gameObject.toJSON());
                }
            }
            return {
                uid: thisObj.uid,
                gameObjects: gameObjectsCopy,
                name: _name
            };
        };

        (function init(){

            var gameObject,
                hasProperty = KICK.core.Util.hasProperty,
                applyConfig = KICK.core.Util.applyConfig;
            if (config){
                _uid = config.uid;
                _name = config.name || "Scene";
                var gameObjects = config.gameObjects || [],
                    mappingUidToObject = {},
                    newGameObjects = [],
                    configs = {};
                // create game objects
                (function createGameObjects(){
                    for (var i=0;i<gameObjects.length;i++){
                        gameObject = config.gameObjects[i];
                        newGameObjects[i] = createGameObjectPrivate(gameObject);
                        mappingUidToObject[gameObject.uid] = newGameObjects[i];
                    }
                })();

                var createConfigWithReferences = function (config){
                    var configCopy = {};
                    for (var name in config){
                        if (hasProperty(config,name)){
                            var value = config[name];
                            value = KICK.core.Util.deserializeConfig(value,engine,thisObj);
                            configCopy[name] = value;
                        }
                    }
                    return configCopy;
                };

                (function createComponents(){
                    var component,
                        componentObj,
                        type,
                        gameObjectConfig;
                    var gameObjects = config.gameObjects || [];

                    for (var j=0;j<gameObjects.length;j++){
                        gameObjectConfig = config.gameObjects[j];
                        gameObject = newGameObjects[j];
                        // build components
                        for (var i=0;gameObjectConfig.components && i<gameObjectConfig.components.length;i++){
                            component = gameObjectConfig.components[i];
                            if (component.type === "KICK.scene.Transform"){
                                componentObj = gameObject.transform;
                                componentObj.uid = component.uid;
                                // register transform object to objectsById
                                objectsById[componentObj.uid] = componentObj;
                            } else {
                                type = KICK.namespace(component.type);
                                if (typeof type === 'function'){
                                    componentObj = new type({uid:component.uid});
                                    componentObj.uid = component.uid;
                                    gameObject.addComponent(componentObj);
                                } else {
                                    KICK.core.Util.warn("Cannot find Class "+component.type);
                                    continue;
                                }
                            }
                            mappingUidToObject[component.uid] = componentObj;
                            configs[component.uid] = component.config;
                        }
                    }

                    // apply config
                    for (var uid in mappingUidToObject){
                        if (hasProperty(mappingUidToObject,uid)){
                            var originalConf = configs[uid];
                            if (originalConf){
                                var conf = createConfigWithReferences(originalConf);
                                var obj = mappingUidToObject[uid];
                                applyConfig(obj,conf);
                            }
                        }
                    }
                })();
            }
            engine.project.registerObject(thisObj, "KICK.scene.Scene");
        })();
    };

    /**
     * Create empty scene with camera
     * @method createDefault
     * @param {KICK.core.Engine} engine
     * @static
     * @return {KICK.scene.Scene}
     */
    scene.Scene.createDefault = function(engine){
        var newScene = new scene.Scene(engine);
        var gameObject = newScene.createGameObject();
        gameObject.addComponent(new scene.Camera());
        return newScene;
    };

    /**
     * Creates a game camera
     * @class Camera
     * @namespace KICK.scene
     * @extends KICK.scene.Component
     * @constructor
     * @param {Config} configuration with same properties as the Camera
     */
    scene.Camera = function (config) {
        var gl,
            thisObj = this,
            transform,
            engine,
            _enabled = true,
            c = KICK.core.Constants,
            _renderShadow = false,
            _renderTarget = null,
            _fieldOfView = 60,
            _near = 0.1,
            _far = 1000,
            _left = -1,
            _right = 1,
            _bottom = -1,
            _top = 1,
            _clearColor = [0,0,0,1],
            _perspective = true,
            _clearFlagColor = true,
            _clearFlagDepth = true,
            _replacementShader = null,
            _currentClearFlags,
            _cameraIndex = 1,
            _layerMask = 0xffffffff,
            _shadowmapShader,
            _scene,
            pickingQueue = null,
            pickingShader = null,
            pickingRenderTarget = null,
            pickingClearColor = vec4.create(),
            projectionMatrix = mat4.create(),
            viewMatrix = mat4.create(),
            viewProjectionMatrix = mat4.create(),
            lightMatrix = mat4.create(),
            engineUniforms = {
                    viewMatrix: viewMatrix,
                    projectionMatrix: projectionMatrix,
                    viewProjectionMatrix:viewProjectionMatrix,
                    lightMatrix:lightMatrix
                },
            renderableComponentsBackGroundAndGeometry = [],
            renderableComponentsTransparent = [],
            renderableComponentsOverlay = [],
            renderableComponentsArray = [renderableComponentsBackGroundAndGeometry,renderableComponentsTransparent,renderableComponentsOverlay],
            _normalizedViewportRect = vec4.create([0,0,1,1]),
            offsetMatrix = mat4.create([
                0.5,0  ,0  ,0,
                0  ,0.5,0  ,0,
                0  ,0  ,0.5,0,
                0.5,0.5,0.5,1
            ]),
            shadowLightProjection,
            shadowLightOffsetFromCamera,
            isNumber = function (o) {
                return typeof (o) === "number";
            },
            isBoolean = function(o){
                return typeof (o) === "boolean";
            },
            computeClearFlag = function(){
                _currentClearFlags = (_clearFlagColor ? 16384 : 0) | (_clearFlagDepth ? 256 : 0);
            },
            setupClearColor = function (color) {
                if (gl.currentClearColor !== color) {
                    gl.currentClearColor = color;
                    gl.clearColor(color[0], color[1], color[2], color[3]);
                }
            },
            assertNumber = function(newValue,name){
                if (!isNumber(newValue)){
                    KICK.core.Util.fail("Camera."+name+" must be number");
                }
            },
            setupViewport = function(offsetX,offsetY,width,height){
                gl.viewport(offsetX,offsetY,width,height);
                gl.scissor(offsetX,offsetY,width,height);
            },
            /**
             * Clear the screen and set the projectionMatrix and modelViewMatrix on the gl object
             * @method setupCamera
             * @private
             */
            setupCamera = function () {
                var viewportDimension = _renderTarget?_renderTarget.dimension:gl.viewportSize,
                    viewPortWidth = viewportDimension[0],
                    viewPortHeight = viewportDimension[1],
                    offsetX = viewPortWidth*_normalizedViewportRect[0],
                    offsetY = viewPortHeight*_normalizedViewportRect[1],
                    width = viewPortWidth*_normalizedViewportRect[2],
                    height = viewPortHeight*_normalizedViewportRect[3];
                setupViewport(offsetX,offsetY,width,height);
                gl.currentMaterial = null; // clear current material
                // setup render target
                if (gl.renderTarget !== _renderTarget){
                    if (_renderTarget){
                        _renderTarget.bind();
                    } else {
                        gl.bindFramebuffer(36160, null);
                    }
                    gl.renderTarget = _renderTarget;
                }

                setupClearColor(_clearColor);
                gl.clear(_currentClearFlags);

                if (_perspective) {
                    mat4.perspective(_fieldOfView, gl.viewportSize[0] / gl.viewportSize[1],
                        _near, _far, projectionMatrix);
                } else {
                    mat4.ortho(_left, _right, _bottom, _top,
                        _near, _far, projectionMatrix);
                }

                var globalMatrixInv = transform.getGlobalTRSInverse();
                mat4.set(globalMatrixInv, viewMatrix);

                mat4.multiply(projectionMatrix,viewMatrix,viewProjectionMatrix);
            },
            /**
             * Compare two objects based on renderOrder value, then on material.shader.uid (if exist)
             * and finally on mesh.
             * @method compareRenderOrder
             * @param {Component}
             * @param {Component}
             * @return Number
             * @private
             */
            compareRenderOrder = function(a,b){
                var aRenderOrder = a.renderOrder || 1000,
                    bRenderOrder = b.renderOrder || 1000;
                var getMeshShaderUid = function(o, defaultValue){
                    var names = ["material","shader","uid"];
                    for (var i=0;i<names.length;i++){
                        o = o[names[i]];
                        if (!o){
                            if (DEBUG){
                                debugger;
                                warn("Cannot find uid of "+o);
                            }
                            return defaultValue;
                        }
                    }
                    return o;
                };
                var getMeshUid = function(o, defaultValue){
                    return o.mesh.uid || defaultValue;
                };
                if (aRenderOrder === bRenderOrder && a.material && b.material){
                    aRenderOrder = getMeshShaderUid(a,aRenderOrder);
                    bRenderOrder = getMeshShaderUid(b,aRenderOrder);
                }
                if (aRenderOrder === bRenderOrder && a.mesh && b.mesh){
                    aRenderOrder = getMeshUid(a,aRenderOrder);
                    bRenderOrder = getMeshUid(b,aRenderOrder);
                }
                return aRenderOrder-bRenderOrder;
            },
            sortTransparentBackToFront = function(){
                // calculate distances
                var temp = vec3.create();
                var cameraPosition = transform.position;
                for (var i=renderableComponentsTransparent.length-1;i>=0;i--){
                    var object = renderableComponentsTransparent[i];
                    var objectPosition = object.gameObject.transform.position;
                    object.distanceToCamera = vec3.lengthSqr(vec3.subtract(objectPosition, cameraPosition, temp));
                }
                function compareDistanceToCamera(a,b){
                    return b.distanceToCamera-a.distanceToCamera;
                }
                renderableComponentsTransparent.sort(compareDistanceToCamera);
            },
            /**
             * @method renderSceneObjects
             * @param sceneLightObj
             * @param shader
             * @private
             */
            renderSceneObjects = (function(){
                var aabbWorldSpace = KICK.math.aabb.create(),
                    frustumPlanes = new Float32Array(24);
                return function(sceneLightObj,shader){
                    var render = function(renderableComponents){
                        var length = renderableComponents.length;
                        for (var j=0;j<length;j++){
                            var renderableComponent = renderableComponents[j];
                            if (!cullByViewFrustum(renderableComponent)){
                                renderableComponent.render(engineUniforms,shader);
                            }
                        }
                    },
                        cullByViewFrustum = function(component){
                            var componentAabb = component.aabb,
                                gameObject = component.gameObject;

                            if (componentAabb && gameObject){
                                aabb.transform(componentAabb,gameObject.transform.getGlobalMatrix(),aabbWorldSpace);
                                return frustum.intersectAabb(frustumPlanes,aabbWorldSpace) === frustum.OUTSIDE;
                            }
                            return false;
                        };
                    // update frustum planes
                    frustum.extractPlanes(engineUniforms.viewProjectionMatrix,false,frustumPlanes);
                    engineUniforms.sceneLights=sceneLightObj;
                    render(renderableComponentsBackGroundAndGeometry);
                    render(renderableComponentsTransparent);
                    render(renderableComponentsOverlay);
                };
            })(),
            renderShadowMap = function(sceneLightObj){
                var directionalLight = sceneLightObj.directionalLight,
                    directionalLightTransform = directionalLight.gameObject.transform,
                    shadowRenderTexture = directionalLight.shadowRenderTexture,
                    renderTextureDimension = shadowRenderTexture.dimension,
                    renderTextureWidth = renderTextureDimension[0],
                    renderTextureHeight = renderTextureDimension[1];
                setupViewport(0,0,renderTextureWidth,renderTextureHeight);

                shadowRenderTexture.bind();
                setupClearColor([1,1,1,1]);
                gl.clear(16384 | 256);

                // fitting:
                // Using a sphere with the center in front of the camera (based on 0.5 * engine.config.shadowDistance)
                // The actual light volume is a bit larget than the sphere (to include the corners).
                // The near plane of the light volume is extended by the engine.config.shadowNearMultiplier
                // Note that this is a very basic fitting algorithm with rooms for improvement
                mat4.set(shadowLightProjection, projectionMatrix)

                // find the position of the light 'center' in world space
                var transformedOffsetFromCamera =quat4.multiplyVec3(transform.rotation,[0,0,-shadowLightOffsetFromCamera]);
                var cameraPosition = vec3.add(transformedOffsetFromCamera,transform.position);
                // adjust to reduce flicker when rotating camera
                cameraPosition[0] = Math.round(cameraPosition[0]);
                cameraPosition[1] = Math.round(cameraPosition[1]);
                cameraPosition[2] = Math.round(cameraPosition[2]);

                mat4.setTRSInverse(cameraPosition,directionalLightTransform.localRotation, [1,1,1],viewMatrix);

                mat4.multiply(projectionMatrix,viewMatrix,viewProjectionMatrix);

                // update light matrix (will be used when scene is rendering with shadow map shader)
                mat4.multiply(mat4.multiply(offsetMatrix,projectionMatrix,lightMatrix),
                    viewMatrix,lightMatrix);

                renderSceneObjects(sceneLightObj,_shadowmapShader);

            },
            componentListener = {
                /**
                 * Add components that implements the render function and match the camera layerMask to cameras renderable components
                 * @method componentsAdded
                 * @param {Array[KICK.scene.Component]} components
                 * @private
                 */
                componentsAdded : function( components ){
                    for (var i=components.length-1; i>=0; i--) {
                        var component = components[i];
                        if (typeof(component.render) === "function" && (component.gameObject.layer & _layerMask)) {
                            var renderOrder = component.renderOrder || 1000;
                            var array;
                            if (renderOrder < 2000){
                                array = renderableComponentsBackGroundAndGeometry;
                            } else if (renderOrder >= 3000){
                                array = renderableComponentsOverlay;
                            } else {
                                array = renderableComponentsTransparent;
                            }
                            if (!KICK.core.Util.contains(array,component)){
                                insertSorted(component,array,compareRenderOrder);
                            }
                        }
                    }
                },

                /**
                 * @method componentsRemoved
                 * @param {Array[KICK.scene.Component]} components
                 * @return {Boolean}
                 * @private
                 */
                componentsRemoved : function ( components ){
                    var removed = false;
                    for (var i=components.length-1; i>=0; i--) {
                        var component = components[i];
                        if (typeof(component.render) === "function") {
                            for (var j=renderableComponentsArray.length-1;j>=0;j--){
                                removed |= core.Util.removeElementFromArray(renderableComponentsArray[j],component);
                            }
                        }
                    }
                    return removed;
                },
                componentUpdated : function(component){
                    var wrap = [component];
                    var isRemoved = componentListener.componentsRemoved(wrap);
                    if (isRemoved){ // only add if component also removed
                        componentListener.componentsAdded(wrap);
                    }
                }
            };

        /**
         * Schedules a camera picking session. During next repaint a picking session is done. If the pick hits some
         * game objects, then a callback is added to the event queue (and will run in next frame).
         * @method pick
         * @param {function} gameObjectPickedFn callback function with the signature function(gameObject, hitCount)
         * @param {Number} x coordinate in screen coordinates (between 0 and canvas width - 1)
         * @param {Number} y coordinate in screen coordinates (between 0 and canvas height - 1)
         * @param {Number} width Optional (default 1)
         * @param {Number} height Optional (default 1)
         */
        this.pick = function(gameObjectPickedFn,x,y,width,height){
            width = width || 1;
            height = height || 1;
            if (!pickingQueue){
                pickingQueue = [];
                pickingShader = engine.project.load(engine.project.ENGINE_SHADER___PICK);
                pickingRenderTarget = new KICK.texture.RenderTexture(engine,{
                    dimension: gl.viewportSize
                });
                pickingRenderTarget.name = "__pickRenderTexture";
            }
            pickingQueue.push({
                gameObjectPickedFn:gameObjectPickedFn,
                x:x,
                y:gl.viewportSize[1]-y,
                width:width,
                height:height
            });
        };

        /**
         * Handles the camera setup (get fast reference to transform and glcontext).
         * Also register component listener on scene
         * @method activated
         */
        this.activated = function(){
            var gameObject = this.gameObject;
            engine = gameObject.engine;
            transform = gameObject.transform;
            gl = engine.gl;
            _scene = gameObject.scene;
            _scene.addComponentListener(componentListener);

            if (engine.config.shadows){
                _shadowmapShader = engine.project.load(engine.project.ENGINE_SHADER___SHADOWMAP);

                // calculate the shadow projection based on engine.config parameters
                shadowLightOffsetFromCamera = engine.config.shadowDistance*0.5; // first find radius
                var  shadowRadius = shadowLightOffsetFromCamera*1.55377397403004; // sqrt(2+sqrt(2))
                var nearPlanePosition = -shadowRadius*engine.config.shadowNearMultiplier;
                shadowLightProjection = mat4.create();
                mat4.ortho(-shadowRadius, shadowRadius, -shadowRadius, shadowRadius,
                    nearPlanePosition, shadowRadius, shadowLightProjection);

            } else if (_renderShadow){
                _renderShadow = false; // disable render shadow
                if (ASSERT){
                    fail("engine.config.shadows must be enabled for shadows");
                }
            }
        };

        /**
         * Deregister component listener on scene
         * @method deactivated
         */
        this.deactivated = function(){
            _scene.removeComponentListener(thisObj);
        };

        /**
         * @method renderScene
         * @param {KICK.scene.SceneLights} sceneLightObj
         */
        this.renderScene = function(sceneLightObj){
            if (!_enabled){
                return;
            }
            if (_renderShadow && sceneLightObj.directionalLight && sceneLightObj.directionalLight.shadow){
                gl.currentMaterial = null; // clear current material
                renderShadowMap(sceneLightObj);
            }
            setupCamera();

            sceneLightObj.recomputeLight(viewMatrix);
            if (renderableComponentsTransparent.length>0){
                sortTransparentBackToFront();
            }
            renderSceneObjects(sceneLightObj,_replacementShader);

            if (_renderTarget && _renderTarget.colorTexture && _renderTarget.colorTexture.generateMipmaps ){
                var textureId = _renderTarget.colorTexture.textureId;
                gl.bindTexture(gl.TEXTURE_2D, textureId);
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            if (pickingQueue && pickingQueue.length>0){
                gl.currentMaterial = null; // clear current material
                pickingRenderTarget.bind();
                setupClearColor(pickingClearColor);
                gl.clear(16384 | 256);
                renderSceneObjects(sceneLightObj,pickingShader);
                for (var i=pickingQueue.length-1;i>=0;i--){
                    // create clojure
                    (function(){
                        var pick = pickingQueue[i],
                            pickArrayLength = pick.width*pick.width*4,
                            array = new Uint8Array(pickArrayLength);
                        gl.readPixels( pick.x, pick.y, pick.width,pick.height, 6408, 5121,array);
                        var objects = [];
                        var objectCount = {};
                        for (var j = 0;j<pickArrayLength;j+=4){
                            var subArray = array.subarray(j,j+4),
                                uid = vec4uint8ToUint32(subArray);
                            if (uid>0){
                                if (objectCount[uid]){
                                    objectCount[uid]++;
                                } else {
                                    var foundObj = _scene.getObjectByUID(uid);
                                    if (foundObj){
                                        objects.push(foundObj);
                                        objectCount[uid] = 1;
                                    }
                                }
                            }
                        }
                        if (objects.length){
                            engine.eventQueue.add(function(){
                                for (var i=0;i<objects.length;i++){
                                    var obj = objects[i];
                                    pick.gameObjectPickedFn(obj, objectCount[obj.uid]);
                                }
                            },0);
                        }
                    })();
                }
                pickingQueue.length = 0;
            }
        };

        Object.defineProperties(this,{
            /**
             * Allows usage of replacement shader on camera rendering
             * Default value is null.
             * @property replacementShader
             * @type KICK.material.Shader
             */
            replacementShader:{
                get:function(){return _replacementShader; },
                set:function(newValue){_replacementShader = newValue;}
            },
            /**
             * Default is true
             * @property enabled
             * @type Boolean
             */
            enabled:{
                get:function(){ return _enabled;},
                set:function(newValue){ _enabled = newValue;}
            },
            /**
             * Default false
             * @property renderShadow
             * @type Boolean
             */
            renderShadow:{
                get:function(){return _renderShadow;},
                set:function(newValue){
                    if (engine){ // if object is initialized
                        if (engine.config.shadows){
                            _renderShadow = newValue;
                        } else if (newValue) {
                            if (ASSERT){
                                fail("engine.config.shadows must be enabled for shadows");
                            }
                        }
                    } else {
                        _renderShadow = newValue;
                    }
                }
            },
            /**
             * Camera renders only objects where the components layer exist in the layer mask. <br>
             * @property layerMask
             * @type Number
             */
            layerMask:{
                get:function(){ return _layerMask;},
                set:function(newValue){
                    if (true){
                        if (!isNumber(newValue)){
                            KICK.core.Util.fail("Camera.layerMask should be a number");
                        }
                    }
                    _layerMask = newValue;
                }
            },
            /**
             * Set the render target of the camera. Null means screen framebuffer.<br>
             * @property renderTarget
             * @type KICK.texture.RenderTexture
             */
            renderTarget:{
                get:function(){ return _renderTarget;},
                set:function(newValue){
                    if (true){
                        if (newValue != null && !(newValue instanceof KICK.texture.RenderTexture)){
                            KICK.core.Util.fail("Camera.renderTarget should be null or a KICK.texture.RenderTexture");
                        }
                    }
                    _renderTarget = newValue;
                }
            },
            /**
             * Set the field of view Y in degrees<br>
             * Only used when perspective camera type. Default 60.0.
             * Must be between 1 and 179
             * @property fieldOfView
             * @type Number
             */
            fieldOfView:{
                get:function(){ return _fieldOfView;},
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"fieldOfView");
                    }
                    _fieldOfView = Math.min(179,Math.max(newValue,1));
                }
            },
            /**
             * Set the near clipping plane of the view volume<br>
             * Used in both perspective and orthogonale camera.<br>
             * Default 0.1
             * @property near
             * @type Number
             */
            near:{
                get:function(){
                    return _near;
                },
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"near");
                    }
                    _near = newValue;
                }
            },
            /**
             * Set the far clipping plane of the view volume<br>
             * Used in both perspective and orthogonale camera.<br>
             * Default 1000.0
             * @property far
             * @type Number
             */
            far:{
                get:function(){
                    return _far;
                },
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"far");
                    }
                    _far = newValue;
                }
            },
            /**
             * True means camera is perspective projection, false means orthogonale projection<br>
             * Default true
             * @property perspective
             * @type Boolean
             */
            perspective:{
                get:function(){
                    return _perspective;
                },
                set:function(newValue){
                    if (true){
                        if (!isBoolean(newValue)){
                            KICK.core.Util.fail("Camera.perspective must be a boolean");
                        }
                    }
                    _perspective = newValue;
                }
            },
            /**
             * Only used for orthogonal camera type (!cameraTypePerspective). Default -1
             * @property left
             * @type Number
             */
            left:{
                get:function(){
                    return _left;
                },
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"left");
                    }
                    _left = newValue;
                }
            },
            /**
             * Only used for orthogonal camera type (!cameraTypePerspective). Default 1
             * @property left
             * @type Number
             */
            right:{
                get:function(){
                    return _right;
                },
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"right");
                    }
                    _right= newValue;
                }
            },
            /**
             * Only used when orthogonal camera type (!cameraTypePerspective). Default -1
             * @property bottom
             * @type Number
             */
            bottom:{
                get:function(){
                    return _bottom;
                },
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"bottom");
                    }
                    _bottom = newValue;
                }
            },
            /**
             * Only used when orthogonal camera type (!cameraTypePerspective). Default 1
             * @property top
             * @type Number
             */
            top:{
                get:function(){
                    return _top;
                },
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"top");
                    }
                    _top = newValue;
                }
            },
            /**
             * The sorting order when multiple cameras exists in the scene.<br>
             * Cameras with lowest number is rendered first.
             * @property cameraIndex
             * @type Number
             */
            cameraIndex:{
                get:function(){
                    return _cameraIndex;
                },
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"cameraIndex");
                    }
                    _cameraIndex = newValue;
                }
            },
            /**
             * Only used when orthogonal camera type (!cameraTypePerspective). Default [0,0,0,1]
             * @property clearColor
             * @type KICK.math.vec4
             */
            clearColor:{
                get:function(){
                    return vec4.create(_clearColor);
                },
                set:function(newValue){
                    _clearColor = vec4.create(newValue);
                }
            },
            /**
             * Indicates if the camera should clear color buffer.<br>
             * Default value is true
             * @property clearFlagColor
             * @type Boolean
             */
            clearFlagColor:{
                get:function(){
                    return _clearFlagColor;
                },
                set:function(newValue){
                    computeClearFlag();
                    _clearFlagColor = newValue;
                }
            },
            /**
             * Indicates if the camera should clear the depth buffer.<br>
             * Default is true.
             * @property clearFlagDepth
             * @type Boolean
             */
            clearFlagDepth:{
                get:function(){
                    return _clearFlagDepth;
                },
                set:function(newValue){
                    computeClearFlag();
                    _clearFlagDepth = newValue;
                }
            },
            /**
             * Normalized viewport rect [xOffset,yOffset,xWidth,yHeight]<br>
             * Default is [0,0,1,1]
             * @property normalizedViewportRect
             * @type Array[Number]
             */
            normalizedViewportRect:{
                get:function(){
                    return _normalizedViewportRect;
                },
                set:function(newValue){
                    if (true){
                        if (newValue.length !== 4){
                            KICK.core.Util.fail("Camera.normalizedViewportRect must be Float32Array of length 4");
                        }
                    }
                    vec4.set(newValue,_normalizedViewportRect);
                }
            }
        });

        this.toJSON = function(){
            return {
                type:"KICK.scene.Camera",
                uid: thisObj.uid || (engine?engine.getUID(thisObj):0),
                config:{
                    enabled: _enabled,
                    renderShadow: _renderShadow,
                    layerMask:_layerMask,
                    renderTarget:KICK.core.Util.getJSONReference(engine,_renderTarget),
                    fieldOfView:_fieldOfView,
                    near:_near,
                    far:_far,
                    perspective:_perspective,
                    left:_left,
                    right:_right,
                    bottom:_bottom,
                    top:_top,
                    cameraIndex:_cameraIndex,
                    clearColor:KICK.core.Util.typedArrayToArray(_clearColor),
                    clearFlagColor:_clearFlagColor,
                    clearFlagDepth:_clearFlagDepth,
                    normalizedViewportRect:KICK.core.Util.typedArrayToArray(_normalizedViewportRect)
                }
            };
        };

        applyConfig(this,config);
        computeClearFlag();
    };

    /**
     * Reset the camera clear flags
     * @method setupClearFlags
     * @param {Boolean} clearColor
     * @param {Boolean} clearDepth
     */
    scene.Camera.prototype.setupClearFlags = function (clearColor,clearDepth) {
        this.clearColor = clearColor;
        this.clearDepth = clearDepth;
        delete this._currentClearFlags;
    };

    /**
     * Specifies the interface for a component listener.<br>
     * Note that object only need to implement the methods componentsAdded and componentsRemoved.<br>
     * However the class does exist and has the static method isComponentListener
     * @class ComponentChangedListener
     * @namespace KICK.scene
     */
    scene.ComponentChangedListener = {
        /**
         * @method componentsAdded
         * @param {Array[KICK.scene.Components]} components
         */
        /**
         * @method componentsRemoved
         * @param {Array[KICK.scene.Components]} components
         */
        /**
         * @method isComponentListener
         * @param {Object} obj
         * @static
         */
        isComponentListener: function (obj) {
            return obj &&
                typeof(obj.componentsAdded) === "function" &&
                typeof(obj.componentsRemoved) === "function";
        }
    };

    /**
     * Renders a Mesh.
     * To create custom renderable objects you should not inherit from this class, but simple create a component with a
     * render() method.
     * @class MeshRenderer
     * @constructor
     * @namespace KICK.scene
     * @extends KICK.scene.Component
     * @final
     * @param {Object} config configuration
     */
    scene.MeshRenderer = function (config) {
        var transform,
            _materials = [],
            _mesh,
            _renderOrder,
            thisObj = this;

        /**
         * @method activated
         */
        this.activated = function(){
            transform = thisObj.gameObject.transform;
        };

        Object.defineProperties(this,{
            // inherit documentation from component
            aabb:{
                get:function(){
                    return _mesh.aabb;
                }
            },
            // inherit documentation from component
            renderOrder:{
                get:function(){
                    return _renderOrder;
                }
            },
            /**
             * Shortcut for materials[0]
             * @property material
             * @type KICK.material.Material
             */
            material:{
                get:function(){
                    if (_materials.length === 0){
                        return null;
                    }
                    return _materials[0];
                },
                set:function(newValue){
                    if (ASSERT){
                        if (!(newValue instanceof KICK.material.Material)){
                            KICK.core.Util.fail("MeshRenderer.material must be a KICK.material.Material");
                        }
                    }
                    _materials[0] = newValue;
                    _renderOrder = _materials[0].renderOrder;
                    if (thisObj.gameObject){
                        thisObj.gameObject.notifyComponentUpdated(thisObj);
                    }
                }
            },
            /**
             *
             * @property materias
             * @type Array[KICK.material.Material]
             */
            materials:{
                get:function(){
                    return _materials;
                },
                set:function(newValue){
                    _materials = [];
                    for (var i=0;i<newValue.length;i++){
                        if (ASSERT){
                            if (!(newValue[i] instanceof KICK.material.Material)){
                                KICK.core.Util.fail("MeshRenderer.material must be a KICK.material.Material");
                            }
                        }
                        _materials[i] = newValue[i];
                        _renderOrder = _materials[i].renderOrder;
                    }
                    if (thisObj.gameObject){
                        thisObj.gameObject.notifyComponentUpdated(thisObj);
                    }
                },
                enumerable: true
            },
            /**
             * @property mesh
             * @type KICK.mesh.Mesh
             */
            mesh:{
                get:function(){
                    return _mesh;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (!(newValue instanceof KICK.mesh.Mesh)){
                            KICK.core.Util.fail("MeshRenderer.mesh must be a KICK.mesh.Mesh");
                        }
                    }
                    _mesh = newValue;
                },
                enumerable: true
            }
        });

        /**
         * This method may not be called (the renderer could make the same calls)
         * @method render
         * @param engineUniforms
         * @param {KICK.material.Shader} overwriteShader Optional
         */
        this.render = function (engineUniforms,overwriteShader) {
            var length = _materials.length;
            for (var i=0;i<length;i++){
                var shader = overwriteShader || _materials[i].shader;
                _mesh.bind(shader);
                shader.bindUniform(_materials[i],engineUniforms,transform);
                _mesh.render(i);
            }
        };

        /**
         * @method toJSON
         * @return {JSON}
         */
        this.toJSON = function(){
            if (!thisObj.gameObject){
                return null; // component is destroyed
            } else {
                return KICK.core.Util.componentToJSON(thisObj.gameObject.engine, this, "KICK.scene.MeshRenderer");
            }
        };

        applyConfig(this,config);
    };

    /**
     * A light object.<br>
     * Note that each scene can only have one ambient light and one directional light.
     * @class Light
     * @namespace KICK.scene
     * @extends KICK.scene.Component
     * @constructor
     * @param {Object} config
     * @final
     */
    scene.Light = function (config) {
        var thisObj = this,
            color = vec3.create([1.0,1.0,1.0]),
            engine,
            type = 3,
            _shadow = false,
            _shadowStrength = 1.0,
            _shadowBias = 0.05,
            _shadowTexture = null,
            _shadowRenderTexture = null,
            attenuation = vec3.create([1,0,0]),
            intensity = 1,
            transform,
            colorIntensity = vec3.create([1.0,1.0,1.0]),
            updateIntensity = function(){
                vec3.set([color[0]*intensity,color[1]*intensity,color[2]*intensity],colorIntensity);
            },
            gameObject,
            scriptPriority,
            updateShadowTexture = function(){
                if (_shadow){
                    if (!_shadowTexture){
                        _shadowTexture = new KICK.texture.Texture(engine,{
                            minFilter:9728,
                            magFilter:9728,
                            wrapS:33071,
                            wrapT:33071,
                            flipY: false,
                            generateMipmaps:false
                        });
                        var maxTextureSize = Math.min(engine.gl.getParameter(34024),
                            engine.gl.getParameter(3379));
                        maxTextureSize = Math.min(maxTextureSize,4096)*engine.config.shadowMapQuality;
                        _shadowTexture.setImageData(maxTextureSize,maxTextureSize,0,5121,null,"");
                        _shadowRenderTexture = new KICK.texture.RenderTexture (engine,{
                            colorTexture:_shadowTexture
                        });
                    }
                } else if (_shadowRenderTexture){
                    _shadowRenderTexture.destroy();
                    _shadowTexture.destroy();
                    _shadowRenderTexture = null;
                    _shadowTexture = null;
                }
            };
        Object.defineProperties(this,{
            /**
             * Short for lightObj.gameObject.transform
             * @property transform
             * @type KICK.scene.Transform
             */
            transform:{
                get:function(){
                    return transform;
                }
            },
            /**
             * @property shadowRenderTexture
             * @type KICK.texture.RenderTexture
             */
            shadowRenderTexture:{
                get:function(){
                    return _shadowRenderTexture;
                }
            },
            /**
             * @property shadowTexture
             * @type KICK.texture.Texture
             */
            shadowTexture:{
                get:function(){
                    return _shadowTexture;
                }
            },
            /**
             * Default value is false.
             * Only directional light supports shadows.
             * @property shadow
             * @type boolean
             */
            shadow: {
                get: function(){
                    return _shadow;
                },
                set: function(value){
                    if (value !== _shadow){
                        _shadow = value;
                        if (engine){
                            updateShadowTexture();
                        }
                    }
                },
                enumerable: true
            },
            /**
             * Shadow strength (between 0.0 and 1.0). Default value is 1.0
             * @property shadowStrength
             * @type Number
             */
            shadowStrength:{
                get: function(){
                    return _shadowStrength;
                },
                set: function(value){
                    _shadowStrength = value;
                },
                enumerable: true
            },
            /**
             * Shadow bias. Default value is 0.05
             * @property shadowBias
             * @type Number
             */
            shadowBias:{
                get:function(){
                    return _shadowBias;
                },
                set:function(value){
                    _shadowBias = value;
                },
                enumerable: true
            },
            /**
             * Color intensity of the light (RGB). Default [1,1,1]
             * @property color
             * @type KICK.math.vec3
             */
            color: {
                get: function(){
                    return vec3.create(color);
                },
                set: function(value){
                    if (ASSERT){
                        if (value.length !== 3){
                            KICK.core.Util.fail("Light color must be vec3");
                        }
                    }
                    vec3.set(value,color);
                    updateIntensity();
                },
                enumerable: true
            },
            /**
             * Color type. Must be either:<br>
             * Light.TYPE_AMBIENT,
             * Light.TYPE_DIRECTIONAL,
             * Light.TYPE_POINT <br>
             * Note that this value is readonly after initialization. To change it create a new Light component and replace the current light
             * component of its gameObject.
             * Default type is TYPE_POINT
             * @property type
             * @type Enum
             * @final
             */
            type: {
                get: function(){
                    return type;
                },
                set: function(newValue){
                    if (!engine){
                        type = newValue;
                    } else {
                        if (ASSERT){
                            KICK.core.Util.fail("Light type cannot be changed after initialization");
                        }
                    }
                },
                enumerable: true
            },
            /**
             * Light intensity (a multiplier to color)
             * @property intensity
             * @type Number
             */
            intensity: {
                get: function(){
                    return intensity;
                },
                set: function(value){
                    intensity = value;
                    updateIntensity();
                },
                enumerable: true
            },
            /**
             * Specifies the light falloff.<br>
             * attenuation[0] is constant attenuation,<br>
             * attenuation[1] is linear attenuation,<br>
             * attenuation[2] is quadratic attenuation.<br>
             * Default value is (1,0,0)
             * @property attenuation
             * @type KICK.math.vec3
             */
            attenuation:{
                get:function(){
                    return attenuation;
                },
                set:function(newValue){
                    vec3.set(newValue,attenuation)
                },
                enumerable: true
            },
            /**
             * color RGB multiplied with intensity (plus color A).<br>
             * This property exposes a internal value. This value should not be modified.
             * Instead use the intensity and color property.
             * @property colorIntensity
             * @type KICK.math.vec3
             * @final
             */
            colorIntensity: {
                get: function(){
                    return colorIntensity;
                },
                set:function(newValue){
                    colorIntensity = newValue;
                },
                enumerable: true
            },
            // inherited interface from component
            gameObject:{
                get:function(){
                    return gameObject;
                },
                set:function(value){
                    gameObject = value;
                }
            },
            // inherited interface from component
            scriptPriority:{
                get:function(){
                    return scriptPriority;
                },
                set:function(value){
                    scriptPriority = value;
                },
                enumerable: true
            }
        });

        this.activated = function(){
            var gameObject = thisObj.gameObject;
            engine = gameObject.engine;
            transform = gameObject.transform;
            updateShadowTexture();
        };

        /**
         * @method toJSON
         * @return {JSON}
         */
        this.toJSON = function(){
            return KICK.core.Util.componentToJSON(thisObj.gameObject.engine, this, "KICK.scene.Light");
        };

        applyConfig(this,config);
        KICK.core.Util.copyStaticPropertiesToObject(this,scene.Light);
    };

    /**
     * @property TYPE_AMBIENT
     * @type Number
     * @static
     */
    scene.Light.TYPE_AMBIENT = 1;
    /**
     * @property TYPE_DIRECTIONAL
     * @type Number
     * @static
     */
    scene.Light.TYPE_DIRECTIONAL = 2;
    /**
     * @property TYPE_POINT
     * @type Number
     * @static
     */
    scene.Light.TYPE_POINT = 3;

    Object.freeze(scene.Light);

    /**
     * Datastructure used pass light information
     * @class SceneLights
     * @namespace KICK.scene
     * @constructor
     * @param {Number} maxNumerOfLights (value from config)
     */
    scene.SceneLights = function(maxNumerOfLights){
        var ambientLight = null,
            directionalLight = null,
            directionalLightData = KICK.math.mat3.create(), // column matrix with the columns lightDirection,colorIntensity,halfVector
            directionalLightDirection = directionalLightData.subarray(0,3),
            directionalLightColorIntensity = directionalLightData.subarray(3,6),
            directionalHalfVector = directionalLightData.subarray(6,9),
            directionalLightTransform = null,
            pointLightData = new Float32Array(9*maxNumerOfLights), // mat3*maxNumerOfLights
            pointLightDataVec3 = vec3.wrapArray(pointLightData),
            pointLights = [],
            lightDirection = [0,0,1],
            /**
             * Set the point light to have not contribution this means setting the position 1,1,1, the color to 0,0,0
             * and attenuation to 1,0,0.<br>
             * This is needed since the ecLight position would otherwise be in 0,0,0 which is invalid
             * @method resetPointLight
             * @param {Number} index of point light
             * @private
             */
            resetPointLight = function(index){
                for (var i=0;i<3;i++){
                    vec3.set([0,0,0],pointLightDataVec3[index*3+i]);
                }
            };
        Object.defineProperties(this,{
            /**
             * The ambient light in the scene.
             * @property ambientLight
             * @type KICK.scene.Light
             */
            ambientLight: {
                get:function (){
                    return ambientLight;
                },
                set:function(value){
                    if (ASSERT){
                        if (value && ambientLight){
                            throw Error("Cannot have multiple ambient lights in the scene");
                        }
                    }
                    ambientLight = value;
                }
            },
            /**
             * The directional light in the scene.
             * @property directionalLight
             * @type KICK.scene.Light
             */
            directionalLight:{
                get: function(){
                    return directionalLight;
                },
                set: function(value){
                    if (ASSERT){
                        if (value && directionalLight){
                            throw Error("Cannot have multiple directional lights in the scene");
                        }
                    }
                    directionalLight = value;
                    if (value !== null){
                        directionalLightTransform = directionalLight.gameObject.transform;
                    } else {
                        directionalLightTransform = null;
                        KICK.math.mat3.set([0,0,0,0,0,0,0,0,0],directionalLightData);
                    }
                }
            },
            /**
             * Matrix of directional light data. Column 1 contains the light-direction in eye space,
             * column 2 color intensity and column 3 half vector
             * @property directionalLightData
             * @type KICK.math.mat3
             */
            directionalLightData:{
                get:function(){
                    return directionalLightData;
                }
            },
            /**
             * Matrices of point light data. Each matrix (mat3) contains:<br>
             * Column 1 vector: point light position in eye coordinates<br>
             * Column 2 vector: color intensity<br>
             * Column 3 vector: attenuation vector
             */
            pointLightData:{
                get: function(){
                    return pointLightData;
                }
            }
        });

        /**
         * @method addPointLight
         * @param {KICK.scene.Light} pointLight
         */
        this.addPointLight = function(pointLight){
            if (!KICK.core.Util.contains(pointLights,pointLight)){
                if (pointLights.length==maxNumerOfLights){
                    if (ASSERT){
                        fail("Only "+maxNumerOfLights+" point lights allowed in scene");
                    }
                } else {
                    pointLights.push(pointLight);
                }
            }
        };

        /**
         * @method removePointLight
         * @param {KICK.scene.Light} pointLight
         */
        this.removePointLight = function(pointLight){
            var index = pointLights.indexOf(pointLight);
            if (index >=0){
                // remove element at position index
                pointLights.splice(index, 1);
            } else {
                if (ASSERT){
                    fail("Error removing point light");
                }
            }
            resetPointLight(pointLights.length);
        };

        /**
         * Recompute the light based on the view-matrix. This method is called from the camera when the scene is
         * rendered, to transform the light into eye coordinates and compute the half vector for directional light
         * @method recomputeLight
         * @param {KICK.math.mat4} viewMatrix
         */
        this.recomputeLight = function(viewMatrix){
            if (directionalLight !== null){
                // compute light direction
                quat4.multiplyVec3(directionalLightTransform.rotation,lightDirection,directionalLightDirection);

                // transform to eye space
                mat4.multiplyVec3Vector(viewMatrix,directionalLightDirection);
                vec3.normalize(directionalLightDirection);

                // compute half vector
                vec3.add(lightDirection, directionalLightDirection, directionalHalfVector);
                vec3.normalize(directionalHalfVector);

                vec3.set(directionalLight.colorIntensity,directionalLightColorIntensity);
            }
            if (maxNumerOfLights){ // only run if max number of lights are 1 or above (otherwise JIT compiler will skip it)
                var index = 0;
                for (var i=pointLights.length-1;i>=0;i--){
                    var pointLight = pointLights[i];
                    var pointLightPosition = pointLight.transform.position;

                    mat4.multiplyVec3(viewMatrix, pointLightPosition,pointLightDataVec3[index]);
                    vec3.set(pointLight.colorIntensity, pointLightDataVec3[index+1]);
                    vec3.set(pointLight.attenuation, pointLightDataVec3[index+2]);
                    index += 3;
                }
            }
        };

        (function init(){
            for (var i=0;i<maxNumerOfLights;i++){
                resetPointLight(i);
            }
        })();
    };
 })();
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

    var texture = KICK.namespace("KICK.texture"),
        core = KICK.namespace("KICK.core"),
        constants = core.Constants,
        vec2 = KICK.math.vec2,
        isPowerOfTwo = function (x) {
            return (x & (x - 1)) == 0;
        },
        nextHighestPowerOfTwo = function (x) {
            --x;
            for (var i = 1; i < 32; i <<= 1) {
                x = x | x >> i;
            }
            return x + 1;
        },
        applyConfig = KICK.core.Util.applyConfig;

    /**
     * Render texture (used for camera's render target)
     * @class RenderTexture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config Optional
     * @extends KICK.core.ProjectAsset
     */
    texture.RenderTexture = function(engine, config){
        var gl = engine.gl,
            _config = config || {},
            framebuffer = gl.createFramebuffer(),
            colorTexture = null,
            _dimension = vec2.create(),
            renderBuffers = [],
            thisObj = this,
            _name = "",
            cleanUpRenderBuffers = function(){
                for (var i=0;i<renderBuffers.length;i++){
                    gl.deleteRenderbuffer(renderBuffers[i]);
                }
            },
            initFBO = function (){
                var renderbuffer;
                _dimension = colorTexture ? colorTexture.dimension : _dimension;
                cleanUpRenderBuffers();
                gl.bindFramebuffer(36160, framebuffer);

                if (colorTexture){
                    gl.framebufferTexture2D(36160, 36064, 3553, colorTexture.textureId, 0);
                } else {
                    renderbuffer = gl.createRenderbuffer();
                    gl.bindRenderbuffer(36161, renderbuffer);
                    gl.renderbufferStorage(36161, 32854, _dimension[0], _dimension[1]);
                    gl.framebufferRenderbuffer(36160, 36064, 36161, renderbuffer);
                    renderBuffers.push(renderbuffer);
                }

                renderbuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(36161, renderbuffer);
                gl.renderbufferStorage(36161, 33189, _dimension[0], _dimension[1]);
                gl.framebufferRenderbuffer(36160, 36096, 36161, renderbuffer);
                renderBuffers.push(renderbuffer);

                if (true){
                    var frameBufferStatus = gl.checkFramebufferStatus( 36160 );
                    if (frameBufferStatus !== 36053){
                        switch (frameBufferStatus){
                            case 36054:
                                KICK.core.Util.fail("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                                break;
                            case 36055:
                                KICK.core.Util.fail("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                                break;
                            case 36057:
                                KICK.core.Util.fail("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                                break;
                            case 36061:
                                KICK.core.Util.fail("FRAMEBUFFER_UNSUPPORTED");
                                break;
                        }
                    }
                }
                gl.bindFramebuffer(36160, null);
            };

        /**
         * @method bind
         */
        this.bind = function(){
            gl.renderTarget = thisObj;
            gl.bindFramebuffer(36160, framebuffer);
        };

        Object.defineProperties(this,{
            /**
             * @property dimension
             * @type KICK.math.vec2
             */
            dimension:{
                get:function(){
                    return _dimension;
                },
                set:function(newValue){
                    _dimension = newValue;
                    if (_dimension){
                        initFBO();
                    }
                }
            },
            /**
             * @property colorTexture
             * @type KICK.texture.Texture
             */
            colorTexture:{
                get: function(){ return colorTexture; },
                set: function(newValue){
                    colorTexture = newValue;
                    if (colorTexture){
                        initFBO();
                    }
                }
            },
            /**
             * @property name
             * @type String
             */
            name:{
                get: function(){ return _name;},
                set: function(newValue){ _name = newValue;}
            }
        });

        /**
         * @method destroy
         */
        this.destroy = function(){
            if (framebuffer !== null){
                cleanUpRenderBuffers();
                gl.deleteFramebuffer(framebuffer);
                framebuffer = null;
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * @method toJSON
         */
        this.toJSON = function(){
            return {
                uid: thisObj.uid,
                name: _name,
                colorTexture: KICK.core.Util.getJSONReference(engine, colorTexture)
            };
        };

        (function init(){
            // apply
            applyConfig(thisObj, config);
            engine.project.registerObject(thisObj, "KICK.texture.RenderTexture");
        })();
    };

    /**
     * Encapsulate a texture object and its configuration. Note that the texture configuration
     * must be set prior to assigning the texture (using either init, setImage or setImageData).<br>
     *
     * Cubemaps must have dimensions width = height * 6 and the order of the cubemap is
     * positiveX, negativeX, positiveY, negativeY, positiveZ, negativeZ
     * @class Texture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config Optional
     * @extends KICK.core.ProjectAsset
     */
    texture.Texture = function (engine, config) {
        var gl = engine.gl,
            texture0 = 33984,
            _textureId = gl.createTexture(),
            _name = "Texture",
            _wrapS =  10497,
            _wrapT = 10497,
            _minFilter = 9729,
            _magFilter = 9729,
            _generateMipmaps = true,
            _dataURI =  "memory://void",
            _flipY =  true,
            _intFormat = 6408,
            _textureType = 3553,
            _boundTextureType = null,
            thisObj = this,
            _dimension = vec2.create(),
            /**
             * @method recreateTextureIfDifferentType
             * @private
             */
            recreateTextureIfDifferentType = function(){
                if (_boundTextureType !== null && _boundTextureType !== _textureType){
                    gl.deleteTexture(_textureId);
                    _textureId = gl.createTexture();
                }
                _boundTextureType = _textureType;
            };

        /**
         * Trigger getImageData if dataURI is defined
         * @method init
         */
        this.init = function(){
            if (_dataURI){
                engine.resourceLoader.getImageData(_dataURI,thisObj);
            }
        };

        /**
         * Applies the texture settings
         * @method apply
         */
        this.apply = function(){
            thisObj.bind(0); // bind to texture slot 0
            if (_textureType === 3553){
                gl.texParameteri(3553, 10242, _wrapS);
                gl.texParameteri(3553, 10243, _wrapT);
            }
            gl.texParameteri(_textureType, 10240, _magFilter);
            gl.texParameteri(_textureType, 10241, _minFilter);
        };

        /**
         * Bind the current texture
         * @method bind
         */
        this.bind = function(textureSlot){
            gl.activeTexture(texture0+textureSlot);
            gl.bindTexture(_textureType, _textureId);
        };

        /**
         * Deallocates the texture from memory
         * @method destroy
         */
        this.destroy = function(){
            if (_textureId !== null){
                gl.deleteTexture(_textureId);
                _textureId = null;
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * Set texture image based on a image object.<br>
         * The image is automatically resized nearest power of two<br>
         * When a textureType == TEXTURE_CUBE_MAP the image needs to be in the following format:
         * <ul>
         *     <li>width = 6*height</li>
         *     <li>Image needs to be ordered: [Right, Left, Top, Bottom, Front, Back] (As in <a href="http://www.cgtextures.com/content.php?action=tutorial&name=cubemaps">NVidia DDS Exporter</a>)</li>
         * </ul>
         * @method setImage
         * @param {Image} imageObj image object to import
         * @param {String} dataURI String representing the image
         */
        this.setImage = function(imageObj, dataURI){
            var width, height;
            _dataURI = dataURI;
            recreateTextureIfDifferentType();
            thisObj.bind(0); // bind to texture slot 0
            if (_textureType === 3553){
                if (!isPowerOfTwo(imageObj.width) || !isPowerOfTwo(imageObj.height)) {
                    width = nextHighestPowerOfTwo(imageObj.width);
                    height = nextHighestPowerOfTwo(imageObj.height);
                    imageObj = core.Util.scaleImage(imageObj,width,height);
                }

                if (_flipY){
                    gl.pixelStorei(37440, true);
                } else {
                    gl.pixelStorei(37440, false);
                }
                gl.pixelStorei(3317, 1);
                gl.texImage2D(3553, 0, _intFormat, _intFormat, 5121, imageObj);

                vec2.set([imageObj.width,imageObj.height],_dimension);
            } else {
                 var cubemapOrder = [
                     34069,
                     34070,
                     34071,
                     34072,
                     34073,
                     34074
                 ];
                var srcWidth = imageObj.width/6;
                var srcHeight = imageObj.height;
                height = nextHighestPowerOfTwo(imageObj.height);
                width = height;
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                for (var i=0;i<6;i++){
                    ctx.drawImage(imageObj,
                        i*srcWidth, 0, srcWidth, srcHeight,
                        0, 0, width, height);
                    gl.pixelStorei(37440, false);
                    gl.pixelStorei(3317, 1);
                    gl.texImage2D(cubemapOrder[i], 0, _intFormat, _intFormat, 5121, canvas);
                }
                vec2.set([width,height],_dimension);
            }
            thisObj.apply();
            if (_generateMipmaps){
                gl.generateMipmap(_textureType);
            }
            gl.currentMaterial = null; // for material to rebind
        };

        /**
         * Calling this function has the side effect of enabling floating point texture (in available on platform)
         * @method isFPTexturesSupported
         * @return {Boolean}
         */
        this.isFPTexturesSupported = function(){
            var res = gl.isTexFloatEnabled;
            if (typeof res !== 'boolean'){
                res = gl.getExtension("OES_texture_float"); // this has the side effect of enabling the extension
                gl.isTexFloatEnabled = res;
            }
            return res;
        };

        /**
         * Set a image using a raw bytearray in a specified format.
         * 5126 should only be used if floating point textures is supported (See Texture.isFPTexturesSupported() ).
         * @method setImageData
         * @param {Number} width image width in pixels
         * @param {Number} height image height in pixels
         * @param {Number} border image border in pixels
         * @param {Object} type 5126, 5121, 32819, 32820 or 33635
         * @param {Array} pixels array of pixels (may be null)
         * @param {String} dataURI String representing the image
         */
        this.setImageData = function(width, height, border, type, pixels, dataURI){
            recreateTextureIfDifferentType();
            if (type === 5126 && !gl.isTexFloatEnabled){
                var res = thisObj.isFPTexturesSupported(); // enable extension
                if (!res){
                    KICK.core.Util.fail("OES_texture_float unsupported on the platform. Using 5121 instead of 5126.");
                    type = 5121;
                }
            }
            if (true){
                if (type !== 5126 &&
                    type !== 5121 &&
                    type !== 32819  &&
                    type !== 32820 &&
                    type !== 33635 ){
                    KICK.core.Util.fail("Texture.setImageData (type) should be either 5121, 32819, 32820 or 33635");
                }
            }
            if (_textureType !== 3553){
                KICK.core.Util.fail("Texture.setImageData only supported by TEXTURE_2D");
                return;
            }
            var format = _intFormat;

            vec2.set([width,height],_dimension);
            _dataURI = dataURI;

            thisObj.bind(0); // bind to texture slot 0
            gl.pixelStorei(3317, 1);
            gl.texImage2D(3553, 0, _intFormat, width, height, border, format, type, pixels);
            gl.texParameteri(3553, 10240, _magFilter);
            gl.texParameteri(3553, 10241, _minFilter);
            gl.texParameteri(3553, 10242, _wrapS);
            gl.texParameteri(3553, 10243, _wrapT);
            if (_generateMipmaps){
                gl.generateMipmap(3553);
            }
            gl.currentMaterial = null; // for material to rebind
        };

        /**
         * Creates a 2x2 temporary image (checkerboard)
         * @method setTemporaryTexture
         */
        this.setTemporaryTexture = function(){
            var blackWhiteCheckerboard = new Uint8Array([255, 255, 255,
                                             0,   0,   0,
                                             0,   0,   0,
                                             255, 255, 255]),
                oldIntFormat = _intFormat;
            _intFormat = 6407;
            this.setImageData( 2, 2, 0, 5121,blackWhiteCheckerboard, "tempTexture");
            _intFormat = oldIntFormat;
        };

        /**
         * Allows setting the dataURI without reloading the image
         * @method setDataURI
         * @param newValue
         * @param automaticGetTextureData
         */
        this.setDataURI = function( newValue , automaticGetTextureData ){
            if (newValue !== _dataURI){
                _dataURI = newValue;
                if (automaticGetTextureData){
                    engine.resourceLoader.getImageData(_dataURI,thisObj);
                }
            }
        };

        Object.defineProperties(this,{
            /**
             * @property textureId
             * @type Number
             * @protected
             */
            textureId:{
                value:_textureId
            },
            /**
             * @property name
             * @type String
             */
            name:{
                get:function(){
                    return _name;
                },
                set:function(newValue){
                     _name = newValue;
                }
            },
            /**
             * Dimension of texture [width,height].<br>
             * Note for cube maps the size is for one face
             * @property dimension
             * @type {vec2}
             */
            dimension:{
                get:function(){
                    return _dimension;
                }
            },
            /**
             * URI of the texture. This property does not load any texture. To load a texture, set this property and
             * call the init function (or load the image manually and call the setImage() function).<br>
             * If texture is not on same server, then the web server must support CORS<br>
             * See http://hacks.mozilla.org/2011/11/using-cors-to-load-webgl-textures-from-cross-domain-images/
             * @property dataURI
             * @type String
             */
            dataURI:{
                get:function(){
                    return _dataURI;
                },
                set:function(newValue){
                    thisObj.setDataURI(newValue,true);
                }
            },
            /**
             * Texture.wrapS should be either 33071 or 10497<br>
             * Default: 10497
             * @property wrapS
             * @type Object
             */
            wrapS:{
                get: function(){
                    return _wrapS;
                },
                set: function(value){
                    if (true){
                        if (value !== 33071 &&
                            value !== 10497){
                            KICK.core.Util.fail("Texture.wrapS should be either 33071 or 10497");
                        }
                    }
                    _wrapS = value;
                }
            },
            /**
             * Texture.wrapT should be either 33071 or 10497<br>
             * Default: 10497
             * @property wrapT
             * @type Object
             */
            wrapT:{
                get: function(){
                    return _wrapT;
                },
                set: function(value){
                    if (true){
                        if (value !== 33071 &&
                            value !== 10497){
                            KICK.core.Util.fail("Texture.wrapT should be either 33071 or 10497");
                        }
                    }
                    _wrapT = value;
                }
            },
            /**
             * Texture.minFilter should be either 9728, 9729, 9984, <br>
             * 9985, 9986, 9987<br>
             * Default: 9729
             * @property minFilter
             * @type Object
             */
            minFilter:{
                get: function(){
                    return _minFilter;
                },
                set: function(value){
                    if (true){
                        if (value !== 9728 &&
                            value !== 9729 &&
                            value !== 9984 &&
                            value !== 9985 &&
                            value !== 9986 &&
                            value !== 9987){
                            KICK.core.Util.fail("Texture.minFilter should be either 9728, 9729, 9984, 9985, 9986, 9987");
                        }
                    }
                    _minFilter = value;
                }
            },
            /**
             * Texture.magFilter should be either 9728 or 9729. <br>
             * Default: 9729
             * @property magFilter
             * @type Object
             */
            magFilter:{
                get: function(){
                    return _magFilter;
                },
                set: function(value){
                    if (true){
                        if (value !== 9728 &&
                            value !== 9729){
                            KICK.core.Util.fail("Texture.magFilter should be either 9728 or 9729");
                        }
                    }
                    _magFilter = value;
                }
            },
            /**
             * Autogenerate mipmap levels<br>
             * (Default true)
             * @property generateMipmaps
             * @type Boolean
             */
            generateMipmaps:{
                get: function(){
                    return _generateMipmaps;
                },
                set: function(value){
                    if (true){
                        if (typeof value !== 'boolean'){
                            KICK.core.Util.fail("Texture.generateMipmaps was not a boolean");
                        }
                    }
                    _generateMipmaps = value;
                }
            },
            /**
             * When importing image flip the Y direction of the image
             * (Default true).<br>
             * This property is ignored for cube maps.
             * @property flipY
             * @type Boolean
             */
            flipY:{
                get: function(){
                    return _flipY;
                },
                set: function(value){
                    if (true){
                        if (typeof value !== 'boolean'){
                            KICK.core.Util.fail("Texture.flipY was not a boolean");
                        }
                    }
                    _flipY = value;
                }
            },
            /**
             * Specifies the internal format of the image (format on GPU)<br>
             * Default is 6408<br>
             * Must be one of the following:
             * 6406,
             * 6407,
             * 6408,
             * 6409,
             * 6410
             * @property internalFormat
             * @type Number
             */
            internalFormat:{
                get:function(){
                    return _intFormat;
                },
                set:function(value){
                    if (value !== 6406 &&
                        value !== 6407  &&
                        value !== 6408 &&
                        value !== 6409 &&
                        value !== 6410){
                        KICK.core.Util.fail("Texture.internalFormat should be either 6406, 6407, 6408, 6409, or LUMINANCE_ALPHA");
                    }
                    _intFormat = value;
                }
            },
            /**
             * Specifies the texture type<br>
             * Default is 3553<br>
             * Must be one of the following:
             * 3553,
             * 34067
             * @property textureType
             * @type Number
             */
            textureType:{
                get:function(){
                    return _textureType;
                },
                set:function(value){
                    if (value !== 3553 &&
                        value !== 34067){
                        KICK.core.Util.fail("Texture.textureType should be either 3553 or 34067");
                    }
                    _textureType = value;
                }
            }
        });

        /**
         * Serializes the data into a JSON object (that can be used as a config parameter in the constructor)<br>
         * Note that the texture data is not serialized in the json format. <br>
         * This means that either setImage() or setImageData() must be called before the texture can be bound<br>
         * @method toJSON
         * @return {Object} config element
         */
        this.toJSON = function(){
            return {
                uid: thisObj.uid,
                wrapS:_wrapS,
                wrapT:_wrapT,
                minFilter:_minFilter,
                magFilter:_magFilter,
                name:_name,
                generateMipmaps:_generateMipmaps,
                flipY:_flipY,
                internalFormat:_intFormat,
                textureType:_textureType,
                dataURI:_dataURI
            };
        };

        (function init(){
            // apply
            applyConfig(thisObj, config, ["dataURI"]);
            if (config && config.dataURI){
                // set dataURI last to make sure that object is configured before initialization
                thisObj.dataURI = config.dataURI;
            }

            engine.project.registerObject(thisObj, "KICK.texture.Texture");
        })();
    };

    /**
     * A movie texture associated with a video element (or canvas tag) will update the content every frame (when it is bound).
     * @class MovieTexture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config Optional
     * @extends KICK.core.ProjectAsset
     */
    texture.MovieTexture = function (engine, config) {
        var gl = engine.gl,
            texture0 = 33984,
            _name = "MovieTexture",
            _videoElement = null,
            _textureId = gl.createTexture(),
            _wrapS = 33071,
            _wrapT = 33071,
            _minFilter = 9728,
            _magFilter = 9728,
            _intFormat = 6408,
            _skipFrames = 0,
            _generateMipmaps = false,
            timer = engine.time,
            thisObj = this,
            lastGrappedFrame = -1;

        /**
         * Bind the current texture
         * And update the texture from the video element (unless it has already been updated in this frame)
         * @method bind
         */
        this.bind = function(textureSlot){
            gl.activeTexture(texture0+textureSlot);
            gl.bindTexture(3553, _textureId);

            if (lastGrappedFrame < timer.frame && _videoElement){
                lastGrappedFrame = timer.frame+_skipFrames;
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, _videoElement);
                if (_generateMipmaps){
                    gl.generateMipmap(3553);
                }
            }
        };

        /**
         * Deallocates the texture from memory
         * @method destroy
         */
        this.destroy = function(){
            if (_textureId !== null){
                gl.currentMaterial = null; // for material to rebind
                gl.deleteTexture(_textureId);
                _textureId = null;
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * Creates a 2x2 temporary image (checkerboard)
         * @method setTemporaryTexture
         */
        this.setTemporaryTexture = function(){
            var blackWhiteCheckerboard = new Uint8Array([255, 255, 255,0,0,0,0,0,0,255, 255, 255]);
            thisObj.bind(0); // bind to texture slot 0
            gl.pixelStorei(3317, 1);
            gl.texImage2D(3553, 0, _intFormat, 2, 2, 0, 6407, 5121, blackWhiteCheckerboard);
            gl.texParameteri(3553, 10240, _magFilter);
            gl.texParameteri(3553, 10241, _minFilter);
            gl.texParameteri(3553, 10242, _wrapS);
            gl.texParameteri(3553, 10243, _wrapT);
            gl.currentMaterial = null; // for material to rebind
        };

        Object.defineProperties(this,{
            /**
             * @property name
             * @type String
             */
            name:{
                get:function(){
                    return _name;
                },
                set:function(newValue){
                     _name = newValue;
                }
            },
            /**
             * Default value is 0 (update movie texture every frame). 1 skip one frame update, 2 skips two frames etc.
             * @property skipFrames
             * @type {Number}
             */
            skipFrames:{
                get:function(){
                    return _skipFrames;
                },
                set:function(newValue){
                    _skipFrames = newValue;
                }
            },
            /**
             * @property videoElement
             * @type {VideoElement}
             */
            videoElement:{
                get:function(){
                    return _videoElement;
                },
                set:function(newValue){
                    _videoElement = newValue;
                }
            },
            /**
             * Autogenerate mipmap levels<br>
             * Note that enabling auto mipmap on movie textures uses a lot of resources.
             * (Default false)
             * @property generateMipmaps
             * @type Boolean
             */
            generateMipmaps:{
                get: function(){
                    return _generateMipmaps;
                },
                set: function(value){
                    if (true){
                        if (typeof value !== 'boolean'){
                            KICK.core.Util.fail("MovieTexture.generateMipmaps was not a boolean");
                        }
                    }
                    _generateMipmaps = value;
                }
            },
            /**
             * @property textureId
             * @type {Number}
             * @protected
             */
            textureId:{
                value:_textureId
            },
            /**
             * Texture.wrapS should be either 33071 or 10497<br>
             * Default: 10497
             * @property wrapS
             * @type Object
             */
            wrapS:{
                get: function(){
                    return _wrapS;
                },
                set: function(value){
                    if (true){
                        if (value !== 33071 &&
                            value !== 10497){
                            KICK.core.Util.fail("Texture.wrapS should be either 33071 or 10497");
                        }
                    }
                    _wrapS = value;
                }
            },
            /**
             * Texture.wrapT should be either 33071 or 10497<br>
             * Default: 10497
             * @property wrapT
             * @type Object
             */
            wrapT:{
                get: function(){
                    return _wrapT;
                },
                set: function(value){
                    if (true){
                        if (value !== 33071 &&
                            value !== 10497){
                            KICK.core.Util.fail("Texture.wrapT should be either 33071 or 10497");
                        }
                    }
                    _wrapT = value;
                }
            },
            /**
             * Texture.minFilter should be either 9728, 9729, 9984, <br>
             * 9985, 9986, 9987<br>
             * Default: 9729
             * @property minFilter
             * @type Object
             */
            minFilter:{
                get: function(){
                    return _minFilter;
                },
                set: function(value){
                    if (true){
                        if (value !== 9728 &&
                            value !== 9729 &&
                            value !== 9984 &&
                            value !== 9985 &&
                            value !== 9986 &&
                            value !== 9987){
                            KICK.core.Util.fail("Texture.minFilter should be either 9728, 9729, 9984, 9985, 9986, 9987");
                        }
                    }
                    _minFilter = value;
                }
            },
            /**
             * Texture.magFilter should be either 9728 or 9729. <br>
             * Default: 9729
             * @property magFilter
             * @type Object
             */
            magFilter:{
                get: function(){
                    return _magFilter;
                },
                set: function(value){
                    if (true){
                        if (value !== 9728 &&
                            value !== 9729){
                            KICK.core.Util.fail("Texture.magFilter should be either 9728 or 9729");
                        }
                    }
                    _magFilter = value;
                }
            },
            /**
             * Specifies the internal format of the image (format on GPU)<br>
             * Default is 6408<br>
             * Must be one of the following:
             * 6406,
             * 6407,
             * 6408,
             * 6409,
             * 6410
             * @property internalFormat
             * @type Number
             */
            internalFormat:{
                get:function(){
                    return _intFormat;
                },
                set:function(value){
                    if (value !== 6406 &&
                        value !== 6407  &&
                        value !== 6408 &&
                        value !== 6409 &&
                        value !== 6410){
                        KICK.core.Util.fail("Texture.internalFormat should be either 6406, 6407, 6408, 6409, or LUMINANCE_ALPHA");
                    }
                    _intFormat = value;
                }
            }
        });

        /**
         * Serializes the data into a JSON object (that can be used as a config parameter in the constructor)<br>
         * Note that the texture data is not serialized in the json format. <br>
         * This means that either setImage() or setImageData() must be called before the texture can be bound<br>
         * @method toJSON
         * @return {Object} config element
         */
        this.toJSON = function(){
            return {
                uid: thisObj.uid,
                wrapS:_wrapS,
                wrapT:_wrapT,
                minFilter:_minFilter,
                name:_name,
                magFilter:_magFilter,
                internalFormat:_intFormat
            };
        };

        (function init(){
            // apply
            applyConfig(thisObj, config);

            engine.project.registerObject(thisObj, "KICK.texture.MovieTexture");
        })();
    };
})();/*!
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
    var material = KICK.namespace("KICK.material"),
        math = KICK.namespace("KICK.math"),
        mat3 = math.mat3,
        mat4 = math.mat4,
        vec4 = math.vec4,
        core = KICK.namespace("KICK.core"),
        applyConfig = core.Util.applyConfig,
        c = KICK.core.Constants,
        ASSERT = true,
        fail = core.Util.fail,
        uint32ToVec4 = KICK.core.Util.uint32ToVec4,
        tempMat4 = mat4.create(),
        tempMat3 = mat3.create(),
        tmpVec4 = vec4.create(),
        vec3Zero = math.vec3.create();

    /**
     * GLSL Shader object<br>
     * The shader basically encapsulates a GLSL shader programs, but makes sure that the correct
     * WebGL settings are set when the shader is bound (such as if blending is enabled or not).<br>
     * The Shader extend the default WebGL GLSL in the following way:
     * <ul>
     *     <li>
     *         <code>#pragma include &lt;filename&gt;</code> includes of the following KickJS file as a string:
     *         <ul>
     *             <li>light.glsl</li>
     *             <li>shadowmap.glsl</li>
     *         </ul>
     *     </li>
     *     <li>Auto binds the following uniform variables:
     *      <ul>
     *          <li><code>_mvProj</code> (mat4) Model view projection matrix</li>
     *          <li><code>_m</code> (mat4) Model matrix</li>
     *          <li><code>_mv</code> (mat4) Model view matrix</li>
     *          <li><code>_norm</code> (mat3) Normal matrix (the inverse transpose of the upper 3x3 model view matrix - needed when scaling is scaling is non-uniform)</li>
     *          <li><code>_time</code> (float) Run time of engine</li>
     *          <li><code>_ambient</code> (vec3) Ambient light</li>
     *          <li><code>_dLight.lDir</code> (vec3) Directional light direction</li>
     *          <li><code>_dLight.colInt</code> (vec3) Directional light color intensity</li>
     *          <li><code>_dLight.halfV</code> (vec3) Directional light half vector</li>
     *      </ul>
     *     </li>
     *     <li>Defines <code>SHADOW</code> (Boolean) and <code>LIGHTS</code> (Integer) based on the current configuration of the engine (cannot be modified runtime). </li>
     * </ul>
     * @class Shader
     * @namespace KICK.material
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @extends KICK.core.ProjectAsset
     */
    material.Shader = function (engine, config) {
        var gl = engine.gl,
            thisObj = this,
            _shaderProgramId = -1,
            _depthMask = true,
            _faceCulling = 1029,
            _zTest = 513,
            _blend = false,
            _blendSFactor = 770,
            _blendDFactor = 771,
            _polygonOffsetEnabled = false,
            _polygonOffsetFactor = 2.5,
            _polygonOffsetUnits = 10.0,
            _renderOrder = 1000,
            _dataURI =  "memory://void",
            _name = "",
            blendKey,
            glslConstants = material.GLSLConstants,
            _vertexShaderSrc = glslConstants["__error_vs.glsl"],
            _fragmentShaderSrc = glslConstants["__error_fs.glsl"],
            _defaultUniforms,
            _errorLog = KICK.core.Util.fail,
            /**
             * Updates the blend key that identifies blend+blendSFactor+blendDFactor<br>
             * The key is used to fast determine if the blend settings needs to be updated
             * @method getBlendKey
             */
            updateBlendKey = function(){
                blendKey = (_blendSFactor + _blendDFactor*10000)*(_blend?-1:1);
            },
            /**
             * Invoke shader compilation
             * @method compileShader
             * @param {String} str
             * @param {Boolean} isFragmentShader
             * @private
             */
            compileShader = function (str, isFragmentShader) {
                var shader,
                    c = KICK.core.Constants;
                str = material.Shader.getPrecompiledSource(engine,str);
                if (isFragmentShader) {
                    shader = gl.createShader(35632);
                } else {
                    shader = gl.createShader(35633);
                }

                gl.shaderSource(shader, str);
                gl.compileShader(shader);

                if (!gl.getShaderParameter(shader, 35713)) {
                    var infoLog =gl.getShaderInfoLog(shader);
                    if (typeof _errorLog === "function") {
                        _errorLog(infoLog);
                    }
                    return null;
                }

                return shader;
            },
            updateCullFace = function () {
                var currentFaceCulling = gl.faceCulling;
                if (currentFaceCulling !== _faceCulling) {
                    if (_faceCulling === 0) {
                        gl.disable( 2884 );
                    } else {
                        if (!currentFaceCulling || currentFaceCulling === 0) {
                            gl.enable( 2884 );
                        }
                        gl.cullFace( _faceCulling );
                    }
                    gl.faceCulling = _faceCulling;
                }
            },
            updateDepthProperties = function () {
                if (gl.zTest !== _zTest) {
                    gl.depthFunc(_zTest);
                    gl.zTest = _zTest;
                }
                if (gl.depthMaskCache !== _depthMask){
                    gl.depthMask(_depthMask);
                    gl.depthMaskCache = _depthMask;
                }
            },
            updateBlending = function () {
                if (gl.blendKey !== blendKey){
                    gl.blendKey = blendKey;
                    if (_blend){
                        gl.enable(3042);
                    } else {
                        gl.disable(3042);
                    }
                    gl.blendFunc(_blendSFactor,_blendDFactor);
                }
            },
            updatePolygonOffset = function(){
                if (gl.polygonOffsetEnabled !== _polygonOffsetEnabled){
                    gl.polygonOffsetEnabled = _polygonOffsetEnabled;
                    if (_polygonOffsetEnabled){
                        gl.enable(32823);
                    } else {
                        gl.disable(32823);
                    }
                }
                if (_polygonOffsetEnabled){
                    gl.polygonOffset(_polygonOffsetFactor,_polygonOffsetUnits);
                }
            };

        Object.defineProperties(this,{
            /**
             * @property name
             * @type String
             */
            name:{
                get:function(){ return _name; },
                set:function(newValue){ _name = newValue; }
            },
            /**
             * When dataURI is specified the shader is expected to have its content from the dataURI.
             * This means when serializing the object only dataURI and name will be saved
             * @property dataURI
             * @type String
             */
            dataURI:{
                get:function(){ return _dataURI; },
                set:function(newValue){
                    if (_dataURI !== newValue){
                        _dataURI = newValue;
                        if (_dataURI){ // load resource if not null
                            engine.resourceLoader.getShaderData(_dataURI,thisObj);
                        }
                    }
                }
            },
            /**
             * Get the gl context of the shader
             * @property gl
             * @type Object
             */
            gl:{
                value:gl
            },
            /**
             * Get default configuration of shader uniforms
             * @property defaultUniforms
             * @type Object
             */
            defaultUniforms:{
                get:function(){ return _defaultUniforms; },
                set:function(value){
                    _defaultUniforms = value;
                }
            },
            /**
             * @property vertexShaderSrc
             * @type string
             */
            vertexShaderSrc:{
                get:function(){ return _vertexShaderSrc; },
                set:function(value){
                    if (typeof value !== "string"){
                        KICK.core.Util.fail("Shader.vertexShaderSrc must be a string");
                    }
                    _vertexShaderSrc = value;
                }
            },
            /**
             * @property fragmentShaderSrc
             * @type string
             */
            fragmentShaderSrc:{
                get:function(){ return _fragmentShaderSrc; },
                set:function(value){
                    if (typeof value !== "string"){
                        KICK.core.Util.fail("Shader.fragmentShaderSrc must be a string");
                    }
                    _fragmentShaderSrc = value;
                }
            },
            /**
             * Render order. Default value 1000. The following ranges are predefined:<br>
             * 0-999: Background. Mainly for skyboxes etc<br>
             * 1000-1999 Opaque geometry  (default)<br>
             * 2000-2999 Transparent. This queue is sorted in a back to front order before rendering.<br>
             * 3000-3999 Overlay
             * @property renderOrder
             * @type Number
             */
            renderOrder:{
                get:function(){ return _renderOrder; },
                set:function(value){
                    if (typeof value !== "number"){
                        KICK.core.Util.fail("Shader.renderOrder must be a number");
                    }
                    _renderOrder = value;
                }
            },
            /**
             * Function that will be invoked in case of error
             * @property errorLog
             * @type Function
             */
            errorLog:{
                get:function(){
                    return _errorLog;
                },
                set: function(value){
                    if (true){
                        if ( value && typeof value !== 'function'){
                            KICK.core.Util.fail("Shader.errorLog should be a function (or null)");
                        }
                    }
                    _errorLog = value;
                }
            },
            /**
             * A reference to the engine object
             * @property engine
             * @type KICK.core.Engine
             */
            engine:{
                value:engine
            },
            /**
             * @property shaderProgramId
             * @type ShaderProgram
             */
            shaderProgramId:{
                get: function(){ return _shaderProgramId;}
            },
            /**
             * (From http://www.opengl.org/)<br>
             * When 32823, GL_POLYGON_OFFSET_LINE, or GL_POLYGON_OFFSET_POINT is enabled, each
             * fragment's depth value will be offset after it is interpolated from the depth values of the appropriate
             * vertices. The value of the offset is factor × DZ + r × units , where DZ is a measurement of the change
             * in depth relative to the screen area of the polygon, and r is the smallest value that is guaranteed to
             * produce a resolvable offset for a given implementation. The offset is added before the depth test is
             * performed and before the value is written into the depth buffer.<br><br>
             *
             * glPolygonOffset is useful for rendering hidden-line images, for applying decals to surfaces, and for
             * rendering solids with highlighted edges.<br><br>
             * Possible values:<br>
             * true or false<br>
             * Default false
             * @property polygonOffsetEnabled
             * @type boolean
             */
            polygonOffsetEnabled: {
                get: function(){
                    return _polygonOffsetEnabled;
                },
                set: function(value){
                    _polygonOffsetEnabled = value;
                }
            },
            /**
             * Default 2.5
             * @property polygonOffsetFactor
             * @type Number
             */
            polygonOffsetFactor:{
                get:function(){
                    return _polygonOffsetFactor;
                },
                set:function(value){
                    _polygonOffsetFactor = value;
                }
            },
            /**
             * Default 10.0
             * @property polygonOffsetUnits
             * @type Number
             */
            polygonOffsetUnits:{
                get:function(){
                    return _polygonOffsetUnits;
                },
                set:function(value){
                    _polygonOffsetUnits = value;
                }
            },
            /**
             * Must be set to 1028, 1029 (default),
             * 1032, KICK.core.Constants.NONE<br>
             * Note that in faceCulling = 1028, 1029 or 1032 with face culling enabled<br>
             * faceCulling = 0 means face culling disabled
             * @property faceCulling
             * @type Object
             */
            faceCulling: {
                get: function(){ return _faceCulling; },
                set: function(newValue){
                    if (true){
                        if (newValue !== 1028 &&
                            newValue !== 1032 &&
                            newValue !== 1029 &&
                            newValue !== 0 ){
                            KICK.core.Util.fail("Shader.faceCulling must be KICK.material.Shader.FRONT, " +
                                "KICK.material.Shader.BACK (default), KICK.material.Shader.NONE");
                        }
                    }
                    _faceCulling = newValue;
                }
            },
            /**
             * Enable or disable writing into the depth buffer
             * @property depthMask
             * @type Boolean
             */
            depthMask:{
                get:function(){return _depthMask},
                set:function(newValue){
                    if (true){
                        if (typeof newValue !== 'boolean'){
                            KICK.core.Util.fail("Shader.depthMask must be a boolean. Was "+(typeof newValue));
                        }
                    }
                    _depthMask = newValue;
                }
            },
            /**
             * The depth test function. Must be one of
             * 512,
             * 513,
             * 514,
             * 515,
             * 516,
             * 517,
             * 518,
             * 519
             * @property zTest
             * @type Object
             */
            zTest:{
                get: function(){ return _zTest; },
                set: function(newValue){
                    if (true){
                        if (newValue !== 512 &&
                            newValue !== 513 &&
                            newValue !== 514 &&
                            newValue !== 515 &&
                            newValue !== 516 &&
                            newValue !== 517 &&
                            newValue !== 518 &&
                            newValue !== 519){
                            KICK.core.Util.fail("Shader.zTest must be 512, " +
                                "513,514,515," +
                                "516,517,518, " +
                                "or 519");
                        }
                    }
                    _zTest = newValue;
                }
            },
            /**
             * Enables/disables blending (default is false).<br>
             * "In RGBA mode, pixels can be drawn using a function that blends the incoming (source) RGBA values with the
             * RGBA values that are already in the frame buffer (the destination values)"
             * (From <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">www.Opengl.org</a>)
             * @property blend
             * @type Boolean
             */
            blend:{
                get: function(){ return _blend; },
                set: function(value){
                    if (true){
                        if (typeof value !== 'boolean'){
                            KICK.core.Util.fail("Shader.blend must be a boolean");
                        }
                    }
                    _blend = value;
                    updateBlendKey();
                }
            },
            /**
             * Specifies the blend s-factor<br>
             * Initial value 770
             * Must be set to one of: 0, 1, 768, 769, 774,
             * 775, 770, 771, 772, 773,
             * 32769, 32770, 32771, 32772, and
             * 776.<br>
             * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
             * @property blendSFactor
             * @type {Number}
             */
            blendSFactor:{
                get: function(){ return _blendSFactor;},
                set: function(value) {
                    if (true){
                        var c = KICK.core.Constants;
                        if (value !== 0 &&
                            value !== 1 &&
                            value !== 768 &&
                            value !== 769 &&
                            value !== 774 &&
                            value !== 775 &&
                            value !== 770 &&
                            value !== 771 &&
                            value !== 772 &&
                            value !== 773 &&
                            value !== 32769 &&
                            value !== 32770 &&
                            value !== 32771 &&
                            value !== 32772 &&
                            value !== 776){
                            KICK.core.Util.fail("Shader.blendSFactor must be a one of 0, 1, 768, " +
                                "769, 774, 775, 770, " +
                                "771, 772, 773, 32769, " +
                                "32770, 32771, 32772, and " +
                                "776.");
                        }
                    }
                    _blendSFactor = value;
                    updateBlendKey();
                }
            },
            /**
             * Specifies the blend d-factor<br>
             * Initial value 770
             * Must be set to one of: 0, 1, 768, 769, 774,
             * 775, 770, 771, 772, 773,
             * 32769, 32770, 32771, 32772, and
             * 771.<br>
             * See <a href="http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml">glBlendFunc on opengl.org</a>
             * @property blendDFactor
             * @type {Number}
             */
            blendDFactor:{
                get: function(){ return _blendDFactor; },
                set: function(value){
                    if (true){
                        var c = KICK.core.Constants;
                        if (value !== 0 &&
                            value !== 1 &&
                            value !== 768 &&
                            value !== 769 &&
                            value !== 774 &&
                            value !== 775 &&
                            value !== 770 &&
                            value !== 771 &&
                            value !== 772 &&
                            value !== 773 &&
                            value !== 32769 &&
                            value !== 32770 &&
                            value !== 32771 &&
                            value !== 32772){
                            KICK.core.Util.fail("Shader.blendSFactor must be a one of 0, 1, 768, " +
                                "769, 774, 775, 770, " +
                                "771, 772, 773, 32769, " +
                                "32770, 32771, and 32772.");
                        }
                    }
                    _blendDFactor = value;
                    updateBlendKey();
                }
            }
        });

        /**
         * Flush the current shader bound - this force the shader to be reloaded (and its uniforms and vertex attributes
         * are reassigned)
         * @method markUniformUpdated
         */
        this.markUniformUpdated = function(){
            gl.boundShader = -1;
            gl.meshShader = -1;
        };

        /**
         * Updates the shader (must be called after any shader state is changed to apply changes)
         * @method apply
         * @return {Boolean} shader created successfully
         */
        this.apply = function () {
            var errorLog = _errorLog || console.log,
                vertexShader = compileShader(_vertexShaderSrc, false, errorLog),
                fragmentShader = compileShader(_fragmentShaderSrc, true, errorLog),
                compileError = fragmentShader === null || vertexShader === null,
                i,
                c = KICK.core.Constants,
                activeUniforms,
                activeAttributes,
                attribute;
            if (compileError){
                vertexShader = compileShader(glslConstants["__error_vs.glsl"], false, errorLog);
                fragmentShader = compileShader(glslConstants["__error_fs.glsl"], true, errorLog);
            }

            _shaderProgramId = gl.createProgram();

            gl.attachShader(_shaderProgramId, vertexShader);
            gl.attachShader(_shaderProgramId, fragmentShader);
            gl.linkProgram(_shaderProgramId);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);

            if (!gl.getProgramParameter(_shaderProgramId, 35714)) {
                errorLog("Could not initialise shaders");
                return false;
            }

            gl.useProgram(_shaderProgramId);
            gl.boundShader = _shaderProgramId;
            activeUniforms = gl.getProgramParameter( _shaderProgramId, 35718);


            /**
             * Array of Object with size,type, name and index properties
             * @property activeUniforms
             * @type Object
             */
            this.activeUniforms = new Array(activeUniforms);
            /**
             * Lookup of uniform based on name.
             * @property lookupUniform
             * @type Object
             */
            this.lookupUniform = {};
            for (i=0;i<activeUniforms;i++) {
                var uniform = gl.getActiveUniform(_shaderProgramId,i);
                this.activeUniforms[i] = {
                    size: uniform.size,
                    type: uniform.type,
                    name: uniform.name,
                    location: gl.getUniformLocation(_shaderProgramId,uniform.name)
                };
                this.lookupUniform[uniform.name] = this.activeUniforms[i];
            }

            activeAttributes = gl.getProgramParameter( _shaderProgramId, 35721);
            /**
             * Array of JSON data with size,type and name
             * @property activeAttributes
             * @type Array[Object]
             */
            this.activeAttributes = new Array(activeAttributes);
            /**
             * Lookup of attribute location based on name.
             * @property lookupAttribute
             * @type Object
             */
            this.lookupAttribute = {};
            for (i=0;i<activeAttributes;i++) {
                attribute = gl.getActiveAttrib(_shaderProgramId,i);
                this.activeAttributes[i] = {
                    size: attribute.size,
                    type: attribute.type,
                    name: attribute.name
                };
                this.lookupAttribute[attribute.name] = i;
            }

            thisObj.markUniformUpdated();

            return !compileError;
        };

        /**
         * Deletes the shader program from memory.
         * A destroyed shader can be used again if update shader is called
         * @method destroy
         */
        this.destroy = function(){
            if (_shaderProgramId!==-1){
                gl.deleteProgram(_shaderProgramId);
                _shaderProgramId = -1;
                engine.project.removeResourceDescriptor(thisObj.uid);
            }
        };

        /**
         * Return true if the shader compiled successfully and is not destroyed
         * @method isValid
         * @return {Boolean} is shader valid
         */
        this.isValid = function(){
            return _shaderProgramId!==-1;
        };

        /**
         * @method bind
         */
        this.bind = function () {
            if (true){
                if (!(thisObj.isValid)){
                    KICK.core.Util.fail("Cannot bind a shader that is not valid");
                }
            }
            if (gl.boundShader !== _shaderProgramId){
                gl.boundShader = _shaderProgramId;
                gl.useProgram(_shaderProgramId);
                updateCullFace();
                updateDepthProperties();
                updateBlending();
                updatePolygonOffset();
            }
        };

        /**
         * Serializes the data into a JSON object (that can be used as a config parameter in the constructor)<br>
         * Note errorLog are not serialized
         * @method toJSON
         * @return {Object} config element
         */
        this.toJSON = function(){
            if (_dataURI){
                return {
                    uid: thisObj.uid,
                    name:_name,
                    dataURI:_dataURI
                }
            }
            return {
                uid: thisObj.uid,
                name:_name,
                blend:_blend,
                blendSFactor:_blendSFactor,
                blendDFactor:_blendDFactor,
                dataURI:_dataURI,
                depthMask:_depthMask,
                faceCulling:_faceCulling,
                fragmentShaderSrc:_fragmentShaderSrc,
                vertexShaderSrc:_vertexShaderSrc,
                polygonOffsetEnabled:_polygonOffsetEnabled,
                polygonOffsetFactor:_polygonOffsetFactor,
                polygonOffsetUnits:_polygonOffsetUnits,
                renderOrder:_renderOrder,
                zTest:_zTest,
                defaultUniforms:_defaultUniforms
            };
        };

        (function init(){
            applyConfig(thisObj,config);
            engine.project.registerObject(thisObj, "KICK.material.Shader");
            if (_dataURI && _dataURI.indexOf("memory://") !== 0){
                engine.resourceLoader.getShaderData(_dataURI,thisObj);
            } else {
                updateBlendKey();
                thisObj.apply();
            }
        })();
    };


    /**
     * @method getPrecompiledSource
     * @param {KICK.core.Engine} engine
     * @param {String} sourcecode
     * @return {String} sourcecode after precompiler
     * @static
     */
    material.Shader.getPrecompiledSource = function(engine,sourcecode){
        if (true){
            // insert #line nn after each #pragma include to give meaning full lines in error console
            var linebreakPosition = [];
            var position = sourcecode.indexOf('\n');
            while (position != -1){
                position++;
                linebreakPosition.push(position);
                position = sourcecode.indexOf('\n',position);
            }
            for (var i=linebreakPosition.length-2;i>=0;i--){
                position = linebreakPosition[i];
                var nextPosition = linebreakPosition[i+1];
                if (sourcecode.substring(position).indexOf("#pragma include")==0){
                    sourcecode = sourcecode.substring(0,nextPosition)+("#line  "+(i+2)+"\n")+sourcecode.substring(nextPosition);
                }
            }
        }
        for (var name in material.GLSLConstants){
            if (typeof (name) === "string"){
                var source = material.GLSLConstants[name];
                sourcecode = sourcecode.replace("#pragma include \""+name+"\"",source);
                sourcecode = sourcecode.replace("#pragma include \'"+name+"\'",source);
            }
        }
        var version = "#version 100";
        var lineOffset = 1;
        // if shader already contain version tag, then reuse this version information
        if (sourcecode.indexOf("#version ")===0){
            var indexOfNewline = sourcecode.indexOf('\n');
            version = sourcecode.substring(0,indexOfNewline); // save version info
            sourcecode = sourcecode.substring(indexOfNewline+1); // strip version info
            lineOffset = 2;
        }
        sourcecode =
            version + "\n"+
                "#define SHADOWS "+(engine.config.shadows===true)+"\n"+
                "#define LIGHTS "+(engine.config.maxNumerOfLights)+"\n"+
                "#line "+lineOffset+"\n"+
                sourcecode;
        return sourcecode;
    };

    /**
     * Update the material uniform
     * @method bindMaterialUniform
     * @param material
     * @param engineUniforms
     */
    material.Shader.prototype.bindMaterialUniform = function (material, engineUniforms) {
        // lookup uniforms
        var gl = this.gl,
            uniformName,
            materialUniforms = material.uniforms,
            timeObj,
            shaderUniform,
            uniform,
            value,
            location,
            sceneLights = engineUniforms.sceneLights,
            ambientLight = sceneLights.ambientLight,
            directionalLightData = sceneLights.directionalLightData,
            pointLightData = sceneLights.pointLightData,
            lookupUniforms = this.lookupUniform,
            proj = lookupUniforms._proj,
            directionalLightUniform = lookupUniforms._dLight,
            pointLightUniform = lookupUniforms["_pLights[0]"],
            time = lookupUniforms._time,
            viewport = lookupUniforms._viewport,
            lightUniformAmbient =  lookupUniforms._ambient,
            currentTexture = 0;


        for (uniformName in materialUniforms){
            shaderUniform = lookupUniforms[uniformName];
            if (shaderUniform){ // if shader has a uniform with uniformName
                uniform = materialUniforms[uniformName];
                location = shaderUniform.location;
                value = uniform.value;
                switch (shaderUniform.type){
                    case 5126:
                        gl.uniform1fv(location,value);
                        break;
                    case 35674:
                        gl.uniformMatrix2fv(location,false,value);
                        break;
                    case 35675:
                        gl.uniformMatrix3fv(location,false,value);
                        break;
                    case 35676:
                        gl.uniformMatrix4fv(location,false,value);
                        break;
                    case 35664:
                        gl.uniform2fv(location,value);
                        break;
                    case 35665:
                        gl.uniform3fv(location,value);
                        break;
                    case 35666:
                        gl.uniform4fv(location,value);
                        break;
                    case 5124:
                        gl.uniform1iv(location,value);
                        break;
                    case 35667:
                        gl.uniform2iv(location,value);
                        break;
                    case 35668:
                        gl.uniform3iv(location,value);
                        break;
                    case 35669:
                        gl.uniform4iv(location,value);
                        break;
                    case 35680:
                    case 35678:
                        value.bind(currentTexture);
                        gl.uniform1i(location,currentTexture);
                        currentTexture ++;
                        break;
                    default:
                        console.log("Warn cannot find type "+shaderUniform.type);
                        break;
                }
            }
        }

        if (proj){
            gl.uniformMatrix4fv(proj.location,false,engineUniforms.projectionMatrix);
        }
        if (lightUniformAmbient){
            var ambientLlightValue = ambientLight !== null ? ambientLight.colorIntensity : vec3Zero;
            gl.uniform3fv(lightUniformAmbient.location, ambientLlightValue);
        }

        if (directionalLightUniform){
            gl.uniformMatrix3fv(directionalLightUniform.location, false, directionalLightData);
        }
        if (pointLightUniform){
            gl.uniformMatrix3fv(pointLightUniform.location, false, pointLightData);
        }
        if (time){
            timeObj = this.engine.time;
            gl.uniform1f(time.location, timeObj.time);
        }
        if (viewport){
            gl.uniform2fv(viewport.location, gl.viewportSize);
        }
        return currentTexture;
    };

    /**
     * Binds the uniforms to the current shader.
     * The uniforms is expected to be in a valid format.
     * The method will call Shader.bindMaterialUniform if material uniforms needs to be changed.
     * @method bindUniform
     * @param {KICK.material.Material} material
     * @param {Object} engineUniforms
     * @param {KICK.scene.Transform) transform
        */
    material.Shader.prototype.bindUniform = function(material, engineUniforms, transform){
        var lookupUniform = this.lookupUniform,
            gl = this.gl,
            modelMatrix = lookupUniform._m,
            mv = lookupUniform._mv,
            mvProj = lookupUniform._mvProj,
            norm = lookupUniform._norm,
            gameObjectUID = lookupUniform._gameObjectUID,
            shadowMapTexture = lookupUniform._shadowMapTexture,
            _lightMat = lookupUniform._lightMat,
            sceneLights = engineUniforms.sceneLights,
            directionalLight = sceneLights.directionalLight,
            globalTransform,
            i,
            currentTexture = 0;
        if (gl.currentMaterial !== material)
        // shared material uniforms
        {
            gl.currentMaterial = material;
            currentTexture = this.bindMaterialUniform(material, engineUniforms);
        }

        // mesh instance uniforms
        {
            if (modelMatrix || mv || norm){
                globalTransform = transform.getGlobalMatrix();
                if (modelMatrix){
                    gl.uniformMatrix4fv(modelMatrix.location,false,globalTransform);
                }
                var modelView = mat4.multiply(engineUniforms.viewMatrix,globalTransform,tempMat4);
                if (mv){
                    gl.uniformMatrix4fv(mv.location,false,modelView);
                }
                if (norm){
                    // note this can be simplified to
                    // var normalMatrix = math.mat4.toMat3(finalModelView);
                    // if the modelViewMatrix is orthogonal (non-uniform scale is not applied)
                    //var normalMatrix = mat3.transpose(mat4.toInverseMat3(finalModelView));
                    var normalMatrix = mat4.toNormalMat3(modelView,tempMat3);
                    if (ASSERT){
                        if (!normalMatrix){
                            KICK.core.Util.fail("Singular matrix");
                        }
                    }
                    gl.uniformMatrix3fv(norm.location,false,normalMatrix);
                }
            }
            if (mvProj){
                globalTransform = globalTransform || transform.getGlobalMatrix();
                gl.uniformMatrix4fv(mvProj.location,false,mat4.multiply(engineUniforms.viewProjectionMatrix,globalTransform,tempMat4));
            }
            if (gameObjectUID){
                var uidAsVec4 = uint32ToVec4(transform.gameObject.uid,tmpVec4);
                if (this.engine.time.frame < 3){
                    console.log("transform.gameObject.uid "+transform.gameObject.uid);
                }
                gl.uniform4fv(gameObjectUID.location, uidAsVec4);
            }
            if (shadowMapTexture && directionalLight && directionalLight.shadowTexture){
                directionalLight.shadowTexture.bind(currentTexture);
                gl.uniform1i(shadowMapTexture.location,currentTexture);
                currentTexture ++;
            }
            if (_lightMat){
                globalTransform = transform.getGlobalMatrix();
                gl.uniformMatrix4fv(_lightMat.location,false,mat4.multiply(engineUniforms.lightMatrix,globalTransform,tempMat4));
            }
        }
    };

    Object.freeze(material.Shader);

    /**
     * Material configuration
     * @class Material
     * @namespace KICK.material
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @extends KICK.core.ProjectAsset
     */
    material.Material = function (engine,config) {
        var _name = "Material",
            _shader = null,
            _uniforms = {},
            thisObj = this,
            _renderOrder = 0,
            inheritDefaultUniformsFromShader = function(){
                var shaderDefaultUniforms = _shader.defaultUniforms;
                var dirty = false;
                for (var name in shaderDefaultUniforms){
                    if (!_uniforms[name]){
                        var defaultValue = shaderDefaultUniforms[name];
                        _uniforms[name] = {
                            value: defaultValue.value,
                            type: defaultValue.type
                        };
                        dirty = true;
                    }
                }
                if (dirty){
                    verifyUniforms();
                }
            },

            /**
             * The method replaces any invalid uniform (Array or numbers) with a wrapped one (Float32Array or Int32Array)
             * @method verifyUniforms
             * @private
             */
            verifyUniforms = function(){
                var uniformName,
                    type,
                    uniformValue,
                    c = KICK.core.Constants;

                for (uniformName in _uniforms){
                    uniformValue = _uniforms[uniformName].value;
                    type = _uniforms[uniformName].type;
                    if (type === 35678 || type ===35680 ){
                        if (uniformValue && typeof uniformValue.ref === 'number'){
                            _uniforms[uniformName].value = engine.project.load(uniformValue.ref);
                        }
                        if (true){
                            if (!(_uniforms[uniformName].value instanceof KICK.texture.Texture)){
                                KICK.core.Util.fail("Uniform value should be a texture object but was "+uniformValue);
                            }
                        }
                    }
                    if (Array.isArray(uniformValue) || typeof uniformValue === 'number'){
                        var array = uniformValue;
                        if (typeof array === 'number'){
                            array = [array];
                        }
                        if (type === 5124 || type===35667 || type===35668 || type===35669){
                            _uniforms[uniformName].value = new Int32Array(array);
                        } else {
                            _uniforms[uniformName].value = new Float32Array(array);
                        }
                    }
                }
            };
        Object.defineProperties(this,{
            /**
             * @property engine
             * @type KICK.core.Engine
             */
            engine:{
                value:engine
            },
             /**
              * @property name
              * @type String
              */
             name:{
                 get:function(){return _name;},
                 set:function(newValue){_name = newValue;}
             },
            /**

             * @property shader
             * @type KICK.material.Shader
             */
            shader:{
                get:function(){
                    return _shader;
                },
                set:function(newValue){
                    if (!newValue instanceof KICK.material.Shader){
                        fail("KICK.material.Shader expected");
                    }
                    if (_shader !==newValue){
                        _shader = newValue;
                        thisObj.init();
                    }
                }
            },
            /**
             * Object with of uniforms.
             * The object has a number of named properties one for each uniform. The uniform object contains value and type.
             * The value is always an array<br>
             * Note when updating the a uniform through a reference to uniforms, it is important to call the material.shader.markUniformUpdated().
             * When the material.uniform is set to something the markUniformUpdated function is implicit called.
             * @property uniforms
             * @type Object
             */
            uniforms:{
                get:function(){
                    return _uniforms;
                },
                set:function(newValue){
                    if (newValue != _uniforms){
                        newValue = newValue || {};
                        for (var name in newValue){
                            if (newValue.hasOwnProperty(name)){
                                var excludeClasses = [KICK.texture.Texture,KICK.texture.MovieTexture,KICK.texture.RenderTexture];
                                _uniforms[name] = KICK.core.Util.deepCopy(newValue[name], excludeClasses);
                            }
                        }
                        verifyUniforms();
                    }

                    if (_shader){
                        _shader.markUniformUpdated();
                    }
                }
            },
            /**
             * @property renderOrder
             * @type Number
             */
            renderOrder:{
                get:function(){
                    return _renderOrder;
                }
            }
        });

        /**
         * @method destroy
         */
        this.destroy = function(){
            engine.project.removeResourceDescriptor(thisObj.uid);
        };

        /**
         * Initialize the material
         * If the shader property is a string the shader is found in the engine.project.
         * If shader is invalid, the error shader is used
         * @method init
         */
        this.init = function(){
            if (!_shader){
                KICK.core.Util.fail("Cannot initiate shader in material "+_name);
                _shader = engine.project.load(engine.project.ENGINE_SHADER___ERROR);
            }

            inheritDefaultUniformsFromShader();

            if (!_renderOrder){
                _renderOrder = _shader.renderOrder;
            }
        };

        /**
         * Returns a JSON representation of the material<br>
         * @method toJSON
         * @return {string}
         */
        this.toJSON = function(){
            var filteredUniforms = {};
            for (var name in _uniforms){
                if (typeof name === 'string'){
                    var uniform = _uniforms[name],
                        value = uniform.value;
                    if (value instanceof Float32Array || value instanceof Int32Array) {
                        value = core.Util.typedArrayToArray(value);
                    } else {
                        if (true){
                            if (!value instanceof KICK.texture.Texture){
                                KICK.core.Util.fail("Unknown uniform value type. Expected Texture");
                            }
                        }
                        value = KICK.core.Util.getJSONReference(engine,value);
                    }

                    filteredUniforms[name] = {
                        type: uniform.type,
                        value:value
                    };
                }
            }
            return {
                uid: thisObj.uid,
                name:_name,
                shader: KICK.core.Util.getJSONReference(engine,_shader),
                uniforms: filteredUniforms
            };
        };

        (function init(){
            applyConfig(thisObj,config);
            engine.project.registerObject(thisObj, "KICK.material.Material");
        })();
    };
})();
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
            var sqrt75 = Math.sqrt(0.75);
            return new mesh.MeshData( {
                name: "Triangle",
                vertex: [
                    0,1,0,
                    -sqrt75,-0.5,0,
                    sqrt75,-0.5,0
                ],
                uv1: [
                    0.5,1,
                    0.125,0.25,
                    1-0.125,0.25
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
         * @param {Number} slices Optional default value is 64
         * @param {Number} stacks Optional default value is 32
         * @param {Number} radius
         * @return {KICK.mesh.MeshData} uv-sphere mesh
         */
        createUVSphereData : function(slices, stacks, radius){
            if (!slices || slices < 3){
                slices = 64;
            }
            if (!stacks || stacks < 2){
                stacks = 32;
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
                meshType: 5
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
})();/*!
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

    var importer = KICK.namespace("KICK.importer"),
        math = KICK.namespace("KICK.math"),
        quat4 = math.quat4,
        mat4 = math.mat4,
        getXMLElementById = function(doc, id){
            return doc.querySelector("[id=" + id + "]");
        };

     /**
     * Imports a Collada meshes into a scene
     * @class ColladaImporter
     * @namespace KICK.importer
     */
    importer.ColladaImporter = {};

    /**
     * @method import
     * @param {XMLDom_or_String} colladaDOM
     * @param {KICK.core.Engine} engine
     * @param {KICK.scene.Scene} scene Optional. If not specified the active scene (from the engine) is used
     * @param {boolean} rotate90x rotate -90 degrees around x axis
     * @return {Object} returns container object with the properties(mesh:[], gameObjects:[], materials:[])
     * @static
     */
    importer.ColladaImporter.import = function (colladaDOM, engine, scene, rotate90x){
        if (typeof colladaDOM === 'string'){
            var parser=new DOMParser();
            colladaDOM = parser.parseFromString(colladaDOM,"text/xml");
        }
        var dataCache = {},
            allMeshes = [],
            allMaterials = [],
            constants = KICK.core.Constants,
            /**
             * Converts a string to an array
             * @method stringToArray
             * @param {String} numberString
             * @param {Object} type Optional - valid types are Array (default), and typed arrays classes
             * @private
             */
            stringToArray = function(numberString,type){
                if (!type){
                    type = Array;
                }
                numberString = numberString.replace(/^\s+|\s+$/g,""); // trim
                numberString = numberString.replace(/\s{2,}/g, ' '); // remove double white spaces
                var numberArray = numberString.split(" ").map(Number);
                if (!type || type === Array){
                    return numberArray;
                } else {
                    // typed array
                    return new type(numberArray);
                }
            },
            /**
             * Get data element by id<br>
             * Note that the array is cached by id - this is done
             * to speed up performance in case of interleaved data
             * @method getArrayElementById
             * @param {String} id
             * @return {Array[Number]} data
             * @private
             */
            getArrayElementById = function(id){
                if (id.charAt(0) === '#'){
                    id = id.substring(1);
                }
                if (dataCache[id]){
                    return dataCache[id];
                }
                var arrayElement = getXMLElementById(colladaDOM,id);
                var type;
                if (arrayElement.tagName === "float_array"){
                    type = Float32Array;
                } else {
                    type = Int32Array;
                }
                var res = stringToArray(arrayElement.textContent,type);
                dataCache[id] = res;
                return res;
            },
            /**
             * Create accessor object for data
             * @method buildDataAccessor
             * @param {XML} elementChild
             * @return function of type function(index,paramOffset)
             * @private
             */
            buildDataAccessor = function(elementChild){
                var semantic = elementChild.getAttribute('semantic');
                var source = getXMLElementById(colladaDOM,elementChild.getAttribute("source").substring(1));
                if (source.tagName === "vertices"){
                    source = source.getElementsByTagName("input")[0];
                    source = getXMLElementById(colladaDOM,source.getAttribute("source").substring(1));
                }
                var technique_common = source.getElementsByTagName("technique_common")[0];
                var accessor = technique_common.getElementsByTagName("accessor")[0];
                var count = Number(accessor.getAttribute("count"));
                var stride = Number(accessor.getAttribute("stride"));
                var offset = Number(accessor.getAttribute("offset"));
                if (!offset){
                    offset = 0;
                }
                var arraySource = accessor.getAttribute("source");
                var rawData = getArrayElementById(arraySource);

                /**
                 * @param {Number} index (vertex index)
                 * @param {Number} paramOffset (0 means x, 1 means y, etc)
                 * @return {Number}
                 */
                return function(index,paramOffset){
                    var arrayIndex = offset+stride*index+paramOffset;
                    return rawData[arrayIndex];
                };
            },
            /**
             * @method buildFromPolyList
             * @private
             * @param {XMLDomElement} polylist
             * @param {KICK.mesh.MeshData} destMeshData
             */
            buildFromPolyList = function(polylist, destMeshData, vertexAttributeCache){
                var polylistChild = polylist.firstChild,
                    tagName,
                    i,j,
                    vertexCount = function(){return 3;},
                    count = Number(polylist.getAttribute("count")),
                    dataAccessor = {names:[],offset:{},accessors:{},length:{}},
                    offsetSet = [],
                    contains = KICK.core.Util.contains;

                var numberOfVertices = vertexAttributeCache.numberOfVertices || 0;

                while (polylistChild !== null){
                    tagName = polylistChild.tagName;
                    if (tagName === "input"){
                        var semantic = polylistChild.getAttribute('semantic');
                        var offset = Number(polylistChild.getAttribute('offset'));
                        dataAccessor.accessors[semantic] = new buildDataAccessor(polylistChild);
                        dataAccessor.names.push(semantic);
                        dataAccessor.offset[semantic] = offset;
                        dataAccessor.length[semantic] = semantic === "TEXCOORD"?2:3;
                        if (!contains(offsetSet,offset)){
                            offsetSet.push(offset);
                        }
                    } else if (tagName === "vcount"){
                        var vCount = stringToArray(polylistChild.textContent,Int32Array);
                        vertexCount = function(i){ return vCount[i];}
                    } else if (tagName === "p"){
                        var offsetCount = offsetSet.length;

                        var vertexIndices = stringToArray(polylistChild.textContent,Int32Array);

                        // initialize data container
                        var outVertexAttributes = {};
                        for (i=0;i<dataAccessor.names.length;i++){
                            outVertexAttributes[dataAccessor.names[i]] = [];
                        }

                        /**
                         * This method adds vertex attributes to the result index and
                         * @method addVertexAttributes
                         * @param {Number} index Source index in vertex array (the p element)
                         * @param {Object} outVertexAttributes Destination vertex index array
                         * @param {Array[Number]} outTriangleIndices Destination vertex index array
                         * @private
                         */
                        var addVertexAttributes = function(index,outVertexAttributes,outTriangleIndices){
                            var cacheKey = "",
                                offset,
                                vertexIndex,
                                name,
                                i,j,
                                indexInVertexIndices = index * offsetCount;
                            for (i=0;i<dataAccessor.names.length;i++){
                                name = dataAccessor.names[i];
                                offset = dataAccessor.offset[name];
                                vertexIndex = vertexIndices[offset+indexInVertexIndices];
                                cacheKey += index+"#"+vertexIndex+"#";
                            }
                            var cacheLookupRes = vertexAttributeCache[cacheKey];
                            var foundInCache = typeof cacheLookupRes === 'number';
                            if (foundInCache){
                                triangleIndices.push(cacheLookupRes);
                            } else {
                                for (i=0;i<dataAccessor.names.length;i++){
                                    name = dataAccessor.names[i];
                                    var accessor = dataAccessor.accessors[name];
                                    var length = dataAccessor.length[name];
                                    offset = dataAccessor.offset[name];
                                    vertexIndex = vertexIndices[offset+indexInVertexIndices];
                                    for (j=0;j<length;j++){
                                        var value = accessor(vertexIndex,j);
                                        outVertexAttributes[name].push(value);
                                    }
                                }
                                var idx = numberOfVertices;
                                numberOfVertices += 1;
                                outTriangleIndices.push(idx);
                                vertexAttributeCache[cacheKey] =idx;
                            }
                        };

                        // triangulate data
                        var index = 0;
                        var triangleIndices = [];
                        for (i=0;i<count;i++){
                            var vertexCountI = vertexCount(i);
                            for (j=0;j<3;j++){
                                addVertexAttributes(index+j,outVertexAttributes,triangleIndices);
                            }
                            for (j=3;j<vertexCountI;j++){
                                addVertexAttributes(index+0,outVertexAttributes,triangleIndices);
                                addVertexAttributes(index+j-1,outVertexAttributes,triangleIndices);
                                addVertexAttributes(index+j,outVertexAttributes,triangleIndices);
                            }
                            index += vertexCountI;
                        }

                        for (i=0;i<dataAccessor.names.length;i++){
                            var name = dataAccessor.names[i];
                            var nameMeshData = name.toLowerCase();
                            if (nameMeshData === "texcoord"){
                                nameMeshData = "uv1";
                            }
                            if (destMeshData[nameMeshData] && destMeshData[nameMeshData].length){
                                // array already exist - append data
                                var toArray = KICK.core.Util.typedArrayToArray;
                                var source = toArray(destMeshData[nameMeshData]);
                                var append = toArray(outVertexAttributes[name]);
                                source.push.apply(source,append); // short way to append one array to another
                                destMeshData[nameMeshData] = source;
                            } else {
                                destMeshData[nameMeshData] = outVertexAttributes[name];
                            }
                        }
                        destMeshData.meshType = 4;
                        var subMeshes = destMeshData.subMeshes;
                        subMeshes.push(triangleIndices);
                        destMeshData.subMeshes = subMeshes;
                        console.log("pushing new sub mesh with "+triangleIndices.length+" as # "+destMeshData.subMeshes.length);
                    }
                    polylistChild = polylistChild .nextSibling;
                }

                vertexAttributeCache.numberOfVertices = numberOfVertices ;
            },
            /**
             * Builds meshdata component (based on a &lt;mesh&gt; node)
             * @method buildMeshData
             */
            buildMeshData = function (colladaDOM, engine, geometry){
                var tagName,
                    meshChild,
                    name = geometry.getAttribute('name') || "MeshData",
                    destMeshData,
                    mesh = geometry.getElementsByTagName("mesh");
                if (mesh.length==0){
                    return null;
                }
                var vertexAttributeCache = {};
                mesh = mesh[0];
                meshChild = mesh.firstChild;
                while (meshChild !== null){
                    tagName = meshChild.tagName;
                    if (tagName === "lines"){
                        console.log("lines - unsupported");
                    } else if (tagName === "linestrips - unsupported"){
                        console.log("linestrips");
                    } else if (tagName === "polygons"){
                        console.log("polygons  - unsupported");
                    } else if (tagName === "polylist" || tagName === "triangles"){
                        if (!destMeshData){
                            destMeshData = new KICK.mesh.MeshData({name:name});
                        }
                        buildFromPolyList(meshChild,destMeshData,vertexAttributeCache);
                    } else if (tagName === "trifans"){
                        console.log("trifans unsupported");
                    } else if (tagName === "tristrips"){
                        console.log("tristrips - unsupported");
                    }
                    meshChild = meshChild.nextSibling;
                }
                return destMeshData;
            },
            getMeshesById = function(engine, meshid){
                var meshArray = [],
                    k,
                    geometry;
                if (meshCache[meshid]){
                    return meshCache[meshid];
                }
                if (meshid && meshid.charAt(0)==="#"){
                    meshid = meshid.substring(1);
                }
                for (k=0;k<geometries.length;k++){
                    geometry = geometries[k];
                    if (geometry.getAttribute("id") === meshid){
                        var meshData = buildMeshData(colladaDOM, engine, geometry);
                        if (meshData){
                            var newMesh = new KICK.mesh.Mesh(engine, {meshData:meshData,name:meshData.name+" mesh"});
                            allMeshes.push(newMesh);
                            meshArray.push(newMesh);
                        }
                        break;
                    }
                }
                meshCache[meshid] = meshArray;
                return meshArray;
            },
            updateTransform = function(transform, node){
                var tagName = node.tagName,
                    sid = node.getAttribute('sid');
                if (tagName === "translate"){
                    transform.localPosition = stringToArray(node.textContent);
                } else if (tagName === "rotate"){
                    var angleAxis = stringToArray(node.textContent);
                    var angle = angleAxis[3];
                    if (angle){
                        var rotationQuat = quat4.angleAxis(angle,angleAxis);
                        var currentQuat = transform.localRotation;
                        transform.localRotation = quat4.multiply(currentQuat,rotationQuat,rotationQuat);
                    }
                } else if (tagName === "scale"){
                    transform.localScale = stringToArray(node.textContent);
                } else if (tagName === "matrix"){
                    var matrix = stringToArray(node.textContent);
                    var decomposedMatrix = mat4.decompose(matrix);
                    transform.localPosition = decomposedMatrix[0];
                    transform.localRotation = decomposedMatrix[1];
                    transform.localScale = decomposedMatrix[2];
                }
            },
            createMeshRenderer = function(gameObject, node){
                var url = node.getAttribute("url"),
                    meshRenderer;
                if (url){
                    url = url.substring(1);
                }

                var meshes = getMeshesById(engine,url);
                for (var i=0;i<meshes.length;i++){
                    meshRenderer = new KICK.scene.MeshRenderer();
                    meshRenderer.mesh = meshes[i];
                    var newMaterial = new KICK.material.Material(engine,{
                        name:"Some material",
                        shader:engine.project.load(engine.project.ENGINE_SHADER_DEFAULT)
                    });
                    meshRenderer.material = newMaterial;
                    allMaterials.push(newMaterial);

                    gameObject.addComponent(meshRenderer);
                }
            },
            addNode = function(node, parent){
                var gameObject = scene.createGameObject();
                var transform = gameObject.transform;
                if (parent){
                    transform.parent = parent;
                }
                gameObject.name = node.getAttribute("id");
                allGameObjects.push(gameObject);
                var childNode = node.firstElementChild;
                while (childNode){
                    var tagName = childNode.tagName;
                    if (tagName === "translate" ||
                        tagName === "rotate" ||
                        tagName === "scale" ||
                        tagName === "matrix"){
                        updateTransform(transform, childNode);
                        // todo handle situation where a number of transformation is done
                        // such as
                        //
//                        <node id="BarrelChild2" type="NODE">
//                                    <matrix sid="parentinverse">-1.239744 0.2559972 -2.716832 10.05096 -2.541176 -1.195862 1.046907 -3.691495 -0.1949036 0.5362619 0.1394684 -0.6007659 0 0 0 1</matrix>
//                                    <translate sid="location">0.02037613 0.3007245 4.455008</translate>
//                                    <rotate sid="rotationZ">0 0 1 303.8883</rotate>
//                                    <rotate sid="rotationY">0 1 0 32.78434</rotate>
//                                    <rotate sid="rotationX">1 0 0 120.9668</rotate>
//                                    <scale sid="scale">0.333636 0.333636 1.702475</scale>
//                                    <instance_geometry url="#Torus_002-mesh">
//                                      <bind_material>
//                                        <technique_common>
//                                          <instance_material symbol="Blue_material1" target="#Blue_material-material"/>
//                                        </technique_common>
//                                      </bind_material>
//                                    </instance_geometry>
//                                  </node>
                    }
                    else if (tagName === "instance_geometry"){
                        createMeshRenderer(gameObject, childNode);
                        /*if (rotate90x){
                        var currentRotation = transform.localRotation;
                        var rotationAroundX = quat4.angleAxis(-90,[1,0,0]);
                        transform.localRotation = quat4.multiply(rotationAroundX,currentRotation);
                    }*/
                    } else if (tagName === "node"){
                        addNode(childNode,transform);
                    } else {
                        console.log("Unknown tagName '"+tagName+"'");
                    }
                    childNode = childNode.nextElementSibling;
                }
            };

        var libraryGeometries = colladaDOM.firstChild.getElementsByTagName("library_geometries"),
            visualScenes = colladaDOM.firstChild.getElementsByTagName("visual_scene"),
            geometries,
            i;

        if (!scene){
            scene = engine.activeScene;
        }
        if (libraryGeometries.length==0){
            // no geometries found
        }

        libraryGeometries = libraryGeometries[0];
        geometries = libraryGeometries.getElementsByTagName("geometry");
        var allGameObjects = [];
        var meshCache = {};

        for (i=0;i<visualScenes.length;i++){
            var visualScene = visualScenes[i];
            var node = visualScene.firstElementChild;
            while (node){
                addNode(node, null);
                node = node.nextElementSibling;
            }
        }
        if (rotate90x){
            // ideally it would be better to transform the geometry
            // instead of introducing a new parent
            var parent = scene.createGameObject({name:"Collada Parent"});
            var parentTransform = parent.transform;
            parentTransform.localRotationEuler = [-90,0,0];
            for (i=0;i<allGameObjects.length;i++){
                var goTransform = allGameObjects[i].transform;
                if (!goTransform.parent){
                    goTransform.parent = parentTransform;
                }
            }
            allGameObjects.push(parent);
        }
        return {mesh:allMeshes, gameObjects:allGameObjects, materials:allMaterials};
    };
})();/*!
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

    var importer = KICK.namespace("KICK.importer"),
        math = KICK.namespace("KICK.math"),
        quat4 = math.quat4,
        mat4 = math.mat4;

    /**
     * Imports a Wavefront .obj mesh into a scene. The importer loading both normals and texture coordinates from the
     * model if available. Note that each import can contains multiple models and each model may have multiple
     * sub-meshes.
     * @class ObjImporter
     * @namespace KICK.importer
     */
    importer.ObjImporter = {};

    /**
     * @method import
     * @param {String} objFileContent
     * @param {KICK.core.Engine} engine
     * @param {KICK.scene.Scene} scene Optional. If not specified the active scene (from the engine) is used
     * @param {boolean} rotate90x rotate -90 degrees around x axis
     * @return {Object} returns container object with the properties (mesh:[], gameObjects:[], materials:[])
     * @static
     */
    importer.ObjImporter.import = function (objFileContent, engine, scene, rotate90x){
        var lines = objFileContent.split("\n"),
            linesLength = lines.length,
            vertices = [],
            normals = [],
            textureCoordinates = [],
            triangles = [],
            materialNames = [],
            submeshes = [triangles],
            allGameObjects = [],
            allMaterials = [],
            allMeshes = [],
            objectName = "MeshObject",
            trim = function (str){ return str.replace(/^\s+|\s+$/g, ""); },
            strAsArray = function(numberString, type){
                if (!type){
                    type = Array;
                }
                numberString = numberString.replace(/^\s+|\s+$/g,""); // trim
                numberString = numberString.replace(/\s{2,}/g, ' '); // remove double white spaces
                var numberArray = numberString.split(" ").map(Number);
                if (!type || type === Array){
                    return numberArray;
                } else {
                    // typed array
                    return new type(numberArray);
                }
            },
            getIndices = function(strArray){
                var array = [];
                for (var i=0;i<strArray.length;i++){
                    var str = strArray[i],
                        splittedStr = str.split("/"),
                        vertexIndex = parseInt(splittedStr[0]);
                    array.push([vertexIndex,
                        splittedStr.length>=2 ? parseInt(splittedStr[1]) : vertexIndex,
                        splittedStr.length>=3 ? parseInt(splittedStr[2]) : vertexIndex]);
                }

                return array;
            },
            addObject = function(){
                var pushVertexData = function(source, index, dest){
                    var sourceElement = source[index-1]; // note: obj is 1 indexed - therefor -1
                    for (var i=0;i<sourceElement.length;i++){
                        dest.push(sourceElement[i]);
                    }
                };
                if (vertices.length==0){
                    return;
                }
                var gameObject = scene.createGameObject(),
                    meshData = new KICK.mesh.MeshData(),
                    mesh = new KICK.mesh.Mesh(engine),
                    meshDataVertices = [],
                    meshDataNormals = [],
                    meshDataTextureCoordinates = [],
                    meshDataIndices,
                    meshDataSubmeshes = [],
                    cache = {},
                    count = 0;
                allMeshes.push(mesh);
                for (var k=0;k<submeshes.length;k++){
                    triangles = submeshes[k];
                    meshDataIndices = [];
                    meshDataSubmeshes.push(meshDataIndices);
                    for (var i=0;i<triangles.length;i++){
                        var vertexUvsNormalStrArray = triangles[i]; // has the value such as ["1//1", "2//2", "3//3"]
                        var idx = getIndices(vertexUvsNormalStrArray);
                        for (var j=0;j<3;j++){
                            var vertexUvsNormalStr = vertexUvsNormalStrArray[j]; // has the value such as "1//1"
                            if (typeof cache[vertexUvsNormalStr] === 'number'){ // if index is in the cache, reuse index
                                meshDataIndices.push(cache[vertexUvsNormalStr]);
                            } else {
                                pushVertexData(vertices,idx[j][0],meshDataVertices);
                                if (textureCoordinates.length){
                                    pushVertexData(textureCoordinates,idx[j][1],meshDataTextureCoordinates);
                                }
                                if (normals.length){
                                    pushVertexData(normals,idx[j][2],meshDataNormals);
                                }
                                meshDataIndices.push(count);
                                cache[vertexUvsNormalStr] = count;
                                count ++;
                            }
                        }
                    }
                }

                meshData.vertex = meshDataVertices;
                if (meshDataNormals.length){
                    meshData.normal = meshDataNormals;
                }
                if (meshDataTextureCoordinates.length){
                    meshData.uv1 = meshDataTextureCoordinates;
                }
                meshData.subMeshes = meshDataSubmeshes;
                mesh.meshData = meshData;
                mesh.name = objectName+" mesh";
                var meshRenderer = new KICK.scene.MeshRenderer();
                meshRenderer.mesh = mesh;

                var materials = [];

                var addDefaultMaterial = function(name){
                    var newMaterial = new KICK.material.Material(engine,{
                        name:name,
                        shader:engine.project.load(engine.project.ENGINE_SHADER_DEFAULT)
                    });
                    materials.push(newMaterial);
                    allMaterials.push(newMaterial);
                };

                for (var i=0;i < meshDataSubmeshes.length;i++){
                    if (i<materialNames.length){
                        var materialName = materialNames[i];
                        var projectMaterial = engine.project.loadByName(materialName,"KICK.material.Material");
                        if (projectMaterial){
                            materials.push(projectMaterial);
                        } else {
                            addDefaultMaterial(materialName);
                        }
                    } else {
                        addDefaultMaterial("material");
                    }
                }

                meshRenderer.materials = materials;
                gameObject.name = objectName;
                gameObject.addComponent(meshRenderer);
                allGameObjects.push(gameObject);
                triangles = [];
            };

        var transformMatrix = mat4.identity(mat4.create());
        if (rotate90x){
            mat4.rotateX(transformMatrix,-90*0.01745329251994);
        }

        for (var i=0;i<linesLength;i++){
            var line = trim(lines[i]);
            var tokenIndex = line.indexOf(' ');
            if (tokenIndex<0){
                continue;
            }
            var token = line.substring(0,tokenIndex);
            var value = line.substring(tokenIndex+1);
            if (token === "o"){
                addObject();
                objectName = value;
                materialNames.length = 0;
            } else if (token === "usemtl"){
                materialNames.push(value);
                // create material with name value is not exist
                if (triangles.length>0){
                    triangles = [];
                    submeshes[submeshes.length] = triangles;
                }
            } else if (token === "v"){
                var vertex = strAsArray(value);
                mat4.multiplyVec3(transformMatrix,vertex);
                vertices.push(vertex);
            } else if (token === "vn"){
                var normal = strAsArray(value);
                mat4.multiplyVec3Vector(transformMatrix,normal);
                normals.push(normal);
            } else if (token === "vt"){
                textureCoordinates.push(strAsArray(value));
            } else if (token === "f"){
                var polygon = value.split(" ");
                triangles.push(polygon.slice(0,3));
                for (var j=3;j<polygon.length;j++){
                    triangles.push([polygon[j-1],polygon[j],polygon[0]]);
                }
            }
        }
        addObject();

        return {mesh:allMeshes, gameObjects:allGameObjects, materials:allMaterials};
    };
})();/*!
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
        mesh = KICK.namespace("KICK.mesh"),
        constants = core.Constants,
        ASSERT = true,
        debug = true,
        fail = core.Util.fail,
        getUrlAsResourceName = function(url){
            var name = url.split('/');
            if (name.length>2){
                name = name[name.length-2];
                name = name.substring(0,1).toUpperCase()+name.substring(1);
            } else {
                name = url;
            }
            return name;
        };

    /**
     * Responsible for loading of resources.
     * @class ResourceLoader
     * @namespace KICK.core
     * @constructor
     */
    core.ResourceLoader = function (engine) {
        var resourceProviders =
            [
                new core.URLResourceProvider(engine),
                new core.BuiltInResourceProvider(engine)
            ],
            /**
             * Create a callback function
             * @method buildCallbackFunc
             * @private
             */
            buildCallbackFunc = function(methodName){
                return function(url,destination){
                    for (var i=resourceProviders.length-1;i>=0;i--){
                        var resourceProvider = resourceProviders[i];
                        var protocol = resourceProvider.protocol;
                        if (url.indexOf(protocol)===0){
                            resourceProvider[methodName](url,destination);
                            return;
                        }
                    }
                };
            };
        /**
         * @method getMeshData
         * @param {String} uri
         * @param {KICK.mesh.Mesh} meshDestination
         */
        this.getMeshData = buildCallbackFunc("getMeshData");
        /**
         * @method getImageData
         * @param {String} uri
         * @param {KICK.texture.Texture} textureDestination
         */
        this.getImageData = buildCallbackFunc("getImageData");

        /**
         * @method getShaderData
         * @param {String} uri
         * @param {KICK.material.Shader} shaderDestination
         */
        this.getShaderData = buildCallbackFunc("getShaderData");

        /**
         * @method addResourceProvider
         * @param {KICK.resource.ResourceProvider} resourceProvider
         */
        this.addResourceProvider = function(resourceProvider){
            resourceProviders.push(resourceProvider);
        };

        /**
         * @method removeResourceProvider
         * @param {KICK.resource.ResourceProvider} resourceProvider
         */
        this.removeResourceProvider = function(resourceProvider){
            for (var i=resourceProvider.length-1;i>=0;i--){
                if (resourceProviders[i] === resourceProvider){
                    resourceProviders.splice(i,1);
                }
            }
        };
    };

    /**
     * Responsible for creating or loading a resource using a given url
     * @class ResourceProvider
     * @namespace KICK.core
     * @constructor
     * @param {String} protocol
     */
    /**
     * Protocol of the resource, such as http://, kickjs://<br>
     * The protocol must uniquely identify a resource provider
     * @property protocol
     * @type String
     */

    /**
     * @method getMeshData
     * @param {String} uri
     * @param {KICK.mesh.Mesh} meshDestination
     */
    /**
     * @method getImageData
     * @param {String} uri
     * @param {KICK.texture.Texture} textureDestination
     */
    /**
     * @method getShaderData
     * @param {String} uri
     * @param {KICK.material.Shader} shaderDestination
     */


    /**
     * Fall back handler of resources
     * @class URLResourceProvider
     * @namespace KICK.core
     * @constructor
     * @extends KICK.core.ResourceProvider
     * @param {KICK.core.Engine} engine
     * @private
     */
    core.URLResourceProvider = function(engine){
        var gl = engine.gl,
            thisObj = this;
        Object.defineProperties(this,{
            /**
             * Returns empty string (match all)
             * @property protocol
             * @type String
             */
            protocol:{
                value:""
            }
        });

        this.getMeshData = function(url,meshDestination){
            var oReq = new XMLHttpRequest();
            var resourceTracker = engine.project.createResourceTracker();
            function handler()
            {
                if (oReq.readyState == 4 /* complete */) {
                    if (oReq.status == 200 /* ok */) {
                        var arrayBuffer = oReq.response;
                        var meshData = new KICK.mesh.MeshData();
                        if (meshData.deserialize(arrayBuffer)){
                            meshDestination.meshData = meshData;
                            resourceTracker.resourceReady();
                        } else {
                            fail("Cannot deserialize meshdata "+url);
                            resourceTracker.resourceFailed();
                        }
                    } else {
                        fail("Cannot load meshdata "+url+". Server responded "+oReq.status);
                        resourceTracker.resourceFailed();
                    }
                }
            }

            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";
            oReq.onreadystatechange = handler;
            oReq.send();
        };

        this.getImageData = function(uri,textureDestination){
            var img = new Image();
            var resourceTracker = engine.project.createResourceTracker();
            img.onload = function(){
                try{
                    textureDestination.setImage(img,uri);
                    resourceTracker.resourceReady();
                } catch (e){
                    fail("Exception when loading image "+uri);
                    resourceTracker.resourceFailed();
                }
            };
            img.onerror = function(e){
                fail(e);
                fail("Exception when loading image "+uri);
                resourceTracker.resourceFailed();
            };
            img.crossOrigin = "anonymous"; // Ask for a CORS image
            img.src = uri;
        };
    };

    /**
     * Responsible for providing the built-in resources (such as textures, shaders and mesh data).
     * All build-in resources have the prefix kickjs
     * @class BuiltInResourceProvider
     * @namespace KICK.core
     * @constructor
     * @extends KICK.core.ResourceProvider
     * @param {KICK.core.Engine} engine
     * @private
     */
    core.BuiltInResourceProvider = function(engine){
        var gl = engine.gl,
            thisObj = this;
        Object.defineProperties(this,{
            /**
             * Returns kickjs
             * @property protocol
             * @type String
             */
            protocol:{
                value:"kickjs://"
            }
        });

        /**
         * <ul>
         * <li><b>Triangle</b> Url: kickjs://mesh/triangle/</li>
         * <li><b>Plane</b> Url: kickjs://mesh/plane/<br></li>
         * <li><b>UVSphere</b> Url: kickjs://mesh/uvsphere/?slides=20&stacks=10&radius=1.0<br>Note that the parameters is optional</li>
         * <li><b>Cube</b> Url: kickjs://mesh/cube/?length=1.0<br>Note that the parameters is optional</li>
         * </ul>
         * @param {String} url
         * @param {KICK.mesh.Mesh} meshDestination
         */
        this.getMeshData = function(url,meshDestination){
            var meshDataObj,
                getParameterInt = core.Util.getParameterInt,
                getParameterFloat = core.Util.getParameterFloat;
            if (url.indexOf("kickjs://mesh/triangle/")==0){
                meshDataObj = mesh.MeshFactory.createTriangleData();
            } else if (url.indexOf("kickjs://mesh/plane/")==0){
                meshDataObj = mesh.MeshFactory.createPlaneData();
            } else if (url.indexOf("kickjs://mesh/uvsphere/")==0){
                var slices = getParameterInt(url, "slices"),
                    stacks = getParameterInt(url, "stacks"),
                    radius = getParameterFloat(url, "radius");
                meshDataObj = mesh.MeshFactory.createUVSphereData(slices, stacks, radius);
            } else if (url.indexOf("kickjs://mesh/cube/")==0){
                var length = getParameterFloat(url, "length");
                meshDataObj = mesh.MeshFactory.createCubeData(length);
            } else {
                KICK.core.Util.fail("No meshdata found for "+url);
                return;
            }

            meshDestination.meshData = meshDataObj;
        };

        /**
         * Create a default shader config based on a URL<br>
         * The following shaders are available:
         *  <ul>
         *  <li><b>Default</b> Url: kickjs://shader/default/</li>
         *  <li><b>Specular</b> Url: kickjs://shader/specular/</li>
         *  <li><b>Diffuse</b> Url: kickjs://shader/diffuse/</li>
         *  <li><b>Unlit</b> Url: kickjs://shader/unlit/</li>
         *  <li><b>Transparent Specular</b> Url: kickjs://shader/transparent_specular/</li>
         *  <li><b>Transparent Unlit</b> Url: kickjs://shader/transparent_unlit/</li>
         *  <li><b>Shadowmap</b> Url: kickjs://shader/__shadowmap/</li>
         *  <li><b>Pick</b> Url: kickjs://shader/__pick/</li>
         *  <li><b>Error</b> Url: kickjs://shader/__error/<br></li>
         *  </ul>
         * @method getShaderData
         * @param {String} url
         * @param {KICK.material.Shader} shaderDestination
         */
        this.getShaderData = function(url,shaderDestination){
            var vertexShaderSrc,
                fragmentShaderSrc,
                blend = false,
                polygonOffsetEnabled = false,
                depthMask = true,
                renderOrder = 1000,
                glslConstants = KICK.material.GLSLConstants,
                defaultUniforms = {},
                compareAndSetShader = function(shaderName){
                    var res = url.indexOf("kickjs://shader/"+shaderName+"/")===0;
                    if (res){
                        vertexShaderSrc = glslConstants[shaderName+"_vs.glsl"];
                        fragmentShaderSrc = glslConstants[shaderName+"_fs.glsl"];
                        if (shaderName.indexOf("transparent_")===0){
                            blend = true;
                            depthMask = false;
                            renderOrder = 2000;
                        }
                        if (shaderName==="__shadowmap"){
                            polygonOffsetEnabled = true;
                        }

                        if (shaderName==="specular" || shaderName==="transparent_specular"){
                            defaultUniforms = {
                                mainColor: {
                                    value: [1,1,1,1],
                                    type: 35666
                                },
                                mainTexture: {
                                    value: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE),
                                    type: 35678
                                },
                                specularColor: {
                                    value: [1,1,1,1],
                                    type: 35666
                                },
                                specularExponent: {
                                    value: 50,
                                    type: 5126
                                }
                            };
                        }
                        if (shaderName==="diffuse" ||
                            shaderName==="transparent_diffuse" ||
                            shaderName==="unlit" ||
                            shaderName==="unlit_vertex_color" ||
                            shaderName==="transparent_unlit"){
                            defaultUniforms = {
                                mainColor: {
                                    value: [1,1,1,1],
                                    type: 35666
                                },
                                mainTexture: {
                                    value: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE),
                                    type: 35678
                                }
                            };
                        }

                    }
                    return res;
                },
                shaderTypes = [
                    "specular",
                    "diffuse",
                    "__shadowmap",
                    "__error",
                    "__pick",
                    "transparent_specular",
                    "transparent_diffuse",
                    "unlit",
                    "unlit_vertex_color",
                    "transparent_unlit"];
            if (url === "kickjs://shader/default/"){
                url = "kickjs://shader/diffuse/";
            }
            for (var i=0;i<shaderTypes.length;i++){
                if (compareAndSetShader(shaderTypes[i])){
                    break;
                }
            }
            if (ASSERT){
                if (!vertexShaderSrc){
                    KICK.core.Util.fail("Cannot find shader url '"+url+"'");
                }
            }


            var config = {
                blend:blend,
                depthMask:depthMask,
                renderOrder:renderOrder,
                polygonOffsetEnabled:polygonOffsetEnabled,
                vertexShaderSrc: vertexShaderSrc,
                fragmentShaderSrc: fragmentShaderSrc,
                defaultUniforms: defaultUniforms
            };

            KICK.core.Util.applyConfig(shaderDestination,config);
            shaderDestination.apply();
        };

        /**
         * Create a default texture based on a URL.<br>
         * The following default textures exists:
         *  <ul>
         *  <li><b>Black</b> Url: kickjs://texture/black/</li>
         *  <li><b>White</b> Url: kickjs://texture/white/<br></li>
         *  <li><b>Gray</b>  Url: kickjs://texture/gray/<br></li>
         *  <li><b>KickJS logo</b>  Url: kickjs://texture/logo/<br></li>
         *  </ul>
         * @param uri
         * @param textureDestination
         */
        this.getImageData = function(uri,textureDestination){
            var data;

            if (uri.indexOf("kickjs://texture/black/") === 0){
                data = new Uint8Array([0, 0, 0, 255,
                                         0,   0,   0,255,
                                         0,   0,   0,255,
                                         0,   0,   0,255]);
            } else if (uri.indexOf("kickjs://texture/white/") === 0){
                data = new Uint8Array([255, 255, 255,255,
                                         255,   255,   255,255,
                                         255,   255,   255,255,
                                         255,   255,   255,255]);
            } else if (uri.indexOf("kickjs://texture/gray/") === 0){
                data = new Uint8Array([127, 127, 127,255,
                                         127,   127,   127,255,
                                         127,   127,   127,255,
                                         127,   127,   127,255]);
            } else if (uri.indexOf("kickjs://texture/logo/") === 0){
                var logoResource = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAXgWlDQ1BJQ0MgUHJvZmlsZQAAeAGtWXc8lt/7P/cz8Xisx957Zm+y98jeyXqsx/bYu6wyUiSEKCSSaBohoYVkhKaMFFHRQsT3pvp8P3/8vv/9bi/3/Xad93Wd65zr3Ofc1wUAthueYWFBCDoAgkMiyTZGurxOzi682FcAgn8YgRBg9iRGhOlYWZmD/3n9mIC58DUmuWvrf9L+7wZ6b58IIgCQFdzs5R1BDIbxDQAQt4hh5EgAULv2BGMiw3bxSRgzkmEHYVyzi/1+49Zd7PUbD+5x7Gz0YM40ABTUnp5kPwCol2E5bzTRD7aDpwYAwxDiTQoBgMALY02iv6c3AGweMGdfcHDoLs6FsajXv+z4/Qt7enr9Y9PT0+8f/HsssCbcsT4pIizIM27vj//PW3BQFDxfexczfKcOi9S1gZ+s8LyxkiJN7GDMCGMZ/yhj+z9YP97fznGXC8udQrwsLGHMAGNvYoQePJcAtgNFB4aa7drZ5eR6++gbwBheFVBJRLTtX1wX769n8YfjFOBpuhszGpjT6kmG0e9+74dFWu36sGvzRUiQhfkfvOJLNty1D8sRGJ8IA1sYwz4gOCPJdrty2GeElC/J0ATGcL8I3bCgvTW3y7EhR9nsjkUQxt4+IfZ/dY95e+qbwXJOWF4KzIEe0Ae88D0UBMG/ZEAC3vDzr5z4L7ktiAcfQQjwARGwxh7DnZRK/ouBIfCE9f3gdsk/+rp7Eh8QDWv9+ssbWm5Z/ov/6Hj9o2EI3u7Z+GNBpkFmUWbrL5uX9q9fGAOMPsYYY4gR+yuBe/o9CvKef2bwaHxAFGzLB+77rz//HlXUP4x/S3/Pgc2eViDMIP3tGzjseUb6x5bZPzPzZy5Qwig5lCJKF6WB0kSpAl4UM4odSKIUUCooHZQWSh1uU/3XPP/R+uO/JPDdm6voPe8DwTvYc/itjvSJjYRjBfRCw+LIJD//SF4deLfw2cdrEkKU2scrJyMrB3b3nl0OAF9t9vYUiPnJf2XBTQCokOB15fZfmRe8J7RLwu9ww39lwkXwOx4AwIAgMYoc/dseaveBBlSAFl5pbIAbCABRePxyQAmoA21gAEyBJbADzsANEIE/7C8ZxIBEcARkghxwEpwGpaASVIM60AiugRbQAe6C+2AADINx8BJMg3mwBFbAD7AJQRAWwkMEiA3igYQgCUgOUoE0IQPIHLKBnCEPyA8KgaKgRCgNyoEKoFLoPFQPXYXaoLvQI2gEeg7NQIvQF+gnAomgRjAiuBDCCGmECkIHYYawQxxC+CHCEfGIdEQeogRRhbiMuIW4ixhAjCOmEUuI70iAxCGZkXxISaQKUg9piXRB+iLJyGRkNrIIWYW8gmxHPkCOIaeRy8gNFAZFQPGiJOFYGqPsUURUOCoZlYsqRdWhbqH6UGOoGdQKahuNR3OiJdBqaBO0E9oPHYPORBeha9E30ffQ4+h59A8MBsOMEcEow+vXGROAScDkYs5imjDdmBHMHOY7Fotlw0pgNbCWWE9sJDYTewZ7GXsHO4qdx65T4Ch4KOQoDClcKEIoUimKKC5RdFGMUryn2KSkoxSiVKO0pPSmjKM8QVlD2U75hHKecpOKnkqESoPKjiqA6ghVCdUVqntUr6i+4nA4fpwqzhpHwh3GleCacQ9xM7gNagZqcWo9alfqKOo86ovU3dTPqb/i8XhhvDbeBR+Jz8PX43vxU/h1GgKNFI0JjTdNCk0ZzS2aUZpPtJS0QrQ6tG608bRFtNdpn9Au01HSCdPp0XnSJdOV0bXRTdJ9pyfQy9Jb0gfT59Jfon9Ev8CAZRBmMGDwZkhnqGboZZgjIAkCBD0CkZBGqCHcI8wzYhhFGE0YAxhzGBsZhxhXmBiYFJgcmGKZypg6maaZkczCzCbMQcwnmK8xTzD/ZOFi0WHxYcliucIyyrLGysGqzerDms3axDrO+pONl82ALZAtn62F7TU7il2c3Zo9hr2C/R77MgcjhzoHkSOb4xrHC04EpzinDWcCZzXnIOd3Lm4uI64wrjNcvVzL3Mzc2twB3IXcXdyLPAQeTR4STyHPHZ4PvEy8OrxBvCW8fbwrfJx8xnxRfOf5hvg2+UX47flT+Zv4XwtQCagI+AoUCvQIrAjyCB4QTBRsEHwhRCmkIuQvVCz0QGhNWETYUfiocIvwggiriIlIvEiDyCtRvKiWaLholehTMYyYilig2FmxYXGEuKK4v3iZ+BMJhISSBEnirMTIPvQ+1X0h+6r2TUpSS+pIRks2SM5IMUuZS6VKtUh9khaUdpHOl34gvS2jKBMkUyPzUpZB1lQ2VbZd9oucuBxRrkzuqTxe3lA+Rb5VflVBQsFHoULhmSJB8YDiUcUexV9KykpkpStKi8qCyh7K5cqTKowqViq5Kg9V0aq6qimqHaobakpqkWrX1D6rS6oHql9SX9gvst9nf83+OQ1+DU+N8xrTmryaHprnNKe1+LQ8taq0ZrUFtL21a7Xf64jpBOhc1vmkK6NL1r2pu6anppek162P1DfSz9YfMmAwsDcoNZgy5Df0M2wwXDFSNEow6jZGG5sZ5xtPmnCZEE3qTVZMlU2TTPvMqM1szUrNZs3Fzcnm7QcQB0wPnDrwykLIIsSixRJYmliesnxtJWIVbnXbGmNtZV1m/c5G1ibR5oEtwdbd9pLtDztduxN2L+1F7aPsexxoHVwd6h3WHPUdCxynnaSdkpwGnNmdSc6tLlgXB5dal+8HDQ6ePjjvquia6TpxSORQ7KFHbuxuQW6d7rTunu7XPdAejh6XPLY8LT2rPL97mXiVe60Q9YjFxCVvbe9C70UfDZ8Cn/e+Gr4Fvgt+Gn6n/Bb9tfyL/JdJeqRS0mqAcUBlwFqgZeDFwJ0gx6CmYIpgj+C2EIaQwJC+UO7Q2NCRMImwzLDpcLXw0+ErZDNybQQUcSiiNZIR/sgbjBKNyoiaidaMLotej3GIuR5LHxsSOxgnHpcV9z7eMP5CAiqBmNCTyJd4JHEmSSfpfDKU7JXckyKQkp4yf9jocN0RqiOBRx6nyqQWpH5Lc0xrT+dKP5w+l2GU0ZBJk0nOnDyqfrTyGOoY6dhQlnzWmaztbO/s/hyZnKKcrVxibv9x2eMlx3fyfPOGTiidqDiJORlyciJfK7+ugL4gvmDu1IFTtwp5C7MLv512P/2oSKGospiqOKp4usS8pPWM4JmTZ7ZK/UvHy3TLmso5y7PK1856nx2t0K64UslVmVP58xzp3LPzRudvVQlXFVVjqqOr39U41Dy4oHKhvpa9Nqf218WQi9N1NnV99cr19Zc4L51oQDRENSxedr083Kjf2HpF8sr5JuamnGbQHNX84arH1YlrZtd6rqtcv3JD6Eb5TcLN7FvQrbhbKy3+LdOtzq0jbaZtPe3q7TdvS92+2MHXUdbJ1Hmii6orvWvnTvyd791h3ct3/e7O9bj3vOx16n3aZ903dM/s3sP7hvd7H+g8uPNQ42HHI7VHbf0q/S0DSgO3BhUHbz5WfHxzSGno1hPlJ63DqsPtI/tHuka1Ru+O6Y/df2rydGDcYnxkwn7i2aTr5PQz72cLz4Oer76IfrH58vAr9Kvs13Svi6Y4p6reiL1pmlaa7pzRnxmctZ19OUecW3ob8XZrPv0d/l3Re5739QtyCx2LhovDHw5+mF8KW9pczvxI/7H8k+inG5+1Pw+uOK3Mr5JXd77kfmX7evGbwree71bfp34E/9hcy15nW6/bUNl48NPx5/vNmC3sVskvsV/t22bbr3aCd3bCPMmee98CSPiO8PUF4MtF+DvBGc4BhgGgovmdG+wxAEBCMAfGDpAUtIQ4i3RDCaE+oLsxJdgwChtKAyolnDS1FF6CRoXWjM6DPorhNKGNcYaZmkWHlczWyL7EKcYVwN3Ms86nz39SYFZIVvioyGsxRfGTEsuSBlLV0tuyrnLtCuyKsUrjKvKqeWrL+400zmn+1LbRuaC7oW9mUGq4YKxgkmDaZQ4d0LaIt2y2mrOht9Ww87bPcDjneN3pjnOvS/fBNtemQ7Vu5e4nPVI9w73ciObeyj78vnjfNb8Z/37StYDSwNQgUrBViGIoS+ha2Fh4AzklwjKSJ/JzVFd0XoxrrETsz7j++NIEUqJKEiZpLLkyJeiw7hHBVMY02nS6DPpMuqP4Y5RZqKyd7I2cL7lLx2fzXpwYPTmQ31PQdupKYfXpM0V5xWklCWfiSlPLSspvnh2umK1cPrdyfqVqpfpzzacLH2uXLi7Uva2fuTTXsNpIf0WvKbm55eqba+s3sDcJt3haxFsV27TaTW7bdnh1xnaV3LnbvdCD6iX0sd/jvS/+QPmh7iPdftH+zwPZg2yD5x9rPV4eanxCHlYdgUYej1aMhT81GGcb/zTRO1n8zP+50vOdF90v41/Jv1p+3TgV8Wb/NGZ6dKZ81ndOdm7z7f35wnc+79UWGBY+LHZ9yF1yXOZbXvx49VP8Z90V3Mr4auOXiq83vq398F17saH9s3Bz+pf8duHOzl78BaBmhDOSAfkQlYk2wzBhXmOvU+RSBlHZ4/Sp5fFiNEK0onTS9IoMhgQHxhCmdOZqlj7WJXZ6Dk1OElcp9yDPDp8Kf6TAFcEPwhIi/qJ1YksSkvvIkjelNmS0ZI/IPVDAKZor5SmPqBLUrNTz9vdrYrS0tKN16nRf6uMM1Ay9jLKMG0wGTBfNEQdYLEQs5a3UrNVs5G0F7Wjsvtu/cOh2rHHKdg5xsT2o7MrhunNo1q3PvdYj09PbS5vISVzzHvFp8M3wc/NXJtGRFgLuBBYHhQQbhLCHfAy9E5YX7kLmJy9GNEfGRKlF/YruikmJ1Y5DxT2MP55glUhIHE8qTj4I76wrh3uPVKampYWku2QYZSoc5TtGfWwtazZ7MOdW7rnjx/LIJw6dNM/XKlA8JVUoepq/iLOYpYT+DFUpqnSr7Fv50tnpisnKkXPD58er3lQv1azXIi/S1LHVC16Sadh/2bDR8opzk09z9NXca3XX+25M3VxtgVrp2vja5W8bdhzsDOvKvFPWXX+3saem92Rf5D27+3IP6B+sPnwK702VAxmDgY+th1Se8A3jhtdH5kYfj117WjyeNEGcNHum8JzrBfrF8sunr26/rp46/iZxOmwmcDZ4LvJt0nzmu/z3ZQsXFps/tC/1Lj/++PLT+orqas1X3e+4H9/WF36OblVtO/+JPyd0HCGKGEAGozhQA+hUjCZmHdtJcZTSmUoeR4NboH6Ev05TQXucLo0+niGaEMcYx5TEnMlygvUsWxN7H8czzk/ceB5BXl0+D/40gWrBe0KLIjSismL24gkSlfv6JBel6WWUZV3kEuQrFO4oTiltq3CoqqrZqJP2J2vka1ZrXdXu0Lmn2683qD9g8MDwjtF14yqTbNMQMzNzXvNvB+5bFFuSrFStsdYTNhdsI+y07antJx1qHMOc1J0xzsMupQd9XKVcfxzqcst0t/AgeEx6lsL7BA9x2vucj4cvj+8bv3P+HiQe0lTA2UDnIELQUHBWiEEoFHo7LDJcJPwZ+ViEcsT7yKIo/agv0ediLGI2Y+vjHOIR8U0JBxPRic1JB5PRyc0pbocZD48cKUr1SVNJp0mfz+jMLDwaeEwniyXrY/bdnMJc3+PKeVR50ydaTxbkkwtsTykWshVun35b1F/cVHLqTHSpc5laOTt8Wo5X3KwsO3f8fGZVenVGzdELR2szLibVBdc7XTJoUL+s0Wh2xbMpsbnk6o1rj6/P39i8Rd8i3Lq/zbrd73Zyx+nOS10ddx5099991HOv925f573W+9cfND68+Kiy/8xAwWDu48yhtCcZw/kjdaOPxlbHuSZMJqOfVT0ferHxSvC17dSJN9MzpDnWt9/foxeTl3tXT60L7sb/d41o90zAKAFQC9dBHA4DYA231FkDIFQIl0vaALDCA2CnChCBGQBBvwSgctF/zg8IoAAlXM9gg/NNaaABzMBBOBNPBgWgFtwGI2ARzhfZIQXIEgqEjkIXoF5oFoFACCAM4EwvB9GEeIr4CedzxshwZCmyD/kZXoNGqChUNWoMjUQrwBlZKXoIg8SoYsIwdZhZLCfWCVuIHaWgp7CmOEUxTslG6U5ZS/mJSoUqjWoYx40LwXVTM1IHUN/Fc+Bj8OM0SjRnaHZo/WhH6XTortOL09cyiDA0EdQJg4zujN+YjjOLMw+whLGysPayhbPzs09wHOc05sJw3efO5rHm5eT9yNfHXy2QIxgvFCzsLeIu6ibmIe4jEbwvTjJLqkK6XWZS9oPcJ/m3Ck8Ve5VuKV9RuaRar3ZJvXl/q0af5pjWvPaGLq2emL6hgZ9hjtFV45emWDM5c8cDZIs0yxNWFdYtNi/tKO01HWLg8+6Li8LBWNe7bnh3V496z2Uil7eWj6NvsN8x/2ukj4HKQVnBb0KVwk6Gf4LPt2vRTDGRsf3xLAluiXVJOyn+h2dSPdPeZDhnjh9zztrKWcjLyz9byF5kWhJWWlLeWjF0bqbqxwWai2L1Zg2xje3N3Neqbkq0VLTtdLh23b7L25t9b+Ohf//YY4UnOSNzTw9MDD33eLkxVTyjMvfmXfrC5hL/8vanmhXB1cqvbN+qfmiuvd8o2dTdmtom7+0fEFxzwAEC4AJiQBmuEDnCVZhEkA8ugi4wAT5DVHCNQBdyh5KhCqgLmoZjL4wwRYQhihBdiHdIOqQa0geZj7yD/IjiRB2AM/SrqLdoNrQFOgPdCWffMpggOO7vsEJYX2wddolCmiKKopMSQ2lFeZbyA5UaVQ7VG5wCLgf3llqL+iz1L7wH/h6NJE0xLZo2mnaJjkg3Te9F/4EhjkBLuMRoxLjAlMMsy/yCJZNVgfUdWxm7HQcdxyhnCZcXtzQP4BnnbeTL4vcTMBWUFeIQphDeFPkm+k1sSwK/T0BSU8pDOkumTfaDPKeClWKO0qAKvaqj2hn1MQ1IU1jLUNtX55huo964AcJQzsjX+KzJpBmzucOBIosxKxprI5sU23a7NQclx1inThf0QSvXykNf3E09ajx/Ea3hfeqDn7x/EmkgkCsoPPh+KFdYdPhYhEJkcdRWjHtsVzxrQkji/WSBlOzD66kBaa8zrDJ7jylnNebw55bmsZyozFcr+FjYWlRckloaXu5eYXpOoYqnhubCzsUv9e8anjU+bOq42nb97s0nLa/blm5vdFF18/ao9Tndj3tY1t8+ODz0cvjZ6ODTjonLz86+yH91dCplOm425m3su4SF2A+Hlpk/1n5mWSGtVn8Z/7r2neWH/JrVesTGmZ+Pt7C/rLdr/sQfA/CABX77ZYEuXF/yB0mgEK4hPQCzYAfigvZDh+DYn4fuw1+ZDAg1BBFxHNGKmEcSkDpw5aYaOYGihCtwUajLqHk0D/ogugQ9AVdcHDGlmCmsADYAex27TWFKUUKxAFdMjlPOwTEvpFrBWeKaqQnUcdSzeAt8J40MzQVaHtpyOm66Grhu0cfgTkDA8XZkwjLdZo5kkWFZYb3BlsRuwsHKsczZx3WOO4WHyGvOp8ovLsAnyCPEJywmoiRqIuYuHidRvK9dclaaQcZUNlOuVwGtaK3UqEJQTVFb3U/SWNAK0v6hm6nPadBu5G6CM+0wJ1mgLXOsgU2o7Wt7C4ce+ExqPajq2u1m4T7jGUuk9a72VfDrJpkFTAYRg1dDj4QzkZsiD0StxJyJM02AEluTiSnbR/LSWNOrMiWPdmbZZa/nXskLOSmeP3YqoPBrUVTx9zMxpVvlmRWMlbXn1avGaoJrqS7W1RtfWryce0Wh6e3V89eDbuq38Leh2hc7Rro6uxt7qvpK7xc+zO8/MXhiKGc4adTtqcz498lrz4Nfir16N3Vh2ndWfG51vuN9xqL+h9XlYx+/fDZZyV1t+fL66/K3je9zPx6tFazvX3+3kb6x8TPk59ym0+adLcYt0lbXL8ZfpF9d2xTbVtsl2292RHZCd1p24x/hKy+3e3oAiFoXLj9O7ex8FQYAWwDAr/ydnc2qnZ1f1XCy8QqA7qDf/3fYJWPg+vc59C56xDV3ePf57+s/NEanGZ4R8qcAAAAJcEhZcwAACxMAAAsTAQCanBgAAAFuaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CuU/DUEAAAsCSURBVHgB7Zx1qFTNG8cfu1+7uxtbDOwOTEzExlYs7PgJKuofdiJYKNiKqNhd2N3dit39/vwMzO7s3t179+zdfY1zHljPnKkzM88zT3xnrjH+/UnikG1XIKZtZ+5MXK2AIwA2FwRHABwBsPkK2Hz6jgZwBMDmK2Dz6TsawBEAm6+AzafvaABHAGy+AjafvqMBHAGw+QrYfPqOBnAEwOYrYPPpOxrAEQCbr4DNpx/b5vP/ZdPnHs6TJ08kfvz4EitWLDWOHz9+yKdPnyRBggTyzz//eIyN/CtXrsjLly8lceLEkj9/fkmUKJF8+PBBHj58KLly5fKoH+iLZQEYNWqUHD16VBImTKh+8eLFEybDAD9+/KgG1KpVK2nfvr3PMfTv318uX76s2jLRuHHjqva01b+uXbtKkyZNXO1Pnz4tq1evVpNPly6d9OjRQ1KmTOkqD3Wic+fO8urVK7XQ9P3+/Xv1a9OmjbRu3Tokn+vSpYucOnXKZ18pUqSQbdu2qbL79+8La3727NkIdbNlyyaPHj2Sz58/C/3xs0qWBWDr1q3y/fv3SL+zZcsWvwJw8ODBKNsfPnzYJQBPnz4VGGLS3r17ZceOHWZWyNIIMwLni86cORMyAWDX+qMXL16ootevX0uLFi0Ug8lImjSpNGzYUNKmTSs3btyQzZs3u8p27twZlABYcgLZoVExn4HqCZA2ac+ePZbb37lzx+xCpdmd4SI0mT+KEyeOvyLL+fPnz5eiRYtGaJcxY0ZZvHixyh83bpyLwWRkyZJF+vTpo4Ri2LBhcuDAASlWrJiq+/jxY/W0+k+s//2kQBuxACVLlpQcOXII9sqU4pgxY0qNGjWkXr160rNnT0mePHmEbjNkyCCYjIsXL8rXr189yrFrVatWlWrVqgkmIEmSJKqcBTl58qTHtzAPFSpU8Ggfqhfm2KBBA8UcTNWbN29cXefOnVuN0ZURjQTzQ9WjLU1ix9etW1dlzZgxQ96+fesqRhuuWbNG7t69q/JYz0aNGknZsmWlb9++Eju2ZYUullsUL15c+GELy5Qpo+w3o8mcObOMHz/eNVhfCex9x44dZfny5cqm6jqlSpWSOXPm6NcIz7lz5wrq8MGDB4IPwMKFk/gGv1SpUqnxhutb+EDehG+lifXypufPn8u6devUjzKEEhNZuHBh76oBvVsyAWaP2nPVeezsqOjcuXNSs2ZNDxPRsmXLSJmv+8T+FShQIOzM19/jifYJJ/m6kW/mVa5cOcrPX7t2TQYPHizDhw+Psq6vCkELgHdn5sC9y3hftGiRdOjQwcV8TMbo0aNl4MCBvqr/FnmYuV9JvXr1UiY3kDHgnO/bty+Qqh51LJsAj9YBvmCfcFg0JUuWTGbPni158uTRWX6fkyZNUv4EMS/hDnEwse+IESP8tjELMBtr165VIRdx97dv31TsTRiJRqlfv77ky5fPbGI5jdOG48u80IQIN87yu3fvBLvdvXt3ZU4sd/yzAebvyJEjsnDhQuU74Yj7I/yJihUr+iv2mR9WAbh586b07t1bAR766yw22iAQh+XEiROycuVK3dTjWb58ealSpYpHnvnCwqNhjh07Zma70ggGsTX+CH1NmzbNVWY1gUcfWfSQPn36CKEs3/ClYRAek1Dx+Fr8oPPnzyvHkRDQdFApCyRCo55Jnl8zS6KZhnHYd3adptq1a8vSpUsDYj5tYJI/8rV4ui47Hk/eZD4+S86cOZVKRQhNBwxsAjsaLOGNezPO7MufcODYehO+jqZZs2YJoBpz0aFvoUKFlNnctWuXK1LS9UuXLq2TAT/DogGGDh0q27dv9xgEmqBdu3YeeVG9EFaChAHMEAoGQhs2bIgQjTRt2lQtmnccP3bsWFm/fr3qFiAFExOIM+s9junTp0vbtm1d/o0uJ1wmbNZAFqgdaB0RFIwF0PImExvQoTThdp06daRx48YKCCIfk/rlyxdXc/KYp1UKmQCg0m/fvi0DBgwQE7xhYAAawUgnuxTYF2KHwqTICMjWOxQdNGiQNG/e3GezWrVquQSACrdu3bLsD7ATJ0+e7MF8wJkhQ4YojWN++OrVqwq6pT72+sKFC2axFClSRIE9OhM8gLoQuAla1ZdJzJQpk/IVdDsrz5AJAPYeEMPbDqF2g2G+9yRKlCgRpQDAfJw8TWgQf8ynTpo0aXRVdSBjxRm8d++egKEBD2sCzCKqwbH0RZUqVVJIHkw0mc/BD2X4LCbhVHbr1k2BYOxuDoOOHz8uYAEQWAXtANCCpZAJAOpTE6pWI30MGC/ZqvrXfVl5AjVrQiONHDlSv/p8Zs2aVeHqqVOnVkiaz0pGpsY+0GiAMSaBYE6cONHM8pnGVPCDiBIwOd6myWyozQd5BQsWdJ2RmHWikw6ZAOhBIP2oPxA/VB40c+ZMpQU4wgwX4R2bQsi3TFTN33c3bdrkryhC/qFDh9RuM71vmEeoGgw0jcb41RSyKABJHjNmjFKLnHETVulQD5AILCCcxOmYSXjLoSZifZP59I/J8+XNh/rb4eovZALAWQAHQZpQq6b6wm7169dPF4f8iQNoUjjvC5j3HQhHEXw00J9IIROAGDFiRJg/AsClBU379+8XwrRwkLe6jwwxC/b7ADqrVq1SkQ4wrUbd0HCEuaYJCvYb/3W7kAmAv4HjMJmEo6RBDTM/umnOyk0ipAs1cQqaPXt2V7eEaPrAiGNb7dy5KvwBibALQN68eQUEUBO7pFOnTvo1ZE+Yo710OvV33So6H/SFPgID62Nb/JDoIIrRGVuwbUMmAL5MgB4UiJu+4EEeQBHxbajJdPw4NFqxYkWoPxGhP7AE8ABNgFX6Ro/O+52fQQsAgIt5BByV/fM+9gUf4HjYvPFiZaF8CRw3kUyaOnVqQJoAUIcrVt7kje+b8zXrcsfBBJwIe3UIbNb7HdOWroQxATB5LmRyTAm2rQlGgttzCgf8632tmaNf0C8WWxN1ly1bJqCILDY/BAsIWDMYvPvSpUuyYMECefbsmW6qjoXB2vH2dV2cNNSwtv+o7I0bNyqfg2vT3nE3l0+nTJmi4njaAQzp69XXr19XR7Cgb5oI93Q/hLomYeo4V9D4/O7du13+AeFwMGcMZv/hSsf4KdUB/0eRnMNrzzeyAcEULij4InYKDI+MEAQWkDsAwMi+bK9uDxADI03iTiFHyd6EUCIExO6EpSZsTF2QQ27dNmvWzCVE3n3od66wcZUNwtxwYsepn7/lnDBhglSvXl03/22elkwAoZYGdyKbARi2PwIHL1eunL9ilQ/Dcax4RsZ8KmvI2exw3rx5Cno2nULKAXE4WdMXQ8w23C2A+ZC/41uzvt7p5KENCDv9MZ86gfRJvf+aLEPBHEsCibKTUGt6kdlN+AEAMtSJjDg+5Qx+yZIlSr2jWUzCpmp8nMuO7DD9FzTaLrOL+R535H0RcTk+BqaDMwLuFpgHVZgNwCqOXwF2zEuVCAOYhflNmIswwnjmyk1cTZgsHFDMIIKrN4muT5tgoGLdfziflkxAuAbCzsS+wiBOuLzta6i+i8/CTkV4Yb72HULV/5/Yz28hAH/iwv0tY8YEBOwE/i2TdubhXgEEICKI7y53Un/5CliKAv7ytbDl9BwBsCXb3ZN2BMC9FrZMOQJgS7a7J+0IgHstbJlyBMCWbHdP2hEA91rYMuUIgC3Z7p60IwDutbBlyhEAW7LdPWlHANxrYcuUIwC2ZLt70o4AuNfClilHAGzJdvekHQFwr4UtU44A2JLt7kn/H7HUl9GoOKVWAAAAAElFTkSuQmCC";
                textureDestination.setTemporaryTexture();
                var img = document.createElement("img");
                var resourceTracker = engine.project.createResourceTracker();
                img.onload = function(){
                    textureDestination.generateMipmaps = true;
                    textureDestination.internalFormat = 6407;
                    textureDestination.magFilter = 9729;
                    textureDestination.minFilter = 9987;
                    textureDestination.setImage(img,"kickjs://texture/logo/");
                    resourceTracker.resourceReady();
                };
                img.onerror = function(){
                    resourceTracker.resourceFailed();
                };
                img.src = logoResource;
                return;
            } else {
                KICK.core.Util.fail("Unknown uri "+uri);
                return null;
            }
            textureDestination.setImageData( 2, 2, 0, 5121,data, uri);
        };
    };
})();