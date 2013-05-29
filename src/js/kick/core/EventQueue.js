define(["./Util"], function (util) {
    "use strict";

    /**
     * Event queue let you schedule future events in the game engine. Events are invoked just before the
     * Component.update() methods.<br>
     * An event can run for either a single frame or for multiple frames.
     * @class EventQueue
     * @namespace kick.core
     * @param {kick.core.Engine} engine
     */
    return function (engine) {
        var queue = [],
            queueSortFn = function (a, b) {
                return a.timeStart - b.timeStart;
            },
            time = engine.time;

        /**
         * Add a event to the event queue. Using timeStart = 0 will make the event run in the next frame.
         * @method add
         * @param {function} task
         * @param {Number} timeStart Number of milliseconds from current time
         * @param {Number} timeEnd=timeStart Number of milliseconds from current time
         * @return {Object} event object (used for 'cancel' event)
         */
        this.add = function (task, timeStart, timeEnd) {
            var currentTime = time.time + 1, // schedule for one millisecond in the future - this makes it legal for event call backs to schedule new events
                queueElement = {
                    task: task,
                    timeStart: timeStart + currentTime,
                    timeEnd: (timeEnd || timeStart) + currentTime
                };
            util.insertSorted(queueElement, queue, queueSortFn);
            return queueElement;
        };

        /**
         * Removes an event object from the queue.
         * @method cancel
         * @param {Object} eventObject (should be the object returned from the EventQueue.add method
         */
        this.cancel = function (eventObject) {
            util.removeElementFromArray(queue, eventObject);
        };

        /**
         * Run the event queue. This method is invoked by the Engine object just before the components are updated.
         * @protected
         * @method run
         */
        this.run = function () {
            var i,
                currentTime = time.time,
                queueLength = queue.length,
                queueElement;
            for (i = 0; i < queueLength && (queueElement = queue[i]).timeStart < currentTime; i++) {
                queueElement.task();
                if (queueElement.timeEnd < currentTime) {
                    queue.splice(i, 1);
                    queueLength--;
                }
            }
        };

        /**
         * Clears the queue
         * @method clear
         */
        this.clear = function () {
            queue = [];
        };
    };
});
