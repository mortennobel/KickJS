define(["kick/core/Constants", "kick/material/Material", "kick/core/Util", "kick/mesh/Mesh", "kick/core/EngineSingleton"],
    function (Constants, Material, Util, Mesh, EngineSingleton) {
        "use strict";

        var ASSERT = Constants._ASSERT;

        /**
         * @class ParticleRenderer
         * @constructor
         * @namespace kick.particle
         * @extends kick.scene.Component
         * @final
         * @param {Object} config configuration
         */
        return function (config) {
            var transform,
                _material = null,
                _renderOrder,
                engine = EngineSingleton.engine,
                thisObj = this,
                updateRenderOrder = function() {
                    if (_material && _renderOrder !== _material.renderOrder){
                        _renderOrder = _material.renderOrder;
                        if (thisObj.gameObject) {
                            thisObj.gameObject.notifyComponentUpdated(thisObj);
                            return true;
                        }
                    }
                    return false;
                };

            /**
             * If no materials are assigned, the ENGINE_MATERIAL_DEFAULT is assigned as material.
             * @method activated
             */
            this.activated = function () {
                transform = thisObj.gameObject.transform;
                if (_materials.length === 0) {
                    var project = engine.project;
                    thisObj.material = project.load(project.ENGINE_MATERIAL_DEFAULT);
                }
            };

            Object.defineProperties(this, {
                // inherit documentation from component
                aabb: {
                    get: function () {
                        return _mesh.aabb;
                    }
                },
                /**
                 * The renderOrder for materials[0]
                 * @property renderOrder
                 * @type {Number}
                 */
                renderOrder: {
                    get: function () {
                        return _renderOrder;
                    }
                },
                /**
                 * Shortcut for materials[0]
                 * @property material
                 * @type kick.material.Material
                 */
                material: {
                    get: function () {
                        if (_materials.length === 0) {
                            return null;
                        }
                        return _materials[0];
                    },
                    set: function (newValue) {
                        if (ASSERT) {
                            if (!(newValue instanceof Material)) {
                                Util.fail("MeshRenderer.material must be a kick.material.Material");
                            }
                        }
                        if (_material){
                            _material.removeShaderChangeListener(updateRenderOrder);
                        }
                        _material = newValue;
                        _material.addShaderChangeListener(updateRenderOrder);
                        _renderOrder = _material.renderOrder;
                        if (thisObj.gameObject) {
                            thisObj.gameObject.notifyComponentUpdated(thisObj);
                        }
                    }
                },
                /**
                 * @property mesh
                 * @type kick.mesh.Mesh
                 */
                mesh: {
                    get: function () {
                        return _mesh;
                    },
                    set: function (newValue) {
                        if (ASSERT) {
                            if (!(newValue instanceof Mesh)) {
                                Util.fail("MeshRenderer.mesh must be a kick.mesh.Mesh");
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
             * @param {kick.scene.EngineUniforms} engineUniforms
             * @param {kick.material.Material} overwriteMaterial Optional
             */
            this.render = function (engineUniforms, overwriteMaterial) {
                var usedMaterial = overwriteMaterial || material;
                _mesh.bind(usedMaterial.shader);
                shader.bindUniform(usedMaterial, engineUniforms, transform);
                _mesh.render(0);
            };

            /**
             * @method toJSON
             * @return {JSON}
             */
            this.toJSON = function () {
                if (!thisObj.gameObject) {
                    return null; // component is destroyed
                } else {
                    return Util.componentToJSON(this, "kick.particle.ParticleRenderer");
                }
            };

            Util.applyConfig(this, config);
        };

    });
