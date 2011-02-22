# node-hint

A command line interface for jshint, with inspiration from nodelint (github.com/tav/nodelint).

## Install

    npm install node-hint

    node-hint

## Usage

    node-hint path path2 [options]

## Options

see example/

    // custom options
    --config path/to/config.json

    // custom reporter
    --reporter path/to/reporter.js

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
