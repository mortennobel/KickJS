importScripts("tscp181.js");

var maxTime = 1<<25;
var maxDepth = 4;
ccall('initChessEngine','void',['number','number'],[maxTime,maxDepth]);
var playerMove = cwrap('playerMove', 'string', ['string']);
var computerMove = cwrap('computerMove', 'string', []);

function asyncPlayerMove(move){
    var res = playerMove(move);
    postMessage(res);
}

function asyncComputerMove(){
    var res = computerMove();
    postMessage(res);
}

onmessage = function(event) {
    var data = event.data;
    if (data === ""){
        asyncComputerMove();
    } else {
        asyncPlayerMove(data);
    }
};