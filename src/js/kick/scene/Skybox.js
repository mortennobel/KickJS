define(["require", "kick/core/ProjectAsset", "./SceneLights", "kick/core/Constants", "kick/core/Util", "./Camera", "./Light", "./GameObject", "kick/core/EngineSingleton", "kick/core/Observable", "kick/material/Material", "kick/core/Project"],
    function (require, ProjectAsset, SceneLights, Constants, Util, Camera, Light, GameObject, EngineSingleton, Observable, Material, Project) {
        "use strict";

        var DEBUG = Constants._DEBUG,
            ASSERT = Constants._ASSERT;

        /**
         * Create a skybox object. Must be attached to a GameObject with camera component -
         * otherwise nothing will be rendered. The camera must have a near clipping plane less than 1.0 and a far
         * clipping plane greater than 1.0, otherwise the skybox will be clipped.
         *
         * The skybox is rendered with render order 1999, which should be the last rendering of the opaque geometry to
         * avoid overdraw.
         *
         * @example
         *     var skyBox = new kick.scene.Skybox();
         *     skyBox.material = new kick.material.Material( {
         *        shader: engine.project.load(engine.project.ENGINE_SHADER_SKYBOX),
         *        uniformData: {
         *            mainTexture: cubemapTexture
         *        }
         *     });
         *     cameraGameObject.addComponent(skyBox);
         * @class Skybox
         * @extends kick.scene.Component
         * @namespace kick.scene
         * @constructor
         * @param {Object} config
         */
        return function (config) {
            var material,
                cube,
                transform,
                thisObj = this,
                renderOrder = 1999,
                gl,
                contextRestoredListener = function(restoredGL){
                    gl = restoredGL;
                };

            Object.defineProperties(this, {
                /**
                 * The renderOrder for materials[0]
                 * @property renderOrder
                 * @type {Number}
                 */
                renderOrder: {
                    get: function () {
                        return renderOrder;
                    }
                },
                material:{
                    get:function(){
                        return material;
                    },
                    set:function(newValue){
                        if (ASSERT){
                            if (!(newValue instanceof Material)) {
                                Util.fail("Skybox.material must be a kick.material.Material");
                            }
                        }
                        material = newValue;
                        if (material){
                            renderOrder = material.renderOrder;
                        }
                    },
                    enumerable: true
                }
            });

            this.activated = function () {
                var engine = EngineSingleton.engine;
                if (!cube){
                    cube = engine.project.load(Project.ENGINE_MESH_CUBE);
                    transform = thisObj.gameObject.transform;
                }
                engine.addEventListener("contextRestored", contextRestoredListener);
                gl = engine.gl;
            };

            this.deactivated = function(){
                var engine = EngineSingleton.engine;
                engine.removeEventListener("contextRestored", contextRestoredListener);
            };

            /**
             * Render skybox
             * @method render
             * @param {kick.scene.EngineUniforms} engineUniforms
             * @param {kick.material.Material} [overwriteMaterial]
             */
            this.render = function(engineUniforms, overwriteMaterial){
                var shader = material.shader;

                if (!overwriteMaterial) {
                    gl.depthRange(1,1);
                    cube.bind(shader);
                    shader.bindUniform(material, engineUniforms, transform);
                    cube.render(0);
                    gl.depthRange(0,1);
                }
            };

            /**
             * @method toJSON
             * @return {JSON}
             */
            this.toJSON = function () {
                return Util.componentToJSON(this, "kick.scene.Skybox");
            };

            Util.applyConfig(this, config);
        };
    });