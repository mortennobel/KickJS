requirejs.config({
    baseUrl: '.',
    paths: {
        kick: location.search === "?debug" ? '../../src/js/kick': '../../build/kick'
    }
});

requirejs(['kick'],
    function (kick) {
        "use strict";
        var constants = kick.core.Constants,
                engine = new kick.core.Engine('canvas',{
            }),
            glState = engine.glState;
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
        var nameMap = {
            vertexArrayObjectExtension: {
                name:"OES_vertex_array_object",
                link:"http://www.khronos.org/registry/webgl/extensions/OES_vertex_array_object/"
            },
            standardDerivativesExtension: {
                name:"OES_standard_derivatives",
                link:"http://www.khronos.org/registry/webgl/extensions/OES_standard_derivatives/"
            },
            textureFloatExtension: {
                name:"OES_texture_float",
                link:"http://www.khronos.org/registry/webgl/extensions/OES_texture_float/"
            },
            textureFloatHalfExtension: {
                name:"OES_texture_half_float",
                link:"http://www.khronos.org/registry/webgl/extensions/OES_texture_half_float/"
            },
            depthTextureExtension: {
                name:"WEBGL_depth_texture",
                link:"http://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/"
            },
            elementIndexUIntExtension: {
                name:"OES_element_index_uint",
                link:"http://www.khronos.org/registry/webgl/extensions/OES_element_index_uint/"
            },
            textureFilterAnisotropicExtension: {
                name:"EXT_texture_filter_anisotropic",
                link:"http://www.khronos.org/registry/webgl/extensions/EXT_texture_filter_anisotropic/",
                info: function(){
                    return "Maximum amount of anisotropy supported "+engine.gl.getParameter(constants.GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                }
            },
            drawBuffersExtension: {
                name:"EXT_draw_buffers<br>WEBGL_draw_buffers",
                link:"http://www.khronos.org/registry/webgl/extensions/WEBGL_draw_buffers/",
                info: function(){
                    return "Max color attachments: " + engine.gl.getParameter(constants.GL_MAX_COLOR_ATTACHMENTS)+"<br>"+
                        "Max draw buffers: "+engine.gl.getParameter(constants.GL_MAX_DRAW_BUFFERS);
                }
            },
            colorBufferFloatExtension: {
                name:"WEBGL_color_buffer_float",
                link:"http://www.khronos.org/registry/webgl/extensions/WEBGL_color_buffer_float/"
            },
            colorBufferHalfFloatExtension:{
                name: "EXT_color_buffer_half_float",
                link: "http://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_half_float/"
            },
            instancedArraysExtension:{
                name: "ANGLE_instanced_arrays",
                link: "http://www.khronos.org/registry/webgl/extensions/ANGLE_instanced_arrays/"
            }

        };

        var data = [];
        for (var name in glState){
            if (glState.hasOwnProperty(name)){
                if (name.endsWith("Extension")){
                    data.push({
                        "KickJS name": name,
                        "WebGL extension name": nameMap[name].name,
                        Supported: glState[name] ? true:false,
                        Info: (glState[name] && nameMap[name].info) ? nameMap[name].info() : "",
                        Link: nameMap[name].link
                    });
                }
            }
        }
        YUI().use("datatable", function (Y) {
            var table = new Y.DataTable({
                columns: ["KickJS name",
                    {key:"WebGL extension name",allowHTML: true },
                    {key:"Info",allowHTML: true },
                    "Supported", { key: "Link", formatter: '<a href="{value}">Documentation</a>',allowHTML: true }],
                data: data,
                caption:"WebGL Extensions"
            }).render('#template');

        });
        document.getElementById('canvas').height = 0;
    });