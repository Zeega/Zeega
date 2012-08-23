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
		
		defaultAttr : {
			persistLayers : []
		},
				
		initialize : function( attributes )
		{
			this.checkAttr();
			
			this.tabView = new Sequence.Views.SequenceTabs({model:this});
			this.sequenceFrameView = new Sequence.Views.SequenceFrameDrawer({model:this})
			
			this.on('sync', this.refreshView, this);
			this.on('sync', this.checkAttr, this);
			
			this.trigger('ready');
		},

		complete : function()
		{
			var _this = this;
			var frameArray = this.get('frames').map(function(frameID){
				var frame = zeega.app.project.frames.get(frameID);
				frame.sequenceID = _this.id;
				return frame;
			});
			this.frameCollection = new Sequence.FrameCollection(frameArray);
		},
		
		checkAttr : function()
		{
			if( _.isArray(this.get('attr')) ) this.set({ attr : this.defaultAttr });
		},
		
		refreshView : function()
		{
			this.tabView.render();
		},
		
		
		renderSequenceFrames : function()
		{
			console.log('$$		render seq frames')
			this.sequenceFrameView.renderToTarget();
		},
		
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
		
		updatePersistLayer : function( modelID )
		{
			
			this.set('attr',{persistLayers: [parseInt(modelID)] })
			this.save();
			
			var attr = this.get('attr');
		
			if( _.include( attr.persistLayers, parseInt(modelID) ) ) 
			{
				attr = _.extend( attr, {persistLayers: _.without(attr.persistLayers, parseInt(modelID))})
			}
			else
			{
				if(attr.persistLayers) attr = _.extend( attr, { persistLayers: _.compact(attr.persistLayers.push(parseInt(modelID))) });
				else attr.persistLayers = [ parseInt(modelID) ];
			}
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
