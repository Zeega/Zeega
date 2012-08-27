(function(Items) {

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
	        	$(this.el).addClass('thumb-fancymedia');
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
	
})(zeega.module("items"));