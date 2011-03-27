# node-jshint

A command line interface for jshint, with inspiration from nodelint (github.com/tav/nodelint).

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
