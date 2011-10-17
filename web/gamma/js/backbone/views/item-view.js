
var ItemView = Backbone.View.extend({
	tagName : 'li',
	//className :'database-asset',
	
	initialize : function() {},
	
	render: function(i) {
		
		var that = this;
		//use template to clone the database items into
		var template = $("#database-asset-template").clone();
		
		//for some reason when I tried 'addClass()' the old class was persisting and 
		//multiple classes were getting written. don't know why.
		//this works.
		//console.log(this);
		
		template.children('span')
			.attr( 'class', 'float-left asset-type-icon ui-icon ')
			.addClass( getItemIcon( this.model.get('content_type').toLowerCase() ) );
			
		template.children('img')
			.addClass('item-thumb')
			.attr("src", "http://mlhplayground.org/Symfony/web/images/thumbs/"+this.model.id+"_s.jpg")
			.attr('height','25')
			.attr('width','25');
		
		//shorten title if necessary
		if(	this.model.get('title').length > 55) var title=this.model.get('title').substr(0,55)+"...";
		else var title=this.model.get('title');
		
		template.children(".item-title").html( title ).css({'font-size':'10px'});
		template.children(".item-meta").html( this.model.get('creator') ).css({'font-size':'10px'});
		template.removeClass('hidden');

		//copy the cloned item into the el
		$(this.el).html(template);
		$(this.el).addClass('database-asset');
		
		$(this.el).click(function(){
			$('#asset-preview').fadeIn();
			
			$('#asset-preview-media').empty();

			//uglyness this should be more like layers?
			var media = null;
			switch (that.model.get('content_type'))
			{
				case 'Image':
					media = $('<img>').attr('src', that.model.get('item_url') );
					break;
				case 'Video':
					media = $('<video>').attr('controls','controls');
					var src = $('<source>').attr('src',that.model.get('item_url')).attr('type','video/mp4');
					media.append(src);
					//do stuff
					break;
				case 'Audio':
					media = $('<video>').attr('controls','controls');
					var src = $('<source>').attr('src',that.model.get('item_url')).attr('type','video/mp4');
					media.append(src);
					break;
			}
			$('#asset-preview-media').append(media);
			
			//this needs to test for the type of media and place the appropriate image/player etc in there
			//$('#asset-preview-image img').attr('src','http://mlhplayground.org/Symfony/web/images/thumbs/'+that.model.id+'_s.jpg');
			
			
			console.log(that);
			
			
			
			var metaTitle = $('<div>').addClass('meta-title').html(that.model.get('title'));
			var metaAuthor = $('<div>').addClass('meta-author').html('Author: '+ that.model.get('creator'));
			var l = $('<a>').attr('href',that.model.get('attribution_url')).attr('target','blank').html('View Source');
			var metaLink = $('<div>').addClass('meta-link').append(l);
			
			$('#asset-preview-meta')
				.empty()
				.append(metaTitle)
				.append(metaAuthor)
				.append(metaLink);
				
				
				
		});
		
		//drag drop functionality
		$(this.el).draggable({
			distance : 10,
			cursor : 'crosshair',
			appendTo : 'body',
			cursorAt : { 
				top : -5,
				left : -5
			},
			opacity : .75,
			//helper : 'clone',
			helper : function(){
				var drag = $(this).find('.item-thumb')
					.clone()
					.css({
						'height':'75px',
						'width':'75px',
						'overflow':'hidden',
						'background':'white'
					});
				return drag;
			},
			
			//init the dragged item variable
			start : function(){
				$(this).draggable('option','revert',true);
				Zeega.draggedItem = that.model;
			},
				
			/**	stuff that happens when the user drags the item into a node **/	
				
			stop : function(){
				Zeega.draggedItem = null;
			}
			
		});
		return this;
	},
	
	events: {
		//"click" : "clickedItem",
		'dblclick' : "doubleClick",
		
	},
	
	dropItem:function(){
	
	
	},
	
	//item events
	clickedItem: function(){
		//console.log('clicked: '+this.model.cid);
	},
	doubleClick: function(){
		
		//console.log(this.cid);
		
	}
});

var ItemViewCollection = Backbone.View.extend({
	
	initialize : function(){
		_(this).bindAll('add');
		this._itemViews = [];
		this._itemBundles = [];
		this.collection.each(this.add);
		this.collection.bind('add',this.add)
		this.render();
	},
	
	add : function(item){
		//a database item is never 'new' right?
		//it has to exist before it can be interacted with.
		//database items are created in XM or other tools
		var iv = new ItemView({ model : item });
		this._itemViews.push(iv);
		if(this._rendered) $(this.el).append(iv.render().el);
		
	},
	
	append : function(items){
		console.log('appending!');
				
		items.each(this.add);
		items.bind('add',this.add)
		this.render();
		
		insertPager( _.size(this._itemViews), Database.page );
	},
	
	render : function(){
		
		var that = this;
		$('#tab-database-slide-window').empty();
		var temp = $('<div id="db-1" class="slider" />');
		
		//add EACH model's view to the that.el and render it
		_(this._itemViews).each(function(item, i){
			
			//console.log(item);
			
			$(temp).append(item.render().el);
			if( i % 10 == 9 )
			{
				that._itemBundles.push(temp);
				$('#tab-database-slide-window').append(temp);
				//reset the temp
				temp = $('<div class="slider" />').append($('<ul>'));
			}
		});
				
		// database window slider
		$('#tab-database-slide-window').cycle({ 
			fx : 'scrollHorz',
			timeout: 0, 
			speed:   300,
			startingSlide: Database.page
		});
		this._rendered = true;
		
		return this;
	}
	
});