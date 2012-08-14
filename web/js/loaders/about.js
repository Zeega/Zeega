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
		});
		
	}
);
