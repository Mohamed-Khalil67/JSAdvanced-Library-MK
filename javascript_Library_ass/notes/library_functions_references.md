# JavaScript Utility Library — Function Reference

---

## 1. customEach

**What it does:** Iterates over every element in an array and runs a callback on each one. Returns nothing — it is purely for side effects like logging or updating external state.

**Signature:**

```javascript
customEach(array, callback);
```

**Example:**

```javascript
customEach([1, 2, 3], (val, i) => console.log(i, val));
// 0 1
// 1 2
// 2 3
```

**Key behavior:**

- Calls callback with (element, index, array) on every item
- Returns undefined always — never returns a value
- Empty array → does nothing, returns undefined
- Invalid array or callback → throws TypeError

---

## 2. customMap

**What it does:** Transforms every element in an array using a callback and returns a brand new array of the transformed values. The original array is never touched.

**Signature:**

```javascript
customMap(array, callback);
```

**Example:**

```javascript
customMap([1, 2, 3], (x) => x * 2); // [2, 4, 6]
customMap(['a', 'b'], (v, i) => i + v); // ['0a', '1b']
```

**Key behavior:**

- Always returns a new array of the same length as the input
- Original array is not mutated
- Empty array → returns []
- Invalid array or callback → throws TypeError

---

## 3. customFilter

**What it does:** Goes through every element and keeps only the ones where the callback returns true. Returns a new array — could be shorter than the original, never longer.

**Signature:**

```javascript
customFilter(array, callback);
```

**Example:**

```javascript
customFilter([1, 2, 3, 4, 5], (x) => x % 2 === 0); // [2, 4]
customFilter(['apple', 'bat', 'cherry'], (w) => w.length > 3); // ['apple', 'cherry']
```

**Key behavior:**

- Returns a new array containing only passing elements
- Output length is unknown upfront — uses push, not index assignment
- Original array is not mutated
- Empty array → returns []
- Invalid array or callback → throws TypeError

---

## 4. customReduce

**What it does:** Collapses an entire array down into a single value by running a callback on each element and carrying the result forward as an accumulator. Think of it as folding the array into one thing.

**Signature:**

```javascript
customReduce(array, callback, initialValue?)
```

**Example:**

```javascript
customReduce([1, 2, 3, 4], (acc, val) => acc + val, 0); // 10
customReduce([1, 2, 3, 4], (acc, val) => acc + val); // 10 (no initial value)
customReduce(['a', 'b', 'c'], (acc, val) => acc + val); // 'abc'
```

**Key behavior:**

- If initialValue is provided → accumulator starts as initialValue, loop starts at index 0
- If initialValue is not provided → accumulator starts as first element, loop starts at index 1
- Empty array with no initialValue → throws TypeError
- Invalid array or callback → throws TypeError

---

## 5. customFind

**What it does:** Searches through an array and returns the first element where the callback returns true. Stops immediately when found — does not keep searching.

**Signature:**

```javascript
customFind(array, callback);
```

**Example:**

```javascript
customFind([5, 12, 8, 3], (x) => x > 10); // 12
customFind([1, 2, 3], (x) => x > 99); // undefined
```

**Key behavior:**

- Returns the element itself, not true/false
- Stops at the first match — efficient, no wasted iterations
- Returns undefined if nothing matches
- Invalid array or callback → throws TypeError

---

## 6. customIncludes

**What it does:** Checks whether a specific value exists anywhere in an array. Returns true or false. Uses strict equality (===) so types must match too.

**Signature:**

```javascript
customIncludes(array, value);
```

**Example:**

```javascript
customIncludes([1, 2, 3], 2); // true
customIncludes([1, 2, 3], 99); // false
customIncludes(['a', 'b', 'c'], 'b'); // true
customIncludes([1, 2, 3], '2'); // false — type mismatch
```

**Key behavior:**

- Uses === strict equality — 2 and '2' are different
- Stops immediately on first match
- Returns false if value not found
- Invalid array → throws TypeError

---

## 7. customGroupBy

**What it does:** Takes an array of objects and groups them into an object based on a shared property. Each unique value of that property becomes a key, and all matching objects are collected into an array under that key.

**Signature:**

```javascript
customGroupBy(array, key);
```

**Example:**

