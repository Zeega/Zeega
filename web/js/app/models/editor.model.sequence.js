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

			_.times( n, function(i){
				var newFrame = new Frame.Model();
				newFrame.save({
					'layers' : _this.get('persistent_layers')
					},{
					success : function()
					{
						newFrame.complete(); // complete the collections inside the frame
						newFrame.sequenceID = _this.id; // add the sequence id to the frame
						zeega.app.project.frames.add( newFrame );
						_this.frames.push( newFrame );
						if( i == n-1 ) zeega.app.loadFrame( newFrame );
					}
				});
			})
		},

		onAddFrame : function( frame )
		{
			this.sequenceFrameView.render();
			this.updateFrameOrder();
		},

		onRemoveFrame : function( frame, frames, options )
		{
			console.log('$$		on remove frame',frame, frames, options);

			if( frame == zeega.app.currentFrame )
			{
				var newFrameIndex = options.index < 1 ? 0 : options.index - 1;
				console.log('%%		new frame index', newFrameIndex)
				if( frames.length > 0 ) zeega.app.loadFrame( frames.at( newFrameIndex ) );
				else this.addFrames(1);
			}

			frame.destroy(); // <---------------------- remove this when api updates
			this.sequenceFrameView.render();
			this.updateFrameOrder();

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
		},


/*

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
