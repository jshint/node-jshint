/*jshint node:true */
var _fs = require('fs'),
    _path = require('path'),
    _sys = require('sys');

function _help() {
    _sys.print(_fs.readFileSync(__dirname + "/../HELP", "utf-8"));
}

function _version() {
    _sys.print(JSON.parse(_fs.readFileSync(__dirname + "/../package.json", "utf-8")).version + "\n");
}

function _removeJsComments(str) {
    str = str || '';
    str = str.replace(/\/\*[\s\S]*(?:\*\/)/g, ''); //everything between "/* */"
    str = str.replace(/\/\/[^\n\r]*/g, ''); //everything after "//"
    return str;
}

function _loadAndParseConfig(filePath) {
    var config = {},
        fileContent;
    try {
        if (_path.existsSync(filePath)) {
            fileContent = _fs.readFileSync(filePath, "utf-8");
            config = JSON.parse(_removeJsComments(fileContent));
        }
    } catch (e) {
        _sys.puts("Error opening config file " + filePath + '\n');
        _sys.puts(e + "\n");
        process.exit(1);
    }
    return config;
}

function _mergeConfigs(homerc, cwdrc) {
    var homeConfig = _loadAndParseConfig(homerc),
        cwdConfig = _loadAndParseConfig(cwdrc),
        prop;

    for (prop in cwdConfig) {
        if (typeof prop === 'string') {
            if (prop === 'predef') {
                homeConfig.predef = (homeConfig.predef || []).concat(cwdConfig.predef);
            } else {
                homeConfig[prop] = cwdConfig[prop];
            }
        }
    }
    return homeConfig;
}

module.exports = {
    interpret: function (args) {
        var config, reporter,
            options = require('argsparser').parse(args),
            defaultConfig = _path.join(process.env.HOME, '.jshintrc'),
            projectConfig = _path.join(process.cwd(), '.jshintrc'),
            customConfig = options["--config"],
            customReporter = options["--reporter"] ? _path.resolve(process.cwd(), options["--reporter"]) : null,
            targets = typeof options.node === "string" ?
                null : options.node.slice(1);

        if (options["--version"]) {
            _version();
            return;
        }

        if (!targets || options["--help"]) {
            _help();
            return;
        }

        if (options["--jslint-reporter"]) {
            customReporter = "./jslint_reporter.js";
        }

        if (customConfig) {
            config = _loadAndParseConfig(customConfig);
        } else {
            config = _mergeConfigs(defaultConfig, projectConfig);
        }

        if (customReporter) {
            try {
                reporter = require(customReporter).reporter;
            } catch (r) {
                _sys.puts("Error opening reporter file: " + customReporter);
                _sys.puts(r + "\n");
                process.exit(1);
            }
        }

        require('./hint').hint(targets, config, reporter);
    }
};

