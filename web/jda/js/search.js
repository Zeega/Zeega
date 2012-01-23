var apiUrl = "http://dev.zeega.org/jda/web/api/";
var geoUrl = "http://dev.zeega.org/geoserver/";
var japanMapUrl = "http://worldmap.harvard.edu/geoserver/";

var filters = new FilterCollection(new Array());
var originInterface = "list";
var globalSearchResults;

function search(filters, callback) {
	window.location.hash='';
	//spinner
	$("#content-row").spin('small'); // Produces default Spinner using the text color of #el.	
	
	// TODO this will only deal with one text filter
	var url = apiUrl + "search";
	for ( var i = 0; i < filters.length; i++) {
		if (i == 0) {
			url += "?";
		} else {
			url += "&";
		}
		filter = filters.at(i);
		switch (filter.get("type")) {
		case "text":
			window.location.hash+='text='+encodeURIComponent(filter.get("string"))+'&';
			console.log('adding filter');
			url += "q=" + encodeURIComponent(filter.get("string"));
			break;
		case "tag":
			window.location.hash+='tag='+encodeURIComponent(filter.get("tags"))+'&';
			url += "tags=";
			tagTexts = filter.get("tags");
			for ( var j = 0; j < tagTexts.length; j++) {
				if (j > 0) {
					url += ',';
				}
				url += tagTexts[j];
			}
			break;
		}
	}
//	 console.log("searching: " + url);

	$.getJSON(url, function(data) {
		globalSearchResults = new ItemCollection(data);
		callback(new ItemCollection(data));
		$("#content-row").spin(false)
	});
}

function homeSearch(searchString) {
	if (searchString) {
		newFilter = new Filter({
			type : "text",
			string : searchString
		});
		filters = new FilterCollection(new Array());
		filters.add(newFilter);
	}
	searchItems = search(filters, function(searchResult) {
		enterDiscovery(searchResult.at(0), filters, "list", {});
	});
};

// go into discovery interface
function enterDiscovery(searchResults, filters, interface, options) {
	originInterface = interface;
	
		
	
		updateFilters(searchResults);
		var currentTab = "";

		switch (interface) {
		case "list":
			discoveryView = new DiscoveryListView({
				collection : new ItemCollection(searchResults.get("items"))
			});
			currentTab = $("#list-tab");
			break;
		case "tags":
			discoveryView = new DiscoveryTagsView({
				centerTagId : options["centerTag"]
			});
			currentTab = $("#tags-tab");
			break;
		default:
			alert("Invalid discovery view");
		}
		$('#discovery-interface-content').html(discoveryView.el);


		// Set the current tab to 'list'
		$(".discovery-tab").removeClass("discovery-active-tab");
		currentTab.addClass("discovery-active-tab");

		// set up bindings for tabs
		$('.discovery-tab').click(function() {
			var currentTab = $(this);
			$(".discovery-tab").removeClass("discovery-active-tab");
			currentTab.addClass("discovery-active-tab");
			if ($(this).attr('id') == "list-tab") {
				var listView = new DiscoveryListView({
					collection : new ItemCollection(searchResults.get("items"))
				});
				$('#discovery-interface-content').html(listView.el);
				originInterface = "list";

				updateFilters(searchResults);

			} else if ($(this).attr('id') == "thumb-tab") {
				console.log("thumb view coming soon");
			} else if ($(this).attr('id') == "event-tab") {
				var eventView = new DiscoveryEventView({
					collection : new ItemCollection(searchResults.get("items")),
					model : new Filter({
						type : "event",
						end : new Date(),
						start : new Date(2011, 3, 11, 0, 0, 0, 0)
					// TODO also there will be lat lon in here to filter the
					// timeline
					})
				});
				$('#discovery-interface-content').html(eventView.el);
				eventView.addMap();
				originInterface = "event";
				updateFilters(searchResults);


			} else if ($(this).attr('id') == "tags-tab") {
				// TODO make this work with the api
				bestTagId = 21785;
				
				var tagsView = new DiscoveryTagsView({
					collection : new ItemCollection(searchResults.get("items")),
					centerTagId : bestTagId
				});
				$('#discovery-interface-content').html(tagsView.el);
				originInterface = "tags";
			}
		});
	
};

function updateFilters(searchResult) {

	//Need to update hash

	$("#discovery-sidebar-filters").empty();

	count = $("<h3></h3>");
	count.html("Showing " +searchResult.get('items_count')+ " items");

	$("#discovery-sidebar-filters").append(count);

	for ( var i = 0; i < filters.length; i++) {
		filter = filters.at(i);
		if (filter.get("type") == "text") {
			$("#discovery-search-text-field").val(filter.get("string"));
		} else {
			filterView = new DiscoveryFilterView({
				model : filter
			});
			$("#discovery-sidebar-filters").append(filterView.el);
		}
	}
}



