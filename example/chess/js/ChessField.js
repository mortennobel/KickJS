define(["kick"], function (KICK) {
    "use strict";

    return function(location2d){
        var engine = KICK.core.EngineSingleton.engine,
            vec2 = KICK.math.Vec2,
            meshRenderer,
            material,
            selectedMaterial;

        this.activated = function(){
            var gameObject = this.gameObject;
            var transform = gameObject.transform;
            transform.localRotationEuler= [-90,0,0];
            transform.localPosition = [-(location2d[0]-3.5),0,location2d[1]-3.5];
            meshRenderer = new KICK.scene.MeshRenderer();
            meshRenderer.mesh = engine.project.loadByName("ChessBoardField");
            var even = (location2d[0]+location2d[1])%2;
            meshRenderer.material = material = engine.project.loadByName(even?"BoardWhite":"BoardBlack");
            selectedMaterial = engine.project.loadByName("BoardSelected");
            gameObject.addComponent(meshRenderer);
        };

        Object.defineProperties(this,{
            selected:{
                set:function(newValue){
                    meshRenderer.material = newValue?selectedMaterial:material;
                }
            },
            location:{
                get:function(){
                    return vec2.create(location2d);
                }
            }
        });
    };

});