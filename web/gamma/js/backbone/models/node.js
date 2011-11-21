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
		
		//kill any preexisting thumb updates
		if(this.t) clearTimeout(this.t);
		
<<<<<<< HEAD
		var that=this;
		var thumbURL = 'http://alpha.zeega.org/utilities/local_thumb.php?id='+this.id;
		//turn on spinner
		$('.node-thumb-'+that.id).find('.node-overlay').spin('tiny','white');
		$.get( thumbURL, function(data)
		{
			$('.node-thumb-'+that.id).find('.node-background').fadeOut('fast',function(){
				$(this).css('background-image','url("'+data+'")').fadeIn('slow');
=======
		$('.node-thumb-'+this.id).find('.node-overlay').spin('tiny','white');
		this.set({ thumb_url : 0 });
		
		this.save({},{
		
			success: function(node,response){
		
				$('.node-thumb-'+_this.id).find('.node-background').fadeOut('fast',function(){
				$('.node-thumb-'+_this.id).css('background-image','url("'+response[0].thumb_url+'")').fadeIn('slow');
				_this.set({thumb_url:response[0].thumb_url});
>>>>>>> 740f33cb3079d394e5a64a34891d7d2ca9436290
				//turn off spinner
				$('.node-thumb-'+_this.id).find('.node-overlay').spin(false);
			});
			
		}});
	
	
	
	},
	
	noteChange:function()
	{
		console.log('changed');
		var _this = this;
		//kill any preexisting thumb updates
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