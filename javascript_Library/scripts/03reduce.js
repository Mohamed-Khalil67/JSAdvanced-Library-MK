// Collapses an entire array into one single value by
// running a callback on each element and carrying the result forward.
// Works with or without an initial value.

// customReduce(array, callback, initialValue)
//                         ↓
//                  callback(acc, item, i, array)

// the trick here is the call back function has 4 arguments , 3 of the normal
// value of array , index , and whole array, and fourth is the acc value from before each iteration to keep track
function customReduce(array = [], callback, initialValue) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
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
    // function recall has 4 arguments
    accumulator = callback(accumulator, array[i], i, array);
    i++;
  }
  return accumulator;
}

var t1 = performance.now();
// const total = customReduce(
//   [1, 2, 3],
//   function (acc, current) {
//     return acc + current;
//   },
//   0,
// );

const total = customReduce([], (acc, val) => acc + val); // no initialValue
// (acc, val) => acc + val
//              ↑ takes old acc
//                       ↑ adds current value
//              ↑──────────── returns new acc
var t2 = performance.now();
console.log(`Time taken: ${t2 - t1} milliseconds`);

console.log(total);
