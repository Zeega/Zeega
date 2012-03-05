(function(Tags) {
		type: 'tag',
		Tags.Model =  Backbone.Model.extend({

		url : function(){ 
			var url = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
							+ this.get("item_id") + "/tags/"+this.get("tag_name");
			console.log("Final url for getting tags is: " + url);
			return url;
		},

		
		defaults :{},
		
		initialize: function(){},
		
		methodUrl: function(method){
			if (method == 'create'){
				return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
							+ this.get("item_id") + "/tags/"+this.get("tag_name");
			}
			else if (method == 'destroy'){
					return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
							+ this.get("item_id") + "/tags/"+this.get("tag_name");
			}
			else if (method == 'get'){
				return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
							+ this.get("item_id") + "/tags";
			}
			else{
				return false;
			}
	    	
	  	},

	  	sync: function(method, model, options) {
		    if (model.methodUrl(method)) {
		      options = options || {};
		      options.url = model.methodUrl(method.toLowerCase());
		      console.log("Final URL for updating tag is " + options.url);

		    }
		    Backbone.sync(method, model, options);
	  	}

	});

	Tags.Collection = Backbone.Collection.extend({
		model : Tags.Model,
		url : function(){ 
			return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
							+ this.item_id + "/tags";
		},
		emptyTags : function(){
			this.reset({silent:true});
		},
		initialize: function(){},
		parse : function(response)
		{
			this.item_id = response.tags_for_item;
			return  response.tags;
		},
		
			
	});

})(jda.module("tags"));