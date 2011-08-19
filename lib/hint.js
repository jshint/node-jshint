var _fs = require('fs'),
    _sys = require('sys'),
    _path = require('path'),
    _jshint = require('./../packages/jshint/jshint.js'),
    _reporter = require('./reporters/default').reporter,
    _config;

function _lint(file, results, data) {
    var buffer,
        lintdata;

    try {
        buffer = _fs.readFileSync(file, 'utf-8');
    } catch (e) {
        _sys.puts("Error: Cant open: " + file);
        _sys.puts(e + '\n');
    }

    if (!_jshint.JSHINT(buffer, _config)) {
        _jshint.JSHINT.errors.forEach(function (error) {
            if (error) {
                results.push({file: file, error: error});
            }
        });
    }

    lintdata = _jshint.JSHINT.data();

    if (lintdata) {
        lintdata.file = file;
        data.push(lintdata);
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

module.exports = {
    hint: function (targets, config, reporter) {
        var files = [],
            results = [],
            data = [];

        _config = config || null;

        targets.forEach(function (target) {
            _collect(target, files);
        });

        files.forEach(function (file) {
            _lint(file, results, data);
        });

        (reporter || _reporter)(results, data);
    }
};
