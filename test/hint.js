var sys = require('sys'),
    fs = require('fs'),
    jshint = require('./../packages/jshint/jshint.js'),
    hint = require('./../lib/hint');

describe("hint", function () {

    beforeEach(function () {
        spyOn(sys, "puts");
        spyOn(process, "exit");
    });

    it("collects files", function () {
        var targets = ["file1.js", "file2.js", ".hidden"];

        spyOn(jshint, "JSHINT").andReturn(true);
        spyOn(fs, "readFileSync").andReturn("data");

        spyOn(fs, "statSync").andReturn({
            isDirectory: jasmine.createSpy().andReturn(false)
        });

        hint.hint(targets);

        expect(fs.readFileSync.callCount).toEqual(2);
        expect(fs.readFileSync).not.toHaveBeenCalledWith(targets[2], "utf-8");
        expect(fs.readFileSync).toHaveBeenCalledWith(targets[0], "utf-8");
        expect(fs.readFileSync).toHaveBeenCalledWith(targets[1], "utf-8");
    });

    it("collects directory files", function () {
        var targets = ["dir", "file2.js"];

        spyOn(jshint, "JSHINT").andReturn(true);

        spyOn(fs, "readFileSync").andReturn("data");
        spyOn(fs, "readdirSync").andReturn(["file2.js"]);

        spyOn(fs, "statSync").andCallFake(function (path) {
            return {
                isDirectory: function () {
                    return path === targets[0] ? true : false;
                }
            };
        });

        hint.hint(targets);

        expect(fs.readFileSync.callCount).toEqual(2);

        expect(fs.readFileSync.argsForCall[0])
            .toContain(require('path').join(targets[0], "file2.js"));

        expect(fs.readFileSync.argsForCall[0]).toContain("utf-8");

        expect(fs.readFileSync.argsForCall[1]).toContain(targets[1]);
        expect(fs.readFileSync.argsForCall[1]).toContain("utf-8");
    });

    it("passes custom config", function () {
        var targets = ["file1.js"],
            config = {};

        spyOn(jshint, "JSHINT").andReturn(true);
        spyOn(fs, "readFileSync").andReturn("data");

        spyOn(fs, "statSync").andReturn({
            isDirectory: jasmine.createSpy().andReturn(false)
        });

        hint.hint(targets, config);

        expect(jshint.JSHINT).toHaveBeenCalledWith("data", config);
    });

    it("uses custom reporter", function () {
        var targets = ["file1.js"],
            config = null,
            reporter = jasmine.createSpy("reporter");

        spyOn(jshint, "JSHINT").andReturn(true);
        spyOn(fs, "readFileSync").andReturn("data");

        spyOn(fs, "statSync").andReturn({
            isDirectory: jasmine.createSpy("isDirectory").andReturn(false)
        });

        hint.hint(targets, config, reporter);

        expect(reporter).toHaveBeenCalled();
    });

    it("exits the process with a successful status code with no lint errors", function () {
        var targets = ["file1.js"];

        spyOn(jshint, "JSHINT").andReturn(true);
        spyOn(fs, "readFileSync").andReturn("data");

        spyOn(fs, "statSync").andReturn({
            isDirectory: jasmine.createSpy().andReturn(false)
        });

        hint.hint(targets);

        expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("exits the process with a failed status code when there are lint errors", function () {
        var targets = ["file1.js"],
            results = [{
                file: "file1.js",
                error: {
                    line: "1",
                    reason: "",
                    character: "4"
                }
            }];

        spyOn(jshint, "JSHINT").andReturn(false);
        jshint.JSHINT.errors = results;
        spyOn(fs, "readFileSync").andReturn("data");

        spyOn(fs, "statSync").andReturn({
            isDirectory: jasmine.createSpy().andReturn(false)
        });

        hint.hint(targets);

        expect(process.exit).toHaveBeenCalledWith(1);
    });

    // TODO: handles jshint errors (will tighten custom reporter assertions)
    // TODO: handles file open error

});
