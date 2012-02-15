(function(Layer){

	Layer.ViewCollection = Backbone.View.extend({
		initialize : function()
		{
			this.displayLayers = new Layer.Collection();
			this.layerList = new Layer.LayerListViewCollection({collection:this.displayLayers});
			this.visualEditor = new Layer.ViewCollection.VisualEditor({collection:this.displayLayers});
		}
	});
	
	Layer.LayerListViewCollection = Backbone.View.extend({
		
		el : $('#layers-list-visual'),
		
		initialize : function()
		{
			this._layerViews = []
			this.render();
		},

		render : function()
		{
			var _this = this;
			this._rendered = true;
		
			//clear out any old stuff inside this.el
			this.$el.empty();
			//add EACH model's view to the _this.el and render it
			_.each( _.toArray( this.collection ), function( layerModel ){
				var layerView = new Layer.Views.LayerList({model:layerModel});
				_this._layerViews.push( layerView );
				_this.$el.append( layerView.render().el );
			});

			return this;
		}
		
	});
	
	Layer.ViewCollection.VisualEditor = Backbone.View.extend({
		
		el : $('#visual-editor-workspace'),
		
		initialize : function()
		{
			this._layerViews = [];
			this.render();
		},

		render : function()
		{
			var _this = this;
			this._rendered = true;
		
			//clear out any old stuff inside this.el
			this.$el.empty();
			//add EACH model's view to the _this.el and render it
			_.each( _.toArray( this.collection ), function( layerModel ){
				var layerView = new Layer.Views.LayerList({model:layerModel});
				_this._layerViews.push( layerView );
				_this.$el.append( layerView.render().el );
			});
		
			return this;
		}
		
	});
		
	Layer.Collection = Backbone.Collection.extend({
		model : Layer.Model
		//url : function(){ return Zeega.url_prefix+"sequences/"+ Zeega.sequence.id +"/layers" }
	});

})(zeega.module("layer"));

