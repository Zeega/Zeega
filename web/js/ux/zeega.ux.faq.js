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
	
console.log('document is ready!!!')
	$('#new-user').click(function(){$(this).fadeOut('fast'); $('#user-add').fadeIn('fast');});
	
	$('.expander a').click(function(){
		console.log('clicked')
		var content = $(this).closest('li').find('.faq-content');
		if(content.is(':visible')) content.hide('blind',{direction:'vertical'}, 500);
		else content.show('blind',{direction:'vertical'}, 500);
		return false;
	})
	
	

});