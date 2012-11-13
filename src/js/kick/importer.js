define(["./importer/ColladaImporter", "./importer/ObjImporter"],
    function (ColladaImporter, ObjImporter) {
        "use strict";
        return {
            ColladaImporter: ColladaImporter,
            ObjImporter: ObjImporter
        };
    });