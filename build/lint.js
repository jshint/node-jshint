module.exports = function (files) {
    var args = files && files.length > 0 ? files : ["."],
        exec = require('child_process').exec,
        opts = args.concat(["--config .jshintrc", "--show-non-errors"]).join(' ');
    
    exec("jshint " + opts, function (err, stdout, stderr) {
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.log(stderr);
        }
    });
};
