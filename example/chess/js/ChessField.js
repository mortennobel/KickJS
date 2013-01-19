define(["kick"], function (kick) {
    "use strict";

    return function (location2d) {
        var engine = kick.core.EngineSingleton.engine,
            vec2 = kick.math.Vec2,
            meshRenderer,
            material,
            isSelected,
            isHighligted,
            selectedMaterial,
            highlightedMaterial,
            updateMaterial = function () {
                if (isSelected) {
                    meshRenderer.material = selectedMaterial;
                } else if (isHighligted) {
                    meshRenderer.material = highlightedMaterial;
                } else {
                    meshRenderer.material = material;
                }
            };

        this.activated = function () {
            var gameObject = this.gameObject,
                transform = gameObject.transform,
                even;
            transform.localRotationEuler = [-90, 0, 0];
            transform.localPosition = [-(location2d[0] - 3.5), 0, location2d[1] - 3.5];
            meshRenderer = new kick.scene.MeshRenderer();
            meshRenderer.mesh = engine.project.loadByName("ChessBoardField");
            even = (location2d[0] + location2d[1]) % 2;
            meshRenderer.material = material = engine.project.loadByName(even ? "BoardWhite" : "BoardBlack");
            selectedMaterial = engine.project.loadByName("BoardSelected");
            highlightedMaterial = engine.project.loadByName("BoardHighlight");
            gameObject.addComponent(meshRenderer);
        };

        Object.defineProperties(this, {
            selected: {
                set: function (newValue) {
                    isSelected = newValue;
                    updateMaterial();
                }
            },
            highlighted: {
                set: function (newValue) {
                    isHighligted = newValue;
                    updateMaterial();
                }
            },
            location: {
                get: function () {
                    return vec2.clone(location2d);
                }
            }
        });
    };

});