emcc -O3 sum.c --post-js sum_post.js -o sum.js -s EXPORTED_FUNCTIONS="['_sum']"
