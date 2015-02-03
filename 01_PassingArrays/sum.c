int sum(int *arr, int length){
  int ret = 0;
  for (int i = 0; i < length; i++){
    ret += arr[i];
  }
  return ret;
}
