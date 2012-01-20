/* This file contains the Backbone.js views for all of the item view types.

View Types (11):
DiscoveryListItem
DiscoveryCompactListItem
DiscoveryThumbItem
DiscoveryMapItem
DiscoveryTimelineItem
homeCarouselItem
homePreviewPopupItem
homeCarouselCollectionItem       
ItemPageItem
LightboxItem


The following item types are instances of  the "Item" model
Item Types (8):
Image
Video
Document
Archived Site
Tweet
Collection
Story
Correspondence

 */

var viewLookup = function(item, viewType) {
	// Takes item which is an Item and viewType which is a string
	// returns the Backbone View instance for that item type and view type.

	// console.log(item.get("type") + " " + viewType);

	var view = eval(viewType.replace("Item", item.get("type")));
	return new view({
		model : item
	});
};

var ItemView = Backbone.View.extend({});

// Load the templates from the html file
// This is done asynchronously to that the templates are ready for the views
$.ajaxSetup({
	async : false
});
var templateUrl=sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+"jda/templates/templates.html";

console.log(templateUrl);
scripts = $("<div>").load(templateUrl, {
	async : false
});
$.ajaxSetup({
	async : true
});

// Add the templates to the head of the HTML document.
$('head').append($(scripts).html());

//
//
// The item views
//
//

var DiscoveryListItemView = ItemView.extend({
	template : _.template($('#list-item-template').html()),
	tagName : 'li',
	className : 'discovery-list-item',

	events : {
		"click .discovery-list-thumb-container" : "triggerLightbox"
	},

	initialize : function() {
		this.res = $(this.template(this.model.toJSON()));
		this.draw();
	},

	draw : function() {
		// This is a wrapper for render
		var w = $("#discovery-interface-content").width();
		this.res.find(".discovery-list-info-area").width(w - 350);
		return this.render();
	},

	triggerLightbox : function() {
		lightbox = viewLookup(this.model, "LightboxItemView");
		this.res.find(".lightbox-hider").append(lightbox.el);
		fancyboxClicker = $("<a></a>").attr("href", "#lb" + this.model.get("id"));
		fancyboxClicker.fancybox().click();
	}
});

var DiscoveryCompactListItemView = ItemView.extend({
	template : _.template($('#compact-list-item-template').html()),
	tagName : 'li',
	className : 'list-item discovery-compact-list-item',

	events : {
		"click .discovery-compact-list-thumb-container" : "triggerLightbox"
	},

	initialize : function() {
		this.res = $(this.template(this.model.toJSON()));
		this.draw();
	},

	draw : function() {
		// This is a wrapper for render
		this.res.find(".discovery-list-info-area").width(250);
		this.render();
	},

	triggerLightbox : function() {
		lightbox = viewLookup(this.model, "LightboxItemView");

		this.res.find(".lightbox-hider").append(lightbox.el);

		fancyboxClicker = $("<a></a>").attr("href", "#lb" + this.model.get("id"));
		fancyboxClicker.fancybox().click();
	}
});

var DiscoveryThumbItemView = ItemView.extend({
	events : {},
	initialize : function() {

	},

	render : function() {

	}
});
var DiscoveryMapItemView = ItemView.extend({
	events : {},
	initialize : function() {

	},

	render : function() {

	}
});

var DiscoveryTimelineItemView = ItemView.extend({
	events : {},

	initialize : function() {

	},

	render : function() {

	}
});
var HomeCarouselItemView = ItemView.extend({
	tagName : 'li',
	className : 'carousel-thumb-item',

	events : {
		"mouseleave .home-carousel-thumb" : "hoverOff",
		"mouseenter .home-carousel-thumb" : "hoverOn"
	},

	initialize : function() {
		var idNum = this.model.get('id');

		var thumb = $("<img>");
		if (this.model.get('thumbnail_url')) {
			thumb.attr("src", this.model.get('thumbnail_url'));
		} else {
			thumb.attr("src", "/images/blank-72x72.jpg");
		}
		thumb.addClass('img-72');

		var thumbAnchor = $('<a></a>');
		thumbAnchor.attr({
			"href" : "#lb" + idNum
		});
		thumbAnchor.addClass('home-carousel-thumb');
		thumbAnchor.append(thumb);

		this.res = $('<div></div>');
		this.res.append(thumbAnchor);
		this.render();
	},

	hoverOn : function() {
		var infoPic = viewLookup(this.model, "HomePreviewPopupItemView");
		$("#home-info").fadeOut('slow', function() {
			$(this).html(infoPic.el).prepend('<a href="#" id="close-info-pic" style="color:red">X</a>');
			$('#close-info-pic').click(function() {
				$("#home-info").fadeOut('slow', function() {
					$(this).load('HTML/home.html #home-info').fadeIn('slow');
				});
			});
			$(this).fadeIn('slow');
		});

	},

	hoverOff : function() {
		// $("#home-info").fadeOut('slow',function(){$(this).load('HTML/home.html
		// #home-info p').fadeIn('slow')});
	}
});

