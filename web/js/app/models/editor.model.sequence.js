(function(Sequence){

	Sequence.FrameCollection = Backbone.Collection.extend({
		initialize : function()
		{
		}
	})

	Sequence.Model = Backbone.Model.extend({
		
		defaults :{
			attr : {}
		},
		
		url : function()
		{
			if ( this.isNew() ) return zeega.app.url_prefix + 'api/projects/'+ zeega.app.project.id +'/sequences';
			return zeega.app.url_prefix+'api/sequences/' + this.id;
		},
				
		initialize : function( attributes )
		{
			this.tabView = new Sequence.Views.SequenceTabs({model:this});
			this.sequenceFrameView = new Sequence.Views.SequenceFrameDrawer({model:this})

			this.on('sync', this.refreshView, this);
			this.on('sync', this.checkAttr, this);
			
			this.trigger('ready');
		},

		complete : function()
		{
			var _this = this;
			// make persistent layer collection
			var persistentLayers = this.get('persistent_layers').map(function(layerID){
				zeega.app.project.layers.get(layerID)
			})
			var col = Backbone.Collection.extend();
			this.persistentLayers = new col( persistentLayers );

			var frameArray = this.get('frames').map(function(frameID){
				var frame = zeega.app.project.frames.get(frameID);
				frame.sequenceID = _this.id;
				return frame;
			});
			this.frames = new Sequence.FrameCollection(frameArray);
			this.frames.comparator = function( frame ){ return frame.frameIndex };
			this.frames.on('add', this.onAddFrame, this);
			this.frames.on('remove', this.onRemoveFrame, this);
		},
		
		refreshView : function()
		{
			this.tabView.render();
		},
		
		renderSequenceFrames : function()
		{
			this.sequenceFrameView.renderToTarget();
		},


		addFrames : function(num)
		{
			var _this = this;
			var n = num || 1;
			var Frame = zeega.module('frame');

			for( var i = 0 ; i < n ; i++ )
			{
				var newFrame = new Frame.Model();
				newFrame.save({
					'layers' : this.get('persistent_layers')
					},{
					success : function()
					{
						zeega.project.frames.add( newFrame );
						_this.frames.push( newFrame );
					}
				});

			}
		},

		onAddFrame : function( frame )
		{
			this.sequenceFrameView.render();
		},

		onRemoveFrame : function( frame )
		{
			this.sequenceFrameView.render();
		},

		onFrameReorder : function( frameIDArray )
		{
			var _this = this;
			_.each(frameIDArray, function(frameID, i){
				var frame = _this.frames.get(frameID);
				frame.frameIndex = i;
			})
			this.frames.sort();
			this.updateFrameOrder();
		},

		updateFrameOrder : function()
		{
			var frameOrder = this.frames.pluck('id');
			if(frameOrder.length == 0) frameOrder = [false];
			this.save('frames',frameOrder);
			console.log('$$		update frame order', this, frameOrder)
		},

/*
var _this = this
			var n = num || 1;
			var Frame = zeega.module('frame');
		
			for( var i = 0 ; i < n ; i++ )
			{
				var layers = _.compact( this.currentSequence.get('attr').persistLayers ) || [];
			
				var newFrame = new Frame.Model();
				newFrame.set({'layers' : layers},{'silent':true});
				console.log(newFrame)
				this.loadFrame(newFrame);//newFrame.render();
				
				if(i>0)
				{
					// if more than one frame is being created
					console.log("not loading frame for later",i);
					newFrame.save({},{
						success : function()
						{
							//console.log(newFrame)
							//newFrame.render();
						
							newFrame.trigger('refresh_view');
							//_this.currentSequence.trigger('updateFrameOrder');
							newFrame.trigger('updateThumb');
							_this.project.frames.add( newFrame );
							//_this.loadFrame( newFrame );
							
							_this.currentSequence.get('frames').push(newFrame.id);
							
							console.log('new frame saved', _this.currentSequence)
							_this.loadFrame( newFrame.id )
						}
					});
				}
				else
				{
					// if more ONLY one frame is being created
					console.log("loading frame for first",i);
					newFrame.save({},{
						success : function()
						{
							_this.project.frames.add( newFrame );
							_this.currentSequence.addFrame( newFrame );
							
							//$('#frame-list').append(newFrame.sequenceFrameView.render().el);
							//newFrame.trigger('refresh_view');
							//newFrame.trigger('updateThumb');
							//_this.currentSequence.get('frames').push(newFrame.id);
							
							_this.loadFrame( newFrame );
							newFrame.trigger('focus');
						}
					});
				}
			
			}
*/



/*

		addFrame : function( frame )
		{
			var frameArray = this.get('frames');
			frameArray.push( frame.id );
			this.set('frames',frameArray);
			this.sequenceFrameView.render();
		},

//redo this vvvv
		insertFrameView : function( frame, index )
		{
			var frameArray = this.get('frames');
			var index  = index || frameArray.length;
			frameArray.splice(index,0,frame.id);
			this.set('frames',frameArray);

			this.sequenceFrameView.render();
		},
		
		destroyFrame : function( frameModel )
		{
			var index = _.indexOf( this.get('frames'), frameModel.id );
			var frameOrder = _.without( this.get('frames'), frameModel.id );
			this.save({ frames: frameOrder});
			this.sequenceFrameView.render();

			// this happens when there will be no more frames in the sequence
			// prevent from not having any frames!!			
			if( frameOrder.length == 0 ) zeega.app.addFrame();
			else zeega.app.loadLeftFrame();

			frameModel.destroy();

		},
*/
		addPersistentLayer : function( layer )
		{
			// test to see if the layer is already in the collection
			if( !this.persistentLayers.include(layer) )
			{
				this.persistentLayers.add( layer );
				this.updatePersistLayerArray();
				this.frames.each(function(frame){
					if(frame != zeega.app.currentFrame) frame.layers.unshift( layer );
				})
			}
		},

		removePersistentLayer : function( layer )
		{
			if( this.persistentLayers.include(layer) )
			{
				this.persistentLayers.remove( layer );
				this.updatePersistLayerArray();
			}
		},

		updatePersistLayerArray : function()
		{
			var layerIDArray = this.persistentLayers.length ? this.persistentLayers.pluck('id') : [false];
			this.save('persistent_layers', layerIDArray );
		},

		
		update : function( newAttr, silent )
		{
			var _this = this;
			_.extend( this.get('attr'), newAttr );
			if( !silent )
			{
				this.save({},{
					success : function(){ _this.trigger('update') }
				});
			}
		},
		
	});

})(zeega.module("sequence"));
