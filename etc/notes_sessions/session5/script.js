// const user = {
//   name: '',
//   age: '',
// };

// object ==> structure ==> data ... as key : value

// const user = {
//   name: 'Nourhan',
//   age: 32,
//   isInstructore: true,
// };

// console.log(user.age);

// const userInput = window.prompt('enter the key u want');
// console.log(user[userInput]);

// we use dynamic Keys , we use it when the data comes , we don't knwow the keys of the data
// const user = {};
// function updateUser(key, value) {
//   user[key] = value;
// }

// updateUser('name', 'ahmed');
// updateUser('age', 33);

// user.name = '';
// user.age = 213;

// what are the types of the keys of objects, are always string

// const x = {
//   1: 'asda',
//   true: 'asdasd',
// };

// const x = {}
// x[1]= "one";
// x["1"]

// x[true]= "yes"

// keys transform with toString(keys)

// const obj = {};

// const a = {};
// const b = {};

// obj[a] = 'A';
// obj[b] = 'B';
// console.log(obj);

// when object of object , turn to string , it turns to [object Object]
// solving this , new Map(), is here to solve problems of objects
// const x = new Map();

// x.set({}, 'a');
// x.set({}, 'b');
// console.log(x);

// clone object
// Search about StructuredClone and and object cloning porblems

// const user = {
//   name: 'Nour',
//   age: 32,
// };
// const copy = { ...user };

// copy.name = 'Abdo';
// console.log(copy);

// problems of StructuredClone , it lose functions and undefined while cloning.

// const user = {
//   name: 'Nour',
//   age: 32,
//   isInstructor: true,
// };
// console.log(user.hasOwnProperty('name'));
// console.log(user.hasOwnProperty('toString'));
// console.log(user);

// "name" in obj , searchs in prototype chain so normaly false
// Object.hasOwn(obje,"name"), serachs in the object

// const obj = {
//   b: 'B',
//   a: 'A',
//   2: 'two',
//   1: 'one',
// };
// console.log(Object.keys(obj));
// numbers ascending , strings or first symboles are descending

// const person = {
//   sayHi() {
//     console.log('Hi');
//   },
// };

// const user = Object.create(person);
// user.name = 'Abdo';
// user.sayHi();
// console.log(user);

// prototype creation and inheriting an object

// function User(name, age) {
//   this.name = name;
//   this.age = age;
// }

// const u1 = new User('Ahmed', 22);
// const u2 = new User('Abdo', 3123);
// - create empty object
// - this ... object
// - protoype
// - return
// console.log(u1);

// class Person {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
// }

// const p1 = new Person();
// - create empty object
// - this ... object
// - protoype
// - return

// function createUser(name,age) {
//     return {
//         name,
//         age,
//         sayHi(){
//             console.log()
//         }
//     }
// }

// difference between prototype is using new and returning a function

// const user = {};
// propreties of an object, search about what changes can i make to it and what does it help me with ?
// Object.defineProperty(user, 'Ahmed', {
//   value: '12345',
//   enumerable: false,
// });

// console.log(Object.keys(user));

// Need to search for virtual properties

// const user = {
//   firstName: 'Ali',
//   lastName: 'Ahmed',
//   get fullName() {
//     return `${this.firstName} ${this.lastName}`;
//   },

//   set fullName(value) {
//     const name = value.split(' ');
//     this.firstName = name[0];
//     this.lastName = name[1];
//   },
// };

// user.fullname = 'Nourhan Seaeed';

// console.log(user.fullName);

// const user = {
//   name: 'Ali',
//   age: 25,
// };

// const prices = {
//   banana: 50,
//   mango: 200,
// };

// transforming object to array
// console.log(Object.entries(user));

// transforming array to object
// const updated = Object.fromEntries(
//   Object.entries(prices).map(([key, value]) => {
//     return [key, value * 3];
//   }),
// );
// console.log(updated);

// what is the new set declarations , making unique values

// const nums = new Set();

// nums.add(1);
// nums.add(2);
// nums.add(3);
// nums.add(4);

// const unique = [...new Set(nums)];
// console.log(unique);

// // Same but unique
// const a = { id: 1 };
// const b = { id: 1 };

// const set = new Set();

// set.add(a);
// set.add(b);

// console.log(set);

// Interview Questions

// const obj = {};

// obj[{}] = 'hello';

// console.log(obj);

// const user = Object.create({ role: 'Admin' });

// user.name = 'Ahmed';
// console.log(user);
// console.log(role in user);
// console.log(Object.hasOwn(user, 'role'));

// const user = {
//   name: 'Nour',
// };
// Object.freeze(user);
// user.name = 'Route';
// user.age = 22;
// console.log(user);

// // freeze prohibit everything
// const user = {
//   name: 'Nour',
//   address: {
//     city: 'Alex',
//   },
// };
// Object.freeze(user);
// user.address.city = 'Route';
// user.age = 22;
// console.log(user);

// const user = {
//   name: 'Nour',
//   address: {
//     city: 'Alex',
//   },
// };
// Object.seal(user);
// user.address.city = 'Route';
// user.age = 22;
// console.log(user);

// const user = {};

// console.log(user.address?.city);

// const user = {
//   age: 0,
// };
// console.log(user.age ?? 18); // || , gives another answer which is 18

// const name = 'Nour';
// const user = {
//   name: 'Ali',
//   age: 25,
// };
// const { name: bl7 } = user;

// console.log(name);

// what's the problem of spread operators with objects

// const user = {
//   name: 'ahmed',
//   address: {
//     city: 'Alex',
//   },
// };

// const copy = { ...user };
// copy.address.city = 'Cairo';

// console.log(user);
// console.log(copy);

// const proto = {
//   sayHi() {
//     console.log('hello');
//   },
// };

// const user = Object.create(proto);

// user.name = 'Ali';

// spread operators , doesn't copy things in prototype, has only level 1

// const copy = { ...user };
// console.log(copy.sayHi);

// const user = {};

// Object.defineProperty(user, 'password', {
//   value: "1234",
//   enumerable: false
// });

// // Regular spread - loses non-enumerable properties
// const copy = { ...user };
// console.log(copy.password); // undefined

// // Correct way to copy non-enumerable properties
// const properCopy = Object.defineProperty(
//   {},
//   'password',
//   Object.getOwnPropertyDescriptor(user, 'password')
// );
// console.log(properCopy.password); // "1234"

// const user = {
//   firstName: 'Ahmed',
//   get name() {
//     console.log('Getter Called');
//     return this.firstName;
//   },
// };

// const copy = { ...user };
// console.log(copy);

// order in spread , while declaring an object makes a difference of overwriting or not
