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
	

	$('.project-delete').click(function(){if(confirm('Delete Project?')){
		$(this).parent().fadeOut(); var id =$(this).data('id'); 
	
		$.ajax({
				url: window.URL_PREFIX+'projects/'+id,
				type: 'DELETE',
				success: function(){
				console.log('done');
			}
		});
		}
	});

});