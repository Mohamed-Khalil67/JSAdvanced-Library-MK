//=========== 1- Custom Map ==========

/**
 * @summary Map on elements
 * @param {Array} array
 * @param {Function} callback
 * @returns Array
 */
function customMap(array, callback) {
  // array => [1, 2, 3];
  // callback => function (n) { return n * 2; }
  // new array
  const newArray = [];
  //
  array.forEach((element) => {
    newArray.push(callback(element));
  });
  //
  return newArray;
}

const nums = [1, 2, 3];
const res = customMap(nums, function (n) {
  return n * 2;
});
//
// console.log(res);

//=========== 2- Custom Filter ==========

function customFilter(array, callback) {
  //
  const newArray = [];
  //
  array.forEach((element) => {
    callback(element) && newArray.push(element);
  });
  //
  return newArray;
}

const users = [
  { name: 'Ahmed', age: 22, role: 'Admin' },
  { name: 'Sara', age: 15, role: 'Guest' },
  { name: 'Ali', age: 30, role: 'Admin' },
  { name: 'Lina', age: 17, role: 'Guest' },
  { name: 'Omar', age: 25, role: 'Admin' },
  { name: 'Mona', age: 19, role: 'IT' },
  { name: 'Hossam', age: 19, role: 'HR' },
  { name: 'Bola', age: 19, role: 'Manager' },
];

const res_2 = customFilter(nums, (user) => user.age > 18);
// console.log(res_2);

//=========== 3- Custom Reduce ==========

function customReduce(array, callback, initialValue) {
  //
  const hasInitial = initialValue !== undefined;
  let acc = hasInitial ? initialValue : array[0];
  let startIndex = hasInitial ? 0 : 1;
  //
  for (let i = startIndex; i < array.length; i++) {
    const element = array[i];
    acc = callback(acc, element);
  }
  return acc;
}

const array_3 = [1, 2, 3, 4];
//console.log(array_3.reduce((acc, curr) => acc + curr, 5));

const res_3 = customReduce(array_3, (acc, curr) => acc + curr, 5);
//console.log(res_3);

//=========== 4- Group By ==========

function groupBy(array, prop) {
  const groupsMap = {};
  /**
   * {
   *    "HR":[],
   *    "Admin":[]
   * }
   */
  array.forEach((ele) => {
    const key = ele[prop]; // the role name
    if (Object.hasOwn(groupsMap, key)) {
      groupsMap[key].push(ele);
    } else {
      groupsMap[key] = [ele];
    }
  });
  return groupsMap;
}

const res_4 = groupBy(users, 'role');
// console.log(res_4);

//=========== 5- Deep clone ==========
// {"name":"a",age:12}
// value ==> "a"
function deepClone(value) {
  // Object or Array
  // value can be array or object
  if (typeof value !== 'object') {
    // Base Case
    return value;
  }
  //
  if (Array.isArray(value)) {
    // value is array [  , 1 ,3 ]
    // loop on each element to clone
    return customMap(value, (ele) => deepClone(ele));
  }

  const result = {};
  // value =>  {"name":"a",age:12}
  for (const key of Object.keys(value)) {
    result[key] = deepClone(value[key]);
    // result[name] = "a"
  }

  return result;
}

const user1 = {
  name: 'Ashraf',
  address: { city: 'Cairo', street: 'Makrm' },
  friends: [{ name: 'Bola', address: { city: 'New Cairo' } }],
};

const res_5 = deepClone(user1);
//console.log(res_5);
//
//=========== 6- Once Function ==========

function once(fn) {
  if (typeof fn !== 'function') {
    throw new Error('Arg is not a function');
  }

  let hasBeenCalled = false;

  return function () {
    if (!hasBeenCalled) {
      hasBeenCalled = true;
      return fn();
    }
    // throw Error("Function already called");
  };
}

const testFn = () => console.log('Hiiii');
const init = once(testFn);
// init();
// init();

const init2 = once(() => console.log('Second Fun'));
// init2();

//=========== 7- memoize ==========

function memoize(callback) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);
    if (Object.hasOwn(cache, key)) {
      console.log('Retriving from the cache');
      return cache[key];
    }
    console.log('Calling the callback');
    const result = callback(...args);
    cache[key] = result;
    return result;
  };
}

function calcFib(n) {
  if (n == 0 || n == 1) {
    return n;
  }
  return calcFib(n - 1) + calcFib(n - 2);
}

const fib = memoize(calcFib);

// console.log(fib(6));
// console.log(fib(6));
// console.log(fib(6));
// console.log(fib(7));

//=========== 8- compose ==========

