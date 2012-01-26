/*
	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here
*/

//	stuff that has to happen after the js fully loads

function initUX()
{
    $('#add-item').click(function(){
    	 $(this).fadeOut();
    	 postdata={ widgetId:$('#widget-wrapper').data('id') }

    	 $.post(sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'widget/persist',postdata,function(data){
    	 	if(data!=0){
    	 		$('#message').html('Media successfuly added to your Zeega Collection');
    	 		$('#collection').prepend('<img style="border: solid 1px white;" src="'+data+'" width="80px" height="80px"/>');
    		}
    		else{
    			$('#message').html('Unable to add Media to your Zeega Collection');
    		}
    	});

    	return false;
    });
}




