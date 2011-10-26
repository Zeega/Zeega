
/********************************************

	The Database object

*********************************************/

var Database = {
	
	page : 0,
	customSearch : false,
	
	
	init : function()
	{
		console.log('loading database');
		var z = this;
		this.basicURL = Zeega.url_prefix+"search/items/0/100";
		
		this.collection = new ItemCollection;
		
		this.collection.url = this.basicURL;
		
		
		this.collection.fetch({
			success: function(items, response){
				z.viewCollection = new ItemViewCollection({ collection : items });
				insertPager( _.size(items), this.page );
			}
		});
		
		this.setQuery(null,'all');
		//this.search(null,'all');
		
	},
	
	//useful? maybe
	reset : function()
	{
		console.log('empty database');
		//_.each(this.viewCollection._itemViews,function(view){ view.remove() });
		$('#tab-database-slide-window').cycle('destroy');
		$('#tab-database-slide-window').empty();

		
		this.collection = new ItemCollection;
		this.viewCollection.collection.reset();
		this.viewCollection._itemViews = [];
		this.viewCollection._itemBundles = [];
		this.viewCollection._rendered = false;
		this.page = 0;

		$('#tab-database-slide-window').spin('small','white');
	},
	
	
	//add new database items for endless paging of items
	append : function()
	{
		//check to see if it's a custom search or not
		if(this.customSearch)
		{
			this.setQuery(this.postdata.query[0].tags, this.postdata.query[0].contentType);
			console.log('load more from the custom search');
			this.search();
			
		}else{
			
			//look into setting {add:true} in the collection
			var d = this;
			var newItems = new ItemCollection;
			newItems.url = Zeega.url_prefix+"search/items/"+ _.size(this.collection) +"/100";
			
			//newItems.offset = _.size(this.collection);
			newItems.fetch({
				success: function(items,response){ d.viewCollection.append(items) }
			})
			
		}
	},
	
	changeFilter : function(el)
	{
		var filter = $(el).val();
		this.search( null, filter );
	},
	
	//refresh the current items. reset to page 0. see if any items added to database
	refresh : function()
	{
		console.log('reloading database');
		var d = this;
		this.customSearch = false;
		this.page = 0;
		this.reset();
		
		this.collection.url = this.basicURL;
		
		this.collection.fetch({
			success: function(items, response){
				d.viewCollection = new ItemViewCollection({ collection : items });
				insertPager( _.size(items), this.page );
			}
		});
		
	},
	
	setQuery : function( query, contentType )
	{


		// parse the query here. something that can be done later
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

					tags: query ,  

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

					output: {type:'item', resolution:1, limit:itemsToReturn, offset:_.size(this.collection) }
				},
			],
		};
			
			

	},
	
	//what happens if you search for something in the search bar
	search : function( query, contentType )
	{
		var d = this;
		this.reset();
		
		//if the query is null && there is no existing query in postdata then do a general search for filter type. no query. change filter
		if(query == null && this.postdata.query[0].tags == null)
		{
			this.setQuery( [], contentType );

		//if query is null && there IS an existing query, then filter that query  by type. retain existing query. change filter
		}else if(query == null && this.postdata.query[0].tags != null){
			this.setQuery( this.postdata.query[0].tags, contentType );
			
		// new query, new filter
		}else if(query == '' && contentType == 'all'){
			this.refresh();
			return false;
		}else if(query == ''){
			this.setQuery( [], contentType );
		}else{
			console.log('new query');
			this.setQuery( [query], contentType );
		}
		
		
		$.post(Zeega.url_prefix+'search', this.postdata, function(data) {
			var response = $.parseJSON(data);
			
			//make sure there's something in the results and give a friendly notice if not
			if(response.items.length)
			{
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
				});
				
				//add to the view collection and add to the dom
				d.viewCollection = new ItemViewCollection({ collection : d.collection });
				insertPager( _.size(d.collection), d.page );
				this.page++;
			
			}else{
				//if the search returns nothing
				var error = $("<div class='alert-message error'><p>We couldn't find what you're looking for :( Try again?</p></div>");
				$('#database-pager').fadeOut('fast',function(){$(this).empty();$(this).show();});
				$('#tab-database-slide-window').html(error);
				
			}
			$('#tab-database-slide-window').spin(false);
			
		});
		
		

		
	}
	
	
};


