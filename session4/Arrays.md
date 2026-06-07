# JavaScript Functions — Study Notes & Corrections

---

## 1. Spreading Arguments vs. `apply(null, arr)`

Instead of using the spread operator to pass array elements as arguments, `Function.prototype.apply()` can be used as an equivalent:

```js
// Spread (modern)
Math.max(...arr);

// apply equivalent (older style)
Math.max.apply(null, arr);
```

`apply(thisArg, argsArray)` calls the function with a given `this` value and an array of arguments. Passing `null` as the first argument means no specific context is bound.

---

## 2. The Function Constructor

The `Function` constructor dynamically creates a new function from a string of code **at runtime**:

```js
const fn = new Function('return 1 + 1;');
```

> ⚠️ **Avoid in production.** Three major drawbacks:
>
> 1. **Security** — executes arbitrary strings, vulnerable to injection attacks
> 2. **Performance** — cannot be optimised by the JS engine like static code
> 3. **Runtime errors** — mistakes are only caught at runtime, not during parsing

**Dangerous example — never pass user input directly:**

```js
const userInput = "alert('hacked')";
const fn = new Function(userInput); // XSS risk!
fn(); // Executes the injected code
```

---

## 3. IIFE — Immediately Invoked Function Expression

An IIFE is a function that is defined and called immediately when the program reaches it. It creates its own scope, preventing variable leakage into the global scope.

```js
(function () {
  var count = 0;
  console.log(count); // 0
})();
```

- The wrapping parentheses turn the declaration into an expression
- The trailing `()` immediately invokes it
- `count` is scoped inside the IIFE and inaccessible from outside
- Common use: module patterns, avoiding global scope pollution

---

## 4. Pure Functions

**Definition:** A pure function always returns the same output for the same inputs and produces no side effects. It does not read from or write to variables outside its own scope.

```js
// Pure
function add(a, b) {
  return a + b;
}

// Impure — depends on external variable
let tax = 0.2;
function addTax(price) {
  return price + price * tax;
}
```

> ⚠️ **Caution with default parameters:** `add(a, b = 10, c)` — if `c` is `undefined` the result changes, making the function's behaviour inconsistent across calls.

Pure functions are heavily tested on platforms like **HackerRank** and **LeetCode**, and are a key building block of **function composition**.

---

## 5. Function Execution Context

Every time a function is called, the JavaScript engine creates a new **Execution Context** for it. Each context contains:

- Parameters and local variables
- The scope chain (access to outer variables)
- A reference to the outer (lexical) environment
- The `this` keyword

> 💡 **Interview tip:** You may be asked to trace through code and predict the exact order of `console.log` outputs, taking hoisting, scope chain, and `this` binding into account.

---

## 6. Hoisting and `var` Re-declaration

`var` declarations are hoisted to the top of their containing function with an initial value of `undefined`. Re-declaring a `var` inside a block does not create a new variable — it shadows the outer one with `undefined` until the assignment runs.

```js
var x = 10;
function test() {
  console.log(x); // undefined  (NOT 10)
  var x = 20; // hoisted declaration, assigned later
  console.log(x); // 20
}
```

> ✅ **Correction:** The inner `var x` is hoisted to the top of `test()`, so the first `console.log` sees `undefined`, not `10`. Use `let` or `const` instead of `var` to prevent this — they are block-scoped and not initialised until their line runs.

---

## 7. The `this` Keyword & Arrow Functions

Arrow functions **do not** have their own `this` binding. They inherit `this` from the surrounding lexical scope at the time they are defined. Regular function expressions create their own `this` context.

```js
const obj = {
  name: 'Demo',
  regular: function () {
    console.log(this.name);
  }, // 'Demo'
  arrow: () => {
    console.log(this.name);
  }, // undefined
};
```

> ✅ **Correction on `setTimeout` callbacks:** Inside `setTimeout` with a regular function, `this` points to the global object (`window` in browsers), so accessing `this.name` returns `undefined`. Replacing the callback with an arrow function fixes this because the arrow function inherits `this` from the outer method where it was written.

```js
// Problem — this === window
setTimeout(function () {
  console.log(this.name); // undefined
}, 1000);

// Fix — arrow function inherits outer this
setTimeout(() => {
  console.log(this.name); // correct this
}, 1000);
```

