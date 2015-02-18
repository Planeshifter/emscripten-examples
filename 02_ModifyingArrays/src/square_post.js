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

function _getType(typedArray){
  var identifier = typedArray.toString();
  switch(identifier){
    case "[object Int32Array]":
      return "int";
    case "[object Float32Array]": case "[object Float64Array]":
      return "float";
  }
}

Module["square"] = function(arr){
  var heapBytes = _arrayToHeap(arr);
  switch(_getType(arr)){
    case "int":
      Module.ccall('squareInt', 'null',['number','number'], [heapBytes.byteOffset, arr.length]);
    break;
    case "float":
      Module.ccall('squareFloat', 'null',['number','number'], [heapBytes.byteOffset, arr.length]);
    break;
  }
  var res = new arr.constructor(heapBytes.buffer, heapBytes.byteOffset, arr.length);
  _freeArray(heapBytes);
  return res;
};
