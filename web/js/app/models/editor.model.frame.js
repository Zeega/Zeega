(function(Frame){

	Frame.Model = Backbone.Model.extend({
		
		frameTarget : $('#frame-list'),
		
		defaults : {
			"name" : "Untitled",
			'layers' : [],
			"thumbnail_url" : '../../../images/thumb.png',
			"attr" : {
				"advance": 0
			}
		},
	
		url : function()
		{
			if( this.isNew() )return zeega.app.url_prefix+'api/projects/'+ zeega.app.project.id +'/sequences/'+ zeega.app.currentSequence.id +'/frames';
			else return zeega.app.url_prefix + 'api/frames/'+ this.id;
		},
	
		initialize : function()
		{	
			this.updating = false
			
			if(this.get('layers')) this.set({ 'layers' : _.map(this.get('layers'), function(layer){ return parseInt(layer) }) });
			if(this.get('thumbnail_url')=='') this.set('thumbnail_url',this.defaults.thumbnail_url)
			
			this.sequenceFrameView = new Frame.Views.FrameSequence({model:this});
			this.editorWorkspace = new Frame.Views.EditorWorkspace({model:this});
			this.editorLayerList = new Frame.Views.EditorLayerList({model:this});
			this.editorLinkLayerList = new Frame.Views.EditorLinkLayerList({model:this});
			//this is the function that only calls updateThumb once after n miliseconds
			this.updateFrameThumb = _.debounce( this.updateThumb, 2000 );
			this.on('update_thumb', this.updateFrameThumb, this );
			
			
		},
		
		render : function()
		{
			this.frameTarget.append( this.sequenceFrameView.render().el )
		},
		
		unrender : function()
		{
			this.frameTarget.append( this.sequenceFrameView.remove() )
		},
		
		
		// adds the frame workspace view to the editor
		renderWorkspace : function()
		{
			this.editorWorkspace.renderToEditor();
			this.editorLayerList.renderToEditor();
			this.editorLinkLayerList.renderToEditor();
		},
		// removes the frame workspace view to the editor
		removeWorkspace : function()
		{
			this.editorWorkspace.removeFromEditor()
			this.editorLayerList.removeFromEditor();
			this.editorLinkLayerList.removeFromEditor();
		},
		
		
		// adds a new layer to the workspace without disturbing existing layers
		renderLayerToWorkspace : function( newLayer )
		{
			this.editorLayerList.addLayer( newLayer );
			this.editorWorkspace.workspace.addLayer( newLayer );
		},
		
		update : function( newAttr, silent )
		{
			console.log('update', this)
			var _this = this;
			if( _.isArray(this.get('attr')) ) this.set('attr',{});
			_.extend( this.get('attr'), newAttr );
			if( !silent )
			{
				this.save({},{
					success : function(){ _this.trigger('update') }
				});
			}
		},
		
		//update the frame thumbnail
		updateThumb : function()
		{
			
			// single frame url: frame
			console.log('SAVE FRAME')
			console.log(this)
			var _this = this;
						
			if( this.updating != true && zeega.app.thumbnailUpdates )
			{
				this.updating = true; //prevent more thumb requests while this is working
				//Trigger new frame snapshot and persist url to database
				$('#frame-thumb-'+this.id).find('.frame-update-overlay').fadeIn('fast');
			
				var worker = new Worker( sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'/js/helpers/thumbworker.js');
			
				worker.addEventListener('message', function(e) {
					console.log(e)
					if(e.data)
					{
						_this.set({thumbnail_url:e.data});
						console.log('thumbnail returned!!',e.data)
					}else{
						_this.trigger('thumbUpdateFail');
					}
					_this.updating = false; //allow further thumb updates
					this.terminate();
				}, false);
			
				worker.postMessage({'cmd': 'capture', 'msg': sessionStorage.getItem('hostname')+'static/scripts/frame.php?id='+this.get('id')}); // Send data to our worker.
			
			}
		},
		
		validate : function( attrs )
		{
			if( !_.isNull(attrs.layers) && attrs.layers.length > 1 && _.include(attrs.layers,false))
			{
				alert('There was an error with your project :(/nplease email bugs@zeega.org and describe what you were doing that led to this error.\nPlease refresh your browser. Your last edit may not have saved. We apologize for the inconvenience.');
				return 'layer array update error!';
			}
		}
	

	});

})(zeega.module("frame"));
