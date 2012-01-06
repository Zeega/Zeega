//updates the view of the Time filter on the search page
var BrowserTimeBinsView = Backbone.View.extend({
	el: $('#browser-time-filter'),
	
	defaults: {
            startYear: '1900',
            endYear: new Date().getFullYear(),
            
    },
	initialize : function() {
		
		//this is setting the default values which typically don't work for Backbone views
		this.options = _.extend(this.defaults, this.options);

		//Get HTML from hidden template
		var html = $("#browser-time-filter-template").html();
		$(this.el).html(html);

		//remove template from doc once it has been created 
		//to avoid conflicting ids
		$("#browser-time-filter-template").remove();
		
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
		$('select#valueAA').val(this.options.startYear);
		$('select#valueBB').val(this.options.endYear);
		

		//call the filament slider plugin to make a slider from the 
		//select boxes
		$('select#valueAA, select#valueBB').selectToUISlider({
			labels: 7
		})

		//bind slide change event so that triggers search
		$('.ui-slider').bind('slidechange',function(){
			ZeegaBrowser.doSearch();
		});

		//hide select boxes cuz they're redundant
		$('select#valueAA, select#valueBB').hide();

	},
	
	render: function()
	{
		$('#browser-time-filter-value').text(ZeegaBrowser.search.getFormattedStartDate() + " - " + ZeegaBrowser.search.getFormattedEndDate());
		
		//unbind previous click events from any of the results cells
		$('.browser-time-bins-results').unbind();

		for (var i =0;i<this.collection.length;i++){
			var bin = this.collection.at(i);
			var items_count = bin.get("items_count");

			$('.browser-time-bins-range:eq(' + i + ')').text(bin.get("formatted_start_date") +" - " + bin.get("formatted_end_date"));
			$('.browser-time-bins-results:eq(' + i + ')').text(items_count + (items_count > 0 ? " items" :  ""));

			

			//Do some custom styling for bins which have results vs. bins that do not
			if (items_count > 0) {
				$('.browser-time-bins-results:eq(' + i + ')').css("color", "#EB8F00");
				$('.browser-time-bins-results:eq(' + i + ')').hover(
					
						function () {
						    $(this).css("background", "#999");
						    $(this).css("cursor", "pointer");
						  }, 
						  function () {
						    $(this).css("background", "transparent");
						    $(this).css("cursor", "default");
						  }
					);

				//attach new click events
				//Note the rather weird gymnastics to create a local scope for the bin
				//variable so that it gets passed correctly to the event handler
				//This is evidently called closure and it's a real pita
				$('.browser-time-bins-results:eq(' + i + ')').click( function(myBin){
					
					
					return function() {
						$('select#valueAA :selected').removeAttr("selected");
						$('select#valueBB :selected').removeAttr("selected");
						
						
						$("select#valueAA").val(myBin.get('formatted_start_date')); 
						$("select#valueBB").val(myBin.get('formatted_end_date')); 
						
				
						
						$("select#valueAA").trigger('change');
						$("select#valueBB").trigger('change');
						
						ZeegaBrowser.doSearch();
						return false;
					}
				}(bin) );
			} else {
					$('.browser-time-bins-results:eq(' + i + ')').css("color", "#888");
					$('.browser-time-bins-results:eq(' + i + ')').hover(
					
						function () {
						    $(this).css("background", "transparent");
						    $(this).css("cursor", "default");
						  }, 
						  function () {
						    
						  }
					);	

			}


		}

		/*for (var i=0;i<this.collection.length;i++){
			var bin = this.collection.at(i);
			$('.browser-time-bins-range:eq(' + i + ')').text(bin.get("formatted_start_date") +" - " + bin.get("formatted_end_date"));
			$('.browser-time-bins-results:eq(' + i + ') a').text(bin.get("items_count"));

			//unbind previous click events
			$('.browser-time-bins-results:eq(' + i + ') a').unbind('click');

			//attach new click events
			$('.browser-time-bins-results:eq(' + i + ') a').click( function(e){
				
				$('select#valueAA :selected').removeAttr("selected");
				$('select#valueBB :selected').removeAttr("selected");
				
				
				$("select#valueAA option[value='" + bin.get('formatted_start_date') +"']").attr("selected", "true");
				
				$("select#valueBB option[value='" + bin.get('formatted_end_date') +"']").attr("selected", "true");

				
				$("select#valueAA").trigger('change');
				$("select#valueBB").trigger('change');
				
				ZeegaBrowser.doSearch();
				return false;
			});
		}*/
		
		
		//draw the search items
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});

