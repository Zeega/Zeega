/*

	zeega.ux.header.js
	
	jquery ux for page header


*/

//	stuff that has to happen after the js fully loads
function initHeaderUX(){
		
	/************  
	UNSUPPORTED BROWSER - todo - move to somewhere else so displays for non-logged in
	header too 
	
	IF COMMUNITY PAGES - let in most everyone, test to see who NOT to let in, right now just IE

	IF EDITOR - let in Chrome & Safari only, no mobile
	*************/
	if (window.location.href.indexOf('community') >= 0){
		if(BrowserDetect.browser == 'explorer' && BrowserDetect.version < 9) {

			$('#unsupported-browser-data').html('<div class="browser-logo-'+BrowserDetect.browser.toLowerCase() +'"></div><br/>Version ' + BrowserDetect.version + ' of the browser '
												+ BrowserDetect.browser + ' on ' + BrowserDetect.OS);
			$('#unsupported-browser').modal();
		}
	} else if (typeof BrowserDetect !== 'undefined') {

		//Send mobile devices to custom page
		if (BrowserDetect.isMobile){
			//TODO
		}
		else if(BrowserDetect.browser!='Chrome'&&BrowserDetect.browser!='Safari') {

			$('#unsupported-browser-data').html('<div class="browser-logo-'+BrowserDetect.browser.toLowerCase() +'"></div><br/>Version ' + BrowserDetect.version + ' of the browser '
												+ BrowserDetect.browser + ' on ' + BrowserDetect.OS);
			$('#unsupported-browser').modal();
		}

	}
	
	/************  BUG REPORT **********************/
	
	
	$('.bug-report').click(function(e){e.stopPropagation();});
	
	$('.bug-report').parent().click(function(){
		$('.bug-unsubmitted').show();
		$('.bug-submitted').hide();
	});
	
	$('.close-bug').click(function(){
		$('.bug-report').parent().trigger('click');
	});
	
	
	$('.submit-bug').click(function(){
		

		
		var bug = new Backbone.Model({
		
			url:window.location.href,
			hash: window.location.hash.substr(1),
			description: $('.bug-description').val(),
			email: $('.bug-email').val(),
			login:sessionStorage.getItem('user')
		
		});
		
		if(!_.isUndefined(window.BrowserDetect)){
		
			bug.browser=BrowserDetect.browser;
			bug.version=BrowserDetect.version;
			bug.os=BrowserDetect.OS;
		
		}
		
		bug.url = sessionStorage.getItem("hostname") + sessionStorage.getItem("directory") + "bugs/report.php";
		bug.save();
		$('.bug-description').attr('value','');
		$('.bug-unsubmitted').fadeOut('fast',function(){
				$('.bug-submitted').fadeIn();
		});
	
	});
		
	
   	//dropdown menu
    $('.drop-down').click(function(){
		if( $(this).hasClass('open') ) $(this).removeClass('open');
		else{ $(this).addClass('open');
		
			var that=$(this);
			$('body').bind('click',function(){that.removeClass('open');$(this).unbind();});
			return false;
		}
	});
	
	$('#header-add-media').click(function(){
		$('#add-media').modal();
		return false;
	});

}

