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
     * This class contains references to WebGL constants.
     * Constants will be replace with actual values to increase performance when the file is compile by the postprocessor.
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
         *         throw new Error("x should be a number");
         *     }
         * }
         * </pre>
         * @property _ASSERT_EDITOR
         * @type Boolean
         * @static
         * @final
         */
        _ASSERT: { value: true},
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
        _DEBUG: { value: true},
        /**
         * Value 0.01745329251994
         * @property _DEGREE_TO_RADIAN
         * @type Number
         * @static
         * @final
         */
        _DEGREE_TO_RADIAN : { value: 0.01745329251994},
        /**
         * Value 57.2957795130824
         * @property _RADIAN_TO_DEGREE
         * @type Number
         * @static
         * @final
         */
        _RADIAN_TO_DEGREE : {value: 57.2957795130824},
        /**
         * Value 256
         * @property GL_DEPTH_BUFFER_BIT
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_BUFFER_BIT: { value: 256},
        /**
         * Value 1024
         * @property GL_STENCIL_BUFFER_BIT
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BUFFER_BIT: { value: 1024},
        /**
         * Value 16384
         * @property GL_COLOR_BUFFER_BIT
         * @type Number
         * @static
         * @final
         */
        GL_COLOR_BUFFER_BIT: { value: 16384},
        /**
         * Value 0
         * @property GL_POINTS
         * @type Number
         * @static
         * @final
         */
        GL_POINTS: { value: 0},
        /**
         * Value 1
         * @property GL_LINES
         * @type Number
         * @static
         * @final
         */
        GL_LINES: { value: 1},
        /**
         * Value 2
         * @property GL_LINE_LOOP
         * @type Number
         * @static
         * @final
         */
        GL_LINE_LOOP: { value: 2},
        /**
         * Value 3
         * @property GL_LINE_STRIP
         * @type Number
         * @static
         * @final
         */
        GL_LINE_STRIP: { value: 3},
        /**
         * Value 4
         * @property GL_TRIANGLES
         * @type Number
         * @static
         * @final
         */
        GL_TRIANGLES: { value: 4},
        /**
         * Value 5
         * @property GL_TRIANGLE_STRIP
         * @type Number
         * @static
         * @final
         */
        GL_TRIANGLE_STRIP: { value: 5},
        /**
         * Value 6
         * @property GL_TRIANGLE_FAN
         * @type Number
         * @static
         * @final
         */
        GL_TRIANGLE_FAN: { value: 6},
        /**
         * Value 0
         * @property GL_ZERO
         * @type Number
         * @static
         * @final
         */
        GL_ZERO: { value: 0},
        /**
         * Value 1
         * @property GL_ONE
         * @type Number
         * @static
         * @final
         */
        GL_ONE: { value: 1},
        /**
         * Value 768
         * @property GL_SRC_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_SRC_COLOR: { value: 768},
        /**
         * Value 769
         * @property GL_ONE_MINUS_SRC_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_SRC_COLOR: { value: 769},
        /**
         * Value 770
         * @property GL_SRC_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_SRC_ALPHA: { value: 770},
        /**
         * Value 771
         * @property GL_ONE_MINUS_SRC_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_SRC_ALPHA: { value: 771},
        /**
         * Value 772
         * @property GL_DST_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_DST_ALPHA: { value: 772},
        /**
         * Value 773
         * @property GL_ONE_MINUS_DST_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_DST_ALPHA: { value: 773},
        /**
         * Value 774
         * @property GL_DST_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_DST_COLOR: { value: 774},
        /**
         * Value 775
         * @property GL_ONE_MINUS_DST_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_DST_COLOR: { value: 775},
        /**
         * Value 776
         * @property GL_SRC_ALPHA_SATURATE
         * @type Number
         * @static
         * @final
         */
        GL_SRC_ALPHA_SATURATE: { value: 776},
        /**
         * Value 32774
         * @property GL_FUNC_ADD
         * @type Number
         * @static
         * @final
         */
        GL_FUNC_ADD: { value: 32774},
        /**
         * Value 32777
         * @property GL_BLEND_EQUATION
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_EQUATION: { value: 32777},
        /**
         * Value 32777
         * @property GL_BLEND_EQUATION_RGB
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_EQUATION_RGB: { value: 32777},
        /**
         * Value 34877
         * @property GL_BLEND_EQUATION_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_EQUATION_ALPHA: { value: 34877},
        /**
         * Value 32778
         * @property GL_FUNC_SUBTRACT
         * @type Number
         * @static
         * @final
         */
        GL_FUNC_SUBTRACT: { value: 32778},
        /**
         * Value 32779
         * @property GL_FUNC_REVERSE_SUBTRACT
         * @type Number
         * @static
         * @final
         */
        GL_FUNC_REVERSE_SUBTRACT: { value: 32779},
        /**
         * Value 32968
         * @property GL_BLEND_DST_RGB
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_DST_RGB: { value: 32968},
        /**
         * Value 32969
         * @property GL_BLEND_SRC_RGB
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_SRC_RGB: { value: 32969},
        /**
         * Value 32970
         * @property GL_BLEND_DST_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_DST_ALPHA: { value: 32970},
        /**
         * Value 32971
         * @property GL_BLEND_SRC_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_SRC_ALPHA: { value: 32971},
        /**
         * Value 32769
         * @property GL_CONSTANT_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_CONSTANT_COLOR: { value: 32769},
        /**
         * Value 32770
         * @property GL_ONE_MINUS_CONSTANT_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_CONSTANT_COLOR: { value: 32770},
        /**
         * Value 32771
         * @property GL_CONSTANT_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_CONSTANT_ALPHA: { value: 32771},
        /**
         * Value 32772
         * @property GL_ONE_MINUS_CONSTANT_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_ONE_MINUS_CONSTANT_ALPHA: { value: 32772},
        /**
         * Value 32773
         * @property GL_BLEND_COLOR
         * @type Number
         * @static
         * @final
         */
        GL_BLEND_COLOR: { value: 32773},
        /**
         * Value 34962
         * @property GL_ARRAY_BUFFER
         * @type Number
         * @static
         * @final
         */
        GL_ARRAY_BUFFER: { value: 34962},
        /**
         * Value 34963
         * @property GL_ELEMENT_ARRAY_BUFFER
         * @type Number
         * @static
         * @final
         */
        GL_ELEMENT_ARRAY_BUFFER: { value: 34963},
        /**
         * Value 34964
         * @property GL_ARRAY_BUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_ARRAY_BUFFER_BINDING: { value: 34964},
        /**
         * Value 34965
         * @property GL_ELEMENT_ARRAY_BUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_ELEMENT_ARRAY_BUFFER_BINDING: { value: 34965},
        /**
         * Value 35040
         * @property GL_STREAM_DRAW
         * @type Number
         * @static
         * @final
         */
        GL_STREAM_DRAW: { value: 35040},
        /**
         * Value 35044
         * @property GL_STATIC_DRAW
         * @type Number
         * @static
         * @final
         */
        GL_STATIC_DRAW: { value: 35044},
        /**
         * Value 35048
         * @property GL_DYNAMIC_DRAW
         * @type Number
         * @static
         * @final
         */
        GL_DYNAMIC_DRAW: { value: 35048},
        /**
         * Value 34660
         * @property GL_BUFFER_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_BUFFER_SIZE: { value: 34660},
        /**
         * Value 34661
         * @property GL_BUFFER_USAGE
         * @type Number
         * @static
         * @final
         */
        GL_BUFFER_USAGE: { value: 34661},
        /**
         * Value 34342
         * @property GL_CURRENT_VERTEX_ATTRIB
         * @type Number
         * @static
         * @final
         */
        GL_CURRENT_VERTEX_ATTRIB: { value: 34342},
        /**
         * Value 1028
         * @property GL_FRONT
         * @type Number
         * @static
         * @final
         */
        GL_FRONT: { value: 1028},
        /**
         * Value 1029
         * @property GL_BACK
         * @type Number
         * @static
         * @final
         */
        GL_BACK: { value: 1029},
        /**
         * Value 1032
         * @property GL_FRONT_AND_BACK
         * @type Number
         * @static
         * @final
         */
        GL_FRONT_AND_BACK: { value: 1032},
        /**
         * Value 3553
         * @property GL_TEXTURE_2D
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_2D: { value: 3553},
        /**
         * Value 2884
         * @property GL_CULL_FACE
         * @type Number
         * @static
         * @final
         */
        GL_CULL_FACE: { value: 2884},
        /**
         * Value 3042
         * @property GL_BLEND
         * @type Number
         * @static
         * @final
         */
        GL_BLEND: { value: 3042},
        /**
         * Value 3024
         * @property GL_DITHER
         * @type Number
         * @static
         * @final
         */
        GL_DITHER: { value: 3024},
        /**
         * Value 2960
         * @property GL_STENCIL_TEST
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_TEST: { value: 2960},
        /**
         * Value 2929
         * @property GL_DEPTH_TEST
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_TEST: { value: 2929},
        /**
         * Value 3089
         * @property GL_SCISSOR_TEST
         * @type Number
         * @static
         * @final
         */
        GL_SCISSOR_TEST: { value: 3089},
        /**
         * Value 32823
         * @property GL_POLYGON_OFFSET_FILL
         * @type Number
         * @static
         * @final
         */
        GL_POLYGON_OFFSET_FILL: { value: 32823},
        /**
         * Value 32926
         * @property GL_SAMPLE_ALPHA_TO_COVERAGE
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_ALPHA_TO_COVERAGE: { value: 32926},
        /**
         * Value 32928
         * @property GL_SAMPLE_COVERAGE
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_COVERAGE: { value: 32928},
        /**
         * Value 0
         * @property GL_NO_ERROR
         * @type Number
         * @static
         * @final
         */
        GL_NO_ERROR: { value: 0},
        /**
         * Value 1280
         * @property GL_INVALID_ENUM
         * @type Number
         * @static
         * @final
         */
        GL_INVALID_ENUM: { value: 1280},
        /**
         * Value 1281
         * @property GL_INVALID_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_INVALID_VALUE: { value: 1281},
        /**
         * Value 1282
         * @property GL_INVALID_OPERATION
         * @type Number
         * @static
         * @final
         */
        GL_INVALID_OPERATION: { value: 1282},
        /**
         * Value 1285
         * @property GL_OUT_OF_MEMORY
         * @type Number
         * @static
         * @final
         */
        GL_OUT_OF_MEMORY: { value: 1285},
        /**
         * Value 2304
         * @property GL_CW
         * @type Number
         * @static
         * @final
         */
        GL_CW: { value: 2304},
        /**
         * Value 2305
         * @property GL_CCW
         * @type Number
         * @static
         * @final
         */
        GL_CCW: { value: 2305},
        /**
         * Value 2849
         * @property GL_LINE_WIDTH
         * @type Number
         * @static
         * @final
         */
        GL_LINE_WIDTH: { value: 2849},
        /**
         * Value 33901
         * @property GL_ALIASED_POINT_SIZE_RANGE
         * @type Number
         * @static
         * @final
         */
        GL_ALIASED_POINT_SIZE_RANGE: { value: 33901},
        /**
         * Value 33902
         * @property GL_ALIASED_LINE_WIDTH_RANGE
         * @type Number
         * @static
         * @final
         */
        GL_ALIASED_LINE_WIDTH_RANGE: { value: 33902},
        /**
         * Value 2885
         * @property GL_CULL_FACE_MODE
         * @type Number
         * @static
         * @final
         */
        GL_CULL_FACE_MODE: { value: 2885},
        /**
         * Value 2886
         * @property GL_FRONT_FACE
         * @type Number
         * @static
         * @final
         */
        GL_FRONT_FACE: { value: 2886},
        /**
         * Value 2928
         * @property GL_DEPTH_RANGE
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_RANGE: { value: 2928},
        /**
         * Value 2930
         * @property GL_DEPTH_WRITEMASK
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_WRITEMASK: { value: 2930},
        /**
         * Value 2931
         * @property GL_DEPTH_CLEAR_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_CLEAR_VALUE: { value: 2931},
        /**
         * Value 2932
         * @property GL_DEPTH_FUNC
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_FUNC: { value: 2932},
        /**
         * Value 2961
         * @property GL_STENCIL_CLEAR_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_CLEAR_VALUE: { value: 2961},
        /**
         * Value 2962
         * @property GL_STENCIL_FUNC
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_FUNC: { value: 2962},
        /**
         * Value 2964
         * @property GL_STENCIL_FAIL
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_FAIL: { value: 2964},
        /**
         * Value 2965
         * @property GL_STENCIL_PASS_DEPTH_FAIL
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_PASS_DEPTH_FAIL: { value: 2965},
        /**
         * Value 2966
         * @property GL_STENCIL_PASS_DEPTH_PASS
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_PASS_DEPTH_PASS: { value: 2966},
        /**
         * Value 2967
         * @property GL_STENCIL_REF
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_REF: { value: 2967},
        /**
         * Value 2963
         * @property GL_STENCIL_VALUE_MASK
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_VALUE_MASK: { value: 2963},
        /**
         * Value 2968
         * @property GL_STENCIL_WRITEMASK
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_WRITEMASK: { value: 2968},
        /**
         * Value 34816
         * @property GL_STENCIL_BACK_FUNC
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_FUNC: { value: 34816},
        /**
         * Value 34817
         * @property GL_STENCIL_BACK_FAIL
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_FAIL: { value: 34817},
        /**
         * Value 34818
         * @property GL_STENCIL_BACK_PASS_DEPTH_FAIL
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_PASS_DEPTH_FAIL: { value: 34818},
        /**
         * Value 34819
         * @property GL_STENCIL_BACK_PASS_DEPTH_PASS
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_PASS_DEPTH_PASS: { value: 34819},
        /**
         * Value 36003
         * @property GL_STENCIL_BACK_REF
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_REF: { value: 36003},
        /**
         * Value 36004
         * @property GL_STENCIL_BACK_VALUE_MASK
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_VALUE_MASK: { value: 36004},
        /**
         * Value 36005
         * @property GL_STENCIL_BACK_WRITEMASK
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BACK_WRITEMASK: { value: 36005},
        /**
         * Value 2978
         * @property GL_VIEWPORT
         * @type Number
         * @static
         * @final
         */
        GL_VIEWPORT: { value: 2978},
        /**
         * Value 3088
         * @property GL_SCISSOR_BOX
         * @type Number
         * @static
         * @final
         */
        GL_SCISSOR_BOX: { value: 3088},
        /**
         * Value 3106
         * @property GL_COLOR_CLEAR_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_COLOR_CLEAR_VALUE: { value: 3106},
        /**
         * Value 3107
         * @property GL_COLOR_WRITEMASK
         * @type Number
         * @static
         * @final
         */
        GL_COLOR_WRITEMASK: { value: 3107},
        /**
         * Value 3317
         * @property GL_UNPACK_ALIGNMENT
         * @type Number
         * @static
         * @final
         */
        GL_UNPACK_ALIGNMENT: { value: 3317},
        /**
         * Value 3333
         * @property GL_PACK_ALIGNMENT
         * @type Number
         * @static
         * @final
         */
        GL_PACK_ALIGNMENT: { value: 3333},
        /**
         * Value 3379
         * @property GL_MAX_TEXTURE_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_MAX_TEXTURE_SIZE: { value: 3379},
        /**
         * Value 3386
         * @property GL_MAX_VIEWPORT_DIMS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VIEWPORT_DIMS: { value: 3386},
        /**
         * Value 3408
         * @property GL_SUBPIXEL_BITS
         * @type Number
         * @static
         * @final
         */
        GL_SUBPIXEL_BITS: { value: 3408},
        /**
         * Value 3410
         * @property GL_RED_BITS
         * @type Number
         * @static
         * @final
         */
        GL_RED_BITS: { value: 3410},
        /**
         * Value 3411
         * @property GL_GREEN_BITS
         * @type Number
         * @static
         * @final
         */
        GL_GREEN_BITS: { value: 3411},
        /**
         * Value 3412
         * @property GL_BLUE_BITS
         * @type Number
         * @static
         * @final
         */
        GL_BLUE_BITS: { value: 3412},
        /**
         * Value 3413
         * @property GL_ALPHA_BITS
         * @type Number
         * @static
         * @final
         */
        GL_ALPHA_BITS: { value: 3413},
        /**
         * Value 3414
         * @property GL_DEPTH_BITS
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_BITS: { value: 3414},
        /**
         * Value 3415
         * @property GL_STENCIL_BITS
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_BITS: { value: 3415},
        /**
         * Value 10752
         * @property GL_POLYGON_OFFSET_UNITS
         * @type Number
         * @static
         * @final
         */
        GL_POLYGON_OFFSET_UNITS: { value: 10752},
        /**
         * Value 32824
         * @property GL_POLYGON_OFFSET_FACTOR
         * @type Number
         * @static
         * @final
         */
        GL_POLYGON_OFFSET_FACTOR: { value: 32824},
        /**
         * Value 32873
         * @property GL_TEXTURE_BINDING_2D
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_BINDING_2D: { value: 32873},
        /**
         * Value 32936
         * @property GL_SAMPLE_BUFFERS
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_BUFFERS: { value: 32936},
        /**
         * Value 32937
         * @property GL_SAMPLES
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLES: { value: 32937},
        /**
         * Value 32938
         * @property GL_SAMPLE_COVERAGE_VALUE
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_COVERAGE_VALUE: { value: 32938},
        /**
         * Value 32939
         * @property GL_SAMPLE_COVERAGE_INVERT
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLE_COVERAGE_INVERT: { value: 32939},
        /**
         * Value 34466
         * @property GL_NUM_COMPRESSED_TEXTURE_FORMATS
         * @type Number
         * @static
         * @final
         */
        GL_NUM_COMPRESSED_TEXTURE_FORMATS: { value: 34466},
        /**
         * Value 34467
         * @property GL_COMPRESSED_TEXTURE_FORMATS
         * @type Number
         * @static
         * @final
         */
        GL_COMPRESSED_TEXTURE_FORMATS: { value: 34467},
        /**
         * Value 4352
         * @property GL_DONT_CARE
         * @type Number
         * @static
         * @final
         */
        GL_DONT_CARE: { value: 4352},
        /**
         * Value 4353
         * @property GL_FASTEST
         * @type Number
         * @static
         * @final
         */
        GL_FASTEST: { value: 4353},
        /**
         * Value 4354
         * @property GL_NICEST
         * @type Number
         * @static
         * @final
         */
        GL_NICEST: { value: 4354},
        /**
         * Value 33170
         * @property GL_GENERATE_MIPMAP_HINT
         * @type Number
         * @static
         * @final
         */
        GL_GENERATE_MIPMAP_HINT: { value: 33170},
        /**
         * Value 5120
         * @property GL_BYTE
         * @type Number
         * @static
         * @final
         */
        GL_BYTE: { value: 5120},
        /**
         * Value 5121
         * @property GL_UNSIGNED_BYTE
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_BYTE: { value: 5121},
        /**
         * Value 5122
         * @property GL_SHORT
         * @type Number
         * @static
         * @final
         */
        GL_SHORT: { value: 5122},
        /**
         * Value 5123
         * @property GL_UNSIGNED_SHORT
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_SHORT: { value: 5123},
        /**
         * Value 5124
         * @property GL_INT
         * @type Number
         * @static
         * @final
         */
        GL_INT: { value: 5124},
        /**
         * Value 5125
         * @property GL_UNSIGNED_INT
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_INT: { value: 5125},
        /**
         * Value 5126
         * @property GL_FLOAT
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT: { value: 5126},
        /**
         * Value 6402
         * @property GL_DEPTH_COMPONENT
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_COMPONENT: { value: 6402},
        /**
         * Value 6406
         * @property GL_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_ALPHA: { value: 6406},
        /**
         * Value 6407
         * @property GL_RGB
         * @type Number
         * @static
         * @final
         */
        GL_RGB: { value: 6407},
        /**
         * Value 6408
         * @property GL_RGBA
         * @type Number
         * @static
         * @final
         */
        GL_RGBA: { value: 6408},
        /**
         * Value 6409
         * @property GL_LUMINANCE
         * @type Number
         * @static
         * @final
         */
        GL_LUMINANCE: { value: 6409},
        /**
         * Value 6410
         * @property GL_LUMINANCE_ALPHA
         * @type Number
         * @static
         * @final
         */
        GL_LUMINANCE_ALPHA: { value: 6410},
        /**
         * Value 32819
         * @property GL_UNSIGNED_SHORT_4_4_4_4
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_SHORT_4_4_4_4: { value: 32819},
        /**
         * Value 32820
         * @property GL_UNSIGNED_SHORT_5_5_5_1
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_SHORT_5_5_5_1: { value: 32820},
        /**
         * Value 33635
         * @property GL_UNSIGNED_SHORT_5_6_5
         * @type Number
         * @static
         * @final
         */
        GL_UNSIGNED_SHORT_5_6_5: { value: 33635},
        /**
         * Value 35632
         * @property GL_FRAGMENT_SHADER
         * @type Number
         * @static
         * @final
         */
        GL_FRAGMENT_SHADER: { value: 35632},
        /**
         * Value 35633
         * @property GL_VERTEX_SHADER
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_SHADER: { value: 35633},
        /**
         * Value 34921
         * @property GL_MAX_VERTEX_ATTRIBS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VERTEX_ATTRIBS: { value: 34921},
        /**
         * Value 36347
         * @property GL_MAX_VERTEX_UNIFORM_VECTORS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VERTEX_UNIFORM_VECTORS: { value: 36347},
        /**
         * Value 36348
         * @property GL_MAX_VARYING_VECTORS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VARYING_VECTORS: { value: 36348},
        /**
         * Value 35661
         * @property GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS: { value: 35661},
        /**
         * Value 35660
         * @property GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS: { value: 35660},
        /**
         * Value 34930
         * @property GL_MAX_TEXTURE_IMAGE_UNITS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_TEXTURE_IMAGE_UNITS: { value: 34930},
        /**
         * Value 36349
         * @property GL_MAX_FRAGMENT_UNIFORM_VECTORS
         * @type Number
         * @static
         * @final
         */
        GL_MAX_FRAGMENT_UNIFORM_VECTORS: { value: 36349},
        /**
         * Value 35663
         * @property GL_SHADER_TYPE
         * @type Number
         * @static
         * @final
         */
        GL_SHADER_TYPE: { value: 35663},
        /**
         * Value 35712
         * @property GL_DELETE_STATUS
         * @type Number
         * @static
         * @final
         */
        GL_DELETE_STATUS: { value: 35712},
        /**
         * Value 35714
         * @property GL_LINK_STATUS
         * @type Number
         * @static
         * @final
         */
        GL_LINK_STATUS: { value: 35714},
        /**
         * Value 35715
         * @property GL_VALIDATE_STATUS
         * @type Number
         * @static
         * @final
         */
        GL_VALIDATE_STATUS: { value: 35715},
        /**
         * Value 35717
         * @property GL_ATTACHED_SHADERS
         * @type Number
         * @static
         * @final
         */
        GL_ATTACHED_SHADERS: { value: 35717},
        /**
         * Value 35718
         * @property GL_ACTIVE_UNIFORMS
         * @type Number
         * @static
         * @final
         */
        GL_ACTIVE_UNIFORMS: { value: 35718},
        /**
         * Value 35721
         * @property GL_ACTIVE_ATTRIBUTES
         * @type Number
         * @static
         * @final
         */
        GL_ACTIVE_ATTRIBUTES: { value: 35721},
        /**
         * Value 35724
         * @property GL_SHADING_LANGUAGE_VERSION
         * @type Number
         * @static
         * @final
         */
        GL_SHADING_LANGUAGE_VERSION: { value: 35724},
        /**
         * Value 35725
         * @property GL_CURRENT_PROGRAM
         * @type Number
         * @static
         * @final
         */
        GL_CURRENT_PROGRAM: { value: 35725},
        /**
         * Value 512
         * @property GL_NEVER
         * @type Number
         * @static
         * @final
         */
        GL_NEVER: { value: 512},
        /**
         * Value 513
         * @property GL_LESS
         * @type Number
         * @static
         * @final
         */
        GL_LESS: { value: 513},
        /**
         * Value 514
         * @property GL_EQUAL
         * @type Number
         * @static
         * @final
         */
        GL_EQUAL: { value: 514},
        /**
         * Value 515
         * @property GL_LEQUAL
         * @type Number
         * @static
         * @final
         */
        GL_LEQUAL: { value: 515},
        /**
         * Value 516
         * @property GL_GREATER
         * @type Number
         * @static
         * @final
         */
        GL_GREATER: { value: 516},
        /**
         * Value 517
         * @property GL_NOTEQUAL
         * @type Number
         * @static
         * @final
         */
        GL_NOTEQUAL: { value: 517},
        /**
         * Value 518
         * @property GL_GEQUAL
         * @type Number
         * @static
         * @final
         */
        GL_GEQUAL: { value: 518},
        /**
         * Value 519
         * @property GL_ALWAYS
         * @type Number
         * @static
         * @final
         */
        GL_ALWAYS: { value: 519},
        /**
         * Value 7680
         * @property GL_KEEP
         * @type Number
         * @static
         * @final
         */
        GL_KEEP: { value: 7680},
        /**
         * Value 7681
         * @property GL_REPLACE
         * @type Number
         * @static
         * @final
         */
        GL_REPLACE: { value: 7681},
        /**
         * Value 7682
         * @property GL_INCR
         * @type Number
         * @static
         * @final
         */
        GL_INCR: { value: 7682},
        /**
         * Value 7683
         * @property GL_DECR
         * @type Number
         * @static
         * @final
         */
        GL_DECR: { value: 7683},
        /**
         * Value 5386
         * @property GL_INVERT
         * @type Number
         * @static
         * @final
         */
        GL_INVERT: { value: 5386},
        /**
         * Value 34055
         * @property GL_INCR_WRAP
         * @type Number
         * @static
         * @final
         */
        GL_INCR_WRAP: { value: 34055},
        /**
         * Value 34056
         * @property GL_DECR_WRAP
         * @type Number
         * @static
         * @final
         */
        GL_DECR_WRAP: { value: 34056},
        /**
         * Value 7936
         * @property GL_VENDOR
         * @type Number
         * @static
         * @final
         */
        GL_VENDOR: { value: 7936},
        /**
         * Value 7937
         * @property GL_RENDERER
         * @type Number
         * @static
         * @final
         */
        GL_RENDERER: { value: 7937},
        /**
         * Value 7938
         * @property GL_VERSION
         * @type Number
         * @static
         * @final
         */
        GL_VERSION: { value: 7938},
        /**
         * Value 9728
         * @property GL_NEAREST
         * @type Number
         * @static
         * @final
         */
        GL_NEAREST: { value: 9728},
        /**
         * Value 9729
         * @property GL_LINEAR
         * @type Number
         * @static
         * @final
         */
        GL_LINEAR: { value: 9729},
        /**
         * Value 9984
         * @property GL_NEAREST_MIPMAP_NEAREST
         * @type Number
         * @static
         * @final
         */
        GL_NEAREST_MIPMAP_NEAREST: { value: 9984},
        /**
         * Value 9985
         * @property GL_LINEAR_MIPMAP_NEAREST
         * @type Number
         * @static
         * @final
         */
        GL_LINEAR_MIPMAP_NEAREST: { value: 9985},
        /**
         * Value 9986
         * @property GL_NEAREST_MIPMAP_LINEAR
         * @type Number
         * @static
         * @final
         */
        GL_NEAREST_MIPMAP_LINEAR: { value: 9986},
        /**
         * Value 9987
         * @property GL_LINEAR_MIPMAP_LINEAR
         * @type Number
         * @static
         * @final
         */
        GL_LINEAR_MIPMAP_LINEAR: { value: 9987},
        /**
         * Value 10240
         * @property GL_TEXTURE_MAG_FILTER
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_MAG_FILTER: { value: 10240},
        /**
         * Value 10241
         * @property GL_TEXTURE_MIN_FILTER
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_MIN_FILTER: { value: 10241},
        /**
         * Value 10242
         * @property GL_TEXTURE_WRAP_S
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_WRAP_S: { value: 10242},
        /**
         * Value 10243
         * @property GL_TEXTURE_WRAP_T
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_WRAP_T: { value: 10243},
        /**
         * Value 5890
         * @property GL_TEXTURE
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE: { value: 5890},
        /**
         * Value 34067
         * @property GL_TEXTURE_CUBE_MAP
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP: { value: 34067},
        /**
         * Value 34068
         * @property GL_TEXTURE_BINDING_CUBE_MAP
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_BINDING_CUBE_MAP: { value: 34068},
        /**
         * Value 34069
         * @property GL_TEXTURE_CUBE_MAP_POSITIVE_X
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_POSITIVE_X: { value: 34069},
        /**
         * Value 34070
         * @property GL_TEXTURE_CUBE_MAP_NEGATIVE_X
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_NEGATIVE_X: { value: 34070},
        /**
         * Value 34071
         * @property GL_TEXTURE_CUBE_MAP_POSITIVE_Y
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_POSITIVE_Y: { value: 34071},
        /**
         * Value 34072
         * @property GL_TEXTURE_CUBE_MAP_NEGATIVE_Y
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_NEGATIVE_Y: { value: 34072},
        /**
         * Value 34073
         * @property GL_TEXTURE_CUBE_MAP_POSITIVE_Z
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_POSITIVE_Z: { value: 34073},
        /**
         * Value 34074
         * @property GL_TEXTURE_CUBE_MAP_NEGATIVE_Z
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE_CUBE_MAP_NEGATIVE_Z: { value: 34074},
        /**
         * Value 34076
         * @property GL_MAX_CUBE_MAP_TEXTURE_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_MAX_CUBE_MAP_TEXTURE_SIZE: { value: 34076},
        /**
         * Value 33984
         * @property GL_TEXTURE0
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE0: { value: 33984},
        /**
         * Value 33985
         * @property GL_TEXTURE1
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE1: { value: 33985},
        /**
         * Value 33986
         * @property GL_TEXTURE2
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE2: { value: 33986},
        /**
         * Value 33987
         * @property GL_TEXTURE3
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE3: { value: 33987},
        /**
         * Value 33988
         * @property GL_TEXTURE4
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE4: { value: 33988},
        /**
         * Value 33989
         * @property GL_TEXTURE5
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE5: { value: 33989},
        /**
         * Value 33990
         * @property GL_TEXTURE6
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE6: { value: 33990},
        /**
         * Value 33991
         * @property GL_TEXTURE7
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE7: { value: 33991},
        /**
         * Value 33992
         * @property GL_TEXTURE8
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE8: { value: 33992},
        /**
         * Value 33993
         * @property GL_TEXTURE9
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE9: { value: 33993},
        /**
         * Value 33994
         * @property GL_TEXTURE10
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE10: { value: 33994},
        /**
         * Value 33995
         * @property GL_TEXTURE11
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE11: { value: 33995},
        /**
         * Value 33996
         * @property GL_TEXTURE12
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE12: { value: 33996},
        /**
         * Value 33997
         * @property GL_TEXTURE13
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE13: { value: 33997},
        /**
         * Value 33998
         * @property GL_TEXTURE14
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE14: { value: 33998},
        /**
         * Value 33999
         * @property GL_TEXTURE15
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE15: { value: 33999},
        /**
         * Value 34000
         * @property GL_TEXTURE16
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE16: { value: 34000},
        /**
         * Value 34001
         * @property GL_TEXTURE17
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE17: { value: 34001},
        /**
         * Value 34002
         * @property GL_TEXTURE18
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE18: { value: 34002},
        /**
         * Value 34003
         * @property GL_TEXTURE19
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE19: { value: 34003},
        /**
         * Value 34004
         * @property GL_TEXTURE20
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE20: { value: 34004},
        /**
         * Value 34005
         * @property GL_TEXTURE21
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE21: { value: 34005},
        /**
         * Value 34006
         * @property GL_TEXTURE22
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE22: { value: 34006},
        /**
         * Value 34007
         * @property GL_TEXTURE23
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE23: { value: 34007},
        /**
         * Value 34008
         * @property GL_TEXTURE24
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE24: { value: 34008},
        /**
         * Value 34009
         * @property GL_TEXTURE25
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE25: { value: 34009},
        /**
         * Value 34010
         * @property GL_TEXTURE26
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE26: { value: 34010},
        /**
         * Value 34011
         * @property GL_TEXTURE27
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE27: { value: 34011},
        /**
         * Value 34012
         * @property GL_TEXTURE28
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE28: { value: 34012},
        /**
         * Value 34013
         * @property GL_TEXTURE29
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE29: { value: 34013},
        /**
         * Value 34014
         * @property GL_TEXTURE30
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE30: { value: 34014},
        /**
         * Value 34015
         * @property GL_TEXTURE31
         * @type Number
         * @static
         * @final
         */
        GL_TEXTURE31: { value: 34015},
        /**
         * Value 34016
         * @property GL_ACTIVE_TEXTURE
         * @type Number
         * @static
         * @final
         */
        GL_ACTIVE_TEXTURE: { value: 34016},
        /**
         * Value 10497
         * @property GL_REPEAT
         * @type Number
         * @static
         * @final
         */
        GL_REPEAT: { value: 10497},
        /**
         * Value 33071
         * @property GL_CLAMP_TO_EDGE
         * @type Number
         * @static
         * @final
         */
        GL_CLAMP_TO_EDGE: { value: 33071},
        /**
         * Value 33648
         * @property GL_MIRRORED_REPEAT
         * @type Number
         * @static
         * @final
         */
        GL_MIRRORED_REPEAT: { value: 33648},
        /**
         * Value 35664
         * @property GL_FLOAT_VEC2
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_VEC2: { value: 35664},
        /**
         * Value 35665
         * @property GL_FLOAT_VEC3
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_VEC3: { value: 35665},
        /**
         * Value 35666
         * @property GL_FLOAT_VEC4
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_VEC4: { value: 35666},
        /**
         * Value 35667
         * @property GL_INT_VEC2
         * @type Number
         * @static
         * @final
         */
        GL_INT_VEC2: { value: 35667},
        /**
         * Value 35668
         * @property GL_INT_VEC3
         * @type Number
         * @static
         * @final
         */
        GL_INT_VEC3: { value: 35668},
        /**
         * Value 35669
         * @property GL_INT_VEC4
         * @type Number
         * @static
         * @final
         */
        GL_INT_VEC4: { value: 35669},
        /**
         * Value 35670
         * @property GL_BOOL
         * @type Number
         * @static
         * @final
         */
        GL_BOOL: { value: 35670},
        /**
         * Value 35671
         * @property GL_BOOL_VEC2
         * @type Number
         * @static
         * @final
         */
        GL_BOOL_VEC2: { value: 35671},
        /**
         * Value 35672
         * @property GL_BOOL_VEC3
         * @type Number
         * @static
         * @final
         */
        GL_BOOL_VEC3: { value: 35672},
        /**
         * Value 35673
         * @property GL_BOOL_VEC4
         * @type Number
         * @static
         * @final
         */
        GL_BOOL_VEC4: { value: 35673},
        /**
         * Value 35674
         * @property GL_FLOAT_MAT2
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_MAT2: { value: 35674},
        /**
         * Value 35675
         * @property GL_FLOAT_MAT3
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_MAT3: { value: 35675},
        /**
         * Value 35676
         * @property GL_FLOAT_MAT4
         * @type Number
         * @static
         * @final
         */
        GL_FLOAT_MAT4: { value: 35676},
        /**
         * Value 35678
         * @property GL_SAMPLER_2D
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLER_2D: { value: 35678},
        /**
         * Value 35680
         * @property GL_SAMPLER_CUBE
         * @type Number
         * @static
         * @final
         */
        GL_SAMPLER_CUBE: { value: 35680},
        /**
         * Value 34338
         * @property GL_VERTEX_ATTRIB_ARRAY_ENABLED
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_ENABLED: { value: 34338},
        /**
         * Value 34339
         * @property GL_VERTEX_ATTRIB_ARRAY_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_SIZE: { value: 34339},
        /**
         * Value 34340
         * @property GL_VERTEX_ATTRIB_ARRAY_STRIDE
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_STRIDE: { value: 34340},
        /**
         * Value 34341
         * @property GL_VERTEX_ATTRIB_ARRAY_TYPE
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_TYPE: { value: 34341},
        /**
         * Value 34922
         * @property GL_VERTEX_ATTRIB_ARRAY_NORMALIZED
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_NORMALIZED: { value: 34922},
        /**
         * Value 34373
         * @property GL_VERTEX_ATTRIB_ARRAY_POINTER
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_POINTER: { value: 34373},
        /**
         * Value 34975
         * @property GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: { value: 34975},
        /**
         * Value 35713
         * @property GL_COMPILE_STATUS
         * @type Number
         * @static
         * @final
         */
        GL_COMPILE_STATUS: { value: 35713},
        /**
         * Value 36346
         * @property GL_SHADER_COMPILER
         * @type Number
         * @static
         * @final
         */
        GL_SHADER_COMPILER: { value: 36346},
        /**
         * Value 36336
         * @property GL_LOW_FLOAT
         * @type Number
         * @static
         * @final
         */
        GL_LOW_FLOAT: { value: 36336},
        /**
         * Value 36337
         * @property GL_MEDIUM_FLOAT
         * @type Number
         * @static
         * @final
         */
        GL_MEDIUM_FLOAT: { value: 36337},
        /**
         * Value 36338
         * @property GL_HIGH_FLOAT
         * @type Number
         * @static
         * @final
         */
        GL_HIGH_FLOAT: { value: 36338},
        /**
         * Value 36339
         * @property GL_LOW_INT
         * @type Number
         * @static
         * @final
         */
        GL_LOW_INT: { value: 36339},
        /**
         * Value 36340
         * @property GL_MEDIUM_INT
         * @type Number
         * @static
         * @final
         */
        GL_MEDIUM_INT: { value: 36340},
        /**
         * Value 36341
         * @property GL_HIGH_INT
         * @type Number
         * @static
         * @final
         */
        GL_HIGH_INT: { value: 36341},
        /**
         * Value 36160
         * @property GL_FRAMEBUFFER
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER: { value: 36160},
        /**
         * Value 36161
         * @property GL_RENDERBUFFER
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER: { value: 36161},
        /**
         * Value 32854
         * @property GL_RGBA4
         * @type Number
         * @static
         * @final
         */
        GL_RGBA4: { value: 32854},
        /**
         * Value 32855
         * @property GL_RGB5_A1
         * @type Number
         * @static
         * @final
         */
        GL_RGB5_A1: { value: 32855},
        /**
         * Value 36194
         * @property GL_RGB565
         * @type Number
         * @static
         * @final
         */
        GL_RGB565: { value: 36194},
        /**
         * Value 33189
         * @property GL_DEPTH_COMPONENT16
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_COMPONENT16: { value: 33189},
        /**
         * Value 6401
         * @property GL_STENCIL_INDEX
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_INDEX: { value: 6401},
        /**
         * Value 36168
         * @property GL_STENCIL_INDEX8
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_INDEX8: { value: 36168},
        /**
         * Value 34041
         * @property GL_DEPTH_STENCIL
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_STENCIL: { value: 34041},
        /**
         * Value 36162
         * @property GL_RENDERBUFFER_WIDTH
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_WIDTH: { value: 36162},
        /**
         * Value 36163
         * @property GL_RENDERBUFFER_HEIGHT
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_HEIGHT: { value: 36163},
        /**
         * Value 36164
         * @property GL_RENDERBUFFER_INTERNAL_FORMAT
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_INTERNAL_FORMAT: { value: 36164},
        /**
         * Value 36176
         * @property GL_RENDERBUFFER_RED_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_RED_SIZE: { value: 36176},
        /**
         * Value 36177
         * @property GL_RENDERBUFFER_GREEN_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_GREEN_SIZE: { value: 36177},
        /**
         * Value 36178
         * @property GL_RENDERBUFFER_BLUE_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_BLUE_SIZE: { value: 36178},
        /**
         * Value 36179
         * @property GL_RENDERBUFFER_ALPHA_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_ALPHA_SIZE: { value: 36179},
        /**
         * Value 36180
         * @property GL_RENDERBUFFER_DEPTH_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_DEPTH_SIZE: { value: 36180},
        /**
         * Value 36181
         * @property GL_RENDERBUFFER_STENCIL_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_STENCIL_SIZE: { value: 36181},
        /**
         * Value 36048
         * @property GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: { value: 36048},
        /**
         * Value 36049
         * @property GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: { value: 36049},
        /**
         * Value 36050
         * @property GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: { value: 36050},
        /**
         * Value 36051
         * @property GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: { value: 36051},
        /**
         * Value 36064
         * @property GL_COLOR_ATTACHMENT0
         * @type Number
         * @static
         * @final
         */
        GL_COLOR_ATTACHMENT0: { value: 36064},
        /**
         * Value 36096
         * @property GL_DEPTH_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_ATTACHMENT: { value: 36096},
        /**
         * Value 36128
         * @property GL_STENCIL_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_STENCIL_ATTACHMENT: { value: 36128},
        /**
         * Value 33306
         * @property GL_DEPTH_STENCIL_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_DEPTH_STENCIL_ATTACHMENT: { value: 33306},
        /**
         * Value 0
         * @property GL_NONE
         * @type Number
         * @static
         * @final
         */
        GL_NONE: { value: 0},
        /**
         * Value 36053
         * @property GL_FRAMEBUFFER_COMPLETE
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_COMPLETE: { value: 36053},
        /**
         * Value 36054
         * @property GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT: { value: 36054},
        /**
         * Value 36055
         * @property GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: { value: 36055},
        /**
         * Value 36057
         * @property GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS: { value: 36057},
        /**
         * Value 36061
         * @property GL_FRAMEBUFFER_UNSUPPORTED
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_UNSUPPORTED: { value: 36061},
        /**
         * Value 36006
         * @property GL_FRAMEBUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_FRAMEBUFFER_BINDING: { value: 36006},
        /**
         * Value 36007
         * @property GL_RENDERBUFFER_BINDING
         * @type Number
         * @static
         * @final
         */
        GL_RENDERBUFFER_BINDING: { value: 36007},
        /**
         * Value 34024
         * @property GL_MAX_RENDERBUFFER_SIZE
         * @type Number
         * @static
         * @final
         */
        GL_MAX_RENDERBUFFER_SIZE: { value: 34024},
        /**
         * Value 1286
         * @property GL_INVALID_FRAMEBUFFER_OPERATION
         * @type Number
         * @static
         * @final
         */
        GL_INVALID_FRAMEBUFFER_OPERATION: { value: 1286},
        /**
         * Value 37440
         * @property GL_UNPACK_FLIP_Y_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_UNPACK_FLIP_Y_WEBGL: { value: 37440},
        /**
         * Value 37441
         * @property GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL: { value: 37441},
        /**
         * Value 37442
         * @property GL_CONTEXT_LOST_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_CONTEXT_LOST_WEBGL: { value: 37442},
        /**
         * Value 37443
         * @property GL_UNPACK_COLORSPACE_CONVERSION_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_UNPACK_COLORSPACE_CONVERSION_WEBGL: { value: 37443},
        /**
         * Value 37444
         * @property GL_BROWSER_DEFAULT_WEBGL
         * @type Number
         * @static
         * @final
         */
        GL_BROWSER_DEFAULT_WEBGL: { value: 37444}
    });
}());
