function _arrayToHeap(typedArray){
  var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
  var ptr = Module._malloc(numBytes);
  var heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
  heapBytes.set(new Uint8Array(typedArray.buffer));
  return heapBytes;
}

function _freeArray(heapBytes){
  Module._free(heapBytes.byteOffset);
}

Module["sum"] = function(intArray){
  var heapBytes = _arrayToHeap(intArray);
  var ret = Module.ccall('sum', 'number',['number','number'], [heapBytes.byteOffset, intArray.length]);
  _freeArray(heapBytes);
  return ret;
};
