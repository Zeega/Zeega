(function(Tag) {

	Tag.Views.Fancybox = Backbone.View.extend({
		
		tagName:'div',
		loaded : false,

		render:function()
		{
			var blanks = {
				itemId : this.model.get('id'),
				randId: Math.floor(Math.random()*10000),

			};

			//use template to clone the database items into
			var template = _.template( this.getTemplate() );

			//copy the cloned item into the el
			$(this.el).empty();
			$(this.el).append( template(blanks) );
			return this.el;
		},

		loadTags:function()
		{
			var _this = this;
			console.log('loading tags');
			this.loaded = true;
			
			this.model.loadTags();
			
			/*
			this.model.tags.reset({silent:true});
			this.model.tags.item_id = this.model.id;

			this.model.tags.fetch({ 
				success: function(tags,response)
				{
					console.log('tags successfully loaded');
					_this.taglist="";

					_.each(_.toArray(tags), function(tag){
						_this.taglist=tag.get('tag_name')+","+_this.taglist;	
					});
					$(_this.el).find('.tag-container').tagsInput({
						'interactive':true,
						'defaultText':'add a tag',
						'onAddTag':_this.addTag,
						'onRemoveTag':_this.deleteTag,
						'removeWithBackspace' : false,
						'minChars' : 1,
						'maxChars' : 0,
						'placeholderColor' : '#C0C0C0'
					});

					if(_this.taglist!="undefined,") $(_this.el).find('.tag-container').importTags(_this.taglist);
					console.log(_this.taglist);
				},
				error: function()
				{
					console.log('failed to load tags');
				}

			});
			*/
		},

		displayTags:function()
		{
			_.each(_.toArray(this.tags), function(tag){
					taglist=tag.get('tag_name')+","+taglist;	
				});
			$(this.el).find('#tag-container').empty().tagsInput({
				'interactive':true,
				'defaultText':'add a tag',
				'onAddTag':this.addTag,
				'onRemoveTag':this.deleteTag,
				'removeWithBackspace' : false,
				'minChars' : 1,
				'maxChars' : 0,
				'placeholderColor' : '#C0C0C0'
			});

			if( taglist != "undefined," )$(this.el).find('#tag-container').importTags(taglist);

		},
		
		addTag:function(name)
		{

			console.log('addingatag');
			/* TODO fix this reference */

			var tag = new Tag({item_id:sessionStorage.getItem('currentItemId'),tag_name:name});
			tag.save();
		},
		
		deleteTag:function(name)
		{
			console.log('removingatag');
			var tag = new Tag({item_id:sessionStorage.getItem('currentItemId'),tag_name:name});
			tag.id=1;
			tag.destroy();

		},
		
		getTemplate:function()
		{
	    	var html = '<div id="<%=randId%>" class="tag-container">blabla s ginger</div>';
	    	return html;
	    }
		
	});

})(zeegaBrowser.module("tag"));