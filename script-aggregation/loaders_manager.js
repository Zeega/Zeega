var Path = require('path'),
	requirejs = require(__dirname + '/node/node_modules/requirejs'),
	fs = require('fs'),
    createLoaders = function(config)
    {
        for(var ci in config.convert)
        {
            configFile = config.convert[ci].input;
            
            var data = fs.readFileSync(Path.join(__dirname,"/../",configFile), 'ascii');
            data = data.replace(/order\!\.\./g,"web/js");
            data = data.replace(/order\!/g,"web/js/");
            data = data.replace(/\',/g,".js',");
    
            newConfigFile = configFile.replace(/\.js/g,"_min.js");
            config.convert[ci].input =  newConfigFile;
            fs.writeFileSync(Path.join(__dirname,"/../",newConfigFile), data);
        };
    },
    deleteLoaders = function(config)
    {
        for(var ci in config.convert)
        {
            fs.unlinkSync(Path.join(__dirname,"/../", config.convert[ci].input));
        };
    }
    

exports.create = createLoaders;
exports.destroy = deleteLoaders;