> 📌 **Also know:** Arrow functions have no `arguments` object, cannot be used as constructors (`new`), and cannot be generator functions.

---

## Quick Reference — Function Types at a Glance

| Feature             | Regular `function` | Arrow `=>`            | `new Function()` |
| ------------------- | ------------------ | --------------------- | ---------------- |
| Has own `this`      | ✅ Yes             | ❌ No (lexical)       | ✅ Yes           |
| Has `arguments` obj | ✅ Yes             | ❌ No                 | ✅ Yes           |
| Hoisted             | ✅ Yes (full)      | ❌ No (`let`/`const`) | ❌ No            |
| Can use `new`       | ✅ Yes             | ❌ No                 | ✅ Yes           |
| Runtime security    | ✅ Safe            | ✅ Safe               | ⚠️ Risky         |

---

> 🎯 **Study focus for interviews:** hoisting with `var`, `this` binding in callbacks, arrow vs regular functions, pure function composition, and execution context creation/destruction.

---

---

# JavaScript Arrays — Study Notes & Corrections

---

## 1. Mutation — Changing the Array Itself

**Mutation** means modifying the original array in place, rather than returning a new one.

Arrays are stored by **reference**, not by value. Assigning an array to a new variable does not copy it — both variables point to the same object in memory.

```js
const arr = [1, 2, 3, 4, 5];
const x = arr; // x points to the SAME array, not a copy
x.push(10);
console.log(arr); // [1, 2, 3, 4, 5, 10] — arr is also mutated!
```

> ⚠️ **Reference transfer:** Assigning `arr` to `x` transfers the reference, not the data. Any mutation through `x` will also affect `arr`.

---

## 2. Mutation vs. Non-Mutation Methods

### Mutating Methods (modify the original array)

| Method         | What it does                           |
| -------------- | -------------------------------------- |
| `push()`       | Adds to the end                        |
| `pop()`        | Removes from the end                   |
| `shift()`      | Removes from the beginning             |
| `unshift()`    | Adds to the beginning                  |
| `splice()`     | Adds/removes at any index              |
| `sort()`       | Sorts in place                         |
| `reverse()`    | Reverses in place                      |
| `fill()`       | Fills slots with a value               |
| `copyWithin()` | Copies part of the array within itself |

### Non-Mutating Methods (return a new array or value)

| Method       | What it does                                |
| ------------ | ------------------------------------------- |
| `map()`      | Transforms each element → new array         |
| `filter()`   | Keeps elements that pass a test → new array |
| `reduce()`   | Reduces to a single value                   |
| `slice()`    | Extracts a portion → new array              |
| `concat()`   | Merges arrays → new array                   |
| `includes()` | Returns `true`/`false`                      |
| `find()`     | Returns first matching element              |
| `some()`     | Returns `true` if any element passes        |
| `every()`    | Returns `true` if all elements pass         |

---

## 3. Most Confused: `slice` vs. `splice`

```js
const arr = ['a', 'b', 'c', 'd'];

// slice(start, end) — does NOT affect the original array
const res = arr.slice(1, 3);
console.log(res); // ["b", "c"]
console.log(arr); // ["a", "b", "c", "d"]  — unchanged

// splice(start, deleteCount) — DOES affect the original array
arr.splice(1, 2);
console.log(arr); // ["a", "d"]  — mutated!
```

> 💡 **Memory trick:** `splIce` has an **I** — it modifies **I**tself. `slIce` just takes a clean cut and leaves the original alone.

---

## 4. Holes (Sparse Arrays)

A **hole** is an empty slot in an array — different from a slot explicitly set to `undefined`.

```js
const a = [undefined]; // slot exists, value is undefined
const b = new Array(1); // empty slot — a HOLE

console.log(a[0]); // undefined
console.log(b[0]); // undefined  (looks the same!)

console.log(0 in a); // true  — slot exists
console.log(0 in b); // false — hole, slot does not exist
```

### How Different Loops Handle Holes

```js
const arr = [1, , 3]; // hole at index 1

// for loop — does NOT skip holes, reads undefined
for (let i = 0; i < arr.length; i++) {
  console.log(i, arr[i]);
  // 0  1
  // 1  undefined
  // 2  3
}

// forEach — SKIPS holes entirely
arr.forEach((value, index) => {
  console.log(index, value);
  // 0  1
  // 2  3   ← index 1 skipped
});
```

