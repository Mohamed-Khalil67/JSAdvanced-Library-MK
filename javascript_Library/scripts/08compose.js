// Chains multiple functions together right to left.
// The output of each function becomes the input of the next.
// Returns a new function that runs the whole chain.

// Hardest Trick here , is how to navigate through functions
// When a closure is created, the inner function gets a backpack containing
// references to all the outer variables it uses
// and those variables stay alive in memory as long as the inner function exists.
function customCompose(...fns) {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError('All arguments must be functions');
    }
  }
  return function (x) {
    let result = x;
    for (let i = fns.length - 1; i >= 0; i--) {
      result = fns[i](result); // gets the pointer and immedaitly call the function
    }
    return result;
  };
}

const double = (x) => x * 2;
const addTen = (x) => x + 10;
const square = (x) => x * x;

const transform = customCompose(square, addTen, double);
console.log(transform(3));
// double(3)  → 6
// addTen(6)  → 16
// square(16) → 256
