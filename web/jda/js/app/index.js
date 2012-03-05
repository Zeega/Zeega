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
			":query"		: "search",
			
		},

		search : function( query )
		{
			
			var obj = '{page:1}';
			if (!_.isUndefined(query)){
				obj = QueryStringToHash(query);
			}

			JDA.search(obj, true);

			
		}

		
	});
	var QueryStringToHash = function QueryStringToHash  (query) {
	  var query_string = {};
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
	    var pair = vars[i].split("=");
	    pair[0] = decodeURIComponent(pair[0]);
	    pair[1] = decodeURIComponent(pair[1]);
	        // If first entry with this name
	    if (typeof query_string[pair[0]] === "undefined") {
	      query_string[pair[0]] = pair[1];
	        // If second entry with this name
	    } else if (typeof query_string[pair[0]] === "string") {
	      var arr = [ query_string[pair[0]], pair[1] ];
	      query_string[pair[0]] = arr;
	        // If third or later entry with this name
	    } else {
	      query_string[pair[0]].push(pair[1]);
	    }
	  } 
	  return query_string;
	};

	JDA.router = new Router();
	Backbone.history.start();

});
