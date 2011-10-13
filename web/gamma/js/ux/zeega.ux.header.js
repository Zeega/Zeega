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
	
	$('#add-media').toggle(function(){$('#add-media').fadeIn('fast');},function(){$('#add-media').fadeOut('fast');});

}


