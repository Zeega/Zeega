(function(Frame){

	Frame.Views.FrameSequence = Backbone.View.extend({
		
		tagName : 'li',
		className : 'frame-thumb',

		initialize : function()
		{
			var _this = this;
			this.model.on( 'change:thumbnail_url', this.onNewThumb, this );
			this.model.on('focus', this.focus, this );
			this.model.on('blur', this.blur, this );

			this.model.on( 'thumbUpdateFail', function(){
				_this.$el.find('.frame-update-overlay').hide()
			});
		},
		
		focus : function()
		{
			this.$el.addClass('active-frame');
			this.model.inFocus = true;
		},
		blur : function()
		{
			this.$el.removeClass('active-frame');
			this.model.inFocus = false;
		},
	
		render: function()
		{
			this.$el.html( this.getTemplate() );
			this.makeDroppable();
			this.delegateEvents();
			return this;
		},

		makeDroppable : function()
		{
			var _this = this;
			this.$el.droppable({
				//accept : '.database-asset-list',
				hoverClass : 'frame-item-hover',
				tolerance : 'pointer',

				over : function(event, ui)
				{
					$('#frame-drawer').addClass('hover');
				},
				out : function(event, ui)
				{
					$('#frame-drawer').removeClass('hover');
				},

				//this happens when you drop a database item onto a frame
				drop : function( event, ui )
				{
					$('#frame-drawer').removeClass('hover');
					ui.draggable.draggable('option','revert',false);
					console.log('$$		item drop', zeega.app.draggedItem, _this.model)
					_this.model.addItemLayer( zeega.app.draggedItem )
				}
			});
		},
	
		events : {
			'click'			: 'goToFrame',
			'click .frame-action-menu a' : 'frameAction'
		},

		goToFrame : function()
		{
			zeega.app.loadFrame(this.model);
			return false;
		},

		frameAction : function(e)
		{
			switch($(e.target).data('action'))
			{
				case 'delete':
					if(confirm('Delete Frame?'))
						zeega.app.project.sequences.get(this.model.sequenceID).frames.remove( this.model );
					break;
				
				case 'duplicate':
					zeega.app.currentSequence.duplicateFrame( this.model );
					break;
					
				default:
					console.log('not recognized')
			}
			return false;
		},
	
		onNewThumb : function()
		{
			var _this = this;
			//Update thumbnail in sequence display
			if( this.$el.is(':visible '))
			{
				this.$el.fadeOut('fast',function(){
					$(this)
						.css('background-image','url("'+ _this.model.get('thumbnail_url') +'")')
						.fadeIn('fast');
					$(this).find('.frame-update-overlay').hide();
				});
			}
			else
			{
				this.$el.css('background-image','url("'+ this.model.get('thumbnail_url') +'")');
				this.$el.find('.frame-update-overlay').hide();
			}
		},
	
		getTemplate : function()
		{
			var html = 
			
					"<ul class='menu'>"+
						"<a href='#' class='menu-toggle'><i class='icon-cog icon-white'></i></a>"+
						"<ul class='frame-action-menu'>"+
							"<li><a href='#' data-action='duplicate'>Duplicate Frame</a></li>"+
							"<li><a href='#' data-action='delete'>Delete Frame</a></li>"+
						"</ul>"+
					"</ul>"+
					"<div class='frame-update-overlay'></div>";


			return html;
		}
	
	});

})(zeega.module("frame"));
