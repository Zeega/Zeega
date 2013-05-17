(function(Items) {

    Items.Collections=Items.Collections||{};

    Items.Collections.Search = Backbone.Collection.extend({
        
        model:Items.Model,
        base : zeega.discovery.app.apiLocation + "api/",
        query : {
                    page: 1
                },
                
        initialize: function(){
            this.on("preview_item",this.previewItem,this);
        },
    
        url : function()
        {
            var url;

            if(!_.isUndefined(this.query.content) && this.query.content == "project"){
                url = this.base+"projects/search?";
            } else {
                url = this.base+"items/search?";
            }
            
            
            if( !_.isUndefined(this.query.q) && this.query.q.length > 0) url += "q=" + this.query.q.toString();
            else url+="sort=date-desc";
            
            if( !_.isUndefined(this.query.content) && "all" !== this.query.content ){
                url += "&type=" + this.query.content;
                if(this.query.content==='project'){
                    url+="&fields=media_geo_latitude,media_geo_longitude,media_creator_username,media_creator_realname,id,attribution_uri,thumbnail_url,uri,title,description,date_created,media_type,tags,layer_type,display_name,eidtable,published";
                } else if (this.query.content==='Collection' && (_.isUndefined(this.query.q) || this.query.q.length === 0)){
                    url+="&data_source=db";
                }
            } else {
                url += "&type=-project";
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
            
           if(!_.isUndefined(this.query.content) && this.query.content == "project"){
                this.count = response.projects.length;

                _.each(response.projects, function(project){
                    project.thumbnail_url = project.cover_image;
                    project.attribution_uri = zeega.discovery.app.apiLocation + project.id;
                    project.media_creator_realname = project.username;
                    project.media_type = "project";
                });

                return response.projects;
            } else {
                this.count = response.items_count;
                return response.items;
            }
            
        },
        
        previewItem : function(itemID)
        {
            var viewer = new Items.Views.Viewer({collection:this,start:itemID});
            $("body").append(viewer.render().el);
            viewer.renderItemView();
        }
    });

})(zeega.module("items"));
