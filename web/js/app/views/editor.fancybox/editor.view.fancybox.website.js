(function(FancyBox) {

	FancyBox.Views = FancyBox.Views || {};
	FancyBox.Views.FancyBox = FancyBox.Views.FancyBox || {};
	
	FancyBox.Views.FancyBox.Website = FancyBox.Views._Fancybox.extend({
	
	initialize: function(){
		FancyBox.Views._Fancybox.prototype.initialize.call(this); //This is like calling super()
	},
	more : function(){

		//call parent MORE method to lay out metadata
			FancyBox.Views._Fancybox.prototype.more.call(this);

		if(this.model.get("title") == this.model.get("description")){
			$('#fancybox-media-container .description').hide();
		}

		return false;
	},
	less : function(){

			//call parent MORE method to lay out metadata
			FancyBox.Views._Fancybox.prototype.less.call(this);

		$('#fancybox-media-container .description').show();

		return false;
	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		sessionStorage.setItem('currentItemId', this.model.id);
		
		//Call parent class to do captioning and metadata
		FancyBox.Views._Fancybox.prototype.render.call(this, obj); //This is like calling super()

		
		var parts=this.model.get("attribution_uri").split('http');
		
		//Fill in media-specific stuff
		var blanks = {
			original_src :"http"+parts[parts.length-1],
			src: this.model.get("attribution_uri"),
			type : this.model.get("type"),
		};
		
		//use template to clone the database items into
		var template = _.template( this.getMediaTemplate() );
		
		//copy the cloned item into the el
		var mediaHTML =  template( blanks ) ;

		$(this.el).find('.fancybox-media-item').html(mediaHTML); 

		//set fancybox content
		obj.content = $(this.el);
		
		return this;
	},
	getMediaTemplate : function()
	{
		
		var html =	'<div class="website-caption"><%=type%>: <a href="<%=original_src%>" target="_blank"><%=original_src%></a></div>'+
					'<div id="fancybox-website">'+
					'<iframe type="text/html" width="100%" height="400px" src="<%=src%>" frameborder="0">'+
					'</iframe>'+
					'</div>';
								
		return html;
	},

});
	
})(zeega.module("fancybox"));