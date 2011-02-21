module.exports = function () {
    var args = Array.prototype.map.call(arguments, function (test) {
            return "test/" + test + ".js";
        }), cmd,
        sys = require('sys');
    cmd = require('child_process').spawn("nodeunit", args.length > 0 ? args : ["test/"]);
    cmd.stdout.on('data', sys.print);
    cmd.stderr.on('data', sys.print);
};
