var ndarray = require('ndarray');
var show = require('ndarray-show');
var fill = require('../lib/fill.js').fill;

var mat = ndarray(new Float32Array([2, 6, 4, 0]), [2,2]);

console.log( show(mat) );

var cmat = fill(mat, 1);

console.log( show(cmat) );
