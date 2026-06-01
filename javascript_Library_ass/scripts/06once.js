// Wraps a function so it can only run once. Every call after the first returns the same cached result without running the function again.
// Uses a closure to remember if it already ran.

// When a closure is created, the inner function gets a backpack containing
// references to all the outer variables it uses
// and those variables stay alive in memory as long as the inner function exists.
function customOnce(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  let result;
  return function (...args) {
    if (callback) {
      result = callback(...args);
      callback = null;
    }
    return result;
  };
}

const init = customOnce(() => {
  console.log('initialized!');
  return 42;
});

console.log(init()); // logs 'initialized!' → returns 42
console.log(init()); // silent → returns 42
console.log(init()); // silent → returns 42
