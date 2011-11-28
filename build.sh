#!/bin/sh
# The location of your yuidoc install
yuidoc_home=$1

#Location of project
project=$2

#Location of Google Clojure Compiler
googleClojure=$3

#Location of Node.js
nodejs=$4

version=0_2_0

# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.  You can specify multiple
# source trees:
parser_in=$project/src/js

# The location to output the parser data.  This output is a file containing a 
# json string, and copies of the parsed files.
parser_out=$project/API/parser

# The directory to put the html file outputted by the generator
generator_out=$project/API/generator

# The location of the template files.  Any subdirectories here will be copied
# verbatim to the destination directory.
template=$project/build-asset/doc-template

# The version of your project to display within the documentation.
version=0.2.0

# The version of YUI the project is using.  This effects the output for
# YUI configuration attributes.  This should start with '2' or '3'.
yuiversion=3

projecturl=http://www.kickjs.org/
projectname="KickJS"

#####
echo "Clean"
rm -rf $parser_out
rm -rf $generator_out

##############################################################################
echo "Include GLSL files as constants"
$nodejs $project/preprocessor/include_glsl_files $project/src/glsl/ $project/src/js/glslconstants.js


##############################################################################
echo "Generating documentation (YUI Doc)"
echo $yuidoc_home/bin/yuidoc.py $parser_in -p $parser_out -o $generator_out -t $template -v $version -Y $yuiversion -m "$projectname" -u $projecturl
$yuidoc_home/bin/yuidoc.py $parser_in -p $parser_out -o $generator_out -t $template -v $version -Y $yuiversion -m "$projectname" -u $projecturl

##############################################################################
echo "Running Precompiler release"
mkdir $project/build
rm -rf $project/build/pre
mkdir $project/build/pre
$nodejs $project/preprocessor/preprocessor $project/src/js/math.js $project/build/pre/math.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/core.js $project/build/pre/core.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/scene.js $project/build/pre/scene.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/mesh.js $project/build/pre/mesh.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/renderer.js $project/build/pre/renderer.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/material.js $project/build/pre/material.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/meshfactory.js $project/build/pre/meshfactory.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/texture.js $project/build/pre/texture.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/collada.js $project/build/pre/collada.js $version false false
$nodejs $project/preprocessor/preprocessor $project/src/js/resource.js $project/build/pre/resource.js $version false false
cp $project/src/js/constants.js $project/build/pre/constants.js
cp $project/src/js/glslconstants.js $project/build/pre/glslconstants.js

##############################################################################
## http://code.google.com/closure/compiler/
##############################################################################

echo "Running Google Clojure compiler"
java -jar $googleClojure --js_output_file "$project/build/kick-min.js.tmp" --js $project/build/pre/constants.js --js $project/build/pre/glslconstants.js --js $project/build/pre/math.js --js $project/build/pre/core.js --js $project/build/pre/texture.js --js $project/build/pre/scene.js --js $project/build/pre/mesh.js --js $project/build/pre/renderer.js --js $project/build/pre/material.js --js $project/build/pre/meshfactory.js --js $project/build/pre/collada.js --js $project/build/pre/resource.js --language_in ECMASCRIPT5_STRICT

##############################################################################
echo "Running Precompiler dev"
mkdir $project/build
rm -rf $project/build/pre
mkdir $project/build/pre
$nodejs $project/preprocessor/preprocessor $project/src/js/math.js $project/build/pre/math.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/core.js $project/build/pre/core.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/scene.js $project/build/pre/scene.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/mesh.js $project/build/pre/mesh.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/renderer.js $project/build/pre/renderer.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/material.js $project/build/pre/material.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/meshfactory.js $project/build/pre/meshfactory.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/texture.js $project/build/pre/texture.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/collada.js $project/build/pre/collada.js $version true true
$nodejs $project/preprocessor/preprocessor $project/src/js/resource.js $project/build/pre/resource.js $version true true
cp $project/src/js/constants.js $project/build/pre/constants.js
cp $project/src/js/glslconstants.js $project/build/pre/glslconstants.js

echo "Creating kick-debug.js"
cat "$project/license.txt" $project/build/pre/constants.js $project/build/pre/glslconstants.js $project/build/pre/math.js $project/build/pre/core.js $project/build/pre/mesh.js $project/build/pre/scene.js $project/build/pre/texture.js $project/build/pre/renderer.js $project/build/pre/material.js $project/build/pre/meshfactory.js $project/build/pre/collada.js $project/build/pre/resource.js > $project/build/kick-debug-$version.js

##############################################################################
echo "Adding license info compiler"
cat "$project/license.txt" "$project/build/kick-min.js.tmp" > "$project/build/kick-min-$version.js"
rm "$project/build/kick-min.js.tmp"

##############################################################################
echo "Copy kickjs to examples"
mkdir "$project/example/js/"
cp "$project/build/kick-min-$version.js" "$project/example/js/kick-min-$version.js"
cp "$project/build/kick-debug-$version.js" "$project/example/js/kick-debug-$version.js"
cp "$project/src/js-dependencies/webgl-debug.js" "$project/example/js/webgl-debug.js"

echo "Build finished"
date