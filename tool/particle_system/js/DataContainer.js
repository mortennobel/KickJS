define([],
    function () {
        "use strict";
        return function() {
            this.message = 'dat.gui';
            this.speed = 0.8;
            this.color0 = [0,0,0,1];
            this.color1 = [0,0,0,1];
            this.color2 = [0,0,0,1];
            this.color3 = [0,0,0,1];
            this.color4 = [0,0,0,1];
            this.colorVariance = [0,0,0,1];

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
