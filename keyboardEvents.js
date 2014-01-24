/** Handles keyboard's 'keyup' and 'keydown' events
 * and passes them as parameters of provided callbacks
 * @param {number} keyholdInterval - The desired number of miliseconds between 'keyhold' events
 * @returns {object} emitter - A pseudo event emitter for notifying keyboard events
 */
var KeyboardEvents = Object.create({}, {
    'emitter': {
        value: function (options) {
            var emitter,            // the pseudo event emitter to return
                pressedKeys = {},   // the keys that are hold down at any given time
                listeners = {},     // subscribed callbacks to keyboard events
                context = document; // top level element where events are being handled
                clock = {           // Clock for keys that are hold down
                    last: (new Date()).getTime(),
                    current: null,
                    interval: 33
                };

            // Change the clock.interval or the context where events are going to be handled
            if (typeof options === 'object') {
                clock.interval = options.keyholdInterval || clock.interval;
                if (options.context === 'window') {
                    context = window;
                }
            }

            // On 'keydown' events
            context.onkeydown = function (event) {
                var keyCode = event.keyCode;
                if (!pressedKeys[keyCode]) {
                    pressedKeys[keyCode] = true;
                    if (listeners[keyCode]) {
                        listeners[keyCode].forEach(function (listener) {
                            if (listener.callbacks.onkeydown && 
                                typeof listener.callbacks.onkeydown === 'function') {
                                listener.callbacks.onkeydown();
                            }
                        });
                    }
                }
            };

            // On 'keyup' events
            context.onkeyup = function () {
                var keyCode = event.keyCode;
                if (pressedKeys[keyCode]) {
                    pressedKeys[keyCode] = false;
                    if (listeners[keyCode]) {
                        listeners[keyCode].forEach(function (listener) {
                            if (listener.callbacks.onkeyup && 
                                typeof listener.callbacks.onkeyup === 'function') {
                                listener.callbacks.onkeyup();
                            }
                        });
                    }
                }
            };

            // 'keyhold' events are emitter every clock.interval miliseconds
            // for the listeners to know that the key is still pressed 
            // so that tehy do not have to implement their own clocks
            setInterval(function () {
                // Check actual delay
                clock.current = (new Date()).getTime();
                var delta = clock.current - clock.last;
                clock.last = clock.current;

                for (var keyCode in pressedKeys) {
                    var key = pressedKeys[keyCode];
                    if (key && listeners[keyCode]) {
                        listeners[keyCode].forEach(function (listener) {
                            if (listener.callbacks.onkeyhold && 
                                typeof listener.callbacks.onkeyhold === 'function') {
                                listener.callbacks.onkeyhold(delta);
                            }
                        });
                    }
                }
            }, clock.interval);

            var properties = {
                // Subscribe to key events
                'on': {
                    value: function (keyName, keyCode, callbacks) {
                        if (!(listeners[keyCode] instanceof Array)) {
                            listeners[keyCode] = [];
                        }
                        listeners[keyCode].push({
                            name: keyName,
                            code: keyCode,
                            callbacks: callbacks
                        });
                    }
                },
                // Remove subscriptions to key events
                'off': {
                    value: function (keyName, keyCode, event) {
                        if (listeners[keyCode] instanceof Array) {
                            for (var index in listeners[keyCode]) {
                                var listener = listeners[keyCode][index];
                                if (keyName === listener.name) {
                                    // If no event is specified, remove all listeners
                                    if (!event) {
                                        listener.callbacks = {};
                                    // Otherwise, a string with the event name(s) must be passed
                                    } else if (typeof event === 'string') {
                                        event = event.split(' ');
                                        // One event
                                        if (event.length === 1 && listener.callbacks[event[0]]) {
                                            listener.callbacks[event[0]] = undefined;
                                        } else {
                                        // Two or more events
                                            event.forEach(function (name) {
                                                if (listener.callbacks[name]) {
                                                    listener.callbacks[name] = undefined;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            emitter = Object.create({}, properties);

            return emitter;
        }
    }
});