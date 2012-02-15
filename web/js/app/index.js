jQuery(function($)
{
	// Shorthand the application namespace
	var Zeega = zeega.app;
	
	
	// Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		
		routes: {
			""						: 'goToFrame',
			"editor/frame/:frameId"	: "goToFrame"
		},

		goToFrame : function( frameId )
		{
			//Zeega.goToFrame( frameId )
		}
		
	});

	Zeega.router = new Router();
	Backbone.history.start();
	
	Zeega.init();
	
	
});
