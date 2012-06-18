var Path = require('path'),
	aggregate = require('./node/triggerAggregate'),
	config = require('./aggregate_conf.js')

config.uglify = true;
aggregate.trigger(config)
