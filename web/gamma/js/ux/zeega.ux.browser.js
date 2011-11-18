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

	$('#browser-show-more-results').show();

	$('#browser-results .browser-loading').hide();

});