define([], function () {
    "use strict";

    /**
     * Data object for engine uniforms used during rendering (in the render method on components)
     * @class EngineUniforms
     * @namespace KICK.scene
     * @constructor
     */
    return function (object) {
        /**
         * @property viewMatrix
         * @type KICK.math.mat4
         */
        this.viewMatrix = object.viewMatrix;
        /**
         * @property projectionMatrix
         * @type KICK.math.mat4
         */
        this.projectionMatrix = object.projectionMatrix;
        /**
         * @property viewProjectionMatrix
         * @type KICK.math.mat4
         */
        this.viewProjectionMatrix = object.viewProjectionMatrix;
        /**
         * @property lightMatrix
         * @type KICK.math.mat4
         */
        this.lightMatrix = object.lightMatrix;
        /**
         * @property currentCamera
         * @type KICK.scene.Camera
         */
        this.currentCamera = object.currentCamera;
        /**
         * @property currentCameraTransform
         * @type KICK.math.mat4
         */
        this.currentCameraTransform = object.currentCameraTransform;
        /**
         * @property sceneLights
         * @type KICK.scene.SceneLights
         */
        this.sceneLights = null;

        Object.seal(this);
    };
});