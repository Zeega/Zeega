
function parseAddress(result){
		
		var addy=result.formatted_address.split(',');
		var index = addy.length;
		var address = new Object();
		address.complete=result.formatted_address;
		address.location=result.geometry.location;

		
		
		if(index>2){
		
			address.city=addy[index-3].replace(/^\s+/, '');
			if(addy[index-1]==" USA") address.state=addy[index-2].substr(1,2);
			else address.state=addy[index-2];
		}
		else if(index==2){
			address.city=addy[0].replace(/^\s+/, '');
			address.state=addy[1];
		}
		else{
			address.city="n/a";
			address.state="n/a";
		}
		return address;
	}

var widget = {
	init: function(){
	
		$('#add-item').click(function(){
		
			 for(var i=0;i<$('#import-item').data('count');i++){
				 $(this).fadeOut();
				 console.log('form submitted');
				 postdata={
					widgetId:$("#import-item img:nth-child(2)").data('id'),
				 }
				 console.log(postdata);
				 $.post(URL_PREFIX+'widget/persist',postdata,function(data){
					console.log(data);
					$('#add-item').fadeOut();
					//$('#message').html('Media Successfuly Added');
					$('#collection').prepend('<img style="border: solid 1px white; padding:2px;" src="http://core.zeega.org/images/items/'+data+'_s.jpg" width="72px" height="72px"/>');
				 
				 });
			}
			return false;
		
		});
	},


}


$('document').ready(function(){widget.init();});