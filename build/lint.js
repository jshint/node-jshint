module.exports = function (files) {
    var args = files && files.length > 0 ? files : ["."],
        spawn = require('child_process').spawn,
        cmd = spawn("jshint", args.concat(["--show-non-errors"]));

    function write(data) {
        process.stdout.write(new Buffer(data).toString("utf-8"));
    }

    cmd.stdout.on('data', write);
    cmd.stderr.on('data', write);
};
