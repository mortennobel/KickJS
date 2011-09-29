var constants = require("../src/js/constants"),
    replaceConstants = require("./replaceConstants"),
    fs = require('fs');


if (process.argv.length !== 4){
    console.error("Usage node preprocessor [inputfile] [outputfile]");
}

var inputFile = process.argv[2];
var outputFile = process.argv[3];

var input = fs.readFileSync(inputFile, "UTF-8");
var output = replaceConstants.replaceConstants(constants.Constants,input);
fs.writeFileSync(outputFile, output,  "UTF-8");