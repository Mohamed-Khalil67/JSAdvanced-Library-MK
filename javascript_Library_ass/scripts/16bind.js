const user = { name: 'Ahmed' };

function greet(greeting, punctuation) {
  console.log(greeting + ' ' + this.name + punctuation);
}

greet('Hello', '!'); // " Hello undefined!" ✗ — this is window

// call — pass args one by one, runs immediately
greet.call(user, 'hello', '!');

// apply — pass args as array, runs immediately
greet.apply(user, ['Hello', '!']); // 'Hello Ahmed!' ✓

// bind — returns new locked function, run later
const greetAhmed = greet.bind(user);
greetAhmed('Hello', '!'); // 'Hello Ahmed!' ✓
