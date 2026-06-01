// Wraps a function and caches its results.
// Same arguments always return the cached result instead of recalculating.
// Uses a closure to store the cache between calls.

// When a closure is created, the inner function gets a backpack containing
// references to all the outer variables it uses
// and those variables stay alive in memory as long as the inner function exists.
function customMemoize(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Argument must be a function');
  }
  const cache = {}; // the store for finding if the arguments were used or not
  // it has to be an object which is more effecient for looking up things then having an array as a storage
  return function (...args) {
    const key = JSON.stringify(args); // transforming an array of arguments into keys in order to attach them to their corresponding values

    if (key in cache) {
      // if key already registerd just return the value
      return cache[key];
    }
    cache[key] = fn(...args); // storing in the new results
    return cache[key]; // new result of using the arguments first time
  };
}

const slowDouble = customMemoize((n) => n * 2);

var t1 = performance.now();
console.log(slowDouble(5)); // runs function → 10
var t2 = performance.now();
console.log(`Time taken: ${t2 - t1} milliseconds`);

var t1 = performance.now();
console.log(slowDouble(5)); // cache hit → 10 (function never runs)
console.log(slowDouble(5));
var t2 = performance.now();
console.log(`Time taken: ${t2 - t1} milliseconds`);

// result performance
// 10
// Time taken: 7.668700000000001 milliseconds
// 10
// 10
// Time taken: 0.30930000000000035 milliseconds

console.log(slowDouble(6)); // runs function → 12 (new argument)
console.log(slowDouble(6)); // cache hit → 12

// works with multiple arguments
const add = customMemoize((a, b) => a + b);
console.log(add(2, 3)); // runs → 5
console.log(add(2, 3)); // cache hit → 5
console.log(add(1, 2)); // runs → 3
console.log(add('1', '2')); // runs → 3
