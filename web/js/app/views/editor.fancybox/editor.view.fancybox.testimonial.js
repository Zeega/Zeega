(function(FancyBox) {

	FancyBox.Views = FancyBox.Views || {};
	FancyBox.Views.FancyBox = FancyBox.Views.FancyBox || {};
	
	FancyBox.Views.FancyBox.Testimonial = FancyBox.Views._Fancybox.extend({


	initialize: function(){

		FancyBox.Views._Fancybox.prototype.initialize.call(this); //This is like calling super()

	},

	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{

		//Call parent class to do captioning and metadata
		FancyBox.Views._Fancybox.prototype.render.call(this, obj); //This is like calling super()
		var text = this.model.get('text').replace(/\r\n/gi, '<br/>');


		//Fill in text-specific stuff
		var blanks = {
			text : text,

		};

		//use template to clone the database items into
		var template = _.template( this.getMediaTemplate() );FancyBox

		//copy the cloned item into the el
		var tweetHTML =  template( blanks ) ;

		$(this.el).find('.fancybox-media-item').html(tweetHTML);

		//set fancybox content
		obj.content = $(this.el);




		return this;
	},
	getMediaTemplate : function()
	{

		var html =	'<p class="fancybox-testimonial"><i class="jdicon-testimonial" style="margin-right:20px;margin-bottom:20px"></i><%= text %></p>';

		return html;
	},
	});

})(zeega.module("fancybox"));