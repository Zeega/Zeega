/*
   Class: Database
   Manages the connection to the database
*/
var Database = new function()
{	
    var that = this;
	this.page = 0;
	this.customSearch = false;
	this.endOfItems = false;
		
	this.init = function()
	{
		console.log('loading database');
		reset();
		setQuery(null,'all');
		
		this.search(null,'all', false);
	};

    /* 
       Function: Append
       Loads more items from the database.

       See Also:
          <Search>
    */
	this.append = function()
	{
		setQuery(this.postdata.query[0].queryString, this.postdata.query[0].contentType, false);
		console.log('load more from the custom search');
		this.search();
	};
	
	// deprecated - use search instead
	this.changeFilter = function(el)
	{
	    console.log("database:changeFilter");
		var filter = $(el).val();
		this.search( null, filter, true );
	};
	
	//refresh the current items. reset to page 0. see if any items added to database
	this.refresh = function()
	{
		console.log('reloading database');
		var d = this;
		this.customSearch = false;
		this.page = 0;

		//setQuery(null,'all');
		
		this.search(null,'all', true);
	};
	
	//what happens if you search for something in the search bar
	this.search = function( query, contentType, reset )
	{
	    if(_.isNull(query) || _.isUndefined(query))
	        query = '';
	        
	    console.log("database:search " + query + "," + contentType + "," +reset);   
		
		var d = that;
		//if(reset) reset();
		
		/*if(query == '' && contentType == 'all'){
			this.refresh();
			return false;
		*/
		setQuery( query, contentType );
		
		$.post(Zeega.url_prefix+'search', this.postdata, function(data) {
		    //console.log("database:search " + data);
			var response = $.parseJSON(data);
			
			if(response.items.length < 100)
			{
				console.log('the end');
				this.endOfItems = true;
			}
			
			//make sure there's something in the results and give a friendly notice if not
			if(response.items.length)
			{
			    if(reset) d.collection = new ItemCollection;
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
						'source_type':item.source_type,
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
	};
	
	// PRIVATE
	
	var setQuery = function( query, contentType )
	{
	    console.log("database:setQuery " + query + "," + contentType);
		// parse the query here. something that can be done later
		var itemsToReturn = 100;
		if(query == null) query = '';

		that.postdata = {
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

					queryString: query ,  

						/**	geo [OPTIONAL]						*/
						/**	Object		  						*/
						/**	south,north,east,west 				*/

					output: {type:'item', resolution:1, limit:itemsToReturn, offset:_.size(this.collection) }
				},
			],
		};
	};
	
	// deprecated
	var setQueryOld = function( query, contentType )
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
	};
	
	//useful? maybe
	var reset = function()
	{
		console.log('empty database');
		//_.each(this.viewCollection._itemViews,function(view){ view.remove() });
		$('#tab-database-slide-window').cycle('destroy');
		$('#tab-database-slide-window').empty();

		that.collection = new ItemCollection;
		
		if(that.viewCollection)
		{
			that.viewCollection.collection.reset();
			that.viewCollection._itemViews = [];
			that.viewCollection._itemBundles = [];
			that.viewCollection._rendered = false;
		}
		that.page = 0;
		that.endOfItems = false;
		
		$('#tab-database-slide-window').spin('small','white');
	};
};

