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
				console.log('database success');
				console.log(items)
				
				_this.itemViewCollection = new ItemViewCollection({ collection : _this.itemCollection });
				
				
			}
		});
	}
	
	
	
	
/*
	
    var debug = true;
    var that = this;
	this.page = 0;
	this.customSearch = false;
	this.endOfItems = false;
		
	this.init = function()
	{
		if(debug) console.log('database:init');
		reset();
		this.search(null,'all', true);
	};

	//what happens if you search for something in the search bar
	this.search = function( query, contentType, reset )
	{
	    if(_.isNull(query) || _.isUndefined(query))
	        query = '';
	        
	    if(debug) console.log("database:search " + query + "," + contentType + "," +reset);   
		
		if(reset)
		{
		    that.collection = new ItemCollection;
		    that.page = 0;
		    that.endOfItems = false;
		}
		
		setQuery( query, contentType );
		
		$.post(Zeega.url_prefix+'search', this.postdata, function(data) {

			var response = $.parseJSON(data);
			
			if(response.items.length < 100)
			{
				that.endOfItems = true;
			}
			
			//make sure there's something in the results and give a friendly notice if not
			if(response.items.length)
			{

				
				_.each(response.items, function(item){
					
					//make search items into bb models
					var newItem = new Item;
				
					newItem.id = item.id;
					newItem.set({
						'title':item.title,
						'item_url':item.uri,
						'geo_lng':item.media_geo_longitude,
						'geo_lat':item.media_geo_latitude,
						'date_created_start':item.date_created_start,
						'date_created_end':item.date_created_end,
						'creator':item.media_creator_username,
						'content_type':item.type,
						'source_type':item.source,
						'attribution_uri':item.attribution_uri,
						'thumbnail_url':item.thumbnail_url,
					});
				
					that.collection.add(newItem);
				});
				
				//add to the view collection and add to the dom
				that.viewCollection = new ItemViewCollection({ collection : that.collection });
				that.page++;
			
			}else{
				//if the search returns nothing
				var error = $("<div class='alert-message error'><p>We couldn't find what you're looking for :( Try again?</p></div>");
				$('#database-pager').fadeOut('fast',function(){$(this).empty();$(this).show();});
				$('#tab-database-slide-window').html(error);
				
			}
			$('#tab-database-slide-window').spin(false);
			
		});
	};
	

	
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
	
	*/
	
	
};

