(function(Layer){

	Layer.Image = Layer.Model.extend({
			
		layerType : 'Image',
		fixedAspectRatio: true,
		scalable:true,
		visual:true,
		defaultAttributes : {
			'title' : 'Image Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33,
			'citation':true,
		}

	});
	
	Layer.Views.Controls.Image = Layer.Views.Controls.extend();

	Layer.Views.Visual.Image = Layer.Views.Visual.extend({
		
		draggable : true,
		
		template : '<img src="<%= attr.uri %>" style="width:100%">',

		render : function()
		{
			this.$el.html( _.template(this.template, this.model.toJSON() ) );
			console.log('ii		image render', this)
						
			return this;
		},
		
		onPreload : function()
		{
			var _this = this;

			var img = this.$el.imagesLoaded();
			img.done(function(){
				_this.model.trigger('ready',_this.model.id);
			});
			img.fail(function(){
				_this.model.trigger('error',_this.model.id);
			});

		}
	});

})(zeega.module("layer"));