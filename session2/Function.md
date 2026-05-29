Functionn in js (block of code create execution context , scope creator , clouser , object (Constructor function ) , value , class behaviour )
-Declation function ||| Experssion function 
-Clousre 



Declation function  => any function start with funcion keyword 
```js
       text()//Hello from text
   console.log(typeof text) //fuction 
    function  text()
    {
        console.log("Hello from text")
    } 
      text() //Hello from text
   
```

Experssion function =>any function don not start with funcion keyword 

```js
   hello() // no hoisting 
   /console.log(typeof hello ) // Reference Error : Cannot access 'hello' before initialization
   
   const hello =function(){
        console.log("Hello ")
    } 
    hello()
```
when file running => creataion phase then execution phase .

In Creation phase only decalation function hoisted .

Type Function => constructor Function .


# Function are first class citizens => means that functions are treated like any other value in the language.
They can be:

--Assigned to variables
```js
 const sayhi = function(){
    return "hello"
 }
 console.log(sayhi())
```
--Passed as arguments to other functions 
```js
 function exec(x){
    x( )
 }
   exec (function (){
        console.log("I'm a callback") 
    } ) //argument
    
```
--Returned from other functions
```js
function outer() {
  return function () {
    console.log("Inner function");
  };
}

const result = outer();

result();
```
--Stored in data structures (arrays, objects, etc.)
```js
      const arr =  [1,2,function(){},function(){}] ;

      const user = {
  name: "Fatma",
  sayHi: function () {
    console.log("Hi");
  }
};

user.sayHi();
```



#Higher Order Function (HOF) is a function that does one of the following:

1-Takes another function as an argument.
```js
const numbers =[1,2,3];
const double = numbers.map(function(num){
    return num*2 
})

console.log(double)
```

2-Returns another function as its result.
```js

function multiplier(factor){
    return function(number){
        return number * factor
    }
}
const ddouble = multiplier(2)
console.log(ddouble(3))
```
#Popular Higher Order Functions in JavaScript

1. map
The map function is used to transform an array by applying a callback function to each element. It returns a new array.
```js
const arr =[1,2,3,4,5]
const result= arr.map(function(num){return num* num});
console.log(result)
```
2. filter
The filter function is used to create a new array containing elements that satisfy a given condition.
```js
const arr =[1,2,3,4,5]
const result= arr.filter(function(num){if (num  %2==0) return num })
 console.log(result)
```
 3. reduce
The reduce function accumulates array elements into a single value based on a callback function.
```js
const arr =[1,2,3,4,5]
const result =arr.reduce((num,acc)=> num+ acc ,0 ) 
console.log(result)
```

4. forEach
The forEach function executes a provided function once for each array element.
```js
   const arr =[1,2,3,4,5]
   const result = arr.forEach(function(num){return console.log(num*2)}) 
   console.log(result)

```

5. find
The find function returns the first element in the array that satisfies a given condition.

```js
const arr =[1,2,3,4,5]
const result = arr.find(function(x){ 
    if(x>3)
    {
        return x ;
    }
})
console.log(result)
```

 #Advanced Techniques with Higher Order Functions
1. Function Composition
2. Currying
3. Memoization 

#Clouseres
 A closure is a function that remembers and accesses variables from its outer scope even after the outer function has finished executing.
 -Helps achieve data encapsulation
 -Creates private variables

 ```js
 
function createCounter()
{
    let counter = 0
  // clouser => function + memory
    return function  increament(){
        counter ++;
        return counter
    }

}
const count = createCounter()
console.log(count)//function
console.log(count())//1
console.dir(count)// scopes >> clouser >> increament 


 ```
 -Closures allow a function to keep variables private and accessible only within that function.
 -When to use clouser  => Protect data from being accessed or modified by other parts of the program.
 -this before class 
 ```js
 
function createBankAccount(initBalance){
    let balance = initBalance
    return{
     deposit(amount){
        return balance +=amount
     },
     WithDraw(amount){
        return balance +=amount
     },
     getBalance(){
        return balance
     }
    }
}

const account =createBankAccount(9000);
console.log(account.deposit(100)) //9100
 ```
//var => function scope 
//let => BLock scope 
```js
 for(var i =0 ;i<=3 ;i++){
    
    setTimeout(() => {
        console.log("from var"+" "+i)
    }, 2000);

 }  //from var 4
    //from var 4
    //from var 4
    //from var 4

 for(let i =0 ;i<=3 ;i++){
    
    setTimeout(() => {
        console.log("from let"+" "+i)
    }, 2000);

}//from let 0
// from let 1
// from let 2
// from let 3

********************
let i =0 ; //global
 for( i ;i<=3 ;i++){
    
    setTimeout(() => {
        console.log("from let"+" "+i)
    }, 2000);

}//from let 4
// from let 4
// from let 4
// from let 4
```
#Closures and IIFE
-Immediately Invoked Function Expressions (IIFE) are JavaScript functions that are executed immediately after they are defined.
```js
// (function (){ 
// // Function Logic Here. 
// })();
(function() {
    // IIFE code block
    var localVar = 'This is a local variable';
    console.log(localVar); // Output: This is a local variable
})();

```
IIFEs (Immediately Invoked Function Expressions) use closures to encapsulate data within a function, keeping it private and preventing access from the outside, which helps create self-contained modules.
```js
const counter = (function () {
    let count = 0;

    return {
        increment: function () {
            count++;
            console.log(count);
        },
        reset: function () {
            count = 0;
            console.log("Counter reset");
        },
    };
})();

counter.increment(); 
counter.increment(); 
counter.reset();
```
-------------------------------------------------

Parameter & argument & default value  
1-Default Value
```js
    function Greating(name = "Fatma"){
    console.log("hello" , name)
}

Greating("Nadia") // hello Nadia
Greating() // hello Fatma


***************
function test(a=10,b=a){
    console.log(a,b)
}
test() //10 10

**********
 ```
Arguments 
-All non–arrow functions automatically have access to a special built‑in object called arguments
--Array‑like object (has length and index access, but not real array methods like .map()).
 ```js
 function sum (){
    console.log(arguments)
   // return arguments.reduce// it is not array so can not use reduce function instead use rest params
}
sum(10,20,30) 
 ```
Rest params => The rest parameter in JavaScript, introduced in ES6, allows a function to accept an indefinite number of arguments as an array
 ```js
 function sum (...nums){
    
   return nums.reduce((sum,curr) => sum+=curr)
}
console.log(sum(10,20,30)) 
 ```

-Arrow function =>
```js
 const add = function(a,b){
    return a+b
 }

 const add = (a,b) => a + b
```


#This Keyword 
-- this refer to the caller
```js
const user ={
    name :"Fatma",
    sayName : function(){
        console.log(this.name)
    
}}
user.sayName() //Fatma :  this refer to the caller 

const fn =user.sayName();//كأنك بعت  reference منه بس 
console.log(fn) // undefined : 
```
#this with Arrow function
The this keyword in Arrow Functions is lexically bound, meaning it takes the value of this from the surrounding context where the function was defined, not where it's called.
```js
const user ={
    name :"Fatma",
    sayName : ()=>{ 
        console.log(this.name) // undefined 
    
}} 
const fn =user.sayName(); 
console.log(fn) // undefined 
```
# Strict mode  => prevent you from writing sepagty code in js 
```js
"use strict";
var let = 10;


 
function  test(){
    console.log(this)
}
test() //window


"use strict";
function  test(){
    console.log(this)
}
test() //undefined
 
```