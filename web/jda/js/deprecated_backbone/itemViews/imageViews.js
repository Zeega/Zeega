/*
 The backbone.js views for the item type : image .
includes:

DiscoveryListImageView
DiscoveryCompactListImageView
DiscoveryThumbImageView
DiscoveryMapImageView
DiscoveryTimelineImageView
HomeCarouselImageView
HomePreviewPopupImageView
ItemPageImageView
LightboxImageView
 */

var DiscoveryListImageView = DiscoveryListItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;
	},

});

var DiscoveryCompactListImageView = DiscoveryCompactListItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	},

});

var DiscoveryThumbImageView = DiscoveryThumbItemView.extend({
	render : function() {

		$(this.el).html(this.res);
		return this;
	}
});

var DiscoveryMapImageView = DiscoveryMapItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var DiscoveryTimelineImageView = DiscoveryTimelineItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var HomeCarouselImageView = HomeCarouselItemView.extend({
	
	render : function() {
		$(this.el).html(this.res);
		return this;
	},

});

var HomePreviewPopupImageView = HomePreviewPopupItemView.extend({
	render : function() {
		previewImg = $("<img class='home-preview-popup-image'>");
		previewImg.attr("src", this.model.get("uri"));

		$(this.res).append(previewImg);
		$(this.res).append("<p class='black-15'>Descripton:</p>");
		$(this.res).append("<p class='black-12'>" + this.model.get("description") + "</p>");
		$(this.el).html(this.res);
		return this;
	}
});

var PageImageView = PageItemView.extend({
	render : function() {
		previewImg = $("<img>");
		previewImg.attr("src", this.model.get("uri"));
		previewImg.width("100%");

		previewArea = $(this.res).find(".page-preview-area");
		previewArea.width("33%");
		$(this.res).find(".page-preview").html(previewImg);

		$(this.el).html(this.res);
		return this;
	}
});

var LightboxImageView = LightboxItemView.extend({
//	events : _.extend({}, LightboxItemView.prototype.events, {
//		"click .lightbox-img-preview" : "visitItemPage"
//	}),
	render : function() {
		preview = this.res.find(".lightbox-preview");
		w = preview.width();
		h = preview.height();
		imgPreview = $("<img  class='lightbox-img-preview' src='" + this.model.get('uri') + "'>");
		imgPreview.css({
			"max-height" : h,
			"max-width" : w
		});
		preview.html(imgPreview);

		$(this.el).html(this.res);
		return this;
	}
});
