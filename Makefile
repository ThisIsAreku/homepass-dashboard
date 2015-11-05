all: start


start: build
	npm start

build:
	npm install
	./node_modules/.bin/bower install
	./node_modules/.bin/webpack
