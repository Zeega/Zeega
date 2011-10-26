var Node = Backbone.Model.extend({
	
	defaults : {
		'name' : "Untitled",
		'layers': [-1],
		'attr' : {
			'advance': 0
		}
	},
	
	/*
	url : function(){
		if(this.isNew())return Zeega.url_prefix+"routes/"+Zeega.routeID+"/nodes";
		else return Zeega.url_prefix+"routes/"+Zeega.routeID+"/nodes"+ this.id;
	},
	*/
	
	initialize : function() {
		
		if(!this.get('attr')) this.set({'attr':{'advance':0}})
		
	},
	
	//update the node thumbnail
	updateThumb : function()
	{
		console.log('updating thumbnail');
		
		//kill any preexisting thumb updates
		if(this.t) clearTimeout(this.t);
		
		var that=this;
		var thumbURL = 'http://core.zeega.org/utilities/local_thumb.php?id='+this.id;
		//turn on spinner
		$('.node-thumb-'+that.id).find('.node-overlay').spin('tiny','white');
		$.get( thumbURL, function(data)
		{
			$('.node-thumb-'+that.id).find('.node-background').fadeOut('fast',function(){
				$(this).css('background-image','url("'+data+'")').fadeIn('slow');
				//turn off spinner
				$('.node-thumb-'+that.id).find('.node-overlay').spin(false);
			});
			
			that.set({thumb_url:data});
			that.save();
		});
	
	},
	
	noteChange:function()
	{
		console.log('changed');
		var _this = this;
		//kill any preexisting thumb updates
		if(this.t) clearTimeout(this.t);
		this.t = setTimeout(function(){_this.updateThumb()}, 5000)
		
		this.changed=true;
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