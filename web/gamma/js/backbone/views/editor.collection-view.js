
var CollectionView = Backbone.View.extend({
	tagName : 'option',
	//className :'database-asset',
		
	render: function()                 
	{
		$(this.el).attr( 'value', this.model.get('title') ).html( this.model.get('title') );
		return this;
	}
	
});

var CollectionViewCollection = Backbone.View.extend({
	
	el : $('#database-collection-filter'),
	
	initialize : function()
	{
		
		console.log('CollectionViewCollection init')
		
		_(this).bindAll('add');
		this._collectionViews = [];
		this.collection.each(this.add);
		this.collection.bind('add',this.add)
		this.render();
	},
	
	add : function(item)
	{
		var collectionView = new CollectionView({ model : item });
		this._collectionViews.push( collectionView );
		if(this._rendered) $(this.el).append( collectionView.render().el );
		
	},
	
	render : function()
	{
		var _this = this;
		this.el.empty();
		
		//add EACH model's view to the _this.el and render it
		_.each( this._collectionViews, function( collectionView ){
			_this.el.append( collectionView.render().el )
		});
		
		this._rendered = true;
		
		return this;
	}
	
});