var HomePreviewPopupItemView = ItemView.extend({
	className : "home-preview-popup-item",

	initialize : function() {
		this.res = $("<p class='black-18'>" + this.model.get("type") + "</p>");
		this.render();
	}
});

var PageItemView = ItemView.extend({

	template : _.template($('#page-item-template').html()),

	className : 'page-item',

	events : {
		"keypress #add-tag" : "addTagKeypress",
		"click .page-tag-text" : "visitTag",
		"click .page-back-to-results" : "backToResults"
	},

	initialize : function() {
		this.model.bind('change', this.draw, this);
		this.draw();
	},

	visitTag : function(event) {
		tagId = $(event.target).attr("id").slice(5);
		filters = new FilterCollection(new Array());
		enterDiscovery({}, new FilterCollection([ new Filter({
			type : "tag",
			id : tagId
		}) ]), "tags", {
			centerTag : tagId
		});
	},

	backToResults : function(event) {
		if (originInterface == "tags") {
			filters.each(function(filter) {
				if (filter.get("type") == "tag") {
					options = {
						centerTag : filter.get("tags")[0]
					};
				}
			});
		}
		enterDiscovery(globalSearchResults, filters, originInterface, options);
	},

	addTagKeypress : function(event) {
		if (event.keyCode == '13') {
			newTag = "12345:" + $("#add-tag").val();
			if (this.model.has("tags")) {
				if (this.model.get("tags")) {
					this.model.set({
						tags : this.model.get("tags") + "," + newTag
					});
				} else {
					this.model.set({
						tags : newTag
					});
				}
			} else {
				this.model.set({
					tags : newTag
				});
			}
		}
	},

	draw : function() {
		thisPageItemView = this;
		this.res = $(this.template(this.model.toJSON()));
		this.res.width($(".page-item").width() - 2);
		this.res.height($(".page-item").height() - 2);

		relatedItemsArea = $(this.res).find(".page-related-area");
		url = apiUrl + "items/" + this.model.get("id") + "/similar";
		// TODO Needs to deal with an empty set of related items
		$.getJSON(url, function(data) {
			relatedItems = new ItemCollection(data.items);
			thisPageItemView.listView = new DiscoveryCompactListView({
				collection : relatedItems
			});
			relatedItemsArea.html(thisPageItemView.listView.el);
		});

		tagsText = this.res.find('.page-tag-text');
		if (this.model.get("tags")) {
			tags = this.model.get("tags").split(",");
			_.each(tags, function(tag, i) {
				idName = tag.split(":");
				tagId = idName[0];
				tagName = idName[1];
				if (i > 0) {
					tagsText.append(", ");
				}
				tagLink = $("<span class='page-tag-link'>" + tagName + "</a>");
				tagLink.attr("id", "tagId" + tagId);
				tagsText.append(tagLink);
			});
		} else {
			tagsText.html("There are no tags for this item.  Please contribute to the archive by addding one below.");
		}
		return this.render();
	},

	addMap : function() {
		metadataScroll = $(this.res).find(".page-metadata-scroll");
		if (this.model.get("media_geo_longitude")) {
			miniMap = new MiniMapView({
				model : this.model
			});
			metadataScroll.append(miniMap.el);
		}
		;
		miniMap.addMap();
	}
});

var LightboxItemView = ItemView.extend({
	template : _.template($('#lightbox-item-template').html()),
	className : 'lighbox-item',

	events : {
		"click .lightbox-title" : "visitItemPage"

	},

	initialize : function() {
		_.bindAll(this, "render", "visitItemPage");
		this.res = $(this.template(this.model.toJSON()));
		this.draw();
		$(this.el).attr("id", "lb" + this.model.get("id"));
	},

	visitItemPage : function() {
		thisLightboxView = this;
		var url = apiUrl + "items/" + this.model.get("id");
		$.getJSON(url, function(data) {
			var itemPage = viewLookup(new Item($.extend(data.items, thisLightboxView.model.attributes)), "PageItemView");
			$.fancybox.close();
			$("#content").html(itemPage.el);
			itemPage.addMap();
		});
	},

	draw : function() {
		this.res.width($(window.document).width() - 100);
		this.res.height($(window.document).height() - 100);
		this.res.find(".lightbox-preview").height(this.res.height() - 100);
		this.res.find(".lightbox-preview").width(this.res.width());
		return this.render();
	}
});


