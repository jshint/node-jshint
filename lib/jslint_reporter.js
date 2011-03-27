// Author: Vasili Sviridov
// http://github.com/vsviridov
function reporter(results) {
    "use strict";
    console.log("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
    console.log("<jslint>");

    var files = {},
        pairs = {
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
            "<": "&lt;",
            ">": "&gt;"
        },
        file, i, issue;
	
    function encode(s) {
        for (var r in pairs) {
            s = s.replace(new RegExp(r, "g"), pairs[r]);
        }
        return s;
    }

    results.forEach(function (result) {
        if (!files[result.file]) {
            files[result.file] = [];
        }
        files[result.file].push(result.error);
    });
	
    for (file in files) {
        console.log(file);
        console.log("\t<file name=\"%s\">", file);
        for (i = 0; i < files[file].length; i++) {
            issue = files[file][i];
            console.log("\t\t<issue line=\"%d\" char=\"%d\" reason=\"%s\" evidence=\"%s\" />", issue.line, issue.character, encode(issue.reason), encode(issue.evidence));
        }
        console.log("\t</file>");
    }

    console.log("</jslint>");
}
