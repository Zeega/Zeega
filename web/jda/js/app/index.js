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

	JDA.router = new Router();
	Backbone.history.start();

});
