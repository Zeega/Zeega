/*

editor.view.frame.editor-workspace.js

backbone view

this is the view that each frame should draw in the editor which allows for the visual arrangement of
the frame's layers. It also includes common frame functions like adding sequence links and advance controls

*/

(function(Frame){

	Frame.Views.EditorWorkspace = Backbone.View.extend({

		id : 'workspace-wrapper',
		
		initialize : function()
		{
			
		},
		
		render : function()
		{
			this.$el.html( this.getTemplate() );
			return this;
		},
		
		renderToTarget : function()
		{
			console.log('render to target', this.render().el )
			$('#'+this.id).replaceWith( this.render().el )
		},
		
		getTemplate : function()
		{
			var html = 
			
				"<div id='edit-panel'></div>"+
				"<div id='visual-editor-wrapper' class='wrapper panel'>"+
					
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
						
						"<i class='zicon-info info'"+
							"data-placement = 'left'"+
							"data-original-title='The Visual Editor Window'"+
							"data-content='This is where you can drop and arrange visual media. You can click the bar to close or expand the workspace.'"+
						"></i>"+
					"</div>"+
					
					"<div id='workspace-outer-wrapper' class='clearfix'>"+
						"<div id='visual-editor-workspace' class='workspace clearfix'"+
							"title='Create a Project!'"+
							"data-content='All projects consists of frames. You can add layers to frames by dragging media to this area.'"+
						"></div>"+
					"</div>"+
					
				"</div>";

			return html;
		}
	
	});

})(zeega.module("frame"));
