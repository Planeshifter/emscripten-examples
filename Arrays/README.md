
Consider the following C function which sums the elements of given array `arr`. 

```cpp
int sum(int *arr, int length){
  int ret = 0;
  for (int i = 0; i < length; i++){
    ret += arr[i];
  }
  return ret;
}
```

This function is stored in the file `sum.c`.

Out of the box, *emscripten* supports exporting functions which take as arguments basic data types such as `int` or
`double`, but not C numeric arrays. 
To make the exchange of arrays between JavaScript and the *emscripten* machine, we will use *typed arrays*. 
*emscripten* simulates the C heap by using a typed array, and we are able to insert data into the heap, as will be shown soon. But firt, let us briefly talk about typed arrays. A good resource is the Mozilla Developer network, which tells us the following

> JavaScript typed arrays are array-like objects and provide a mechanism for accessing raw binary data. (...) 
> To achieve maximum flexibility and efficiency, JavaScript typed arrays split the implementation into buffers and views. A buffer (implemented by the ArrayBuffer object) is an object representing a chunk of data; it has no format to speak of, and offers no mechanism for accessing its contents. In order to access the memory contained in a buffer, you need to use a view. A view provides a context — that is, a data type, starting offset, and number of elements — that turns the data into an actual typed array.
[Link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)

The above link contains many other useful information, including how to create typed arrays, what different data types are available etc. 

In our case, we have a function in C which accepts an array of integers, so we create an integer typed array in JS: 
```js
var typedArray = new Int32Array([1, 2, 3, 4, 5]);
```

Ideally, we would like to export our `sum` function from C such that it accepts arrays like the one declared above and correctly returns the sum of their elements. We will achieve this by using the `--post-js` option of the emcscripten compiler `emcc`, which allows to append a JS file to the transpiled *emscripten* output.
In this file, we define the sum function as follows:
```js
Module["sum"] = function(intArray){
 // body comes here 
};
```

This will create a key with name `sum` on the `Module` object and assign it a function which has one input parameter, our typed array. We will fill in the body of the function soon, but first we define a helper function `_arrayToHeap` which will put the data of our array onto *emscripten*'s heap. The function is defined as

```js
function _arrayToHeap(typedArray){
  var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
  var ptr = Module._malloc(numBytes);
  var heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
  heapBytes.set(new Uint8Array(typedArray.buffer));
  return heapBytes;
}
```

A few comments are needed at this point: In the first line, we calculate the number of bytes (`numBytes`) required to store our typed array by multiplying the number of elements in the array with the number of bytes needed for each element, which is stored in the attribute `BYTES_PER_ELEMENT` of the typed array. In the second line, we call the `_malloc` function which allocates a block of memory on the heap, with a size given by `numBytes`. The function returns a pointer to the beginning of the bloc, which we store in variable `ptr`. Next, 
we create a new `Uint8Array` by calling its constructor function with three arguments: First, we give it the `emscripten` heap, `Module.HEAPU8.buffer`, in raw binary format, secondly for the `byteOffset` we 
pass `ptr` and finally we pass `numBytes`, the byte length of the array, as the `length` parameter. This achieves that the newly created typed array views the part of the heap which is allocated for the array we wish to store. To actually insert the data into the heap, we call `heapBytes.set(new Uint8Array(typedArray.buffer));`. Finally, the function returns `heapBytes`. 

 We will call this function at the beginning of our sum function and store the return value in a variable:
 
```js
var heapBytes = _arrayToHeap(intArray);
 ```
 
At this point, we are in a position where we can call the transpiled C function by calling `ccall`:

```
var ret = Module.ccall('sum', 'number',['number','number'], [heapBytes.byteOffset, typedArray.length]);
```

This call specifies that we wish to invoke the `sum` function which has a numeric return value and two numeric parameters (signaled by `['number','number']`), to which we pass the values `heapBytes.byteOffset` and `floatData.length`, respectively. The first is a pointer to the first element of the array in the *emscripten* heap, the second the length of the array, as required by the original function defined in `sum.c`. 
`ret` now contains the result of our calculation, the sum of all elements in the vector `typedArray`. Afterwards, we have to free the memory on the heap by calling `_freeArray(heapBytes);`, where we have defined `_freeArray` as 
```js
function _freeArray(heapBytes){
  Module._free(heapBytes.byteOffset);
}
```

Last but not least, we return `ret` such that the function looks all in all like this:

```js
Module["sum"] = function(intArray){
  var heapBytes = _arrayToHeap(intArray);
  var ret = Module.ccall('sum', 'number',['number','number'], [heapBytes.byteOffset, typedArray.length]);
  _freeArray(heapBytes);
  return ret;
};
```
