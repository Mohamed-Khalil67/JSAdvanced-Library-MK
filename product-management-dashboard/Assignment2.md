# Task 2 — Product Management Dashboard

**Frontend Only** (HTML, CSS, JavaScript)

Build a Product Management Dashboard that allows users to add, edit, delete, search, filter, sort, and analyze products using JavaScript and DOM manipulation.

---

## Product Structure

```js
{
  (id, title, price, category, stock, createdAt);
}
```

---

## Required Features

- Add Product with validation.
- Edit Product.
- Delete Product.
- Display Products in a table.
- Search by title (case insensitive).
- Filter by category.
- Sort by price and date.
- Statistics section (Total Products, Inventory Value, Most Expensive Product).
- Empty State when no products exist.
- Persist data using `localStorage`.

---

## Important Requirement — Reuse Your Task 1 Utility Package

In Task 1, you created your own JavaScript Utility Package. This project **must** reuse that package instead of rewriting the same logic again.

You must use **at least five** utility methods from Task 1:

| Category             | Examples                                       |
| -------------------- | ---------------------------------------------- |
| String Utilities     | `capitalize`, `normalizeText`, `slugify`, etc. |
| Validation Utilities | `isRequired`, `isPositiveNumber`, etc.         |
| Storage Utilities    | `saveToStorage`, `loadFromStorage`             |
| Date Utilities       | `formatDate`                                   |
| Array Utilities      | `sortBy`, `generateId`, `groupBy`, etc.        |
| Number Utilities     | `formatCurrency`, `parseNumber`, etc.          |

### Examples of Reuse

- Use `formatCurrency()` when displaying prices.
- Use `saveToStorage()` and `loadFromStorage()` for `localStorage`.
- Use `formatDate()` to display `createdAt`.
- Use validation helpers inside form validation.
- Use utility sorting methods instead of rewriting sorting logic.

> ⚠️ Marks will be deducted if utility methods are recreated instead of imported and reused.

---

## Technical Requirements

The following must be used in your implementation:

- `map()`
- `filter()`
- `find()`
- `findIndex()`
- `forEach()`
- `some()`
- `every()`
- `reduce()`
- `sort()`
- Destructuring
- Spread Operator
- Template Literals
- Default Parameters
- Modular Functions

---

## Bonus Features

- Multi-filtering
- Undo Delete
- Dark Mode
- Export `products.json`

---

## Submission

- **Repository Name:** `product-dashboard-[student-name]`
- Include a `README.md`, clean code, responsive UI, and a GitHub repository link.
