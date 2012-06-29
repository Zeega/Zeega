(function(Sequence){

	Sequence.Model = Backbone.Model.extend({
		
		defaults :{
			attr : {}
		},
		
		url : function()
		{
			if ( this.isNew() ) return zeega.app.url_prefix + 'projects/'+ zeega.app.project.id +'/sequences';
			return zeega.app.url_prefix+'sequences/' + this.id;
		},
		
		defaultAttr : {
			persistLayers : []
		},
				
		initialize : function( attributes )
		{
			this.checkAttr();
			this.set({ 'attr' : _.defaults(this.get('attr'),this.defaultAttr) })
			
			this.on('updateFrameOrder',this.updateFrameOrder,this);
			this.on('sync', this.checkAttr, this);
			this.attachTabView();
			
			this.trigger('ready');
		},
		
		checkAttr : function()
		{
			if( _.isUndefined(this.get('attr').persistlayers) ) this.get('attr').persistLayers = [];
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

		updateFrameOrder : function( save )
		{
			//this.frames.trigger('resort',frameIDArray);
			var frameIDArray = _.map( $('#frame-list').sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
			console.log(frameIDArray)
			this.set( { frames : frameIDArray } );
			if( save != false ) this.save();
		},
		
		
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
		}
		
	});

})(zeega.module("sequence"));
