function customCreateSecretHolder(parameter) {
  if (typeof parameter !== 'number' && typeof parameter !== 'string') {
    throw new TypeError('Argument must be a number or a string');
  }
  let realSecrect = parameter;
  return {
    getSecret: function () {
      return realSecrect;
    },
    setSecret: function (newSecret) {
      return (realSecrect = newSecret);
    },
  };
}

const secret = customCreateSecretHolder('myPassword123');

console.log(secret.getSecret()); // 'myPassword123'
console.log(secret.setSecret('newPass')); // updates the secret
console.log(secret.getSecret()); // 'newPass'

console.log(secret.secret); // undefined — silent, no error
console.log(secret.realSecrect); // undefined — closure is private ✓
