// Loops over every element,
// transforms it using a callback,
// and collects all results into a new array.
// Original array is never changed.

// Trick Here is the callback arguments that needs to be known
// Edge cases, what's the most optimized ? didn't see a difference if i used Array.isArray() or object prototype
function customMap(array = [], callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  const array2 = [];
  let i = 0;
  while (i < array.length) {
    array2[i] = callback(array[i], i, array);
    i++;
  }
  return array2;
}

const nums = [1, 2, 3];
var t1 = performance.now();
const result = customMap(nums, (x) => {
  return x * 2;
});
var t2 = performance.now();
console.log(`Time taken: ${t2 - t1} milliseconds`);
console.log(result);
