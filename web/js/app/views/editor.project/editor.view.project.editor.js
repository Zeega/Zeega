(function(Project) {

	// This will fetch the tutorial template and render it.
	Project.Views.Editor = Backbone.View.extend({

		id : 'project-header',
		
		isRendered : false,

		initialize : function()
		{
			this.setElement( $('#zeega-project-info') );
			//automatically re-render the view if the title or cover image are changed/updated
			this.model.on('change:title change:cover_image', this.render, this)
		},

		render: function()
		{
			this.$el.html( _.template( this.getTemplate(), this.model.toJSON() ));

			//this.initEvents();
			
			return this;
		},
		
		//initialize events that cannot be set in events:{}
		initEvents : function()
		{
			var _this = this;

			this.$el.find('#project-cover-image').droppable({

				accept : '.database-asset-list',
				hoverClass : 'workspace-item-hover',
				tolerance : 'pointer',

				//this happens when you drop a database item onto a frame
				drop : function( event, ui )
				{
					//make sure the dropped item is a valid image
					var item = zeega.app.draggedItem;
					if(item.get('layer_type') == 'Image')
					{
						ui.draggable.draggable('option','revert',false);
						_this.saveCoverImage( zeega.app.draggedItem.get('uri') )
					}
					
				}
			});
		},
		
		events : {
			'keypress #zeega-project-title' : 'onTitleKeypress',
			'blur #zeega-project-title' : 'saveTitle',
			
			'click #project-share' : 'clickShare',
			'click #project-publish' : 'clickPublish',
			'click #project-options' : 'clickSettings',
			'click #project-preview' : 'clickPreview'
		},

		//the callback when text is being entered into the title field
		onTitleKeypress : function(e)
		{
			var _this = this;
			if(e.which==13)
			{
				e.preventDefault();
				this.$el.find('#zeega-project-title').blur();
				this.saveTitle();
				return false		
			}
		},
		
		saveTitle : function()
		{
			if(this.$el.find('#zeega-project-title').text() != this.model.get('title'))
			{
				var t = this.$el.find('#zeega-project-title').text() == '' ? 'untitled' : this.$el.find('#zeega-project-title').text();
				//this.$el.find('#zeega-project-title').effect('highlight',{},2000);
				this.model.save({ 'title' : t });
			}
		},
		
		saveCoverImage : function( uri ){ this.model.save({ 'cover_image' : uri }) },
		
		clickShare : function()
		{
			zeega.app.shareProject();
			return false;
		},
		
		clickPublish : function()
		{
			zeega.app.publishProject();
			return false;
		},
		
		clickSettings : function()
		{
			zeega.app.settingsProject();
			return false;
		},
		
		clickPreview : function()
		{
			zeega.app.previewSequence();
			return false;
		},
		
		
		getTemplate : function()
		{
			var html = 
			
			"<div id='zeega-project-title' contenteditable='true'><%= title %></div>"+
			"<div class='menu-bar clearfix' >"+
				"<ul class='pull-right'>"+
					"<li><a id='project-options' href='#'><div class='menu-verbose-title'>options</div><i class='icon-tasks icon-white'></i></a></li>"+
					"<li><a id='project-publish' href='#'><div class='menu-verbose-title'>publish</div><i class='icon-print icon-white'></i></a></li>"+
					"<li><a id='project-share' href='#'><div class='menu-verbose-title'>share</div><i class='icon-envelope icon-white'></i></a></li>"+
					"<li><a id='project-preview' href='#'><div class='menu-verbose-title'>preview</div><i class='icon-play icon-white'></i></a></li>"+
				"</ul>"+
			"</div>";
			
			return html;
		}
	});
	
})(zeega.module("project"));