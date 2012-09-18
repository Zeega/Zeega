(function(Items) {

	Items.Views.ItemTrayCollectionView = Backbone.View.extend({
		
		target : '#zeega-item-database-list',

		initialize : function()
		{
			this.collection.on('reset', this.render, this);
		},

		render : function()
		{
			var _this = this;
			this.setElement($(this.target));
			this.$el.html('<ul class="list">');
			this.collection.each(function(item){
				_this.$el.find('.list').append( item.databaseView.render().el );
			})
			return this;
		}

	})

	Items.Views.List = Backbone.View.extend({

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

					zeega.app.draggedItem = _this.model;
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
	
})(zeega.module("items"));