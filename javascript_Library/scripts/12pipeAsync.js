// Chains multiple async functions left to right.
// Each function waits for the previous one to finish before running.
// Returns a promise with the final result.

// Trick here is using await , for async functioning
function customPipeAsync(...fns) {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError('All arguments must be functions');
    }
  }
  return async function (x) {
    let result = x;
    for (let i = 0; i < fns.length; i++) {
      result = await fns[i](result);
    }
    return result;
  };
}

// three simple async functions
function double(n) {
  return n * 2;
}

function addTen(n) {
  return n + 10;
}

function square(n) {
  return n * n;
}

// pipe them together
const transform = customPipeAsync(double, addTen, square);

// run with performance tracking
var t1 = performance.now();

transform(3)
  .then((result) => {
    var t2 = performance.now();
    console.log('Input:          3');
    console.log('double(3)    →  6');
    console.log('addTen(6)    →  16');
    console.log('square(16)   →  256');
    console.log('Final result:', result);
    console.log(`Time taken: ${t2 - t1} milliseconds`);
  })
  .catch((err) => console.log('Error:', err.message));
