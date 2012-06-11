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

	$('.add-media a').click(function(){
		$('#add-media').toggleClass('show');
		$('body').on('click',function(){
			$('#add-media').removeClass('show');
		});
		return false;
	});
	
	$('.new-project').click(function(){
		$.ajax({
				url:  sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'sites/'+ sessionStorage.getItem('siteId') +'/project',
				type: 'POST',
				success: function(data){
				console.log(data);
				window.location= sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  +'site/'+  sessionStorage.getItem('siteShort') +'/project/'+data;
			}
		});
		
	});
	
	$('#book-three').find('a').attr('href',"javascript:(function(){var head=document.getElementsByTagName('body')[0],script=document.createElement('script');script.id='zeegabm';script.type='text/javascript';script.src='" + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  + "js/widget/zeega.bookmarklet.js?' + Math.floor(Math.random()*99999);head.appendChild(script);})(); void 0");

	
	/* allows for forms to be placed in the bug report form to be submitted */
	$('.bug-report').click(function(e){
		e.stopPropagation();
		return false;
	})
	$('.bug-report .submit-bug').click(function(){
		// submit form
		//close dropdown
		$(this).closest('.dropdown.open').removeClass('open');
		//confirmation?
	})

}

