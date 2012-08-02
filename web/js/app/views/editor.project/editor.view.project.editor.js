(function(Project) {

	// This will fetch the tutorial template and render it.
	Project.Views.Editor = Backbone.View.extend({

		id : 'project-header',
		
		isRendered : false,

		initialize : function()
		{
			//automatically re-render the view if the title or cover image are changed/updated
			this.model.on('change:title change:cover_image', this.render, this)
		},

		render: function()
		{
			this.$el.html( _.template( this.getTemplate(), this.model.toJSON() ));

			this.initEvents();
			
			return this;
		},
		
		// called from the project model.loadProject
		renderToTarget : function(){ $('#'+this.id).replaceWith( this.render().el ) },
		
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
			'keypress #project-title' : 'onTitleKeypress',
			'blur #project-title' : 'saveTitle',
			
			'click #share-project' : 'clickShare',
			'click #publish-project' : 'clickPublish',
			'click #settings-project' : 'clickSettings',
			'click #preview' : 'clickPreview'
			
		},
		
		//the callback when text is being entered into the title field
		onTitleKeypress : function(e)
		{
			var _this = this;
			if(e.which==13)
			{
				e.preventDefault();
				this.$el.find('#project-title').blur();
				_this.saveTitle();
				return false		
			}
		},
		
		saveTitle : function()
		{
			if(this.$el.find('#project-title').text() != this.model.get('title'))
			{
				var t = this.$el.find('#project-title').text() == '' ? 'untitled' : this.$el.find('#project-title').text();
				this.$el.find('#project-title').effect('highlight',{},2000);
				this.model.save({ 'title' : t },{silent:true});
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
			
			"<div id='project-cover-image' style='background-image:url(<%= cover_image %>)'></div>"+
			"<div id='project-title' contenteditable='true' ><%= title %></div>"+

			"<div id='sequence-actions' class='btn-group pull-right'>"+
				"<button id='settings-project' class='btn btn-inverse'><i class='zicon-settings raise-up'></i></button>"+
				"<button id='publish-project' class='btn btn-inverse'><i class='zicon-publish raise-up'></i> Publish</button>"+
				"<button id='share-project' class='btn btn-inverse'><i class='zicon-share raise-up'></i> Share</button>"+
				"<button id='preview' class='btn btn-inverse'><i class='zicon-preview raise-up'></i> Preview</button>"+
			"</div>";
			
			return html;
		}
	});
	
})(zeega.module("project"));