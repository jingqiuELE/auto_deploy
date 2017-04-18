var app = require('express')();
var http = require('http').Server(app);
var shell = require('shelljs');
var request = require('request');

app.post('/refresh', function (req, res) {
    shell.exec("git -C $HUGO_SRC pull", function (code, stdout, stderr) {
        if (code == 0) {
            if (stdout.search("Already up-to-date.") == -1) {
                shell.exec("rm -rf $HUGO_DES/*");
                shell.exec("hugo -d $HUGO_DES -s $HUGO_SRC");
            } else {
                res.send(stdout);
            }
        } else {
            res.send(stderr);
    }});
});

if (typeof process.env.HUGO_SRC == 'undefined'
     || typeof process.env.HUGO_DES == 'undefined') {
    console.error('Please define HUGO_SRC and HUGO_DES in the environment.');
} else {
    http.listen(3000, 'localhost', function () {
        console.log('listening on localhost:3000');
    });
}
