var less = require('less')
    ,fs = require('fs');

process.chdir('../../web/css/less/editor/');
console.log('New directory: ' + process.cwd());

var parser = new(less.Parser)({
    paths: ['.'], // Specify search paths for @import directives
    filename: 'bootstrap.less' // Specify a filename, for better error messages
});

var currentDirectory = fs.readdirSync('.').filter(function(path){ return /\.less/.test(path); });

for(var i = 0; i <= currentDirectory.length; i++) 
{
    var lessFileName = currentDirectory[i];
    
    if (typeof lessFileName != 'undefined')
    {
        var cssFileName = lessFileName.replace(/\.less/g,".css");

        console.log("Writing " + lessFileName + " to " + cssFileName);

        fs.readFile('bootstrap.less',function(error,data){
            data = data.toString();
            less.render(data, function (e, css) {

                parser.parse(css, function (e, tree) {
                    console.log(tree.toCSS({ compress: true })); // Minify CSS output
                    fs.writeFile('../../bootstrap.css', tree, function(err){
                        console.log('done');
                    });
                });
            });
        });
    }    
}