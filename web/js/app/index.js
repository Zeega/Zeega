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
	/*
	$('.database-asset-list').popover({
		'delayIn' : 1,
		'placement' : 'right'
	});
	*/
	
	$('body').click(function(){
		$('.menu').addClass('hide')
	})
	
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
	
	
	$('.VS-icon.VS-icon-search').click(function(){
		console.log('open filter dialog')
		$('.filter-list').show('fast');
		/*
		$('body').click(function(){
			$('.filter-list').hide();
			$('body').unbind('click');
		})
		*/
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
		e.stopPropagation();
		return false;
	})
	
	//// non-linear links
	//// connections
	
	$('#make-connection .action').click(function(e){
		if( !$(this).hasClass('disabled') )
		{
			$(this).closest('div').removeClass('open');
			zeega.app.makeConnection( $(this).data('action') );
		}
		return false;
	})
	
	$('#connection-confirm button').click(function(){
		$('#make-connection button').removeClass('disabled');
		$('#connection-confirm').hide();
		zeega.app.confirmConnection( $(this).data('action') );
	})
	
	
	$('#database-collection-filter').change(function(){
		$('#database-search-filter').val('all');
		console.log('search collection: '+ $(this).val());
		zeega.app.searchDatabase( {collectionID: $(this).val()}, false );
	});


	$('#add-node-button').click(function(){
		zeega.app.addFrame();
		return false;
	});

	$('#preview').click(function(){
		zeega.app.previewSequence();
		return false;
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

	$('#ratio-list a').click(function(){
		changeAspectRatio( $(this).data('ratio-id') );
		return false;
	})

	function changeAspectRatio( ratioID )
	{
		switch( ratioID )
		{
			case 0:
				$('#visual-editor-workspace').css('width','704px')
				break;

			case 1:
				$('#visual-editor-workspace').css('width','625px')
				break;

			default:
				console.log('goDefault')
		}
	}


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



	$('#add-frame').draggable({
		axis:'x',
		revert:true,

		start : function(e,ui)
		{
			this.num= Math.floor( ui.position.left / 55 );
			//console.log(this.num);
		},
		containment : 'parent',
		helper :function() {
			return $('<div>');
		},

		drag : function(e,ui)
		{
			//console.log('moved'+ ui.position.left)
			var temp = Math.floor( ui.position.left / 55 );
			if(this.num != temp)
			{
				var _this = this;
				$('.ghost-frame').remove();
				_.times(temp-this.num, function(){
					$('#frame-drawer ul').append( $('<li class="frame-thumb ghost-frame">') );

				})
			}
			//this.num = temp;

		},

		stop : function(e,ui)
		{
			$('.ghost-frame').remove();
			_.times( Math.floor( ui.position.left/55-this.num ), function(){ zeega.app.addFrame() });
		}
	});

	//publish button
	$('#publish-project').click(function(){
		//Uncomment to activate publish modal
		zeega.app.shareProject();
		return false;
	});

	$('#get-help').click(function(){
		localStorage.help = true;
		zeega.app.initStartHelp();
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
	window.addEventListener('focus', function(){
		zeega.app.refreshDatabase();
		console.log('refreshing database from zeega.ux.editor line 260');
	});

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

	//frame tray sortable and sorting events
	$('#frame-list').sortable({  
		//axis : 'x',
		containment: '#frame-drawer',
		forceHelperSize : true,
		placeholder: "frame-thumb ui-state-highlight",
		forcePlaceholderSize:true,
		forceHelperSize:true,
		tolerance: 'pointer',
		distance: 10,

		stop : function(){ zeega.app.updateFrameOrder() }
	});

	$( "#layers-list-visual" )
		.sortable({

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
				zeega.app.updateLayerOrder();
			}
		});
	$( "#sortable-layers" ).disableSelection();

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

	$('#advance-controls input').change(function(){
		console.log(this,$(this).val());
		var a = $(this).val();
		
		a = a != -1 ? parseInt( a*1000 ) : -1;

		console.log('advance',a)
		zeega.app.currentFrame.update({'advance':a});
	});

	//expands the Zeega editor panels	
	$('.expandable .panel-head').click(function(){

	//removed the ability to store the panel states for now
		//get the current Frame ID
		//var frameID = Zeega.currentFrame.id;
		//var domID = $(this).attr('id').split('-',1)[0];

		//var storage = localStorage.getObject( frameID );
		//var panelStates = {};
		//if( _.isNull( storage ) ) storage = {};
		//if( !_.isNull( storage ) && !_.isUndefined( storage.panelStates ) ) panelStates = storage.panelStates;

		var content = $(this).next('div');
		if( content.is(':visible'))
		{
			//hide
			//eval( 'var state = {"'+ domID +'":true}');
			//_.extend( panelStates , state );
			content.hide('blind',{'direction':'vertical'});
		}else{
			//show
			//eval( 'var state = {"'+ domID +'":false}');
			//_.extend( panelStates , state );
			content.show('blind',{'direction':'vertical'})	
		}
		//set as property to read in on reload
		//_.extend( storage, {panelStates:panelStates} )
		//localStorage.setObject( frameID , storage );
	})

	$('#database-item-list').scroll(function(){
		if( $('#database-item-list').scrollTop() == $('#database-item-list')[0].scrollHeight - $('#database-item-list').innerHeight() )
		{
			zeega.app.itemCollection.getNextPage();
		}
	})

	/*****  		CRITICAL		*******/

	//enable the workspace as a valid drop location for DB items
	$('#visual-editor-workspace').droppable({
		accept : '.database-asset-list',
		hoverClass : 'workspace-item-hover',
		tolerance : 'pointer',

		//this happens when you drop a database item onto a frame
		drop : function( event, ui )
			{
				ui.draggable.draggable('option','revert',false);
				zeega.app.addLayer({ item : zeega.app.draggedItem })
			}
	});

	// FAKE STUFF
	$('#css-change').toggle(function(){
		$('body').css('background','#fff');
		$('#sequence-header').css('color','#444');
		$('#frame-drawer').css('background','#fff');
		$('.database-asset').css('background','#fff');
	},function(){
		$('body').css('background','');
		$('#sequence-header').css('color','');
		$('#frame-drawer').css('background','');
		$('.database-asset').css('background','');
	});



});
