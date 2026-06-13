/* ================================================================
   script.js — Product Management Dashboard
   ----------------------------------------------------------------
   HOW TO USE THIS FILE
   ----------------------------------------------------------------
   Each EXERCISE has 3 parts:

      1.  // ─── EXERCISE N: <what you are building> ───
      2.  A short question + the concepts you must use.
      3.  A STUB that returns nothing useful, plus an
          ANSWER block commented out below it.

   To finish an exercise:
      • Read the question and write the code yourself, OR
      • Copy the body out of the ANSWER block into the stub.

   The UI will progressively come alive as you complete more
   exercises. All required Task 2 array methods, destructuring,
   spread, template literals, default params and modular functions
   appear at least once across the exercises.

   Utility helpers live in `Utils` (see js/utils.js — reused from
   your Task 1 utility package).
   ================================================================ */


/* ================================================================
   0.  CONFIG + STATE  (already wired — no exercise here)
   ================================================================ */

const STORAGE_KEY      = "productDashboard_products";
const THEME_KEY        = "productDashboard_theme";
const CATEGORIES       = ["Electronics", "Clothes", "Books", "Food"];

let products       = [];   // current list (will be loaded in Exercise 1)
let editingId      = null; // id of product currently being edited (or null)
let lastDeleted    = null; // { product, index } for Undo Delete


/* ================================================================
   DOM references  (already wired — used by every exercise below)
   ================================================================ */

const $ = (id) => document.getElementById(id);

const els = {
  form:            $("productForm"),
  formTitle:       $("formTitle"),
  title:           $("title"),
  price:           $("price"),
  category:        $("category"),
  stock:           $("stock"),
  titleError:      $("titleError"),
  priceError:      $("priceError"),
  categoryError:   $("categoryError"),
  stockError:      $("stockError"),
  submitBtn:       $("submitBtn"),
  cancelBtn:       $("cancelBtn"),

  searchInput:     $("searchInput"),
  categoryFilter:  $("categoryFilter"),
  sortSelect:      $("sortSelect"),

  tableBody:       $("productsTableBody"),
  emptyState:      $("emptyState"),

  totalProducts:        $("totalProducts"),
  totalInventoryValue:  $("totalInventoryValue"),
  mostExpensiveProduct: $("mostExpensiveProduct"),

  themeToggle:     $("themeToggle"),
  exportBtn:       $("exportBtn"),
  undoToast:       $("undoToast"),
  undoBtn:         $("undoBtn"),
};


/* ================================================================
   ─── EXERCISE 1: Load products from localStorage ────────────────
   Question:
     On page load, read the saved products array from localStorage
     using the utility `Utils.loadFromStorage(key, fallback)`. If
     nothing is stored, default to an empty array.

   Required concepts:
     • Default parameter (handled inside the util)
     • Reuse of Storage utility from Task 1
   ================================================================ */

function loadProducts() {
  // STUB — replace with the answer below:
  products = [];

  /* ANSWER:
  products = Utils.loadFromStorage(STORAGE_KEY, []);
  */
}


/* ================================================================
   ─── EXERCISE 2: Persist products to localStorage ───────────────
   Question:
     Save the current `products` array under STORAGE_KEY using
     `Utils.saveToStorage`. This must be called after every
     add/edit/delete so refreshing the page keeps the data.

   Required concepts:
     • Reuse of Storage utility
   ================================================================ */

function persistProducts() {
  // STUB:
  return;

  /* ANSWER:
  Utils.saveToStorage(STORAGE_KEY, products);
  */
}


/* ================================================================
   ─── EXERCISE 3: Build the filtered + sorted list ───────────────
   Question:
     Return a NEW array (never mutate `products`) that:
       a) matches the search box (case-insensitive title match)
       b) matches the selected category (or "All")
       c) is sorted by the selected sort option

     Sort options:
       "default"    → keep order
       "price-asc"  → cheapest first
       "price-desc" → most expensive first
       "newest"     → newest createdAt first
       "oldest"     → oldest createdAt first

   Required concepts:
     • filter()
     • spread operator (to clone before sorting)
     • sort()
     • Utils.normalizeText (Task 1 string util)
     • Utils.sortBy (Task 1 array util)
   ================================================================ */

