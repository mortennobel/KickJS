window.onload = function(){
    "use strict";
    var vec3 = KICK.math.vec3,
        mat4 = KICK.math.mat4,
        constants = KICK.core.Constants;

    function SnakeTail(tailPosition){
        var _tail,
            transform,
            position = vec3.create(tailPosition);

        this.activated = function (){
            transform = this.gameObject.transform;
            transform.localPosition = position;
        }

        this.move = function(newPosition){
            if (_tail){
                _tail.move(position);
            }
            vec3.set(newPosition,position);
            transform.localPosition = position;
        }

        Object.defineProperties(this,{
                position:{
                    get:function(){
                        return position;
                    }
                },
                tail:{
                    get:function(){
                        return _tail;
                    },
                    set:function(newValue){
                        _tail = newValue;
                    }
                }
            }
        );
    }

    function SnakeComponent(engine,keyLeft,keyRight,initialLength,initialMovePosition,initialMoveDirection){
        var meshRenderer,
            time,
            transform,
            input,
            snakeTail,
            thisObj = this,
            moveDirection = vec3.create(initialMoveDirection|| [1,0,0]),
            position = vec3.create(initialMovePosition || [0,0,0]),
            scene = engine.activeScene,
            currentMovement = 0, // limits movement to not go backwards
            shader = new KICK.material.Shader(engine),

            material = new KICK.material.Material({
                shader:shader,
                name:"Snake material"
            }),
            mesh = KICK.mesh.MeshFactory.createCube(engine,0.5),
            rotateLeft = function(){
                if (currentMovement==-1){
                    return;
                }
                currentMovement--;
                if (moveDirection[0]){
                    moveDirection[2] = -moveDirection[0];
                    moveDirection[0] = 0;
                } else {
                    moveDirection[0] = moveDirection[2];
                    moveDirection[2] = 0;
                }
            },
            rotateRight = function(){
                if (currentMovement==1){
                    return;
                }
                currentMovement++;
                if (moveDirection[0]){
                    moveDirection[2] = moveDirection[0];
                    moveDirection[0] = 0;
                } else {
                    moveDirection[0] = -moveDirection[2];
                    moveDirection[2] = 0;
                }
            };
        Object.defineProperties(this,{
            position:{
                get:function(){
                    return position;
                }
            }
        });
        this.move = function(){
            if (snakeTail){
                snakeTail.move(position);
            }
            vec3.add(position,moveDirection);
            transform.position = position;
            currentMovement = 0;
            return position;
        };

        this.isIntersecting = function(aPosition, includeHead){
            var vec3Equal = function(v1,v2){
                for (var i=0;i<3;i++){
                    var diff = v1[i]-v2[i];
                    if (Math.abs(diff)<constants._EPSILON){
                        return false;
                    }
                }
                return true;
            }
            if (includeHead){
                if (vec3Equal(aPosition, position)){
                    return true;
                }
            }
            var tail = snakeTail;
            while (tail){
                if (vec3Equal(aPosition, tail.position)){
                    return true;
                }
                tail = tail.tail;
            }
            return false;
        };
        this.activated = function (){
            input = engine.keyInput;
            transform = this.gameObject.transform;
            transform.position = position;
            time = engine.time;
            meshRenderer = new KICK.scene.MeshRenderer();
            this.gameObject.addComponent(meshRenderer);
            meshRenderer.material = material;
            meshRenderer.mesh = mesh;
        };

        var addChild = function(tailPosition){
            var gameObject = scene.createGameObject();
            var meshRenderer = new KICK.scene.MeshRenderer();
            gameObject.addComponent(meshRenderer);
            meshRenderer.mesh = mesh;
            meshRenderer.material = material;
            var tail = new SnakeTail(tailPosition);
            gameObject.addComponent(tail);
            if (!snakeTail){
                snakeTail = tail;
            } else {
                var tailChild = snakeTail;
                while (tailChild.tail){
                    tailChild = tailChild.tail;
                }
                tailChild.tail = tail;
            }
        };

        this.update = function(){
            if (input.isKeyDown(keyLeft)){
                rotateLeft();
            }
            else if (input.isKeyDown(keyRight)){
                rotateRight();
            }
        };

        this.grow = function(){
            addChild(position); // start by positioning the tail at the head - on next move the tail will be located correct
        };

        (function init(){
            var childPosition = vec3.create(position),
                tailDirection = vec3.multiply([-1,-1,-1],moveDirection);
            for (var i=0;i<initialLength;i++){
                vec3.add(childPosition,tailDirection);
                addChild(childPosition);
            }
        })();
    }

    function SnakeLevelComponent(engine){
        var meshRenderer,
            shader,
            material,
            size = 60;
        this.activated = function (){
            meshRenderer = new KICK.scene.MeshRenderer();
            this.gameObject.addComponent(meshRenderer);

            shader = new KICK.material.Shader(this.gameObject.engine);

            material = new KICK.material.Material({
                shader:shader,
                name:"Snake material"
            });

            meshRenderer.material = material;

            var scaleWidthMatrix = mat4.scale(mat4.identity(mat4.create()),[size+1,1,1]);
            var scaleHeightMatrix = mat4.scale(mat4.identity(mat4.create()),[1,1,size]);
            var wideCube = KICK.mesh.MeshFactory.createCubeData(0.5).transform(scaleWidthMatrix);
            var tallCube = KICK.mesh.MeshFactory.createCubeData(0.5).transform(scaleHeightMatrix);
            var meshData = new KICK.mesh.MeshData({
                meshType:wideCube.meshType,
                vertex:[],
                indices:[]
            });
            var translateUpMatrix         = mat4.translate(mat4.identity(mat4.create()),[0,0,-size/2]);
            var translateDownHeightMatrix = mat4.translate(mat4.identity(mat4.create()),[0,0,size/2]);
            meshData = meshData.combine(wideCube.transform(translateUpMatrix));
            meshData = meshData.combine(wideCube.transform(translateDownHeightMatrix));
            var translateLeftMatrix        = mat4.translate(mat4.identity(mat4.create()),[-size/2,0,0]);
            var translateRightHeightMatrix = mat4.translate(mat4.identity(mat4.create()),[size/2,0,0]);
            meshData = meshData.combine(tallCube.transform(translateLeftMatrix));
            meshData = meshData.combine(tallCube.transform(translateRightHeightMatrix));

            meshRenderer.mesh = new KICK.mesh.Mesh(engine,{name:"Level"},meshData);
        };

        this.isIntersecting = function(position){
            return false;
        };
    }

    function GameController(engine,level){
        var keyCodeA = 65,
            keyCodeZ = 90,
            keyCodeM = 65+12,
            keyCodeK = 65+10,
            timeSinceMove = 0,
            time = engine.time,
            activeScene = engine.activeScene;

        var addSnake = function(moveLeft,moveRight, movePos, moveDir){
            var snakeGameObject = activeScene.createGameObject();
            var snakeComponent = new SnakeComponent(engine,moveLeft,moveRight,10,movePos,moveDir);
            snakeGameObject.addComponent(snakeComponent);
            return snakeComponent;
        };

        var snakes = [
            addSnake(keyCodeA,keyCodeZ,[-5,0,-15],[1,0,0]),
            addSnake(keyCodeM,keyCodeK,[5,0,15],[-1,0,0])
        ];

        this.update = function(){
            var snakeLengthMinus1 =snakes.length-1;
            timeSinceMove += time.deltaTime;
            if (timeSinceMove>=60){
                for (var i=snakeLengthMinus1;i>=0;i--){
                    snakes[i].move();
                }
                for (var i=snakeLengthMinus1;i>=0;i--){
                    if (snakes[i].isDead){
                        continue;
                    }
                    if (snakes[i].isIntersecting(snakes[i].position,false)){
                        snakes[i].die();
                        continue;
                    }
                    for (var j=snakeLengthMinus1;j>=0;j--){
                        if (i!==j){
                            if (snakes[j].isIntersecting(snakes[i].position,true)){
                                snakes[i].die();
                                continue;
                            }
                        }
                    }
                    if (level.isIntersecting(snakes[i].position)){
                        snakes[i].die();
                    }
                }
                timeSinceMove = 0;
            }
        };
    }

    var engine;
    function initKick() {
        engine = new KICK.core.Engine('canvas',{
            enableDebugContext: true
        });
        var activeScene = engine.activeScene;
        var cameraObject = activeScene.createGameObject();
        var camera = new KICK.scene.Camera({
            clearColor: [124/255,163/255,137/255,1],
            fieldOfView: 90
        });
        cameraObject.addComponent(camera);

        var cameraTransform = cameraObject.transform;
        cameraTransform.localPosition = [0,40,0];
        cameraTransform.localRotationEuler = [-90,0,0];

        var levelGameObject = activeScene.createGameObject();
        var levelComponent = new SnakeLevelComponent(engine);
        levelGameObject.addComponent(levelComponent);
        levelGameObject.addComponent(new GameController(engine,levelComponent));
    }
    initKick();

    function documentResized(){
        var canvas = document.getElementById('canvas');
        canvas.width = document.width;
        canvas.height = document.height-canvas.offsetTop;
        engine.canvasResized();
    }
    documentResized();
    window.onresize = documentResized;

};