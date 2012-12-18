(function(Items){

    Items.Views = Items.Views || {};
    
    Items.Views.Thumb = Backbone.View.extend({
        
        tagName: "li",

        events: {
            "click":"previewItem"
        },

        previewItem: function()
        {
            console.log("triggering preview",this.model);
            if( this.model.get("media_type")==="Collection" ){
                zeega.discovery.app.goToCollection(this.model);
            } else {
                this.model.trigger( "preview_item", this.model.id );
            }
            
            
            return false;
        },

        initialize: function () {
            var _this=this;

            this.el.id = this.model.id;

            if (_.isUndefined(this.options.thumbnail_height)){
                this.options.thumbnail_height = 144;
            }
            if(this.options.fancybox||true){
                $(this.el).addClass("results-thumbnail");
            }
            if (_.isUndefined(this.options.thumbnail_width)){
                this.options.thumbnail_width = 144;
            }
            if (_.isUndefined(this.options.show_caption)){
                this.options.show_caption = true;
            }

            if (!_.isUndefined(this.options.draggable)){
                this.draggable=this.options.draggable;
            }
            else this.draggable=true;
            
            this.model.set({thumbnail_width:this.options.thumbnail_width, thumbnail_height:this.options.thumbnail_height});

        },

        render: function(done)
        {
            var _this = this;

            var template = this.getDefaultTemplate();
            
            if( this.model.get("media_type")=="Collection"){
                template = this.getCollectionTemplate();
            } else {
                template = this.getDefaultTemplate();
            }

            var blanks = this.model.attributes;


            
            $(this.el).html( _.template( template, blanks ) );

            

            //Turn off captions if we don"t want them OR if it"s an image
            if (!this.options.show_caption || this.model.get("media_type") == "Image"){
                $(this.el).find(".jda-thumbnail-caption").hide();
            }


            //Insert play icon if it"s a video
            if (this.model.get("media_type") == "Video"){
                $("<i class='jdicon-small-play jdicon-lightgrey' style='opacity:0.8;position:absolute;top:50%;left:50%;margin-top:-13px;margin-left:-7px'></i>").insertBefore($(this.el).find("img"));
            }

            
            if (this.model.get("media_type") == "Document"){

                $(this.el).find("img").addClass("jda-document-thumbnail");

            }

            
            
            
            $(this.el).draggable({
                cursor : "move",
                cursorAt : {
                    top : -5,
                    left : -5
                },
                appendTo : "body",
                opacity : 0.8,
                helper : function(){
                    var drag = $(this).find("a")
                                .clone()
                                .css({"z-index":"101"});
                    return drag;
                },

                //init the dragged item variable
                start : function()
                {
                    $(this).draggable("option","revert",true);
                    zeega.discovery.app.draggedItem = _this.model;
                },

                stop : function(){}
            });
            $(this.el).find(".jdicon-small-drag").tooltip({"title":"Drag to add to your collection","placement":"bottom", delay: { show: 600, hide: 100 }});
            $(this.el).find(".label").tooltip({"placement":"bottom", delay: { show: 600, hide: 100 }});
            
            

            //Replace broken thumbnail images with the media type icon
            $(this.el).find("img").error(function() {
            $(_this.el).find("img").replaceWith(    "<i class='jdicon-"+ _this.model.get("media_type").toLowerCase() +
                                                    "' style='position: absolute;top: 10%;left: 10%;'></i>");
            });

            
            return this;
        },
        
        getCollectionTemplate : function()
        {
            var html = "<a href='#' class='thumbnail' style='position:relative;width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px;background-color:white'>"+
                            "<img src='<%=thumbnail_url%>' alt='<%=title%>' style='width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px'>"+
                        "</a>";
            return html;
        },
        
        getDefaultTemplate : function()
        {

            var html = "<a href='#' class='thumbnail' style='position:relative;width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px;background-color:white'>"+
                            "<img src='<%=thumbnail_url%>' alt='<%=title%>' style='width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px'>"+
                        "</a>";
            return html;
            
        }
        
    });
    
    Items.Views.List = Backbone.View.extend({
        
        tagName : "tr",
        className : "list-media",
        
        initialize: function () {
            var _this=this;
            this.el.id = this.model.id;
        },
        events : {
            "click":"previewItem"
        },
        previewItem: function()
        {
            this.model.trigger("preview_item",this.model.id);
            return false;
        },
         
        render: function(done)
        {
            var _this = this;
            
            var template;
            if(this.model.get("media_type")==="Collection"){
                template = this.getCollectionTemplate();
            } else {
                template = this.getDefaultTemplate();
            }
            
            
            
        
            var blanks = this.model.attributes;
            
            if(_.isUndefined(this.model.get("display_name")))blanks.display_name="none";
                
            if (false&&!_.isUndefined(this.model.get("media_date_created"))&&!_.isNull(this.model.get("media_date_created"))){
                blanks["media_date"] = new Date(this.model.get("media_date_created").replace(" ", "T"));
                blanks["media_date"]=blanks["media_date"].format("mmmm dS, yyyy<br/>h:MM TT");
            } else {
                blanks["media_date"] = "n/a";
            }
            if (!_.isObject(this.model.get("text"))&&!_.isNull(this.model.get("text"))&&!_.isUndefined(this.model.get("text"))){
                var excerpt = this.model.get("text").replace(/\r\n/gi, "<br/>");
            }
            if (this.model.get("description") === null){
                blanks["description"] = " ";
            }
            if (this.model.get("description") !== null && this.model.get("description").length > 255){
                blanks["description"] = this.model.get("description").substring(0,255) + "...";
            }
            if (this.model.get("title") === null || this.model.get("title") == "none" || this.model.get("title") === ""){
                blanks["title"] = "";
            }

            blanks["author"] = this.model.get("media_creator_username");
            
            if (this.model.get("media_type") == "Text" && this.model.get("description").length < this.model.get("text").length){
                blanks["description"] = this.model.get("description") + "...";
            }
            
            if (this.model.get("media_type") == "Website"){
                var parts = this.model.get("attribution_uri").split("http");
                blanks["original_url"] = "http"+parts[2];
            }
            
            if (_.isUndefined(blanks["thumbnail_width"])){
                blanks["thumbnail_width"] = 120;
            }
            if (_.isUndefined(blanks["thumbnail_height"])){
                blanks["thumbnail_height"] = 120;
            }


            $(this.el).html( _.template( template, blanks ) );
            
            
            
            
            return this;
        },

        
       
        getDefaultTemplate : function()
        {
            html =
            "<td class='zeega-list-left-collumn'>"+
                "<div class='zeega-item-thumbnail'>"+
                    "<a href='#' class='thumbnail' style='position:relative;width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px;background-color:white'>"+
                        "<img src='<%=thumbnail_url%>' alt='<%=title%>' style='width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px'>"+
                    "</a>"+
                "</div>"+
            "</td>"+
            "<td class='zeega-list-middle-column'>"+
                "<h3><%= title %></h3><p class='jda-item-author'>by: <%= author %></p>"+
                "<p class='jda-item-description'><%= description %></p>"+
            "</td>"+
            "<td class='zeega-list-right-column jda-item-date'>"+
            "<div style='position:relative; height:55px'><p class='jda-user-link bottom' style='margin:0px'>via <a href='#' ><%= display_name %></a></p></div>"+
            "</td>";
            

            
            return html;
        },

        getCollectionTemplate : function()
        {
            html =
            "<td class='zeega-list-left-collumn'>"+
                "<div class='zeega-item-thumbnail'>"+
                    "<a href='#' class='thumbnail' style='position:relative;width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px;background-color:white'>"+
                        "<img src='<%=thumbnail_url%>' alt='<%=title%>' style='width:<%=thumbnail_width%>px;height:<%=thumbnail_height%>px'>"+
                    "</a>"+
                "</div>"+
            "</td>"+
            "<td class='zeega-list-middle-column'>"+
                "<h3><%= title %></h3><p class='jda-item-author'>by: <%= author %></p>"+
                "<p class='jda-item-description'><%= description %></p>"+
            "</td>"+
            "<td class='zeega-list-right-column jda-item-date'>"+
            "<div style='position:relative; height:55px'><p class='jda-user-link bottom' style='margin:0px'>via <a href='#' ><%= display_name %></a></p></div>"+
            "</td>";
            

            
            return html;
        }


        
    });
    
    Items.Views.DrawerView = Backbone.View.extend({
        
        tagName : "ul",

        initialize : function()
        {
            this.collection.on("reset", this.render, this);
        },

        render : function()
        {
            var _this = this;
            this.$el.addClass("list");
            this.collection.each(function(item){
                _this.$el.append( new Items.Views.DrawerThumbView({model:item},{collection_type:_this.collection.type}).render().el );
            });
            return this;
        }

    });

    Items.Views.DrawerThumbView = Backbone.View.extend({

        tagName : "li",
        className : "database-asset-list",
        initialize : function (model,options){
            _.extend(this,options);
        
        },
        render: function()
        {
            this.$el.html( _.template(this.getTemplate(),this.model.toJSON() ));
            this.makeDraggable();
            return this;
        },

        makeDraggable : function()
        {
            var _this = this;
            this.$el.draggable({
                appendTo : "body",
                cursorAt : {
                    top : 5,
                    left :5
                },
                opacity : 1,
                helper : function()
                {
                    
                    var drag = $(this).find("img")
                        .clone()
                        .css({
                            "width":"36px",
                            "height":"27px",
                            "z-index":100
                        });
                    return drag;
                },

                start : function()
                {
                    $(this).draggable("option","revert",true);
                    zeega.discovery.app.draggedItem = _this.model;
                }
            });
        },

        events: {
            "click .database-asset" : "previewItem"
        },

        //item events
        previewItem: function()
        {
            console.log("preview",this.model.id);
            this.model.trigger("preview_item",this.model.id);
        },

        getTemplate : function()
        {
            var html ;
            if(this.collection_type==="static")    html = "<div class='collection-remove-item'><a id='<%= id %>' href='#' >x</a></div><a class='database-asset' href='#'><img src='<%= thumbnail_url %>'/></a>";
            else html= "<a class='database-asset' href='#'><img src='<%= thumbnail_url %>'/></a>";
            return html;
        }
    });
    
    Items.Views.CollectionListView = Backbone.View.extend({
        
        tagName : "li",
        className : "collection-list-item",
        loaded:false,
        initialize : function()
        {
            var _this=this;
            this.model.bind("change",function(){
            
                if(_this.model.hasChanged("title")){
                    
                    _this.updateTitle();
                }
            
            });
        },
        
        events :
        {
            "click .delete-collection"        : "deleteCollection",
            "click .layer-super"        : "expand",
            "click .view-collection-metadata" : "preview",
            "click .view-collection" : "viewCollection",
            "click .collection-remove-item":"removeItem"
        },
        
        removeItem : function(event)
        {

            if(confirm("Remove item from collection?")){
                var itemID = $(event.target).attr("id");
                this.children.remove(this.children.get(itemID));
                $(event.target).closest("li").fadeOut().remove();
                this.model.save({
                                    items_to_remove:itemID
                                                                },
                {
                    url:zeega.discovery.app.apiLocation + "api/items/" + this.model.id+"/items",
                    success: function(model, response) {
                        
                    },
                    error: function(model, response){
    
                        console.log("Error updating item title.");
                        console.log(response);
                    }
    
                });
            }
            return false;
        },
        
        render : function()
        {
            
            
            var _this=this;
            var title;
            
            
            if(this.model.get("title").length>25) title = this.model.get("title").substr(0,23)+"...";
            else title = this.model.get("title");
                
                
            var blanks = {
                id : "collection-"+this.model.id,
                title : title,
                thumbnail_url : this.model.get("thumbnail_url")
            };
            this.$el.html( _.template( this.getTemplate(), blanks ) );
            if(this.model.get("layer_type")=="Dynamic"){
                this.$el.addClass("dynamic-collection");
            }
            else{
                this.$el.addClass("static-collection");
                this.$el.droppable({
                accept : ".results-thumbnail",
                hoverClass : "zeega-my-collections-items-dropping",
                tolerance : "pointer",
                drop : function( event, ui ){
                    ui.draggable.draggable("option","revert",false);
                    
                    $(_this.el).find("#zeega-my-collections-items").addClass("zeega-my-collections-items-dropping");
                    
                    //Check for duplicates
                    if(_this.loaded&&_.difference([zeega.discovery.app.draggedItem.id],_.pluck(_.toArray(_this.children),"id")).length===0 ) console.log("duplicate");
                    
                    else{
                        if(_this.loaded){
                            _this.children.push(zeega.discovery.app.draggedItem);
                            _this.$el.find("#zeega-item-database-list").find("ul").prepend(new Items.Views.DrawerThumbView({model:zeega.discovery.app.draggedItem}).render().el);
                        }

                        var itemId=zeega.discovery.app.draggedItem.id;
                        _this.model.url=zeega.discovery.app.apiLocation + "api/items/" + _this.model.id+"/items";
                        _this.model.save({new_items:[itemId ]},
                            {
                                success : function(model, response){
                                    console.log(model,response,"success");
                                    $(_this.el).find("#zeega-my-collections-items").removeClass("zeega-my-collections-items-dropping");
                                },
                                error : function(model, response){
                                    console.log(response);
    
                                }
                            }
                        );
                    }
                }
            });
            }
            
            this.$el.find("#collection-list-thumb").droppable({
                accept: ".database-asset-list",
                hoverClass: "collection-thumb-drop",
                tolerance: "pointer",
                drop : function(event,ui){
                    ui.draggable.draggable("option","revert",false);
                    var src = $(ui.draggable).find("img").attr("src");
                    console.log(src);
                    _this.model.set({thumbnail_url:src}).save();
                    console.log(_this.model);
                    $(_this.$el.find(".collection-list-thumb")[0]).attr({"src":src});
                    return false;
                    
                }
            });
        
            return this;
        },

        updateTitle:function()
        {
            var title;
            if(this.model.get("title").length>25) title = this.model.get("title").substr(0,23)+"...";
            else title = this.model.get("title");
            this.$el.find(".collection-title").html(title);
        
        },

        deleteCollection : function()
        {
            if( confirm("Delete Collection?") )
            {
                    //KILL KILL
                var _this=this;
                this.model.destroy({success:function(model){
                        console.log("collection deleted");
                            _this.$el.fadeOut().remove();
                        },
                        error:function(){
                            alert("Unable to delete collection");
                        }
                });

            }
            return false;
                
            
            
        },

        //    open/close and expanding collection
        expand : function()
        {
            
            if(this.$el.hasClass("layer-open") )
            {
                this.$el.removeClass("layer-open");
                this.model.trigger("editor_controlsClosed");
            }
            else
            {
                var _this = this;
                $(".layer-open").removeClass("layer-open");
                this.$el.addClass("layer-open");
                
                if(!this.loaded){
                    this.loaded=true;
                }
                    if(this.model.get("layer_type")=="Dynamic") this.children=new Items.Collections.Dynamic([],{id:this.model.id});
                    else this.children =new Items.Collections.Static([],{id:this.model.id});
                    
            
                    this.children.fetch(
                {

                    success : function(collection, response)
                    {
                        console.log(collection);
                        _this.$el.find("#zeega-item-database-list").empty().append(new Items.Views.DrawerView({collection:_this.children}).render().el);
                    },
                    error : function(model, response)
                    {
                        console.log("Error getting active collection for collections drawer");
                    }
                });
                
            }

            
            return false;
        },
        
        preview :function()
        {
            console.log('triggering preview item');
            this.model.trigger("preview_item",this.model.id);
            
            return false;
        },

        viewCollection: function(){
            zeega.discovery.app.goToCollection( this.model );
            
            return false;
        },

        
        getTemplate : function()
        {
            var html =

                "<div class='layer-super'>"+
                    "<a id='collection-list-thumb' href='#'><img class='collection-list-thumb' src='<%= thumbnail_url %>'/></a>"+
                    "<span class='collection-title'>  <%= title %></span>"+
                    "<span class='pull-right'>"+
                        
                        "<a href='#' class='collection-options delete-collection' href='#'><i class='icon-trash icon-white'></i></a>"+
                        "<a href='#' class='collection-options view-collection-metadata'><i class='icon-pencil icon-white'></i></a>"+
                        "<a href='#' class='collection-options view-collection'><i style='background-position: -95px -120px;' class='icon-white'></i></a>"+

                    "</span>"+
                "</div>"+
                "<div class='layer-control-drawer collection'>"+
                    "<div id='controls' class='clearfix'><div id='zeega-item-database-list' class='collection'></div></div>"+
                    "<div class='default-layer-controls clearfix'></div>"+
                "</div>";

                return html;
        }
        
    });

    Items.Views.CollectionModal = Backbone.View.extend({
        
        initialize : function(){
            _.extend(this,this.options);
            this.attr={
                
            };
        },
        
        render: function()
        {
            var _this = this;
            $(this.el).html( this.getTemplate() );
            return this;
        },
        
        show : function()
        {
            this.$el.modal("show");
        },
        
        hide : function()
        {
            this.$el.modal("hide");
            this.remove();
            return false;
        },
        
        events : {
            "click .close" : "hide",
            "click .btn-success" : "parseInput"
        },
        
        parseInput : function(){
            
            this.attr={
                layer_type:"Collection",
                model_type:"Collection"
            };
            _.extend(this.attr,{
                title:this.$el.find("#collection-title").val(),
                description:this.$("#collection-description").val(),
                child_items:[],
                new_items:[],
                editable:true
            });
            this.createCollection();
        },
        
        createCollection : function()
        {
            this.hide();
            var _this = this;
            
            var newCollection = new Items.Model(this.attr).save({},{
                success:function(model,response){
                    _this.parentView.collection.add(model);
                    //_this.parentView.collection.reset();
                    console.log(_this.parentView.collection);
                    $(_this.parentView.el).prepend(new Items.Views.CollectionListView({model:model}).render().el);
                }
            });
            return false;
        },

    
        getTemplate : function()
        {

            var html =
            
            "<div class='modal'' id='sequence-modal'>"+
                "<div class='modal-header'>"+
                    "<button class='close'>×</button>"+
                    "<h3>Create New Collection</h3>"+
                "</div>"+
                
                "<div class='modal-body clearfix twocolumn-rows'>"+
                    
                    "<label for='collection-title' class=''>Title</label>"+
                    "<input type='text' id='collection-title' class='twocolumn-field span6' value=''/>"+
                    
        
                    "<label for='collection-description' class='twocolumn-label'>Description</label>"+
                    "<textarea id='collection-description' class='twocolumn-field span6'></textarea>"+
                    
                    "<br>"+


                    "<div class='collection-footer'>"+
                        "<button id='looks-good' data-dismiss='modal'  class='btn btn-success secondary'>Create <i class='icon-circle-arrow-right icon-white'></i></button>"+
                    "</div>"+
                "</div>";
            
            return html;
        }
    
    });
    
    Items.Views.DynamicCollectionModal = Items.Views.CollectionModal.extend({

        parseInput : function(){
            
            this.attr={
                layer_type:"Dynamic",
                media_type:"Collection"
            };
            _.extend(this.attr,{
                title:this.$("#collection-title").val(),
                description:this.$("#collection-description").val(),
                published:true,
                attributes:{
                    tags:this.$("#tag-input").val()
                },
                child_items:[],
                new_items:[],
                editable:true
            });
            console.log(this.attr);
            this.createCollection();
        },

    
        getTemplate : function(){

            var html =
            
            "<div class='modal' id='sequence-modal'>"+
                "<div class='modal-header'>"+
                    "<button class='close'>×</button>"+
                    "<h3>Create A New Dynamic Collection</h3>"+
                "</div>"+
                
                "<div class='modal-body clearfix twocolumn-rows'>"+
                    
                    "<label for='collection-title' >Title</label>"+
                    "<input type='text' id='collection-title' class='twocolumn-field span6' value=''/>"+
                    
                    "<label for='tags' class='twocolumn-label'>Dynamic Query Tag</label>"+
                    "<input name='tags' class='tagsedit twocolumn-field span6' id='tag-input' value='' />"+
                    "<br>"+
                    
                    "<label for='collection-description' class='twocolumn-label'>Description</label>"+
                    "<textarea id='collection-description' class='twocolumn-field span6'></textarea>"+
                    
                    "<br>"+


                    "<div class='collection-footer'>"+
                        "<button id='looks-good' data-dismiss='modal'  class='btn btn-success secondary'>Create <i class='icon-circle-arrow-right icon-white'></i></button>"+
                    "</div>"+
                "</div>";
            
            return html;
        }
    
    });
    
    
})(zeega.module("items"));