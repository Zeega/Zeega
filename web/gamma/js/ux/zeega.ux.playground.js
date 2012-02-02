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
		var id =$(this).data('id'); 
		$('.project-'+id).fadeOut(); 
		$.ajax({
				url: sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'projects/'+id,
				type: 'DELETE',
				success: function(){
				console.log('done');
			}
		});
		}
	});
	
	
	$('.projects').click(function(){$('.projects').css({'opacity':0.6, 'cursor':'pointer'});$(this).css({'opacity':1}); $('.projects-container').hide(); $('.'+$(this).attr('id')+'-container').show();console.log('#'+$(this).attr('id')+'-container');});
	
	$('#new-project').click(function(){
		
		$.ajax({
				url:  sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'playgrounds/'+ sessionStorage.getItem('playgroundId') +'/project',
				type: 'POST',
				success: function(data){
				console.log(data);
				window.location= sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  +'playground/'+  sessionStorage.getItem('playgroundShort') +'/project/'+data;
			}
		});
		
	});
	


});