(function(Items) {

    Items.Model = Backbone.Model.extend({

        type:"item",

        defaults : {
            "published" : false
        },
        initialize : function()
        {
        },

        parse : function(response)
        {
            if(response.items){
                return response.items[0];
            } else {
                return response;
            }
        },
        url : function(){
            var url;

            if(_.isUndefined(this.id)){
                if(this.get("media_type") == "project"){
                    url = zeega.discovery.app.apiLocation + "api/projects";
                } else {
                    url = zeega.discovery.app.apiLocation + "api/items";
                }
                
            } else {
                if(this.get("media_type") == "project"){
                    url = zeega.discovery.app.apiLocation + "api/projects/" + this.id;
                } else {
                    url = zeega.discovery.app.apiLocation + "api/items/" + this.id;
                }
            }

            return url;
        }
    });

})(zeega.module("items"));