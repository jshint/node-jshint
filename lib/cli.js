var _fs = require('fs'),
    _path = require('path'),
    _sys = require('sys');

function _help() {
    _sys.print(_fs.readFileSync(__dirname + "/../HELP", "utf-8"));
}

module.exports = {
    interpret: function (args) {
        var config, defaultConfig, reporter,
            options = require('argsparser').parse(args),
            defaultConfig = _path.join(process.env.HOME, '.jshintrc'),
            customConfig = options["--config"],
            customReporter = options["--reporter"],
            targets = typeof options.node === "string" ?
                null : options.node.slice(1);

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
                config = JSON.parse(_fs.readFileSync( defaultConfig, "utf-8" ));
            } catch(e) {}
        }

        if (customReporter) {
            try {
                eval(_fs.readFileSync(customReporter, "utf-8"));
            } catch (r) {
                _sys.puts("Error opening reporter file: " + customReporter);
                _sys.puts(r + "\n");
                process.exit(1);
            }
        }

        if (!targets || options["--help"]) {
            _help();
            return;
        }

        require('./hint').hint(targets, config, reporter);
    }
};