function getVisibleProducts() {
  // STUB — returns everything unsorted/unfiltered so the table
  // still renders something until you finish this exercise:
  return [...products];

  /* ANSWER:
  const search   = Utils.normalizeText(els.searchInput.value);
  const category = els.categoryFilter.value;
  const sortBy   = els.sortSelect.value;

  // (a) + (b) — search & category filter together (Bonus: multi-filter)
  let result = products.filter((p) => {
    const matchesSearch   = Utils.normalizeText(p.title).includes(search);
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  // (c) — sorting
  switch (sortBy) {
    case "price-asc":  result = Utils.sortBy(result, "price", "asc");      break;
    case "price-desc": result = Utils.sortBy(result, "price", "desc");     break;
    case "newest":     result = Utils.sortBy(result, "createdAt", "desc"); break;
    case "oldest":     result = Utils.sortBy(result, "createdAt", "asc");  break;
    default:           // keep insertion order
  }

  return result;
  */
}


/* ================================================================
   ─── EXERCISE 4: Render the products table ─────────────────────
   Question:
     Render every visible product as a <tr> in `els.tableBody`.
     Show the empty-state element if the list is empty.

     Use template literals + destructuring + forEach (or map+join).

     For each row show:
       Title | formatCurrency(price) | category | stock |
       formatDate(createdAt) | Edit + Delete buttons

   Required concepts:
     • forEach() or map()
     • Destructuring (const { title, price ... } = product)
     • Template literals
     • Utils.formatCurrency, Utils.formatDate
   ================================================================ */

function renderProducts() {
  const visible = getVisibleProducts();
  els.tableBody.innerHTML = "";

  // Toggle empty state
  els.emptyState.classList.toggle("d-none", visible.length > 0);

  // STUB:
  // (do nothing — rows won't appear until you finish this exercise)

  /* ANSWER:
  visible.forEach((product) => {
    const { id, title, price, category, stock, createdAt } = product;
    const row = `
      <tr>
        <td>${title}</td>
        <td>${Utils.formatCurrency(price)}</td>
        <td>${category}</td>
        <td>${stock}</td>
        <td>${Utils.formatDate(createdAt)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary btn-action me-1"
                  data-action="edit" data-id="${id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger btn-action"
                  data-action="delete" data-id="${id}">Delete</button>
        </td>
      </tr>
    `;
    els.tableBody.insertAdjacentHTML("beforeend", row);
  });
  */
}


/* ================================================================
   ─── EXERCISE 5: Update the statistics section ──────────────────
   Question:
     Compute and display:
       a) Total number of products
       b) Total inventory value:  Σ (price × stock)
       c) Most expensive product's title (or "—" if no products)

   Required concepts:
     • reduce()
     • find()  (or sort + [0])
     • every()/some() are great for guards
     • Utils.formatCurrency
   ================================================================ */

function updateStats() {
  // STUB:
  els.totalProducts.textContent        = "0";
  els.totalInventoryValue.textContent  = Utils.formatCurrency(0);
  els.mostExpensiveProduct.textContent = "—";

  /* ANSWER:
  // (a)
  els.totalProducts.textContent = products.length;

  // (b) — reduce
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );
  els.totalInventoryValue.textContent = Utils.formatCurrency(inventoryValue);

  // (c) — find the max price, then find() that product
  if (products.length === 0) {
    els.mostExpensiveProduct.textContent = "—";
    return;
  }
  const maxPrice  = products.reduce((max, p) => (p.price > max ? p.price : max), -Infinity);
  const expensive = products.find((p) => p.price === maxPrice);
  els.mostExpensiveProduct.textContent = expensive ? expensive.title : "—";
  */
}


