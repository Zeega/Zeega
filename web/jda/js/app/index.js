// Treat the jQuery ready function as the entry point to the application.
// Inside this function, kick-off all initialization, everything up to this
// point should be definitions.
jQuery(function($)
{
	// Shorthand the application namespace
	var JDA = jda.app;
	JDA.init();
	//jda.app.init();
	


	// Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		
		routes: {
			""				: 'search',
			"text/:query"	: "search"
		},

		search : function( query )
		{
			var obj = { 'query' : query};
			JDA.search(obj);
			if( $('#search-bar input').val() != query ) $('#search-bar input').val(query);
		}
		
	});
	// Define your master router on the application namespace and trigger all
	// navigation from this instance.
	JDA.router = new Router();
	Backbone.history.start();
/*


	// Trigger the initial route and enable HTML5 History API support

	// All navigation that is relative should be passed through the navigate
	// method, to be processed by the router.  If the link has a data-bypass
	// attribute, bypass the delegation completely.
	$(document).on("click", "a:not([data-bypass])", function(evt) {
		// Get the anchor href and protcol
		var href = $(this).attr("href");
		var protocol = this.protocol + "//";

		// Ensure the protocol is not part of URL, meaning its relative.
		if (href && href.slice(0, protocol.length) !== protocol) 
		{
			// Stop the default event to ensure the link will not cause a page
			// refresh.
			evt.preventDefault();

		// This uses the default router defined above, and not any routers
		// that may be placed in modules.  To have this work globally (at the
		// cost of losing all route events) you can change the following line
		// to: Backbone.history.navigate(href, true);
		app.router.navigate(href, true);
		}
	});
*/	
	
	
});
