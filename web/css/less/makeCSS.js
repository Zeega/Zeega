var less = require('less');

var parser = new(less.Parser)({
    //paths: ['.', './lib'], // Specify search paths for @import directives
    filename: 'test.less' // Specify a filename, for better error messages
});

parser.parse('test.less', function (e, tree) {
    tree.toCSS({ compress: true }); // Minify CSS output
    console.log(tree.toCSS({compress:true}));
});