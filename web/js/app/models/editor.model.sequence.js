(function(Sequence){

	Sequence.Model = Backbone.Model.extend({
		
		url : function()
		{
			var base = Zeega.url_prefix+'sequences';
			if (this.isNew()) return base;
			return base + '/' + this.id;
		},
				
		initialize : function( attributes )
		{
			this.unset('frames',['silent'])
			this.unset('layers',['silent'])
			this.createFrames( attributes.frames );
			this.createLayers( attributes.layers );
			this.trigger('ready');
		},
		
		createFrames : function( frames )
		{
			var Frames = zeega.module("frame");
			this.frames = new Frames.ViewCollection( {collection : new Frames.Collection(frames) } );
			this.frames.collection.on( 'destroy', this.refactorFrames )
		},
		
		createLayers : function( layers )
		{
			var Layers = zeega.module("layer");
			this.layers = new Layers.ViewCollection( {collection : new Layers.Collection(layers[0]) } ); // remove the [0] when API is fixed
		},
		
		refactorFrames : function( destroyedModel )
		{
			console.log('refactoring frames')
			console.log(destroyedModel)
			console.log(this.frames)
		}
		
	});

})(zeega.module("sequence"));
