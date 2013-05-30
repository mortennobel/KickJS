define(["kick/core/Constants", "kick/material/Material", "kick/core/Util", "kick/mesh/Mesh", "kick/core/EngineSingleton", "kick/core/Observable"],
    function (Constants, Material, Util, Mesh, EngineSingleton, Observable) {
        "use strict";

        var ASSERT = Constants._ASSERT;

        /**
         * Renders a Mesh.
         * To create custom renderable objects you should not inherit from this class, but simple create a component with a
         * render() method.
         * If a mesh with sub-meshes, which uses multiple materials, the renderOrder is taken from the first material
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
                engine = EngineSingleton.engine,
                thisObj = this,
                updateRenderOrder = function() {
                    if (_materials.length > 0 && _renderOrder !== _materials[0].renderOrder){
                        _renderOrder = _materials[0].renderOrder;
                        thisObj.fireEvent("componentUpdated", thisObj);
                    }
                };

            Observable.call(this,
                /**
                 * Fired when mesh is updated
                 * @event contextLost
                 * @param {kick.scene.Component} component
                 */
                ["componentUpdated"]
            );

            /**
             * If no materials are assigned, the ENGINE\_MATERIAL\_DEFAULT is assigned as material.
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
                        if (_materials.length > 0){
                            _materials[0].removeEventListener("shaderChanged", updateRenderOrder);
                        }
                        _materials[0] = newValue;
                        _materials[0].addEventListener("shaderChanged", updateRenderOrder);
                        _renderOrder = _materials[0].renderOrder;
                        thisObj.fireEvent("componentUpdated", this);
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
                        for (i = 0;i < _materials.length; i++){
                            _materials[i].removeEventListener("shaderChanged", updateRenderOrder);
                        }
                        _materials = [];
                        for (i = 0; i < newValue.length; i++) {
                            if (ASSERT) {
                                if (!(newValue[i] instanceof Material)) {
                                    Util.fail("MeshRenderer.material must be a kick.material.Material");
                                }
                            }
                            _materials[i] = newValue[i];
                            _materials[i].addEventListener("shaderChanged", updateRenderOrder);
                        }
                        thisObj.fireEvent("componentUpdated", this);
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
                },
                /**
                 * Name of the component type = "meshRenderer".
                 * @example
                 *      var meshRenderer = gameObject.meshRenderer;
                 * @property componentType
                 * @type String
                 */
                componentType: {value:"meshRenderer"}
            });

            /**
             * This method may not be called (the renderer could make the same calls)
             * @method render
             * @param {kick.scene.EngineUniforms} engineUniforms
             * @param {kick.material.Material} [overwriteMaterial]
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
                    return Util.componentToJSON(this, "kick.scene.MeshRenderer");
                }
            };

            Util.applyConfig(this, config);
        };

    });