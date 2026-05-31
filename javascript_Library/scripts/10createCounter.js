// Returns an object with four methods — increment, decrement, reset, value.
// The count lives privately in a closure and can only be accessed through the methods.

function customCreateCounter(parameter) {
  if (typeof parameter !== 'number') {
    throw new TypeError('Argument must be a number');
  }
  let counter = parameter;
  return {
    increment: function () {
      return ++counter;
    },
    decrement: function () {
      return --counter;
    },
    reset: function () {
      return (counter = parameter);
    },
    value: function () {
      return counter;
    },
  };
}

const counter = customCreateCounter(10);

console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.reset()); // 10
console.log(counter.value()); // 10
