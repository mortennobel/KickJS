define(["kick/core", "kick/importer", "kick/material", "kick/math", "kick/mesh", "kick/scene", "kick/texture"],
    function (core, importer, material, math, mesh, scene, texture) {
        "use strict";
        return {
            core: core,
            importer: importer,
            material: material,
            math: math,
            mesh: mesh,
            scene: scene,
            texture: texture
        };
    });