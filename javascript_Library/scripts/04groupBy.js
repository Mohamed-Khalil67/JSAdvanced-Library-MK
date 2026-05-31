// Takes an array of objects and groups them by a shared key into one object.
// Each unique key value becomes a property holding an array of matching items.

// This is Very difficult for me when solving it, as i need to know the difference
// between having a kay , value of the key, object result using a key

// const item      = arrayObject[i];   // the whole object    → { name:'Ahmed', role:'admin' }
// const keyObject = 'role';           // the key name        → 'role'
// const keyValue  = item[keyObject];  // the value of key    → 'admin'

// then keyValue becomes the key in resultObject
// resultObject['admin'] = [];         // group name as key
// resultObject['admin'].push(item);   // whole object goes into that group
function customGroupBy(arrayObject = [{}], keyObject) {
  if (Object.prototype.toString.call(arrayObject) !== '[object Array]') {
    throw new TypeError('First argument must be an array Object');
  }
  if (typeof keyObject !== 'string') {
    throw new TypeError('Second argument must be a string');
  }
  // this is the final result. An object where each key is a group
  // example: { admin: [...], user: [...] }
  const resultObject = {};
  const len = arrayObject.length;
  for (let i = 0; i < len; i++) {
    const item = arrayObject[i];
    const keyValue = item[keyObject];
    if (!resultObject[keyValue]) {
      resultObject[keyValue] = [];
    }
    resultObject[keyValue].push(item);
  }
  return resultObject;
}

const users = [
  { name: 'Ahmed', role: 'admin' },
  { name: 'Sara', role: 'user' },
  { name: 'Omar', role: 'admin' },
  { name: 'Mona', role: 'user' },
];

console.log(customGroupBy(users, 'role'));

// {
//   admin: [{ name: 'Ahmed', role: 'admin' }, { name: 'Omar', role: 'admin' }],
//   user:  [{ name: 'Sara',  role: 'user' },  { name: 'Mona', role: 'user' }]
// }

console.log(customGroupBy([], 'role')); // {}
// customGroupBy(null, 'role'); // throws
// customGroupBy(users, 123); // throws — key must be a string
