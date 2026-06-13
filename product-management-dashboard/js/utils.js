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
  "use strict";

  /* ---------- String Utilities ---------- */

  function capitalize(str = "") {
    if (typeof str !== "string" || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function normalizeText(str = "") {
    if (typeof str !== "string") return "";
    return str.trim().toLowerCase();
  }

  function slugify(str = "") {
    return String(str)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  /* ---------- Validation Utilities ---------- */

  function isRequired(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
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
      console.error("saveToStorage failed:", err);
      return false;
    }
  }

  function loadFromStorage(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.error("loadFromStorage failed:", err);
      return fallback;
    }
  }

  /* ---------- Date Utilities ---------- */

  function formatDate(input) {
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /* ---------- Array Utilities ---------- */

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // sortBy(arr, "price", "asc") — returns a NEW sorted array
  function sortBy(array = [], key, direction = "asc") {
    const dir = direction === "desc" ? -1 : 1;
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

  function formatCurrency(value, currency = "USD", locale = "en-US") {
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(n);
  }

  function parseNumber(value) {
    if (typeof value === "number") return value;
    const n = parseFloat(String(value).replace(/[^\d.\-]/g, ""));
    return Number.isNaN(n) ? 0 : n;
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
  };
})(window);
