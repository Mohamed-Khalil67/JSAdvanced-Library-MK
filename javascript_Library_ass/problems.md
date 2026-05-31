# JavaScript Utility Library — My Solutions

---

## 1. myEach

```javascript
function myEach(array = [], callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}
```

---

## 2. myMap

```javascript
function customMap(array = [], callback) {
  if (Object.prototype.toString.call(array) !== '[object Array]') {
    throw 'First argument must be an array';
  }
  if (typeof callback !== 'function') {
    throw 'Second argument must be a function';
  }
  const array2 = [];
  for (let i = 0; i < array.length; i++) {
    array2[i] = callback(array[i], i, array);
  }
  return array2;
}
```

---

## 3. myFilter

```javascript
function customFilter(array = [], callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  const array2 = [];
  const len = array.length;
  let i = 0;
  while (i < len) {
    const element = array[i];
    if (callback(element, i, array)) {
      array2.push(element);
    }
    i++;
  }
  return array2;
}
```

---

## 4. myReduce

```javascript
function customReduce(array = [], callback, initialValue) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  if (array.length === 0 && initialValue === undefined) {
    throw new TypeError('Reduce of empty array with no initial value');
  }
  let accumulator;
  let i;
  if (initialValue !== undefined) {
    accumulator = initialValue;
    i = 0;
  } else {
    accumulator = array[0]; // first element
    i = 1; // start from second
  }
  while (i < array.length) {
    accumulator = callback(accumulator, array[i], i, array);
    i++;
  }
  return accumulator;
}
```

---

## 5. myFind

```javascript
function customFind(array = [], callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  let foundElement;
  const len = array.length;
  let i = 0;
  while (i < len) {
    const element = array[i];
    if (callback(element, i, array)) {
      foundElement = element;
      break;
    }
    i++;
  }
  return foundElement;
}
```

---

## 6. myIncludes

```javascript
function customIncludes(array = [], value) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  let foundElement = false;
  const len = array.length;
  let i = 0;
  while (i < len) {
    const element = array[i];
    if (element === value) {
      foundElement = true;
      break;
    }
    i++;
  }
  return foundElement;
}
```

---

## 7. groupBy

```javascript
function customGroupBy(arrayObject = [{}], keyObject) {
  if (Object.prototype.toString.call(arrayObject) !== '[object Array]') {
    throw new TypeError('First argument must be an array Object');
  }
  if (typeof keyObject !== 'string') {
    throw new TypeError('Second argument must be a string');
  }
  const resultObject = {};
  const len = arrayObject.length;
  for (let i = 0; i < len; i++) {
    const item = arrayObject[i];
    const keyValue = item[keyObject];
    resultObject[keyValue] ??= [];
    resultObject[keyValue].push(item);
  }
  return resultObject;
}
```

---

## 8. deepClone

```javascript
function customDeepClone(original) {
  if (typeof original !== 'object' || original === null) return original;
  if (Array.isArray(original)) {
    const resultArray = [];
    for (let i = 0; i < original.length; i++) {
      resultArray.push(customDeepClone(original[i]));
    }
    return resultArray;
  } else {
    const resultObject = {};
    for (const key in original) {
      resultObject[key] = customDeepClone(original[key]);
    }
    return resultObject;
  }
}
```

---

## 9. once

```javascript
function customOnce(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  let called = false;
  let result = null;
  return function () {
    if (called) {
      return result;
    }
    called = true;
    result = callback();
    return result;
  };
}
```

---

## 10. memoize

```javascript
function customMemoize(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Argument must be a function');
  }
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}
```

---

## 11. compose

```javascript
function customCompose(...fns) {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError('All arguments must be functions');
    }
  }
  return function (x) {
    let result = x;
    for (let i = fns.length - 1; i >= 0; i--) {
      result = fns[i](result);
    }
    return result;
  };
}
```

---

## 12. flattenArray

