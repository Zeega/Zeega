(function(Dashboard) {

	Dashboard.ProjectCollectionView = Backbone.View.extend({

		el : $('#zeega-user-projects'),

		initialize : function()
		{
			
			this._childViews = [];
			
			$(this.el).spin('small');
		},
		
		render : function()
		{
			
			var _this = this;
			this._isRendered = true;
			
			if(this.collection.length)
			{
				_.each( _.toArray(this.collection), function(projectModel){
					
					var projectView = new Dashboard.Projects.Views.Project({ model : projectModel });
					_this._childViews.push( projectView );
					$(_this.el).append( projectView.render().el );
				})
			}
			
			$(this.el).fadeTo(100,1);
			$(this.el).spin(false);
			
			return this;
		},
		
		reset : function()
		{
			if ( this._isRendered )
			{
				$(this.el).empty();
				this._childViews = [];
				this.render();
			}
			else this.render();
		},

	});

	Dashboard.Project.Collection = Backbone.Collection.extend({

		model : Dashboard.Project.Model,

		initialize : function()
		{
			
		},
		
		url : function(){ //return this.search.getUrl() 
		},
		

	});


})(zeegaDashboard.module("dashboard"));
