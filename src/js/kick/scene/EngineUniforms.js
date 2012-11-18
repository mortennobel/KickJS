define([], function () {
    "use strict";

    /**
     * Data object for engine uniforms used during rendering (in the render method on components)
     * @class EngineUniforms
     * @namespace kick.scene
     * @constructor
     */
    return function (object) {
        /**
         * @property viewMatrix
         * @type kick.math.Mat4
         */
        this.viewMatrix = object.viewMatrix;
        /**
         * @property projectionMatrix
         * @type kick.math.Mat4
         */
        this.projectionMatrix = object.projectionMatrix;
        /**
         * @property viewProjectionMatrix
         * @type kick.math.Mat4
         */
        this.viewProjectionMatrix = object.viewProjectionMatrix;
        /**
         * @property lightMatrix
         * @type kick.math.Mat4
         */
        this.lightMatrix = object.lightMatrix;
        /**
         * @property currentCamera
         * @type kick.scene.Camera
         */
        this.currentCamera = object.currentCamera;
        /**
         * @property currentCameraTransform
         * @type kick.math.Mat4
         */
        this.currentCameraTransform = object.currentCameraTransform;
        /**
         * @property sceneLights
         * @type kick.scene.SceneLights
         */
        this.sceneLights = null;

        Object.seal(this);
    };
});