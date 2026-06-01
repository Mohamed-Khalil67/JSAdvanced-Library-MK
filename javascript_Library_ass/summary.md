# JavaScript Utility Library — Simple Explanations

---

## 1. customEach

Loops over every element in an array and runs a callback on each one. Returns nothing — only used for side effects like logging.

---

## 2. customMap

Loops over every element, transforms it using a callback, and collects all results into a new array. Original array is never changed.

---

## 3. customFilter

Loops over every element and keeps only the ones where the callback returns true. Returns a new shorter array.

---

## 4. customReduce

Collapses an entire array into one single value by running a callback on each element and carrying the result forward. Works with or without an initial value.

---

## 5. customFind

Searches the array and returns the first element where the callback returns true. Stops immediately when found.

---

## 6. customIncludes

Checks if a value exists anywhere in the array. Returns true or false. Uses strict equality so types must match.

---

## 7. customGroupBy

Takes an array of objects and groups them by a shared key into one object. Each unique key value becomes a property holding an array of matching items.

---

## 8. customDeepClone

Creates a fully independent copy of any value — including deeply nested objects and arrays. Uses recursion to copy every level. Changing the clone never affects the original.

---

## 9. customOnce

Wraps a function so it can only run once. Every call after the first returns the same cached result without running the function again. Uses a closure to remember if it already ran.

---

## 10. customMemoize

Wraps a function and caches its results. Same arguments always return the cached result instead of recalculating. Uses a closure to store the cache between calls.

---

## 11. customCompose

Chains multiple functions together right to left. The output of each function becomes the input of the next. Returns a new function that runs the whole chain.

---

## 12. customFlattenArray

Takes a deeply nested array and returns one flat array with all values. Uses recursion to handle any depth of nesting.

---

## 13. customCreateCounter

Returns an object with four methods — increment, decrement, reset, value. The count lives privately in a closure and can only be accessed through the methods.

---

## 14. customCreateSecretHolder

Stores a value privately in a closure. Exposes only two methods — getSecret to read it and setSecret to update it. Nobody can access the value directly.

---

## 15. customPipeAsync

Chains multiple async functions left to right. Each function waits for the previous one to finish before running. Returns a promise with the final result.

---

## 16. customEmitter

An event system with four methods — on registers a listener, emit fires all listeners for an event, off removes them, once fires only one time then removes itself automatically.
