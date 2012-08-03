/*

editor.view.frame.editor-workspace.js

backbone view

this is the view that each frame should draw in the editor which allows for the visual arrangement of
the frame's layers. It also includes common frame functions like adding sequence links and advance controls

*/

(function(Frame){

	Frame.Views.EditorWorkspace = Backbone.View.extend({

		id : 'workspace',
		
		isRendered : false,
		
		initialize : function()
		{
			
		},
		
		render : function()
		{
			this.$el.html( this.getTemplate() );
			this.initEvents();
			return this;
		},

		renderToTarget : function(){ $('#'+this.id).replaceWith( this.render().el ) },
		
		initEvents : function()
		{
			//enable the workspace as a valid drop location for DB items
			$(this.el).find('#visual-editor-workspace').droppable({
				accept : '.database-asset-list',
				hoverClass : 'workspace-item-hover',
				tolerance : 'pointer',

				//this happens when you drop a database item onto a frame
				drop : function( event, ui )
				{
					ui.draggable.draggable('option','revert',false);
					zeega.app.addLayer({ item : zeega.app.draggedItem })
				}
			});
		},
		
		events : {
			'click .advance-click' : 'selectAdvanceClick',
			'click .advance-time' : 'selectAdvanceTime',
			'keypress input' : 'onAdvanceKeypress'
		},
		
		selectAdvanceClick : function()
		{
			this.$el.find('.advance-click').addClass('active');
			this.$el.find('.advance-time').removeClass('active');
			this.$el.find('input').addClass('disabled').attr('disabled','true').val('');
			
			this.saveAdvance( -1 );
			
			return false;
		},
		
		selectAdvanceTime : function()
		{
			this.$el.find('.advance-click').removeClass('active');
			this.$el.find('.advance-time').addClass('active');
			this.$el.find('input').removeClass('disabled').removeAttr('disabled').focus();
			return false;
		},
		
		onAdvanceKeypress : function(e)
		{
			if(e.which == 13)
			{
				//console.log('save this shizz', $(e.target).val() );
				this.saveAdvance( $(e.target).val() );
				this.$el.find('input').animate('highlight',{},'1500').blur();
				return false;
			}
		},
		
		saveAdvance : function( time )
		{
			console.log('save advance', time, zeega.app.currentFrame);
			zeega.app.currentFrame.save({ advance : time })
		},
		
		getTemplate : function()
		{
			var html = 
			
					
					"<div class='top-bar clearfix'>"+
						
						"<div id='make-connection' class='btn-group pull-left'>"+
							"<button data-action='newFrame' class='btn btn-inverse action' href='#'><img src='../../../images/multi-linear.png' height='15px'/></button>"+
							"<button class='btn btn-inverse dropdown-toggle' data-toggle='dropdown'><span class='caret'></span></button>"+
							"<ul class='dropdown-menu'>"+
								"<li><a data-action='newFrame' class='action' href='#'><i class='zicon-new-frame small'></i>  New Frame</a></li>"+
								"<li><a data-action='existingFrame' class='action' href='#'><i class='zicon-old-frame small'></i>  Existing Frame</a></li>"+
								"<li class='divider'></li>"+
								"<li><a data-action='advanced' class='action' href='#'><i class='zicon-options small'></i>  Advanced</a></li>"+
							"</ul>"+
						"</div>"+
						
						"<div id='connection-confirm' class='pull-left hidden'>"+
							"<button data-action='cancel' class='btn btn-danger btn-small'>Cancel</button>"+
							"<button data-action='ok' class='btn btn-success btn-small'>OK</button>"+
						"</div>"+
						
						"<div class='advance-controls'>"+
							"Frame Advance: "+
							"<a href='#' class='advance-click active'><i class='zicon-click zicon-white raise-up'></i></a>/<a href='#' class='advance-time'><i class='zicon-time zicon-white raise-up'></i></a>  "+
							"<input type='text' class='disabled' placeholder='sec' disabled='true'/>"+
						"</div>"+
					"</div>"+
					
					"<div id='visual-editor-workspace' class='workspace clearfix'></div>";
					

			return html;
		}
	
	});
	
	Frame.Views.ConnectionControls = Backbone.View.extend({
		
		render : function()
		{
			
		},
		
		getTemplate : function()
		{
			html = '';
			
			
			return html;
		}
		
	})
	
	Frame.Views.AdvanceControls = Backbone.View.extend({
		
		render : function()
		{
			
		},
		
		getTemplate : function()
		{
			html = '';
			
			
			return html;
		}
		
	})
	

})(zeega.module("frame"));
