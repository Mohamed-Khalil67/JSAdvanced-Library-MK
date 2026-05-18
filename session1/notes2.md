# Advanced Control Flow, Iteration Internal Mechanics, and Performance Optimization

This document explores JavaScript control flow, logical operators, iteration internals, iterable protocols, generators, and practical performance considerations.

---

## 1. Advanced Control Flow & Logical Operators

### Switch-Case Mechanics

- `switch` uses strict equality (`===`) for comparisons.
- No implicit type coercion occurs between `case` values.

```javascript
const value = 5;

switch (value) {
  case 5:
    console.log('Matched');
    break;
}
```

### The `break` Keyword

Without `break`, execution falls through into subsequent cases.

```javascript
switch (2) {
  case 2:
    console.log('Two');

  case 3:
    console.log('Three');
}
```

Output:

```text
Two
Three
```

---

### Ternary Operator

Useful for concise conditional expressions.

```javascript
const score = 95;

const result = score >= 90 ? 'A' : 'Failed';
```

---

## 2. Logical Operators

### Short-Circuit Evaluation

Logical operators return actual operand values, not necessarily booleans.

---

### OR Operator (`||`)

Returns the first truthy value.

```javascript
const username = '' || 'Guest';

console.log(username); // "Guest"
```

---

### AND Operator (`&&`)

Returns the first falsy value.

```javascript
const isLoggedIn = true;

const result = isLoggedIn && null && 'admin';

console.log(result); // null
```

If all values are truthy, the last value is returned.

```javascript
console.log(true && 'A' && 'B'); // "B"
```

---

### Nullish Coalescing (`??`)

`??` only checks for:

- `null`
- `undefined`

```javascript
const count = 0;

console.log(count || 10); // 10
console.log(count ?? 10); // 0
```

This makes `??` safer for configuration defaults.

```javascript
function createUser(config) {
  return {
    retries: config.retries ?? 3,
  };
}
```

---

## 3. Reference Types & Memory Behavior

Objects and arrays are reference types.

```javascript
console.log([] === []); // false
```

Each array literal creates a distinct object reference in memory.

Variables store references to those objects rather than the object contents directly.

---

## 4. Loop Performance & Iteration

### Measuring Performance

```javascript
console.time('loop');

for (let i = 0; i < 1000000; i++) {}

console.timeEnd('loop');
```

---

### `for` vs Higher-Order Methods

In performance-sensitive scenarios, traditional `for` loops may outperform methods such as:

- `forEach`
- `map`
- `filter`

because higher-order methods introduce:

- callback invocation overhead
- additional abstraction layers
- fewer optimization opportunities in hot execution paths

Example:

```javascript
arr.forEach((item) => {
  process(item);
});
```

vs

```javascript
for (let i = 0; i < arr.length; i++) {
  process(arr[i]);
}
```

In most applications, readability is usually more important than these micro-optimizations.

---

### Length Caching

Older optimization pattern:

```javascript
for (let i = 0, len = arr.length; i < len; i++) {
  // ...
}
```

Modern JavaScript engines already optimize array length access aggressively, so manual caching rarely matters outside extremely performance-sensitive code.

---

## 5. Iteration Tooling

### `for`

- Fastest low-level iteration control
- Full manual control
- Supports `break` and `continue`

```javascript
for (let i = 0; i < arr.length; i++) {}
```

---

### `for...of`

Uses the iterable protocol (`Symbol.iterator`).

```javascript
for (const item of arr) {
  console.log(item);
}
```

Works with:

- arrays
- strings
- maps
- sets
- generators

---

### `for...in`

Iterates over enumerable property names.

```javascript
for (const key in obj) {
  console.log(key);
}
```

Not recommended for arrays because it iterates over property keys rather than ordered values.

---

### Sparse Arrays

```javascript
const arr = [1, , 3];
```

Sparse arrays contain missing indexes ("holes").

Traditional loops access holes as missing properties that behave similarly to `undefined` when read.

```javascript
console.log(arr[1]); // undefined
```

Methods like `forEach()` skip sparse holes entirely.

---

## 6. Custom Iterables

Arrays are iterable because they implement `Symbol.iterator`.

Objects are not iterable by default.

---

### Creating a Custom Iterable

```javascript
const customIterable = {
  data: ['A', 'B', 'C'],

  [Symbol.iterator]() {
    let index = 0;

    return {
      next: () => {
        if (index < this.data.length) {
          return {
            value: this.data[index++],
            done: false,
          };
        }

        return {
          value: undefined,
          done: true,
        };
      },
    };
  },
};

for (const item of customIterable) {
  console.log(item);
}
```

The iterator protocol requires:

```javascript
{
  value: any,
  done: boolean
}
```

---

### Alternative Object Iteration

```javascript
Object.keys(obj);
Object.values(obj);
Object.entries(obj);
```

These methods convert object structures into iterable arrays.

---

## 7. Generator Functions

Generator functions simplify iterator creation.

```javascript
function* generator() {
  yield 1;
  yield 2;
}
```

Generators pause execution and resume later while preserving state.

---

### `yield`

Pauses execution and returns a value.

```javascript
yield 5;
```

Equivalent iterator state:

```javascript
{
  value: 5,
  done: false
}
```

---

### `return`

Terminates the generator.

```javascript
return 10;
```

Equivalent state:

```javascript
{
  value: 10,
  done: true
}
```

---

### Generator Execution Example

```javascript
function* streamGenerator() {
  yield 'First';
  yield 'Second';

  return 'Done';
}

const iterator = streamGenerator();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

Output:

```javascript
{ value: 'First', done: false }
{ value: 'Second', done: false }
{ value: 'Done', done: true }
```

---

### Generators with `for...of`

`for...of` ignores generator `return` values.

```javascript
function* numberGen() {
  yield 1;
  yield 2;

  return 3;
}

for (const num of numberGen()) {
  console.log(num);
}
```

Output:

```text
1
2
```

The loop stops once `done: true` is encountered.

---

## 8. Performance Considerations with Generators

Generators enable lazy evaluation.

Instead of allocating massive arrays in memory:

```javascript
const hugeArray = [
  /* 1 million items */
];
```

you can generate values incrementally:

```javascript
function* streamData() {
  let i = 0;

  while (true) {
    yield i++;
  }
}
```

Benefits include:

- reduced memory pressure
- smaller heap usage
- incremental processing
- improved scalability for streaming workflows
