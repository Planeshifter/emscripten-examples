var ndarray = require('ndarray');
var show = require('ndarray-show');
var zeros = require('zeros');
var fill = require('ndarray-fill');

var c_fill = require('../lib/fill.js').fill;

var mat = zeros([400, 400]);

console.time("Emscripten");
var cmat = c_fill(mat, 10);
console.timeEnd("Emscripten");

console.time("Native");
var fmat = fill(mat, function(i, j){
  return 10;
});
console.timeEnd("Native");
