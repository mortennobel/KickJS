define(["kick/core/Util", "kick/core/Constants"], function (Util, constants) {
    "use strict";
    var ASSERT = constants._ASSERT;
    /**
     * Mixin class that allows listening for specific events on a class.
     * Inspired by the observer pattern ( http://en.wikipedia.org/wiki/Observer_pattern ), where the Observable class
     * has the role of the Subject class from the pattern.
     * Note that there is no Observer objects - only observer functions (observerFn).
     * The observable creates a fixed number of event listener queues for the class, which can be accessed using the
     * methods addEventListener, removeEventListener and getObservers. Events can be fired using fireEvent.
     *
     * To use the class as mixin: kick.core.Observable.call(observableObject,["Foo"]);
     * @example
     *     // 'raw usage'
     *     var observable = new kick.core.Observable(["Foo"]);
     *     var fooValue = 0;
     *     var eventListener = function(v){fooValue = v;};
     *     // register event listener for event "Foo"
     *     observable.addEventListener("Foo", eventListener);
     *     observable.fireEvent("Foo", 1);
     *     // foo value is now 1
     *     observable.removeEventListener("Foo", eventListener);
     *     observable.fireEvent("Foo", 2);
     *     // foo value is still 1, since the listener has been removed
     * @example
     *     // Use observer
     *     var SomeClass = function(){
     *         kick.core.Observable.call(this,["Foo"]);
     *         // [...] rest of class
     *     };
     *     var o = new SomeClass();
     *     o.addEventListener("Foo", function(){ console.log("Some foo!"); });
     *
     * @class Observable
     * @abstract
     * @constructor
     * @namespace kick.core
     * @param {String} eventNames
     */
    return function (eventNames) {
        var observers = {},
            thisObj = this,
            getObservers = function(eventName){
                if (ASSERT){
                    if (typeof eventName !== "string"){
                        Util.fail("eventName must be a string");
                    }
                    if (!observers[eventName]){
                        Util.fail("Event name "+eventName+" not found");
                    }
                }
                return observers[eventName];
            },
            i;

        for (i=0;i<eventNames.length;i++){
            observers[eventNames[i]] = [];
            if (ASSERT){
                (function(name,obj){
                    var value;
                    Object.defineProperty(obj, name, {
                        get: function(){
                            return value;
                        },
                        set: function(newValue){
                            if (value){
                                thisObj.removeEventListener(name, value);
                            }
                            value = newValue;
                            if (value){
                                thisObj.addEventListener(name, value);
                            }
                        }
                    });
                }(eventNames[i], this));
            }
        }
        /**
         * Gets or creates a list of observers bound to the eventName
         * @method getObservers
         * @param {String} eventName
         * @return Array of observer functions
         *
         */
        this.getObservers = getObservers;

        /**
         * Add an observer function
         * @method addEventListener
         * @param {String} eventName
         * @param {Function} observerFn
         */
        this.addEventListener = function(eventName, observerFn){
            if (ASSERT){
                if (typeof observerFn !== "function"){
                    Util.fail("observerFn must be a function");
                }
                if (typeof eventName !== "string"){
                    Util.fail("eventName must be a string");
                }
            }
            var observers = getObservers(eventName);
            observers.push(observerFn);
        };

        /**
         * @method removeEventListener
         * @param {String} eventName
         * @param {Function} observerFn
         */
        this.removeEventListener = function(eventName, observerFn){
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
         * Note that fire events should not be called from other classes
         * @method fireEvent
         * @param {String} eventName
         * @param {Object} obj
         * @protected
         */
        this.fireEvent = function(eventName, obj){
            if (ASSERT){
                if (typeof eventName !== "string"){
                    Util.fail("eventName must be a string");
                }
                if (!observers[eventName]){
                    Util.fail("Event name "+eventName+" not found");
                }
            }
            var observerList = observers[eventName],
                i;
            for (i=0;i<observerList.length;i++){
                observerList[i](obj);
            }
        };
    };
});
