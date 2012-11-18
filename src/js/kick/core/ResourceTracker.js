define([], function () {
    "use strict";

    /**
     * Class used for tracking initialization of resources (such as loading, creating, etc.)
     * @class ResourceTracker
     * @param {kick.core.Project} project
     */
    return function (project) {
        var thisObj = this;
        /**
         * Calls project.removeResourceTracker
         * @method resourceReady
         */
        this.resourceReady = function () {
            project.removeResourceTracker(thisObj);
        };

        /**
         * Calls project.removeResourceTracker
         * @method resourceFailed
         */
        this.resourceFailed = function () {
            project.removeResourceTracker(thisObj);
        };
    };

});