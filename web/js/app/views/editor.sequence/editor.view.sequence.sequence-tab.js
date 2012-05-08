(function(Sequence){

	Sequence.Views.SequenceTabs = Backbone.View.extend({
		
		tagName : 'li',
		
		inFocus : false,
		
		initialize : function()
		{
			this.model.on('focus',this.onFocus, this);
			this.model.on('blur',this.onBlur, this);
		},
		
		render: function()
		{
			$(this.el).html( _.template(this.getTemplate(),{title:this.model.get('title') || '...'}) );
			
			return this;
		},
		
		onFocus : function()
		{
			this.inFocus = true;
			this.$el.addClass('active')
		},
		onBlur : function()
		{
			this.inFocus = false;
			this.$el.removeClass('active')
		},
	
		events : {
			'click' : 'goToSequence',
			'click .edit-sequence' : 'editSequence'
		},
	
		goToSequence : function(e)
		{
			if( !this.inFocus )
			{
				zeega.app.goToSequence(this.model.id)
			}
			console.log('sequence tab clicked')
			return false;
		},
		
		editSequence : function(e)
		{
			e.stopPropagation();
			return false;
		},
	
		getTemplate : function()
		{
			var html = 
				'<a href="#"><%= title %></a>';
			return html;
		}
	
	});

})(zeega.module("sequence"));
