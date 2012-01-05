//updates the view of the Time filter on the search page
var BrowserTimeBinsView = Backbone.View.extend({
	el: $('#browser-time-bins'),
	
	initialize : function() {},
	
	render: function()
	{
		for (var i =0;i<this.collection.length;i++){
			var bin = this.collection.at(i);
			
			$('.browser-time-bins-range:eq(' + i + ')').text(bin.get("formatted_start_date") +" - " + bin.get("formatted_end_date"));
			$('.browser-time-bins-results:eq(' + i + ') a').text(bin.get("items_count"));

			//unbind previous click events
			$('.browser-time-bins-results:eq(' + i + ') a').unbind('click');

			//attach new click events
			$('.browser-time-bins-results:eq(' + i + ') a').click( function(myBin){
				
				
				return function() {
					$('select#valueAA :selected').removeAttr("selected");
					$('select#valueBB :selected').removeAttr("selected");
					
					
					$("select#valueAA option[value='" + myBin.get('formatted_start_date') +"']").attr("selected", "true");
					
					$("select#valueBB option[value='" + myBin.get('formatted_end_date') +"']").attr("selected", "true");

					
					$("select#valueAA").trigger('change');
					$("select#valueBB").trigger('change');
					
					ZeegaBrowser.doSearch();
					return false;
				}
			}(bin) );


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

