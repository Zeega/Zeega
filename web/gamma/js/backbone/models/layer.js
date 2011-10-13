var Layer =  Backbone.Model.extend({
	url : function(){return Zeega.url_prefix + "layers/" + this.id},
	
	defaults :{},
	
	initialize: function(){	},
	

});

var LayerCollection = Backbone.Collection.extend({
	model : Layer,

	url : function(){
		return Zeega.url_prefix+"routes/"+ Zeega.route.id +"/layers";
	},
	
	initialize : function(){
		
	}/*,
	
	remove : function( layer ){
		layer.destroy();
	}
	*/
	
});