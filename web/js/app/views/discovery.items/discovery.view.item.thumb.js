(function(Items){

	Items.Views = Items.Views || {};

	Items.Views.Thumb = Backbone.View.extend({
		
		tagName : 'li',
		events: {
			
			
			
		},
				//item events
		previewItem: function()
		{
			this.model.trigger('preview_item',this.model.id)
		},
		 
		initialize: function () {
	        var _this=this;
	        $(this.el).click(function(){_this.previewItem(); return false;});
	        
	        this.el.id = this.model.id;
	        
	        if (_.isUndefined(this.options.thumbnail_height)){
	        	this.options.thumbnail_height = 120;
	        }
	        if (_.isUndefined(this.options.fancybox)){
	        	this.options.fancybox = true;
	        }
	        if(this.options.fancybox||true){
	        	$(this.el).addClass('results-thumbnail');
	        }
	        if (_.isUndefined(this.options.thumbnail_width)){
	        	this.options.thumbnail_width = 160;
	        }
	        if (_.isUndefined(this.options.show_caption)){
	        	this.options.show_caption = true;
	        }
	        
			if (!_.isUndefined(this.options.draggable)){
				this.draggable=this.options.draggable;
			}
			else this.draggable=true;
		
	        this.model.set({thumbnail_width:this.options.thumbnail_width, thumbnail_height:this.options.thumbnail_height});

	        //this is for fancy box to know to group these into a gallery
	        $(this.el).attr("rel", "group");
	        
    	},

		render: function(done)
		{
			var _this = this;

			var template = this.getDefaultTemplate();
				
			switch( this.model.get('media_type') )
			{
				
				case 'Tweet':
					template = this.getTweetTemplate();
					break;
				case 'Text':
					template = this.getTestimonialTemplate();
					break;
				case 'Collection':
					template = this.getCollectionTemplate();
					break;
				
				default:
					template = this.getDefaultTemplate();
			}



			var blanks = this.model.attributes;

			blanks.remove_text = l.jda_collection_remove;
			blanks.delete_text = l.jda_collection_delete;


			
			if (this.model.get('media_type') == "Tweet" && this.options.show_caption){
				blanks['position_tweet_handle'] = '50%';
			} else if (this.model.get('media_type') == "Tweet" && !this.options.show_caption){
				blanks['position_tweet_handle'] = '75%';
			}
			
			$(this.el).html( _.template( template, blanks ) );

			

			//Turn off captions if we don't want them OR if it's an image
			if (!this.options.show_caption || this.model.get('media_type') == "Image"){
				$(this.el).find('.jda-thumbnail-caption').hide();
			}


			//Insert play icon if it's a video
			if (this.model.get('media_type') == "Video"){
				$('<i class="jdicon-small-play jdicon-lightgrey" style="opacity:0.8;position:absolute;top:50%;left:50%;margin-top:-13px;margin-left:-7px"></i>').insertBefore($(this.el).find('img'));
			}

			//if no thumbnail or if it's a tweet then just show the grey icon instead of thumb
			/*if (this.model.get('media_type') == 'Tweet' || this.model.get('thumbnail_url') == null || this.model.get('thumbnail_url').length ==0 && !_.isUndefined(this.model.get('media_type')))
			{

				$(this.el).find('img').replaceWith(	'<i class="jdicon-'+ this.model.get('media_type') +
													' jda-centered-icon"></i>');
			}*/
			if (this.model.get('media_type') == 'Document'){

				$(this.el).find('img').addClass('jda-document-thumbnail');

			}
			if (this.model.get('media_type') == 'Collection')
			{
				this.draggable=false;
				$(this.el).click(function(){ zeega.discovery.app.goToCollection(_this.model.id); return false;});
				$(this.el).find('.zeega-collection').css({'width':this.options.thumbnail_width, 'height': this.options.thumbnail_height});
				
			} else{
				//Turning this off because buggy
				//$(this.el).popover({'title':this.model.get('title'), 'content':this.model.get('description'), 'delay':{ show: 2000, hide: 100 },'placement':'bottom'});
			
			}
			
			
			if(this.draggable){
				$(this.el).draggable({

			    cursor : 'move',
			    cursorAt : { 
					top : -5,
					left : -5
				},
			    appendTo : 'body',
			    opacity : .8,

			    helper : function(){
			      var drag = $(this).find('a')
			      .clone()
			      .css({
			      	
			        'z-index':'101',

			      });
			      return drag;
			    },

			      //init the dragged item variable
			      start : function()
				{
			        $(this).draggable('option','revert',true);
			        zeega.discovery.app.draggedItem = _this.model;
			      },

			      stop : function(){}
			      
			});
				$(this.el).find(".jdicon-small-drag").tooltip({'title':'Drag to add to your collection','placement':'bottom', delay: { show: 600, hide: 100 }});
				$(this.el).find(".label").tooltip({'placement':'bottom', delay: { show: 600, hide: 100 }});
			}
			

			//Replace broken thumbnail images with the media type icon
			$(this.el).find('img').error(function() {
			  $(_this.el).find('img').replaceWith(	'<i class="jdicon-'+ _this.model.get('media_type').toLowerCase() +
													'" style="position: absolute;top: 10%;left: 10%;"></i>');
			});

			
			return this;
		},
		
		getCollectionTemplate : function()
		{
			var html = 
			
				'<a href="#" class="thumbnail zeega-collection rotated-left">'+
				//	'<i class="jdicon-small-drag" style="z-index:2"></i>'+
				//	'<span class="label label-inverse" style="display:none;position: absolute;top: 91px;left:126px;z-index:2" rel="tooltip" title="Go to Collection View">'+
				//	'<i class="icon-share-alt icon-white"></i></span>'+
					'<img src="<%=thumbnail_url%>" alt="<%=title%>" style="width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px">'+
					//'<input class="jda-item-checkbox" type="checkbox">'+
					'<button class="btn btn-danger btn-mini remove-item hide jda-delete-collection">x &nbsp;<%=delete_text%></button>'+
				'</a>';

			
			return html;
		},
		
		getDefaultTemplate : function()
		{

			var html = 
			
				'<a href="#" class="thumbnail" style="position:relative;width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px;background-color:white">'+
					'<img src="<%=thumbnail_url%>" alt="<%=title%>" style="width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px">'+	
					
					'<button class="btn btn-danger btn-mini remove-item hide">x &nbsp;<%=remove_text%></button>'+
				'</a>';

			
			return html;
			
		},
		getTestimonialTemplate : function()
		{

			var html = 
			
				'<a href="#" class="thumbnail" style="position:relative;width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px;background-color:white">'+
					'<i class="jda-icon-testimonial"></i>'+	
					
					'<button class="btn btn-danger btn-mini remove-item hide">x &nbsp;<%=remove_text%></button>'+
				'</a>';

			
			return html;
			
		},
		getTweetTemplate : function()
		{

			var html = 
			
				'<a href="#" class="thumbnail" style="width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px;background-color:white">'+
					'<i class="jda-icon-twitter"></i>'+	
					'<span style="position:absolute;top:<%=position_tweet_handle%>;right:9%;max-width:85%;overflow:hidden;line-height:18px;color:#444;font-size:12px">@<%=media_creator_username%></span>'+
					
					'<button class="btn btn-danger btn-mini remove-item hide">x &nbsp;<%=remove_text%></button>'+
				'</a>';

			
			return html;
			
		}
		
		
		
		
	});
	
	Items.Views.DrawerView = Backbone.View.extend({
		
		tagName : 'ul',

		initialize : function()
		{
			this.collection.on('reset', this.render, this);
		},

		render : function()
		{
			var _this = this;
			this.$el.addClass('list');
			this.collection.each(function(item){
				_this.$el.append( new Items.Views.DrawerThumbView({model:item}).render().el );
			})
			return this;
		}

	})

	Items.Views.DrawerThumbView = Backbone.View.extend({

		tagName : 'li',
		className : 'database-asset-list',

		render: function()                 
		{
			this.$el.html( _.template(this.getTemplate(),this.model.toJSON() ));
			this.makeDraggable();
			return this;
		},

		makeDraggable : function()
		{
			var _this = this;
			this.$el.draggable({
				appendTo : 'body',
				revert : true,
				opacity : 0.75,
				helper : function()
				{
					
					var drag = $(this).find('img')
						.clone()
						.css({
							'height':'75px',
							'width':'75px',
							'overflow':'hidden',
							'background':'white',
							'z-index':100
						});
					return drag;
				},

				start : function()
				{
					$(this).draggable('option','revert',true);
					if(_this.model.get('layer_type') == 'Image') $('#project-cover-image').addClass('target-focus');

					zeega.discovery.app.draggedItem = _this.model;
				},
				stop : function()
				{
					console.log('dragging		stop')
				}
			});
		},

		events: {
			"click" : "previewItem"
			//'dblclick' : "doubleClick",
		},

		//item events
		previewItem: function()
		{
			this.model.trigger('preview_item',this.model.id)
		},

		getTemplate : function()
		{
			var html =

				"<a href='#'><img src='<%= thumbnail_url %>'/></a>";

			return html;
		}
	});
	
	Items.Views.CollectionList = Backbone.View.extend({
		
		tagName : 'li',
		className : 'collection-list-item',
		loaded:false,
		initialize : function()
		{
			var _this=this;
			this.model.bind('change',function(){
			
				if(_this.model.hasChanged('title')){
					
					_this.updateTitle();
				}
			
			});
		},
		
		render : function()
		{
			
			
			var _this=this;
			
			
			if(this.model.get('title').length>25) var title = this.model.get('title').substr(0,23)+'...';
			else var title = this.model.get('title');
				
				
			var blanks = {
				id : 'collection-'+this.model.id,
				title : title,
				thumbnail_url : this.model.get('thumbnail_url'),
			}
			this.$el.html( _.template( this.getTemplate(), blanks ) );
			

			
			$(this.el).droppable({
			    accept : '.results-thumbnail',
			    hoverClass : 'zeega-my-collections-items-dropping',
			    tolerance : 'pointer',

			    drop : function( event, ui ){
			    	
					$(_this.el).find('#zeega-my-collections-items').addClass('zeega-my-collections-items-dropping');
					if(_this.loaded){
					
						_this.children.push(zeega.discovery.app.draggedItem);
						_this.$el.find('#zeega-item-database-list').empty().append(new Items.Views.DrawerView({collection:_this.children}).render().el);
					
					}
				
					//_this.activeCollection.attributes.child_items.push(zeega.discovery.app.draggedItem.toJSON());
					//_this.renderCollectionPreview(_this.activeCollection);
					  
					var itemId=zeega.discovery.app.draggedItem.id;
					
					_this.model.url=zeega.discovery.app.apiLocation + 'api/items/' + _this.model.id+'/items';
			
					
					_this.model.save({new_items:[itemId ]},
						{
							success : function(model, response){ 
								console.log(model,response,"success");
								$(_this.el).find('#zeega-my-collections-items').removeClass('zeega-my-collections-items-dropping');
							},
							error : function(model, response){
								console.log(response);

							}
						}
					);

					ui.draggable.draggable('option','revert',false);
					
			    }	
			});	
			return this;
		},

		updateTitle:function(){
			if(this.model.get('title').length>25) var title = this.model.get('title').substr(0,23)+'...';
			else var title = this.model.get('title');
			this.$el.find('.collection-title').html(title);
		
		},

		
		events : {
			'click .delete-collection'		: 'delete',
			'click .layer-super'		: 'expand',
			'click .edit-item-metadata' : 'preview',

		},

		
		delete : function()
		{
			if( confirm('Delete Collection?') )
			{
					//KILL KILL
				var _this=this;
				this.model.destroy({success:function(model){
						console.log('collection deleted');
							_this.$el.fadeOut().remove();
						},
						error:function(){
							alert('Unable to delete collection');
						}
				});

			}
			return false;
				
			
			
		},

		//	open/close and expanding collection
		expand : function()
		{
			
			if(this.$el.hasClass('layer-open') )
			{
				this.$el.removeClass('layer-open');
				this.model.trigger('editor_controlsClosed');
			}
			else
			{
				var _this = this;
				$('.layer-open').removeClass('layer-open');
				this.$el.addClass('layer-open');
				
				if(!this.loaded){
					this.loaded=true;
					this.model.fetch(
				{

					success : function(model, response)
					{ 
						_this.children=new Items.Collection(model.get('child_items'));
						_this.$el.find('#zeega-item-database-list').append(new Items.Views.DrawerView({collection:_this.children}).render().el);
					},
					error : function(model, response)
					{ 
						console.log('Error getting active collection for collections drawer');
					}
				});
				}
			}

			
			return false;
		},
		
		preview :function()
		{
			this.model.trigger('preview_item',this.model.id);
			return false;
		},

		
		getTemplate : function()
		{
			var html =

				"<div class='layer-super'>"+
					"<a href='#'><img class='collection-list-thumb' src='<%= thumbnail_url %>'/></a>"+
					"<span class='collection-title'>  <%= title %></span>"+
					"<span class='pull-right'>"+
						"<a href='#' class='edit-item-metadata  more-info'><i class='icon-pencil'></i></a>"+
						"<a class='delete-collection' href='#'><i class='icon-trash icon-white'></i></a>"+
					"</span>"+
				"</div>"+
				"<div class='layer-control-drawer collection'>"+
					'<div id="controls" class="clearfix"><div id="zeega-item-database-list" class="collection"></div></div>'+
					'<div class="default-layer-controls clearfix"></div>'+
				"</div>";

				return html;
		}
		
	});
	
	
})(zeega.module("items"));