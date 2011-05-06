## v0.2.1 - 06/05/2011

* fixed bug when either the $HOME/.jshintrc or the project specific .jshintrc is missing, neither is used
* added the path to the executable for npm 1.0.x

## v0.2.0 - 06/04/2011

* added the ability for a project specific .jshintrc file (in the current working directory)
* switched custom reporter to be module that exports a reporter function (instead of evaluating a file)
* bumped JSHint to 2011-04-06

## v0.1.9 - 29/03/2011

* remove ./ from file name in jslint xml reporter

## v0.1.8 - 27/03/2011

* jshint already removes shebangs itself
* added a jslint compatible xml output formatter option

## v0.1.7 - 23/03/2011

* fixed line number reporting being off by one when file has a shebang

## v0.1.6 - 21/03/2011

* removed bin property in package.json

## v0.1.5 - 20/03/2011

* exit process with appropriate status code after lint
* use ~/.jshintrc as default options if available
* added --version option

## v0.1.4 - 01/03/2011

* updated JSHint to 2011-03-01 edition (7c4d2acec850beceff8b)

## v0.1.3 - 26/02/2011

* enable require('jshint') when installed through npm
* omitted "node-" prefix in cli and npm package name
* bumped jshint to latest (b81e938959444dd2a9e2)

## v0.1.2 - 24/02/2011

* bumped jshint to latest (3b018b1e454d3917e33c)

## v0.1.1 - 21/02/2011

* reafactored portion of cli into hint module
* switched to jasmine for tests
* custom reporters

## v0.1.0 - 20/02/2011

* initial commit
