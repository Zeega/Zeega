/*
 The backbone.js views for the item type : Audio .
includes:

DiscoveryListAudioView
DiscoveryCompactListAudioView
DiscoveryThumbAudioView
DiscoveryMapAudioView
DiscoveryTimelineAudioView
HomeCarouselAudioView
HomePreviewPopupAudioView
ItemPageAudioView
LightboxAudioView
 */

var DiscoveryListAudioView = DiscoveryListItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	},
});

var DiscoveryCompactListAudioView = DiscoveryCompactListItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	},
});
var DiscoveryThumbAudioView = DiscoveryThumbItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});
var DiscoveryMapAudioView = DiscoveryMapItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var DiscoveryTimelineAudioView = DiscoveryTimelineItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var HomeCarouselAudioView = HomeCarouselItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var HomePreviewPopupAudioView = HomePreviewPopupItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var PageAudioView = PageItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var LightboxAudioView = LightboxItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});
