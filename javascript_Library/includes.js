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

console.log(customIncludes([1, 2, 3], 2)); // true
console.log(customIncludes([1, 2, 3], 99)); // false
console.log(customIncludes(['a', 'b', 'c'], 'b')); // true
console.log(customIncludes(null, 1)); // throws
