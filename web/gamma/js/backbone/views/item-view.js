
var ItemView = Backbone.View.extend({
	tagName : 'li',
	//className :'database-asset',
	
	initialize : function() {},
	
	render: function(i)
	{
		
		var that = this;
		//use template to clone the database items into
		var template = $( this.getTemplate() );
		
		//for some reason when I tried 'addClass()' the old class was persisting and 
		//multiple classes were getting written. don't know why.
		//this works.
		//console.log(this);
		
		template.children('span')
			.addClass( 'zicon-' +this.model.get('content_type').toLowerCase() )
			.addClass( 'zicon-item');
			
		template.children('img')
			.addClass('item-thumb')
			.attr("src", this.model.get('thumbnail_url'))
			.attr('height','25')
			.attr('width','25');
		
		//shorten title if necessary
		if(	this.model.get('title').length > 25) var title=this.model.get('title').substr(0,20)+"...";
		else var title=this.model.get('title');
		
		if(	this.model.get('creator')&&this.model.get('creator').length > 30) var creator=this.model.get('creator').substr(0,30)+"...";
		else var creator=this.model.get('creator');
		
		template.children(".item-title").html( title ).css({'font-size':'10px'});
		template.children(".item-meta").html( creator ).css({'font-size':'10px'});
		template.removeClass('hidden');

		//copy the cloned item into the el
		$(this.el).html(template);
		$(this.el).addClass('database-asset');
		$(this.el).hover(function(){$(this).find('.item-delete').show();},function(){$(this).find('.item-delete').hide();});
		var that=this;
		
		$(this.el).find('.item-delete').click(function(){
		that.model.destroy();
		
		
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
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	//item events
	previewItem: function(){
		var that = this;
		
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
		
		
		var metaTitle = $('<div>').addClass('meta-title').html(that.model.get('title'));
		var metaAuthor = $('<div>').addClass('meta-author').html('Author: '+ that.model.get('creator'));
		var l = $('<a>').attr('href',that.model.get('attribution_url')).attr('target','blank').html('View Source');
		var metaLink = $('<div>').addClass('meta-link').append(l);
		
		$('#asset-preview-meta')
			.empty()
			.append(metaTitle)
			.append(metaAuthor)
			.append(metaLink);
		
	},
	
	getTemplate : function()
	{
		html = '<div id="database-asset-template" class="hidden">';
		html +=		'<span class="float-left zicon grey"></span>';
		html +=		'<img/>';
		html +=		'<div class="item-delete" style="color:red; position:absolute; z-index:10; right:5px; font-weight:bold; display:none"></div>';
		html +=		'<div class="item-title"></div>';
		html +=		'<div class="item-meta"></div>';
		html +=	'</div>';
		return html;
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
		
		var _this = this;
		$('#tab-database-slide-window').empty();
		var temp = $('<div id="db-1" class="slider" />');
		
		//add EACH model's view to the that.el and render it
		_.each(this._itemViews, function(item, i){

			$(temp).append(item.render().el);
			if( i % 10 == 9 )
			{
				_this._itemBundles.push(temp);
				$('#tab-database-slide-window').append(temp);
				//reset the temp
				temp = $('<div class="slider" />').append($('<ul>'));
			}else if(_this._itemViews.length-1 == i){
				$('#tab-database-slide-window').append(temp);
				Database.endOfItems = true;
			}
		});
		
		/*
		if(this._itemViews.length < 100)
		{
			console.log('lesssssss')
		}
		*/
		
		// database window slider
		$('#tab-database-slide-window').cycle({ 
			fx : 'scrollHorz',
			timeout: 0, 
			speed:   300,
			height: 310,
			startingSlide: Database.page
		});
		this._rendered = true;
		
		return this;
	}
	
});