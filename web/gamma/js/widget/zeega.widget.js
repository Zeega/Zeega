
var widget = {
	init: function(){
	
		$('#add-item').click(function(){
			 $(this).fadeOut();
			 postdata={ widgetId:$('#widget-wrapper').data('id') }

			 $.post(URL_PREFIX+'widget/persist',postdata,function(data){
			 	$('#message').html('Media successfuly added to your Zeega Collection');
			 	$('#collection').prepend('<img style="border: solid 1px white;" src="'+data+'" width="80px" height="80px"/>');
			 });
			 
			return false;
		
		});
	},
	

}


$('document').ready(function(){widget.init();});