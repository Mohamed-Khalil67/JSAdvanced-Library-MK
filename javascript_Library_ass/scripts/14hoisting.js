// 1. function declaration — fully hoisted
// The Function is hoisted
sayHello(); // ✓ works — entire function moved to top
function sayHello() {
  console.log('hello');
}

// 2. var — hoisted but undefined
// What's actually written here is :  var = undefined; var is hoisted bu differently the function
console.log(a);
var a = 2;

// 3. let/const — NOT hoisted (Temporal Dead Zone)
// it gives an error where the initialization need to be done before
console.log(b);
let b = 3;
