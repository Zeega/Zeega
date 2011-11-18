var Search =  Backbone.Model.extend({
	url : function(){return Zeega.url_prefix + "search/"},
	
	//defaults :{ 'attr' : {} },
	
	
	initialize: function(){
		this.set('query') ='';
	},

	//updates query and fetches results from DB
	updateQuery: function(){
		//do something
		this.fetch({

			success : function()
			{
				//did something
			}
		});
	}

});

