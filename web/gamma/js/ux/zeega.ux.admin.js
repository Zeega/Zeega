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
	/*
	$('.user-remove').click(function(){if(confirm('Remove User?')){
		$(this).parent().fadeOut(); var user =$(this).data('user'); var playground=$(this).data('playground');
	
		$.ajax({
				url: window.URL_PREFIX+'playgrounds/'+playground+'/users/'+user,
				type: 'DELETE',
				success: function(){
				console.log('done');
			}
		});
		}
	});
	*/

	$('#new-user').click(function(){ $('#new-user-add').fadeIn('fast'); return false;});
	$('#add-user').click(function(){ $('#user-add').fadeIn('fast'); return false;});
	$('#user-add-cancel').click(function(){$('#user-add').fadeOut(); return false;});
	$('#new-user-add-cancel').click(function(){ $('#new-user-add').fadeOut(); return false;});
});