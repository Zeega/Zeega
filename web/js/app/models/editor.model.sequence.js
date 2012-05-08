(function(Sequence){

	Sequence.Model = Backbone.Model.extend({
		
		url : function()
		{
			if ( this.isNew() ) return zeega.app.url_prefix + 'projects/'+ zeega.app.project.id +'/sequences';
			return zeega.app.url_prefix+'sequences/' + this.id;
		},
				
		initialize : function( attributes )
		{
			//this.layers.on('add', this.onLayerAdded, this);
			this.on('updateFrameOrder',this.updateFrameOrder,this);

			this.attachTabView();
			
			//this.updateFrameOrder(false);
			this.trigger('ready');
		},
		
		attachTabView : function()
		{
			this.view = new Sequence.Views.SequenceTabs({model:this});
			this.on('sync', this.refreshView, this);
		},
		
		refreshView : function()
		{
			console.log('refresh view!!!')
			this.view.render();
		},
/*		
		createFrames : function( frames )
		{
			var Frames = zeega.module("frame");
			this.frames = new Frames.Collection( frames );
			
			this.frames.on( 'destroy', this.destroyFrame, this );
			this.frames.on( 'updateFrameOrder', this.updateFrameOrder, this );

		},
		
		createLayers : function( layers )
		{
			console.log('create layers')
			var _this = this;
			var Layers = zeega.module("layer");
			
			var addListeners = function(layer)
			{
				layer.on('editor_removeLayerFromFrame', _this.removeLayerFromFrame, _this);
				layer.on('copyToNext', _this.continueLayerToNextFrame, _this);
				layer.on('persist', _this.updatePersistLayer, _this);
			};
			
			// generate layer models from layers
			var layerModelArray = [];
			_.each( layers, function(layer){
				var newLayer = new Layers[ layer.type ](layer);
				addListeners(newLayer);
				layerModelArray.push( newLayer );
			});
			
			
			this.layers = new Layers.MasterCollection( layerModelArray );
			
		},
		
		onLayerAdded : function(layer)
		{
			layer.on('editor_removeLayerFromFrame', this.removeLayerFromFrame, this);
		},
		
		updateFrameOrder : function( save )
		{
			this.frames.trigger('resort',frameIDArray);
			var frameIDArray = _.map( $('#frame-list').sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
			this.set( { framesOrder: frameIDArray } );
			if( save != false ) this.save();
		},
		
		duplicateFrame : function( frameModel )
		{
			console.log('	DUPLICATE FRAME')
			var _this = this;
			var dupeModel = frameModel.clone();
			
			dupeModel.set( 'duplicate_id' , parseInt(frameModel.id) );
			dupeModel.oldLayerIDs = frameModel.get('layers');
			dupeModel.frameIndex = _.indexOf( this.get('framesOrder'), frameModel.id );
			dupeModel.dupe = true;
			dupeModel.set('id',null);
			
			dupeModel.save({},{
				success : function( savedFrame )
				{
					console.log('frame saved and is a duplicate')
					console.log(savedFrame)
					_this.insertFrameView( savedFrame , dupeModel.frameIndex );
				
					//clone layers and place them into the layer array
					_.each( savedFrame.oldLayerIDs , function(layerID, i){

						//if layer is persistent
						//replace frameIndex the id with the persistent id

						var persistLayers = _this.get('attr').persistLayers;

						if( _.include( persistLayers, parseInt(layerID) ) )
						{
							var layerOrder = savedFrame.get('layers');
							layerOrder[i] = String(layerID);
							savedFrame.set({layers:layerOrder})
						}
						else
						{
							_this.layers.duplicateLayer( layerID, savedFrame.get('layers')[i] );
						}
					})
					//resave the frame after being updated with persistent frame ids
				}
			});
			
			this.frames.add( dupeModel );
		},
*/		
		insertFrameView : function( frame, index )
		{
				if( _.isUndefined(index) ) $('#frame-list').append( frame.render() );
				else $('#frame-list').children('li:eq('+index+')').after( frame.render() );
				
				this.updateFrameOrder();
		},
		
		destroyFrame : function( frameModel )
		{
			console.log('destroy frame:')
			if( zeega.app.currentFrame == frameModel ) zeega.app.loadLeftFrame()
			this.updateFrameOrder();
		},
		
		updatePersistLayer : function( modelID )
		{
			console.log('persist this layer')
			
			this.set('attr',{persistLayers: [parseInt(modelID)] })
			this.save();
			
			var attr = this.get('attr');
		
			if( _.include( attr.persistLayers, parseInt(modelID) ) ) 
			{
				attr = _.extend( attr, {persistLayers: _.without(attr.persistLayers, parseInt(modelID))})
				//this.frames.removePersistence( parseInt(model.id) );
			}
			else
			{
				if(attr.persistLayers) attr = _.extend( attr, { persistLayers: _.compact(attr.persistLayers.push(parseInt(modelID))) });
				else attr.persistLayers = [ parseInt(modelID) ];
				console.log(attr)
				//this.frames.addPersistence( parseInt(model.id) );
			}
			//this.set('attr',attr);
			//this.save();

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
				
				console.log(layerArray)
				
				zeega.app.currentFrame.set('layers',layerArray);
				zeega.app.currentFrame.save();
				this.destroyOrphanLayers();
			}
		},
		
		destroyOrphanLayers : function()
		{
			var _this = this;
			var layersInCollection = _.map( this.layers.pluck('id'), function(id){return parseInt(id)}); // all layers including orphans
			var layersInFrames = _.flatten( this.frames.pluck('layers') ); // layers in use
			var orphanLayerIDs = _.difference( layersInCollection, layersInFrames ); // layers to be nuked
			_.each( orphanLayerIDs, function(orphanID){
				_this.layers.get( orphanID ).destroy();
			});
		}
		
	});

})(zeega.module("sequence"));
