(function(Items){

    Items.Views = Items.Views || {};
    
    Items.Views.Thumb = Backbone.View.extend({
        
        tagName: "li",
        className: "z-drag results-thumbnail",

        events: {
            "click":"previewItem"
        },

        previewItem: function()
        {
            this.model.trigger( "preview_item", this.model.id );
            return false;
        },

        initialize: function () {
            this.el.id = this.model.id;
        },

        render: function(done)
        {
            var _this = this,
                template = this.getDefaultTemplate(),
                blanks = this.model.attributes;

            $(this.el).html( _.template( template, blanks ) );


            
            if( this.model.get("media_type") == "Image" || this.model.get("media_type") == "Audio" || this.model.get("media_type") == "Video"  ){
                blanks["author"] = this.model.get("media_creator_username");
            } else {
                blanks["author"] = this.model.get("user").display_name;
                
                if( this.model.get("cover_image") === "" ){
                    blanks["thumbnail_url"] = "http://static.zeega.org/community/templates/default_project_cover.png";
                } else {
                    blanks["thumbnail_url"] = this.model.get("cover_image");
                }
            }

            return this;
        },
        
        getDefaultTemplate : function()
        {

            var html = "<a href='#' class='thumbnail' style='background-image:url(<%=thumbnail_url%>);'></a>";
            return html;
            
        }
        
    });
    
    Items.Views.List = Backbone.View.extend({
        
        tagName : "tr",
        className : "list-media z-drag",
        
        initialize: function () {
            var _this=this;
            this.el.id = this.model.id;
        },
        events : {
            "click":"previewItem"
        },
        previewItem: function()
        {
            this.model.trigger( "preview_item", this.model.id );
            return false;
        },
         
        render: function(done)
        {
            var _this = this,
                template = this.getDefaultTemplate(),
                blanks = this.model.attributes;

            if (this.model.get("description") === null){
                blanks["description"] = " ";
            }
            if (this.model.get("description") !== null && this.model.get("description").length > 255){
                blanks["description"] = this.model.get("description").substring(0,255) + "...";
            }
            if (this.model.get("title") === null || this.model.get("title") == "none" || this.model.get("title") === ""){
                blanks["title"] = "";
            }



            if( this.model.get("media_type") == "Image" || this.model.get("media_type") == "Audio" || this.model.get("media_type") == "Video"  ){
                blanks["author"] = this.model.get("media_creator_username");
            } else {
                blanks["author"] = this.model.get("user").display_name;
                
                if( this.model.get("cover_image") === "" ){
                    blanks["thumbnail_url"] = "http://static.zeega.org/community/templates/default_project_cover.png";
                } else {
                    blanks["thumbnail_url"] = this.model.get("cover_image");
                }
            }
            
            
            $(this.el).html( _.template( template, blanks ) );

            return this;
        },

        
       
        getDefaultTemplate : function()
        {
            html =
            "<td class='zeega-list-left-column'>"+
                "<div class='zeega-item-thumbnail'>"+
                    "<a href='#' class='thumbnail' style='background-image:url(<%=thumbnail_url%>);'>"+
                    "</a>"+
                "</div>"+
            "</td>"+
            "<td class='zeega-list-middle-column'>"+
                "<h3><%= title %></h3><p class='jda-item-author'>Created by: <%= author %></p>"+
                "<p class='jda-item-description'><%= description %></p>"+
            "</td>"+
            "<td class='zeega-list-right-column jda-item-date'>"+
            "<div style='position:relative; height:55px'><p class='jda-user-link bottom' style='margin:0px'>Added by <a href='" + zeega.discovery.app.apiLocation + "profile/<%=user.id %>' target='_blank' ><%= user.display_name %></a></p></div>"+
            "</td>";
            

            
            return html;
        }
    });
    
    
})(zeega.module("items"));