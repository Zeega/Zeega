/*
 The backbone.js views for the item type : Tweet .
includes:

DiscoveryListTweetView
DiscoveryCompactListTweetView
DiscoveryThumbTweetView
DiscoveryMapTweetView
DiscoveryTimelineTweetView
HomeCarouselTweetView
HomePreviewPopupTweetView
ItemPageTweetView
LightboxTweetView
 */

var DiscoveryListTweetView = DiscoveryListItemView.extend({
	render : function() {
		thumb = this.res.find(".list-thumb");
		thumb.removeClass("img-144").addClass("img-48");

		this.res.find(".discovery-list-title").remove();
		var date = new Date(this.model.get("media_date_created").date);
		this.res.find('p').remove();
		this.res.find('p').remove();

		this.res.find('.black-15').removeClass('black-15').addClass('black-13');
		this.res.find('.discovery-list-thumb-container').append(
				'<div style="float:right; margin-right:5px; font-size:15px; width:115px;">' + dateFormat(date, "mm/dd/yy") + '<br>'
						+ dateFormat(date, "h:MMtt") + '<br><a style="font-size:11px;" target="blank" href="http://twitter.com/'
						+ this.model.get('media_creator_username') + '">@' + this.model.get('media_creator_username') + '</a></div>');
		tweetText = $("<p class='black-13'>" + this.model.get("text") + "</p>");
		this.res.find(".discovery-list-info-area").append(tweetText);

		$(this.el).html(this.res);
		return this;

	},

});

var DiscoveryCompactListTweetView = DiscoveryCompactListItemView.extend({
	render : function() {
		this.res.find(".discovery-list-title").remove();
		this.res.find(".img-72").removeClass("img-72").addClass("img-48");
		var date = new Date(this.model.get("media_date_created").date);
		this.res.find('p').remove();
		this.res.find('p').remove();
		this.res.find(".discovery-list-info-area").append(
				'<div style="float:left; color:black; font-size:11px;"><a target="blank" href="http://twitter.com/'
						+ this.model.get('media_creator_username') + '">@' + this.model.get('media_creator_username') + ' </a> '
						+ dateFormat(date, "mm/dd/yy h:MMtt") + '<br>' + this.model.get("text").substr(0, 40) + '...</div>');


		this.res.find('.lightbox-preview').html(this.model.get("text"));
		$(this.el).html(this.res);
		return this;

	},

});

var DiscoveryThumbTweetView = DiscoveryThumbItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var DiscoveryMapTweetView = DiscoveryMapItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var DiscoveryTimelineTweetView = DiscoveryTimelineItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var HomeCarouselTweetView = HomeCarouselItemView.extend({
	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var HomePreviewPopupTweetView = HomePreviewPopupItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;

	}
});

var PageTweetView = PageItemView.extend({

	render : function() {
		$(this.el).html(this.res);
		return this;
	}
});

var LightboxTweetView = LightboxItemView.extend({
	render : function() {
		lightboxPreview = $("<p class='lightbox-text-preview'></p>");
		lightboxPreview.html(this.model.get("text"));
		this.res.find(".lightbox-preview").html(lightboxPreview);
		$(this.el).html(this.res);
		return this;
	}
});
