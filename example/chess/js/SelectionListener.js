define(["kick", "ChessPiece", "ChessField"], function (KICK, ChessPiece, ChessField) {
    "use strict";

    return function(chessGame){
        var engine = KICK.core.EngineSingleton.engine,
            mouseInput,
            camera,
            canvas = engine.canvas,
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
                camera.pick(gameObjectsPicked, mouseInput.mousePosition[0],canvas.height-mouseInput.mousePosition[1]);
            }
        };
    };
});