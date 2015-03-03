var ndarray = require('ndarray');
var show = require('ndarray-show');
var transpose = require('../lib/transpose.js').transpose;

var mat = ndarray(new Float32Array([2, 6, 4, 0]), [2,2]);

console.log( show(mat) );

var tmat = transpose(mat);

console.log( show(tmat) );
