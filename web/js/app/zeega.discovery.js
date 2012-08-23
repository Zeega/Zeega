//Adds a function to the javascript date object.
//Didn't really know where to put this so I put it here...(Catherine)
Date.prototype.getMonthAbbreviation = function() {
   return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()]; 
}


this.zeega = this.zeega || {

		// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an existing module.
		return function(name) 
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];

			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),


};

this.zeega.discovery = {


  // Keep active application instances namespaced under an app object.
  app: _.extend({
	
	apiLocation : sessionStorage.getItem("hostname")+sessionStorage.getItem("directory"),
	currentView : 'list',
	resultsPerPage : 100,
	
	init : function(){
		// make item collection
		this.currentFilter=null;
		
		var Items = zeega.module("items");
		
		
		this.resultsView = new Items.Collections.Views.Results();
		
		
		//this.eventMap = new Views.EventMap();
		
		this.eventMap ={};
		
		this.initCollectionsDrawer();
		
		
		this.startRouter();
		var _this=this;
		$('#zeega-sort').change(function(){_this.parseSearchUI(); });
		
	},
	initCollectionsDrawer:function(){
		//load my collections drawer
		var Items = zeega.module("items");
		this.myCollectionsDrawer = new Items.Collections.Views.MyCollectionsDrawer();
		this.myCollectionsDrawer.getCollectionList();
		
	
	
	},
	startRouter: function(){
		var _this = this;
			// Defining the application router, you can attach sub routers here.
		var Router = Backbone.Router.extend({
	
			routes: {
				""				: 'search',
				":query"		: 'search',
	
			},
	
			search : function( query ){
						_this.parseURLHash(query);
					}
			});
	
		this.router = new Router();
		Backbone.history.start();
	},
	
	
	queryStringToHash: function (query) {
	  var query_obj = {};
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		pair[0] = decodeURIComponent(pair[0]);
		pair[1] = decodeURIComponent(pair[1]);
			// If first entry with this name
		if (typeof query_obj[pair[0]] === "undefined") {
		  query_obj[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_obj[pair[0]] === "string") {
		  var arr = [ query_obj[pair[0]], pair[1] ];
		  query_obj[pair[0]] = arr;
			// If third or later entry with this name
		} else {
		  query_obj[pair[0]].push(pair[1]);
		}
	  }
	  
	  //parse time slider properties
		query_obj.times = {};
		if (query_obj.min_date != null){
			query_obj.times.start = query_obj.min_date;
		}
		if (query_obj.max_date != null){
			query_obj.times.end = query_obj.max_date;
		}
	  
	  return query_obj;
	},
	
	parseURLHash  : function (query){
	
					var _this=this;
					
					//Update Search Object
					
					if (!_.isUndefined(query)) this.searchObject =  this.queryStringToHash(query);
					else this.searchObject = {page:1};

					//Update interface
					
					this.updateSearchUI(this.searchObject);
					
					//Load filter if nec, carry out search
					
					if(sessionStorage.getItem('filterType')=='none'||!_.isUndefined(this.filterModel)) {
					
						if (!_.isUndefined(this.searchObject.view_type)) this.switchViewTo(this.searchObject.view_type,true) ;
						else this.search(this.searchObject);
					}
					else{
					
						$('.tab-content').find('.btn-group').hide();
						$('#jda-related-tags').hide();
						$('#event-button').hide();
						
						if(sessionStorage.getItem('filterType')=='user'){
							this.filterType ="user";							
							var Items = zeega.module("items");
							this.filterModel = new Users.Model({id:sessionStorage.getItem('filterId')});
							this.filterModel.fetch({
								success : function(model, response){
												_this.resultsView.userFilter = new Users.Views.UserPage({model:model});
												if (!_.isUndefined(_this.searchObject.view_type)) _this.switchViewTo(_this.searchObject.view_type,true) ;
												else _this.search(_this.searchObject);
								},
								error : function(model, response){
									console.log('Failed to fetch the user object.');
									
								},
							});					
						}
						else if(sessionStorage.getItem('filterType')=='collection'){
							
							this.filterType ="collection";
							var Items = zeega.module("items");
							this.filterModel = new Items.Model({id:sessionStorage.getItem('filterId')});
							this.filterModel.fetch({
								success : function(model, response){
									_this.resultsView.collectionFilter = new Items.Views.CollectionPage({model:model});
									if (!_.isUndefined(_this.searchObject.view_type)) _this.switchViewTo(_this.searchObject.view_type,true) ;
									else _this.search(_this.searchObject);
								},
								error : function(model, response){
									console.log('Failed to fetch the user object.');
									
								},
					
							});
						
						}
					}
				
	
	
	},
	
	parseSearchUI : function(){
		
		var facets = VisualSearch.searchQuery.models;
			
		var obj={};
		var tagQuery = "tag:";
		var textQuery = "";

		_.each(facets, function(facet){
			switch ( facet.get('category') )
			{
				case 'text':
					textQuery = (textQuery.length > 0) ? textQuery + " AND " + facet.get('value') : facet.get('value'); 
					textQuery=textQuery.replace(/^#/, '');
					break;
				case 'tag':
					tagQuery = (tagQuery.length > 4) ? tagQuery + ", " + facet.get('value') : tagQuery + facet.get('value');
					tagQuery=tagQuery.replace(/^#/, '');
					break;
			}
		});
			
		obj.q = textQuery + (textQuery.length > 0 && tagQuery.length > 4 ? " " : "") + (tagQuery.length > 4 ? tagQuery : "");
		obj.text = textQuery;
		obj.view_type = this.currentView;

	
		
		obj.content = $('#zeega-content-type').val();
		obj.sort = $('#zeega-sort').val();
		
		obj.times = this.searchObject.times;
		
		this.searchObject=obj;
		
		
		this.updateURLHash(obj);
		this.search(obj);
	
	},
	
	updateSearchUI : function(obj){
	
		console.log("zeega.discovery.app.updateSearchUI",obj);	
	
		VisualSearch.searchBox.disableFacets();
	    VisualSearch.searchBox.value('');
	  	VisualSearch.searchBox.flags.allSelected = false;
		var q = obj.q;
		if (!_.isUndefined(q))
		{
			//check for tags
			if (q.indexOf("tag:") >=0){
				var tagPart = q.substr(q.indexOf("tag:") + 4);
				var tagNames = tagPart.split(" ");
				for(var i=0;i<tagNames.length;i++)
				{
					var tagName = tagNames[i];
					VisualSearch.searchBox.addFacet('tag', tagName, 0);
				}
			}
			//check for text
			var textPart = q.indexOf("tag:") >= 0 ? q.substr(0,  q.indexOf("tag:")) : q;
			if (textPart.length > 0)
			{
				var texts = textPart.split(",");
				for(var i=0;i<texts.length;i++)
				{
					var text = texts[i];
					VisualSearch.searchBox.addFacet('text', text, 0);
				}
			}
			
		}
		
		
		if (!_.isUndefined(obj.content)) $('#zeega-content-type').val(obj.content);
		else $('#zeega-content-type').val("all");
		
		if (!_.isUndefined(obj.sort)) $('#zeega-sort').val(obj.sort);
		else $('#zeega-sort').val("relevant");
		
		$('#select-wrap-text').text( $('#zeega-content-type option[value=\''+$('#zeega-content-type').val()+'\']').text() );
		
		
	},
	
	updateURLHash : function(obj){
		
		 	var hash = '';      
		 	if( !_.isUndefined(this.viewType)) hash += 'view_type=' + this.viewType + '&';
		 	if( !_.isUndefined(obj.q) && obj.q.length > 0) hash += 'q=' + obj.q + '&';
		 	if( !_.isUndefined(obj.content) )  hash += 'content='+ obj.content + '&';
		 	if( !_.isUndefined(obj.sort) )  hash += 'sort='+ obj.sort + '&';
		 	if( !_.isUndefined(obj.mapBounds) )  hash += 'map_bounds='+ encodeURIComponent(obj.mapBounds) + '&';
		 	if( !_.isUndefined(obj.times)&&  !_.isNull(obj.times) )
			{
		 		if( !_.isUndefined(obj.times.start) ) hash += 'min_date='+ obj.times.start + '&';
		 		if( !_.isUndefined(obj.times.end) ) hash += 'max_date='+ obj.times.end + '&';
			}  
	
			console.log('zeega.discovery.app.updateURLHash',obj,hash);
	 		zeega.discovery.app.router.navigate(hash,{trigger:false});
	
	},
	
	search : function(obj){
	
		console.log("zeega.discovery.app.search",obj);		
		
		if(!_.isUndefined(this.filterType)){
			if(this.filterType=="user"){
				obj.user= sessionStorage.getItem('filterId');
				obj.r_collections=1;
				obj.r_items=1;
				obj.r_itemswithcollections=0;
			}
			else if(this.filterType=="collection"){
				obj.collection = sessionStorage.getItem('filterId');
				obj.r_items=1;
				obj.r_itemswithcollections=0;
			
			}
		}
		
	
		this.resultsView.search( obj,true );
		
		if (this.currentView == 'event') this.eventMap.load();
		
	},
	
	switchViewTo : function( view , refresh ){
	
		console.log("zeega.discovery.app.switchViewTo",view,this.currentView,refresh);
	
		var _this=this;

		if( view != this.currentView&&(view=="event"||this.currentView=="event"))refresh = true;
	
		 
		this.currentView = view;
		$('.tab-pane').removeClass('active');
		$('#zeega-'+view+'-view').addClass('active');
		
	
		switch( this.currentView )
		{
			case 'list':
				this.showListView(refresh);
				break;
			case 'event':
				this.showEventView(refresh);
				break;
			case 'thumb':
				this.showThumbnailView(refresh);
				break;
			default:
				console.log('view type not recognized')
		}
		
	},

	showListView : function(refresh){
		console.log('switch to List view');

	
	    
		$('#zeega-view-buttons .btn').removeClass('active');
		$('#list-button').addClass('active');
		

		$('#jda-right').show();
		$('#event-time-slider').hide();
		$('#zeega-results-count').removeClass('zeega-results-count-event');
		$('#zeega-results-count').css('left', 0);
		$('#zeega-results-count').css('z-index', 0);

		$('#zeega-results-count-text-with-date').hide();

		if(this.resultsView.updated)
		{
			console.log('render collection')
			this.resultsView.render();
		}
		this.viewType='list';
		if(refresh){
			this.searchObject.times=null;
			this.search(this.searchObject);
		}
	    
	    this.updateURLHash(this.searchObject);
		
	},
	
	showThumbnailView : function(refresh){
		
		
	
		$('#zeega-view-buttons .btn').removeClass('active');
		$('#thumb-button').addClass('active');
		
		$('#jda-right').show();
		$('#event-time-slider').hide();
		$('#zeega-results-count').removeClass('zeega-results-count-event');
		$('#zeega-results-count').css('left', 0);
		$('#zeega-results-count').css('z-index', 0);

		$('#zeega-results-count-text-with-date').hide();
		
		if(this.resultsView.updated)
		{
			console.log('render collection')
			this.resultsView.render();
		}
		this.viewType='thumb';
		if(refresh){
			this.searchObject.times=null;
			this.search(this.searchObject);
		}
	    this.updateURLHash(this.searchObject);
	},
	
	showEventView : function(refresh){
		console.log('switch to Event view');
		$('#zeega-view-buttons .btn').removeClass('active');
		$('#event-button').addClass('active');
		
		$('#jda-right').hide();
		$('#event-time-slider').show();
		$('#zeega-results-count').addClass('zeega-results-count-event');
		$('#zeega-results-count').offset( { top:$('#zeega-results-count').offset().top, left:10 } );
		$('#zeega-results-count').css('z-index', 1000);

		$('#zeega-results-count-text-with-date').show();
		
		var removedFilters = "";
		var _this = this;
		_.each( VisualSearch.searchBox.facetViews, function( facet ){
			if( facet.model.get('category') == 'tag' || facet.model.get('category') == 'collection' ||
				facet.model.get('category') == 'user') 
			{
				facet.model.set({'value': null });
				facet.remove();
				removedFilters += facet.model.get('category') + ": " + facet.model.get('value') + " ";
				
				
			}
			if( facet.model.get('category') == 'tag'){
				_this.resultsView.clearTags();
			}
			if( facet.model.get('category') == 'collection' ||
				facet.model.get('category') == 'user') {
				_this.removeFilter(facet.model.get('category'),_this.resultsView.getSearch());
				
			}
			
		})
		if (removedFilters.length > 0){
			$('#removed-tag-name').text(removedFilters);
			$('#remove-tag-alert').show('slow');
			setTimeout(function() {
			  $('#remove-tag-alert').hide('slow');
			}, 5000);
		}
		
		$("#zeega-event-view").width($(window).width());

		//this is the hacky way to update the search count properly on the map
		$("#zeega-results-count").fadeTo(100,0);
		
		
		this.viewType='event';
		this.parseSearchUI();
	},
	
	setEventViewTimePlace : function(obj){
		this.eventMap.updateTimePlace(obj);
	},
		
	clearSearchFilters : function(doSearch){
		console.log("zeega.discovery.app.clearSearchFilters", doSearch);

    	$('#zeega-content-type').val("all");
    	$('#select-wrap-text').text( $('#zeega-content-type option[value=\''+$('#zeega-content-type').val()+'\']').text() );

    	//remove search box values
    	VisualSearch.searchBox.disableFacets();
	    VisualSearch.searchBox.value('');
	  	VisualSearch.searchBox.flags.allSelected = false;
	  	if(doSearch) this.search({ page:1,});
	},
	
	goToCollection: function (id){
	
		console.log('gotocollection',id);
		window.location="library/collection/"+id;
	
	},
	
	goToUser: function (id){
	
		console.log('gotouser',id);
		window.location=$('#zeega-main-content').data('user-link')+"/"+id;
	
	},
		


	

}, Backbone.Events)


};