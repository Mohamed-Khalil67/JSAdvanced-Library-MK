# Vite Module Bundler + DSA Practice

A small vanilla JavaScript app built with Vite that displays a student list, lets you search it,
and sort it using different sorting algorithms. Built for the Advanced JavaScript course,
Assignment 03.

## What is Vite?

Vite is a build tool and dev server for frontend projects. During development it serves your
source files directly to the browser as native ES modules and only transforms files on request,
which is why the dev server starts almost instantly even on larger projects. For production, it
uses Rollup under the hood to bundle and optimize everything into a small set of static files.

## What problem does a module bundler / build tool solve?

Browsers can load ES modules natively, but doing that for a real app means hundreds of separate
network requests, no minification, and no easy way to use things like environment variables or
asset imports. A bundler takes all the separate `import`/`export` files a project is split into
and combines them into a small number of optimized files, resolves dependencies between them,
and applies optimizations (minifying code, hashing filenames for caching, tree-shaking unused
code) that would be tedious or impossible to do by hand.

## What happens when we run `npm run dev`?

Vite starts a local dev server (in this project on `http://localhost:5173`). It does not bundle
the whole app upfront. Instead it serves `index.html` and your JS files as native ES modules,
transforming each file on the fly as the browser requests it. It also sets up Hot Module
Replacement (HMR), so editing a file updates the page in the browser almost instantly without a
full reload.

## What happens when we run `npm run build`?

Vite switches to Rollup to produce an optimized production build in the `dist/` folder. It
bundles all the JS modules together, minifies the code, extracts and minifies CSS, hashes the
output filenames (e.g. `index-Cn08kd_w.js`) for long-term caching, and copies static assets from
`public/`. The result is a small set of static files that can be deployed anywhere.

## Difference between development build and production build

| | Development (`npm run dev`) | Production (`npm run build`) |
|---|---|---|
| Speed to start | Instant, no bundling upfront | Takes time to bundle everything |
| Code | Served as-is, unminified, easy to debug | Minified, bundled, optimized |
| File count | Many small module requests | Few bundled/hashed files |
| Extra tooling | HMR, source maps, error overlay | None of that — just static output |
| Purpose | Fast iteration while coding | Fast, small, cacheable output for users |

## Difference between Linear Search and Binary Search

Linear Search checks every element one by one from the start of the array until it finds the
target or reaches the end. It works on any array, sorted or not, but it can be slow on large
arrays because in the worst case it has to look at every single item.

Binary Search only works on a **sorted** array. It repeatedly looks at the middle element
(`mid`) between a `low` and `high` boundary: if the middle value equals the target, it's found;
if the target is smaller, the search continues in the left half; if it's bigger, it continues in
the right half. Each step throws away half of the remaining items, so it finds the answer much
faster than checking one by one.

## Why does Binary Search require a sorted array?

Binary Search decides which half of the array to search next by comparing the target to the
middle value. That comparison ("go left" or "go right") is only valid if the array is ordered —
if the array were unsorted, the middle value wouldn't tell you anything about which half the
target could be in, and the algorithm could skip right over it. In this project, before running
Binary Search on the names, we sort a copy of the names array first, since the original list
isn't guaranteed to be alphabetically sorted.

## Big-O of the implemented algorithms

| Algorithm | Best Case | Average Case | Worst Case |
|---|---|---|---|
| Linear Search | O(1) | O(n) | O(n) |
| Binary Search | O(1) | O(log n) | O(log n) |
| Bubble Sort | O(n) | O(n²) | O(n²) |
| Selection Sort | O(n²) | O(n²) | O(n²) |
| Insertion Sort | O(n) | O(n²) | O(n²) |

## Vite features used in this project

- **Dev server** — `npm run dev` serves the app with HMR at `localhost:5173`.
- **CSS import** — `src/styles/main.css` is imported directly inside `src/main.js`.
- **Asset import** — `public/vite.svg` is imported and rendered as an `<img>` in the header.
- **Environment variable** — `VITE_APP_TITLE` is defined in `.env` and read via
  `import.meta.env.VITE_APP_TITLE` to set the page heading.
- **Production build** — `npm run build` outputs an optimized bundle to `dist/`.
- **Preview** — `npm run preview` serves the `dist/` build locally to verify it before deploying.
- **Alias (bonus)** — `vite.config.js` configures `@utils` to point at `src/utils`, used in
  `main.js` as `import { linearSearch, binarySearch } from '@utils/search.js'`.

## Step-by-step trace (bonus)

Each algorithm accepts an optional `onStep` callback (e.g. `linearSearch(array, target, onStep)`)
that fires on every comparison, swap, or shift the algorithm makes. The UI passes a callback
that records a human-readable line for each step, then renders them as a numbered log right
under the result, so you can watch exactly what the algorithm did:

- **Linear Search** logs each index it checks and whether it matched.
- **Binary Search** logs `low`/`high`/`mid` at every iteration and which direction it moved.
- **Bubble Sort** logs every adjacent comparison and whether a swap happened.
- **Selection Sort** logs each comparison against the current minimum, then the final swap.
- **Insertion Sort** logs every shift and where each value gets inserted.

The `onStep` parameter is optional and defaults to `undefined`, so the functions still match the
required signatures (`linearSearch(array, target)`, `bubbleSort(array)`, etc.) when called
without it — see the benchmark section below, which calls them with no callback at all.

