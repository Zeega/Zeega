var less = require('less'),
    fs = require('fs'),
    compile = function()
    {
        console.log("-------");
        console.log("Converting less files to css");
        var	config = [
            			{
                		    input: 'web/css/less/editor/',
                		    output: '../../zeega.editor.css'
                		},
                		{
                		    input: 'web/css/less/discovery/',
                		    output: '../../zeega.discovery.css'
                		},
                		{
                		    input: '../community/',
                		    output: '../../zeega.community.css'
                		},
                		{
                		    input: '../standalone_player/',
                		    output: '../../zeega.player.css'
                		},
                	];
        
        config.forEach(function(config) {
            var inputDirectory = config.input;
            var outputFile = config.output;

            process.chdir(inputDirectory);
            var data = fs.readFileSync('bootstrap.less','utf8');
            data = data.toString();
            
            less.render(data, function (e, css) {
                var parser = new(less.Parser)({});
                parser.parse(css, function (e, tree) {
                    fs.writeFileSync(outputFile, tree.toCSS({ compress: true }),'utf8');
                    console.log(outputFile);
                });
            });
          
        });
    }
    

exports.run = compile;
