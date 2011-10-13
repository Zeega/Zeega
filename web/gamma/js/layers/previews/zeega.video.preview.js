function videoPreview(attr,zIndex){



	
		if(!attr.y)attr.y=0;
		if(!attr.y)attr.x=0;
		if(!attr.y)attr.w=100;
		if(!attr.aspect)attr.aspect=1.33;
		


		//make dom object
	console.log('drawing video preview');
		var div= $('<div>');
		
		var h=Math.floor(attr.w*1.5/attr.aspect);
		var cssObj = {
			'backgroundImage':'url(http://mlhplayground.org/Symfony/web/images/thumbs/'+attr.item_id+'_s.jpg)',
			'backgroundSize': '100px 100px',
			'position' : 'absolute',
			'top' : attr.y+"%",
			'left' : attr.x+"%",
			'z-index' : zIndex,
			'width' : attr.w+"%",
			'height' : h+"%",
			'opacity' : attr.opacity
		};
		
		
			div.css(cssObj);
			
		//draw to the workspace
		$('#workspace').append(div);
		
		
	}