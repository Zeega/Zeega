(function(Project){

	Project.Model = Backbone.Model.extend({
		
		defaults : {
			'cover_image' : 'images/default_cover.png',
			'estimated_time' : 'the time it takes to eat a sandwhich',
			'author' : ''
		},
		
		url : function(){ return zeega.app.url_prefix+"api/projects/"+this.id },
		
		initialize : function( attributes )
		{
			_.defaults( this.get('attr'), this.default_attr );
			
			if( !_.isUndefined(this.get('cover_image')) || this.get('cover_image') == '' )
				this.set('cover_image','../../../images/default_cover.png')
			
			//remove dupe data from the attributes
			this.unset('sequences',['silent']);
			this.unset('frames',['silent']);
			this.unset('layers',['silent']);
			
			this.createLayerCollection(attributes.layers);
			this.createFrameCollection(attributes.frames);
			this.createSequenceCollection( attributes.sequences );
			
			
			this.layers.on('add', this.onAddLayer, this);
			this.frames.on('add', this.onAddFrame, this);
			
			console.log('init PROJECT')
			console.log(this)
		},

		/*	create collections	*/

		createLayerCollection : function( layers )
		{
			//var Layers = zeega.module('layer');
			//this.layers = new Layers.MasterCollection( layers );
			
			var _this = this;
			var Layers = zeega.module("layer");
			
			// generate layer models from layers
			var layerModelArray = [];
			_.each( layers, function(layer){
				var newLayer = new Layers[ layer.type ](layer);
				_this.initLayerListeners( newLayer );
				layerModelArray.push( newLayer );
			});
			
			this.layers = new Layers.MasterCollection( layerModelArray );
		},
		createFrameCollection : function( frames )
		{
			var Frames = zeega.module('frame');
			this.frames = new Frames.Collection( frames );
		},
		createSequenceCollection : function( sequences )
		{
			var Sequence = zeega.module("sequence");
			this.sequences = new Sequence.Collection( sequences );
			this.sequences.render();
			zeega.app.currentSequence = this.sequences.at(0);
		},
		
		/*	end create collections	*/
		
		initLayerListeners : function( layerModel )
		{
			layerModel.on('editor_removeLayerFromFrame', this.removeLayerFromFrame, this);
			//layerModel.on('copyToNext', this.continueLayerToNextFrame, this);
			//layerModel.on('persist', this.updatePersistLayer, this);
		},
		
		onAddLayer : function( layer )
		{
			this.initLayerListeners( layer );
		},
		
		onAddFrame : function( frame )
		{
			console.log('added frame')
			console.log(frame)
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
				
					//zeega.app.currentSequence.get('frames');
				
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
		
		removeLayerFromFrame : function( model )
		{
			// if layer is persistent then remove ALL instances from frames
			if( _.include( this.get('persistLayers'), parseInt(model.id) ) )
			{
				console.log('remove persistant layer')
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
				console.log('remove single layer')
				//remove from the current frame layer array
				var layerArray = _.without( zeega.app.currentFrame.get('layers'), parseInt(model.id) );
				if( layerArray.length == 0 ) layerArray = [false];
				
				console.log(layerArray)
				
				zeega.app.currentFrame.set('layers',layerArray);
				zeega.app.currentFrame.save();
				console.log(zeega.app.currentFrame.get('layers'))
				console.log( zeega.app.currentFrame );
				
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
		},
		
		loadProject : function()
		{
			// make view for project here //
			this.view = new Project.Views.Editor({model:this});
			this.view.render();
			this.trigger('ready')
		},
		loadPublishProject : function()
		{
			// publishing view for project //
			var Modal = zeega.module('modal');
			this.view = new Modal.Views.ShareProject({ model:this });
			this.view.render();
		},
		
		update : function( newAttr, silent )
		{
			var _this = this;
			//_.extend( this.get('attr'), newAttr );
			if( !silent )
			{
				this.save({},{
					success : function(){ _this.trigger('update') }
				});
			}
		},
		
	});

})(zeega.module("project"));