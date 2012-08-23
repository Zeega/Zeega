(function(Items) {

	// This will fetch the tutorial template and render it.
	Items.Views.List = Backbone.View.extend({

		tagName : 'li',
		className : 'database-asset-list',

		render: function()                 
		{
			var _this = this;

			var blanks = {
				type : this.model.get("layer_type").toLowerCase(),
				title : this.model.get('title'),
				creator : this.model.get('media_creator_username'),
				thumbUrl : this.model.get('thumbnail_url')
			};
			//use template to clone the database items into

			var template = _.template( this.getTemplate() );
			//copy the cloned item into the el
			$(this.el).append( template( blanks ) );
			$(this.el)
				//.addClass('database-asset-list')
				.attr({
					'id':'item-'+this.model.id,
					'data-original-title' : this.model.get('title'),
					'data-content' : 'created by: ' + this.model.get('media_creator_username')
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
				helper : function()
				{
					var drag = $(this).find('.item-thumbnail')
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
					if(_this.model.get('layer_type') == 'Image') $('#project-cover-image').addClass('target-focus');
					$('#visual-editor-workspace').addClass('target-focus');
					$('#frame-drawer').addClass('target-focus');

					zeega.app.draggedItem = _this.model;
				},

				/**	stuff _this happens when the user drags the item into a frame **/	

				stop : function(){
					$('#project-cover-image').removeClass('target-focus');
					$('#visual-editor-workspace').removeClass('target-focus');
					$('#frame-drawer').removeClass('target-focus');

					zeega.app.draggedItem = null;
				}

			});

			// rollover

			var args = {
				delayIn : 1500
			};

			//$(this.el).popover( args );

			return this;
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
			var html =	'<i class="zicon-<%= type %> item-icon show-in-list-view"></i>' +
						'<img class="item-thumbnail" src="<%= thumbUrl %>"/>' +
						'<div class="item-title show-in-list-view"><%= title %></div>';

			return html;
		}
	});
	
})(zeega.module("items"));