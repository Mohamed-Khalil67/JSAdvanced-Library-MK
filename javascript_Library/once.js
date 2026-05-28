function customOnce(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Second argument must be a function');
  }
  let result;
  return function (...args) {
    if (callback) {
      result = callback(...args);
      callback = null;
    }
    return result;
  };
}

const init = customOnce(() => {
  console.log('initialized!');
  return 42;
});

console.log(init()); // logs 'initialized!' → returns 42
console.log(init()); // silent → returns 42
console.log(init()); // silent → returns 42
