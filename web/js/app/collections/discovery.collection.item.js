(function(Items) {

    Items.Collections=Items.Collections||{};

    Items.Collections.Static=Backbone.Collection.extend({
        
        model:Items.Model,
        type:"static",
        initialize: function(models,options){
                _.extend(this,options);
                this.on("preview_item",this.previewItem,this);
        },
        url : function(){
            var url = zeega.discovery.app.apiLocation + "api/items/" + this.id + "/items";
            return url;
        },
        parse : function(response)
        {
            return response.items;
            
        },
        previewItem : function(itemID)
        {
            
            var viewer = new Items.Views.Viewer({collection:this,start:itemID});
            $("body").append(viewer.render().el);
            viewer.renderItemView();
        }
    });

    Items.Collections.Dynamic=Items.Collections.Static.extend({
        type:"dynamic",
        url : function(){
            var url = zeega.discovery.app.apiLocation + "api/items/" + this.id + "/items";
            return url;
        },
        parse : function(response){
            return response.items;
        }
    });
    

    Items.Collections.MyCollections = Backbone.Collection.extend({
        mode: Items.Model,
        url: zeega.discovery.app.apiLocation + "api/items/search?q=type:Collection,user:-1&limit=300",
        comparator: function(model){
            return model.get('title');
        },
        parse: function(data){
            return data.items;
        }
    });

    Items.Collections.Search = Backbone.Collection.extend({
        
        model:Items.Model,
        base : zeega.discovery.app.apiLocation + "api/items/search?",
        query : {
                    page: 1
                },
                
        initialize: function(){
            this.on("preview_item",this.previewItem,this);
        },
        
        previewItem : function(itemID)
        {
            var viewer = new Items.Views.Viewer({collection:this,start:itemID});
            $("body").append(viewer.render().el);
            viewer.renderItemView();
        },
    
        url : function()
        {
        
            var url = this.base;
            
            if( !_.isUndefined(this.query.q) && this.query.q.length > 0) url += "q=" + this.query.q.toString();
            else url+="sort=date-desc";
            
            if( !_.isUndefined(this.query.content) && "all" !== this.query.content ){
                url += "&type=" + this.query.content;
                if(this.query.content==='project'){
                    url+="&fields=id,attribution_uri,thumbnail_url,uri,title,description,date_created,media_type,layer_type,display_name,eidtable,published";
                }
            }
            if( !_.isUndefined(this.query.sort) ) url += "&sort=" + this.query.sort;
            if( !_.isUndefined(this.query.collection) && this.query.collection > 0) url += "&collection=" + this.query.collection;
            if( !_.isUndefined(this.query.page) ) url += "&page=" + this.query.page;
            if( !_.isUndefined(this.query.times)&&!_.isNull(this.query.times) ){
                if( !_.isUndefined(this.query.times.start) ) url += "&min_date=" + this.query.times.start;
                if( !_.isUndefined(this.query.times.end) ) url += "&max_date=" + this.query.times.end;
            }
            if( _.isUndefined(this.query.universe)||(!_.isUndefined(this.query.universe)&& this.query.universe!=1)){ url += "&user=-1";}
            // console.log("query url: "+ url);
            


            return url;
        },
    
        setQuery : function(obj, reset)
        {
            // console.log("items.collection.setquery",reset,this.query,obj);
            
            if(reset){
                this.query = {
                    r_tags:1,
                    page:1,
                    sort:"date-desc"
                };
            }
            
            _.extend(this.query,obj);
            
            // console.log("final query",this.query);
        },
        
        getquery : function()
        {
            return this.query;
        },
    
        parse : function(response)
        {
            this.tags=response.tags;
            this.count = response.items_count;
            
            return response.items;
        },
        
        previewItem : function(itemID)
        {
            var viewer = new Items.Views.Viewer({collection:this,start:itemID});
            $("body").append(viewer.render().el);
            viewer.renderItemView();
        }
    });

})(zeega.module("items"));
