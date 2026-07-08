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
