var Path = require('path'),
	requirejs = require(__dirname + '/node_modules/requirejs'),
	watcher = require('./watcher'),
	aggregate = function(config){
		var uglify = (config.uglify)?"uglify":"none";
		for(var ci in config.convert){
			var convertProfile = {
				name:config.convert[ci].input,
				out:config.convert[ci].output,	
			};
			convertProfile.baseUrl  = '.';
			convertProfile.optimize = uglify;

			var startTime = Date.now();
			console.log("Starting", (config.uglify)?"compressed (slow)":"loose (fast)" ,"aggregation ", parseInt(ci)+1, "of", config.convert.length)
			console.log("  ", config.convert[ci].input, "->", config.convert[ci].output)
			requirejs.optimize(convertProfile, function (buildResponse) {
				var duration = Date.now() - startTime;
			    console.log("   Finished aggregation in ", parseInt(duration/1000), "seconds")
			    console.log("  ", config.convert[ci].message)
			});
		}
	}
exports.trigger = aggregate;