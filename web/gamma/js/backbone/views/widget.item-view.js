//renders individual items in a search be they collection or image or audio or video type
var BookmarkletItemView = Backbone.View.extend({
    el : $("#item-view"),
    
	initialize: function()
	{
    	//Load the item's tags so we can display and edit them
    	//this.model.loadTags();
    	_.bindAll(this, "render", "toolClick");
    	this.model.view = this;
    },
    events: {
         "click #add-item": "toolClick",
    },
    toolClick : function() {
        console.log("Tool clicked");
    },
	render: function()
	{
		var item = this.model;
		var theElement = this.el;
		var view = this;

		this.el.find('#add-item').text("yo");
		this.el.find('#widget-title').text( this.model.get('title'));
		this.el.find('#widget-creator').text( this.model.get('media_creator_username'));
		this.el.find('#widget-description').text( this.model.get('description'));
		this.el.find('.item-image').attr("src", this.model.get('thumbnail_url'));
		this.el.find('.creator').text(this.model.get('media_creator_username'));
		
		//this.el.find('.tags').text( 'Dummy tag, Another fake tag, tag tag, false longer tag');
		
		// move to events (didn't work for me)
		this.el.find('#add-item').click(function(){
			$(this).fadeOut();
			console.log(item.url);
			item.url = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/import/persist";
			item.save();
			
		 	$('#message').html('Media successfuly added to your Zeega Collection');
    		return false;
    	});
		
		this.editableSetup = {
				type 	: 'textarea',
				indicator : 'Saving...',
				tooltip   : 'Click to edit description...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit'
		};
		console.log(typeof(this.editableSetup));
		//EDIT TITLE
		this.el.find('#widget-title').editable(
			function(value, settings)
			{ 
			console.log(item);
				item.set({title: value},{silent: true});
				return value; //must return the value
			},
			{
				type 	: 'textarea',
				indicator : 'Saving...',
				tooltip   : 'Click to edit description...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : 200,
				cssclass : 'fancybox-form'
		});
		//EDIT DESCRIPTION
		this.el.find('#widget-description').editable(
			function(value, settings)
			{ 
				item.set({description: value},{silent: true});
				return value; //must return the value
			},
			{
				type 	: 'textarea',
				indicator : 'Saving...',
				tooltip   : 'Click to edit description...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : 400,
				cssclass : 'fancybox-form'
		});
		//EDIT CREATOR
		this.el.find('#widget-creator').editable(
			function(value, settings)
			{ 
				item.set({media_creator_username: value},{silent: true});
				return value; //must return the value
			},
			{
				indicator : 'Saving...',
				tooltip   : 'Click to edit...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : 200,
				cssclass : 'fancybox-form'
		});
		
		
		return this;

	},
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
	},
});