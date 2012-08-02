/*

editor.view.frame.editor-workspace.js

backbone view

this is the view that each frame should draw in the editor which allows for the visual arrangement of
the frame's layers. It also includes common frame functions like adding sequence links and advance controls

*/

(function(Frame){

	Frame.Views.EditorWorkspace = Backbone.View.extend({

		id : 'workspace',
		className : 'clearfix',
		
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
		
		renderToTarget : function(){ $('#'+this.id).replaceWith( this.render().el ) },
		
		getTemplate : function()
		{
			var html = 
			
					
					"<div id='visualeditor-view-bar' class='panel-head'>"+
						
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
						
						"<div class='advance-controls'>advance controls</div>"+
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
