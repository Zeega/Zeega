//editor main

(function(Main) {

	Main.Views.Framework = Backbone.View.extend({
		
		target : '#zeega-editor-main',

		initialize : function()
		{
			var _this = this;
			this.setElement( $(this.target) );

			var resizeWindow = _.debounce(function(){
				_this.updateWorkspaceScale();
				_this.updateLayerListsContainerHeight();
			}, 750);
			$(window).resize(resizeWindow);

			$('#search-input').keyup(function(e){
				switch(e.which)
				{
					case 13:
						_this.onSearch();
						break;
					case 27:
						_this.onSearchEscape();
						break;
				}
			})

			zeega.app.items.on('reset', this.updateLayerListsContainerHeight, this);
		},

		events : {
			'click #zeega-add-item-type a' : 'addItemType',
			'click #database-tray-toggle' : 'toggleDatabaseSize',
			'click #zoom-interface' : 'toggleInterfaceTitles',
			'blur #search-input' : 'onSearch',
			'click #filter-action-menu a' : 'filterDatabase'
		},

		onSearch : function()
		{
			if( $('#search-input').val() != '' ) zeega.app.items.search.set({ query : $('#search-input').val() })
		},

		onSearchEscape : function()
		{
			$('#search-input').val('').blur();
		},

		filterDatabase : function(e)
		{
			var _this = this;
			var contentFilter = $(e.target).data('filter');

			if( contentFilter != 'reset' )
			{
				$('#database-flash').html('filtered by: '+ contentFilter );
				if($('#database-flash').is(':hidden')) $('#database-flash').show('blind',{direction:'vertical'},500, function(){ _this.updateLayerListsContainerHeight() });
				zeega.app.items.search.reset().set('content',contentFilter);
			}
			else
			{
				$('#database-flash').hide('blind',{direction:'vertical'},500, function(){ _this.updateLayerListsContainerHeight() } );
				zeega.app.items.search.reset({silent:false});
				this.onSearchEscape();
			}

			console.log('$$		filter',e, e.target, $(e.target).data('filter'))
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
			this.updateLayerListsContainerHeight();
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

		updateLayerListsContainerHeight : function()
		{
			var windowHeight = $('#zeega-edit-column').height();
			var usedAbove = $('.layer-lists-container').offset().top;
			var usedBelow = $('#zeega-item-database').height();
			$('.layer-lists-container').css('height',windowHeight-usedAbove-usedBelow);
		}

		
});
	
})(zeega.module("main"));