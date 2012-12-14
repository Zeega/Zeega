(function(Items) {

    Items.Collections = Items.Collections || {};
    Items.Collections.Views =  Items.Collections.Views || {};
    
    Items.Collections.Views.Results = Backbone.View.extend({
        
        el : $("#zeega-results-wrapper"),
        _childViews: [],
        _collectionChildViews: [],
    
        initialize : function(){
            zeega.discovery.app.isLoading = true;
            this.collection = new Items.Collections.Search();
            this.collection.on( "reset", this.reset, this);
            this.collection.bind("remove", this.remove, this);
            this.collection.bind("add", this.add, this);
        },
        
        add : function( item ){
        
            var itemView;

            if(zeega.discovery.app.currentView === "thumb"){
                itemView = new Items.Views.Thumb({model:item});
            } else{
                itemView = new Items.Views.List({model:item});
            }
            this._childViews.push( itemView );
            if(zeega.discovery.app.currentView === "thumb"){
                $("#zeega-items-thumb").append(itemView.render().el);
            } else if(zeega.discovery.app.currentView === "list"){
                $("#zeega-items-list").append(itemView.render().el);
            }
        
        },
        
        remove : function( model ){
            var deleteIdx = -1,
                removed;

            for (var i=0;i<this._childViews.length;i++){
                var itemView = this._childViews[i];
                if (itemView.model.id == model.id){
                    deleteIdx = i;
                    break;
                }
            }

            if (deleteIdx >= 0){
                removed = this._childViews.splice(deleteIdx,1);
                $(this.el).find(removed[0].el).remove();

                this.updateResultsCounts();
                this.updated = true;
                
            }

        },

        removeCollection : function( model ){
            var deleteIdx = -1,
                removed;

            for (var i=0;i<this._collectionChildViews.length;i++){
                var itemView = this._collectionChildViews[i];
                if (itemView.model.id == model.id){
                    deleteIdx = i;
                    break;
                }
            }

            if (deleteIdx >= 0){
                removed = this._collectionChildViews.splice(deleteIdx,1);
                $(removed[0].el).remove();

                this.updateResultsCounts();
                this.updated = true;
                
            }

        },
        
        updateResultsCounts : function(){
            var collectionsCount = 0;
            if (this.collection.collectionsCollection){
                collectionsCount = this.collection.collectionsCollection.length;
            }
            var itemsCount = this.collection.count;

            if (collectionsCount !==null){
                $(".jda-results-collections-count").text( this.addCommas(collectionsCount) );
            }
            $(".jda-results-items-count").text( this.addCommas(itemsCount) );
            $("#zeega-results-count-number").html( this.addCommas(itemsCount) );
        },
        
        render : function(){
            console.log("results rendering");
            var _this = this;
            $("#zeega-results-count").hide();
            
            _this._isRendered = true;
            
            console.log(this.collection,this.collection.search);
            //if(this.collection.search && this.collection.search.page==1)$(".results-wrapper").empty();
            $(".results-wrapper").empty();
            if(zeega.discovery.app.currentView == "thumb") {
                $("#results-list-wrapper").hide();
            }
            else {
                $("#results-thumbnail-wrapper").hide();
            }
                
            
            var q =0;
            
            _.each( _.toArray(this.collection), function(item){
                
                var itemView;
                if(zeega.discovery.app.currentView == "thumb"){
                    itemView = new Items.Views.Thumb({model:item});
                } else{
                    
                    itemView = new Items.Views.List({model:item});
                }
                
                _this._childViews.push( itemView );
                
                if(zeega.discovery.app.currentView == "thumb") $("#zeega-items-thumb").append(itemView.render().el);
                else if(zeega.discovery.app.currentView == "list") $("#zeega-items-list").append(itemView.render().el);

            });

            this.updateResultsCounts();
            
            $(this.el).show();
            
            zeega.discovery.app.isLoading = false;
            return this;
        },
        
        renderTags : function(){
        },
        
        reset : function(){
            if ( this._isRendered )
            {
                this._childViews = [];
                //this.render();
            }
        },
        
        search : function(obj,reset)
        {
        
            // console.log("zeega.discovery.app.resultsView.search",obj);
          
            var _this = this;
            
            this.updated = true;
            zeega.discovery.app.isLoading = true;
            

            if (obj.page == 1) $(this.el).hide();
            this.collection.setQuery(obj,reset);
    
            
            // fetch search collection for the list/thumb view
            this.collection.fetch({
                add : (obj.page) > 1 ? true : false,
                success : function(model, response)
                {
                    //deselect/unfocus last tag - temp fix till figure out why tag is popping up autocomplete
                    
                    VisualSearch.searchBox.disableFacets();

                    $("#zeega-results-count-number").html( _this.addCommas(response["items_count"]));
                    _this.renderTags(response.tags);
                    if(_this.collection.query.page==1)_this.render();
                    
                    if(_this.collection.length<parseInt(response["items_count"],10)) zeega.discovery.app.killScroll = false; //to activate infinite scroll again
                    else zeega.discovery.app.killScroll = true;
                    $(_this.el).fadeTo(1000,1);
                    zeega.discovery.app.isLoading = false;    //to activate infinite scroll again

                },
                error : function(model, response){
                    console.log("Search failed - model is " + model);
                }
            });
        },
        
        setMapBounds : function(bounds)
        {
            this.collection.search.mapBounds = bounds;
        },
     

        setContent : function(content)
        {
            this.collection.search.content = content;

        },
        clearTags : function(){
            var newQ,
                currentQ = this.collection.search.q;
            
            if (currentQ.indexOf("tag:") >= 0){
                newQ = currentQ.substring(0,currentQ.indexOf("tag:"));
                this.collection.search.q = newQ;
            }
        },

        setStartAndEndTimes : function(startDate, endDate)
        {
            var search = this.collection.search;
            
            search.times = {};
            search.times.start = startDate;
            search.times.end = endDate;

        },
        
        getSearch : function(){
            return this.collection.search;
        },
        
        //Formats returned results number
        addCommas : function(nStr)
        {
            var x,
                x1,
                x2,
                rgx;

            nStr += "";
            x = nStr.split(".");
            x1 = x[0];
            x2 = x.length > 1 ? "." + x[1] : "";
            rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)){
                x1 = x1.replace(rgx, "$1" + "," + "$2");
            }

            return x1 + x2;
        }
        
    });

})(zeega.module("items"));