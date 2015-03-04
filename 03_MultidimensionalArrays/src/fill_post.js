var ndarray = require('ndarray');
var util = require('util');

function _MatrixToHeap(data, nrow, ncol){
  var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
  var dataPtr = Module._malloc(nDataBytes);

  var dataHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, nDataBytes);
  dataHeap.set( new Uint8Array(data.buffer) );

  var pointers = new Uint32Array(nrow);
  for (var i = 0; i < pointers.length; i++) {
    pointers[i] = dataPtr + i * data.BYTES_PER_ELEMENT * ncol;
  }

  var nPointerBytes = pointers.length * pointers.BYTES_PER_ELEMENT;
  var pointerPtr = Module._malloc(nPointerBytes);

  var pointerHeap = new Uint8Array(Module.HEAPU8.buffer, pointerPtr, nPointerBytes);
  pointerHeap.set( new Uint8Array(pointers.buffer) );

  return {
    pointerHeap: pointerHeap,
    dataHeap: dataHeap
  };
}

function _freeArray(heapBytes){
  Module._free(heapBytes.byteOffset);
}

Module["fill"] = function(mat, val){

  var fill = Module.cwrap(
    'fill', 'null', ['number', 'number', 'number', 'number']
  );

  var data = mat.data;
  var ncol = mat.shape[1];
  var nrow = mat.shape[0];

  var ret = _MatrixToHeap(data, nrow, ncol);
  fill(ret.pointerHeap.byteOffset, nrow, ncol, val);

  var result = new mat.data.constructor(ret.dataHeap.buffer, ret.dataHeap.byteOffset, data.length);

  // Free memory
  _freeArray(ret.pointerHeap);
  _freeArray(ret.dataHeap);

  mat.data = result;
  return mat;

};
