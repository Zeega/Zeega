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
		
		this.bind("add", function(layer) { _this.addToLayerTypeCollection(layer,true) });
		this.bind("remove", this.remove );
		
	},
	
	parseLayers : function()
	{
		var _this = this;
		//load with models
		_.each(this.models, function(layer){ _this.addToLayerTypeCollection(layer, true) });
		
		_.each( this.layerCollectionArray, function(collection){ collection.initViewCollection() });

	},

	
	remove : function( layer )
	{
		_.each( this.layerCollectionArray, function(layerCollection){
			//layerCollection.viewCollection.render( _.compact(node.get('layers')) ) ;
			layerCollection.remove( layer );
		})
	},
	
	addToLayerTypeCollection : function(layer, render)
	{
		eval( 'var layerClass = new '+ layer.get('type')+'Layer()' );
		var type = layerClass.layerType.toLowerCase();
		
		//restore without evals
		if( _.isUndefined( this.layerCollectionArray[ type ]) )
		{
			this.layerCollectionArray[ type ] = new LayerTypeCollection;
			this.layerCollectionArray[ type ].type = type
			this.layerCollectionArray[ type ].initViewCollection();
		}
		this.layerCollectionArray[ type ].type = type

		//pass as silent if it's not the current node being displayed
		if(render) this.layerCollectionArray[ type ].add(layer);
		else this.layerCollectionArray[ type ].add(layer, {silent:true} );
		
	},
	
	render : function( node )
	{
		// should render the current node
		
		//cycle through each view collection
		_.each( this.layerCollectionArray, function(layerCollection){
			layerCollection.render( _.compact(node.get('layers')) );
		})

	}
	
});

// generic layerType Collection that loads the layerType View(s)  [contains layer models]
var LayerTypeCollection = Backbone.Collection.extend({
	
	model : Layer,
	
	initialize : function( options )
	{
		var _this = this;
		//left off here. this whole fxn needs to get done
		this.renderCollection = new LayerRenderCollection;
		
		this.bind("add", function(layer) { _this.addToRenderCollection(layer) });
		this.bind("remove", this.remove);
		
	},
	
	addToRenderCollection : function( layer )
	{

		var layerModel = this.get(layer.id);
		if( !_.isUndefined( layerModel ) )
		{
			//add it to the view collection
			this.renderCollection.add( layerModel );
		}
		
	},
	
	initViewCollection : function()
	{
		var classType = this.type.toCapitalCase();
		
		// make a view collection. this view collection has specific instructions on where and what to draw and interact
		eval( "this.viewCollection = new "+ classType +"LayerViewCollection({collection:this.renderCollection})" );
	},
	
	remove : function( layer )
	{
		console.log('LayerTypeCollection REMOVE LAYER');
		this.renderCollection.remove(layer);
	},
	
	render : function( layers )
	{
		var _this = this;
		
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
