function textPreview(attr,zIndex){
		//make dom object
		//maybe these should all be wrapped in divs?
		var div = $('<div />');
		var cssObj = {
			'position' : 'absolute',
			'top' : attr.y,
			'left' : attr.x,
			'z-index' : zIndex,//layers.length - i,
			'width' : attr.w,
			'height' : attr.h,
			'font-size' : attr.size + 'px'
		};
		div.addClass('text-layer-container').css(cssObj).attr('id','layer-preview-'+zIndex);

		
		var content = $('<div />').css({'width' : '100%', 
						'height' : '100%', 
		                                'overflow' : 'auto',
						'column-count' : attr.columns,
						'-moz-column-count' : attr.columns,
						'padding-top' : attr.padding + 'px',
						'padding-left' : attr.padding + 'px',
						'padding-right' : attr.padding + 'px',
						'padding-bottom' : attr.padding + 'px',
						'text-indent': attr.indent + 'px',
					        'box-sizing' : 'border-box',
						'-moz-box-sizing' : 'border-box',
						'-webkit-box-sizing' : 'border-box'
		                           })
		                          .addClass('text-layer-content');
		
		content.html(attr.content);
		div.append(content);
		//draw to the workspace
		$('#workspace').append(div);
		//Color and bgColor must be set after adding to the DOM - before, jquery automatically changes rgba colors to rgb
		$('#layer-preview-'+zIndex).children('.text-layer-content')[0].style.color = 'rgba(' + attr.color.join(',') + ')';
		$('#layer-preview-'+zIndex)[0].style.backgroundColor = 'rgba(' + attr.bgColor.join(',') + ')';
		$('#layer-preview-'+zIndex).children('.text-layer-content')[0].style.WebkitColumnCount = attr.columns;
		//$('#layer-preview-'+zIndex).children('.text-layer-content').aloha();
		
        }
	