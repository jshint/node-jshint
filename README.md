# node-jshint

A command line interface and npm package for jshint.

## Install

To use jshint from any location (for npm v1.x) you need to install using the global (-g) flag. 

    npm install -g jshint

## Usage

The command line interface looks like this.

    jshint path path2 [options]

You can also require JSHint itself as a module.

    var jshint = require('jshint');

Note: If you are using npm v1.x be sure to install jshint locally (without the -g flag) or link it globally.

## Custom Reporters

Specify a custom reporter module (see example/reporter.js).

    --reporter path/to/reporter.js

Use a jslint compatible xml reporter.

    --jslint-reporter

## Custom Options

Specify custom lint options (see example/config.json).

    --config path/to/config.json

Note: This bypasses any .jshintrc files.

## Default Options

The CLI uses the default options that come with JSHint. However, if it locates a .jshintrc file in your home directory (~/) it will use those options first.

## Per Directory Options

If there is a .jshintrc file in the current working directory, any of those options will take precedence over (or be merged with) any options found in the ~/.jshintrc file (if it exists).

## Installing dependencies for development

    npm install argparser jasmine-node
    git submodule init
    git submodule update

## Running Tests

    jake test
