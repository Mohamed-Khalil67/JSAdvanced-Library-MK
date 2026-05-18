// declaration ||| expression

// function declaration using function keyword
// console.log(typeof text); // function
// function text() {
//   console.log('Hello world');
// }
// text(); // Hello world can be called before and after

// expression , any function not named by function keyword is called expression
// cannot be called before declaration, as its not hoisted
// console.log(typeof hello); // undefined, ReferenceError: Cannot access 'hello' before initialization
// const hello = function () {
//   console.log('Hello world');
// };
// hello();

// console.log(typeof hello); // undefined, ReferenceError: Cannot access 'hello' before initialization
// var hello = function () {
//   console.log('Hello world');
// };
// because of hoisting, the variable hello is declared but not assigned, so it is undefined at this point. The function expression is not hoisted, so it cannot be called before its declaration.
// var , let and const are hoisted but only var is initialized with undefined, let and const are not initialized and will throw a ReferenceError if accessed before declaration.

// higher order function

// const numbers = [1, 2, 3, 4, 5];

// const double = numbers.map(function (num) {
//   return num * 2;
// });
// console.log(double); // [2, 4, 6, 8, 10]

// function multiplier(factor) {
//   return function (number) {
//     return number * factor;
//   };
// }

// const double = multiplier(2);
// console.log(double(5)); // 10

// closure
// function createCounter() {
//   let counter = 0;
//   let x = 10;
//   return function increment() {
//     counter++;
//     return counter;
//   };
// }

// const count = createCounter();
// console.log(count); // [Function: increment]
// console.log(count()); // 1
// console.log(count()); // 1
// console.log(count()); // 1

// let vs var
// var is function scoped, while let is block scoped
// for (var i = 0; i <= 3; i++) {
//   setTimeout(function () {
//     console.log(i); // 4, 4, 4, 4
//   }, 1000);
// }

// console.log(i); // 4, because var is function scoped and the loop has completed by the time the setTimeout callbacks are executed
// for let declaration, it will log 0, 1, 2, 3 because let is block scoped and each iteration of the loop creates a new scope for the variable i.

// for (let i = 0; i <= 3; i++) {
//   setTimeout(function () {
//     console.log(i); // 0, 1, 2, 3
//   }, 1000);
// }

// what does closure do ?
// A closure is a feature in JavaScript where an inner function has access to the outer (enclosing) function's variables,
// even after the outer function has finished executing.

// debouncing

// function debounce(callBack, delay) {
//   let timerId;

//   return function (...args) {
//     clearInterval(timerId);
//     timerId = setTimeout(() => {
//       callBack(...args);
//     }, delay);
//   };
// }

// const search = debounce((value) => {
//   console.log('Searching for:', value);
// }, 300);

// // Simulating user input
// search('H'); // Will not trigger the callback immediately
// search('He'); // Will reset the timer
// search('Hel'); // Will reset the timer
// search('Hell'); // Will reset the timer
// search('Hello'); // Will trigger the callback after 300ms with 'Hello'

// function memo(fn) {
//   const cache = new Map(); // closure to store cached results

//   return function (value) {
//     if (cache.has(value)) {
//       return cache.get(value);
//     }
//     const result = fn(value);
//     cache.set(value, result);
//     return result;
//   };
// }

// const square = memo((n) => n * n);
// console.log(square(4));
// console.log(square(4)); // This call will return the cached result without recomputing

// function test(a = b, b = 10) {
//     console.log(a, b);
// }

// test(); // ReferenceError: Cannot access 'b' before initialization

// arguments , exist in javascript
// rest params, ...args, is a modern way to handle variable number of arguments in a function,
//  while arguments is an older way to access the arguments passed to a function. Rest params are more flexible and easier to work with than arguments, as they provide an actual array of arguments and can be used with array methods, while arguments is an array-like object that does not have array methods and can lead to confusion when used in nested functions or with arrow functions.
// function sum() {
//   console.log(arguments);
// }

// sum(10, 20);

// function sum(...nums) {
//   return nums.reduce((sum, current) => (sum += current), 0);
// }

// reduce method is used to reduce an array to a single value by applying a function to each element of the array and accumulating the result.
// In this case, we are using reduce to sum up all the numbers in the nums array, starting with an initial value of 0.

// console.log(sum(10, 20, 30)); // 60

// const add = (a, b) => a + b;

// const user = {
//   name: 'John',
//   age: 30,
//   greet: function () {
//     // console.log(this);
//     const x = () => {
//       console.log(this); // user object, because arrow function does not have its own this, it inherits this from the surrounding scope, which is the greet function in this case, so this will refer to the user object.
//     };
//   },
// };
// user.greet(); // Hello, my name is John and I am 30 years old.
// this keyword refers to the object that is calling the function, in this case, it refers to the user object. So when we call user.greet(), this.name and this.age will refer to user.name and user.age respectively.
// const fn = user.greet; // method borrowing, fn is a reference to the greet function, but it is not bound to the user object, so when we call fn(), this will be undefined and it will throw an error when trying to access this.name and this.age. To fix this, we can use bind() method to bind the function to the user object.
// fn(); // TypeError: Cannot read properties of undefined (reading 'name')

// const user = {
//   name: 'John',
//   age: 30,
//   greet: () => {
//     // arrow function does not have its own this, it inherits this from the surrounding scope, which is the global scope in this case, so this.name and this.age will be undefined.
//     console.log(
//       `Hello, my name is ${this.name} and I am ${this.age} years old.`,
//     );
//   },
// };

// user.greet(); // Hello, my name is undefined and I am undefined years old.

// Arrow functions are not suitable for methods in objects because they do not have their own this, and they will not work as expected when used as methods in objects.
// Regular function expressions or function declarations should be used for methods in objects to ensure that this refers to the object itself.

// "user strict mode" is a way to opt in to a restricted variant of JavaScript, which can help catch common coding mistakes and "unsafe" actions such as gaining access to the global object. It can be enabled by adding the string "use strict"; at the beginning of a script or a function. In strict mode, certain actions that are normally allowed in JavaScript will throw errors, and it can help improve the performance of your code by allowing the JavaScript engine to optimize it better.

// function test() {
//   console.log(this);
// }
// test(); // In non-strict mode, this will refer to the global object (window in browsers), but in strict mode, this will be undefined.
// result server side of this will be different, in node.js, this will refer to the global object (global) in non-strict mode, but in strict mode, this will be undefined.
// on the front end this will refer to the window object in non-strict mode, but in strict mode, this will be undefined.

// const test = () => {
//   console.log(this);
// };
// test();

// method in javascript is a function that is a property of an object. It can be called using the object it belongs to, and it can access the properties of that object using the this keyword. Methods are used to perform actions on objects and can be defined using regular function expressions or function declarations, but not arrow functions, as they do not have their own this.

const person = {
  name: 'Alice',
  hobbies: ['coding', 'hiking', 'cooking'],
  printHobbies() {
    this.hobbies.forEach((hobby) => {
      // using function here will get undefined because of the this keyword, as it will refer to the global object in non-strict mode or undefined in strict mode, instead of the person object. Arrow function is used here to inherit the this value from the surrounding scope, which is the printHobbies method, so this will refer to the person object and we can access this.name and this.hobbies correctly.
      console.log(this.name, hobby);
    }); // this can be put here as argument
  },
};

person.printHobbies();
