"use strict";

var engine,
    vec2 = KICK.math.vec2,
    vec3 = KICK.math.vec3,
    vec4 = KICK.math.vec4,
    mat4 = KICK.math.mat4,
    quat4 = KICK.math.quat4;

var ChessPieceType = {
    Rook:1,
    Bishop:2,
    Pawn:3,
    Queen:4,
    King:5,
    Knight:6
};

var GameBoard = function(){
    var thisObj = this;
    var piecesLocations = [];
    var fieldsLocations = [];
    for (var x=0;x<8;x++){
        piecesLocations[x] = [];
        fieldsLocations[x] = [];
        for (var y= 0;y<8;y++){
            piecesLocations[x][y] = null;
            fieldsLocations[x][y] = null;
        }
    }

    this.addPiece = function(piece){
        piecesLocations[piece.location[0]][piece.location[1]] = piece;
    };

    this.addField = function(field){
        fieldsLocations[field.location[0]][field.location[1]] = field;
    };

    this.movePiece = function(piece, newLocation){
        var existingPiece = thisObj.getPiece(newLocation);
        if (existingPiece){
            existingPiece.gameObject.destroy();
        }
        if (piece.type === ChessPieceType.King && Math.abs(piece.location[0]-newLocation[0])>1){
            // Castling
            var direction = piece.location[0]-newLocation[0]<0?-1:1;
            var rook = thisObj.getPiece([direction>0?0:7,piece.location[1]]);
            var dest = [direction>0?3:5,piece.location[1]];
            thisObj.movePiece(rook,dest);
        }
        piecesLocations[piece.location[0]][piece.location[1]] = null;
        piece.location = newLocation;
        piecesLocations[piece.location[0]][piece.location[1]] = piece;


    };

    this.getPiece = function(location){
        return piecesLocations[location[0]][location[1]];
    };

    this.getField = function(location){
        return fieldsLocations[location[0]][location[1]];
    };
};

