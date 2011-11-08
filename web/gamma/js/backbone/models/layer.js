var Layer =  Backbone.Model.extend({
	url : function(){return Zeega.url_prefix + "layers/" + this.id},
	
	defaults :{ 'attr' : {} },
	
	layerClass :{},
	
	initialize: function(){
		if(!this.get('attr')) this.set({'attr':{}})
	},
	

});

var LayerCollection = Backbone.Collection.extend({
	model : Layer,

	url : function()
	{
		return Zeega.url_prefix+"routes/"+ Zeega.route.id +"/layers";
	},
	
	initialize : function()
	{
		
	}
	
});