jQuery(function($)
{
	// Shorthand the application namespace
	var Zeega = zeega.app;
	
	Zeega.init();

	initHeaderUX();

//		POPOVERS		//
	$('.info').popover({
		'delayIn' : 0
	});

	$('body').click(function(){
		$('.menu').addClass('hide')
	})
	
	console.log('==		search stuffz')
	var visualSearch = VS.init({
		container : $('.visual_search'),
		query     : '',
		callbacks : {
			search : function(query, searchCollection)
			{
				console.log('	search')
				var s = {};
				var filtered = false;
				_.each( _.toArray( searchCollection ), function(facet){
					console.log(facet)
					
					if( facet.get('category') == 'filter' )
					{
						if(filtered) facet.destroy();
						else s.contentType = facet.get('value');
						filtered = true;
					}
					if( facet.get('category') == 'text' ) s.query = facet.get('value');
				})
				visualSearch.searchBox.renderFacets();
				zeega.app.searchDatabase( s , true );
			},
			facetMatches : function(callback)
			{
				callback([ 'filter',
				
					{ label: 'all', category: 'Media Type' },
					{ label: 'audio', category: 'Media Type' },
					{ label: 'image', category: 'Media Type' },
					{ label: 'video', category: 'Media Type' }
				
				 ]);
			},
			valueMatches : function(facet, searchTerm, callback)
			{
				switch (facet)
				{
					case 'filter':
						callback(['all', 'audio', 'image', 'video']);
						break;
				}
			}
		}
	});
	console.log('search stuffz', visualSearch)
	
	
	$('.VS-icon.VS-icon-search').click(function(){
		console.log('open filter dialog')
		$('.filter-list').show('fast');
	})
	//when a filter is selected via dropdown
	$('.filter-list a').click(function(e){
		
		var model = new VS.model.SearchFacet({
	      category : 'filter',
	      value    : $(this).data('searchFilter'),
	      app      : visualSearch.searchBox.app
		});
		visualSearch.searchQuery.add(model, {at:0});
		visualSearch.options.callbacks.search( null, visualSearch.searchQuery);
		
		$('.filter-list').hide();
		console.log('search filter', visualSearch, model)
		e.stopPropagation();
		return false;
	})
	
	
	
	
	$('#database-collection-filter').change(function(){
		$('#database-search-filter').val('all');
		console.log('search collection: '+ $(this).val());
		zeega.app.searchDatabase( {collectionID: $(this).val()}, false );
	});

	$('#list-view').click(function(){
		console.log('goto list view');
		$('#grid-view .zicon').removeClass('orange');
		$(this).find('.zicon').addClass('orange');
		$('#database-item-list').addClass('list-view').removeClass('grid-view');
		return false;
	})

	$('#grid-view').click(function(){
		console.log('goto grid view');
		$('#list-view .zicon').removeClass('orange');
		$(this).find('.zicon').addClass('orange');
		$('#database-item-list').removeClass('list-view').addClass('grid-view');
		return false;
	})


	$('#project-settings').click(function(){
		projectSettings();
	})

	function projectSettings()
	{
		//$('#project-settings-modal').modal({ backdrop:true });
		$('#project-settings-modal').modal('show');
		$('#project-settings-modal').find('#close-modal').click(function(){
			$('#project-settings-modal').modal('hide');
		})
		return false;
	}

	function embedButton()
	{

		var ex = Zeega.exportProject(true)

		$('#export').modal('show');
		$('#export-json').val(ex);

		$('#export-json').focus( function(){
			$('#export-json').select();
		});

		$('#export').find('#close-modal').mouseup(function(){
			$('#export').modal('hide');
		})

		return false;

	}

	$('#new-layer-list a').click(function(){
		zeega.app.addLayer( { type : $(this).data('type') } );
		//addLayer( $(this).data('type') );
		return false;
	})



	$('.menu-toggle').click(function(){

		var menu = $(this).next();

		if( menu.hasClass('open') ) menu.removeClass('open');
		else menu.addClass('open');
		return false;
		//event.stopPropagation();
	});



	//clear menus on click
	$('html').bind("click", clearMenus);

	$('.visual_search').click(function(event){
		event.stopPropagation();
	});

	function clearMenus()
	{
		$('.menu-items').removeClass('open');
	}


	$('#refresh-database').click(function(){
	    zeega.app.refreshDatabase();
	});

	
	//detect when zeega comes back in focus and refresh the database
	/*
	window.addEventListener('focus', function(){
		zeega.app.refreshDatabase();
		console.log('refreshing database from zeega.ux.editor line 260');
	});
	*/
	$('#database-search-text').keypress(function(e){
		var keycode = e.which;

		if (keycode == 13)
		{
			zeega.app.searchDatabase( { query : $("#database-search-text").val() }, false );

			//open database tray if closed
			if( $('#database-panel .panel-content').is(':hidden') )
				$('#database-panel .panel-content').show('blind',{'direction':'vertical'});

		}else{
			return true;
		}
	});


	//hide layer content initially
	$(".layer-list a:first").click(function(){
		console.log('sortable layers');
		$('#sortable-layers li').children('div').hide('fast');
		if($(this).closest('li').children('div').is(":visible")){
			$(this).closest('li').children('div').hide('fast');
			return false;
		}else{
			$(this).closest('li').children('div').show('fast');
			return false;
		}
	});

	$('#links-list').sortable({
		//define a grip handle for sorting
		handle: '.layer-drag-handle',
		cursor : 'move',
		axis:'y',
		containment: '#sidebar',
		cursorAt : {top:1,left:1},
		placeholder: "ui-state-highlight",

		//resort the layers in the workspace too
		update : function()
		{
			console.log('link sort update')
			zeega.app.updateLayerOrder();
			/*
			//get layer ids as ints
			var layerIDs = _.map( $(this).sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
			zeega.app.updateLayerOrder(layerIDs);
			*/
		}
	})


	$('#database-item-list').scroll(function(){
		if( $('#database-item-list').scrollTop() == $('#database-item-list')[0].scrollHeight - $('#database-item-list').innerHeight() )
		{
			zeega.app.itemCollection.getNextPage();
		}
	})
		

	$('#add-media-button').click(function(){

		$('#add-media').modal();
		return false;
	});

});
