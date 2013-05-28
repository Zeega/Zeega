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
            console.log("QUERY :: ", this.query);
            var url;

            
            if( !_.isUndefined(this.query.content) && this.query.content == "project"){
                url = this.base+"projects/search?";
            } else if( !_.isUndefined(this.query.content) && this.query.content !== "all"){
                url = this.base+"items/search?type=" + this.query.content;
            } else {
                url = this.base+"items/search?";
            }
           
            
            if( !_.isUndefined(this.query.q) && this.query.q.length > 0){
                url += "&q=" + this.query.q.toString();
            }

            if( !_.isUndefined(this.query.sort) ) url += "&sort=" + this.query.sort;
            if( !_.isUndefined(this.query.page) ) url += "&page=" + this.query.page;

            return url;
        },
    
        setQuery : function(obj, reset)
        {
            
            if(reset){
                this.query = {
                    page:1,
                    sort:"date-desc"
                };
            }
            
            _.extend(this.query,obj);

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
