// const a = [1, 2, 3, 4, 5]

// Array.prototype.multiply = function () {
//   Array.prototype.push.apply(this, this.map(item => item * item))
// }

// a.multiply()

// console.log(a);

const a = {
  key1: Symbol(),
  key2: 10
}

console.log(JSON.stringify(a))
