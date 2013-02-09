define([],
    function () {
        "use strict";
        return function(Y, shaderEditor, KICK) {
            var c = KICK.core.Constants,
                currentTextures = document.getElementById('currentTextures'),
                getSelectedGLConstant = function (elementId) {
                    var elem = document.getElementById(elementId),
                        options = elem.options,
                        selectedIndex = elem.selectedIndex;
                    if (selectedIndex === -1) {
                        return null;
                    }
                    return options[elem.selectedIndex].gl;
                },
                setSelectedGLConstant = function (elementId, glConst) {
                    var elem = document.getElementById(elementId),
                        options = elem.options,
                        i;
                    for (i = 0; i < options.length; i++) {
                        if (options[i].gl === glConst) {
                            elem.selectedIndex = i;
                            return true;
                        }
                    }
                    return false;
                },
                /**
                 * Add gl attribute to option elements of a select
                 * @param elementId select element to be modified
                 * @param constants array of GL constants
                 */
                    addGLConstantToSelect = function (elementId, constants) {
                    var elem = document.getElementById(elementId),
                        options = elem.options,
                        i;

                    if (options.length !== constants.length) {
                        throw new Error("options.length !== constants.length");
                    }
                    for (i = 0; i < options.length; i++) {
                        options[i].gl = constants[i];
                    }
                },
                removeTexture = function () {
                    var currentTextures = document.getElementById('currentTextures'),
                        selectedIndex = currentTextures.selectedIndex;
                    if (selectedIndex === -1) {
                        return;
                    }
                    currentTextures.remove(selectedIndex);
                    shaderEditor.textures.splice(selectedIndex, 1);
                },
                textureSelected = function () {
                    var currentTextures = document.getElementById('currentTextures'),
                        selectedIndex = currentTextures.selectedIndex,
                        c = KICK.core.Constants,
                        texture;
                    if (selectedIndex < 0) {
                        console.log("No texture selected");
                        return;
                    }
                    texture = shaderEditor.textures[selectedIndex];
                    document.getElementById('textureSrc').value = texture.dataURI;
                    document.getElementById('texturePreviewImg').src = shaderEditor.getWrappedImageSource(texture.dataURI);

                    setSelectedGLConstant('textureFormat', texture.internalFormat);
                    document.getElementById('mipMapping').checked = texture.generateMipmaps;
                    setSelectedGLConstant('textureMode', texture.wrapS);
                    document.getElementById('flipY').checked = texture.flipY;
                    setSelectedGLConstant('minFilter', texture.minFilter);
                    setSelectedGLConstant('magFilter', texture.magFilter);
                    setSelectedGLConstant('textureType', texture.textureType);

                    document.getElementById('textureDetails').style.display = 'block';
                    document.getElementById('texturePreview').style.display = 'block';
                },
                addTexture = function () {
                    var t = new KICK.texture.Texture(),
                        currentTextures = document.getElementById('currentTextures'),
                        newOption = document.createElement('option');
                    newOption.value = currentTextures.options.length;
                    currentTextures.add(newOption, null);
                    currentTextures.selectedIndex = currentTextures.options.length - 1;
                    shaderEditor.textures.push(t);
                    textureSelected();
                },
                textureUpdate = function () {
                    var currentTextures = document.getElementById('currentTextures'),
                        selectedIndex = currentTextures.selectedIndex,
                        imgSrc = document.getElementById('textureSrc').value,
                        preview = document.getElementById('texturePreviewImg'),
                        texture,
                        textureConf,
                        updatePreview = function (url) {
                            preview.src = url;
                        };
                    if (selectedIndex < 0) {
                        return;
                    }
                    currentTextures.options[selectedIndex].text = (imgSrc.length < 40) ? imgSrc : imgSrc.substr(0, 40) + '...';
                    texture = shaderEditor.textures[selectedIndex];
                    textureConf = {
                        internalFormat: getSelectedGLConstant('textureFormat'),
                        generateMipmaps: document.getElementById('mipMapping').checked,
                        wrapS: getSelectedGLConstant('textureMode'),
                        wrapT: getSelectedGLConstant('textureMode'),
                        flipY: document.getElementById('flipY').checked,
                        minFilter: getSelectedGLConstant('minFilter'),
                        magFilter: getSelectedGLConstant('magFilter'),
                        textureType: getSelectedGLConstant('textureType'),
                        dataURI: imgSrc
                    };
                    shaderEditor.updateTexture(texture, textureConf, updatePreview);
                };

            this.refreshTextures = function () {
                var textures = shaderEditor.textures,
                    i,
                    imageSrc,
                    newOption;
                // remove all elements from texture list
                while (currentTextures.options.length > 0) {
                    currentTextures.remove(0);
                }
                for (i = 0; i < textures.length; i++) {
                    imageSrc = textures[i].dataURI;
                    newOption = document.createElement('option');
                    newOption.text = (!imageSrc) ? "" : (imageSrc.length < 40 ? imageSrc : imageSrc.substr(0, 40) + '...');
                    newOption.value = currentTextures.options.length;
                    currentTextures.add(newOption, null);
                }
            };

            this.getTextureData = function () {
                return shaderEditor.textures;
            };

            Y.one("#addTextureButton").on('click', addTexture);
            Y.one("#removeTextureButton").on('click', removeTexture);
            Y.one("#currentTextures").on('click', textureSelected);
            Y.one('#updateTexture').on('click', textureUpdate);

            addGLConstantToSelect('textureFormat', [c.GL_ALPHA, c.GL_RGB, c.GL_RGBA, c.GL_LUMINANCE, c.GL_LUMINANCE_ALPHA]);
            addGLConstantToSelect('textureMode', [c.GL_REPEAT, c.GL_CLAMP_TO_EDGE]);
            addGLConstantToSelect('minFilter', [c.GL_NEAREST, c.GL_LINEAR, c.GL_NEAREST_MIPMAP_NEAREST, c.GL_LINEAR_MIPMAP_NEAREST, c.GL_NEAREST_MIPMAP_LINEAR, c.GL_LINEAR_MIPMAP_LINEAR]);
            addGLConstantToSelect('magFilter', [c.GL_NEAREST, c.GL_LINEAR]);
            addGLConstantToSelect('textureType', [c.GL_TEXTURE_2D, c.GL_TEXTURE_CUBE_MAP]);

            document.getElementById('textureTypeInfo').addEventListener('click', function () {
                window.YUIMessage("Texture type", "Cube maps must be arranged in one row with the order [Right, Left, Top, Bottom, Front, Back] (also used in <a href='http://www.cgtextures.com/content.php?action=tutorial&name=cubemaps'>NVidia DDS Exporter</a>)<br>");
            }, false);
        };
    }
);