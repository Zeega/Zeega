

var DiscoveryTagInterfaceTagView = Backbone.View.extend({

	events : {},

	initialize : function() {
		this.angle = this.options.angle;
		this.rad = this.options.offsetRadius;
		this.centerX = this.options.centerX;
		this.centerY = this.options.centerY;
		this.svg = this.options.svg;
		this.tagText = this.model.get("tag_name");
		size = parseFloat(this.model.get("tag_similarity")) * 30 + 15;
		if (this.angle < 180) {
			var transformString = "rotate(" + (this.angle - 90) + ", " + this.centerX + ", " + this.centerY + ")";
			this.el = this.svg.text(this.centerX + this.rad + 20, this.centerY, this.tagText, {
				transform : transformString,
				fontSize : size,
				cursor : "pointer"
			});
		} else {
			var transformString = "rotate(" + (this.angle + 90) + ", " + this.centerX + ", " + this.centerY + ")";
			this.el = this.svg.text(this.centerX - this.rad - 20, this.centerY, this.tagText, {
				transform : transformString,
				'text-anchor' : "end",
				fontSize : size,
				cursor : "pointer"
			});
		}
		this.render();
	},

	render : function() {
		return this;
	}

});

var DiscoveryTagsView = Backbone.View.extend({
	className : 'tags-interface',
	events : {},

	initialize : function() {
		thisTagView = this;
		this.centerTagId = this.options.centerTagId;

		//Remove existing tag filters
		for ( var i = 0; i < filters.length; i++) {
			if (filters.at(i).get("type") == "tag") {
				filters.remove(filters.at(i));
				break;
			}
		}
		
		filters.add(new Filter({
			type : "tag",
			tags : [ this.centerTagId  ]
		}));

		search(filters, function(searchResults){
			updateFilters(searchResults.at(0));

			url = apiUrl + "tags/" + thisTagView.centerTagId + "/similar";
			$.getJSON(url, function(data) {
				thisTagView.relatedTags = new TagCollection(data["tags"]);
				thisTagView.tag = new Tag(data["tags_similar_to"]);
				thisTagView.listView = new DiscoveryCompactListView({
					collection : new ItemCollection(searchResults.at(0).	get("items")),
				});
				thisTagView.render();
			});
		});
	},

	render : function() {
		this.drawTagWheel();

		$(this.el).css({
			"opacity" : "0"
		});
		$(this.el).append(this.listView.el);
		$(this.el).append(this.container);
		$(".tags-interface").animate({
			opacity : 1
		}, 2000);
		return this;
	},

	drawTagWheel : function() {
		tagViewThat = this;

		w = $('#discovery-interface-content').width();
		rad = 80;
		h = $(this.listView.el).height();
		this.container = $("<div></div>");
		this.container.attr("id", "discovery-tags-container");
		this.container.width(w - 450);
		this.container.height(h);
		this.container.svg({
			onLoad : function(svg) {
				xCenter = w / 2 - 200;
				yCenter = h / 2;
				svg.circle(xCenter, yCenter, rad, {
					fill : '#DEF'
				});
				var angleCounter = 1;
				numberDisplayTags = Math.min(tagViewThat.relatedTags.length, 20);

				centerText = svg.text(xCenter, yCenter, tagViewThat.tag.get("tag_name"), {
					// TODO this text needs to be centered somehow
					"font-size" : 24,
					'text-anchor' : "middle"
				});
				for ( var i = 0; i < numberDisplayTags; i++) {
					tag = tagViewThat.relatedTags.at(i);
					tagView = new DiscoveryTagInterfaceTagView({
						model : tag,
						angle : 360 * (angleCounter++) / numberDisplayTags,
						offsetRadius : 80,
						centerX : xCenter,
						centerY : yCenter,
						svg : svg
					});
					$(tagView.el).attr("id", "tagId" + tag.get("tag_id"));
					$(tagView.el).addClass('discovery-tag-interface-tag');

					$(tagView.el).click(function(event) {
						thatTag = this;
						$(".tags-interface").animate({
							opacity : 0
						}, 1000, function() {

							tagViewThat.centerTagId = $(thatTag).attr("id").slice(5);
							console.log("clicked tag id : " + tagViewThat.centerTagId);

							// Change the current tag filter to the one just
							// clicked
							for ( var j = 0; j < filters.length; j++) {
								filter = filters.at(j);
								if (filter.get("type") == "tag") {
									filters.at(j).set({
										"tags" : [ tagViewThat.centerTagId ]
									});
									break;
								}
							}

							// Search based on current filters
							search(filters, function(searchResult) {
								$(tagViewThat.el).empty();
								console.log(searchResult.at(0));
								tagViewThat.listView = new DiscoveryCompactListView({
									collection : new ItemCollection(searchResult.at(0).get("items"))
								});

								$(tagViewThat.el).append(tagViewThat.listView.el);

								url = apiUrl + "tags/" + tagViewThat.centerTagId + "/similar";
								$.getJSON(url, function(data) {
									tagViewThat.relatedTags = new TagCollection(data["tags"]);
									tagViewThat.tag = new Tag(data["tags_similar_to"]);
									tagViewThat.drawTagWheel();

									$(tagViewThat.el).append(tagViewThat.container);

									$(".tags-interface").animate({
										opacity : 1
									}, 1000);

									updateFilters(searchResult.at(0));
								});
							});

						});
					});

				}
			}
		});
	}
});

