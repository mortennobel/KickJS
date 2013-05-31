requirejs.config({
    baseUrl: '.',
    paths: {
        kick: location.search === "?debug" ? '../../build/kick-debug': '../../build/kick'
    }
});

requirejs(['kick'],
    function (kick) {
        "use strict";
        var engine = new kick.core.Engine('canvas',{
        });
        var glState = engine.glState;
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
        var nameMap = {
            vertexArrayObjectExtension: {name:"OES_vertex_array_object",link:"http://www.khronos.org/registry/webgl/extensions/OES_vertex_array_object/"},
            standardDerivativesExtension: {name:"OES_standard_derivatives",link:"http://www.khronos.org/registry/webgl/extensions/OES_standard_derivatives/"},
            textureFloatExtension: {name:"OES_texture_float",link:"http://www.khronos.org/registry/webgl/extensions/OES_texture_float/"},
            textureFloatHalfExtension: {name:"OES_texture_half_float",link:"http://www.khronos.org/registry/webgl/extensions/OES_texture_half_float/"},
            depthTextureExtension: {name:"WEBGL_depth_texture",link:"http://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/"},
            textureFilterAnisotropicExtension: {name:"EXT_texture_filter_anisotropic",link:"http://www.khronos.org/registry/webgl/extensions/EXT_texture_filter_anisotropic/"},
            drawBuffersExtension: {name:"EXT_draw_buffers<br>WEBGL_draw_buffers",link:"http://www.khronos.org/registry/webgl/extensions/WEBGL_draw_buffers/"}
        };

        var data = [];
        for (var name in glState){
            if (glState.hasOwnProperty(name)){
                if (name.endsWith("Extension")){
                    data.push({
                        "KickJS name": name,
                        "WebGL extension name": nameMap[name].name,
                        Supported: glState[name] ? true:false,
                        Link: nameMap[name].link
                    });
                }
            }
        }
        YUI().use("datatable", function (Y) {
            var table = new Y.DataTable({
                columns: ["KickJS name", {key:"WebGL extension name",allowHTML: true }, "Supported", { key: "Link", formatter: '<a href="{value}">Documentation</a>',
                              allowHTML: true }],
                data: data,
                caption:"WebGL Extensions"
            }).render('#template');

        });
    });