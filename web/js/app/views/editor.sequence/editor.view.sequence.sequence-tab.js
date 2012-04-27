(function(Sequence){

	Sequence.Views.SequenceTabs = Backbone.View.extend({
		
		tagName : 'li',
		
		inFocus : false,
		
		initialize : function()
		{
			this.inFocus = this.options.active;
		},
		
		render: function()
		{
			var active = this.inFocus ? 'active' : '';
			$(this.el).html( _.template(this.getTemplate(),{title:this.model.get('title'), active: active}) ).addClass(active)
			
			return this;
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
