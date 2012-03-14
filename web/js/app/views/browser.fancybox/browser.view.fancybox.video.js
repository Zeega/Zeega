(function(Fancybox) {

	// This will fetch the tutorial template and render it.
	Fancybox.Views.Video = Fancybox.Views._Fancybox.extend({
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
						src : this.model.get('uri'),
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

			var html =	'<div id="fancybox-video">'+
							'<video controls="true"  width="90%" preload><source src="<%=src%>"></video>'+
						'</div';

			return html;
		}
	});
	
})(zeegaBrowser.module("fancybox"));