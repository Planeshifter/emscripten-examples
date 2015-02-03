
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
