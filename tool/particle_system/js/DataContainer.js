define([],
    function () {
        "use strict";
        return function(particleSystem) {
            this.message = 'dat.gui';
            this.speed = 0.8;
            this.color0 = [0,0,0,1];
            this.color1 = [0,0,0,1];
            this.color2 = [0,0,0,1];
            this.color3 = [0,0,0,1];
            this.color4 = [0,0,0,1];
            this.colorVariance = [0,0,0,1];

            var position = new Float32Array(3);

            this.numberOfParticles = 1024;

            Object.defineProperties(this, {
                pointSize: {
                    get:function(){
                        return particleSystem.pointSize;
                    },
                    set:function(newValue){
                        particleSystem.pointSize = newValue;
                    }
                },
                maxAge: {
                    get:function(){
                        return particleSystem.maxAge;
                    },
                    set:function(newValue){
                        particleSystem.maxAge = newValue;
                    }
                },
                enabled: {
                    get:function(){
                        return particleSystem.enabled;
                    },
                    set:function(newValue){
                        particleSystem.enabled = newValue;
                    }
                },
                positionX: {
                    get:function(){
                        return position[0];
                    },
                    set:function(newValue){
                        position[0] = newValue;
                        particleSystem.gameObject.transform.position = position;
                    }
                },
                positionY: {
                    get:function(){
                        return position[1];
                    },
                    set:function(newValue){
                        position[1] = newValue;
                        particleSystem.gameObject.transform.position = position;
                    }
                },
                positionZ: {
                    get:function(){
                        return position[2];
                    },
                    set:function(newValue){
                        position[2] = newValue;
                        particleSystem.gameObject.transform.position = position;
                    }
                }
            });

            this.velocity = {
                x: 1,
                y: 1,
                z: 1,
                directionVariance: 1,
                speedVariance: 1
            };

            this.size = {
                start: 1,
                end: 1,
                variance: 1
            };

            this.rotation = {
                start:1,
                end: 1,
                variance: 1
            };

            this.lifespan = {
                time: 1,
                variance:1
            };

            this.textureUrl = "";

            this.apply = function() {
                console.log("Apply");
            };
        };

    }
);
