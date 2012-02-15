(function(Items) {

	Items.ViewCollection = Backbone.View.extend({
	
		el : $('#items-list'),
	
		initialize : function()
		{
			var _this = this;
			this.collection = new Items.Collection();
			this.collection.on( 'reset', this.reset, this)
			this._childViews = [];
		
			$(this.el).spin('small');

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

			
			$(this.el).fadeTo(100,1);
			$(this.el).spin(false);
			return this;
		},
		setUpFancyBox : function(){

			var theCollection = this.collection;
			//Sets variable for Fancybox "more" view to false each time the page is reloaded
			sessionStorage.setItem('moreFancy', false);

			//set up fancybox lightbox plugin
			$(".fancymedia").fancybox({
				openEffect : 'fade',
		    	closeEffect	: 'fade',
		    	openSpeed : 'fast',
		    	closeSpeed : 'fast',
				closeClick:false,
				nextClick:false,
				mouseWheel:false,
				fitToView:false,
				arrows:false,
				closeBtn:false,
				aspectRatio:true,
				scroll:'none',
					// Changing next gallery item
				nextEffect: 'none', // 'elastic', 'fade' or 'none'
				nextSpeed: 700,
				nextEasing: 'none',
				nextMethod: 'changeIn',

				// Changing previous gallery item
				prevEffect: 'none', // 'elastic', 'fade' or 'none'
				prevSpeed: 700,
				prevEasing: 'none',
				prevMethod: 'changeOut',

				keys: {
						next: [ 34, 39, 40], //  page down, right arrow, down arrow
						prev: [ 33, 37, 38], //  page up, left arrow, up arrow
						close: [27] // escape key
				},

		    	helpers : {
		    		title : false,
		    		buttons	: {}
		    	},
		    	beforeClose : function() {
		    			//set video src to null to prevent browser bug
		    			
		    			$('video').attr("src", null);

		    	},

				/* This is where we decide which kind of content to put in the fancybox */    
		    	beforeLoad : function() {
		    
		    		$('#fancybox-document-cloud').remove();

		    		
		            var elementID = $(this.element).attr('id');
		           	//var itemsCollection = theCollection.get("itemsCollection");
		           	var thisModel = theCollection.get(elementID);
					var fancyView = null;

					switch(thisModel.get("source")){
						case 'Image':
							fancyView = new FancyBoxImageView({model:thisModel});
		           			fancyView.render(this);
		           			break;
		           		case 'Video':
		           			fancyView = new FancyBoxVideoView({model:thisModel});
		           			fancyView.render(this);
		           			break;
		           		case 'Audio':
		           			fancyView = new FancyBoxAudioView({model:thisModel});
		           			fancyView.render(this);
		           			break;
		           		case 'Youtube':
		           			fancyView = new FancyBoxYouTubeView({model:thisModel});
		           			fancyView.render(this);
		           			break;
		           		case 'Tweet':
		           			fancyView = new FancyBoxTweetView({model:thisModel});
		           			fancyView.render(this);
		           			break;
		           		case 'DocumentCloud':
		           			fancyView = new FancyBoxDocCloudView({model:thisModel});
		           			fancyView.render(this);
		           			break;
					}
		        },
		        
			});
	
		},

		reset : function()
		{
			if ( this._isRendered )
			{
				_.each( this._childViews, function(view){ $(view.el).remove() })
				this._childViews = [];
				this.render();
			}
		},
		
		search : function(obj,reset)
		{
			var _this = this;
			$(this.el).fadeTo(1000,0.5);
			$(this.el).spin('small');
			
			var hash = '';
			if( !_.isUndefined(obj.query) ) hash += 'text/' + obj.query;
			if( !_.isUndefined(obj.tags) ) hash += 'tags/' + obj.tags;
			if( !_.isUndefined(obj.type) ) hash += 'type/' + obj.type;
			
			//update hash but don't fire a second action
			jda.app.router.navigate(hash,{trigger:false});
			
			this.collection.setSearch(obj,reset);
			this.collection.fetch({
				model:Items.Model,
				success : function(){ 
					_this.render();
					_this.setUpFancyBox();
				}
			});
		},
		
		getSearch : function(){ return this.collection.search }
	
	})


	Items.Collection = Backbone.Collection.extend({
	
		base : 'http://dev.zeega.org/jda/web/api/search?',
		search : {},
	
		url : function()
		{
			//constructs the search URL
			var url = this.base;
			if( !_.isUndefined(this.search.query) ) url += 'q=' + this.search.query;
			if( !_.isUndefined(this.search.tags) ) url += 'tags=' + this.search.tags;
			if( !_.isUndefined(this.search.type) ) url += 'type=' + this.search.type;
			console.log('search url: '+ url);
			return url;
		},
	
		setSearch : function(obj, reset)
		{
			if(reset) this.search = obj;
			else _.extend(this.search,obj)
			console.log('set search: '+obj.query)
		},
	
		parse : function(response)
		{
			return response.items;
		}
	
	});

	Items.Router = Backbone.Router.extend({ /* ... */ });


})(jda.module("items"));
