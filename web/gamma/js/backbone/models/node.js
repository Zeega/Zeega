var Node = Backbone.Model.extend({
	
	
	defaults : {
		
		"name" : "Untitled",
		"attr" : {
			"advance": 0
		}
		
	},
	
	
	/*
	url : function(){
		if(this.isNew())return Zeega.url_prefix+"routes/"+Zeega.routeID+"/nodes";
		else return Zeega.url_prefix+"routes/"+Zeega.routeID+"/nodes"+ this.id;
	},
	*/
	
	initialize : function() {
		
		if(!this.get('attr')) this.set({'attr':{ 'advance':0 }})
		
		//this is the function that only calls updateThumb once after n miliseconds
		this.updateNodeThumb = _.debounce( this.updateThumb, 2000 );
		
		//this.bind( 'change:layers', this.onLayerUpdate );
	},
	
	noteChange:function()
	{
		$('#frame-thumb-'+this.id).find('.frame-update-overlay').fadeIn('fast');
		this.updateNodeThumb();
	},
	
	//update the node thumbnail
	updateThumb : function()
	{
		var _this = this;
	
		if( !this.updating )
		{
			this.updating = true; //prevent more thumb requests while this is working
			//Trigger new node snapshot and persist url to database
			
			var worker = new Worker( sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'/gamma/js/helpers/thumbworker.js');
			
			worker.addEventListener('message', function(e) {
				console.log(e)
				if(e.data)
				{
					_this.set({thumb_url:e.data});
				}else{
					_this.trigger('thumbUpdateFail');
				}
				_this.updating = false; //allow further thumb updates
				this.terminate();
			}, false);
			
			worker.postMessage({'cmd': 'capture', 'msg': sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'nodes/'+this.get('id')+'/thumbnail'}); // Send data to our worker.
			
		}
	},
	

});

var NodeCollection = Backbone.Collection.extend({
	model: Node,
	url : function()
	{
		return Zeega.url_prefix+"routes/"+ Zeega.route.id +"/nodes";
	},
	
	initialize : function()
	{
		
	}
});