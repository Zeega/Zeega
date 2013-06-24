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
            
            if( !_.isUndefined(this.query.content) && this.query.content == "project"){
                url = this.base+"projects/search?limit=20&";
            } else if( !_.isUndefined(this.query.content) && this.query.content !== "all"){
                url = this.base+"items/search?limit=20&type=" + this.query.content;
            } else {
                url = this.base+"items/search?limit=20&";
            }
           
            
            if( !_.isUndefined(this.query.q) && this.query.q.length > 0){
                url += "&q=" + this.query.q.toString();
            }

            url += "&sort=date-updated-desc";
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
                
                if( response.projects.length == 20 ){
                    this.more = true;
                } else {
                    this.more = false;
                }
                
                _.each(response.projects, function(project){
                    project.thumbnail_url = project.cover_image;
                    project.attribution_uri = zeega.discovery.app.apiLocation + project.id;
                    project.media_creator_realname = project.username;
                    project.media_type = "project";
                });

                return response.projects;
            } else {
                
                if( response.items.length == 20 ){
                    this.more = true;
                } else {
                    this.more = false;
                }

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
