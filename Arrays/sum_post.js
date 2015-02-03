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

Module["sum"] = function(){

  var floatData = new Float32Array(5);
  for(var i = 0; i < floatData.length; i++){
    floatData[i] = i * 2;
  }

  var heapBytes = _arrayToHeap(floatData);

  var ret = Module.ccall('sum', 'number',['number','number'], [heapBytes.byteOffset, floatData.length]);

  var helpFloats = new Float32Array(heapBytes.buffer, heapBytes.byteOffset, floatData.length);
  for(i = 0; i < floatData.length; i++){
    console.log(i + ": "+ helpFloats[i]);
  }

  _freeArray(heapBytes);

  return ret;
};
