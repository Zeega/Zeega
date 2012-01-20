/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	
	//libraries	
	
	
	'order!libraries/jquery/jquery-1.7.1.min',
	'order!libraries/underscore/underscore-min',
	'order!libraries/backbone/backbone-min',
	'order!libraries/jquery-easing/jquery.easing.1.3',
	'order!libraries/jquery.fancybox-1.3.4/fancybox/jquery.easing-1.3.pack',
	'order!libraries/jquery.fancybox-1.3.4/fancybox/jquery.fancybox-1.3.4.pack',
	'order!libraries/jquerySVG/jquery.svg',
	'order!libraries/jquery-ui-1.8.16.custom/js/jquery-ui-1.8.16.custom.min',
	'order!libraries/spin',
	'order!libraries/spin-jquery',
	'order!libraries/OpenLayers-2.11/OpenLayers',
	'order!libraries/date.format',


	//mvc
	
	'order!backbone/discoveryViews',
	'order!backbone/eventViews',
	'order!backbone/itemViews/itemViews',
	'order!backbone/itemViews/tweetViews',
	'order!backbone/itemViews/videoViews',
	'order!backbone/itemViews/audioViews',
	'order!backbone/itemViews/websiteViews',
	'order!backbone/tagViews',
	'order!backbone/Models',
	'order!backbone/Views',
	'order!backbone/itemViews/documentViews',
	'order!backbone/itemViews/imageViews',

	
	//custom
	
	'order!ux/utils',


		
	//core
	
	'order!search',

	
	];

require(loadFiles, function(jquery)
{
    console.log('ALL JS LOADED')
	
});

