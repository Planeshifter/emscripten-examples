all:
	emcc -O3 src/square.c --post-js src/square_post.js -o lib/square.js --memory-init-file 0 -s EXPORTED_FUNCTIONS="['_square']"

clean:
	rm -f *.js *.js.mem

.PHONY:
	clean
