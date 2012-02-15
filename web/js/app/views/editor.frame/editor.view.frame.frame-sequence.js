(function(Frame){

	Frame.Views.FrameSequence = Backbone.View.extend({
		
		initialize : function()
		{
			this.model.on( 'change:thumb_url', this.onNewThumb, this );
		},
	
		render: function()
		{
			var _this = this;
	
			this.model.on( 'thumbUpdateFail', function(){
				console.log('thumb fail');
				$(_this.el).find('.frame-update-overlay').hide()
			});
	
			var blanks = {
				frameID : this.model.id,
				thumbURL : this.model.get('thumb_url')
			}
			var template = _.template( this.getTemplate() );
		
			this.el = $( template(blanks) );

			//frame droppable stuff
			$(this.el).droppable({
				accept : '.database-asset-list',
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
					zeega.app.createLayerFromItem( zeega.app.draggedItem, _this.model );
				}
			});


			$(this.el).hover(function(){
				$(_this.el).find('.frame-menu').show();
			},function(){
				$(_this.el).find('.menu-items').removeClass('open');
				$(_this.el).find('.frame-menu').hide();
			})

			$(this.el).click(function(){
				_this.goToFrame();
			})
		
			$(this.el).find('.menu-toggle').click(function(){
				_this.openDropdown();
			})
		
			$(this.el).find('.menu-items a').click(function(){

				event.stopPropagation();
			
				switch($(this).data('action'))
				{
					case 'delete':
						if(confirm('Delete Frame?')) zeega.app.destroyFrame(_this);
						break 
				
					case 'duplicate':
						zeega.app.duplicateFrame(_this);
						break;
					
					default:
						console.log('not recognized')
				}
			
				//$(_this.el).find('.menu-items').removeClass('open');
			
			})
		
			//enable the hover when dragging DB items	
			$(this.el).hover(
				//mouseover
				function()
				{
					//only highlight the frame if something is being dragged into it
					if( zeega.app.draggedItem == null ) $(this).find('.menu-toggle').show();
				},
				//mouseout
				function()
				{
					$(this).find('.menu-toggle').hide();
				}
			
			);
			
			return this;
		},
	
		events : {
			'mouseover'		: 'showGear'
		},
	

	
		showGear : function()
		{
			console.log('hover')
		},
	
		openDropdown : function()
		{
			if( $(this.el).find('.menu-items').is(':hidden') )
			{
				$(this.el).find('.zicon-edit').addClass('zicon-close');
				$(this.el).find('.menu-items').addClass('open');
			}
			else
			{
				$(this.el).find('.zicon-edit').removeClass('zicon-close');
				$(this.el).find('.menu-items').removeClass('open');
			}

			event.stopPropagation();
		},
	
		goToFrame : function()
		{
			console.log('go to frame: '+ this.model.id)
			zeega.app.loadFrame(this.model);
			return false;
		},
	
		onNewThumb : function()
		{
			var _this = this;
			//Update thumbnail in sequence display
			if( $(this.el).is(':visible '))
			{
				$(this.el).fadeOut('fast',function(){
					$(this)
						.css('background-image','url("'+ _this.model.get('thumb_url') +'")')
						.fadeIn('fast');
					$(this).find('.frame-update-overlay').hide();
				});
			}
			else
			{
				$(this.el).css('background-image','url("'+ this.model.get('thumb_url') +'")');
				$(this.el).find('.frame-update-overlay').hide();
			}
		},
	
		getTemplate : function()
		{
			var html = 
			
				"<li id='frame-thumb-<%= frameID %>' class='frame-thumb' style='background-image:url(\"<%= thumbURL %>\")'>"+
					"<div class='frame-update-overlay'></div>"+
					"<div class='frame-menu hidden'>"+
						"<a href='#' class='menu-toggle'><span class='zicon zicon-gear orange'></span></a>"+
						"<ul class='unstyled menu-items'>"+
							"<li><a href='#' data-action='duplicate'>Duplicate Frame</a></li>"+
							"<li><a href='#' data-action='delete'>Delete Frame</a></li>"+
						"</ul>"+
					"</div>"+
				"</li>";

			return html;
		}
	
	});

})(zeega.module("frame"));
