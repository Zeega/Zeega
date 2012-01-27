var TagView = Backbone.View.extend({
	tagName:'div',
	initialize: function(){
		
		$(this.el).empty();
		$(this.el).attr("class", "tag-container");
		var blanks = {
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
		var view = this;
		$(this.el).find('.fancybox-remove-tag').click(function(e){

			//TODO Create a view for the tags
			
			var tag = view.model;
			var tagID = tag.id;
			var itemID = view.model.get("item_id");
			
			
			//DESTROYYYYYYYY
			tag.destroy({	
			 				
							success: function(model, response) { 
								
								console.log("Deleted tag " + tagID + " from item " + itemID);		
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error deleting tag " + tagID + " from item " + itemID);		
			 					console.log(response);
			 				}
	 					});
	 		e.preventDefault();
		});

		
	},
	render: function(){

		return this;
		
	},
	getTemplate : function(){
		var html = '<a class="fancybox-remove-tag" href=".">x</a><a class="tag" href="."><%=tagName%></a>'
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
	addItem: function(m, rerender)
    {
    	
    	var tagView =  new TagView({ model: m });
        
        // add the item view to this collection of views
        this._views.push(tagView);
        if(rerender){
        	this.render();
        }
    },
    render: function()
    {
    	//use template to clone the database items into
		var template = _.template( this.getTemplate() );
		
		//copy the cloned item into the el
		$(this.el).empty();
		$(this.el).append( template() );

    	//tag renders itself and then this viewcollection appends it to its parent el
		
		_.each(this._views, function(tagView){
			// tag draws itself
			var addThis = tagView.render(); 
        	$(this.el).prepend(addThis.el);
        	

        	
		}, this);

		
		var theElement = this.el;
		var view = this;
		
		//ADD TAG
		$(this.el).find('.newtag').editable(
			function(value, settings)
			{ 
				var newTag = new Tag({tag_name:value, item_id:view.collection.item_id});
				
				newTag.save({
							
							success: function(model, response) { 
								view.addItem(model, true);
								console.log("Added tag " + model.id);
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error adding tag.");
			 					console.log(response);
			 				}
			 			});
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
    	var html = '<div class="tag-container"><a href="." class="fancybox-remove-tag">x</a><a href="." class="newtag">'+ 'New tag 1, New tag 2</a></p>(<a href="." class="addtags fancybox-editable">add tag</a>)</div>';
    	return html;
    }
});