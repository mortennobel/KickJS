var doMove,
    engine;

function initKick(){
    engine = new KICK.core.Engine('canvas',{
        enableDebugContext: location.search === "?debug" // debug enabled if query == debug
    });
    var projectLoaded = function(){
        alert("Project loaded");
    };
    var projectLoadError = function(){
        alert("Project load error");
    };
    engine.project.loadProjectByURL("project.json", projectLoaded, projectLoadError);
}

function initChess(){
    var maxTime = 1<<25;
    var maxDepth = 4;
    ccall('initChessEngine','void',['number','number'],[maxTime,maxDepth]);
    doMove = cwrap('doMove', 'string', ['string']);

    initKick();

}

window.addEventListener("load",function(){
    initChess();
},false);