> ✅ **Correction on `map()`:** `map()` does **not** pass the hole to the callback (it skips it), but it **preserves the hole's position** in the new array. The hole stays a hole in the result — it is not converted to `undefined`.

---

## 5. Packed vs. Holey Arrays

```js
// Packed — no gaps, JS engine can optimise fully
const arr = [1, 2, 3, 4];

// Holey — gap at index 2, harder to optimise
const arr2 = [1, 2, , 4];

// Extremely holey — only one value, 100 empty slots before it
const arr3 = [];
arr3[100] = 'hello';
console.log(arr3); // [empty × 100, "hello"]
```

> ⚠️ **Performance note:** Packed arrays are significantly faster. The JS engine downgrades an array's internal type the moment a hole is introduced, and this cannot be reversed. Avoid creating holey arrays.

---

## 6. Array-Like Objects

An **array-like** is a plain object with numeric keys and a `length` property. It looks like an array but lacks array methods like `push()`.

```js
const obj = {
  0: 'html',
  1: 'css',
  2: 'js',
  length: 3,
};

// Convert to a real array using Array.from()
const res = Array.from(obj);
console.log(res); // ["html", "css", "js"]
```

**Common real-world array-likes:**

```js
const html = document.querySelectorAll('.item');
// html is a NodeList — array-like, NOT a real array
html.push(); // ❌ TypeError: html.push is not a function

// Fix
Array.from(html).push('something'); // ✅
```

> 📌 Other array-likes: `arguments` inside a regular function, `HTMLCollection`, strings.

---

## 7. Sorting Arrays

`sort()` without arguments converts elements to **strings** and compares by Unicode/ASCII value — this gives wrong results for numbers.

```js
[10, 9, 2, 1, 100].sort();
// ❌ [1, 10, 100, 2, 9]  — string comparison!

[10, 9, 2, 1, 100].sort((a, b) => a - b);
// ✅ [1, 2, 9, 10, 100]  — numeric ascending
```

**Comparator logic:**

| Expression | Result   | Meaning                          |
| ---------- | -------- | -------------------------------- |
| `a - b`    | negative | `a` comes first → **ascending**  |
| `a - b`    | positive | `b` comes first → **descending** |
| `b - a`    | —        | **descending** order             |

```js
// Ascending
nums.sort((a, b) => a - b);

// Descending
nums.sort((a, b) => b - a);
```

> ⚠️ **Correction:** `sort()` mutates the original array. If you need to keep the original, sort a copy: `[...nums].sort((a, b) => a - b)`.

> 💡 When sorting objects (e.g. by date), holes are pushed to the **end** of the sorted result.

---

## 8. Dates in Arrays

```js
const dates = [new Date('2026-01-01'), new Date('2025-06-15')];

// Sort dates ascending
dates.sort((a, b) => a - b); // Date subtraction works — converts to timestamps
```

> 📌 For complex date formatting and manipulation on the frontend, use **Day.js** (lightweight, modern) or **Moment.js** (larger, legacy). Native `Date` is sufficient for sorting and basic comparisons.

---

## 9. Tooling Mentions

| Tool                          | Purpose                                                                |
| ----------------------------- | ---------------------------------------------------------------------- |
| **Webpack Module Federation** | Combines more than one framework in a single project (micro-frontends) |
| **Vite**                      | Fast build tool; compiles TypeScript to JavaScript with minimal config |
| **Day.js / Moment.js**        | Date handling on the frontend                                          |

---

## Quick Reference — Mutation at a Glance

|                                | Mutates original? | Returns                          |
| ------------------------------ | ----------------- | -------------------------------- |
| `push / pop / shift / unshift` | ✅ Yes            | new length or removed element    |
| `splice`                       | ✅ Yes            | removed elements                 |
| `sort / reverse`               | ✅ Yes            | sorted/reversed array (same ref) |
| `slice`                        | ❌ No             | new array                        |
| `map / filter`                 | ❌ No             | new array                        |
| `reduce`                       | ❌ No             | single value                     |
| `Array.from()`                 | ❌ No             | new array                        |

---

> 🎯 **Study focus for interviews:** reference vs. value, `slice` vs. `splice`, how different loops handle holes, sort comparator logic, and converting array-likes with `Array.from()`.
