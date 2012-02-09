/*

	zeega.ux.header.js
	
	jquery ux for page header


*/

//	stuff that has to happen after the js fully loads
function initHeaderUX(){
   	//dropdown menu
    $('.drop-down').click(function(){
		if( $(this).hasClass('open') ) $(this).removeClass('open');
		else{ $(this).addClass('open');
		
			var that=$(this);
			$('body').bind('click',function(){that.removeClass('open');$(this).unbind();});
			return false;
		}
	});
	
	// FAKE STUFF
	
	$('#css-change').toggle(function(){
		$('body').css('background','#fff');
		$('#route-header').css('color','#444')
		$(this).find('a').html('Desktop');
		$('.item-title').css('color','black');
	},function(){
		$('body').css('background','');
		$('#route-header').css('color','')
		$(this).find('a').html('Presentation');
		$('.item-title').css('color','white');
	});
	
	

	$('.add-media').click(function(){
		$('#add-media').fadeIn('fast');
		$('body').bind('click',function(){
			$('#add-media').fadeOut();
			$(this).unbind();
		});
		return false;
	});
	
	$('.new-project').click(function(){
		$.ajax({
				url:  sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'playgrounds/'+ sessionStorage.getItem('playgroundId') +'/project',
				type: 'POST',
				success: function(data){
				console.log(data);
				window.location= sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  +'playground/'+  sessionStorage.getItem('playgroundShort') +'/project/'+data;
			}
		});
		
	});
	
	$('#book-three').find('a').attr('href',"javascript:(function(){var head=document.getElementsByTagName('body')[0],script=document.createElement('script');script.id='zeegabm';script.type='text/javascript';script.src='" + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  + "js/widget/zeega.bookmarklet.js?' + Math.floor(Math.random()*99999);head.appendChild(script);})(); void 0");

}

