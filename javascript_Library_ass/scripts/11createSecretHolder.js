// Stores a value privately in a closure.
// Exposes only two methods — getSecret to read it and setSecret to update it.
// Nobody can access the value directly.

// Trick here is closure
function customCreateSecretHolder(parameter) {
  if (typeof parameter !== 'number' && typeof parameter !== 'string') {
    throw new TypeError('Argument must be a number or a string');
  }
  return {
    getSecret: function () {
      return parameter;
    },
    setSecret: function (newSecret) {
      return (parameter = newSecret);
    },
  };
}

const secret = customCreateSecretHolder('myPassword123');

console.log(secret.getSecret()); // 'myPassword123'
console.log(secret.setSecret('newPass')); // updates the secret
console.log(secret.getSecret()); // 'newPass'

console.log(secret.secret); // undefined — silent, no error
console.log(secret.realSecrect); // undefined — closure is private ✓
