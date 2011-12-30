var constants = require("../src/js/constants"),
    replaceConstants = require("./replaceConstants"),
    fs = require('fs');

if (process.argv.length !== 7){
    console.error("Usage node preprocessor [inputfile] [outputfile] [version] [debug] [assert]");
}

var inputFile = process.argv[2];
var outputFile = process.argv[3];
var version = process.argv[4];
var debug = process.argv[5]==="true";
var assert = process.argv[6]==="true";

Object.defineProperties(constants.Constants,{
    _ASSERT: { value: debug,enumerable:true,configurable:true},
    _DEBUG: { value: assert,enumerable:true,configurable:true},
    _VERSION: { value: version,enumerable:true,configurable:true}
});

var input = fs.readFileSync(inputFile, "UTF-8");
var output = replaceConstants.replaceConstants(constants.Constants,input);
fs.writeFileSync(outputFile, output,  "UTF-8");