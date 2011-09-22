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
    for (var name in obj){

        var re = new RegExp("[\\w.\\.]*"+name);
        sourcecode = replaceAll(sourcecode,re,obj[name]);
    }
    return sourcecode;
}

// Node.js export (used for preprocessor)
this["exports"] = this["exports"] || {};
exports.replaceConstants = replaceConstants;