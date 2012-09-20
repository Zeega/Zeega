(function(Items) {
	

	Items.Collections = Items.Collections || {};
	Items.Collections.Views =  Items.Collections.Views || {};
	
	
	Items.Collections.Views.MyCollectionsDrawer = Backbone.View.extend({
		
		el : $('#zeega-collection-list'),
		
		initialize : function(){
			
			$('#zeega-collection-list').spin(true);

			this.collection = new Items.Collection();
            this.collection.url=zeega.discovery.app.apiLocation + 'api/search?r_collections=1&user=-1';			
            this.collection.parse= function(data){ return data.collections;}
            this.collection.comparator = function(model) { return model.get('title');}
			this.collection.fetch({
					
					success : function(collection, response)
					{ 
						
						_this.render();
					},
					error : function(collection, response)
					{ 
						console.log(response);

	
					}
				}
			);
			var _this=this;
			
		},

		render : function(){
			var _this = this;

		
			$('#new-collection').click(function(){_this.createNewCollection(); return false;});
		
			
			_.each( _.toArray(this.collection), function(item){
				var itemView = new Items.Views.CollectionList({model:item});
				$(_this.el).append(itemView.render().el);
			});
			
			$(this.el).find('#zeega-my-collections-items').droppable({
			    accept : '.results-thumbnail',
			    hoverClass : 'zeega-my-collections-items-dropping',
			    tolerance : 'pointer',

			    drop : function( event, ui ){
			    
			    	//TODO -- Check whether user is logged in - if not then log them in before adding
					if(_.isNull(_this.user)){
						$(_this.el).find('#zeega-my-collections-items').addClass('zeega-my-collections-items-dropping');
					
						_this.activeCollection.attributes.child_items.push(zeega.discovery.app.draggedItem.toJSON());
						_this.renderCollectionPreview(_this.activeCollection);
	
						var newItems = _this.activeCollection.attributes.new_items.push(zeega.discovery.app.draggedItem.id);
						
						
						_.delay(function(){$(_this.el).find('#zeega-my-collections-items').removeClass('zeega-my-collections-items-dropping');},1000);
					
					}
					else if(_.difference([zeega.discovery.app.draggedItem.id],_.pluck(_this.activeCollection.attributes.child_items,"id")).length==0){
						
						console.log('duplicate');
						
					}
				
					else {
						
						$(_this.el).find('#zeega-my-collections-items').addClass('zeega-my-collections-items-dropping');
					
						_this.activeCollection.attributes.child_items.push(zeega.discovery.app.draggedItem.toJSON());
						_this.renderCollectionPreview(_this.activeCollection);
						  
						var itemId=zeega.discovery.app.draggedItem.id;
						
						_this.activeCollection.url=zeega.discovery.app.apiLocation + 'api/items/' + _this.activeCollection.id+'/items';
				
						
						_this.activeCollection.save({new_items:[itemId ]},
								{
									success : function(model, response){ 
										
										$(_this.el).find('#zeega-my-collections-items').removeClass('zeega-my-collections-items-dropping');
									},
									error : function(model, response){
										console.log(response);
		
									}
								}
							);
						}
					ui.draggable.draggable('option','revert',false);
					
			    }
			});
			  
			$('#zeega-collection-list').spin(false);
			return this;
		},
	
		createNewCollection : function(){
			var _this=this;
			var newCollection = new Items.Model({
				title:"new collection "+Math.floor(Math.random()*1000),
				child_items:[],
				new_items:[],
				editable:true,
			});
			
			newCollection.save({},{
				success:function(model,response){
					_this.collection.add(model);
					console.log(model);
					$(_this.el).prepend(new Items.Views.CollectionList({model:model}).render().el);
				}
			});
			
			return false;	
		}

	});
})(zeega.module("items"));
