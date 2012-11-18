define(["kick/core/Constants", "kick/material/Material", "kick/core/Util", "kick/mesh/Mesh"],
    function (Constants, Material, Util, Mesh) {
        "use strict";

        var ASSERT = Constants._ASSERT;

        /**
         * Renders a Mesh.
         * To create custom renderable objects you should not inherit from this class, but simple create a component with a
         * render() method.
         * @class MeshRenderer
         * @constructor
         * @namespace kick.scene
         * @extends kick.scene.Component
         * @final
         * @param {Object} config configuration
         */
        return function (config) {
            var transform,
                _materials = [],
                _mesh,
                _renderOrder,
                engine,
                thisObj = this;

            /**
             * If no materials are assigned, the ENGINE_MATERIAL_DEFAULT is assigned as material.
             * @method activated
             */
            this.activated = function () {
                engine = thisObj.gameObject.engine;
                transform = thisObj.gameObject.transform;
                if (_materials.length === 0) {
                    var project = thisObj.gameObject.engine.project;
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
                // inherit documentation from component
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
                        _materials[0] = newValue;
                        _renderOrder = _materials[0].renderOrder;
                        if (thisObj.gameObject) {
                            thisObj.gameObject.notifyComponentUpdated(thisObj);
                        }
                    }
                },
                /**
                 *
                 * @property materias
                 * @type Array_kick.material.Material
                 */
                materials: {
                    get: function () {
                        return _materials;
                    },
                    set: function (newValue) {
                        var i;
                        _materials = [];
                        for (i = 0; i < newValue.length; i++) {
                            if (ASSERT) {
                                if (!(newValue[i] instanceof Material)) {
                                    Util.fail("MeshRenderer.material must be a kick.material.Material");
                                }
                            }
                            _materials[i] = newValue[i];
                            _renderOrder = _materials[i].renderOrder;
                        }
                        if (thisObj.gameObject) {
                            thisObj.gameObject.notifyComponentUpdated(thisObj);
                        }
                    },
                    enumerable: true
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
                var length = _materials.length,
                    i,
                    shader;
                if (overwriteMaterial) {
                    shader = overwriteMaterial.shader;
                    for (i = 0; i < length; i++) {
                        _mesh.bind(shader);
                        shader.bindUniform(overwriteMaterial, engineUniforms, transform);
                        _mesh.render(i);
                    }
                } else {
                    for (i = 0; i < length; i++) {
                        shader = _materials[i].shader;
                        _mesh.bind(shader);
                        shader.bindUniform(_materials[i], engineUniforms, transform);
                        _mesh.render(i);
                    }
                }
            };

            /**
             * @method toJSON
             * @return {JSON}
             */
            this.toJSON = function () {
                if (!thisObj.gameObject) {
                    return null; // component is destroyed
                } else {
                    return Util.componentToJSON(thisObj.gameObject.engine, this, "kick.scene.MeshRenderer");
                }
            };

            Util.applyConfig(this, config);
        };

    });