(function(Project) {

	// This will fetch the tutorial template and render it.
	Project.Views.Editor = Backbone.View.extend({

		el : $('#sequence-title'),

		render: function()
		{
			var _this = this;
			this.$el.html( this.model.get('title') );

			this.$el.editable(
				function(value,settings)
				{
					_this.model.set( { 'title': value } );
					_this.model.save();
					return value; //must return the value!!
				},
				{
					indicator : 'Saving...',
					tooltip   : 'Click to edit...',
					indicator : '<img src="images/loading.gif">',
					select : true,
					onblur : 'submit',
					width : 700,
					maxlength : 40
				});

			var regex = /Untitled/;
			if( regex.test( this.model.get('title')) ) $(this.el).trigger('click');

			return this;
		}
	});
	
})(zeega.module("project"));