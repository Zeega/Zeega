/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES

*********************************************/

var loadFiles = [
	'jquery',
	'order!js/layers/previews/zeega.video.preview.js',
	'order!js/layers/previews/zeega.image.preview.js',
	'order!js/layers/previews/zeega.geo.preview.js',
	'order!js/layers/previews/zeega.text.preview.js',
	'order!js/layers/previews/zeega.rdio.preview.js',
	'order!helpers/zeega.helpers',
	];

require(loadFiles, function($) {


	var nodeId = window.location.hash.substr(1);

	$.getJSON(getHost() + '/test/web/app_dev.php/nodes/'+nodeId+'/layers',function(data){

		console.log(data);
		console.log(data[0].attr);

		for( var i = 0 ; i < data.length ; i++ )
		{
			if(data[i].type=="Video"||data[i].type=="Youtube") videoPreview(data[i].attr,100);
			else if(data[i].type=="Image") imagePreview(data[i].attr,100);
			else if(data[i].type=="Geo") geoPreview(data[i].attr,100);
			else if(data[i].type=="Text") textPreview(data[i].attr,100);
			else if(data[i].type=="Rdio") rdioPreview(data[i].attr,100);
		}



	});

});
