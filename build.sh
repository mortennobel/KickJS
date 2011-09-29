#!/bin/sh
# The location of your yuidoc install
yuidoc_home=$1

#Location of project
project=$2

#Location of Google Clojure Compiler
googleClojure=$3

#Location of Node.js
nodejs=$4

version=0_1_0

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
version=0.1.0

# The version of YUI the project is using.  This effects the output for
# YUI configuration attributes.  This should start with '2' or '3'.
yuiversion=3

projecturl=http://www.kickstartengine.com/
projectname="Kickstart Engine"

#####
echo "Clean"
rm -rf $parser_out
rm -rf $generator_out

##############################################################################
echo "Generating documentation (YUI Doc)"
echo $yuidoc_home/bin/yuidoc.py $parser_in -p $parser_out -o $generator_out -t $template -v $version -Y $yuiversion -m "$projectname" -u $projecturl
$yuidoc_home/bin/yuidoc.py $parser_in -p $parser_out -o $generator_out -t $template -v $version -Y $yuiversion -m "$projectname" -u $projecturl

##############################################################################
echo "Running Precompiler"
mkdir $project/build
rm -rf $project/build/pre
mkdir $project/build/pre
$nodejs $project/preprocessor/preprocessor $project/src/js/math.js $project/build/pre/math.js
$nodejs $project/preprocessor/preprocessor $project/src/js/core.js $project/build/pre/core.js
$nodejs $project/preprocessor/preprocessor $project/src/js/scene.js $project/build/pre/scene.js
$nodejs $project/preprocessor/preprocessor $project/src/js/renderer.js $project/build/pre/renderer.js
$nodejs $project/preprocessor/preprocessor $project/src/js/shader.js $project/build/pre/shader.js
$nodejs $project/preprocessor/preprocessor $project/src/js/meshfactory.js $project/build/pre/meshfactory.js
cp $project/src/js/constants.js $project/build/pre/constants.js

##############################################################################
echo "Running Google Clojure compiler"
java -jar $googleClojure  --js_output_file "$project/build/kick-min.js.tmp" --js $project/build/pre/constants.js --js $project/build/pre/math.js --js $project/build/pre/core.js --js $project/build/pre/scene.js --js $project/build/pre/renderer.js --js $project/build/pre/shader.js --js $project/build/pre/meshfactory.js --language_in ECMASCRIPT5_STRICT

##############################################################################
echo "Creating kick-uncompressed.js"
cat "$project/license.txt" $project/build/pre/constants.js $project/build/pre/math.js $project/build/pre/core.js $project/build/pre/scene.js $project/build/pre/renderer.js $project/build/pre/shader.js $project/build/pre/meshfactory.js > $project/build/kick-uncompressed-$version.js

##############################################################################
echo "Adding license info compiler"
cat "$project/license.txt" "$project/build/kick-min.js.tmp" > "$project/build/kick-min-$version.js"
rm "$project/build/kick-min.js.tmp"

##############################################################################
echo "Copy kickjs to editor"
cp "$project/build/kick-min-$version.js" ""$project/example/shader_editor/kick/kick-min-$version.js""
cp "$project/build/kick-uncompressed-$version.js" ""$project/example/shader_editor/kick/kick-uncompressed-$version.js""