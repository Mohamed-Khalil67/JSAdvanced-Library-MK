export function linearSearch(array, target) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return i;
    }
  }
  return -1;
}

export function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;

  if (!nums.length) {
    return -1;
  }

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (target === nums[mid]) {
      return mid;
    }
    if (target < nums[mid]) {
      high = mid - 1;
    }
    if (target > nums[mid]) {
      low = mid + 1;
    }
  }
  return -1;
}
