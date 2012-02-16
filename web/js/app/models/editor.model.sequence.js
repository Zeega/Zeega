(function(Sequence){

	Sequence.Model = Backbone.Model.extend({
		
		url : function()
		{
			if ( this.isNew() ) return zeega.app.url_prefix + 'sequences';
			return zeega.app.url_prefix+'sequences/' + this.id;
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
			this.frames.collection.on( 'destroy updateFrameOrder', this.updateFrameOrder, this );
		},
		
		createLayers : function( layers )
		{
			var Layers = zeega.module("layer");
			this.layers = new Layers.ViewCollection( {collection : new Layers.Collection(layers) } );
		},
		
		updateFrameOrder : function()
		{
			var frameIDArray = _.map( $('#frame-list').sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
			this.set( { framesOrder: frameIDArray } );
			this.save();
		}
		
	});

})(zeega.module("sequence"));
