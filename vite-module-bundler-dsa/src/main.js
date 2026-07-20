import './styles/main.css'
import viteLogo from '/vite.svg'
import { students } from './data/students.js'
import { linearSearch, binarySearch } from '@utils/search.js'
import { bubbleSort, selectionSort, insertionSort } from '@utils/sort.js'
import { renderList } from './components/renderList.js'

const COMPLEXITY = {
  linear: { label: 'Linear Search', bigO: 'O(n)' },
  binary: { label: 'Binary Search', bigO: 'O(log n)' },
  bubble: { label: 'Bubble Sort', bigO: 'O(n²)' },
  selection: { label: 'Selection Sort', bigO: 'O(n²)' },
  insertion: { label: 'Insertion Sort', bigO: 'O(n²)' },
}

document.querySelector('#app').innerHTML = `
  <img src="${viteLogo}" alt="Vite logo" width="48" height="48" />
  <h1>${import.meta.env.VITE_APP_TITLE ?? 'Vite Module Bundler + DSA'}</h1>

  <section>
    <h2>Original List</h2>
    <div id="original-list"></div>
  </section>

  <section>
    <h2>Search</h2>
    <input id="search-input" type="text" placeholder="Search by name..." />
    <select id="search-algo">
      <option value="linear">Linear Search</option>
      <option value="binary">Binary Search</option>
    </select>
    <button id="search-btn" type="button">Search</button>
    <p id="search-result"></p>
  </section>

  <section>
    <h2>Sort</h2>
    <button id="bubble-btn" type="button">Bubble Sort</button>
    <button id="selection-btn" type="button">Selection Sort</button>
    <button id="insertion-btn" type="button">Insertion Sort</button>
    <button id="reset-btn" type="button">Reset</button>
    <p id="sort-label"></p>
    <div id="sorted-list"></div>
  </section>

  <section>
    <h2>Performance Benchmark</h2>
    <p>The student list only has a few items, so every algorithm finishes in well under
    a millisecond &mdash; too fast to compare meaningfully. This benchmark runs the same
    functions against a random array of 5000 numbers so the Big-O differences actually
    show up in the timings.</p>
    <button id="benchmark-btn" type="button">Run Benchmark (5000 items)</button>
    <div id="benchmark-results"></div>
    <p id="benchmark-recommendation"></p>
  </section>

  <section>
    <h2>Which algorithm should you use?</h2>
    <ul>
      <li><strong>Small data (a handful to a few hundred items):</strong> any of these algorithms
        finish in well under a millisecond, so simplicity wins. Linear Search and Bubble/Insertion
        Sort are easier to read and write, and the O(n) vs O(log n) or O(n²) vs O(n²) difference
        isn't noticeable at this size.</li>
      <li><strong>Large data (thousands+ items):</strong> the Big-O class starts to matter.
        Binary Search (O(log n)) will clearly outperform Linear Search (O(n)) once the array is
        sorted. Among the sorts, all three are O(n²) here, but Insertion Sort tends to do less
        work than Bubble Sort on data that's already close to sorted, while Bubble Sort is
        usually the slowest in practice because it does the most swapping.</li>
      <li><strong>Search specifically:</strong> use Binary Search whenever the data is already
        sorted (or sorting it once is worth the cost of many repeated searches). Use Linear
        Search when the data is unsorted and you're only searching once or twice — sorting first
        just to binary search would cost more than it saves.</li>
    </ul>
  </section>
`

const originalListEl = document.querySelector('#original-list')
const searchInputEl = document.querySelector('#search-input')
const searchAlgoEl = document.querySelector('#search-algo')
const searchResultEl = document.querySelector('#search-result')
const sortLabelEl = document.querySelector('#sort-label')
const sortedListEl = document.querySelector('#sorted-list')

renderList(originalListEl, students)

