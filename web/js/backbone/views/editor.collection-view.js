
var CollectionView = Backbone.View.extend({
	tagName : 'option',
		
	render: function()                 
	{
		$(this.el).attr( 'value', this.model.id ).html( this.model.get('title') );
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
		console.log('finished');
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
		
		//populate with default values
		this.el.append( $('<option value="all">').html('All Collections') );
		//this.el.append( $('<option>').html('  --  ') );
		
		//add EACH model's view to the _this.el and render it
		_.each( this._collectionViews, function( collectionView ){
			_this.el.append( collectionView.render().el )
		});
		
		var collection_id = $('#collection-id').val();
		if(parseInt(collection_id) > -1) 
			$('#database-collection-filter').val(collection_id);
		
		this._rendered = true;
		
		return this;
	}
	
});