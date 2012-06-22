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
			if( this.isNew() ) {
				console.log('FRAME URL ' + zeega.app.url_prefix+'api/projects/'+ zeega.app.project.id +'/sequences/'+ zeega.app.currentSequence.id +'/frames');
				return zeega.app.url_prefix+'api/projects/'+ zeega.app.project.id +'/sequences/'+ zeega.app.currentSequence.id +'/frames';
				}
			else {
				console.log('FRAME URL ' + zeega.app.url_prefix + 'api/frames/'+ this.id);
				return zeega.app.url_prefix + 'api/frames/'+ this.id;
			}
		},
	
		initialize : function()
		{	
			this.updating = false
			
			if(this.get('layers')) this.set({ 'layers' : _.map(this.get('layers'), function(layer){ return parseInt(layer) }) });
			if(this.get('thumbnail_url')=='') this.set('thumbnail_url',this.defaults.thumbnail_url)
			console.log('frame model',this);
			this.view = new Frame.Views.FrameSequence({ model : this })
			
			//this.on('focus', this.render, this );
			//this.on('blur', this.unrender, this );

			this.on('update_thumb', this.updateThumb, this );
			

			
			//this is the function that only calls updateThumb once after n miliseconds
			this.updateFrameThumb = _.debounce( this.updateThumb, 2000 );
		},
	
	
		render : function()
		{
			this.frameTarget.append( this.view.render().el )
		},
		
		unrender : function()
		{
			this.frameTarget.append( this.view.remove() )
		},
		
		update : function( newAttr, silent )
		{
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
			
				worker.postMessage({'cmd': 'capture', 'msg': sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'api/frames/'+this.get('id')+'/thumbnail'}); // Send data to our worker.
			
			}
		},
	

	});

})(zeega.module("frame"));