/* ================================================================
   ─── EXERCISE 6: Validate the form ──────────────────────────────
   Question:
     Validate the four inputs. Return an object of error messages
     keyed by field name. The object is empty when valid.

       title    → required, non-empty
       price    → required, positive number
       category → required (one of CATEGORIES)
       stock    → required, non-negative integer

   Required concepts:
     • Validation utilities (Utils.isRequired, Utils.isPositiveNumber,
       Utils.isNonNegativeInteger)
     • every() or some() to short-circuit
   ================================================================ */

function validateForm({ title, price, category, stock }) {
  const errors = {};

  // STUB — pretend everything is valid so submit works once you
  // finish addProduct/editProduct. You should still implement this!
  /* ANSWER:
  if (!Utils.isRequired(title))            errors.title    = "Title is required.";
  if (!Utils.isPositiveNumber(price))      errors.price    = "Price must be a positive number.";
  if (!CATEGORIES.some((c) => c === category)) errors.category = "Please choose a category.";
  if (!Utils.isNonNegativeInteger(stock))   errors.stock    = "Stock must be 0 or a positive whole number.";
  */

  return errors;
}

function showErrors(errors) {
  els.titleError.textContent    = errors.title    || "";
  els.priceError.textContent    = errors.price    || "";
  els.categoryError.textContent = errors.category || "";
  els.stockError.textContent    = errors.stock    || "";
}


/* ================================================================
   ─── EXERCISE 7: Add a new product ──────────────────────────────
   Question:
     Build a product object using the spread operator over the form
     values, plus an auto-generated id and createdAt timestamp.
     Push it into `products`, persist, re-render, refresh stats.

   Product shape: { id, title, price, category, stock, createdAt }

   Required concepts:
     • Spread operator
     • Utils.generateId  (Task 1 array util)
     • Modular functions (call persistProducts / renderProducts / updateStats)
   ================================================================ */

function addProduct(formData) {
  // STUB:
  return;

  /* ANSWER:
  const newProduct = {
    id: Utils.generateId(),
    createdAt: new Date().toISOString(),
    ...formData,
  };
  products = [...products, newProduct];

  persistProducts();
  renderProducts();
  updateStats();
  */
}


/* ================================================================
   ─── EXERCISE 8: Edit an existing product ───────────────────────
   Question:
     Locate the product in `products` by `editingId` using
     `findIndex`. Replace it with a merged copy (spread the old
     values + new form values). Then persist, render, update stats.

   Required concepts:
     • findIndex()
     • Spread operator
   ================================================================ */

function saveEdit(formData) {
  // STUB:
  return;

  /* ANSWER:
  const idx = products.findIndex((p) => p.id === editingId);
  if (idx === -1) return;

  products[idx] = { ...products[idx], ...formData };

  persistProducts();
  renderProducts();
  updateStats();
  */
}


/* ================================================================
   ─── EXERCISE 9: Delete a product (with Undo) ───────────────────
   Question:
     Remove the product whose id matches. Keep a copy in
     `lastDeleted` so the Undo toast can restore it, then persist
     and re-render. Show the undo toast.

   Required concepts:
     • filter()  OR  findIndex() + splice()
     • Destructuring (capture the deleted one)
   ================================================================ */

function deleteProduct(id) {
  // STUB:
  return;

  /* ANSWER:
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return;

  const [removed] = products.splice(idx, 1);
  lastDeleted = { product: removed, index: idx };

  persistProducts();
  renderProducts();
  updateStats();

  // Bonus — Undo Delete
  const toast = bootstrap.Toast.getOrCreateInstance(els.undoToast);
  toast.show();
  */
}


/* ================================================================
   ─── EXERCISE 10: Undo the last delete ──────────────────────────
   Question:
     If `lastDeleted` exists, put the product back at its original
     index (use splice), persist, render, refresh stats, and clear
     lastDeleted.

   Required concepts:
     • Destructuring
   ================================================================ */

function undoDelete() {
  // STUB:
  return;

  /* ANSWER:
  if (!lastDeleted) return;
  const { product, index } = lastDeleted;
  products.splice(index, 0, product);
  lastDeleted = null;

  persistProducts();
  renderProducts();
  updateStats();
  */
}


