define([],
    function () {
        "use strict";
        return function(obj) {
            var gui = new dat.GUI();

            gui.remember(obj);
            gui.add(obj, 'textureUrl');
            var colorFolder = gui.addFolder('Color');
            colorFolder.addColor(obj, 'color0');
            colorFolder.addColor(obj, 'color1');
            colorFolder.addColor(obj, 'color2');
            colorFolder.addColor(obj, 'color3');
            window.xxx = colorFolder.addColor(obj, 'color4');
            colorFolder.addColor(obj, 'colorVariance');

            var velocityFolder = gui.addFolder('Velocity');
            velocityFolder.add(obj.velocity, 'x',  0, 100);
            velocityFolder.add(obj.velocity, 'y',  0, 100);
            velocityFolder.add(obj.velocity, 'z',  0, 100);
            velocityFolder.add(obj.velocity, 'directionVariance',  0, 1);
            velocityFolder.add(obj.velocity, 'speedVariance',  0, 1);

            var sizeFolder = gui.addFolder('Size');
            sizeFolder.add(obj.size,'start',0, 100);
            sizeFolder.add(obj.size,'end',0, 100);
            sizeFolder.add(obj.size,'variance',0, 100);


            var rotationFolder = gui.addFolder('Rotation');
            rotationFolder.add(obj.rotation,'start',0, 100);
            rotationFolder.add(obj.rotation,'end',0, 100);
            rotationFolder.add(obj.rotation,'variance',0, 100);

            var lifespanFolder = gui.addFolder('Lifespan');
            lifespanFolder.add(obj.lifespan, 'time', 0, 100);
            lifespanFolder.add(obj.lifespan, 'variance', 0, 100);

            gui.add(obj, 'apply');
        };
    }
);
