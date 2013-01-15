(function(Items) {

	Items.Views.Common = Items.Views.Common || {};
	// This will take a model and look for a tags array and display it
	//should be possible to make them editable or not
	Items.Views.Common.TagDisplay = Backbone.View.extend({

		className : 'tag-viewer',
		
		isEditable : false,
		editing : false,
		
		initialize : function()
		{
			this.isEditable = this.model.get('editable');
			console.log("Tag Module Here:: this is what I got ",this.model);
		},
		
		render : function()
		{

			var _this = this;

			this.$el.html( this.getTemplate() );
			_.each( this.model.get('tags'), function( tag, index ){
				_this.$el.find('.tag-list').append(_this.getTagTemplate(tag,index));
			});

			return this;
		},
		
		events : {
			'click .tag-list li a' : 'goToTag',
			'keyup .tag-input input' : 'inputKeypress',
			
			'mouseover ' : 'overTagDelete',
			'mouseout' : 'outTagDelete',
			'click .tag-delete' : 'deleteTag'
		},
		
		goToTag : function()
		{
			return false;
		},
		
		enterEditMode : function()
		{
			this.editing = true;
			this.$el.find('.tag-input').show();
		},
		
		exitEditMode : function()
		{
			this.editing = false;
			this.$el.find('.tag-input').hide();
		},
		
		overTagDelete : function(e)
		{
			$('.tag-delete').html('&times;');
		},
		outTagDelete : function(e)
		{
			$('.tag-delete').html('•');
		},

		deleteTag : function(e)
		{
			var index = $(e.target).closest('li').data('index');
			var tagArray = this.model.get('tags');
			tagArray.splice(index,1);
			if(!_.isUndefined(this.model.get('text'))){
                    this.model.unset('text');
            }
			this.model.save('tags',tagArray);
			this.render();
			return false;
		},
		
		inputKeypress : function(e)
		{
			var tagArray;
			
			if(e.which == 13){
				tagArray = this.model.get('tags');
				if(!_.isArray(tagArray)) tagArray =[];
				tagArray.push(this.$el.find('.tag-input input').val());
				if(!_.isUndefined(this.model.get('text'))){
                    this.model.unset('text');
                }
				this.model.save('tags',tagArray);
				this.render();
				this.$el.find('.tag-input input').focus();

				return false;
			}
		},

		getTagTemplate : function(tag,index)
		{
			html =
			"<li data-index='"+ index +"'>"+
				"<span>"+ tag +"</span>";
				if(this.isEditable) html += "<a href='#' class='tag-delete tag-split'>•</a>";
				else html += "<span class='tag-split'>•</span>";
			html += "</li>";
			
			return html;
		},

		getTemplate : function()
		{
			var html = "<ul class='tag-list'></ul>"+
						"<div class='tag-input'><input type='text' class='span4' placeholder='add a new tag and press enter'/></div>";
			
			return html;
		}
	});

	
})(zeega.module("items"));



