// Anagram

// name ... mean

// not so good approach - n log n

function isAnagram(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }
  return str1.split("").sort().join("") === str2.split("").sort().join("");
}

// optimized approach - n

function isAnagram(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }
  const charCount = {};
  for (let char of str1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  for (let char of str2) {
    if (!charCount[char]) {
      // if char is not in charCount or charCount[char] is 0, then it's not an anagram
      return false;
    }
    charCount[char]--;
  }
  return true;
}

// optiimized approach with O(1) - using an array of size 26 to count the frequency of characters (assuming only lowercase letters)

function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const freq = new Array(26).fill(0);

  for (let char of s) {
    // charCodeAt(0) - 97 gives us the index of the character in the freq array a = 97, b = 98, c = 99, ... z = 122 => 0, 1, 2, ... 25
    // freq[0] will count the frequency of 'a', freq[1] will count the frequency of 'b', and so on
    freq[char.charCodeAt(0) - 97]++;
  }

  // we get the index of the character in the freq array and check if the frequency is 0, if it is 0, then it's not an anagram, otherwise we decrement the frequency
  // for m in mean, we will decrement the frequency of m, e, a, n in the freq array, if any of them becomes 0, then it's not an anagram
  for (let char of t) {
    const index = char.charCodeAt(0) - 97;
    if (freq[index] === 0) return false;
    freq[index]--;
  }

  return true;
}

// optimized approach with O(1) - using an array of size 26 to count the frequency of characters (assuming only lowercase letters)
// - combined loop - one-loop solution (increment + decrement together)

function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const freq = new Array(26).fill(0);
  // we used normal loop instead of for of loop because we need the index to access the characters in s and t at the same time
  // for of loop is not suitable for this case because we need to access the characters in s and t at the same time, and for of loop does not give us the index,
  // it gives us the character directly
  // walkthrough - for s = "anagram" and t = "nagaram", we will loop through both strings at the same time,
  // and for each character in s, we will increment the frequency in the freq array, and for each character in t,
  // we will decrement the frequency in the freq array, if at any point the frequency becomes negative,
  // then it's not an anagram, otherwise we will continue until the end of the loop, if we reach the end of the loop and all frequencies are 0,
  // then it's an anagram
  // for the first iteration, we will increment the frequency of 'a' in the freq array and decrement the frequency of 'n' in the freq array, for the second iteration,
  // we will increment the frequency of 'n' in the freq array and decrement the frequency of 'a' in the freq array, and so on...
  // the array in the first iteration will be [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // here at the first iteration, the frequency of 'n' is -1 and that is normal because we have not seen 'n' in s yet, but we have seen 'n' in t,
  // so we will continue to the next iteration, and in the second iteration, we will find that the frequency of 'n' is 0,
  // and that is also normal because we have seen 'n' in s and t, and so on... and frequency of 'a' will be 0 again in the second iteration, and so on...
  // until we reach the end of the loop, and all frequencies will be 0, which means it's an anagram
  // so we can conclude that the time complexity of this solution is O(n) and the space complexity is O(1) because we are using a fixed size array of 26 to
  // count the frequency of characters, we decide if's it anagarm at the end of the loop, we don't need to check if any frequency is
  // negative during the loop because we will check it at the end of the loop, if any frequency is not 0, then it's not an anagram
  for (let i = 0; i < s.length; i++) {
    freq[s.charCodeAt(i) - 97]++; // add from s
    freq[t.charCodeAt(i) - 97]--; // subtract from t
  }

  // check if all zeros
  for (let count of freq) {
    if (count !== 0) return false;
  }

  return true;
}

// ----------

// Another problem

// we have target = 9 and array [2, 3, 5, 7], we want to find if there are two numbers in the array that add up to the target

// brute force approach - n^2

function hasPairWithSum(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        return true;
      }
    }
  }
  return false;
}

// optimized approach - n

function hasPairWithSum(arr, target) {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const diff = target - arr[i];
    // 7, here we can loop on the array and check if 7 is found in the array, but that will be n^2, instead we can use a map to store the numbers
    // we have seen so far, and check if 7 is in the map, if it is, then we have found a pair that adds up to the target,
    // otherwise we will add the current number to the map and continue to the next iteration

    // if it's found in the map, that means we have seen the number before, and we have found a pair that adds up to the target, so we can return true

    if (map[diff] !== undefined) {
      return map[diff];
    }
    map[arr[i]] = i;
  }
  return false;
}

// nums = [2, 3, 5, 7]
// target = 9

// i = 0
// num = 2
// diff = 9 - 2 = 7

// map[7] === undefined
// => 7 not found yet

// store current number
// map[2] = 0

// map = {
//   2: 0
// }

// i = 1
// num = 3
// diff = 9 - 3 = 6

// map[6] === undefined
// => 6 not found yet

// store current number
// map[3] = 1

// map = {
//   2: 0,
//   3: 1
// }

// i = 2
// num = 5
// diff = 9 - 5 = 4

// map[4] === undefined
// => 4 not found yet

// store current number
// map[5] = 2

// map = {
//   2: 0,
//   3: 1,
//   5: 2
// }

// i = 3
// num = 7
// diff = 9 - 7 = 2

// map[2] !== undefined
// => FOUND previous number!

// map[2] = 0
// current index = 3

// nums[0] + nums[3]
// 2 + 7 = 9 ✅

// answer = [0, 3]
