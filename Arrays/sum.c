int sum(int *arr, int length){
  int ret = 0;
  for (int i = 0; i < length; i++){
    arr[i] = arr[i] * 2;
    ret += arr[i];
  }
  return ret;
}
