(function(Dashboard) {

    Dashboard.Users = Dashboard.Users || {};
    Dashboard.Users.Views = Dashboard.Users || {};
    
    Dashboard.Users.Views.ProfilePage = Backbone.View.extend({
        
        el : $("#dashboard-profile"),
        
        
        events: {
            
            "click a.edit" : "editMetadata",
            "click button.save" : "saveMetadata",
            "click button.cancel" : "cancelEdits",
            "user-new-project":"newProject"
        },
        
        initialize: function () {

            


        },
        render: function(done)
        {
            var _this = this;

            /***************************************************************************
                BG image with one in user profile
            ***************************************************************************/
            if (!_.isUndefined(this.model.get("background_image_url")) && this.model.get("background_image_url") !=="" ){
                $("html").css("background-image", "url("+ this.model.get("background_image_url")+")");
            } else{
                $("html").css("background-image", "url(http://farm5.staticflickr.com/4096/4827587717_c362a1b42e_b.jpg)");
            }

            /***************************************************************************
                Put template together
            ***************************************************************************/
            var template = this.getTemplate();
            var blanks = this.model.attributes;

            var joinDate=new Date(blanks["created_at"]);
            
            blanks["join_date"] = joinDate.getMonthAbbreviation() + " " + joinDate.getFullYear();
            
            blanks["num_projects"] = blanks["projects"].length;
            
            if(blanks["num_projects"] == 1)
                blanks["num_projects"] = blanks["num_projects"] + " project";
            else
                blanks["num_projects"] = blanks["num_projects"] + " projects";
            
            //Should be fixed in database
            if(_.isUndefined(blanks["thumbnail_url"])||_.isNull(blanks["thumbnail_url"])||blanks["thumbnail_url"]==="")blanks["thumbnail_url"]="../images/vertov.jpeg";
            
            
            
            $(this.el).html( _.template( template, blanks ) );

            
            
            $("#user-image-upload-file, #user-image-upload-background").change(function(){
                
                _this.fileUpload($(this).attr("id"));

                
            });
            

            return this;
        },
        saveMetadata : function()
        {
            this.turnOffEditMode();
            this.saveFields();
            
        },
        
        saveFields : function()
        {
            $(this.el).find(".dashboard-bio").text($(this.el).find(".dashboard-bio").text().substring(0,250));
            var backgroundImageURL = $("html").css("background-image").replace("url(","").replace(")","");
            this.model.save({
                
                "display_name" : $(this.el).find(".dashboard-name").text(),
                "bio" : $(this.el).find(".dashboard-bio").text().substring(0,250),
                "thumbnail_url" : $(this.el).find(".dashboard-profile-photo").attr("src"),
                "background_image_url" : backgroundImageURL
                 
                
            });
        },
        newProject : function(){
            $(".new-project").trigger("click");
        
        },
        cancelEdits : function()
        {
            this.render();
            this.turnOffEditMode();
        },
        
        turnOffEditMode : function()
        {
            this.$el.find(".user-image-upload , .save-data button").hide();
            this.$el.find(".edit").show();

            $(this.el).find("button.edit").removeClass("active");
            $(this.el).find(".editing").removeClass("editing").attr("contenteditable", false);
            
            
        },
        editMetadata : function()
        {
            
            var _this  = this;
            
            this.$el.find(".user-image-upload, .save-data button").show();
            this.$el.find(".edit").hide();
            
            $(this.el).find("button.edit").addClass("active");
            $(this.el).find(".dashboard-bio, .dashboard-name").addClass("editing").attr("contenteditable", true);
            
            
            
            return false;
        },
        
        fileUpload : function(elementIDName)
        {
            /*
                    prepareing ajax file upload
                    url: the url of script file handling the uploaded files
                    fileElementId: the file type of input element id and it will be the index of  $_FILES Array()
                    dataType: it support json, xml
                    secureuri:use secure protocol
                    success: call back function when the ajax complete
                    error: callback function when the ajax failed
            */
            var _this = this;

            if (elementIDName == "user-image-upload-file"){
                $(".dashboard-profile-photo").fadeTo(500,0.5);
                $(".profile-image-wrapper").spin("tiny");
            }
            jQuery.handleError=function(a,b,c,d)
            {
                console.log("ERROR UPLOADING",a,b,c,d);
                if (elementIDName == "user-image-upload-file"){
                    $(".dashboard-profile-photo").fadeTo(500,1);
                    $(".profile-image-wrapper").spin(false);
                }
                    $("#unsupported-file").modal("show");

                $("#" + elementIDName).change(function(){
                    
                    _this.fileUpload(elementIDName);
                });

            };
            // var phpFileURL = elementIDName == "user-image-upload-file" ?
            // sessionStorage.getItem("hostname")+"static/scripts/user_profile.php?id="+this.model.id :
            // sessionStorage.getItem("hostname")+"static/scripts/user_bg.php?id="+this.model.id;
            
            var phpFileURL = elementIDName == "user-image-upload-file" ?
                sessionStorage.getItem("hostname")+"kinok/image?sizes=46":
                sessionStorage.getItem("hostname")+"kinok/image?sizes=7";

            


            console.log(phpFileURL);
            $.ajaxFileUpload({

            url:phpFileURL,
                secureuri:false,
                fileElementId:elementIDName,
                dataType: "json",
                success: function (data, status)
                {
                    var imageUrl;

                    if(typeof(data.error) != "undefined")
                    {
                            console.log("ERROR",data);
                    }
                    else
                    {
                        //TODO get model & update thumbnail_url property
                        


                        if (elementIDName == "user-image-upload-file"){
                            if(!_.isUndefined(data.image_url_0)){
                                imageUrl = data.image_url_0;
                            } else {
                                imageUrl = data.image_url_6;
                            }

                            $(".dashboard-profile-photo")
                                .attr("src", imageUrl)
                                .fadeTo(500,1);
                            $(".profile-image-wrapper").spin(false);
                        }else{

                            if(!_.isUndefined(data.image_url_0)){
                                imageUrl = data.image_url_0;
                            } else {
                                imageUrl = data.image_url_7;
                            }
                            
                            $("html").css("background-image", "url("+ imageUrl +")");
                            
                            
                        }
                        
                        $("#" + elementIDName).change(function(){
                            
                            _this.fileUpload(elementIDName);
                        });
                        
                    }
    
                },
                handleError: function (data, status, e)
                {
                    console.log("ERROR!!",e);
                        $("#unsupported-file").modal("show");
                
                }
            });
            
            return false;

        },
        
        
        
        getTemplate : function()
        {
            var html = "<div class='span3 author-photo dashboard-photo'>"+
                        "<div class='profile-image-wrapper'>"+
                            "<img src='<%= thumbnail_url %>' alt='author-photo' width='100%' height='100%' class='dashboard-profile-photo'>"+
                        "</div>"+
                        "<div class='gradient' style='height:0px'>"+
                        "</div>"+
                    
                    "</div>"+
                    
                    "<div class='span8 author-bio' style='height:auto'>"+
                    
                        "<div>"+
                            
                            "<h3 class='dashboard-name' style='width:300px'><%= display_name%></h3>";
                            if (zeega.dashboard.app.editable){ html+=
                            "<div style='position:relative'>"+
                                "<a class='btn btn-mini btn-inverse edit community-edit-button' href='.' style='top:-41px;left:300px'><i class='icon-pencil icon-white'></i> edit</a>"+
                                "<div class='btn-group save-data' style='position:absolute;top:-41px;left:300px'>"+
                                        "<button class='btn btn-inverse btn-mini save hide' style='margin-top: 10px;margin-left:8px'>save</button>"+
                                        "<button class='btn btn-mini cancel hide' style='margin-top: 10px'>cancel</button>"+
                                "</div>"+
                            "</div>";
                            }

                            html+=
                            "<h6 style='clear:both; color:#DDD;'>Authored <%= num_projects %> since joining in <%= join_date %></h6>"+
                            "<div style='margin-bottom:20px'>"+
                                "<p class='card dashboard-bio'><%= bio %></p>";
                                if (zeega.dashboard.app.editable){ html+=
                                "<div class='user-image-upload card hide'><label class='control-label' for='user-image-upload-file' style='display:inline'>Update your profile picture</label><input id='user-image-upload-file' type='file' size='40' name='imagefile' class='pull-right'></input></div>"+
                                "<div class='user-image-upload card hide'  style='clear:both'><label style='display:inline' class='control-label' for='user-image-upload-background'>Update your background picture</label> <input id='user-image-upload-background' type='file' size='40' name='imagefile'  class='pull-right'></input></div>";
                                }
                                
                            html+=
                            "</div>"+
                        "</div>"+
                        "<div class='shadow' style='height:162px'>"+
                        "</div>"+
                    
                    "</div>"+
                    "<div class='span3'>";
                        if (zeega.dashboard.app.editable){ html+=
                        "<a class='btn btn-info pull-right user-new-project' href='"+$(".new-project").attr("href")+"'>Create a New Zeega</a>";
                        }
            html+="</div>";
            
            return html;
        }
        

    });

})(zeega.dashboard.module("dashboard"));