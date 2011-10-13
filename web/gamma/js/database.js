
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
		if( !this.customSearch )
		{
			this.reset();
			this.customSearch = true;
		}
		
		this.setQuery(query,contentType);
		
		$.post('http://mlhplayground.org/Symfony/web/app_dev.php/search', this.postdata, function(data) {
			var response = $.parseJSON(data);
			console.log(response.items);

		});

		this.page++;
	}
	
};









