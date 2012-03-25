var doMove,
    engine,
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

var ChessField = function(location2d){
    var meshRenderer,
        material,
        selectedMaterial;

    this.activated = function(){
        var gameObject = this.gameObject;
        var transform = gameObject.transform;
        transform.localRotationEuler= [-90,0,0];
        transform.localPosition = [location2d[0]-3.5,0,location2d[1]-3.5];

        meshRenderer = new KICK.scene.MeshRenderer();
        meshRenderer.mesh = engine.project.loadByName("ChessBoardField");
        var even = (location2d[0]+location2d[1])%2;
        meshRenderer.material = material = engine.project.loadByName(even?"BoardBlack":"BoardWhite");
        selectedMaterial = engine.project.loadByName("BoardSelected");
        gameObject.addComponent(meshRenderer);
    };

    Object.defineProperties(this,{
        selected:{
            set:function(newValue){
                meshRenderer.material = newValue?selectedMaterial:material;
            }
        }
    });
};

// Chess piece class
var ChessPiece = function(type, color, initialLocation){
    var location = vec2.create(),
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
            dest[0] = position2d[0]-3.5;
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
            }
        }
    });

    this.activated = function(){
        var gameObject = this.gameObject;
        var transform = gameObject.transform;
        transform.localRotationEuler= [-90,0,0];
        transform.localPosition = getPosition3D(initialLocation,0);


        var meshRenderer = new KICK.scene.MeshRenderer();
        meshRenderer.mesh = engine.project.loadByName(getMeshName(type));
        meshRenderer.material = engine.project.loadByName(color?"ChessWhite":"ChessBlack");
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
            sphericalCoordinates = vec3.create([14,0,0]);

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

var ChessGame = function(){
    var cameraGameObject;

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
        var scene = engine.activeScene;
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
                setTimeout(function(){
                    console.log("Set selected");
                    chessField.selected = true;},Math.random()*100000);
                field.addComponent(chessField);
            }
        }

        for (var color = 0;color<2;color++){
            // create pawns
            var row = 1+color*5;
            for (var i=0;i<8;i++){
                var pawnGameObject = scene.createGameObject({name:"Pawn "+i});
                pawnGameObject.addComponent(new ChessPiece(ChessPieceType.Pawn,color,[i,row]));
            }
            row = color*7;
            for (var i=0;i<8;i+=7){
                var rookGameObject = scene.createGameObject({name:"Rook "+i});
                rookGameObject.addComponent(new ChessPiece(ChessPieceType.Rook,color,[i,row]));
            }
            for (var i=1;i<8;i+=5){
                var knightObject = scene.createGameObject({name:"Knight "+i});
                knightObject.addComponent(new ChessPiece(ChessPieceType.Knight,color,[i,row]));
            }
            for (var i=2;i<8;i+=3){
                var bishopObject = scene.createGameObject({name:"Bishop "+i});
                bishopObject.addComponent(new ChessPiece(ChessPieceType.Bishop,color,[i,row]));
            }
            var queenObject = scene.createGameObject({name:"Queen"});
            queenObject.addComponent(new ChessPiece(ChessPieceType.Queen,color,[3,row]));

            var kingObject = scene.createGameObject({name:"King"});
            kingObject.addComponent(new ChessPiece(ChessPieceType.King,color,[4,row]));

        }
    }

    // init
    initMeshData();
    buildScene();
};

function initKick(){
    engine = new KICK.core.Engine('canvas',{
        shadows:false,
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