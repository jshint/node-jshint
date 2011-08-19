module.exports = function () {
    var jasmine = require('jasmine-node'),
        childProcess = require('child_process'),
        path = require('path'),
        verbose = false,
        colored = true,
        key;

    for (key in jasmine) {
        if (Object.prototype.hasOwnProperty.call(jasmine, key)) {
            global[key] = jasmine[key];
        }
    }

    process.argv.forEach(function (arg) {
        switch (arg) {
        case '--no-color':
            colored = false;
            break;
        case '--silent':
            verbose = false;
            break;
        }
    });

    function _test() {
        jasmine.executeSpecsInFolder(__dirname + "/../test/system/", null, verbose, colored);
    }

    if (path.existsSync(__dirname + "/../test/system/.files")) {
        _test();
    } else {
        childProcess.exec(__dirname + "/../test/system/genfiles test/system/.files", _test);
    }
};