```javascript
function customFlattenArray(nestedArray) {
  if (!Array.isArray(nestedArray)) {
    throw new TypeError('Argument must be an array');
  }
  let result = [];
  for (let i = 0; i < nestedArray.length; i++) {
    if (Array.isArray(nestedArray[i])) {
      result.push(...customFlattenArray(nestedArray[i]));
    } else {
      result.push(nestedArray[i]);
    }
  }
  return result;
}
```

---

## 13. createCounter

```javascript
function customCreateCounter(parameter) {
  if (typeof parameter !== 'number') {
    throw new TypeError('Argument must be a number');
  }
  let counter = parameter;
  return {
    increment: function () {
      return ++counter;
    },
    decrement: function () {
      return --counter;
    },
    reset: function () {
      return (counter = parameter);
    },
    value: function () {
      return counter;
    },
  };
}
```

---

## 14. createSecretHolder

```javascript
function customCreateSecretHolder(parameter) {
  if (typeof parameter !== 'number' && typeof parameter !== 'string') {
    throw new TypeError('Argument must be a number or a string');
  }
  let realSecrect = parameter;
  return {
    getSecret: function () {
      return realSecrect;
    },
    setSecret: function (newSecret) {
      return (realSecrect = newSecret);
    },
  };
}
```

---

## 15. pipeAsync

```javascript
function customPipeAsync(...fns) {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError('All arguments must be functions');
    }
  }
  return async function (x) {
    let result = x;
    for (let i = 0; i < fns.length; i++) {
      result = await fns[i](result);
    }
    return result;
  };
}
```

---

## 16. Weird JavaScript

### this

```javascript
const user = { name: 'Ahmed' };

function greet(greeting, punctuation) {
  console.log(greeting + ' ' + this.name + punctuation);
}

greet('Hello', '!'); // " Hello undefined!" ✗ — this is window

// call — pass args one by one, runs immediately
greet.call(user, 'hello', '!');

// apply — pass args as array, runs immediately
greet.apply(user, ['Hello', '!']); // 'Hello Ahmed!' ✓

// bind — returns new locked function, run later
const greetAhmed = greet.bind(user);
greetAhmed('Hello', '!'); // 'Hello Ahmed!' ✓
```

### Hoisting

```javascript
// 1. function declaration — fully hoisted
// The Function is hoisted
sayHello(); // ✓ works — entire function moved to top
function sayHello() {
  console.log('hello');
}

// 2. var — hoisted but undefined
// What's actually written here is :  var = undefined; var is hoisted bu differently the function
console.log(a);
var a = 2;

// 3. let/const — NOT hoisted (Temporal Dead Zone)
// it gives an error where the initialization need to be done before
console.log(b);
let b = 3;
```

### Closures in loops

```javascript
// using var , as it's not block scoped
// javascript sees this as:
// var i;                    // ← hoisted to top, ONE shared i
// for (i = 0; i < 3; i++) { ... }
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// fix 1 — one word change, using let , which is a function scope
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// fix 2 — closure (IIFE wrapping)
// Forcing var into being function scoped
for (var i = 0; i < 3; i++) {
  function makeCallback(j) {
    return () => console.log(j);
  }
  setTimeout(makeCallback(i), 100);
}
```

### bind / call / apply

```javascript
const user = { name: 'Ahmed' };

function greet(greeting, punctuation) {
  console.log(greeting + ' ' + this.name + punctuation);
}

greet('Hello', '!'); // " Hello undefined!" ✗ — this is window

// call — pass args one by one, runs immediately
greet.call(user, 'hello', '!');

// apply — pass args as array, runs immediately
greet.apply(user, ['Hello', '!']); // 'Hello Ahmed!' ✓

// bind — returns new locked function, run later
const greetAhmed = greet.bind(user);
greetAhmed('Hello', '!'); // 'Hello Ahmed!' ✓
```

---

## 17. Event Emitter

```javascript
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
      if (!listeners[event]) return;
      const callbacks = listeners[event].slice();
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](data);
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
```