var ChessField = function(location2d){
    var meshRenderer,
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
                debugger;
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

// Chess piece class
var ChessPiece = function(type, color, initialLocation){
    var location = vec2.create(initialLocation),
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

var ChessCameraMovementListener = function(){
    var thisObj = this,
            time,
            transform,
            mouseRotationSpeed = 0.01,
            mouseInput,
            cartesianCoordinates = vec3.create(),
            sphericalCoordinates = vec3.create([14,1.5707963267949,1]);

    this.activated = function(){
        var gameObject = thisObj.gameObject,
            engine = gameObject.engine;
        transform = gameObject.transform;
        time = engine.time;
        mouseInput = engine.mouseInput;
        mouseInput.mouseWheelPreventDefaultAction = true;
    };

    this.update = function(){
        if (mouseInput.isButton(2)){
            var mouseDelta = mouseInput.deltaMovement;
            sphericalCoordinates[1] -= mouseDelta[0]*mouseRotationSpeed;
            sphericalCoordinates[2] += mouseDelta[1]*mouseRotationSpeed;
            sphericalCoordinates[2] = Math.max(0,sphericalCoordinates[2]);
            sphericalCoordinates[2] = Math.min(Math.PI*0.499,sphericalCoordinates[2]);
        }
        vec3.sphericalToCarterian(sphericalCoordinates,cartesianCoordinates);
        transform.position = cartesianCoordinates;
        transform.localRotation = quat4.lookAt(cartesianCoordinates,[0,0,0],[0,1,0]);
    };
};

var SelectionListener = function(chessGame){
    var mouseInput,
        camera,
        gameObjectsPicked = function(gameObject){
            var chessPiece = gameObject.getComponentOfType(ChessPiece);
            var location;
            if (chessPiece){
                location = chessPiece.location;
            } else {
                var chessField = gameObject.getComponentOfType(ChessField);
                if (chessField){
                    location = chessField.location;
                }
            }
            if (location){
                chessGame.locationSelected(location);
            }
        };
    this.activated = function(){
        mouseInput = engine.mouseInput;
        camera = this.gameObject.scene.findComponentsOfType(KICK.scene.Camera)[0];
    };

    this.update = function(){
        if (mouseInput.isButtonDown(0)){
            camera.pick(gameObjectsPicked, mouseInput.mousePosition[0],mouseInput.mousePosition[1]);
        }
    };
};

var ChessGame = function(){
    var worker = new Worker("chess_web_worker.js"),
        cameraGameObject,
        thisObj = this,
        gameBoard = new GameBoard(),
        isPlayersTurn = true,
        isWorking = false,
        doPlayerMove = null,
        playerColor = 0, // white
        selectedPiece = null,
        locationToChessStr = function(location){
            return String.fromCharCode("a".charCodeAt(0)+location[0])+(location[1]+1);
        },
        chessStrToLocation = function(str){
            return [str.charCodeAt(0)-'a'.charCodeAt(0),
                str.charCodeAt(1)-'1'.charCodeAt(0)];
        },
        doComputerMove = function(moveStr){
            var moveFrom = chessStrToLocation(moveStr.substring(0,2));
            var moveTo = chessStrToLocation(moveStr.substring(2,4));
            var piece = gameBoard.getPiece(moveFrom);
            gameBoard.movePiece(piece,moveTo);
        };

    worker.onmessage = function(event) {
        var data = event.data;
        if (isPlayersTurn){
            if (data===""){
                doPlayerMove();
                isPlayersTurn = false;
                worker.postMessage(""); // do computer move
            } else {
                alert(data);
                selectedPiece = null;
                isWorking = false;
            }
        } else {
            doComputerMove(data);
            isWorking = false;
            isPlayersTurn = true;
        }
    };

    worker.onerror = function(error) {
        alert("Worker error: " + error.message + "\n");
        throw error;
    };

    function initMeshData(){
        var meshNames = ["Rook", "Bishop", "Chessboard", "ChessBoardField", "Pawn", "Queen", "King", "Knight"];
        for (var i=0;i<meshNames.length;i++){
            var mesh = engine.project.loadByName(meshNames[i]);
            var meshData = mesh.meshData;
            var uv1Length = meshData.vertex.length/3*2;
            meshData.uv1 = new Float32Array(uv1Length);
            mesh.meshData = meshData;
        }
    }

    function buildScene(){
        var scene = engine.activeScene,
            addPiece = function(type, color, location){
                var name;
                for (name in ChessPieceType){
                    if (type == ChessPieceType[name]){
                        break;
                    }
                }
                var chessPieceGameObject = scene.createGameObject({name:name});
                var chessPieceComponent = new ChessPiece(type,color,location);
                chessPieceGameObject.addComponent(chessPieceComponent);

                gameBoard.addPiece(chessPieceComponent);
            };
        cameraGameObject = scene.createGameObject({name:"Camera"});
        cameraGameObject.addComponent(new KICK.scene.Camera());
        cameraGameObject.addComponent(new ChessCameraMovementListener());

        // enable shadow on light
        var light = scene.getGameObjectByName("Light");
        var lightComponents = light.getComponentsOfType(KICK.scene.Light);
        for (var i=0;i<lightComponents.length;i++){
            if (lightComponents[i].type ===  KICK.scene.Light.TYPE_DIRECTIONAL){
                lightComponents[i].shadow = false;
            }
        }

        // build fields
        for (var x=0;x<8;x++){
            for (var y=0;y<8;y++){
                var field = scene.createGameObject({name:"Field "+x+","+y});
                var chessField = new ChessField([x,y]);
                field.addComponent(chessField);
                gameBoard.addField(chessField);
            }
        }

        for (var color = 0;color<2;color++){
            // create pawns
            var row = 1+color*5;
            for (var i=0;i<8;i++){
                addPiece(ChessPieceType.Pawn,color,[i,row]);
            }
            row = color*7;
            for (var i=0;i<8;i+=7){
                addPiece(ChessPieceType.Rook,color,[i,row]);
            }
            for (var i=1;i<8;i+=5){
                addPiece(ChessPieceType.Knight,color,[i,row]);
            }
            for (var i=2;i<8;i+=3){
                addPiece(ChessPieceType.Bishop,color,[i,row]);
            }
            addPiece(ChessPieceType.Queen,color,[3,row]);
            addPiece(ChessPieceType.King,color,[4,row]);
        }

        var selectionListener = scene.createGameObject({name:"SelectionListener"});
        selectionListener.addComponent(new SelectionListener(thisObj));
    }

    this.locationSelected = function(location){
        if (!isPlayersTurn || isWorking){
            return;
        }
        var piece = gameBoard.getPiece(location);
        if (piece && piece.color == playerColor){
            if (selectedPiece){
                gameBoard.getField(selectedPiece.location).selected = false;
            }
            selectedPiece = piece;
            gameBoard.getField(location).selected = true;
        } else if (selectedPiece){
            var move = locationToChessStr (selectedPiece.location)+locationToChessStr (location);
            doPlayerMove = function(){
                gameBoard.getField(selectedPiece.location).selected = false;
                gameBoard.movePiece(selectedPiece,location);
            };
            isWorking = true;
            worker.postMessage(move);
        } else {
            console.log("Clicked "+locationToChessStr (location));
        }
    };

    // init
    initMeshData();
    buildScene();
};

function initKick(){
    engine = new KICK.core.Engine('canvas',{
        shadows:false,
        antialias:true,
        enableDebugContext: location.search === "?debug" // debug enabled if query == debug
    });
    var projectLoaded = function(){
        new ChessGame();
    };
    var projectLoadError = function(){
        alert("Error loading KickJS Chess ");
    };
    engine.project.loadProjectByURL("project.json", projectLoaded, projectLoadError);
}


window.addEventListener("load",function(){
    initKick();
},false);

function onFullscreenButton(){
    if (engine.isFullScreenSupported()){
        engine.setFullscreen(true);
    } else {
        alert("Fullscreen is not supported in this browser");
    }
}

YUI().use('tabview','console', "panel", "datatable-base", "dd-plugin",function(Y) {
    Y.one("#fullscreen").on("click",onFullscreenButton);
});