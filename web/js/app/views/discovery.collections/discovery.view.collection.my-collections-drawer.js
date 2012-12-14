(function(Items) {
    

    Items.Collections = Items.Collections || {};
    Items.Collections.Views =  Items.Collections.Views || {};
    
    
    Items.Collections.Views.MyCollectionsDrawer = Backbone.View.extend({
        
        el : $("#zeega-collection-list"),
        
        initialize : function(){
            var _this = this;
            $("#zeega-collection-list").spin(true);
            
            $("#create-collection").click(function(){_this.createCollection(); return false;});
            $("#create-dynamic-collection").click(function(){_this.createDynamicCollection(); return false;});

            this.collection = new Items.Collections.MyCollections();
            
            this.collection.fetch({
                 success : function(collection, response){
                    _this.render();
                },
                error : function(collection, response){
                    console.log(response);
                }
            });
        },

        render : function(){
            var _this = this;
            _.each( _.toArray(this.collection), function(item){
                var itemView = new Items.Views.CollectionListView({model:item});
                $(_this.el).append(itemView.render().el);
            });
            
            $(this.el).find("#zeega-my-collections-items").droppable({
                accept : ".results-thumbnail",
                hoverClass : "zeega-my-collections-items-dropping",
                tolerance : "pointer",

                drop : function( event, ui ){

                    if(_.isNull(_this.user)){
                        $(_this.el).find("#zeega-my-collections-items").addClass("zeega-my-collections-items-dropping");
                    
                        _this.activeCollection.attributes.child_items.push(zeega.discovery.app.draggedItem.toJSON());
                        _this.renderCollectionPreview(_this.activeCollection);
    
                        var newItems = _this.activeCollection.attributes.new_items.push(zeega.discovery.app.draggedItem.id);
                        
                        
                        _.delay(function(){$(_this.el).find("#zeega-my-collections-items").removeClass("zeega-my-collections-items-dropping");},1000);
                    
                    }
                    else if(_.difference([zeega.discovery.app.draggedItem.id],_.pluck(_this.activeCollection.attributes.child_items,"id")).length===0){
                        
                        console.log("duplicate");
                        
                    }
                
                    else {
                        
                        $(_this.el).find("#zeega-my-collections-items").addClass("zeega-my-collections-items-dropping");
                    
                        _this.activeCollection.attributes.child_items.push(zeega.discovery.app.draggedItem.toJSON());
                        _this.renderCollectionPreview(_this.activeCollection);
                        var itemId=zeega.discovery.app.draggedItem.id;
                        
                        _this.activeCollection.url=zeega.discovery.app.apiLocation + "api/items/" + _this.activeCollection.id+"/items";
                
                        
                        _this.activeCollection.save({new_items:[itemId ]},
                                {
                                    success : function(model, response){
                                        
                                        $(_this.el).find("#zeega-my-collections-items").removeClass("zeega-my-collections-items-dropping");
                                    },
                                    error : function(model, response){
                                        console.log(response);
        
                                    }
                                }
                            );
                        }
                    ui.draggable.draggable("option","revert",false);
                }
            });

            $("#zeega-collection-list").spin(false);
            return this;
        },
    
    
        createDynamicCollection : function(){
            var dynamicCollectionModal= new Items.Views.DynamicCollectionModal({parentView:this});
            $("body").append(dynamicCollectionModal.render().el);
            dynamicCollectionModal.show();
            return false;
        },
        createCollection : function(){
            var collectionModal= new Items.Views.CollectionModal({parentView:this});
            $("body").append(collectionModal.render().el);
            collectionModal.show();
            return false;
        }
        

    });
})(zeega.module("items"));
