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
	'order!lib/spin',
	'order!lib/spin-jquery',	
	'order!lib/ajaxfileuploader/ajaxfileupload',

	//core
	'order!app/zeega.dashboard',
	
	//mvc
	'order!app/models/dashboard.model.user',
	'order!app/models/dashboard.model.project',
	'order!app/collections/dashboard.collections.project',
	'order!app/views/dashboard.user/dashboard.view.user.profile',
	'order!app/views/dashboard.project/dashboard.view.project',
	
	'order!ux/zeega.ux.header',
	'order!app/index.dashboard'
    ], 
	function($) {
		console.log('files loaded')
		
	}
);
