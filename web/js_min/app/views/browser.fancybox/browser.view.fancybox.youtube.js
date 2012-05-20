(function(Fancybox) {

	// This will fetch the tutorial template and render it.
	Fancybox.Views.Youtube = Fancybox.Views._Fancybox.extend({
		
		initialize: function()
		{
			Fancybox.Views._Fancybox.prototype.initialize.call(this); //This is like calling super()
		},
		
		/* Pass in the element that the user clicked on from fancybox. */
		render: function(obj)
		{
			sessionStorage.setItem('currentItemId', this.model.id);

			//Call parent class to do captioning and metadata
			Fancybox.Views._Fancybox.prototype.render.call(this, obj); //This is like calling super()

			//Fill in media-specific stuff
			var blanks = {
				src : 'http://www.youtube.com/embed/' + $(obj.element).attr("href"),
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

			var html =	'<div id="fancybox-youtube media-item">'+
						'<iframe class="youtube-player" type="text/html" width="100%" height="335" src="<%=src%>" frameborder="0">'+
						'</iframe></div>';

			return html;
		}
		
	});
	
})(zeegaBrowser.module("fancybox"));