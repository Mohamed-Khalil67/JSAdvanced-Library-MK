function customEmitter() {
  const listeners = {};
  return {
    on: function (event, callback) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },
    emit: function (event, data) {
      if (!listeners[event]) return; // guard at start

      // off() shouldn't affect the loop
      const callbacks = listeners[event].slice(); // copying array
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](data); // call of each callback or fn in the array of the whole object
      }
    },
    off: function (event) {
      delete listeners[event];
    },
    once: function (event, callback) {
      const self = this;
      function wrapper(data) {
        callback(data);
        self.off(event);
      }
      this.on(event, wrapper);
    },
  };
}

const emitter = customEmitter();

emitter.on('login', (user) => console.log('welcome', user));
emitter.on('login', (user) => console.log('send email to', user));
emitter.on('logout', (user) => console.log('goodbye', user));

emitter.emit('login', 'Ahmed');
// welcome Ahmed
// send email to Ahmed

emitter.emit('logout', 'Ahmed');
// goodbye Ahmed

emitter.emit('signup', 'Ahmed');
// nothing — no listeners registered

// test once
emitter.once('signup', (user) => console.log('first signup:', user));

emitter.emit('signup', 'Ahmed'); // first signup: Ahmed
emitter.emit('signup', 'Sara'); // nothing ← removed after first emit
emitter.emit('signup', 'Omar'); // nothing ← still gone
