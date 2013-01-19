define(["kick", "ChessPiece", "ChessField"], function (kick, ChessPiece, ChessField) {
    "use strict";

    return function(chessGame){
        var engine = kick.core.Engine.instance,
            mouseInput,
            camera,
            canvas = engine.canvas,
            gameObjectsPicked = function (gameObject) {
                var chessPiece = gameObject.getComponentOfType(ChessPiece),
                    location;
                if (chessPiece) {
                    location = chessPiece.location;
                } else {
                    var chessField = gameObject.getComponentOfType(ChessField);
                    if (chessField) {
                        location = chessField.location;
                    }
                }
                if (location) {
                    chessGame.locationSelected(location);
                }
            },
            gameObjectsHighlight = function (gameObject) {
                var chessPiece = gameObject.getComponentOfType(ChessPiece),
                    location,
                    chessField;
                if (chessPiece) {
                    location = chessPiece.location;
                } else {
                    chessField = gameObject.getComponentOfType(ChessField);
                    if (chessField) {
                        location = chessField.location;
                    }
                }
                if (location) {
                    chessGame.locationHighlighted(location);
                }
            };
        this.activated = function () {
            mouseInput = engine.mouseInput;
            camera = this.gameObject.scene.findComponentsOfType(kick.scene.Camera)[0];
        };

        this.update = function () {
            if (mouseInput.isButtonDown(0)) {
                camera.pick(gameObjectsPicked, mouseInput.mousePosition[0], canvas.height - mouseInput.mousePosition[1]);
            } else {
                camera.pick(gameObjectsHighlight, mouseInput.mousePosition[0], canvas.height - mouseInput.mousePosition[1]);
            }
        };
    };
});