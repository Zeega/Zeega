/*

	zeega.ux.header.js
	
	jquery ux for page header


*/

//	stuff that has to happen after the js fully loads
function initHeaderUX(){
		
	/************
	
	UNSUPPORTED BROWSER - todo - move to somewhere else so displays for non-logged in
	header too

	IF EDITOR - let in Chrome & Safari only, no mobile
	*************/

	if (typeof BrowserDetect !== 'undefined') {

		//Send mobile devices to custom page
		if (BrowserDetect.isMobile){
			//TODO
		}
		else if(BrowserDetect.browser!='Chrome'&&BrowserDetect.browser!='Safari') {

			$('#unsupported-browser-data').html('<div class="browser-logo-'+BrowserDetect.browser.toLowerCase() +'"></div><br/>Version ' + BrowserDetect.version + ' of the browser ' +
			BrowserDetect.browser + ' on ' + BrowserDetect.OS);
			$('#unsupported-browser').modal();
		}

	}
	
	

    $('.drop-down').click(function(){
		if( $(this).hasClass('open') ) $(this).removeClass('open');
		else{ $(this).addClass('open');
		
			var that=$(this);
			$('body').bind('click',function(){that.removeClass('open');$(this).unbind();});
			return false;
		}
	});
	

}