/* ================================================================
   ─── EXERCISE 11: Export products.json (Bonus) ──────────────────
   Question:
     Serialize `products` to a JSON file and trigger a browser
     download named "products.json".

   Required concepts:
     • map() (e.g. to strip ids first — optional)
     • Template literals (mime type / filename)
   ================================================================ */

function exportProducts() {
  // STUB:
  return;

  /* ANSWER:
  const json = JSON.stringify(products, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "products.json";
  a.click();
  URL.revokeObjectURL(url);
  */
}


/* ================================================================
   ─── EXERCISE 12: Dark mode toggle (Bonus) ──────────────────────
   Question:
     Flip the document's `data-bs-theme` attribute between "light"
     and "dark". Save the new value under THEME_KEY so it sticks on
     reload. Also flip the visibility of the two icons inside the
     toggle button.

   Required concepts:
     • Ternary operator / template literals
     • Utils.saveToStorage
   ================================================================ */

function toggleTheme() {
  // STUB:
  return;

  /* ANSWER:
  const current = document.documentElement.getAttribute("data-bs-theme");
  const next    = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-bs-theme", next);
  Utils.saveToStorage(THEME_KEY, next);

  els.themeToggle.querySelector(".theme-icon-light").classList.toggle("d-none", next === "dark");
  els.themeToggle.querySelector(".theme-icon-dark").classList.toggle("d-none", next !== "dark");
  */
}


/* ================================================================
   FORM HANDLING  (already wired — calls your exercises above)
   ================================================================ */

function readForm() {
  return {
    title:    els.title.value.trim(),
    price:    Utils.parseNumber(els.price.value),
    category: els.category.value,
    stock:    Utils.parseNumber(els.stock.value),
  };
}

function resetForm() {
  els.form.reset();
  showErrors({});
  editingId = null;
  els.formTitle.textContent = "Add Product";
  els.submitBtn.textContent = "Add Product";
  els.cancelBtn.classList.add("d-none");
}

function startEdit(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const { title, price, category, stock } = product;
  els.title.value    = title;
  els.price.value    = price;
  els.category.value = category;
  els.stock.value    = stock;

  editingId = id;
  els.formTitle.textContent = "Edit Product";
  els.submitBtn.textContent = "Save Changes";
  els.cancelBtn.classList.remove("d-none");
  els.title.focus();
}


/* ================================================================
   EVENT LISTENERS  (already wired)
   ================================================================ */

function attachEvents() {
  // Submit form: add or edit
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data   = readForm();
    const errors = validateForm(data);
    showErrors(errors);

    // every() — "are all error keys absent?"
    const isValid = Object.keys(errors).every((k) => !errors[k]);
    if (!isValid) return;

    if (editingId) saveEdit(data);
    else           addProduct(data);

    resetForm();
  });

  // Cancel edit
  els.cancelBtn.addEventListener("click", resetForm);

  // Edit / Delete buttons in table (event delegation)
  els.tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === "edit")   startEdit(id);
    if (action === "delete") deleteProduct(id);
  });

  // Search / filter / sort — re-render on any change
  [els.searchInput, els.categoryFilter, els.sortSelect].forEach((el) => {
    el.addEventListener("input", renderProducts);
    el.addEventListener("change", renderProducts);
  });

  // Theme toggle + export + undo
  els.themeToggle.addEventListener("click", toggleTheme);
  els.exportBtn.addEventListener("click", exportProducts);
  els.undoBtn.addEventListener("click", () => {
    undoDelete();
    bootstrap.Toast.getOrCreateInstance(els.undoToast).hide();
  });
}


/* ================================================================
   BOOTSTRAP THE APP
   ================================================================ */

function init() {
  // Sync theme-toggle icons with whatever the inline <head> script picked
  const theme = document.documentElement.getAttribute("data-bs-theme");
  els.themeToggle.querySelector(".theme-icon-light").classList.toggle("d-none", theme === "dark");
  els.themeToggle.querySelector(".theme-icon-dark").classList.toggle("d-none", theme !== "dark");

  loadProducts();
  attachEvents();
  renderProducts();
  updateStats();
}

document.addEventListener("DOMContentLoaded", init);
