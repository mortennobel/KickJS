define(["kick"],
    function (kick) {
        var Constants = kick.core.Constants;
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
                faceCull = new Y.ButtonGroup({
                    srcNode: '#faceculling',
                    type: 'radio'
                }),
                zTest = new Y.ButtonGroup({
                    srcNode: '#zTest',
                    type: 'radio'
                }),
                sourceFactorRGB = document.getElementById("blendSFactorRGB"),
                sourceFactorAlpha = document.getElementById("blendSFactorAlpha"),
                destFactorRGB = document.getElementById("blendDFactorRGB"),
                destFactorAlpha = document.getElementById("blendDFactorAlpha"),
                thisObj = this,
                getSelectValue = function(elem){
                    return elem.options[elem.selectedIndex].value;
                },
                setSelectedValue = function(elem,value){
                    for (var i=0;i<elem.options.length;i++){
                        if (elem.options[i].value == value){
                            elem.selectedIndex = i;
                        }
                    }
                },
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
                },
                decorateSelector = function(elem){
                    for (var i=0;i<elem.options.length;i++){
                        var value = Constants[elem.options[i].text];
                        elem.options[i].value = value;
                    }
                    elem.onchange = updateSettings;
                },
                decorateButtonGroupWithConst = function(buttonGroup){
                    var buttons = buttonGroup.getButtons();
                    buttons.each(function(button){
                        var value= button.get("value");
                        if (typeof value === "string"){
                            button.set("value", Constants[value]);
                            console.log("Replace "+value+" with ",button.get("value"));
                        }
                    });
                };

            decorateButtonGroupWithConst(faceCull);
            decorateButtonGroupWithConst(zTest);

            decorateSelector(sourceFactorRGB);
            decorateSelector(sourceFactorAlpha);
            decorateSelector(destFactorRGB);
            decorateSelector(destFactorAlpha);

            projection.render();
            meshsetting.render();
            rotatemesh.render();
            blending.render();
            faceCull.render();
            zTest.render();

            this.getSettingsData = function () {
                return {
                    meshsetting: getButtonGroupValue(meshsetting),
                    projection: getButtonGroupValue(projection),
                    rotatemesh: getButtonGroupValue(rotatemesh),
                    blending: getButtonGroupValue(blending),
                    zTest: Number(getButtonGroupValue(zTest)),
                    faceCulling: Number(getButtonGroupValue(faceCull)),
                    blendSFactorRGB: Number(getSelectValue(sourceFactorRGB)),
                    blendSFactorAlpha: Number(getSelectValue(sourceFactorAlpha)),
                    blendDFactorRGB: Number(getSelectValue(destFactorRGB)),
                    blendDFactorAlpha: Number(getSelectValue(destFactorAlpha)),
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
                setButtonGroupValue(faceCull, ""+settingsData.faceCulling);
                setButtonGroupValue(zTest, ""+settingsData.zTest);

                setSelectedValue(sourceFactorRGB, settingsData.blendSFactorRGB);
                setSelectedValue(sourceFactorAlpha, settingsData.blendSFactorAlpha);
                setSelectedValue(destFactorRGB, settingsData.blendDFactorRGB);
                setSelectedValue(destFactorAlpha, settingsData.blendDFactorAlpha);

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
            faceCull.on("click", updateSettings);
            zTest.on("click", updateSettings);

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