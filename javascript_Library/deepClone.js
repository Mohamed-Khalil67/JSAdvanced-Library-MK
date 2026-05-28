function customDeepClone(original) {
  if (typeof original !== 'object' || original === null) return original; // edgae Cases , immediate return
  // Array Case
  if (Array.isArray(original)) {
    const resultArray = [];
    for (let i = 0; i < original.length; i++) {
      resultArray.push(customDeepClone(original[i]));
    }
    return resultArray;
  } else {
    // Object Case
    const resultObject = {};
    for (const key in original) {
      resultObject[key] = customDeepClone(original[key]); //
    }
    return resultObject;
  }
}

const original = {
  name: 'Ahmed',
  scores: [1, 2, 3],
  address: {
    city: 'Cairo',
    location: { lat: 30, lng: 31 },
  },
};

const copy = customDeepClone(original);
console.log(copy);
// copy.address.city = 'Alex';
// copy.scores.push(99);

// console.log(original.address.city); // 'Cairo' ← untouched
// console.log(original.scores); // [1,2,3] ← untouched

// console.log(customDeepClone(null)); // returns null
// console.log(customDeepClone(42)); // returns 42
// console.log(customDeepClone('hello')); // returns 'hello'

// Example of the call stack
// Call 1  → top level object
// Call 2  → 'Ahmed'          → return immediately
// Call 3  → [1,2,3]          → spawns calls 4,5,6
// Call 4  → 1                → return immediately
// Call 5  → 2                → return immediately
// Call 6  → 3                → return immediately
// Call 7  → address object   → spawns calls 8,9
// Call 8  → 'Cairo'          → return immediately
// Call 9  → location object  → spawns calls 10,11
// Call 10 → 30               → return immediately
// Call 11 → 31               → return immediately
