// Author: Boy Baukema
// http://github.com/relaxnow
module.exports =
{
    reporter: function (results, data)
    {
        "use strict";

        var files = {},
            out = [],
            pairs = {
                "&": "&amp;",
                '"': "&quot;",
                "'": "&apos;",
                "<": "&lt;",
                ">": "&gt;"
            },
            file, i, issue, globals, unuseds;

        function encode(s) {
            for (var r in pairs) {
                if (typeof(s) !== "undefined") {
                    s = s.replace(new RegExp(r, "g"), pairs[r]);
                }
            }
            return s || "";
        }

        results.forEach(function (result) {
            // Register the file
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }

            // Add the error
            files[result.file].errors.push({
                severity: 'error',
                line: result.line,
                column: result.character,
                message: result.reason,
                source: result.raw
            });
        });

        data.forEach(function (result) {
            file = data.file;
            globals = result.implieds;
            unuseds = result.unused;

            // Register the file
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }

            if (globals) {
                globals.forEach(function (global) {
                    files[result.file].push({
                        severity: 'warning',
                        line: global.line,
                        column: 0,
                        message: "Implied global '" + global + "'",
                        source: 'jshint.implied-globals'
                    });
                });
            }
            if (unuseds) {
                unuseds.forEach(function (unused) {
                    files[result.file].push({
                        severity: 'warning',
                        line: unused.line,
                        column: 0,
                        message: "Unused variable: '" + unused + "'",
                        source: 'jshint.implied-unuseds'
                    });
                });
            }


        });

        out.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        out.push("<checkstyle version=\"4.3\">");

        for (file in files) {
            out.push("\t<file name=\"" + file + "\">");
            for (i = 0; i < files[file].length; i++) {
                issue = files[file][i];
                out.push(
                    "\t\t<error " +
                        "line=\"" + issue.line + "\" " +
                        "column=\"" + issue.column +"\" " +
                        "severity=\"" + issue.severity + "\"" +
                        "message=\"" + encode(issue.message) + "\" " +
                        "source=\"" + encode(issue.source) +"\" " +
                        "/>"
                );
            }
            out.push("\t</file>");
        }

        out.push("</checkstyle>");

        process.stdout.write(out.join("\n") + "\n");
    }
};