document.querySelector('#search-btn').addEventListener('click', () => {
  const query = searchInputEl.value.trim().toLowerCase()
  const names = students.map((s) => s.name.toLowerCase())
  const algo = searchAlgoEl.value

  const start = performance.now()
  let foundIndex
  if (algo === 'binary') {
    const sortedNames = [...names].sort()
    foundIndex = binarySearch(sortedNames, query)
  } else {
    foundIndex = linearSearch(names, query)
  }
  const elapsed = (performance.now() - start).toFixed(4)

  const { label, bigO } = COMPLEXITY[algo]
  const status = foundIndex === -1 ? 'was not found' : 'was found'
  searchResultEl.textContent = `"${searchInputEl.value}" ${status} — ${label} (${bigO}) took ${elapsed}ms`
})

function handleSort(sortFn, algo) {
  const grades = students.map((s) => s.grade)

  const start = performance.now()
  const sortedGrades = sortFn(grades)
  const elapsed = (performance.now() - start).toFixed(4)

  const sortedStudents = sortedGrades.map((grade) =>
    students.find((s) => s.grade === grade)
  )

  const { label, bigO } = COMPLEXITY[algo]
  sortLabelEl.textContent = `Current algorithm: ${label} (${bigO}) — took ${elapsed}ms`
  renderList(sortedListEl, sortedStudents)
}

document.querySelector('#bubble-btn').addEventListener('click', () => {
  handleSort(bubbleSort, 'bubble')
})
document.querySelector('#selection-btn').addEventListener('click', () => {
  handleSort(selectionSort, 'selection')
})
document.querySelector('#insertion-btn').addEventListener('click', () => {
  handleSort(insertionSort, 'insertion')
})

document.querySelector('#reset-btn').addEventListener('click', () => {
  sortLabelEl.textContent = ''
  sortedListEl.innerHTML = ''
  searchInputEl.value = ''
  searchResultEl.textContent = ''
  benchmarkResultsEl.innerHTML = ''
  benchmarkRecommendationEl.textContent = ''
  renderList(originalListEl, students)
})

const benchmarkResultsEl = document.querySelector('#benchmark-results')
const benchmarkRecommendationEl = document.querySelector('#benchmark-recommendation')

function timeIt(fn) {
  const start = performance.now()
  fn()
  return performance.now() - start
}

document.querySelector('#benchmark-btn').addEventListener('click', () => {
  const size = 5000
  const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * size))
  const sortedArray = [...randomArray].sort((a, b) => a - b)
  const missingValue = -1

  const results = [
    { algo: 'linear', time: timeIt(() => linearSearch(randomArray, missingValue)) },
    { algo: 'binary', time: timeIt(() => binarySearch(sortedArray, missingValue)) },
    { algo: 'bubble', time: timeIt(() => bubbleSort(randomArray)) },
    { algo: 'selection', time: timeIt(() => selectionSort(randomArray)) },
    { algo: 'insertion', time: timeIt(() => insertionSort(randomArray)) },
  ]

  benchmarkResultsEl.innerHTML = `
    <table>
      <thead>
        <tr><th>Algorithm</th><th>Big-O</th><th>Time (ms)</th></tr>
      </thead>
      <tbody>
        ${results
          .map(({ algo, time }) => {
            const { label, bigO } = COMPLEXITY[algo]
            return `<tr><td>${label}</td><td>${bigO}</td><td>${time.toFixed(4)}</td></tr>`
          })
          .join('')}
      </tbody>
    </table>
  `

  const searchResults = results.filter((r) => r.algo === 'linear' || r.algo === 'binary')
  const sortResults = results.filter((r) => !['linear', 'binary'].includes(r.algo))
  const fastestSearch = searchResults.reduce((a, b) => (a.time < b.time ? a : b))
  const fastestSort = sortResults.reduce((a, b) => (a.time < b.time ? a : b))

  benchmarkRecommendationEl.textContent =
    `On this ${size}-item run: ${COMPLEXITY[fastestSearch.algo].label} was the faster search, ` +
    `and ${COMPLEXITY[fastestSort.algo].label} was the faster sort.`
})
