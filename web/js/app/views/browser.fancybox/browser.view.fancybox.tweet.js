(function(Fancybox) {

	// This will fetch the tutorial template and render it.
	Fancybox.Views.Tweet = Fancybox.Views._Fancybox.extend({
		
		initialize: function()
		{
			Fancybox.Views._Fancybox.prototype.initialize.call(this); //This is like calling super()
		},
		
		/* Turns tweet text into proper links */
		linkifyTweet : function(tweet)
		{
			//linkify urls
			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	    	tweet = tweet.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 

	    	//linkify users
	    	 tweet = tweet.replace(/(^|)@(\w+)/gi, function (s) {
	        	return '<a target="_blank" href="http://twitter.com/' + s + '">' + s + '</a>';
	    	});

	    	//linkify tags
	    	tweet = tweet.replace(/(^|)#(\w+)/gi, function (s) {
	        	return '<a target="_blank" href="http://search.twitter.com/search?q=' + s.replace(/#/,'%23') + '">' + s + '</a>';
	     	});

	    	return tweet;
		},
		
		/* Pass in the element that the user clicked on from fancybox. */
		render: function(obj)
		{
			//Call parent class to do captioning and metadata
			Fancybox.Views._Fancybox.prototype.render.call(this, obj); //This is like calling super()
			var tweet = this.model.get('text');

			//Fill in tweet-specific stuff
			var blanks = {
				tweet : this.linkifyTweet(tweet),
			};

			//use template to clone the database items into
			var template = _.template( this.getMediaTemplate() );

			//copy the cloned item into the el
			var tweetHTML =  template( blanks ) ;

			$(this.el).find('.fancybox-media-item').html(tweetHTML);

			//set fancybox content
			obj.content = $(this.el);

			return this;
		},
		
		getMediaTemplate : function()
		{

			var html =	'<p class="fancybox-tweet"><%= tweet %></p>';

			return html;
		}
		
	});
	
})(zeegaBrowser.module("fancybox"));