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
			console.log('SEQUENCE model init')
			this.unset('frames',['silent'])
			this.unset('layers',['silent'])
			this.createFrames( attributes.frames );
			this.createLayers( attributes.layers );
		},
		
		createFrames : function( frames )
		{
			console.log(frames)
			//var Frames = zeega.module("frames");
			//this.frames = new Frames.ViewCollection( frames );
		},
		createLayers : function( layers )
		{
			console.log(layers)
			//var Layers = zeega.module("layers");
			//this.layers = new Layers.ViewCollection( layers );
		}
		
	});

})(zeega.module("sequence"));
