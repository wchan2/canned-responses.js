canned-responses.js
===================

A NodeJS script that allows http responses to be "canned". This allows the front end development to be iterated on and developed quickly without relying on external resources from back end developers.

## Installing Dependencies

Install the dependencies listed inside package.json.

	npm install 

## Starting the canned-responses.js server

Start the canned-responses.js server with the default port `8080`, `json` format, and `responses` directory in the project.

	npm start

Specify different options using the command line options such as `format`, path to `responses` directory, and the `port` to run the server on.

	./server.js -format json -path responses -port 9000

As a side note, it can also be ran with the node command.

	ndoe server.js -format json -path responses -port 9000

## Getting started

1. Create a file that represents a response for a given endpoint inside a `responses` directory

	mkdir responses/get.json

2. Run the `server.js` file to start the server to serve the "canned" responses

	./server.js 	# runs on the default port 8080 and the responses directory in the current directory
	node server.js 	# another way to run the server.js

## Response Filename Convention

The convention follows with a method name, the url path, and finally the content type separated by a period (.). See below for some examples.

	get.json 		   	# resolves a GET request to / in json
	post.hello.sir.json # resolves a POST request to /hello/sir in json

## Coming Soon

- Allow the use of `-format <format>` to allow another content type ie. `-format xml` to read XML instead.

## License

canned-responses.js is released under the [MIT License](http://www.opensource.org/licenses/MIT).