/**  LAYER GLOBAL EVENT LISTENERS  **/

var LayerGlobals = new Array();

function addGlobal(layerId,event,elementId){
		if(!LayerGlobals[layerId])LayerGlobals[layerId]={};
		eval('LayerGlobals[layerId].'+event+'= function(data){$("#'+elementId+'").trigger("'+event+'",data);}');
}



//Utilities
function getHost()
{
    return  window.location.protocol + "//" + window.location.host;        
}

function getBaseURL()
{
    var currPath = window.location.pathname.split("/");        
    var splitIdx = currPath.indexOf("/web/");        
    var urlPath = window.location.pathname.substring(0,splitIdx+4);
    
    return  urlPath;
}

function convertTime(seconds){
	
	var m=Math.floor(seconds/60);
	var s=Math.floor(seconds%60);
	if(s<10) s="0"+s;
	return m+":"+s;
}

function deconvertTime(minutes,seconds){

	return 60*minutes+parseInt(seconds);
}

function getMinutes(seconds){

	return Math.floor(parseInt(seconds)/60.0);
}

function getSeconds(seconds){

	var s=Math.floor((seconds%60)*10)/10.0;
	if(s<10) s="0"+s;
	return s;

}

function isInt(x) {
	   var y=parseInt(x);
	   if (isNaN(y)) return false;
	   return x==y && x.toString()==y.toString();
}

function isPercent(x){

	return isInt(x)&&parseInt(x)<=100;

}

function deepCopy(p,c) {
	var c = c||{};
	for (var i in p) {
		if (typeof p[i] === 'object')
		{
			c[i] = (p[i].constructor === Array)?[]:{};
			deepCopy(p[i],c[i]);
		} else c[i] = p[i];
	}
	return c;
}

// make capital case
String.prototype.toCapitalCase = function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();

}

// objectify localStorage
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

String.prototype.toRGB = function()
{
	var cutHex = function(h){ return (h.charAt(0)=="#") ? h.substring(1,7) : h }
	var rgb = '';
	rgb += parseInt( ( cutHex(this) ).substring( 0,2 ) , 16 ) +',';
	rgb += parseInt( ( cutHex(this) ).substring( 2,4 ) , 16 ) +',';
	rgb += parseInt( ( cutHex(this) ).substring( 4,6 ) , 16 );
	return rgb;
}

