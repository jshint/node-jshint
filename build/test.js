module.exports = function () {
    var args = Array.prototype.map.call(arguments, function (test) {
            return "test/" + test + ".js";
        }),
        // cmd,
        jasmine = require('jasmine-node'),
        sys = require('sys'),
        verbose = false,
        colored = true;

    //cmd = require('child_process').spawn("nodeunit", args.length > 0 ? args : ["test/"]);
    //cmd.stdout.on('data', sys.print);
    //cmd.stderr.on('data', sys.print);
    //require.paths.push("./lib");

    for (var key in jasmine) {
        if (Object.prototype.hasOwnProperty.call(jasmine, key)) {
            global[key] = jasmine[key];
        }
    }

    process.argv.forEach(function (arg) {
        switch (arg) {
            case '--no-color': colored = false; break;
            case '--silent':   verbose = false; break;
        }
    });

    jasmine.executeSpecsInFolder(__dirname + "/../test/", function (runner, log) {
    }, verbose, colored);

};
