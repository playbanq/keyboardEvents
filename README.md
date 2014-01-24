# keyboardEvents
Simple keydown, keyup and keyhold event handling.

# Usage

First, request the script in your HTML document:
``` js
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
  },
  'onkeyup': function () {
    // Do something when the key is released
  }
});
```

