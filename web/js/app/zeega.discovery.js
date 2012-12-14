//Adds a function to the javascript date object.
//Didn't really know where to put this so I put it here...(Catherine)
Date.prototype.getMonthAbbreviation = function() {
	return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()];
};


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
	}()
};

this.zeega.discovery = {


  // Keep active application instances namespaced under an app object.
  app: _.extend({
	
	
	
	apiLocation : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory'),
	currentView : 'thumb',
	resultsPerPage : 100,
	
	init : function(){
		// make item collection
		this.currentFilter=null;
		
		var Items = zeega.module("items");
		
		
		this.resultsView = new Items.Collections.Views.Results();
		this.eventMap ={};
		this.initCollectionsDrawer();
		
		
		this.startRouter();
		var _this=this;
		$('#zeega-sort').change(function(){_this.parseSearchUI(); });
		$('.universe-toggle span').click(function(){
			$(this).parent().find('span').removeClass('selected');
			$(this).addClass('selected');
			_this.parseSearchUI();
		});
		
	},
	initCollectionsDrawer:function(){
		//load my collections drawer
		var Items = zeega.module("items");
		this.myCollectionsDrawer = new Items.Collections.Views.MyCollectionsDrawer();
	
	},
	startRouter: function(){
		var _this = this;
			// Defining the application router, you can attach sub routers here.
		var Router = Backbone.Router.extend({
	
			routes: {
				""				: 'search',
				":query"		: 'search'
	
			},
	
			search : function( query ){
						_this.parseURLHash(query);
					}
			});
	
		this.router = new Router();
		Backbone.history.start();
	},
	
	
	queryStringToObj: function (query) {
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
		if (query_obj.min_date !== null){
			query_obj.times.start = query_obj.min_date;
		}
		if (query_obj.max_date !== null){
			query_obj.times.end = query_obj.max_date;
		}

		if(_.isUndefined(query_obj.universe)) query_obj.universe=0;
		return query_obj;
	},
	
	parseURLHash  : function (query){
	
					var _this=this;
					
					//Update Search Object
					
					if (!_.isUndefined(query)) this.searchObject =  this.queryStringToObj(query);
					else this.searchObject = {page:1};

					//Update interface
					
					if(!_.isUndefined(this.searchObject.view_type)) {
						this.switchViewTo( this.searchObject.view_type );
					} else {
						this.switchViewTo( 'thumb' );
					}


					this.updateSearchUI(this.searchObject);

					this.search(this.searchObject);
	},

	updateURLHash : function(obj){
		
		var hash ='';
		if( !_.isUndefined(this.currentView)) hash += 'view_type=' + this.currentView + '&';
		if( !_.isUndefined(obj.collection)) hash += 'collection=' + this.collection + '&';
		if( !_.isUndefined(obj.collection_id)) hash += 'collection=' + this.collection_id + '&';
		if( !_.isUndefined(obj.q) && obj.q.length > 0) hash += 'q=' + obj.q + '&';
		if( !_.isUndefined(obj.content) )  hash += 'content='+ obj.content + '&';
		if( !_.isUndefined(obj.sort) )  hash += 'sort='+ obj.sort + '&';
		if( !_.isUndefined(obj.universe) )  hash += 'universe='+ obj.universe + '&';
		if( !_.isUndefined(obj.mapBounds) )  hash += 'map_bounds='+ encodeURIComponent(obj.mapBounds) + '&';
		if( !_.isUndefined(obj.times)&&  !_.isNull(obj.times) )
		{
			if( !_.isUndefined(obj.times.start) ) hash += 'min_date='+ obj.times.start + '&';
			if( !_.isUndefined(obj.times.end) ) hash += 'max_date='+ obj.times.end + '&';
		}
		console.log('zeega.discovery.app.updateURLHash',obj,hash);
		zeega.discovery.app.router.navigate(hash,{trigger:false});
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

	
		

		obj.universe=$('.universe-toggle').find('.selected').data('universe');
		
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
				for(var j=0;j<texts.length;j++)
				{
					var text = texts[j];
					VisualSearch.searchBox.addFacet('text', text, 0);
				}
			}
			
		}
		
		$('.universe-toggle span').removeClass('selected');
		if(!_.isUndefined(obj.universe)&&obj.universe==1) $('.universe-toggle').find('.universe').addClass('selected');
		else $('.universe-toggle').find('.just-me').addClass('selected');
		

		if (!_.isUndefined(obj.content)) $('#zeega-content-type').val(obj.content);
		else $('#zeega-content-type').val("all");
		
		if (!_.isUndefined(obj.sort)) $('#zeega-sort').val(obj.sort);
		else $('#zeega-sort').val("relevant");
		
		$('#select-wrap-text').text( $('#zeega-content-type option[value=\''+$('#zeega-content-type').val()+'\']').text() );
	},
	
	search : function(obj){
		
		this.resultsView.search( obj,true );
		
		if (this.currentView == 'event') this.eventMap.load();
	},
	
	switchViewTo : function( view ){
	
		console.log("zeega.discovery.app.switchViewTo",view,this.currentView);

		this.currentView = view;

		$(".tab-pane").removeClass('active');
		$('.results-view-wrapper').hide();
		$('#zeega-'+view+'-view').addClass('active');
		$('#results-'+view+'-wrapper').show();
		$('#zeega-view-buttons .btn').removeClass('active');
		$('#'+view+'-button').addClass('active');

		this.updateURLHash( this.searchObject );
	},
		
	clearSearchFilters : function(doSearch){
		console.log("zeega.discovery.app.clearSearchFilters", doSearch);

		$('#zeega-content-type').val("all");
		$('#select-wrap-text').text( $('#zeega-content-type option[value=\''+$('#zeega-content-type').val()+'\']').text() );

		//remove search box values
		VisualSearch.searchBox.disableFacets();
		VisualSearch.searchBox.value('');
		VisualSearch.searchBox.flags.allSelected = false;
		if(doSearch) this.search({ page:1});
	},
	
	goToCollection: function (id){
	
	}

}, Backbone.Events)


};