function imagePreview(attr,zIndex){
		//make dom object
		//maybe these should all be wrapped in divs?
		var div = $('<div>');
		var cssObj = {
			'position' : 'absolute',
			'top' : attr.y  +'%',
			'left' : attr.x  +'%',
			'z-index' : zIndex,
			'width' : attr.w+'%',
			'opacity' : attr.opacity
		};
		
		div.css(cssObj);

		var img=$('<img>')
			.attr({'src':attr.url})
			.css({'width':'100%'});
		
		this.dom = div;
		
		//make dom
		div.append(img);
		//add to dom
		$('#workspace').append(div);
	}
	