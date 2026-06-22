# DSA Study Notes

### Product Management Dashboard — Algorithmic Foundations

_A feature-by-feature breakdown of the data structures, complexity analysis, and trade-offs behind the required project features._

---

## How To Use These Notes

These notes follow the 10 required features of the dashboard in order. For each feature, you'll find: the relevant code, the core data-structures/algorithms (DSA) concept it tests, the correct reasoning, and — where it happened during the review session — a record of the misconception that came up first, and the correction that followed. The goal isn't just to remember the answers, but to be able to reconstruct the reasoning live if your instructor asks a follow-up.

> **🟡 KEY THEME:** Almost every question in this review reduces to one idea: Big-O describes how work scales with input size (n), not how fast something runs in absolute terms. Constants, nesting vs. sequencing, and read/write trade-offs all sit on top of that one foundation.

---

## Feature 1 — Add Product (with Validation)

### 1. Linear search inside validation: `customSome`

```js
function customSome(array = [], callback) {
  let i = 0;
  while (i < array.length) {
    if (callback(array[i], i, array)) return true; // early exit
    i++;
  }
  return false;
}
```

Used to check the chosen category exists in `CATEGORIES`. `customSome` short-circuits the moment it finds one true result — it does not need to check the rest of the array.

#### Some vs. Every — what actually differs

| Function      | Stops early when... | Worst case (no early exit) |
| ------------- | ------------------- | -------------------------- |
| `customSome`  | finds one **TRUE**  | checks all n items → O(n)  |
| `customEvery` | finds one **FALSE** | checks all n items → O(n)  |

> **🔴 CORRECTION LOGGED:** Initial answer was "some and every feel like the same thing." Correction: they short-circuit on opposite triggers (some = looking for a TRUE; every = looking for a FALSE), but in the worst case (no early exit possible) both are O(n) — same complexity class, opposite stopping condition.

### 2. Mutation vs. Immutability: `addProduct`

```js
function addProduct(formData) {
  const newProduct = {
    id: Utils.generateId(),
    createdAt: new Date().toISOString(),
    ...formData,
  };
  products = [...products, newProduct]; // NEW array, old one untouched
  persistProducts();
  renderProducts();
  updateStats();
}
```

| Operation                   | What it does                                        | Time Complexity |
| --------------------------- | --------------------------------------------------- | --------------- |
| `products.push(newProduct)` | Mutates existing array in place                     | O(1) amortized  |
| `[...products, newProduct]` | Allocates new array, copies all n old items + 1 new | O(n)            |

The codebase deliberately pays the slower O(n) cost to buy immutability — the old array reference stays untouched, so anything else holding a reference to it (e.g. a variable assigned before the call) is unaffected.

> **🔴 CORRECTION LOGGED:** Initial guess was that `push()` is "more expensive" than spread. Actually push is O(1) amortized (cheaper) — spread is the more expensive O(n) option. The trade-off is paying that extra cost for safety/predictability (no shared-reference bugs), not for raw speed.

#### Reference semantics — the snapshot test

If `snapshot = products` is assigned **BEFORE** `addProduct` runs, and `addProduct` does `products = [...products, newProduct]`, then `snapshot` still points at the **OLD** array object — it does not see the new product. This is because reassignment (`=`) points the variable at a new object; it does not change what other variables already point to. Contrast with `push()`, which mutates the original array object in place — any other variable still pointing at that same object **WOULD** see the change.

---

## Feature 2 — Edit Product

### Linear Search: `customFindIndex`

```js
function customFindIndex(array = [], callback) {
  let i = 0;
  while (i < array.length) {
    if (callback(array[i], i, array)) return i;
    i++;
  }
  return -1;
}
```

This is a textbook linear search, dressed up as a callback utility. Used to locate a product's position before overwriting it: `products[idx] = { ...products[idx], ...formData }`.

### Could this be O(log n) instead of O(n)?

