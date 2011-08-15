/*jshint node: true */
var _sys = require('sys');

module.exports = 
{
    reporter: function (results, data) {
        var len = results.length,
            str = '',
            file, error, globals, unuseds;

        results.forEach(function (result) {
            file = result.file;
            error = result.error;
            str += file  + ': line ' + error.line + ', col ' +
                error.character + ', ' + error.reason + '\n';
        });

        str += len > 0 ? ("\n" + len + ' error' + ((len === 1) ? '' : 's')) : "Lint Free!";

        data.forEach(function (data) {
            file = data.file;
            globals = data.implieds;
            unuseds = data.unused;

            if (globals || unuseds){
                str += '\n\n' + file  + ' :\n';
            }
            
            if (globals) {
                 str += '\tImplied globals:\n';
                globals.forEach(function (global) {
                    str += '\t\t' + global.name  + ': ' + global.line + '\n';
                });
            }
            if (unuseds) {
                str += '\tUnused Variables:\n\t\t';
                unuseds.forEach(function (unused) {
                    str += unused.name + '(' + unused.line + '), ';
                });

            }
        });

        _sys.puts(str);

        process.exit(len > 0 ? 1 : 0);
    }
};