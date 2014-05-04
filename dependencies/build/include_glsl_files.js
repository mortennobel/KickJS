var fs = require('fs');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

if (process.argv.length !== 4){
    console.error("Usage node include_glsl_files [glsl_directory] [sourcefile]");
}

var glslDirectory = process.argv[2];
var sourcefile = process.argv[3];

var filesInDirectory = fs.readdirSync(glslDirectory);
var content = {};
for (var i=0;i<filesInDirectory.length;i++){
    var filename = filesInDirectory[i];
    if (filename.endsWith(".glsl")){
        var filecontent = fs.readFileSync(glslDirectory+"/"+filename, "UTF-8");
        content[filename] = filecontent;
    }
}

var srcFileContent = fs.readFileSync(sourcefile, "UTF-8");
var searchString = "// created by include_glsl_files.js - do not edit content";
var index = srcFileContent.indexOf(searchString);
if (index === -1){
    throw new Error("Cannot find search string : "+searchString);
}
index += searchString.length;

function trimStrings(str){
    return str.replace(/[ \t]{2,}/g, ' ') // remove double whitespaces
        .replace(/[ \n]{2,}/g, '\n');  // remove double line breaks
}

function modifyString(srcString, index, jsonObj){
    var str = srcString.substr(0,index)+"\n";
    for (var name in jsonObj){
        str += "/**\n";
        str += "* GLSL file content\n";
        str += "* @property "+name+"\n";
        str += "* @type String\n";
        str += "*/\n";
        jsonObj[name] = trimStrings(jsonObj[name]);
    }

    str += "return "+JSON.stringify(jsonObj);
    str += ";\n";
    str += "});";
    return str;
}

var newFileContent = modifyString(srcFileContent, index, content);
if (newFileContent !== srcFileContent){
    console.log("Rebuilding "+sourcefile);
    fs.writeFileSync(sourcefile, newFileContent,  "UTF-8");
}