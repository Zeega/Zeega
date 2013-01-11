(function(Items) {

    // This will fetch the tutorial template and render it.
    Items.Views.Viewer = Backbone.View.extend({

        tagName: "div",
        className: "item-viewer",
        state: "more",

        initialize : function()
        {
            var ids = this.collection.pluck("id");
            
            this.index = _.indexOf( ids, this.options.start);
            this.inFocus = this.collection.at(this.index);

            if(!_.isUndefined(this.inFocus.get('text'))) this.inFocus.unset('text');
            this.updateArrows();
            this.initEvents();
        },

        initEvents : function()
        {
            var _this = this;
            
            $("body").keyup(function(e){
                _this.onKeypress(e);
            });
        },
        endEvents : function()
        {
            $("body").unbind("keyup");
        },
        
        switchItem : function()
        {
            this.inFocus = this.collection.at(this.index);
            if(!_.isUndefined(this.inFocus.get('text'))) this.inFocus.unset('text');

            this.renderItemView();
            this.inFocus.trigger("after_render");
            this.updateArrows();
        },

        render : function()
        {
            this.$el.html( _.template(this.getTemplate(), this.inFocus.attributes ) );
            
            return this;
        },
        
        renderItemView : function()
        {
            var itemView = new Items.Views.ViewerContent({model:this.inFocus,state:this.state});
            
            if(this.inFocus.get("editable")){
                $("#item-delete").show();
            } else {
                $("#item-delete").hide();
            }
            this.$el.find(".inner-content").html( itemView.render().el );
            if(this.state == "more" && itemView.mapView.isGeoLocated ) itemView.mapView.renderMap();
            this.inFocus.trigger("after_render");
        },

        events : {
            "click .close" : "closeViewer",
            "click .go-left" : "goLeft",
            "click .go-right" : "goRight",
            "click #detail-toggle" : "toggleDetail",
            "click #item-delete": "deleteItem",
            "click .add-to-frame": "addToFrame"
        },

        addToFrame : function(){

            
            $('.primary-close').trigger('click');
            zeega.app.currentFrame.addItemLayer( this.inFocus );
            zeega.app.currentFrame.trigger('layer_added');
        },
        
        toggleDetail : function()
        {
            var toggle = this.$el.find("#detail-toggle");
            
            if(toggle.hasClass("less-detail")){
                //switch to more detail
                this.inFocus.trigger("toggle_detail", "more");
                this.state = "more";
                toggle.removeClass("less-detail").addClass("more-detail").html("<i class='icon-minus-sign'></i> Less Detail");
                this.$el.find(".inner-content").removeClass("less-view").addClass("more-view");
            } else {
                //switch to less detail
                this.inFocus.trigger("toggle_detail", "less");
                this.state = "less";
                toggle.addClass("less-detail").removeClass("more-detail").html("<i class='icon-plus-sign'></i> More Detail");
                this.$el.find(".inner-content").addClass("less-view").removeClass("more-view");
            }
            return false;
        },
        
        onKeypress : function(e)
        {
            if($(document.activeElement).attr("contenteditable")){
                
            }
            else{
                switch(e.which)
                {
                    case 27:
                        this.closeViewer();
                        break;
                    case 37:
                        this.goLeft();
                        break;
                    case 39:
                        this.goRight();
                        break;
                    default:
                        break;
                }
            }
        },
        
        goLeft : function()
        {
            if(this.index > 0)
            {
                this.index--;
                this.switchItem();
            }
            return false;
        },
        goRight : function()
        {
            if(this.index < this.collection.length-1 )
            {
                this.index++;
                this.switchItem();
            }
            return false;
        },
        
        deleteItem : function()
        {
            if(confirm("delete this item?")){
                var _this=this;
                var deleteURL = sessionStorage.getItem("hostname")+sessionStorage.getItem("directory") + "api/items/" + this.inFocus.id;
    
                //DESTROYYYYYYYY
                this.inFocus.destroy({
                                    url : deleteURL,
                                    success: function(model, response)
                                    {
                                        console.log("Deleted item " + _this.inFocus.id);
                                        console.log(_this.index);
                                        if(_this.index < _this.collection.length )
                                        {
                                            _this.switchItem();
                                        }
                                        else if(_this.index>1){
                                            _this.index--;
                                            _this.switchItem();
                                        }
                                        else{
                                            _this.closeViewer();
                                        }


                                        //_this.goRight();
                                    },
                                    error: function(model, response)
                                    {
                                        console.log("Error deleting item " +  _this.inFocus.id);
                                        console.log(response);
                                    }
                                });
            }
            return false;
        },
        
        updateArrows : function()
        {
            if(this.index === 0) this.$el.find(".arrow-left").fadeOut();
            else if(this.index == this.collection.length-1) this.$el.find(".arrow-right").fadeOut();
            else
            {
                if(this.$el.find(".arrow-right").is(":hidden")) this.$el.find(".arrow-right").fadeIn();
                if(this.$el.find(".arrow-left").is(":hidden")) this.$el.find(".arrow-left").fadeIn();
            }
            return false;
        },
        
        closeViewer : function()
        {
            var _this = this;
            this.endEvents();
            
            // do other cleanup stuff first?
            this.$el.fadeOut("fast",function(){_this.remove();});
            return false;
        },

        getTemplate : function()
        {
            var html = "<div class='container'>"+
                    "<div class='row'>"+
                        "<div class='span1 go-left'><a href='#'><div class='arrow arrow-left'></div></a></div>"+
                        "<div class='span10 item-viewer-content'>"+
                             "<a class='add-to-frame' href='#'>add to frame</a>"+
                            "<a class='close primary-close' href='#'>&times;</a>"+

                            "<div class='inner-content more-view'></div>"+

                            "<a href='#'' id='detail-toggle' class='more-detail'><i class='icon-minus-sign'></i> Less Detail</a>"+
                            "<a href='#' id='item-delete'>Delete</a>"+
                        "</div>"+
                        "<div class='span1 go-right'><a href='#'><div class='arrow arrow-right'></div></a></div>"+
                    "</div>"+
                "</div>";

            return html;
        }
    });

    Items.Views.ViewerContent = Backbone.View.extend({
        
        className : "viewer-item",
        
        editing : false,
        isEditable : false,
        
        initialize : function()
        {
            this.isEditable = this.model.get("editable");
            this.model.on("toggle_detail", this.toggleDetail, this);
        },
        
        render : function()
        {
            var opts = {};
            if(this.options.state == "less")
            {
                opts = {
                    mediaSpan : "span10",
                    moreClass : "hide",
                    lessClass : ""
                };
            }
            else
            {
                opts = {
                    mediaSpan : "span4",
                    moreClass : "",
                    lessClass : "hide"
                };
            }
            
            this.$el.html( _.template(this.getTemplate(), _.extend(this.model.attributes,opts)) );
            
            // draw media view
            

            var itemClass = (this.model.get("archive") == "Youtube" || this.model.get("archive") == "Soundcloud") ? this.model.get("archive") :  this.model.get("media_type");
            itemClass=itemClass[0].toUpperCase() + itemClass.slice(1);
            var mediaView;
            if( Items.Views.Viewer[itemClass] ) mediaView = new Items.Views.Viewer[itemClass]({model:this.model});
            else mediaView = new Items.Views.Viewer.Default({model:this.model});
            
            console.log("Media Viewer::",mediaView, itemClass);

            this.$el.find("#item-media-target .padded-content").html( mediaView.render().el );
            
            //draw map view
            this.mapView = new Items.Views.Common.LeafletMap({model:this.model});
            this.$el.find(".item-map").html( this.mapView.render().el );
            
            //draw tags view
            this.tagsView = new Items.Views.Common.TagDisplay({model:this.model});
            this.$el.find(".item-tags").html( this.tagsView.render().el );
            
              
           
            
            return this;
        },
        
        toggleDetail : function(state)
        {
            if(this.editing === true) this.cancelItemEdit();
            if(state == "more")
            {
                this.$el.find("#item-media-target").removeClass("span10").addClass("span4");
                this.$el.find(".more-info").show();
                this.$el.find(".less-info").hide();
                
                if( this.mapView.isGeoLocated && !this.mapView.isMapRendered ) this.mapView.renderMap();
            }
            else
            {
                this.$el.find("#item-media-target").addClass("span10").removeClass("span4");
                this.$el.find(".more-info").hide();
                this.$el.find(".less-info").show();
            }
            return false;
        },
        
        events : {
            "click .edit-item-metadata" : "editItemMetadata",
            "click .save-item-metadata" : "saveItemMetadata",
            "click .cancel-item-metadata" : "cancelItemEdit",
            "click .published":"publish",
            "click .unpublished":"unpublish"
        },
        
        editItemMetadata : function(e)
        {
            var contentEditable,
				range;

            $("#item-delete").hide();
            this.editing = true;
            this.$el.find(".viewer-item-title .inner, .item-description-text").attr("contenteditable",true).addClass("editing-field");
            this.$el.find(".edit-item-metadata").hide();
            this.$el.find(".save-item-metadata, .cancel-item-metadata").show();
            
            this.tagsView.enterEditMode();
			contentEditable = $(e.target).parent().parent().parent().find(".editing-field");
			range = document.createRange();
			contentEditable.focus();
			range.selectNodeContents(contentEditable[0]);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
        
            return false;
        },
        
        saveItemMetadata : function()
        {
            this.exitEditMode();
            // the save the model

            this.model.save({
                description: this.$el.find(".item-description-text").text(),
                title: this.$el.find(".viewer-item-title .inner").text()
            });
            
            
            return false;
        },
        
        exitEditMode : function()
        {
            $("#item-delete").show();
            this.$el.find(".viewer-item-title .inner, .item-description-text").attr("contenteditable",false).removeClass("editing-field");
            this.$el.find(".edit-item-metadata").show();
            this.$el.find(".save-item-metadata, .cancel-item-metadata").hide();
            
            //this.tagsView.exitEditMode();
            
        },

        publish: function(){
            console.log("publishing");
            if(this.model.get("published")!=2) this.model.save({"published":2});
            this.$el.find(".published").addClass("selected");
            this.$el.find(".unpublished").removeClass("selected");

        },
        unpublish:function(){
            console.log("unpublishing");
            if( this.model.get("published")!==1 ){
                this.model.save({"published": 1});
            }
                
            this.$el.find(".unpublished").addClass("selected");
            this.$el.find(".published").removeClass("selected");
        },
        cancelItemEdit : function()
        {
            this.editing = false;
            this.exitEditMode();
            this.$el.find(".item-description-text").text(this.model.get("description"));
            this.$el.find(".viewer-item-title .inner").text(this.model.get("title"));
        },
        
        getTemplate : function()
        {
            html ="<h2 class='viewer-item-title'>"+
                    "<span class='inner'><%= title %></span>";
            if(this.isEditable) {
                html+= "<span><a href='#' id='edit-description' class='edit-item-metadata <%= moreClass %> more-info'><i class='icon-pencil'></i></a></span>";
            }
            html+= "</h2>";
           
            html+="<div class='row'>"+
                    
                    "<div class='<%= mediaSpan %>'' id='item-media-target'>"+
                        "<div class='padded-content' id='item-media-<%= id %>'></div>"+ //media goes here
                    "</div>"+
                    
                    "<div class='span6 <%= moreClass %> more-info'>"+
                        "<div class='padded-content item-map'>"+
                            "media map goes here"+
                        "</div>"+
                    "</div>"+
                    
                "</div>"+
                "<div class='row <%= moreClass %> more-info'>"+
                    "<div class='span4'>"+
                        "<div class='padded-content clearfix'>"+
                            "<div><strong>Created By:</strong> <%= media_creator_realname %></div>"+
                            "<div><strong>Created On:</strong> <%= date_created.date %></div>"+
                            "<div><a href='<%= attribution_uri %>'' target='blank'>View Source <i class='icon-share'></i></a></div>";

             if(this.isEditable) {
                html+=  "<div class='access-level'>"+
                            "<strong>Access: </strong>";
                            
                if(this.model.get("published")==2){
                    html+= "<span class='unpublished'>Just Me</span><span class='published selected'>The Universe</span>";
                } else {
                    html+= "<span class='unpublished selected'>Just Me</span><span class='published'>The Universe</span>";
                }

                html+= "</div>";
            }

            html+=              "<div>"+
                                "<div><strong>Tags:</strong></div>"+
                                "<div class='item-tags'></div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                    "<div class='span6'>"+
                        "<div class='padded-content'>"+
                            "<div><strong>Description:</strong>";
                if(this.isEditable) {
                    html+= " <a href='#'' id='edit-description' class='edit-item-metadata'><i class='icon-pencil'></i></a>";
                }

                html+=  "</div>"+
                            "<div class='item-description-text'><%= description %></div>"+
                            "<button class='btn btn-mini pull-right hide cancel-item-metadata'>Cancel</button>"+
                            "<button class='btn btn-success btn-mini pull-right hide save-item-metadata'>Save Changes</button>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
                
                "<div class='less-footer item-viewer-footer <%= lessClass %>'>"+
                    "<div class='details less-info'><%= media_creator_realname %> -- <a href='<%= attribution_uri %>' target='blank'>View Source <i class='icon-share'></i></a></div>"+
                "</div>";
                
            return html;
        }
    });
    
    
    //////////////////////////// item types
    
    
    Items.Views.Viewer.Default = Backbone.View.extend({
        
        className : "default-preview",
        render : function()
        {
            this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
            return this;
        },
        
        getTemplate : function()
        {
            html = "<img src='<%= thumbnail_url %>' style='max-width: 100%;max-height: 100%;'/>";
            return html;
        }
    });
    
    Items.Views.Viewer.Image = Backbone.View.extend({
        
        render : function()
        {
            this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
            return this;
        },
        
        getTemplate : function()
        {
            html = "<img src='<%= uri %>' style='max-width: 100%;max-height: 100%;'/>";
            return html;
        }

    });

    Items.Views.Viewer.Project = Backbone.View.extend({
        
        render : function()
        {
            this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
            return this;
        },
        
        getTemplate : function()
        {
            html = "<div id='zeega-embed' style='height:200px; background:url(<%= thumbnail_url %>) no-repeat center center;background-size:cover'>"+
                    "<a class='zeega-link' target='_blank' href='//alpha.zeega.org/<%= id %>/view' ><img class='pull-left' style='padding-top: 35%; padding-left: 37%;width:60px;position:relative;z-index:2' src='//alpha.zeega.org/images/embed_play.png'></a>"+
                    "</div>";
            console.log(zeega);
            return html;
        }

    });



    Items.Views.Viewer.Flickr = Items.Views.Viewer.Image.extend();
    
    Items.Views.Viewer.Youtube = Backbone.View.extend({
        
        render : function()
        {
            this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
            return this;
        },
        
        getTemplate : function()
        {
            html = "<iframe class='youtube-player' type='text/html' width='100%' height='100%'' src='http://www.youtube.com/embed/<%=uri%>' frameborder='0'></iframe>";
            return html;
        }

    });
    
    Items.Views.Viewer.Vimeo = Backbone.View.extend({
    
        render : function()
        {
            this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
            return this;
        },

        getTemplate : function()
        {
            html = "<iframe src='http://player.vimeo.com/video/<%= uri %>' width='100%' height='100%' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>";
            return html;
        }
        
    
    });

    Items.Views.Viewer.SoundCloud = Backbone.View.extend({
        
        render : function()
        {
            this.model.set("soundcloud_url", this.model.get("uri").replace( /\/stream(.*)/ ,"" ));
            this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
            return this;
        },

        getTemplate : function()
        {
            html = "<iframe width='100%' height='166' scrolling='no' frameborder='no' src='http://w.soundcloud.com/player/?url=<%= soundcloud_url %>&show_artwork=true'></iframe>";
            return html;
        }
    });
    
    Items.Views.Viewer.Video = Backbone.View.extend({
        
        initialize : function()
        {
            this.model.on("after_render", this.afterRender,this);
        },

        render : function()
        {
            this.$el.html( _.template( this.getTemplate(), this.model.attributes) );
            return this;
        },
        
        //happens after the view is rendered. so we know when the player is in the dom
        afterRender : function()
        {
            if(this.isRendered===true){}
            else
            {
                this.$el.empty();
                var Player = zeega.module("player");
                
                this.player = new Player.Views.Player({
                    model:this.model,
                    control_mode : "standard",
                    media_target : null
                });
                this.$el.html(this.player.render().el);
                this.player.placePlayer();
                
                console.log("player",this.player);
                
                this.isRendered = true;
            }
        },
        
        getTemplate : function()
        {
            html = this.model.get("title");
            return html;
        }
    });

    Items.Views.Viewer.Audio = Items.Views.Viewer.Video.extend();
    Items.Views.Viewer.Audio = Items.Views.Viewer.Video.extend();
    
})(zeega.module("items"));



