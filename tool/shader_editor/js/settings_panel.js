define([],
    function () {
        "use strict";
        return function(Y, shaderEditor){
            var projection = new Y.ButtonGroup({
                    srcNode: '#projection',
                    type: 'radio'
                }),

                meshsetting = new Y.ButtonGroup({
                    srcNode: '#meshsetting',
                    type: 'radio'
                }),
                rotatemesh = new Y.ButtonGroup({
                    srcNode: '#rotatemesh',
                    type: 'radio'
                }),
                blending = new Y.ButtonGroup({
                    srcNode: '#blending',
                    type: 'radio'
                }),
                thisObj = this,
                addChildListeners = function (component, listener, listenerNames, tag) {
                    var i, j;
                    for (i = 0; i < component.children.length; i++) {
                        if (Array.isArray(listenerNames)) {
                            for (j = 0; j < listenerNames.length; j++) {
                                component.children[i].addEventListener(listenerNames[j], listener, false);
                            }
                        } else {
                            component.children[i].addEventListener(listenerNames, listener, false);
                        }
                        if (tag) {
                            component.children[i][tag] = i;
                        }
                    }
                },
                getChildrenValueVector = function (elementName) {
                    var elem = document.getElementById(elementName),
                        array = [],
                        i,
                        count = 0;
                    for (i = 0; i < elem.children.length; i++) {
                        if (elem.children[i].nodeName === 'INPUT') {
                            array[count++] = Number(elem.children[i].value);
                        }
                    }
                    return array;
                },
                setChildrenValueVector = function (elementName, vector) {
                    var elem = document.getElementById(elementName),
                        i,
                        count = 0,
                        childElem;
                    for (i = 0; i < elem.children.length; i++) {
                        childElem = elem.children[i];
                        if (childElem.nodeName === 'INPUT') {
                            childElem.value = vector[count++];
                        }
                    }
                },
                getButtonGroupValue = function(buttonGroup){
                    var selected = buttonGroup.getSelectedButtons ();
                    if (selected.length >0 ){
                        return selected[0].get("value");
                    } else {
                        return "";
                    }
                },
                setButtonGroupValue = function(buttonGroup, value){
                    var buttons = buttonGroup.getButtons(),
                        first = true,
                        anyChecked = false;
                    buttons.each(function(button){
                        var selected = button.get("value") === value || (!value && first);
                        if (selected){
                            button.addClass(Y.ButtonGroup.CLASS_NAMES.SELECTED);
                            anyChecked = true;
                        } else {
                            button.removeClass(Y.ButtonGroup.CLASS_NAMES.SELECTED);
                        }
                        first = false;
                    });
                    if (!anyChecked){
                        buttons.item(0).addClass(Y.ButtonGroup.CLASS_NAMES.SELECTED);
                    }
                },
                getRadioValue = function (elementName) {
                    var elem = document.getElementById(elementName),
                        i,
                        childElem;
                    for (i = 0; i < elem.children.length; i++) {
                        childElem = elem.children[i];
                        if (childElem.nodeName === 'INPUT') {
                            if (childElem.checked) {
                                return childElem.value;
                            }
                        }
                    }
                    return null;
                },
                setRadioValue = function (elementName, value) {
                    var elem = document.getElementById(elementName),
                        checked = null,
                        isElementChecked,
                        firstInputElement = null,
                        i,
                        childElem;
                    for (i = 0; i < elem.children.length; i++) {
                        childElem = elem.children[i];
                        if (childElem.nodeName === 'INPUT') {
                            isElementChecked = childElem.value === value;
                            childElem.checked = isElementChecked;
                            if (isElementChecked) {
                                checked = childElem;
                            }
                            if (firstInputElement === null) {
                                firstInputElement = childElem;
                            }
                        }
                    }
                    if (checked === null) { // if no element found - check the first element
                        firstInputElement.checked = true;
                    }
                },
                updateSettings = function () {
                    var data = thisObj.getSettingsData();
                    shaderEditor.updateSettings(data);

                    var blendingoptions = document.getElementById("blendingoptions");
                    if (getButtonGroupValue(blending) === "off"){
                        blendingoptions.className = "hiddenPanel";
                    } else {
                        blendingoptions.className = "";
                    }
                };


            projection.render();
            meshsetting.render();
            rotatemesh.render();
            blending.render();

            this.getSettingsData = function () {
                return {
                    meshsetting: getButtonGroupValue(meshsetting),
                    projection: getButtonGroupValue(projection),
                    rotatemesh: getButtonGroupValue(rotatemesh),
                    blending: getButtonGroupValue(blending),
                    lightrot: getChildrenValueVector('lightrot'),
                    lightcolor: getChildrenValueVector('lightcolor'),
                    lightAmbient: getChildrenValueVector('ambientLight'),
                    lightintensity: Number(document.getElementById('lightintensity').value)
                };
            };

            this.setSettingsData = function (settingsData) {
                setButtonGroupValue(meshsetting,settingsData.meshsetting );
                setButtonGroupValue(projection,settingsData.projection );
                setButtonGroupValue(rotatemesh, settingsData.rotatemesh);
                setButtonGroupValue(blending, settingsData.blending);
                var lightintensity = document.getElementById('lightintensity');
                setChildrenValueVector('lightrot', settingsData.lightrot);
                setChildrenValueVector('lightcolor', settingsData.lightcolor);
                lightintensity.value = settingsData.lightintensity;
                updateSettings();
            };

            meshsetting.on("click", updateSettings);
            projection.on("click", updateSettings);
            rotatemesh.on("click", updateSettings);
            blending.on("click", updateSettings);

            (function addLightListeners() {
                var lightpos = document.getElementById('lightpos'),
                    lightrot = document.getElementById('lightrot'),
                    lightcolor = document.getElementById('lightcolor'),
                    lightintensity = document.getElementById('lightintensity');

                addChildListeners(lightrot, updateSettings, ['click', 'change'], "position");
                addChildListeners(lightcolor, updateSettings, ['click', 'change'], "position");

                lightintensity.addEventListener('change', updateSettings, false);
                lightintensity.addEventListener('click', updateSettings, false);
            }());


            (function addAmbientListener() {
                var am = document.getElementById('ambientLight');
                addChildListeners(am, updateSettings, ['click', 'change'], "position");
            }());
        };
    }
);