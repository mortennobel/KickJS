define([],
    function () {
        "use strict";
        return function(Y, shaderEditor, KICK) {
            var getUniformType = function (uniform) {
                    var type = "Unknown " + uniform.type,
                        c = KICK.core.Constants,
                        uniformGroup = "number",
                        isMatrix = false,
                        isInteger = false,
                        length;
                    switch (uniform.type) {
                    case c.GL_FLOAT:
                        type = "float";
                        length = 1;
                        break;
                    case c.GL_FLOAT_MAT2:
                        type = "float_mat2";
                        length = 4;
                        isMatrix = true;
                        break;
                    case c.GL_FLOAT_MAT3:
                        type = "float_mat3";
                        length = 9;
                        isMatrix = true;
                        break;
                    case c.GL_FLOAT_MAT4:
                        type = "float_mat4";
                        length = 16;
                        isMatrix = true;
                        break;
                    case c.GL_FLOAT_VEC2:
                        type = "float_vec2";
                        length = 2;
                        break;
                    case c.GL_FLOAT_VEC3:
                        type = "float_vec3";
                        length = 3;
                        break;
                    case c.GL_FLOAT_VEC4:
                        type = "float_vec4";
                        length = 4;
                        break;
                    case c.GL_INT:
                        type = "int";
                        length = 1;
                        isInteger = true;
                        break;
                    case c.GL_INT_VEC2:
                        type = "int_vec2";
                        length = 2;
                        isInteger = true;
                        break;
                    case c.GL_INT_VEC3:
                        type = "int_vec3";
                        length = 3;
                        isInteger = true;
                        break;
                    case c.GL_INT_VEC4:
                        type = "int_vec4";
                        length = 4;
                        isInteger = true;
                        break;
                    case c.GL_SAMPLER_2D:
                        type = "Sampler 2D";
                        uniformGroup = "sampler";
                        length = 1;
                        break;
                    case c.GL_SAMPLER_CUBE:
                        type = "Sampler cube";
                        uniformGroup = "sampler";
                        length = 1;
                        break;
                    }

                    if (uniform.name.indexOf("_") === 0) {
                        uniformGroup = "autobound";
                    }

                    return {
                        type: type,
                        group: uniformGroup,
                        length: length,
                        isMatrix: isMatrix,
                        isInteger: isInteger
                    };
                },
                getUniformNumberElement = function (index) {
                    return document.getElementById("uniform_" + index);
                },
                setUniformNumberValue = function (uniform, value) {
                    var uniformTypeObj = getUniformType(uniform),
                        uniformLength = uniformTypeObj.length,
                        isMatrix = uniformTypeObj.isMatrix,
                        matrixWidth,
                        elem,
                        i,
                        x,
                        y,
                        arrayIndex;
                    if (isMatrix) {
                        matrixWidth = 4;
                        switch (uniformLength) {
                        case 4:
                            matrixWidth = 2;
                            break;
                        case 9:
                            matrixWidth = 3;
                            break;
                        }

                        for (x = 0; x < 4; x++) {
                            for (y = 0; y < 4; y++) {
                                i = x * 4 + y;
                                arrayIndex = x * matrixWidth + y;
                                elem = getUniformNumberElement(i);
                                if (Math.max(x, y) < matrixWidth) {
                                    elem.style.display = 'inline';
                                    elem.value = value ? value[arrayIndex] : 0;
                                } else {
                                    elem.style.display = 'none';
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < 16; i++) {
                            elem = getUniformNumberElement(i);
                            if (i < uniformLength) {
                                elem.style.display = 'inline';
                                elem.value = value ? value[i] : 0;
                            } else {
                                elem.style.display = 'none';
                            }
                        }
                    }
                },
                getUniformNumberValue = function (uniform) {
                    var uniformTypeObj = getUniformType(uniform),
                        uniformLength = uniformTypeObj.length,
                        isMatrix = uniformTypeObj.isMatrix,
                        matrixWidth,
                        isInteger = uniformTypeObj.isInteger,
                        array = isInteger ? new Int32Array(uniformLength) : new Float32Array(uniformLength),
                        i,
                        elem,
                        x,
                        y,
                        arrayIndex;
                    if (isMatrix) {
                        matrixWidth = 4;
                        switch (uniformLength) {
                        case 4:
                            matrixWidth = 2;
                            break;
                        case 9:
                            matrixWidth = 3;
                            break;
                        }

                        for (x = 0; x < 4; x++) {
                            for (y = 0; y < 4; y++) {
                                i = x * 4 + y;
                                arrayIndex = x * matrixWidth + y;
                                elem = getUniformNumberElement(i);
                                if (Math.max(x, y) < matrixWidth) {
                                    array[arrayIndex] = Number(elem.value);
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < 16; i++) {
                            elem = getUniformNumberElement(i);
                            if (i < uniformLength) {
                                array[i] = Number(elem.value);
                            }
                        }
                    }
                    return array;
                },
                updateUniformSampler = function () {
                    var uniform_sampler = document.getElementById('uniform_sampler'),
                        selectedSampler = uniform_sampler.selectedIndex,
                        material = shaderEditor.material,
                        activeUniforms = material.shader.activeUniforms,
                        uniformDetail = document.getElementById('uniformDetail'),
                        currentUniforms = document.getElementById('currentUniforms'),
                        selectedIndex = currentUniforms.selectedIndex,
                        uniform = activeUniforms[selectedIndex],
                        c = KICK.core.Constants,
                        selectedTexture = shaderEditor.textures[selectedSampler];
                    material.setUniform(uniform.name, selectedTexture);
                    material.shader.markUniformUpdated();
                },
                updateUniformNumber = function () {
                    var uniform_sampler = document.getElementById('uniform_sampler'),
                        material = shaderEditor.material,
                        activeUniforms = material.shader.activeUniforms,
                        uniformDetail = document.getElementById('uniformDetail'),
                        currentUniforms = document.getElementById('currentUniforms'),
                        selectedIndex = currentUniforms.selectedIndex,
                        uniform = activeUniforms[selectedIndex],
                        c = KICK.core.Constants;
                    material.setUniform(uniform.name, getUniformNumberValue(uniform));
                    material.shader.markUniformUpdated();
                },
                uniformSelected = function () {
                    var material = shaderEditor.material,
                        activeUniforms = material.shader.activeUniforms,
                        uniformDetail = document.getElementById('uniformDetail'),
                        currentUniforms = document.getElementById('currentUniforms'),
                        selectedIndex = currentUniforms.selectedIndex,
                        uniform = activeUniforms[selectedIndex],
                        uniformTypeObj = getUniformType(uniform),
                        uniformType = uniformTypeObj.type,
                        uniformGroup = uniformTypeObj.group,
                        materialUniform,
                        uniform_sampler,
                        i,
                        texture,
                        imageSrc,
                        newOption;

                    uniformDetail.style.display = 'block';
                    if (selectedIndex === -1) {
                        return;
                    }

                    Y.one("#uniformName").set("value", uniform.name);
                    Y.one("#uniformType").set("value", uniformType);
                    Y.one("#uniformSize").set("value", uniform.size);

                    document.getElementById('uniform_group_autobound').style.display = (uniformGroup === "autobound") ? "block" : "none";
                    document.getElementById('uniform_group_number').style.display = (uniformGroup === "number") ? "block" : "none";
                    document.getElementById('uniform_group_sampler').style.display = (uniformGroup === "sampler") ? "block" : "none";
                    if (uniformGroup === "autobound") {
                        return;
                    }
                    materialUniform = material.getUniform(uniform.name) || {};
                    if (uniformGroup === "number") {
                        setUniformNumberValue(uniform, materialUniform);
                    } else if (uniformGroup === "sampler") {
                        uniform_sampler = document.getElementById('uniform_sampler');
                        // remove all textures
                        while (uniform_sampler.options.length > 0) {
                            uniform_sampler.remove(0);
                        }

                        for (i = 0; i < shaderEditor.textures.length; i++) {
                            texture = shaderEditor.textures[i];
                            imageSrc = texture.dataURI;
                            newOption = document.createElement('option');
                            newOption.text = (imageSrc.length < 40) ? imageSrc : imageSrc.substr(0, 40) + '...';
                            uniform_sampler.add(newOption);
                            if (texture === materialUniform) {
                                uniform_sampler.selectedIndex = i;
                            }
                        }
                    }
                };

            this.refreshUniforms = function () {
                var activeUniforms = shaderEditor.material.shader.activeUniforms,
                    i,
                    currentUniforms = document.getElementById('currentUniforms'),
                    uniformDetail = document.getElementById('uniformDetail'),
                    activeUniform,
                    newOption,
                    type;

                // hide uniform details
                uniformDetail.style.display = 'none';

                // remove all elements from uniform list
                while (currentUniforms.options.length > 0) {
                    currentUniforms.remove(0);
                }

                // insert all uniforms
                for (i = 0; i < activeUniforms.length; i++) {
                    activeUniform = activeUniforms[i];
                    newOption = document.createElement('option');
                    type =  getUniformType(activeUniform).type;
                    newOption.text = activeUniform.name + " (" + type + ")";
                    currentUniforms.add(newOption, null);
                }
            };

            Y.one('#currentUniforms').on('click', uniformSelected, false);
            Y.one('#uniform_sampler_update').on('click', updateUniformSampler, false);
            Y.one('#uniform_number_update').on('click', updateUniformNumber, false);
        };
    }
);