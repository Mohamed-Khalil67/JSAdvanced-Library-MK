/* global Utils */

const STORAGE_KEY = 'productDashboard_products';
const THEME_KEY = 'productDashboard_theme';
const CATEGORIES = ['Electronics', 'Clothes', 'Books', 'Food'];

let products = []; // current list (will be loaded in Exercise 1)
let editingId = null; // id of product currently being edited (or null)
let lastDeleted = null; // { product, index } for Undo Delete

/* ================================================================
   DOM references  (already wired — used by every exercise below)
   ================================================================ */

const $ = (id) => document.getElementById(id);

const els = {
  form: $('productForm'),
  formTitle: $('formTitle'),
  title: $('title'),
  price: $('price'),
  category: $('category'),
  stock: $('stock'),
  titleError: $('titleError'),
  priceError: $('priceError'),
  categoryError: $('categoryError'),
  stockError: $('stockError'),
  submitBtn: $('submitBtn'),
  cancelBtn: $('cancelBtn'),

  searchInput: $('searchInput'),
  categoryFilter: $('categoryFilter'),
  sortSelect: $('sortSelect'),

  tableBody: $('productsTableBody'),
  emptyState: $('emptyState'),

  totalProducts: $('totalProducts'),
  totalInventoryValue: $('totalInventoryValue'),
  mostExpensiveProduct: $('mostExpensiveProduct'),

  themeToggle: $('themeToggle'),
  exportBtn: $('exportBtn'),
  undoToast: $('undoToast'),
  undoBtn: $('undoBtn'),
};

function loadProducts() {
  products = Utils.loadFromStorage(STORAGE_KEY, []);
}

function persistProducts() {
  Utils.saveToStorage(STORAGE_KEY, products);
}

