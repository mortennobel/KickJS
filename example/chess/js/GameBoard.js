define(["kick", "ChessPieceType"], function (kick, ChessPieceType) {
    "use strict";

    return function(){
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

});