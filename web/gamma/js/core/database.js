/*
   Class: Database
   Manages the connection to the database
   
   TO-DO: Move all dom manipulation actions to zeega.ux.editor
*/
var Database =
{
	init : function()
	{
		console.log('database initialized')
		var _this = this;
		this.itemCollection = new ItemCollection;
		this.itemViewCollection;
		
		var collection_id = $('#collection-id').val();
		if(parseInt(collection_id) > -1)
		{
			console.log('collection in view: '+ collection_id)
			this.itemCollection.collectionID = collection_id;
			$('#database-collection-filter').val(collection_id);
		}
		
		var itemsBS = jQuery.parseJSON(itemsJSON);
		
		this.itemCollection.reset( itemsBS.items );
		this.itemCollection.count = parseInt(itemsBS.items_count);
		this.itemViewCollection = new ItemViewCollection({ collection : this.itemCollection });
		
		
		//loads the collections dropdown
		// NEEDS TO BE BOOTSTRAPPED!!
		this.collectionCollection = new CollectionCollection;
		this.collectionViewCollection;
		
		this.collectionCollection.fetch({
			success: function( collections, response )
			{
				_this.collectionViewCollection = new CollectionViewCollection({ collection : _this.collectionCollection });
			}
		});
	},
	
	filterByMediaType : function( contentType )
	{
		this.itemCollection.contentType = contentType;
		this.itemCollection.fetch();
	},
	
	refresh : function()
	{
		this.itemCollection.fetch();
	},
	
	filterByCollection : function( collectionID )
	{
		this.itemCollection.resetQuery();
		this.itemCollection.collectionID = collectionID;
		this.itemCollection.fetch();
	},
	
	search : function( query )
	{
		this.itemCollection.query = query;
		this.itemCollection.fetch();
		
	}
	
};

