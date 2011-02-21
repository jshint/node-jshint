// inspired by github.com/tav/nodelint
var _fs = require('fs'),
    _sys = require('sys'),
    _path = require('path'),
    _jshint = require('./../packages/jshint/jshint.js'),
    _config;

function _lint(file, results) {
    var buffer;

    try {
        buffer = _fs.readFileSync(file, 'utf-8');
    } catch (e) {
        _sys.puts("Error: Cant open: " + file);
        _sys.puts(e + '\n');
    }

    if (!_jshint.JSHINT(buffer.replace(/^\#\!.*/, ''), _config)) {
        _jshint.JSHINT.errors.forEach(function (error) {
            if (error) results.push({file: file, error: error});
        });
    }
}

function _collect(path, files) {
    if (_fs.statSync(path).isDirectory()) {
        _fs.readdirSync(path).forEach(function (item) {
            _collect(_path.join(path, item), files);
        });
    } else if (path.match(/\.js$/)) {
        files.push(path);
    }
}

function _reporter(results) {
    var len = results.length,
        str = '',
        file, error;

    results.forEach(function (result) {
        file = result.file;
        error = result.error;
        str += file  + ': line ' + error.line + ', col ' +
            error.character + ', ' + error.reason + '\n';
    });

    _sys.puts(len > 0 ? (str + "\n" + len + ' error' + ((len === 1) ? '' : 's')) : "Lint Free!");
}

module.exports = {
    hint: function (targets, config) {
        _config = config;

        var files = [],
            results = [];

        targets.forEach(function (target) {
            _collect(target, files);
        });

        files.forEach(function (file) {
            _lint(file, results);
        });

       _reporter(results);
    }
};
