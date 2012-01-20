/*
 The backbone.js views for the item type : Document .
includes:

DiscoveryListDocumentView
DiscoveryCompactListDocumentView
DiscoveryThumbDocumentView
DiscoveryMapDocumentView
DiscoveryTimelineDocumentView
HomeCarouselDocumentView
HomePreviewPopupDocumentView
ItemPageDocumentView
LightboxDocumentView
 */

var DiscoveryListDocumentView = DiscoveryListItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;

	},

});

var DiscoveryCompactListDocumentView = DiscoveryCompactListItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;

	},

});
var DiscoveryThumbDocumentView = DiscoveryThumbItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});
var DiscoveryMapDocumentView = DiscoveryMapItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});


var DiscoveryTimelineDocumentView = DiscoveryTimelineItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});


var HomeCarouselDocumentView = HomeCarouselItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var HomePreviewPopupDocumentView = HomePreviewPopupItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var PageDocumentView = PageItemView.extend({
	render : function() {
		uri = 'http://www.documentcloud.org/documents/' + this.model.get("uri");
		docPreview = $("<iframe></iframe>");
		docPreview.attr("src", uri);
		docPreview.width("100%");
		docPreview.height("100%");

		previewArea = $(this.res).find(".page-preview-area");
		previewArea.width("50%");
		$(this.res).find(".page-preview").html(docPreview);

		$(this.el).html(this.res);
		return this;
	}
});

var LightboxDocumentView = LightboxItemView.extend({
	render : function() {
		uri = 'http://www.documentcloud.org/documents/' + this.model.get("uri");
		docPreview = $("<iframe></iframe>");
		docPreview.attr("src", uri);
		docPreview.width("100%");
		docPreview.height("100%");

		this.res.find(".lightbox-preview").html(docPreview);

		$(this.el).html(this.res);
		return this;
	}
});


