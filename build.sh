#!/bin/sh
# The location of your yuidoc install
yuidoc_bin=$1

#Location of project
project=$2

#Location of Google Clojure Compiler (http://code.google.com/p/closure-compiler/)
googleClojure=$3

#Location of Node.js
nodejs=$4

#Location of Rhino (js.jar) (http://www.mozilla.org/rhino/)
rhino=$5

version=0_5_0

# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.  You can specify multiple
# source trees:
parser_in=$project/src/js

# The location to output the parser data.  This output is a file containing a 
# json string, and copies of the parsed files.
parser_out=$project/API/parser

# The directory to put the html file outputted by the generator
generator_out=$project/API/generator

# The version of your project to display within the documentation.
version=0.5.0

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
$nodejs $project/preprocessor/include_glsl_files $project/src/glsl/ $project/src/js/kick/material/glslconstants.js

##############################################################################
echo "Running Precompiler dev"
mkdir $project/build
rm -rf $project/build/pre
mkdir $project/build/pre
$nodejs $project/preprocessor/preprocessor $project/src/js $project/build/pre $version true true

echo "Package AMD and compress (debug)"

java -classpath $rhino:$googleClojure org.mozilla.javascript.tools.shell.Main $project/preprocessor/r.js -o name=kick out=$project/build/kick-debug.js.tmp baseUrl=$project/build/pre optimize=none


##############################################################################
echo "Generating documentation (YUI Doc)"

# Install (when running NodeJS using sudo npm -g i yuidocjs
# Unix specific and specific for (!!!)
export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:$PATH
cd $parser_in
echo $yuidoc_bin $parser_in -o $generator_out
$yuidoc_bin -c $project/yuidoc.json . -o $generator_out

##############################################################################
echo "Zipping Documentation (YUI Doc)"
cd $project/API
mv generator API_$version
rm $project/API_$version.zip
zip -r ../API_$version.zip API_$version
mv API_$version generator

##############################################################################
echo "Running Precompiler release"
mkdir $project/build
rm -rf $project/build/pre
mkdir $project/build/pre
$nodejs $project/preprocessor/preprocessor $project/src/js $project/build/pre $version false false

echo "Package AMD and compress (release)"

java -classpath $rhino:$googleClojure org.mozilla.javascript.tools.shell.Main $project/preprocessor/r.js -o name=kick out=$project/build/kick.js.tmp baseUrl=$project/build/pre

##############################################################################
echo "Adding license info compiler"
cat "$project/license_min.txt" "$project/build/kick-debug.js.tmp" > "$project/build/kick-debug.js"
cat "$project/license_min.txt" "$project/build/kick.js.tmp" > "$project/build/kick.js"
rm "$project/build/kick-debug.js.tmp"
rm "$project/build/kick.js.tmp"

##############################################################################
echo "Copy kickjs to examples"
mkdir "$project/example/js/"
cp "$project/build/kick.js" "$project/example/js/kick.js"
cp "$project/build/kick-debug.js" "$project/example/js/kick-debug.js"
mkdir "$project/tools/js/"
cp "$project/build/kick.js" "$project/tools/js/kick.js"
cp "$project/build/kick-debug.js" "$project/tools/js/kick-debug.js"

echo "Build finished"
date