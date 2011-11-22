// the primary layer model
var Layer =  Backbone.Model.extend({
	url : function(){ return Zeega.url_prefix + "layers/" + this.id },
	
	defaults :{ 'attr' : {} },
	
	layerClass :{},
	
	initialize: function(){
		
		eval( 'this.layerClass = new '+ this.get('type')+'Layer()' );
		this.layerClass.load(this);
		
		if(!this.get('attr')) this.set({'attr':{}}); //this should be covered by defaults

	},
	
	show : function()
	{
		console.log('layer: '+this.id+ " showing")
	}
	

});

//the uber collection of layers that contain sub collections of various types of layers [contains all layer models]
var LayerCollection = Backbone.Collection.extend({
	
	model : Layer,

	url : function(){ return Zeega.url_prefix+"routes/"+ Zeega.route.id +"/layers" },
	
	initialize :function()
	{
		var _this = this;
		//collections live in this object
		// this makes sure that if there are other types that we indroduce, they will automatically populate into here\
		this.layerCollectionArray = {};
		
		this.bind("add", function(layer) { _this.addToLayerTypeCollection(layer) });
		
	},
	
	parseLayers : function()
	{
		var _this = this;
		//load with models
		_.each(this.models, function(layer){ _this.addToLayerTypeCollection(layer) });
		
		_.each( this.layerCollectionArray, function(collection){ collection.initViewCollection() });
		
		
		// layers are loaded into their collections
		// activate each collection
		//_.each( this.layerCollectionArray, function(collection){ collection.createViewCollections() });
	},
	
	addToLayerTypeCollection : function(layer)
	{
		eval( 'var layerClass = new '+ layer.get('type')+'Layer()' );
		var type = layerClass.layerType.toLowerCase();
		eval( "if( !this.layerCollectionArray."+ type +" ) this.layerCollectionArray."+ type +" = new LayerTypeCollection");
		eval( 'var layerTypeCollection = this.layerCollectionArray.' + type );
		
 		layerTypeCollection.type = type;
		layerTypeCollection.add(layer)
	},
	
	render : function( node )
	{
		// should render the current node
		
		//cycle through each view collection
		_.each( this.layerCollectionArray, function(layerCollection){
			//layerCollection.viewCollection.render( _.compact(node.get('layers')) ) ;
			layerCollection.render( _.compact(node.get('layers')) );
		})

	}
	
});

// generic layerType Collection that loads the layerType View(s)  [contains layer models]
var LayerTypeCollection = Backbone.Collection.extend({
	
	model : Layer,
	
	initViewCollection : function()
	{
		this.renderCollection = new LayerRenderCollection;
		var classType = this.type.toCapitalCase();
		
		// make a view collection. this view collection has specific instructions on where and what to draw and interact
		eval( "this.viewCollection = new "+ classType +"LayerViewCollection" );
		this.viewCollection.loadCollection( this.renderCollection );
	},
	
	render : function( layers )
	{
		var _this = this;
		console.log( 'render: ' + this.type );
		
		/*
		_.each( _.toArray( _this.renderCollection ), function(layer){
			console.log(layer.id)
			
		});
		*/
		this.renderCollection.reset();
		
		_.each( layers, function( layerID ){
			var layerModel = _this.get(layerID);
			if( !_.isUndefined( layerModel ) )
			{
				//add it to the view collection
				_this.renderCollection.add( layerModel );
			}
		})
	}
	
})


//simple collection that is populated with only layers being displayed
var LayerRenderCollection = Backbone.Collection.extend({
	model : Layer
})




