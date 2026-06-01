# deepClone — full iteration notes

## The function

```javascript
function customDeepClone(original) {
  // case 1: primitive — base case, return immediately
  if (typeof original !== 'object' || original === null) return original;

  // case 2: array
  if (Array.isArray(original)) {
    const resultArray = [];
    for (let i = 0; i < original.length; i++) {
      resultArray.push(customDeepClone(original[i]));
    }
    return resultArray;
  }

  // case 3: object
  const resultObject = {};
  for (const key in original) {
    resultObject[key] = customDeepClone(original[key]);
  }
  return resultObject;
}
```

---

## Input used for tracing

```javascript
const original = {
  name: 'Ahmed',
  scores: [1, 2, 3],
  address: {
    city: 'Cairo',
    location: { lat: 30, lng: 31 },
  },
};
```

---

## Mental model — two directions

```
loop      → moves LEFT to RIGHT across keys at one level  (width)
recursion → drops DOWN into each value                    (depth)
```

---

## Call 1 — top level object

```
customDeepClone({ name, scores, address })
  typeof {} === 'object'  → not primitive, continue
  Array.isArray({})       → false → go to object case
  resultObject = {}
  for...in starts → keys: 'name', 'scores', 'address'
```

---

## Call 1 — key 'name'

```
key   = 'name'
value = 'Ahmed'

resultObject['name'] = customDeepClone('Ahmed')   ← spawns Call 2
│
└── Call 2: customDeepClone('Ahmed')
      typeof 'Ahmed' !== 'object' → PRIMITIVE → return 'Ahmed'
      ↑ back to Call 1

resultObject['name'] = 'Ahmed'  ✓
for...in moves to next key automatically
```

---

## Call 1 — key 'scores'

```
key   = 'scores'
value = [1, 2, 3]

resultObject['scores'] = customDeepClone([1,2,3])  ← spawns Call 3
│
└── Call 3: customDeepClone([1, 2, 3])
      typeof [] === 'object'  → not primitive
      Array.isArray([])       → true → ARRAY CASE
      resultArray = []
      loop starts:
      │
      ├── i=0: customDeepClone(1)   ← Call 4
      │     typeof 1 !== 'object'   → PRIMITIVE → return 1
      │     resultArray.push(1)     → resultArray = [1]
      │
      ├── i=1: customDeepClone(2)   ← Call 5
      │     typeof 2 !== 'object'   → PRIMITIVE → return 2
      │     resultArray.push(2)     → resultArray = [1, 2]
      │
      └── i=2: customDeepClone(3)   ← Call 6
            typeof 3 !== 'object'   → PRIMITIVE → return 3
            resultArray.push(3)     → resultArray = [1, 2, 3]
      │
      loop ends
      return [1, 2, 3]   ← brand new array, back to Call 1

resultObject['scores'] = [1, 2, 3]  ✓  (independent copy)
for...in moves to next key automatically
```

---

## Call 1 — key 'address'

```
key   = 'address'
value = { city: 'Cairo', location: { lat: 30, lng: 31 } }

resultObject['address'] = customDeepClone({ city, location })  ← spawns Call 7
│
└── Call 7: customDeepClone({ city: 'Cairo', location: {...} })
      typeof {} === 'object'  → not primitive
      Array.isArray({})       → false → OBJECT CASE
      resultObject = {}
      for...in starts → keys: 'city', 'location'
      │
      ├── key = 'city'
      │   customDeepClone('Cairo')   ← Call 8
      │     typeof 'Cairo' !== 'object' → PRIMITIVE → return 'Cairo'
      │   resultObject['city'] = 'Cairo'  ✓
      │
      └── key = 'location'
          customDeepClone({ lat:30, lng:31 })  ← Call 9
          │
          └── Call 9: customDeepClone({ lat: 30, lng: 31 })
                typeof {} === 'object'  → not primitive
                Array.isArray({})       → false → OBJECT CASE
                resultObject = {}
                for...in starts → keys: 'lat', 'lng'
                │
                ├── key = 'lat'
                │   customDeepClone(30)   ← Call 10
                │     typeof 30 !== 'object' → PRIMITIVE → return 30
                │   resultObject['lat'] = 30  ✓
                │
                └── key = 'lng'
                    customDeepClone(31)   ← Call 11
                      typeof 31 !== 'object' → PRIMITIVE → return 31
                    resultObject['lng'] = 31  ✓
                │
                loop ends
                return { lat: 30, lng: 31 }   ← back to Call 7
          │
          resultObject['location'] = { lat: 30, lng: 31 }  ✓
      │
      loop ends
      return { city: 'Cairo', location: { lat:30, lng:31 } }  ← back to Call 1

resultObject['address'] = { city: 'Cairo', location: { lat:30, lng:31 } }  ✓
for...in ends — no more keys
```

---

## Call 1 — loop ends, return final result

```javascript
{
  name: 'Ahmed',                                   // primitive, copied directly
  scores: [1, 2, 3],                               // brand new array (Call 3)
  address: {                                        // brand new object (Call 7)
    city: 'Cairo',                                  // primitive, copied directly
    location: { lat: 30, lng: 31 }                 // brand new object (Call 9)
  }
}
```

---

## Full call stack summary

