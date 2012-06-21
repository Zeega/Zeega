var Path = require('path'),
	watcher = require('./node/watcher'),
	aggregate = require('./node/triggerAggregate')
	config = require('./aggregate_conf.js')

watcher.watch(__dirname+'/web/js/', /.*\.js$/,
    function(path) {
    	// value of path var is irrelevant  
		config.uglify = false;
		aggregate.trigger(config)
    }
);
