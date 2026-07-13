# WorkShop 1: Javascript Library Assignment

## Custom Map & Custom Filter

- When looping over elements, use `forEach` instead of `map`, because `map` returns a new array and we don't need that here.
- The result should be pushed into the `result` array, which is defined outside of the loop.
- Declare variables with types necessary for parameters:

```js
/**
 * @summary Map on elements
 * @param {Array<string>} array
 * @param {Function} callback
 * @returns Array
 */
```

- custom filter

array.forEach((element) => { ... })
This loops through every single item (which it names element) inside your original array, one by one.

callback(element)
It passes the current item into a function named callback. This callback function evaluates the item and is expected to return either true (if it matches a condition) or false (if it doesn't).

The && (Short-Circuit) Operator (The clever/confusing part)
Instead of using a traditional if statement, this code uses a JavaScript trick called short-circuit evaluation.

If callback(element) returns false, JavaScript stops right there and completely ignores whatever is on the right side of the &&.

If callback(element) returns true, JavaScript moves past the && and runs the next command.

```js
// Iterates through each item in the original array
array.forEach((element) => {
  callback(element) && newArray.push(element);
});

// Returns the newly filtered array
return newArray;
```

```js
array.forEach((element) => {
  // If the callback returns true, save the element to the new array
  if (callback(element)) {
    newArray.push(element);
  }
});

return newArray;
```

## Custom Reduce

```js
const phrase = 'banana';

const charCount = [...phrase].reduce((accumulator, char) => {
  // If the character exists in our object, increment it; otherwise, set it to 1
  accumulator[char] = (accumulator[char] || 0) + 1;
  return accumulator;
}, {}); // Initial value is an empty object {}

console.log(charCount);
// Output: { b: 1, a: 3, n: 2 }
```

## groupBy

Object.hasOwn(obj, prop)

obj
The JavaScript object instance to test.

prop
The String name or Symbol of the property to test.

```js
function groupBy(array, property) {
  const groupsMap = {};
  array.forEach((element) => {
    const key = ele[callback];
    if (Object.hasOwn(groupsMap, key)) {
      groupsMap[key].push(element);
    } else {
      groupsMap[key] = [element];
    }
  });
  return groupsMap;
}
```

## deepClone

```js

```

## EventEmitter