```javascript
const users = [
  { name: 'Ahmed', role: 'admin' },
  { name: 'Sara', role: 'user' },
  { name: 'Omar', role: 'admin' },
];

customGroupBy(users, 'role');
// {
//   admin: [{ name: 'Ahmed', role: 'admin' }, { name: 'Omar', role: 'admin' }],
//   user:  [{ name: 'Sara',  role: 'user' }]
// }
```

**Key behavior:**

- Returns an object, not an array
- Groups are created dynamically as new key values are encountered
- Key argument must be a string → throws TypeError otherwise
- Invalid array → throws TypeError

---

## 8. customDeepClone

**What it does:** Creates a completely independent copy of any value — including deeply nested objects and arrays. Changing the clone never affects the original, no matter how deep the nesting goes.

**Signature:**

```javascript
customDeepClone(value);
```

**Example:**

```javascript
const original = {
  name: 'Ahmed',
  scores: [1, 2, 3],
  address: { city: 'Cairo' },
};
const copy = customDeepClone(original);

copy.address.city = 'Alex';
copy.scores.push(99);

console.log(original.address.city); // 'Cairo' — untouched
console.log(original.scores); // [1, 2, 3] — untouched
```

**Key behavior:**

- Uses recursion to handle any depth of nesting
- Primitives (string, number, boolean, null) are returned as-is
- Arrays → cloned into a new array recursively
- Objects → cloned into a new object recursively
- No shared references anywhere in the result

---

## 9. customOnce

**What it does:** Wraps a function so it can only ever run once. Every call after the first silently returns the same cached result without running the function again.

**Signature:**

```javascript
customOnce(fn);
```

**Example:**

```javascript
const init = customOnce(() => {
  console.log('setting up...');
  return 42;
});

init(); // logs 'setting up...' → returns 42
init(); // silent → returns 42
init(); // silent → returns 42
```

**Key behavior:**

- Uses a closure to store two things: whether it ran, and what it returned
- After first call, fn is nulled out — it can never run again
- All subsequent calls return the cached result instantly
- Passes all arguments through to fn on the first call
- Invalid fn → throws TypeError

---

## 10. customMemoize

**What it does:** Wraps a function and caches its results. If the function is called again with the same arguments, it returns the cached result instead of running the function again. Different arguments = new calculation and new cache entry.

**Signature:**

```javascript
customMemoize(fn);
```

**Example:**

```javascript
const slowDouble = customMemoize((n) => n * 2);

slowDouble(5); // runs function → 10, stored in cache
slowDouble(5); // cache hit → 10 (25x faster)
slowDouble(6); // runs function → 12, new cache entry
slowDouble(6); // cache hit → 12

const add = customMemoize((a, b) => a + b);
add(2, 3); // runs → 5
add(2, 3); // cache hit → 5
add(1, 2); // runs → 3 (different args, new entry)
```

**Key behavior:**

- Cache is an object stored in a closure — lives as long as the memoized function exists
- Arguments are serialized with JSON.stringify to create a unique string key
- Works with any number of arguments
- Type-safe keys — add(2,3) and add('2','3') are different cache entries
- Invalid fn → throws TypeError

---

## 11. customCompose

**What it does:** Takes multiple functions and combines them into one. When called, it runs the functions right to left — the last function runs first, its output feeds into the second-to-last, and so on until the first function produces the final result.

**Signature:**

```javascript
customCompose(...fns);
```

**Example:**

```javascript
const double = (x) => x * 2;
const addTen = (x) => x + 10;
const square = (x) => x * x;

const transform = customCompose(square, addTen, double);
transform(3);
// double(3)  → 6
// addTen(6)  → 16
// square(16) → 256
```

**Key behavior:**

- Accepts any number of functions using rest parameters
- Executes right to left — last argument runs first
- Each function receives the output of the previous as its input
- Returns a new function, not a value — you call the result
- Guards every function in the list → throws TypeError if any is not a function

---

## How they connect

```
customEach        → foundation — iterates, no return
customMap         → iterates + transforms → new array (same length)
customFilter      → iterates + selects   → new array (shorter)
customReduce      → iterates + collapses → single value
customFind        → iterates + searches  → single element or undefined
customIncludes    → iterates + checks    → true or false
customGroupBy     → iterates + organizes → object of arrays
customDeepClone   → recurses through any structure → independent copy
customOnce        → closure with 1 cache slot → run exactly once
customMemoize     → closure with N cache slots → run once per unique input
customCompose     → chains functions right to left → pipeline
```
