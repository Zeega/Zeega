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
	
	
	$('#go-button').click(function(){$('#search-form').trigger('submit');});

	$('#new-user').click(function(){$(this).fadeOut('fast'); $('#user-add').fadeIn('fast');});

});