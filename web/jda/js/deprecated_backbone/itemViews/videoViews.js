/*
 The backbone.js views for the item type : Video .
includes:

DiscoveryListVideoView
DiscoveryCompactListVideoView
DiscoveryThumbVideoView
DiscoveryMapVideoView
DiscoveryTimelineVideoView
HomeCarouselVideoView
HomePreviewPopupVideoView
ItemPageVideoView
LightboxVideoView
 */

var DiscoveryListVideoView = DiscoveryListItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	},
});

var DiscoveryCompactListVideoView = DiscoveryCompactListItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	},
});

var DiscoveryThumbVideoView = DiscoveryThumbItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var DiscoveryMapVideoView = DiscoveryMapItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var DiscoveryTimelineVideoView = DiscoveryTimelineItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var HomeCarouselVideoView = HomeCarouselItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var HomePreviewPopupVideoView = HomePreviewPopupItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var PageVideoView = PageItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var LightboxVideoView = LightboxItemView.extend({
	
	render : function() {
		preview = this.res.find(".lightbox-preview");
		w = preview.width();
		h = preview.height();
		
		switch (this.model.get("source")){
		case "Youtube":
			video = $("<iframe class='youtube-player lightbox-video-preview' type='text/html' frameborder='0'></iframe>");
			video.attr("src", "http://www.youtube.com/embed/" + this.model.get("uri"));
			video.css({
				"height" : h,
				"width" : w
			});
			break;
		}
		
		preview.append(video);
		$(this.el).html(this.res);
		return this;
	}
});









