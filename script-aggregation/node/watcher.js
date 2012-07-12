var fs = require('fs');

function watchGivenFile (path, callback) {
    fs.watchFile(path, {interval: 500}, function(curr, prev) {
        if (curr.mtime.getTime() === prev.mtime.getTime())
            return
        callback(path)
    })
}

function watchDirectory(path, ext, callback) {    
    fs.stat(path, function(err, stats){
        if(err) {
            console.error('Error retrieving stats for file: ' + path)
        } else {
            if(stats.isDirectory()) {
                fs.readdir(path, function(err, fileNames) {
                    if(err) {
                        console.error('Error reading path: ' + path)
                    }
                    else {
                        fileNames.forEach(function (fileName) {
                            watchDirectory(path + '/' + fileName, ext, callback)
                        });
                    }
                });
            } else {
                if (ext.test(path)) {
                    watchGivenFile(path, callback)
                }
            }
        }
    })
}

exports.watch = watchDirectory;