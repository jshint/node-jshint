var sys = require('sys'),
    fs = require('fs'),
    cli = require('./../lib/cli'),
    hint = require('./../lib/hint');

describe("cli", function () {

    beforeEach(function () {
        spyOn(hint, "hint");
    });

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
        var config = {};

        spyOn(fs, "readFileSync").andReturn("data");
        spyOn(JSON, "parse").andReturn(config);
        spyOn(sys, "print");

        cli.interpret(["node", "file.js", "file.js", "--config", "file.json"]);

        expect(fs.readFileSync).toHaveBeenCalledWith("file.json", "utf-8");
        expect(JSON.parse).toHaveBeenCalledWith("data");
        expect(hint.hint.mostRecentCall.args[0]).toContain("file.js");
        expect(hint.hint.mostRecentCall.args[1]).toEqual(config);
    });

    it("interprets --reporter", function () {
        var reporter = require("./../example/reporter").reporter;

        spyOn(process, "cwd").andReturn(__dirname + "/../");

        cli.interpret(["node", "file.js", "file.js", "--reporter", "example/reporter.js"]);

        expect(hint.hint.mostRecentCall.args[2]).toEqual(reporter);
    });

    it("looks for a default config when no custom config is specified", function () {
        var config = {prefdef: []},
            path = require('path');

        spyOn(fs, "readFileSync").andReturn(JSON.stringify(config));
        cli.interpret(["node", "file.js", "file.js"]);
        expect(fs.readFileSync).toHaveBeenCalledWith(path.join(process.env.HOME, '.jshintrc'), "utf-8");
    });

    it("looks for a project specific config file", function () {
        var config = {prefdef: []},
            path = require('path');

        spyOn(fs, "readFileSync").andReturn(JSON.stringify(config));
        spyOn(path, "existsSync").andReturn(true);

        cli.interpret(["node", "file.js", "file.js"]);

        expect(fs.readFileSync.argsForCall[0]).toEqual([path.join(process.env.HOME, '.jshintrc'), "utf-8"]);
        expect(fs.readFileSync.argsForCall[1]).toEqual([path.join(process.cwd(), '.jshintrc'), "utf-8"]);
    });

    it("overrides options from the $HOME .jshintrc file with options from the cwd .jshintrc file", function () {
        var config = '{"evil": true,"predef":["Monkeys","Elephants"]}';
        fs.writeFileSync('.jshintrc', config, "utf-8");
        cli.interpret(["node", "file.js", "file.js"]);
        expect(hint.hint.mostRecentCall.args[1].predef).toContain("Monkeys");
        expect(hint.hint.mostRecentCall.args[1].predef).toContain("Elephants");
        expect(hint.hint.mostRecentCall.args[1].evil).toEqual(true);
        fs.unlinkSync('.jshintrc');
    });

    it("interprets --version and logs the current package version", function () {
        var data = {version: 1};

        spyOn(sys, "print");
        spyOn(fs, "readFileSync").andReturn(JSON.stringify(data));

        cli.interpret(["node", "file.js", "--version"]);

        expect(sys.print.mostRecentCall.args[0]).toEqual(data.version + "\n");
    });

    it("interprets --jslint-reporter and uses the jslint xml reporter", function () {
        var reporter = require("./../lib/jslint_reporter").reporter;

        cli.interpret(["node", "file.js", "file.js", "--jslint-reporter"]);

        expect(hint.hint.mostRecentCall.args[2]).toEqual(reporter);
    });

});
