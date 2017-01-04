all: js css

.PHONY: js css

js: glimma.min.js

glimma.min.js: src/*/*.js
	browserify src/index.js > glimma.js
	uglifyjs glimma.js -o glimma.min.js --mangle

css: glimma.min.css

glimma.min.css: src/css/*.css
	cleancss -o glimma.min.css src/css/*.css