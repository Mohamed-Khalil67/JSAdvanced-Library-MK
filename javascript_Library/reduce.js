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

var t2 = performance.now();
console.log(`Time taken: ${t2 - t1} milliseconds`);

console.log(total);
