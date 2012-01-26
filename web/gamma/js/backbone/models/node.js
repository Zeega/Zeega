var Node = Backbone.Model.extend({
	
	/*
	defaults : {
		
		"name" : "Untitled",
		"attr" : {
			"advance": 0
		}
		
	},
	*/
	
	/*
	url : function(){
		if(this.isNew())return Zeega.url_prefix+"routes/"+Zeega.routeID+"/nodes";
		else return Zeega.url_prefix+"routes/"+Zeega.routeID+"/nodes"+ this.id;
	},
	*/
	
	initialize : function() {
		
		//if(!this.get('attr')) this.set({'attr':{'advance':0,'editorHidden':false}})
		
		//this is the function that only calls updateThumb once after n miliseconds
		this.updateNodeThumb = _.debounce( this.updateThumb, 2000 );
		
		//this.bind( 'change:layers', this.onLayerUpdate );
	},
	
	noteChange:function()
	{
		$('.node-thumb-'+this.id).find('.node-update-overlay').fadeIn('fast');
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
			$.post(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'nodes/'+this.get('id')+'/thumbnail',function(data){
				//Update local version of thumbnail url attribute
				_this.set({thumb_url:data});
				_this.updating = false; //allow further thumb updates	
			});
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