```
Call 1  → { name, scores, address }   object case  → spawns Calls 2, 3, 7
Call 2  → 'Ahmed'                     PRIMITIVE     → return immediately
Call 3  → [1, 2, 3]                   array case    → spawns Calls 4, 5, 6
Call 4  → 1                           PRIMITIVE     → return immediately
Call 5  → 2                           PRIMITIVE     → return immediately
Call 6  → 3                           PRIMITIVE     → return immediately
Call 7  → { city, location }          object case   → spawns Calls 8, 9
Call 8  → 'Cairo'                     PRIMITIVE     → return immediately
Call 9  → { lat, lng }                object case   → spawns Calls 10, 11
Call 10 → 30                          PRIMITIVE     → return immediately
Call 11 → 31                          PRIMITIVE     → return immediately
```

**11 total calls** — primitives return instantly, objects/arrays spawn new calls.

---

## Memory — original vs clone

```
original                         clone
────────                         ─────
name   → 'Ahmed'                 name   → 'Ahmed'       (same value, different slot)
scores → [1,2,3]  ✗ shared      scores → [1,2,3]  ✓   (different array in memory)
address → {        ✗ shared      address → {        ✓   (different object in memory)
  city → 'Cairo'                   city → 'Cairo'
  location → {     ✗ shared        location → {     ✓   (different object in memory)
    lat: 30                          lat: 30
    lng: 31                          lng: 31
  }                                }
}                                }
```

No shared references — every nested value is fully independent.

---

## Proof — original is untouched

```javascript
const copy = customDeepClone(original);

copy.address.city = 'Alex'; // change the clone
copy.scores.push(99); // change the clone

console.log(original.address.city); // 'Cairo'  ← untouched ✓
console.log(original.scores); // [1,2,3]  ← untouched ✓
```

---

## The three rules of recursion

| Rule                         | What it means                                         |
| ---------------------------- | ----------------------------------------------------- |
| Always write base case first | Stop condition before recursive call                  |
| Input must shrink each call  | Primitive → smaller, object → its values              |
| Return from every branch     | Array case returns, object case returns, base returns |

## customDeepClone — Full Call Trace

### Input

```javascript
customDeepClone({
  name: 'Ahmed',
  scores: [1, 2, 3],
  address: { city: 'Cairo' },
});
```

### Call 1 — top level object

```javascript
customDeepClone({ name:'Ahmed', scores:[1,2,3], address:{city:'Cairo'} })

typeof {} === 'object' && not null → not primitive, continue
Array.isArray({}) → false → object case
resultObject = {}
for...in starts
```

### Call 1 — key 'name' → spawns Call 2

```javascript
// loop is at key 'name', value is 'Ahmed'
resultObject['name'] = customDeepClone('Ahmed')

  Call 2: customDeepClone('Ahmed')
    typeof 'Ahmed' !== 'object' → PRIMITIVE
    return 'Ahmed' → lands back here ↓

resultObject['name'] = 'Ahmed' // loop moves to next key
```

### Call 1 — key 'scores' → spawns Call 3

```javascript
// loop is at key 'scores', value is [1,2,3]
resultObject['scores'] = customDeepClone([1,2,3])

  Call 3: customDeepClone([1,2,3])
    typeof [] === 'object' → not primitive
    Array.isArray([]) → true → array case
    resultArray = []

    // i=0, value is 1
    resultArray.push(customDeepClone(1))
      Call 4: customDeepClone(1)
        typeof 1 !== 'object' → PRIMITIVE
        return 1 → lands back here ↓
    resultArray.push(1) → resultArray = [1]

    // i=1, value is 2
    resultArray.push(customDeepClone(2))
      Call 5: customDeepClone(2)
        typeof 2 !== 'object' → PRIMITIVE
        return 2 → lands back here ↓
    resultArray.push(2) → resultArray = [1,2]

    // i=2, value is 3
    resultArray.push(customDeepClone(3))
      Call 6: customDeepClone(3)
        typeof 3 !== 'object' → PRIMITIVE
        return 3 → lands back here ↓
    resultArray.push(3) → resultArray = [1,2,3]

    loop ends
    return [1,2,3] → lands back here ↓

resultObject['scores'] = [1,2,3] // loop moves to next key
```

### Call 1 — key 'address' → spawns Call 7

```javascript
// loop is at key 'address', value is { city:'Cairo' }
resultObject['address'] = customDeepClone({ city:'Cairo' })

  Call 7: customDeepClone({ city:'Cairo' })
    typeof {} === 'object' → not primitive
    Array.isArray({}) → false → object case
    resultObject = {}

    // key is 'city', value is 'Cairo'
    resultObject['city'] = customDeepClone('Cairo')
      Call 8: customDeepClone('Cairo')
        typeof 'Cairo' !== 'object' → PRIMITIVE
        return 'Cairo' → lands back here ↓
    resultObject['city'] = 'Cairo'

    loop ends
    return { city:'Cairo' } → lands back here ↓

resultObject['address'] = { city:'Cairo' } // loop ends, no more keys
```

### Call 1 — loop ends, return final result

```javascript
return {
  name: 'Ahmed', // came from Call 2
  scores: [1, 2, 3], // came from Call 3
  address: { city: 'Cairo' }, // came from Call 7
};
```

### How primitive return works — the exact mechanism

```javascript
// inside Call 1's loop:
resultObject[key] = customDeepClone(original[key]);
//                  ↑ JavaScript waits for this to return
//                  ↑ whatever returns gets assigned here

// Call 2 runs and returns 'Ahmed'
// → exits Call 2 only, Call 1's loop is still running
// → 'Ahmed' lands in resultObject['name']
// → loop moves to next key
```

### Call stack summary
