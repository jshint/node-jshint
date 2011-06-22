var sys = require('sys');

function reporter(results, data) {
    var len = results.length,
        str = '',
        file, error;

    results.forEach(function (result) {
        file = result.file;
        error = result.error;
        str += file  + ': line ' + error.line + ', col ' +
            error.character + ', ' + error.reason + '\n';
    });

    sys.puts(len > 0 ? (str + "\n" + len + ' error' + ((len === 1) ? '' : 's')) : "Lint Free!");
    process.exit(len > 0 ? 1 : 0);
}

module.exports = {
    reporter: reporter
};
