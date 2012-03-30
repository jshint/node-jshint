module.exports = function () {
    var jasmine = require('jasmine-node'),
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

    jasmine.executeSpecsInFolder(__dirname + "/../test/unit/", function (runner, log) {
    }, verbose, colored);
};
