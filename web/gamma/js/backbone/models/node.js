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
	
	initialize : function() { },
	
	//update the node thumbnail
	updateThumb : function()
	{
		console.log('updating thumbnail');
		var that=this;
		var thumbURL = 'http://core.zeega.org/utilities/local_thumb.php?id='+this.id;
		//turn on spinner
		$('.node-thumb-'+that.id).find('.node-overlay').spin('small','white');
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