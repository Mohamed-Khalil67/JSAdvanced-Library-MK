function customGroupBy(arrayObject = [{}], keyObject) {
  if (Object.prototype.toString.call(arrayObject) !== '[object Array]') {
    throw new TypeError('First argument must be an array Object');
  }
  if (typeof keyObject !== 'string') {
    throw new TypeError('Second argument must be a string');
  }
  const resultObject = {};
  const len = arrayObject.length;
  for (let i = 0; i < len; i++) {
    const item = arrayObject[i]; // first iteration: { name: 'Ahmed', role: 'admin' }
    const keyValue = item[keyObject]; // first iteration: 'admin'
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
