(function(FancyBox) {

	FancyBox.Views = FancyBox.Views || {};
	FancyBox.Views.FancyBox = FancyBox.Views.FancyBox || {};
	
	FancyBox.Views.FancyBox.Mapbox = FancyBox.Views._Fancybox.extend({
		
		initialize: function()
		{
			FancyBox.Views._Fancybox.prototype.initialize.call(this); //This is like calling super()
		},
		
		/* Pass in the element that the user clicked on from fancybox. */
		render: function(obj)
		{

			sessionStorage.setItem('currentItemId', this.model.id);
			console.log('this model id is'+this.model.id);
			//Call parent class to do captioning and metadata
			FancyBox.Views._Fancybox.prototype.render.call(this, obj); //This is like calling super()

			console.log(this.model);
			//Fill in image-specific stuff
			var blanks = {
				src : this.model.get('thumbnail_url'),
				title : this.model.get('title'),
			};

			//use template to clone the database items into
			var template = _.template( this.getMediaTemplate() );

			//copy the cloned item into the el
			var imageHTML =  template( blanks ) ;

			$(this.el).find('.fancybox-media-item').html(imageHTML);

			//set fancybox content
			obj.content = $(this.el);

			return this;
		},
		getMediaTemplate : function()
		{

			var html =	''+
							'<img src="<%=src%>" title="<%=title%>" alt="<%=title%>"/>'+
						'';

			return html;
		}
	});
	
})(zeega.module("fancybox"));