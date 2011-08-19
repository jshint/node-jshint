module.exports = function (files) {
    var args = files && files.length > 0 ? files : ["build", "test", "lib"],
        spawn = require('child_process').spawn,
        cmd = spawn("jshint", args),
        sys = require('sys');
    cmd.stdout.on('data', sys.print);
    cmd.stderr.on('data', sys.print);
};
