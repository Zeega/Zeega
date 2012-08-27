//editor main

(function(Main) {

	Main.Views.Framework = Backbone.View.extend({
		
		target : '#zeega-editor-main',

		initialize : function()
		{
			this.setElement( $(this.target) );
		},

		events : {
			'click a' : 'tester'
		},

		tester : function()
		{
			console.log('tester!!!');
			return false;
		}

		
});
	
})(zeega.module("main"));