//fn_comp = compose(fn1, fn2, fn3);
// fn_comp(3)
// fn1(fn2(fn3(5)))

function compose(...fnsArgs) {
  // [ fn1 ,fn2 ]
  return function (...args) {
    //
    let result;
    for (let i = fnsArgs.length - 1; i >= 0; i--) {
      const fn = fnsArgs[i]; // fn2()

      if (i == fnsArgs.length - 1) {
        // if on last function in the list
        result = fn(...args); // fn2(3) => 9
      } else {
        result = fn(result); // fn1(9) ==> 10
      }
    }
    return result;
  };
}

const fn1 = (x) => x + 1; // (9) => 9 + 1 => 10
const fn2 = (x) => x * x; // (3) => 3 * 3

// fn1(fn2())

const comp_fn = compose(fn1, fn2); // ()=> fn1(fn2())
console.log(comp_fn(3));
// fn1(fn2(3))
// fn1(9)
// 10

// =========== 9- Flatten Array ============
// let flag = true;

// [1,[2,[3,[4]]]] ==> first call
// [[2,[3,[4]]]] ===> second call
// [2,[3,[4]]] ==> third call
// [[3,[4]]] ==> 4th call
function flattenArray(array) {
  // 1. Base case
  if (array.length === 0) {
    return [];
  }
  // 4
  // []
  const [first, ...rest] = array;
  // console.log(`The first element : ${first}`); // [2,[3,[4]]]
  // console.log(`The rest elements : `); // []
  // console.log(rest)
  //
  if (Array.isArray(first)) {
    // ...flattenArray([2,[3,[4]]]) , ...flattenArray([])
    return [...flattenArray(first), ...flattenArray(rest)];
  }
  //
  // [1 , ...flattenArray(rest) ]
  // [2, ...flattenArray([[3,[4]]])]
  // [ 4 ]
  // [3, 4]
  // [2, 3,4];
  // [1, 2,3,4]
  let res = [first, ...flattenArray(rest)]; // flattenArray([2,[3,[4]]])
  console.log('The result inside the function : ');
  console.log(res);
  return res;
}
// [ 1, [ [ 2, [Array] ] ] ]
// [ 1, [ 2, [Array] ] ]
const arr = [1, [2, [3, [4]]]];
const res = flattenArray(arr);
console.log(res);

// ========= 10- createCounter ===========

function createCounter(n) {
  // n = 10
  return function (x) {
    if (x === undefined) {
      x = 1;
    }
    n = n + x;
    return n;
  };
}

const counter = createCounter(10);
let res = counter(); // 11
res = counter(3); // 11 + 3 => 14
console.log(res);

// ========= 11- createSecretHolder ===========

function createSecretHolder(secret) {
  let _sec = secret;

  return function () {
    return {
      set(value) {
        _sec = value;
      },
      get() {
        return _sec;
      },
    };
  };
}

const secertFn = createSecretHolder('Mohamed');
const seceretController = secertFn();
console.log(seceretController.get());
seceretController.set('Bola');
console.log(seceretController.get());

// ========= 12- pipeAsync ===========

// [addByOne, doubleNumber, minusThree]
function pipeAsync(...fnsList) {
  return async function (n) {
    let result = n;
    for (const fn of fnsList) {
      result = await fn(result);
    }
    return result;
  };
}

const addByOne = async (x) => x + 1; // =>> res
const doubleNumber = async (x) => x * 2; // > res 2
const minusThree = async (x) => x - 3; // // > res 3

const pipeFn = pipeAsync(addByOne, doubleNumber, minusThree);
const result = await pipeFn(5);
console.log(result);

// ========= 13- =============
// - this
// - hoisting
// - closures in loops
// - bind/call/apply

const person = {
  name: 'Eman',
  outerFn() {
    console.log(this);
    return () => {
      console.log('Hello from object ' + this.name);
    };
  },
};

const fn = person.outerFn();
fn();

// ========= 14- Event Emitter =============

function EventEmitter() {
  this.events = {};

  this.on = function (eventName, callback) {
    if (Object.hasOwn(this.events, eventName)) {
      this.events[eventName].push(callback);
    } else {
      this.events[eventName] = [callback];
    }
  };

  this.emit = function (eventName, ...args) {
    const callbackArray = this.events[eventName] || [];
    callbackArray.forEach((fn) => {
      fn(...args);
    });
  };
}

const eventEmitter = new EventEmitter();

eventEmitter.on('login', (name) => console.log(`Hello ${name} - 1`));
eventEmitter.on('login', (name) => console.log(`Hello ${name} - 2`));

eventEmitter.emit('login', 'Adel');
