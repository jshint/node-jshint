var _fs = require('fs'),
    _path = require('path'),
    _sys = require('sys');

function _help() {
    _sys.print(_fs.readFileSync(__dirname + "/../HELP", "utf-8"));
}

function _version() {
    _sys.print(JSON.parse(_fs.readFileSync(__dirname + "/../package.json", "utf-8")).version + "\n");
}

function _mergeConfigs(homerc, cwdrc) {
    var homeConfig = {},
        cwdConfig = {},
        prop;

    if (_path.existsSync(homerc)) homeConfig = JSON.parse(_fs.readFileSync(homerc, "utf-8"));
    if (_path.existsSync(cwdrc)) cwdConfig = JSON.parse(_fs.readFileSync(cwdrc, "utf-8"));

    for (prop in cwdConfig) {
        if (typeof prop === 'string') {
            if (prop === 'predef') {
                homeConfig.predef = homeConfig.predef.concat(cwdConfig.predef);
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
            try {
                config = JSON.parse(_fs.readFileSync(customConfig, "utf-8"));
            } catch (e) {
                _sys.puts("Error opening config file: " + customConfig);
                _sys.puts(e + "\n");
                process.exit(1);
            }
        } else {
            try {
                config = _mergeConfigs(defaultConfig, projectConfig);
            } catch (f) {}
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