function getVisibleProducts() {
  const search = Utils.normalizeText(els.searchInput.value);
  const category = els.categoryFilter.value;
  const sortBy = els.sortSelect.value;

  let result = Utils.customFilter(products, (p) => {
    const matchesSearch = Utils.normalizeText(p.title).includes(search);
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  switch (sortBy) {
    case 'price-asc':
      result = Utils.sortBy(result, 'price', 'asc');
      break;
    case 'price-desc':
      result = Utils.sortBy(result, 'price', 'desc');
      break;
    case 'newest':
      result = Utils.sortBy(result, 'createdAt', 'desc');
      break;
    case 'oldest':
      result = Utils.sortBy(result, 'createdAt', 'asc');
      break;
    default: // keep insertion order
  }

  return result;
}

function renderProducts() {
  const visible = getVisibleProducts();
  els.tableBody.innerHTML = '';

  els.emptyState.classList.toggle('d-none', visible.length > 0);

  Utils.customEach(visible, (product) => {
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
    els.tableBody.insertAdjacentHTML('beforeend', row);
  });
}

function updateStats() {
  els.totalProducts.textContent = products.length;

  const inventoryValue = Utils.customReduce(
    products,
    (sum, p) => sum + p.price * p.stock,
    0,
  );
  els.totalInventoryValue.textContent = Utils.formatCurrency(inventoryValue);

  if (products.length === 0) {
    els.mostExpensiveProduct.textContent = '—';
    return;
  }
  const maxPrice = Utils.customReduce(
    products,
    (max, p) => (p.price > max ? p.price : max),
    -Infinity, // to Let an item with a Price 0 dollars win
  );
  const expensive = Utils.customFind(products, (p) => p.price === maxPrice);
  els.mostExpensiveProduct.textContent = expensive ? expensive.title : '—';
}

function validateForm({ title, price, category, stock }) {
  const errors = {};

  if (!Utils.isRequired(title)) errors.title = 'Title is required.';
  if (!Utils.isPositiveNumber(price))
    errors.price = 'Price must be a positive number.';
  if (!Utils.customSome(CATEGORIES, (c) => c === category))
    errors.category = 'Please choose a category.';
  if (!Utils.isNonNegativeInteger(stock))
    errors.stock = 'Stock must be 0 or a positive whole number.';

  return errors;
}

function showErrors(errors) {
  els.titleError.textContent = errors.title || '';
  els.priceError.textContent = errors.price || '';
  els.categoryError.textContent = errors.category || '';
  els.stockError.textContent = errors.stock || '';
}

function addProduct(formData) {
  const newProduct = {
    id: Utils.generateId(),
    createdAt: new Date().toISOString(),
    ...formData,
  };
  products = [...products, newProduct];

  persistProducts();
  renderProducts();
  updateStats();
}

function saveEdit(formData) {
  const idx = Utils.customFindIndex(products, (p) => p.id === editingId);
  if (idx === -1) return;

  products[idx] = { ...products[idx], ...formData };

  persistProducts();
  renderProducts();
  updateStats();
}

function deleteProduct(id) {
  const idx = Utils.customFindIndex(products, (p) => p.id === id);
  if (idx === -1) return;

  const [removed] = products.splice(idx, 1);
  lastDeleted = { product: removed, index: idx };

  persistProducts();
  renderProducts();
  updateStats();

  const toast = bootstrap.Toast.getOrCreateInstance(els.undoToast);
  toast.show();
}

function undoDelete() {
  if (!lastDeleted) return;
  const { product, index } = lastDeleted;
  products.splice(index, 0, product);
  lastDeleted = null;

  persistProducts();
  renderProducts();
  updateStats();
}

function exportProducts() {
  const json = JSON.stringify(products, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.json';
  a.click();
  URL.revokeObjectURL(url);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-bs-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-bs-theme', next);
  Utils.saveToStorage(THEME_KEY, next);

  els.themeToggle
    .querySelector('.theme-icon-light')
    .classList.toggle('d-none', next === 'dark');
  els.themeToggle
    .querySelector('.theme-icon-dark')
    .classList.toggle('d-none', next !== 'dark');
}

function readForm() {
  return {
    title: els.title.value.trim(),
    price: Utils.parseNumber(els.price.value),
    category: els.category.value,
    stock: Utils.parseNumber(els.stock.value),
  };
}

function resetForm() {
  els.form.reset();
  showErrors({});
  editingId = null;
  els.formTitle.textContent = 'Add Product';
  els.submitBtn.textContent = 'Add Product';
  els.cancelBtn.classList.add('d-none');
}

function startEdit(id) {
  const product = Utils.customFind(products, (p) => p.id === id);
  if (!product) return;

  const { title, price, category, stock } = product;
  els.title.value = title;
  els.price.value = price;
  els.category.value = category;
  els.stock.value = stock;

  editingId = id;
  els.formTitle.textContent = 'Edit Product';
  els.submitBtn.textContent = 'Save Changes';
  els.cancelBtn.classList.remove('d-none');
  els.title.focus();
}

function attachEvents() {
  // Submit form: add or edit
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = readForm();
    const errors = validateForm(data);
    showErrors(errors);

    // every() — "are all error keys absent?"
    const isValid = Utils.customEvery(Object.keys(errors), (k) => !errors[k]);
    if (!isValid) return;

    if (editingId) saveEdit(data);
    else addProduct(data);

    resetForm();
  });

  // Cancel edit
  els.cancelBtn.addEventListener('click', resetForm);

  // Edit / Delete buttons in table (event delegation)
  els.tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'edit') startEdit(id);
    if (action === 'delete') deleteProduct(id);
  });

  // Search / filter / sort — re-render on any change
  Utils.customEach(
    [els.searchInput, els.categoryFilter, els.sortSelect],
    (el) => {
      el.addEventListener('input', renderProducts);
      el.addEventListener('change', renderProducts);
    },
  );

  // Theme toggle + export + undo
  els.themeToggle.addEventListener('click', toggleTheme);
  els.exportBtn.addEventListener('click', exportProducts);
  els.undoBtn.addEventListener('click', () => {
    undoDelete();
    bootstrap.Toast.getOrCreateInstance(els.undoToast).hide();
  });
}

function init() {
  // Sync theme-toggle icons with whatever the inline <head> script picked
  const theme = document.documentElement.getAttribute('data-bs-theme');
  els.themeToggle
    .querySelector('.theme-icon-light')
    .classList.toggle('d-none', theme === 'dark');
  els.themeToggle
    .querySelector('.theme-icon-dark')
    .classList.toggle('d-none', theme !== 'dark');

  loadProducts();
  attachEvents();
  renderProducts();
  updateStats();
}

document.addEventListener('DOMContentLoaded', init);
