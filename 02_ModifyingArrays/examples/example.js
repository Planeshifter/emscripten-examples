var square = require("../lib/square.js").square;

var typedArray = new Float32Array([1, 2.7, 3, 4.2, 5]);
var res = square(typedArray);
console.log(res);

var typedArray = new Int32Array([1, 2, 3, 4, 5]);
var res = square(typedArray);
console.log(res);
