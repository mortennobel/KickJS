define(["kick", "GameBoard", "ChessPieceType", "ChessPiece", "ChessCameraMovementListener", "ChessField", "SelectionListener"], function (kick, GameBoard, ChessPieceType, ChessPiece, ChessCameraMovementListener, ChessField, SelectionListener) {
    "use strict";

    return function(){
        var engine = kick.core.EngineSingleton.engine,
            worker = new Worker("js/chess_web_worker.js"),
            cameraGameObject,
            thisObj = this,
            gameBoard = new GameBoard(),
            isPlayersTurn = true,
            isWorking = false,
            doPlayerMove = null,
            playerColor = 0, // white
            selectedPiece = null,
            highligtedLocation = null,
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
            console.log("Chess result",data);
            if (isPlayersTurn){
                if (data===""){
                    doPlayerMove();
                    isPlayersTurn = false;
                    worker.postMessage(""); // do computer move
                } else {
                    alert(data);
                    gameBoard.getField(selectedPiece.location).selected = false;
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
            var i;
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
            cameraGameObject.addComponent(new kick.scene.Camera());
            cameraGameObject.addComponent(new ChessCameraMovementListener());

            // enable shadow on light
            var light = scene.getGameObjectByName("Light");
            var lightComponents = light.getComponentsOfType(kick.scene.Light);
            for (i=0;i<lightComponents.length;i++){
                if (lightComponents[i].type ===  kick.scene.Light.TYPE_DIRECTIONAL){
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
                for (i=0;i<8;i++){
                    addPiece(ChessPieceType.Pawn,color,[i,row]);
                }
                row = color*7;
                for (i=0;i<8;i+=7){
                    addPiece(ChessPieceType.Rook,color,[i,row]);
                }
                for (i=1;i<8;i+=5){
                    addPiece(ChessPieceType.Knight,color,[i,row]);
                }
                for (i=2;i<8;i+=3){
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
        this.locationHighlighted = function(location){
            if (highligtedLocation){
                gameBoard.getField(highligtedLocation).highlighted = false;
            }
            highligtedLocation = kick.math.Vec2.clone(location);
            gameBoard.getField(location).highlighted = true;
        };

        // init
        initMeshData();
        buildScene();
    };
});