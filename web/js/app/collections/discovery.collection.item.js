(function(Items) {

	Items.Collections=Items.Collections||{};

	
	Items.Collections.Static=Backbone.Collection.extend({
		
		model:Items.Model,
		type:'static',
		initialize: function(models,options){
				_.extend(this,options);
				this.on('preview_item',this.previewItem,this);
		},
		url : function(){
			var url = zeega.discovery.app.apiLocation + 'api/items/' + this.id;
			return url;
		},
		parse : function(response)
		{
			console.log('parsing static collection');
			return response.items[0].child_items;
			
		},
		previewItem : function(itemID)
		{
			
			var viewer = new Items.Views.Viewer({collection:this,start:itemID});
			$('body').append(viewer.render().el);
			viewer.renderItemView();
		}
		
	});
	
	
	Items.Collections.Dynamic=Items.Collections.Static.extend({
		type:'dynamic',
		url : function(){
			var url = zeega.discovery.app.apiLocation + 'api/items/' + this.id+'/items';
			return url;
		},
		parse : function(response)
		{
			console.log('parsing dynamic collection');
			return response.items;
			
		},
		
	
	});
	
	
	
	Items.Collections.Search = Backbone.Collection.extend({
		
		model:Items.Model,
		base : zeega.discovery.app.apiLocation + 'api/search?',
		query : {	page:1,
					r_itemswithcollections: 1,
					r_tags:1,
					sort:"date-desc"
				},
				
		initialize: function(){
				this.on('preview_item',this.previewItem,this);
		},
		
				previewItem : function(itemID)
		{
			var viewer = new Items.Views.Viewer({collection:this,start:itemID});
			$('body').append(viewer.render().el);
			viewer.renderItemView();
		},
	
		url : function()
		{
		
			var url = this.base;
			if( !_.isUndefined(this.query.q) && this.query.q.length > 0) url += '&q=' + this.query.q.toString();
			else url+='&sort=date-desc';
			if( !_.isUndefined(this.query.viewType) ) url += '&view_type=' + this.query.viewType;
			if( !_.isUndefined(this.query.content) ) url += '&content=' + this.query.content;
			if( !_.isUndefined(this.query.sort) ) url += '&sort=' + this.query.sort;
			if( !_.isUndefined(this.query.collection) && this.query.collection > 0) url += '&collection=' + this.query.collection;
			if( !_.isUndefined(this.query.page) ) url += '&page=' + this.query.page;
			if( !_.isUndefined(this.query.r_items) ) url += '&r_items=' + this.query.r_items;
			if( !_.isUndefined(this.query.r_tags)) url += '&r_tags=' + this.query.r_tags;
			if( !_.isUndefined(this.query.r_itemswithcollections) ) url += '&r_itemswithcollections=' + this.query.r_itemswithcollections;
			if( !_.isUndefined(this.query.r_collections) ) url += '&r_collections=' + this.query.r_collections;
			if( !_.isUndefined(this.query.times)&&!_.isNull(this.query.times) ){
				if( !_.isUndefined(this.query.times.start) ) url += '&min_date=' + this.query.times.start;
				if( !_.isUndefined(this.query.times.end) ) url += '&max_date=' + this.query.times.end;
			}
			if( !_.isUndefined(this.query.content)&& this.query.content=='project'){}
			else url += '&user=-1';
			//if( !_.isUndefined(this.query.user) && this.query.user>=-1&& this.query.user!="") url += '&user=' + this.query.user;
			//if( !_.isUndefined(this.query.username) &&  !_.isNull(this.query.username) &this.query.username.length > 0) url += '&username=' + this.query.username;
			if(zeega.discovery.app.currentView=='event') url+='&geo_located=1';

			console.log('query url: '+ url);
			return url;
		},
	
		setQuery : function(obj, reset)
		{
			console.log('items.collection.setquery',this.query,obj);
			if(reset){
				this.query = { r_tags:1,page:1,sort:"date-desc" };
				if(_.isNumber(obj.collection)||_.isNumber(obj.user)) {
					this.query.r_items=1;
				} else {
					this.query.r_itemswithcollections=1;
				}

				if(_.isNumber(obj.user)) this.query.r_collections=1;
			}
			
			_.extend(this.query,obj);
			
			console.log(zeega.discovery.app.currentView);
			if(zeega.discovery.app.currentView=="event") console.log("Range slider values",$("#range-slider").slider( "option", "values" ));
			
			console.log("final query",this.query);
		},
		
		getquery : function()
		{
			return this.query;
		},
	
		parse : function(response)
		{
			this.tags=response.tags;
			this.count = response.items_count;
			return response.items;
			
		},
		
		previewItem : function(itemID)
		{
			var viewer = new Items.Views.Viewer({collection:this,start:itemID});
			$('body').append(viewer.render().el);
			viewer.renderItemView();
		}
		
	
	});

	

})(zeega.module("items"));
