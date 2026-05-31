# JavaScript Syntax Reference — Library Building Cheat Sheet

---

## Loops

### All Loop Forms — How to Write Them

#### `for` — index-based (use when you need `i`)

```js
for (let i = 0; i < arr.length; i++) {
  arr[i]; // current element
  i; // current index
  arr.length; // total length
}
```

#### `for...of` — value-based (cleaner, no index)

```js
for (const item of arr) {
  item; // each value, no index available
}
```

#### `for...in` — object keys only

```js
for (const key in obj) {
  key; // the key string
  obj[key]; // the value
}
// WARNING: never use for...in on arrays
```

#### `while` — condition-based

```js
let i = 0;
while (i < arr.length) {
  arr[i];
  i++; // must move toward the exit condition!
}
```

#### `break` and `continue`

```js
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) break; // stop loop
  if (arr[i] < 0) continue; // skip item
}
```

### When to Use Each + Library Patterns

- **`for(i)`** — reach for this when you need the index, or when building a result at specific positions. Most common in library functions.
- **`for...of`** — best when you only care about the value. Use inside filter-like functions, checkers, string character walkers.
- **`for...in`** — only for plain objects (`{}`). Picks up prototype keys too, so add `if(obj.hasOwnProperty(k))` if needed.
- **`while`** — use when you don't know the iteration count upfront. Good for searching until a condition flips.

### Replacing Forbidden Methods

| Method       | Replace with                           |
| ------------ | -------------------------------------- |
| `map()`      | `for` loop + push to new array         |
| `filter()`   | `for` loop + conditional push          |
| `find()`     | `for` loop + `return` on first match   |
| `some()`     | `for` loop + `return true` on match    |
| `every()`    | `for` loop + `return false` on failure |
| `reduce()`   | `for` loop + accumulator variable      |
| `includes()` | `for` loop + strict `===` check        |
| `indexOf()`  | `for` loop + return `i`, else `-1`     |

---

## Closures

### How to Write and Declare Closures

#### Form 1 — Function returning an object (module pattern)

```js
function createThing() {
  let privateVar = 0; // closed-over state

  return {
    // public API
    increment() {
      privateVar++;
    },
    getValue() {
      return privateVar;
    },
  };
}
const thing = createThing();
thing.increment();
thing.getValue(); // 1
```

#### Form 2 — Function returning a function (factory)

```js
function makeMultiplier(factor) {
  // factor is closed over
  return (n) => n * factor;
}
const double = makeMultiplier(2);
const triple = makeMultiplier(3);
double(5); // 10
```

#### Form 3 — IIFE (runs immediately, returns API)

```js
const myLib = (() => {
  let secret = 'private'; // nobody can touch this

  function _internal() {
    return secret;
  }

  return {
    // only this is exposed
    getSecret: _internal,
  };
})();
myLib.getSecret();
```

### What Closes Over What + Gotchas

- **The rule:** any variable declared in an outer function is accessible to all inner functions — even after the outer function has returned.
- **What to close over:** counters, caches (`{}`), flags (`let called = false`), config values, collections.
- **Classic gotcha — `var` in loops:** `var i` in a for loop is shared across all iterations. Use `let` instead — it creates a new binding per iteration.

### Library Use Cases for Closures

| Use Case                 | How                                     |
| ------------------------ | --------------------------------------- |
| **Private state**        | Stack, Queue, Counter without classes   |
| **Memoize**              | `const cache = {}` lives in the closure |
| **Configurable factory** | Bake in config, return ready tool       |
| **`once(fn)`**           | `let called = false` in closure         |
| **debounce / throttle**  | Timer ID lives in closure               |
| **Event emitter**        | Listeners array lives in closure        |

> **Mental model:** the inner function has a backpack. When it's created, it packs a reference to every variable in the outer scope. It carries that backpack wherever it goes.

---

## Recursion

### How to Write Recursive Functions

#### The skeleton — always write in this order

