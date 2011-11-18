/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads

function initUX(){
	initHeaderUX();

	$('#browser-toggle-items-vs-collections li, #browser-toggle-all-media-vs-my-media li,').click(function(){
		$(this).closest('li').removeClass('browser-unselected-toggle');
		$(this).closest('li').addClass('browser-selected-toggle');
		$(this).siblings().removeClass('browser-selected-toggle');
		$(this).siblings().addClass('browser-unselected-toggle');
		return false;
	});
	$('#browser-toggle-items-vs-collections li').click(function(){
		$('#browser-results-collections').toggle();
		$('#browser-results-items').toggle();

		return false;
	});
}
function toggleFilterDrawer(){

	if( $('#browser-right-sidebar').css('position') == 'absolute') {
		$('#browser-right-sidebar').css('position', 'relative');
		$('#browser-right-sidebar').css('float', 'right');
		$('#browser-right-sidebar').css('width', '530px');
		$('#browser-right-sidebar').css('height', '400px');
		$('#browser-toggle-items-vs-collections').css('right', '');
		$('#browser-toggle-items-vs-collections').css('left', '297px');
	}
	else{
		$('#browser-right-sidebar').css('position', 'absolute');
		$('#browser-right-sidebar').css('float', 'none');
		$('#browser-right-sidebar').css('width', '48px');
		$('#browser-right-sidebar').css('height', '100px');
		$('#browser-toggle-items-vs-collections').css('right', '82px');
		$('#browser-toggle-items-vs-collections').css('left', '');
	}
		
}
$(document).ready(function() {
	
	//Load MyCollections
	var myCollectionsModel = new MyCollections({ 'id' : 23 });
	var myCollectionsView = new MyCollectionsView({ model : myCollectionsModel });
		
	myCollectionsView.render();

	$('#browser-my-collections .browser-loading').remove();

	//Load Search items
	var search = new BrowserSearch();
	var searchView = new BrowserSearchItemsView({model: search});

	searchView.render();

	//Show more results link (TODO: only if search yields more than 100)
	$('#browser-show-more-results').show();

	//Hide loading spinner
	$('#browser-results .browser-loading').hide();

	//For filters - testing visual stuff
	$('.time, .space').click( toggleFilterDrawer);

});