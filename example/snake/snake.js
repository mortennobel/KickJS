window.onload = function(){
    "use strict";
    var vec3 = KICK.math.vec3;

    function KeyTestComponent(engine){
        var keyInput;
        // registers listener (invoked when component is registered)
        this.activated = function (){
            keyInput = engine.keyInput;
        };
        //
        this.update = function(){
            var keyCodeForA = 65;
            if (keyInput.isKeyDown(keyCodeForA)){
                console.log("A key is down");
            }
            if (keyInput.isKey(keyCodeForA)){
                console.log("A key is being held down");
            }
            if (keyInput.isKeyUp(keyCodeForA)){
                console.log("A key is up");
            }
        };
    }


    function SnakeComponent(engine){
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
            meshRenderer.mesh = KICK.scene.MeshFactory.createCube(engine,0.5);
        };

        this.update = function(){
            if (time.frameCount%30==0){
                move();
            }
            if (input.isKeyDown(65)){
                rotateLeft();
            }
            else if (input.isKeyDown(90)){
                rotateRight();
            }
        };
    }

    function Level(){
        
    }

    var engine;
    function initKick() {
        engine = new KICK.core.Engine('canvas',{
            enableDebugContext: true
        });
        var cameraObject = engine.activeScene.createGameObject();
        var camera = new KICK.scene.Camera({
            clearColor: [124/255,163/255,137/255,1]
        });
        cameraObject.addComponent(camera);

        var cameraTransform = cameraObject.transform;
        cameraTransform.localPosition = [0,10,0];
        cameraTransform.localRotationEuler = [-90,0,0];

        var snakeGameObject = engine.activeScene.createGameObject();
        snakeGameObject.addComponent(new SnakeComponent(engine));
        snakeGameObject.addComponent(new KeyTestComponent(engine));

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