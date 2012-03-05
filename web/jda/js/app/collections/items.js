(function(Items) {
	Items.ViewCollection = Backbone.View.extend({
		el : $('#items-list'),
	
		initialize : function()
		{
			this.collection = new Items.Collection();
			this.collection.on( 'reset', this.reset, this);
			this._childViews = [];
			$('#spinner').spin('large');

			jda.app.isLoading = true;
		},
	
		render : function()
		{
			var _this = this;

			_this._isRendered = true;
			_.each( _.toArray(this.collection), function(item){
				var itemView = new Items.Views.List({model:item});
				_this._childViews.push( itemView );
				$(_this.el).append( itemView.render().el );
			})

			
			//$(this.el).fadeTo(100,1);
			$("#results-count").fadeTo(100,1);

			$('#spinner').spin(false);
			
			$(this.el).show();
			jda.app.isLoading = false;
			return this;
		},

		renderTags : function(tags){
			$("#related-tags ul").empty();
			if (tags.length > 0){
				_.each( _.toArray(tags), function(tag){
					var li = '<li><a href=".">'+tag.name+'</a></li>';
					$("#related-tags ul").append(li);
					$("#related-tags li").filter(":last").click(function(){
						
						//clear all current search filters
						jda.app.visualSearch.searchBox.clearSearch();

						//add only tag filter
						jda.app.visualSearch.searchBox.addFacet('tag', tag.name, 0);
						


						jda.app.search({ page:1,});
						return false;
					});
				})
				
				$("#related-tags, #related-tags-title").fadeTo(100,1);
			} else {
				if ($("#related-tags-title").is(":visible")){$("#related-tags-title").fadeTo(1000,0);}
			}
		},
		

		reset : function()
		{
			if ( this._isRendered )
			{
				$(this.el).empty();
				this._childViews = [];
				this.render();
			}
		},
		
		search : function(obj,reset)
		{
			var _this = this;
			$("#results-count").fadeTo(1000,0.5);
			$("#related-tags, #related-tags-title").fadeTo(1000,0.5);
			//$(this.el).fadeTo(1000,0.5);
			jda.app.isLoading = true;
			if (obj.page == 1) {
				$(this.el).hide();
			}
			$('#spinner').spin('large');
			
			
			
		
			this.collection.setSearch(obj,reset);
			
			this.setURLHash();
			this.collection.fetch({
				add : obj.page > 1 ? true : false,
				success : function(model, response){ 
					
					//deselect/unfocus last tag - temp fix till figure out why tag is popping up autocomplete
					jda.app.visualSearch.searchBox.disableFacets();

					$('#results-count-number').html(response["items_count"]);
					
					_this.renderTags(response.tags);
					_this.render();
					
					
					if(_this.collection.length<parseInt(response["items_count"])) jda.app.killScroll = false; //to activate infinite scroll again
					else jda.app.killScroll = true;
					
					jda.app.isLoading = false;	//to activate infinite scroll again

				}
			});
			
		},
		
		
		setMapBounds : function(bounds){
 		   this.collection.search.mapBounds = bounds;
 		   this.setURLHash();
 		   },
 	 
 
 	    	setView : function(view){
 	 		this.collection.search.viewType = view;	
       		this.setURLHash();
			},
		
		setContent : function(content){
 		this.collection.search.content = content;
 		this.setURLHash();
 		 },
		
	setURLHash : function (){
	
	
	
	obj = this.collection.search;
 	var hash = '';      
 	if( !_.isUndefined(obj.viewType)) hash += 'view_type=' + obj.viewType + '&';
 	if( !_.isUndefined(obj.q) && obj.q.length > 0) hash += 'q=' + obj.q + '&';
 	if( !_.isUndefined(obj.content) )  hash += 'content='+ obj.content + '&';
 	if( !_.isUndefined(obj.mapBounds) )  hash += 'map_bounds='+ encodeURIComponent(obj.mapBounds) + '&';
 	if( !_.isUndefined(obj.times) ){
 	if( !_.isUndefined(obj.times.start) ) hash += 'start='+ obj.times.start + '&';
 	if( !_.isUndefined(obj.times.end) ) hash += 'end='+ obj.times.end + '&';
	}  
	
 	jda.app.router.navigate(hash,{trigger:false});
	
	},
		

		setStartAndEndTimes : function(startDate, endDate){
			var search = this.collection.search;
			search.times = {};
			search.times.start = startDate;
 	 		search.times.end = endDate;
 	 		this.setURLHash()
		},
		
		getCQLSearchString : function(){
			
			var search = this.collection.search;
			
			var cqlFilters = [];
			if( !_.isUndefined(search.times) ){
				if( !_.isUndefined(search.times.start) ){
					startDate = new Date(search.times.start*1000);
					startString = startDate.format('yyyy-mm-dd HH:MM:ss');
					cqlFilters.push("media_date_created >= '" + startString +"'");
				}
				if( !_.isUndefined(search.times.start) ){
					endDate = new Date(search.times.end*1000);
					endString = endDate.format('yyyy-mm-dd HH:MM:ss');
					cqlFilters.push("media_date_created <= '" + endString +"'");
				}	
			}
			if( !_.isUndefined(search.q) ){
				for (var i=0; i<search.q.length; i++) {
					q = search.q[i];
					cqlFilters.push("(title LIKE '%"+q+"%' OR media_creator_username LIKE '%"+q+"%' OR description LIKE '%"+q+"%')");
				}
			}
			if( !_.isUndefined(search.tags) ){
				cqlFilters.push("tags='" + search.tags + "'");
			 }
			 if( !_.isUndefined(search.content)&&search.content!="all" ){  
         var capitalizedContent =  search.content.charAt(0).toUpperCase() + search.content.slice(1);
         cqlFilters.push("media_type='" + capitalizedContent + "'");
	
       }
			if (cqlFilters.length>0){
				cqlFilterString = cqlFilters.join(" AND ");
			}else{
				cqlFilterString = "INCLUDE";   //acts as an empty filter
			}
			return cqlFilterString;
		},
	
		
		getSearch : function(){ return this.collection.search },
		
			//Formats returned results number
		addCommas : function(nStr)
		{
		  nStr += '';
		  x = nStr.split('.');
		  x1 = x[0];
		  x2 = x.length > 1 ? '.' + x[1] : '';
		  var rgx = /(\d+)(\d{3})/;
		  while (rgx.test(x1)) {
		    x1 = x1.replace(rgx, '$1' + ',' + '$2');
		  }
		  return x1 + x2;
		},
		
	});


	Items.MapPoppupViewCollection = Backbone.View.extend({
		className : 'discovery-map-list-container',

		initialize : function() {
			var _this = this;
			this._childViews = [];
			this.render();
		},

		render : function() {
			var _this = this;
			_this._isRendered = true;
			list = $("<ul class='discovery-map-list'></ul>");
 			$(this.el).append(list);
			_.each( _.toArray(this.collection), function(item){
				var itemView = new Items.Views.MapPopup({model:item});
				//_this._childViews.push(itemView);
				list.append( itemView.render().el );
			});
			return this;
		},
	});

		
	



	Items.Collection = Backbone.Collection.extend({
		
		model:Items.Model,
		base : jda.app.apiLocation + 'api/search?',
		search : {	page:1,
					r_itemswithcollections: 0,
					r_items:1,
					r_tags:1

							},
	
		url : function()
		{
			//constructs the search URL
			var url = this.base;
			if( !_.isUndefined(this.search.q) && this.search.q.length > 0) url += '&q=' + this.search.q.toString();
			if( !_.isUndefined(this.search.viewType) ) url += '&view_type=' + this.search.viewType;
			if( !_.isUndefined(this.search.content) ) url += '&content=' + this.search.content;
			if( !_.isUndefined(this.search.page) ) url += '&page=' + this.search.page;
			if( !_.isUndefined(this.search.r_items) ) url += '&r_items=' + this.search.r_items;
			if( !_.isUndefined(this.search.r_tags) ) url += '&r_tags=' + this.search.r_tags;
			if( !_.isUndefined(this.search.r_itemswithcollections) ) url += '&r_itemswithcollections=' + this.search.r_itemswithcollections;
			if( !_.isUndefined(this.search.times) ){
				if( !_.isUndefined(this.search.times.start) ) url += '&dtstart=' + this.search.times.start;
				if( !_.isUndefined(this.search.times.end) ) url += '&dtend=' + this.search.times.end;
	     	}
			console.log('search url: '+ url);
			return url;
		},
	
		setSearch : function(obj, reset)
		{
			if(reset) this.search = obj;
			else _.extend(this.search,obj)
			console.log('set search: '+obj)
		},
		
		getSearch : function()
		{
			return this.search;
		},
	
		parse : function(response)
		{
			return response.items;
		}
	
	});

	Items.Router = Backbone.Router.extend({ /* ... */ });


})(jda.module("items"));
