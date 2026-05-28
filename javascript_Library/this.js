/*
// Rule 1 — called on an object → this is that object
const user = {
  name: 'Ahmed',
  greet() {
    console.log(this.name); // ← this = user
  },
};
user.greet(); // 'Ahmed' ✓

// Rule 2 — called alone → this is undefined (strict) or window
function greet() {
  console.log(this); // ← this = window or undefined!
}
greet(); // not called on any object

// Rule 3 — arrow function → this is inherited from outside
const user2 = {
  name: 'Ahmed',
  greet: () => {
    console.log(this.name); // ← this = window, not user!
  },
};
user2.greet(); // undefined ← arrow ignores the object

// Rule 4 — called with new → this is the new object
function User(name) {
  this.name = name; // ← this = brand new object
}
const u = new User('Ahmed');
console.log(u.name); // 'Ahmed' ✓
*/

// Part where this break is when another function try to get the method of another function
/*
const user = {
  name: 'Ahmed',
  greet() {
    console.log(this.name);
  },
};

user.greet(); // 'Ahmed' ← this = user

const fn = user.greet; // referencing the method to fn to return function
fn(); // undefined ← this = window!
*/
// Problem when calling method with function return instead of arrow function
const user = {
  name: 'Ahmed',
  greet() {
    setTimeout(function () {
      console.log(this.name); // ✗ broken — what prints here?
    }, 100);
  },
};

user.greet(); // undefined

// Fix 1
const user2 = {
  name: 'Ahmed',
  greet() {
    setTimeout(() => {
      console.log(this.name); // fixed
    }, 100);
  },
};

user2.greet(); // 'Ahmed' ← this = user

// Fix 2
const user3 = {
  name: 'Ahmed',
  greet() {
    setTimeout(
      function () {
        console.log(this.name); // ✓ fixed — why?
      }.bind(this),
      100,
    ); // ← bind locks this here
  },
};
user3.greet(); // 'Ahmed' ✓
