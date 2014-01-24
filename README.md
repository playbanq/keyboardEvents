# keyboardEvents
Simple keydown, keyup and keyhold event handling.

## Usage

First, request the script in an HTML document:
``` html
    <script src='path/to/keyboardEvents.js'></script>
```

Then, create an event emitter by calling the #emitter method of the KeyboardEvents global variable:
``` js
var keyboard = new KeyboardEvents.emitter();
```

Finally, subscribe to keyboard events using the #on method:
``` js
// (custom_key_name, keyCode, callbacksObject)
keyboard.on('up_arrow', 39, {
  'onkeydown': function () {
    // Do something when the key is pressed
  },
  'onkeyhold': function (delta) {
    // Do something every 'delta' miliseconds the key is hold down
    // The default interval is 33 milliseconds, equivalent to 30 fps
  },
  'onkeyup': function () {
    // Do something when the key is released
  }
});
```  

Subscriptions to key events can be cancelled all at once or separately using the #off method:
``` js
// Unsubscribe from all the events of the up arrow key
    keyboard.off('up_arrow', 39);
// Unsubscribe from one event by providing a string with the event name
    keyboard.off('up_arrow', 39, 'onkey____');
// Unsubscribe from more than one event by providing a space separated string of event names
    keyboard.off('up_arrow', 39, 'onkey____ onkey____');
```


## Options
The duration of the interval between 'onkeyhold' events can be set by passing an options object on calls to the #emitter method:
``` js
// If keys are hold down, emit keyhold events every 100 milliseconds instead of the default 33:
var keyboard = KeyboardEvents.emitter({
    keyholdInterval: 100
});
```
