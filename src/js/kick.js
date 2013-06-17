define(["kick/core", "kick/importer", "kick/material", "kick/math", "kick/mesh", "kick/scene", "kick/texture", "kick/components", "kick/animation"],
    function (core, importer, material, math, mesh, scene, texture, components, animation) {
        "use strict";
        return {
            core: core,
            components: components,
            importer: importer,
            material: material,
            math: math,
            mesh: mesh,
            scene: scene,
            texture: texture,
            animation: animation
        };
    });