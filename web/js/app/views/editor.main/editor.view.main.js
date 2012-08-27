//editor main

(function(Main) {

	Main.Views.Framework = Backbone.View.extend({
		
		target : '#zeega-editor-main',

		initialize : function()
		{
			this.setElement( $(this.target) );
		},

		events : {
			'click #zeega-add-item-type a' : 'addItemType'
		},

		addItemType : function(e)
		{
			zeega.app.currentFrame.addLayerByType( $(e.target).closest('a').data('layer_type') );
			return false;
		}

		
});
	
})(zeega.module("main"));