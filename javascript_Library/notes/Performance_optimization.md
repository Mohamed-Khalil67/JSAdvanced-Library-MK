# ⚡ JavaScript Performance Optimization

> The difference between fast and slow code isn't magic — it's awareness of where time and memory actually go.

---

## 1. Algorithm Complexity — This Matters Enormously

The single biggest lever you have. A better algorithm beats faster hardware every time.

```js
// ❌ O(n²) — Nested loops. Scales catastrophically.
function hasDuplicate_slow(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
// 10 items   →      45 comparisons
// 1,000 items →  499,500 comparisons
// 10,000 items → 49,995,000 comparisons ← dies here

// ✅ O(n) — Single pass with a Set. Scales linearly.
function hasDuplicate_fast(arr) {
  const seen = new Set();
  for (const item of arr) {
    if (seen.has(item)) return true;
    seen.add(item);
  }
  return false;
}
// 10 items    →  10 lookups
// 1,000 items →  1,000 lookups
// 10,000 items → 10,000 lookups ← no problem
```

### Complexity Cheat Sheet

| Notation   | Name         | Example                       | 10k items takes... |
| ---------- | ------------ | ----------------------------- | ------------------ |
| O(1)       | Constant     | Hash map lookup, array[index] | Same as 10 items   |
| O(log n)   | Logarithmic  | Binary search                 | ~13 steps          |
| O(n)       | Linear       | Single loop, Array.find()     | 10,000 steps       |
| O(n log n) | Linearithmic | Merge sort, Array.sort()      | ~130,000 steps     |
| O(n²)      | Quadratic    | Nested loops                  | 100,000,000 steps  |
| O(2ⁿ)      | Exponential  | Naive recursion (Fibonacci)   | Heat death of sun  |

### Real-World Patterns to Watch

```js
// ❌ O(n²) hiding in plain sight — indexOf inside a loop
const filtered = bigArray.filter((item) => anotherArray.indexOf(item) === -1);

// ✅ O(n) — Convert to Set first, then filter
const set = new Set(anotherArray);
const filtered = bigArray.filter((item) => !set.has(item));

// ❌ O(n²) — find() inside a map()
const result = ids.map((id) => records.find((r) => r.id === id));

// ✅ O(n) — Build a lookup map first
const map = new Map(records.map((r) => [r.id, r]));
const result = ids.map((id) => map.get(id));
```

> **Rule of thumb:** If you see a loop inside a loop, ask yourself if you can replace the inner one with a hash map lookup.

---

## 2. Memory Allocation — This Matters

Every allocation costs time. The garbage collector cleans up, but that cleanup pauses your code.

```js
// ❌ Growing array — triggers repeated reallocations
function buildArray_slow(n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(i * 2); // May reallocate backing store multiple times
  }
  return result;
}

// ✅ Pre-allocated typed array — one allocation, direct writes
function buildArray_fast(n) {
  const result = new Int32Array(n); // Exact size, zero GC pressure
  for (let i = 0; i < n; i++) {
    result[i] = i * 2;
  }
  return result;
}

// ✅ If you must use a regular array, pre-fill it
const result = new Array(n).fill(0);
```

### Object Allocation in Hot Paths

```js
// ❌ Creating new objects inside a loop — massive GC pressure
function processPoints_slow(points) {
  return points.map((p) => ({ x: p.x * 2, y: p.y * 2 })); // n new objects
}

// ✅ Mutate in-place if the original isn't needed
function processPoints_fast(points) {
  for (let i = 0; i < points.length; i++) {
    points[i].x *= 2;
    points[i].y *= 2;
  }
  return points;
}

// ✅ Object pooling — reuse objects instead of creating new ones
class Vec2Pool {
  constructor(size) {
    this.pool = Array.from({ length: size }, () => ({ x: 0, y: 0 }));
    this.index = 0;
  }
  get(x, y) {
    const obj = this.pool[this.index % this.pool.length];
    obj.x = x;
    obj.y = y;
    this.index++;
    return obj;
  }
}
```

### String Concatenation

```js
// ❌ String concatenation in a loop — creates n intermediate strings
let html = '';
for (const item of items) {
  html += `<li>${item.name}</li>`; // Each += allocates a new string
}

// ✅ Array join — one final allocation
const html = items.map((item) => `<li>${item.name}</li>`).join('');

// ✅ Or push to array, join at the end
const parts = [];
for (const item of items) parts.push(`<li>${item.name}</li>`);
const html = parts.join('');
```

### Memory Leaks to Know

```js
// ❌ Closures holding large references
function setup() {
  const hugeData = fetchBigData(); // 50MB
  return () => hugeData.length; // hugeData is never released
}

// ❌ Forgotten event listeners
element.addEventListener('click', handler);
// element removed from DOM, but handler still holds reference → leak

// ✅ Always clean up
element.addEventListener('click', handler);
// Later:
element.removeEventListener('click', handler);
// Or use AbortController:
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
controller.abort(); // Removes the listener
```

