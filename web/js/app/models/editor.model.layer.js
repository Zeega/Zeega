(function(Layer){

	Layer.Model = Backbone.Model.extend({

		url : function(){ return Zeega.url_prefix + "layers/" + this.id },
	
		defaults : {
			'attr' : {},
			'visibleineditor' : true
		},
	
		layerClass :{},
	
		initialize: function(){
		
			eval( 'this.layerClass = new '+ this.get("type")+'Layer()' );
			this.layerClass.load(this);
		
			if(!this.get('attr')) this.set({'attr':{}}); //this should be covered by defaults
		
		},
	
		show : function()
		{
			console.log('layer: '+this.id+ " showing")
		},
	
		validate : function(attrs)
		{
			//remove formatting from titles (esp important for text layer!)
			if(attrs.title) attrs.title = attrs.title.replace(/(<([^>]+)>)/ig, "");
		}
	

	});
	
})(zeega.module("layer"));