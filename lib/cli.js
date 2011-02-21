var _fs = require('fs'),
    _sys = require('sys');

function _help() {
    _sys.print(_fs.readFileSync(__dirname + "/../HELP", "utf-8"));
}

module.exports = {
    interpret: function (args) {
        var config,
            options = require('argsparser').parse(args),
            customConfig = options["--config"],
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
        }

        if (!targets || options["--help"]) {
            _help();
            return;
        }

        require('./hint').hint(targets, config);
    }
};
