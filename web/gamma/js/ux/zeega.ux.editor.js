/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads
function initUX(){

	initHeaderUX();
	
	//database tab switching
	
	$('#tab-content').cycle({
		fx: 'fade',
		timeout: 0,
		speed: 500,
		width:394,
		fit:1
	});
	
	$('#database-tab').click(function(){
		$('#tab-content').cycle(0);
		$('.tab-heads').removeClass('active');
		$(this).closest('li').addClass('active');
		return false;
	});
	$('#layers-tab').click(function(){
		$('#tab-content').cycle(1);
		$('.tab-heads').removeClass('active');
		$(this).closest('li').addClass('active');
		return false;
	});
	$('#branch-tab').click(function(){
		$('#tab-content').cycle(2);
		$('.tab-heads').removeClass('active');
		$(this).closest('li').addClass('active');
		return false;
	});
	

	
	
}

function insertPager(items, page)
{
	//NEW PAGER
	$('#database-pager')
		.empty()
		.paging( items, {
//			format: "<(qqq-) nncnn (-ppp)>",
			format: "[<nncnn>",
			perpage: 10,
			lapping: 0,
			page: page,
			onSelect: function(page){
				Database.page = page;
				$('#tab-database-slide-window').cycle(page-1);
				/*
					when we get up to within a threshold in the pages
					then make another call to the database and make a new pager
				*/
				
				
				if(this.pages - page < 3 && !Database.endOfItems)
				{
					console.log('load more!');
					// call the database and add more item divs
					Database.append();
				}
				
			
		},
		
		onFormat: function(type) {
			switch (type) {
			case 'block':
				if (!this.active) return '<span class="disabled">' + this.value + '</span>';
				else if (this.value != this.page) return '<a class="pager-page" href="#' + this.value + '">' + this.value + '</a>';
				return '<span class="pager-page current">' + this.value + '</span>';
			case 'next':
				if (this.active) {
					return '<a href="#' + this.value + '" class="next">Next</span></a>';
				}
				return '<span class="disabled next">Next</span>';
			case 'prev':
				if (this.active) {
					return '<a href="#' + this.value + '" class="prev">Previous</a>';
				}
				return '<span class="disabled prev">Previous</span>';
			case 'first':
				if (this.active) {
					return '<a href="#' + this.value + '" class="first">|<</a>';
				}
				return '<span class="disabled first">|<</span>';
			
			case 'last':
				if (this.active) {
					return '<a href="#' + this.value + '" class="last">>|</a> <span class="fill">'+ this.pages +' pages loaded</span>';
				}
				return '<span class="disabled last">>|</span> <span class="fill">'+ this.pages +' pages loaded</span>';
			case 'fill':
				if (this.active) {
					return "<span class='fill'>...</span>";
				}
			case 'right':
			case 'left':

				if (!this.active) {
					return "";
				}
				return '<a class="pager-page" href="#' + this.value + '">' + this.value + '</a>';
			}
		}
	});
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
		var form=$(inputfield).closest("form");
		Database.search( form.find("#database-search-text").val(), form.find("#database-search-filter").val() );
		return false;
	}else{
		return true;
	}
}

function submitbutton(button)
{
	var form=$(button).closest("form");
	Database.search( form.find("#database-search-text").val(), form.find("#database-search-filter").val() );
	return false;
}

function shareButton()
{
	
}

function embedButton()
{

}

function addLayer(type)
{
	//add new layer
	var newLayer = new Layer({'type':type});
	//this can only happen to the current node
	Zeega.addLayerToNode( Zeega.currentNode, newLayer );
}

function toggleWorkspace(el)
{
	var attr = Zeega.currentNode.get('attr');
	var w = $(el).closest('.wrapper').find('.workspace');
	if(w.is(':hidden'))
	{
		w.show('blind',{'direction':'vertical'});
		$('#ve-toggle').html('–');
		attr.editorHidden = false;
	}else{
		w.hide('blind',{'direction':'vertical'});
		$('#ve-toggle').html('+');
		attr.editorHidden = true;
	}
	Zeega.currentNode.set({'attr':attr});
	Zeega.currentNode.save();
}

function expandLayer(el)
{
	console.log('expanding layer');
	var w = $(el).closest('.layer-wrapper').find('.layer-content');
	if(w.is(':hidden'))
	{
		w.show('blind',{'direction':'vertical'});
	}else{
		w.hide('blind',{'direction':'vertical'});
	}
}



$(document).ready(function() {
	
	
	$('#add-node').draggable({
		axis:'x',
		revert:true,

		start : function(e,ui)
		{
			//this.xPos = ui.position.left;
		
		},
		
		drag : function(e,ui)
		{
			//console.log('moved'+ ui.position.left)
			var temp = Math.floor( ui.position.left / 55 );
			if(this.num != temp)
			{
				var _this = this;
				$('.ghost-node').remove();
				_.times(temp, function(){
					$('.ui-sortable').append( $('<li class="node-thumb ghost-node">') );
					
				})
			}
			this.num = temp;

		},
		
		stop : function(e,ui)
		{
			$('.ghost-node').remove();
			_.times( Math.floor( ui.position.left/55 ), function(){ Zeega.addNode() });
		}
	});
	
	
	
	//fadeIn the sidebar
	$('#sidebar').fadeIn();
	
	$('#database-search-filter').change(function(){
		Database.changeFilter(this);
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
		$(this).css('color','#333');
		$(this).val('');
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
	
	$( "#sortable-layers" )
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
	
	
	$('#asset-preview-close').click(function(){
		//remove src of media
		
		if( $('#asset-preview').find('source') )
		{
			//remove source
			$('source').attr('src','');
			$('source').attr('type','');
			$('video').remove();
		}
		$('#asset-preview').fadeOut();
		
	});
	

	$('#advance-controls input').change(function(){
		var attr = Zeega.currentNode.get('attr');
		if(attr) attr.advance = $(this).val();
		else attr = {'advance':$(this).val()}
		
		Zeega.currentNode.set({'attr':attr});
		Zeega.currentNode.save();
	});
	
	
	/*****  		CRITICAL		*******/
	
	//enable the workspace as a valid drop location for DB items
	$('#workspace').droppable({
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
							'url' : Zeega.draggedItem.get('item_url')
						}
					};
					var layerToSave = new Layer(settings);

					Zeega.addLayerToNode( Zeega.currentNode, layerToSave );
					
					//flash the layers tab
					$('#layers-tab').effect("highlight", {}, 3000);
					
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


});