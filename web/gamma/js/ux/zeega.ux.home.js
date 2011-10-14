/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads

function initUX(){
	initHeaderUX();


}

$(document).ready(function() {
	

	$('#add-playground').click(function(){ console.log('clicl');$('#playground-add').fadeIn('fast'); return false;});
	$('#playground-add-cancel').click(function(){$('#playground-add').fadeOut(); return false;});

});