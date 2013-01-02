define(["kick", "ChessPieceType"], function (KICK, ChessPieceType) {
    "use strict";

    // Chess piece class
    return function(type, color, initialLocation){
        var engine = KICK.core.EngineSingleton.engine,
            vec2 = KICK.math.Vec2,
            vec3 = KICK.math.Vec3,
            location = vec2.create(initialLocation),
            transform,
            getMeshName = function(type){
                for (var name in ChessPieceType){
                    if (ChessPieceType[name] === type){
                        return name;
                    }
                }
                KICK.core.Util.fail("type "+type+" not found");
            },
            getPosition3D = function(position2d, height, dest){
                if (!dest){
                    dest = vec3.create();
                }
                dest[0] = -(position2d[0]-3.5);
                dest[2] = position2d[1]-3.5;
                dest[1] = height;
                return dest;
            };
        Object.defineProperties(this,{
            type:{
                value:type
            },
            color:{
                value:color
            },
            location:{
                get:function(){
                    return vec2.create(location);
                },
                set:function(newvalue){
                    vec2.set(newvalue,location);
                    var newPos = getPosition3D(location,0);
                    transform.localPosition = newPos;
                }
            }
        });

        this.activated = function(){
            var gameObject = this.gameObject;
            transform = gameObject.transform;
            var yRotation = 0;
            if (type === ChessPieceType.Knight){
                yRotation = -90+180*color;
            } else if (type === ChessPieceType.Bishop){
                yRotation = 45+90*color;
            }
            transform.localRotationEuler= [-90,yRotation,0];
            transform.localPosition = getPosition3D(initialLocation,0);

            var meshRenderer = new KICK.scene.MeshRenderer();
            meshRenderer.mesh = engine.project.loadByName(getMeshName(type));
            meshRenderer.material = engine.project.loadByName(color?"ChessBlack":"ChessWhite");
            gameObject.addComponent(meshRenderer);
        }
    };

});