//editor main

(function(Main) {

	Main.Views.Framework = Backbone.View.extend({
		
		target : '#zeega-editor-main',

		initialize : function()
		{
			this.setElement( $(this.target) );

			var resizeWindow = _.debounce(this.updateWorkspaceScale, 750);
			$(window).resize(resizeWindow);
		},

		events : {
			'click #zeega-add-item-type a' : 'addItemType'
		},

		addItemType : function(e)
		{
			zeega.app.currentFrame.addLayerByType( $(e.target).closest('a').data('layer_type') );
			return false;
		},

		updateWorkspaceScale : function()
		{
			var padding = 20;
			var windowHeight = $('#zeega-edit-column').height();
			var navHeight = $('#zeega-project-nav').height();
			var navWidth = $('#zeega-project-nav').width();

			var maxHeight = windowHeight - navHeight - 2*padding;
			var maxWidth = navWidth - 2*padding;

			var newHeight = ( maxWidth / maxHeight > 4/3 ) ? maxHeight : maxWidth*3/4;
			var newWidth = ( maxWidth / maxHeight > 4/3 ) ? maxHeight*4/3 : maxWidth;
			var newLeft = (navWidth - newWidth) / 2;

			console.log('winH', windowHeight, 'navH',navHeight,'navWidth',navWidth,'maxH',maxHeight,'maxWidth',maxWidth,'newH',newHeight,'newW',newWidth)

			$('#zeega-frame-workspace').animate({left: newLeft +'px',width:newWidth +'px',height:newHeight +'px'});

		},

		
});
	
})(zeega.module("main"));