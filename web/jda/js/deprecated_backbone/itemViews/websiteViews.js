/*
 The backbone.js views for the item type : Website .
includes:

DiscoveryListWebsiteView
DiscoveryCompactListWebsiteView
DiscoveryThumbWebsiteView
DiscoveryMapWebsiteView
DiscoveryTimelineWebsiteView
HomeCarouselWebsiteView
HomePreviewPopupWebsiteView
ItemPageWebsiteView
LightboxWebsiteView
 */

var DiscoveryListWebsiteView = DiscoveryListItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	},
});

var DiscoveryCompactListWebsiteView = DiscoveryCompactListItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	},
});

var DiscoveryThumbWebsiteView = DiscoveryThumbItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var DiscoveryMapWebsiteView = DiscoveryMapItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var DiscoveryTimelineWebsiteView = DiscoveryTimelineItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var HomeCarouselWebsiteView = HomeCarouselItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var HomePreviewPopupWebsiteView = HomePreviewPopupItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var PageWebsiteView = PageItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var LightboxWebsiteView = LightboxItemView.extend({
	render : function() {
		uri = this.model.get("uri");
		webPreview = $("<iframe></iframe>").addClass("lightbox-website-preveiw");
		webPreview.attr("src", uri);
		webPreview.width("100%");
		webPreview.height("100%");
		
		this.res.find(".lightbox-preview").html(webPreview);
		$(this.el).html(this.res);
		return this;
	}
});
