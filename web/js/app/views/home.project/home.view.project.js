(function(Home) {

	Home.Projects = Home.Projects || {};
	
	Home.Projects.Model = Backbone.Model.extend({});
	

	Home.Projects.Collection = Backbone.Collection.extend({
		initialize: function(options){
			this.id=options.id;
		},
		url: function(){
			return sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/items/" +this.id;
		},
		parse: function(resp){
			this.title=resp.items[0].title;
			return resp.items[0].child_items;
		}

	});


	Home.Projects.View = Backbone.View.extend({
		
		className : 'project-card span7',
		events: {
			'click':'openProject'
		},

		openProject:function(){
			if(!_.isUndefined(window._gaq))  _gaq.push(['_trackEvent', 'Home-Project', 'Play']);
			
			window.open(sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + this.model.get('id'),'_blank');
		},
		render: function(done)
		{
			$(this.el).html( _.template( this.getTemplate(), this.model.attributes ) );
			return this;
		},
		getTemplate : function()
		{
			var html =
						'<div class="row" style="cursor:pointer;">'+
							'<div id="zeega-embed" class="span7 project-image" style="background:url(<%= thumbnail_url %>) no-repeat center center;background-size:cover">'+
								'<a class="zeega-link">'+
									'<img class="pull-left" style="width:60px;position:relative;z-index:2" src="'+sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'images/embed_play.png">'+
								'</a>'+
								'<div style="padding:10px 0 0 10px;margin-top:126px;height:30px;background-color:rgba(0,0,0,0.3);">'+
									'<div class="pull-left" style="margin-right:20px">'+
										'<h4><%= title %></h4>'+
									'</div>'+
								'</div>'+
								'<div class="gradient" style="top:-166px;"></div>'+
								'<div id="embed-wrapper"></div>'+
							'</div>'+
						'</div>';
					
			return html;
		}
	});

	


})(zeega.home.module("home"));