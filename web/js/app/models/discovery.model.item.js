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
            var url = zeega.discovery.app.apiLocation + "api/items/"+this.id;
            return url;
        }
    });

})(zeega.module("items"));