```js
function solve(input) {
  // 1. BASE CASE — when do we stop?
  if (input is small enough) return answer;

  // 2. RECURSIVE CASE — shrink the problem
  return solve(smaller version of input);
}
```

#### Flatten — unknown nesting depth

```js
function flatten(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      const flat = flatten(arr[i]); // recurse
      for (const v of flat) out.push(v);
    } else {
      out.push(arr[i]); // base: not array
    }
  }
  return out;
}
```

#### Deep clone — any nested object

```js
function deepClone(val) {
  // base: primitive — just return it
  if (val === null || typeof val !== 'object') return val;
  // recursive: array
  if (Array.isArray(val)) {
    const a = [];
    for (let i = 0; i < val.length; i++) a.push(deepClone(val[i]));
    return a;
  }
  // recursive: object
  const obj = {};
  for (const k in val) obj[k] = deepClone(val[k]);
  return obj;
}
```

### Rules + When to Use Recursion

- **Rule 1 — base case first.** Before writing the recursive call, write the stop condition. Skipping this = infinite loop = stack overflow crash.
- **Rule 2 — always shrink.** Each recursive call must receive a smaller/simpler version of the problem. If the input doesn't shrink, you loop forever.
- **Rule 3 — use recursion for unknown depth.** If you'd need a loop inside a loop inside a loop, that's a recursion signal.

### When to Use Recursion vs a Loop

| ✅ Use recursion                                    | ❌ Don't use recursion                     |
| --------------------------------------------------- | ------------------------------------------ |
| Nested arrays, nested objects, trees, unknown depth | Flat arrays — a loop is simpler and faster |

### Common Base Cases to Know

```js
if (arr.length === 0) return [];
if (n === 0 || n === 1) return n;
if (typeof val !== 'object') return val;
if (keys.length === 0) return obj;
```

> **Replace `flat()`:** recursion. **Replace deep operations:** recursion. **Replace sort on flat array:** nested for loops, not recursion.

---

## Functions

### All Function Declaration Forms

#### Declaration — hoisted, can call before it's defined

```js
function add(a, b) {
  return a + b;
}
```

#### Expression — not hoisted, stored in a variable

```js
const add = function (a, b) {
  return a + b;
};
```

#### Arrow function — short syntax, no own `this`

```js
const add = (a, b) => a + b; // one-liner
const add = (a, b) => {
  return a + b;
}; // block body
```

#### Default parameters

```js
function greet(name = 'stranger') {
  return 'Hello, ' + name;
}
```

#### Rest parameters — gather extra args into array

```js
function sum(...nums) {
  // nums is an array
  let total = 0;
  for (const n of nums) total += n;
  return total;
}
sum(1, 2, 3, 4); // 10
```

#### Higher-order — takes a function as argument

```js
function myMap(arr, transform) {
  const result = [];
  for (let i = 0; i < arr.length; i++) result.push(transform(arr[i], i, arr));
  return result;
}
```

### When to Use Each Form + Key Rules