var DiscoveryListView = Backbone.View.extend({
	tagName : 'ul',
	className : 'discovery-list',

	initialize : function() {
		// TODO Fix this
		// this.model.bind('resize', this.render, this);
		var that = this;
		this._listItemViews = [];
		this.collection.each(function(item) {
			// TODO this is a temp fix
			// We will only make views for item types that are developed.

			that._listItemViews.push(viewLookup(item, "DiscoveryListItemView"));
		});
		this.render();
	},

	render : function() {
		var thisListView = this;
		$(this.el).empty();

		// TODO this needs to change whenever the size of
		// the window changes.

		var windowHeight = $(window).height();
		var interfaceWidth = $("discovery-interface-content").width();
		interfaceContentHeight = windowHeight - 120;
		$(this.el).height(interfaceContentHeight);
		$(this.el).width(interfaceWidth);
		_(this._listItemViews).each(function(itemView) {
			$(thisListView.el).append(itemView.el);
		});
		
		//TODO implement pagination
		//This is for display purposes only.
		if (this._listItemViews.length > 90){
			$(thisListView.el).append($("<p class='discovery-more-items-link'> <a href='#'>more items > </a></p>"));
		}
		return (this);
	}
});

var DiscoveryCompactListView = Backbone.View.extend({
	tagName : 'ul',
	className : 'discovery-compact-list',

	initialize : function() {
		// TODO Fix this
		// this.model.bind('resize', this.render, this);
		var thisListView = this;
		this._listItemViews = [];
		this.collection.each(function(item) {
			thisListView._listItemViews.push(viewLookup(item, "DiscoveryCompactListItemView"));
		});
		this.render();
	},

	render : function() {
		var that = this;
		$(this.el).empty();

		// TODO this needs to change whenever the size of
		// the window changes.

		var windowHeight = $(window).height();
		interfaceContentHeight = windowHeight - 115;
		$(this.el).width(380);
		$(this.el).height(interfaceContentHeight);
		_(this._listItemViews).each(function(itemView) {
			$(that.el).append(itemView.el);
		});

		return (this);
	}
});

var DiscoveryFilterView = Backbone.View.extend({
	className : "discovery-filter",
	events : {
		"click .kill-button" : "kill"
	},

	initialize : function() {
		that = this;
		$(this.el).empty();
		$(this.el).append($("<img class='discovery-filter-kill-button' src = 'images/filter-kill.png'>"));
		switch (this.model.get("type")) {
		case "text":
			filterText = "Text: " + this.model.get("string");
			$(this.el).append($("<div><p class='discovery-filter-text'>" + filterText + "</p></div>"));
			break;
		case "tag":
			$(this.el).attr({"id": "tag-filter-view"});
			// TODO this shouldn't be a separate api call
			url = apiUrl + "tags/" + this.model.get("tags")[0];
			$.getJSON(url, function(data) {
				tagName = data["tags"][0]["tag_name"];
				filterText = "Tag: " + tagName;
				$("#tag-filter-view").append($("<div><p class='discovery-filter-text'>" + filterText + "</p></div>"));
			});
			break;
		case "event":
			// TODO this is fake
			filterText = "Near: <br>38.15'N, 140.53'E";
			filterText += "<br>After: <br>Mar. 11, 2011";
			$(that.el).append($("<div><p class='discovery-filter-text'>" + filterText + "</p></div>"));
			break;
		}
		this.render();
	},

	render : function() {

	},

	kill : function() {

	}

});
