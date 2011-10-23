window.onload = function(){
    "use strict";
    var vec3 = KICK.math.vec3;

    function SnakeComponent(engine,keyLeft,keyRight){
        var meshRenderer,
            material,
            shader,
            time,
            transform,
            input,
            moveDirection = vec3.create([1,0,0]),
            position = vec3.create(),
            currentMovement = 0, // limits movement to not go backwards
            move = function(){
                vec3.add(position,moveDirection);
                transform.position = position;
                currentMovement = 0;
            },
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

        this.activated = function (){
            input = engine.keyInput;
            transform = this.gameObject.transform;
            time = engine.time;
            meshRenderer = new KICK.scene.MeshRenderer();
            this.gameObject.addComponent(meshRenderer);

            shader = new KICK.material.Shader(this.gameObject.engine);

            material = new KICK.material.Material({
                shader:shader,
                name:"Snake material"
            });

            meshRenderer.material = material;
            meshRenderer.mesh = KICK.mesh.MeshFactory.createCube(engine,0.5);
        };

        this.update = function(){
            if (time.frameCount%30==0){
                move();
            }
            if (input.isKeyDown(keyLeft)){
                rotateLeft();
            }
            else if (input.isKeyDown(keyRight)){
                rotateRight();
            }
        };
    }

    function SnakeLevelComponent(engine){
        var meshRenderer,
            shader,
            material;
        this.activated = function (){
            meshRenderer = new KICK.scene.MeshRenderer();
            this.gameObject.addComponent(meshRenderer);

            shader = new KICK.material.Shader(this.gameObject.engine);

            material = new KICK.material.Material({
                shader:shader,
                name:"Snake material"
            });

            meshRenderer.material = material;

            var meshCube = KICK.mesh.MeshFactory.createUVSphereData(0.5);
            var meshData = new KICK.mesh.MeshData({
                meshType:meshCube.meshType,
                vertex:[],
                indices:[]
            });
            meshData.color = null;
            var matrix = KICK.math.mat4.create();
            for (var i=0;i<10;i++){
                matrix = KICK.math.mat4.identity(matrix);
                matrix = KICK.math.mat4.translate(matrix,[i,0,0]);
                meshData = meshData.combine(meshCube,matrix);
                if (meshData === null){
                    KICK.core.Util.fail("combine returned null");
                }
            }
            meshRenderer.mesh = new KICK.mesh.Mesh(engine,{name:"Level"},meshData);
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
            clearColor: [124/255,163/255,137/255,1]
        });
        cameraObject.addComponent(camera);

        var cameraTransform = cameraObject.transform;
        cameraTransform.localPosition = [0,20,0];
        cameraTransform.localRotationEuler = [-90,0,0];

        var levelGameObject = activeScene.createGameObject();
        var levelComponent = new SnakeLevelComponent(engine);
        levelGameObject.addComponent(levelComponent);

        var snakeGameObject = activeScene.createGameObject();
        var keyCodeA = 65;
        var keyCodeZ = 90;
        snakeGameObject.addComponent(new SnakeComponent(engine,keyCodeA,keyCodeZ));

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