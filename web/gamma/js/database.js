
/********************************************

	The Database object

*********************************************/

var Database = {
	
	page : 0,
	customSearch: false,
	
	init : function()
	{
		console.log('loading database');
		var z = this;
		this.collection = new ItemCollection;
		
		this.collection.url = Zeega.url_prefix+"search/items/0/100";
		
		this.collection.fetch({
			success: function(items, response){
				z.viewCollection = new ItemViewCollection({ collection : items });
				insertPager( _.size(items), this.page );
			}
		});
		
	},
	
	//useful? maybe
	reset : function()
	{
		console.log('empty database');
		//_.each(this.viewCollection._itemViews,function(view){ view.remove() });
		$('#tab-database-slide-window').empty();
		
		this.collection = new ItemCollection;
		this.viewCollection.collection.reset();
		this.viewCollection._itemViews = [];
		this.viewCollection._itemBundles = [];
		this.viewCollection._rendered = false;
		this.page = 0;
	},
	
	
	//add new database items for endless paging of items
	append : function()
	{
		//look into setting {add:true} in the collection
		var d = this;
		var newItems = new ItemCollection;
		newItems.offset = _.size(this.collection);
		newItems.fetch({
			success: function(items,response){ d.viewCollection.append(items) }
		})
	},
	
	//refresh the current items. reset to page 0. see if any items added to database
	refresh : function()
	{
		console.log('reloading database');
		var d = this;
		this.page = 0;
		this.reset();
		
		this.collection.fetch({
			success: function(items, response){
				d.viewCollection = new ItemViewCollection({ collection : items });
				insertPager( _.size(items), this.page );
			}
		});
		//reset pager to 0
		
	},
	
	setQuery : function( query, contentType )
	{
		var itemsToReturn = 100;
		this.postdata = {

				//Array of query objects - results use OR operator over queries
				//For now, disabled multiple queries
				query:[ 
					{
							/**	contentType [OPTIONAL]				*/
							/**	String 								*/
							/**	'all','image','video','audio'		*/

						contentType: contentType,

							/**	tag [OPTIONAL]						*/
							/**	String Array						*/
							/**	AND operator over Array Elements	*/

					tags: [query] ,  

							/**	geo [OPTIONAL]						*/
							/**	Object		  						*/
							/**	south,north,east,west 				*/

						//geo: {south:41,north:42.4,west:-99.2,east:-87.6},

							/**	time [OPTIONAL]						*/
							/**	Object								*/
							/**	earliest,latest						*/

						//time: {earliest: -218799493233,latest: 218799493233},

							/**	output [REQUIRED]									*/
							/**														*/
							/**	type (String) 'geo','time','collection','item'		*/
							/** 													*/
							/** resolution 											*/
							/** limit	 											*/
							/** offset 												*/

						output: {type:'item', resolution:1, limit:itemsToReturn, offset:(this.page+1)*itemsToReturn }
					},
				],
		};

	},
	
	//what happens if you search for something in the search bar
	search : function( query, contentType )
	{
		var d = this;
		/*
		if( !this.customSearch )
		{
		*/
			this.reset();
			this.customSearch = true;
		//}
		
		this.setQuery(query,contentType);
		
		this.customSearch = new ItemCollection;
		
		$.post('http://alpha.zeega.org/joseph/web/app_dev.php/search', this.postdata, function(data) {
			var response = $.parseJSON(data);
			_.each(response.items, function(item){
				//make search items into bb models
				var newItem = new Item;
				
				newItem.id = item.id;
				newItem.set({
					'title':item.title,
					'item_url':item.item_url,
					'geo_lng':item.geo_lng,
					'geo_lat':item.geo_lat,
					'depth':item.depth,
					'date_created_start':item.date_created_start,
					'date_created_end':item.date_created_end,
					'creator':item.creator,
					'content_type':item.content_type,
					'attribution_url':item.attribution_url,
					'archive':item.archive
				});
				
				d.collection.add(newItem);
				//console.log(newItem);
			});
			d.viewCollection = new ItemViewCollection({ collection : d.collection });
			insertPager( _.size(d.collection), d.page );
		});
		

		this.page++;
	}
	
};









