/**
 * Replaces constant-symbols from a source file with
 * @method replaceConstants
 * @param constantClassName
 * @param sourcecode
 * @return sourcecode with constants replaced
 */
function replaceConstants(obj, sourcecode){
    var replaceAll = function(input,re,replaceWith){
            var oldString;
            do{
                oldString = input;
                input = input.replace(re, replaceWith);
            } while (oldString !== input);
            return input;
        };
    var names = [];
    for (var name in obj){
        names.push(name);
    }
    // sort names by length (longest first)
    names.sort(function(a,b){
        return b.length-a.length;
    });
    for (var i=0;i<names.length;i++){
        var name = names[i];
        var re = new RegExp("[\\w.\\._]*"+name);
        sourcecode = replaceAll(sourcecode,re,obj[name]);
    }
    return sourcecode;
}

// Node.js export (used for preprocessor)
this["exports"] = this["exports"] || {};
exports.replaceConstants = replaceConstants;