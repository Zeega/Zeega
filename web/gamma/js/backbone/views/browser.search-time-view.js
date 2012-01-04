//updates the view of the Time filter on the search page
var BrowserTimeBinsView = Backbone.View.extend({
	el: $('#browser-time-bins'),
	
	initialize : function() {},
	
	render: function()
	{

		for (var i=0;i<this.collection.length;i++){
			var bin = this.collection.at(i);
			$('.browser-time-bins-range').text(bin.get("start_date") +" - " + bin.get("end_date"));
		}
		
		
		//draw the search items
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});

