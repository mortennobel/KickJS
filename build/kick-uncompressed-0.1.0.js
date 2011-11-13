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
        _ASSERT: { value: true,enumerable:true},
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
        _DEBUG: { value: true,enumerable:true},
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
         * @property LIGHT_TYPE_DIRECTIONAL
         * @type Number
         * @final
         */
        _LIGHT_TYPE_DIRECTIONAL:{value: 2,enumerable:true},
        /**
         * Used to define point light in the scene
         * @property TYPE_POINT
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
}());

// Node.js export (used for preprocessor)
this["exports"] = this["exports"] || {};
exports.Constants = KICK.core.Constants;/*!
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
* @property error_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property error_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property light.glsl
* @type String
*/
/**
* GLSL file content
* @property phong_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property phong_vs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_fs.glsl
* @type String
*/
/**
* GLSL file content
* @property unlit_vs.glsl
* @type String
*/
{"error_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvoid main(void)\n{\n    gl_FragColor = vec4(1.0,0.5, 0.9, 1.0);\n}","error_vs.glsl":"attribute vec3 vertex;\nuniform mat4 _mvProj;\nvoid main(void) {\n  gl_Position = _mvProj * vec4(vertex, 1.0);\n}  ","light.glsl":"struct DirectionalLight {\n   vec3 lDir;\n   vec3 colInt;\n   vec3 halfV;\n};\n// assumes that normal is normalized\nvoid getDirectionalLight(vec3 normal, DirectionalLight dLight, float specularExponent, out vec3 diffuse, out float specular){\n    float diffuseContribution = max(dot(normal, dLight.lDir), 0.0);\n\tfloat specularContribution = max(dot(normal, dLight.halfV), 0.0);\n    specular =  pow(specularContribution, specularExponent);\n\tdiffuse = (dLight.colInt * diffuseContribution);\n}\nuniform DirectionalLight _dLight;\nuniform vec3 _ambient;","phong_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nuniform vec3 mainColor;\nuniform float specularExponent;\nuniform vec3 specularColor;\nuniform sampler2D mainTexture;\n\n#pragma include \"light.glsl\"\n\nvoid main(void)\n{\n    vec3 diffuse;\n    float specular;\n    getDirectionalLight(vNormal, _dLight, specularExponent, diffuse, specular);\n    vec3 color = max(diffuse,_ambient.xyz)*mainColor;\n    \n    gl_FragColor = texture2D(mainTexture,vUv)*vec4(color, 1.0)+vec4(specular*specularColor,0.0);\n}\n ","phong_vs.glsl":"attribute vec3 vertex;\nattribute vec3 normal;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\nuniform mat3 _norm;\n\nvarying vec2 vUv;\n\nvoid main(void) {\n    gl_Position = _mvProj * vec4(vertex, 1.0);\n    vUv = uv1;\n    vNormal= normalize(_norm * normal);\n} ","unlit_fs.glsl":"#ifdef GL_ES\nprecision highp float;\n#endif\nvarying vec2 vUv;\n\nuniform vec3 mainColor;\nuniform sampler2D mainTexture;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(mainTexture,vUv)*vec4(mainColor,1.0);\n}\n ","unlit_vs.glsl":"attribute vec3 vertex;\nattribute vec2 uv1;\n\nuniform mat4 _mvProj;\n\nvarying vec2 vUv;\n\nvoid main(void) {\n    gl_Position = _mvProj * vec4(vertex, 1.0);\n    vUv = uv1;\n}"};
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
     * @class vec2
     * @namespace KICK.math
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
            x = 0.00001;
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
     * Calculates the length of a vec4
     * @method length
     * @param {KICK.math.vec4} vec vec4 to calculate length of
     * @return {Number} Length of vec
     */
    vec4.length = function(vec){
        var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
        return Math.sqrt(x*x + y*y + z*z + w*w);
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
     * Transforms a vec3 with the given matrix<br>
     * 4th vector component is implicitly '0'
     * @method multiplyVec3Vector
     * @param {KICK.math.mat4} mat mat4 to transform the vector with
     * @param {KICK.math.vec3} vec vec3 to transform
     * @param {KICK.math.vec3} dest Optional, vec3 receiving operation result. If not specified result is written to vec
     * @return {KICK.math.vec3} dest if specified, vec otherwise
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
        var degreeToRadian = 0.01745329251994;
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
    quat4.create = vec4.create;

    /**
     * Copies the values of one quat4 to another
     * @method set
     * @param {KICK.math.quat4} quat quat4 containing values to copy
     * @param {KICK.math.quat4} dest quat4 receiving copied values
     * @return {KICK.math.quat4} dest
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
    quat4.length = vec4.length;

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
            radianToDegree = 57.2957795130824;

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
        var degreeToRadian = 0.01745329251994,
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

    var core = KICK.namespace("KICK.core"),
        constants = core.Constants,
        scene = KICK.namespace("KICK.scene"),
        ASSERT = true;

    /**
     * Responsible for creating or loading a resource using a given url
     * @class ResourceProvider
     * @namespace KICK.core
     * @constructor
     * @param {String} protocol
     */
        /**
         * Protocol of the resource, such as http, kickjs<br>
         * The protocol must uniquely identify a resource provider
         * @property protocol
         * @type String
         */

        /**
         * @method getMesh
         * @param {String} url
         * @return {KICK.mesh.Mesh}
         */
        /**
         * @method getShader
         * @param {String} url
         * @return {KICK.material.Shader}
         */
        /**
         * @method getTexture
         * @param {String} url
         * @return {KICK.texture.Texture}
         */
        /**
         * @method getScene
         * @param {String} url
         * @return {KICK.scene.Scene}
         */


    /**
     * Responsible for allocation and deallocation of resources.
     * @class ResourceManager
     * @namespace KICK.core
     * @constructor
     */
    core.ResourceManager = function (engine) {
        var resourceProviders = [new core.DefaultResourceProvider(engine)],
            buildCache = function(){
                return {
                    ref: {},
                    refCount: {}
                }
            },
            meshCache = buildCache(),
            shaderCache = buildCache(),
            textureCache = buildCache(),
            sceneCache = buildCache(),
            allCaches = [meshCache,shaderCache,textureCache,sceneCache],
            getFromCache = function(cache, url){
                var res = cache.ref[url];
                if (res){
                    cache.refCount[url]++;
                }
                return res;
            },
            addToCache = function(cache, url, resource){
                cache.ref[url] = resource;
                cache.refCount[url] = 1;
            },
            /**
             * @method buildGetFunc
             * @param {Object} cache
             * @param {String} methodName
             * @return {Function} getter function with the signature function(url)
             * @private
             */
            buildGetFunc = function(cache,methodName){
                return function(url){
                    var res = getFromCache(cache,url),
                        i;
                    if (res){
                        return res;
                    }
                    for (i=resourceProviders.length-1;i>=0;i--){
                        res = resourceProviders[i][methodName](url);
                    }
                    if (res){
                        addToCache(cache,url,res);
                    }
                    return res;
                };
            };

        /**
         * @method getMesh
         * @param {String} url
         * @return {KICK.mesh.Mesh}
         */
        this.getMesh = buildGetFunc(meshCache,"getMesh");
        /**
         * @method getShader
         * @param {String} url
         * @return {KICK.material.Shader}
         */
        this.getShader = buildGetFunc(shaderCache,"getShader");
        /**
         * @method getTexture
         * @param {String} url
         * @return {KICK.texture.Texture}
         */
        this.getTexture = buildGetFunc(textureCache,"getTexture");
        /**
         * @method getScene
         * @param {String} url
         * @return {KICK.scene.Scene}
         */
        this.getScene = buildGetFunc(sceneCache,"getScene");

        /**
         * Release a reference to the resource.
         * If reference count is 0, then the reference is deleted and the destroy method on the
         * resource object are invoked.
         * @method release
         * @param {String} url
         */
        this.release = function(url){
            for (var i=allCaches.length-1;i>=0;i--){
                if (allCaches[i].refCount[url]){
                    allCaches[i].refCount[url]--;
                    if (allCaches[i].refCount[url]<=0){
                        if (allCaches[i].ref[url].destroy){
                            allCaches[i].ref[url].destroy();
                        }
                        delete allCaches[i].refCount[url];
                        delete allCaches[i].ref[url];
                    }
                }
            }
        };
    };


    /**
     * Game engine object
     * @class Engine
     * @namespace KICK.core
     * @constructor
     * @param {String} id elementid of canvas tag
     * @param {KICK.core.Config} config Optional, configuration object
     */
    core.Engine = function (id, config) {
        var gl = null,
            canvas = document.getElementById(id),
            webGlContextNames = ["experimental-webgl","webgl"],
            thisObj = this,
            lastTime = new Date().getTime()-16, // ensures valid delta time in next frame
            deltaTime = 0,
            timeObj = new core.Time(),
            timeSinceStart = 0,
            frameCount = 0,
            contextListeners = [],
            frameListeners = [],
            keyInput = null,
            activeScene = new scene.Scene(this),
            animationFrameObj = {},
            wrapperFunctionToMethodOnObject = function (time_) {
                thisObj._gameLoop(time_);
            },
            uniqIdCounter = 1,
            vec2 = KICK.math.vec2;

        Object.defineProperties(this,{
            /**
             * Resource manager of the engine. Loads and cache resources.
             * @property resourceManager
             * @type KICK.core.ResourceManager
             */
            resourceManager:{
                value: new core.ResourceManager(this)
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
             * @property activeScene
             * @type KICK.scene.Scene
             */
            activeScene:{
                get: function(){ return activeScene},
                set: function(value){activeScene = value;}
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
                            lastTime = new Date().getTime()-16, // ensures valid delta time in next frame
                            animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject,this.canvas);
                        }
                    }
                }
            }
        });

        /**
         * @method _gameLoop
         * @param {Number} time current time in milliseconds
         * @private
         */
        this._gameLoop = function (time) {
            this.activeScene.updateAndRender();
            for (var i=frameListeners.length-1;i>=0;i--){
                frameListeners[i].frameUpdated();
            }
            deltaTime = time-lastTime;
            lastTime = time;
            timeSinceStart += deltaTime;
            frameCount += 1;
            if (animationFrameObj !== null){
                animationFrameObj = requestAnimationFrame(wrapperFunctionToMethodOnObject,this.canvas);
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

        this.removeContextListener = function(contextLostListener){
            return core.Util.removeElementFromArray(contextListeners,contextLostListener);
        };


        /**
         * Creates a uniq id
         * @method createUID
         * @return {Number} uniq id
         */
        this.createUID = function(){
            return uniqIdCounter++;
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
                        throw {
                            name: "Error",
                            message: "Cannot create gl-context"
                        };
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
                };
            initGL();

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
                frameCount:{
                    get: function(){return frameCount;}
                },
                avarageFramesPerSecond:{
                    get: function(){
                        return frameCount/(timeSinceStart*0.001);
                    }
                }
            });
            Object.freeze(timeObj);

            timeSinceStart = 0;
            frameCount = 0;

            thisObj._gameLoop(lastTime);
        }());
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
         * Maximum number of lights in scene. Default value is 1
         * @property maxNumerOfLights
         * @type Number
         */
        this.maxNumerOfLights = config.maxNumerOfLights ? config.maxNumerOfLights : 1;

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
         * @property enableDebugContext
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
        this.alpha = typeof config.alpha === 'boolean' ? config.alpha : true;

        /**
         * WebGL spec: Default: true. If the value is true, the drawing buffer has a depth buffer of at least 16 bits.
         * If the value is false, no depth buffer is available.
         * @property alpha
         * @type Boolean
         */
        this.depth = typeof config.depth === 'boolean' ? config.depth : true;

        /**
         * WebGL spec: Default: false. If the value is true, the drawing buffer has a stencil buffer of at least 8 bits.
         * If the value is false, no stencil buffer is available.
         * @property stencil
         * @type Boolean
         */
        this.stencil = typeof config.stencil === 'boolean' ? config.stencil : false;

        /**
         * WebGL spec: Default: true. If the value is true and the implementation supports antialiasing the drawing
         * buffer will perform antialiasing using its choice of technique (multisample/supersample) and quality.
         * If the value is false or the implementation does not support antialiasing, no antialiasing is performed.
         * @property antialias
         * @type Boolean
         */
        this.antialias = typeof config.antialias === 'boolean' ? config.antialias : true;

        /**
         * WebGL spec: Default: true. If the value is true the page compositor will assume the drawing buffer contains
         * colors with premultiplied alpha. If the value is false the page compositor will assume that colors in the
         * drawing buffer are not premultiplied. This flag is ignored if the alpha flag is false.
         * See Premultiplied Alpha for more information on the effects of the premultipliedAlpha flag.
         * @property premultipliedAlpha
         * @type Boolean
         */
        this.premultipliedAlpha = typeof config.premultipliedAlpha === 'boolean' ? config.premultipliedAlpha : true;

        /**
         * Polling of canvas resize. Default is 0 (meaning not polling)
         * @property checkCanvasResizeInterval
         * @type Number
         */
        this.checkCanvasResizeInterval = config.checkCanvasResizeInterval || 0;
    };

    /**
     * A global timer object
     * @class Time
     * @namespace KICK.core
     */
    core.Time = function(){
        /**
         * Time since start in millis
         * @property time
         * @type Number
         */
        /**
         * Millis between this frame and last frame
         * @property deltaTime
         * @type Number
         */
        /**
         * Number of frames since start
         * @property frameCount
         * @type Number
         */
        /**
         * fps since start
         * @property avarageFramesPerSecond
         * @type Number
         */
    };

    /**
     * Key Input manager.<br>
     * This class encapsulate keyboard input and makes it easy to
     * test for key input.<br>
     * Example code:
     * <pre class="brush: js">
     * function KeyTestComponent(engine){
     * &nbsp;var keyInput;
     * &nbsp;// registers listener (invoked when component is registered)
     * &nbsp;this.activated = function (){
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
         * Reads a parameter from a url string.
         * @method getParameter
         * @param {String} url
         * @param {String} parameterName
         * @return {String} parameter value or null if not found.
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
         * Invokes debugger and throws an error
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
         * @method insertSorted
         * @param {Object} element
         * @param {Array} sortedArray
         * @param {Function} sortFunc has the signature foo(obj1,obj2) returns Number. Optional (uses numberSort as default)
         */
        insertSorted : function (element,sortedArray,sortFunc) {
            var i;
            if (!sortFunc) {
                sortFunc = this.numberSortFunction;
            }
            // assuming that the array is relative small, todo: add support for larger array using binary search
            for (i = sortedArray.length-1; i >= 0; i--) {
                if (sortFunc(sortedArray[i],element) < 0) {
                    sortedArray.splice(i+1,0,element);
                    return;
                }
            }
            sortedArray.unshift( element );
        },
        /**
         * Returns a-b
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
                    return window.setTimeout(callback, fps60);
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
        DEBUG = true,
        ASSERT = true,
        fail = KICK.core.Util.fail;

    /**
     * Mesh data class.
     * Allows for modifying mesh object easily.
     * This is a pure data class with no WebGL dependency
     * @class MeshData
     * @namespace KICK.mesh
     * @parameter {Object} config
     * @constructor
     */
    mesh.MeshData = function(config){
        var data = {},
            thisObj = this,
            _indices,
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
                                newValue = new typedArrayType(newValue);
                            }
                            data[name] = newValue;
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

        Object.defineProperties(this,{
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
             * @property description
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
             * Vertex (vec3)
             * @property vertex
             * @type Array[Number]
             */
            vertex:createGetterSetter(5126, "vertex"),
            /**
             * Normal (vec3)
             * @property normal
             * @type Array[Number]
             */
            normal:createGetterSetter(5126, "normal"),
            /**
             * UV1 (vec2)
             * @property uv1
             * @type Array[Number]
             */
            uv1:createGetterSetter(5126, "uv1"),
            /**
             * UV2 (vec2)
             * @property uv2
             * @type Array[Number]
             */
            uv2:createGetterSetter(5126, "uv2"),
            /**
             * Tangent (vec4)
             * @property tangent
             * @type Array[Number]
             */
            tangent:createGetterSetter(5126, "tangent"),
            /**
             * Color (vec4)
             * @property color
             * @type Array[Number]
             */
            color:createGetterSetter(5126, "color"),
            /**
             * Integer attribute (two Int32)
             * @property int1
             * @type Array[Number]
             */
            int1:createGetterSetter(5124, "int1"),
            /**
             * Integer attribute (two Int32)
             * @property int2
             * @type Array[Number]
             */
            int2:createGetterSetter(5124, "int2"),
            /**
             * Integer attribute (two Int32)
             * @property int3
             * @type Array[Number]
             */
            int3:createGetterSetter(5124, "int3"),
            /**
             * Integer attribute (two Int32)
             * @property int4
             * @type Array[Number]
             */
            int4:createGetterSetter(5124, "int4"),
            /**
             * indices (integer)
             * @property indices
             * @type Array[Number]
             */
            indices:{
                get:function(){
                    return _indices;
                },
                set:function(newValue){
                    if (newValue && !(newValue instanceof Uint16Array)){
                        newValue = new Uint16Array(newValue);
                    }
                    if (_indices && isVertexDataInitialized()){
                        clearInterleavedData();
                    }
                    _indices = newValue;
                }
            },
            /**
             * Must be 4,6, or 5
             * @property meshType
             * @type Number
             */
            meshType:{
                get:function(){
                    return _meshType;
                },
                set:function(newValue){
                    if (ASSERT){
                        if (newValue != 4 &&
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
            for (var i=_indices.length-1;i>=0;i--){
                if (_indices[i]<0 || _indices[i] >= vertexCount){
                    debugger;
                    return false;
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
     * Recalculates the tangents.<br>
     * Algorithm is based on<br>
     *   Lengyel, Eric. “Computing Tangent Space Basis Vectors for an Arbitrary Mesh”.<br>
     *   Terathon Software 3D Graphics Library, 2001.<br>
     *   http://www.terathon.com/code/tangent.html
     * @method recalculateTangents
     */
    mesh.MeshData.prototype.recalculateTangents = function(){
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

    /**
     * A Mesh object allows you to bind and render a MeshData object
     * @class Mesh
     * @namespace KICK.mesh
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @param {MeshData} data
     */
    mesh.Mesh = function (engine,config,meshData) {
        var gl = engine.gl,
            meshVertexAttBuffer,
            interleavedArrayFormat,
            meshVertexIndexBuffer,
            _name,
            _meshData,
            c = KICK.core.Constants,
            vertexAttrLength,
            meshType,
            meshElements,
            contextListener = {
                contextLost: function(){},
                contextRestored: function(newGl){
                    meshVertexIndexBuffer = null;
                    meshVertexAttBuffer = null;
                    gl = newGl;
                    updateData();
                }
            },
            deleteBuffers = function(){
                if (typeof meshVertexIndexBuffer === "number"){
                    gl.deleteBuffer(meshVertexIndexBuffer);
                }
                if (typeof meshVertexAttBuffer === "number"){
                    gl.deleteBuffer(meshVertexAttBuffer);
                }
            },
            /**
             * Copy data to the vertex buffer object (VBO)
             * @method updateData
             * @private
             */
            updateData = function () {
                var indices = _meshData.indices;
                // delete current buffers
                deleteBuffers();

                interleavedArrayFormat = _meshData.interleavedArrayFormat;
                vertexAttrLength = _meshData.vertexAttrLength;
                meshType = _meshData.meshType;
                meshElements = indices.length;


                meshVertexAttBuffer = gl.createBuffer();
                gl.bindBuffer(34962, meshVertexAttBuffer);
                gl.bufferData(34962, _meshData.interleavedArray, 35044);

                meshVertexIndexBuffer = gl.createBuffer();
                gl.bindBuffer(34963, meshVertexIndexBuffer);
                gl.bufferData(34963, indices, 35044);
            };

        engine.addContextListener(contextListener);

        if (ASSERT){
            if (!(meshData instanceof mesh.MeshData)){
                fail("meshData constructor parameter must be defined");
            }
        }

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
                    _meshData = newValue;
                    updateData();
                }
            }
        });


        if (!config) {
            config = {};
        }

        this.name = config.name;
        this.meshData = meshData;
        
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
                    if (!(interleavedArrayFormat[activeAttribute.name])){
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
            gl.bindBuffer(34963, meshVertexIndexBuffer);
        };

        /**
         * Renders the current mesh
         * @method render
         */
        this.render = function () {
            gl.drawElements(meshType, meshElements, 5123, 0);
        };

        /**
         * Destroys the mesh data and deletes the associated resources
         * After this the mesh cannot be bound
         * @method destroy
         */
        this.destroy = function(){
            deleteBuffers();
            engine.removeContextListener(contextListener);
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
        core = KICK.namespace("KICK.core"),
        math = KICK.namespace("KICK.math"),
        vec3 = KICK.namespace("KICK.math.vec3"),
        quat4 = KICK.namespace("KICK.math.quat4"),
        vec4 = KICK.namespace("KICK.math.vec4"),
        mat4 = KICK.namespace("KICK.math.mat4"),
        constants = KICK.core.Constants,
        DEBUG = true,
        ASSERT = true;

    /**
     * Game objects. (Always attached to a given scene)
     * @class GameObject
     * @namespace KICK.scene
     * @constructor
     * @param scene {KICK.scene.Scene}
     */
    scene.GameObject = function (scene) {
        var _components = [],
            _layer = 1;
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
                    value:new KICK.scene.Transform(this)
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
                 * Number of components (excluding transform)
                 * @property numberOfComponents
                 * @type Number
                 */
                numberOfComponents:{
                    get:function(){
                        return _components.length;
                    }
                }
            }
        );

        /**
         * Get component by index (note the Transform component will not be returned this way).
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
            this.scene.addComponent(component);
        };

        /**
         * Remove the component from a gameObject and clear the gameObject field on the component
         * @method removeComponent
         * @param {KICK.scene.Component} component
         */
        this.removeComponent =  function (component) {
            delete component.gameObject;
            core.Util.removeElementFromArray(_components,component);
            this.scene.removeComponent(component);
        };

        /**
         * Destroys game object after next frame.
         * Removes all components instantly.
         * @method destroy
         */
        this.destroy = function () {
            var i;
            for (i=0; i < _components.length; i++) {
                this.removeComponent(_components[i]);
            }
            this.scene.destroyObject(this);
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
            if (type === scene.Transform){
                return this.transform;
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
            if (type === scene.Transform){
                res.push(this.transform);
            }
            return res;
        };
    };

    /**
     * This class only specifies the interface of a component.
     * @namespace KICK.scene
     * @class Component
     */
//scene.Component = function () {
    /**
     * The gameObject owning the component. Initially undefined. The value is set when the Component object is added
     * to a GameObject
     * @property gameObject
     * @type KICK.scene.GameObject
     */

    /**
     * Abstract method called when a component is added to scene. May be undefined.
     * @method activated
     */

    /**
     * Abstract method called when a component is removed from scene. May be undefined.
     * @method deactivated
     */


    /**
     * Abstract method called every rendering. May be undefined.
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
     * Abstract method called every update. May be undefined.
     * @method update
     */

    /**
     * Abstract method called every update as the last thing. Useful for camera scripts. May be undefined.
     * @method lateUpdate
     */
//};

    /**
     * Position, rotation and scale of a game object. This component should not be created manually.
     * It is created when a GameObject is created.
     * @namespace KICK.scene
     * @class Transform
     * @extends KICK.scene.Component
     * @constructor
     * @param {KICK.scene.GameObject} gameObject
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
                    if (parentTransform==null){
                        return vec3.create(localPosition);
                    }
                    if (dirty[GLOBAL_POSITION]){
                        mat4.multiplyVec3(this.getGlobalMatrix(),[0,0,0],globalPosition);
                        dirty[GLOBAL_POSITION] = 0;
                    }
                    return vec3.create(globalPosition);
                },
                set:function(newValue){
                    var currentPosition;
                    if (parentTransform==null){
                        this.localPosition = newValue;
                        return;
                    }
                    currentPosition = this.position;
                    vec3.set(newValue,localPosition);
                    this.localPosition = [
                        localPosition[0]+currentPosition[0]-newValue[0],
                        localPosition[1]+currentPosition[1]-newValue[1],
                        localPosition[2]+currentPosition[2]-newValue[2]
                    ];
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
                    quat4.toEuler(this.rotation,vec);
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
                    if (parentTransform==null){
                        return quat4.create(localRotationQuat);
                    }
                    if (dirty[GLOBAL_ROTATION]){
                        quat4.set(localRotationQuat,globalRotationQuat);
                        parentIterator = this.parent;
                        while (parentIterator != null){
                            quat4.multiply(parentIterator.localRotation,globalRotationQuat,globalRotationQuat);
                            parentIterator = parentIterator.parent;
                        }
                        dirty[GLOBAL_ROTATION] = false;
                    }
                    return globalRotationQuat;
                },
                set: function(newValue){
                    if (parentTransform==null){
                        this.localRotation = newValue;
                        return;
                    }
                    var rotationDifference = quat4.create();
                    quat4.difference(newValue,this.rotation,rotationDifference);
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
             * Local scale
             * @property localScale
             * @type KICK.math.vec3
             */
            localScale: {
                get: function(){
                    return vec3.create(localScale);
                },
                set: function(newValue){
                    vec3.set(newValue,localScale);
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
    };

    /**
     * A scene objects contains a list of GameObjects
     * @class Scene
     * @namespace KICK.scene
     * @constructor
     * @param engine {KICK.core.Engine}
     */
    scene.Scene = function (engine) {
        var gameObjects = [],
            gameObjectsNew = [],
            gameObjectsDelete = [],
            updateableComponents= [],
            lateUpdateableComponents = [],
            componentsNew = [],
            componentsDelete = [],
            componentListenes = [],
            componentsAll = [],
            cameras = [],
            renderableComponents = [],
            sceneLightObj = new KICK.scene.SceneLights(),
            gl,
            i,
            addLight = function(light){
                if (light.type == 1){
                    sceneLightObj.ambientLight = light;
                } else if (light.type === 2){
                    sceneLightObj.directionalLight = light;
                } else {
                    sceneLightObj.otherLights.push(light);
                }
            },
            removeLight = function(light){
                if (light.type == 1){
                    sceneLightObj.ambientLight = null;
                } else if (light.type === 2){
                    sceneLightObj.directionalLight = null;
                } else {
                    core.Util.removeElementFromArray(sceneLightObj.otherLights,light);
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
             * Handle insertions and removal of gameobjects and components. This is done in a separate step to avoid problems
             * with missed updates (or multiple updates) due to modifying the array while iterating it.
             * @method cleanupGameObjects
             * @private
             */
            cleanupGameObjects = function () {
                var i,
                    component;
                if (gameObjectsNew.length > 0) {
                    gameObjects = gameObjects.concat(gameObjectsNew);
                    gameObjectsNew.length = 0;
                }
                if (gameObjectsDelete.length > 0) {
                    core.Util.removeElementsFromArray(gameObjects,gameObjectsDelete);
                    gameObjectsDelete.length = 0;
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
                        if (typeof(component.lateUpdate) === "function") {
                            core.Util.insertSorted(component,lateUpdateableComponents,sortByScriptPriority);
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
                        if (typeof(component.lateUpdate) === "function") {
                            core.Util.removeElementFromArray(lateUpdateableComponents,component);
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
                var i;
                for (i=updateableComponents.length-1; i >= 0; i--) {
                    updateableComponents[i].update();
                }
                for (i=lateUpdateableComponents.length-1; i >= 0; i--) {
                    lateUpdateableComponents[i].lateUpdate();
                }
                cleanupGameObjects();
            },
            renderComponents = function(){
                var i;
                for (i=cameras.length-1; i >= 0; i--) {
                    cameras[i].renderScene(sceneLightObj);
                }
                engine.gl.flush();
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
            componentListenes.push(componentListener);
            // add current components to component listener
            componentListener.componentsAdded(componentsAll);
        };

        /**
         * Search the scene for components of the specified type in the scene. Note that this
         * method is slow - do not run in the the update function.
         * @method findComponentsOfType
         * @param {Type} componentType
         * @return {Array[KICK.scene.Component]} components
         */
        this.findComponentsOfType = function(componentType){
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
        }

        /**
         * Should only be called by GameObject when a component is added. If the component is updateable (implements
         * update or lateUpdate) the components is added to the current list of updateable components after the update loop
         * (so it will not recieve any update invocations in the current frame).
         * If the component is renderable (implements), is it added to the renderer's components
         * @method addComponent
         * @param {KICK.scene.Component} component
         * @protected
         */
        this.addComponent = function (component) {
            core.Util.insertSorted(component,componentsNew,sortByScriptPriority);
        };

        /**
         * @method removeComponent
         * @param {KICK.scene} component
         */
        this.removeComponent = function (component) {
            core.Util.removeElementFromArray(componentsNew,component);
            componentsDelete.push(component);
        };

        /**
         * Reference to the engine
         * @property engine
         * @type KICK.core.Engine
         */
        Object.defineProperty(this,"engine",{
            value:engine
        });

        /**
         * @method loadScene
         * @param {String} jsonStr
         */
        this.loadScene = function (jsonStr) {
            throw Error("Not implemented");
        };

        /**
         * @method saveScene
         * @return {String} in jsonFormat
         */
        this.saveScene = function () {
            throw Error("Not implemented");
        };

        /**
         * @method createGameObject
         * @return {KICK.scene.GameObject}
         */
        this.createGameObject = function () {
            var gameObject = new scene.GameObject(this);
            gameObjectsNew.push(gameObject);
            return gameObject;
        };

        /**
         * @method destroyObject
         * @param {KICK.scene.GameObject} gameObject
         */
        this.destroyObject = function (gameObject) {
            gameObjectsDelete.push(gameObject);
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
         * Prints scene properties to the console
         * @method debug
         */
        this.debug = function () {
            console.log("gameObjects "+gameObjects.length,gameObjects,
                "gameObjectsNew "+gameObjectsNew.length,gameObjectsNew,
                "gameObjectsDelete "+gameObjectsDelete.length,gameObjectsDelete
            );
        };
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
            c = KICK.core.Constants,
            _renderTarget,
            _fieldOfView,
            _near,
            _far,
            _left,
            _right,
            _bottom,
            _top,
            _clearColor,
            _cameraTypePerspective,
            _clearFlagColor,
            _clearFlagDepth,
            _currentClearFlags,
            _cameraIndex,
            _layerMask,
            _renderer,
            _scene,
            projectionMatrix = mat4.create(),
            modelViewMatrix = mat4.create(),
            modelViewProjectionMatrix = mat4.create(),
            renderableComponents = [],
            _normalizedViewportRect = vec4.create([0,0,1,1]),
            isNumber = function (o) {
                return typeof (o) === "number";
            },
            isBoolean = function(o){
                return typeof (o) === "boolean";
            },
            computeClearFlag = function(){
                _currentClearFlags = (_clearFlagColor ? 16384 : 0) | (_clearFlagDepth ? 256 : 0);
            },
            setupClearColor = function () {
                if (gl.currentClearColor !== _clearColor) {
                    gl.currentClearColor = _clearColor;
                    gl.clearColor(_clearColor[0], _clearColor[1], _clearColor[2], _clearColor[3]);
                }
            },
            assertNumber = function(newValue,name){
                if (!isNumber(newValue)){
                    KICK.core.Util.fail("Camera."+name+" must be number");
                }
            },
            /**
             * Clear the screen and set the projectionMatrix and modelViewMatrix on the gl object
             * @method setupCamera
             * @param {KICK.math.mat4} projectionMatrix Projection of the camera
             * @param {KICK.math.mat4} modelViewMatrix Modelview of the camera (the inverse global transform matrix of the camera)
             * @param {KICK.math.mat4} modelViewProjectionMatrix modelview multiplied with projection
             * @private
             */
            setupCamera = function (projectionMatrix,modelViewMatrix,modelViewProjectionMatrix) {
                var viewportDimension = _renderTarget?_renderTarget.dimension:gl.viewportSize,
                    viewPortWidth = viewportDimension[0],
                    viewPortHeight = viewportDimension[1],
                    offsetX = viewPortWidth*_normalizedViewportRect[0],
                    offsetY = viewPortWidth*_normalizedViewportRect[1],
                    width = viewPortWidth*_normalizedViewportRect[2],
                    height = viewPortHeight*_normalizedViewportRect[3];
                gl.viewport(offsetX,offsetY,width,height);
                gl.scissor(offsetX,offsetY,width,height);
                
                // setup render target
                if (gl.renderTarget !== _renderTarget){
                    gl.renderTarget = _renderTarget;
                    if (_renderTarget){
                        _renderTarget.bind();
                    } else {
                        gl.bindFramebuffer(36160, null);
                    }
                }

                setupClearColor();
                gl.clear(_currentClearFlags);

                if (_cameraTypePerspective) {
                    mat4.perspective(_fieldOfView, gl.viewportSize[0] / gl.viewportSize[1],
                        _near, _far, projectionMatrix);
                } else {
                    mat4.ortho(_left, _right, _bottom, _top,
                        _near, _far, projectionMatrix);
                }

                var globalMatrixInv = transform.getGlobalTRSInverse();
                mat4.set(globalMatrixInv, modelViewMatrix);

                mat4.multiply(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix);
            };

        /**
         * Handles the camera setup (get fast reference to transform and glcontext).
         * Also register component listener on scene
         * @method activated
         */
        this.activated = function(){
            var gameObject = this.gameObject,
                engine = gameObject.engine;
            transform = gameObject.transform;
            gl = engine.gl;
            _scene = gameObject.scene;
            _scene.addComponentListener(thisObj);
        };

        /**
         * Deregister component listener on scene
         * @method deactivated
         */
        this.deactivated = function(){
            _scene.removeComponentListener(thisObj);
        };

        this.componentsAdded = function( components ){
            for (var i=components.length-1; i>=0; i--) {
                var component = components[i];
                if (typeof(component.render) === "function" && (component.gameObject.layer & _layerMask)) {
                    renderableComponents.push(component);
                }
            }
        };

        this.componentsRemoved = function ( components ){
            for (var i=components.length-1; i>=0; i--) {
                var component = components[i];
                if (typeof(component.render) === "function") {
                    core.Util.removeElementFromArray(renderableComponents,component);
                }
            }
        };

        /**
         * @method renderScene
         * @param {KICK.scene.SceneLights} sceneLightObj
         */
        this.renderScene = function(sceneLightObj){
            setupCamera(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix);
            sceneLightObj.recomputeDirectionalLight(modelViewMatrix);
            _renderer.render(renderableComponents,projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,sceneLightObj);
            if (_renderTarget && _renderTarget.colorTexture && _renderTarget.colorTexture.generateMipmaps ){
                var textureId = _renderTarget.colorTexture.textureId;
                gl.bindTexture(gl.TEXTURE_2D, textureId);
                gl.generateMipmap(gl.TEXTURE_2D);
            }
        };

        Object.defineProperties(this,{
            renderer:{
                get:function(){ return _renderer;},
                set:function(newValue){
                    if (true){
                        if (typeof newValue.render !== "function"){
                            KICK.core.Util.fail("Camera.renderer should be a KICK.renderer.Renderer (must implement render function)");
                        }
                    }
                    _renderer = newValue;
                }
            },
            /**
             * Camera renders only objects where the components layer exist in the layer mask. <br>
             * The two values a
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
             * Only used when perspective camera type. Default 60.0
             * @property fieldOfView
             * @type Number
             */
            fieldOfView:{
                get:function(){ return _fieldOfView;},
                set:function(newValue){
                    if (true){
                        assertNumber(newValue,"fieldOfView");
                    }
                    _fieldOfView = newValue;
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
             * @property cameraTypePerspective
             * @type Boolean
             */
            cameraTypePerspective:{
                get:function(){
                    return _cameraTypePerspective;
                },
                set:function(newValue){
                    if (true){
                        if (!isBoolean(newValue)){
                            KICK.core.Util.fail("Camera.cameraTypePerspective must be a boolean");
                        }
                    }
                    _cameraTypePerspective = newValue;
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
             * Only used when orthogonal camera type (!cameraTypePerspective). Default [1,1,1,1]
             * @property clearColor
             * @type KICK.math.vec4
             */
            clearColor:{
                get:function(){
                    return _clearColor;
                },
                set:function(newValue){
                    _clearColor = newValue;
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

        _fieldOfView = isNumber(config.fieldOfView) ? config.fieldOfView : 60;
        _near = isNumber(config.near) ? config.near : 0.1;
        _far = isNumber(config.far) ? config.far : 1000;
        _cameraTypePerspective = isBoolean(config.cameraTypePerspective) ? config.cameraTypePerspective : true;
        _left = isNumber(config.left) ? config.left : -1;
        _right = isNumber(config.right) ? config.right : 1;
        _bottom = isNumber(config.bottom) ? config.bottom : -1;
        _top = isNumber(config.top) ? config.top : 1;
        _clearColor = config.clearColor ? config.clearColor : [1,1,1,1];
        _clearFlagColor = config.clearFlagColor ? config.clearFlagColor:true;
        _clearFlagDepth = config.clearFlagDepth ? config.clearFlagDepth:true;
        _renderTarget = config.renderTarget instanceof KICK.texture.RenderTexture ? config.renderTarget : null;
        _cameraIndex = isNumber(config.cameraIndex) ? config.cameraIndex : 1;
        _layerMask = isNumber(config.layerMask) ? config.layerMask : 0xffffffff;
        _renderer = config.renderer ? config.renderer : new KICK.renderer.ForwardRenderer();
        if (config.normalizedViewportRect){
            this.normalizedViewportRect = config.normalizedViewportRect;
        }
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
     */
    scene.MeshRenderer = function () {
        var transform;

        /**
         * @method activated
         */
        this.activated = function(){
            transform = this.gameObject.transform;
        };
        
        /**
         * @property material
         * @type KICK.material.Material
         */
        this.material = undefined;

        /**
         * This method may not be called (the renderer could make the same calls)
         * @method render
         * @param (KICK.math.mat4) projectionMatrix
         * @param {KICK.math.mat4} modelViewMatrix
         * @param {KICK.math.mat4} modelViewProjectionMatrix modelviewMatrix multiplied with projectionMatrix
         * @param {KICK.scene.SceneLights} sceneLights
         */
        this.render = function (projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,sceneLights) {
            var mesh = this.mesh,
                material = this.material,
                shader = material.shader;
            mesh.bind(shader);
            material.bind(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,transform,sceneLights);
            mesh.render();
        };

        /**
         * @property mesh
         * @type KICK.mesh.Mesh
         */
        this.mesh = undefined;
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
        var color = vec3.create([1.0,1.0,1.0]),
            type,
            intensity,
            colorIntensity = vec3.create(),
            updateIntensity = function(){
                vec3.set([color[0]*intensity,color[1]*intensity,color[2]*intensity],colorIntensity);
            },
            gameObject,
            scriptPriority;
        config = config || {};
        if (config.color){
            vec3.set(config.color,color);
        }
        intensity = config.intensity || 1;
        updateIntensity();
        if (ASSERT){
            if (config.type){
                if (config.type !== 3 &&
                    config.type !== 2 &&
                    config.type !== 1){
                    KICK.core.Util.fail("Light type must be 3, " +
                        "2 or 1");
                }
            }
        }
        type = config.type ||  3;
        Object.defineProperties(this,{
            /**
             * Color intensity of the light (RGBA)
             * @property color
             * @type KICK.math.vec3
             */
            color: {
                get: function(){
                    return vec3.create(color);
                },
                set: function(value){
                    vec3.set(value,color);
                    updateIntensity();
                }
            },
            /**
             * Color type. Must be either:<br>
             * 1,
             * 2,
             * 2 <br>
             * Note that this value is readonly. To change it create a new Light component and replace the current light
             * component of its gameObject
             * @property type
             * @type Enum
             * @final
             */
            type: {
                get: function(){
                    return type;
                }
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
                }
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
                value:colorIntensity
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
                }
            }
        });
    };
    Object.freeze(scene.Light);

     /**
     * Datastructure used pass light information
     * @class SceneLights
     * @namespace KICK.scene
     */
    scene.SceneLights = function(){
        var ambientLight = null,
            directionalLight = null,
            directionalHalfVector = vec3.create(),
            directionalLightDirection = vec3.create(),
            directionalLightTransform = null,
            otherLights = [];
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
                    }
                }
            },
            /**
             * The half vector of the directional light source  (calculated in recomputeDirectionalLight())
             * @property directionalHalfVector
             * @type KICK.math.vec3
             */
            directionalHalfVector:{
                value:directionalHalfVector
            },
            /**
             * Normalized light direction (calculated in recomputeDirectionalLight()) <br>
             * Note the light direction if from the surface towards the light
             * @property directionalLightDirection
             * @type KICK.math.vec3
             */
            directionalLightDirection:{
                value:directionalLightDirection
            },
            /**
             * The point  light sources in the scene.
             * @property otherLights
             * @type Array[KICK.scene.Light]
             */
            otherLights:{
                value:otherLights
            }
        });
        /**
         * @method recomputeDirectionalLight
         * @param {KICK.math.mat4} modelViewMatrix
         */
        this.recomputeDirectionalLight = function(modelViewMatrix){
            if (directionalLight !== null){
                // compute light direction (note direction from surface towards camera)
                vec4.set([0,0,1],directionalLightDirection);
                quat4.multiplyVec3(directionalLightTransform.rotation,directionalLightDirection);

                // transform to eye space
                mat4.multiplyVec3Vector(modelViewMatrix,directionalLightDirection);
                vec3.normalize(directionalLightDirection);

                // compute eye direction
                var eyeDirection = [0,0,1];
                // compute half vector
                vec3.add(eyeDirection, directionalLightDirection, directionalHalfVector);
                vec3.normalize(directionalHalfVector);
            }
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
        };

    /**
     * Render texture (used for camera's render target)
     * @todo - currently incomplete
     * @class RenderTexture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {KICK.texture.Texture} _colorTexture Optional (may be null)
     * @param {KICK.texture.Texture} _depthTexture Optional (may be null)
     */
    texture.RenderTexture = function (engine, _colorTexture, _depthTexture){
        var gl = engine.gl,
            framebuffer = gl.createFramebuffer(),
            validTexture = _colorTexture || _depthTexture,
            _dimension = validTexture.dimension,
            renderBuffers = [];

        /**
         * @method bind
         */
        this.bind = function(){
            gl.bindFramebuffer(36160, framebuffer);
        };

        Object.defineProperties(this,{
            /**
             * Read only
             * @property dimension
             * @type KICK.math.vec2
             */
            dimension:{
                value:_dimension
            },
            /**
             * Read only
             * @property colorTexture
             * @type KICK.texture.Texture
             */
            colorTexture:{
                value: _colorTexture
            },
            /**
             * Read only
             * @property depthTexture
             * @type KICK.texture.Texture
             */
            depthTexture:{
                value: _depthTexture
            }
        });
            
        (function init(){
            var renderbuffer;
            gl.bindFramebuffer(36160, framebuffer);

            if (_colorTexture){
                gl.framebufferTexture2D(36160, 36064, 3553, _colorTexture.textureId, 0);
            } else {
                renderbuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(36161, renderbuffer);
                gl.renderbufferStorage(36161, 32854, _dimension[0], _dimension[1]);
                gl.framebufferRenderbuffer(36160, 36064, 36161, renderbuffer);
                renderBuffers.push(renderbuffer);
            }

            if (_depthTexture){
                gl.framebufferTexture2D(36160, 36096, 3553, _depthTexture.textureId, 0);
            } else {
                renderbuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(36161, renderbuffer);
                gl.renderbufferStorage(36161, 33189, _dimension[0], _dimension[1]);
                gl.framebufferRenderbuffer(36160, 36096, 36161, renderbuffer);
                renderBuffers.push(renderbuffer);
            }
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
        })();
    };

    /**
     * Encapsulate a texture object and its configuration.
     * @class Texture
     * @namespace KICK.texture
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config Optional
     * @param {Object} uidMapping Optional Maps from old uid to new uid
     */
    texture.Texture = function (engine, config, uidMapping) {
        var gl = engine.gl,
            _uid = engine.createUID(), // note uid is always
            texture0 = 33984,
            thisConfig = config || {},
            _textureId = gl.createTexture(),
            _wrapS = thisConfig.wrapS ||  10497,
            _wrapT = thisConfig.wrapT || 10497,
            _minFilter = thisConfig.minFilter || 9729,
            _magFilter = thisConfig.magFilter || 9729,
            _generateMipmaps = typeof (thisConfig.generateMipmaps) === 'boolean'? thisConfig.generateMipmaps : true,
            _dataURI = thisConfig.dataURI || null,
            _flipY =  typeof (thisConfig.flipY )==='boolean'? thisConfig.flipY : true,
            _intFormat = thisConfig.internalFormat || 6408,
            _textureType = thisConfig.textureType || 3553,
            _boundTextureType = null,
            currentTexture,
            thisObj = this,
            _dimension = vec2.create(),
            /**
             * @method recreateTextureIfDifferentType
             * @private
             */
            recreateTextureIfDifferentType = function(){
                if (_boundTextureType !== null && _boundTextureType !== _textureType){
                    thisObj.destroy();
                    _textureId = gl.createTexture();
                }
                _boundTextureType = _textureType;
            };

        if (uidMapping && thisConfig.uid){
            uidMapping[thisConfig.uid] = _uid;
        }

        (function init(){
            // create active texture component on glContext
            if (!gl.currentTexture){
                gl.currentTexture = {};
            }
            currentTexture = gl.currentTexture;
        })();

        /**
         * Bind the current texture
         * @method bind
         */
        this.bind = function(textureSlot){
            // todo reintroduce optimization 
//            if (currentTexture[textureSlot] !== this){
                gl.activeTexture(texture0+textureSlot);
                gl.bindTexture(_textureType, _textureId);
                currentTexture[textureSlot] = this;
//            }
        };

        /**
         * Deallocates the texture from memory
         * @method destroy
         */
        this.destroy = function(){
            if (_textureId !== null){
                gl.deleteTexture(_textureId);
                _textureId = null;
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
            this.bind(0); // bind to texture slot 0
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

                gl.texParameteri(3553, 10242, _wrapS);
                gl.texParameteri(3553, 10243, _wrapT);
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
            gl.texParameteri(_textureType, 10240, _magFilter);
            gl.texParameteri(_textureType, 10241, _minFilter);
            if (_generateMipmaps){
                gl.generateMipmap(_textureType);
            }
        };
        
        /**
         * Set a image using a raw bytearray in a specified format
         * @method setImageData
         * @param {Number} width image width in pixels
         * @param {Number} height image height in pixels
         * @param {Number} border image border in pixels
         * @param {Object} type 5121, 32819, 32820 or 33635
         * @param {Array} pixels array of pixels (may be null)
         * @param {String} dataURI String representing the image
         */
        this.setImageData = function(width, height, border, type, pixels, dataURI){
            recreateTextureIfDifferentType();

            if (true){
                if (type !== 5121 &&
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

            vec2.set([width,height],_dimension);
            _dataURI = dataURI;

            this.bind(0); // bind to texture slot 0
            gl.pixelStorei(3317, 1);
            gl.texImage2D(3553, 0, _intFormat, width, height, border, _intFormat, type, pixels);
            gl.texParameteri(3553, 10240, _magFilter);
            gl.texParameteri(3553, 10241, _minFilter);
            gl.texParameteri(3553, 10242, _wrapS);
            gl.texParameteri(3553, 10243, _wrapT);
            if (_generateMipmaps){
                gl.generateMipmap(3553);
            }
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

        Object.defineProperties(this,{
            /**
             *
             * @property textureId
             * @type {Number}
             */
            textureId:{
                value:_textureId
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
             * Unique identifier of the texture
             * @property uid
             * @type {Number}
             */
            uid:{
                value:_uid
            },
            /**
             * Identifier of the texture
             * @property dataURI
             * @type String
             */
            dataURI:{
                get:function(){
                    return _dataURI;
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
                uid:_uid,
                wrapS:_wrapS,
                wrapT:_wrapT,
                minFilter:_minFilter,
                magFilter:_magFilter,
                generateMipmaps:_generateMipmaps,
                dataURI:_dataURI,
                flipY:_flipY,
                internalFormat:_intFormat,
                textureType:_textureType
            };
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

    var renderer = KICK.namespace("KICK.renderer"),
        core = KICK.namespace("KICK.core"),
        scene = KICK.namespace("KICK.scene"),
        math = KICK.namespace("KICK.math");

    /**
     * Defines interface for render classes.
     * @class Renderer
     * @namespace KICK.renderer
     * @constructor
     */
    /**
     * Called each frame to render the components
     * @method render
     * @param {KICK.scene.Component} renderableComponents
     */

    /**
     * Does not render any components
     * @class NullRenderer
     * @namespace KICK.renderer
     * @constructor
     * @extends KICK.renderer.Renderer
     */
    renderer.NullRenderer = function () {};

    renderer.NullRenderer.prototype.render = function (renderableComponents,projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,sceneLightObj) {};
    
    /**
     * Forward renderer
     * @class ForwardRenderer
     * @namespace KICK.renderer
     * @constructor
     * @extends KICK.renderer.Renderer
     */
    renderer.ForwardRenderer = function () {
        this.render = function (renderableComponents,projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,sceneLightObj) {
            var length = renderableComponents.length;
            for (var j=0;j<length;j++){
                renderableComponents[j].render(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,sceneLightObj);
            }
        };
    };
}());
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
    var material = KICK.namespace("KICK.material"),
        math = KICK.namespace("KICK.math"),
        mat3 = math.mat3,
        mat4 = math.mat4,
        core = KICK.namespace("KICK.core"),
        c = KICK.core.Constants;

    /**
     * GLSL Shader object
     * @class Shader
     * @namespace KICK.material
     * @constructor
     * @param {KICK.core.Engine} engine
     * @param {Object} config
     * @param {Object} uidMapping Optional Maps from old uid to new uid
     */
    material.Shader = function (engine, config, uidMapping) {
        //todo add support for polygon offset
        var gl = engine.gl,
            thisObj = this,
            thisConfig = config || {},
            _uid = engine.createUID(),
            _shaderProgramId = -1,
            _depthMask = true,
            _faceCulling = thisConfig.faceCulling || 1029,
            _zTest = thisConfig.zTest || 513,
            _blend = thisConfig.blend || false,
            _blendSFactor = thisConfig.blendSFactor || 770,
            _blendDFactor = thisConfig.blendDFactor || 771,
            blendKey,
            glslConstants = material.GLSLConstants,
            _vertexShaderSrc = thisConfig.vertexShaderSrc || glslConstants["error_vs.glsl"],
            _fragmentShaderSrc = thisConfig.fragmentShaderSrc || glslConstants["error_fs.glsl"],
            _errorLog = thisConfig.errorLog,
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
                str = material.Shader.getPrecompiledSource(str);
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
                if (gl.depthMask !== _depthMask){
                    gl.depthMask(_depthMask);
                    gl.depthMask = _depthMask;
                }
            },
            updateBlending = function () {
                if (gl.blendKey !== blendKey){
                    if (_blend){
                        gl.enable(3042);
                    } else {
                        gl.disable(3042);
                    }
                    gl.blendFunc(_blendSFactor,_blendDFactor);
                }
            };

        Object.defineProperties(this,{
            /**
             * Unique identifier of the shader
             * @property uid
             * @type {Number}
             */
            uid:{
                value:_uid
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
                            value !== 32770,
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
             * @property blendSFactor
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
                            value !== 32770,
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
         * @method updateShader
         * @return {Boolean} shader created successfully
         */
        this.updateShader = function () {
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
                vertexShader = compileShader(glslConstants["error_vs.glsl"], false, errorLog);
                fragmentShader = compileShader(glslConstants["error_fs.glsl"], true, errorLog);
            }

            //thisObj.destroy();
            _shaderProgramId = gl.createProgram();

            gl.attachShader(_shaderProgramId, vertexShader);
            gl.attachShader(_shaderProgramId, fragmentShader);
            gl.linkProgram(_shaderProgramId);
            // remove reference to shader code (no longer needed, since code is compiled to shader)
            //gl.deleteShader(vertexShader);
            //gl.deleteShader(fragmentShader);
            if (!gl.getProgramParameter(_shaderProgramId, 35714)) {
                errorLog("Could not initialise shaders");
                return false;
            }

            gl.useProgram(_shaderProgramId);
            activeUniforms = gl.getProgramParameter( _shaderProgramId, 35718);
            /**
             * Array of Object with size,type, name and index properties
             * @property activeUniforms
             * @type Object
             */
            this.activeUniforms = new Array(activeUniforms);
            /**
             * Lookup of uniform based on name.
             * @property uniformMap
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
        // todo: refactor this
        this.bind = function () {
            if (true){
                if (!(this.isValid)){
                    KICK.core.Util.fail("Cannot bind a shader that is not valid");
                }
            }
            gl.useProgram(_shaderProgramId);
            updateCullFace();
            updateDepthProperties();
            updateBlending();

        };

        /**
         * Serializes the data into a JSON object (that can be used as a config parameter in the constructor)<br>
         * Note errorLog are not serialized
         * @method toJSON
         * @return {Object} config element
         */
        this.toJSON = function(){
            return {
                faceCulling:_faceCulling,
                zTest:_zTest,
                depthMask: _depthMask,
                vertexShaderSrc:_vertexShaderSrc,
                fragmentShaderSrc:_fragmentShaderSrc
            };
        };

        (function init(){
            if (uidMapping && thisConfig.uid){
                uidMapping[thisConfig.uid] = _uid;
            }
            updateBlendKey();
            thisObj.updateShader();
        })();
    };


    /**
     * @method getPrecompiledSource
     * @param {String} sourcecode
     * @return {String} sourcecode after precompiler
     * @static
     */
    material.Shader.getPrecompiledSource = function(sourcecode){
        // todo optimize with regular expression search
        for (var name in material.GLSLConstants){
            if (typeof (name) === "string"){
                var source = material.GLSLConstants[name];
                sourcecode = sourcecode.replace("#pragma include \""+name+"\"",source);
                sourcecode = sourcecode.replace("#pragma include \'"+name+"\'",source);
            }
        }
        return sourcecode;
    };

    Object.freeze(material.Shader);

    /**
     * Binds the uniforms to the current shader.
     * The uniforms is expected to be in a valid format
     * @method bindUniform
     * @param {KICK.material.Material} material
     * @param {KICK.math.mat4} projectionMatrix
     * @param {KICK.math.mat4} modelViewMatrix
     * @param {KICK.math.mat4} modelViewProjectionMatrix
     * @param {KICK.math.mat4) transform
     * @param {KICK.scene.SceneLights} sceneLights
     */
    material.Shader.prototype.bindUniform = function(material, projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,transform, sceneLights){
        // todo optimize this code
        var gl = this.gl,
            materialUniforms = material.uniforms,
            timeObj,
            uniformName,
            shaderUniform,
            uniform,
            value,
            location,
            mv = this.lookupUniform["_mv"],
            proj = this.lookupUniform["_proj"],
            mvProj = this.lookupUniform["_mvProj"],
            norm = this.lookupUniform["_norm"],
            lightUniform,
            time = this.lookupUniform["_time"],
            viewport = this.lookupUniform["_viewport"],
            ambientLight = sceneLights.ambientLight,
            directionalLight = sceneLights.directionalLight,
            otherLights = sceneLights.otherLights,
            globalTransform,
            c = KICK.core.Constants,
            i,
            currentTexture = 0;

        for (uniformName in materialUniforms){
            shaderUniform = this.lookupUniform[uniformName];
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
            gl.uniformMatrix4fv(proj.location,false,projectionMatrix);
        }
        if (mv || norm){
            // todo optimize
            globalTransform = transform.getGlobalMatrix();
            var finalModelView = mat4.multiply(modelViewMatrix,globalTransform,mat4.create());
            if (mv){
                gl.uniformMatrix4fv(mv.location,false,finalModelView);
            }
            if (norm){
                // note this can be simplified to
                // var normalMatrix = math.mat4.toMat3(finalModelView);
                // if the modelViewMatrix is orthogonal (non-uniform scale is not applied)
//                var normalMatrix = mat3.transpose(mat4.toInverseMat3(finalModelView));
                var normalMatrix = mat4.toNormalMat3(finalModelView);
                gl.uniformMatrix3fv(norm.location,false,normalMatrix);
            }
        }
        if (mvProj){
            globalTransform = globalTransform || transform.getGlobalMatrix();
            gl.uniformMatrix4fv(mvProj.location,false,mat4.multiply(modelViewProjectionMatrix,globalTransform,mat4.create())); // todo remove new mat4 here (make local variable?)
        }
        if (ambientLight !== null){
            lightUniform =  this.lookupUniform["_ambient"];
            if (lightUniform){
                gl.uniform3fv(lightUniform.location, ambientLight.colorIntensity);
            }
        }
        if (directionalLight !== null){
            lightUniform =  this.lookupUniform["_dLight.colInt"];
            if (lightUniform){
                gl.uniform3fv(lightUniform.location, directionalLight.colorIntensity);
                lightUniform =  this.lookupUniform["_dLight.lDir"];
                gl.uniform3fv(lightUniform.location, sceneLights.directionalLightDirection);
                lightUniform =  this.lookupUniform["_dLight.halfV"];
                gl.uniform3fv(lightUniform.location, sceneLights.directionalHalfVector);
            }
        }
        for (i=otherLights.length-1;i >= 0;i--){
            // todo
        }
        if (time){
            timeObj = this.engine.time;
            gl.uniform1f(time.location, timeObj.time);
        }
        if (viewport){
            gl.uniform2fv(viewport.location, gl.viewportSize);
        }
    };


    /**
     * Material configuration
     * @class Material
     * @namespace KICK.material
     * @constructor
     */
    material.Material = function (config) {
        var configObj = config || {},
            _name = configObj.name || "Material",
            _shader = configObj.shader,
            _uniforms = configObj.uniforms || {},
            thisObj = this;
        Object.defineProperties(this,{
             /**
              * @property name
              * @type String
              */
            name:{
                value:_name,
                writable:true
            },
            /**
             * @property shader
             * @type KICK.material.Shader
             */
            shader:{
                value:_shader,
                writable:true
            },
            /**
             * Object with of uniforms.
             * The object has a number of named properties one for each uniform. The uniform object contains value and type.
             * The value is always an array
             * @property uniforms
             * @type Object
             */
            uniforms:{
                value:_uniforms,
                writeable:true
            }
        });

        /**
         * Binds textures and uniforms
         * @method bind
         */
        this.bind = function(projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,transform, sceneLights){
            // todo
            _shader.bindUniform (thisObj, projectionMatrix,modelViewMatrix,modelViewProjectionMatrix,transform, sceneLights);
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
                    if (value instanceof Float32Array || value instanceof Int32Array)
                    {
                        value = core.Util.typedArrayToArray(value);
                    } else {
                        if (true){
                            if (!value instanceof KICK.texture.Texture){
                                KICK.core.Util.fail("Unknown uniform value type. Expected Texture");
                            }
                        }
                        value = value.uid;
                    }

                    filteredUniforms[name] = {
                        type: uniform.type,
                        value:value
                    };
                }
            }
            return {
                name:_name,
                shader: _shader?_shader.uid:0,
                uniforms: filteredUniforms
            };
        };

        (function init(){
            material.Material.verifyUniforms(_uniforms);
        })();
    };

    /**
     * The method replaces any invalid uniform (Array) with a wrapped one (Float32Array or Int32Array)
     * @method verifyUniforms
     * @param {Object} uniforms
     * @static
     */
    material.Material.verifyUniforms = function(uniforms){
        var uniform,
            type,
            c = KICK.core.Constants;
        for (uniform in uniforms){
            if (Array.isArray(uniforms[uniform].value) || typeof uniforms[uniform].value === 'number'){
                type = uniforms[uniform].type;
                if (type === 5124 || type===35667 || type===35668 || type===35669){
                    uniforms[uniform].value = new Int32Array(uniforms[uniform].value);
                } else if (type === 35678 || type ===35680 ){
                    if (true){
                        if (typeof uniforms[uniform].value !== KICK.texture.Texture){
                            KICK.core.Util.fail("Uniform value should be a texture object but was "+uniforms[uniform].value);
                        }
                    }
                } else {
                    uniforms[uniform].value = new Float32Array(uniforms[uniform].value);
                }
            }
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

    var importer = KICK.namespace("KICK.importer"),
        math = KICK.namespace("KICK.math"),
        quat4 = math.quat4;

     /**
     * Imports a collada meshes into a scene
     * @class ColladaImporter
     * @namespace KICK.importer
     */
    importer.ColladaImporter = {};

    /**
     * @method loadCollada
     * @param {XMLDom} colladaDOM
     * @param {KICK.core.Engine} engine
     * @param {KICK.scene.Scene} scene Optional. If not specified the active scene (from the engine) is used
     * @param {boolean} rotate90x rotate -90 degrees around x axis
     * @return {Array[KICK.scene.GameObject]}
     * @static
     */
    importer.ColladaImporter.loadCollada = function (colladaDOM, engine, scene, rotate90x){
        var dataCache = {},
            constants = KICK.core.Constants,
            /**
             * Converts a string to an array
             * @method stringToArray
             * @param {String} numberString
             * @param {Number} count Optional
             * @param {Object} type Optional - valid types are Array (default), and typed arrays classes
             * @private
             */
            stringToArray = function(numberString,count,type){
                if (!type){
                    type = Array;
                }
                if (!count){
                    count = 0;
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
                var arrayElement = colladaDOM.getElementById(id);
                var type;
                if (arrayElement.tagName === "float_array"){
                    type = Float32Array;
                } else {
                    type = Int32Array;
                }
                var count = Number(arrayElement.getAttribute("count"));
                var res = stringToArray(arrayElement.textContent,count,type);
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
                var source = colladaDOM.getElementById(elementChild.getAttribute("source").substring(1));
                if (source.tagName === "vertices"){
                    source = source.getElementsByTagName("input")[0];
                    source = colladaDOM.getElementById(source.getAttribute("source").substring(1));
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
            buildFromPolyList = function(polylist, destMeshData){
                var polylistChild = polylist.firstChild,
                    tagName,
                    i,j,
                    vertexCount = function(){return 3;},
                    count = Number(polylist.getAttribute("count")),
                    dataAccessor = {names:[],offset:{},accessors:{},length:{}},
                    offsetSet = [],
                    contains = KICK.core.Util.contains;

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
                        var vCount = stringToArray(polylistChild.textContent,count,Int32Array);
                        vertexCount = function(i){ return vCount[i];}
                    } else if (tagName === "p"){
                        var numberOfVertexIndices = 0,
                            offsetCount = offsetSet.length;
                        for (i=count-1;i>=0;i--){
                            numberOfVertexIndices += vertexCount(i);
                        }

                        var numberOfVertexIndicesWithOffset = numberOfVertexIndices*offsetCount;
                        var vertexIndices = stringToArray(polylistChild.textContent,numberOfVertexIndicesWithOffset,Int32Array);

                        // initialize data container
                        var outVertexAttributes = {};
                        for (i=0;i<dataAccessor.names.length;i++){
                            outVertexAttributes[dataAccessor.names[i]] = [];
                        }
                        var vertexAttributeCache = {};
                        var numberOfVertices = 0;
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
                            destMeshData[nameMeshData] = outVertexAttributes[name];
                        }
                        destMeshData.meshType = 4;
                        destMeshData.indices = triangleIndices;
                    }
                    polylistChild = polylistChild .nextSibling;
                }
            },
            /**
             * @method buildFromTrianglestrips
             * @private buildFromTrianglestrips
             */
            buildFromTrianglestrips = function(meshChild, destMeshData){
                // todo: implement
                KICK.core.Util.fail("buildFromTrianglestrips not implemented");
            },
            buildMeshData = function (colladaDOM, engine, geometry){
                var i,
                    tagName,
                    meshChild,
                    name = geometry.getAttribute('name'),
                    destMeshData = new KICK.mesh.MeshData({name:name}),
                    mesh = geometry.getElementsByTagName("mesh");
                if (mesh.length==0){
                    return null;
                }
                mesh = mesh[0];
                meshChild = mesh.firstChild;
                while (meshChild !== null){
                    tagName = meshChild.tagName;
                    if (tagName === "lines"){
                        console.log("lines");
                    } else if (tagName === "linestrips"){
                        console.log("linestrips");
                    } else if (tagName === "polygons"){
                        console.log("polygons");
                    } else if (tagName === "polylist" || tagName === "triangles"){
                        buildFromPolyList(meshChild,destMeshData);
                    } else if (tagName === "trifans"){
                        console.log("trifans unsupported");
                    } else if (tagName === "tristrips"){
                        buildFromTrianglestrips(meshChild);
                    }
                    meshChild = meshChild.nextSibling;
                }
                return destMeshData;
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
        var gameObjectsCreated = [];
        var meshCache = {};
        var getMeshById = function(engine, meshid){
            var mesh,
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
                    mesh = new KICK.mesh.Mesh(engine, {},meshData);
                    break;
                }
            }
            meshCache[meshid] = mesh;
            return mesh;
        };

        var updateTransform = function(transform, node){
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
            }
        };

        var createMeshRenderer = function(gameObject, node){
            var url = node.getAttribute("url"),
                meshRenderer = new KICK.scene.MeshRenderer();
            if (url){
                url = url.substring(1);
            }
            var shader = new KICK.material.Shader(engine);

            shader.updateShader();
            var url = node.getAttribute("url");

            meshRenderer.mesh = getMeshById(engine,url);
            console.log("Mesh",meshRenderer.mesh);
            meshRenderer.material = new KICK.material.Material({
                name:"Some material",
                shader:shader
            });
            console.log("Getting mesh by id "+url);
            console.log("meshRenderer.material name "+meshRenderer.material.name);
            console.log("meshRenderer.material shader "+meshRenderer.material.shader);

            gameObject.addComponent(meshRenderer);

        };

        var addNode = function(node, parent){
            var gameObject = scene.createGameObject();
            var transform = gameObject.transform;
            if (parent){
                transform.parent = parent;
            }
            gameObject.name = node.getAttribute("id");
            gameObjectsCreated.push(gameObject);
            var childNode = node.firstElementChild;
            while (childNode){
                var tagName = childNode.tagName;
                if (tagName === "translate" ||
                    tagName === "rotate" ||
                    tagName === "scale"){
                    updateTransform(transform, childNode);
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
                }
                childNode = childNode.nextElementSibling;
            }
        };

        for (var i=0;i<visualScenes.length;i++){
            var visualScene = visualScenes[i];
            var node = visualScene.firstElementChild;
            while (node){
                addNode(node, null);
                node = node.nextElementSibling;
            }
        }
        return gameObjectsCreated;
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

    var core = KICK.namespace("KICK.core"),
        mesh = KICK.namespace("KICK.mesh"),
        material = KICK.namespace("KICK.material"),
        constants = core.Constants;

    /**
     * The default resource manager
     * @class DefaultResourceProvider
     * @namespace KICK.core
     * @constructor
     * @extends KICK.core.ResourceProvider
     * @param {KICK.core.Engine} engine
     */
    core.DefaultResourceProvider = function(engine){
        var gl = engine.gl;

        Object.defineProperties(this,{
            /**
             * Protocol of the resource, such as http, kickjs<br>
             * The protocol must uniquely identify a resource provider
             * @property protocol
             * @type String
             */
            protocol:{
                value:"kickjs"
            }
        });

        /**
         * Creates a Mesh object based on a url.<br>
         * The following resources can be created:<br>
         * <ul>
         * <li><b>Triangle</b> Url: kickjs://mesh/triangle/</li>
         * <li><b>Plane</b> Url: kickjs://mesh/plane/<br></li>
         * <li><b>UVSphere</b> Url: kickjs://mesh/uvsphere/?slides=20&stacks=10&radius=1.0<br>Note that the parameters is optional</li>
         * <li><b>Cube</b> Url: kickjs://mesh/cube/?length=1.0<br>Note that the parameters is optional</li>
         * </ul>
         * @method getMesh
         * @param {String} url
         * @return {KICK.mesh.Mesh}
         */
        this.getMesh = function(url){
            var config,
                meshDataObj,
                getParameterInt = core.Util.getParameterInt,
                getParameterFloat = core.Util.getParameterFloat;
            if (url.indexOf("kickjs://mesh/triangle/")==0){
                config = {
                    name: "Triangle"
                };
                meshDataObj = mesh.MeshFactory.createTriangleData();
            } else if (url.indexOf("kickjs://mesh/plane/")==0){
                config = {
                    name: "Plane"
                };
                meshDataObj = mesh.MeshFactory.createPlaneData();
            } else if (url.indexOf("kickjs://mesh/uvsphere/")==0){
                config = {
                    name: "UVSphere"
                };
                var slices = getParameterInt(url, "slices"),
                    stacks = getParameterInt(url, "stacks"),
                    radius = getParameterFloat(url, "radius");
                meshDataObj = mesh.MeshFactory.createUVSphereData(slices, stacks, radius);
            } else if (url.indexOf("kickjs://mesh/cube/")==0){
                config = {
                    name: "Cube"
                };
                var length = getParameterFloat(url, "length");
                meshDataObj = mesh.MeshFactory.createCubeData(length);
            } else {
                return null;
            }
            
            if (meshDataObj){
                return new mesh.Mesh(engine,config, meshDataObj);
            }
        };

        /**
         * Create a default shader based on a URL<br>
         * The following shaders are available:
         *  <ul>
         *  <li><b>Phong</b> Url: kickjs://shader/phong/</li>
         *  <li><b>Unlit</b> Url: kickjs://shader/unlit/</li>
         *  <li><b>Error</b> Url: kickjs://shader/error/<br></li>
         *  </ul>
         * @method getShader
         * @param {String} url
         * @return {KICK.material.Shader} Shader or null if not found
         */
        this.getShader = function(url,errorLog){
            var vertexShaderSrc,
                fragmentShaderSrc,
                glslConstants = KICK.material.GLSLConstants;
            if (url.indexOf("kickjs://shader/phong/")==0){
                vertexShaderSrc = glslConstants["phong_vs.glsl"];
                fragmentShaderSrc = glslConstants["phong_fs.glsl"];
            } else if (url.indexOf("kickjs://shader/error/")==0){
                vertexShaderSrc = glslConstants["error_vs.glsl"];
                fragmentShaderSrc = glslConstants["error_fs.glsl"];
            } else if (url.indexOf("kickjs://shader/unlit/")==0){
                vertexShaderSrc = glslConstants["unlit_vs.glsl"];
                fragmentShaderSrc = glslConstants["unlit_fs.glsl"];
            } else {
                return null;
            }
            var shader = new KICK.material.Shader(engine);
            shader.vertexShaderSrc = vertexShaderSrc;
            shader.fragmentShaderSrc = fragmentShaderSrc;
            shader.errorLog = errorLog;
            shader.updateShader();
            return shader;
        };

        /**
         * Create a default texture based on a URL.<br>
         * The following default textures exists:
         *  <ul>
         *  <li><b>Black</b> Url: kickjs://texture/black/</li>
         *  <li><b>White</b> Url: kickjs://texture/white/<br></li>
         *  <li><b>Gray</b>  Url: kickjs://texture/gray/<br></li>
         *  </ul>
         * @method getTexture
         * @param {String} url
         * @return {KICK.texture.Texture} Texture object - or null if no texture is found for the specified url
         */
        this.getTexture = function(url){
            var data;
            if (url.indexOf("kickjs://texture/black/")==0){
                data = new Uint8Array([0, 0, 0,
                                         0,   0,   0,
                                         0,   0,   0,
                                         0,   0,   0]);
            } else if (url.indexOf("kickjs://texture/white/")==0){
                data = new Uint8Array([255, 255, 255,
                                         255,   255,   255,
                                         255,   255,   255,
                                         255,   255,   255]);
            } else if (url.indexOf("kickjs://texture/gray/")==0){
                data = new Uint8Array([127, 127, 127,
                                         127,   127,   127,
                                         127,   127,   127,
                                         127,   127,   127]);
            } else {
                return null;
            }
            var texture = new KICK.texture.Texture(engine,{
                minFilter: 9728,
                magFilter: 9728,
                generateMipmaps: false,
                internalFormat: 6407
            });

            texture.setImageData( 2, 2, 0, 5121,data, url);
            return texture;
        };

        /**
         * @method getScene
         * @param {String} url
         * @return {KICK.scene.Scene} or null if scene cannot be initialized
         */
        this.getScene = function(url){
            return null;
        };
    };
})();
