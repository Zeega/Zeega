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
		},
		
		createLayers : function( layers )
		{
			var Layers = zeega.module("layer");
			this.layers = new Layers.ViewCollection( {collection : new Layers.Collection(layers) } );
		}
		
	});

})(zeega.module("sequence"));