- **Declaration vs expression:** use declarations for main utility functions (they're hoisted, easier to read). Use expressions / arrows for callbacks and short helpers.
- **Arrow functions** don't have their own `this` — ideal for callbacks, closures, one-liners. Use regular `function` when you need `this` or `arguments`.
- **Default params** save you from writing `if (x === undefined) x = default` at the top of every function. Use them for optional config arguments.
- **Rest params** (`...args`) let a function accept any number of arguments. Use when building utilities like `pipe(...fns)`, `sum(...nums)`.

### The Callback Signature Convention

- Always call callbacks as `fn(element, index, array)` — same as native methods, so users aren't surprised.
- Guard against missing callbacks: `if (typeof fn !== 'function') throw new Error(...)`
- Return `undefined` from forEach-like functions, return a new array from map/filter-like ones.

---

## Arrays

### Declaring + Safe Operations on Arrays

#### Declare an array

```js
const arr = [1, 2, 3]; // literal
const empty = []; // start empty, push later
const copy = [...arr]; // spread copy (safe!)
const copy2 = arr.slice(); // slice copy (also safe)
```

#### Allowed operations (non-mutating)

```js
arr.length          // how many items
arr[i]              // read item at index i
arr.slice(a, b)     // copy a section — safe
arr.concat(other)   // join two arrays — safe
[...arr, newItem]   // copy + append — safe
Array.isArray(arr)  // check if it's an array
```

#### Mutating operations — copy first before using!

```js
arr.push(v); // add to end (mutates!)
arr.pop(); // remove from end (mutates!)
arr.shift(); // remove from start (mutates!)
arr.unshift(v); // add to start (mutates!)
arr.splice(i, n); // remove/insert (mutates!)
```

#### Safe pattern — always copy before mutating

```js
// WRONG — mutates original
function addItem(arr, item) {
  arr.push(item); // caller's array is now changed!
  return arr;
}

// RIGHT — copy first
function addItem(arr, item) {
  const copy = [...arr];
  copy.push(item);
  return copy;
}
```

### Edge Cases to Always Handle

- **Empty array:** always test with `[]`. Your loop runs 0 times — does the function still return the right thing? Usually `return []` or `return undefined`.
- **`null` / `undefined` input:** a caller might pass nothing. Guard at the top: `if (!Array.isArray(arr)) return []`
- **Don't mutate the original.** This is the #1 library rule. Callers trust that you won't change their data. Always create a new array for the result.

### The Result-Building Pattern (used everywhere)

```js
function myUtility(arr) {
  if (!Array.isArray(arr)) return []; // guard
  const result = []; // accumulator
  for (let i = 0; i < arr.length; i++) {
    // your logic here
    result.push(something);
  }
  return result; // new array
}
```

### Handy Tricks

- **Destructuring:** `const [first, ...rest] = arr` — splits head from tail
- **Swap without temp:** `[a[i], a[j]] = [a[j], a[i]]`

---

## Objects

### Declaring + Working with Objects

#### Declare an object

```js
const obj = { key: 'value', num: 42 }; // literal
const empty = {}; // empty, add later
```

#### Read and write keys

```js
obj.key; // dot notation — static key name
obj['key']; // bracket — any expression as key
obj[variable]; // bracket — dynamic key (important!)

obj.newKey = 'val'; // add a key
delete obj.key; // remove a key
```

#### Check if key exists

```js
'key' in obj; // true if key exists
obj.key !== undefined; // also works for most cases
obj.hasOwnProperty('k'); // ignores prototype keys
```

#### Iterate keys — `for...in`

```js
for (const key in obj) {
  if (!obj.hasOwnProperty(key)) continue; // safe
  obj[key]; // value
}
```

#### Object as lookup table — O(1) search

```js
const seen = {};

for (const item of arr) {
  if (seen[item]) continue; // already seen it
  seen[item] = true; // mark as seen
  result.push(item);
}
```

#### Object as counter

```js
const freq = {};
for (const item of arr) {
  freq[item] = (freq[item] || 0) + 1;
}
```

### Objects as API Shape + Key Patterns

- **Dynamic keys** are the superpower. `obj[variable]` lets you use any string as a key at runtime — this is how `groupBy`, `countBy`, and `unique` all work.
- **Object as lookup table:** checking `seen[x]` is instant (O(1)) regardless of how many keys exist. This replaces slow O(n) loops that search for duplicates.
- **Library API pattern:** return an object at the end of your module to expose only what callers should use. Keep everything else private inside the closure.

### The Full Library Shape

```js
const myLib = (() => {
  // private internals
  function _helper() { ... }

  // public surface — object shape
  return {
    utilA: function(arr) { ... },
    utilB: function(arr) { ... },
  };
})();
```

### Key Patterns

- ✅ **Shorthand property:** if variable name matches key name: `return { chunk, sum }`
- ✅ **Spread copy:** `const copy = { ...obj }` — shallow copy, safe for one level
- ❌ **Spread is shallow:** nested objects are still references — use `deepClone` for deep copy
