(function(Items) {

		Items.Collections = Items.Collections || {};
		Items.Collections.Views =  Items.Collections.Views || {};
	
	Items.Collections.Views.Results = Backbone.View.extend({
		
		el : $('#zeega-items-list'),
	
		initialize : function(){
			this.collection = new Items.Collection();
			this.collection.on( 'reset', this.reset, this);
			this._childViews = [];
			this._collectionChildViews = [];
			$('#spinner').spin('large');

			zeega.discovery.app.isLoading = true;

			this.collection.bind('remove', this.remove, this);
			
			
		},
		
		remove : function(model){
			var deleteIdx = -1;
			for (var i=0;i<this._childViews.length;i++){
				var itemView = this._childViews[i];
				if (itemView.model.id == model.id){
					deleteIdx = i;
					break;
				}
			}

			if (deleteIdx >= 0){
				var removed = this._childViews.splice(deleteIdx,1);
				$(this.el).find(removed[0].el).remove();

				this.updateResultsCounts();
				this.updated = true;
				
			}

		},
		removeCollection : function(model){
			var deleteIdx = -1;
			for (var i=0;i<this._collectionChildViews.length;i++){
				var itemView = this._collectionChildViews[i];
				if (itemView.model.id == model.id){
					deleteIdx = i;
					break;
				}
			}

			if (deleteIdx >= 0){
				var removed = this._collectionChildViews.splice(deleteIdx,1);
				$(removed[0].el).remove();

				this.updateResultsCounts();
				this.updated = true;
				
			}

		},
		
		updateResultsCounts : function(){
			var collectionsCount = 0;
			if (this.collection.collectionsCollection){
				collectionsCount = this.collection.collectionsCollection.length;
			}
			var itemsCount = this.collection.count;

			if (collectionsCount !=null){
				$('.jda-results-collections-count').text( this.addCommas(collectionsCount));
			}
			$('.jda-results-items-count').text( this.addCommas(itemsCount));
			$("#zeega-results-count-number").html( this.addCommas(itemsCount) );
		},
		
		render : function(){
			var _this = this;
			$("#zeega-results-count").hide();
			
			_this._isRendered = true;
			if(zeega.discovery.app.currentView == 'thumb'){
				this.el = '#zeega-items-thumbnails';
			} else {
				this.el = '#zeega-items-list';
			}
			
			
			//Display collections and items separately if this is not null
			if (this.collection.collectionsCollection != null){
				
				this.collection.collectionsCollection.unbind().bind('remove', this.removeCollection, this);

				if(zeega.discovery.app.currentView == 'thumb') $('.collections-thumbnails').empty();
				else if(zeega.discovery.app.currentView == 'list') $('#zeega-collections-list').empty();
				
				
				//Display collections
				_.each( _.toArray(this.collection.collectionsCollection), function(item){
					var itemView;
					if(zeega.discovery.app.currentView == 'thumb'){
						itemView = new Items.Views.Thumb({model:item});
						$('.collections-thumbnails').append( itemView.render().el );
						
					} else{
						
						itemView = new Items.Views.List({model:item});
						$('#zeega-collections-list').append( itemView.render().el );
					}
					
					_this._collectionChildViews.push( itemView );
					
				})

				$('.jda-separate-collections-and-items').show();
				if (this.collection.collectionsCollection.length ==0){
					$('.jda-separate-collections-and-items').find('.jda-results-collections-text').hide();
				}
				
			} else {
				$('#zeega-results-count-number').text(this.addCommas(this.collection.count)); 
				$("#zeega-results-count").fadeTo(100,1);
			}
			
			//Display items
			
			var q =0;
			
			_.each( _.toArray(this.collection), function(item){
				q++;
				if(q>(_this.collection.search.page-1)*100){
					var itemView;
					if(zeega.discovery.app.currentView == 'thumb'){
						itemView = new Items.Views.Thumb({model:item});
					} else{
						
						itemView = new Items.Views.List({model:item});
					}
					
					_this._childViews.push( itemView );
					$(_this.el).append( itemView.render().el );
				}
			})
			

			
			
			//this is kind of a hack - give all thumbnails same height
			//to fix floaty issues
	


			this.updateResultsCounts();
			
			$(this.el).show();

			zeega.discovery.app.isLoading = false;
	
		
			//Display related Tags
			
			if (!_.isUndefined(this.collection.tags) && this.collection.tags.length > 0 && zeega.discovery.app.currentView != 'event'){
				$("#jda-related-tags button").remove();
				_.each( _.toArray(this.collection.tags), function(tag){

					var tagHTML ='<button class="btn btn-mini">'+tag.name+'</button> ';
					
					$("#jda-related-tags").append(tagHTML);
					$("#jda-related-tags button").filter(":last").click(function(){
						
						
						
						
						//clear all current search filters
						zeega.discovery.app.clearSearchFilters(false);

						//add only tag filter
						VisualSearch.searchBox.addFacet('tag', tag.name, 0);
						


						zeega.discovery.app.parseSearchUI();
						return false;
					});
				})
				
				$("#jda-related-tags-title").fadeTo(100,1);
			}
			else $("#jda-related-tags-title").fadeTo(1000,0);

			$('#spinner').spin(false);
			$('#spinner-text').fadeTo('slow',0);
			$('#jda-left').fadeTo('slow',1);
			return this;
		},
		
		renderTags : function(){
		},
		
		reset : function(){
			if ( this._isRendered )
			{
				$(this.el).empty();
				this._childViews = [];
				//this.render();
			}
		},
		
		search : function(obj,reset)
		{
		
			console.log("zeega.discovery.app.resultsView.search",obj);
			var _this = this;
			
			this.updated = true;
			
			$("#zeega-results-count").fadeTo(1000,0.5);

			$("#related-tags-title:visible").fadeTo(1000,0.5);
			//$(this.el).fadeTo(1000,0.5);
			zeega.discovery.app.isLoading = true;
			if (obj.page == 1) $(this.el).hide();

			$('#spinner').spin('large');

			this.collection.setSearch(obj,reset);
	
			
			// fetch search collection for the list/thumb view
			this.collection.fetch({
				add : (obj.page) > 1 ? true : false,
				success : function(model, response)
				{
					//deselect/unfocus last tag - temp fix till figure out why tag is popping up autocomplete
					
					VisualSearch.searchBox.disableFacets();

					$('#zeega-results-count-number').html( _this.addCommas(response["items_count"]));
					_this.renderTags(response.tags);
					_this.render();
					
					if(_this.collection.length<parseInt(response["items_count"])) zeega.discovery.app.killScroll = false; //to activate infinite scroll again
					else zeega.discovery.app.killScroll = true;
					$(_this.el).fadeTo(1000,1);
					zeega.discovery.app.isLoading = false;	//to activate infinite scroll again

				},
				error : function(model, response){
					console.log('Search failed - model is ' + model);
				}
			});
		},
		
		

		
		
		setMapBounds : function(bounds)
		{
			this.collection.search.mapBounds = bounds;
		},
	 

		setContent : function(content)
		{
			this.collection.search.content = content;

		},
		clearTags : function(){
			var currentQ = 	this.collection.search.q;
			if (currentQ.indexOf("tag:") >= 0){
				var newQ = currentQ.substring(0,currentQ.indexOf("tag:"));
				this.collection.search.q = newQ;

			}
		},

		setStartAndEndTimes : function(startDate, endDate)
		{
			var search = this.collection.search;
			search.times = {};
			search.times.start = startDate;
			search.times.end = endDate;

		},
		
		getCQLSearchString : function()
		{
		
			var search = this.collection.search;
		
			var cqlFilters = [];
			if( !_.isUndefined(search.times) &&!_.isNull(search.times))
			{
				if( !_.isUndefined(search.times.start) )
				{
					startDate = new Date(search.times.start*1000);
					startString = startDate.format('yyyy-mm-dd HH:MM:ss');
					cqlFilters.push("media_date_created >= '" + startString +"'");
				}
				if( !_.isUndefined(search.times.end) )
				{
					endDate = new Date(search.times.end*1000);
					endString = endDate.format('yyyy-mm-dd HH:MM:ss');
					cqlFilters.push("media_date_created <= '" + endString +"'");
				}	
			}

			//Tags and Texts are stored in the q property
			if( !_.isUndefined(search.q) )
			{
				var text = search.q;
				if(text)
				{
					if(cqlFilters.length > 0)
					{
						var newCqlFilters = [];
						var prevCqlFiltersString = cqlFilters.join(" AND ");
						newCqlFilters.push(prevCqlFiltersString + " AND (title LIKE '%"+text+"%' OR " + prevCqlFiltersString + " AND media_creator_username LIKE '%"+text+"%' OR " + prevCqlFiltersString + " AND description LIKE '%"+text+"%')");
						
						cqlFilters = newCqlFilters;
					}
					else
					{
						console.log("map search");
						cqlFilters.push("(title LIKE '%"+text+"%' OR media_creator_username LIKE '%"+text+"%' OR description LIKE '%"+text+"%')");
					}
				}
			}
			if( !_.isUndefined(search.content)&&search.content!="all" )
			{  
				var capitalizedContent =  search.content.charAt(0).toUpperCase() + search.content.slice(1);
				cqlFilters.push("media_type='" + capitalizedContent + "'");
			}
			if (cqlFilters.length>0)
			{
				cqlFilterString = cqlFilters.join(" AND ");
			}
			else
			{
				cqlFilterString = null;
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
			while (rgx.test(x1))
			{
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}
		
	});

})(zeega.module("items"));