//updates the view of the Time filter on the search page
var BrowserTimeBinsView = Backbone.View.extend({
	el: $('#browser-time-filter'),
	
	defaults: {
            startYear: '1900',
            endYear: new Date().getFullYear(),
            doReset: true
            
    },
   
	initialize : function() {
		
		//this is setting the default values which typically don't work for Backbone views
		if (this.options.startYear == null || this.options.endYear == null){
			this.options = _.extend(this.defaults, this.options);
		}

		/*if (this.options.startYearUTC != null){
			this.options.startYear = (new Date(this.options.startYearUTC * 1000)).getFullYear();

		}
		if (this.options.endYearUTC != null){
			this.options.endYear = (new Date(this.options.endYearUTC * 1000)).getFullYear();

		}*/

		//Get HTML from hidden template
		var html = $("#browser-time-filter-template").html();
		$(this.el).html(html);
		
		$(this.el).find('#valueAA-template').attr("id", "valueAA");
		$(this.el).find('#valueBB-template').attr("id", "valueBB");

		//remove template from doc once it has been created 
		//to avoid conflicting ids
		//$("#browser-time-filter-template").remove();
		
		//Add year options to the selects
		var select1 = $(this.el).find('#valueAA');
		var select2 = $(this.el).find('#valueBB');

		for (var year=this.options.startYear; year<= this.options.endYear; year++){
			$(select1)
		          .append($('<option>', { year : year })
		          .text(year)); 
		    $(select2)
		          .append($('<option>', { year : year })
		          .text(year)); 
		}

		//select the right year for each box
		select1.val(this.options.startYear);
		select2.val(this.options.endYear);
		

		//call the filament slider plugin to make a slider from the 
		//select boxes 
		$('select#valueAA, select#valueBB').selectToUISlider({
			labels: 7
		})

		//bind slide change event so that triggers search
		$('.ui-slider').bind('slidechange',function(){
			ZeegaBrowser.timeBinsView.options.doReset = false;

			//Remove previously selected bins
			$('.browser-time-bins-results').removeClass("selected");
			$('.browser-time-bins-results').css("background-color", "#666");

			//clear out any previously selected bin when user moves slider
			ZeegaBrowser.timeBinsView.collection.selectedStartDate = null;
			ZeegaBrowser.timeBinsView.collection.selectedEndDate = null;
			
			ZeegaBrowser.resetPageCount();
			ZeegaBrowser.doSearch();
		});

		//hide select boxes cuz they're redundant
		$(this.el).find('select').hide();

	},
	
	render: function()
	{
		if (this.collection.min_date != null && this.collection.max_date != null && this.options.doReset == true){
			var newStartYear = (new Date(this.collection.min_date * 1000)).getFullYear();
			var newEndYear = (new Date(this.collection.max_date * 1000)).getFullYear();
			//if (this.options.startYear != newStartYear || this.options.endYear != newEndYear){
				this.resetRange(newStartYear, newEndYear);
			//}
		}
		//Update Timeline filter UI text
		$('.browser-time-filter-value').html($('a#handle_valueAA').attr('aria-valuetext') + " &ndash; " + $('a#handle_valueBB').attr('aria-valuetext'));


		for (var i =0;i<this.collection.length;i++){
			var bin = this.collection.at(i);
			var items_count = bin.get("items_count");

			$('.browser-time-bins-range:eq(' + i + ')').html(bin.get("formatted_start_date") +" &ndash; <br/>" + bin.get("formatted_end_date"));
			$('.browser-time-bins-results:eq(' + i + ')').text(items_count + (items_count > 0 ? " results" :  ""));

			
			//unbind previous click events from any of the results cells
			$('.browser-time-bins-results:eq(' + i + ')').unbind();

			//Do some custom styling for bins which have results vs. bins that do not
			if (items_count > 0) {
				$('.browser-time-bins-results:eq(' + i + ')').css("color", "#EB8F00");
				$('.browser-time-bins-results:eq(' + i + ')').hover(
					
						function () {
						    $(this).css("background-color", "#999");
						    $(this).css("cursor", "pointer");
						  }, 
						  function () {
						    $(this).css("background-color", "");
						    $(this).css("cursor", "default");
						  }
					);

				//attach new click events
				//Note the rather weird gymnastics to create a local scope for the bin
				//variable so that it gets passed correctly to the event handler
				//This is evidently called closure and it's a real pita
				$('.browser-time-bins-results:eq(' + i + ')').click( function(myBin){
					
					
					return function() {
						/*

						This is code for updating the timeline slider to the value selected in a bin
						Not using this at moment

							$('select#valueAA :selected').removeAttr("selected");
							$('select#valueBB :selected').removeAttr("selected");
							
							
							$("select#valueAA").val(myBin.get('formatted_start_date')); 
							$("select#valueBB").val(myBin.get('formatted_end_date')); 
							
					
							
							$("select#valueAA").trigger('change');
							$("select#valueBB").trigger('change');
						*/
						//Remove previously selected bins
						$('.browser-time-bins-results').removeClass("selected");

						//Add selected
						$(this).addClass("selected");

						//Set start & end dates on the collection so search knows what
						//is the date range
						ZeegaBrowser.timeBinsView.collection.selectedStartDate = myBin.get('start_date');
						ZeegaBrowser.timeBinsView.collection.selectedEndDate = myBin.get('end_date');

						//User has selected bin - tell Timeline NOT to reset range
						ZeegaBrowser.timeBinsView.options.doReset = false;
						
						//reset any paging
						ZeegaBrowser.resetPageCount();

						ZeegaBrowser.doSearch();

						//now clear out any previously selected bin 
						ZeegaBrowser.timeBinsView.collection.selectedStartDate = null;
						ZeegaBrowser.timeBinsView.collection.selectedEndDate = null;
						
						return false;
					}
				}(bin) );
			} else {
					$('.browser-time-bins-results:eq(' + i + ')').css("color", "#888");
					$('.browser-time-bins-results:eq(' + i + ')').hover(
					
						function () {
						    $(this).css("background-color", "#666");
						    $(this).css("cursor", "default");
						  }, 
						  function () {
						    
						  }
					);	

			}


		}
		this.options.doReset = true;
		$(this.el).show();
		
		
		//draw the search items
		return this;
	},
	
	resetRange : function(start, end){
    	this.options.startYear = start;
    	this.options.endYear = end; 
    	$('#browser-time-filter').empty();
    	this.initialize();
    	
    },
});

