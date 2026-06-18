/* ============================================================
   utils.js — JavaScript Utility Package
   ------------------------------------------------------------
   Reused from Task 1 (javascript_Library_ass) and extended with
   the helpers required by Task 2:

     • String:      capitalize, normalizeText, slugify
     • Validation:  isRequired, isPositiveNumber, isNonNegativeInteger
     • Storage:     saveToStorage, loadFromStorage
     • Date:        formatDate
     • Array:       sortBy, generateId, groupBy
     • Number:      formatCurrency, parseNumber

   Exposed on `window.Utils` so script.js can read them as
   `Utils.formatCurrency(...)`, etc.
   ============================================================ */

(function (global) {
  'use strict';

  /* ---------- String Utilities ---------- */

  function capitalize(str = '') {
    if (typeof str !== 'string' || str.length === 0) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function normalizeText(str = '') {
    if (typeof str !== 'string') return '';
    return str.trim().toLowerCase();
  }

  function slugify(str = '') {
    return String(str)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /* ---------- Validation Utilities ---------- */

  function isRequired(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  }

  function isPositiveNumber(value) {
    const n = Number(value);
    return !Number.isNaN(n) && n > 0;
  }

  function isNonNegativeInteger(value) {
    const n = Number(value);
    return Number.isInteger(n) && n >= 0;
  }

  /* ---------- Storage Utilities ---------- */

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('saveToStorage failed:', err);
      return false;
    }
  }

  function loadFromStorage(key, fallback = null) {
    // fallback is for error throwing value
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.error('loadFromStorage failed:', err);
      return fallback;
    }
  }

  /* ---------- Date Utilities ---------- */

  function formatDate(input) {
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return '—';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /* ---------- Array Utilities ---------- */

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // sortBy(arr, "price", "asc") — returns a NEW sorted array
  function sortBy(array = [], key, direction = 'asc') {
    const dir = direction === 'desc' ? -1 : 1;
    return [...array].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }

  // groupBy reused from Task 1 (customGroupBy)
  function groupBy(arr = [], key) {
    const result = {};
    for (const item of arr) {
      const k = item[key];
      (result[k] ??= []).push(item);
    }
    return result;
  }

  /* ---------- Number Utilities ---------- */

  function formatCurrency(value, currency = 'USD', locale = 'en-US') {
    const n = Number(value);
    if (Number.isNaN(n)) return '—';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(n);
  }

  function parseNumber(value) {
    if (typeof value === 'number') return value;
    const n = parseFloat(String(value).replace(/[^\d.\-]/g, ''));
    return Number.isNaN(n) ? 0 : n;
  }

  /* ============================================================
     Custom array/function utilities (from javascript_Library_ass)
     Authored implementations from Task 1 — exposed here so script.js
     can use them via Utils.customMap, Utils.customFilter, etc.
     ============================================================ */

  // 00 — forEach
  function customEach(array = [], callback) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('Second argument must be a function');
    }
    let i = 0;
    while (i < array.length) {
      callback(array[i], i, array);
      i++;
    }
  }

  // 01 — map
  function customMap(array = [], callback) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('Second argument must be a function');
    }
    const array2 = [];
    let i = 0;
    while (i < array.length) {
      array2[i] = callback(array[i], i, array);
      i++;
    }
    return array2;
  }

  // 02 — filter
  function customFilter(array = [], callback) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('Second argument must be a function');
    }
    const array2 = [];
    const len = array.length;
    let i = 0;
    while (i < len) {
      const element = array[i];
      if (callback(element, i, array)) {
        array2.push(element);
      }
      i++;
    }
    return array2;
  }

  // 03 — reduce
  function customReduce(array = [], callback, initialValue) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('Second argument must be a function');
    }
    let accumulator;
    let i;
    if (initialValue !== undefined) {
      accumulator = initialValue;
      i = 0;
    } else {
      accumulator = array[0];
      i = 1;
    }
    while (i < array.length) {
      accumulator = callback(accumulator, array[i], i, array);
      i++;
    }
    return accumulator;
  }

  // 04 — groupBy (array of objects, by key string)
  function customGroupBy(arrayObject = [], keyObject) {
    if (Object.prototype.toString.call(arrayObject) !== '[object Array]') {
      throw new TypeError('First argument must be an array Object');
    }
    if (typeof keyObject !== 'string') {
      throw new TypeError('Second argument must be a string');
    }
    const resultObject = {};
    const len = arrayObject.length;
    for (let i = 0; i < len; i++) {
      const item = arrayObject[i];
      const keyValue = item[keyObject];
      if (!resultObject[keyValue]) {
        resultObject[keyValue] = [];
      }
      resultObject[keyValue].push(item);
    }
    return resultObject;
  }

  // 05 — deepClone
  function customDeepClone(original) {
    if (typeof original !== 'object' || original === null) return original;
    if (Array.isArray(original)) {
      const resultArray = [];
      for (let i = 0; i < original.length; i++) {
        resultArray.push(customDeepClone(original[i]));
      }
      return resultArray;
    } else {
      const resultObject = {};
      for (const key in original) {
        resultObject[key] = customDeepClone(original[key]);
      }
      return resultObject;
    }
  }

  // 06 — once
  function customOnce(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Argument must be a function');
    }
    let result;
    return function (...args) {
      if (callback) {
        result = callback(...args);
        callback = null;
      }
      return result;
    };
  }

  // 07 — memoize
  function customMemoize(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Argument must be a function');
    }
    const cache = {};
    return function (...args) {
      const key = JSON.stringify(args);
      if (key in cache) return cache[key];
      cache[key] = fn(...args);
      return cache[key];
    };
  }

  // 08 — compose (right-to-left)
  function customCompose(...fns) {
    for (let i = 0; i < fns.length; i++) {
      if (typeof fns[i] !== 'function') {
        throw new TypeError('All arguments must be functions');
      }
    }
    return function (x) {
      let result = x;
      for (let i = fns.length - 1; i >= 0; i--) {
        result = fns[i](result);
      }
      return result;
    };
  }

  // 09 — flattenArray
  function customFlattenArray(nestedArray) {
    if (!Array.isArray(nestedArray)) {
      throw new TypeError('Argument must be an array');
    }
    let result = [];
    for (let i = 0; i < nestedArray.length; i++) {
      if (Array.isArray(nestedArray[i])) {
        result.push(...customFlattenArray(nestedArray[i]));
      } else {
        result.push(nestedArray[i]);
      }
    }
    return result;
  }

  // 10 — createCounter
  function customCreateCounter(parameter) {
    if (typeof parameter !== 'number') {
      throw new TypeError('Argument must be a number');
    }
    let counter = parameter;
    return {
      increment: function () {
        return ++counter;
      },
      decrement: function () {
        return --counter;
      },
      reset: function () {
        return (counter = parameter);
      },
      value: function () {
        return counter;
      },
    };
  }

  // 11 — createSecretHolder
  function customCreateSecretHolder(parameter) {
    if (typeof parameter !== 'number' && typeof parameter !== 'string') {
      throw new TypeError('Argument must be a number or a string');
    }
    return {
      getSecret: function () {
        return parameter;
      },
      setSecret: function (newSecret) {
        return (parameter = newSecret);
      },
    };
  }

  // 12 — pipeAsync (left-to-right)
  function customPipeAsync(...fns) {
    for (let i = 0; i < fns.length; i++) {
      if (typeof fns[i] !== 'function') {
        throw new TypeError('All arguments must be functions');
      }
    }
    return async function (x) {
      let result = x;
      for (let i = 0; i < fns.length; i++) {
        result = await fns[i](result);
      }
      return result;
    };
  }

  // 17 — eventEmitter
  function customEmitter() {
    const listeners = {};
    return {
      on: function (event, callback) {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        listeners[event].push(callback);
      },
      emit: function (event, data) {
        if (!listeners[event]) return;
        const callbacks = listeners[event].slice();
        for (let i = 0; i < callbacks.length; i++) {
          callbacks[i](data);
        }
      },
      off: function (event) {
        delete listeners[event];
      },
      once: function (event, callback) {
        const self = this;
        function wrapper(data) {
          callback(data);
          self.off(event);
        }
        this.on(event, wrapper);
      },
    };
  }

  // 18 — find
  function customFind(array = [], callback) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('Second argument must be a function');
    }
    let foundElement;
    const len = array.length;
    let i = 0;
    while (i < len) {
      const element = array[i];
      if (callback(element, i, array)) {
        foundElement = element;
        break;
      }
      i++;
    }
    return foundElement;
  }

  // 19 — includes
  function customIncludes(array = [], value) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    let foundElement = false;
    const len = array.length;
    let i = 0;
    while (i < len) {
      if (array[i] === value) {
        foundElement = true;
        break;
      }
      i++;
    }
    return foundElement;
  }

  // 20 — findIndex
  function customFindIndex(array = [], callback) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('Second argument must be a function');
    }
    const len = array.length;
    let i = 0;
    while (i < len) {
      if (callback(array[i], i, array)) return i;
      i++;
    }
    return -1;
  }

  // 21 — some
  function customSome(array = [], callback) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('Second argument must be a function');
    }
    const len = array.length;
    let i = 0;
    while (i < len) {
      if (callback(array[i], i, array)) return true;
      i++;
    }
    return false;
  }

  // 22 — every
  function customEvery(array = [], callback) {
    if (!Array.isArray(array)) {
      throw new TypeError('First argument must be an array');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('Second argument must be a function');
    }
    const len = array.length;
    let i = 0;
    while (i < len) {
      if (!callback(array[i], i, array)) return false;
      i++;
    }
    return true;
  }

  /* ---------- Public surface ---------- */

  global.Utils = {
    // string
    capitalize,
    normalizeText,
    slugify,
    // validation
    isRequired,
    isPositiveNumber,
    isNonNegativeInteger,
    // storage
    saveToStorage,
    loadFromStorage,
    // date
    formatDate,
    // array
    generateId,
    sortBy,
    groupBy,
    // number
    formatCurrency,
    parseNumber,
    // custom (from javascript_Library_ass)
    customEach,
    customMap,
    customFilter,
    customReduce,
    customGroupBy,
    customDeepClone,
    customOnce,
    customMemoize,
    customCompose,
    customFlattenArray,
    customCreateCounter,
    customCreateSecretHolder,
    customPipeAsync,
    customEmitter,
    customFind,
    customIncludes,
    customFindIndex,
    customSome,
    customEvery,
  };
})(window);
