# node-jshint

A command line interface and npm package for jshint.

## Install

    npm install jshint

## Usage

    jshint path path2 [options]

## Options

see example/

    // custom options
    --config path/to/config.json

    // custom reporter
    --reporter path/to/reporter.js

    // use a jslint compatible xml reporter
    --jslint-reporter

## Default Options

The cli uses the default options that come with jshint, however if it locates a .jshintrc file in your home (~/) directory it will opt for that.

## Per Directory Options

If there is a .jshintrc file in the current working directory, it will be merged into the default options.

## Running Tests

    git submodule init
    git submodule update

    npm install jasmine-node

    jake test

## Jake Commands

    // run tests
    jake test

    // run jshint
    jake lint
