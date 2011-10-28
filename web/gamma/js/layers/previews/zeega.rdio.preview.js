function rdioPreview(attr,zIndex){



	
		if(!attr.y)attr.y=0;
		if(!attr.y)attr.x=0;
		if(!attr.y)attr.w=100;
		if(!attr.aspect)attr.aspect=1.33;
		


		//make dom object
	console.log('drawing rdio preview');
		var div= $('<div>');
		
		var h=Math.floor(attr.w*1.5/attr.aspect);
		var cssObj = {
			'backgroundImage':'url(http://alpha.zeega.org/images/items/'+attr.item_id+'_s.jpg)',
			'backgroundSize': '400px 400px',
			'position' : 'absolute',
			'top' : 0,
			'left' : 0,
			'z-index' : zIndex,
			'width' : attr.w+"%",
			'height' : h+"%",
			'opacity' : attr.opacity
		};
		
		
			div.css(cssObj);
			
		//draw to the workspace
		$('#workspace').append(div);
		
		
	}