(function(Fancybox) {

	// This will fetch the tutorial template and render it.
	Fancybox.Views.SoundCloud = Fancybox.Views._Fancybox.extend({
		initialize: function()
		{
			Fancybox.Views._Fancybox.prototype.initialize.call(this); //This is like calling super()
		},
		/* Pass in the element that the user clicked on from fancybox.  */
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		sessionStorage.setItem('currentItemId', this.model.id);
		
		//Call parent class to do captioning and metadata
		Fancybox.Views._Fancybox.prototype.render.call(this, obj); //This is like calling super()

		var src = encodeURI( this.model.get('uri').slice(0, this.model.get('uri').indexOf('/stream')) );
		//Fill in media-specific stuff
		var blanks = {
			src : src,
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
	afterShow:function(){
		
	},
	
	beforeClose: function(){

	},
	getMediaTemplate : function()
		{

			var html =	'<div id="fancybox-soundcloud">'+
						'<iframe width="100%" height="166" scrolling="no" frameborder="no" src="http://w.soundcloud.com/player/?url=<%= src %>&show_artwork=true"></iframe>'+
						'</iframe></div>';

			return html;
		}
		
	});
	
})(zeegaBrowser.module("fancybox"));