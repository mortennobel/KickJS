define(["kick/core/Util", "kick/core/Constants"], function (Util, constants) {
    "use strict";
    var ASSERT = constants._ASSERT;
    /**
     * Mixin class that allows listening for specific events on a class.
     * Inspired by the observer pattern
     * @class Observable
     * @abstract
     * @constructor
     * @namespace kick.core
     */
    return function () {
        var observers = {},
            thisObj = this;
        /**
         * Add an observer function
         * @method on
         * @param {String} eventName
         * @param {Function} observerFn
         */
        this.on = function(eventName, observerFn){
            if (ASSERT){
                if (typeof observerFn !== "function"){
                    Util.fail("observerFn must be a function");
                }
                if (typeof eventName !== "string"){
                    Util.fail("eventName must be a string");
                }
            }
            var observers = thisObj.getObservers(eventName);
            observers.push(observerFn);
        };

        /**
         * Gets or creates a list of observers bound to the eventName
         * @method getObservers
         * @param {String} eventName
         * @return Array of observer functions
         *
         */
        this.getObservers = function(eventName){
            if (ASSERT){
                if (typeof eventName !== "string"){
                    Util.fail("eventName must be a string");
                }
            }
            var observerList = observers[eventName];
            if (!observerList){
                observerList = [];
                observers[eventName] = observerList;
            }
            return observerList;
        };

        /**
         * @method removeObserver
         * @param {String} eventName
         * @param {Function} observerFn
         */
        this.removeObserver = function(eventName, observerFn){
            if (ASSERT){
                if (typeof observerFn !== "function"){
                    Util.fail("observerFn must be a function");
                }
                if (typeof eventName !== "string"){
                    Util.fail("eventName must be a string");
                }
            }
            var observers = thisObj.getObservers(eventName);
            Util.removeElementFromArray(observers, observerFn);
        };

        /**
         * @method fireEvent
         * @param {String} eventName
         * @param {Object} obj
         */
        this.fireEvent = function(eventName, obj){
            if (ASSERT){
                if (typeof eventName !== "string"){
                    Util.fail("eventName must be a string");
                }
            }
            var observerList = observers[eventName] || [],
                i;
            for (i=0;i<observerList.length;i++){
                observerList[i](obj);
            }
        };
    };
});
