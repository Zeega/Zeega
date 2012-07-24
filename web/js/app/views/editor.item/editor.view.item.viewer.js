(function(Items) {

	// This will fetch the tutorial template and render it.
	Items.Views.Viewer = Backbone.View.extend({

		tagName : 'div',
		className : 'item-viewer ',
		
		state : 'less',

		initialize : function()
		{
			var ids = this.collection.pluck('id');
			this.index = _.indexOf( ids, this.options.start)
			//this.switchItem();
			this.inFocus = this.collection.at(this.index)
			this.updateArrows();
			
			this.initEvents();
		},

		initEvents : function()
		{
			var _this = this;
			$('body').keyup(function(e){
				_this.onKeypress(e);
			})
		},
		endEvents : function()
		{
			$('body').unbind('keyup');
		},
		
		switchItem : function()
		{
			this.inFocus = this.collection.at(this.index)
			this.renderItemView();
			this.updateArrows();
		},

		render : function()
		{
			this.$el.html( _.template(this.getTemplate(), this.inFocus.attributes ) );
			this.renderItemView();
			
			return this;
		},
		
		renderItemView : function()
		{
			var itemView = new Items.Views.ViewerContent({model:this.inFocus,state:this.state});
			this.$el.find('.inner-content').html( itemView.render().el );
			if(this.state == 'more' && itemView.mapView.isGeoLocated ) itemView.mapView.renderMap();
		},

		events : {
			'click .close' : 'closeViewer',
			'click .go-left' : 'goLeft',
			'click .go-right' : 'goRight',
			'click #detail-toggle' : 'toggleDetail'
		},
		
		toggleDetail : function()
		{
			var toggle = this.$el.find('#detail-toggle');
			if(toggle.hasClass('less-detail'))
			{
				//switch to more detail
				this.inFocus.trigger('toggle_detail', 'more');
				this.state = 'more';
				toggle.removeClass('less-detail').addClass('more-detail').html('<i class="icon-minus-sign"></i> Less Detail');
				this.$el.find('.inner-content').removeClass('less-view').addClass('more-view');
			}
			else
			{
				//switch to less detail
				this.inFocus.trigger('toggle_detail', 'less');
				this.state = 'less';
				toggle.addClass('less-detail').removeClass('more-detail').html('<i class="icon-plus-sign"></i> More Detail')
				this.$el.find('.inner-content').addClass('less-view').removeClass('more-view');
				
			}
			return false;
		},
		
		onKeypress : function(e)
		{
			switch(e.which)
			{
				case 27:
					this.closeViewer();
					break;
				case 37:
					this.goLeft();
					break;
				case 39:
					this.goRight();
					break;
				default:
					break;
			}
		},
		
		goLeft : function()
		{
			if(this.index > 0)
			{
				this.index--;
				this.switchItem();
			}
			return false;
		},
		goRight : function()
		{
			if(this.index < this.collection.length-1 )
			{
				this.index++;
				this.switchItem();
			}
			return false;
		},
		
		updateArrows : function()
		{
			if(this.index == 0) this.$el.find('.arrow-left').fadeOut();
			else if(this.index == this.collection.length-1) this.$el.find('.arrow-right').fadeOut();
			else
			{
				if(this.$el.find('.arrow-right').is(':hidden')) this.$el.find('.arrow-right').fadeIn();
				if(this.$el.find('.arrow-left').is(':hidden')) this.$el.find('.arrow-left').fadeIn();
			}
			return false;
		},
		
		closeViewer : function()
		{
			var _this = this;
			this.endEvents();
			// do other cleanup stuff first?
			this.$el.fadeOut('fast',function(){_this.remove()});
		},

		getTemplate : function()
		{
			var html = 
			
				"<div class='container'>"+
					"<div class='row'>"+
						"<div class='span1 go-left'><a href='#'><img class='arrow arrow-left' src='../../../images/arrow.png'/></a></div>"+
						"<div class='span10 item-viewer-content'>"+
							"<a class='close primary-close' href='#'>&times;</a>"+

							"<div class='inner-content less-view'></div>"+

							"<a href='#' id='detail-toggle' class='less-detail'><i class='icon-plus-sign'></i> More Detail</a>"+
							
						"</div>"+
						"<div class='span1 go-right'><a href='#'><img class='arrow arrow-right' src='../../../images/arrow.png'/></a></div>"+
					"</div>"+
				"</div>";

			return html;
		}
	});

	Items.Views.ViewerContent = Backbone.View.extend({
		
		className : 'viewer-item',
		
		initialize : function()
		{
			this.model.on('toggle_detail', this.toggleDetail, this)
		},
		
		render : function()
		{
			var opts = {};
			if(this.options.state == 'less')
			{
				opts = {
					mediaSpan : 'span10',
					moreClass : 'hide',
					lessClass : ''
				}
			}
			else
			{
				opts = {
					mediaSpan : 'span4',
					moreClass : '',
					lessClass : 'hide'
				}
			}
			
			this.$el.html( _.template(this.getTemplate(), _.extend(this.model.attributes,opts)) );
			
			console.log(this.model.get('layer_type'),'mediatype', this.model, Items)
			
			// draw media view
			if( Items.Views.Viewer[this.model.get('layer_type')] ) var mediaView = new Items.Views.Viewer[this.model.get('layer_type')]({model:this.model});
			else var mediaView = new Items.Views.Viewer.Default({model:this.model});
			this.$el.find('#item-media-target .padded-content').html( mediaView.render().el )
			//draw map view
			this.mapView = new Items.Views.Common.LeafletMap({model:this.model, attributes:{id:'map-'+this.model.id}});
			this.$el.find('.item-map').html( this.mapView.render().el );
			
			return this;
		},
		
		toggleDetail : function(state)
		{
			if(state == 'more')
			{
				this.$el.find('#item-media-target').removeClass('span10').addClass('span4');
				this.$el.find('.more-info').show();
				this.$el.find('.less-info').hide();
				
				if( this.mapView.isGeoLocated && !this.mapView.isMapRendered ) this.mapView.renderMap();
			}
			else
			{
				this.$el.find('#item-media-target').addClass('span10').removeClass('span4');
				this.$el.find('.more-info').hide();
				this.$el.find('.less-info').show();
			}
			return false;
		},
		
		events : {
			'click .edit-item-metadata' : 'editItemMetadata',
			'click .save-item-metadata' : 'saveItemMetadata',
			'click .cancel-item-metadata' : 'cancelItemEdit'
		},
		
		editItemMetadata : function()
		{
			this.$el.find('.viewer-item-title .inner, .item-description-text').attr('contenteditable',true).addClass('editing-field').focus();
			this.$el.find('.edit-item-metadata').hide();
			this.$el.find('.save-item-metadata, .cancel-item-metadata').show();
			
			return false;
		},
		
		saveItemMetadata : function()
		{
			this.exitEditMode();
			// the save the model
			return false;
		},
		
		exitEditMode : function()
		{
			this.$el.find('.viewer-item-title .inner, .item-description-text').attr('contenteditable',false).removeClass('editing-field');
			this.$el.find('.edit-item-metadata').show();
			this.$el.find('.save-item-metadata, .cancel-item-metadata').hide();
		},
		
		cancelItemEdit : function()
		{
			this.exitEditMode();
			//this.render();
		},
		
		getTemplate : function()
		{
			html = 
			
				"<h2 class='viewer-item-title'><span class='inner'><%= title %></span> <a href='#' class='edit-item-metadata <%= moreClass %> more-info'><i class='icon-pencil'></i></a></h2>"+
				
				"<div class='row'>"+
					
					"<div class='<%= mediaSpan %>' id='item-media-target'>"+
						"<div class='padded-content'></div>"+ //media goes here
					"</div>"+
					
					"<div class='span6 <%= moreClass %> more-info'>"+
						"<div class='padded-content item-map'>"+
							"media map goes here"+
						"</div>"+
					"</div>"+
					
				"</div>"+
				"<div class='row <%= moreClass %> more-info'>"+
					"<div class='span4'>"+
						"<div class='padded-content'>"+
							"<div><strong>Created By:</strong> <%= media_creator_realname %></div>"+
							"<div><strong>Created On:</strong> <%= date_created.date %></div>"+
							"<div><a href='<%= attribution_uri %>' target='blank'>View Source <i class='icon-share'></i></a></div>"+
							"<div>"+
								"<div><strong>Tags:</strong> <a href='#' class='edit-item-metadata'><i class='icon-pencil'></i></a></div>"+
								"<div class='item-tags'></div>"+
							"</div>"+
						"</div>"+
					"</div>"+
					"<div class='span6'>"+
						"<div class='padded-content'>"+
							"<div><strong>Description:</strong> <a href='#' class='edit-item-metadata'><i class='icon-pencil'></i></a></div>"+
							"<div class='item-description-text'><%= description %></div>"+
							"<button class='btn btn-mini pull-right hide cancel-item-metadata'>Cancel</button>"+
							"<button class='btn btn-success btn-mini pull-right hide save-item-metadata'>Save Changes</button>"+
						"</div>"+
					"</div>"+
				"</div>"+
				
				"<div class='less-footer item-viewer-footer <%= lessClass %>'>"+
					"<div class='details less-info'><%= media_creator_realname %> -- <a href='<%= attribution_uri %>' target='blank'>View Source <i class='icon-share'></i></a></div>"+
				"</div>";
				
			return html;
		}
	})
	
	
	//////////////////////////// item types
	
	
	Items.Views.Viewer.Default = Backbone.View.extend({
		
		className : 'default-preview',
		render : function()
		{
			console.log(this.model)
			this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
			return this;
		},
		
		getTemplate : function()
		{
			html = "<img src='<%= thumbnail_url %>' style='max-width: 100%;max-height: 100%;'/>";
			return html;
		}
	})
	
	Items.Views.Viewer.Image = Backbone.View.extend({
		
		render : function()
		{
			this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
			return this;
		},
		
		getTemplate : function()
		{
			html = "<img src='<%= uri %>' style='max-width: 100%;max-height: 100%;'/>";
			return html;
		}

	})
	
	Items.Views.Viewer.Youtube = Backbone.View.extend({
		
		render : function()
		{
			console.log('render youtube')
			this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
			return this;
		},
		
		getTemplate : function()
		{
			html = '<iframe class="youtube-player" type="text/html" width="100%" height="100%" src="http://www.youtube.com/embed/<%=uri%>" frameborder="0"></iframe>';
			return html;
		}

	})
	
})(zeega.module("items"));



