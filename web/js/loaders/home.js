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
	

	//core
	//'order!app/zeega.dashboard',
	
	//mvc
	//'order!app/models/dashboard.model.user',
	//'order!app/views/dashboard.user/dashboard.view.user.profile',
	
	'order!ux/zeega.ux.header',
	'order!app/index.home'
    ], 
	function($) {
		console.log('files loaded')
		
	}
);
