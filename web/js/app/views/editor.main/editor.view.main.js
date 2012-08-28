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
			'click #zeega-add-item-type a' : 'addItemType',
			'click #database-tray-toggle' : 'toggleDatabaseSize',
			'click #zoom-interface' : 'toggleInterfaceTitles'
		},

		addItemType : function(e)
		{
			zeega.app.currentFrame.addLayerByType( $(e.target).closest('a').data('layer_type') );
			return false;
		},

		toggleDatabaseSize : function()
		{
			if( $('.database-tray').is(':visible'))
			{
				$('#database-tray-toggle .menu-verbose-title').html('show');
				$('#database-tray-toggle i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
				$('.database-tray').hide();
			}
			else
			{
				$('#database-tray-toggle .menu-verbose-title').html('hide');
				$('#database-tray-toggle i').addClass('icon-chevron-down').removeClass('icon-chevron-up');
				$('.database-tray').show();
			}
		},

		toggleInterfaceTitles : function()
		{
			if( $('#zeega-editor-main').hasClass('small-menus')) $('#zeega-editor-main').removeClass('small-menus');
			else $('#zeega-editor-main').addClass('small-menus');
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

			$('#zeega-frame-workspace').animate({left: newLeft +'px',width:newWidth +'px',height:newHeight +'px'});
		},

		
});
	
})(zeega.module("main"));