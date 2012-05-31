/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads
function initUX(){
	initHeaderUX();
	
	$('.user-editable').editable(
			function(value,settings)
			{
			
				return value; //must return the value!!
			},
			{
				indicator : 'Saving...',
				tooltip   : 'Click to edit...',
				indicator : '<img src="images/loading.gif">'
			});
}


$(document).ready(function() {
	
	$('#password-change-button').click(function(){ $('#password-change').fadeIn('fast'); return false;});
	$('#password-change-cancel').click(function(){$('#password-change').fadeOut(); return false;});

});