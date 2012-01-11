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
		
		this.itemCollection.fetch({
			success: function( items ){
				console.log(items)
				_this.itemViewCollection = new ItemViewCollection({ collection : _this.itemCollection });
			}
		});
		
		this.collectionCollection = new CollectionCollection;
		this.collectionViewCollection;
		
		this.collectionCollection.fetch({
			success: function( collections ){
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

