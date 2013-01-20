var requirejs = require('./r'),
    replaceConstants = require("./replaceConstants"),
    fs = require('fs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    paths: {
        kick: '../src/js/kick'
    }
});

requirejs(['kick/core/Constants'],
    function (constants) {
        "use strict";
        if (process.argv.length !== 6) {
            console.error("Usage node preprocessor [inputPath] [outputPath] [debug] [assert]");
        }

        var inputPath = process.argv[2],
            outputPath = process.argv[3],
            debug = process.argv[4] === "true",
            assert = process.argv[5] === "true";

        Object.defineProperties(constants, {
            _ASSERT: { value: assert, enumerable:true, configurable:true},
            _DEBUG: { value: debug, enumerable:true, configurable:true}
        });
        function processFile(path) {
            "use strict";
            var stat = fs.statSync(inputPath + path);
            if (stat.isDirectory()) {

                if (!fs.existsSync(outputPath + path)) {
                    console.log("Creating " + outputPath + path);
                    fs.mkdirSync(outputPath + path);
                }
                var files = fs.readdirSync(inputPath + path);
                for (var i=0;i<files.length;i++){
                    processFile(path + "/" +files[i]);
                }
            } else if (stat.isFile()) {
                console.log("Replacing file " + outputPath + path+" to "+outputPath + path);
                var input = fs.readFileSync(inputPath + path, "UTF-8"),
                    output;
                if (path.indexOf("/Constants.js") !==  -1) {
                    output = input.replace("_ASSERT: { value: true", "_ASSERT: { value: "+assert);
                    output = output.replace("_DEBUG: { value: true", "_DEBUG: { value: "+debug);
                } else if (path.indexOf("/GLSLConstants.js") ===  -1){
                    output = replaceConstants.replaceConstants(constants, input);
                } else {
                    console.log("Skip replace for "+path);
                    output = input;
                }
                fs.writeFileSync(outputPath + path, output,  "UTF-8");
            }
        }
        processFile("");
    });


