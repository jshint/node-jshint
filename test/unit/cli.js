var fs = require('fs'),
    path = require('path'),
    cli = require('./../../lib/cli'),
    hint = require('./../../lib/hint');

describe("cli", function () {
    beforeEach(function () {
        if (!process.stdout.flush) {
            process.stdout.flush = function () {};
        }
        spyOn(process, "exit").andCallFake(function () {
            throw "ProcessExit";
        });
        spyOn(hint, "hint").andReturn([]);
        spyOn(process.stdout, "write");
    });

    it("interprets --help with no args", function () {
        var txt = require('fs').readFileSync(__dirname + "/../../HELP", "utf-8"),
            got = [],
            i = 0;

        spyOn(console, "error");
        try {
            cli.interpret(["node", "hint"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }

        for (i = 0; i < console.error.calls.length; i++)
            got.push(console.error.calls[i].args[0]);

        //require('fs').writeFileSync(__dirname + "/../../HELP", got.join("\n"), "utf-8");
        expect(got.join("\n")).toEqual(txt);
    });

    it("interprets --help", function () {
        var txt = require('fs').readFileSync(__dirname + "/../../HELP", "utf-8"),
            got = [],
            i = 0;

        spyOn(console, "error");
        try {
            cli.interpret(["node", "hint", "file.js", "--help"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }

        for (i = 0; i < console.error.calls.length; i++)
            got.push(console.error.calls[i].args[0]);

        expect(got.join("\n")).toEqual(txt);
    });

    it("interprets --config", function () {
        var config = {};

        spyOn(fs, "readFileSync").andReturn("data");
        spyOn(path, "existsSync").andCallFake(function (path) {
            return path.match(/file\.json$/) ? true : false;
        });
        spyOn(JSON, "parse").andReturn(config);

        try {
            cli.interpret(["node", "hint", "file2.js", "file.js", "--config", "file.json"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }

        expect(fs.readFileSync).toHaveBeenCalledWith("file.json", "utf-8");
        expect(JSON.parse).toHaveBeenCalledWith("data");
        expect(hint.hint.mostRecentCall.args[0]).toContain("file.js");
        expect(hint.hint.mostRecentCall.args[0]).toContain("file2.js");
        expect(hint.hint.mostRecentCall.args[1]).toEqual(config);
    });

    it("interprets --reporter", function () {
        var reporter = require("./../../example/reporter").reporter;
        spyOn(process, "cwd").andReturn(__dirname + "/../");
        try {
            cli.interpret(["node", "hint", "file.js", "file.js", "--reporter", "../example/reporter.js"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }
        expect(hint.hint.mostRecentCall.args[2]).toEqual(reporter);
    });

    describe('when searching for a .jshintrc file (no custom config specified)', function () {
        // TODO: fully test walking up the directory chain

        it("looks for the file in the current working directory", function () {
            var config = {prefdef: []},
                path = require('path');

            spyOn(fs, "readFileSync").andReturn(JSON.stringify(config));
            spyOn(path, "existsSync").andCallFake(function (path) {
                return path.match(/\.jshintrc/) ? true : false;
            });

            try {
                cli.interpret(["node", "hint", "file.js", "file2.js"]);
            } catch (err) { if (err !== "ProcessExit") throw err; }

            expect(fs.readFileSync.argsForCall[0]).toEqual([path.join(process.cwd(), '.jshintrc'), "utf-8"]);
        });

        it("looks for the file in $HOME as a last resort", function () {
            var config = {prefdef: []},
                path = require('path'),
                home = path.join(process.env.HOME, '.jshintrc');

            spyOn(path, "existsSync").andCallFake(function (path, encoding) {
                return path.match(home) ? true : false;
            });

            spyOn(fs, "readFileSync").andCallFake(function (path, encoding) {
                if (path === home) {
                    return JSON.stringify(config);
                } else {
                    throw "does not exist";
                }
            });

            try {
                cli.interpret(["node", "hint", "file.js", "file.js"]);
            } catch (err) { if (err !== "ProcessExit") throw err; }
            expect(fs.readFileSync.argsForCall[0]).toEqual([home, "utf-8"]);
        });
    });

    it("interprets --version and logs the current package version", function () {
        var data = {"name": "jshint", "version": "0.6.4"};
        spyOn(fs, "readFileSync").andReturn(JSON.stringify(data));
        try {
            cli.interpret(["node", "file.js", "--version"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }
        expect(process.stdout.write.mostRecentCall.args[0]).toEqual(data.version + "\n");
    });

    it("interprets --jslint-reporter and uses the jslint xml reporter", function () {
        var reporter = require("./../../lib/reporters/jslint_xml").reporter;
        try {
            cli.interpret(["node", "file.js", "file.js", "--jslint-reporter"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }
        expect(hint.hint.mostRecentCall.args[2]).toEqual(reporter);
    });

    it("interprets --show-non-errors and uses the non error reporter", function () {
        var reporter = require("./../../lib/reporters/non_error.js").reporter;
        try {
            cli.interpret(["node", "file.js", "file.js", "--show-non-errors"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }
        expect(hint.hint.mostRecentCall.args[2]).toEqual(reporter);
    });

    it("interprets --extra-ext with no extension list and only uses the .js extension", function () {
        cli.interpret(["node", "hint", "file.js", "file1.js", "--extra-ext"]);
        expect(hint.hint.mostRecentCall.args[4]).toEqual("");
    });

    it("interprets --extra-ext with .json in extension list and uses the .js and .json extensions", function () {
        cli.interpret(["node", "file.js", "file.js", "--extra-ext", ".json"]);
        expect(hint.hint.mostRecentCall.args[4]).toEqual(".json");
    });

    describe('when searching for a .jshintignore file', function () {
        // TODO: fully test walking up the directory chain

        it("reads in the file if present in current working directory", function () {
            spyOn(path, "existsSync").andCallFake(function (path) {
                return path.match(/\.jshintignore/) ? true : false;
            });

            spyOn(fs, "readFileSync").andCallFake(function (file) {
                if (file.match(/\.jshintignore$/)) {
                    return "dir\nfile.js\n";
                } else {
                    throw "not found";
                }
            });

            try {
                cli.interpret(["node", "hint", "file.js"]);
            } catch (err) { if (err !== "ProcessExit") throw err; }

            expect(hint.hint.mostRecentCall.args[3])
                .toEqual([path.join(process.cwd(), "dir"),
                         path.join(process.cwd(), "file.js")]);
        });

        it("reads in the file from $HOME as a last resort", function () {
            var home = path.join(process.env.HOME, '.jshintignore');

            spyOn(path, "existsSync").andCallFake(function (path) {
                return path.match(home) ? true : false;
            });

            spyOn(fs, "readFileSync").andCallFake(function (file) {
                if (file.match(home)) {
                    return "dir\nfile.js\n";
                } else {
                    throw "not found";
                }
            });

            try {
                cli.interpret(["node", "hint", "file.js"]);
            } catch (err) { if (err !== "ProcessExit") throw err; }

            expect(hint.hint.mostRecentCall.args[3])
                .toEqual([path.join(process.env.HOME, "dir"),
                         path.join(process.env.HOME, "file.js")]);
        });
    });

    it("exits the process with a successful status code with no lint errors", function () {
        var results = [];

        hint.hint.reset();
        hint.hint.andReturn(results);
        spyOn(process.stdout, "flush").andReturn(true);

        try {
            cli.interpret(["node", "hint", "file.js"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }

        expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("exits the process with a failed status code when there are lint errors", function () {
        var results = [{}, {}];

        hint.hint.reset();
        hint.hint.andReturn(results);
        spyOn(process.stdout, "flush").andReturn(true);

        try {
            cli.interpret(["node", "hint", "file.js"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }

        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("listens for sdtout drain event if not flushed", function () {
        var results = [{}, {}];

        hint.hint.reset();
        hint.hint.andReturn(results);
        spyOn(process.stdout, "flush").andReturn(false);
        spyOn(process.stdout, "on").andCallFake(function (name, func) {
            func();
        });

        try {
            cli.interpret(["node", "hint", "file.js"]);
        } catch (err) { if (err !== "ProcessExit") throw err; }

        expect(process.stdout.on.argsForCall[0][0]).toBe("drain");
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});
