# Session 1 Notes: JavaScript Data Types & Ecosystem

## 3. Data Types & Ecosystem Architecture

### The Language Spec vs. The Environment

- **ECMAScript:** The official standardized specification that defines the rules, syntax, semantics, and core features of the JavaScript programming language.
- **TC39 (Technical Committee 39):** The committee responsible for evolving JavaScript. It consists of browser vendors, platform maintainers, and language contributors who review and approve new ECMAScript proposals.

### Native vs. Hosted Objects

- **Native JavaScript Objects:** Built-in objects and features defined directly by ECMAScript and available across compliant environments (e.g., `String`, `Number`, `Boolean`, `Array`, `Math`, `Function`).
- **Hosted Objects:** APIs provided by the environment hosting the JavaScript engine.

#### Browser Environment

Examples include:

```javascript
window.alert();
document.getElementById('app');
```

These APIs are provided by the browser runtime, not ECMAScript itself.

#### Node.js Environment

Node.js provides backend-specific APIs and runtime features such as:

```javascript
fs.readFile();
process.env;
setTimeout();
```

---

## 4. Deep Dive into Data Types

JavaScript values are divided into two major categories:

- **Primitive Types**
- **Objects (Reference Types)**

### Primitive Types

JavaScript has **7 primitive types**:

1. `String`
2. `Number`
3. `Boolean`
4. `BigInt`
5. `Symbol`
6. `Undefined`
7. `Null`

---

### BigInt

`BigInt` allows JavaScript to safely represent integers larger than `Number.MAX_SAFE_INTEGER`.

```javascript
const largeNumber = 2616548516159115n;

console.log(largeNumber);
```

Important rule:

```javascript
1n + 1; // TypeError
```

Operations involving `BigInt` must use other `BigInt` values.

---

### Symbol

`Symbol` creates unique primitive identifiers.

```javascript
const x = Symbol('id');
const y = Symbol('id');

console.log(x === y); // false
```

The description (`'id'`) is only metadata for debugging and does not affect identity.

#### Important Exception: `Symbol.for()`

```javascript
const a = Symbol.for('token');
const b = Symbol.for('token');

console.log(a === b); // true
```

`Symbol.for()` uses the global symbol registry and reuses existing symbols.

---

### Numeric Literal Formats

JavaScript supports multiple numeric literal formats:

#### Decimal

```javascript
const x = 255;
```

#### Hexadecimal

```javascript
const x = 0xff;
```

#### Binary

```javascript
const x = 0b1010;
```

#### Octal

```javascript
const x = 0o755;
```

> Phone numbers should always be stored as strings because numbers are not identifiers, and numeric conversion may remove leading zeros.

---

### Null vs. Undefined

#### `undefined`

Represents a variable that has been declared but not assigned a value.

```javascript
let x;

console.log(x); // undefined
```

#### `null`

Represents an intentional absence of value.

```javascript
let user = null;
```

---

### The `typeof null` Quirk

```javascript
console.log(typeof null); // "object"
```

This behavior is a long-standing historical bug in JavaScript.

Historically, early JavaScript implementations used low-level internal type tagging where `null` values were interpreted similarly to object references, leading to the incorrect `"object"` result.

This behavior was never changed for backward compatibility reasons.

---

## 5. Type Conversion & Coercion

JavaScript performs:

- **Explicit Conversion** → manually performed
- **Implicit Coercion** → automatically performed by the engine

---

### Implicit Coercion Rules

#### The `+` Operator

If either operand is a string, JavaScript performs string concatenation.

```javascript
console.log('5' + 1); // "51"
```

Internal behavior:

```javascript
String(1);
```

---

#### Arithmetic Operators (`-`, `*`, `/`)

Arithmetic operators force numeric conversion.

```javascript
console.log('5' - 1); // 4
console.log('5' * '2'); // 10
```

Equivalent internal behavior:

```javascript
Number('5');
```

---

### Boolean Arithmetic

```javascript
console.log(true + 1); // 2
console.log(false + 1); // 1
```

Internal conversion:

- `true → 1`
- `false → 0`

---

### `NaN` (Not a Number)

`NaN` represents an invalid numeric result.

```javascript
console.log('hello' * 2); // NaN
console.log(0 / 0); // NaN
```

Despite its name:

```javascript
typeof NaN; // "number"
```

---

### Array Coercion

Arrays can be coerced into strings during concatenation.

```javascript
console.log([] + []); // ""
```

Internal behavior:

```javascript
String([]) + String([]);
```

---

### `parseInt()` vs Numeric Conversion

`parseInt()` parses characters from left to right until an invalid numeric character appears.

```javascript
console.log(parseInt('12px')); // 12
console.log(parseInt('px12')); // NaN
```

Parsing behavior:

- Stops at the first invalid character
- Fails immediately if the first character is invalid

---

## 6. Proper AI Usage in Software Engineering

AI should be treated as an engineering accelerator, not as a replacement for technical understanding.

### Good AI Use Cases

- Boilerplate generation
- Repetitive code
- Documentation
- Test generation
- Refactoring suggestions
- Static analysis assistance

---

### Dangerous AI Use Cases

Avoid blindly relying on AI for:

- Architectures you do not understand
- Security-critical systems
- Complex domain logic
- Performance-sensitive internals

---

### AI-Assisted Engineering Workflow

Recommended workflow:

```text
Attempt manually
    ↓
Analyze failures
    ↓
Request AI feedback
    ↓
Validate the reasoning
    ↓
Refine implementation
```

Use AI for structural feedback and review, not passive copy-paste development.

---

## 7. Recommended Resources

### MDN Web Docs

<https://developer.mozilla.org/>

The most authoritative general-purpose documentation source for JavaScript and browser APIs.

---

### Deep-Dive Reading

Why `typeof null` returns `"object"`:

<https://aravishack.medium.com/why-typeof-null-is-object-javascripts-oldest-bug-explained-2fd9e54f5310>
