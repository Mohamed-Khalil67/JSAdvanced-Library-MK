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

console.log(customFind([1, 2, 3, 4], (x) => x > 2)); // 3
console.log(customFind([1, 2, 3], (x) => x > 99)); // undefined
console.log(customFind(null, (x) => x)); // throws
