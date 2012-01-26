var TagView = Backbone.View.extend({
	tagName:'div',
	initialize: function(){
		
		

		
	},
	render: function(){
		$(this.el).attr("class", "tag-container");
		var blanks = {
			tagID : this.model.id,
			tagName : this.model.get('tag_name'),
			
		};
		
		//use template to clone the database items into
		var template = _.template( this.getTemplate() );
		
		//copy the cloned item into the el
		$(this.el).append( template( blanks ) );

		//Show Tag Delete X's on Hover
		$(this.el).find('.tag').hover(
			function(){
				$(this).prev().show();
				$(this).addClass('tag-hover-class');
			},
			function(){
				$(this).prev().hide();
				$(this).removeClass('tag-hover-class');
			}
		);
		$(this.el).find('.fancybox-remove-tag').hover(
			function(){
				$(this).show();
				$(this).next().addClass('tag-hover-class');
			},
			function(){
				$(this).hide();
				$(this).next().removeClass('tag-hover-class');
			}
		);
		$(this.el).find('.fancybox-remove-tag').click(function(){

			//TODO Create a view for the tags
			var tagID = $(this).attr("id");
			var tag = theModel.get("tags").get( tagID );
			var deleteURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
						+ theModel.id + "/tags/"+tag.id;
			
			//DESTROYYYYYYYY
			tag.destroy({	
			 				url : deleteURL,
							success: function(model, response) { 
								
								console.log("Deleted tag " + tag.id);		
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error deleting tag " + tag.id);		
			 					console.log(response);
			 				}
	 					});
		});
		return this;
		
	},
	getTemplate : function(){
		var html = '<a class="fancybox-remove-tag" id="<%=tagID%>" href=".">x</a><a class="tag" href="."><%=tagName%></a>'
		return html;
	}
});
var TagCollectionView = Backbone.View.extend({
	tagName:'div',
	_views : [],
	initialize : function() {
		
		
      	this.collection.bind('add',   this.addItem, this);
      	this.collection.bind('destroy',   this.removeItem, this);
		this.collection.bind('reset', this.resetViews, this);
      	for(var i=0;i<this.collection.length;i++){
      		var model = this.collection.at(i);
      		this.addItem(model);
      	}
	},
	removeItem: function(){
		
	},
	resetViews: function(){
		_.each(this._views, function(thisView){
			// item removes itself
        	thisView.remove(); 
        	
		});
		this._views = [];
	},
	addItem: function(m)
    {
    	
    	var tagView =  new TagView({ model: m });
        
        // add the item view to this collection of views
        this._views.push(tagView);

    },
    render: function()
    {
    	//use template to clone the database items into
		var template = _.template( this.getTemplate() );
		
		//copy the cloned item into the el
		$(this.el).append( template() );

    	//tag renders itself and then this viewcollection appends it to its parent el
		
		_.each(this._views, function(tagView){
			// tag draws itself
			var addThis = tagView.render(); 
        	$(this.el).prepend(addThis.el);
        	

        	
		}, this);

		var item = this.model;
		var theElement = this.el;
		var view = this;
		
		//ADD TAG
		$(this.el).find('.newtag').editable(
			function(value, settings)
			{ 
				//view.renderTags();
				/*item.save({ title:value }, 
						{
							success: function(model, response) { 
								console.log("Updated item title for item " + item.id);
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error updating item title.");
			 					console.log(response);
			 				}
			 			});*/
				return value; //must return the value
			},
			{
				indicator : 'Saving...',
				tooltip   : 'Click to add a tag.',
				indicator : '<img src="images/loading.gif">',
				select : true,
				onblur : 'submit',
				width : 200,
				cssclass : 'fancybox-form'
		});
		$(this.el).find('.addtags').click(function(e){
			$(theElement).find('.newtag').show();
			$(theElement).find('.newtag').trigger('click');
			
			e.preventDefault();
		});
    	return this;
    },
    getTemplate:function(){
    	var html = '<a href="." class="fancybox-remove-tag">x</a><a href="." class="newtag">'+ 'New tag 1, New tag 2</a></p>(<a href="." class="addtags fancybox-editable">add tag</a>)';
    	return html;
    }
});