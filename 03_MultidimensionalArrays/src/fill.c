void fill(float **arr, int nrow, int ncol, float val) {
  for (int i = 0; i < nrow; i++) {
    for (int j = 0; j < ncol; j++) {
      arr[i][j] = val;
    }
  }
}
