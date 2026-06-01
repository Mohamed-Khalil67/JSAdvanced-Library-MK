// using var , as it's not block scoped
// javascript sees this as:
// var i;                    // ← hoisted to top, ONE shared i
// for (i = 0; i < 3; i++) { ... }
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
  //   console.log(i);
}

// fix 1 — one word change, using let , which is a function scope
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// fix 2 — closure (IIFE wrapping)
// Forcing var into being function scoped
for (var i = 0; i < 3; i++) {
  function makeCallback(j) {
    return () => console.log(j);
  }
  setTimeout(makeCallback(i), 100);
}

// var — function scoped only
function test() {
  for (var i = 0; i < 3; i++) {}
  console.log(i); // 3 ← leaks out of the for block!
}

// let — block scoped
function test() {
  for (let i = 0; i < 3; i++) {}
  console.log(i); // ReferenceError ← trapped inside the block ✓
}

// What counts as a block
// A block is anything between { }:
// for loop — block
for (let i = 0; i < 3; i++) {
  // i only lives here
}

// if statement — block
if (true) {
  let x = 10; // x only lives here
}

// while loop — block
while (condition) {
  let y = 5; // y only lives here
}

// even a standalone block
{
  let secret = 42; // secret only lives here
}
console.log(secret); // ReferenceError ✓
