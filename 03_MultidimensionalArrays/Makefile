all:
	emcc -O3 src/fill.c --post-js src/fill_post.js -o lib/fill.js --memory-init-file 0 -s EXPORTED_FUNCTIONS="['_fill']"

clean:
	rm -f *.js *.js.mem

.PHONY:
	clean all
