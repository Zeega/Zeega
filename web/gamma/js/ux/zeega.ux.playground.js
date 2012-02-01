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
	
	$('#instructions').html("To begin collecting media, drag this <a href=\"javascript:(function(){var head=document.getElementsByTagName('body')[0],script=document.createElement('script');script.id='zeegabm';script.type='text/javascript';script.src='" + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  + "gamma/js/widget/zeega.bookmarklet.js?' + Math.floor(Math.random()*99999);head.appendChild(script);})(); void 0\">Z</a> to your browser's bookmark bar.<br><br> Whenever you come across media that you would like to add to your collections, simply click on the link in your browser bar.");
	

});