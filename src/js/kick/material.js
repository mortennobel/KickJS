define(["./material/GLSLConstants", "./material/Material", "./material/MaterialUniform", "./material/Shader", "./material/UniformDescriptor"],
    function (GLSLConstants, Material, MaterialUniform, Shader, UniformDescriptor) {
        "use strict";

        return {
            GLSLConstants: GLSLConstants,
            Material: Material,
            MaterialUniform: MaterialUniform,
            Shader: Shader,
            UniformDescriptor: UniformDescriptor
        };
    });