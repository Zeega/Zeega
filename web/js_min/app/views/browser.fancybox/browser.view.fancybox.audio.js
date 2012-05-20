(function(Fancybox) {

	// This will fetch the tutorial template and render it.
	Fancybox.Views.Audio = Fancybox.Views._Fancybox.extend({
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
		
		
		this.unique =Math.floor(Math.random() *10000)
		$(this.el).find('.fancybox-media-item').append($('<div>').attr({id:'fancybox-video-'+this.unique}));
		

		//set fancybox content
		
		obj.content = $(this.el);
		return this;
	},
	afterShow:function(){

		Fancybox.Views._Fancybox.prototype.afterShow.call(this); //This is like calling super()
		var source = this.model.get('uri');
		this.plyr = new Plyr('fancybox-video-'+this.unique,{url:source});

	},
	
	beforeClose: function(){
		this.plyr.destroy();

	},
		
	});
	
})(zeegaBrowser.module("fancybox"));