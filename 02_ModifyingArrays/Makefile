all:
	emcc -O3 src/square.c --post-js src/square_post.js -o lib/square.js --memory-init-file 0 -s EXPORTED_FUNCTIONS="['_squareInt','_squareFloat']"

clean:
	rm -f lib/*.js lib/*.js.mem

.PHONY:
	clean
