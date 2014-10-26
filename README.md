canned-responses.js
===================
A NodeJS script that allows http responses to be "canned". This allows the front end development to be iterated on and developed quickly without relying on external resources from back end developers.

## Installing dependencies

	npm install # install the dependencies listed inside package.json
	npm start   # uses a default start command and starts a server serving up response files from the response directory and on port 8080

## Getting started

1. Create a file that represents a response for a given endpoint inside a `responses` directory

	mkdir responses/get.json

2. Run the `server.js` file to start the server to serve the "canned" responses

	./server.js # runs on the default port 8080 and the responses directory in the current directory

## Options for Starting the Server

	./server.js -format json -path responses

## Response Filename Convention
The convention follows with a method name, the url path, and finally the content type separated by a period (.). See below for some examples.

	get.json 		   	# resolves a GET request to / in json
	get.xml  		    # resolves a GET request to / in xml
	post.hello.sir.json # resolves a POST request to /hello/sir in json