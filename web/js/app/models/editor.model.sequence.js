(function(Sequence){

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
		
		checkAttr : function()
		{
			if( _.isArray(this.get('attr')) ) this.set({ attr : this.defaultAttr });
		},
		
		refreshView : function()
		{
			console.log('refresh view!!!')
			this.tabView.render();
		},
		
		
		renderSequenceFrames : function()
		{
			console.log('##		render sequence frames')
			this.sequenceFrameView.renderToTarget();
		},
		
		addFrame : function( frame )
		{
			var frameArray = this.get('frames');
			frameArray.push( frame.id );
			this.set('frames',frameArray);
			console.log('##		add frame',frame, frameArray)
			this.sequenceFrameView.render();
		},

//redo this vvvv
		insertFrameView : function( frame, index )
		{
				if( _.isUndefined(index) ) $('#frame-list').append( frame.render() );
				else $('#frame-list').children('li:eq('+index+')').after( frame.render() );
				
				this.updateFrameOrder();
		},
		
		destroyFrame : function( frameModel )
		{
			console.log('destroy frame:', frameModel,this);
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
