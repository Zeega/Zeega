/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads
function initUX(){

	initHeaderUX();
	
}



function submitenter(inputfield,e)
{
	var keycode;
	
	console.log('submitenter');
	
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	else return true;

	if (keycode == 13)
	{
	    return submitbutton(inputfield);
	}else{
		return true;
	}
}

function submitbutton(button)
{
    return search(button,true);
}

function search(triggerElement, discardCurrentResultSet)
{
    //var form = $(triggerElement).closest("form");
    //Database.search( form.find("#database-search-text").val(), form.find("#database-search-filter").val(), discardCurrentResultSet);
    // this is not very elegant...

	var query = $("#database-search-text").val();
	var defaultText = /search database/;
	if( defaultText.test(query) ) query = '';
    Database.search( query, $("#database-search-filter").val(), discardCurrentResultSet);

	//show the database drawer if it's hidden
	if( $('#database').is(':hidden') )
	{
		$('#database').show('blind',{'direction':'vertical'});
		$('#item-view-bar').find('.expander').addClass('zicon-collapse').removeClass('zicon-expand');
	}
	
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

function shareButton()
{	
	$('#share-project-modal').modal('show');
	
	//$('#project-link').attr('href','')
	
	$('#share-project-modal').find('#close-modal').mouseup(function(){
		$('#share-project-modal').modal('hide');
	})

	return false;
}



function addLayer(type)
{
	//add new layer model (note attr must be empty object or will adopt attr of previously created layer)
	var newLayer = new Layer({'type':type,'attr':{}});
	//this can only happen to the current node
	Zeega.addLayerToNode( Zeega.currentNode, newLayer );
}

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



//$(document).ready(function(){
	
	console.log('UX READY');
	
	$('#add-node').draggable({
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
				$('.ghost-node').remove();
				_.times(temp-this.num, function(){
					$('.ui-sortable').append( $('<li class="node-thumb ghost-node">') );
					
				})
			}
			//this.num = temp;

		},
		
		stop : function(e,ui)
		{
			$('.ghost-node').remove();
			_.times( Math.floor( ui.position.left/55-this.num ), function(){ Zeega.addNode() });
		}
	});
	
	//share button
	$('#share-project').click(function(){
		shareButton();
	});
	
	//fadeIn the sidebar
	$('#sidebar').fadeIn();
	
	$('#database-search-button').click(function(){
		var discardCurrentResultSet = true;
		Database.search( $("#database-search-text").val(), $("#database-search-filter").val(), discardCurrentResultSet);
		return false;
	});
	
	$('#database-search-filter').change(function(){
	    return search(this,true);
	});
	
	$('#refresh-database').click(function(){
	    return search(this,true);
	});
	
	//node tray sortable and sorting events
	
	$('#node-drawer').find('ul').sortable({  
		axis : 'x',
		forceHelperSize : true,
		placeholder: "node-thumb ui-state-highlight",
		forcePlaceholderSize:true,
		forceHelperSize:true,
		tolerance: 'pointer',
		
		stop : function(){
			Zeega.route.set({'nodesOrder':$(this).sortable('toArray')});
			Zeega.route.save();
			console.log($(this).sortable('toArray'));
		}
	});
	
	//search bar focus stuff
	$('#database-search-text').focus(function(){
		$(this).css('color','#444');
		$(this).val('');
	});
	
	$('#database-search-text').click(function(event){
		event.stopPropagation();
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
			update : function(){
				//get layer ids as ints
				var layerIDs = _.map( $(this).sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
				Zeega.updateLayerOrder(layerIDs);
			}
		});
	$( "#sortable-layers" ).disableSelection();
	

	$('#advance-controls input').change(function(){
		var attr = Zeega.currentNode.get('attr');
		if(attr) attr.advance = $(this).val();
		else attr = {'advance':$(this).val()}
		
		Zeega.currentNode.set({'attr':attr});
		Zeega.currentNode.save();
	});
	
	$('#node-advance-random input').change(function(){
		var attr = Zeega.currentNode.get('attr');
		if( $(this).is(':checked') ) attr.advanceRandom = true;
		else attr.advanceRandom = false;
		
		Zeega.currentNode.set({'attr':attr});
		Zeega.currentNode.save();
	});
	

//expands the Zeega editor panels	
	$('.editor-title-bar-expander').click(function(){
		
		//get the current Node ID
		var nodeID = Zeega.currentNode.id;
		var domID = $(this).attr('id').split('-',1)[0];

		var storage = localStorage.getObject( nodeID );
		var panelStates = {};
		if( _.isNull( storage ) ) storage = {};
		if( !_.isNull( storage ) && !_.isUndefined( storage.panelStates ) ) panelStates = storage.panelStates;
		
		var expander = $(this).next('div');
		if( expander.is(':visible'))
		{
			//hide
			eval( 'var state = {"'+ domID +'":true}');
			_.extend( panelStates , state );
			expander.hide('blind',{'direction':'vertical'});
			$(this).find('.expander').removeClass('zicon-collapse').addClass('zicon-expand');
		}else{
			//show
			eval( 'var state = {"'+ domID +'":false}');
			_.extend( panelStates , state );
			expander.show('blind',{'direction':'vertical'})	
			$(this).find('.expander').addClass('zicon-collapse').removeClass('zicon-expand');
		}
		//set as property to read in on reload
		_.extend( storage, {panelStates:panelStates} )
		localStorage.setObject( nodeID , storage );
	})
	
	
	
	/*****  		CRITICAL		*******/
	
	//enable the workspace as a valid drop location for DB items
	$('#visual-editor-workspace').droppable({
			accept : '.database-asset',
			hoverClass : 'workspace-item-hover',
			tolerance : 'pointer',

			//this happens when you drop a database item onto a node
			drop : function( event, ui )
				{
					ui.draggable.draggable('option','revert',false);
					//make the new layer model
					var settings = {
						//url: Zeega.url_prefix + 'routes/'+ Zeega.routeID +'/layers',
						type: Zeega.draggedItem.get('source_type'),
						attr: {
							'item_id' : Zeega.draggedItem.id,
							'title' : Zeega.draggedItem.get('title'),
							'url' : Zeega.draggedItem.get('item_url'),
							'uri' : Zeega.draggedItem.get('item_url'),
							'thumbnail_url' : Zeega.draggedItem.get('thumbnail_url'),
							'attribution_url' : Zeega.draggedItem.get('attribution_uri'),
							'citation':true,
						}
					};
					var layerToSave = new Layer(settings);

					Zeega.addLayerToNode( Zeega.currentNode, layerToSave );
										
					console.log('update node thumb for node: '+ Zeega.currentNode.id);
				}
		});
		
		// FAKE STUFF
		$('#css-change').toggle(function(){
			$('body').css('background','#fff');
			$('#route-header').css('color','#444');
			$('#node-drawer').css('background','#fff');
			$('.database-asset').css('background','#fff');
		},function(){
			$('body').css('background','');
			$('#route-header').css('color','');
			$('#node-drawer').css('background','');
			$('.database-asset').css('background','');
		});


//});