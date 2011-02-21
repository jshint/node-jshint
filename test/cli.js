var s,
    sys = require('sys'),
    cli = require('./../lib/cli');

module.exports = require('nodeunit').testCase({

    setUp: function (done) {
        s = require('sinon').sandbox.create();
        done();
    },

    tearDown: function (done) {
        s.verifyAndRestore();
        done();
    },

    "interprets --help with no args": function (test) {
        var txt = require('fs').readFileSync(__dirname + "/../HELP", "utf-8");
        s.mock(sys).expects("print").once().withExactArgs(txt);
        s.stub(process, "exit");
        cli.interpret(["node", "file.js"]);
        test.done();
    },

    "interprets --help": function (test) {
        var txt = require('fs').readFileSync(__dirname + "/../HELP", "utf-8");
        s.mock(sys).expects("print").once().withExactArgs(txt);
        s.stub(process, "exit");
        cli.interpret(["node", "file.js", "--help"]);
        test.done();
    }

});
