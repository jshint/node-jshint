module.exports = function (files) {
    var args = files && files.length > 0 ? files : ["."],
        exec = require('child_process').exec,
        opts = args.concat(["--config .jshintrc", "--show-non-errors"]).join(' '),
        cmd = exec("jshint " + opts);

    function write(data) {
        process.stdout.write(new Buffer(data).toString("utf-8"));
    }

    cmd.stdout.on('data', write);
    cmd.stderr.on('data', write);
};
