requirejs.config({
    baseUrl: '.',
    paths: {
//        kick: '../../build/kick'
        kick: '../../src/js/kick'
    }
});

requirejs(['kick', 'js/DataContainer', 'js/GUI'],
    function (kick, DataContainer, GUI) {
        "use strict";

        var obj = new DataContainer();
        new GUI(obj);

    }
);
