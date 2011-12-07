var Node = Backbone.Model.extend({
	
	defaults : {
		"name" : "Untitled",
		"attr" : {
			"advance": 0,
			"editorHidden":false
		}
	},
	
	/*
	url : function(){
		if(this.isNew())return Zeega.url_prefix+"routes/"+Zeega.routeID+"/nodes";
		else return Zeega.url_prefix+"routes/"+Zeega.routeID+"/nodes"+ this.id;
	},
	*/
	
	initialize : function() {
		
		if(!this.get('attr')) this.set({'attr':{'advance':0,'editorHidden':false}})
	},
	
	//update the node thumbnail
	updateThumb : function()
	{
		var _this = this;
		console.log('updating thumbnail');
		
		//kill any pre-existing thumbnail updates
		if(this.t) clearTimeout(this.t);
	
		//Trigger new node snapshot and persist url to database
		
		$.post(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'nodes/'+this.get('id')+'/thumbnail',function(data){
			
			//Update thumbnail in route display
			var thumb=$('<img>').attr('src',data).load(function(){
			$('.node-thumb-'+_this.id).find('.node-background').fadeOut('fast',function(){
			
				$('.node-thumb-'+_this.id).css('background-image','url("'+data+'")').fadeIn('fast',function(){
					$('.node-thumb-'+_this.id).find('.node-update-overlay').fadeOut('slow');
				});
			});
			});
			
			//Update local version of thumbnail url attribute
			_this.set({thumb_url:data});	
		});
	},
	
	noteChange:function()
	{
		console.log('Node changed');
		$('.node-thumb-'+this.id).find('.node-update-overlay').fadeIn('fast');
		var _this = this;
		
		//kill any pre-existing thumb updates
		if(_this.t) clearTimeout(this.t);
		_this.t = setTimeout(function(){ _this.updateThumb()}, 5000)
		
		_this.changed=true;
	},
	clearChange:function()
	{
		console.log('change cleared');
		this.changed=false;
	}

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