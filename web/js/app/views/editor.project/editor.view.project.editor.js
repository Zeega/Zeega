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

			this.projectButtons = new Project.Views.Editor.ProjectButtons({model:this.model});
			this.$el.find('#project-actions').html( this.projectButtons.render().el );
			
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
			'blur #zeega-project-title' : 'saveTitle'
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
		
		getTemplate : function()
		{
			var html = 
			
			"<div id='zeega-project-title' contenteditable='true'><%= title %></div>"+
			"<div id='project-actions' class='menu-bar clearfix' ></div>";
			
			return html;
		}
	});

	Project.Views.Editor.ProjectButtons = Backbone.View.extend({

		tagName : 'ul',
		className : 'pull-right',

		initialize : function()
		{
			this.model.on('change', this.render, this);
		},

		render : function()
		{
			console.log('##		render project buttons')
			var classes = {
				options_class : this.model.get('published') ? '': 'disabled',
				publish_class : this.model.get('published') ? 'disabled' : '',
				share_class : ''
			}

			this.$el.html( _.template( this.getTemplate(), classes ) );
			return this;
		},

		events : {
			'click #project-share' : 'clickShare',
			'click #project-publish' : 'clickPublish',
			'click #project-options' : 'clickSettings',
			'click #project-preview' : 'clickPreview'
		},

		clickShare : function()
		{
			this.model.shareProject();
			return false;
		},
		
		clickPublish : function()
		{
			this.model.publishProject();
			return false;
		},
		
		clickSettings : function()
		{
			this.model.settingsProject();
			return false;
		},
		
		clickPreview : function()
		{
			this.model.previewSequence();
			return false;
		},

		setButtonStates : function()
		{

			// Publish button
			if(this.project.get("published"))
			{
				$('#settings-project').show();
				$('#share-project').css("color", "#fff");
				$('#publish-project').html("<i class='zicon-publish raise-up'></i> Publish Update");
				if(this.project.get('date_updated')!=this.project.get('date_published')||zeega.app.updated)$('#publish-project').css("color", "#fff");
				else $('#publish-project').css("color", "#666");
				console.log("dates:",this.project.get('date_updated'),this.project.get('date_published'));
			}else{
				$('#settings-project').hide();
				$('#publish-project').html("<i class='zicon-publish raise-up'></i> Publish");
				$('#share-project').css("color", "#666");
			}
		},
		
		
		getTemplate : function()
		{
			var html = 
			
					"<li><a id='project-options' class='<%= options_class %>' href='#'><div class='menu-verbose-title'>options</div><i class='icon-tasks icon-white'></i></a></li>"+
					"<li><a id='project-publish' class='<%= publish_class %>' href='#'><div class='menu-verbose-title'>publish</div><i class='icon-print icon-white'></i></a></li>"+
					"<li><a id='project-share' class='<%= share_class %>' href='#'><div class='menu-verbose-title'>share</div><i class='icon-envelope icon-white'></i></a></li>"+
					"<li><a id='project-preview' href='#'><div class='menu-verbose-title'>preview</div><i class='icon-play icon-white'></i></a></li>";
			
			return html;
		}

	})
	
})(zeega.module("project"));
