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
			console.log('seq render')
			console.log(this.model)
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
				console.log('switch sequence tabs')
			}
			console.log('sequence tab clicked')
			return false;
		},
		
		editSequence : function(e)
		{
			console.log('edit Sequence')
			e.stopPropagation();
			return false;
		},
	
		getTemplate : function()
		{
			var html = 
			
				'<a href="#"><%= title %></a>';
				//'<a href="#"><%= title %> <i class="icon-edit edit-sequence"></i></a>';
				
			return html;
		}
	
	});

})(zeega.module("sequence"));