---

## 3. DOM Operations — This Matters

The DOM is a bridge between JavaScript and the browser's rendering engine. Crossing that bridge is expensive. Crossing it inside a loop is catastrophic.

```js
// ❌ DOM query inside a loop — layout recalculated each time
function highlightItems_slow(ids) {
  for (const id of ids) {
    const el = document.querySelector(`#item-${id}`); // ← hits the DOM every iteration
    el.classList.add('highlight');
  }
}

// ✅ Query once, store the reference
function highlightItems_fast(ids) {
  const cache = {};
  for (const id of ids) {
    cache[id] = document.querySelector(`#item-${id}`);
  }
  for (const id of ids) {
    cache[id]?.classList.add('highlight');
  }
}
```

### Batch DOM Writes — Avoid Layout Thrashing

The browser defers layout recalculation until it needs to. If you interleave reads and writes, it's forced to recalculate synchronously on every read — this is called **layout thrashing**.

```js
// ❌ Read → Write → Read → Write → thrashing
function resize_slow(elements) {
  for (const el of elements) {
    const width = el.offsetWidth; // READ  → browser recalculates layout
    el.style.width = width * 2 + 'px'; // WRITE → invalidates layout
    // Next iteration: READ forces recalculation again
  }
}

// ✅ All reads first, then all writes
function resize_fast(elements) {
  const widths = elements.map((el) => el.offsetWidth); // READ phase — one layout calculation
  elements.forEach((el, i) => {
    el.style.width = widths[i] * 2 + 'px'; // WRITE phase — no recalculation
  });
}
```

### DocumentFragment — Batch DOM Insertions

```js
// ❌ Inserting inside a loop — n reflows
function renderList_slow(items) {
  const ul = document.getElementById('list');
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item.name;
    ul.appendChild(li); // Triggers reflow each time
  }
}

// ✅ Build off-DOM, insert once — 1 reflow
function renderList_fast(items) {
  const ul = document.getElementById('list');
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item.name;
    fragment.appendChild(li); // No reflow, fragment is not in the DOM
  }
  ul.appendChild(fragment); // Single reflow here
}
```

### Event Delegation — One Listener Instead of Thousands

```js
// ❌ Attaching a listener to every item
function attachListeners_slow(items) {
  items.forEach((item) => {
    item.addEventListener('click', handleClick); // n listeners in memory
  });
}

// ✅ One listener on the parent — uses event bubbling
function attachListeners_fast(container) {
  container.addEventListener('click', (e) => {
    const item = e.target.closest('[data-item]');
    if (item) handleClick(item);
  }); // 1 listener, works for dynamic children too
}
```

### Visibility & Animation

```js
// ❌ Animating with setInterval and style changes — forces layout
setInterval(() => {
  el.style.left = parseInt(el.style.left) + 1 + 'px'; // Reads, then writes layout
}, 16);

// ✅ Use CSS transforms — runs on the compositor thread, no layout cost
el.style.transform = `translateX(${x}px)`;

// ✅ Use requestAnimationFrame for JS animations — synced to display refresh
function animate() {
  x += 1;
  el.style.transform = `translateX(${x}px)`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ✅ Use IntersectionObserver instead of scroll listeners for visibility checks
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) loadImage(entry.target);
  });
});
observer.observe(lazyImage);
```

---

## Bonus: Micro-Optimizations Worth Knowing

```js
// Cache array length in very tight loops (minor, engines often do this anyway)
for (let i = 0, len = arr.length; i < len; i++) { ... }

// Prefer for...of over forEach for early exits
for (const item of arr) {
  if (item.done) break; // Can't break out of forEach
}

// Use structuredClone() over JSON.parse(JSON.stringify()) for deep copies
const copy = structuredClone(obj); // Faster, handles more types

// Debounce expensive callbacks on frequent events
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
const onResize = debounce(() => recalculate(), 150);
window.addEventListener('resize', onResize);

// Throttle for rate-limiting (e.g., scroll handlers)
function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}
```

---

## Quick Reference

| Problem                         | Symptom               | Fix                                     |
| ------------------------------- | --------------------- | --------------------------------------- |
| O(n²) nested loops              | Freezes on large data | Replace inner loop with Map/Set         |
| Growing arrays                  | GC pauses             | Pre-allocate or use TypedArray          |
| DOM queries in loops            | Janky UI              | Cache references outside the loop       |
| Interleaved reads/writes to DOM | Layout thrashing      | Batch reads, then batch writes          |
| Thousands of event listeners    | High memory usage     | Use event delegation on parent          |
| Animating with left/top/width   | Dropped frames        | Use transform + requestAnimationFrame   |
| String concat in loops          | Slow string building  | Array push → join                       |
| Forgotten event listeners       | Memory leak over time | Always removeEventListener or AbortCtrl |
