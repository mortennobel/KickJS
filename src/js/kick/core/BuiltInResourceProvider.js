define(["./Util", "kick/mesh/MeshDataFactory", "kick/material/GLSLConstants", "./Constants"], function (Util, MeshDataFactory, GLSLConstants, Constants) {
    "use strict";

    var ASSERT = Constants._ASSERT;

    /**
     * Responsible for providing the built-in resources (such as textures, shaders and mesh data).
     * All build-in resources have the prefix kickjs
     * @class BuiltInResourceProvider
     * @namespace kick.core
     * @constructor
     * @extends kick.core.ResourceProvider
     * @param {kick.core.Engine} engine
     * @private
     */
    return function (engine) {
        var gl = engine.gl,
            thisObj = this;
        Object.defineProperties(this, {
            /**
             * Returns kickjs
             * @property protocol
             * @type String
             * @final
             */
            protocol: {
                value: "kickjs://"
            }
        });

        /**
         * <ul>
         * <li><b>Triangle</b> Url: kickjs://mesh/triangle/</li>
         * <li><b>Plane</b> Url: kickjs://mesh/plane/<br></li>
         * <li><b>UVSphere</b> Url: kickjs://mesh/uvsphere/?slides=20&stacks=10&radius=1.0<br>Note that the parameters is optional</li>
         * <li><b>Cube</b> Url: kickjs://mesh/cube/?length=1.0<br>Note that the parameters is optional</li>
         * <li><b>Point</b> Url: kickjs://mesh/point/</li>
         * </ul>
         * @method getMeshData
         * @param {String} url
         * @param {kick.mesh.Mesh} meshDestination
         * @param {ResourceTracker} [resourceTracker]
         */
        this.getMeshData = function (url, meshDestination, resourceTracker) {
            var meshDataObj,
                slices,
                stacks,
                radius,
                length,
                getParameterInt = Util.getParameterInt,
                getParameterFloat = Util.getParameterFloat;
            if (resourceTracker && resourceTracker.resourceLoadingStarted){
                resourceTracker.resourceLoadingStarted(url, meshDestination);
            }
            if (url.indexOf("kickjs://mesh/triangle/") === 0) {
                meshDataObj = MeshDataFactory.createTriangleData();
            } else if (url.indexOf("kickjs://mesh/plane/") === 0) {
                meshDataObj = MeshDataFactory.createPlaneData();
            } else if (url.indexOf("kickjs://mesh/uvsphere/") === 0) {
                slices = getParameterInt(url, "slices");
                stacks = getParameterInt(url, "stacks");
                radius = getParameterFloat(url, "radius");
                meshDataObj = MeshDataFactory.createUVSphereData(slices, stacks, radius);
            } else if (url.indexOf("kickjs://mesh/cube/") === 0) {
                length = getParameterFloat(url, "length");
                meshDataObj = MeshDataFactory.createCubeData(length);
            } else if (url.indexOf("kickjs://mesh/point/") === 0) {
                meshDataObj = MeshDataFactory.createPointData();
            } else {
                Util.fail("No meshdata found for " + url);
                if (resourceTracker && resourceTracker.resourceLoadingStarted){
                    resourceTracker.resourceLoadingFailed(url, meshDestination);
                }
                return;
            }

            meshDestination.meshData = meshDataObj;
            if (resourceTracker && resourceTracker.resourceLoadingStarted){
                resourceTracker.resourceLoadingFinished(url, meshDestination);
            }
        };

        /**
         * Create a default shader config based on a URL<br>
         * The following shaders are available:
         *  <ul>
         *  <li><b>Default</b> Url: kickjs://shader/default/</li>
         *  <li><b>Specular</b> Url: kickjs://shader/specular/</li>
         *  <li><b>Diffuse</b> Url: kickjs://shader/diffuse/</li>
         *  <li><b>Unlit</b> Url: kickjs://shader/unlit/</li>
         *  <li><b>Bumped Specular</b> Url: kickjs://shader/bumped\_specular/</li>
         *  <li><b>Transparent Point Unlit</b> Url: kickjs://shader/point\_transparent\_unlit/</li>
         *  <li><b>Transparent Specular</b> Url: kickjs://shader/transparent\_specular/</li>
         *  <li><b>Transparent Unlit</b> Url: kickjs://shader/transparent\_unlit/</li>
         *  <li><b>Shadowmap</b> Url: kickjs://shader/\_\_shadowmap/</li>
         *  <li><b>Pick</b> Url: kickjs://shader/\_\_pick/</li>
         *  <li><b>Error</b> Url: kickjs://shader/\_\_error/<br></li>
         *  </ul>
         * @method getShaderData
         * @param {String} url
         * @param {kick.material.Shader} shaderDestination
         */
        this.getShaderData = function (url, shaderDestination, resourceTracker) {
            var i, config,
                vertexShaderSrc,
                fragmentShaderSrc,
                blend = false,
                polygonOffsetEnabled = false,
                depthMask = true,
                renderOrder = 1000,
                glslConstants = GLSLConstants,
                defaultUniforms = {},
                compareAndSetShader = function (shaderName) {
                    var res = url.indexOf("kickjs://shader/" + shaderName + "/") === 0;
                    if (res) {
                        vertexShaderSrc = glslConstants[shaderName + "_vs.glsl"];
                        fragmentShaderSrc = glslConstants[shaderName + "_fs.glsl"];
                        if (shaderName.indexOf("transparent_") === 0) {
                            blend = true;
                            depthMask = false;
                            renderOrder = 2000;
                        }

                        else if (shaderName === "__shadowmap") {
                            polygonOffsetEnabled = true;
                        }
                        else if (shaderName === "specular" || shaderName === "transparent_specular") {
                            defaultUniforms = {
                                mainColor: [1, 1, 1, 1],
                                mainTexture: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE),
                                specularColor: [1, 1, 1, 1],
                                specularExponent: 50
                            };
                        }
                        else if (shaderName === "diffuse" ||
                                shaderName === "transparent_diffuse" ||
                                shaderName === "unlit" ||
                                shaderName === "unlit_vertex_color" ||
                                shaderName === "transparent_unlit") {
                            defaultUniforms = {
                                mainColor: [1, 1, 1, 1],
                                mainTexture: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE)
                            };
                        }
                        else if (shaderName === "bumped_specular"){
                            defaultUniforms = {
                                mainColor: [1, 1, 1, 1],
                                mainTexture: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE),
                                normalMap: engine.project.load(engine.project.ENGINE_TEXTURE_DEFAULT_NORMAL),
                                specularColor: [1, 1, 1, 1],
                                specularExponent: 50
                            };
                        }
                        else if (shaderName === "transparent_point_sprite"){
                            defaultUniforms = {
                                mainColor: [1, 1, 1, 1],
                                mainTexture: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE),
                                pointSize: [50]
                            };
                        }

                    }
                    return res;
                },
                shaderTypes = [
                    "specular",
                    "diffuse",
                    "__shadowmap",
                    "__error",
                    "__pick",
                    "__pick_normal",
                    "__pick_uv",
                    "transparent_specular",
                    "transparent_diffuse",
                    "unlit",
                    "unlit_vertex_color",
                    "bumped_specular",
                    "transparent_point_sprite",
                    "transparent_unlit"];
            if (url === "kickjs://shader/default/") {
                url = "kickjs://shader/diffuse/";
            }
            for (i = 0; i < shaderTypes.length; i++) {
                if (compareAndSetShader(shaderTypes[i])) {
                    break;
                }
            }
            if (ASSERT) {
                if (!vertexShaderSrc) {
                    Util.fail("Cannot find shader url '" + url + "'");
                }
            }


            config = {
                blend: blend,
                depthMask: depthMask,
                renderOrder: renderOrder,
                polygonOffsetEnabled: polygonOffsetEnabled,
                vertexShaderSrc: vertexShaderSrc,
                fragmentShaderSrc: fragmentShaderSrc,
                defaultUniforms: defaultUniforms
            };

            Util.applyConfig(shaderDestination, config);
            shaderDestination.apply();
        };

        /**
         * Create a default texture based on a URL.<br>
         * The following default textures exists:
         *  <ul>
         *  <li><b>Black</b> Url: kickjs://texture/black/</li>
         *  <li><b>White</b> Url: kickjs://texture/white/<br></li>
         *  <li><b>Gray</b>  Url: kickjs://texture/gray/<br></li>
         *  <li><b>Default normal</b>  Url: kickjs://texture/default\_normal/<br></li>
         *  <li><b>Checkerboard</b>  Url: kickjs://texture/checkerboard/<br></li>
         *  <li><b>KickJS logo</b>  Url: kickjs://texture/logo/<br></li>
         *  </ul>
         * @method getImageData
         * @param uri
         * @param textureDestination
         */
        this.getImageData = function (uri, textureDestination, resourceTracker) {
            if (resourceTracker && resourceTracker.resourceLoadingStarted){
                resourceTracker.resourceLoadingStarted(url, textureDestination);
            }
            var data,
                resourceLoadingFailed = function(){
                    if (resourceTracker && resourceTracker.resourceLoadingFailed){
                        resourceTracker.resourceLoadingFailed(url, textureDestination);
                    }
                },
                img,
                logoResource = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAXgWlDQ1BJQ0MgUHJvZmlsZQAAeAGtWXc8lt/7P/cz8Xisx957Zm+y98jeyXqsx/bYu6wyUiSEKCSSaBohoYVkhKaMFFHRQsT3pvp8P3/8vv/9bi/3/Xad93Wd65zr3Ofc1wUAthueYWFBCDoAgkMiyTZGurxOzi682FcAgn8YgRBg9iRGhOlYWZmD/3n9mIC58DUmuWvrf9L+7wZ6b58IIgCQFdzs5R1BDIbxDQAQt4hh5EgAULv2BGMiw3bxSRgzkmEHYVyzi/1+49Zd7PUbD+5x7Gz0YM40ABTUnp5kPwCol2E5bzTRD7aDpwYAwxDiTQoBgMALY02iv6c3AGweMGdfcHDoLs6FsajXv+z4/Qt7enr9Y9PT0+8f/HsssCbcsT4pIizIM27vj//PW3BQFDxfexczfKcOi9S1gZ+s8LyxkiJN7GDMCGMZ/yhj+z9YP97fznGXC8udQrwsLGHMAGNvYoQePJcAtgNFB4aa7drZ5eR6++gbwBheFVBJRLTtX1wX769n8YfjFOBpuhszGpjT6kmG0e9+74dFWu36sGvzRUiQhfkfvOJLNty1D8sRGJ8IA1sYwz4gOCPJdrty2GeElC/J0ATGcL8I3bCgvTW3y7EhR9nsjkUQxt4+IfZ/dY95e+qbwXJOWF4KzIEe0Ae88D0UBMG/ZEAC3vDzr5z4L7ktiAcfQQjwARGwxh7DnZRK/ouBIfCE9f3gdsk/+rp7Eh8QDWv9+ssbWm5Z/ov/6Hj9o2EI3u7Z+GNBpkFmUWbrL5uX9q9fGAOMPsYYY4gR+yuBe/o9CvKef2bwaHxAFGzLB+77rz//HlXUP4x/S3/Pgc2eViDMIP3tGzjseUb6x5bZPzPzZy5Qwig5lCJKF6WB0kSpAl4UM4odSKIUUCooHZQWSh1uU/3XPP/R+uO/JPDdm6voPe8DwTvYc/itjvSJjYRjBfRCw+LIJD//SF4deLfw2cdrEkKU2scrJyMrB3b3nl0OAF9t9vYUiPnJf2XBTQCokOB15fZfmRe8J7RLwu9ww39lwkXwOx4AwIAgMYoc/dseaveBBlSAFl5pbIAbCABRePxyQAmoA21gAEyBJbADzsANEIE/7C8ZxIBEcARkghxwEpwGpaASVIM60AiugRbQAe6C+2AADINx8BJMg3mwBFbAD7AJQRAWwkMEiA3igYQgCUgOUoE0IQPIHLKBnCEPyA8KgaKgRCgNyoEKoFLoPFQPXYXaoLvQI2gEeg7NQIvQF+gnAomgRjAiuBDCCGmECkIHYYawQxxC+CHCEfGIdEQeogRRhbiMuIW4ixhAjCOmEUuI70iAxCGZkXxISaQKUg9piXRB+iLJyGRkNrIIWYW8gmxHPkCOIaeRy8gNFAZFQPGiJOFYGqPsUURUOCoZlYsqRdWhbqH6UGOoGdQKahuNR3OiJdBqaBO0E9oPHYPORBeha9E30ffQ4+h59A8MBsOMEcEow+vXGROAScDkYs5imjDdmBHMHOY7Fotlw0pgNbCWWE9sJDYTewZ7GXsHO4qdx65T4Ch4KOQoDClcKEIoUimKKC5RdFGMUryn2KSkoxSiVKO0pPSmjKM8QVlD2U75hHKecpOKnkqESoPKjiqA6ghVCdUVqntUr6i+4nA4fpwqzhpHwh3GleCacQ9xM7gNagZqcWo9alfqKOo86ovU3dTPqb/i8XhhvDbeBR+Jz8PX43vxU/h1GgKNFI0JjTdNCk0ZzS2aUZpPtJS0QrQ6tG608bRFtNdpn9Au01HSCdPp0XnSJdOV0bXRTdJ9pyfQy9Jb0gfT59Jfon9Ev8CAZRBmMGDwZkhnqGboZZgjIAkCBD0CkZBGqCHcI8wzYhhFGE0YAxhzGBsZhxhXmBiYFJgcmGKZypg6maaZkczCzCbMQcwnmK8xTzD/ZOFi0WHxYcliucIyyrLGysGqzerDms3axDrO+pONl82ALZAtn62F7TU7il2c3Zo9hr2C/R77MgcjhzoHkSOb4xrHC04EpzinDWcCZzXnIOd3Lm4uI64wrjNcvVzL3Mzc2twB3IXcXdyLPAQeTR4STyHPHZ4PvEy8OrxBvCW8fbwrfJx8xnxRfOf5hvg2+UX47flT+Zv4XwtQCagI+AoUCvQIrAjyCB4QTBRsEHwhRCmkIuQvVCz0QGhNWETYUfiocIvwggiriIlIvEiDyCtRvKiWaLholehTMYyYilig2FmxYXGEuKK4v3iZ+BMJhISSBEnirMTIPvQ+1X0h+6r2TUpSS+pIRks2SM5IMUuZS6VKtUh9khaUdpHOl34gvS2jKBMkUyPzUpZB1lQ2VbZd9oucuBxRrkzuqTxe3lA+Rb5VflVBQsFHoULhmSJB8YDiUcUexV9KykpkpStKi8qCyh7K5cqTKowqViq5Kg9V0aq6qimqHaobakpqkWrX1D6rS6oHql9SX9gvst9nf83+OQ1+DU+N8xrTmryaHprnNKe1+LQ8taq0ZrUFtL21a7Xf64jpBOhc1vmkK6NL1r2pu6anppek162P1DfSz9YfMmAwsDcoNZgy5Df0M2wwXDFSNEow6jZGG5sZ5xtPmnCZEE3qTVZMlU2TTPvMqM1szUrNZs3Fzcnm7QcQB0wPnDrwykLIIsSixRJYmliesnxtJWIVbnXbGmNtZV1m/c5G1ibR5oEtwdbd9pLtDztduxN2L+1F7aPsexxoHVwd6h3WHPUdCxynnaSdkpwGnNmdSc6tLlgXB5dal+8HDQ6ePjjvquia6TpxSORQ7KFHbuxuQW6d7rTunu7XPdAejh6XPLY8LT2rPL97mXiVe60Q9YjFxCVvbe9C70UfDZ8Cn/e+Gr4Fvgt+Gn6n/Bb9tfyL/JdJeqRS0mqAcUBlwFqgZeDFwJ0gx6CmYIpgj+C2EIaQwJC+UO7Q2NCRMImwzLDpcLXw0+ErZDNybQQUcSiiNZIR/sgbjBKNyoiaidaMLotej3GIuR5LHxsSOxgnHpcV9z7eMP5CAiqBmNCTyJd4JHEmSSfpfDKU7JXckyKQkp4yf9jocN0RqiOBRx6nyqQWpH5Lc0xrT+dKP5w+l2GU0ZBJk0nOnDyqfrTyGOoY6dhQlnzWmaztbO/s/hyZnKKcrVxibv9x2eMlx3fyfPOGTiidqDiJORlyciJfK7+ugL4gvmDu1IFTtwp5C7MLv512P/2oSKGospiqOKp4usS8pPWM4JmTZ7ZK/UvHy3TLmso5y7PK1856nx2t0K64UslVmVP58xzp3LPzRudvVQlXFVVjqqOr39U41Dy4oHKhvpa9Nqf218WQi9N1NnV99cr19Zc4L51oQDRENSxedr083Kjf2HpF8sr5JuamnGbQHNX84arH1YlrZtd6rqtcv3JD6Eb5TcLN7FvQrbhbKy3+LdOtzq0jbaZtPe3q7TdvS92+2MHXUdbJ1Hmii6orvWvnTvyd791h3ct3/e7O9bj3vOx16n3aZ903dM/s3sP7hvd7H+g8uPNQ42HHI7VHbf0q/S0DSgO3BhUHbz5WfHxzSGno1hPlJ63DqsPtI/tHuka1Ru+O6Y/df2rydGDcYnxkwn7i2aTr5PQz72cLz4Oer76IfrH58vAr9Kvs13Svi6Y4p6reiL1pmlaa7pzRnxmctZ19OUecW3ob8XZrPv0d/l3Re5739QtyCx2LhovDHw5+mF8KW9pczvxI/7H8k+inG5+1Pw+uOK3Mr5JXd77kfmX7evGbwree71bfp34E/9hcy15nW6/bUNl48NPx5/vNmC3sVskvsV/t22bbr3aCd3bCPMmee98CSPiO8PUF4MtF+DvBGc4BhgGgovmdG+wxAEBCMAfGDpAUtIQ4i3RDCaE+oLsxJdgwChtKAyolnDS1FF6CRoXWjM6DPorhNKGNcYaZmkWHlczWyL7EKcYVwN3Ms86nz39SYFZIVvioyGsxRfGTEsuSBlLV0tuyrnLtCuyKsUrjKvKqeWrL+400zmn+1LbRuaC7oW9mUGq4YKxgkmDaZQ4d0LaIt2y2mrOht9Ww87bPcDjneN3pjnOvS/fBNtemQ7Vu5e4nPVI9w73ciObeyj78vnjfNb8Z/37StYDSwNQgUrBViGIoS+ha2Fh4AzklwjKSJ/JzVFd0XoxrrETsz7j++NIEUqJKEiZpLLkyJeiw7hHBVMY02nS6DPpMuqP4Y5RZqKyd7I2cL7lLx2fzXpwYPTmQ31PQdupKYfXpM0V5xWklCWfiSlPLSspvnh2umK1cPrdyfqVqpfpzzacLH2uXLi7Uva2fuTTXsNpIf0WvKbm55eqba+s3sDcJt3haxFsV27TaTW7bdnh1xnaV3LnbvdCD6iX0sd/jvS/+QPmh7iPdftH+zwPZg2yD5x9rPV4eanxCHlYdgUYej1aMhT81GGcb/zTRO1n8zP+50vOdF90v41/Jv1p+3TgV8Wb/NGZ6dKZ81ndOdm7z7f35wnc+79UWGBY+LHZ9yF1yXOZbXvx49VP8Z90V3Mr4auOXiq83vq398F17saH9s3Bz+pf8duHOzl78BaBmhDOSAfkQlYk2wzBhXmOvU+RSBlHZ4/Sp5fFiNEK0onTS9IoMhgQHxhCmdOZqlj7WJXZ6Dk1OElcp9yDPDp8Kf6TAFcEPwhIi/qJ1YksSkvvIkjelNmS0ZI/IPVDAKZor5SmPqBLUrNTz9vdrYrS0tKN16nRf6uMM1Ay9jLKMG0wGTBfNEQdYLEQs5a3UrNVs5G0F7Wjsvtu/cOh2rHHKdg5xsT2o7MrhunNo1q3PvdYj09PbS5vISVzzHvFp8M3wc/NXJtGRFgLuBBYHhQQbhLCHfAy9E5YX7kLmJy9GNEfGRKlF/YruikmJ1Y5DxT2MP55glUhIHE8qTj4I76wrh3uPVKampYWku2QYZSoc5TtGfWwtazZ7MOdW7rnjx/LIJw6dNM/XKlA8JVUoepq/iLOYpYT+DFUpqnSr7Fv50tnpisnKkXPD58er3lQv1azXIi/S1LHVC16Sadh/2bDR8opzk09z9NXca3XX+25M3VxtgVrp2vja5W8bdhzsDOvKvFPWXX+3saem92Rf5D27+3IP6B+sPnwK702VAxmDgY+th1Se8A3jhtdH5kYfj117WjyeNEGcNHum8JzrBfrF8sunr26/rp46/iZxOmwmcDZ4LvJt0nzmu/z3ZQsXFps/tC/1Lj/++PLT+orqas1X3e+4H9/WF36OblVtO/+JPyd0HCGKGEAGozhQA+hUjCZmHdtJcZTSmUoeR4NboH6Ev05TQXucLo0+niGaEMcYx5TEnMlygvUsWxN7H8czzk/ceB5BXl0+D/40gWrBe0KLIjSismL24gkSlfv6JBel6WWUZV3kEuQrFO4oTiltq3CoqqrZqJP2J2vka1ZrXdXu0Lmn2683qD9g8MDwjtF14yqTbNMQMzNzXvNvB+5bFFuSrFStsdYTNhdsI+y07antJx1qHMOc1J0xzsMupQd9XKVcfxzqcst0t/AgeEx6lsL7BA9x2vucj4cvj+8bv3P+HiQe0lTA2UDnIELQUHBWiEEoFHo7LDJcJPwZ+ViEcsT7yKIo/agv0ediLGI2Y+vjHOIR8U0JBxPRic1JB5PRyc0pbocZD48cKUr1SVNJp0mfz+jMLDwaeEwniyXrY/bdnMJc3+PKeVR50ydaTxbkkwtsTykWshVun35b1F/cVHLqTHSpc5laOTt8Wo5X3KwsO3f8fGZVenVGzdELR2szLibVBdc7XTJoUL+s0Wh2xbMpsbnk6o1rj6/P39i8Rd8i3Lq/zbrd73Zyx+nOS10ddx5099991HOv925f573W+9cfND68+Kiy/8xAwWDu48yhtCcZw/kjdaOPxlbHuSZMJqOfVT0ferHxSvC17dSJN9MzpDnWt9/foxeTl3tXT60L7sb/d41o90zAKAFQC9dBHA4DYA231FkDIFQIl0vaALDCA2CnChCBGQBBvwSgctF/zg8IoAAlXM9gg/NNaaABzMBBOBNPBgWgFtwGI2ARzhfZIQXIEgqEjkIXoF5oFoFACCAM4EwvB9GEeIr4CedzxshwZCmyD/kZXoNGqChUNWoMjUQrwBlZKXoIg8SoYsIwdZhZLCfWCVuIHaWgp7CmOEUxTslG6U5ZS/mJSoUqjWoYx40LwXVTM1IHUN/Fc+Bj8OM0SjRnaHZo/WhH6XTortOL09cyiDA0EdQJg4zujN+YjjOLMw+whLGysPayhbPzs09wHOc05sJw3efO5rHm5eT9yNfHXy2QIxgvFCzsLeIu6ibmIe4jEbwvTjJLqkK6XWZS9oPcJ/m3Ck8Ve5VuKV9RuaRar3ZJvXl/q0af5pjWvPaGLq2emL6hgZ9hjtFV45emWDM5c8cDZIs0yxNWFdYtNi/tKO01HWLg8+6Li8LBWNe7bnh3V496z2Uil7eWj6NvsN8x/2ukj4HKQVnBb0KVwk6Gf4LPt2vRTDGRsf3xLAluiXVJOyn+h2dSPdPeZDhnjh9zztrKWcjLyz9byF5kWhJWWlLeWjF0bqbqxwWai2L1Zg2xje3N3Neqbkq0VLTtdLh23b7L25t9b+Ohf//YY4UnOSNzTw9MDD33eLkxVTyjMvfmXfrC5hL/8vanmhXB1cqvbN+qfmiuvd8o2dTdmtom7+0fEFxzwAEC4AJiQBmuEDnCVZhEkA8ugi4wAT5DVHCNQBdyh5KhCqgLmoZjL4wwRYQhihBdiHdIOqQa0geZj7yD/IjiRB2AM/SrqLdoNrQFOgPdCWffMpggOO7vsEJYX2wddolCmiKKopMSQ2lFeZbyA5UaVQ7VG5wCLgf3llqL+iz1L7wH/h6NJE0xLZo2mnaJjkg3Te9F/4EhjkBLuMRoxLjAlMMsy/yCJZNVgfUdWxm7HQcdxyhnCZcXtzQP4BnnbeTL4vcTMBWUFeIQphDeFPkm+k1sSwK/T0BSU8pDOkumTfaDPKeClWKO0qAKvaqj2hn1MQ1IU1jLUNtX55huo964AcJQzsjX+KzJpBmzucOBIosxKxprI5sU23a7NQclx1inThf0QSvXykNf3E09ajx/Ea3hfeqDn7x/EmkgkCsoPPh+KFdYdPhYhEJkcdRWjHtsVzxrQkji/WSBlOzD66kBaa8zrDJ7jylnNebw55bmsZyozFcr+FjYWlRckloaXu5eYXpOoYqnhubCzsUv9e8anjU+bOq42nb97s0nLa/blm5vdFF18/ao9Tndj3tY1t8+ODz0cvjZ6ODTjonLz86+yH91dCplOm425m3su4SF2A+Hlpk/1n5mWSGtVn8Z/7r2neWH/JrVesTGmZ+Pt7C/rLdr/sQfA/CABX77ZYEuXF/yB0mgEK4hPQCzYAfigvZDh+DYn4fuw1+ZDAg1BBFxHNGKmEcSkDpw5aYaOYGihCtwUajLqHk0D/ogugQ9AVdcHDGlmCmsADYAex27TWFKUUKxAFdMjlPOwTEvpFrBWeKaqQnUcdSzeAt8J40MzQVaHtpyOm66Grhu0cfgTkDA8XZkwjLdZo5kkWFZYb3BlsRuwsHKsczZx3WOO4WHyGvOp8ovLsAnyCPEJywmoiRqIuYuHidRvK9dclaaQcZUNlOuVwGtaK3UqEJQTVFb3U/SWNAK0v6hm6nPadBu5G6CM+0wJ1mgLXOsgU2o7Wt7C4ce+ExqPajq2u1m4T7jGUuk9a72VfDrJpkFTAYRg1dDj4QzkZsiD0StxJyJM02AEluTiSnbR/LSWNOrMiWPdmbZZa/nXskLOSmeP3YqoPBrUVTx9zMxpVvlmRWMlbXn1avGaoJrqS7W1RtfWryce0Wh6e3V89eDbuq38Leh2hc7Rro6uxt7qvpK7xc+zO8/MXhiKGc4adTtqcz498lrz4Nfir16N3Vh2ndWfG51vuN9xqL+h9XlYx+/fDZZyV1t+fL66/K3je9zPx6tFazvX3+3kb6x8TPk59ym0+adLcYt0lbXL8ZfpF9d2xTbVtsl2292RHZCd1p24x/hKy+3e3oAiFoXLj9O7ex8FQYAWwDAr/ydnc2qnZ1f1XCy8QqA7qDf/3fYJWPg+vc59C56xDV3ePf57+s/NEanGZ4R8qcAAAAJcEhZcwAACxMAAAsTAQCanBgAAAFuaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CuU/DUEAAAsCSURBVHgB7Zx1qFTNG8cfu1+7uxtbDOwOTEzExlYs7PgJKuofdiJYKNiKqNhd2N3dit39/vwMzO7s3t179+zdfY1zHljPnKkzM88zT3xnrjH+/UnikG1XIKZtZ+5MXK2AIwA2FwRHABwBsPkK2Hz6jgZwBMDmK2Dz6TsawBEAm6+AzafvaABHAGy+AjafvqMBHAGw+QrYfPqOBnAEwOYrYPPpOxrAEQCbr4DNpx/b5vP/ZdPnHs6TJ08kfvz4EitWLDWOHz9+yKdPnyRBggTyzz//eIyN/CtXrsjLly8lceLEkj9/fkmUKJF8+PBBHj58KLly5fKoH+iLZQEYNWqUHD16VBImTKh+8eLFEybDAD9+/KgG1KpVK2nfvr3PMfTv318uX76s2jLRuHHjqva01b+uXbtKkyZNXO1Pnz4tq1evVpNPly6d9OjRQ1KmTOkqD3Wic+fO8urVK7XQ9P3+/Xv1a9OmjbRu3Tokn+vSpYucOnXKZ18pUqSQbdu2qbL79+8La3727NkIdbNlyyaPHj2Sz58/C/3xs0qWBWDr1q3y/fv3SL+zZcsWvwJw8ODBKNsfPnzYJQBPnz4VGGLS3r17ZceOHWZWyNIIMwLni86cORMyAWDX+qMXL16ootevX0uLFi0Ug8lImjSpNGzYUNKmTSs3btyQzZs3u8p27twZlABYcgLZoVExn4HqCZA2ac+ePZbb37lzx+xCpdmd4SI0mT+KEyeOvyLL+fPnz5eiRYtGaJcxY0ZZvHixyh83bpyLwWRkyZJF+vTpo4Ri2LBhcuDAASlWrJiq+/jxY/W0+k+s//2kQBuxACVLlpQcOXII9sqU4pgxY0qNGjWkXr160rNnT0mePHmEbjNkyCCYjIsXL8rXr189yrFrVatWlWrVqgkmIEmSJKqcBTl58qTHtzAPFSpU8Ggfqhfm2KBBA8UcTNWbN29cXefOnVuN0ZURjQTzQ9WjLU1ix9etW1dlzZgxQ96+fesqRhuuWbNG7t69q/JYz0aNGknZsmWlb9++Eju2ZYUullsUL15c+GELy5Qpo+w3o8mcObOMHz/eNVhfCex9x44dZfny5cqm6jqlSpWSOXPm6NcIz7lz5wrq8MGDB4IPwMKFk/gGv1SpUqnxhutb+EDehG+lifXypufPn8u6devUjzKEEhNZuHBh76oBvVsyAWaP2nPVeezsqOjcuXNSs2ZNDxPRsmXLSJmv+8T+FShQIOzM19/jifYJJ/m6kW/mVa5cOcrPX7t2TQYPHizDhw+Psq6vCkELgHdn5sC9y3hftGiRdOjQwcV8TMbo0aNl4MCBvqr/FnmYuV9JvXr1UiY3kDHgnO/bty+Qqh51LJsAj9YBvmCfcFg0JUuWTGbPni158uTRWX6fkyZNUv4EMS/hDnEwse+IESP8tjELMBtr165VIRdx97dv31TsTRiJRqlfv77ky5fPbGI5jdOG48u80IQIN87yu3fvBLvdvXt3ZU4sd/yzAebvyJEjsnDhQuU74Yj7I/yJihUr+iv2mR9WAbh586b07t1bAR766yw22iAQh+XEiROycuVK3dTjWb58ealSpYpHnvnCwqNhjh07Zma70ggGsTX+CH1NmzbNVWY1gUcfWfSQPn36CKEs3/ClYRAek1Dx+Fr8oPPnzyvHkRDQdFApCyRCo55Jnl8zS6KZhnHYd3adptq1a8vSpUsDYj5tYJI/8rV4ui47Hk/eZD4+S86cOZVKRQhNBwxsAjsaLOGNezPO7MufcODYehO+jqZZs2YJoBpz0aFvoUKFlNnctWuXK1LS9UuXLq2TAT/DogGGDh0q27dv9xgEmqBdu3YeeVG9EFaChAHMEAoGQhs2bIgQjTRt2lQtmnccP3bsWFm/fr3qFiAFExOIM+s9junTp0vbtm1d/o0uJ1wmbNZAFqgdaB0RFIwF0PImExvQoTThdp06daRx48YKCCIfk/rlyxdXc/KYp1UKmQCg0m/fvi0DBgwQE7xhYAAawUgnuxTYF2KHwqTICMjWOxQdNGiQNG/e3GezWrVquQSACrdu3bLsD7ATJ0+e7MF8wJkhQ4YojWN++OrVqwq6pT72+sKFC2axFClSRIE9OhM8gLoQuAla1ZdJzJQpk/IVdDsrz5AJAPYeEMPbDqF2g2G+9yRKlCgRpQDAfJw8TWgQf8ynTpo0aXRVdSBjxRm8d++egKEBD2sCzCKqwbH0RZUqVVJIHkw0mc/BD2X4LCbhVHbr1k2BYOxuDoOOHz8uYAEQWAXtANCCpZAJAOpTE6pWI30MGC/ZqvrXfVl5AjVrQiONHDlSv/p8Zs2aVeHqqVOnVkiaz0pGpsY+0GiAMSaBYE6cONHM8pnGVPCDiBIwOd6myWyozQd5BQsWdJ2RmHWikw6ZAOhBIP2oPxA/VB40c+ZMpQU4wgwX4R2bQsi3TFTN33c3bdrkryhC/qFDh9RuM71vmEeoGgw0jcb41RSyKABJHjNmjFKLnHETVulQD5AILCCcxOmYSXjLoSZifZP59I/J8+XNh/rb4eovZALAWQAHQZpQq6b6wm7169dPF4f8iQNoUjjvC5j3HQhHEXw00J9IIROAGDFiRJg/AsClBU379+8XwrRwkLe6jwwxC/b7ADqrVq1SkQ4wrUbd0HCEuaYJCvYb/3W7kAmAv4HjMJmEo6RBDTM/umnOyk0ipAs1cQqaPXt2V7eEaPrAiGNb7dy5KvwBibALQN68eQUEUBO7pFOnTvo1ZE+Yo710OvV33So6H/SFPgID62Nb/JDoIIrRGVuwbUMmAL5MgB4UiJu+4EEeQBHxbajJdPw4NFqxYkWoPxGhP7AE8ABNgFX6Ro/O+52fQQsAgIt5BByV/fM+9gUf4HjYvPFiZaF8CRw3kUyaOnVqQJoAUIcrVt7kje+b8zXrcsfBBJwIe3UIbNb7HdOWroQxATB5LmRyTAm2rQlGgttzCgf8632tmaNf0C8WWxN1ly1bJqCILDY/BAsIWDMYvPvSpUuyYMECefbsmW6qjoXB2vH2dV2cNNSwtv+o7I0bNyqfg2vT3nE3l0+nTJmi4njaAQzp69XXr19XR7Cgb5oI93Q/hLomYeo4V9D4/O7du13+AeFwMGcMZv/hSsf4KdUB/0eRnMNrzzeyAcEULij4InYKDI+MEAQWkDsAwMi+bK9uDxADI03iTiFHyd6EUCIExO6EpSZsTF2QQ27dNmvWzCVE3n3od66wcZUNwtxwYsepn7/lnDBhglSvXl03/22elkwAoZYGdyKbARi2PwIHL1eunL9ilQ/Dcax4RsZ8KmvI2exw3rx5Cno2nULKAXE4WdMXQ8w23C2A+ZC/41uzvt7p5KENCDv9MZ86gfRJvf+aLEPBHEsCibKTUGt6kdlN+AEAMtSJjDg+5Qx+yZIlSr2jWUzCpmp8nMuO7DD9FzTaLrOL+R535H0RcTk+BqaDMwLuFpgHVZgNwCqOXwF2zEuVCAOYhflNmIswwnjmyk1cTZgsHFDMIIKrN4muT5tgoGLdfziflkxAuAbCzsS+wiBOuLzta6i+i8/CTkV4Yb72HULV/5/Yz28hAH/iwv0tY8YEBOwE/i2TdubhXgEEICKI7y53Un/5CliKAv7ytbDl9BwBsCXb3ZN2BMC9FrZMOQJgS7a7J+0IgHstbJlyBMCWbHdP2hEA91rYMuUIgC3Z7p60IwDutbBlyhEAW7LdPWlHANxrYcuUIwC2ZLt70o4AuNfClilHAGzJdvekHQFwr4UtU44A2JLt7kn/H7HUl9GoOKVWAAAAAElFTkSuQmCC";

            if (uri.indexOf("kickjs://texture/black/") === 0) {
                data = new Uint8Array([0, 0, 0, 255,
                    0,   0,   0, 255,
                    0,   0,   0, 255,
                    0,   0,   0, 255]);
            } else if (uri.indexOf("kickjs://texture/white/") === 0) {
                data = new Uint8Array([255, 255, 255, 255,
                    255,   255,   255, 255,
                    255,   255,   255, 255,
                    255,   255,   255, 255]);
            } else if (uri.indexOf("kickjs://texture/default_normal/") === 0) {
                data = new Uint8Array([127, 127, 255, 255,
                    127,   127,   255, 255,
                    127,   127,   255, 255,
                    127,   127,   255, 255]);
            } else if (uri.indexOf("kickjs://texture/gray/") === 0) {
                data = new Uint8Array([127, 127, 127, 255,
                    127,   127,   127, 255,
                    127,   127,   127, 255,
                    127,   127,   127, 255]);
            } else if (uri.indexOf("kickjs://texture/checkerboard/") === 0) {
                data = new Uint8Array([255, 255, 255, 255,
                    0,   0,   0, 255,
                    0,   0,   0, 255,
                    255, 255, 255, 255]);
            } else if (uri.indexOf("kickjs://texture/logo/") === 0) {
                textureDestination.setTemporaryTexture();
                img = document.createElement("img");
                img.onload = function () {
                    textureDestination.generateMipmaps = true;
                    textureDestination.internalFormat = Constants.GL_RGBA;
                    textureDestination.magFilter = Constants.GL_LINEAR;
                    textureDestination.minFilter = Constants.GL_LINEAR_MIPMAP_LINEAR;
                    textureDestination.setImage(img, uri);
                    if (resourceTracker && resourceTracker.resourceLoadingStarted){
                        resourceTracker.resourceLoadingFinished(url, textureDestination);
                    }
                };
                img.onerror = function () {
                    resourceLoadingFailed();
                };
                img.src = logoResource;
                return;
            } else {
                Util.fail("Unknown uri " + uri);
                resourceLoadingFailed();
                return null;
            }
            textureDestination.setImageData(2, 2, 0, Constants.GL_UNSIGNED_BYTE, data, uri);
            if (resourceTracker && resourceTracker.resourceLoadingStarted){
                resourceTracker.resourceLoadingFinished(url, textureDestination);
            }
        };
    };
});