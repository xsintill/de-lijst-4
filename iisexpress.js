var execFile = require('child_process').execFile;

var iisExpressExe = 'C:\\Program Files (x86)\\IIS Express\\iisexpress.exe';

var args = [
    '/port:65395',
    '/path:C:\\Users\\xsintill\\Documents\\Visual Studio 2015\\Projects\\de-lijst-3\\de-lijst-3\\FilmsApi'
];

var childProcess = execFile(iisExpressExe, args, {});

childProcess.stdout.on('data', function(data) {
    console.log(removeTrailingLinebreak(data));
});

childProcess.stderr.on('data', function(data) {
    console.log(removeTrailingLinebreak(data));
});

var removeTrailingLinebreak = function (input) {
    return input.replace(/\s+$/, '');
}