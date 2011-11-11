// the primary layer model
var Layer =  Backbone.Model.extend({
	url : function(){ return Zeega.url_prefix + "layers/" + this.id },
	
	defaults :{},
	
	layerClass :{},
	
	initialize: function(){
		
		eval( 'this.layerClass = new '+ this.get('type')+'Layer()' );
		this.layerClass.load(this);
		
		if(!this.get('attr')) this.set({'attr':{}}); //this should be covered by defaults

	},
	

});

//the uber collection of layers that contain sub collections of various types of layers [contains all layer models]
var LayerCollection = Backbone.Collection.extend({
	
	model : Layer,

	url : function(){ return Zeega.url_prefix+"routes/"+ Zeega.route.id +"/layers" },
	
	initialize :function()
	{
		//collections live in this object
		// this makes sure that if there are other types that we indroduce, they will automatically populate into here\
		this.layerCollectionArray = {};
	},
	
	parseLayers : function()
	{
		var _this = this;
		_.each(this.models, function(layer){
			
			// get, create, and load the layer class
			// if a layerCollection doesn't exist in the layerCollectionArray already, then create it
			eval( 'var layerClass = new '+ layer.get('type')+'Layer()' );
			var type = layerClass.layerType.toLowerCase();
			eval( "if( !_this.layerCollectionArray."+ type +" ) _this.layerCollectionArray."+ type +" = new LayerTypeCollection");
			
			// set this to a variable, because we can't add things in the eval
			eval( 'var collection = _this.layerCollectionArray.' + type );
			
			//add attributes to the collection
			collection.type = type;
			collection.add(layer)
			
		});
		// layers are loaded into their collections
		// activate each collection
		_.each( this.layerCollectionArray, function(collection){ collection.createViewCollections() });
	}
	
});

// generic layerType Collection that loads the layerType View(s)  [contains layer models]
var LayerTypeCollection = Backbone.Collection.extend({
	
	model : Layer,
	
	createViewCollections : function()
	{
		var classType = this.type.toCapitalCase();
		
		// make a view collection. this view collection has specific instructions on where and what to draw and interact
		eval( "this.viewCollection = new "+ classType +"LayerViewCollection" );
		
		// set the collection into the view collection
		this.viewCollection.loadCollection(this);
		
		//the viewCollection should take over from here
	}
	
})




