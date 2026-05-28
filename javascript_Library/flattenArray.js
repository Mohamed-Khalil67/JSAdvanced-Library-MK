function customFlattenArray(nestedArray) {
  // transform nest Arrays in non nested array
  if (!Array.isArray(nestedArray)) {
    throw new TypeError('Argument must be an array');
  }
  let result = [];
  for (let i = 0; i < nestedArray.length; i++) {
    if (Array.isArray(nestedArray[i])) {
      result.push(...customFlattenArray(nestedArray[i]));
      // spreading the result of an array , i=1: result.push(...[2, 3])  → result = [1, 2, 3] |||| instead of i=1: result[1] = [2, 3]  → result = [1, [2, 3]]
    } else {
      result.push(nestedArray[i]); // primitive return when found, with an index of always 0
    }
  }
  return result;
}

const result1 = customFlattenArray([1, [2, [3, [4, [5]]]]]);
console.log(result1); // [1, 2, 3, 4, 5]

const result2 = customFlattenArray([1, [2, 3], [4, [5, 6]]]);
console.log(result2); // [1, 2, 3, 4, 5, 6]

const result3 = customFlattenArray([]);
console.log(result3); // []

const result4 = customFlattenArray([1, 2, 3]);
console.log(result4); // [1, 2, 3]

try {
  customFlattenArray(null); // throws
} catch (e) {
  console.log(e.message); // logs the error message
}
