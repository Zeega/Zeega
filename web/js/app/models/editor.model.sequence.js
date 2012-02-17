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
			var _this = this;
			var Layers = zeega.module("layer");
			this.layers = new Layers.ViewCollection( {collection : new Layers.Collection(layers) } );
			_.each( _.toArray( this.layers.collection ), function(layer){
				layer.on('removeFromFrame', _this.removeLayerFromFrame, _this);
			});
			this.layers.collection.on('add',function(layer){ layer.on('removeFromFrame', _this.removeLayerFromFrame, _this) })
		},
		
		updateFrameOrder : function()
		{
			var frameIDArray = _.map( $('#frame-list').sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
			this.frames.collection.trigger('resort',frameIDArray);
			this.set( { framesOrder: frameIDArray } );
			this.save();
		},
		
		removeLayerFromFrame : function( model )
		{
			// if layer is persistent then remove ALL instances from frames
			if( _.include( this.get('persistLayers'), parseInt(model.id) ) )
			{
				_.each( _.toArray( this.frames.collection ), function(frame){
					var newLayers = _.without( frame.get('layers'), parseInt(model.id) );
					if( newLayers.length == 0 ) newLayers = [false];
					frame.set( 'layers' , newLayers );
					frame.save();
				});
				var newPersistLayers = _.without( this.get('persistLayers'), parseInt(model.id) );
				if( newPersistLayers.length == 0 ) newPersistLayers = [false];
				this.set( 'persistLayers', newPersistLayers );
				this.save();
				model.destroy();
			}
			else
			{
				//remove from the current frame layer array
				var layerArray = _.without( zeega.app.currentFrame.get('layers'), parseInt(model.id) );
				if( layerArray.length == 0 ) layerArray = [false];
				zeega.app.currentFrame.set('layers',layerArray);
				zeega.app.currentFrame.save();
				this.destroyOrphanLayers();
			}

		},
		
		destroyOrphanLayers : function()
		{
			var _this = this;
			var layersInCollection = _.map( this.layers.collection.pluck('id'), function(id){return parseInt(id)}); // all layers including orphans
			var layersInFrames = _.flatten( this.frames.collection.pluck('layers') ); // layers in use
			var orphanLayerIDs = _.difference( layersInCollection, layersInFrames ); // layers to be nuked
			_.each( orphanLayerIDs, function(orphanID){
				_this.layers.collection.get( orphanID ).destroy();
			});
		},
		
		removePersistence : function( layerID )
		{
			console.log('remove persistance!');
			var newPersistArray = _.without( this.get('persistLayers'), parseInt(layerID ) );
			this.set('persistLayers',newPersistArray);
			this.save();
		}
		
	});

})(zeega.module("sequence"));
