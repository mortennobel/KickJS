define([], function () {
    "use strict";

    /**
     * This class only specifies the interface of a component.
     * @namespace kick.scene
     * @class Component
     */

    /**
     * The gameObject owning the component. Initially undefined. The value is set when the Component object is added
     * to a GameObject
     * @property gameObject
     * @type kick.scene.GameObject
     */

    /**
     * Abstract method called when a component is added to scene. May be undefined. <br>
     * This method method works in many cases like a constructor function, where references to other game objects can
     * be looked up (this cannot be done when the actual constructor function is called, since the scene may not be
     * loaded completely).<br>
     * Note that activated are called just after update methods on all components has been called - this makes it easier
     * to get references to other components.
     * @method activated
     */

    /**
     * Abstract method called when a component is removed from scene. May be undefined.
     * @method deactivated
     */


    /**
     * Abstract method called every at every rendering of the object. May be undefined.
     * @method render
     * @param {kick.scene.EngineUniforms} engineUniforms
     * @param {kick.material.Material} [overwriteMaterial]
     */

    /**
     * Components with largest priority are invoked first. (optional - default 0). Cannot be modified after creation.
     * @property scriptPriority
     * @type Number
     */

    /**
     * Defines the axis aligned bounding box used for view frustum culling
     * May be undefined or null.
     * @property aabb
     * @type kick.math.Aabb
     */

    /**
     * Default value is 1000<br>
     * &lt; 1999 default geometry<br>
     * 1999 skybox<br>
     * 2001 - 2999 transparent geometry (sorted back-to-front when rendered)<br>
     * &gt; 3000 overlay geometry rendered on top
     * @property renderOrder
     * @type Number
     */

    /**
     * Abstract method called every update. May be undefined.
     * @method update
     */

    /**
     * Fire events when components are updated.
     * May be undefined.
     * Must be defined before adding to gameObject.
     * @event componentUpdated
     * @param {kick.scene.Component} component
     */

    /**
     * Creates a JSON version of the configuration of the class. May be undefined, if so the
     * kick.core.Util.componentToJSON() are used for serializing of the component.<br>
     * Note that references to assets, gameObjects or other components should be wrapped by the kick.core.Util.getJSONReference() method
     * @method toJSON
     * @return {Object}
     */
    return {};
});