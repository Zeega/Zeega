//editor main

(function(Main) {

	Main.Views.Framework = Backbone.View.extend({
		
		target : '#zeega-editor-main',

		initialize : function()
		{
			var _this = this;
			this.setElement( $(this.target) );

			var resizeWindow = _.debounce(function(){
				_this.toggleColumnSize();
				_this.updateWorkspaceScale();
				_this.updateLayerListsContainerHeight();
			}, 750);
			$(window).resize(resizeWindow);

				//detect when zeega comes back in focus and refresh the database
			window.addEventListener('focus', function(){ zeega.app.refreshDatabase() });

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


			$('#zeega-item-database-list').scroll(function(){
				if( $(this).height() >= $(this).find('.list').height() + $(this).find('.list').position().top )
				{
					console.log('infinitescrolllll')
					zeega.app.items.incrementPage();
				}
			})

			zeega.app.items.on('reset', this.updateLayerListsContainerHeight, this);

			

		},

		events : {
			'click #zeega-add-item-type a' : 'addItemType',
			'click #database-tray-toggle' : 'toggleDatabaseSize',
			'click #zoom-interface' : 'toggleInterfaceTitles',
			'blur #search-input' : 'onSearch',
			'click #filter-action-menu a' : 'filterDatabase',
			'click #add-media-modal' : 'showAddMediaModal'
		},

		onSearch : function()
		{
			var _this = this;
			if( $('#search-input').val() != '' ) zeega.app.items.search.set({ query : $('#search-input').val() });
			else
			{
				if($('#database-flash').is(':visible')) $('#database-flash').hide('blind',{direction:'vertical'},500, function(){ _this.updateLayerListsContainerHeight() } );
				zeega.app.items.search.reset({silent:false});
			}
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
				zeega.app.items.search.set('content',contentFilter);
			}
			else
			{
				if($('#database-flash').is(':visible')) $('#database-flash').hide('blind',{direction:'vertical'},500, function(){ _this.updateLayerListsContainerHeight() } );
				zeega.app.items.search.reset({silent:false});
				this.onSearchEscape();
			}
		},

		addItemType : function(e)
		{
			zeega.app.currentFrame.addLayerByType( $(e.target).closest('a').data('layer_type') );
			return false;
		},

		showAddMediaModal : function()
		{
			var Modal = zeega.module('modal');
			this.addMediaModal = new Modal.Views.AddMedia();
			$('body').append( this.addMediaModal.render().el );
			this.addMediaModal.show();
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

		toggleColumnSize : function()
		{
			if(window.innerWidth > 1200)
			{
				$('#zeega-editor-main').addClass('wide-view');
				$('#zeega-edit-column').attr( 'style', 'width:-webkit-calc(100% - 430px)')
			}
			else
			{
				$('#zeega-editor-main').removeClass('wide-view');
				$('#zeega-edit-column').attr( 'style', 'width:-webkit-calc(100% - 300px)')
			}
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