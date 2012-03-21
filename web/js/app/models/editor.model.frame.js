(function(Frame){

	Frame.Model = Backbone.Model.extend({
		
		defaults : {
			"name" : "Untitled",
			'layers' : [],
			"attr" : {
				"advance": 0
			}
		},
	
		url : function()
		{
			if( this.isNew() ) return zeega.app.url_prefix+'sequences/'+ zeega.app.sequenceID +'/frames';
			else return zeega.app.url_prefix + 'frames/'+ this.id;
		},
	
		initialize : function()
		{	
			this.updating = false
			this.on('change:layers', this.updateThumb, this );
			this.on('updateThumb', this.updateThumb, this );
			
			if(!this.get('attr')) this.set({'attr':{ 'advance':0 }})
			
			//this is the function that only calls updateThumb once after n miliseconds
			this.updateFrameThumb = _.debounce( this.updateThumb, 2000 );
		},
	
		//update the frame thumbnail
		updateThumb : function()
		{
			var _this = this;
			
			this.save();
			
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
					}else{
						_this.trigger('thumbUpdateFail');
					}
					_this.updating = false; //allow further thumb updates
					this.terminate();
				}, false);
			
				worker.postMessage({'cmd': 'capture', 'msg': sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'frames/'+this.get('id')+'/thumbnail'}); // Send data to our worker.
			
			}
		},
	

	});

})(zeega.module("frame"));
