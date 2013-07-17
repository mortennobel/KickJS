define(["kick"],
    function (kick) {
        "use strict";

        var convertToArray = function(value){
                if (Array.isArray(value)){
                    return value;
                }
                if (typeof value === "string" && value.charAt(0) === '#'){
                    return [(parseInt(value.substring(1), 16)>>16)%256,(parseInt(value.substring(1), 16)>>8)%256,(parseInt(value.substring(1), 16))%256,0];
                }
                return [0,0,0,0];
            },
            createColorWrapper = function(obj, colorName, onlyVec3){
                var o = {};
                Object.defineProperty(o, colorName, {
                    get: function(){
                        var array = obj[colorName];
                        if (onlyVec3){
                            return [array[0]*255,array[1]*255,array[2]*255,1];
                        } else {
                            return [array[0]*255,array[1]*255,array[2]*255,array[3]?array[3]:0];
                        }

                    },
                    set: function(value){
                        value = convertToArray(value);
                        if (onlyVec3){
                            obj[colorName] = [parseFloat(value[0]/255),
                                parseFloat(value[1]/255),
                                parseFloat(value[2]/255)];
                        } else {
                            obj[colorName] = [parseFloat(value[0]/255),
                                parseFloat(value[1]/255),
                                parseFloat(value[2]/255),
                                parseFloat(value[3])];
                        }

                    }
                });
                return o;
            },
            createArrayWrapper = function(obj, arrayName, indeces, exposedNames, localCache){
                var o = {},
                    cache = obj[arrayName];

                for (var i=0;i<indeces.length;i++){
                    (function(i){
                        Object.defineProperty(o, exposedNames[i], {
                            get: function(){
                                if (localCache){
                                    return cache[indeces[i]];
                                } else {
                                    return obj[arrayName][indeces[i]];
                                }
                            },
                            set: function(value){
                                if (localCache){
                                    cache[indeces[i]] = value;
                                    obj[arrayName] = cache;
                                } else {
                                    var v = obj[arrayName];
                                    v[indeces[i]] = value;
                                    obj[arrayName] = v;
                                }
                            }
                        });
                    })(i);
                }
                return o;
            };

        return function(scene){
            var gui = new  dat.GUI();

            function addGeometry(obj, name, showMesh){
                var objectGUI = gui.addFolder(name);
                if (showMesh){
                    objectGUI.add(obj, 'objectMesh', {
                        Cube: kick.core.Project.ENGINE_MESH_CUBE,
                        Sphere: kick.core.Project.ENGINE_MESH_UVSPHERE} );
                }
                var transform = createArrayWrapper(obj.transform, "localPosition", [0,1,2],
                    ['PositionX','PositionY','PositionZ']);
                objectGUI.add(transform, 'PositionX',-5,5);
                objectGUI.add(transform, 'PositionY',-5,5);
                objectGUI.add(transform, 'PositionZ',-5,5);
                var scale = createArrayWrapper(obj.transform, "localScale", [0,1,2],
                    ['ScaleX','ScaleY','ScaleZ']);
                objectGUI.add(scale, 'ScaleX',-5,5);
                objectGUI.add(scale, 'ScaleY',-5,5);
                objectGUI.add(scale, 'ScaleZ',-5,5);
                var rotate = createArrayWrapper(obj.transform, "localRotationEuler", [0,1,2],
                    ['RotateX','RotateY','RotateZ'],true);
                objectGUI.add(rotate, 'RotateX',0,360);
                objectGUI.add(rotate, 'RotateY',0,360);
                objectGUI.add(rotate, 'RotateZ',0,360);
            }
            function addMaterial(obj, name){
                var objectGUI = gui.addFolder(name);
                objectGUI.add(obj, 'shader', {
                    Diffuse: kick.core.Project.ENGINE_SHADER_DIFFUSE,
                    Specular: kick.core.Project.ENGINE_SHADER_SPECULAR,
                    Unlit: kick.core.Project.ENGINE_SHADER_UNLIT,
                    TransparentDiffuse: kick.core.Project.ENGINE_SHADER_TRANSPARENT_DIFFUSE,
                    TransparentSpecular: kick.core.Project.ENGINE_SHADER_TRANSPARENT_SPECULAR,
                    TransparentUnlit: kick.core.Project.ENGINE_SHADER_TRANSPARENT_UNLIT
                } );
                objectGUI.addColor(createColorWrapper(obj,"mainColor"), "mainColor");
                objectGUI.addColor(createColorWrapper(obj,"specularColor"), "specularColor");
                objectGUI.add(obj, "specularExponent",0.1,200);

                /*
                * mainColor:{
                                        get:function(){
                                            return meshRenderer.material.getUniform ( "mainColor" );
                                        },
                                        set:function(newValue){
                                            meshRenderer.material.setUniform ( "mainColor",  newValue);
                                        }
                                    },
                                    :{
                                        get:function(){
                                            return meshRenderer.material.getUniform ( "specularColor" );
                                        },
                                        set:function(newValue){
                                            meshRenderer.material.setUniform ( "specularColor",  newValue);
                                        }
                                    },
                                    :{
                                        get:function(){
                                            return meshRenderer.material.getUniform ( "specularExponent" );
                                        },
                                        set:function(newValue){
                                            meshRenderer.material.setUniform ( "specularExponent",  newValue);
                                        }
                                    }
                * */
            }


            gui.add(scene, 'shadow');
            addGeometry(scene.object, 'Object',true);
            addMaterial(scene.object, 'Object material');
            addMaterial(scene.floor, 'Floor material');
            var directionalLightGUI = gui.addFolder("Directional Light");
            directionalLightGUI.addColor(createColorWrapper(scene.directionalLight,"color", true), "color");
            directionalLightGUI.add(scene.directionalLight,"intensity", 0, 3);
            var rotate = createArrayWrapper(scene.directionalLightTransform, "localRotationEuler", [0,1,2],
                                ['RotateX','RotateY','RotateZ'],true);
            directionalLightGUI.add(rotate, 'RotateX',0,360);
            directionalLightGUI.add(rotate, 'RotateY',0,360);
            directionalLightGUI.add(rotate, 'RotateZ',0,360);
            directionalLightGUI.add(scene.directionalLight, 'shadowStrength',0,1);
            directionalLightGUI.add(scene.directionalLight, 'shadowBias',-1,1);

            var ambientLightGUI = gui.addFolder("Ambient Light");
            ambientLightGUI.addColor(createColorWrapper(scene.ambientLight,"color", true), "color");
            ambientLightGUI.add(scene.ambientLight,"intensity", 0, 3);
        };

    }
);

