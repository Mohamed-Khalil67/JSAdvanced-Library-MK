// Loops over every element and keeps only the ones where the callback returns true.
//  Returns a new shorter array.

// The trick here is that we take the condition of the callback to make our new array

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

const users = [
  { name: 'Ahmed', age: 22 },
  { name: 'Sara', age: 15 },
];

var t1 = performance.now();
const result2 = customFilter(users, (x) => x.age > 18);
var t2 = performance.now();
console.log(`Time taken: ${t2 - t1} milliseconds`);
console.log(result2);