## Reset button (bonus)

The "Reset" button clears the sort result, the step log, and the search result/input back to
their initial empty state, without touching the original data array.

## Performance benchmark (bonus)

Every search/sort action on the student list shows the algorithm's name, its Big-O, and how
long it took (measured with `performance.now()`). Because the sample list only has 8 students,
every algorithm finishes in well under a millisecond, so the numbers alone don't really show the
Big-O differences.

To make that visible, the "Performance Benchmark" section runs the same functions against a
random array of 5000 numbers and displays the timings in a table. A typical run looks like:

| Algorithm | Big-O | Time (ms) |
|---|---|---|
| Linear Search | O(n) | ~0.2 |
| Binary Search | O(log n) | ~0.1 |
| Bubble Sort | O(n²) | ~22.7 |
| Selection Sort | O(n²) | ~14.0 |
| Insertion Sort | O(n²) | ~5.2 |

This matches the theory: all three sorts are O(n²), but Bubble Sort does the most swapping and
is consistently the slowest in practice, while Insertion Sort benefits from array data that
isn't fully random-worst-case. Binary Search's O(log n) makes it faster than Linear Search's
O(n), though both are near-instant at this scale since 5000 is still small for a computer.

## Project structure

```
src/
  main.js              # wires everything together, handles DOM events
  data/students.js      # sample student data
  utils/search.js        # linearSearch, binarySearch
  utils/sort.js           # bubbleSort, selectionSort, insertionSort
  components/renderList.js # renders a student list into a container
  styles/main.css        # app styling
public/
  vite.svg              # static asset, imported and rendered
.env                     # VITE_APP_TITLE
vite.config.js           # @utils alias
```

## Running the project

```bash
npm install
npm run dev       # start dev server at localhost:5173
npm run build     # produce production build in dist/
npm run preview   # serve the production build locally
```

## How to scaffold a project like this (general guide)

Steps to set up this same kind of architecture for any new vanilla JS + Vite project:

1. **Scaffold with Vite** — `npm create vite@latest my-app -- --template vanilla`. This gives
   you `index.html`, `package.json`, `vite.config.js` (optional at this point), and a starter
   `src/` folder.
2. **Clean out the demo boilerplate** — Vite's template ships example code (counter, logos,
   sample assets). Delete whatever you don't need; keep `index.html` and `src/main.js` as your
   two entry points.
3. **Split `src/` by responsibility, not by page** — create folders so logic isn't dumped into
   one file:
   - `src/data/` — static or seed data
   - `src/utils/` — pure logic/helper functions (no DOM code)
   - `src/components/` — functions that render DOM from data
   - `src/styles/` — CSS
4. **Keep `public/` for static assets referenced by URL** (favicons, images copied as-is,
   anything you don't need to `import`). Anything you *do* `import` in JS (so Vite can hash/
   optimize it) can live under `src/assets/` instead — this project just needed one asset, so it
   went in `public/`.
5. **Add a `.env` file** for config values, prefixed `VITE_` (Vite only exposes prefixed vars to
   client code, for safety), read via `import.meta.env.VITE_SOMENAME`.
6. **(Optional) add path aliases** in `vite.config.js` under `resolve.alias` so deep relative
   imports (`../../../utils/x.js`) can become short ones (`@utils/x.js`).
7. **Wire `main.js` last** — import your CSS, data, utils, and components into `main.js`, and
   have it only handle DOM wiring (querying elements, attaching event listeners) — keep actual
   logic (search/sort/calculations/etc.) in `utils/`, not inline in `main.js`.
8. **Verify all three modes** — `npm run dev` for local iteration, `npm run build` to confirm it
   bundles cleanly into `dist/`, `npm run preview` to sanity-check the production build before
   deploying.

## How this specific project was built

1. Ran `npm create vite@latest . -- --template vanilla` to scaffold vanilla JS + Vite.
2. Removed the template's demo files (`counter.js`, sample styles, sample logos/icons) since the
   assignment specified an exact folder structure instead.
3. Created `src/data/`, `src/utils/`, `src/components/`, `src/styles/` and moved the one needed
   asset (`vite.svg`) into `public/`.
4. Wrote `src/data/students.js` (sample data), `src/utils/search.js` (`linearSearch`,
   `binarySearch`), `src/utils/sort.js` (`bubbleSort`, `selectionSort`, `insertionSort`), and
   `src/components/renderList.js` (renders a student list into a container element).
5. Wrote `src/main.js` to import the CSS, the asset, the data, and all the utils/components, and
   to build the UI (search input + algorithm picker, sort buttons, reset button, benchmark
   button) purely by wiring DOM events to those imported functions.
6. Added `.env` with `VITE_APP_TITLE`, read in `main.js` via `import.meta.env.VITE_APP_TITLE`.
7. Added the `@utils` alias in `vite.config.js` pointing at `src/utils`, and switched `main.js`'s
   imports from relative utils paths to `@utils/...`.
8. Added a "Performance Benchmark" section that runs all five algorithms against a large
   synthetic array with `performance.now()`, since the small sample dataset finishes too fast to
   show any meaningful timing differences.
9. Verified everything by running `npm run dev`, exercising search/sort/reset in the browser,
   then `npm run build` + `npm run preview` to confirm the production build works identically.
