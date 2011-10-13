function geoPreview(attr,zIndex){
		
		//Create dom element


		var div = $('<div>').css({
			'position' : 'absolute',
			'top' : attr.y,
			'left' : attr.x,
			'z-index' : zIndex,
			'width' : attr.w+"%",
			//'height' : attr.h+"%",
			'opacity' : attr.opacity
		});
		
		var img = $('<img>').css({'width':'100%'});
	
		
		//Pull static map image using google api
		
		if(attr.type=='map'){
			var w=Math.floor(7.20*attr.w);
			var h=Math.floor(4.80*attr.h);
			img.attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+attr.lat+","+attr.lng+"&zoom="+attr.zoom+"&size="+w+"x"+h+"&maptype="+attr.mapType+"&sensor=false");
		
		}
		else{
		
			var centerLatLng=new google.maps.LatLng(attr.lat, attr.lng);
			var service=new google.maps.StreetViewService();
			service.getPanoramaByLocation(centerLatLng,50,function(data,status){
				attr.panoId=data.location.pano;
				var x=2;
				var y=1;
				if(attr.pitch>25) y=0;
				else if(attr.pitch<-25) y=2;
				x=(Math.floor((attr.heading+360)/60))%6;
				img.attr('src','http://cbk0.google.com/cbk?output=tile&panoid='+attr.panoId+'&x='+x+'&y='+y+'&zoom=3');
			});
		}
		
		
		div.append(img);
		$('#workspace').append(div);
		
		
	}
	
	