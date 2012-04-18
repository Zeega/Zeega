/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads
function initUX(){
	initHeaderUX();


//		POPOVERS		//
	$('.info').popover({
		'delayIn' : 0
	});
	$('.database-asset-list').popover({
		'delayIn' : 1,
		'placement' : 'right'
	});
	
	
}

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

/*
function addLayer(type)
{
	//add new layer model
	//add new layer model (note attr must be empty object or will adopt attr of previously created layer)
 	 
    var newLayer = new Layer({'type':type,'attr':{}});
	Zeega.addLayerToFrame( Zeega.currentFrame, newLayer );
}
*/
/*
function expandLayer(el)
{
	var w = $(el).closest('.layer-wrapper').find('.layer-content');
	if( w.is(':hidden') ) w.show('blind',{'direction':'vertical'});
	else w.hide('blind',{'direction':'vertical'});
}


function closeCitationBar()
{
	$('#citation').animate({ height : '20px' })
	//$('#hide-citation').fadeOut();
	closeOpenCitationTabs();
}

function closeOpenCitationTabs()
{
	$('.citation-tab').closest('ul').children('li').each(function(i,el){
		if($(el).find('.citation-content').is(':visible')) $(el).find('.citation-content').hide();
	})	
}
*/


//$(document).ready(function(){
	
	console.log('UX READY');
	
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
		//zeega.app.project.loadPublishProject();
		
		$('#share-project-modal').modal('show');

		$('#share-project-modal').find('.close-modal').mousedown(function(){
			$('#share-project-modal').modal('hide');
			return false;
		})
		return false;
	});
	
	$('#get-help').click(function(){
		localStorage.help = true;
		Zeega.initStartHelp();
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
	
	$('#database-search-text').click(function(event){
		event.stopPropagation();
	});
	
	function clearMenus()
	{
		$('.menu-items').removeClass('open');
	}
	
	// filter database by type
	$('#search-filter li a').click(function(){
		zeega.app.searchDatabase( {contentType: $(this).data('search-filter')}, false );
		event.stopPropagation();
		clearMenus();
		return false;
	});
	
	$('#database-collection-filter').change(function(){
		$('#database-search-filter').val('all');
		console.log('search collection: '+ $(this).val());
		zeega.app.searchDatabase( {collectionID: $(this).val()}, false );
	});
	

	
	$('#refresh-database').click(function(){
	    zeega.app.refreshDatabase();
	});
	
	//detect when zeega comes back in focus and refresh the database
	window.addEventListener('focus', function(){
		zeega.app.refreshDatabase();
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
		
		stop : function(){ zeega.app.currentSequence.updateFrameOrder() }
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
				//get layer ids as ints
				var layerIDs = _.map( $(this).sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
				zeega.app.updateLayerOrder(layerIDs);
			}
		});
	$( "#sortable-layers" ).disableSelection();
	

	$('#advance-controls input').change(function(){
		var attr = zeega.app.currentFrame.get('attr');
		if(attr) attr.advance = parseInt($(this).val()*1000);
		else attr = {'advance': parseInt($(this).val()*1000)}
		
		zeega.app.currentFrame.set({'attr':attr});
		zeega.app.currentFrame.save();
	});
	
	$('#frame-advance-random input').change(function(){
		
		var attr = Zeega.currentFrame.get('attr');
		if( $(this).is(':checked') ) attr.advanceRandom = true;
		else attr.advanceRandom = false;
		
		Zeega.currentFrame.set({'attr':attr});
		Zeega.currentFrame.save();
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


//});