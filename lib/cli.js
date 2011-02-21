// inspired by github.com/tav/nodelint
var _fs = require('fs'),
    _sys = require('sys'),
    _path = require('path'),
    _jshint = require('./../packages/jshint/jshint.js').JSHINT,
    _config;

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

function _lint(file, results) {
    var buffer;

    try {
        buffer = _fs.readFileSync(file, 'utf8');
    } catch (e) {
        _sys.puts("Error: Cant open: " + file);
        _sys.puts(e + '\n');
    }

    if (!_jshint(buffer, _config)) {
        _jshint.errors.forEach(function (error) {
            if (error) results.push({file: file, error: error});
        });
    }
}

function _help() {
    _sys.print(_fs.readFileSync(__dirname + "/../HELP", "utf-8"));
}

module.exports = {
    interpret: function (args) {
        var files = [],
            results = [],
            options = require('argsparser').parse(args),
            customConfig = options["--config"],
            targets = typeof options.node === "string" ?
                null : options.node.slice(1);

        if (customConfig) {
            try {
                _config = JSON.parse(_fs.readFileSync(customConfig));
            } catch (e) {
                _sys.puts("Error opening config file: " + options["--config"]);
                _sys.puts(e + "\n");
                process.exit(1);
            }
        }

        if (!targets || options["--help"]) {
            _help();
            return;
        }

        targets.forEach(function (target) {
            _collect(target, files);
        });

        files.forEach(function (file) {
            _lint(file, results);
        });

        _reporter(results);
    }
};
