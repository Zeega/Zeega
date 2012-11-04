jQuery(function($)
{
		VisualSearch = VS.init({
		container : $('#zeega-visual-search-container'),
		query     : '',
		callbacks : {

			loaded	: function(){},

			search : function(){
				zeega.discovery.app.parseSearchUI();
			},

			clearSearch : zeega.discovery.app.clearSearchFilters,
			// These are the facets that will be autocompleted in an empty input.
			facetMatches : function(callback)
			{
				callback([
					'tag', 'keyword', 'text'  //, 'data:time & place','collection','user'
				]);
			},
			// These are the values that match specific categories, autocompleted
			// in a category's input field.  searchTerm can be used to filter the
			// list on the server-side, prior to providing a list to the widget.
			valueMatches : function(facet, searchTerm, callback)
			{
				switch (facet)
				{

					case 'tag':
						callback([]);
						break;
					case 'keyword':
						callback([]);
						break;
					case 'text':
						callback([]);
						break;

				}
			}
		} //callbacks
	});
	
	
	var ZeegaDiscovery = zeega.discovery.app;
	ZeegaDiscovery.init();
	
	
 $("#jda-search-button-group,#search-bar").fadeTo('fast',1);

  //View buttons toggle
  $("#zeega-view-buttons button").tooltip({'placement':'bottom', delay: { show: 600, hide: 100 }});
  
  $('#zeega-view-buttons a').click(function(){ zeega.discovery.app.switchViewTo( $(this).data('goto-view') , false); return false; });

  $('#zeega-search-help').popover({'title':l.jda_searching,'placement':'bottom'});

  $('#zeega-content-type').change(function(){
    $('#select-wrap-text').text( $('#zeega-content-type option[value=\''+$('#zeega-content-type').val()+'\']').text() );
    zeega.discovery.app.parseSearchUI();
    return false;
  });

  $(window).resize(function() {
    if (zeega.discovery.app.currentView == "event"){
      zeega.discovery.app.eventMap.resetMapSize();
    }
  });

  $('#jda-go-button').click(function(){
		var e = jQuery.Event("keydown");
		e.which = 13;

		//For whatever reason there are two ways of telling VS to search
		//based on whether the facet has been created yet or not
		if ( $(".search_facet_input_container input").length ){
			$(".search_facet_input_container input").trigger(e);
		} else{
			VisualSearch.searchBox.searchEvent(e);
		}
		return false;
	});

  
  $('#zeega-results-wrapper').bind('scroll', function()
	{
		if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
		{
			if(zeega.discovery.app.resultsView.collection.query.page*100<zeega.discovery.app.resultsView.collection.count){
				zeega.discovery.app.searchObject.page=zeega.discovery.app.resultsView.collection.query.page+1;
				zeega.discovery.app.search(zeega.discovery.app.searchObject,false);
			}
		}
	});
});
