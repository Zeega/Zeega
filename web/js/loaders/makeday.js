/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/
require.config({
	baseUrl : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/',
	paths : {
			'order' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/order',
			'text' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/text'
		}
})

require(
	[
	//libraries
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/bootstrap',
	'order!ux/zeega.ux.header',

    ], 
	function($) {
		jQuery(function($)
		{
			initHeaderUX();
				
			$('#makeday-submit').click(function(){
				
		
				
				var sub = new Backbone.Model({
				
					name:  $('#makeday-name').val(),
					idea:  $('#makeday-idea').val(),
					email: $('#makeday-email').val(),
				
				
				});
				
				sub.url = sessionStorage.getItem("hostname") + sessionStorage.getItem("directory") + "bugs/makeday.php";
				sub.save();
				$('.makeday-form').hide();
				$('.makeday-thanks').show();
				return false;
			});
	
	
		});
		
	}
);
