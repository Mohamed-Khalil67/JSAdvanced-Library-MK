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
