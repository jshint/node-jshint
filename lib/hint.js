var fs = require('fs'),
    sys = require('sys'),
    path = require('path'),
    jshint = require('./../packages/jshint/jshint.js'),
    _reporter = require('./reporters/default').reporter;

function _lint(file, results, config, data) {
    var buffer,
        lintdata;

    try {
        buffer = fs.readFileSync(file, 'utf-8');
    } catch (e) {
        sys.puts("Error: Cant open: " + file);
        sys.puts(e + '\n');
    }

    if (!jshint.JSHINT(buffer, config)) {
        jshint.JSHINT.errors.forEach(function (error) {
            if (error) {
                results.push({file: file, error: error});
            }
        });
    }

    lintdata = jshint.JSHINT.data();

    if (lintdata) {
        lintdata.file = file;
        data.push(lintdata);
    }
}

function _shouldIgnore(path, toIgnore) {
    var endOfPath = new RegExp(path + "\\s?$");
    return !toIgnore || path === "." ? false : toIgnore.some(function (ignore) {
        var startOfPath = new RegExp(("^" + ignore));
        return ignore.match(endOfPath) || path.match(startOfPath);
    });
}

function _collect(filePath, files, ignore) {
    if (_shouldIgnore(filePath, ignore)) {
        return;
    }

    if (fs.statSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach(function (item) {
            _collect(path.join(filePath, item), files, ignore);
        });
    } else if (filePath.match(/\.js$/)) {
        files.push(filePath);
    }
}

module.exports = {
    hint: function (targets, config, reporter, ignore) {
        var files = [],
            results = [],
            data = [];

        targets.forEach(function (target) {
            _collect(target, files, ignore);
        });

        files.forEach(function (file) {
            _lint(file, results, config, data);
        });

        (reporter || _reporter)(results, data);
    }
};
