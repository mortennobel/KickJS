define(["./Util"], function (Util) {
    "use strict";

    Util.fail("ResourceTracker only defines an interface and should not be used explicit.");

    /**
     * Interface used for tracking initialization of resources (such as loading, creating, etc.)
     *
     * @class ResourceTracker
     * @namespace kick.core
     */

    /**
     * Protocol of the resource, such as http://, kickjs://<br>
     * The protocol must uniquely identify a resource provider
     * @property protocol
     * @type String
     */

    /**
     * @method resourceLoadingStarted
     * @param url {String}
     * @param obj {Object}
     */

    /**
     * @method resourceLoadingFinished
     * @param url {String}
     * @param obj {Object}
     */

    /**
     * @method resourceLoadingFailed
     * @param url {String}
     * @param obj {Object}
     */

    return {};
});