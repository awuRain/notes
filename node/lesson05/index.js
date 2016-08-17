var Q = require('q');
var path = require('path');
var fs = require('fs');

function readFile(previous, fileName) {
    return Q.promise(function (resolve, reject) {
        fs.readFile(path.join(process.cwd(), fileName),
            function (error, text) {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(previous + text.toString());
                }
            });
    });
}

readFile('', '1.txt')
    .then(function (previous) {
        return readFile(previous, '2.txt');
    })
    .then(function (finalText) {
        console.log(finalText);
    })
    .catch(function (error) {
        console.log(error);
    })
    .done();

// 所以说是不是还是要看一看 https://github.com/alsotang/node-lessons/tree/master/lesson17 呢？
