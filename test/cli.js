var sys = require('sys'),
    fs = require('fs'),
    cli = require('./../lib/cli');

describe("cli", function () {

    it("interprets --help with no args", function () {
        var txt = require('fs').readFileSync(__dirname + "/../HELP", "utf-8");
        spyOn(sys, "print");
        cli.interpret(["node", "file.js"]);
        expect(sys.print.mostRecentCall.args[0]).toEqual(txt);
    });

    it("interprets --help", function () {
        var txt = require('fs').readFileSync(__dirname + "/../HELP", "utf-8");
        spyOn(sys, "print");
        cli.interpret(["node", "file.js", "--help"]);
        expect(sys.print.mostRecentCall.args[0]).toEqual(txt);
    });

    it("interprets --config", function () {
        spyOn(fs, "readFileSync").andReturn("data");
        spyOn(JSON, "parse");
        cli.interpret(["node", "file.js", "--config", "file.json"]);
        expect(fs.readFileSync).toHaveBeenCalledWith("file.json", "utf-8");
        expect(JSON.parse).toHaveBeenCalledWith("data");
    });

    // TODO: interprets --reporter
    // TODO: handles config file open error

});