Yes — IF the array were sorted by the search key, **binary search** could find the index in O(log n) by repeatedly halving the search space (look at the middle element, discard the half that can't contain the target, repeat). Each comparison eliminates half the remaining candidates, so after k comparisons only n / 2^k elements remain — solving for when that shrinks to 1 gives roughly log₂(n) steps.

### Why this app doesn't bother sorting for binary search

| Consideration                                 | Conclusion                                                                                                                                                                                                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Are `products.id` values sorted by insertion? | No — ids are `Date.now().toString(36) + random suffix`, compared as **STRINGS** (lexicographic), not numbers. Appending in creation order does not guarantee sorted order in the comparison sense.                                                         |
| Cost to keep array sorted after every add     | A full re-sort is O(n log n) per add — **WORSE** than the O(n) linear search it would replace.                                                                                                                                                             |
| Conclusion                                    | For this data size (tens–hundreds of items, occasional adds/edits/deletes via clicks), plain linear search is the right engineering trade-off. Binary search is asymptotically better in isolation, but not worth the cost of maintaining sortedness here. |

> **🔴 CORRECTION LOGGED:** Initial instinct was that sorting once, then binary-searching repeatedly, is automatically faster. Correction: you must account for the cost of CREATING and MAINTAINING that sorted order. Re-sorting on every single add (O(n log n) each time) is more expensive than just doing occasional O(n) linear scans. The "upfront cost vs. per-operation savings" trade-off only pays off if you read far more often than you write.

---

## Feature 3 — Delete Product (with Undo)

### `splice()` cost and Arrays vs. Linked Lists

```js
const [removed] = products.splice(idx, 1); // remove + return removed item
lastDeleted = { product: removed, index: idx };
```

Arrays store elements in contiguous memory. Removing an element at index `idx` forces every element **AFTER** `idx` to shift one slot to the left, to avoid leaving a gap.

| idx position                              | Elements that must shift  | Effective cost                             |
| ----------------------------------------- | ------------------------- | ------------------------------------------ |
| Near the **END** of the array             | Almost none               | Close to O(1)                              |
| Near the **START** of the array (idx = 0) | Nearly all n - 1 elements | Close to O(n) — this is the **WORST CASE** |

Big-O describes the worst case, so `splice(idx, 1)` is **O(n)** overall — insertion/removal at an arbitrary position in an array is O(n); only removal/insertion at the very END (push/pop) is O(1).

### Arrays vs. Linked Lists — the real trade-off

| Operation                       | Array                      | Linked List                                                             |
| ------------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| Access by index (`arr[i]`)      | O(1) — direct address math | O(n) — must traverse node by node from the head                         |
| Insert/remove in the **MIDDLE** | O(n) — must shift elements | O(1) — just rewire two pointers (once you have a reference to the node) |
| Insert/remove at the **END**    | O(1) (push/pop)            | Depends on implementation                                               |

Why arrays still make sense for the `products` array in this app: `sortBy` uses `Array.prototype.sort()`, which fundamentally relies on cheap, repeated random access to arbitrary positions during comparisons/partitioning. A linked list would turn every one of those O(1) accesses into an O(n) traversal, making the whole sort dramatically more expensive in practice. Meanwhile, nothing in this app needs frequent O(1) middle-insertion often enough (deletes/edits happen occasionally, via individual user clicks, on small n) to justify paying the linked-list random-access penalty everywhere else.

> **🔴 CORRECTION LOGGED:** First guesses for "a structure that avoids the shift-everything problem" were Map, then binary search — neither applies. A Map solves fast key lookup, not positional insert/remove. Binary search requires random access (which arrays have and linked lists lack) — it cannot run on a linked list at all, because there is no O(1) way to jump to the middle node.

---

## Feature 4 — Display Products in a Table

### Big-O vs. Constant Factors: DOM batching

```js
Utils.customEach(visible, (product) => {
  const row = `...`;
  els.tableBody.insertAdjacentHTML('beforeend', row); // called ONCE PER PRODUCT
});
```

Building each row's HTML requires visiting every product once — that part is O(n) no matter what. The real question is how many DOM mutations occur.

| Approach                                          | DOM mutations        | Big-O class |
| ------------------------------------------------- | -------------------- | ----------- |
| Current: `insertAdjacentHTML` inside the loop     | n separate mutations | O(n)        |
| Batched: build one string, insert once at the end | 1 mutation           | O(n)        |

> **🟢 KEY LESSON:** Both approaches are O(n) IN TERMS OF the number of products processed — Big-O strips out constant factors by design. But Big-O does not measure the real-world cost of an individual operation. A DOM mutation can trigger a browser reflow/repaint; n mutations risk n reflows vs. 1. That difference is invisible to Big-O notation but very real in wall-clock time.

General principle: early-exit / short-circuit behavior (some, every, find) does not change WORST-CASE Big-O — it only changes best/average-case real performance. Reducing DOM writes, debouncing, and caching are all "constant-factor" optimizations, not changes to the algorithm's complexity class.

---

## Feature 5 — Search by Title (case-insensitive)

```js
function normalizeText(str = '') {
  return str.trim().toLowerCase();
}
// usage:
Utils.normalizeText(p.title).includes(search);
```

### Multi-variable complexity

Let `n` = number of products, `k` = a title's length, `m` = the search term's length.

| Step                                              | Cost                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| One `title.includes(search)` call                 | O(k × m) — try each of k starting positions, compare up to m characters at each |
| Run that check on all n products (`customFilter`) | O(n × k × m) combined                                                           |

> **🔴 CORRECTION LOGGED:** Initial answer was O(n²). That would only apply if title-search cost itself scaled with n (e.g. comparing every product against every other product). Here, k and m are INDEPENDENT of n — they don't grow as the product list grows. The correct combined cost is O(n · k · m), which simplifies in practice (see below).

Why this gets casually called "O(n)" in conversation: `m` (search term length) and `k` (title length) are **bounded** — a user doesn't type a longer search query just because the catalog grew. When a variable does not scale with the input dimension being analyzed, Big-O treats it as a constant and drops it from the dominant term: O(n · k · m) with k, m bounded ⇒ **O(n)**.

---

## Feature 6 — Filter by Category

### Single-pass vs. multi-pass filtering

```js
let result = Utils.customFilter(products, (p) => {
  const matchesSearch = Utils.normalizeText(p.title).includes(search);
  const matchesCategory = category === 'All' || p.category === category;
  return matchesSearch && matchesCategory; // ONE pass checks BOTH conditions
});
```

Calling `customFilter` twice (once for search, then again on the result for category) would visit up to n elements in pass 1, then up to n more in pass 2 — about 2n total element-visits. Doing both checks inside ONE pass visits each element exactly once — n total. Both versions are still O(n) in Big-O terms (constants are dropped), but the single-pass version has a real, measurable 2x cheaper constant factor and avoids allocating an unnecessary intermediate array.

### Why the callback returns `matchesSearch && matchesCategory`

`customFilter`'s contract is: for each element, give me a true/false answer about whether it survives (`if (callback(...)) { keep it }`). `&&` requires **BOTH** operands to be true to produce true — exactly matching the requirement "keep this product only if it passes search AND category." Using `||` instead would incorrectly keep items that match only one condition.

### Eager booleans vs. inline short-circuiting

```js
// Current style (both lines always run, even if one already failed):
const matchesSearch = Utils.normalizeText(p.title).includes(search);
const matchesCategory = category === 'All' || p.category === category;
return matchesSearch && matchesCategory;

// Inline alternative (true short-circuit — skips the 2nd check if 1st is false):
return (
  Utils.normalizeText(p.title).includes(search) &&
  (category === 'All' || p.category === category)
);
```

The inline version technically does less work when the search fails early — `&&` stops evaluating its right side the instant the left side is false. But the saved work here is a single O(1) comparison, which is immeasurable at any realistic n. The named-variable version is preferred anyway because it is far easier to read and debug (you can log `matchesSearch` / `matchesCategory` independently). **Lesson:** don't sacrifice readability to micro-optimize something that's already O(1) per element.

---

## Feature 7 — Sort by Price and Date

### Comparator mechanics

```js
function sortBy(array = [], key, direction = 'asc') {
  const dir = direction === 'desc' ? -1 : 1;
  return [...array].sort((a, b) => {
    const av = a[key],
      bv = b[key];
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}
```

#### The universal `sort()` comparator rule (applies regardless of asc/desc)

| Return value | Tells `sort()`...                                           |
| ------------ | ----------------------------------------------------------- |
| Negative     | `a` should come **BEFORE** `b`                              |
| Positive     | `a` should come **AFTER** `b`                               |
| Zero         | `a` and `b` are equivalent — leave relative order unchanged |

> **🔴 CORRECTION LOGGED:** Initial mapping had "negative = desc, positive = asc" — backwards, and not how the rule actually works. The negative/positive rule is UNCONDITIONAL (always means "a before b" / "a after b"). The `dir` multiplier (+1 for asc, -1 for desc) is a separate layer that flips the SIGN of an already-computed comparison, reusing one comparator instead of writing two.

Worked trace: `direction='asc'` (dir=1), `av < bv` → returns `-1×1 = -1` (negative) → a comes before b → smaller value first → correct ascending order. `direction='desc'` (dir=-1), same condition `av < bv` → returns `-1×(-1) = +1` (positive) → a comes AFTER b → the larger value (b) ends up first → correct descending order.

### Sorting algorithm complexity

`[...array].sort(...)`: the spread itself is O(n) (copies n elements). The sort itself: **O(n log n) worst case** for any comparison-based algorithm (quicksort/mergesort/heapsort/Timsort — whatever the engine uses).

### Why O(n log n) is a hard floor for comparison sorts

Sorting n distinct elements means identifying ONE specific arrangement out of `n!` (n-factorial) possible orderings. Each comparison (`a < b?`) is a binary yes/no answer, and can at best cut the remaining possibilities roughly in half — the same halving idea as binary search, applied to the space of **ALL POSSIBLE ORDERINGS** instead of array positions. The number of halvings needed to go from `n!` possibilities down to 1 is `log₂(n!)`, which works out (via Stirling's approximation) to approximately `n log n`. This is a proven mathematical lower bound, not just "no one's found a faster way yet."

### Why O(n log n) is acceptable here even though O(n) is technically faster

For n = 100: O(n) ≈ 100 ops, O(n log n) ≈ 100 × log₂(100) ≈ 664 ops — about 6–7x more work, but both execute in an imperceptible fraction of a millisecond on a small product list. Big-O differences only become humanly/practically noticeable once n is large. For a catalog with millions of items, the gap becomes real and would justify intervention.

### If n were huge (e.g. 5,000,000 products) — what would actually help?

| Fix                                                     | Changes complexity class? | What it actually does                                                                       |
| ------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------- |
| Debounce the search input                               | No                        | Reduces HOW OFTEN the O(n log n)/O(n) work runs (e.g. wait 300ms after typing stops)        |
| Cache sorted result; only re-sort when sort key changes | No                        | Avoids redundant re-runs of the same O(n log n) work                                        |
| Pagination (browser-side)                               | No (browser side)         | Shrinks the n the BROWSER has to handle; the server still sorted the full set at least once |
| Database index (server-side)                            | Yes, potentially          | Moves sort cost to index build-time; lookups can beat O(n log n) per query                  |

> **🟢 KEY LESSON:** There is no comparison-based sorting algorithm that beats O(n log n) in the worst case — that's mathematically proven. "Switching to a faster sort" is not on the table. The real lever is reducing HOW OFTEN or on HOW MUCH DATA the unavoidable O(n log n) work runs — debouncing, caching, and pagination are constant-factor / frequency fixes, not Big-O improvements. Genuine complexity-class improvements (like a database index) require a different data structure or precomputed structure entirely.

---

## Feature 8 — Statistics Section

### Sequential traversals: `customReduce` × 2, `customFind` × 1

```js
const inventoryValue = Utils.customReduce(
  products,
  (sum, p) => sum + p.price * p.stock,
  0,
);
const maxPrice = Utils.customReduce(
  products,
  (max, p) => (p.price > max ? p.price : max),
  -Infinity,
);
const expensive = Utils.customFind(products, (p) => p.price === maxPrice);
```

Three independent O(n) passes run one after another (NOT nested inside each other).

> **🔴 CORRECTION LOGGED (round 1):** Initial answer was O(3n). This is not valid simplified Big-O notation — 3 is a constant multiplier, and Big-O drops constants by definition. O(3n) **IS** O(n); they are the same complexity class written two different ways.

> **🔴 CORRECTION LOGGED (round 2):** Second answer flipped to O(n²), reasoning "it is not nested." This is backwards — "not nested" is exactly WHY it is O(n), not O(n²). Nested loops MULTIPLY their costs (outer n × inner n = n²) because the inner loop's full cost repeats once per outer iteration. Sequential/independent loops ADD their costs (n + n + n = 3n), which simplifies to O(n) once the constant is dropped.

### The deciding test: does operation 2 force operation 1 to repeat n times?

| Pattern                                                                 | Structure                                                                                | Complexity                    |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------- |
| `updateStats()` (actual code)                                           | `customReduce`, then `customReduce`, then `customFind` — three separate sequential calls | O(n) + O(n) + O(n) = **O(n)** |
| Hypothetical: `customFind` called **INSIDE** a loop over all n products | Inner O(n) work repeats in full, once per outer iteration                                | O(n) × O(n) = **O(n²)**       |

> **🟢 RULE TO MEMORIZE:** Loops written one after another (siblings) → **ADD** their costs. Loops written one inside another (nested) → **MULTIPLY** their costs. This single structural distinction is one of the most common things interviewers test when they ask "what's the time complexity of this code?"

---

## Feature 9 — Empty State

```js
const visible = getVisibleProducts();
els.emptyState.classList.toggle('d-none', visible.length > 0);
```

`classList.toggle(className, force)` with a second argument is a **FORCED set**, not a true flip: `force = true` → class is **ADDED** (guaranteed present). `force = false` → class is **REMOVED** (guaranteed absent).

| `visible.length` | `visible.length > 0` | toggle behavior        | Visual result                           |
| ---------------- | -------------------- | ---------------------- | --------------------------------------- |
| 0                | false                | `'d-none'` **REMOVED** | Empty-state message becomes **VISIBLE** |
| > 0              | true                 | `'d-none'` **ADDED**   | Empty-state message **HIDDEN**          |

> **🔴 CORRECTION LOGGED:** Initial answer reversed which case shows the message. Removing a 'display:none'-style class means the element becomes visible, not hidden — this is easy to get backwards if read too quickly.

### The data-flow trap: "No Products Found" is ambiguous

`getVisibleProducts()` filters `products` and returns only the matches — it has no awareness of how many TOTAL products exist in storage. If `products` has 50 items but the search term matches zero of them, `customFilter` still has to loop all 50 times (you cannot know nothing matches without checking), and `visible` ends up `[]`. The SAME message ("No Products Found") then displays whether (a) the user has never added anything, or (b) the user has 50 products and the search/filter just doesn't match any of them.

From a UX standpoint these are different situations — (a) implies the user should add data, (b) implies the user should adjust their search/filter (nothing is wrong or lost). A more thoughtful implementation would check `products.length === 0` vs. `visible.length === 0` separately and show a different message for each case. This is a UX/software-design critique, not a DSA one, but it's exactly the kind of "what would you improve" question instructors ask.

---

## Feature 10 — Persistence via localStorage

```js
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadFromStorage(key, fallback = null) {
  const raw = localStorage.getItem(key);
  return raw === null ? fallback : JSON.parse(raw);
}
```

### `JSON.stringify(products)` on its own: O(n)

Each product object has a fixed, constant number of fields (id, title, price, category, stock, createdAt) regardless of n, so per-object work is O(1). n objects × O(1) each = **O(n)** total, AS LONG AS the objects are flat (not nested with structures that themselves grow with n).

### The hidden cost: `persistProducts()` runs after EVERY add

```js
function addProduct(formData) {
  products = [...products, newProduct];
  persistProducts(); // re-serializes the WHOLE array, every single time
}
```

Adding 100 products one at a time means: add #1 → stringify 1 item; add #2 → stringify 2 items (re-serializing #1 again, unchanged); ... add #100 → stringify all 100 items.

> **🔴 CORRECTION LOGGED:** Initial answer treated this as O(n) total ("just 100 loops"). The actual total is the SUM of a growing sequence: `1 + 2 + 3 + ... + 100 = n(n+1)/2` (the classic sum-of-first-n-integers formula) = 5050 for n=100, not 100. Expanding `n(n+1)/2 = (n² + n)/2` — the n² term dominates as n grows, so the cumulative cost is **O(n²)**, not O(n).

This is structurally identical to a nested loop, even though no for-loop is literally written inside another in the source code: calling an O(n)-ish operation repeatedly, where the n itself grows by 1 each call, produces the same n² blow-up as true nesting — the "nesting" is just spread across separate function calls over time instead of visible in one code block.

### Why a "smarter single-pass method" does not fix this

The bottleneck isn't loop efficiency — `JSON.stringify` is already a clean O(n) pass per call. The problem is being called repeatedly with no memory of previous calls, re-touching data that hasn't changed. The fix has to target FREQUENCY or SCOPE of the work, not the loop itself.

### Real strategies

| Strategy                                       | Write cost (100 sequential adds)                  | Read cost (one load)                                              |
| ---------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| Current: one array, one key                    | O(n²) total (repeated full re-serialization)      | O(1) storage calls; O(n) to parse the bundle                      |
| Debounce saves (wait ~500ms after last change) | Fewer total re-serializations; same O(n) per save | Unchanged                                                         |
| One localStorage key PER product               | O(n) total — each add only serializes itself      | O(n) storage calls — one getItem per product to rebuild the array |

> **🟢 KEY LESSON:** This is the SAME read-vs-write trade-off seen earlier with sorted arrays + binary search: optimizing writes (per-product keys) costs you on reads (many getItem calls instead of one); optimizing reads (one big bundled key) costs you on writes (full re-serialization every time). For this dashboard's realistic scale (a handful of adds per session, far fewer loads than adds), the current approach is a reasonable trade-off even though it's technically O(n²) in the worst case across many sequential adds.

---

## Appendix — JSON.stringify vs. toString() Coercion

### Why JSON.stringify exists at all

`localStorage` can only store **STRINGS** — not arrays, objects, numbers, or booleans, by spec. If you pass a non-string value directly to `localStorage.setItem`, JavaScript force-coerces it using the value's own `.toString()` method — NOT a smart, lossless conversion.

```js
localStorage.setItem('test', products); // products = array of objects
// internally coerces to: "[object Object],[object Object],..."
// ALL real data (titles, prices) is LOST
```

> **🔴 CORRECTION LOGGED:** Initial framing was that stringify/parse exist for "easier manipulation." The real reason is narrower and more mechanical: they exist purely because localStorage (and similarly, network requests, files) can only hold strings, so JS data has to be translated INTO a string to be stored, and back OUT of a string to be used again. The round-trip (must re-parse every time you load, just to use `.length` or `.price` again) only makes sense under that framing.

### `Array.prototype.toString()` vs. `Object.prototype.toString()`

`Array.prototype.toString()` calls `.join(',')` internally — it tries to convert EACH element to a string, then glues them with commas. This works fine for primitives, but breaks down for elements that are themselves plain objects, because those objects fall back to the generic `Object.prototype.toString()`, which **ALWAYS** returns the literal string `"[object Object]"` — it never inspects the object's actual keys/values.

```js
String([1, 2, 3]); // "1,2,3"
String(['a', 'b', 'c']); // "a,b,c"
String([1, [2, 3], 4]); // "1,2,3,4"  (nested arrays flatten via join)
String([]); // ""
String([null, undefined, 1]); // ",,1"   <- null/undefined become EMPTY strings in join, not "null"/"undefined"
String([{ a: 1 }, { b: 2 }]); // "[object Object],[object Object]"

String({ a: 1 }); // "[object Object]"
String({}); // "[object Object]"  (even empty objects)
String({
  toString() {
    return 'x';
  },
}); // "x"  (custom toString overrides the default)
String(new Date()); // "Mon Jun 22 2026 ..."  (Date overrides toString with something useful)
```

The cascade for `String(productsArray)` where products is an array of plain objects: (1) the array's own `.toString()` runs first and tries to `.join(',')` its elements; (2) each **ELEMENT** is a plain object with no custom `.toString()`; (3) each one individually falls back to the broken default and becomes `"[object Object]"`; (4) those get glued together with commas. The array handled its own part fine — the failure happens one level deeper, inside the objects it contains.

> **🟢 KEY LESSON:** `JSON.stringify` does NOT rely on `.toString()` at all. It has its own purpose-built algorithm that walks through every key/value pair of every object directly (recursively, for nested structures) and emits proper JSON syntax — quoted keys, quoted string values, bare numbers. That's precisely why it succeeds where `.toString()` coercion fails: it **INSPECTS** the object's real data instead of **ASKING** the object to describe itself.

### Reading JSON.stringify output correctly

```js
const products = [{ id: 'a1', title: 'Mouse', price: 20, stock: 5 }];
JSON.stringify(products);
// -> [{"id":"a1","title":"Mouse","price":20,"stock":5}]
// - keys are ALWAYS double-quoted, even though they were bare identifiers in JS source
// - string VALUES are double-quoted ("a1", "Mouse")
// - number VALUES are left bare (20, 5)
// - no spaces, unless a 3rd "indent" argument is passed: JSON.stringify(products, null, 2)
```

### Values JSON cannot represent

| Input                            | `JSON.stringify(...)` result                     | Why                                                                          |
| -------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| `Infinity` / `-Infinity` / `NaN` | `"null"`                                         | Not valid JSON value types — silently substituted with null, no error thrown |
| `undefined` (top-level)          | `undefined` (the function's return value itself) | JSON has no concept of 'undefined'                                           |
| a function                       | `undefined`                                      | Functions are not data — cannot be serialized                                |
| a Symbol                         | `undefined`                                      | Symbols are not data — cannot be serialized                                  |

> **🔴 CORRECTION LOGGED:** Guess for `JSON.stringify(-Infinity)` was the string `"-Infinity"`. The actual output is the string `"null"` — JSON's spec has no representation for Infinity/NaN, so JS silently substitutes null rather than throwing an error or preserving the value as text.

Practical relevance to this codebase: `customReduce` in `updateStats()` uses `-Infinity` only as a TEMPORARY accumulator seed while computing `maxPrice`. That intermediate value is immediately replaced product-by-product during the reduce and never persisted — only the final, real product data ever reaches `persistProducts()` / `JSON.stringify`, so this edge case never actually surfaces as a bug here. It's still important to know about, because reaching for `-Infinity`/`Infinity` as a sentinel value elsewhere, then accidentally persisting it, is a real, easy-to-miss bug class.

### Debugging note: that 'undefined' at the bottom of the console

When running a multi-statement block directly in DevTools (e.g. `const result = JSON.stringify(products); console.log(result);`), the console may show `undefined` AFTER the printed JSON string. This is unrelated to `JSON.stringify` — it is simply the return value of `console.log()` ITSELF, which always returns `undefined` as a side-effect function. DevTools reports the return value of the LAST statement executed in the block, and that statement was `console.log(...)`, not the stringify call.

---

## Session Summary — Feature → Core Concept Map

| #   | Feature                  | Core DSA / CS Concept Tested                                                       |
| --- | ------------------------ | ---------------------------------------------------------------------------------- |
| 1   | Add Product + Validation | Short-circuiting (some/every), mutation vs. immutability, reference semantics      |
| 2   | Edit Product             | Linear search, binary search trade-offs, cost of maintaining sortedness            |
| 3   | Delete Product           | Array shift cost (splice), arrays vs. linked lists                                 |
| 4   | Display Table            | Big-O vs. constant factors, DOM batching / reflow cost                             |
| 5   | Search by Title          | Multi-variable complexity, bounded constants vs. true variables                    |
| 6   | Filter by Category       | Single-pass vs. multi-pass traversal, && short-circuit semantics                   |
| 7   | Sort by Price/Date       | Comparator return-value rules, n log n lower bound, frequency vs. complexity fixes |
| 8   | Statistics Section       | Sequential (additive) vs. nested (multiplicative) complexity                       |
| 9   | Empty State              | Data-flow tracing, UX edge-case differentiation                                    |
| 10  | localStorage Persistence | Amortized cost of repeated full re-serialization, read/write trade-offs            |

> **🟡 THE ONE IDEA TO HOLD ONTO:** Big-O measures how work GROWS relative to input size — it deliberately ignores constant factors and the real-world cost of individual operations. Almost every "correction" in this session came from either (a) forgetting that constants get dropped (O(3n) = O(n)), (b) confusing sequential work (adds) with nested work (multiplies), or (c) mixing up which operation actually triggers a cost (e.g. `.toString()` coercion vs. `JSON.stringify`'s own algorithm). Re-deriving these from first principles — rather than memorizing the answer — is what will hold up under instructor follow-up questions.
