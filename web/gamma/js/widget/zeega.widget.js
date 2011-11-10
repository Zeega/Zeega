
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
    function getHost()
    {
        return  window.location.protocol + "//" + window.location.host;        
    }
var widget = {
	init: function(){
	
		$('#add-item').click(function(){
			 $(this).fadeOut();
			 console.log('form submitted');
			 postdata={
			 
			 widgetId:$('#widget-wrapper').data('id'),
			 
			 }
			 console.log(postdata);
			 console.log(URL_PREFIX+'widget/persist');
			 $.post(URL_PREFIX+'widget/persist',postdata,function(data){
			 	console.log(data);
			 	$('#add-item').fadeOut();
			 	$('#message').html('Media successfuly added to your Zeega Collection');
			 	$('#collection').prepend('<img style="border: solid 1px white;" src="' + getHost() + '/images/items/'+data+'_s.jpg" width="80px" height="80px"/>');
			 
			 });
			return false;
		
		});
	},
	
	initmap:function(){
		var that=this;
		if($('#zeega-lat').val()){
		this.centerLatLng=new google.maps.LatLng($('#geo-lat').val(),$('#geo-lng').val());
		}
		else{
		this.centerLatLng=new google.maps.LatLng(43,-110);
		}
		
		var mapOptions = {
			zoom: 10,
			center: this.centerLatLng,
			mapTypeId:google.maps.MapTypeId.ROADMAP,
			streetViewControl:false,
			mapTypeControl:false,
			disableDoubleClickZoom: true,
			
		};
		this.geocoder = new google.maps.Geocoder();
		this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		
		$('#sphereSelection').change(function(){console.log($(this).val());if($(this).val()!=-1) $('.multi-save-button').attr('value',"Add to "+$(this).val()+" database").fadeIn();});
		
		this.marker = new google.maps.Marker({position:this.centerLatLng,draggable:true,map:this.map});
		google.maps.event.addListener(that.marker,'drag', function(){ $('#geo-lat').attr('value',that.marker.getPosition().lat());$('#geo-lng').attr('value',that.marker.getPosition().lng());});
		google.maps.event.addListener(that.marker,'dragend', function(){ 
			that.geocoder.geocode({'latLng': that.marker.getPosition()},function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[0]) {
							
								var address=parseAddress(results[0]);
								$('#map-search-input').attr('value',address.complete);
								$('#geo-city').attr('value',address.city);
								$('#geo-state').attr('value',address.state);
							}
						} 
						else console.log("Geocoder failed at drag end: " + status); return 0;
				});
			});
		$('#map-search-submit').click(function(){
			that.geocoder.geocode({'address': $('#map-search-input').val()},function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[0]) {
							
								var address=parseAddress(results[0]);
								$('#map-search-input').attr('value',address.complete);
								$('#geo-city').attr('value',address.city);
								$('#geo-state').attr('value',address.state);
								that.marker.setPosition(address.location);
								$('#geo-lat').attr('value',address.location.lat());
								$('#geo-lng').attr('value',address.location.lng());
							}
						} 
						else console.log("Geocoder failed at drag end: " + status); return 0;
				});
		
		});
		
		
		
		
		
	}


}


$('document').ready(function(){widget.init();});