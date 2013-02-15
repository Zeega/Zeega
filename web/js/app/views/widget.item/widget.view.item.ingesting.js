(function(Items) {

	//renders individual items in a search be they collection or image or audio or video type
	Items.Views.Ingesting = Backbone.View.extend({
		
		el : $("#item-view"),

		initialize: function()
		{
	    	//Load the item's tags so we can display and edit them
	    	//this.model.loadTags();
	    	this.model.view = this;
	    },
	
		render: function()
		{
			var item = this.model;
			var theElement = this.el;
			var view = this;

	       
			this.$el.find('#widget-title').text( this.model.get('title'));
			this.$el.find('#widget-creator').text( this.model.get('media_creator_username'));
			this.$el.find('#widget-description').text( this.model.get('description'));
			
			var media_type = this.model.get('media_type');
			// move to events (didn't work for me)
			this.$el.find('#add-item').click(function(){
			    $(this).fadeOut();

			    $('#begin-message').html("Adding media to Zeega.");
			    var errorMessage = 'Unable to add Media to your Zeega Collection';

			    if(media_type == 'Collection')
			    {
					errorMessage = "Your media was added to Zeega and is being processed. It might take a few minutes before you can see it on the editor."
				}

				var itemType = item.get("media_type");
				item.url = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'bookmarklet/persist';
				item.save({ }, 
				{
					success: function(model, response) { 
				        /*
				        $('#widget-title').fadeOut();
				        $('#widget-creator').fadeOut();
				        $('#widget-description').fadeOut();
				        $('#widget-title-added-text').text(model.get("title"));
				        $('#widget-creator-added-text').text(model.get("media_creator_username"));
				        $('#widget-added-text').fadeIn();
				        */
				        $('#begin-message').hide();
				 	    $('#message').fadeIn('fast');
				 	},
				 	error: function(model, response){
	        		    $('#begin-message').html(errorMessage).fadeIn();
				 	}
				});
				console.log(zeegaWidget);
	    	});

			//EDIT TITLE
			this.$el.find('#widget-title').editable(
				function(value, settings)
				{ 
					item.set({title: value},{silent: true});
					return value; //must return the value
				},
				{
					type 	: 'text',
					indicator : 'Saving...',
					tooltip   : 'Click to edit the title',
					placeholder: 'Click to edit the title',
					indicator : '<img src="images/loading.gif">',
					select : false,
					onblur : 'submit',
					width : 200,
					cssclass : 'widget-form'
					
			});
			//EDIT DESCRIPTION
			this.$el.find('#widget-description').editable(
				function(value, settings)
				{ 
					item.set({description: value},{silent: true});
					return value; //must return the value
				},
				{
					type 	: 'textarea',
					indicator : 'Saving...',
					tooltip   : 'Click to edit the description',
					placeholder: 'Click to edit the desciption',
					indicator : '<img src="images/loading.gif">',
					select : false,
					onblur : 'submit',
					
					cssclass : 'widget-form'
					
			});
			//EDIT CREATOR
			this.$el.find('#widget-creator').editable(
				function(value, settings)
				{ 
					item.set({media_creator_username: value},{silent: true});
					return value; //must return the value
				},
				{
					type 	: 'text',
					indicator : 'Saving...',
					tooltip   : 'Click to edit the creator name',
					placeholder: 'Click to edit the creator name',
					indicator : '<img src="images/loading.gif">',
					select : false,
					onblur : 'submit',
					width : 200,
					cssclass : 'widget-form'
					
			});

			return this;

		},
		events: {
			//"click" : "previewItem"
			//'dblclick' : "doubleClick",
		},
		getTemplate : function()
		{
			//html = '<div id="database-asset-template" class="hidden">';
			var html =	'<span class="item-icon show-in-list-view zicon zicon-<%= type %>"></span>' +
						'<img class="item-thumbnail" src="<%= thumbUrl %>"/>' +
						//'<div class="item-delete" style="color:red; position:absolute; z-index:10; right:5px; font-weight:bold; display:none"></div>' +
						'<div class="item-title show-in-list-view"><%= title %></div>';
						//'<div class="item-meta"><%= creator %></div>';
						//'</div>';
			return html;
		}
	    
	
	});

})(zeegaWidget.module("items"));
