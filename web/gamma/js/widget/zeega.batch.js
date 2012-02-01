
var widget = {
	init: function(){
	
		$('#add-item').click(function(){
			 $(this).fadeOut();
			 for(var i=1;i<=$('#import-item').data('count');i++){
				 postdata={ widgetId:$("#import-item img:nth-child("+i+")").data('id') }
				 $.post(sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'widget/persist',postdata,function(data){
				    $('#message').html('Media successfuly added to your Zeega Collection');
					if(data!=0) $('#collection').prepend('<img style="border: solid 1px white;" title="none" src="'+data+'" width="80px" height="80px"/>');
				 });
			}
			return false;
		
		});
	},


}


$('document').ready(function(){widget.init();});