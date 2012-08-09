


this.zeegaDashboard = {
	// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an existing module.
		return function(name) 
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];

			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({

	init : function()
	{
	
	
	
	
		var HomeDeck = Backbone.View.extend({
			tagName : 'div',

			render : function()
			{
				var _this=this;
				_.each(homeCards,function(card){
					console.log(card);
					console.log(_.template(_this.getTemplate(), card ));
					_this.$el.append( _.template(_this.getTemplate(), card ) );
				});
				return this;
			},
			
			getTemplate : function()
			{
				var html = 
					'<div class="section-divider">'+
						'<div class="shadow"></div>'+
							'<div class="content">'+
								'<div class="container">'+
									'<div class="row">'+
										'<div class="span8 offset3">'+
											'<h2><%= seperator %></h2>'+
										'</div>'+
										'<div class="span3"></div>'+
									'</div>'+
								'</div>'+
							'<div class="arrow-down"><div class="striped-arrow"></div></div>'+
						'</div>'+
					'</div>'+
	
						'<div class="special-project" style="background: url(<%= url %>) no-repeat center center fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;">'+
							'<div class="special-gradient">'+
								'<div class="container">'+
									'<div class="row">'+
										'<div class="span10">'+
											'<div class="valign">'+
												'<div class="valign-content">'+
													'<h1><%= title %></h1>'+
													'<h2><%= subtitle %></h2>'+
												'</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
	
				return html;
			}
		});
		
		
		this.homeDeck = new HomeDeck();
		$('#home-cards').append(this.homeDeck.render().el);
		
		
		
		/*
		var Dashboard = zeegaDashboard.module("dashboard");
		
		this.editable = false;

		
		var projects = new Dashboard.Project.Collection();
		var items =$.parseJSON(projectsJSON).items[0].child_items;
		
		_.each(items,function(item){
			console.log(item);
			var project = new Dashboard.Project.Model($.parseJSON(item.text).project);
			projects.add(project);
		});
		
		console.log(Dashboard);
		this.projectsView = new Dashboard.ProjectCollectionView({collection:projects}).render();
		*/
		
		
	},
	
	
		
	

	}, Backbone.Events)


};