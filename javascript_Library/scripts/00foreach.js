// Loops over every element in an array and runs a callback on each one.
// Returns nothing — only used for side effects like logging.

// same as map , just the difference is when
// looping the call back result is sent without keeping it in the function

function customEach(array = [], callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  let i = 0;
  while (i < array.length) {
    callback(array[i], i, array);
    i++;
  }
}
var t1 = performance.now();
customEach([10, 20, 30], (val, i) => console.log(i, val));
var t2 = performance.now();
console.log(`Time taken: ${t2 - t1} milliseconds`);

// Expected behavior:
// 0 10
// 1 20
// 2 30

customEach([], (val) => console.log(val)); // nothing logged
// myEach(null, (val) => console.log(val)); // should not crash
