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

	
	
	
	];

require(loadFiles, function($) {


var nodeId = window.location.hash.substr(1);

$.getJSON('http://alpha.zeega.org/test/web/app_dev.php/nodes/'+nodeId+'/layers',function(data){

console.log(data);
console.log(data[0].attr);

for(var i=0;i<data.length;i++){

if(data[i].type=="Video") videoPreview(data[i].attr,i);
else if(data[i].type=="Image") imagePreview(data[i].attr,i);
else if(data[i].type=="Geo") geoPreview(data[i].attr,i);
else if(data[i].type=="Text") textPreview(data[i].attr,i);

}



});

});
